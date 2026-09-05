  function renderApp() {
    renderNav();
    const root = document.getElementById("page-inner");
    root.classList.toggle("wide", state.page === "schedule" || state.page === "home" || state.page === "calendar" || state.page === "qa");
    if (state.page === "notes") renderNotesPage(root);
    else if (state.page === "agents") renderAgentsPage(root);
    else if (state.page === "qa") renderQAPage(root);
    else if (state.page === "interviews") renderInterviewsPage(root);
    else if (state.page === "schedule") renderSchedulePage(root);
    else if (state.page === "calendar") renderCalendarPage(root);
    else if (state.page === "master") renderMasterPage(root);
    else renderHomePage(root);
  }

  // 앱을 처음 열 때도 월별 스케줄 인원 목록을 상담사 관리 목록과 맞춰준다.
  // (실제로 바뀐 내용이 있을 때만 저장 — 매번 열 때마다 변경 없이도 스케줄 데이터
  // 전체를 다시 저장/클라우드 전송하는 낭비를 피한다)
  if (syncScheduleStaffFromAgents()) saveScheduleData();

  renderApp();

  // 로그인/계정 생성 직후 딱 한 번, 홈 화면 위에 "오늘의 브리핑" 히어로 팝업을
  // 살짝 늦게(화면이 먼저 자리 잡은 뒤) 애니메이션과 함께 띄워준다.
  if (_justLoggedIn && !CURRENT_ACCOUNT_IS_MASTER) {
    setTimeout(() => showTodayBriefPopup(), 450);
  }

  // 로그인 유지 하트비트: 이 탭이 열려 있는 동안 "마지막으로 살아있던 시각"을 계속
  // 갱신해서, 탭만 잠깐 닫았다 다시 열었을 때는 로그인이 유지되고 컴퓨터를 껐다
  // 켤 정도로 오래 닫혀 있었을 때만 자동 로그아웃되게 한다 (판단 자체는 01-common.js의
  // 세션 확인 부분에서 다음에 열릴 때 이뤄진다).
  touchLastActive();
  setInterval(touchLastActive, 15000);
  window.addEventListener("pagehide", touchLastActive);
  window.addEventListener("beforeunload", touchLastActive);
