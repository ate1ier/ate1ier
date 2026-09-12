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

  // 로그인/계정 생성 직후 딱 한 번, 홈 화면 위에 팝업을 살짝 늦게(화면이 먼저 자리
  // 잡은 뒤) 애니메이션과 함께 띄워준다. 지난달 마감(최종 스케줄/품질 관리 확정)이
  // 아직 안 끝났고 "앞으로 뜨지 않음"을 체크해두지 않았다면 그 확인 팝업을 먼저
  // 띄우고, 그렇지 않으면 평소처럼 "오늘의 브리핑"을 띄운다(로그인할 때마다 매번
  // 확인해서, 마감이 끝나거나 체크박스를 누르기 전까지는 계속 다시 뜬다).
  if (_justLoggedIn && !CURRENT_ACCOUNT_IS_MASTER) {
    setTimeout(() => {
      if (shouldShowMonthClosePopup()) showMonthClosePopup();
      else showTodayBriefPopup();
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
