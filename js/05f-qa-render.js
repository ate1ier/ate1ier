  // 05f-qa-render.js — 표 빌드, 영역 핸들러, renderQAPage 진입점
  // (05-qa.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  function qaFilterAgentsByMode(agentsList, mode) {
    if (!mode || mode === "ALL") return agentsList;
    const hasVoice = (a) => (a.workTypes || []).indexOf("유선") !== -1;
    const hasChat = (a) => (a.workTypes || []).indexOf("채팅") !== -1;
    if (mode === "DAY") return agentsList.filter((a) => a.group !== "night");
    if (mode === "NIGHT") return agentsList.filter((a) => a.group === "night");
    if (mode === "VOICE") return agentsList.filter(hasVoice);
    if (mode === "CHAT") return agentsList.filter(hasChat);
    return agentsList;
  }

  // 화면에 보이는 표와 이미지 캡처용 표가 같은 마크업을 쓰도록 분리해뒀다.
  // forCapture가 true면 점수 입력칸 대신 텍스트로 값을 보여준다(캡처 이미지에 <input>이 그대로 찍히지 않도록).
  function buildQATableHtml(agentsList, year, monthIndex, forCapture) {
    return `
      <div class="qa-table-wrap">
        <table class="qa-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>LDAP</th>
              <th>시간대</th>
              <th>업무구분</th>
              <th>조</th>
              <th>점수</th>
              <th>전월 대비</th>
            </tr>
          </thead>
          <tbody>
            ${agentsList.length === 0 ? `
              <tr><td class="qa-empty" colspan="7">${forCapture ? "해당하는 상담사가 없어요." : `근무중인 상담사가 없어요. "상담사 관리"에서 인원을 등록해주세요.`}</td></tr>
            ` : agentsList.map((a) => {
              const typeBadges = renderWorkTypeBadges(a.workTypes, "sm");
              const groupBadge = `<span class="badge sm ${a.group === "night" ? "night" : "day"}">${a.group === "night" ? "야간" : "주간"}</span>`;
              const val = getQAScore(a.id, year, monthIndex);
              const scoreCell = forCapture
                ? `<td>${val === null ? "-" : val.toFixed(1)}</td>`
                : qaScoreCellHtml(a, year, monthIndex);
              const highlight = !forCapture && qaHighlightAgentId === a.id;
              const isResigned = a.status === "RESIGNED";
              const rowClass = `${highlight ? "qa-row-highlight " : ""}${isResigned ? "qa-row-resigned" : ""}`.trim();
              const resignedBadge = isResigned ? ` <span class="badge sm resigned">퇴사</span>` : "";
              return `
                <tr data-qa-row-agent="${a.id}" class="${rowClass}">
                  <td class="qa-col-name"${forCapture ? "" : ` data-qa-name-click="${a.id}"`}>${esc(a.name)}${resignedBadge}${forCapture ? "" : `<span class="qa-name-search-icon">${ICON_SEARCH_MINI}</span>`}</td>
                  <td class="qa-col-ldap">${esc(a.ldap || "-")}</td>
                  <td>${esc(a.timezone || "-")}</td>
                  <td class="qa-col-badges">${typeBadges || "-"}</td>
                  <td>${groupBadge}</td>
                  ${scoreCell}
                  <td>${qaDiffHtml(a, year, monthIndex)}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  // 검색창 자체는 다시 그리지 않고 표 영역만 갱신한다(agents/interviews 화면과 같은 방식).
  // IME(한글) 조합 중에도 입력이 끊기지 않고, 타이핑 즉시 결과가 반영된다.
  // [성능 개선 계획 Phase 2] 검색 결과가 그대로(=행 개수가 그대로)라면, 표 전체를 새로 안 만들고
  // domReconcileTable(js/01f-settings-menu-utils.js)로 실제로 달라진 칸만 그 자리에서 고쳐 쓴다 —
  // 스케줄 표와 같은 방식. 검색으로 보이는 인원이 실제로 달라지면(행 개수가 바뀌면) 안전하게
  // 표 전체를 새로 만든다.
  function updateQATableArea() {
    const tableArea = document.getElementById("qa-table-area");
    if (!tableArea) return;
    const { year, monthIndex } = qaUi;
    const filteredList = qaWorkingAgents().filter((a) => qaAgentMatchesSearch(a, qaUi.searchQuery));
    const newHtml = buildQATableHtml(filteredList, year, monthIndex, false);
    const existingTable = tableArea.querySelector("table.qa-table");
    const patched = existingTable && domReconcileTable(existingTable, newHtml);
    if (!patched) {
      tableArea.innerHTML = newHtml;
      attachQATableAreaHandlers(tableArea, filteredList, year, monthIndex);
    }
    // patch에 성공했으면 칸 DOM을 그대로 재사용했으니(점수 입력칸 포함) 이벤트는 이미 다 붙어 있다.
  }
  // 점수 입력칸(.qa-score-input) 하나가 바뀌었을 때: 예전에는 페이지 전체를 다시 그렸지만(상단
  // 툴바·검색창까지 통째로 다시 만드는 건 낭비), 이제 그 값이 실제로 영향을 주는 두 곳 —
  // 표 영역(그 인원의 점수·전월 대비 칸)과 평균 통계칸 — 만 갱신한다.
  function updateQAStatsArea() {
    const grid = document.getElementById("qa-stat-grid");
    if (!grid) return;
    const { year, monthIndex } = qaUi;
    const agentsList = qaWorkingAgents();
    const stats = qaComputeStats(agentsList, year, monthIndex);
    const prevYm = qaPrevMonth(year, monthIndex);
    const prevStats = qaComputeStats(agentsList, prevYm.year, prevYm.monthIndex);
    grid.innerHTML = qaStatGridInnerHtml(stats, prevStats);
  }
  function qaHandleScoreChanged() {
    updateQATableArea();
    updateQAStatsArea();
  }

  function attachQATableAreaHandlers(root, agentsList, year, monthIndex) {
    root.querySelectorAll("[data-qa-name-click]").forEach((el) => {
      el.onclick = () => openQADetailModal(el.getAttribute("data-qa-name-click"));
    });

    root.querySelectorAll(".qa-score-input").forEach((input) => {
      // 필요인력 입력칸과 같은 방식: blur(포커스 아웃) 또는 Enter일 때만 저장해서
      // 타이핑 중에 표 전체가 다시 그려지며 깜빡이거나 포커스가 빠지지 않게 한다.
      input.onchange = () => {
        setQAScore(
          input.getAttribute("data-qa-agent"),
          year, monthIndex,
          input.value
        );
        qaHandleScoreChanged();
      };
      // 엑셀처럼 Enter/Tab으로 다음(아래) 칸, Shift+Enter/Shift+Tab으로 이전(위) 칸으로
      // 바로 이동한다. blur()를 호출하면 값이 바뀐 경우 change 이벤트가 이 안에서
      // 그대로(동기적으로) 발생해서 저장 + 표 다시 그리기까지 끝나므로, blur() 호출이
      // 끝난 뒤에 다음 칸을 찾아 포커스를 옮기면 된다(다시 그려졌든 안 그려졌든 그
      // 시점엔 이미 최종 DOM이 갖춰져 있다).
      input.onkeydown = (e) => {
        if (e.key !== "Enter" && e.key !== "Tab") return;
        e.preventDefault();
        const idx = agentsList.findIndex((a) => a.id === input.getAttribute("data-qa-agent"));
        const delta = e.shiftKey ? -1 : 1;
        const nextAgent = idx !== -1 ? agentsList[idx + delta] : null;
        input.blur();
        if (nextAgent) qaFocusScoreInput(nextAgent.id);
      };
    });
  }

  function renderQAPage(root) {
    const agentsList = qaWorkingAgents();
    const filteredList = agentsList.filter((a) => qaAgentMatchesSearch(a, qaUi.searchQuery));
    const { year, monthIndex } = qaUi;
    // 통계(평균)는 검색어와 무관하게 항상 재직중인 전체 인원 기준으로 보여준다.
    const stats = qaComputeStats(agentsList, year, monthIndex);
    const prevYm = qaPrevMonth(year, monthIndex);
    const prevStats = qaComputeStats(agentsList, prevYm.year, prevYm.monthIndex);
    const locked = qaIsMonthLocked(year, monthIndex);

    root.innerHTML = `
      <div class="qa-top">
        <div class="qa-title">품질 관리</div>
        <div class="schedule-month-nav">
          <button class="schedule-month-btn" id="qa-prev-month">‹</button>
          <div class="schedule-month-label">${qaMonthLabel()}${locked ? ` <span class="sch-locked-badge">${ICON_LOCK} 확정됨</span>` : ""}</div>
          <button class="schedule-month-btn" id="qa-next-month">›</button>
          <button class="ghost-btn sch-lock-toggle-btn ${locked ? "locked" : ""}" id="qa-lock-btn" style="margin-left:8px;">${locked ? `${ICON_UNLOCK} 잠금 해제` : `${ICON_LOCK} 이 달 잠그기`}</button>
          <button class="ghost-btn" id="qa-excel-upload-btn">${ICON_UPLOAD} 엑셀 업로드</button>
          <button class="ghost-btn qa-bulk-delete-btn" id="qa-bulk-delete-btn">${ICON_TRASH} 엑셀 일괄삭제</button>
          <button class="ghost-btn" id="qa-capture-btn">${ICON_CAMERA} 이미지로 저장 ▾</button>
        </div>
      </div>
      <div class="status" id="qa-status"></div>
      <div class="qa-stat-row">
        <div class="agent-search-input">
          <input type="text" class="agent-search-input-field" id="qa-search-input" placeholder="이름 검색" title="상담사 검색 (이름/주간/야간/채팅/유선, 쉼표로 여러 개)" value="${esc(qaUi.searchQuery)}" autocomplete="off">
          ${ICON_SEARCH_MINI}
        </div>
        <div class="qa-stat-grid" id="qa-stat-grid">${qaStatGridInnerHtml(stats, prevStats)}</div>
      </div>
      <div id="qa-table-area">${buildQATableHtml(filteredList, year, monthIndex, false)}</div>
    `;

    // 상담사 상세에서 "품질 관리로 이동"으로 넘어온 경우, 그 인원의 행으로
    // 스크롤하고 한 번만 강조 표시한다.
    if (qaHighlightAgentId) {
      const targetId = qaHighlightAgentId;
      qaHighlightAgentId = null;
      const row = root.querySelector(`[data-qa-row-agent="${CSS.escape(targetId)}"]`);
      if (row) {
        row.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => row.classList.remove("qa-row-highlight"), 2200);
      }
    }

    document.getElementById("qa-prev-month").onclick = () => qaShiftMonth(-1);
    document.getElementById("qa-next-month").onclick = () => qaShiftMonth(1);
    document.getElementById("qa-lock-btn").onclick = () => qaToggleMonthLock(year, monthIndex);
    document.getElementById("qa-capture-btn").onclick = (e) => openQACaptureMenu(e.currentTarget);
    document.getElementById("qa-bulk-delete-btn").onclick = () => {
      if (qaIsMonthLocked(year, monthIndex)) { flashQAStatus("잠긴 달이에요. 잠금을 해제한 뒤 삭제해주세요."); return; }
      if (!confirm(`${qaMonthLabel()}에 등록된 모든 상담사의 QA 엑셀 데이터를 일괄삭제할까요?\n원문과 정리된 내용이 모두 함께 삭제되며, 되돌릴 수 없어요.`)) return;
      const count = deleteAllQADetails(year, monthIndex);
      flashQAStatus(count > 0 ? `${count}건 삭제됐어요.` : "삭제할 데이터가 없어요.");
      renderApp();
    };
    document.getElementById("qa-excel-upload-btn").onclick = () => openQAUploadModal();

    const qaSearchInput = document.getElementById("qa-search-input");
    if (qaSearchInput) {
      qaSearchInput.oninput = (e) => {
        qaUi.searchQuery = e.target.value;
        updateQATableArea();
      };
    }

    attachQATableAreaHandlers(root.querySelector("#qa-table-area"), filteredList, year, monthIndex);
  }
  // 특정 상담사의 점수 입력칸에 포커스를 주고 기존 값을 선택 상태로 만든다
  // (Enter/Tab으로 다음 칸으로 넘어갈 때, 바로 덮어쓸 수 있게).
