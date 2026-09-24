  // ==================== 상단 상태표시줄 "설명" 버튼 (사용설명서 열기) ====================
  // 예전에는 오른쪽 아래 "설정" 메뉴 안의 "사용설명서" 항목으로 열었는데, macOS 목업
  // (ate1ier-macos-mockup)처럼 상단 상태표시줄의 "설명"을 누르면 바로 사용설명서가
  // 열리게 옮겼다(목업도 드롭다운 없이 곧바로 연다). 사용설명서 창(openManualModal)
  // 자체는 js/11-manual.js에 있는 걸 그대로 쓴다.
  const statusBarHelpBtn = document.getElementById("status-bar-help-btn");
  if (statusBarHelpBtn) {
    statusBarHelpBtn.onclick = (e) => {
      e.stopPropagation();
      // 열려 있는 다른 상태표시줄 메뉴(모드/백업/계정)는 바깥 클릭(mousedown)으로 이미 닫힌다.
      openManualModal();
    };
  }
