-- supabase/auth-rls-migration.sql
--
-- "anon key만 있으면 누구나 kv_store를 읽고 쓸 수 있는" 지금 구조를,
-- "실제로 로그인(Supabase Auth 인증)한 사람만 읽고 쓸 수 있는" 구조로 바꾸는
-- 1회성 마이그레이션 SQL입니다.
--
-- ----- 적용 방법 -----
--   1) 아래 SQL 전체를 Supabase 대시보드 → SQL Editor → New query 에 붙여넣고 실행합니다.
--      (딱 1번만 실행하면 됩니다. 여러 번 실행해도 안전하게 만들어뒀습니다.)
--   2) 이어서 반드시 아래 "이메일 인증 끄기" 설정도 함께 해주세요:
--        Supabase 대시보드 → Authentication → Sign In / Providers → Email
--        → "Confirm email" 옵션을 OFF로 꺼주세요.
--      이 앱은 실제 이메일 주소가 아니라 "아이디@ate1ier.local" 같은 가짜 이메일로
--      Supabase Auth 계정을 만듭니다(받은편지함이 없어서 인증 메일을 받을 수 없어요).
--      "Confirm email"이 켜져 있으면 가입 직후 로그인이 안 되니 꼭 꺼주세요.
--   3) 이후 js/01-common.js를 다시 빌드(node build.js)해서 index.html에 반영하고 배포하면 됩니다.
--
-- ----- 이 마이그레이션이 하는 일 -----
--   - kv_store 테이블에 RLS(행 단위 보안)를 켜고(이미 켜져 있어도 안전),
--     기존에 걸려있던 정책(이름이 무엇이든)을 전부 지운 뒤,
--   - "로그인 화면에서 아이디 입력만으로 계정 종류를 미리 보여주기 위해 꼭 필요한
--     딱 한 줄(personal-app:accounts)"만 로그인 전에도 읽을 수 있게 허용하고,
--   - 그 외 모든 읽기/쓰기(추가・수정・삭제 포함)는 실제로 로그인(Supabase Auth
--     인증)한 사람만 할 수 있게 막습니다.
--   - 이 앱은 원래 팀 전체가 하나의 데이터셋을 같이 쓰는 구조라서, 로그인한
--     사람들 사이에서는 예전처럼 서로의 데이터를 자유롭게 볼 수 있게 그대로
--     둡니다(계정별로 나누는 건 이번 작업 범위가 아닙니다).

alter table public.kv_store enable row level security;

-- 기존 정책을 이름과 상관없이 전부 지웁니다 (anon 전면 개방 정책 제거).
do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'kv_store'
  loop
    execute format('drop policy if exists %I on public.kv_store', pol.policyname);
  end loop;
end $$;

-- 로그인 전(anon)에는 "계정 목록" 한 줄만 읽을 수 있습니다.
-- (로그인 화면에서 아이디를 입력하면 팀용/개인용인지, 팀용이면 로그인 인원
--  목록이 뭔지 미리 보여줘야 해서, 로그인 전에도 이 한 줄만은 읽을 수 있어야
--  합니다. 이 줄에는 비밀번호 원문이 아니라 salt+해시만 들어있습니다.)
create policy "anon read accounts row only"
  on public.kv_store
  for select
  to anon
  using (key = 'personal-app:accounts');

-- 로그인(Supabase Auth 인증)한 사용자는 지금까지처럼 모든 키를 자유롭게
-- 읽고 쓸 수 있습니다(팀 전체가 데이터를 공유하는 구조이므로 행 소유자로
-- 나누지 않습니다).
create policy "authenticated full access"
  on public.kv_store
  for all
  to authenticated
  using (true)
  with check (true);

-- ----- 확인용 쿼리 (실행 후 정책이 잘 바뀌었는지 눈으로 확인하고 싶을 때) -----
-- select policyname, roles, cmd, qual, with_check
-- from pg_policies
-- where schemaname = 'public' and tablename = 'kv_store';
