  // ==================== 상단 상태표시줄 "백업" 메뉴 (지금 백업하기 · 백업에서 복원) ====================
  // 예전에는 오른쪽 아래 "설정" 메뉴 안의 "데이터 백업" 항목으로 열었는데, macOS 목업
  // (ate1ier-macos-mockup)처럼 상단 상태표시줄의 "백업"을 눌러 드롭다운으로 고르게 옮겼다.
  //  - 지금 백업하기: 전체 데이터를 JSON 파일로 바로 내려받는다(downloadBackup("all")).
  //  - 백업에서 복원: 백업 JSON 파일을 골라 지금 계정에 덮어쓴다(importBackupFromFile).
  //  - 카테고리별 백업/복원: 예전 "데이터 백업" 창(openBackupModal) — 목업엔 없지만,
  //    항목별 내보내기/가져오기 기능이 사라지지 않도록 남겨뒀다.
  // 실제 백업/복원 로직은 js/01e-backup.js에 있는 걸 그대로 쓰고, 드롭다운 모양과 열고 닫는
  // 방식은 "모드" 메뉴(js/01m-status-bar-mode.js)와 같은 .theme-menu 스타일/패턴을 따른다.
  function closeStatusBarBackupMenu() {
    const existing = document.getElementById("status-bar-backup-menu");
    if (existing) existing.remove();
    document.removeEventListener("mousedown", statusBarBackupMenuOutsideHandler, true);
    const btn = document.getElementById("status-bar-backup-btn");
    if (btn) { btn.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
  }
  function statusBarBackupMenuOutsideHandler(e) {
    const menu = document.getElementById("status-bar-backup-menu");
    const btn = document.getElementById("status-bar-backup-btn");
    if (menu && !menu.contains(e.target) && !(btn && btn.contains(e.target))) closeStatusBarBackupMenu();
  }
  // 복원용 파일 선택창: 메뉴가 닫혀도 파일 선택 결과(change)를 받을 수 있게 숨김 input을 하나만 만들어 둔다.
  function getStatusBarBackupFileInput() {
    let input = document.getElementById("status-bar-backup-file-input");
    if (input) return input;
    input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.id = "status-bar-backup-file-input";
    input.style.display = "none";
    input.onchange = () => {
      const file = input.files && input.files[0];
      input.value = "";
      if (!file) return;
      importBackupFromFile(file, null, (msg) => flashUndoToast(msg));
    };
    document.body.appendChild(input);
    return input;
  }
  function openStatusBarBackupMenu(anchorEl) {
    closeStatusBarBackupMenu();
    anchorEl.classList.add("open");
    anchorEl.setAttribute("aria-expanded", "true");
    const rect = anchorEl.getBoundingClientRect();
    const menu = document.createElement("div");
    menu.id = "status-bar-backup-menu";
    menu.className = "theme-menu status-bar-backup-menu";
    menu.innerHTML = `
      <button type="button" class="theme-menu-item" id="status-bar-backup-now-btn">
        ${ICON_DOWNLOAD}<span class="theme-menu-name">지금 백업하기</span>
      </button>
      <button type="button" class="theme-menu-item" id="status-bar-backup-restore-btn">
        ${ICON_UPLOAD}<span class="theme-menu-name">백업에서 복원</span>
      </button>
      <div class="settings-menu-divider"></div>
      <button type="button" class="theme-menu-item" id="status-bar-backup-categories-btn">
        ${ICON_BACKUP}<span class="theme-menu-name">카테고리별 백업/복원</span>
      </button>
    `;
    document.body.appendChild(menu);
    // 상태표시줄은 화면 맨 위라, 버튼 "아래"로 펼친다("모드" 메뉴와 동일).
    const menuRect = menu.getBoundingClientRect();
    let left = rect.left;
    if (left + menuRect.width > window.innerWidth - 8) left = window.innerWidth - menuRect.width - 8;
    menu.style.top = `${rect.bottom + 6}px`;
    menu.style.left = `${Math.max(8, left)}px`;
    document.getElementById("status-bar-backup-now-btn").onclick = () => {
      closeStatusBarBackupMenu();
      downloadBackup("all");
      flashUndoToast("전체 데이터 백업 파일을 내려받았어요.");
    };
    document.getElementById("status-bar-backup-restore-btn").onclick = () => {
      closeStatusBarBackupMenu();
      getStatusBarBackupFileInput().click();
    };
    document.getElementById("status-bar-backup-categories-btn").onclick = () => {
      closeStatusBarBackupMenu();
      openBackupModal();
    };
    setTimeout(() => document.addEventListener("mousedown", statusBarBackupMenuOutsideHandler, true), 0);
  }
  const statusBarBackupBtn = document.getElementById("status-bar-backup-btn");
  if (statusBarBackupBtn) {
    statusBarBackupBtn.onclick = (e) => {
      e.stopPropagation();
      if (document.getElementById("status-bar-backup-menu")) { closeStatusBarBackupMenu(); return; }
      openStatusBarBackupMenu(statusBarBackupBtn);
    };
  }
