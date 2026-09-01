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
  syncScheduleStaffFromAgents();
  saveScheduleData();

  renderApp();

  // 로그인/계정 생성 직후 딱 한 번, 홈 화면 위에 "오늘의 브리핑" 히어로 팝업을
  // 살짝 늦게(화면이 먼저 자리 잡은 뒤) 애니메이션과 함께 띄워준다.
  if (_justLoggedIn && !CURRENT_ACCOUNT_IS_MASTER) {
    setTimeout(() => showTodayBriefPopup(), 450);
  }

  // 로그인 후 5시간이 지나면 자동으로 로그아웃시키고, 그 전까지는 남은 시간을
  // 주기적으로 갱신해서 보여준다.
  if (!CURRENT_ACCOUNT_IS_MASTER) {
    updateSessionRemainingDisplay();
    setInterval(() => {
      if (getSessionRemainingMs() <= 0) {
        logout();
        return;
      }
      updateSessionRemainingDisplay();
    }, 15000);
  }
