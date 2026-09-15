-- supabase/auth-lockdown-migration.sql
--
-- 지금까지 로그인 화면(아이디만 입력한 단계)에서 "팀용/개인용인지, 팀용이면
-- 로그인 인원이 누구인지"를 미리 보여주기 위해, 로그인 전(anon)에도
-- personal-app:accounts 한 줄을 통째로 읽을 수 있게 열어뒀습니다. 그런데
-- Supabase RLS는 "행" 단위로만 막을 수 있고 그 행 안의 개별 값(컬럼/JSON 필드)은
-- 가릴 수 없어서, 그 한 줄 안에 함께 들어있던 모든 계정의 비밀번호 해시+salt와
-- Supabase 로그인에 쓰이는 cloudAuthSecret까지 로그인 없이 통째로 읽을 수
-- 있었습니다 — cloudAuthSecret이 새어나가면 사람이 쓰는 비밀번호를 몰라도 그
-- 값만으로 바로 Supabase 인증을 통과해 전체 데이터(이번에 추가한 첨부파일
-- 포함)에 접근할 수 있었습니다.
--
-- 이 마이그레이션은 그 구멍을 막습니다:
--   - 로그인 화면에 필요한 "안전한 정보만" 돌려주는 함수 2개를 새로 만들고
--     (비밀번호 관련 필드는 아예 결과에 포함하지 않음),
--   - anon이 personal-app:accounts 행을 직접 읽던 정책은 지웁니다.
-- 실제 로그인 검증(비밀번호 확인)과 비밀번호 변경은 이제 이 SQL이 아니라
-- supabase/functions/auth-admin (Edge Function, 서비스 롤 키로만 동작)에서
-- 처리합니다 — 그래야 비밀번호 해시가 브라우저까지 나갈 필요가 아예 없어집니다.
--
-- ----- 적용 순서 (중요) -----
--   1) js/, README가 반영된 상태로 `node build.js`를 실행해 index.html/app.js를
--      만들고, 먼저 깃허브에 커밋해서 배포합니다(=새 로그인 화면 코드가 먼저
--      떠 있게).
--   2) supabase/functions/auth-admin 을 배포합니다:
--        supabase functions deploy auth-admin
--   3) 그 다음에 이 SQL 전체를 Supabase 대시보드 → SQL Editor에서 실행합니다
--      (여러 번 실행해도 안전합니다).
--   4) 계정 하나(가능하면 테스트용 계정)로 로그아웃 후 다시 로그인해서 잘 되는지
--      확인합니다. 예전 계정은 "이번 로그인 한 번"에 한해 서버(Edge Function)가
--      비밀번호를 확인하고 조용히 새 방식으로 전환해줍니다 — 사람 입장에서는
--      평소처럼 아이디/비밀번호만 입력하면 되고 별도로 할 일은 없습니다.
--   ※ 순서가 중요한 이유: 1)·2)를 먼저 끝내지 않고 이 SQL(특히 맨 아래
--      "anon 정책 삭제")부터 실행하면, 그 사이(아직 예전 클라이언트 코드가 떠
--      있는 짧은 동안) 로그인 화면 자체가 동작하지 않을 수 있습니다.

create or replace function public.get_login_bootstrap()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v jsonb;
begin
  select value::jsonb into v from public.kv_store where key = 'personal-app:accounts';
  if v is null then
    return jsonb_build_object('hasAnyAccount', false, 'hasMaster', false);
  end if;
  return jsonb_build_object(
    'hasAnyAccount', jsonb_array_length(v) > 0,
    'hasMaster', exists (
      select 1 from jsonb_array_elements(v) a where (a->>'isMaster')::boolean is true
    )
  );
end;
$$;
grant execute on function public.get_login_bootstrap() to anon, authenticated;

create or replace function public.get_login_account_info(p_username text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v jsonb;
  acct jsonb;
begin
  select value::jsonb into v from public.kv_store where key = 'personal-app:accounts';
  if v is null then return null; end if;
  select a into acct from jsonb_array_elements(v) a
    where lower(a->>'username') = lower(p_username)
    limit 1;
  if acct is null then return null; end if;
  -- 비밀번호 관련 필드(passwordHash/salt/hashAlgo/iterations/cloudAuthSecret)는
  -- 절대 여기 포함하지 않는다 — 로그인 화면 미리보기에 필요한 값만 돌려준다.
  return jsonb_build_object(
    'id', acct->>'id',
    'username', acct->>'username',
    'accountType', coalesce(acct->>'accountType', 'personal'),
    'isMaster', coalesce((acct->>'isMaster')::boolean, false),
    'authMigrated', coalesce((acct->>'authMigrated')::boolean, false),
    'teamMembers', coalesce(acct->'teamMembers', '[]'::jsonb)
  );
end;
$$;
grant execute on function public.get_login_account_info(text) to anon, authenticated;

-- ---- anon 정책 삭제 (위 "적용 순서" 안내 참고: Edge Function·새 클라이언트
--      배포를 먼저 끝낸 뒤에 이 부분을 실행하는 걸 권장) ----
drop policy if exists "anon read accounts row only" on public.kv_store;
