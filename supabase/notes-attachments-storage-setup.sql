-- supabase/notes-attachments-storage-setup.sql
--
-- "업무 정리(메모)"의 각 메모에 파일을 첨부하고 다시 다운로드할 수 있게 해주는
-- Supabase Storage 버킷을 만들고, 로그인한 사람만 읽고 쓸 수 있도록 권한(RLS)을
-- 설정하는 1회성 SQL입니다.
--
-- ----- 적용 방법 -----
--   1) 아래 SQL 전체를 Supabase 대시보드 → SQL Editor → New query 에 붙여넣고
--      실행합니다. (여러 번 실행해도 안전하게 만들어뒀습니다.)
--   2) js/, css/가 반영된 상태로 `node build.js`를 실행해 index.html/app.js/
--      styles.min.css에 반영하고 배포합니다.
--   ※ 이 SQL을 실행하기 전에는 메모의 "파일 첨부" 버튼을 눌러도 업로드가
--      실패합니다(버킷이 아직 없기 때문). 반드시 먼저 실행해주세요.
--
-- ----- 이 SQL이 하는 일 -----
--   - "note-attachments"라는 이름의 비공개(private) Storage 버킷을 만듭니다.
--     (공개 버킷이 아니므로, 파일 경로를 안다고 해도 로그인하지 않은 사람은
--      다운로드할 수 없습니다 — 앱이 매번 로그인 세션으로 다운로드를 요청합니다.)
--   - kv_store 테이블과 같은 방식으로, 로그인(Supabase Auth 인증)한 사람만 이
--     버킷의 파일을 읽고(다운로드)·올리고(업로드)·지울 수 있게 합니다. 이 앱은
--     팀 전체가 데이터를 공유하는 구조라서 계정별로 나누지 않고, 로그인한
--     사람이면 누구나 모든 메모의 첨부파일에 접근할 수 있습니다
--     (kv_store의 "authenticated full access" 정책과 동일한 성격입니다).

insert into storage.buckets (id, name, public)
values ('note-attachments', 'note-attachments', false)
on conflict (id) do nothing;

-- 기존에 이 버킷에 걸려있던 정책을 이름과 상관없이 전부 지웁니다(재실행 안전).
do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname like 'note-attachments:%'
  loop
    execute format('drop policy if exists %I on storage.objects', pol.policyname);
  end loop;
end $$;

create policy "note-attachments: authenticated read"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'note-attachments');

create policy "note-attachments: authenticated insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'note-attachments');

create policy "note-attachments: authenticated update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'note-attachments');

create policy "note-attachments: authenticated delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'note-attachments');
