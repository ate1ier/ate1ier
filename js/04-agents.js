  function loadAgentsData() {
    try {
      const raw = localStorage.getItem(AGENTS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }
  let agentsData = loadAgentsData();

  const agentsUi = {
    selectedId: null,
    mode: "view", // "view" | "add" | "edit"
    editingId: null,
    searchQuery: "",
    filterTypes: new Set(), // 비어있으면 "전체". "voice"|"chat"|"day"|"night"|"working"|"resigned" 중복 선택(AND 조합) 가능
    sortBy: "shift", // "shift" | "custom" | "name" | "type" | "chat" | "night" | "created"
    interviewMode: "list", // "list" | "add" | "edit" — 상담사 상세의 면담 이력 섹션용
    interviewEditingId: null,
  };

  function flashAgentStatus(msg) { flashStatusMessage("agent-status", msg, 1200); }
  function saveAgentsData() {
    try { localStorage.setItem(AGENTS_KEY, JSON.stringify(agentsData)); flashAgentStatus("저장됨"); }
    catch (e) { flashAgentStatus("저장 실패"); }
    // 상담사 관리 목록이 바뀔 때마다 월별 스케줄의 인원 목록도 자동으로 맞춰준다.
    // (실제로 스케줄 쪽 데이터가 바뀌었을 때만 다시 저장한다)
    if (typeof syncScheduleStaffFromAgents === "function") {
      if (syncScheduleStaffFromAgents()) saveScheduleData();
    }
  }

  function addAgent(values) {
    const id = genId();
    agentsData.push(Object.assign({ id }, values));
    saveAgentsData();
    return id;
  }
  function updateAgent(id, values) {
    const idx = agentsData.findIndex((a) => a.id === id);
    if (idx === -1) return;
    agentsData[idx] = Object.assign({}, agentsData[idx], values);
    saveAgentsData();
  }
  function deleteAgent(id) {
    // 상담사를 지울 때 그 사람의 면담 기록도 함께 정리되므로, 두 저장소를 함께 스냅샷해둔다.
    recordUndo("상담사 삭제", [AGENTS_KEY, INTERVIEWS_KEY], () => {
      agentsData = loadAgentsData();
      interviewsData = loadInterviewsData();
    });
    agentsData = agentsData.filter((a) => a.id !== id);
    if (agentsUi.selectedId === id) agentsUi.selectedId = null;
    saveAgentsData();
    // 상담사를 지울 때 그 사람의 면담 기록도 함께 정리한다.
    if (typeof interviewsData !== "undefined") {
      interviewsData = interviewsData.filter((r) => r.agentId !== id);
      saveInterviewsData();
    }
  }
  function reorderAgents(fromId, toId) {
    const fromIdx = agentsData.findIndex((a) => a.id === fromId);
    const toIdx = agentsData.findIndex((a) => a.id === toId);
    if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return;
    const [item] = agentsData.splice(fromIdx, 1);
    const newToIdx = agentsData.findIndex((a) => a.id === toId);
    agentsData.splice(newToIdx, 0, item);
    saveAgentsData();
  }
  const AGENT_PIN_LIMIT = 10;
  function togglePinAgent(id) {
    const agent = agentsData.find((a) => a.id === id);
    if (!agent) return;
    if (!agent.pinned) {
      const pinnedCount = agentsData.filter((a) => a.pinned).length;
      if (pinnedCount >= AGENT_PIN_LIMIT) {
        flashAgentStatus(`고정은 최대 ${AGENT_PIN_LIMIT}개까지 가능해요`);
        return;
      }
    }
    agent.pinned = !agent.pinned;
    saveAgentsData();
    renderApp();
  }

  // 리스트에서 바로 "근무중" ↔ "퇴사"를 전환한다. 수정 화면을 열지 않아도 되도록
  // 리스트 안의 배지를 클릭하면 즉시 상태가 바뀌고, 저장과 동시에 월별 스케줄
  // 반영 여부(근무중만 반영)도 자동으로 다시 계산된다.
  function toggleAgentStatus(id) {
    const agent = agentsData.find((a) => a.id === id);
    if (!agent) return;
    agent.status = agent.status === "RESIGNED" ? "WORKING" : "RESIGNED";
    saveAgentsData();
    renderApp();
  }

  // 이름 초성만으로도 검색이 되도록 한글 음절에서 초성을 뽑아내는 헬퍼.
  const CHOSUNG_LIST = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
  function getChosungString(str) {
    let out = "";
    for (const ch of (str || "")) {
      const code = ch.charCodeAt(0);
      if (code >= 0xac00 && code <= 0xd7a3) out += CHOSUNG_LIST[Math.floor((code - 0xac00) / 588)];
      else out += ch;
    }
    return out;
  }
  function agentMatchesSearch(a, query) {
    const needle = (query || "").trim().toLowerCase();
    if (!needle) return true;
    if ((a.name || "").toLowerCase().indexOf(needle) !== -1) return true;
    if ((a.ldap || "").toLowerCase().indexOf(needle) !== -1) return true;
    if (getChosungString(a.name || "").indexOf(needle) !== -1) return true;
    return false;
  }
  function agentMatchesFilterType(a, filterType) {
    if (filterType === "voice") return (a.workTypes || []).indexOf("유선") !== -1;
    if (filterType === "chat") return (a.workTypes || []).indexOf("채팅") !== -1;
    if (filterType === "day") return a.group !== "night";
    if (filterType === "night") return a.group === "night";
    if (filterType === "working") return a.status !== "RESIGNED";
    if (filterType === "resigned") return a.status === "RESIGNED";
    return true;
  }
  // filterTypes: Set(문자열). 비어있으면 전체 통과. 여러 개면 모두 만족(AND)해야 통과 — 버튼 중복 선택 지원.
  function agentMatchesFilter(a, filterTypes) {
    if (!filterTypes || filterTypes.size === 0) return true;
    for (const ft of filterTypes) {
      if (!agentMatchesFilterType(a, ft)) return false;
    }
    return true;
  }
  function agentTypeRank(a) {
    const hasVoice = (a.workTypes || []).indexOf("유선") !== -1;
    const hasChat = (a.workTypes || []).indexOf("채팅") !== -1;
    if (hasVoice && hasChat) return 1;
    if (hasVoice) return 0;
    if (hasChat) return 2;
    return 3;
  }
  function agentChatRank(a) {
    const hasVoice = (a.workTypes || []).indexOf("유선") !== -1;
    const hasChat = (a.workTypes || []).indexOf("채팅") !== -1;
    if (hasChat && hasVoice) return 1;
    if (hasChat) return 0;
    if (hasVoice) return 2;
    return 3;
  }
  function agentNightRank(a) {
    return a.group === "night" ? 0 : 1;
  }
  // 기본 정렬(주간→야간, 그 안에서 채팅→유선, 그 중에서도 근무 시작 시각 순)을 위한 순위들.
  function agentGroupRank(a) {
    return a.group === "night" ? 1 : 0;
  }
  function agentShiftTypeRank(a) {
    const types = a.workTypes || [];
    if (types.indexOf("채팅") !== -1) return 0;
    if (types.indexOf("유선") !== -1) return 1;
    return 2;
  }
  // 근무시간(예: "09:00-18:00") 문자열에서 시작 시각을 분 단위로 추출한다.
  // 형식을 찾을 수 없으면 맨 뒤로 보내기 위해 아주 큰 값을 반환한다.
  function agentStartMinutes(a) {
    const wh = a.timezone || "";
    const m = wh.match(/(\d{1,2}):(\d{2})/);
    if (!m) return Infinity;
    return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  }
  function sortAgentList(list, sortBy) {
    const arr = [...list];
    if (sortBy === "shift") {
      arr.sort((a, b) => {
        const g = agentGroupRank(a) - agentGroupRank(b);
        if (g !== 0) return g;
        const t = agentShiftTypeRank(a) - agentShiftTypeRank(b);
        if (t !== 0) return t;
        const s = agentStartMinutes(a) - agentStartMinutes(b);
        if (s !== 0) return s;
        return a.name.localeCompare(b.name, "ko");
      });
    } else if (sortBy === "name") {
      arr.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    } else if (sortBy === "type") {
      arr.sort((a, b) => {
        const r = agentTypeRank(a) - agentTypeRank(b);
        return r !== 0 ? r : a.name.localeCompare(b.name, "ko");
      });
    } else if (sortBy === "chat") {
      arr.sort((a, b) => {
        const r = agentChatRank(a) - agentChatRank(b);
        return r !== 0 ? r : a.name.localeCompare(b.name, "ko");
      });
    } else if (sortBy === "night") {
      arr.sort((a, b) => {
        const r = agentNightRank(a) - agentNightRank(b);
        return r !== 0 ? r : a.name.localeCompare(b.name, "ko");
      });
    } else if (sortBy === "created") {
      arr.sort((a, b) => a.id.localeCompare(b.id));
    }
    // "custom" -> keep existing (drag-defined) order

    // 정렬 기준과 무관하게, 퇴사 처리된 인원은 항상 목록 맨 아래로 보낸다.
    // sort는 안정 정렬이라 같은 재직 상태 안에서는 위에서 정한 순서가 그대로 유지된다.
    arr.sort((a, b) => (a.status === "RESIGNED" ? 1 : 0) - (b.status === "RESIGNED" ? 1 : 0));
    return arr;
  }

  function workTypeBadgesHtml(types) {
    if (!types || types.length === 0) return `<span class="agent-field-empty">-</span>`;
    return types.map((t) => `<span class="badge ${t === "유선" ? "voice" : "chat"}">${esc(t)}</span>`).join("");
  }
  function scheduleGroupLabel(group) { return group === "night" ? `${ICON_MOON} 야간` : `${ICON_SUN} 주간`; }
  function scheduleGroupBadgeHtml(group) {
    return `<span class="badge ${group === "night" ? "night" : "day"}">${scheduleGroupLabel(group)}</span>`;
  }

  function renderAgentRow(a, section, draggable) {
    const selected = a.id === agentsUi.selectedId;
    const typeBadges = (a.workTypes || []).map((t) => `<span class="badge sm ${t === "유선" ? "voice" : "chat"}">${esc(t)}</span>`).join("");
    const groupBadge = `<span class="badge sm ${a.group === "night" ? "night" : "day"}">${a.group === "night" ? "야간" : "주간"}</span>`;
    const isResigned = a.status === "RESIGNED";
    const statusToggle = `<button type="button" class="badge-btn sm ${isResigned ? "resigned" : "working"}" data-action="toggle-agent-status" data-id="${a.id}" title="클릭하면 재직 상태가 바로 바뀌어요">${isResigned ? "퇴사" : "근무중"}</button>`;
    const badges = `<div class="agent-row-badges">${typeBadges}${groupBadge}${statusToggle}</div>`;
    return `
      <div class="agent-row ${selected ? "selected" : ""}" draggable="${draggable ? "true" : "false"}" data-agent-id="${a.id}" data-agent-section="${section}">
        <span class="drag-handle ${draggable ? "" : "drag-handle-disabled"}" title="${draggable ? "드래그해서 순서 변경" : "사용자 지정 정렬에서만 드래그할 수 있어요"}">⠿</span>
        <button class="pin-btn ${a.pinned ? "pinned" : ""}" data-action="pin-agent" data-id="${a.id}" title="${a.pinned ? "고정 해제" : "상단에 고정"}">${a.pinned ? "★" : "☆"}</button>
        <button class="agent-row-main" data-action="select-agent" data-id="${a.id}">
          <span class="agent-row-name">${esc(a.name)}${a.isAdmin ? ' <span class="badge sm admin">관리자</span>' : ""}</span>
          <span class="agent-row-ldap">${esc(a.ldap)}</span>
        </button>
        ${badges}
      </div>
    `;
  }

  function renderAgentDetail(agent) {
    return `
      <div class="agent-detail-header">
        <div class="agent-detail-name">${esc(agent.name)}</div>
        <div class="agent-detail-actions">
          <button class="ghost-btn" data-action="edit-agent" data-id="${agent.id}">수정</button>
          <button class="ghost-btn danger" data-action="delete-agent" data-id="${agent.id}">삭제</button>
        </div>
      </div>
      <div class="agent-field">
        <span class="agent-field-label">LDAP 이름</span>
        <span class="agent-field-value">${esc(agent.ldap)}</span>
      </div>
      <div class="agent-field">
        <span class="agent-field-label">사번</span>
        <span class="agent-field-value">${agent.empNo ? esc(agent.empNo) : '<span class="agent-field-empty">-</span>'}</span>
      </div>
      <div class="agent-field">
        <span class="agent-field-label">입사일자</span>
        <span class="agent-field-value">${agent.hireDate ? esc(agent.hireDate) : '<span class="agent-field-empty">-</span>'}</span>
      </div>
      <div class="agent-field">
        <span class="agent-field-label">연락처</span>
        <span class="agent-field-value">${agent.contact ? esc(agent.contact) : '<span class="agent-field-empty">-</span>'}</span>
      </div>
      <div class="agent-field">
        <span class="agent-field-label">업무 구분</span>
        <span class="agent-field-value">${workTypeBadgesHtml(agent.workTypes)}</span>
      </div>
      <div class="agent-field">
        <span class="agent-field-label">근무 조</span>
        <span class="agent-field-value">${scheduleGroupBadgeHtml(agent.group)}</span>
      </div>
      <div class="agent-field">
        <span class="agent-field-label">시간대</span>
        <span class="agent-field-value">${agent.timezone ? esc(agent.timezone) : '<span class="agent-field-empty">-</span>'}</span>
      </div>
      <div class="agent-field">
        <span class="agent-field-label">권한</span>
        <span class="agent-field-value">${agent.isAdmin ? '<span class="badge admin">관리자</span>' : '<span class="agent-field-empty">일반</span>'}</span>
      </div>
      <div class="agent-field">
        <span class="agent-field-label">재직 상태</span>
        <span class="agent-field-value">${agent.status === "RESIGNED" ? '<span class="badge resigned">퇴사</span>' : '<span class="badge working">근무중</span>'}</span>
      </div>
      ${renderAgentQAPreview(agent)}
      ${renderAgentInterviewSection(agent)}
    `;
  }

  function renderAgentForm(agent) {
    const isEdit = !!agent;
    const v = agent || { name: "", ldap: "", empNo: "", hireDate: "", contact: "", workTypes: [], timezone: "", group: "day", isAdmin: false, status: "WORKING" };
    const workTypes = v.workTypes || [];
    const group = v.group === "night" ? "night" : "day";
    const status = v.status === "RESIGNED" ? "RESIGNED" : "WORKING";
    return `
      <div class="agent-form-title">${isEdit ? "상담사 정보 수정" : "새 상담사 추가"}</div>
      <form class="agent-form" id="agent-form">
        <label class="agent-form-label">상담사 이름
          <input type="text" class="add-input" id="agent-input-name" value="${esc(v.name)}" placeholder="예: 홍길동" autocomplete="off">
        </label>
        <label class="agent-form-label">LDAP 이름
          <input type="text" class="add-input" id="agent-input-ldap" value="${esc(v.ldap)}" placeholder="예: hong.gd" autocomplete="off">
        </label>
        <label class="agent-form-label">사번
          <input type="text" class="add-input" id="agent-input-empno" value="${esc(v.empNo)}" placeholder="예: T25070840" autocomplete="off">
        </label>
        <label class="agent-form-label">입사일자
          <input type="date" class="add-input" id="agent-input-hiredate" value="${esc(v.hireDate)}" autocomplete="off">
        </label>
        <label class="agent-form-label">연락처
          <input type="text" class="add-input" id="agent-input-contact" value="${esc(v.contact)}" placeholder="예: 010-1234-5678" autocomplete="off">
        </label>
        <div class="agent-form-label">업무 구분
          <div class="agent-checkbox-row">
            <label class="agent-checkbox"><input type="checkbox" id="agent-input-voice" ${workTypes.indexOf("유선") !== -1 ? "checked" : ""}> 유선</label>
            <label class="agent-checkbox"><input type="checkbox" id="agent-input-chat" ${workTypes.indexOf("채팅") !== -1 ? "checked" : ""}> 채팅</label>
          </div>
        </div>
        <div class="agent-form-label">근무 조
          <div class="agent-radio-row">
            <label class="agent-radio"><input type="radio" name="agent-input-group" id="agent-input-group-day" value="day" ${group === "day" ? "checked" : ""}> ${ICON_SUN} 주간</label>
            <label class="agent-radio"><input type="radio" name="agent-input-group" id="agent-input-group-night" value="night" ${group === "night" ? "checked" : ""}> ${ICON_MOON} 야간</label>
          </div>
        </div>
        <label class="agent-form-label">시간대
          <input type="text" class="add-input" id="agent-input-timezone" value="${esc(v.timezone)}" placeholder="예: 09:00-18:00" autocomplete="off">
        </label>
        <div class="agent-form-label">재직 상태
          <div class="agent-radio-row">
            <label class="agent-radio"><input type="radio" name="agent-input-status" id="agent-input-status-working" value="WORKING" ${status === "WORKING" ? "checked" : ""}> 근무중</label>
            <label class="agent-radio"><input type="radio" name="agent-input-status" id="agent-input-status-resigned" value="RESIGNED" ${status === "RESIGNED" ? "checked" : ""}> 퇴사</label>
          </div>
        </div>
        <div class="agent-form-label">권한
          <div class="agent-checkbox-row">
            <label class="agent-checkbox"><input type="checkbox" id="agent-input-admin" ${v.isAdmin ? "checked" : ""}> 관리자</label>
          </div>
        </div>
        <div class="agent-form-actions">
          <button type="submit" class="primary-btn">${isEdit ? "저장" : "추가"}</button>
          <button type="button" class="cancel-btn" id="agent-form-cancel">취소</button>
        </div>
      </form>
    `;
  }

  function buildAgentListAreaHtml(pinnedAgents, listAgents, filtered, pinnedCount, draggable) {
    let pinnedHtml = "";
    if (pinnedAgents.length > 0) {
      pinnedHtml = `
        <div class="pinned-block">
          <div class="pinned-title">${ICON_PIN} 고정된 인원 <span class="pinned-count">(${pinnedCount}/${AGENT_PIN_LIMIT})</span></div>
          <div class="agent-list">${pinnedAgents.map((a) => renderAgentRow(a, "pinned", draggable)).join("")}</div>
        </div>
      `;
    }

    let listHtml = "";
    if (agentsData.length === 0) {
      listHtml = `<div class="agent-list-empty">등록된 상담사가 없어요.<br>오른쪽 위 "＋ 상담사 추가"로 첫 상담사를 등록해보세요.</div>`;
    } else if (filtered.length === 0) {
      listHtml = `<div class="agent-list-empty">검색 또는 필터 조건에 맞는 상담사가 없어요.</div>`;
    } else if (listAgents.length > 0) {
      listHtml = `<div class="agent-list">${listAgents.map((a) => renderAgentRow(a, "list", draggable)).join("")}</div>`;
    }

    return `${pinnedHtml}${listHtml}`;
  }

  // 검색어/필터/정렬이 바뀔 때 목록 영역만 다시 그림.
  // 입력창(input) 자체는 건드리지 않으므로 한글 조합(IME) 중에도
  // 입력이 끊기지 않고, 목록은 타이핑하는 즉시 반영됨.
  function updateAgentListArea() {
    const listArea = document.getElementById("agent-list-area");
    if (!listArea) return;

    const filtered = agentsData.filter((a) => agentMatchesSearch(a, agentsUi.searchQuery) && agentMatchesFilter(a, agentsUi.filterTypes));
    const pinnedAgents = sortAgentList(filtered.filter((a) => a.pinned), agentsUi.sortBy);
    const listAgents = sortAgentList(filtered.filter((a) => !a.pinned), agentsUi.sortBy);
    const draggable = agentsUi.sortBy === "custom";
    const pinnedCount = agentsData.filter((a) => a.pinned).length;

    listArea.innerHTML = buildAgentListAreaHtml(pinnedAgents, listAgents, filtered, pinnedCount, draggable);
    attachAgentListAreaHandlers(listArea);
  }

  function attachAgentListAreaHandlers(root) {
    root.querySelectorAll("[data-action='select-agent']").forEach((btn) => {
      btn.onclick = () => {
        agentsUi.selectedId = btn.getAttribute("data-id");
        agentsUi.mode = "view";
        agentsUi.interviewMode = "list";
        agentsUi.interviewEditingId = null;
        renderApp();
      };
    });
    root.querySelectorAll("[data-action='pin-agent']").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        togglePinAgent(btn.getAttribute("data-id"));
      };
    });
    root.querySelectorAll("[data-action='toggle-agent-status']").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        toggleAgentStatus(btn.getAttribute("data-id"));
      };
    });
    attachAgentDragHandlers(root);
  }

  function renderAgentsPage(root) {
    const selected = agentsData.find((a) => a.id === agentsUi.selectedId) || null;

    const filtered = agentsData.filter((a) => agentMatchesSearch(a, agentsUi.searchQuery) && agentMatchesFilter(a, agentsUi.filterTypes));
    const pinnedAgents = sortAgentList(filtered.filter((a) => a.pinned), agentsUi.sortBy);
    const listAgents = sortAgentList(filtered.filter((a) => !a.pinned), agentsUi.sortBy);
    const draggable = agentsUi.sortBy === "custom";

    const totalCount = agentsData.length;
    const resignedCount = agentsData.filter((a) => a.status === "RESIGNED").length;
    const workingCount = totalCount - resignedCount;
    const nonAdminAgents = agentsData.filter((a) => !a.isAdmin);
    const adminCount = agentsData.filter((a) => a.isAdmin).length;
    const voiceCount = nonAdminAgents.filter((a) => (a.workTypes || []).indexOf("유선") !== -1).length;
    const chatCount = nonAdminAgents.filter((a) => (a.workTypes || []).indexOf("채팅") !== -1).length;
    const dayCount = nonAdminAgents.filter((a) => a.group !== "night").length;
    const nightCount = nonAdminAgents.filter((a) => a.group === "night").length;
    const pinnedCount = agentsData.filter((a) => a.pinned).length;

    const summaryHtml = `<div class="agent-summary">전체 ${totalCount}명 · 관리자 ${adminCount}명 · 유선 ${voiceCount}명 · 채팅 ${chatCount}명 · 주간 ${dayCount}명 · 야간 ${nightCount}명 · 재직 ${workingCount}명 · 퇴사 ${resignedCount}명 · 고정 ${pinnedCount}명</div>`;

    const controlsHtml = `
      <div class="agent-controls">
        <input type="text" class="add-input agent-search-input" id="agent-search-input" placeholder="이름 또는 LDAP 검색" value="${esc(agentsUi.searchQuery)}" autocomplete="off">
        <div class="agent-filter-row">
          <button type="button" class="agent-filter-btn ${agentsUi.filterTypes.size === 0 ? "active" : ""}" data-filter="all">전체</button>
          <button type="button" class="agent-filter-btn ${agentsUi.filterTypes.has("voice") ? "active" : ""}" data-filter="voice">유선만</button>
          <button type="button" class="agent-filter-btn ${agentsUi.filterTypes.has("chat") ? "active" : ""}" data-filter="chat">채팅만</button>
          <button type="button" class="agent-filter-btn ${agentsUi.filterTypes.has("day") ? "active" : ""}" data-filter="day">주간만</button>
          <button type="button" class="agent-filter-btn ${agentsUi.filterTypes.has("night") ? "active" : ""}" data-filter="night">야간만</button>
          <button type="button" class="agent-filter-btn ${agentsUi.filterTypes.has("working") ? "active" : ""}" data-filter="working">재직만</button>
          <button type="button" class="agent-filter-btn ${agentsUi.filterTypes.has("resigned") ? "active" : ""}" data-filter="resigned">퇴사만</button>
          <select class="agent-sort-select" id="agent-sort-select">
            <option value="shift" ${agentsUi.sortBy === "shift" ? "selected" : ""}>기본순(주간→야간·업무·시간순)</option>
            <option value="custom" ${agentsUi.sortBy === "custom" ? "selected" : ""}>사용자 지정(드래그)</option>
            <option value="name" ${agentsUi.sortBy === "name" ? "selected" : ""}>이름순</option>
            <option value="type" ${agentsUi.sortBy === "type" ? "selected" : ""}>업무구분별</option>
            <option value="chat" ${agentsUi.sortBy === "chat" ? "selected" : ""}>채팅순</option>
            <option value="night" ${agentsUi.sortBy === "night" ? "selected" : ""}>야간순</option>
            <option value="created" ${agentsUi.sortBy === "created" ? "selected" : ""}>등록순</option>
          </select>
        </div>
      </div>
    `;

    const listAreaHtml = buildAgentListAreaHtml(pinnedAgents, listAgents, filtered, pinnedCount, draggable);

    let rightHtml;
    if (agentsUi.mode === "add") {
      rightHtml = renderAgentForm(null);
    } else if (agentsUi.mode === "edit") {
      const editing = agentsData.find((a) => a.id === agentsUi.editingId) || null;
      rightHtml = renderAgentForm(editing);
    } else if (selected) {
      rightHtml = renderAgentDetail(selected);
    } else {
      rightHtml = `<div class="agent-detail-empty">왼쪽 목록에서 상담사를 선택하면<br>상세 정보를 볼 수 있어요.</div>`;
    }

    root.innerHTML = `
      <div class="agent-shell">
        <div class="card">
          <div class="agent-list-header">
            <div class="agent-list-title">상담사 관리</div>
            <button class="ghost-btn" id="btn-agent-add">＋ 상담사 추가</button>
          </div>
          <div class="status" id="agent-status"></div>
          ${agentsData.length > 0 ? summaryHtml : ""}
          ${agentsData.length > 0 ? controlsHtml : ""}
          <div id="agent-list-area">${listAreaHtml}</div>
        </div>
        <div class="card agent-detail-card">
          ${rightHtml}
        </div>
      </div>
    `;

    attachAgentEvents(root);
  }

  function attachAgentDragHandlers(root) {
    let dragState = null; // { id, section }
    root.querySelectorAll(".agent-row").forEach((row) => {
      if (row.getAttribute("draggable") !== "true") return;
      const id = row.getAttribute("data-agent-id");
      const section = row.getAttribute("data-agent-section");
      row.addEventListener("dragstart", (e) => {
        dragState = { id, section };
        row.classList.add("dragging");
        try { e.dataTransfer.effectAllowed = "move"; } catch (err) {}
      });
      row.addEventListener("dragend", () => {
        row.classList.remove("dragging");
        dragState = null;
        root.querySelectorAll(".agent-row").forEach((r) => r.classList.remove("drag-over"));
      });
      row.addEventListener("dragover", (e) => {
        if (!dragState || dragState.id === id || dragState.section !== section) return;
        e.preventDefault();
        row.classList.add("drag-over");
      });
      row.addEventListener("dragleave", () => row.classList.remove("drag-over"));
      row.addEventListener("drop", (e) => {
        e.preventDefault();
        row.classList.remove("drag-over");
        if (!dragState || dragState.id === id || dragState.section !== section) return;
        reorderAgents(dragState.id, id);
        renderApp();
      });
    });
  }

  function attachAgentEvents(root) {
    const addBtn = document.getElementById("btn-agent-add");
    if (addBtn) {
      addBtn.onclick = () => {
        agentsUi.mode = "add";
        agentsUi.editingId = null;
        renderApp();
        setTimeout(() => { const el = document.getElementById("agent-input-name"); if (el) el.focus(); }, 0);
      };
    }

    attachAgentListAreaHandlers(root);

    const searchInput = document.getElementById("agent-search-input");
    if (searchInput) {
      // 목록 영역(#agent-list-area)만 갱신하고 검색창 자체는 다시 그리지 않음.
      // - 검색창 DOM이 그대로 유지되므로 한글 조합(IME) 중에도 입력이 끊기지 않음.
      // - 매 입력마다 목록 영역을 갱신하므로 검색 결과가 타이핑 즉시 반영됨.
      searchInput.oninput = (e) => {
        agentsUi.searchQuery = e.target.value;
        updateAgentListArea();
      };
    }
    root.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.onclick = () => {
        const key = btn.getAttribute("data-filter");
        if (key === "all") {
          agentsUi.filterTypes.clear();
        } else if (agentsUi.filterTypes.has(key)) {
          agentsUi.filterTypes.delete(key);
        } else {
          agentsUi.filterTypes.add(key);
        }
        renderApp();
      };
    });
    const sortSelect = document.getElementById("agent-sort-select");
    if (sortSelect) {
      sortSelect.onchange = (e) => {
        agentsUi.sortBy = e.target.value;
        renderApp();
      };
    }
    root.querySelectorAll("[data-action='edit-agent']").forEach((btn) => {
      btn.onclick = () => {
        agentsUi.mode = "edit";
        agentsUi.editingId = btn.getAttribute("data-id");
        renderApp();
      };
    });
    root.querySelectorAll("[data-action='delete-agent']").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-id");
        if (window.confirm("이 상담사 정보를 삭제할까요?")) {
          deleteAgent(id);
          renderApp();
        }
      };
    });

    const form = document.getElementById("agent-form");
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById("agent-input-name").value.trim();
        const ldap = document.getElementById("agent-input-ldap").value.trim();
        if (!name || !ldap) return;
        const empNo = document.getElementById("agent-input-empno").value.trim();
        const hireDate = document.getElementById("agent-input-hiredate").value.trim();
        const contact = document.getElementById("agent-input-contact").value.trim();
        const timezone = document.getElementById("agent-input-timezone").value.trim();
        const workTypes = [];
        if (document.getElementById("agent-input-voice").checked) workTypes.push("유선");
        if (document.getElementById("agent-input-chat").checked) workTypes.push("채팅");
        const group = document.getElementById("agent-input-group-night").checked ? "night" : "day";
        const isAdmin = document.getElementById("agent-input-admin").checked;
        const status = document.getElementById("agent-input-status-resigned").checked ? "RESIGNED" : "WORKING";
        const values = { name, ldap, empNo, hireDate, contact, workTypes, timezone, group, isAdmin, status };

        if (agentsUi.mode === "edit" && agentsUi.editingId) {
          updateAgent(agentsUi.editingId, values);
          agentsUi.selectedId = agentsUi.editingId;
        } else {
          const newId = addAgent(values);
          agentsUi.selectedId = newId;
        }
        agentsUi.mode = "view";
        agentsUi.editingId = null;
        renderApp();
      };
      const cancelBtn = document.getElementById("agent-form-cancel");
      if (cancelBtn) {
        cancelBtn.onclick = () => {
          agentsUi.mode = "view";
          agentsUi.editingId = null;
          renderApp();
        };
      }
    }

    const selectedAgentForInterview = agentsData.find((a) => a.id === agentsUi.selectedId);
    if (selectedAgentForInterview && agentsUi.mode === "view") {
      attachAgentInterviewEvents(root, selectedAgentForInterview);
    }

    attachAgentDragHandlers(root);
  }

  /* ===================== 품질 관리(QA) 모듈 ===================== */
  const QA_KEY = acctKey("personal-qa:data");

