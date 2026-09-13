  // ==================== 되돌리기(Undo), 테마, 좌측 내비게이션 독 열고 닫기, 설정 토글 버튼 ====================
  // (예전 01-common.js에서 분리됨 — 실행 순서·내용은 그대로입니다)

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

  /* ===================== 데스크톱 독(Dock) 펼치기/닫기 =====================
     독 안에는 메뉴 카테고리(#nav) 말고도 전역 검색 바(#global-search-root)가
     카테고리 바로 위에 함께 들어있으므로, 펼치기/접기 대상은 그 둘을 함께
     감싸는 #nav-dock 전체다. */
  function isDockOpen() {
    const navDock = document.getElementById("nav-dock");
    return !!(navDock && navDock.classList.contains("dock-open"));
  }
  function dockOutsideHandler(e) {
    const navDock = document.getElementById("nav-dock");
    const btn = document.getElementById("dock-toggle-btn");
    if (navDock && !navDock.contains(e.target) && !(btn && btn.contains(e.target))) closeDock();
  }
  function openDock() {
    const navDock = document.getElementById("nav-dock");
    const btn = document.getElementById("dock-toggle-btn");
    if (navDock) navDock.classList.add("dock-open");
    if (btn) { btn.classList.add("open"); btn.setAttribute("aria-expanded", "true"); btn.title = "메뉴 닫기"; btn.setAttribute("aria-label", "메뉴 닫기"); }
    setTimeout(() => document.addEventListener("mousedown", dockOutsideHandler, true), 0);
  }
  function closeDock() {
    const navDock = document.getElementById("nav-dock");
    const btn = document.getElementById("dock-toggle-btn");
    if (navDock) navDock.classList.remove("dock-open");
    if (btn) { btn.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); btn.title = "메뉴 열기"; btn.setAttribute("aria-label", "메뉴 열기"); }
    document.removeEventListener("mousedown", dockOutsideHandler, true);
    // 독 안에는 전역 검색창도 함께 들어있으므로, 독을 닫을 때 검색했던 내용도
    // 남아있지 않고 초기화되게 한다.
    if (typeof resetGlobalSearchQuery === "function") resetGlobalSearchQuery();
  }
  function toggleDock() {
    if (isDockOpen()) closeDock(); else openDock();
  }
  const dockToggleBtn = document.getElementById("dock-toggle-btn");
  if (dockToggleBtn) {
    dockToggleBtn.onclick = (e) => { e.stopPropagation(); toggleDock(); };
  }

  /* ===================== 오른쪽 하단 유틸리티 독(다크·사용설명서·백업·되돌리기·새로고침) 접기/펼치기 =====================
     평소엔 펼치기 버튼만 보이고, 눌러야 5개 항목이 위로 펼쳐진다.
     다른 곳을 클릭하면 자동으로 다시 접힌다. */
  function isUtilityDockOpen() {
    const root = document.getElementById("utility-dock-root");
    return !!(root && root.classList.contains("open"));
  }
  function utilityDockOutsideHandler(e) {
    const root = document.getElementById("utility-dock-root");
    const settingsMenu = document.getElementById("settings-menu");
    if (settingsMenu && settingsMenu.contains(e.target)) return; // 설정 목록 팝업 클릭은 독을 접지 않는다
    if (root && !root.contains(e.target)) closeUtilityDock();
  }
  function openUtilityDock() {
    const root = document.getElementById("utility-dock-root");
    const btn = document.getElementById("utility-dock-toggle-btn");
    if (root) root.classList.add("open");
    if (btn) { btn.classList.add("open"); btn.setAttribute("aria-expanded", "true"); btn.title = "바로가기 메뉴 닫기"; btn.setAttribute("aria-label", "바로가기 메뉴 닫기"); }
    setTimeout(() => document.addEventListener("mousedown", utilityDockOutsideHandler, true), 0);
  }
  function closeUtilityDock() {
    const root = document.getElementById("utility-dock-root");
    const btn = document.getElementById("utility-dock-toggle-btn");
    if (root) root.classList.remove("open");
    if (btn) { btn.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); btn.title = "바로가기 메뉴 열기"; btn.setAttribute("aria-label", "바로가기 메뉴 열기"); }
    document.removeEventListener("mousedown", utilityDockOutsideHandler, true);
  }
  function toggleUtilityDock() {
    if (isUtilityDockOpen()) closeUtilityDock(); else openUtilityDock();
  }
  const utilityDockToggleBtn = document.getElementById("utility-dock-toggle-btn");
  if (utilityDockToggleBtn) {
    utilityDockToggleBtn.onclick = (e) => { e.stopPropagation(); toggleUtilityDock(); };
  }

  // 일정/할일 알림을 공지하는 디스코드 서버 초대 링크. 만료되지 않는 링크로 만들어두면 됨.
  // (실제 알림 발송은 이 사이트가 아니라 Supabase Edge Function + pg_cron이 처리하고,
  //  여기서는 그 알림이 올라오는 서버로 바로 이동할 수 있는 버튼만 설정 메뉴 안에 보여준다.)
  const DISCORD_INVITE_URL = "https://discord.gg/QFpBnYMp4";

  // 설정 버튼: 예전에는 테마·사용설명서·데이터 백업이 각각 독립된 버튼으로 오른쪽 아래에
  // 따로따로 쌓여 있었는데, 항목이 많아질수록 화면이 복잡해 보여서(특히 모바일) 이 세 가지를
  // "설정" 버튼 하나로 묶고, 그 안에서 목록으로 고르게 했다. 새로고침·되돌리기는 사용 빈도가
  // 높아 그대로 독립 버튼으로 남겨둔다.
  function renderSettingsToggle() {
    const root = document.getElementById("settings-toggle-root");
    if (!root) return;
    root.innerHTML = `
      <div class="manual-toggle-wrap">
        <button class="theme-picker-btn" id="nav-settings-toggle" type="button" aria-haspopup="true" aria-expanded="false" aria-label="설정 메뉴 열기" title="설정 (테마 · 사용설명서 · 데이터 백업)">
          ${ICON_SETTINGS}
          <span class="theme-picker-label">설정</span>
        </button>
      </div>
    `;
    const settingsBtn = document.getElementById("nav-settings-toggle");
    if (settingsBtn) {
      settingsBtn.onclick = (e) => {
        e.stopPropagation();
        if (document.getElementById("settings-menu")) { closeSettingsMenu(); return; }
        openSettingsMenu(settingsBtn);
      };
    }
  }

  /* ===================== 데이터 백업/복원 =====================
     상담사 정보 · 스케줄 · 면담일지 · QA 점수 · 메모 · 캘린더처럼
     "acct:{계정id}:" 접두어가 붙어 저장되는 이 계정 소유의 데이터를
     JSON 파일로 내보내고 다시 불러올 수 있게 한다.
     가져오기는 파일 안에 어떤 계정 이름이 적혀 있었든 상관없이 항상
     "지금 로그인한 계정"의 접두어로 다시 저장한다 — 그래야 다른 계정에서
     내보낸 백업이라도 가져오는 즉시 지금 계정 소유가 되고, 다른 계정의
     데이터에는 절대 영향을 주지 않는다. */
