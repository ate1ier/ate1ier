-- supabase/discord-notify-setup.sql
--
-- 디스코드 알림 기능에 필요한 테이블 + (선택) pg_cron 예약을 만드는 스크립트예요.
-- Supabase 대시보드 → SQL Editor에 이 파일 내용을 그대로 붙여넣고 실행하면 됩니다.
-- (kv_store 테이블은 이미 있는 걸 그대로 읽기만 하고, 여긴 새 테이블 하나만 추가해요.)

-- ── 1) 이미 보낸 알림을 기록해서 중복 발송을 막는 테이블 ──────────────────
-- id 형식: "cal:{계정id}:{일정id}" 또는 "todo:{계정id}:{할일id}"
create table if not exists notify_log (
  id text primary key,
  sent_at timestamptz not null default now()
);

-- 서비스 롤(Edge Function)만 이 테이블을 쓰기 때문에 RLS는 기본적으로 막아둡니다.
-- (Edge Function은 service_role 키를 쓰므로 RLS 정책과 상관없이 항상 접근 가능해요.)
alter table notify_log enable row level security;

-- 오래된 로그가 계속 쌓이는 걸 막기 위해, 90일 지난 기록은 자동으로 정리합니다.
-- (원한다면 이 블록은 생략해도 기능에는 문제 없어요. 그냥 테이블만 조금씩 커질 뿐입니다.)
create or replace function cleanup_old_notify_log() returns void as $$
  delete from notify_log where sent_at < now() - interval '90 days';
$$ language sql;


-- ── 2) pg_cron으로 Edge Function을 5분마다 자동 호출하기 ──────────────────
-- 아래 두 확장은 Supabase 대시보드 → Database → Extensions 에서
-- "pg_cron"과 "pg_net"을 켜면 됩니다 (무료 플랜에서도 사용 가능).
--
-- 켠 다음, 아래 두 가지 방법 중 하나만 하면 돼요.
--
-- [방법 A — 추천] 대시보드에서 클릭만으로 설정하기
--   1. Supabase 대시보드 → Integrations → Cron 으로 이동
--   2. "Create a new Job" 클릭
--   3. Type: "Supabase Edge Function" 선택 → discord-notify 함수 선택
--   4. Schedule: 매 5분 (natural language로 "every 5 minutes" 입력 가능)
--   → 이러면 아래 [방법 B]의 SQL은 실행할 필요 없어요.
--
-- [방법 B] SQL로 직접 예약하기 (대시보드 Cron UI 대신 쓰고 싶을 때)
--   <프로젝트REF>와 <SERVICE_ROLE_KEY>를 실제 값으로 바꾼 뒤 아래 주석을 풀고 실행하세요.
--   (SERVICE_ROLE_KEY는 대시보드 → Project Settings → API 에서 확인할 수 있어요.
--    이 키가 SQL 코드 안에 그대로 남으니, 이 스크립트를 다른 사람과 공유하지 않도록 주의하세요.)
--
-- select cron.schedule(
--   'discord-notify-every-5-min',
--   '*/5 * * * *',
--   $$
--   select net.http_post(
--     url := 'https://<프로젝트REF>.supabase.co/functions/v1/discord-notify',
--     headers := jsonb_build_object(
--       'Content-Type', 'application/json',
--       'Authorization', 'Bearer <SERVICE_ROLE_KEY>'
--     ),
--     body := '{}'::jsonb
--   );
--   $$
-- );

-- 예약을 나중에 취소하고 싶으면:
-- select cron.unschedule('discord-notify-every-5-min');
