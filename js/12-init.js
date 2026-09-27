  // opts.forceAllWindows: true를 넘기면 배경(포커스 아님) 창까지 전부 지금 당장 다시 그린다(성능 개선
  // 계획 Phase 2로 기본은 포커스된 창만 즉시 갱신하도록 바뀌었다 — js/09a-home-desktop.js의
  // renderHomeDesktopWindows 참고). 다른 기기 실시간 동기화·탭 복귀 시 "밀린 내용 한꺼번에 반영"처럼
  // 배경 창도 지금 당장 최신이어야 하는 드문 경우에만 이 옵션을 넘긴다.
  function renderApp(opts) {
    renderNav();
    const root = document.getElementById("page-inner");
    root.classList.toggle("wide", state.page === "schedule" || state.page === "home" || state.page === "calendar");
    // 마스터 계정: 계정 관리 전용 화면 (바탕화면/창 없음, 기존 그대로)
    if (state.page === "master") { renderMasterPage(root); return; }
    // 일반 계정: 바탕화면 위젯(#home-root)은 항상 그리고, 열려 있는 페이지 창들은 각자의 창 안에
    // js/09a-home-desktop.js의 renderHomeDesktopWindows()가 그린다(여러 창이 동시에 열려 있을 수 있음).
    const homeRoot = document.getElementById("home-root");
    if (homeRoot && typeof renderHomeDesktopWindows === "function") {
      renderHomePage(homeRoot);
      renderHomeDesktopWindows(opts);
      return;
    }
    // (#home-root/js/09a-home-desktop.js가 없는 경우를 대비한 안전망) 예전처럼 페이지 하나만 #page-inner에 그린다.
    if (state.page === "notes") renderNotesPage(root);
    else if (state.page === "agents") renderAgentsPage(root);
    else if (state.page === "qa") renderQAPage(root);
    else if (state.page === "interviews") renderInterviewsPage(root);
    else if (state.page === "schedule") renderSchedulePage(root);
    else if (state.page === "calendar") renderCalendarPage(root);
    else renderHomePage(root);
  }

  // 앱을 처음 열 때도 월별 스케줄 인원 목록을 상담사 관리 목록과 맞춰준다.
  syncScheduleStaffFromAgents();
  saveScheduleData();

  // 지난번 이 브라우저에서 열어뒀던 페이지 창들을(열림 순서·위치·크기·접힘/최대화 상태까지) renderApp()이
  // 그 안의 내용을 채우기 전에 먼저 되살려둔다(js/09a-home-desktop.js). 저장만 되고 복원이 안 되어 있던
  // 부분이라, 이 호출이 없으면 새로고침할 때마다 열어둔 창이 전부 사라진 채로 시작한다.
  if (typeof hdRestoreOpenWindows === "function") hdRestoreOpenWindows();

  renderApp();
  if (typeof window !== "undefined" && window.__hideBootLoader) window.__hideBootLoader();
  // 이 브라우저(컴퓨터)에서 처음으로 사양이 낮아 보이면, "그래픽 효과 줄이기" 토글의
  // 존재를 몰라서 못 쓰는 경우를 막기 위해 딱 한 번만 안내한다 (js/01d-undo-theme-dock.js).
  if (!CURRENT_ACCOUNT_IS_MASTER && typeof maybeSuggestLowGraphicsMode === "function") {
    setTimeout(maybeSuggestLowGraphicsMode, 600);
  }

  // 로그인/계정 생성 직후 딱 한 번, 홈 화면 위에 팝업을 살짝 늦게(화면이 먼저 자리
  // 잡은 뒤) 애니메이션과 함께 띄워준다. 지난달 마감(최종 스케줄/품질 관리 확정)이
  // 아직 안 끝났고 "앞으로 뜨지 않음"을 체크해두지 않았다면 그 확인 팝업을 먼저
  // 띄우고, 그렇지 않으면 평소처럼 "오늘의 브리핑"을 띄운다(로그인할 때마다 매번
  // 확인해서, 마감이 끝나거나 체크박스를 누르기 전까지는 계속 다시 뜬다).
  if (_justLoggedIn && !CURRENT_ACCOUNT_IS_MASTER) {
    setTimeout(() => {
      if (shouldShowMonthClosePopup()) showMonthClosePopup();
      else showTodayBriefToast();
    }, 450);
  }

  // 로그인 유지 하트비트: 이 탭이 열려 있는 동안 "마지막으로 살아있던 시각"을 계속
  // 갱신해서, 탭만 잠깐 닫았다 다시 열었을 때는 로그인이 유지되고 컴퓨터를 껐다
  // 켤 정도로 오래 닫혀 있었을 때만 자동 로그아웃되게 한다 (판단 자체는 01-common.js의
  // 세션 확인 부분에서 다음에 열릴 때 이뤄진다).
  touchLastActive();
  setInterval(touchLastActive, 15000);
  window.addEventListener("pagehide", touchLastActive);
  window.addEventListener("beforeunload", touchLastActive);
