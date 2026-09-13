  // ==================== 클라우드 동기화 핵심: Supabase 클라이언트/인증 이메일 매핑, 동기화 상태 토스트, 3-way 자동 병합, 부분 업데이트(patch) 최적화 ====================
  // (예전 01-common.js에서 분리됨 — 실행 순서·내용은 그대로입니다)
  /* ===================== ☁️ 클라우드 동기화 (Supabase) =====================
     계정 목록과 각 계정의 데이터(할일/메모/상담사/면담일지/스케줄/캘린더)를
     Supabase의 kv_store 테이블에도 함께 저장해서, 다른 기기·다른 사람도
     같은 데이터를 볼 수 있게 한다. 화면 테마, 내비게이션 접기 상태, 로그인
     세션처럼 "이 브라우저에서만 의미 있는" 값은 그대로 로컬(localStorage)에만
     남겨둔다.
     ---- Supabase Auth 전환 (2026-09) ----
     예전에는 RLS를 anon에게 전면 개방해뒀었다(anon key만 있으면 누구나 이
     테이블을 읽고 쓸 수 있었다). 지금은 실제로 로그인(=Supabase Auth로 인증)한
     사용자만 kv_store를 읽고 쓸 수 있도록 서버(Supabase 대시보드)의 RLS
     정책을 바꿔뒀다 — 이 파일 옆의 supabase/auth-rls-migration.sql 참고.
     로그인 화면에서 "아이디"만으로 계정 종류(팀용/개인용)를 미리 보여주고
     비밀번호를 로컬에서 대조하는 지금의 로그인 방식 자체는 그대로 두되(그
     아이디/비밀번호 대조 로직 강화는 다음 작업으로 별도 진행 예정), 아래
     사항이 새로 추가됐다:
       - 아이디(username)를 Supabase Auth가 요구하는 이메일 형식으로 바꿔주는
         가짜 이메일(예: "abc" → "abc@ate1ier.local")을 매핑에 쓴다. 실제
         이메일이 아니라서 발송되는 메일은 없다 — Supabase 프로젝트의
         Authentication 설정에서 "Confirm email"을 꺼둬야 가입 즉시 로그인이
         된다(auth-rls-migration.sql 상단 안내 참고).
       - Supabase Auth의 "비밀번호"로는 사람이 입력하는 로그인 비밀번호를 그대로
         쓰지 않고, 계정마다 한 번 정해지면 바뀌지 않는 별도의 무작위 값
         (cloudAuthSecret)을 쓴다. 사람용 비밀번호 확인(로컬 salt+해시 대조)은
         지금 로직 그대로 두고, 그 확인을 통과하면 이 무작위 값으로 Supabase
         Auth에 로그인(없으면 자동 가입)해서 kv_store 접근 권한을 얻는다. 이렇게
         분리해두면 마스터가 나중에 사람용 비밀번호를 초기화해도 Supabase Auth
         쪽 인증은 안 바뀌므로 로그인이 막히는 일이 없다.
       - Supabase Auth 자체의 세션 토큰은 supabase-js가 알아서
         localStorage의 "sb-...-auth-token" 키에 저장하는데, 이 키가
         (원래는 앱 데이터에만 쓰던) 아래 클라우드 동기화 대상에 함께
         휩쓸려 들어가면 로그인 토큰이 고스란히 kv_store에 저장되는
         사고가 나므로, isCloudSynced()에서 "sb-"로 시작하는 키는
         항상 제외한다. */
  const SUPABASE_URL = "https://zsjnuueknhfrnnfunxad.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzam51dWVrbmhmcm5uZnVueGFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NDY0NjYsImV4cCI6MjEwMzMyMjQ2Nn0.4bCMYyOcfFID71v4milpoJ8mbAHpH12lPkN72Es_Zd4";
  const cloud = (window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY)
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;
  // 로그인 아이디를 Supabase Auth용 이메일로 바꿀 때 쓰는 가짜 도메인.
  // 실제로 존재하는 도메인일 필요는 없지만(메일이 발송되지 않으니까), 한 번
  // 정하면 이후 바꾸지 말 것 — 바꾸면 기존 계정들이 전부 새 이메일로 다시
  // 가입해야 하는 것처럼 보이게 된다.
  const AUTH_EMAIL_DOMAIN = "ate1ier.local";
  // 아이디를 이메일 앞부분에 그대로 넣으면 한글・공백・특수문자가 섞인 아이디일 때
  // "invalid format" 오류가 난다(이메일 로컬파트는 그런 문자를 허용하지 않음).
  // 그래서 아이디를 그대로 쓰지 않고, 아이디를 해시(SHA-256)한 값 — 항상 영문
  // 소문자・숫자로만 이뤄진 고정 길이 문자열 — 을 이메일 앞부분으로 쓴다. 같은
  // 아이디는 항상 같은 값으로 바뀌므로 매핑은 그대로 유지된다.
  async function toAuthEmail(username) {
    const normalized = String(username || "").trim().toLowerCase();
    const hashHex = HAS_SUBTLE_CRYPTO ? await sha256Hex(normalized) : legacyHash(normalized).replace(/^-/, "n");
    return `u${hashHex}@${AUTH_EMAIL_DOMAIN}`;
  }
  // Supabase Auth의 "비밀번호"로는 사람이 로그인창에 입력하는 비밀번호를 그대로
  // 쓰지 않는다. 대신 계정마다 한 번 정해지면 바뀌지 않는 무작위 값
  // (cloudAuthSecret, 계정 레코드에 함께 저장됨)을 쓴다. 이렇게 분리해두면
  // 마스터가 나중에 "사람용 로그인 비밀번호"를 초기화해도 Supabase Auth 쪽
  // 인증은 그대로 유지되어, 초기화 직후 로그인이 막히는 일이 없다. 사람용
  // 비밀번호 확인(해시 대조)은 지금 로직 그대로 두고, 그 확인을 통과한
  // "다음 단계"로만 이 함수를 쓴다.
  function genCloudAuthSecret() {
    return genSalt() + genSalt(); // 32바이트(64자리 hex) 무작위 값
  }
  // Supabase 프로젝트의 "Confirm email"이 실수로 켜져 있으면 가입/로그인 자체는
  // 에러 없이 성공한 것처럼 보이면서도 세션(session)이 비어있는 채로 돌아온다.
  // 이 경우를 그냥 넘어가면 "로그인은 됐는데 데이터가 하나도 안 보이는" 혼란스러운
  // 상태가 되므로, 세션이 실제로 만들어졌는지까지 확인한다.
  function _hasSession(result) {
    return !!(result && result.data && result.data.session);
  }
  // 계정을 새로 만들 때: 방금 정한 cloudAuthSecret으로 Supabase Auth에 가입한다.
  async function cloudAuthSignUp(username, secret) {
    if (!cloud) return { ok: true }; // 클라우드 연결이 아예 없는 환경(오프라인 전용)이면 그냥 통과
    const email = await toAuthEmail(username);
    const result = await cloud.auth.signUp({ email, password: secret });
    if (result.error) return { ok: false, reason: result.error.message || "클라우드 인증에 실패했어요." };
    if (!_hasSession(result)) {
      return { ok: false, reason: "가입은 됐지만 세션이 생성되지 않았어요. Supabase 프로젝트의 Authentication 설정에서 \"Confirm email\"이 꺼져 있는지 확인해주세요." };
    }
    return { ok: true };
  }
  // 로그인할 때: 사람용 비밀번호 확인이 끝난 뒤 호출한다. 계정에 저장된
  // cloudAuthSecret으로 그대로 로그인하고, 아직 없으면(이 업데이트 이전에 만들어진
  // 계정이라 처음 로그인하는 경우) 지금 새로 만들어서 계정에 저장해둔다.
  async function cloudAuthSignInForAccount(account) {
    if (!cloud) return { ok: true };
    const email = await toAuthEmail(account.username);
    if (account.cloudAuthSecret) {
      const signIn = await cloud.auth.signInWithPassword({ email, password: account.cloudAuthSecret });
      if (!signIn.error && _hasSession(signIn)) return { ok: true };
    }
    const newSecret = genCloudAuthSecret();
    const signUp = await cloudAuthSignUp(account.username, newSecret);
    if (!signUp.ok) return signUp;
    const list = loadAccounts();
    const idx = list.findIndex((a) => a.id === account.id);
    if (idx !== -1) { list[idx] = { ...list[idx], cloudAuthSecret: newSecret }; saveAccounts(list); }
    return { ok: true };
  }

  // 기기(브라우저)마다 달라도 되는 값들 — 클라우드에 동기화하지 않는다.
  const CLOUD_EXCLUDED_KEYS = new Set([
    "app-theme-mode",
    "personal-app:session",
    "personal-app:master-origin",
    "personal-app:last-active", // 로그인 유지용 하트비트. 이 브라우저(탭)에서만 의미 있는
    // 값인데 빠져 있어서, 15초마다 모든 사람의 탭에서 클라우드에 저장을 시도하고 있었다.
    // 그 하트비트는 계정 구분 없이 하나의 키를 공유해서, 다른 사람이 그냥 탭을 열어두기만
    // 해도 계속 클라우드 쓰기가 발생하는 원인 중 하나였다.
  ]);
  function isCloudSynced(key) {
    if (!cloud) return false;
    if (CLOUD_EXCLUDED_KEYS.has(key)) return false;
    if (key.indexOf("personal-app:page") !== -1) return false; // 마지막으로 보던 페이지도 기기별로 달라도 됨
    if (key.indexOf("sb-") === 0) return false; // Supabase Auth 세션 토큰(이 브라우저 전용, 절대 kv_store로 보내면 안 됨)
    return true;
  }
  // 진행 중인 클라우드 저장 요청들을 추적한다. location.reload() 같이 페이지를
  // 새로고침/이동시키는 동작 직전에는 반드시 flushCloudWrites()로 이 목록이
  // 비워질 때까지 기다려야, 저장 요청이 끝나기 전에 페이지가 새로고침되면서
  // 네트워크 요청이 그대로 끊겨버리는 문제(= Supabase에 데이터가 저장 안 되는
  // 것처럼 보이는 문제)를 막을 수 있다.
  const _pendingCloudWrites = new Set();
  function _trackCloudWrite(promise) {
    _pendingCloudWrites.add(promise);
    const clear = () => _pendingCloudWrites.delete(promise);
    promise.then(clear, clear);
    return promise;
  }
  async function flushCloudWrites() {
    if (!_pendingCloudWrites.size) return;
    await Promise.allSettled(Array.from(_pendingCloudWrites));
  }

  /* ---- 동기화 상태 토스트: 오른쪽 상단에 "동기화 중… / 저장됨 / 동기화 실패"를
     잠깐 띄웠다가 자동으로 사라지게 한다. 저장이 연속으로 여러 번 일어나도
     토스트가 여러 개 쌓이지 않도록 하나의 요소를 재사용한다. */
  let _syncToastHideTimer = null;
  let _syncToastSettleTimer = null;
  let _syncHadError = false;
  function _syncToastEl() {
    let el = document.getElementById("cloud-sync-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "cloud-sync-toast";
      el.className = "cloud-sync-toast";
      document.body.appendChild(el);
    }
    return el;
  }
  function _showSyncToast(status) {
    clearTimeout(_syncToastHideTimer);
    const el = _syncToastEl();
    el.classList.remove("syncing", "saved", "error");
    el.classList.add(status, "visible");
    const iconHtml = status === "syncing"
      ? `<span class="cloud-sync-spinner"></span>`
      : status === "saved"
        ? ICON_CHECK
        : `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="5.6"/><path d="M8 5.2v3.4"/><path d="M8 11v.1"/></svg>`;
    const label = status === "syncing" ? "동기화 중…" : status === "saved" ? "저장됨" : "동기화 실패";
    el.innerHTML = `${iconHtml}<span>${label}</span>`;
    if (status !== "syncing") {
      _syncToastHideTimer = setTimeout(() => { el.classList.remove("visible"); }, status === "error" ? 4000 : 1800);
    }
  }
  // 클라우드 저장 요청이 시작될 때 호출: 즉시 "동기화 중…" 표시
  function notifyCloudSyncStart() {
    if (!cloud) return;
    clearTimeout(_syncToastSettleTimer);
    _showSyncToast("syncing");
  }
  // 클라우드 저장 요청이 끝날 때 호출: 다른 요청이 이어서 들어올 수 있으니 짧게
  // 기다렸다가, 더 진행 중인 요청이 없으면 최종 결과(저장됨/실패)를 보여준다.
  function notifyCloudSyncSettle(ok) {
    if (!cloud) return;
    if (!ok) _syncHadError = true;
    clearTimeout(_syncToastSettleTimer);
    _syncToastSettleTimer = setTimeout(() => {
      if (_pendingCloudWrites.size > 0) return;
      _showSyncToast(_syncHadError ? "error" : "saved");
      _syncHadError = false;
    }, 300);
  }

  /* ---- 동시 편집 충돌 감지 ----
     _knownServerUpdatedAt: 이 브라우저가 마지막으로 확인한 "서버에 있는" 버전의 updated_at.
       내가 저장에 성공하거나, 실시간으로 남의 변경을 확인할 때마다 갱신된다.
     _knownServerValue: 위 시점의 실제 내용(JSON 문자열). 나중에 충돌이 나면 "그때는
       이랬는데, 나는 이렇게 바꿨고, 지금 서버는 이렇게 바뀌어 있다"를 비교해서 자동으로
       합칠 수 있는 기준(base)으로 쓴다.
     _ourWriteTimestamps: 내가 방금 보낸 저장 요청의 updated_at을 key별로 기억해둔다.
       실시간 이벤트가 돌아왔을 때 "방금 내가 쓴 걸 그대로 되돌려받은 것"인지
       "남이 새로 고친 것"인지 구분하는 용도.
     _pushChains: 같은 key에 대한 저장 요청을 한 번에 하나씩만 순서대로 보내서,
       내가 연달아 두 번 저장했을 뿐인데 스스로와 충돌났다고 오판하는 걸 막는다. */
  const _knownServerUpdatedAt = {};
  const _knownServerValue = {};
  const _ourWriteTimestamps = {};
  const _pushChains = {};
  const _conflictedKeys = new Set(); // 자동 병합도 실패해서 정말로 물어봐야 하는 키
  const _fieldConflictNotices = new Map(); // key -> 자동 병합은 됐지만 "이 부분은 겹쳤어요"라고 알려줄 경로들

  /* ---- 저장 충돌 자동 병합 ----
     지금까지는 같은 key(예: 면담일지 전체, 스케줄 전체처럼 카테고리 하나를 통째로 담은
     덩어리)를 다른 사람이 "거의 동시에" 저장하면 무조건 "저장 충돌" 팝업을 띄우고
     사용자가 직접 "새로 불러오기 / 내 걸로 덮어쓰기" 중 하나를 고르게 했다. 문제는
     같은 카테고리 안에서 서로 완전히 다른 항목(예: A 상담사 면담 기록 vs B 상담사 면담
     기록)을 고친 경우에도 "같은 key"라는 이유만으로 매번 충돌로 잡혔다는 점이다.
     아래 3-way 병합은 "마지막으로 서버와 같았던 상태(base)"를 기준으로 "내가 바꾼 부분"과
     "남이 바꾼 부분"을 항목 단위(id가 있는 배열)나 키 단위(객체)로 비교해서, 서로 겹치지
     않으면 조용히 합쳐서 다시 저장한다.
     예전에는 이 병합 도중 어느 한 군데(예: 스케줄의 특정 날짜·특정 칸 하나)만 정말로
     서로 다른 값으로 동시에 고쳐져도, 그 즉시 객체 전체 병합을 MERGE_CONFLICT로 실패
     처리해서 무관한 나머지 변경사항까지 통째로 막고 팝업을 띄웠다. 지금은 그렇게 하지
     않는다 — 진짜로 겹친 "그 한 군데"만 지금 저장하려던 값으로 우선 적용(그 경로를
     conflicts 목록에 기록)하고, 나머지는 정상적으로 병합해서 저장을 계속 진행한다.
     겹친 부분이 있었다는 사실은 저장을 막는 팝업이 아니라, 확인만 하면 사라지는
     가벼운 알림 배너로 알려준다(_renderFieldConflictBanner). 병합 자체가 시작조차
     안 되는 경우(최상위 값이 애초에 id 없는 배열이나 문자열/숫자 같은 단일 값이라
     항목 단위로 쪼갤 방법이 없는 경우, 또는 서버 재조회/JSON 파싱 자체가 실패한 경우)
     에만 예전처럼 진짜 "저장 충돌" 팝업을 띄운다. */
  const MERGE_CONFLICT = Symbol("merge-conflict");
  function _deepEqual(a, b) {
    if (a === b) return true;
    if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    if (Array.isArray(a)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) if (!_deepEqual(a[i], b[i])) return false;
      return true;
    }
    const ka = Object.keys(a), kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    return ka.every((k) => Object.prototype.hasOwnProperty.call(b, k) && _deepEqual(a[k], b[k]));
  }
  // "id를 가진 객체들의 배열"인지 판단한다 (면담 기록, 상담사, 할 일처럼 각 항목을
  // 하나씩 구분해서 합칠 수 있는 목록). 순서만 있는 배열(즐겨찾기 순서 등)은 해당 없음.
  function _isIdArray(arr) {
    return Array.isArray(arr) && arr.length > 0 && arr.every((it) => it && typeof it === "object" && !Array.isArray(it) && (typeof it.id === "string" || typeof it.id === "number"));
  }
  // path: 지금 비교 중인 위치를 사람이 읽을 수 있는 경로 문자열로 나타낸 것
  //   (예: "records[2026-05-01].agentId", "monthLocks[2026-05]"). 최상위 호출에서는
  //   빈 문자열("")이고, 객체 키로 들어갈 때는 ".key"를, id 배열의 항목으로 들어갈
  //   때는 "[id]"를 이어붙인다. 진짜로 자동 병합이 안 되는 지점을 만나면 이 경로를
  //   conflicts 배열에 기록해두고, 그 지점만 "지금 저장하려는 값(local)"으로 정해서
  //   계속 진행한다 — 그래야 무관한 나머지 변경들이 그 한 지점 때문에 통째로 막히지 않는다.
  // conflicts: 위에서 기록해두는 경로들을 담을 배열(호출부에서 []로 넘겨서 결과를 받아본다).
  function _merge3(base, local, remote, path, conflicts) {
    path = path || "";
    conflicts = conflicts || [];
    if (_deepEqual(local, remote)) return local;
    if (_deepEqual(local, base)) return remote; // 나는 이 부분을 안 바꿨음 → 남의 변경을 그대로 받음
    if (_deepEqual(remote, base)) return local; // 남은 이 부분을 안 바꿨음 → 내 변경을 그대로 유지
    // 여기부터는 둘 다 바뀐 경우. 구조를 보고 항목 단위로 합칠 수 있는지 시도한다.
    if (_isIdArray(local) && _isIdArray(remote)) {
      const baseArr = Array.isArray(base) ? base : [];
      const baseById = {}; baseArr.forEach((it) => { if (it && it.id != null) baseById[it.id] = it; });
      const localById = {}; local.forEach((it) => { localById[it.id] = it; });
      const remoteById = {}; remote.forEach((it) => { remoteById[it.id] = it; });
      const ids = []; const seen = new Set();
      local.forEach((it) => { if (!seen.has(it.id)) { seen.add(it.id); ids.push(it.id); } });
      remote.forEach((it) => { if (!seen.has(it.id)) { seen.add(it.id); ids.push(it.id); } });
      const result = [];
      for (const id of ids) {
        const inBase = Object.prototype.hasOwnProperty.call(baseById, id);
        const inLocal = Object.prototype.hasOwnProperty.call(localById, id);
        const inRemote = Object.prototype.hasOwnProperty.call(remoteById, id);
        if (inLocal && inRemote) {
          const merged = _merge3(inBase ? baseById[id] : undefined, localById[id], remoteById[id], path + "[" + id + "]", conflicts);
          result.push(merged);
        } else if (inLocal && !inRemote) {
          // 남에게 없는 항목: 내가 새로 추가했거나, 남이 지운 뒤에도 나는 그대로 갖고 있음 → 유지
          result.push(localById[id]);
        } else if (!inLocal && inRemote) {
          // 나에게 없는 항목: base와 비교해서 남이 그 사이에 손대지 않은 채 나만 지웠다면
          // 삭제를 존중하고, 남이 그 사이 고치거나 새로 추가했다면 잃어버리지 않게 살려둔다.
          if (inBase && _deepEqual(baseById[id], remoteById[id])) { /* 삭제 유지 */ }
          else result.push(remoteById[id]);
        }
      }
      return result;
    }
    if (local && remote && typeof local === "object" && typeof remote === "object" && !Array.isArray(local) && !Array.isArray(remote)) {
      const baseObj = (base && typeof base === "object" && !Array.isArray(base)) ? base : {};
      const keys = new Set([...Object.keys(baseObj), ...Object.keys(local), ...Object.keys(remote)]);
      const result = {};
      for (const k of keys) {
        const inBase = Object.prototype.hasOwnProperty.call(baseObj, k);
        const inLocal = Object.prototype.hasOwnProperty.call(local, k);
        const inRemote = Object.prototype.hasOwnProperty.call(remote, k);
        if (inLocal && inRemote) {
          const merged = _merge3(inBase ? baseObj[k] : undefined, local[k], remote[k], path ? path + "." + k : k, conflicts);
          result[k] = merged;
        } else if (inLocal && !inRemote) {
          if (inBase && _deepEqual(baseObj[k], local[k])) { /* 내가 안 바꿨고 남이 지움 → 삭제 유지 */ }
          else result[k] = local[k];
        } else if (!inLocal && inRemote) {
          if (inBase && _deepEqual(baseObj[k], remote[k])) { /* 남이 안 바꿨고 내가 지움 → 삭제 유지 */ }
          else result[k] = remote[k];
        }
      }
      return result;
    }
    // 순서만 있는 배열이나 값 하나(문자열/숫자 등)를 서로 다르게 고친 경우는 자동으로
    // 합칠 방법이 없다. 이 지점이 애초에 최상위(path === "")라면 — 즉 카테고리 전체가
    // 통째로 이런 값이라 항목 단위로 쪼갤 여지가 아예 없다면 — 예전처럼 진짜 충돌로
    // 취급해서 팝업을 띄운다. 하지만 객체나 목록 "안"의 한 지점에서 이런 일이 생긴
    // 거라면, 그 지점만 지금 저장하려던 값을 우선 적용하고 기록만 남긴 뒤 나머지
    // 병합은 그대로 계속한다 — 한 군데의 진짜 충돌이 전체 저장을 막지 않도록.
    if (!path) return MERGE_CONFLICT;
    conflicts.push(path);
    return local;
  }
  // 충돌이 났을 때 자동 병합을 시도한다. 성공하면 합쳐진 JSON 문자열을, 실패하면
  // null을 돌려준다. 병합에 성공하면 이 브라우저의 화면(메모리)에도 즉시 반영해서,
  // 다시 저장을 시도하는 동안 화면이 최신 내용을 보여주게 한다.
  async function _tryAutoMergeConflict(key, localValue) {
    try {
      const { data, error } = await cloud.from("kv_store").select("value,updated_at").eq("key", key).maybeSingle();
      if (error || !data) return null;
      _knownServerUpdatedAt[key] = data.updated_at;
      let baseParsed, localParsed, remoteParsed;
      try {
        baseParsed = _knownServerValue[key] !== undefined ? JSON.parse(_knownServerValue[key]) : undefined;
        localParsed = JSON.parse(localValue);
        remoteParsed = JSON.parse(data.value);
      } catch (e) { return null; } // JSON이 아니면 자동 병합을 시도하지 않음
      const conflicts = [];
      const merged = _merge3(baseParsed, localParsed, remoteParsed, "", conflicts);
      if (merged === MERGE_CONFLICT) return null;
      const mergedStr = JSON.stringify(merged);
      _origSetItem(key, mergedStr);
      let affectedPages = [];
      try { affectedPages = _applyRemoteChangeToMemory(key); } catch (e) {}
      if (affectedPages.indexOf(state.page) !== -1 && !_hasActiveEditableFocus()) renderApp();
      // 진짜로 겹친 지점이 일부 있었다면(그래도 저장 자체는 계속 진행됐다) 팝업으로
      // 막지 않고, 확인하면 사라지는 가벼운 알림 배너로만 알려준다.
      if (conflicts.length) _noteFieldConflicts(key, conflicts);
      return mergedStr;
    } catch (e) { return null; }
  }
  function _noteFieldConflicts(key, paths) {
    let set = _fieldConflictNotices.get(key);
    if (!set) { set = new Set(); _fieldConflictNotices.set(key, set); }
    paths.forEach((p) => set.add(p));
    _renderFieldConflictBanner();
  }

  /* ---- 부분 업데이트(patch) 최적화 ----
     지금까지는 카테고리 하나(예: QA 전체, 면담일지 전체, 월별 스케줄 전체)를 조금만
     고쳐도 그 카테고리의 JSON 전체를 매번 다시 서버로 보냈다. 항목이 수백 개인
     데이터에서 체크박스 하나만 바꿔도 전체를 다시 보내는 건 낭비이므로, "이전에
     서버와 같았던 값"(_knownServerValue)과 "지금 저장하려는 값"을 비교해서 바뀐
     자리만 뽑아 서버의 kv_apply_patch 함수(supabase/kv-patch-function.sql)로 그
     자리만 patch한다.
     구조상 못 쪼개거나(예: id 없는 배열의 순서 변경, 최상위 값 자체가 문자열・숫자),
     바뀐 자리가 너무 많거나(사실상 전체 교체나 다름없음), 값 자체가 작아서 나눌
     실익이 없거나, 서버에 kv_apply_patch 함수가 아직 없으면(SQL을 안 올린 경우)
     조용히 예전처럼 "전체를 통째로 저장하는 방식"으로 넘어간다 — 이 최적화는
     실패해도 항상 안전하게 폴백하므로, SQL을 안 올려도 앱은 그대로 정상 동작한다. */
  const KV_PATCH_MIN_SIZE = 3000; // 이보다 작은 값은 그냥 통째로 보내는 게 더 간단하고 충분히 빠르다
  const KV_PATCH_MAX_OPS = 30; // 바뀐 자리가 너무 많으면 사실상 전체 교체이므로 그냥 전체로 보낸다
  // id를 가진 배열은 항목 순서가 유지될 때만 "항목 하나 = 배열 인덱스 하나"로
  // patch할 수 있다(항목 추가·삭제·순서 변경까지 patch로 표현하려면 훨씬 복잡해지므로
  // 지금은 다루지 않고 전체 교체로 넘긴다). oldVal/newVal이 완전히 같은 자리는
  // 그냥 건너뛰고, 다른 자리만 ops에 쌓는다. 분해할 수 없는 지점을 만나면 false를
  // 돌려줘서 호출부가 "이번 저장은 patch로 못 한다"는 걸 알게 한다.
  function _diffToOps(oldVal, newVal, path, ops) {
    if (_deepEqual(oldVal, newVal)) return true;
    if (_isIdArray(oldVal) && _isIdArray(newVal)) {
      const oldIds = oldVal.map((it) => it.id);
      const newIds = newVal.map((it) => it.id);
      const idsUnchanged = oldIds.length === newIds.length && oldIds.every((id, i) => id === newIds[i]);
      if (!idsUnchanged) return false;
      const oldById = {};
      oldVal.forEach((it) => { oldById[it.id] = it; });
      for (let i = 0; i < newVal.length; i++) {
        if (!_diffToOps(oldById[newVal[i].id], newVal[i], path.concat([i]), ops)) return false;
        if (ops.length > KV_PATCH_MAX_OPS) return false;
      }
      return true;
    }
    if (oldVal && newVal && typeof oldVal === "object" && typeof newVal === "object" && !Array.isArray(oldVal) && !Array.isArray(newVal)) {
      const keys = new Set([...Object.keys(oldVal), ...Object.keys(newVal)]);
      for (const k of keys) {
        const inOld = Object.prototype.hasOwnProperty.call(oldVal, k);
        const inNew = Object.prototype.hasOwnProperty.call(newVal, k);
        if (inOld && inNew) {
          if (!_diffToOps(oldVal[k], newVal[k], path.concat([k]), ops)) return false;
        } else if (!inOld && inNew) {
          ops.push({ path: path.concat([k]), value: newVal[k] });
        } else {
          ops.push({ path: path.concat([k]), remove: true });
        }
        if (ops.length > KV_PATCH_MAX_OPS) return false;
      }
      return true;
    }
    // 여기 왔다는 건 순서만 있는 배열이거나 문자열/숫자 같은 원시값이 서로 다르다는
    // 뜻 — 더는 쪼갤 수 없다. 이 지점 전체를 하나의 patch로 기록한다. 단, 이 지점이
    // 애초에 최상위(path가 빈 배열)라면 patch할 "안쪽"이 없으므로 분해 자체가 불가능.
    if (!path.length) return false;
    ops.push({ path, value: newVal });
    return true;
  }
  // 서버에 kv_apply_patch 함수가 없으면(아직 SQL을 안 올린 프로젝트) 매번 헛되이
  // 시도하지 않도록, 한 번 "없다"고 확인되면 그 이후로는 시도 자체를 건너뛴다.
  let _kvPatchRpcAvailable = true;
  async function _tryPatchPush(key, value, expected, newTs) {
    if (!cloud || !_kvPatchRpcAvailable || !expected) return null;
    if (value.length < KV_PATCH_MIN_SIZE) return null;
    if (typeof _knownServerValue[key] !== "string") return null;
    let oldParsed, newParsed;
    try {
      oldParsed = JSON.parse(_knownServerValue[key]);
      newParsed = JSON.parse(value);
    } catch (e) { return null; } // JSON이 아니면 patch를 시도하지 않고 통째로 저장
    const ops = [];
    if (!_diffToOps(oldParsed, newParsed, [], ops) || !ops.length) return null;
    try {
      const { data, error } = await cloud.rpc("kv_apply_patch", {
        p_key: key, p_ops: ops, p_new_updated_at: newTs, p_expected_updated_at: expected,
      });
      if (error) {
        // 42883 = "함수가 없음"(undefined_function) — 아직 SQL을 안 올린 경우이므로
        // 이후엔 더 시도하지 않고 곧장 기존 방식으로만 동작한다.
        if (error.code === "42883" || /function .* does not exist/i.test(error.message || "")) _kvPatchRpcAvailable = false;
        return null;
      }
      const row = Array.isArray(data) ? data[0] : data;
      return row ? { applied: !!row.applied } : null;
    } catch (e) { return null; }
  }
