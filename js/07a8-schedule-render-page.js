  // 07a8-schedule-render-page.js — renderSchedulePage 진입점
  // (07-schedule.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  function renderSchedulePage(root) {
    root.innerHTML = `
      <div class="schedule-top">
        <div class="schedule-title">월별 스케줄</div>
        <div class="schedule-month-nav">
          <button class="schedule-month-btn" id="sch-prev-month">‹</button>
          <div class="schedule-month-label">${scheduleMonthLabel()}${scheduleIsMonthLocked(scheduleUi.year, scheduleUi.monthIndex) ? ` <span class="sch-locked-badge">${ICON_LOCK} 확정됨</span>` : ""}</div>
          <button class="schedule-month-btn" id="sch-next-month">›</button>
          <button class="ghost-btn sch-lock-toggle-btn ${scheduleIsMonthLocked(scheduleUi.year, scheduleUi.monthIndex) ? "locked" : ""}" id="sch-lock-btn" style="margin-left:8px;">${scheduleIsMonthLocked(scheduleUi.year, scheduleUi.monthIndex) ? `${ICON_UNLOCK} 잠금 해제` : `${ICON_LOCK} 이 달 잠그기`}</button>
          <button class="ghost-btn ${scheduleBulkPasteOpen ? "active" : ""}" id="sch-bulk-btn" style="margin-left:8px;">${ICON_CLIPBOARD} 일괄 붙여넣기</button>
          <button class="ghost-btn" id="sch-capture-btn">${ICON_CAMERA} 이미지로 저장 ▾</button>
          <button class="ghost-btn" id="sch-excel-btn">${ICON_CHART} 엑셀로 다운로드</button>
          <button class="ghost-btn" id="sch-holidaydoc-btn">${ICON_CLIPBOARD} 휴일대체 확인서</button>
        </div>
      </div>
      <div class="status" id="schedule-status"></div>
      ${scheduleBulkPasteOpen ? `
        <div class="schedule-bulk-panel">
          <div class="schedule-bulk-desc">
            한 줄에 <b>이름</b>을 쓰고 이어서 <b>1일부터 말일까지의 값</b>을 공백(탭도 가능)으로 구분해서 붙여넣으세요. 공백이 나올 때마다 다음 날짜로 넘어가요. 인원 여러 명은 줄바꿈으로 구분해서 한 번에 붙여넣을 수 있어요.<br>
            인식되는 값: <b>1</b>(근무), <b>휴일 / 오프 / 휴무</b>(휴일), <b>연차</b>, <b>대휴</b>, <b>반차</b>, <b>공휴</b>, <b>공가</b>, <b>육휴</b>, <b>특휴</b>, <b>교육</b>, <b>지각</b>, <b>결근</b>, <b>퇴사</b>. 값 개수가 이번 달 일수보다 적으면 앞에서부터만 반영되고, 많으면 초과분은 무시돼요.<br>
            <b>필요인력</b>도 같은 칸에 붙여넣을 수 있어요. 이름 대신 줄 맨 앞에 <b>주간 채팅 필요인력</b>(또는 주간 유선 / 야간 채팅 / 야간 유선)을 쓰고, 이어서 1일부터의 숫자를 넣으세요. 엑셀에서 복사할 때 이름표 칸부터 같이 복사하면 돼요. 빈 칸이나 <b>-</b>는 건너뛰어서 그 날짜의 기존 값이 그대로 남아요.
          </div>
          <textarea class="add-input schedule-bulk-textarea" id="sch-bulk-textarea" placeholder="이기욱	휴일	1	휴일	휴일	1	휴일	1	1	1	휴일	1	1	1	대휴	1	1	1	1	휴일	1	1	1	대휴	1	1	1	휴일	1	1	1"></textarea>
          <div class="schedule-bulk-actions">
            <button class="primary-btn" id="sch-bulk-apply-btn">적용</button>
            <button class="ghost-btn" id="sch-bulk-clear-btn">지우기</button>
          </div>
          ${scheduleBulkPasteMsg ? `<div class="schedule-bulk-result">${esc(scheduleBulkPasteMsg)}</div>` : ""}
        </div>
      ` : ""}
      <div class="schedule-legend">
        <span class="item"><span class="swatch" style="background:var(--blue);"></span>휴일</span>
        <span class="item"><span class="swatch" style="background:var(--orange);"></span>연차</span>
        <span class="item"><span class="swatch" style="background:var(--green);"></span>대휴</span>
        <span class="item"><span class="swatch" style="background:var(--salmon);"></span>반차</span>
        <span class="item"><span class="swatch" style="background:var(--teal);"></span>공휴</span>
        <span class="item"><span class="swatch" style="background:var(--purple);"></span>공가</span>
        <span class="item"><span class="swatch" style="background:var(--pink);"></span>육휴</span>
        <span class="item"><span class="swatch" style="background:var(--indigo);"></span>특휴 · 교육</span>
        <span class="item"><span class="swatch" style="background:var(--amber);"></span>지각</span>
        <span class="item"><span class="swatch" style="background:var(--red);"></span>결근</span>
        <span class="item"><span class="swatch" style="background:var(--text-faint);"></span>퇴사</span>
      </div>
      <div class="schedule-table-toolbar">
        <div class="agent-search-input">
          <input type="text" class="agent-search-input-field" id="sch-search-input" placeholder="이름 검색" title="상담사 검색 (이름/주간/야간/채팅/유선, 쉼표로 여러 개)" value="${esc(scheduleUi.searchQuery)}" autocomplete="off">
          ${ICON_SEARCH_MINI}
        </div>
        <button class="ghost-btn" id="sch-adjust-summary-btn">${ICON_CLIPBOARD} 가감점 취합</button>
        <button class="ghost-btn" id="sch-auto-btn">자동 배치 ▾</button>
        <button class="ghost-btn ${scheduleHiddenPanelOpen ? "active" : ""}" id="sch-hidden-btn">${ICON_CALENDAR} 숨긴 열/행${scheduleHiddenCount() > 0 ? ` (${scheduleHiddenCount()})` : ""} ▾</button>
        <button class="ghost-btn sch-delete-btn-small" id="sch-delete-btn">${ICON_TRASH} 일정 삭제</button>
      </div>
      ${scheduleHiddenPanelOpen ? `
        <div class="schedule-colgroup-panel">
          <div class="schedule-colgroup-subtitle">날짜 범위로 열 그룹 만들기</div>
          <div class="schedule-colgroup-desc">
            엑셀처럼 원하는 날짜 범위를 골라 그 열들을 한 번에 접거나 펼 수 있어요. 시작일과 종료일을 입력하고 "그룹 추가"를 누르면 아래 목록에 추가돼요.
          </div>
          <div class="schedule-colgroup-form">
            <input type="number" min="1" max="${scheduleDaysInMonth(scheduleUi.year, scheduleUi.monthIndex)}" class="add-input" id="sch-colgroup-start" placeholder="시작일">
            <span>~</span>
            <input type="number" min="1" max="${scheduleDaysInMonth(scheduleUi.year, scheduleUi.monthIndex)}" class="add-input" id="sch-colgroup-end" placeholder="종료일">
            <button class="primary-btn" id="sch-colgroup-add-btn">그룹 추가</button>
          </div>
          ${scheduleUi.colGroups.length === 0 ? `
            <div class="schedule-colgroup-empty">추가된 열 그룹이 없어요.</div>
          ` : `
            <div class="schedule-colgroup-list">
              ${scheduleUi.colGroups.map((g) => `
                <span class="schedule-colgroup-chip">
                  ${pad2(scheduleUi.monthIndex + 1)}/${pad2(g.start)}~${pad2(scheduleUi.monthIndex + 1)}/${pad2(g.end)}
                  <button class="sch-colgroup-toggle-btn" data-toggle-colgroup="${g.id}">${g.collapsed ? "펼치기" : "접기"}</button>
                  <button class="sch-colgroup-remove-btn" data-remove-colgroup="${g.id}">✕</button>
                </span>
              `).join("")}
            </div>
          `}
          <div class="schedule-colgroup-divider"></div>
          <div class="schedule-colgroup-subtitle">개별로 숨긴 열·행</div>
          <div class="schedule-colgroup-desc">
            표에서 날짜 칸·인원 정보 칸(닉네임~결근)·인원 닉네임 칸·집계행(관리자 인원/필요인력/대비)·그룹 제목 행(관리자/아침조/채팅/유선 등)을 클릭해 선택한 뒤(여러 개 선택 가능), 오른쪽 마우스 버튼을 눌러 "접기"를 고르면 여기에 쌓여요. 데이터는 그대로 있고 화면에서만 숨겨져요.
          </div>
          ${(scheduleUi.manualHiddenDays.size === 0 && scheduleUi.manualHiddenInfoCols.size === 0 && scheduleUi.manualHiddenStaffIds.size === 0 && scheduleUi.manualHiddenSummaryRows.size === 0) ? `
            <div class="schedule-colgroup-empty">접어둔 열·행이 없어요.</div>
          ` : `
            <div class="schedule-colgroup-list">
              ${scheduleHiddenItemsListHtml()}
            </div>
            <div><button class="ghost-btn" id="sch-unhide-all-btn">모두 펼치기</button></div>
          `}
        </div>
      ` : ""}
      <div id="schedule-table-area"><div class="schedule-table-wrap"><div class="schedule-scale-inner">${buildScheduleTableHtml()}</div></div></div>
      <div class="schedule-log-title">이번 달 지각·결근 기록</div>
      <div id="schedule-log-area">${buildScheduleLogHtml()}</div>
    `;

    attachScheduleTableHandlers(document.getElementById("schedule-table-area"));

    document.getElementById("sch-prev-month").onclick = () => scheduleShiftMonth(-1);
    document.getElementById("sch-next-month").onclick = () => scheduleShiftMonth(1);
    document.getElementById("sch-lock-btn").onclick = () => scheduleToggleMonthLock(scheduleUi.year, scheduleUi.monthIndex);
    document.getElementById("sch-capture-btn").onclick = (e) => openScheduleCaptureMenu(e.currentTarget);
    document.getElementById("sch-excel-btn").onclick = () => exportScheduleToExcel();
    document.getElementById("sch-holidaydoc-btn").onclick = () => generateHolidayDocx();
    document.getElementById("sch-delete-btn").onclick = (e) => openScheduleDeleteMenu(e.currentTarget);
    document.getElementById("sch-hidden-btn").onclick = () => {
      scheduleHiddenPanelOpen = !scheduleHiddenPanelOpen;
      renderApp();
    };
    document.getElementById("sch-adjust-summary-btn").onclick = () => openScheduleAdjustModal();
    document.getElementById("sch-auto-btn").onclick = (e) => openScheduleAutoMenu(e.currentTarget);
    const schSearchInput = document.getElementById("sch-search-input");
    if (schSearchInput) {
      // 표 영역만 다시 그려서(전체 renderApp() 대신) 검색창의 IME 조합·포커스가 끊기지 않게 한다.
      schSearchInput.oninput = (e) => {
        scheduleUi.searchQuery = e.target.value;
        updateScheduleTableArea();
      };
    }
    root.querySelectorAll("[data-unhide-day-range]").forEach((btn) => {
      const [s, e] = btn.getAttribute("data-unhide-day-range").split("-").map(Number);
      btn.onclick = () => scheduleUnhideDayRange(s, e);
    });
    root.querySelectorAll("[data-unhide-batch]").forEach((btn) => {
      btn.onclick = () => scheduleUnhideBatch(btn.getAttribute("data-unhide-batch"));
    });
    root.querySelectorAll("[data-unhide-infocol]").forEach((btn) => {
      btn.onclick = () => scheduleUnhideInfoCol(btn.getAttribute("data-unhide-infocol"));
    });
    root.querySelectorAll("[data-unhide-staff]").forEach((btn) => {
      btn.onclick = () => scheduleUnhideStaff(btn.getAttribute("data-unhide-staff"));
    });
    root.querySelectorAll("[data-unhide-summaryrow]").forEach((btn) => {
      btn.onclick = () => scheduleUnhideSummaryRow(btn.getAttribute("data-unhide-summaryrow"));
    });
    const unhideAllBtn = document.getElementById("sch-unhide-all-btn");
    if (unhideAllBtn) unhideAllBtn.onclick = () => scheduleUnhideAll();
    const colGroupAddBtn = document.getElementById("sch-colgroup-add-btn");
    if (colGroupAddBtn) {
      colGroupAddBtn.onclick = () => {
        const maxDay = scheduleDaysInMonth(scheduleUi.year, scheduleUi.monthIndex);
        const startInput = document.getElementById("sch-colgroup-start");
        const endInput = document.getElementById("sch-colgroup-end");
        const s = parseInt(startInput ? startInput.value : "", 10);
        const e = parseInt(endInput ? endInput.value : "", 10);
        if (!s || !e || s < 1 || e < 1 || s > maxDay || e > maxDay) {
          flashScheduleStatus("올바른 날짜(1~" + maxDay + ")를 입력해주세요.");
          return;
        }
        scheduleAddColGroup(s, e);
      };
    }
    root.querySelectorAll("[data-toggle-colgroup]").forEach((btn) => {
      btn.onclick = () => scheduleToggleColGroup(btn.getAttribute("data-toggle-colgroup"));
    });
    root.querySelectorAll("[data-remove-colgroup]").forEach((btn) => {
      btn.onclick = () => scheduleRemoveColGroup(btn.getAttribute("data-remove-colgroup"));
    });
    document.getElementById("sch-bulk-btn").onclick = () => {
      scheduleBulkPasteOpen = !scheduleBulkPasteOpen;
      if (scheduleBulkPasteOpen) scheduleBulkPasteMsg = "";
      renderApp();
    };
    const bulkTextarea = document.getElementById("sch-bulk-textarea");
    const bulkApplyBtn = document.getElementById("sch-bulk-apply-btn");
    const bulkClearBtn = document.getElementById("sch-bulk-clear-btn");
    if (bulkApplyBtn) {
      bulkApplyBtn.onclick = () => {
        applyScheduleBulkPaste(bulkTextarea ? bulkTextarea.value : "");
        renderApp();
      };
    }
    if (bulkClearBtn) {
      bulkClearBtn.onclick = () => {
        if (bulkTextarea) bulkTextarea.value = "";
        scheduleBulkPasteMsg = "";
        renderApp();
      };
    }

    attachScheduleLogHandlers(document.getElementById("schedule-log-area"));

    fitScheduleTable();
    syncScheduleLogWidth();
    watchScheduleTableSize();
    // renderSchedulePage()는 월 이동·잠금 토글·일괄 붙여넣기 등으로 화면을 다시 그릴 때마다
    // 반복 호출된다. 매번 새 리스너를 쌓아두면 resize 이벤트마다 중복 계산이 계속 늘어나므로,
    // 등록 전에 이전 리스너를 먼저 제거해서 항상 딱 1개씩만 걸려 있도록 한다.
    window.removeEventListener("resize", fitScheduleTable);
    window.removeEventListener("resize", syncScheduleLogWidth);
    window.addEventListener("resize", fitScheduleTable);
    window.addEventListener("resize", syncScheduleLogWidth);
    // 웹폰트(KoPub Dotum)가 표를 처음 그릴 때 아직 로딩 중이면 실제 너비보다 좁게
    // 측정되어 축소 비율이 맞지 않을 수 있다. 폰트 로딩이 끝난 뒤 한 번 더 재계산한다.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        fitScheduleTable();
        syncScheduleLogWidth();
      });
    }
  }

  /* ===================== 홈(메인) 페이지 모듈 ===================== */
  // 그날의 근무 현황·일정·할 일·고정 메모를 한 화면에 요약해서 보여준다.

