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
  /* ---- 면담일지 엑셀 다운로드 ---- */
  function interviewExportFilename(labelPart) {
    return `면담일지_${sanitizeFilenamePart(labelPart)}_${backupFilenameStamp()}.xlsx`;
  }
  // 입사일자 문자열(예: 2025-07-17) 기준으로 오늘까지의 근속 개월수를 계산한다. 형식이 없거나 잘못되면 null.
  function calcTenureMonths(hireDateStr) {
    if (!hireDateStr) return null;
    const hire = new Date(hireDateStr);
    if (isNaN(hire.getTime())) return null;
    const now = new Date();
    let months = (now.getFullYear() - hire.getFullYear()) * 12 + (now.getMonth() - hire.getMonth());
    if (now.getDate() < hire.getDate()) months -= 1;
    return months < 0 ? 0 : months;
  }
  function interviewExportRowData(rec) {
    const agent = agentsData.find((a) => a.id === rec.agentId);
    const manager = rec.managerId ? agentsData.find((a) => a.id === rec.managerId) : null;
    const tenureMonths = agent ? calcTenureMonths(agent.hireDate) : null;
    return {
      date: rec.date || "",
      type: rec.type || "비정기",
      agentName: agent ? agent.name : "(삭제된 상담사)",
      agentLdap: agent ? (agent.ldap || "") : "",
      group: agent ? (agent.group === "night" ? "야간" : "주간") : "",
      hireDate: agent ? (agent.hireDate || "") : "",
      tenureMonths: tenureMonths === null ? "" : `${tenureMonths}개월`,
      workTypes: agent && agent.workTypes ? agent.workTypes.join(", ") : "",
      manager: manager ? `${manager.name} (${manager.ldap || "-"})` : "",
      content: rec.content || "",
      followUp: rec.followUp || "",
      createdAt: rec.createdAt ? rec.createdAt.replace("T", " ").slice(0, 16) : "",
    };
  }
  // 면담 기록 목록을 엑셀(.xlsx) 파일로 내려받는다. 개별/전체/주·야간별/상담사별 다운로드가 모두 이 함수를 함께 쓴다.
  async function exportInterviewsToExcel(list, filename, statusElId) {
    if (typeof ExcelJS === "undefined") {
      flashInterviewStatus("엑셀 변환 기능을 불러오지 못했어요. 인터넷 연결을 확인해주세요.", statusElId);
      return;
    }
    if (!list.length) {
      flashInterviewStatus("다운로드할 면담 기록이 없어요.", statusElId);
      return;
    }
    try {
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet("면담일지");
      const columns = [
        { header: "면담일자", key: "date", width: 12 },
        { header: "유형", key: "type", width: 8 },
        { header: "상담사", key: "agentName", width: 12 },
        { header: "LDAP", key: "agentLdap", width: 12 },
        { header: "근무조", key: "group", width: 8 },
        { header: "입사일자", key: "hireDate", width: 12 },
        { header: "근속개월수", key: "tenureMonths", width: 10 },
        { header: "업무구분", key: "workTypes", width: 12 },
        { header: "면담 관리자", key: "manager", width: 16 },
        { header: "면담 내용", key: "content", width: 46 },
        { header: "후속조치 / 다음 계획", key: "followUp", width: 32 },
        { header: "작성일시", key: "createdAt", width: 17 },
      ];
      ws.columns = columns;
      // 면담 내용 · 후속조치 열은 글이 길어 왼쪽 정렬, 나머지 열은 가운데 정렬로 통일한다.
      const leftAlignKeys = new Set(["content", "followUp"]);
      sortInterviews(list).forEach((rec) => ws.addRow(interviewExportRowData(rec)));

      const headerRow = ws.getRow(1);
      headerRow.height = 22;
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, size: 10, color: { argb: "FF4D5057" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEEF0F3" } };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin", color: { argb: "FFB7BCC5" } },
          left: { style: "thin", color: { argb: "FFB7BCC5" } },
          right: { style: "thin", color: { argb: "FFB7BCC5" } },
          bottom: { style: "medium", color: { argb: "FF9AA0AB" } },
        };
      });
      ws.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        row.eachCell({ includeEmpty: true }, (cell) => {
          const key = columns[cell.col - 1] ? columns[cell.col - 1].key : null;
          const isLeft = leftAlignKeys.has(key);
          cell.font = Object.assign({}, cell.font, { size: 10 });
          cell.alignment = isLeft
            ? { vertical: "middle", horizontal: "left", wrapText: true }
            : { vertical: "middle", horizontal: "center", wrapText: true };
          cell.border = {
            top: { style: "thin", color: { argb: "FFC7CBD3" } },
            left: { style: "thin", color: { argb: "FFC7CBD3" } },
            right: { style: "thin", color: { argb: "FFC7CBD3" } },
            bottom: { style: "thin", color: { argb: "FFC7CBD3" } },
          };
        });
      });
      // 표(사용된 범위) 밖 셀에는 엑셀 기본 눈금선이 보이지 않도록 시트 눈금선 자체를 끈다.
      ws.views = [{ state: "frozen", ySplit: 1, showGridLines: false }];

      const buffer = await wb.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      flashInterviewStatus("엑셀 파일을 다운로드했어요.", statusElId);
    } catch (err) {
      console.error(err);
      flashInterviewStatus("엑셀 파일을 만들지 못했어요.", statusElId);
    }
  }
  // 면담 기록 한 건만 엑셀로 내려받는다. (목록의 각 행 · 상담사 상세 화면 공용)
  function downloadSingleInterview(id) {
    const rec = interviewsData.find((r) => r.id === id);
    if (!rec) return;
    const agent = agentsData.find((a) => a.id === rec.agentId);
    const label = `${agent ? agent.name : "상담사"}_${rec.date || ""}`;
    exportInterviewsToExcel([rec], interviewExportFilename(label));
  }
  // 등록된 면담 기록 전체를 (현재 검색·필터와 무관하게) 엑셀로 내려받는다.
  function downloadAllInterviews() {
    exportInterviewsToExcel(interviewsData, interviewExportFilename("전체"), "interview-status");
  }
  // 대상 상담사의 근무 조(주간/야간) 기준으로 면담 기록을 나눠 엑셀로 내려받는다.
  function downloadInterviewsByGroup(group) {
    const list = interviewsData.filter((r) => {
      const agent = agentsData.find((a) => a.id === r.agentId);
      if (!agent) return false;
      const isNight = agent.group === "night";
      return group === "night" ? isNight : !isNight;
    });
    exportInterviewsToExcel(list, interviewExportFilename(group === "night" ? "야간" : "주간"), "interview-status");
  }
  // 상담사 한 명을 골라 그 사람의 면담 기록만 엑셀로 내려받는다.
  function downloadInterviewsByAgent(agentId) {
    const agent = agentsData.find((a) => a.id === agentId);
    if (!agent) return;
    const list = interviewsData.filter((r) => r.agentId === agentId);
    exportInterviewsToExcel(list, interviewExportFilename(agent.name), "interview-status");
  }

  // ----- 면담일지 엑셀 다운로드 버튼: 클릭하면 옵션 목록이 뜨는 팝업 메뉴 -----
  // 월별 스케줄의 "이미지로 저장 ▾" 메뉴와 같은 방식(sch-menu)을 그대로 재사용한다.
  function closeInterviewExportMenu() {
    const existing = document.getElementById("interview-export-menu");
    if (existing) existing.remove();
    document.removeEventListener("mousedown", interviewExportMenuOutsideHandler, true);
  }
  function interviewExportMenuOutsideHandler(e) {
    const menu = document.getElementById("interview-export-menu");
    if (menu && !menu.contains(e.target)) closeInterviewExportMenu();
  }
  function positionInterviewExportMenu(menu, anchorEl) {
    const rect = anchorEl.getBoundingClientRect();
    const top = Math.min(rect.bottom + 4, window.innerHeight - menu.offsetHeight - 8);
    const left = Math.min(rect.left, window.innerWidth - menu.offsetWidth - 8);
    menu.style.top = `${Math.max(8, top)}px`;
    menu.style.left = `${Math.max(8, left)}px`;
  }
  function renderInterviewExportMenuMain(menu, anchorEl) {
    menu.innerHTML = `
      <button type="button" class="interview-export-menu-item" data-export-action="all">전체 다운로드</button>
      <button type="button" class="interview-export-menu-item" data-export-action="day">주간 다운로드</button>
      <button type="button" class="interview-export-menu-item" data-export-action="night">야간 다운로드</button>
      <button type="button" class="interview-export-menu-item" data-export-action="by-agent">상담사별 다운로드 ›</button>
    `;
    menu.querySelector("[data-export-action='all']").onclick = () => { closeInterviewExportMenu(); downloadAllInterviews(); };
    menu.querySelector("[data-export-action='day']").onclick = () => { closeInterviewExportMenu(); downloadInterviewsByGroup("day"); };
    menu.querySelector("[data-export-action='night']").onclick = () => { closeInterviewExportMenu(); downloadInterviewsByGroup("night"); };
    menu.querySelector("[data-export-action='by-agent']").onclick = () => renderInterviewExportMenuAgents(menu, anchorEl);
    positionInterviewExportMenu(menu, anchorEl);
  }
  function renderInterviewExportMenuAgents(menu, anchorEl) {
    const sortedAgents = agentsData.slice().sort((a, b) => a.name.localeCompare(b.name, "ko"));
    menu.innerHTML = `
      <button type="button" class="interview-export-menu-back" data-export-action="back">‹ 뒤로</button>
      ${sortedAgents.length === 0
        ? `<span class="interview-export-menu-empty">등록된 상담사가 없어요.</span>`
        : sortedAgents.map((a) => `<button type="button" data-export-agent-id="${a.id}">${esc(a.name)} <span class="interview-export-menu-ldap">${esc(a.ldap || "-")}</span></button>`).join("")}
    `;
    menu.querySelector("[data-export-action='back']").onclick = () => renderInterviewExportMenuMain(menu, anchorEl);
    menu.querySelectorAll("[data-export-agent-id]").forEach((btn) => {
      btn.onclick = () => { closeInterviewExportMenu(); downloadInterviewsByAgent(btn.getAttribute("data-export-agent-id")); };
    });
    positionInterviewExportMenu(menu, anchorEl);
  }
  function openInterviewExportMenu(anchorEl) {
    closeInterviewExportMenu();
    const menu = document.createElement("div");
    menu.id = "interview-export-menu";
    menu.className = "sch-menu interview-export-menu";
    document.body.appendChild(menu);
    renderInterviewExportMenuMain(menu, anchorEl);
    setTimeout(() => document.addEventListener("mousedown", interviewExportMenuOutsideHandler, true), 0);
  }

  function interviewTypeBadgeClass(type) {
    if (type === "정기") return "type-regular";
    if (type === "경고") return "type-warning";
    if (type === "퇴사") return "type-resign";
    return "type-adhoc"; // 비정기(과거 데이터의 "수시" 포함)
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
    typeFilter: "all", // "all" | "정기" | "비정기" | "경고" | "퇴사"
    expandedIds: new Set(), // 목록에서 펼쳐본 면담 기록 id들 (상담사 상세 화면과 공유)
    page: 1, // 면담일지 목록의 현재 페이지(10건씩)
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
            <div class="agent-picker-input">
              <input type="text" class="agent-picker-input-field" id="${idPrefix}-${fieldKey}-search" placeholder="${esc(placeholder)}" value="${esc(inputValue)}" autocomplete="off">
              ${ICON_SEARCH_MINI}
            </div>
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
      <div class="agent-form-row-2 agent-form-row-2-date-type">
        <label class="agent-form-label">면담 날짜
          <input type="date" class="add-input" id="${idPrefix}-date" value="${esc(v.date || "")}" autocomplete="off">
        </label>
        <div class="agent-form-label">면담 유형
          <div class="agent-radio-row">
            ${INTERVIEW_TYPES.map((t) => `
              <label class="agent-radio"><input type="radio" name="${idPrefix}-type" value="${t}" ${v.type === t ? "checked" : ""}> ${t}</label>
            `).join("")}
          </div>
        </div>
      </div>
      <div class="interview-draft-helper">
        <label class="agent-form-label">AI 초안 정리 (선택)
          <textarea class="add-input interview-textarea interview-textarea-draft" id="${idPrefix}-draft" placeholder="면담 중/직후 대충 메모해두세요. 예: 오늘 콜 응대 느리다고 얘기함, 담달까지 지켜보기로"></textarea>
        </label>
        <div class="interview-draft-actions">
          <button type="button" class="ghost-btn" id="${idPrefix}-draft-btn">AI로 다듬기</button>
          <span class="interview-draft-status" id="${idPrefix}-draft-status"></span>
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
    attachInterviewDraftHelper(idPrefix);
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
          <span class="badge sm ${interviewTypeBadgeClass(rec.type)}">${esc(rec.type || "비정기")}</span>
          ${agentNameHtml}
          ${agentMetaHtml}
          ${managerHtml}
          <div class="interview-row-actions">
            <button class="ghost-btn" data-action="${actionPrefix}-download-interview" data-id="${rec.id}" title="엑셀 다운로드">${ICON_DOWNLOAD}</button>
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
    let exportRowHtml = "";
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
      exportRowHtml = `<button class="ghost-btn" id="interview-export-btn">${ICON_DOWNLOAD} 엑셀로 다운로드 ▾</button>`;
      bodyHtml = `
        <div class="agent-controls">
          <div class="agent-filter-row">${typeFilterBtns}</div>
        </div>
        <div id="interview-list-area">
          ${renderInterviewListAreaHtml(filtered)}
        </div>
      `;
    }

    root.innerHTML = `
      <div class="agent-list-header">
        <div class="agent-list-title">면담일지</div>
        ${interviewsUi.mode === "list" ? `<div class="agent-list-header-actions">${exportRowHtml}<button class="ghost-btn" id="btn-interview-ai-summary">AI 요약</button><button class="ghost-btn solid-accent-btn" id="btn-interview-add">＋ 면담 기록 추가</button></div>` : ""}
      </div>
      <div class="card">
        <div class="interview-summary-row">
          <div class="agent-summary">전체 ${interviewsData.length}건${interviewsUi.mode === "list" && filtered.length !== interviewsData.length ? ` · 필터 결과 ${filtered.length}건` : ""}</div>
          ${interviewsUi.mode === "list" ? `<div class="agent-search-input"><input type="text" class="agent-search-input-field" id="interview-search-input" placeholder="상담사 이름 또는 LDAP 검색" value="${esc(interviewsUi.searchQuery)}" autocomplete="off">${ICON_SEARCH_MINI}</div>` : ""}
        </div>
        <div class="status" id="interview-status"></div>
        ${bodyHtml}
      </div>
    `;

    attachInterviewsPageEvents(root);
  }

  // 면담일지 목록 영역(검색바 아래)의 내용을 만든다. 10건씩 페이지를 나눠서 보여준다.
  function renderInterviewListAreaHtml(filtered) {
    if (filtered.length === 0) {
      return `<div class="agent-list-empty">${interviewsData.length === 0 ? "등록된 면담 기록이 없어요." : "검색 또는 필터 조건에 맞는 면담 기록이 없어요."}</div>`;
    }
    const { items, page, totalPages } = paginateList(filtered, interviewsUi.page);
    interviewsUi.page = page;
    return `
      <div class="interview-list">${items.map((r) => renderInterviewRow(r, "page")).join("")}</div>
      ${renderPaginationHtml(page, totalPages, "interview-list")}
    `;
  }

  function updateInterviewListArea() {
    const area = document.getElementById("interview-list-area");
    if (!area) return;
    const filtered = sortInterviews(
      interviewsData.filter((r) => interviewMatchesSearch(r, interviewsUi.searchQuery) && interviewMatchesType(r, interviewsUi.typeFilter))
    );
    area.innerHTML = renderInterviewListAreaHtml(filtered);
    attachInterviewListAreaHandlers(area);
    const summaryEl = document.querySelector("#page-inner .agent-summary");
    if (summaryEl) {
      summaryEl.textContent = `전체 ${interviewsData.length}건${filtered.length !== interviewsData.length ? ` · 필터 결과 ${filtered.length}건` : ""}`;
    }
  }

  function attachInterviewListAreaHandlers(root) {
    attachInterviewRowToggles(root, updateInterviewListArea);
    attachPaginationHandlers(root, "interview-list", (delta) => {
      interviewsUi.page = interviewsUi.page + delta;
      updateInterviewListArea();
    });
    root.querySelectorAll("[data-action='page-download-interview']").forEach((btn) => {
      btn.onclick = () => downloadSingleInterview(btn.getAttribute("data-id"));
    });
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
    const aiSummaryBtn = document.getElementById("btn-interview-ai-summary");
    if (aiSummaryBtn) aiSummaryBtn.onclick = () => openInterviewAiModal();
    const searchInput = document.getElementById("interview-search-input");
    if (searchInput) {
      searchInput.oninput = (e) => {
        interviewsUi.searchQuery = e.target.value;
        interviewsUi.page = 1;
        updateInterviewListArea();
      };
    }
    root.querySelectorAll("[data-interview-filter]").forEach((btn) => {
      btn.onclick = () => {
        interviewsUi.typeFilter = btn.getAttribute("data-interview-filter");
        interviewsUi.page = 1;
        renderApp();
      };
    });
    const exportBtn = document.getElementById("interview-export-btn");
    if (exportBtn) exportBtn.onclick = (e) => openInterviewExportMenu(e.currentTarget);
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
            ${agentsUi.interviewMode === "list" ? `<button class="ghost-btn solid-accent-btn" id="btn-agent-interview-add">＋ 면담 기록 추가</button>` : ""}
            <button class="ghost-btn" data-action="agent-goto-interviews" data-id="${agent.id}">${ICON_CHEVRON_RIGHT} 면담일지 전체보기</button>
          </div>
        </div>
        ${bodyHtml}
      </div>
    `;
  }

  function attachAgentInterviewEvents(root, agent) {
    attachInterviewRowToggles(root, renderApp);
    root.querySelectorAll("[data-action='agent-download-interview']").forEach((btn) => {
      btn.onclick = () => downloadSingleInterview(btn.getAttribute("data-id"));
    });
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
        interviewsUi.page = 1;
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

  /* ===================== 면담일지 AI 요약 (Groq) ===================== */
  // 실제 Groq API 키는 브라우저에 없고, QA AI 요약과 동일한 Supabase Edge Function
  // (qa-groq-summary)의 서버 환경변수에만 있다. 그 함수는 prompt 텍스트를 넘기면
  // Groq 응답 텍스트를 돌려주는 범용 함수라서, 면담일지에서도 그대로 재사용한다.
  const INTERVIEW_AI_SUMMARY_FN = "qa-groq-summary";

  // AI 응답에서 대괄호 제목/불필요한 여백을 걷어내고, "- "로 시작하는 개조식 줄 목록으로 다듬는다.
  function parseInterviewDraftSummary(text) {
    const clean = String(text || "")
      .replace(/\*\*/g, "")
      .replace(/^\s*\[[^\[\]]+\]\s*/m, "") // 혹시 모델이 "[면담 내용]" 같은 제목을 붙여 보내도 제거
      .trim();
    return clean
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => (line.startsWith("-") ? line : `- ${line}`))
      .join("\n");
  }

  // 면담 기록 폼의 "AI 초안 정리" 버튼: 대충 적은 메모를 "면담 내용" 필드로 정리해서 채워준다.
  // 후속조치는 AI가 건드리지 않고, 관리자가 직접 작성하는 칸으로 남겨둔다.
  function attachInterviewDraftHelper(idPrefix) {
    const btn = document.getElementById(`${idPrefix}-draft-btn`);
    const draftEl = document.getElementById(`${idPrefix}-draft`);
    const statusEl = document.getElementById(`${idPrefix}-draft-status`);
    if (!btn || !draftEl) return;
    btn.onclick = async () => {
      const draft = draftEl.value.trim();
      if (statusEl) statusEl.textContent = "";
      if (!draft) { if (statusEl) statusEl.textContent = "먼저 메모를 입력해주세요."; return; }
      if (!cloud) { if (statusEl) statusEl.textContent = "AI 서버에 연결할 수 없어요 (네트워크 확인)."; return; }
      const contentEl = document.getElementById(`${idPrefix}-content`);
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = "정리 중...";
      try {
        const prompt = `다음은 콜센터 관리자가 상담사와의 면담 중/직후 대충 적어둔 메모입니다.\n\n${draft}\n\n위 메모를 바탕으로, 실제 면담 기록의 "면담 내용" 칸에 남길 내용을 정리해주세요. 한국어로, 하나의 문단이 아니라 항목별로 줄을 나눠서 쓰고, 모든 줄은 반드시 "- "로 시작하세요. 문장은 정중한 존댓말이 아니라 "~함", "~됨", "~하기로 함"처럼 짧고 담백한 개조식 종결형으로 쓰고, 한 줄에는 하나의 내용만 담으세요. 불필요한 서론·결론이나 섹션 제목은 쓰지 말고, 순수하게 "- "로 시작하는 줄들만 나열하세요. 마크다운 기호(**, *, # 등)는 절대 쓰지 마세요.\n\n예시:\n- QA 점수가 85점을 넘지 못하고 있음을 확인함\n- 상담 시간과 후처리 시간은 기준 이내로 안정적임`;
        // 실제 Groq API 키는 이 브라우저가 아니라 Supabase Edge Function(qa-groq-summary)
        // 서버 쪽 환경변수에만 있다. 여기서는 그 함수를 호출하기만 한다.
        const { data, error } = await cloud.functions.invoke(INTERVIEW_AI_SUMMARY_FN, { body: { prompt } });
        if (error) {
          let msg = error.message || "요청 실패";
          try {
            const ctx = error.context && typeof error.context.json === "function" ? await error.context.json() : null;
            if (ctx && ctx.error) msg = ctx.error;
          } catch (_e) {}
          throw new Error(msg);
        }
        const text = (data && data.text) ? String(data.text).trim() : "";
        if (!text) throw new Error("응답에서 정리된 내용을 찾지 못했어요.");
        const content = parseInterviewDraftSummary(text);
        if (contentEl && content) contentEl.value = content;
        if (statusEl) statusEl.textContent = "정리했어요. 필요하면 직접 다듬어주세요.";
      } catch (err) {
        console.error(err);
        if (statusEl) statusEl.textContent = `정리 실패: ${err.message || String(err)}`;
      } finally {
        btn.disabled = false;
        btn.textContent = originalText;
      }
    };
  }

  // 면담 기록이 1건 이상 있는 상담사만, 가장 최근 면담일이 최신인 순서로 정렬해 돌려준다.
  function interviewAiAgentCandidates() {
    const list = agentsData
      .map((agent) => ({ agent, records: sortInterviews(interviewsData.filter((r) => r.agentId === agent.id)) }))
      .filter((entry) => entry.records.length > 0);
    list.sort((a, b) => (b.records[0].date || "").localeCompare(a.records[0].date || ""));
    return list;
  }

  function closeInterviewAiModal() {
    const existing = document.getElementById("interview-ai-overlay");
    if (existing) existing.remove();
    document.removeEventListener("keydown", interviewAiEscHandler, true);
  }
  function interviewAiEscHandler(e) { if (e.key === "Escape") closeInterviewAiModal(); }

  function openInterviewAiModal() {
    closeInterviewAiModal();
    const overlay = document.createElement("div");
    overlay.id = "interview-ai-overlay";
    overlay.className = "sch-preview-overlay";
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeInterviewAiModal(); };
    document.addEventListener("keydown", interviewAiEscHandler, true);
    renderInterviewAiAgentStep(overlay, "");
  }

  // 1단계: AI 요약을 돌릴 상담사를 검색해서 고르는 화면.
  function renderInterviewAiAgentStep(overlay, query) {
    const q = query || "";
    const candidates = interviewAiAgentCandidates();
    const matches = q.trim() ? candidates.filter((entry) => agentMatchesSearch(entry.agent, q)) : candidates;

    const listHtml = candidates.length === 0
      ? `<div class="agent-picker-empty">면담 기록이 있는 상담사가 없어요.</div>`
      : matches.length === 0
        ? `<div class="agent-picker-empty">일치하는 상담사가 없어요.</div>`
        : matches.map(({ agent, records }) => `
            <div class="interview-ai-agent-item" data-id="${agent.id}">
              <span class="interview-ai-agent-name">${esc(agent.name)}</span>
              <span class="interview-ai-agent-ldap">${esc(agent.ldap || "")}</span>
              <span class="interview-ai-agent-count">최근 ${esc(records[0].date || "-")} · 총 ${records.length}건</span>
            </div>
          `).join("");

    overlay.innerHTML = `
      <div class="sch-preview-box interview-ai-box">
        <div class="sch-preview-head">
          <span>면담일지 AI 요약 · 상담사 선택</span>
          <button type="button" class="sch-preview-close" id="interview-ai-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="sch-preview-body interview-ai-body">
          <div class="agent-picker-input interview-ai-search-row">
            <input type="text" class="agent-picker-input-field" id="interview-ai-search" placeholder="이름, LDAP, 초성으로 검색" value="${esc(q)}" autocomplete="off">
            ${ICON_SEARCH_MINI}
          </div>
          <div class="interview-ai-agent-list">${listHtml}</div>
        </div>
      </div>
    `;
    document.getElementById("interview-ai-close-x").onclick = () => closeInterviewAiModal();
    const searchInput = document.getElementById("interview-ai-search");
    searchInput.oninput = () => renderInterviewAiAgentStep(overlay, searchInput.value);
    searchInput.focus();
    overlay.querySelectorAll("[data-id]").forEach((item) => {
      item.onclick = () => {
        const agent = agentsData.find((a) => a.id === item.getAttribute("data-id"));
        if (agent) runInterviewAiSummary(overlay, agent);
      };
    });
  }

  // 2단계: 선택한 상담사의 최근 면담 3건을 Groq에게 요약시켜 보여준다.
  async function runInterviewAiSummary(overlay, agent) {
    const records = sortInterviews(interviewsData.filter((r) => r.agentId === agent.id)).slice(0, 3);
    overlay.innerHTML = `
      <div class="sch-preview-box interview-ai-box">
        <div class="sch-preview-head">
          <span>${esc(agent.name)} · 최근 면담 ${records.length}건 AI 요약</span>
          <button type="button" class="sch-preview-close" id="interview-ai-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="sch-preview-body interview-ai-body">
          <button type="button" class="ghost-btn interview-ai-back-btn" id="interview-ai-back-btn">← 다른 상담사 선택</button>
          ${records.length ? `
            <div class="interview-ai-source-list">
              ${records.map((r) => `
                <div class="interview-ai-source-item">
                  <span class="interview-date">${esc(r.date || "-")}</span>
                  <span class="badge sm ${interviewTypeBadgeClass(r.type)}">${esc(r.type || "비정기")}</span>
                </div>
              `).join("")}
            </div>
          ` : ""}
          <div class="interview-ai-summary-box qa-round-summary-box" id="interview-ai-summary-box">
            <span class="qa-round-hint">AI에게 요약을 요청하고 있어요...</span>
          </div>
        </div>
      </div>
    `;
    document.getElementById("interview-ai-close-x").onclick = () => closeInterviewAiModal();
    document.getElementById("interview-ai-back-btn").onclick = () => renderInterviewAiAgentStep(overlay, "");

    const box = document.getElementById("interview-ai-summary-box");
    if (!records.length) { box.innerHTML = `<span class="qa-round-hint">면담 기록이 없어요.</span>`; return; }
    if (!cloud) { box.innerHTML = `<span class="qa-round-hint" style="color:var(--red);">AI 요약 서버에 연결할 수 없어요 (네트워크 확인).</span>`; return; }

    try {
      // 오래된 순으로 정리해서, AI가 시간 흐름을 따라 이해할 수 있게 한다.
      const recordsText = records.slice().reverse().map((r, i) => (
        `${i + 1}. [${r.date || "날짜 미상"} · ${r.type || "비정기"}]\n내용: ${r.content || "(내용 없음)"}\n후속조치: ${r.followUp || "없음"}`
      )).join("\n\n");
      const prompt = `다음은 콜센터 상담사 "${agent.name}"님과 나눈 최근 면담 ${records.length}건의 기록입니다(오래된 순).\n\n${recordsText}\n\n위 내용을 한국어로, 아래와 같이 정확히 세 개 섹션으로만 정리해주세요. 불필요한 서론·결론 문장은 쓰지 마세요. 마크다운 기호(**, *, # 등)는 절대 쓰지 말고, 아래처럼 대괄호로 된 제목만 그대로 써주세요.\n\n[면담 흐름 요약]\n- (여러 회차에 걸친 면담 내용을 시간 순으로 간결하게 정리하세요. 문장은 "~하세요/~마세요" 같은 권유형이 아니라 "~함", "~됨"처럼 개조식 명사형 종결로 쓰세요.)\n\n[반복되는 이슈]\n- (여러 면담에서 공통적으로 나온 문제나 패턴이 있다면 한 줄씩. 없다면 "특별히 반복되는 이슈는 없음" 한 줄만 쓰세요.)\n\n[후속 조치 필요 사항]\n- (아직 해결되지 않았거나 다음 면담에서 계속 챙겨야 할 점을 한 줄씩. "~하세요", "~주세요" 같은 권유형은 쓰지 말고 "~필요", "~해야 함"처럼 개조식 명사형 종결로 쓰세요.)`;
      // 실제 Groq API 키는 이 브라우저가 아니라 Supabase Edge Function(qa-groq-summary)
      // 서버 쪽 환경변수에만 있다. 여기서는 그 함수를 호출하기만 한다.
      const { data, error } = await cloud.functions.invoke(INTERVIEW_AI_SUMMARY_FN, { body: { prompt } });
      if (error) {
        let msg = error.message || "요청 실패";
        try {
          const ctx = error.context && typeof error.context.json === "function" ? await error.context.json() : null;
          if (ctx && ctx.error) msg = ctx.error;
        } catch (_e) {}
        throw new Error(msg);
      }
      const text = (data && data.text) ? String(data.text).trim() : "";
      if (!text) throw new Error("응답에서 요약 내용을 찾지 못했어요.");
      box.innerHTML = qaFormatSummaryHtml(text);
    } catch (err) {
      console.error(err);
      box.innerHTML = `<span class="qa-round-hint" style="color:var(--red);">요약 실패: ${esc(err.message || String(err))}</span>`;
    }
  }

  /* ===================== 내비게이션 + 앱 렌더 ===================== */
  /* ===================== 월별 스케줄 모듈 ===================== */
  const SCHEDULE_KEY = acctKey("personal-schedule:data");

