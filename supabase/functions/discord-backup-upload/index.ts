// supabase/functions/discord-backup-upload/index.ts
//
// pg_cron이 매일 정해진 시각(추천: KST 00:05)에 이 함수를 호출하면, 서버가 그날치
// 데이터를 "메모리에서만" 스냅샷으로 모아서 디스코드 웹훅에 파일로 올려요.
// 예전 버전과 달리 kv_store에 backup:all / backup:cat / backup:acct / backup:marker
// 같은 백업 사본을 전혀 저장하지 않습니다 — 디스코드에 올라간 파일이 유일한 보관본이고,
// 서버(Supabase)에는 백업이 하나도 남지 않아요.
//
// 혹시 예전 방식(클라이언트 자동 백업, 또는 이 함수의 이전 버전)이 만들어둔
// "backup:"으로 시작하는 잔여 데이터가 kv_store에 남아있다면, 매 실행마다
// 그것도 함께 지워서 서버에 백업 흔적이 쌓이지 않게 합니다.
//
// ※ 카테고리 정의(BACKUP_CATEGORIES)는 js/01e-backup.js와 반드시 같아야 해요.
//   클라이언트 쪽 카테고리를 바꾸면 여기도 같이 고쳐주세요.
//
// ----- 배포 방법 -----
//   1) 디스코드 채널 설정 → 연동 → 웹후크 → 새 웹후크 만들기 → URL 복사
//      (discord-notify와 같은 웹훅을 재사용해도 되고, 백업 전용 채널에 새로 만들어도 됩니다)
//   2) 그 URL을 서버 비밀값으로 등록 (최초 1회만, 이후 바뀌면 다시)
//        supabase secrets set DISCORD_BACKUP_WEBHOOK_URL=여기에_웹훅_URL
//   3) 함수 배포 (코드를 바꿀 때마다 다시 실행)
//        supabase functions deploy discord-backup-upload --no-verify-jwt
//   4) supabase/discord-backup-upload-setup.sql 안내대로 pg_cron 예약 (최초 1회만)
//
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY는 Edge Function 실행 환경에 자동으로
// 들어있어서 따로 secrets set 할 필요 없어요. DISCORD_BACKUP_WEBHOOK_URL만 등록하면 됩니다.
//
// ⚠️ 디스코드 웹훅은 일반 서버 기준 파일 첨부 용량이 8MB로 제한돼요(서버 부스트 단계에
//   따라 최대 50MB까지 늘어남). 계정·데이터가 많아져서 백업 파일이 이 제한을 넘으면
//   업로드가 실패하니, 그런 경우엔 Supabase Storage에 올리고 "다운로드 링크"만 디스코드로
//   보내는 방식으로 바꿔야 해요.
//
// ⚠️ 서버에 사본을 전혀 안 남기는 대신, 하루치 백업의 유일한 원본은 이제 디스코드
//   채널뿐이에요. 그 채널/메시지를 지우면 그 날짜 백업은 복구할 방법이 없습니다.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const DISCORD_WEBHOOK_URL = Deno.env.get("DISCORD_BACKUP_WEBHOOK_URL") || "";

// js/01e-backup.js의 BACKUP_CATEGORIES와 동일한 접두어 목록 (label은 여기선 불필요)
const BACKUP_CATEGORIES: Array<{ key: string; keyPrefixes: string[] }> = [
  { key: "calendar", keyPrefixes: ["personal-calendar:"] },
  { key: "notes", keyPrefixes: ["personal-notes:"] },
  { key: "agents", keyPrefixes: ["personal-agents:"] },
  { key: "interviews", keyPrefixes: ["personal-interviews:"] },
  { key: "qa", keyPrefixes: ["personal-qa:"] },
  { key: "schedule", keyPrefixes: ["personal-schedule:"] },
];
function backupAllPrefixes(): string[] {
  return BACKUP_CATEGORIES.reduce((acc: string[], c) => acc.concat(c.keyPrefixes), []);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}
// 서버는 UTC로 돌지만, "UTC 현재시각 + 9시간"의 UTC 필드를 읽으면 KST 캘린더 날짜와
// 정확히 같아져요 (discord-notify의 nowAsKstFields()와 동일한 트릭).
function kstNow(): Date {
  return new Date(Date.now() + 9 * 60 * 60 * 1000);
}
function kstDateStr(d: Date): string {
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}
function prevKstDateStr(): string {
  const d = kstNow();
  d.setUTCDate(d.getUTCDate() - 1); // "어제" 하루치를 남긴다 (기존 방식과 동일한 기준)
  return kstDateStr(d);
}

function safeParse<T>(raw: unknown, fallback: T): T {
  if (typeof raw !== "string") return fallback;
  try {
    return (JSON.parse(raw) ?? fallback) as T;
  } catch (_e) {
    return fallback;
  }
}

// "acct:{accountId}:" 로 시작하는 kv_store row들 중, 주어진 접두어에 해당하는 것만
// { 상대키: 값 } 형태로 모아온다. (js/01e-backup.js의 _accountCategoryEntries와 동일)
async function accountCategoryEntries(accountId: string, prefixes: string[]): Promise<Record<string, string>> {
  const acctPrefix = `acct:${accountId}:`;
  const { data, error } = await supabase.from("kv_store").select("key,value").like("key", `${acctPrefix}%`);
  if (error || !data) return {};
  const entries: Record<string, string> = {};
  for (const row of data as Array<{ key: string; value: unknown }>) {
    const rel = row.key.slice(acctPrefix.length);
    if (!prefixes.some((p) => rel.indexOf(p) === 0)) continue;
    if (typeof row.value === "string") entries[rel] = row.value;
  }
  return entries;
}

// 그날치 전체 스냅샷을 "메모리에서만" 만든다 — kv_store에는 아무것도 쓰지 않는다.
async function buildAllSnapshot(targetDate: string): Promise<{ createdAt: string; date: string; accounts: Record<string, unknown> }> {
  const { data: acctRow } = await supabase
    .from("kv_store").select("value").eq("key", "personal-app:accounts").maybeSingle();
  const accounts = safeParse<Array<{ id: string; username: string }>>(acctRow?.value, []);

  const snapshot: { createdAt: string; date: string; accounts: Record<string, unknown> } = {
    createdAt: new Date().toISOString(),
    date: targetDate,
    accounts: {},
  };
  for (const acc of accounts) {
    const entries = await accountCategoryEntries(acc.id, backupAllPrefixes());
    if (Object.keys(entries).length) {
      snapshot.accounts[acc.id] = { accountName: acc.username, data: entries };
    }
  }
  return snapshot;
}

// 예전 클라이언트/구버전 함수가 남겨둔 backup:* 잔여 데이터를 전부 지운다.
// (지금 버전은 애초에 backup:* 를 쓰지 않지만, 과거에 쌓인 게 있으면 실행할 때마다 청소한다)
async function deleteAllLegacyBackupKeys(): Promise<void> {
  const { data } = await supabase.from("kv_store").select("key").like("key", "backup:%");
  if (!data) return;
  for (const row of data as Array<{ key: string }>) {
    try {
      await supabase.from("kv_store").delete().eq("key", row.key);
    } catch (_e) {
      /* 하나 실패해도 나머지는 계속 정리 */
    }
  }
}

Deno.serve(async (_req: Request) => {
  if (!DISCORD_WEBHOOK_URL) {
    return new Response(
      JSON.stringify({ error: "DISCORD_BACKUP_WEBHOOK_URL이 설정되어 있지 않아요. supabase secrets set DISCORD_BACKUP_WEBHOOK_URL=... 을 실행해주세요." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const targetDate = prevKstDateStr();

  try {
    const snapshot = await buildAllSnapshot(targetDate);
    const json = JSON.stringify(snapshot);

    const fileBlob = new Blob([json], { type: "application/json" });
    const form = new FormData();
    form.append("payload_json", JSON.stringify({ content: `🗄️ ${targetDate} 일일 백업` }));
    form.append("files[0]", fileBlob, `backup-${targetDate}.json`);

    const resp = await fetch(DISCORD_WEBHOOK_URL, { method: "POST", body: form });
    if (!resp.ok) {
      const errText = await resp.text().catch(() => "");
      // 업로드가 실패하면(용량 초과 등) 서버 데이터를 지우지 않고 그대로 에러를 반환한다.
      // (실패한 백업을 지워버리면 재시도할 방법이 없어지기 때문)
      throw new Error(`디스코드 웹훅 업로드 실패 (${resp.status}): ${errText}`);
    }

    // 디스코드 업로드가 끝났으니, 서버(kv_store)에는 백업 사본을 하나도 남기지 않는다.
    await deleteAllLegacyBackupKeys();

    return new Response(JSON.stringify({ ok: true, date: targetDate }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
