  // ==================== 상단 상태표시줄 "모드" 메뉴 (테마 라이트/다크 전환) ====================
  // 예전에는 오른쪽 아래 "설정" 메뉴 안에 테마 선택이 들어있었는데, macOS 목업처럼
  // 상단 상태표시줄의 "모드" 항목에서 바로 고를 수 있게 옮겼다.
  // THEME_LIST / getCurrentTheme / setTheme은 01d-undo-theme-dock.js에 이미 있는 것을
  // 그대로 재사용하고, 메뉴 모양도 "설정" 메뉴와 같은 .theme-menu 스타일을 그대로 쓴다.
  function closeStatusBarModeMenu() {
    const existing = document.getElementById("status-bar-mode-menu");
    if (existing) existing.remove();
    document.removeEventListener("mousedown", statusBarModeMenuOutsideHandler, true);
    const btn = document.getElementById("status-bar-mode-btn");
    if (btn) { btn.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
  }
  function statusBarModeMenuOutsideHandler(e) {
    const menu = document.getElementById("status-bar-mode-menu");
    const btn = document.getElementById("status-bar-mode-btn");
    if (menu && !menu.contains(e.target) && !(btn && btn.contains(e.target))) closeStatusBarModeMenu();
  }
  function openStatusBarModeMenu(anchorEl) {
    closeStatusBarModeMenu();
    anchorEl.classList.add("open");
    anchorEl.setAttribute("aria-expanded", "true");
    const rect = anchorEl.getBoundingClientRect();
    const current = getCurrentTheme();
    const fxLevel = getFxLevel();
    const themeItemsHtml = THEME_LIST.map((t) => `
      <button type="button" class="theme-menu-item ${t.id === current ? "active" : ""}" data-theme-id="${t.id}">
        <span class="theme-menu-dot" style="background:${t.bg};"></span>
        <span class="theme-menu-name">${t.label}</span>
        ${t.id === current ? '<span class="theme-menu-check">✓</span>' : ""}
      </button>
    `).join("");
    // "그래픽 효과" 끔/약/강 3단계 스위치(js/01d-undo-theme-dock.js의 setFxLevel)
    const fxSeg = [["off", "끔"], ["lite", "약"], ["full", "강"]].map(([id, label]) =>
      `<button type="button" class="theme-menu-fx-opt ${id === fxLevel ? "active" : ""}" data-fx-level="${id}" aria-pressed="${id === fxLevel}">${label}</button>`).join("");
    const fxToggleHtml = `
      <div class="settings-menu-divider"></div>
      <div class="theme-menu-item theme-menu-fx-item" title="끔: 블러·그림자·애니메이션 제거 / 약: 블러 절반·그림자 작게 / 강: 모든 효과">
        <span class="theme-menu-name">그래픽 효과</span>
        <span class="theme-menu-fx-seg" role="group" aria-label="그래픽 효과 단계">${fxSeg}</span>
      </div>
    `;
    const menu = document.createElement("div");
    menu.id = "status-bar-mode-menu";
    menu.className = "theme-menu";
    menu.innerHTML = themeItemsHtml + fxToggleHtml;
    document.body.appendChild(menu);
    // 상태표시줄은 화면 맨 위에 있으니, 목업처럼 버튼 "아래"로 펼친다
    // (설정 메뉴처럼 버튼 위쪽에 띄우면 화면 밖으로 넘어가버림).
    const menuRect = menu.getBoundingClientRect();
    let left = rect.left;
    if (left + menuRect.width > window.innerWidth - 8) left = window.innerWidth - menuRect.width - 8;
    menu.style.top = `${rect.bottom + 6}px`;
    menu.style.left = `${Math.max(8, left)}px`;
    menu.querySelectorAll("[data-theme-id]").forEach((btn) => {
      btn.onclick = () => {
        setTheme(btn.getAttribute("data-theme-id"));
        closeStatusBarModeMenu();
      };
    });
    // 효과 단계는 테마 선택과 달리 눌러도 메뉴를 닫지 않고 표시만 바꿔서,
    // 단계를 바꿔가며 바로 화면 변화를 확인해볼 수 있게 한다.
    menu.querySelectorAll("[data-fx-level]").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        setFxLevel(btn.getAttribute("data-fx-level"));
        menu.querySelectorAll("[data-fx-level]").forEach((b2) => {
          const on = b2 === btn;
          b2.classList.toggle("active", on);
          b2.setAttribute("aria-pressed", on ? "true" : "false");
        });
      };
    });
    setTimeout(() => document.addEventListener("mousedown", statusBarModeMenuOutsideHandler, true), 0);
  }
  const statusBarModeBtn = document.getElementById("status-bar-mode-btn");
  if (statusBarModeBtn) {
    statusBarModeBtn.onclick = (e) => {
      e.stopPropagation();
      if (document.getElementById("status-bar-mode-menu")) { closeStatusBarModeMenu(); return; }
      openStatusBarModeMenu(statusBarModeBtn);
    };
  }
