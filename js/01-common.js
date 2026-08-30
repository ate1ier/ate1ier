  /* ---- 심플한 라인 아이콘 세트 (이모티콘 대체) ---- */
  const ICON_HOME = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.3 8.2 8 3.2l5.7 5"/><path d="M3.6 6.8V13h3.1v-4h2.6v4h3.1V6.8"/></svg>`;
  const ICON_CALENDAR = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="3.4" width="11" height="10.2" rx="1.6"/><path d="M2.5 6.6h11M5.6 2v2.4M10.4 2v2.4"/></svg>`;
  const ICON_NOTE = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.3 2.6h5l2.4 2.4v8.4h-7.4z"/><path d="M9.3 2.6V5h2.4"/><path d="M6 8.4h4M6 10.8h4"/></svg>`;
  const ICON_USERS = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2.1"/><path d="M2.4 13c0-2.1 1.6-3.6 3.6-3.6s3.6 1.5 3.6 3.6"/><circle cx="11.3" cy="6.4" r="1.7"/><path d="M9.9 9.6c1.7.2 3 1.5 3 3.4"/></svg>`;
  const ICON_CLIPBOARD = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3.6" y="3" width="8.8" height="11.2" rx="1.4"/><path d="M6.2 3V2.4a1 1 0 0 1 1-1h1.6a1 1 0 0 1 1 1V3"/><path d="M5.8 7.4h4.4M5.8 10h4.4"/></svg>`;
  const ICON_CHART = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.4 13.6h11.2"/><rect x="3.8" y="8.4" width="2.1" height="4.3"/><rect x="7" y="5.6" width="2.1" height="7.1"/><rect x="10.2" y="9.8" width="2.1" height="2.9"/></svg>`;
  const ICON_BOOK = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.6 3.4c1.6-.7 3.4-.7 5 0v9.2c-1.6-.7-3.4-.7-5 0V3.4Z"/><path d="M13.4 3.4c-1.6-.7-3.4-.7-5 0v9.2c1.6-.7 3.4-.7 5 0V3.4Z"/></svg>`;
  const ICON_LOGOUT = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6.8 13.2H4.4A1.4 1.4 0 0 1 3 11.8V4.2A1.4 1.4 0 0 1 4.4 2.8h2.4"/><path d="M9.6 5.4 13 8l-3.4 2.6"/><path d="M13 8H6.4"/></svg>`;
  const ICON_USER = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="5.6" r="2.6"/><path d="M3 13.2c0-2.6 2.2-4.4 5-4.4s5 1.8 5 4.4"/></svg>`;
  const ICON_SHIELD = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2.2 12.8 4v3.9c0 3.4-2.1 5.7-4.8 6.5-2.7-.8-4.8-3.1-4.8-6.5V4z"/></svg>`;
  const ICON_MOON = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12.8 9.9A5.1 5.1 0 1 1 6.1 3.2a4.1 4.1 0 0 0 6.7 6.7z"/></svg>`;
  const ICON_SUN = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="2.7"/><path d="M8 1.8v1.5M8 12.7v1.5M14.2 8h-1.5M3.3 8H1.8M12.3 3.7l-1.1 1.1M4.8 11.2l-1.1 1.1M12.3 12.3l-1.1-1.1M4.8 4.8l-1.1-1.1"/></svg>`;
  const ICON_QA = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 1.6l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z"/></svg>`;
  const ICON_PIN = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2.4 12 6l-1.9 1.9v3.5L8 13.6l-2.1-2.2V7.9L4 6z"/></svg>`;
  const ICON_CHECK = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="2.4"/><path d="M5 8.2 7 10.1 11 5.9"/></svg>`;
  const ICON_LOCK = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3.6" y="7.2" width="8.8" height="6.4" rx="1.4"/><path d="M5.4 7.2V5.2a2.6 2.6 0 0 1 5.2 0v2"/></svg>`;
  const ICON_UNLOCK = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3.6" y="7.2" width="8.8" height="6.4" rx="1.4"/><path d="M5.4 7.2V5.2a2.6 2.6 0 0 1 4.8-1.9"/></svg>`;
  const ICON_TRASH = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3.4 5h9.2"/><path d="M6.4 5V3.7c0-.4.3-.7.7-.7h1.8c.4 0 .7.3.7.7V5"/><path d="M4.8 5l.6 7.9c0 .5.5.9 1 .9h3.2c.5 0 .9-.4 1-.9L11.2 5"/><path d="M6.8 7.3v3.9M9.2 7.3v3.9"/></svg>`;
  const ICON_CAMERA = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6h2.1l1-1.5h4.8l1 1.5h2.1v6.6H2.5z"/><circle cx="8" cy="9.5" r="2.1"/></svg>`;
  const ICON_DOWNLOAD = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2.5v7.2"/><path d="M5.2 7.1 8 9.9l2.8-2.8"/><path d="M3.2 13h9.6"/></svg>`;
  const ICON_BELL = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11.2V7.4a4 4 0 0 1 8 0v3.8l1.1 1.5H2.9z"/><path d="M6.6 13.4a1.5 1.5 0 0 0 2.8 0"/></svg>`;
  const ICON_CLOCK = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="5.6"/><path d="M8 4.8V8l2.4 1.4"/></svg>`;
  const ICON_CLOSE_SM = `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>`;
  const ICON_CHEVRON_RIGHT = `<svg class="icon-emo" viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.4 10.6 8 6 12.6"/></svg>`;
  const ICON_UNDO = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4.6v3.4h3.4"/><path d="M4.6 8A5 5 0 1 1 6 11.7"/></svg>`;
  const ICON_UPLOAD = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 9.7V2.5"/><path d="M5.2 5.3 8 2.5l2.8 2.8"/><path d="M3.2 13h9.6"/></svg>`;
  const ICON_BACKUP = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.6 4.4c0-1 2.4-1.8 5.4-1.8s5.4.8 5.4 1.8-2.4 1.8-5.4 1.8-5.4-.8-5.4-1.8Z"/><path d="M2.6 4.4V8c0 1 2.4 1.8 5.4 1.8s5.4-.8 5.4-1.8V4.4"/><path d="M2.6 8v3.6c0 1 2.4 1.8 5.4 1.8s5.4-.8 5.4-1.8V8"/></svg>`;
  const ICON_REFRESH = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 8A5 5 0 1 1 11.4 4.3"/><path d="M13 2.6V6h-3.4"/></svg>`;
  /* ===================== ☁️ 클라우드 동기화 (Supabase) =====================
     계정 목록과 각 계정의 데이터(할일/메모/상담사/면담일지/스케줄/캘린더)를
     Supabase의 kv_store 테이블에도 함께 저장해서, 다른 기기·다른 사람도
     같은 데이터를 볼 수 있게 한다. 화면 테마, 내비게이션 접기 상태, 로그인
     세션처럼 "이 브라우저에서만 의미 있는" 값은 그대로 로컬(localStorage)에만
     남겨둔다.
     주의: 지금 구조는 Supabase RLS를 열어둔 간단한 방식이라, anon key만
     있으면 이 kv_store 테이블을 누구나 읽고 쓸 수 있다. 팀 내부 소규모
     사용에는 충분하지만, 외부에 공개할 서비스라면 나중에 Supabase Auth
     기반으로 더 강화해야 한다. */
  const SUPABASE_URL = "https://zsjnuueknhfrnnfunxad.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzam51dWVrbmhmcm5uZnVueGFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NDY0NjYsImV4cCI6MjEwMzMyMjQ2Nn0.4bCMYyOcfFID71v4milpoJ8mbAHpH12lPkN72Es_Zd4";
  const cloud = (window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY)
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

  // 기기(브라우저)마다 달라도 되는 값들 — 클라우드에 동기화하지 않는다.
  const CLOUD_EXCLUDED_KEYS = new Set([
    "app-theme-mode",
    "personal-app:session",
    "personal-app:master-origin",
  ]);
  function isCloudSynced(key) {
    if (!cloud) return false;
    if (CLOUD_EXCLUDED_KEYS.has(key)) return false;
    if (key.indexOf("personal-app:page") !== -1) return false; // 마지막으로 보던 페이지도 기기별로 달라도 됨
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
     _ourWriteTimestamps: 내가 방금 보낸 저장 요청의 updated_at을 key별로 기억해둔다.
       실시간 이벤트가 돌아왔을 때 "방금 내가 쓴 걸 그대로 되돌려받은 것"인지
       "남이 새로 고친 것"인지 구분하는 용도.
     _pushChains: 같은 key에 대한 저장 요청을 한 번에 하나씩만 순서대로 보내서,
       내가 연달아 두 번 저장했을 뿐인데 스스로와 충돌났다고 오판하는 걸 막는다. */
  const _knownServerUpdatedAt = {};
  const _ourWriteTimestamps = {};
  const _pushChains = {};
  const _conflictedKeys = new Set(); // 저장하려 했지만 충돌해서 보류 중인 키
  const _remoteChangedKeys = new Set(); // 남이 고쳤는데 아직 화면엔 반영 안 한 키

  const CLOUD_KEY_LABELS = [
    ["personal-schedule:data", "월별 스케줄"],
    ["personal-qa:data", "품질 관리(QA)"],
    ["personal-interviews:data", "면담일지"],
    ["personal-agents:data", "상담사 관리"],
    ["personal-notes:data", "업무 정리(메모)"],
    ["personal-calendar:todos", "캘린더/할일"],
    ["personal-app:accounts", "계정 목록"],
  ];
  function cloudKeyLabel(key) {
    const found = CLOUD_KEY_LABELS.find(([frag]) => key.indexOf(frag) !== -1);
    return found ? found[1] : "데이터";
  }

  /* ---- 배너 UI: "남이 방금 고쳤어요" / "저장 충돌" 을 화면 위쪽에 띄운다.
     화면을 그 자리에서 억지로 다시 그리면 입력 중이던 내용이 튈 수 있어서,
     실제 반영은 사용자가 버튼을 눌러 새로고침할 때만 이뤄지게 한다. */
  function _liveBannerWrap() {
    let el = document.getElementById("cloud-live-banner-wrap");
    if (!el) {
      el = document.createElement("div");
      el.id = "cloud-live-banner-wrap";
      el.className = "cloud-live-banner-wrap";
      document.body.appendChild(el);
    }
    return el;
  }
  function _renderConflictBanner() {
    let el = document.getElementById("cloud-conflict-banner");
    if (!_conflictedKeys.size) { if (el) el.remove(); return; }
    if (!el) {
      el = document.createElement("div");
      el.id = "cloud-conflict-banner";
      el.className = "cloud-live-banner conflict";
      _liveBannerWrap().prepend(el);
    }
    const labels = Array.from(_conflictedKeys).map(cloudKeyLabel).join(", ");
    el.innerHTML = `
      ${ICON_BELL}
      <div class="cloud-live-banner-body">
        <div class="cloud-live-banner-title">저장 충돌</div>
        <div class="cloud-live-banner-desc"><b>${esc(labels)}</b>을(를) 다른 관리자(또는 다른 탭)가 거의 같은 시간에 수정해서, 내가 방금 한 변경이 아직 저장되지 못했어요.</div>
        <div class="cloud-live-banner-actions">
          <button type="button" class="ghost-btn" id="cloud-conflict-reload">최신 내용 불러오기</button>
          <button type="button" class="primary-btn" id="cloud-conflict-force">내 변경으로 덮어쓰기</button>
        </div>
      </div>
    `;
    document.getElementById("cloud-conflict-reload").onclick = () => location.reload();
    document.getElementById("cloud-conflict-force").onclick = async () => {
      const keys = Array.from(_conflictedKeys);
      _conflictedKeys.clear();
      _renderConflictBanner();
      for (const k of keys) {
        try { await cloudPush(k, localStorage.getItem(k), { force: true }); } catch (e) {}
      }
    };
  }
  function _renderRemoteUpdateBanner() {
    let el = document.getElementById("cloud-remote-banner");
    if (!_remoteChangedKeys.size) { if (el) el.remove(); return; }
    if (!el) {
      el = document.createElement("div");
      el.id = "cloud-remote-banner";
      el.className = "cloud-live-banner";
      _liveBannerWrap().appendChild(el);
    }
    const labels = Array.from(_remoteChangedKeys).map(cloudKeyLabel).join(", ");
    el.innerHTML = `
      ${ICON_BELL}
      <div class="cloud-live-banner-body">
        <div class="cloud-live-banner-title">다른 관리자가 방금 수정했어요</div>
        <div class="cloud-live-banner-desc"><b>${esc(labels)}</b>이(가) 방금 바뀌었어요. 지금 화면은 예전 내용일 수 있어요.</div>
        <div class="cloud-live-banner-actions">
          <button type="button" class="primary-btn" id="cloud-remote-reload">새로고침</button>
        </div>
      </div>
      <button type="button" class="cloud-live-banner-close" id="cloud-remote-dismiss" aria-label="닫기">✕</button>
    `;
    document.getElementById("cloud-remote-reload").onclick = () => location.reload();
    document.getElementById("cloud-remote-dismiss").onclick = () => {
      _remoteChangedKeys.clear();
      _renderRemoteUpdateBanner();
    };
  }

  async function _doCloudPush(key, value, force) {
    try {
      const newTs = new Date().toISOString();
      const expected = _knownServerUpdatedAt[key];
      let wroteOk = true;
      if (expected && !force) {
        // 낙관적 동시성 제어: 마지막으로 확인한 서버 버전이 그대로일 때만 저장한다.
        // 그 사이 다른 사람이 먼저 저장해서 updated_at이 바뀌었으면 이 update는
        // 아무 행도 바꾸지 못하고 0건으로 끝난다 → 그걸로 충돌을 감지한다.
        const { data, error } = await cloud
          .from("kv_store")
          .update({ value, updated_at: newTs })
          .eq("key", key)
          .eq("updated_at", expected)
          .select("key");
        if (error) throw error;
        wroteOk = !!(data && data.length);
      } else {
        await cloud.from("kv_store").upsert({ key, value, updated_at: newTs });
      }
      if (!wroteOk) {
        _conflictedKeys.add(key);
        _renderConflictBanner();
        notifyCloudSyncSettle(false);
        return;
      }
      _conflictedKeys.delete(key);
      _renderConflictBanner();
      _knownServerUpdatedAt[key] = newTs;
      _ourWriteTimestamps[key] = newTs;
      notifyCloudSyncSettle(true);
    } catch (e) {
      /* 네트워크 문제로 실패해도 로컬 저장은 이미 되어 있어 화면은 그대로 동작 */
      notifyCloudSyncSettle(false);
    }
  }
  function cloudPush(key, value, opts) {
    if (!isCloudSynced(key)) return Promise.resolve();
    notifyCloudSyncStart();
    const force = !!(opts && opts.force);
    const prev = _pushChains[key] || Promise.resolve();
    const run = prev.then(
      () => _doCloudPush(key, value, force),
      () => _doCloudPush(key, value, force)
    );
    _pushChains[key] = run.catch(() => {});
    return _trackCloudWrite(run);
  }
  async function _doCloudDelete(key) {
    try {
      await cloud.from("kv_store").delete().eq("key", key);
      delete _knownServerUpdatedAt[key];
      _conflictedKeys.delete(key);
      _renderConflictBanner();
      notifyCloudSyncSettle(true);
    } catch (e) { notifyCloudSyncSettle(false); }
  }
  function cloudDelete(key) {
    if (!isCloudSynced(key)) return Promise.resolve();
    notifyCloudSyncStart();
    const prev = _pushChains[key] || Promise.resolve();
    const run = prev.then(() => _doCloudDelete(key), () => _doCloudDelete(key));
    _pushChains[key] = run.catch(() => {});
    return _trackCloudWrite(run);
  }
  // localStorage.setItem / removeItem을 감싸기 전에 먼저 원본 함수를 바인딩해둔다.
  // cloudHydrate()가 클라우드에서 값을 끌어올 때 이 "원본" 함수로 직접 저장해야,
  // 방금 받아온 값을 다시 클라우드로 그대로 되쏘는(불필요한 업서트 + 페이지를 열 때마다
  // "동기화 중…" 토스트가 잠깐 뜨는) 낭비를 막을 수 있다.
  const _origSetItem = localStorage.setItem.bind(localStorage);
  const _origRemoveItem = localStorage.removeItem.bind(localStorage);
  async function cloudHydrate() {
    if (!cloud) return;
    try {
      const { data, error } = await cloud.from("kv_store").select("key,value,updated_at");
      if (error || !data) return;
      data.forEach((row) => {
        try { _origSetItem(row.key, row.value); } catch (e) {}
        _knownServerUpdatedAt[row.key] = row.updated_at;
      });
    } catch (e) { /* 오프라인 등으로 실패하면 이전에 이 브라우저에 남아있던 값으로 동작 */ }
  }
  // localStorage.setItem / removeItem을 감싸서, 로컬 저장은 그대로 즉시 처리하고
  // 필요한 키만 조용히 Supabase에도 함께 저장/삭제한다 (실패해도 화면엔 영향 없음).
  localStorage.setItem = function (key, value) {
    _origSetItem(key, value);
    cloudPush(key, value);
  };
  localStorage.removeItem = function (key) {
    _origRemoveItem(key);
    cloudDelete(key);
  };
  await cloudHydrate();

  /* ---- 실시간 구독: 다른 사람(또는 다른 탭)이 저장하면 새로고침 없이도 바로 알려준다.
     화면을 그 자리에서 억지로 다시 그리면 지금 입력 중이던 내용이 튈 수 있어서,
     "바뀌었어요 + 새로고침" 배너로 알리는 정도로만 개입한다. 내가 방금 보낸 저장이
     그대로 돌아온 경우(에코)는 알림에서 제외한다. */
  if (cloud) {
    cloud
      .channel("kv_store_live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "kv_store" },
        (payload) => {
          const row = payload.new && payload.new.key ? payload.new : payload.old;
          if (!row || !row.key || !isCloudSynced(row.key)) return;
          if (payload.eventType === "DELETE") {
            delete _knownServerUpdatedAt[row.key];
            return;
          }
          if (_ourWriteTimestamps[row.key] === row.updated_at) return; // 내가 방금 쓴 것의 에코
          _knownServerUpdatedAt[row.key] = row.updated_at;
          if (localStorage.getItem(row.key) === row.value) return; // 이미 같은 내용이면 알릴 필요 없음
          _remoteChangedKeys.add(row.key);
          _renderRemoteUpdateBanner();
        }
      )
      .subscribe();
  }

  /* ===================== ↩️ 실행 취소(Undo) =====================
     스케줄 셀 상태 변경 · 일괄 적용 · 일괄 붙여넣기 · 일괄 삭제, 그리고 메모·폴더·
     상담사·면담일지·할일·캘린더 일정의 "삭제"처럼 되돌리기 어려운 조작을 하기 직전에
     관련 localStorage 값을 스냅샷으로 남겨두고, Ctrl+Z(맥은 Cmd+Z) 또는 화면 오른쪽
     아래 "되돌리기" 버튼으로 바로 직전 동작 하나를 되돌릴 수 있게 한다. 최근 30개까지
     기억한다. 메모 본문·셀 메모처럼 계속 타이핑하는 값은 스냅샷을 남기지 않는다 —
     글자 하나하나가 되돌리기 대상이 되면 오히려 불편하기 때문이다. */
  const UNDO_STACK_LIMIT = 30;
  const undoStack = [];
  // const로 선언된 state 객체(notesData 등)는 재할당할 수 없으니, 내용을 비우고
  // 새로 불러온 값으로 다시 채워 넣는 방식으로 복원한다.
  function undoRestoreObjectInPlace(obj, fresh) {
    Object.keys(obj).forEach((k) => delete obj[k]);
    Object.assign(obj, fresh);
  }
  function undoSnapshotKeys(keys) {
    return (Array.isArray(keys) ? keys : [keys]).map((key) => {
      let value = null;
      try { value = localStorage.getItem(key); } catch (e) {}
      return { key, value };
    });
  }
  // label: 되돌리기 버튼/토스트에 보여줄 동작 이름.
  // keys: 이 동작으로 바뀌는 localStorage 키(문자열 하나 또는 배열).
  // reloadFn: 스냅샷을 localStorage에 되돌려놓은 뒤, 화면이 참조하는 메모리상의
  //           state 변수(scheduleData, notesData 등)를 다시 읽어들이는 함수.
  function recordUndo(label, keys, reloadFn) {
    undoStack.push({ label, snaps: undoSnapshotKeys(keys), reloadFn });
    if (undoStack.length > UNDO_STACK_LIMIT) undoStack.shift();
    renderUndoToggle();
  }
  function performUndo() {
    const entry = undoStack.pop();
    if (!entry) { renderUndoToggle(); flashUndoToast("되돌릴 작업이 없어요", true); return; }
    entry.snaps.forEach(({ key, value }) => {
      try {
        if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, value);
      } catch (e) {}
    });
    entry.reloadFn();
    renderApp();
    flashUndoToast(`"${entry.label}" 되돌림`);
  }
  let undoToastHideTimer = null;
  function flashUndoToast(msg, isEmpty) {
    const el = document.getElementById("undo-toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle("undo-toast--empty", !!isEmpty);
    el.classList.add("visible");
    clearTimeout(undoToastHideTimer);
    undoToastHideTimer = setTimeout(() => el.classList.remove("visible"), 2200);
  }
  // 입력창에 포커스가 있을 때는 브라우저 기본 Ctrl+Z(텍스트 입력 취소)를 그대로 두고,
  // 그 외의 경우에만 앱의 되돌리기를 실행한다.
  document.addEventListener("keydown", (e) => {
    const k = e.key ? e.key.toLowerCase() : "";
    if (k !== "z" || !(e.ctrlKey || e.metaKey) || e.shiftKey || e.altKey) return;
    const active = document.activeElement;
    const tag = (active && active.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || (active && active.isContentEditable)) return;
    e.preventDefault();
    performUndo();
  });
  // 되돌리기 버튼: 테마·사용설명서 버튼과 같은 자리, 그 위에 항상 떠 있다.
  function renderUndoToggle() {
    const root = document.getElementById("undo-toggle-root");
    if (!root) return;
    const has = undoStack.length > 0;
    const lastLabel = has ? undoStack[undoStack.length - 1].label : "";
    root.innerHTML = `
      <div class="undo-toggle-wrap">
        <button class="theme-picker-btn" id="nav-undo-toggle" type="button" ${has ? "" : "disabled"}
          aria-label="되돌리기" title="${has ? `되돌리기 — ${esc(lastLabel)} (Ctrl+Z)` : "되돌릴 작업이 없어요"}">
          ${ICON_UNDO}<span class="theme-picker-label">되돌리기</span>
        </button>
      </div>
      <div class="undo-toast" id="undo-toast"></div>
    `;
    const btn = document.getElementById("nav-undo-toggle");
    if (btn) btn.onclick = () => performUndo();
  }

  /* ===================== 테마(다크/라이트/그레이/파스텔) ===================== */
  const THEME_KEY = "app-theme-mode";
  // 각 테마의 미리보기용 색(배경/포인트색)과 라벨. CSS의 실제 변수값과 맞춰서 관리한다.
  const THEME_LIST = [
    { id: "dark", label: "다크", bg: "#232327", accent: "#ec6fae" },
    { id: "light", label: "라이트", bg: "#fcfcfd", accent: "#7c5cd1" },
  ];
  function themeMeta(id) { return THEME_LIST.find((t) => t.id === id) || THEME_LIST[0]; }
  function isValidTheme(id) { return THEME_LIST.some((t) => t.id === id); }
  function getStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function applyTheme(mode) {
    if (!mode || mode === "dark") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", mode);
  }
  function getCurrentTheme() {
    return document.documentElement.getAttribute("data-theme") || "dark";
  }
  function setTheme(mode) {
    applyTheme(mode);
    try { localStorage.setItem(THEME_KEY, mode); } catch (e) { /* 저장 실패해도 화면 전환은 그대로 동작 */ }
    renderNav();
  }
  applyTheme(isValidTheme(getStoredTheme()) ? getStoredTheme() : "dark");

  /* ===================== 데스크톱 독(Dock) 펼치기/닫기 ===================== */
  function isDockOpen() {
    const nav = document.getElementById("nav");
    return !!(nav && nav.classList.contains("dock-open"));
  }
  function dockOutsideHandler(e) {
    const nav = document.getElementById("nav");
    const btn = document.getElementById("dock-toggle-btn");
    if (nav && !nav.contains(e.target) && !(btn && btn.contains(e.target))) closeDock();
  }
  function openDock() {
    const nav = document.getElementById("nav");
    const btn = document.getElementById("dock-toggle-btn");
    if (nav) nav.classList.add("dock-open");
    if (btn) { btn.classList.add("open"); btn.setAttribute("aria-expanded", "true"); btn.title = "메뉴 닫기"; btn.setAttribute("aria-label", "메뉴 닫기"); }
    setTimeout(() => document.addEventListener("mousedown", dockOutsideHandler, true), 0);
  }
  function closeDock() {
    const nav = document.getElementById("nav");
    const btn = document.getElementById("dock-toggle-btn");
    if (nav) nav.classList.remove("dock-open");
    if (btn) { btn.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); btn.title = "메뉴 열기"; btn.setAttribute("aria-label", "메뉴 열기"); }
    document.removeEventListener("mousedown", dockOutsideHandler, true);
  }
  function toggleDock() {
    if (isDockOpen()) closeDock(); else openDock();
  }
  const dockToggleBtn = document.getElementById("dock-toggle-btn");
  if (dockToggleBtn) {
    dockToggleBtn.onclick = (e) => { e.stopPropagation(); toggleDock(); };
  }

  // 다크/라이트 등 화면 테마 선택 버튼: 내비게이션(독)과 별개로 항상 화면 오른쪽 아래에 떠 있다.
  function renderThemeToggle() {
    const root = document.getElementById("theme-toggle-root");
    if (!root) return;
    root.innerHTML = `
      <div class="theme-toggle-wrap">
        <button class="theme-picker-btn" id="nav-theme-toggle" type="button" aria-haspopup="true" aria-expanded="false" aria-label="화면 테마 선택" title="화면 테마 선택">
          <span class="theme-picker-dot" style="background:${themeMeta(getCurrentTheme()).bg};"></span>
          <span class="theme-picker-label">${themeMeta(getCurrentTheme()).label}</span>
          <svg class="theme-picker-chevron" width="8" height="8" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3.5l4 4 4-4" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    `;
    const themeBtn = document.getElementById("nav-theme-toggle");
    if (themeBtn) {
      themeBtn.onclick = (e) => {
        e.stopPropagation();
        if (document.getElementById("theme-menu")) { closeThemeMenu(); return; }
        openThemeMenu(themeBtn);
      };
    }
  }

  // 사용설명서 버튼: 카테고리로 넣지 않고, 테마(다크/라이트) 버튼 바로 위에 항상 떠 있는 고정 버튼으로 표시.
  // 누르면 페이지 이동 없이 PPT처럼 옆으로 넘겨보는 사용설명서 팝업이 뜬다.
  function renderManualToggle() {
    const root = document.getElementById("manual-toggle-root");
    if (!root) return;
    root.innerHTML = `
      <div class="manual-toggle-wrap">
        <button class="theme-picker-btn" id="nav-manual-toggle" type="button" aria-haspopup="dialog" aria-label="사용설명서 열기" title="사용설명서">
          ${ICON_BOOK}
          <span class="theme-picker-label">사용설명서</span>
        </button>
      </div>
    `;
    const manualBtn = document.getElementById("nav-manual-toggle");
    if (manualBtn) manualBtn.onclick = () => openManualModal();
  }

  /* ===================== 데이터 백업/복원 =====================
     상담사 정보 · 스케줄 · 면담일지 · QA 점수 · 메모 · 캘린더처럼
     "acct:{계정id}:" 접두어가 붙어 저장되는 이 계정 소유의 데이터를
     JSON 파일로 내보내고 다시 불러올 수 있게 한다.
     가져오기는 파일 안에 어떤 계정 이름이 적혀 있었든 상관없이 항상
     "지금 로그인한 계정"의 접두어로 다시 저장한다 — 그래야 다른 계정에서
     내보낸 백업이라도 가져오는 즉시 지금 계정 소유가 되고, 다른 계정의
     데이터에는 절대 영향을 주지 않는다. */
  const BACKUP_CATEGORIES = [
    { key: "calendar", label: "캘린더 · 할 일", icon: ICON_CALENDAR, keyPrefixes: ["personal-calendar:"] },
    { key: "notes", label: "업무 정리(메모)", icon: ICON_NOTE, keyPrefixes: ["personal-notes:"] },
    { key: "agents", label: "상담사 관리", icon: ICON_USERS, keyPrefixes: ["personal-agents:"] },
    { key: "interviews", label: "면담일지", icon: ICON_CLIPBOARD, keyPrefixes: ["personal-interviews:"] },
    { key: "qa", label: "품질 관리(QA)", icon: ICON_QA, keyPrefixes: ["personal-qa:"] },
    { key: "schedule", label: "월별 스케줄", icon: ICON_CHART, keyPrefixes: ["personal-schedule:"] },
  ];
  function backupAllPrefixes() {
    return BACKUP_CATEGORIES.reduce((acc, c) => acc.concat(c.keyPrefixes), []);
  }
  // 지금 로그인한 계정 소유의 키만 모아서, "acct:{id}:" 접두어를 뗀 상대 키 기준으로 돌려준다.
  function collectAccountStorageEntries(prefixFilter) {
    const acctPrefix = `acct:${CURRENT_ACCOUNT_ID}:`;
    const entries = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k || k.indexOf(acctPrefix) !== 0) continue;
        const rel = k.slice(acctPrefix.length);
        if (prefixFilter && !prefixFilter.some((p) => rel.indexOf(p) === 0)) continue;
        const v = localStorage.getItem(k);
        if (v !== null) entries[rel] = v;
      }
    } catch (e) { /* localStorage 접근 실패 시 빈 결과로 진행 */ }
    return entries;
  }
  function buildBackupPayload(categoryKey) {
    const cat = categoryKey === "all" ? null : BACKUP_CATEGORIES.find((c) => c.key === categoryKey);
    const entries = collectAccountStorageEntries(cat ? cat.keyPrefixes : backupAllPrefixes());
    return {
      app: "업무 종합 관리",
      backupVersion: 1,
      exportedAt: new Date().toISOString(),
      accountName: CURRENT_ACCOUNT_NAME,
      category: categoryKey,
      categoryLabel: cat ? cat.label : "전체 데이터",
      data: entries,
    };
  }
  function backupFilenameStamp() {
    const d = new Date();
    return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}-${pad2(d.getHours())}${pad2(d.getMinutes())}`;
  }
  function sanitizeFilenamePart(s) {
    return String(s).replace(/[\\/:*?"<>|]/g, "_");
  }
  function downloadBackup(categoryKey) {
    const payload = buildBackupPayload(categoryKey);
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `백업_${sanitizeFilenamePart(CURRENT_ACCOUNT_NAME)}_${sanitizeFilenamePart(payload.categoryLabel)}_${backupFilenameStamp()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    flashBackupStatus(`"${payload.categoryLabel}" 백업 파일을 내려받았어요.`);
  }
  function readBackupFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try { resolve(JSON.parse(reader.result)); }
        catch (e) { reject(e); }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file, "utf-8");
    });
  }
  // restrictCategory가 있으면 그 카테고리에 속한 키만 반영하고(다른 카테고리 값은
  // 파일 안에 섞여 있어도 무시), 없으면(=전체 가져오기) 알려진 모든 카테고리의
  // 키를 반영한다. 백업 파일에 적힌 계정 이름 등은 참고용일 뿐 저장에는 쓰지
  // 않고, 항상 "지금 로그인한 계정" 접두어로만 써서 다른 계정에는 영향이 없다.
  async function applyBackupPayload(payload, restrictCategory) {
    if (!payload || typeof payload !== "object" || !payload.data || typeof payload.data !== "object") {
      return { ok: false, reason: "올바른 백업 파일이 아니에요." };
    }
    const allowedPrefixes = restrictCategory
      ? ((BACKUP_CATEGORIES.find((c) => c.key === restrictCategory) || {}).keyPrefixes || [])
      : backupAllPrefixes();
    const acctPrefix = `acct:${CURRENT_ACCOUNT_ID}:`;
    let count = 0;
    Object.keys(payload.data).forEach((relKey) => {
      if (!allowedPrefixes.some((p) => relKey.indexOf(p) === 0)) return;
      const value = payload.data[relKey];
      if (typeof value !== "string") return;
      try { localStorage.setItem(acctPrefix + relKey, value); count += 1; } catch (e) {}
    });
    if (count === 0) return { ok: false, reason: "이 백업 파일에서 가져올 수 있는 데이터를 찾지 못했어요." };
    await flushCloudWrites();
    return { ok: true, count };
  }

  // 백업 버튼: 사용설명서 버튼 바로 위에 항상 떠 있는 고정 버튼으로 표시.
  function renderBackupToggle() {
    const root = document.getElementById("backup-toggle-root");
    if (!root) return;
    root.innerHTML = `
      <div class="manual-toggle-wrap">
        <button class="theme-picker-btn" id="nav-backup-toggle" type="button" aria-haspopup="dialog" aria-label="데이터 백업/복원 열기" title="데이터 백업/복원">
          ${ICON_BACKUP}
          <span class="theme-picker-label">데이터 백업</span>
        </button>
      </div>
    `;
    const backupBtn = document.getElementById("nav-backup-toggle");
    if (backupBtn) backupBtn.onclick = () => openBackupModal();
  }

  // 새로고침 버튼: 백업 버튼이 있던 오른쪽 아래 자리에 항상 떠 있는 고정 버튼으로 표시.
  // 다른 사람이 다른 기기/탭에서 저장한 내용을 서버에서 다시 받아오기 위한 용도로,
  // 누른 시점에 보고 있던 페이지(홈/상담사 관리 등)는 그대로 유지된다.
  function renderRefreshToggle() {
    const root = document.getElementById("refresh-toggle-root");
    if (!root) return;
    root.innerHTML = `
      <div class="manual-toggle-wrap">
        <button class="theme-picker-btn" id="nav-refresh-toggle" type="button" aria-label="최신 내용으로 새로고침" title="최신 내용으로 새로고침">
          ${ICON_REFRESH}
          <span class="theme-picker-label">새로고침</span>
        </button>
      </div>
    `;
    const refreshBtn = document.getElementById("nav-refresh-toggle");
    if (refreshBtn) refreshBtn.onclick = () => performServerRefresh();
  }
  function closeBackupModal() {
    const existing = document.getElementById("backup-modal-overlay");
    if (existing) existing.remove();
  }
  function flashBackupStatus(msg, isError) {
    const el = document.getElementById("backup-modal-status");
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle("error", !!isError);
  }
  function backupCategoryRowHtml(cat) {
    return `
      <div class="backup-cat-row">
        <div class="backup-cat-label">${cat.icon} ${esc(cat.label)}</div>
        <div class="backup-cat-actions">
          <button type="button" class="ghost-btn" data-backup-export="${cat.key}">${ICON_DOWNLOAD} 내보내기</button>
          <button type="button" class="ghost-btn" data-backup-import="${cat.key}">${ICON_UPLOAD} 가져오기</button>
        </div>
      </div>
    `;
  }
  // 파일 선택창을 열기 직전에 "이번 가져오기가 어느 카테고리 대상인지"를 여기에
  // 담아두고, 파일이 선택되면 이 값을 기준으로 어떤 키만 반영할지 정한다.
  let backupImportRestrict = null;
  function openBackupModal() {
    closeBackupModal();
    const overlay = document.createElement("div");
    overlay.id = "backup-modal-overlay";
    overlay.className = "manual-modal-overlay";
    overlay.innerHTML = `
      <div class="manual-modal-box backup-modal-box" role="dialog" aria-modal="true" aria-label="데이터 백업/복원">
        <div class="manual-modal-head">
          <span>${ICON_BACKUP} 데이터 백업/복원</span>
          <button type="button" class="manual-modal-close" id="backup-modal-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="manual-modal-body">
          <p class="backup-modal-desc">
            상담사 정보 · 월별 스케줄 · 면담일지 · QA 점수 · 업무 정리(메모) · 캘린더 등
            <b>"${esc(CURRENT_ACCOUNT_NAME)}"</b> 계정의 데이터를 JSON 파일로 내려받거나 다시 불러올 수 있어요.
            가져오기는 파일이 원래 어느 계정에서 만들어졌든 상관없이 항상 <b>지금 로그인한 이 계정에만</b>
            적용되고, 다른 계정의 데이터에는 전혀 영향을 주지 않아요.
          </p>
          <div class="backup-section">
            <div class="backup-section-title">전체 데이터</div>
            <div class="backup-all-actions">
              <button type="button" class="primary-btn" id="backup-export-all">${ICON_DOWNLOAD} 전체 백업 다운로드</button>
              <button type="button" class="ghost-btn" id="backup-import-all">${ICON_UPLOAD} 전체 백업 가져오기</button>
            </div>
          </div>
          <div class="backup-section">
            <div class="backup-section-title">카테고리별 백업</div>
            <div class="backup-cat-list">${BACKUP_CATEGORIES.map(backupCategoryRowHtml).join("")}</div>
          </div>
          <div class="status backup-modal-status" id="backup-modal-status"></div>
          <input type="file" accept="application/json" id="backup-file-input" style="display:none;">
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeBackupModal(); };
    document.getElementById("backup-modal-close-x").onclick = () => closeBackupModal();

    const fileInput = document.getElementById("backup-file-input");
    fileInput.onchange = async () => {
      const file = fileInput.files && fileInput.files[0];
      fileInput.value = "";
      if (!file) return;
      const restrict = backupImportRestrict;
      const restrictLabel = restrict
        ? ((BACKUP_CATEGORIES.find((c) => c.key === restrict) || {}).label || restrict)
        : "전체 데이터";
      let payload;
      try { payload = await readBackupFile(file); }
      catch (e) { flashBackupStatus("파일을 읽을 수 없어요. 올바른 백업 JSON 파일인지 확인해주세요.", true); return; }
      const proceed = window.confirm(
        `"${restrictLabel}" 데이터를 이 백업 파일 내용으로 덮어쓸까요?\n(지금 로그인한 계정 "${CURRENT_ACCOUNT_NAME}"에만 적용되고, 다른 계정에는 영향이 없어요)`
      );
      if (!proceed) return;
      flashBackupStatus("가져오는 중…");
      const result = await applyBackupPayload(payload, restrict);
      if (!result.ok) { flashBackupStatus(result.reason, true); return; }
      flashBackupStatus(`${result.count}개 항목을 가져왔어요. 화면을 새로고침할게요…`);
      setTimeout(() => location.reload(), 700);
    };

    document.getElementById("backup-export-all").onclick = () => downloadBackup("all");
    document.getElementById("backup-import-all").onclick = () => {
      backupImportRestrict = null;
      fileInput.click();
    };
    overlay.querySelectorAll("[data-backup-export]").forEach((btn) => {
      btn.onclick = () => downloadBackup(btn.getAttribute("data-backup-export"));
    });
    overlay.querySelectorAll("[data-backup-import]").forEach((btn) => {
      btn.onclick = () => {
        backupImportRestrict = btn.getAttribute("data-backup-import");
        fileInput.click();
      };
    });
  }

  // 테마 선택 팝오버(사이드바 하단의 테마 버튼을 누르면 뜨는 목록)
  function closeThemeMenu() {
    const existing = document.getElementById("theme-menu");
    if (existing) existing.remove();
    document.removeEventListener("mousedown", themeMenuOutsideHandler, true);
    const btn = document.getElementById("nav-theme-toggle");
    if (btn) { btn.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
  }
  function themeMenuOutsideHandler(e) {
    const menu = document.getElementById("theme-menu");
    const btn = document.getElementById("nav-theme-toggle");
    if (menu && !menu.contains(e.target) && !(btn && btn.contains(e.target))) closeThemeMenu();
  }
  function openThemeMenu(anchorEl) {
    closeThemeMenu();
    anchorEl.classList.add("open");
    anchorEl.setAttribute("aria-expanded", "true");
    const rect = anchorEl.getBoundingClientRect();
    const current = getCurrentTheme();
    const menu = document.createElement("div");
    menu.id = "theme-menu";
    menu.className = "theme-menu";
    menu.innerHTML = THEME_LIST.map((t) => `
      <button type="button" class="theme-menu-item ${t.id === current ? "active" : ""}" data-theme-id="${t.id}">
        <span class="theme-menu-dot" style="background:${t.bg};"></span>
        <span class="theme-menu-name">${t.label}</span>
        ${t.id === current ? '<span class="theme-menu-check">✓</span>' : ""}
      </button>
    `).join("");
    document.body.appendChild(menu);
    const menuRect = menu.getBoundingClientRect();
    let top = rect.top - menuRect.height - 8;
    if (top < 8) top = rect.bottom + 8;
    let left = rect.left;
    if (left + menuRect.width > window.innerWidth - 8) left = window.innerWidth - menuRect.width - 8;
    menu.style.top = `${Math.max(8, top)}px`;
    menu.style.left = `${Math.max(8, left)}px`;
    menu.querySelectorAll("[data-theme-id]").forEach((btn) => {
      btn.onclick = () => {
        setTheme(btn.getAttribute("data-theme-id"));
        closeThemeMenu();
      };
    });
    setTimeout(() => document.addEventListener("mousedown", themeMenuOutsideHandler, true), 0);
  }

  /* ===================== 공통 유틸 ===================== */
  function pad2(n) { return String(n).padStart(2, "0"); }
  function esc(str) {
    const d = document.createElement("div");
    d.textContent = str == null ? "" : String(str);
    return d.innerHTML;
  }
  function genId() { return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

  /* ===================== 로그인(로컬 전용) 모듈 =====================
     지금은 서버 없이 이 브라우저의 localStorage에만 계정 정보를 저장하는
     "로컬 프로토타입" 로그인입니다. 서버가 없는 한 브라우저 안의 어떤 값도
     완전히 안전할 수는 없으므로, 진짜 보안이 필요해지면 반드시 서버 기반
     인증(암호화된 비밀번호 저장, 세션/토큰 검증 등)으로 교체해야 합니다.
     그래도 비밀번호는 브라우저 내장 SubtleCrypto로 계정마다 다른 salt를
     붙여 SHA-256으로 해시해 저장해서, 평문은 물론 예전의 단순 해시보다
     레인보우테이블·충돌 공격에 훨씬 강하게 만들어둡니다. 계정별 데이터는
     저장 키 앞에 "acct:{계정ID}:" 접두어를 붙여 브라우저 안에서만 서로
     분리해둡니다. */
  const ACCOUNTS_KEY = "personal-app:accounts";
  const SESSION_KEY = "personal-app:session";
  // 마스터 계정이 다른 계정을 "들어가서 보기" 했을 때, 원래(마스터) 계정으로
  // 돌아올 수 있도록 원래 세션을 잠깐 보관해두는 키.
  const MASTER_ORIGIN_KEY = "personal-app:master-origin";
  // 로그인한 시각을 기록해두는 키. 이 시각으로부터 SESSION_DURATION_MS가
  // 지나면 자동으로 로그아웃시킨다.
  const LOGIN_AT_KEY = "personal-app:login-at";
  const SESSION_DURATION_MS = 5 * 60 * 60 * 1000; // 5시간

  const HAS_SUBTLE_CRYPTO = !!(window.crypto && window.crypto.subtle);
  // 예전(salt 없는 단순 해시) 방식 — 신규 계정에는 쓰지 않고, 예전에 만든
  // 계정을 로그인할 때 한 번 확인해서 새 방식으로 자동 업그레이드하는 용도로만 남겨둔다.
  function legacyHash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return String(h);
  }
  function genSalt() {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  async function sha256Hex(str) {
    const bytes = new TextEncoder().encode(str);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // salt를 붙여 비밀번호를 해시한다. SubtleCrypto를 쓸 수 없는 예외적인 환경에서는
  // (로그인 자체가 막히지 않도록) 예전 단순 해시로 대신한다.
  async function hashPassword(password, salt) {
    if (!HAS_SUBTLE_CRYPTO) return legacyHash(`${salt}:${password}`);
    return sha256Hex(`${salt}:${password}`);
  }
  function loadAccounts() {
    try {
      const raw = localStorage.getItem(ACCOUNTS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }
  function saveAccounts(list) {
    try { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list)); } catch (e) {}
  }
  function getSession() {
    try { return localStorage.getItem(SESSION_KEY); } catch (e) { return null; }
  }
  function setSession(accountId) {
    try { localStorage.setItem(SESSION_KEY, accountId); } catch (e) {}
  }
  function clearSession() {
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
  }
  function getMasterOrigin() {
    try { return localStorage.getItem(MASTER_ORIGIN_KEY); } catch (e) { return null; }
  }
  function setMasterOrigin(accountId) {
    try { localStorage.setItem(MASTER_ORIGIN_KEY, accountId); } catch (e) {}
  }
  function clearMasterOrigin() {
    try { localStorage.removeItem(MASTER_ORIGIN_KEY); } catch (e) {}
  }
  function getLoginAt() {
    try { return localStorage.getItem(LOGIN_AT_KEY); } catch (e) { return null; }
  }
  function setLoginAt(timestamp) {
    try { localStorage.setItem(LOGIN_AT_KEY, String(timestamp)); } catch (e) {}
  }
  function clearLoginAt() {
    try { localStorage.removeItem(LOGIN_AT_KEY); } catch (e) {}
  }
  // 자동 로그아웃까지 남은 시간(ms)을 계산한다. 로그인 시각 기록이 없으면 0으로 본다.
  function getSessionRemainingMs() {
    const loginAt = Number(getLoginAt());
    if (!loginAt) return 0;
    return SESSION_DURATION_MS - (Date.now() - loginAt);
  }
  function formatRemainingTime(ms) {
    if (ms <= 0) return "0분";
    const totalMinutes = Math.floor(ms / 60000);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h > 0) return `${h}시간 ${m}분`;
    return `${m}분`;
  }
  function updateSessionRemainingDisplay() {
    const el = document.getElementById("global-session-badge");
    if (el) {
      el.innerHTML = `${ICON_CLOCK} ${formatRemainingTime(getSessionRemainingMs())}`;
      el.classList.add("visible");
    }
    updateSessionWarningToast();
  }

  // ---- 자동 로그아웃 임박(남은 시간 30분 이하) 알림 토스트 ----
  const SESSION_WARNING_THRESHOLD_MS = 30 * 60 * 1000; // 30분
  // 사용자가 토스트를 닫으면, 같은 로그인 회차(연장 전까지)에는 다시 띄우지 않는다.
  let sessionWarningDismissed = false;

  function hideSessionWarningToast() {
    const root = document.getElementById("session-warning-toast-root");
    if (root) root.innerHTML = "";
  }

  function extendSessionFromToast() {
    setLoginAt(Date.now());
    sessionWarningDismissed = false;
    hideSessionWarningToast();
    updateSessionRemainingDisplay();
  }

  function renderSessionWarningToast(remainingMs) {
    const root = document.getElementById("session-warning-toast-root");
    if (!root) return;
    root.innerHTML = `
      <div class="session-warning-toast" role="alert">
        <span class="session-toast-icon">${ICON_CLOCK}</span>
        <div class="session-toast-body">
          <div class="session-toast-title">곧 자동 로그아웃돼요</div>
          <div class="session-toast-desc">${formatRemainingTime(remainingMs)} 후 자동으로 로그아웃됩니다. 계속 사용하시려면 연장해주세요.</div>
          <div class="session-toast-actions">
            <button class="session-toast-extend-btn" id="session-toast-extend-btn" type="button">연장하기</button>
            <button class="session-toast-dismiss-btn" id="session-toast-dismiss-btn" type="button">나중에</button>
          </div>
        </div>
        <button class="session-toast-close-btn" id="session-toast-close-btn" type="button" title="닫기" aria-label="닫기">${ICON_CLOSE_SM}</button>
      </div>
    `;
    const extendBtn = document.getElementById("session-toast-extend-btn");
    if (extendBtn) extendBtn.onclick = extendSessionFromToast;
    const dismissBtn = document.getElementById("session-toast-dismiss-btn");
    if (dismissBtn) dismissBtn.onclick = () => { sessionWarningDismissed = true; hideSessionWarningToast(); };
    const closeBtn = document.getElementById("session-toast-close-btn");
    if (closeBtn) closeBtn.onclick = () => { sessionWarningDismissed = true; hideSessionWarningToast(); };
  }

  function updateSessionWarningToast() {
    if (CURRENT_ACCOUNT_IS_MASTER) { hideSessionWarningToast(); return; }
    const remaining = getSessionRemainingMs();
    if (remaining > 0 && remaining <= SESSION_WARNING_THRESHOLD_MS && !sessionWarningDismissed) {
      renderSessionWarningToast(remaining);
    } else {
      hideSessionWarningToast();
    }
  }
  // 마스터 계정이 다른 계정으로 들어가서 볼 때 쓰는 함수.
  // 지금 세션(마스터)을 origin으로 저장해두고, 세션을 대상 계정으로 바꾼다.
  async function masterEnterAccount(targetAccountId) {
    const origin = getMasterOrigin() || getSession();
    if (origin) setMasterOrigin(origin);
    setSession(targetAccountId);
    await flushCloudWrites();
    location.reload();
  }
  // 마스터가 다른 계정을 보다가 원래 마스터 계정으로 돌아간다.
  async function masterReturnToOrigin() {
    const origin = getMasterOrigin();
    if (!origin) return;
    clearMasterOrigin();
    setSession(origin);
    await flushCloudWrites();
    location.reload();
  }
  // 계정을 삭제한다. 현재 로그인 중인 계정이거나, 남은 계정이 1개뿐이면 삭제하지 않는다.
  // 계정을 지울 때 그 계정의 개인 데이터(acct:{id}: 로 시작하는 저장 값)도 함께 정리한다.
  function deleteAccount(accountId) {
    const list = loadAccounts();
    if (list.length <= 1) return { ok: false, reason: "마지막 남은 계정은 삭제할 수 없어요." };
    if (accountId === CURRENT_ACCOUNT_ID) return { ok: false, reason: "현재 로그인 중인 계정은 삭제할 수 없어요." };
    const next = list.filter((a) => a.id !== accountId);
    saveAccounts(next);
    try {
      const prefix = `acct:${accountId}:`;
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.indexOf(prefix) === 0) keysToRemove.push(k);
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) { /* 데이터 정리 실패해도 계정 삭제 자체는 유지 */ }
    return { ok: true };
  }
  // 마스터가 다른 계정의 비밀번호를 새 비밀번호로 초기화한다.
  async function resetAccountPassword(accountId, newPassword) {
    if (!newPassword || newPassword.length < 4) return { ok: false, reason: "비밀번호는 4자 이상으로 만들어주세요." };
    const list = loadAccounts();
    const idx = list.findIndex((a) => a.id === accountId);
    if (idx === -1) return { ok: false, reason: "계정을 찾을 수 없어요." };
    const salt = genSalt();
    const passwordHash = await hashPassword(newPassword, salt);
    list[idx] = { ...list[idx], salt, passwordHash };
    saveAccounts(list);
    return { ok: true };
  }
  // 마스터가 다른 계정의 이름(아이디)을 바꾼다. 이미 쓰이고 있는 이름으로는 바꿀 수 없다.
  function renameAccount(accountId, newUsername) {
    const trimmed = (newUsername || "").trim();
    if (!trimmed) return { ok: false, reason: "계정 이름을 입력해주세요." };
    const list = loadAccounts();
    const idx = list.findIndex((a) => a.id === accountId);
    if (idx === -1) return { ok: false, reason: "계정을 찾을 수 없어요." };
    const norm = trimmed.toLowerCase();
    const dup = list.find((a) => a.id !== accountId && a.username.toLowerCase() === norm);
    if (dup) return { ok: false, reason: "이미 사용 중인 계정 이름이에요." };
    list[idx] = { ...list[idx], username: trimmed };
    saveAccounts(list);
    return { ok: true };
  }
  function findAccountByUsername(username) {
    const norm = username.trim().toLowerCase();
    return loadAccounts().find((a) => a.username.toLowerCase() === norm) || null;
  }
  function findAccountById(id) {
    return loadAccounts().find((a) => a.id === id) || null;
  }
  async function logout() {
    clearSession();
    clearMasterOrigin();
    clearLoginAt();
    await flushCloudWrites();
    location.reload();
  }

  function renderLoginScreen() {
    const nav = document.getElementById("nav");
    if (nav) nav.innerHTML = "";
    const root = document.getElementById("page-inner");
    root.classList.remove("wide");
    const uiState = { tab: loadAccounts().length ? "login" : "signup", error: "" };

    function draw() {
      const accounts = loadAccounts();
      const hasMaster = accounts.some((a) => a.isMaster);
      root.innerHTML = `
        <div class="login-shell">
          <div class="login-card">
            <div class="login-title">업무 종합 관리</div>
            <div class="login-sub">계정마다 캘린더·메모·상담사·스케줄 데이터가 따로 저장돼요.<br>(현재는 이 브라우저 안에만 로컬로 저장되는 시험 버전이에요)</div>
            <div class="login-tabs">
              <button class="login-tab ${uiState.tab === "login" ? "active" : ""}" data-tab="login">로그인</button>
              <button class="login-tab ${uiState.tab === "signup" ? "active" : ""}" data-tab="signup">계정 만들기</button>
            </div>
            ${uiState.error ? `<div class="login-error">${esc(uiState.error)}</div>` : ""}
            ${uiState.tab === "login" ? `
              <form class="login-form" id="login-form">
                <label class="login-field"><span>아이디</span>
                  <input class="add-input" id="login-username" autocomplete="username" placeholder="아이디">
                </label>
                <label class="login-field"><span>비밀번호</span>
                  <input class="add-input" id="login-password" type="password" autocomplete="current-password" placeholder="비밀번호">
                </label>
                <button type="submit" class="primary-btn login-submit">로그인</button>
              </form>
              <div class="login-accounts-hint">${accounts.length ? `등록된 계정: ${accounts.map((a) => esc(a.username)).join(", ")}` : `아직 등록된 계정이 없어요. "계정 만들기" 탭에서 먼저 계정을 만들어주세요.`}</div>
            ` : `
              <form class="login-form" id="signup-form">
                <label class="login-field"><span>아이디</span>
                  <input class="add-input" id="signup-username" autocomplete="username" placeholder="아이디">
                </label>
                <label class="login-field"><span>비밀번호</span>
                  <input class="add-input" id="signup-password" type="password" autocomplete="new-password" placeholder="비밀번호 (4자 이상)">
                </label>
                <label class="login-field"><span>비밀번호 확인</span>
                  <input class="add-input" id="signup-password2" type="password" autocomplete="new-password" placeholder="비밀번호 확인">
                </label>
                ${!hasMaster ? `
                  <label class="login-master-check">
                    <input type="checkbox" id="signup-master">
                    <span>이 계정을 마스터 계정으로 만들기 <span class="login-master-hint">(마스터 계정은 다른 모든 계정을 선택해서 들어가보고, 삭제할 수 있어요. 아직 마스터 계정이 없어서 지금만 선택할 수 있어요.)</span></span>
                  </label>
                ` : ""}
                <button type="submit" class="primary-btn login-submit">계정 만들고 시작하기</button>
              </form>
            `}
          </div>
        </div>
      `;

      root.querySelectorAll("[data-tab]").forEach((btn) => {
        btn.onclick = () => { uiState.tab = btn.getAttribute("data-tab"); uiState.error = ""; draw(); };
      });

      const loginForm = document.getElementById("login-form");
      if (loginForm) {
        loginForm.onsubmit = async (e) => {
          e.preventDefault();
          const username = document.getElementById("login-username").value.trim();
          const password = document.getElementById("login-password").value;
          if (!username || !password) { uiState.error = "아이디와 비밀번호를 입력해주세요."; draw(); return; }
          const account = findAccountByUsername(username);
          if (!account) {
            uiState.error = "아이디 또는 비밀번호가 올바르지 않아요.";
            draw();
            return;
          }
          let ok;
          if (account.salt) {
            ok = account.passwordHash === (await hashPassword(password, account.salt));
          } else {
            // salt가 없는 예전 계정: 예전 방식으로 한 번 확인하고, 맞으면 새 방식(salt+SHA-256)으로 조용히 업그레이드한다.
            ok = account.passwordHash === legacyHash(password);
            if (ok) {
              const salt = genSalt();
              const passwordHash = await hashPassword(password, salt);
              const list = loadAccounts();
              const idx = list.findIndex((a) => a.id === account.id);
              if (idx !== -1) { list[idx] = { ...list[idx], salt, passwordHash }; saveAccounts(list); }
            }
          }
          if (!ok) {
            uiState.error = "아이디 또는 비밀번호가 올바르지 않아요.";
            draw();
            return;
          }
          setSession(account.id);
          setLoginAt(Date.now());
          await flushCloudWrites();
          location.reload();
        };
      }
      const signupForm = document.getElementById("signup-form");
      if (signupForm) {
        signupForm.onsubmit = async (e) => {
          e.preventDefault();
          const username = document.getElementById("signup-username").value.trim();
          const password = document.getElementById("signup-password").value;
          const password2 = document.getElementById("signup-password2").value;
          if (!username || !password) { uiState.error = "아이디와 비밀번호를 입력해주세요."; draw(); return; }
          if (password.length < 4) { uiState.error = "비밀번호는 4자 이상으로 만들어주세요."; draw(); return; }
          if (password !== password2) { uiState.error = "비밀번호 확인이 일치하지 않아요."; draw(); return; }
          if (findAccountByUsername(username)) { uiState.error = "이미 사용 중인 아이디예요."; draw(); return; }
          const accountsList = loadAccounts();
          const wantsMaster = !accountsList.some((a) => a.isMaster) && !!document.getElementById("signup-master") && document.getElementById("signup-master").checked;
          const salt = genSalt();
          const passwordHash = await hashPassword(password, salt);
          const newAccount = { id: genId(), username, salt, passwordHash, createdAt: new Date().toISOString(), isMaster: wantsMaster };
          accountsList.push(newAccount);
          saveAccounts(accountsList);
          setSession(newAccount.id);
          setLoginAt(Date.now());
          await flushCloudWrites();
          location.reload();
        };
      }
    }

    draw();
  }

  // 세션 확인: 로그인 상태가 아니면 로그인 화면만 그리고 나머지 앱 코드는 실행하지 않는다.
  const _session = getSession();
  let _account = _session ? findAccountById(_session) : null;
  // 로그인한 지 5시간이 지났으면 자동으로 로그아웃 처리한다.
  if (_account) {
    const _loginAt = Number(getLoginAt());
    if (!_loginAt || Date.now() - _loginAt >= SESSION_DURATION_MS) {
      clearSession();
      clearMasterOrigin();
      clearLoginAt();
      _account = null;
    }
  }
  if (!_account) {
    renderLoginScreen();
    return;
  }
  const CURRENT_ACCOUNT_ID = _account.id;
  const CURRENT_ACCOUNT_NAME = _account.username;
  const CURRENT_ACCOUNT_IS_MASTER = !!_account.isMaster;
  // 마스터 계정이 다른 계정으로 들어와서 보고 있는 중인지 확인 (원래 마스터 계정 정보가 남아있는지로 판단)
  const _masterOriginId = getMasterOrigin();
  const MASTER_ORIGIN_ACCOUNT = _masterOriginId && _masterOriginId !== CURRENT_ACCOUNT_ID ? findAccountById(_masterOriginId) : null;
  if (_masterOriginId && !MASTER_ORIGIN_ACCOUNT) clearMasterOrigin();
  // 계정별로 데이터를 분리하기 위해 저장 키 앞에 이 접두어를 붙인다.
  function acctKey(key) { return `acct:${CURRENT_ACCOUNT_ID}:${key}`; }

  // 화면 오른쪽 아래 "새로고침" 버튼을 누르면, 다른 사람/다른 기기에서 바뀐 내용을
  // 서버에서 다시 받아오기 위해 페이지를 실제로 다시 불러온다(location.reload()).
  // 다만 이 경우에는 평소처럼 "홈"으로 돌아가지 않고, 누르기 직전에 보고 있던
  // 페이지를 그대로 유지해야 하므로, 새로고침 직전에 sessionStorage에 현재 페이지를
  // 잠깐 남겨두고 새로 불러온 뒤 한 번만 복원하고 지운다.
  const REFRESH_RESTORE_PAGE_KEY = "app:refresh-restore-page";
  const VALID_PAGES = ["home", "calendar", "agents", "notes", "interviews", "qa", "schedule"];
  let _refreshRestorePage = null;
  try {
    const saved = sessionStorage.getItem(REFRESH_RESTORE_PAGE_KEY);
    sessionStorage.removeItem(REFRESH_RESTORE_PAGE_KEY);
    if (saved && VALID_PAGES.indexOf(saved) !== -1) _refreshRestorePage = saved;
  } catch (e) {}

  const state = {
    // 마스터 계정은 다른 페이지를 볼 필요가 없으므로 항상 "계정 관리" 페이지만 보여준다.
    // 마스터가 아닌 계정은 (로그인 직후든, 세션이 유지된 채 브라우저를 껐다 켰든)
    // 앱을 새로 열 때마다 항상 "홈" 화면을 메인으로 보여준다. 이전에 보던
    // 페이지를 기억해서 복원하지 않는다. 예외적으로, "새로고침" 버튼을 눌러서
    // 다시 불러온 경우에는 누르기 직전 페이지를 그대로 복원한다.
    page: CURRENT_ACCOUNT_IS_MASTER ? "master" : (_refreshRestorePage || "home"),
  };

  // "새로고침" 버튼 클릭 핸들러: 지금 보던 페이지를 기억해두고 나서 새로 불러온다.
  // cloudHydrate()가 페이지를 새로 불러올 때 다시 실행되므로, 서버에 가장 최근에
  // 저장된 내용으로 자연스럽게 갱신된다.
  function performServerRefresh() {
    try { sessionStorage.setItem(REFRESH_RESTORE_PAGE_KEY, state.page); } catch (e) {}
    location.reload();
  }

  function setPage(p) {
    // 마스터 계정은 계정 관리 페이지 외에는 이동하지 않는다.
    if (CURRENT_ACCOUNT_IS_MASTER) { state.page = "master"; renderApp(); return; }
    // "월별 스케줄" 카테고리를 누르면 항상 실시간 기준 당월 스케줄을 보여준다.
    if (p === "schedule" && typeof scheduleUi !== "undefined") {
      scheduleUi.year = today.getFullYear();
      scheduleUi.monthIndex = today.getMonth();
    }
    // "품질 관리" 카테고리를 누르면 항상 실시간 기준 당월 QA 점수를 보여준다.
    if (p === "qa" && typeof qaUi !== "undefined") {
      qaUi.year = today.getFullYear();
      qaUi.monthIndex = today.getMonth();
    }
    // 이제 마지막으로 보던 페이지를 저장/복원하지 않으므로(항상 홈에서 시작),
    // localStorage에 따로 기록하지 않는다.
    state.page = p;
    renderApp();
  }

  /* ===================== 캘린더 모듈 ===================== */
  const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
  const MONTH_NAMES = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  const today = new Date();

  // 대한민국 공휴일 (2026년~2030년, 대체공휴일 포함). 설날/추석/부처님오신날은 음력 기준이라
  // 해마다 날짜가 달라지므로 연도별로 직접 지정한다. 출처: 인사혁신처 고시 기준 공휴일 안내.
  const KR_HOLIDAYS = {
    // 2026년
    "2026-01-01": "신정",
    "2026-02-16": "설날연휴",
    "2026-02-17": "설날",
    "2026-02-18": "설날연휴",
    "2026-03-01": "삼일절",
    "2026-03-02": "대체공휴일",
    "2026-05-01": "노동절",
    "2026-05-05": "어린이날",
    "2026-05-24": "부처님오신날",
    "2026-05-25": "대체공휴일",
    "2026-06-03": "지방선거일",
    "2026-06-06": "현충일",
    "2026-07-17": "제헌절",
    "2026-08-15": "광복절",
    "2026-08-17": "대체공휴일",
    "2026-09-24": "추석연휴",
    "2026-09-25": "추석",
    "2026-09-26": "추석연휴",
    "2026-10-03": "개천절",
    "2026-10-05": "대체공휴일",
    "2026-10-09": "한글날",
    "2026-12-25": "기독탄신일",
    // 2027년
    "2027-01-01": "신정",
    "2027-02-06": "설날연휴",
    "2027-02-07": "설날",
    "2027-02-08": "설날연휴",
    "2027-02-09": "대체공휴일",
    "2027-03-01": "삼일절",
    "2027-05-01": "노동절",
    "2027-05-03": "대체공휴일",
    "2027-05-05": "어린이날",
    "2027-05-13": "부처님오신날",
    "2027-06-06": "현충일",
    "2027-07-17": "제헌절",
    "2027-07-19": "대체공휴일",
    "2027-08-15": "광복절",
    "2027-08-16": "대체공휴일",
    "2027-09-14": "추석연휴",
    "2027-09-15": "추석",
    "2027-09-16": "추석연휴",
    "2027-10-03": "개천절",
    "2027-10-04": "대체공휴일",
    "2027-10-09": "한글날",
    "2027-10-11": "대체공휴일",
    "2027-12-25": "기독탄신일",
    "2027-12-27": "대체공휴일",
    // 2028년
    "2028-01-01": "신정",
    "2028-01-26": "설날연휴",
    "2028-01-27": "설날",
    "2028-01-28": "설날연휴",
    "2028-03-01": "삼일절",
    "2028-04-12": "국회의원선거일",
    "2028-05-01": "노동절",
    "2028-05-02": "부처님오신날",
    "2028-05-05": "어린이날",
    "2028-06-06": "현충일",
    "2028-07-17": "제헌절",
    "2028-08-15": "광복절",
    "2028-10-02": "추석연휴",
    "2028-10-03": "개천절·추석",
    "2028-10-04": "추석연휴",
    "2028-10-05": "대체공휴일",
    "2028-10-09": "한글날",
    "2028-12-25": "기독탄신일",
    // 2029년
    "2029-01-01": "신정",
    "2029-02-12": "설날연휴",
    "2029-02-13": "설날",
    "2029-02-14": "설날연휴",
    "2029-03-01": "삼일절",
    "2029-05-01": "노동절",
    "2029-05-05": "어린이날",
    "2029-05-07": "대체공휴일",
    "2029-05-20": "부처님오신날",
    "2029-05-21": "대체공휴일",
    "2029-06-06": "현충일",
    "2029-07-17": "제헌절",
    "2029-08-15": "광복절",
    "2029-09-21": "추석연휴",
    "2029-09-22": "추석",
    "2029-09-23": "추석연휴",
    "2029-09-24": "대체공휴일",
    "2029-10-03": "개천절",
    "2029-10-09": "한글날",
    "2029-12-25": "기독탄신일",
    // 2030년
    "2030-01-01": "신정",
    "2030-02-02": "설날연휴",
    "2030-02-03": "설날",
    "2030-02-04": "설날연휴",
    "2030-02-05": "대체공휴일",
    "2030-03-01": "삼일절",
    "2030-05-01": "노동절",
    "2030-05-05": "어린이날",
    "2030-05-06": "대체공휴일",
    "2030-05-09": "부처님오신날",
    "2030-06-06": "현충일",
    "2030-07-17": "제헌절",
    "2030-08-15": "광복절",
    "2030-09-11": "추석연휴",
    "2030-09-12": "추석",
    "2030-09-13": "추석연휴",
    "2030-10-03": "개천절",
    "2030-10-09": "한글날",
    "2030-12-25": "기독탄신일",
  };
