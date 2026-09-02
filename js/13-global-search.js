  /* ===================== 전역 검색 (상담사 · 메모 · 면담일지 통합) =====================
     상담사 관리 / 업무 정리 / 면담일지 페이지에 각각 따로 있는 검색을 한 곳에서
     "이 사람과 관련된 것 다 보여줘" 식으로 통합해서 찾아주는 기능.
     - 위치: 하단 내비게이션 독의 카테고리 아이콘들 바로 위 (#nav-dock 안, #nav 앞)
     - 결과: 새 페이지로 이동하지 않고, 검색 바로 위에 카드 목록(드롭다운)으로 떠서 보여줌
     - 카드를 클릭하면 해당 페이지로 이동해서 그 항목을 바로 펼쳐서 보여줌

     주의: 이 검색창은 renderNav()처럼 매번 innerHTML을 새로 그리지 않는다(앱 전체에서
     renderApp()이 호출될 때마다 통째로 다시 그려지면, 타이핑 중 입력창이 사라져서
     포커스/커서가 끊길 수 있기 때문). 그래서 앱이 처음 뜰 때 딱 한 번만 껍데기를
     그리고, 이후에는 결과 패널(#gs-results-panel)만 갱신한다. */

  const ICON_SEARCH = `<svg class="icon-emo" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="4.2"/><path d="M13 13l-2.9-2.9"/></svg>`;

  const globalSearchState = { query: "" };

  function gsTruncateText(str, max) {
    const s = (str || "").replace(/\s+/g, " ").trim();
    if (!s) return "";
    if (s.length <= max) return s;
    return s.slice(0, max) + "…";
  }

  // 일반 텍스트 포함 검색 + 초성 검색(상담사 이름 검색과 동일한 방식)을 함께 지원.
  function gsTextMatches(text, needle) {
    if (!needle) return false;
    const t = (text || "").toLowerCase();
    if (t.indexOf(needle) !== -1) return true;
    if (getChosungString(text || "").indexOf(needle) !== -1) return true;
    return false;
  }

  function computeGlobalSearchResults(rawQuery) {
    const needle = (rawQuery || "").trim().toLowerCase();
    if (!needle) return null;

    const agentResults = agentsData.filter((a) => agentMatchesSearch(a, rawQuery)).slice(0, 20);

    const noteResults = [];
    Object.keys(notesData.notes).forEach((id) => {
      const note = notesData.notes[id];
      if (!note) return;
      if (gsTextMatches(note.title, needle) || gsTextMatches(note.content, needle)) {
        noteResults.push(note);
      }
    });

    const interviewResults = interviewsData.filter((rec) => {
      const agent = agentsData.find((a) => a.id === rec.agentId);
      if (agent && agentMatchesSearch(agent, rawQuery)) return true;
      if (gsTextMatches(rec.content, needle)) return true;
      if (gsTextMatches(rec.followUp, needle)) return true;
      return false;
    }).slice(0, 20);

    // 품질 관리는 근무중이든 퇴사든 상관없이, 이름이 일치하는 "QA 관리 대상"
    // (관리자가 아닌) 상담사를 그대로 보여준다. 상담사 결과와 대상은 같지만
    // 화면에서는 면담일지처럼 별도 섹션으로 분리해서 QA 점수만 보여준다.
    const qaResults = agentResults.filter((a) => !a.isAdmin);

    return {
      agentResults,
      noteResults: noteResults.slice(0, 20),
      interviewResults: sortInterviews(interviewResults),
      qaResults,
    };
  }

  // 최근 3개월(이번 달 포함) QA 점수를 가로로 나란히 보여주는 알약 목록.
  // (상담사 상세의 "최근 QA 점수" 미리보기와 같은 3개월 구간을 그대로 재사용한다.)
  function gsQaMonthPillsHtml(agent) {
    if (typeof getQAScore !== "function") return "";
    const months = [];
    for (let i = 0; i <= 2; i++) {
      let m = today.getMonth() - i;
      let y = today.getFullYear();
      while (m < 0) { m += 12; y -= 1; }
      months.push({ year: y, monthIndex: m });
    }
    return months.map(({ year, monthIndex }) => {
      const val = getQAScore(agent.id, year, monthIndex);
      const isCur = year === today.getFullYear() && monthIndex === today.getMonth();
      const label = isCur ? "이번 달" : `${monthIndex + 1}월`;
      return `
        <div class="gs-qa-cell${val === null ? " empty" : ""}">
          <div class="gs-qa-cell-label">${esc(label)}</div>
          <div class="gs-qa-cell-value">${val === null ? "데이터 없음" : val.toFixed(1)}</div>
        </div>
      `;
    }).join("");
  }

  function renderGlobalSearchResultsHtml(results, query) {
    if (!results) return "";
    const { agentResults, noteResults, interviewResults, qaResults } = results;
    const total = agentResults.length + noteResults.length + interviewResults.length + qaResults.length;
    if (total === 0) {
      return `<div class="gs-empty">"${esc(query)}"에 대한 검색 결과가 없어요.</div>`;
    }

    let html = "";

    if (agentResults.length) {
      html += `<div class="gs-section"><div class="gs-section-title">${ICON_USERS} 상담사 <span class="gs-count">${agentResults.length}</span></div>`;
      html += agentResults.map((a) => {
        return `
        <button type="button" class="gs-card" data-gs-action="agent" data-id="${a.id}">
          <div class="gs-card-main">
            <span class="gs-card-title">${esc(a.name)}${a.isAdmin ? ' <span class="badge sm admin">관리자</span>' : ""}</span>
            <span class="gs-card-sub">${esc(a.ldap || "-")}</span>
          </div>
          <div class="gs-card-badges">
            ${a.status === "RESIGNED" ? '<span class="badge sm resigned">퇴사</span>' : '<span class="badge sm working">근무중</span>'}
          </div>
        </button>
      `;
      }).join("");
      html += `</div>`;
    }

    if (qaResults.length) {
      html += `<div class="gs-section"><div class="gs-section-title">${ICON_QA} 품질 관리 <span class="gs-count">${qaResults.length}</span></div>`;
      html += qaResults.map((a) => `
        <button type="button" class="gs-card gs-card-qa" data-gs-action="qa" data-id="${a.id}">
          <div class="gs-card-main">
            <span class="gs-card-title">${esc(a.name)}</span>
            <div class="gs-qa-sub-row">
              <span class="gs-card-sub">QA 점수</span>
              <div class="gs-qa-pills">${gsQaMonthPillsHtml(a)}</div>
            </div>
          </div>
        </button>
      `).join("");
      html += `</div>`;
    }

    if (noteResults.length) {
      html += `<div class="gs-section"><div class="gs-section-title">${ICON_NOTE} 메모 <span class="gs-count">${noteResults.length}</span></div>`;
      html += noteResults.map((n) => {
        const folder = n.folderId ? notesData.folders.find((f) => f.id === n.folderId) : null;
        const snippet = gsTruncateText(n.content, 60);
        return `
        <button type="button" class="gs-card" data-gs-action="note" data-id="${n.id}">
          <div class="gs-card-main">
            <span class="gs-card-title">${esc(n.title)}</span>
            <span class="gs-card-sub">${snippet ? esc(snippet) : '<span class="agent-field-empty">내용 없음</span>'}</span>
          </div>
          ${folder ? `<div class="gs-card-badges"><span class="note-folder-tag">${esc(folder.name)}</span></div>` : ""}
        </button>
      `;
      }).join("");
      html += `</div>`;
    }

    if (interviewResults.length) {
      html += `<div class="gs-section"><div class="gs-section-title">${ICON_CLIPBOARD} 면담일지 <span class="gs-count">${interviewResults.length}</span></div>`;
      html += interviewResults.map((rec) => {
        const agent = agentsData.find((a) => a.id === rec.agentId);
        const snippet = gsTruncateText(rec.content, 60);
        return `
        <button type="button" class="gs-card" data-gs-action="interview" data-id="${rec.id}">
          <div class="gs-card-main">
            <span class="gs-card-title">${esc(agent ? agent.name : "(삭제된 상담사)")} <span class="badge sm ${interviewTypeBadgeClass(rec.type)}">${esc(rec.type || "수시")}</span></span>
            <span class="gs-card-sub">${snippet ? esc(snippet) : '<span class="agent-field-empty">내용 없음</span>'}</span>
          </div>
          <div class="gs-card-badges"><span class="gs-card-date">${esc(rec.date || "-")}</span></div>
        </button>
      `;
      }).join("");
      html += `</div>`;
    }

    return html;
  }

  function openGlobalSearchResults() {
    const wrap = document.getElementById("gs-wrap");
    if (wrap) wrap.classList.add("open");
  }
  function closeGlobalSearchResults() {
    const wrap = document.getElementById("gs-wrap");
    if (wrap) wrap.classList.remove("open");
  }

  // 검색창 입력값 + 결과 패널을 비운다. 독을 닫을 때(closeDock)와 검색 결과 카드를
  // 선택해 다른 페이지로 이동할 때 공통으로 쓴다.
  function resetGlobalSearchQuery() {
    globalSearchState.query = "";
    const input = document.getElementById("gs-input");
    if (input) input.value = "";
    const clearBtn = document.getElementById("gs-clear-btn");
    if (clearBtn) clearBtn.classList.remove("visible");
    const panel = document.getElementById("gs-results-panel");
    if (panel) panel.innerHTML = "";
    closeGlobalSearchResults();
  }

  // 검색 결과 카드를 선택해 다른 페이지로 이동한 뒤: 검색창을 비우고 독을 닫는다.
  function resetGlobalSearchAfterNavigate() {
    resetGlobalSearchQuery();
    if (typeof closeDock === "function") closeDock();
  }

  function openAgentFromGlobalSearch(id) {
    agentsUi.selectedId = id;
    agentsUi.mode = "view";
    agentsUi.interviewMode = "list";
    agentsUi.interviewEditingId = null;
    setPage("agents");
    resetGlobalSearchAfterNavigate();
  }

  // 품질 관리 화면으로 이동하면서, 오늘 기준 달로 맞추고 그 상담사의 행을 강조한다.
  // (상담사 상세 → "품질 관리로 이동" 버튼과 동일한 방식)
  function openQAFromGlobalSearch(id) {
    qaUi.year = today.getFullYear();
    qaUi.monthIndex = today.getMonth();
    qaHighlightAgentId = id;
    setPage("qa");
    resetGlobalSearchAfterNavigate();
  }

  function openNoteFromGlobalSearch(id) {
    const note = notesData.notes[id];
    if (!note) return;
    const folderKey = note.folderId || UNFILED;
    notesUi.collapsedFolders[folderKey] = false;
    notesUi.expanded[id] = true;
    setPage("notes");
    resetGlobalSearchAfterNavigate();
    setTimeout(() => {
      const row = document.querySelector(`.note-row[data-note-id="${id}"]`);
      if (row) row.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
  }

  function openInterviewFromGlobalSearch(id) {
    const rec = interviewsData.find((r) => r.id === id);
    if (!rec) return;
    const agent = agentsData.find((a) => a.id === rec.agentId);
    interviewsUi.mode = "list";
    interviewsUi.searchQuery = agent ? agent.name : "";
    interviewsUi.typeFilter = "all";
    interviewsUi.expandedIds.add(id);
    setPage("interviews");
    resetGlobalSearchAfterNavigate();
    setTimeout(() => {
      const row = document.querySelector(`.interview-row-top[data-id="${id}"]`);
      if (row) row.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
  }

  function attachGlobalSearchResultHandlers(panel) {
    panel.querySelectorAll("[data-gs-action='agent']").forEach((btn) => {
      btn.onclick = () => openAgentFromGlobalSearch(btn.getAttribute("data-id"));
    });
    panel.querySelectorAll("[data-gs-action='qa']").forEach((btn) => {
      btn.onclick = () => openQAFromGlobalSearch(btn.getAttribute("data-id"));
    });
    panel.querySelectorAll("[data-gs-action='note']").forEach((btn) => {
      btn.onclick = () => openNoteFromGlobalSearch(btn.getAttribute("data-id"));
    });
    panel.querySelectorAll("[data-gs-action='interview']").forEach((btn) => {
      btn.onclick = () => openInterviewFromGlobalSearch(btn.getAttribute("data-id"));
    });
  }

  function updateGlobalSearchResultsPanel() {
    const panel = document.getElementById("gs-results-panel");
    if (!panel) return;
    const query = globalSearchState.query;
    if (!query.trim()) {
      closeGlobalSearchResults();
      panel.innerHTML = "";
      return;
    }
    const results = computeGlobalSearchResults(query);
    panel.innerHTML = renderGlobalSearchResultsHtml(results, query);
    openGlobalSearchResults();
    attachGlobalSearchResultHandlers(panel);
  }

  function globalSearchOutsideHandler(e) {
    const wrap = document.getElementById("gs-wrap");
    if (wrap && !wrap.contains(e.target)) closeGlobalSearchResults();
  }

  function renderGlobalSearchShell() {
    const root = document.getElementById("global-search-root");
    if (!root) return;
    // 마스터(관리자) 계정은 상담사·메모·면담일지 페이지 자체가 없으므로 검색도 숨긴다.
    if (CURRENT_ACCOUNT_IS_MASTER) { root.innerHTML = ""; return; }

    root.innerHTML = `
      <div class="gs-wrap" id="gs-wrap">
        <div class="gs-bar">
          <input type="text" id="gs-input" class="gs-input" placeholder="이름 통합 검색" autocomplete="off">
          <button type="button" id="gs-clear-btn" class="gs-clear-btn" title="지우기" aria-label="지우기">${ICON_CLOSE_SM}</button>
          ${ICON_SEARCH}
        </div>
        <div class="gs-results" id="gs-results-panel"></div>
      </div>
    `;

    const input = document.getElementById("gs-input");
    const clearBtn = document.getElementById("gs-clear-btn");

    input.oninput = (e) => {
      globalSearchState.query = e.target.value;
      clearBtn.classList.toggle("visible", !!e.target.value);
      updateGlobalSearchResultsPanel();
    };
    input.addEventListener("focus", () => {
      if (globalSearchState.query.trim()) openGlobalSearchResults();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeGlobalSearchResults();
        input.blur();
      } else if (e.key === "Enter") {
        const panel = document.getElementById("gs-results-panel");
        const first = panel && panel.querySelector(".gs-card");
        if (first) first.click();
      }
    });
    clearBtn.onclick = () => {
      globalSearchState.query = "";
      input.value = "";
      clearBtn.classList.remove("visible");
      updateGlobalSearchResultsPanel();
      input.focus();
    };

    document.addEventListener("mousedown", globalSearchOutsideHandler, true);
  }

  // 앱 전체 렌더 주기(renderApp/renderNav)와 분리해서, 처음 한 번만 그린다.
  renderGlobalSearchShell();
