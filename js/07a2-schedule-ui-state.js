  // 07a2-schedule-ui-state.js — 접기 상태, 검색, 행/열 그룹, 헤더 선택, 숨김 메뉴, 일괄 붙여넣기
  // (07-schedule.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  function scheduleSaveCollapseState() {
    const state = scheduleGetMonthCollapseState(scheduleUi.year, scheduleUi.monthIndex);
    state.collapsedRowGroups = Array.from(scheduleUi.collapsedRowGroups);
    state.colGroups = scheduleUi.colGroups.map((g) => ({ ...g }));
    state.manualHiddenDays = Array.from(scheduleUi.manualHiddenDays);
    state.manualHiddenStaffIds = Array.from(scheduleUi.manualHiddenStaffIds);
    state.manualHiddenInfoCols = Array.from(scheduleUi.manualHiddenInfoCols);
    state.manualHiddenSummaryRows = Array.from(scheduleUi.manualHiddenSummaryRows);
    state.manualHiddenBatches = scheduleUi.manualHiddenBatches.map((b) => ({ ...b }));
    saveScheduleData();
  }
  // scheduleData.collapseByMonth에 저장돼 있던(=서버에서 불러온) 지금 달의 접기 상태를
  // 화면이 실제로 쓰는 scheduleUi로 되살린다. 페이지를 처음 열었을 때, 달을 이동했을 때,
  // 되돌리기(undo)나 다른 사람의 원격 변경으로 scheduleData를 다시 읽어들였을 때 호출한다.
  function scheduleSyncUiCollapseFromData() {
    const state = scheduleGetMonthCollapseState(scheduleUi.year, scheduleUi.monthIndex);
    scheduleUi.collapsedRowGroups = new Set(state.collapsedRowGroups || []);
    scheduleUi.colGroups = (state.colGroups || []).map((g) => ({ ...g }));
    scheduleUi.manualHiddenDays = new Set(state.manualHiddenDays || []);
    scheduleUi.manualHiddenStaffIds = new Set(state.manualHiddenStaffIds || []);
    scheduleUi.manualHiddenInfoCols = new Set(state.manualHiddenInfoCols || []);
    scheduleUi.manualHiddenSummaryRows = new Set(state.manualHiddenSummaryRows || []);
    scheduleUi.manualHiddenBatches = (state.manualHiddenBatches || []).map((b) => ({ ...b }));
  }
  // 페이지가 처음 로드될 때, 지금 보고 있는 달(기본은 이번 달)에 저장돼 있던 접기 상태를
  // 곧바로 불러와둔다.
  scheduleSyncUiCollapseFromData();

  // ----- 상담사 검색 -----
  // "상담사 관리"·"면담 관리"와 같은 방식: 이름/닉네임(LDAP)/사번 일부만 입력해도 찾고,
  // 초성만 입력해도 찾는다("ㅎㄱㅇ" → "홍길동"). "주간"/"야간"/"채팅"/"유선" 키워드를 입력하면
  // 그 조건에 해당하는 인원이 모두 걸린다. 쉼표(,)로 여러 조건을 구분해서 입력하면
  // 그 중 하나라도 일치하는 인원을 모두 보여준다(이름+키워드를 섞어도 됨. 예: "홍길동,야간").
  // 이름/닉네임/사번/초성 외에, "주간"/"야간"/"채팅"/"유선" 근무 형태 키워드로도 검색할 수 있게 한다.
  const SCHEDULE_SEARCH_KEYWORD_MATCHERS = {
    "주간": (s) => s.group !== "night",
    "야간": (s) => s.group === "night",
    "채팅": (s) => (s.types || []).indexOf("채팅") !== -1,
    "유선": (s) => (s.types || []).indexOf("유선") !== -1,
  };
  function scheduleStaffMatchesSearchTerm(s, needle) {
    if (!needle) return true;
    if ((s.name || "").toLowerCase().indexOf(needle) !== -1) return true;
    if ((s.nickname || "").toLowerCase().indexOf(needle) !== -1) return true;
    if ((s.empNo || "").toLowerCase().indexOf(needle) !== -1) return true;
    if (getChosungString(s.name || "").indexOf(needle) !== -1) return true;
    if (getChosungString(s.nickname || "").indexOf(needle) !== -1) return true;
    const keywordFn = SCHEDULE_SEARCH_KEYWORD_MATCHERS[needle];
    if (keywordFn && keywordFn(s)) return true;
    return false;
  }
  function scheduleStaffMatchesSearch(s, query) {
    const terms = (query || "").split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
    if (terms.length === 0) return true;
    return terms.some((t) => scheduleStaffMatchesSearchTerm(s, t));
  }

  // ----- 월별 스케줄 표: 행(인원 그룹)·열(날짜) 접기/펼치기 -----
  // 행 그룹 키는 "필터모드::그룹이름" 형태로 만들어서, 전체보기/주간보기/야간보기 등
  // 화면마다 접힌 상태가 서로 섞이지 않게 한다.
  function scheduleRowGroupKey(filterMode, name) { return `${filterMode || "ALL"}::${name}`; }
  // "숨긴 항목" 패널에서 행 key를 사람이 읽기 좋은 한글로 대충 바꿔서 보여준다.
  // (완벽히 다듬어진 문구는 아니지만, 어떤 행인지 알아볼 수 있는 정도면 충분하다.)
  function schedulePrettyRowKey(key) {
    const map = {
      ADMIN: "관리자", DAY: "주간", NIGHT: "야간", CHAT: "채팅", VOICE: "유선",
      ETC: "업무 구분 미지정", DAY_TYPED: "주간", NIGHT_TYPED: "야간", total: "합계", ALL: null,
    };
    return key.split(/::|·/).filter(Boolean).map((seg) => (seg in map ? map[seg] : seg)).filter(Boolean).join(" · ") || key;
  }
  function scheduleIsRowGroupCollapsed(key) { return scheduleUi.collapsedRowGroups.has(key); }
  function scheduleToggleRowGroup(key) {
    if (scheduleUi.collapsedRowGroups.has(key)) scheduleUi.collapsedRowGroups.delete(key);
    else scheduleUi.collapsedRowGroups.add(key);
    scheduleSaveCollapseState();
    renderApp();
  }

  function scheduleAddColGroup(start, end) {
    const s = Math.min(start, end), e = Math.max(start, end);
    scheduleUi.colGroups.push({ id: `cg${Date.now()}${Math.random().toString(36).slice(2, 6)}`, start: s, end: e, collapsed: true });
    scheduleSaveCollapseState();
    renderApp();
  }
  function scheduleRemoveColGroup(id) {
    scheduleUi.colGroups = scheduleUi.colGroups.filter((g) => g.id !== id);
    scheduleSaveCollapseState();
    renderApp();
  }
  function scheduleToggleColGroup(id) {
    const g = scheduleUi.colGroups.find((g) => g.id === id);
    if (g) g.collapsed = !g.collapsed;
    scheduleSaveCollapseState();
    renderApp();
  }
  // "숨긴 열/행" 버튼 옆에 표시할 개수: 열 그룹(접힌 것) + 개별로 숨긴 열·행을 모두 합친다.
  function scheduleHiddenCount() {
    const collapsedColGroups = (scheduleUi.colGroups || []).filter((g) => g.collapsed).length;
    return collapsedColGroups + scheduleUi.manualHiddenDays.size + scheduleUi.manualHiddenInfoCols.size
      + scheduleUi.manualHiddenStaffIds.size + scheduleUi.manualHiddenSummaryRows.size;
  }
  // 이번 달 기준으로, 접혀 있는 열 그룹 + 개별로 접은 날짜들을 합쳐 돌려준다.
  function scheduleCollapsedDaySet() {
    const set = new Set(scheduleUi.manualHiddenDays);
    (scheduleUi.colGroups || []).forEach((g) => {
      if (!g.collapsed) return;
      for (let d = g.start; d <= g.end; d++) set.add(d);
    });
    return set;
  }

  // ----- 표에서 열 머리글(날짜)·행 머리글(닉네임 칸)을 직접 클릭해서 선택 → 오른쪽 클릭으로 접기 -----
  // 열 그룹(범위 지정)이나 행 그룹(관리자/주간/야간 등 미리 정해진 묶음) 접기와는 별개로,
  // 표를 보다가 필요없는 날짜 몇 개·인원 몇 명만 바로 골라서 접을 수 있게 해준다.
  // 클릭할 때마다 선택 상태가 토글되고(다시 누르면 선택 해제), 헤더가 아닌 곳을 클릭하면
  // 선택이 전부 풀린다. 선택된 상태에서 오른쪽 마우스를 누르면 "접기" 메뉴가 뜬다.
  let scheduleHeaderSelCols = new Set(); // 선택된 열의 key. 날짜 열은 "d:3", 인원정보 열은 "i:empno" 형태
  let scheduleHeaderSelRows = new Set(); // 선택된 staffId(행)
  let scheduleHiddenPanelOpen = false; // "숨긴 열/행" 패널(열 그룹 관리 + 접은 열·행을 다시 펼치는 곳) 열림 여부

  function scheduleApplyHeaderSelectionHighlight() {
    const root = document.getElementById("schedule-table-area");
    if (!root) return;
    root.querySelectorAll(".sch-col-th").forEach((th) => {
      th.classList.toggle("sch-th--selected", scheduleHeaderSelCols.has(th.getAttribute("data-col-key")));
    });
    root.querySelectorAll(".sch-row-th").forEach((td) => {
      td.classList.toggle("sch-th--selected", scheduleHeaderSelRows.has(td.getAttribute("data-row-key")));
    });
  }
  function scheduleClearHeaderSelection() {
    if (scheduleHeaderSelCols.size === 0 && scheduleHeaderSelRows.size === 0) return;
    scheduleHeaderSelCols = new Set();
    scheduleHeaderSelRows = new Set();
    scheduleApplyHeaderSelectionHighlight();
  }
  function scheduleToggleColSelection(colKey) {
    if (scheduleHeaderSelCols.has(colKey)) scheduleHeaderSelCols.delete(colKey);
    else scheduleHeaderSelCols.add(colKey);
    scheduleApplyHeaderSelectionHighlight();
  }
  function scheduleToggleRowSelection(rowKey) {
    if (scheduleHeaderSelRows.has(rowKey)) scheduleHeaderSelRows.delete(rowKey);
    else scheduleHeaderSelRows.add(rowKey);
    scheduleApplyHeaderSelectionHighlight();
  }
  // 오른쪽 클릭으로 바로 접기 메뉴를 연다. 우클릭한 헤더가 지금 선택 목록에 없으면
  // (다른 걸 선택해둔 채 엉뚱한 헤더를 우클릭한 경우 등) 그 헤더 하나만 선택한 것으로
  // 다시 잡아준다. 이미 선택된 헤더를 우클릭하면 지금까지 골라둔 선택을 그대로 유지한다.
  function scheduleHeaderRightClick(el, e) {
    e.preventDefault();
    e.stopPropagation();
    const isCol = el.classList.contains("sch-col-th");
    if (isCol) {
      const colKey = el.getAttribute("data-col-key");
      if (!scheduleHeaderSelCols.has(colKey)) {
        scheduleHeaderSelCols = new Set([colKey]);
        scheduleHeaderSelRows = new Set();
      }
    } else {
      const rowKey = el.getAttribute("data-row-key");
      if (!scheduleHeaderSelRows.has(rowKey)) {
        scheduleHeaderSelRows = new Set([rowKey]);
        scheduleHeaderSelCols = new Set();
      }
    }
    scheduleApplyHeaderSelectionHighlight();
    openScheduleHideMenu(e);
  }
  // 선택된 열·행을 실제로 접는다(=목록에 추가). 데이터 자체는 그대로 두고 화면에서만 숨긴다.
  // 행 key는 인원이면 "s:staffId", 집계행(관리자 인원/필요인력/대비 등)이면 "r:행고유키" 형태.
  function scheduleCollapseHeaderSelection() {
    const n = scheduleHeaderSelCols.size + scheduleHeaderSelRows.size;
    const batchInfoCols = [];
    const batchStaffIds = [];
    const batchSummaryRows = [];
    scheduleHeaderSelCols.forEach((k) => {
      if (k.startsWith("d:")) scheduleUi.manualHiddenDays.add(Number(k.slice(2)));
      else if (k.startsWith("i:")) { const key = k.slice(2); scheduleUi.manualHiddenInfoCols.add(key); batchInfoCols.push(key); }
    });
    scheduleHeaderSelRows.forEach((k) => {
      if (k.startsWith("s:")) { const id = k.slice(2); scheduleUi.manualHiddenStaffIds.add(id); batchStaffIds.push(id); }
      else if (k.startsWith("r:")) { const key = k.slice(2); scheduleUi.manualHiddenSummaryRows.add(key); batchSummaryRows.push(key); }
    });
    // 날짜 외에(정보 칸·인원·집계행 중 하나라도) 같이 접은 게 있으면, "숨긴 열/행" 패널에서
    // 한 덩어리로 묶어서 보여주고 한 번에 펼칠 수 있도록 이번에 접은 조합을 기록해둔다.
    if (batchInfoCols.length || batchStaffIds.length || batchSummaryRows.length) {
      scheduleUi.manualHiddenBatches.push({
        id: `hb${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
        infoCols: batchInfoCols, staffIds: batchStaffIds, summaryRows: batchSummaryRows,
      });
    }
    scheduleHeaderSelCols = new Set();
    scheduleHeaderSelRows = new Set();
    closeScheduleMenu();
    scheduleSaveCollapseState();
    renderApp();
    flashScheduleStatus(`${n}개 접었어요.`);
  }
  // 배치(한 번에 같이 접은 정보 칸·인원·집계행 묶음)를 한 번에 펼친다.
  function scheduleUnhideBatch(batchId) {
    const batch = scheduleUi.manualHiddenBatches.find((b) => b.id === batchId);
    if (!batch) return;
    (batch.infoCols || []).forEach((key) => scheduleUi.manualHiddenInfoCols.delete(key));
    (batch.staffIds || []).forEach((id) => scheduleUi.manualHiddenStaffIds.delete(id));
    (batch.summaryRows || []).forEach((key) => scheduleUi.manualHiddenSummaryRows.delete(key));
    scheduleUi.manualHiddenBatches = scheduleUi.manualHiddenBatches.filter((b) => b.id !== batchId);
    scheduleSaveCollapseState();
    renderApp();
  }
  // 배치 목록에서, 이미 다른 경로로 펼쳐졌거나(개별 펼치기) 지워진 항목은 걸러내고
  // 실제로 아직 숨겨져 있는 항목만 남긴 배치를 돌려준다. 빈 배치는 통째로 제외한다.
  function scheduleEffectiveHiddenBatches() {
    return scheduleUi.manualHiddenBatches
      .map((b) => ({
        id: b.id,
        infoCols: (b.infoCols || []).filter((key) => scheduleUi.manualHiddenInfoCols.has(key)),
        staffIds: (b.staffIds || []).filter((id) => scheduleUi.manualHiddenStaffIds.has(id)),
        summaryRows: (b.summaryRows || []).filter((key) => scheduleUi.manualHiddenSummaryRows.has(key)),
      }))
      .filter((b) => b.infoCols.length + b.staffIds.length + b.summaryRows.length > 1); // 1개짜리는 기존 개별 칩으로 표시
  }
  function openScheduleHideMenu(e) {
    closeScheduleMenu();
    const menu = document.createElement("div");
    menu.id = "sch-menu";
    menu.className = "sch-menu";
    const labelParts = [];
    if (scheduleHeaderSelCols.size > 0) labelParts.push(`열 ${scheduleHeaderSelCols.size}개`);
    if (scheduleHeaderSelRows.size > 0) labelParts.push(`행 ${scheduleHeaderSelRows.size}개`);
    menu.innerHTML = `<div class="sch-menu-title">${labelParts.join(" · ")} 선택됨</div>` +
      `<button type="button" data-collapse-header-sel="1">접기</button>` +
      `<button type="button" class="sch-menu-reset" data-clear-header-sel="1">선택 해제</button>`;
    document.body.appendChild(menu);
    const clientX = e ? e.clientX : window.innerWidth / 2;
    const clientY = e ? e.clientY : window.innerHeight / 2;
    const top = Math.min(clientY + 4, window.innerHeight - menu.offsetHeight - 8);
    const left = Math.min(clientX, window.innerWidth - menu.offsetWidth - 8);
    menu.style.top = `${Math.max(8, top)}px`;
    menu.style.left = `${Math.max(8, left)}px`;
    menu.querySelector("[data-collapse-header-sel]").onclick = () => scheduleCollapseHeaderSelection();
    const clearBtn = menu.querySelector("[data-clear-header-sel]");
    clearBtn.onclick = () => { closeScheduleMenu(); scheduleClearHeaderSelection(); };
    setTimeout(() => document.addEventListener("mousedown", scheduleMenuOutsideHandler, true), 0);
  }
  // 개별로 접어둔 날짜/인원정보열/인원/집계행을 다시 펼친다.
  // 연속된 날짜 구간(start~end)을 한 번에 펼친다. "숨긴 열/행" 패널에서 여러 날짜를
  // 한 번에 접었을 때 하나로 묶여 보이는 범위 칩의 "펼치기" 버튼에서 쓰인다.
  function scheduleUnhideDayRange(start, end) {
    for (let d = start; d <= end; d++) scheduleUi.manualHiddenDays.delete(d);
    scheduleSaveCollapseState();
    renderApp();
  }
  // 접혀 있는 날짜들을 정렬한 뒤, 연속된(바로 다음날) 구간끼리 묶어서
  // [{start, end}, ...] 형태로 돌려준다. 예: [11,12,13,15] → [{11,13},{15,15}]
  // 여러 날짜를 한 번에 선택해서 접으면 "09/11~09/13" 처럼 범위 하나로 보여주고,
  // 그 범위를 한 번에 펼칠 수 있게 하기 위함이다.
  function scheduleGroupConsecutiveDays(days) {
    const sorted = Array.from(days).sort((a, b) => a - b);
    const ranges = [];
    for (const d of sorted) {
      const last = ranges[ranges.length - 1];
      if (last && d === last.end + 1) last.end = d;
      else ranges.push({ start: d, end: d });
    }
    return ranges;
  }
  function scheduleUnhideInfoCol(key) {
    scheduleUi.manualHiddenInfoCols.delete(key);
    scheduleSaveCollapseState();
    renderApp();
  }
  function scheduleUnhideSummaryRow(key) {
    scheduleUi.manualHiddenSummaryRows.delete(key);
    scheduleSaveCollapseState();
    renderApp();
  }
  function scheduleUnhideStaff(staffId) {
    scheduleUi.manualHiddenStaffIds.delete(staffId);
    scheduleSaveCollapseState();
    renderApp();
  }
  function scheduleUnhideAll() {
    scheduleUi.manualHiddenDays = new Set();
    scheduleUi.manualHiddenInfoCols = new Set();
    scheduleUi.manualHiddenStaffIds = new Set();
    scheduleUi.manualHiddenSummaryRows = new Set();
    scheduleUi.manualHiddenBatches = [];
    scheduleUi.collapsedRowGroups = new Set();
    scheduleUi.colGroups = [];
    scheduleSaveCollapseState();
    renderApp();
  }

  // ----- 월별 스케줄 일괄 붙여넣기 -----
  // "이름 [공백] 1일값 [공백] 2일값 ... [공백] 말일값" 형태의 한 줄짜리 텍스트를
  // (엑셀 등에서 복사해온) 여러 줄 붙여넣으면, 이름으로 인원을 찾아 그 달 1일부터
  // 순서대로 각 칸의 상태를 반영해준다. 공백(스페이스·탭 모두)이 나올 때마다
  // 다음 날짜로 넘어간다고 보고 값을 나눈다.
  let scheduleBulkPasteOpen = false;
  let scheduleBulkPasteMsg = "";

  // 붙여넣기 텍스트에 쓰인 표현을 내부 상태값으로 변환한다. 인식하지 못하는
  // 값은 null을 반환해서 결과 메시지에 "인식 못한 값"으로 알려준다.
  function scheduleTokenToRecord(tokRaw) {
    const tok = (tokRaw || "").trim();
    if (tok === "1" || tok === "근무" || tok === "출근") return { status: "WORK", attendance: null };
    if (tok === "휴일" || tok === "오프" || tok === "휴무" || tok === "휴") return { status: "OFF", attendance: null };
    if (tok === "연차") return { status: "ANNUAL", attendance: null };
    if (tok === "대휴") return { status: "DAEHYU", attendance: null };
    if (tok === "반차") return { status: "HALF", attendance: null };
    if (tok === "공휴") return { status: "GONGHYU", attendance: null };
    if (tok === "공가") return { status: "GONGGA", attendance: null };
    if (tok === "육휴" || tok === "육아휴직") return { status: "MATERNITY", attendance: null };
    if (tok === "특휴" || tok === "특별휴가") return { status: "SPECIAL", attendance: null };
    if (tok === "교육") return { status: "EDUCATION", attendance: null };
    if (tok === "지각") return { status: "WORK", attendance: "LATE" };
    if (tok === "결근") return { status: "WORK", attendance: "ABSENT" };
    if (tok === "퇴사") return { status: "RESIGNED", attendance: null };
    return null;
  }

  function applyScheduleBulkPaste(text) {
    const { year, monthIndex } = scheduleUi;
    if (scheduleIsMonthLocked(year, monthIndex)) {
      scheduleBulkPasteMsg = "이 달은 잠겨 있어요. 잠금을 해제한 뒤 붙여넣어주세요.";
      return;
    }
    const numDays = scheduleDaysInMonth(year, monthIndex);
    const monthStaff = getStaffListForMonth(year, monthIndex);
    const lines = (text || "").split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);

    if (lines.length === 0) {
      scheduleBulkPasteMsg = "붙여넣은 내용이 없어요.";
      return;
    }

    recordUndo("스케줄 일괄 붙여넣기", SCHEDULE_KEY, reloadScheduleData);
    let matchedLines = 0;
    let filledCells = 0;
    const unmatchedNames = [];
    const unknownTokens = [];

    lines.forEach((line) => {
      const parts = line.split(/\s+/).filter((p) => p.length > 0);
      if (parts.length < 2) return;
      const name = parts[0];
      const tokens = parts.slice(1);
      const staff = monthStaff.find((s) => s.name === name) || monthStaff.find((s) => s.nickname === name);
      if (!staff) { unmatchedNames.push(name); return; }
      matchedLines += 1;
      const dayCount = Math.min(numDays, tokens.length);
      for (let i = 0; i < dayCount; i++) {
        const day = i + 1;
        const mapped = scheduleTokenToRecord(tokens[i]);
        if (!mapped) { unknownTokens.push(`${name} ${day}일 "${tokens[i]}"`); continue; }
        const dateKey = scheduleDateKey(year, monthIndex, day);
        const key = scheduleRecordKey(staff.id, dateKey);
        if (mapped.status === "WORK" && !mapped.attendance) {
          delete scheduleData.records[key];
        } else {
          scheduleData.records[key] = { status: mapped.status, attendance: mapped.attendance || null };
        }
        filledCells += 1;
      }
    });

    saveScheduleData();

    const msgParts = [`${matchedLines}명 반영 완료 (총 ${filledCells}칸).`];
    if (unmatchedNames.length > 0) msgParts.push(`이름을 찾지 못함: ${unmatchedNames.join(", ")}`);
    if (unknownTokens.length > 0) msgParts.push(`인식 못한 값: ${unknownTokens.join(", ")}`);
    scheduleBulkPasteMsg = msgParts.join("\n");
  }

  const SCHEDULE_STATUS_META = {
    WORK: { label: "1", cls: "st-work" },
    OFF: { label: "오프", cls: "st-off" },
    ANNUAL: { label: "연차", cls: "st-annual" },
    DAEHYU: { label: "대휴", cls: "st-daehyu" },
    HALF: { label: "반차", cls: "st-half" },
    GONGHYU: { label: "공휴", cls: "st-gonghyu" },
    GONGGA: { label: "공가", cls: "st-gongga" },
    MATERNITY: { label: "육휴", cls: "st-maternity" },
    SPECIAL: { label: "특휴", cls: "st-special" },
    EDUCATION: { label: "교육", cls: "st-education" },
    RESIGNED: { label: "퇴사", cls: "st-resigned" },
  };

  // 표 왼쪽에 고정된(스크롤해도 안 움직이는) 인원 정보 열들. 순서·너비는 CSS(.sch-col-*)와
  // 반드시 맞춰야 한다 — 개별 열을 접었을 때 나머지 고정 열들의 위치(left)를 여기 너비값으로
  // 다시 계산해서 밀어주기 때문. summaryOnly는 이미지 캡처(hideSummaryCols=true)에서는
  // 아예 마크업에서 빠지는 근무~결근 집계 열 5개를 표시한다.
  const SCHEDULE_INFO_COLS = [
    { key: "nickname", label: "닉네임", width: 92 },
    { key: "name", label: "이름", width: 60 },
    { key: "empno", label: "사번", width: 84 },
    { key: "hiredate", label: "입사일자", width: 92 },
    { key: "workhours", label: "근무시간", width: 92 },
    { key: "work", label: "근무", width: 48, summaryOnly: true },
    { key: "off", label: "오프", width: 48, summaryOnly: true },
    { key: "annual", label: "연차", width: 48, summaryOnly: true },
    { key: "daehyu", label: "대휴", width: 48, summaryOnly: true },
    { key: "absent", label: "결근", width: 48, summaryOnly: true },
  ];
  // 지금 화면(hideSummaryCols=false 기준)에서, 접히지 않은 고정 열들이 각각 왼쪽에서
  // 몇 px 위치에 붙어야 하는지 계산한다. 접힌 열은 폭이 0이 되므로 뒤 열들이 그만큼 당겨진다.
