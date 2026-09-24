  // ==================== 상단 상태표시줄 "새로고침"(↻) · "되돌리기"(↶) 버튼 ====================
  // 예전에는 두 버튼 모두 화면 오른쪽 아래 "바로가기 메뉴"(유틸리티 독)를 펼쳐야 나왔는데,
  // macOS 목업(ate1ier-macos-mockup)처럼 상단 상태표시줄 오른쪽 아이콘으로 옮겼다.
  // 동작 자체는 예전 버튼과 완전히 같고, 새로 만든 로직은 없다.
  //  - 새로고침: performServerRefresh() (js/01j-session-boot.js) — 지금 보던 페이지는 그대로 두고
  //    서버에서 최신 내용을 다시 받아온다.
  //  - 되돌리기: performUndo() (js/01d-undo-theme-dock.js) — 바로 직전 동작 하나를 되돌린다.
  //    Ctrl+Z(맥은 Cmd+Z) 단축키도 그대로다. 버튼의 활성/비활성 상태와 툴팁("되돌리기 — 작업 이름")은
  //    되돌리기 스택이 바뀔 때마다 renderUndoToggle()이 갱신한다.
  const statusBarRefreshBtn = document.getElementById("status-bar-refresh-btn");
  if (statusBarRefreshBtn) {
    statusBarRefreshBtn.onclick = (e) => {
      e.stopPropagation();
      performServerRefresh();
    };
  }
  const statusBarUndoBtn = document.getElementById("status-bar-undo-btn");
  if (statusBarUndoBtn) {
    statusBarUndoBtn.onclick = (e) => {
      e.stopPropagation();
      performUndo();
    };
  }
