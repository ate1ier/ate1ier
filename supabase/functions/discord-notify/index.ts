// supabase/functions/discord-notify/index.ts
//
// 상담 일정 / 할일 알림을 디스코드로 보내주는 함수예요.
// pg_cron이 주기적으로(추천: 5분마다) 이 함수를 호출하면, kv_store에 저장된
// 캘린더(personal-calendar:YYYY-MM)와 할일(personal-calendar:todos) 데이터를 훑어서
// - 시간이 정해진 일정 → 시작 30분 전에 개별 카드로 한 번 더
// - 그 외 모든 일정·메모·할일(시간 유무 상관없이) → 그날 오전 9시에 한 번씩 묶어서
// 에 해당하는 항목을 찾아 디스코드 웹훅으로 "임베드(카드)" 형태로 전송해요.
// 한 번 보낸 항목은 notify_log에 기록해서 다시 보내지 않아요.
// ※ 어떤 계정의 알림을 보낼지는 더 이상 코드에 고정되어 있지 않아요. 마스터 계정으로
//   로그인해서 "마스터 계정 관리 → 디스코드 알림" 탭에서 계정별로 허용/제한 토글을
//   켜고 끄면, 그 설정(kv_store의 personal-app:discord-notify-settings 키)을 이 함수가
//   그대로 읽어서 "허용"으로 켜둔 계정들에게만 알림을 보내요. 기본값은 전부 제한이고,
//   허용된 계정이 하나도 없으면 이 함수는 아무것도 보내지 않아요.
//
// ----- 배포 방법 -----
//   1) supabase/discord-notify-setup.sql 을 Supabase 대시보드 SQL Editor에서 먼저 실행 (notify_log 테이블 생성, 최초 1회만)
//   2) 디스코드 채널 설정 → 연동 → 웹후크 → 새 웹후크 만들기 → URL 복사
//   3) 그 URL을 서버 비밀값으로 등록 (최초 1회만, 이후 바뀌면 다시)
//        supabase secrets set DISCORD_WEBHOOK_URL=여기에_웹훅_URL
//   4) 함수 배포 (코드를 바꿀 때마다 다시 실행)
//        supabase functions deploy discord-notify --no-verify-jwt
//   5) supabase/discord-notify-setup.sql 안내대로 pg_cron 예약 (최초 1회만, 대시보드 Integrations → Cron 추천)
//
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY는 Edge Function 실행 환경에 자동으로 들어있어서
// 따로 secrets set 할 필요 없어요. DISCORD_WEBHOOK_URL만 등록하면 됩니다.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const DISCORD_WEBHOOK_URL = Deno.env.get("DISCORD_WEBHOOK_URL") || "";

// 이번 실행에서 "지금 보내야 할 때"로 볼 시간 폭.
// LOOKAHEAD: 다음 실행 전까지 약간의 여유를 두고 미리 잡아준다 (cron 주기보다 넉넉하게).
// STALE_CUTOFF: 이보다 더 예전에 지나간 알림은 무시한다 (오래 멈춰 있다 복구됐을 때 과거 알림이 한꺼번에 쏟아지는 걸 방지).
const LOOKAHEAD_MIN = 6;
const STALE_CUTOFF_MIN = 180;
// 시간이 정해진 일정의 발송 기준은 실제로 30분 전.
const ACTUAL_LEAD_MIN = 30;

// 임베드 색상 (디스코드는 10진수 정수로 받음)
const COLOR_TIMED = 0xe67e22; // 시간 있는 일정 — 주황
const COLOR_DATE_ONLY = 0x3498db; // 날짜만 있는 일정/할일 — 파랑

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// 서버는 UTC로 돌지만 저장된 날짜·시간은 전부 한국 시각 기준이에요. 한국은 서머타임이
// 없어서 그냥 "UTC 값에 9시간을 더한 걸 한국 시각의 필드값처럼 쓰는" 방식으로 통일하면
// (실제 시간대 변환 없이) 두 값을 그냥 크기 비교만 해도 정확히 맞아떨어져요.
function nowAsKstFields(): Date {
  return new Date(Date.now() + 9 * 60 * 60 * 1000);
}
function kstDateTime(iso: string, hhmm: string): Date {
  const [y, m, d] = (iso || "").split("-").map(Number);
  const [hh, mm] = (hhmm || "").split(":").map(Number);
  return new Date(Date.UTC(y || 1970, (m || 1) - 1, d || 1, hh || 0, mm || 0));
}

function safeParse<T>(raw: unknown, fallback: T): T {
  if (typeof raw !== "string") return fallback;
  try {
    const v = JSON.parse(raw);
    return (v ?? fallback) as T;
  } catch (_e) {
    return fallback;
  }
}

type NotifyItem = {
  id: string;
  targetAt: Date;
  accountName: string;
  hasTime: boolean;
  title: string; // 시간 있는 항목(개별 카드)에서만 씀
  description: string;
  bulletLabel: string; // 날짜만 있는 항목을 묶어서 보여줄 때 뒤에 붙는 태그 ("일정"/"메모"/"할일")
};

Deno.serve(async (_req: Request) => {
  if (!DISCORD_WEBHOOK_URL) {
    return new Response(JSON.stringify({ error: "DISCORD_WEBHOOK_URL이 설정되어 있지 않아요. supabase secrets set DISCORD_WEBHOOK_URL=... 을 실행해주세요." }), { status: 500 });
  }

  const now = nowAsKstFields();
  const staleBefore = new Date(now.getTime() - STALE_CUTOFF_MIN * 60 * 1000);
  const dueWindow = new Date(now.getTime() + LOOKAHEAD_MIN * 60 * 1000);

  try {
    // ── 계정 이름 매핑 (카드에 "누구의 일정인지" 표시하려고) ──
    const { data: acctRow } = await supabase
      .from("kv_store").select("value").eq("key", "personal-app:accounts").maybeSingle();
    const accounts = safeParse<Array<{ id: string; username: string }>>(acctRow?.value, []);
    const nameById = new Map(accounts.map((a) => [a.id, a.username]));

    // ── 알림을 허용한 계정들만 골라둔다 (마스터 계정 관리 → 디스코드 알림 탭에서 토글) ──
    const { data: notifySettingsRow } = await supabase
      .from("kv_store").select("value").eq("key", "personal-app:discord-notify-settings").maybeSingle();
    const notifySettings = safeParse<Record<string, boolean>>(notifySettingsRow?.value, {});
    const allowedAccountIds = new Set(
      Object.keys(notifySettings).filter((id) => notifySettings[id] === true)
    );
    if (!allowedAccountIds.size) {
      return new Response(JSON.stringify({ sent: 0, note: "알림이 허용된 계정이 없어요. 마스터 계정 관리 → 디스코드 알림 탭에서 켜주세요." }), { headers: { "Content-Type": "application/json" } });
    }

    // ── 캘린더/할일 데이터가 담긴 kv_store 행만 가져오기 ──
    const { data: rows, error } = await supabase
      .from("kv_store").select("key,value").like("key", "acct:%:personal-calendar:%");
    if (error) throw error;

    const items: NotifyItem[] = [];

    for (const row of rows || []) {
      const key: string = row.key;
      const m = key.match(/^acct:([^:]+):personal-calendar:(.+)$/);
      if (!m) continue;
      const accountId = m[1];
      if (!allowedAccountIds.has(accountId)) continue; // 허용되지 않은 계정은 건너뜀
      const suffix = m[2]; // "todos" 이거나 "YYYY-MM"
      const accountName = nameById.get(accountId) || "알 수 없는 계정";

      if (suffix === "todos") {
        const todos = safeParse<any[]>(row.value, []);
        for (const t of todos) {
          if (!t || t.done || !t.due) continue;
          const target = kstDateTime(t.due, "09:00");
          if (target < staleBefore || target > dueWindow) continue;
          items.push({
            id: `todo:${accountId}:${t.id}`,
            targetAt: target,
            accountName,
            hasTime: false,
            title: "",
            description: t.text || "(내용 없음)",
            bulletLabel: "할일",
          });
        }
      } else {
        // suffix는 "YYYY-MM", value는 { "01": [entry, ...], "02": [...], ... } 형태
        const monthData = safeParse<Record<string, any[]>>(row.value, {});
        for (const dayKey of Object.keys(monthData)) {
          const list = Array.isArray(monthData[dayKey]) ? monthData[dayKey] : [];
          for (const e of list) {
            if (!e || e.done) continue;
            const dateISO = e.rangeStart || `${suffix}-${dayKey}`;
            const hasTime = !!(e.time && String(e.time).trim());
            const typeLabel = e.type === "event" ? "일정" : "메모";
            const text = e.text || "(내용 없음)";

            // 시간 유무와 상관없이, 그날 오전 9시에 한 번은 꼭 알림이 가도록 등록
            const morningTarget = kstDateTime(dateISO, "09:00");
            if (morningTarget >= staleBefore && morningTarget <= dueWindow) {
              items.push({
                id: `cal9:${accountId}:${e.id}`,
                targetAt: morningTarget,
                accountName,
                hasTime: false,
                title: "",
                description: text,
                bulletLabel: typeLabel,
              });
            }

            // 시간이 정해진 일정은 시작 30분 전에 개별 카드로 한 번 더 보내줌
            if (hasTime) {
              const beforeTarget = new Date(kstDateTime(dateISO, e.time).getTime() - ACTUAL_LEAD_MIN * 60 * 1000);
              if (beforeTarget >= staleBefore && beforeTarget <= dueWindow) {
                items.push({
                  id: `calbefore:${accountId}:${e.id}`,
                  targetAt: beforeTarget,
                  accountName,
                  hasTime: true,
                  title: `🔔 ${e.time} ${typeLabel} 30분 전`,
                  description: `${typeLabel} : ${text}`,
                  bulletLabel: typeLabel,
                });
              }
            }
          }
        }
      }
    }

    if (!items.length) {
      return new Response(JSON.stringify({ sent: 0 }), { headers: { "Content-Type": "application/json" } });
    }

    // ── 이미 보낸 건 제외 ──
    const ids = items.map((it) => it.id);
    const { data: already } = await supabase.from("notify_log").select("id").in("id", ids);
    const sentIds = new Set((already || []).map((r: { id: string }) => r.id));
    const toSend = items
      .filter((it) => !sentIds.has(it.id))
      .sort((a, b) => a.targetAt.getTime() - b.targetAt.getTime());

    if (!toSend.length) {
      return new Response(JSON.stringify({ sent: 0 }), { headers: { "Content-Type": "application/json" } });
    }

    // ── 디스코드로 전송 ──
    // 시간이 정해진 일정의 "30분 전" 알림: 개별 카드 하나씩 (정확한 시각을 바로 알아야 하므로 안 묶음)
    // 오전 9시 알림(시간 유무 상관없이 전부): 같은 계정 것끼리 카드 하나로 묶어서 목록으로 보여줌

    const timedEmbeds = toSend
      .filter((it) => it.hasTime)
      .map((it) => ({
        color: COLOR_TIMED,
        author: { name: `👤 ${it.accountName}` },
        title: it.title,
        description: it.description,
      }));

    const dateOnlyByAccount = new Map<string, NotifyItem[]>();
    for (const it of toSend) {
      if (it.hasTime) continue;
      const arr = dateOnlyByAccount.get(it.accountName) || [];
      arr.push(it);
      dateOnlyByAccount.set(it.accountName, arr);
    }
    const dateOnlyEmbeds = Array.from(dateOnlyByAccount.entries()).map(([accountName, arr]) => ({
      color: COLOR_DATE_ONLY,
      author: { name: `👤 ${accountName}` },
      title: `🗓️ 오늘 일정·할일 (${arr.length}개)`,
      description: arr.map((it) => `${it.bulletLabel} : ${it.description}`).join("\n"),
    }));

    const allEmbeds = [...timedEmbeds, ...dateOnlyEmbeds];
    const chunks: (typeof allEmbeds)[] = [];
    for (let i = 0; i < allEmbeds.length; i += 10) chunks.push(allEmbeds.slice(i, i + 10));

    for (const embeds of chunks) {
      const resp = await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds }),
      });
      if (!resp.ok) {
        const errText = await resp.text().catch(() => "");
        throw new Error(`디스코드 웹훅 전송 실패 (${resp.status}): ${errText}`);
      }
    }

    // ── 보낸 기록 남기기 (다음 실행부터 중복 방지) ──
    await supabase.from("notify_log").upsert(toSend.map((it) => ({ id: it.id })), { onConflict: "id" });

    return new Response(JSON.stringify({ sent: toSend.length }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
