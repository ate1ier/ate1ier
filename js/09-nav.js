  function renderNav() {
    const nav = document.getElementById("nav");
    nav.innerHTML = `
      ${!CURRENT_ACCOUNT_IS_MASTER ? `<div class="nav-label-top">메뉴</div>` : ""}
      <div class="nav-account">
        <span class="nav-account-name">${ICON_USER} <span class="nav-text">${esc(CURRENT_ACCOUNT_NAME)}${CURRENT_ACCOUNT_IS_MASTER ? ' <span class="badge sm master">마스터</span>' : ""}</span></span>
        <div class="nav-logout-wrap">
          <button class="nav-logout-btn" id="nav-logout-btn" title="로그아웃">${ICON_LOGOUT}<span class="nav-text"> 로그아웃</span></button>
        </div>
      </div>
      <div class="nav-divider"></div>
      ${MASTER_ORIGIN_ACCOUNT ? `
        <div class="nav-master-banner">
          <span>${ICON_SHIELD} 마스터 계정</span>
          <button class="nav-master-return-btn" id="nav-master-return-btn" type="button">마스터로 복귀</button>
        </div>
      ` : ""}
      ${CURRENT_ACCOUNT_IS_MASTER ? `
        <div class="nav-master-mode">
          <span class="nav-master-mode-title">${ICON_SHIELD} 관리자 모드</span>
          <span class="nav-master-mode-sub">계정 관리 전용</span>
        </div>
      ` : `
        <button class="nav-btn ${state.page === "home" ? "active" : ""}" data-nav="home" title="홈">${ICON_HOME} <span class="nav-text">홈</span></button>
        <button class="nav-btn ${state.page === "calendar" ? "active" : ""}" data-nav="calendar" title="캘린더">${ICON_CALENDAR} <span class="nav-text">캘린더</span></button>
        <button class="nav-btn ${state.page === "agents" ? "active" : ""}" data-nav="agents" title="상담사 관리">${ICON_USERS} <span class="nav-text">상담사 관리</span></button>
        <button class="nav-btn ${state.page === "notes" ? "active" : ""}" data-nav="notes" title="업무 정리">${ICON_NOTE} <span class="nav-text">업무 정리</span></button>
        <button class="nav-btn ${state.page === "interviews" ? "active" : ""}" data-nav="interviews" title="면담일지">${ICON_CLIPBOARD} <span class="nav-text">면담일지</span></button>
        <button class="nav-btn ${state.page === "qa" ? "active" : ""}" data-nav="qa" title="품질 관리">${ICON_QA} <span class="nav-text">품질 관리</span></button>
        <button class="nav-btn ${state.page === "schedule" ? "active" : ""}" data-nav="schedule" title="월별 스케줄">${ICON_CHART} <span class="nav-text">월별 스케줄</span></button>
      `}
      <div class="nav-spacer"></div>
    `;
    renderSettingsToggle();
    renderUndoToggle();
    renderRefreshToggle();
    nav.querySelectorAll("[data-nav]").forEach((btn) => {
      btn.onclick = () => { setPage(btn.getAttribute("data-nav")); closeDock(); };
    });
    const logoutBtn = document.getElementById("nav-logout-btn");
    if (logoutBtn) {
      logoutBtn.onclick = () => {
        if (window.confirm("로그아웃할까요?")) logout();
      };
    }
    const masterReturnBtn = document.getElementById("nav-master-return-btn");
    if (masterReturnBtn) {
      masterReturnBtn.onclick = () => masterReturnToOrigin();
    }
  }

  /* ===================== 마스터 계정: 계정 관리 페이지 ===================== */
