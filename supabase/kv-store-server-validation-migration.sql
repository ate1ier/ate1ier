-- supabase/kv-store-server-validation-migration.sql
--
-- ----- 이 마이그레이션이 막는 문제 -----
-- 지금까지 "QA 점수는 0~100 사이여야 한다", "잠긴 달의 점수는 못 고친다",
-- "계정 목록은 배열이어야 한다" 같은 규칙은 전부 브라우저(js/05-qa.js 등)에만
-- 있었습니다. 앱 화면을 통해 저장할 때는 문제가 없지만, 실제로 로그인한
-- 사람이라면 개발자도구나 curl로 Supabase REST API(`/rest/v1/kv_store`)를
-- 직접 두드려서 이 화면을 완전히 건너뛸 수 있습니다. auth-rls-migration.sql이
-- 막아주는 건 "로그인했는가"뿐이고, "이 값이 말이 되는 값인가"는 전혀 검사하지
-- 않기 때문에, 로그인만 했다면 점수를 9999로 만들거나 잠긴 달의 점수를 몰래
-- 바꾸거나 계정 목록을 통째로 빈 배열로 덮어쓰는 것도 지금은 그대로 통과됩니다.
--
-- ----- 이 마이그레이션이 하는 일 -----
-- kv_store 테이블에 저장되기 "직전"(BEFORE INSERT/UPDATE)에 실행되는 트리거를
-- 하나 추가해서, 어떤 경로로 값이 들어오든(화면 저장 / kv_apply_patch 부분
-- 업데이트 / REST API 직접 호출) 항상 같은 최소한의 규칙을 서버가 직접 강제합니다:
--
--   1) value는 항상 올바른 JSON이어야 한다 (깨진 문자열 저장 방지)
--   2) value 크기는 4MB를 넘을 수 없다 (한 계정이 통째로 못 쓰게 되는 것 방지)
--   3) "...personal-qa:data"로 끝나는 키: scores에 들어있는 값은 전부 0~100
--      사이의 숫자여야 한다 (범위 밖 숫자·문자열·배열 등은 거부)
--   4) 같은 키: 이미 "잠금"돼 있던 달의 점수를, 이번 저장에서도 여전히 잠긴
--      채로 값만 바꾸려는 시도는 거부한다. 정상적인 흐름(화면에서 "잠금 해제"를
--      먼저 누르고 그 다음에 점수를 고치는 것)은 항상 두 번의 별도 저장으로
--      나뉘어 있어서 이 트리거를 통과하는 데 지장이 없습니다.
--   5) "personal-app:accounts" 키: 항상 배열이어야 하고, 이미 계정이 1개
--      이상 있던 상태에서 통째로 빈 배열([])로 덮어쓰는 시도는 거부한다
--      (실수 또는 악의적인 "전체 계정 삭제" 방지)
--
-- ----- 이 마이그레이션이 못 막는 것 (알고 있는 한계) -----
-- 이 트리거는 "이 값이 형식적으로 말이 되는가"만 검사합니다. "이 사람이 이
-- 데이터를 고칠 권한이 있는가"(예: 관리자가 아닌 팀원이 다른 사람의 점수나
-- 관리자 전용 설정을 고치면 안 된다)까지 서버가 막으려면, 지금처럼 팀 전체가
-- 같은 키를 공유하는 구조 자체를 계정별/역할별로 나누는 더 큰 작업이 필요해서
-- 이번 범위에는 포함하지 않았습니다. 지금은 "로그인한 사람 = 이 데이터를 만질
-- 수 있는 사람"이라는 이 앱의 기존 정책을 그대로 두고, 그 안에서 값 자체의
-- 무결성만 지킵니다.
--
-- ----- 적용 방법 -----
--   Supabase 대시보드 → SQL Editor에서 아래 SQL 전체를 실행하세요 (1회성,
--   여러 번 실행해도 안전합니다. 다른 마이그레이션과 순서 상관없이 실행 가능).
--   기존 앱은 화면을 통해서는 항상 이 규칙을 만족하는 값만 저장하므로, 정상
--   사용 중에는 아무것도 달라지지 않습니다 — 화면을 거치지 않은 비정상적인
--   쓰기만 서버에서 막힙니다.

create or replace function public.kv_store_validate_write()
returns trigger
language plpgsql
as $$
declare
  v jsonb;
  old_v jsonb;
  max_bytes constant int := 4 * 1024 * 1024; -- 4MB
  score_key text;
  score_val jsonb;
  old_score jsonb;
  month_part text;
  pipe_pos int;
  old_locked boolean;
  new_locked boolean;
begin
  if NEW.value is null then
    return NEW; -- 값을 지우는 저장(NULL)은 그대로 허용
  end if;

  if octet_length(NEW.value) > max_bytes then
    raise exception 'kv_store 값이 너무 커요(최대 4MB): key=%', NEW.key;
  end if;

  begin
    v := NEW.value::jsonb;
  exception when others then
    raise exception 'kv_store 값이 올바른 JSON이 아니에요: key=%', NEW.key;
  end;

  -- ----- QA 점수 데이터: 점수 범위 + 잠긴 달 보호 -----
  -- 실제 키는 "acct:{계정ID}:personal-qa:data" 형태라 접미사로 매칭한다.
  if right(NEW.key, length('personal-qa:data')) = 'personal-qa:data' then

    if jsonb_typeof(v->'scores') = 'object' then
      for score_key, score_val in select * from jsonb_each(v->'scores') loop
        if jsonb_typeof(score_val) = 'number' then
          if (score_val#>>'{}')::numeric < 0 or (score_val#>>'{}')::numeric > 100 then
            raise exception 'QA 점수는 0~100 사이여야 해요: % = %', score_key, score_val;
          end if;
        elsif jsonb_typeof(score_val) = 'object' then
          -- 예전 형식(유선/채팅 점수를 따로 저장)도 같은 기준으로 검사
          if score_val ? 'voice' and jsonb_typeof(score_val->'voice') = 'number'
             and ((score_val->>'voice')::numeric < 0 or (score_val->>'voice')::numeric > 100) then
            raise exception 'QA 점수(유선)는 0~100 사이여야 해요: %', score_key;
          end if;
          if score_val ? 'chat' and jsonb_typeof(score_val->'chat') = 'number'
             and ((score_val->>'chat')::numeric < 0 or (score_val->>'chat')::numeric > 100) then
            raise exception 'QA 점수(채팅)는 0~100 사이여야 해요: %', score_key;
          end if;
        elsif jsonb_typeof(score_val) <> 'null' then
          raise exception 'QA 점수 형식이 올바르지 않아요: %', score_key;
        end if;
      end loop;
    end if;

    -- 잠긴 달의 점수를 몰래 바꾸는 시도 차단 (수정 시에만 검사)
    if TG_OP = 'UPDATE' and OLD.value is not null then
      begin
        old_v := OLD.value::jsonb;
      exception when others then
        old_v := null;
      end;
      if old_v is not null
         and jsonb_typeof(v->'scores') = 'object'
         and jsonb_typeof(old_v->'scores') = 'object' then
        for score_key, score_val in select * from jsonb_each(v->'scores') loop
          old_score := old_v->'scores'->score_key;
          if old_score is distinct from score_val then
            pipe_pos := position('|' in score_key);
            if pipe_pos > 0 then
              month_part := substring(score_key from pipe_pos + 1);
              old_locked := coalesce((old_v->'monthLocks'->>month_part)::boolean, false);
              new_locked := coalesce((v->'monthLocks'->>month_part)::boolean, false);
              if old_locked and new_locked then
                raise exception '잠긴 달(%)의 점수는 잠금을 해제한 뒤 수정해야 해요.', month_part;
              end if;
            end if;
          end if;
        end loop;
      end if;
    end if;
  end if;

  -- ----- 계정 목록: 배열 형식 유지 + 전체 삭제 방지 -----
  if NEW.key = 'personal-app:accounts' then
    if jsonb_typeof(v) <> 'array' then
      raise exception 'personal-app:accounts 값은 배열이어야 해요.';
    end if;
    if TG_OP = 'UPDATE' and OLD.value is not null then
      begin
        old_v := OLD.value::jsonb;
      exception when others then
        old_v := null;
      end;
      if old_v is not null and jsonb_typeof(old_v) = 'array'
         and jsonb_array_length(old_v) > 0 and jsonb_array_length(v) = 0 then
        raise exception '계정 목록을 통째로 비울 수 없어요.';
      end if;
    end if;
  end if;

  return NEW;
end;
$$;

drop trigger if exists kv_store_validate_write_trg on public.kv_store;
create trigger kv_store_validate_write_trg
  before insert or update on public.kv_store
  for each row
  execute function public.kv_store_validate_write();

-- ----- 확인용: 트리거가 실제로 규칙을 막는지 눈으로 테스트하고 싶을 때 -----
-- (아래 두 줄은 실행하면 "정상적으로 에러가 나야" 성공입니다. 실행 후 그대로 두면
--  안 되니 테스트가 끝나면 지우세요. update문은 존재하지 않는 key라 애초에 아무
--  행도 안 바뀌므로 실제 데이터에는 영향이 없습니다.)
-- update public.kv_store set value = '{"scores":{"test|2026-09":150}}' where key = '__no_such_key__';
-- update public.kv_store set value = 'not json' where key = '__no_such_key__';
