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

  // [macOS 스타일 재설계 4단계] 유형 필터 pill(qaUi.filterMode)과 검색어(qaUi.searchQuery)를
  // 함께 적용해 화면(표/캡처 아님)에 보여줄 목록을 만든다. renderQAPage()/updateQATableArea()가
  // 공통으로 쓴다.
  function qaVisibleAgents() {
    const modeFiltered = qaFilterAgentsByMode(qaWorkingAgents(), qaUi.filterMode);
    return modeFiltered.filter((a) => qaAgentMatchesSearch(a, qaUi.searchQuery));
  }

  const QA_FILTER_PILLS = [
    { mode: "ALL", label: "전체" },
    { mode: "DAY", label: "주간" },
    { mode: "NIGHT", label: "야간" },
    { mode: "VOICE", label: "유선" },
    { mode: "CHAT", label: "채팅" },
  ];

  function qaFilterRowHtml() {
    const cur = qaUi.filterMode || "ALL";
    return `
      <div class="qa-filter-row">
        <div class="qa-pill-filter">
          ${QA_FILTER_PILLS.map((p) => `<button type="button" class="${p.mode === cur ? "on" : ""}" data-qa-filter-mode="${p.mode}">${p.label}</button>`).join("")}
        </div>
      </div>
    `;
  }

  function attachQAFilterRowHandlers(root) {
    root.querySelectorAll("[data-qa-filter-mode]").forEach((btn) => {
      btn.onclick = () => {
        const mode = btn.getAttribute("data-qa-filter-mode");
        if (qaUi.filterMode === mode) return;
        qaUi.filterMode = mode;
        renderApp();
      };
    });
  }

  // 이름(또는 사번)을 해시로 돌려서 아바타 배경색(css/10-qa.css의 .qa-avatar.pal-0~7,
  // 1단계에서 이미 준비해둔 팔레트)을 안정적으로 골라준다. 같은 사람은 항상 같은 색.
  // 퇴사자는 항상 pal-resigned(회색)로 고정해서 "더 이상 활동하지 않음"이 표시되게 한다.
  function qaAvatarPaletteClass(agent) {
    if (agent.status === "RESIGNED") return "pal-resigned";
    const str = String(agent.id || agent.name || "");
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    return `pal-${hash % 8}`;
  }

  // [macOS 스타일 재설계 5단계] 화면용 표(<table>)를 macOS Mail/Finder 느낌의
  // "인셋 그룹 리스트"(div 목록)로 바꾼다. 이미지 캡처(forCapture=true, 05g의
  // captureQAPage())는 그대로 <table> 마크업을 쓰므로 그 경로는 손대지 않았다.
  // 화면 쪽에서 계속 지켜야 하는 것들: data-qa-row-agent(강조 스크롤/CSS.escape 조회),
  // 배지 클래스("badge sm night/day", "badge sm resigned"), 점수 입력칸의 blur/Enter
  // 저장(.qa-score-input, data-qa-agent), 잠긴 달의 disabled, 퇴사자 취소선 스타일.
  function buildQATableHtml(agentsList, year, monthIndex, forCapture) {
    if (forCapture) {
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
                <tr><td class="qa-empty" colspan="7">해당하는 상담사가 없어요.</td></tr>
              ` : agentsList.map((a) => {
                const typeBadges = renderWorkTypeBadges(a.workTypes, "sm");
                const groupBadge = `<span class="badge sm ${a.group === "night" ? "night" : "day"}">${a.group === "night" ? "야간" : "주간"}</span>`;
                const val = getQAScore(a.id, year, monthIndex);
                const isResigned = a.status === "RESIGNED";
                const rowClass = isResigned ? "qa-row-resigned" : "";
                const resignedBadge = isResigned ? ` <span class="badge sm resigned">퇴사</span>` : "";
                return `
                  <tr data-qa-row-agent="${a.id}" class="${rowClass}">
                    <td class="qa-col-name">${esc(a.name)}${resignedBadge}</td>
                    <td class="qa-col-ldap">${esc(a.ldap || "-")}</td>
                    <td>${esc(a.timezone || "-")}</td>
                    <td class="qa-col-badges">${typeBadges || "-"}</td>
                    <td>${groupBadge}</td>
                    <td>${val === null ? "-" : val.toFixed(1)}</td>
                    <td>${qaDiffHtml(a, year, monthIndex)}</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      `;
    }

    return `
      <div class="qa-list-wrap">
        <div class="qa-list-head">
          <span>이름</span><span>시간대</span><span>업무</span><span>조</span><span>점수</span><span>전월 대비</span>
        </div>
        ${agentsList.length === 0 ? `
          <div class="qa-row qa-empty-row"><div class="qa-empty">근무중인 상담사가 없어요. "상담사 관리"에서 인원을 등록해주세요.</div></div>
        ` : agentsList.map((a) => {
          const typeBadges = renderWorkTypeBadges(a.workTypes, "sm");
          const groupBadge = `<span class="badge sm ${a.group === "night" ? "night" : "day"}">${a.group === "night" ? "야간" : "주간"}</span>`;
          const highlight = qaHighlightAgentId === a.id;
          const isResigned = a.status === "RESIGNED";
          const rowClass = ["qa-row", highlight ? "qa-row-highlight" : "", isResigned ? "qa-row-resigned" : ""].filter(Boolean).join(" ");
          const resignedBadge = isResigned ? ` <span class="badge sm resigned">퇴사</span>` : "";
          const ldapLine = a.ldap || "-";
          const initial = esc(String(a.name || "-").charAt(0) || "-");
          return `
            <div class="${rowClass}" data-qa-row-agent="${a.id}">
              <div class="qa-name-cell" data-qa-name-click="${a.id}">
                <div class="qa-avatar ${qaAvatarPaletteClass(a)}">${initial}</div>
                <div class="qa-name-text">
                  <div class="qa-name-main">${esc(a.name)}${resignedBadge}</div>
                  <div class="qa-name-ldap">${esc(ldapLine)}</div>
                </div>
                <span class="qa-name-search-icon">${ICON_SEARCH_MINI}</span>
              </div>
              <div class="qa-row-timezone">${esc(a.timezone || "-")}</div>
              <div class="qa-badges">${typeBadges || "-"}</div>
              <div class="qa-row-group">${groupBadge}</div>
              <div class="qa-row-score">${qaScoreInputHtml(a, year, monthIndex)}</div>
              <div class="qa-row-diff">${qaDiffHtml(a, year, monthIndex)}</div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  // 검색창 자체는 다시 그리지 않고 표 영역만 갱신한다(agents/interviews 화면과 같은 방식).
  // IME(한글) 조합 중에도 입력이 끊기지 않고, 타이핑 즉시 결과가 반영된다.
  function updateQATableArea() {
    const tableArea = document.getElementById("qa-table-area");
    if (!tableArea) return;
    const { year, monthIndex } = qaUi;
    const filteredList = qaVisibleAgents();
    tableArea.innerHTML = buildQATableHtml(filteredList, year, monthIndex, false);
    attachQATableAreaHandlers(tableArea, filteredList, year, monthIndex);
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
        qaRefreshAfterScoreEdit();
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

  // 통계 카드 묶음(전체 평균~야간 유선 평균). renderQAPage와 점수 한 칸 수정 후 갱신이 같이 쓴다.
  function qaStatGridHtml(agentsList, year, monthIndex) {
    const stats = qaComputeStats(agentsList, year, monthIndex);
    const prevYm = qaPrevMonth(year, monthIndex);
    const prevStats = qaComputeStats(agentsList, prevYm.year, prevYm.monthIndex);
    return `
          ${qaStatItemHtml("전체 평균", stats.total, prevStats.total, true)}
          ${qaStatItemHtml("유선 점수 평균", stats.voice, prevStats.voice)}
          ${qaStatItemHtml("채팅 점수 평균", stats.chat, prevStats.chat)}
          ${qaStatItemHtml("주간 점수 평균", stats.day, prevStats.day)}
          ${qaStatItemHtml("야간 점수 평균", stats.night, prevStats.night)}
          ${qaStatItemHtml("주간 채팅 평균", stats.dayChat, prevStats.dayChat)}
          ${qaStatItemHtml("주간 유선 평균", stats.dayVoice, prevStats.dayVoice)}
          ${qaStatItemHtml("야간 채팅 평균", stats.nightChat, prevStats.nightChat)}
          ${qaStatItemHtml("야간 유선 평균", stats.nightVoice, prevStats.nightVoice)}
        `;
  }

  // 성능 4단계: 점수 한 칸을 고친 뒤 renderApp()(페이지 전체 + 다른 창까지) 대신 "통계 카드 + 바뀐 행"만 갱신한다.
  // 행 구성(인원·순서)이 달라졌거나 표가 아직 없으면 표 영역만 통째로, 페이지가 없으면 renderApp()으로 물러선다.
  function qaRefreshAfterScoreEdit() {
    const tableArea = document.getElementById("qa-table-area");
    const statGrid = document.querySelector(".qa-stat-grid");
    if (!tableArea || !statGrid) { renderApp(); return; }
    const { year, monthIndex } = qaUi;
    const agentsList = qaWorkingAgents();
    const filteredList = qaVisibleAgents();
    const statHtml = qaStatGridHtml(agentsList, year, monthIndex);
    if (statGrid._qaHtml !== statHtml) { statGrid._qaHtml = statHtml; statGrid.innerHTML = statHtml; }

    const tpl = document.createElement("template");
    tpl.innerHTML = buildQATableHtml(filteredList, year, monthIndex, false);
    const freshRows = Array.from(tpl.content.querySelectorAll("[data-qa-row-agent]"));
    const liveRows = Array.from(tableArea.querySelectorAll("[data-qa-row-agent]"));
    const sameShape = freshRows.length === liveRows.length &&
      freshRows.every((r, i) => r.getAttribute("data-qa-row-agent") === liveRows[i].getAttribute("data-qa-row-agent"));
    if (sameShape) {
      freshRows.forEach((fresh, i) => {
        const live = liveRows[i];
        const input = live.querySelector(".qa-score-input");
        // 친 값이 거부돼(잠긴 달·숫자 아님) 저장 안 됐을 때는 문자열이 같아 보이므로 입력칸 값이 어긋난 행도 교체
        const stale = input && input.value !== input.defaultValue;
        if (!stale && fresh.outerHTML === live.outerHTML) return;
        live.replaceWith(fresh);
        attachQATableAreaHandlers(fresh, filteredList, year, monthIndex);
      });
    } else {
      updateQATableArea();
    }
    if (typeof hdRefreshAfterLocalEdit === "function") hdRefreshAfterLocalEdit("qa");
  }

  function renderQAPage(root) {
    const agentsList = qaWorkingAgents();
    const filteredList = qaVisibleAgents();
    const { year, monthIndex } = qaUi;
    // 통계(평균)는 검색어와 무관하게 항상 재직중인 전체 인원 기준으로 보여준다.
    const locked = qaIsMonthLocked(year, monthIndex);

    root.innerHTML = `
      <div class="qa-top">
        <div class="qa-toolbar-title">품질 관리<small>${qaMonthLabel()} · 전체 ${agentsList.length}명</small></div>
        <div class="mac-seg schedule-month-nav">
          <button id="qa-prev-month" aria-label="이전 달">‹</button>
          <div class="month-label">${qaMonthLabel()}${locked ? ` <span class="sch-locked-badge">${ICON_LOCK} 확정됨</span>` : ""}</div>
          <button id="qa-next-month" aria-label="다음 달">›</button>
        </div>
        <button class="lock-chip" id="qa-lock-btn">${locked ? `${ICON_UNLOCK} 잠금 해제` : `${ICON_LOCK} 이 달 잠그기`}</button>
        <div class="agent-search-input interview-toolbar-search">
          <input type="text" class="agent-search-input-field" id="qa-search-input" placeholder="이름 검색" title="상담사 검색 (이름/주간/야간/채팅/유선, 쉼표로 여러 개)" value="${esc(qaUi.searchQuery)}" autocomplete="off">
          ${ICON_SEARCH_MINI}
        </div>
        <div class="mac-iv-toolbar">
          <button type="button" class="mac-iv-tool" id="qa-excel-upload-btn"><span class="mac-iv-tool-icon">${ICON_UPLOAD}</span><span class="mac-iv-tool-label">엑셀 업로드</span></button>
          <button type="button" class="mac-iv-tool qa-bulk-delete-btn" id="qa-bulk-delete-btn"><span class="mac-iv-tool-icon">${ICON_TRASH}</span><span class="mac-iv-tool-label">일괄삭제</span></button>
          <button type="button" class="mac-iv-tool" id="qa-capture-btn"><span class="mac-iv-tool-icon">${ICON_CAMERA}</span><span class="mac-iv-tool-label">이미지로 저장 ▾</span></button>
        </div>
      </div>
      <div class="status" id="qa-status"></div>
      <div class="qa-stat-row">
        <div class="qa-stat-grid">${qaStatGridHtml(agentsList, year, monthIndex)}</div>
      </div>
      ${qaFilterRowHtml()}
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
    attachQAFilterRowHandlers(root);

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
