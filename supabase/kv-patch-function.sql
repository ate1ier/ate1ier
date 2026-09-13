-- supabase/kv-patch-function.sql
--
-- "저장할 때마다 카테고리 전체 JSON을 통째로 다시 보내는" 문제를 줄이기 위한
-- 함수입니다. 항목이 많은 카테고리(QA, 면담일지, 월별 스케줄 등)에서 항목 하나만
-- 고쳐도 지금까지는 그 카테고리 전체를 다시 서버로 보냈는데, 이 함수를 쓰면
-- "바뀐 자리"만 서버에 알려주고 서버가 기존 값에 그 부분만 덧붙여(patch) 저장합니다.
--
-- ----- 적용 방법 -----
--   Supabase 대시보드 → SQL Editor에서 아래 SQL 전체를 실행하세요(1회성, 여러 번
--   실행해도 안전합니다). 다른 작업(auth-rls-migration.sql)과 순서 상관없이 실행 가능합니다.
--
-- ----- 동작 방식 -----
--   - 클라이언트(js/01-common.js)가 "이전에 서버와 같았던 값"과 "지금 저장하려는
--     값"을 비교해서 바뀐 자리만 뽑아 이 함수를 호출합니다.
--   - 이 함수를 아직 실행하지 않았거나 호출이 실패해도, 클라이언트가 자동으로
--     예전처럼 "전체를 통째로 저장하는 방식"으로 되돌아가므로 이 SQL을 실행하지
--     않아도 앱은 그대로 정상 동작합니다(부분 업데이트로 인한 절약만 못 받을 뿐).
--   - kv_store.value 컬럼의 타입(text)은 그대로 두고, 함수 안에서만 jsonb로
--     바꿔 부분 수정한 뒤 다시 text로 저장합니다.
--   - 같은 key를 동시에 patch하는 경우를 대비해 행을 잠그고(for update) 처리합니다.
--   - 기존의 "낙관적 동시성 제어"(마지막으로 확인한 updated_at이 그대로일 때만
--     저장)를 그대로 지킵니다 — 그 사이 다른 사람이 먼저 저장했으면 이 함수는
--     applied = false를 돌려주고, 클라이언트는 지금까지와 똑같이 자동 병합을 시도합니다.

create or replace function public.kv_apply_patch(
  p_key text,
  p_ops jsonb,
  p_new_updated_at timestamptz,
  p_expected_updated_at timestamptz
) returns table(applied boolean, value text, updated_at timestamptz)
language plpgsql
as $$
declare
  current_value jsonb;
  current_updated_at timestamptz;
  op jsonb;
  path_arr text[];
begin
  select kv_store.value::jsonb, kv_store.updated_at
    into current_value, current_updated_at
    from public.kv_store
    where key = p_key
    for update;

  if not found then
    return query select false, null::text, null::timestamptz;
    return;
  end if;

  if p_expected_updated_at is not null and current_updated_at is distinct from p_expected_updated_at then
    -- 그 사이 다른 사람이 먼저 저장했다 — 지금 값을 그대로 돌려주면 클라이언트가
    -- (기존 방식 그대로) 자동 병합을 시도한다.
    return query select false, current_value::text, current_updated_at;
    return;
  end if;

  for op in select * from jsonb_array_elements(p_ops)
  loop
    path_arr := array(select jsonb_array_elements_text(op->'path'));
    if coalesce((op->>'remove')::boolean, false) then
      current_value := current_value #- path_arr;
    else
      current_value := jsonb_set(current_value, path_arr, op->'value', true);
    end if;
  end loop;

  update public.kv_store
    set value = current_value::text, updated_at = p_new_updated_at
    where key = p_key;

  return query select true, current_value::text, p_new_updated_at;
end;
$$;

-- 이 함수는 로그인한(authenticated) 사용자만 호출할 수 있게 합니다. 함수 안의
-- select/update는 일반 SQL 권한 검사를 그대로 따르므로(SECURITY DEFINER를 쓰지
-- 않음), auth-rls-migration.sql에서 설정한 "authenticated만 쓰기 가능" 규칙이
-- 이 함수를 통해서도 똑같이 적용됩니다.
revoke all on function public.kv_apply_patch(text, jsonb, timestamptz, timestamptz) from public;
grant execute on function public.kv_apply_patch(text, jsonb, timestamptz, timestamptz) to authenticated;
