  function loadInterviewsData() {
    try {
      const raw = localStorage.getItem(INTERVIEWS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }
  let interviewsData = loadInterviewsData();

  let interviewStatusTimer = null;
  function flashInterviewStatus(msg, elId) {
    const el = document.getElementById(elId || "interview-status");
    if (!el) return;
    el.textContent = msg;
    clearTimeout(interviewStatusTimer);
    interviewStatusTimer = setTimeout(() => { if (el.textContent === msg) el.textContent = ""; }, 1600);
  }
  function saveInterviewsData() {
    try { localStorage.setItem(INTERVIEWS_KEY, JSON.stringify(interviewsData)); }
    catch (e) {}
  }
  function addInterview(values) {
    const id = genId();
    interviewsData.push(Object.assign({ id, createdAt: new Date().toISOString() }, values));
    saveInterviewsData();
    return id;
  }
  function updateInterview(id, values) {
    const idx = interviewsData.findIndex((r) => r.id === id);
    if (idx === -1) return;
    interviewsData[idx] = Object.assign({}, interviewsData[idx], values);
    saveInterviewsData();
  }
  function deleteInterview(id) {
    if (!interviewsData.some((r) => r.id === id)) return;
    recordUndo("면담 기록 삭제", INTERVIEWS_KEY, () => { interviewsData = loadInterviewsData(); });
    interviewsData = interviewsData.filter((r) => r.id !== id);
    saveInterviewsData();
  }
  function interviewTypeBadgeClass(type) {
    if (type === "정기") return "type-regular";
    if (type === "경고") return "type-warning";
    return "type-adhoc";
  }
  // 면담 기록을 최신 날짜순(같은 날짜면 최근 작성순)으로 정렬한다.
  function sortInterviews(list) {
    return [...list].sort((a, b) => {
      const d = (b.date || "").localeCompare(a.date || "");
      if (d !== 0) return d;
      return (b.createdAt || "").localeCompare(a.createdAt || "");
    });
  }
  // 상담사 이름 또는 LDAP으로 면담 기록을 검색한다.
  function interviewMatchesSearch(rec, query) {
    const needle = (query || "").trim().toLowerCase();
    if (!needle) return true;
    const agent = agentsData.find((a) => a.id === rec.agentId);
    if (!agent) return false;
    return (agent.name || "").toLowerCase().indexOf(needle) !== -1 || (agent.ldap || "").toLowerCase().indexOf(needle) !== -1;
  }
  function interviewMatchesType(rec, typeFilter) {
    if (typeFilter === "all") return true;
    return rec.type === typeFilter;
  }

  const interviewsUi = {
    mode: "list", // "list" | "add" | "edit"
    editingId: null,
    searchQuery: "",
    typeFilter: "all", // "all" | "정기" | "수시" | "경고"
    expandedIds: new Set(), // 목록에서 펼쳐본 면담 기록 id들 (상담사 상세 화면과 공유)
  };

  const homeUi = {
    interviewAlertExpanded: false, // 홈 화면의 "면담 필요 알림" 목록을 펼쳐서 볼지 여부
  };

  // 이름 · LDAP · 초성으로 검색해서 목록에서 바로 고르는 검색-선택 위젯 한 칸을 그려준다.
  // (대상 상담사 / 면담 관리자 모두 이 위젯을 함께 쓴다)
  function renderAgentPickerField(idPrefix, fieldKey, label, selectedAgent, placeholder) {
    const inputValue = selectedAgent ? `${selectedAgent.name} (${selectedAgent.ldap || "-"})` : "";
    return `
      <div class="agent-picker-field">
        <label class="agent-form-label">${label}
          <div class="agent-picker" id="${idPrefix}-${fieldKey}-picker">
            <input type="text" class="add-input agent-picker-input" id="${idPrefix}-${fieldKey}-search" placeholder="${esc(placeholder)}" value="${esc(inputValue)}" autocomplete="off">
            <input type="hidden" id="${idPrefix}-${fieldKey}" value="${selectedAgent ? selectedAgent.id : ""}">
            <div class="agent-picker-list" id="${idPrefix}-${fieldKey}-list"></div>
          </div>
        </label>
        <div class="agent-picker-info" id="${idPrefix}-${fieldKey}-info">${selectedAgent ? agentPickerInfoHtml(selectedAgent) : ""}</div>
      </div>
    `;
  }

  function agentPickerInfoHtml(agent) {
    const item = (label, valueHtml) => `<div class="agent-picker-info-item"><span class="agent-picker-info-item-label">${label}</span><span class="agent-picker-info-item-value">${valueHtml}</span></div>`;
    return `
      ${item("이름", esc(agent.name || "-"))}
      ${item("LDAP", esc(agent.ldap || "-"))}
      ${item("근무 조", scheduleGroupBadgeHtml(agent.group))}
      ${item("업무 구분", workTypeBadgesHtml(agent.workTypes))}
      ${item("시간대", agent.timezone ? esc(agent.timezone) : '<span class="agent-field-empty">-</span>')}
    `;
  }

  // 위 필드를 실제로 검색·선택되게 동작시킨다. candidates가 검색 대상 목록.
  function attachAgentPickerField(idPrefix, fieldKey, candidates) {
    const picker = document.getElementById(`${idPrefix}-${fieldKey}-picker`);
    if (!picker) return;
    const input = document.getElementById(`${idPrefix}-${fieldKey}-search`);
    const hidden = document.getElementById(`${idPrefix}-${fieldKey}`);
    const listEl = document.getElementById(`${idPrefix}-${fieldKey}-list`);
    const infoEl = document.getElementById(`${idPrefix}-${fieldKey}-info`);

    function selectAgent(agent) {
      hidden.value = agent ? agent.id : "";
      input.value = agent ? `${agent.name} (${agent.ldap || "-"})` : "";
      infoEl.innerHTML = agent ? agentPickerInfoHtml(agent) : "";
    }

    function renderList(query) {
      const matches = candidates.filter((a) => agentMatchesSearch(a, query)).slice(0, 30);
      listEl.innerHTML = matches.length === 0
        ? `<div class="agent-picker-empty">${candidates.length === 0 ? "등록된 인원이 없어요." : "일치하는 인원이 없어요."}</div>`
        : matches.map((a) => `
            <div class="agent-picker-item" data-id="${a.id}">
              <span>${esc(a.name)}</span><span class="agent-picker-item-ldap">${esc(a.ldap || "")}</span>
            </div>
          `).join("");
      listEl.querySelectorAll("[data-id]").forEach((item) => {
        // 클릭 시 input의 blur가 먼저 발생해 목록이 닫히는 것을 막기 위해 mousedown에서 선택을 처리한다.
        item.onmousedown = (e) => {
          e.preventDefault();
          const agent = candidates.find((a) => a.id === item.getAttribute("data-id"));
          if (agent) selectAgent(agent);
          listEl.classList.remove("open");
        };
      });
      listEl.classList.add("open");
    }

    input.oninput = () => {
      if (hidden.value) selectAgent(null);
      renderList(input.value);
    };
    input.onfocus = () => renderList(input.value);
    input.onblur = () => { setTimeout(() => listEl.classList.remove("open"), 120); };
  }

  function renderInterviewFormFields(v, lockAgentId, idPrefix) {
    const activeAgents = agentsData.slice().sort((a, b) => a.name.localeCompare(b.name, "ko"));
    const managerCandidates = agentsData.filter((a) => a.isAdmin).sort((a, b) => a.name.localeCompare(b.name, "ko"));
    const selectedManager = v.managerId ? agentsData.find((a) => a.id === v.managerId) || null : null;

    const targetFieldHtml = lockAgentId ? "" : renderAgentPickerField(idPrefix, "agent", "대상 상담사", v.agentId ? activeAgents.find((a) => a.id === v.agentId) || null : null, "이름, LDAP, 초성으로 검색");
    const managerFieldHtml = renderAgentPickerField(idPrefix, "manager", "면담 관리자", selectedManager, managerCandidates.length ? "이름, LDAP, 초성으로 검색" : "등록된 관리자가 없어요");

    const pickerRowHtml = lockAgentId
      ? managerFieldHtml
      : `<div class="agent-form-row-2">${targetFieldHtml}${managerFieldHtml}</div>`;

    return `
      ${pickerRowHtml}
      <label class="agent-form-label">면담 날짜
        <input type="text" class="add-input" id="${idPrefix}-date" value="${esc(v.date || "")}" placeholder="예: ${todayISO()}" autocomplete="off">
      </label>
      <div class="agent-form-label">면담 유형
        <div class="agent-radio-row">
          ${INTERVIEW_TYPES.map((t) => `
            <label class="agent-radio"><input type="radio" name="${idPrefix}-type" value="${t}" ${v.type === t ? "checked" : ""}> ${t}</label>
          `).join("")}
        </div>
      </div>
      <label class="agent-form-label">면담 내용
        <textarea class="add-input interview-textarea interview-textarea-content" id="${idPrefix}-content" placeholder="면담에서 나눈 내용을 적어주세요">${esc(v.content || "")}</textarea>
      </label>
      <label class="agent-form-label">후속조치 / 다음 계획 (선택)
        <textarea class="add-input interview-textarea" id="${idPrefix}-followup" placeholder="다음에 확인할 사항이 있다면 적어주세요">${esc(v.followUp || "")}</textarea>
      </label>
    `;
  }

  // renderInterviewFormFields로 그려진 폼이 실제 DOM에 붙은 뒤 호출해서 검색-선택 위젯을 동작시킨다.
  function attachInterviewFormPickers(idPrefix, lockAgentId) {
    if (!lockAgentId) {
      const activeAgents = agentsData.slice().sort((a, b) => a.name.localeCompare(b.name, "ko"));
      attachAgentPickerField(idPrefix, "agent", activeAgents);
    }
    const managerCandidates = agentsData.filter((a) => a.isAdmin).sort((a, b) => a.name.localeCompare(b.name, "ko"));
    attachAgentPickerField(idPrefix, "manager", managerCandidates);
  }

  function readInterviewFormValues(idPrefix, lockAgentId) {
    const agentHidden = document.getElementById(`${idPrefix}-agent`);
    const agentId = lockAgentId || (agentHidden ? agentHidden.value : "");
    if (!agentId) return null;
    const managerHidden = document.getElementById(`${idPrefix}-manager`);
    const managerId = managerHidden ? managerHidden.value : "";
    const date = document.getElementById(`${idPrefix}-date`).value.trim();
    const typeInput = document.querySelector(`input[name="${idPrefix}-type"]:checked`);
    const type = typeInput ? typeInput.value : INTERVIEW_TYPES[0];
    const content = document.getElementById(`${idPrefix}-content`).value.trim();
    const followUp = document.getElementById(`${idPrefix}-followup`).value.trim();
    return { agentId, managerId, date, type, content, followUp };
  }

  function renderInterviewRow(rec, actionPrefix) {
    const agent = agentsData.find((a) => a.id === rec.agentId);
    const agentNameHtml = agent
      ? `<span class="interview-agent-name">${esc(agent.name)}</span><span class="interview-agent-ldap">${esc(agent.ldap)}</span>`
      : `<span class="interview-agent-name agent-field-empty">(삭제된 상담사)</span>`;
    const agentMetaHtml = agent ? `
      <span class="interview-agent-meta">
        ${agent.timezone ? `<span class="interview-agent-timezone">${ICON_CLOCK} ${esc(agent.timezone)}</span>` : ""}
        <span class="badge sm ${agent.group === "night" ? "night" : "day"}">${agent.group === "night" ? "야간" : "주간"}</span>
        ${(agent.workTypes || []).map((t) => `<span class="badge sm ${t === "유선" ? "voice" : "chat"}">${esc(t)}</span>`).join("")}
      </span>
    ` : "";
    const manager = rec.managerId ? agentsData.find((a) => a.id === rec.managerId) : null;
    const managerHtml = manager ? `<span class="interview-agent-ldap">${ICON_SHIELD} ${esc(manager.name)} · ${esc(manager.ldap)}</span>` : "";
    const isExpanded = interviewsUi.expandedIds.has(rec.id);
    return `
      <div class="interview-row ${isExpanded ? "expanded" : ""}">
        <div class="interview-row-top" data-action="toggle-interview-row" data-id="${rec.id}">
          <span class="interview-row-chevron">${ICON_CHEVRON_RIGHT}</span>
          <span class="interview-date">${esc(rec.date || "-")}</span>
          <span class="badge sm ${interviewTypeBadgeClass(rec.type)}">${esc(rec.type || "수시")}</span>
          ${agentNameHtml}
          ${agentMetaHtml}
          ${managerHtml}
          <div class="interview-row-actions">
            <button class="ghost-btn" data-action="${actionPrefix}-edit-interview" data-id="${rec.id}">수정</button>
            <button class="ghost-btn danger" data-action="${actionPrefix}-delete-interview" data-id="${rec.id}">삭제</button>
          </div>
        </div>
        ${isExpanded ? `
          <div class="interview-row-body">
            ${rec.content ? `<div class="interview-content">${esc(rec.content)}</div>` : ""}
            <div class="interview-followup">후속조치: ${rec.followUp ? esc(rec.followUp) : "없음"}</div>
          </div>
        ` : ""}
      </div>
    `;
  }

  // 면담 기록 행을 펼치고/접는 클릭을 처리한다. 수정·삭제 버튼 클릭은 여기서 무시한다.
  function attachInterviewRowToggles(root, onToggle) {
    root.querySelectorAll("[data-action='toggle-interview-row']").forEach((row) => {
      row.onclick = (e) => {
        if (e.target.closest(".interview-row-actions")) return;
        const id = row.getAttribute("data-id");
        if (interviewsUi.expandedIds.has(id)) {
          interviewsUi.expandedIds.delete(id);
        } else {
          interviewsUi.expandedIds.add(id);
        }
        onToggle();
      };
    });
  }

  /* ---- 독립 메뉴: 면담일지 페이지 ---- */
  function renderInterviewsPage(root) {
    const filtered = sortInterviews(
      interviewsData.filter((r) => interviewMatchesSearch(r, interviewsUi.searchQuery) && interviewMatchesType(r, interviewsUi.typeFilter))
    );

    let bodyHtml;
    if (interviewsUi.mode === "add") {
      bodyHtml = `
        <div class="agent-form-title">새 면담 기록 추가</div>
        <form class="agent-form" id="interview-page-form">
          ${renderInterviewFormFields({ date: todayISO(), type: "정기" }, null, "interview-page")}
          <div class="agent-form-actions">
            <button type="submit" class="primary-btn">추가</button>
            <button type="button" class="cancel-btn" id="interview-page-cancel">취소</button>
          </div>
        </form>
      `;
    } else if (interviewsUi.mode === "edit") {
      const editing = interviewsData.find((r) => r.id === interviewsUi.editingId) || null;
      bodyHtml = editing ? `
        <div class="agent-form-title">면담 기록 수정</div>
        <form class="agent-form" id="interview-page-form">
          ${renderInterviewFormFields(editing, null, "interview-page")}
          <div class="agent-form-actions">
            <button type="submit" class="primary-btn">저장</button>
            <button type="button" class="cancel-btn" id="interview-page-cancel">취소</button>
          </div>
        </form>
      ` : `<div class="agent-list-empty">기록을 찾을 수 없어요.</div>`;
    } else {
      const typeFilterBtns = ["all", ...INTERVIEW_TYPES].map((t) => `
        <button type="button" class="agent-filter-btn ${interviewsUi.typeFilter === t ? "active" : ""}" data-interview-filter="${t}">${t === "all" ? "전체" : t}</button>
      `).join("");
      bodyHtml = `
        <div class="agent-controls">
          <input type="text" class="add-input agent-search-input" id="interview-search-input" placeholder="상담사 이름 또는 LDAP 검색" value="${esc(interviewsUi.searchQuery)}" autocomplete="off">
          <div class="agent-filter-row">${typeFilterBtns}</div>
        </div>
        <div id="interview-list-area">
          ${filtered.length === 0
            ? `<div class="agent-list-empty">${interviewsData.length === 0 ? "등록된 면담 기록이 없어요." : "검색 또는 필터 조건에 맞는 면담 기록이 없어요."}</div>`
            : `<div class="interview-list">${filtered.map((r) => renderInterviewRow(r, "page")).join("")}</div>`}
        </div>
      `;
    }

    root.innerHTML = `
      <div class="card">
        <div class="agent-list-header">
          <div class="agent-list-title">면담일지</div>
          ${interviewsUi.mode === "list" ? `<button class="ghost-btn" id="btn-interview-add">＋ 면담 기록 추가</button>` : ""}
        </div>
        <div class="agent-summary">전체 ${interviewsData.length}건${interviewsUi.mode === "list" && filtered.length !== interviewsData.length ? ` · 필터 결과 ${filtered.length}건` : ""}</div>
        <div class="status" id="interview-status"></div>
        ${bodyHtml}
      </div>
    `;

    attachInterviewsPageEvents(root);
  }

  function updateInterviewListArea() {
    const area = document.getElementById("interview-list-area");
    if (!area) return;
    const filtered = sortInterviews(
      interviewsData.filter((r) => interviewMatchesSearch(r, interviewsUi.searchQuery) && interviewMatchesType(r, interviewsUi.typeFilter))
    );
    area.innerHTML = filtered.length === 0
      ? `<div class="agent-list-empty">${interviewsData.length === 0 ? "등록된 면담 기록이 없어요." : "검색 또는 필터 조건에 맞는 면담 기록이 없어요."}</div>`
      : `<div class="interview-list">${filtered.map((r) => renderInterviewRow(r, "page")).join("")}</div>`;
    attachInterviewListAreaHandlers(area);
    const summaryEl = document.querySelector("#page-inner .agent-summary");
    if (summaryEl) {
      summaryEl.textContent = `전체 ${interviewsData.length}건${filtered.length !== interviewsData.length ? ` · 필터 결과 ${filtered.length}건` : ""}`;
    }
  }

  function attachInterviewListAreaHandlers(root) {
    attachInterviewRowToggles(root, updateInterviewListArea);
    root.querySelectorAll("[data-action='page-edit-interview']").forEach((btn) => {
      btn.onclick = () => {
        interviewsUi.mode = "edit";
        interviewsUi.editingId = btn.getAttribute("data-id");
        renderApp();
      };
    });
    root.querySelectorAll("[data-action='page-delete-interview']").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-id");
        if (window.confirm("이 면담 기록을 삭제할까요?")) {
          deleteInterview(id);
          renderApp();
        }
      };
    });
  }

  function attachInterviewsPageEvents(root) {
    const addBtn = document.getElementById("btn-interview-add");
    if (addBtn) {
      addBtn.onclick = () => {
        interviewsUi.mode = "add";
        interviewsUi.editingId = null;
        renderApp();
      };
    }
    const searchInput = document.getElementById("interview-search-input");
    if (searchInput) {
      searchInput.oninput = (e) => {
        interviewsUi.searchQuery = e.target.value;
        updateInterviewListArea();
      };
    }
    root.querySelectorAll("[data-interview-filter]").forEach((btn) => {
      btn.onclick = () => {
        interviewsUi.typeFilter = btn.getAttribute("data-interview-filter");
        renderApp();
      };
    });
    attachInterviewListAreaHandlers(root);

    const form = document.getElementById("interview-page-form");
    if (form) {
      attachInterviewFormPickers("interview-page", null);
      form.onsubmit = (e) => {
        e.preventDefault();
        const values = readInterviewFormValues("interview-page", null);
        if (!values) { flashInterviewStatus("대상 상담사를 선택해주세요."); return; }
        if (interviewsUi.mode === "edit" && interviewsUi.editingId) {
          updateInterview(interviewsUi.editingId, values);
        } else {
          addInterview(values);
        }
        interviewsUi.mode = "list";
        interviewsUi.editingId = null;
        renderApp();
      };
      const cancelBtn = document.getElementById("interview-page-cancel");
      if (cancelBtn) {
        cancelBtn.onclick = () => {
          interviewsUi.mode = "list";
          interviewsUi.editingId = null;
          renderApp();
        };
      }
    }
  }

  /* ---- 상담사 상세 화면에 끼워 넣는 면담 이력 섹션 ---- */
  function renderAgentInterviewSection(agent) {
    const records = sortInterviews(interviewsData.filter((r) => r.agentId === agent.id));
    let bodyHtml;
    if (agentsUi.interviewMode === "add") {
      bodyHtml = `
        <form class="agent-form" id="agent-interview-form">
          ${renderInterviewFormFields({ date: todayISO(), type: "정기" }, agent.id, "agent-interview")}
          <div class="agent-form-actions">
            <button type="submit" class="primary-btn">추가</button>
            <button type="button" class="cancel-btn" id="agent-interview-cancel">취소</button>
          </div>
        </form>
      `;
    } else if (agentsUi.interviewMode === "edit") {
      const editing = interviewsData.find((r) => r.id === agentsUi.interviewEditingId) || null;
      bodyHtml = editing ? `
        <form class="agent-form" id="agent-interview-form">
          ${renderInterviewFormFields(editing, agent.id, "agent-interview")}
          <div class="agent-form-actions">
            <button type="submit" class="primary-btn">저장</button>
            <button type="button" class="cancel-btn" id="agent-interview-cancel">취소</button>
          </div>
        </form>
      ` : `<div class="agent-list-empty">기록을 찾을 수 없어요.</div>`;
    } else {
      bodyHtml = records.length === 0
        ? `<div class="agent-list-empty">이 상담사와의 면담 기록이 없어요.</div>`
        : `<div class="interview-list">${records.map((r) => renderInterviewRow(r, "agent")).join("")}</div>`;
    }
    return `
      <div class="agent-interview-section">
        <div class="agent-interview-header">
          <div class="agent-interview-title">${ICON_CLIPBOARD} 면담 이력</div>
          <div class="agent-interview-header-actions">
            ${agentsUi.interviewMode === "list" ? `<button class="ghost-btn" id="btn-agent-interview-add">＋ 면담 기록 추가</button>` : ""}
            <button class="ghost-btn" data-action="agent-goto-interviews" data-id="${agent.id}">${ICON_CHEVRON_RIGHT} 면담일지 전체보기</button>
          </div>
        </div>
        ${bodyHtml}
      </div>
    `;
  }

  function attachAgentInterviewEvents(root, agent) {
    attachInterviewRowToggles(root, renderApp);
    const addBtn = document.getElementById("btn-agent-interview-add");
    if (addBtn) {
      addBtn.onclick = () => {
        agentsUi.interviewMode = "add";
        agentsUi.interviewEditingId = null;
        renderApp();
      };
    }
    // 상담사 상세 → 면담일지 전체 화면으로 이동하면서, 이 상담사 이름으로 미리 검색해둔다.
    root.querySelectorAll("[data-action='agent-goto-interviews']").forEach((btn) => {
      btn.onclick = () => {
        interviewsUi.searchQuery = agent.name;
        interviewsUi.typeFilter = "all";
        interviewsUi.mode = "list";
        setPage("interviews");
      };
    });
    // 상담사 상세 → 품질 관리 화면으로 이동하면서, 이 상담사가 있는 달로 맞춰준다.
    root.querySelectorAll("[data-action='agent-goto-qa']").forEach((btn) => {
      btn.onclick = () => {
        qaUi.year = today.getFullYear();
        qaUi.monthIndex = today.getMonth();
        qaHighlightAgentId = agent.id;
        setPage("qa");
      };
    });
    root.querySelectorAll("[data-action='agent-edit-interview']").forEach((btn) => {
      btn.onclick = () => {
        agentsUi.interviewMode = "edit";
        agentsUi.interviewEditingId = btn.getAttribute("data-id");
        renderApp();
      };
    });
    root.querySelectorAll("[data-action='agent-delete-interview']").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-id");
        if (window.confirm("이 면담 기록을 삭제할까요?")) {
          deleteInterview(id);
          renderApp();
        }
      };
    });
    const form = document.getElementById("agent-interview-form");
    if (form) {
      attachInterviewFormPickers("agent-interview", agent.id);
      form.onsubmit = (e) => {
        e.preventDefault();
        const values = readInterviewFormValues("agent-interview", agent.id);
        if (!values) return;
        if (agentsUi.interviewMode === "edit" && agentsUi.interviewEditingId) {
          updateInterview(agentsUi.interviewEditingId, values);
        } else {
          addInterview(values);
        }
        agentsUi.interviewMode = "list";
        agentsUi.interviewEditingId = null;
        renderApp();
      };
      const cancelBtn = document.getElementById("agent-interview-cancel");
      if (cancelBtn) {
        cancelBtn.onclick = () => {
          agentsUi.interviewMode = "list";
          agentsUi.interviewEditingId = null;
          renderApp();
        };
      }
    }
  }

  /* ===================== 내비게이션 + 앱 렌더 ===================== */
  /* ===================== 월별 스케줄 모듈 ===================== */
  const SCHEDULE_KEY = acctKey("personal-schedule:data");

