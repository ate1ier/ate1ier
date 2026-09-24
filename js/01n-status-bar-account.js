  // ==================== 상단 상태표시줄 "계정" 버튼 (로그인 계정 표시 + 로그아웃 드롭다운) ====================
  // macOS 목업(ate1ier-macos-mockup)의 상단 바 왼쪽 "#an"(계정 이름) · 로그아웃 드롭다운을
  // 참고해 실제로 동작하게 만들었습니다. 예전에는 이 자리(#status-bar-account-name)에
  // "업무 종합 관리"라는 고정 문구만 있었는데, 이제 로그인한 계정 이름(팀 계정이면 인원
  // 이름까지, 마스터면 "마스터" 배지)을 보여주고, 눌렀을 때 뜨는 드롭다운에서 실제로
  // 로그아웃시킵니다. 로그아웃 자체(logout())와 마스터 복귀(masterReturnToOrigin())는
  // js/01g-accounts-auth.js에 있는 걸 그대로 쓰고, 드롭다운 모양은 "모드" 메뉴
  // (js/01m-status-bar-mode.js)와 같은 .theme-menu 스타일을 재사용합니다.
  function closeStatusBarAccountMenu() {
    const existing = document.getElementById("status-bar-account-menu");
    if (existing) existing.remove();
    document.removeEventListener("mousedown", statusBarAccountMenuOutsideHandler, true);
    const btn = document.getElementById("status-bar-account-btn");
    if (btn) { btn.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
  }
  function statusBarAccountMenuOutsideHandler(e) {
    const menu = document.getElementById("status-bar-account-menu");
    const btn = document.getElementById("status-bar-account-btn");
    if (menu && !menu.contains(e.target) && !(btn && btn.contains(e.target))) closeStatusBarAccountMenu();
  }
  function openStatusBarAccountMenu(anchorEl) {
    closeStatusBarAccountMenu();
    anchorEl.classList.add("open");
    anchorEl.setAttribute("aria-expanded", "true");
    const rect = anchorEl.getBoundingClientRect();
    const menu = document.createElement("div");
    menu.id = "status-bar-account-menu";
    menu.className = "theme-menu status-bar-account-menu";
    menu.innerHTML = `
      ${MASTER_ORIGIN_ACCOUNT ? `
        <button type="button" class="theme-menu-item" id="status-bar-master-return-btn">
          ${ICON_SHIELD}<span class="theme-menu-name">마스터로 복귀</span>
        </button>
      ` : ""}
      <button type="button" class="theme-menu-item" id="status-bar-logout-btn">
        ${ICON_LOGOUT}<span class="theme-menu-name">로그아웃</span>
      </button>
    `;
    document.body.appendChild(menu);
    // "모드" 메뉴와 마찬가지로 상태표시줄은 화면 맨 위라, 버튼 "아래"로 펼친다.
    const menuRect = menu.getBoundingClientRect();
    let left = rect.left;
    if (left + menuRect.width > window.innerWidth - 8) left = window.innerWidth - menuRect.width - 8;
    menu.style.top = `${rect.bottom + 6}px`;
    menu.style.left = `${Math.max(8, left)}px`;
    const logoutBtn = document.getElementById("status-bar-logout-btn");
    if (logoutBtn) {
      logoutBtn.onclick = () => {
        closeStatusBarAccountMenu();
        if (window.confirm("로그아웃할까요?")) logout();
      };
    }
    const masterReturnBtn = document.getElementById("status-bar-master-return-btn");
    if (masterReturnBtn) {
      masterReturnBtn.onclick = () => { closeStatusBarAccountMenu(); masterReturnToOrigin(); };
    }
    setTimeout(() => document.addEventListener("mousedown", statusBarAccountMenuOutsideHandler, true), 0);
  }
  const statusBarAccountBtn = document.getElementById("status-bar-account-btn");
  if (statusBarAccountBtn) {
    const nameEl = document.getElementById("status-bar-account-name");
    if (nameEl) {
      nameEl.textContent = CURRENT_ACCOUNT_DISPLAY_NAME;
      if (CURRENT_ACCOUNT_IS_MASTER) {
        const badge = document.createElement("span");
        badge.className = "badge sm master status-bar-account-badge";
        badge.textContent = "마스터";
        nameEl.after(badge);
      }
    }
    statusBarAccountBtn.title = CURRENT_ACCOUNT_IS_MASTER ? `${CURRENT_ACCOUNT_DISPLAY_NAME} (마스터) · 계정 메뉴` : `${CURRENT_ACCOUNT_DISPLAY_NAME} · 계정 메뉴`;
    statusBarAccountBtn.onclick = (e) => {
      e.stopPropagation();
      if (document.getElementById("status-bar-account-menu")) { closeStatusBarAccountMenu(); return; }
      openStatusBarAccountMenu(statusBarAccountBtn);
    };
  }
