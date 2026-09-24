  // ==================== 상단 상태표시줄 "디스코드" 버튼 (디스코드 채널 열기) ====================
  // 예전에는 오른쪽 아래 "설정" 메뉴 안의 "디스코드 채널" 항목으로 열었는데, 그 "설정" 버튼을
  // 없애면서 상태표시줄 왼쪽("설명" 옆)으로 옮겼다. "설명"처럼 드롭다운 없이, 누르면 곧바로
  // 일정/할일 알림이 올라오는 디스코드 서버(DISCORD_INVITE_URL, js/01d-undo-theme-dock.js)를
  // 새 탭으로 연다.
  const statusBarDiscordBtn = document.getElementById("status-bar-discord-btn");
  if (statusBarDiscordBtn) {
    statusBarDiscordBtn.onclick = (e) => {
      e.stopPropagation();
      window.open(DISCORD_INVITE_URL, "_blank", "noopener");
    };
  }
