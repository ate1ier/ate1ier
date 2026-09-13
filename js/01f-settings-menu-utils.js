  // ==================== 설정 메뉴 팝오버, 공통 유틸(esc/pad2/genId), 공용 페이지네이션 ====================
  // (예전 01-common.js에서 분리됨 — 실행 순서·내용은 그대로입니다)
  // 설정 메뉴 팝오버("설정" 버튼을 누르면 뜨는 목록) — 테마 선택 · 사용설명서 · 데이터 백업을
  // 한 목록 안에 모아둔다. 항목이 3개뿐이라 테마도 별도 팝업으로 한 번 더 들어가지 않고
  // 이 목록에서 바로 다크/라이트를 고를 수 있게 했다.
  function closeSettingsMenu() {
    const existing = document.getElementById("settings-menu");
    if (existing) existing.remove();
    document.removeEventListener("mousedown", settingsMenuOutsideHandler, true);
    const btn = document.getElementById("nav-settings-toggle");
    if (btn) { btn.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
  }
  function settingsMenuOutsideHandler(e) {
    const menu = document.getElementById("settings-menu");
    const btn = document.getElementById("nav-settings-toggle");
    if (menu && !menu.contains(e.target) && !(btn && btn.contains(e.target))) closeSettingsMenu();
  }
  function openSettingsMenu(anchorEl) {
    closeSettingsMenu();
    anchorEl.classList.add("open");
    anchorEl.setAttribute("aria-expanded", "true");
    const rect = anchorEl.getBoundingClientRect();
    const current = getCurrentTheme();
    const menu = document.createElement("div");
    menu.id = "settings-menu";
    menu.className = "theme-menu settings-menu";
    menu.innerHTML = `
      <div class="settings-menu-label">테마</div>
      ${THEME_LIST.map((t) => `
        <button type="button" class="theme-menu-item ${t.id === current ? "active" : ""}" data-theme-id="${t.id}">
          <span class="theme-menu-dot" style="background:${t.bg};"></span>
          <span class="theme-menu-name">${t.label}</span>
          ${t.id === current ? '<span class="theme-menu-check">✓</span>' : ""}
        </button>
      `).join("")}
      <div class="settings-menu-divider"></div>
      <button type="button" class="theme-menu-item" id="settings-manual-btn">
        ${ICON_BOOK}<span class="theme-menu-name">사용설명서</span>
      </button>
      <button type="button" class="theme-menu-item" id="settings-backup-btn">
        ${ICON_BACKUP}<span class="theme-menu-name">데이터 백업</span>
      </button>
      <button type="button" class="theme-menu-item" id="settings-discord-btn">
        ${ICON_DISCORD}<span class="theme-menu-name">디스코드 채널</span>
      </button>
    `;
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
        closeSettingsMenu();
      };
    });
    const manualBtn = document.getElementById("settings-manual-btn");
    if (manualBtn) manualBtn.onclick = () => { closeSettingsMenu(); openManualModal(); };
    const backupBtn = document.getElementById("settings-backup-btn");
    if (backupBtn) backupBtn.onclick = () => { closeSettingsMenu(); openBackupModal(); };
    const discordBtn = document.getElementById("settings-discord-btn");
    if (discordBtn) discordBtn.onclick = () => { closeSettingsMenu(); window.open(DISCORD_INVITE_URL, "_blank", "noopener"); };
    setTimeout(() => document.addEventListener("mousedown", settingsMenuOutsideHandler, true), 0);
  }

  /* ===================== 공통 유틸 ===================== */
  function pad2(n) { return String(n).padStart(2, "0"); }
  function esc(str) {
    const d = document.createElement("div");
    d.textContent = str == null ? "" : String(str);
    return d.innerHTML;
  }
  function genId() { return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

  /* ===================== 공용 페이지네이션 ===================== */
  // 목록이 길어질 때 10개 단위로 잘라서 보여주기 위한 공용 헬퍼.
  const PAGE_SIZE = 12; // 상담사 관리 / 면담일지 목록 페이지당 표시 개수
  // list 전체와 원하는 page(1부터 시작)를 넣으면, 범위를 벗어난 page는 알아서
  // 안쪽으로 보정해서 { items, page, totalPages }를 돌려준다.
  function paginateList(list, page) {
    const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    const safePage = Math.min(Math.max(1, page || 1), totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    return { items: list.slice(start, start + PAGE_SIZE), page: safePage, totalPages };
  }
  // actionName은 클릭 시 data-page-action 값으로 붙어서, 각 화면에서 이 값으로
  // 자기 목록의 페이지 상태를 구분해 처리한다.
  function renderPaginationHtml(page, totalPages, actionName) {
    if (totalPages <= 1) return "";
    return `
      <div class="page-nav" data-page-action="${actionName}">
        <button type="button" class="page-nav-btn" data-page-nav="prev" ${page <= 1 ? "disabled" : ""}>이전</button>
        <span class="page-nav-info">${page} / ${totalPages}페이지</span>
        <button type="button" class="page-nav-btn" data-page-nav="next" ${page >= totalPages ? "disabled" : ""}>다음</button>
      </div>
    `;
  }
  // renderPaginationHtml로 그려진 이전/다음 버튼에 동작을 붙인다.
  // 버튼은 이미 범위를 벗어나면 disabled 처리되어 있으므로, 여기서는 그냥
  // -1(이전)/+1(다음)만큼 페이지를 옮겨달라고 onDelta(delta)를 호출해주면 된다.
  function attachPaginationHandlers(root, actionName, onDelta) {
    const nav = root.querySelector(`.page-nav[data-page-action="${actionName}"]`);
    if (!nav) return;
    const prevBtn = nav.querySelector('[data-page-nav="prev"]');
    const nextBtn = nav.querySelector('[data-page-nav="next"]');
    if (prevBtn) prevBtn.onclick = () => onDelta(-1);
    if (nextBtn) nextBtn.onclick = () => onDelta(1);
  }
