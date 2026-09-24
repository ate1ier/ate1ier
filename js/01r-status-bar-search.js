  // ==================== 상단 상태표시줄 "검색"(🔍) 버튼 → 이름 통합 검색 패널 ====================
  // 예전에는 하단 내비게이션 독(#nav-dock) 안, 메뉴 카테고리 바로 위에 "이름 통합 검색" 바가
  // 있었는데, macOS 목업처럼 상단 상태표시줄 오른쪽 검색 아이콘으로 옮겼다. 아이콘을 누르면
  // 아이콘 아래로 검색 패널(#status-bar-search-panel)이 펼쳐지고, 그 안에 예전 검색 바와
  // 결과 카드 목록이 그대로 들어있다.
  // 검색 로직·결과 카드·결과 클릭 시 이동은 전부 js/13-global-search.js에 있는 걸 그대로 쓰고,
  // 여기는 패널을 열고 닫는 일만 한다(열고 닫는 방식은 "모드" 메뉴와 같은 패턴 — 바깥 클릭/Esc로 닫기).
  // 닫으면 입력했던 검색어와 결과도 함께 비워진다(예전에 독을 닫을 때와 같은 동작).
  // 패널은 상태표시줄 "안"이 아니라 바로 옆(body.html 참고)에 둔다 — 상태표시줄의 유리 효과
  // (backdrop-filter)가 그 안의 position: fixed 요소의 기준을 바꿔버리기 때문이다.
  function getStatusBarSearchPanel() { return document.getElementById("status-bar-search-panel"); }
  function isStatusBarSearchOpen() {
    const panel = getStatusBarSearchPanel();
    return !!(panel && panel.classList.contains("open"));
  }
  // 패널이 상태표시줄 바로 아래에 붙도록, 열 때/창 크기가 바뀔 때 실제 상태표시줄 하단 위치를 잰다
  // (아이폰 노치 등 safe-area 때문에 높이가 고정값이 아닐 수 있다).
  function syncStatusBarSearchPanelTop() {
    const panel = getStatusBarSearchPanel();
    const bar = document.getElementById("app-status-bar");
    if (!panel || !bar) return;
    panel.style.setProperty("--status-bar-search-top", Math.max(0, Math.round(bar.getBoundingClientRect().bottom)) + "px");
  }
  window.addEventListener("resize", syncStatusBarSearchPanelTop);

  function statusBarSearchOutsideHandler(e) {
    const panel = getStatusBarSearchPanel();
    const btn = document.getElementById("status-bar-search-btn");
    if (panel && !panel.contains(e.target) && !(btn && btn.contains(e.target))) closeStatusBarSearch();
  }
  function statusBarSearchKeyHandler(e) {
    if (e.key === "Escape") closeStatusBarSearch();
  }
  function closeStatusBarSearch() {
    const panel = getStatusBarSearchPanel();
    const btn = document.getElementById("status-bar-search-btn");
    document.removeEventListener("mousedown", statusBarSearchOutsideHandler, true);
    document.removeEventListener("keydown", statusBarSearchKeyHandler);
    if (btn) { btn.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    if (!panel || !panel.classList.contains("open")) return;
    panel.classList.remove("open");
    if (typeof resetGlobalSearchQuery === "function") resetGlobalSearchQuery();
  }
  function openStatusBarSearch() {
    const panel = getStatusBarSearchPanel();
    const btn = document.getElementById("status-bar-search-btn");
    if (!panel) return;
    syncStatusBarSearchPanelTop();
    panel.classList.add("open");
    if (btn) { btn.classList.add("open"); btn.setAttribute("aria-expanded", "true"); }
    // 열자마자 바로 타이핑할 수 있게 입력창에 커서를 둔다.
    const input = document.getElementById("gs-input");
    if (input) input.focus();
    setTimeout(() => {
      document.addEventListener("mousedown", statusBarSearchOutsideHandler, true);
      document.addEventListener("keydown", statusBarSearchKeyHandler);
    }, 0);
  }
  function toggleStatusBarSearch() {
    if (isStatusBarSearchOpen()) closeStatusBarSearch(); else openStatusBarSearch();
  }
  const statusBarSearchBtn = document.getElementById("status-bar-search-btn");
  if (statusBarSearchBtn) {
    statusBarSearchBtn.onclick = (e) => {
      e.stopPropagation();
      toggleStatusBarSearch();
    };
  }
