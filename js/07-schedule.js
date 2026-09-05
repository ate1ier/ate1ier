  function loadScheduleData() {
    try {
      const raw = localStorage.getItem(SCHEDULE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.staff) && parsed.records && typeof parsed.records === "object") {
          if (!parsed.staffHistory || typeof parsed.staffHistory !== "object") parsed.staffHistory = {};
          if (typeof parsed.lastSyncMonthKey !== "string") parsed.lastSyncMonthKey = null;
          return parsed;
        }
      }
    } catch (e) {}
    return { staff: [], records: {}, staffHistory: {}, lastSyncMonthKey: null, requiredHeadcount: {}, monthLocks: {}, memos: {} };
  }
  function normalizeScheduleData(d) {
    if (!d.requiredHeadcount) d.requiredHeadcount = {};
    // 셀(인원×날짜)마다 남길 수 있는 메모. key는 scheduleRecordKey와 같은 형식(staffId|dateKey).
    if (!d.memos || typeof d.memos !== "object") d.memos = {};
    // 사용자가 직접 켜고 끄는 "월별 잠금". 잠긴 달은 셀 클릭·일괄 붙여넣기·삭제·필요인력 입력 등
    // 데이터를 바꾸는 조작이 전부 막혀서 실수로 수정되는 걸 막아준다. 다시 버튼을 눌러 풀면 그대로 수정 가능.
    if (!d.monthLocks || typeof d.monthLocks !== "object") d.monthLocks = {};
    return d;
  }
  // 되돌리기(undo)로 스냅샷을 복원한 뒤 이 함수를 호출해 scheduleData를 다시 읽어들인다.
  function reloadScheduleData() { scheduleData = normalizeScheduleData(loadScheduleData()); }
  let scheduleData = normalizeScheduleData(loadScheduleData());

  // "YYYY-MM" 형태의 달 키. 과거 달을 고정(확정)하고 식별하는 데 쓴다.
  function scheduleMonthKey(year, monthIndex) { return `${year}-${pad2(monthIndex + 1)}`; }
  function scheduleCurrentMonthKey() { return scheduleMonthKey(today.getFullYear(), today.getMonth()); }
  // 실제 오늘 날짜 기준으로 이미 지나간 달인지 (이번 달·미래 달이면 false).
  // 지나간 달의 인원 스냅샷(staffHistory)을 고정할지 판단하는 용도로만 쓰인다.
  function scheduleIsMonthPast(year, monthIndex) {
    return scheduleMonthKey(year, monthIndex) < scheduleCurrentMonthKey();
  }
  // ----- 월별 "잠금" -----
  // 달이 지나서 확정되면 자동으로 잠기고, 사용자가 잠금 버튼으로 언제든 다시 풀거나 잠글 수 있다.
  // monthLocks[key] === true  → 사용자가 강제로 잠가둔 상태
  // monthLocks[key] === false → 사용자가 강제로 잠금을 풀어둔 상태(지나간 달이라도 수정 가능)
  // monthLocks[key]가 아예 없으면 → 지나간 달은 기본적으로 잠기고, 이번 달·미래 달은 기본적으로 풀려 있다.
  // 잠긴 달은 셀 클릭 편집, 일괄 붙여넣기, 일정 삭제, 필요인력 입력이 모두 막힌다.
  function scheduleIsMonthLocked(year, monthIndex) {
    const key = scheduleMonthKey(year, monthIndex);
    if (Object.prototype.hasOwnProperty.call(scheduleData.monthLocks, key)) {
      return !!scheduleData.monthLocks[key];
    }
    return scheduleIsMonthPast(year, monthIndex);
  }
  function scheduleToggleMonthLock(year, monthIndex) {
    const key = scheduleMonthKey(year, monthIndex);
    scheduleData.monthLocks[key] = !scheduleIsMonthLocked(year, monthIndex);
    saveScheduleData();
    renderApp();
  }
  // 지금 편집하려는 날짜(dateKey, "YYYY-MM-DD")가 속한 달이 잠겨 있는지 확인.
  function scheduleIsDateLocked(dateKey) {
    const parts = (dateKey || "").split("-");
    if (parts.length < 2) return false;
    return scheduleIsMonthLocked(Number(parts[0]), Number(parts[1]) - 1);
  }
  // 특정 달에 적용할 인원 목록을 반환한다.
  // - 이미 지나간(확정된) 달은 그 시점에 저장해둔 스냅샷(staffHistory)을 그대로 쓴다.
  //   스냅샷이 아직 없는 지난 달이라면(=이번에 처음 그 달이 과거가 된 경우) 지금 시점의
  //   인원 데이터로 스냅샷을 만들어 고정해버린다. 이후로는 "상담사 관리"에서 인원이
  //   바뀌어도 이 스냅샷은 절대 바뀌지 않는다.
  // - 이번 달과 미래 달은 "상담사 관리"의 실시간 데이터(scheduleData.staff)를 그대로 쓴다.
  function getStaffListForMonth(year, monthIndex) {
    const key = scheduleMonthKey(year, monthIndex);
    if (scheduleData.staffHistory[key]) return scheduleData.staffHistory[key];
    if (scheduleIsMonthPast(year, monthIndex)) {
      scheduleData.staffHistory[key] = JSON.parse(JSON.stringify(scheduleData.staff));
      saveScheduleData();
      return scheduleData.staffHistory[key];
    }
    return scheduleData.staff;
  }

  // 월별 스케줄의 인원 목록을 "상담사 관리"의 목록으로 자동 반영한다.
  // 이름/사번/입사일/근무시간/업무구분(채팅·유선)/조(주간·야간) 모두
  // 상담사 관리 쪽 값을 그대로 따라간다. 조는 스케줄 화면에서도 바로
  // 바꿀 수 있는데, 그 경우 "상담사 관리" 쪽 값도 함께 바뀌어 항상 서로 일치한다.
  // 반환값(changed): 실제로 scheduleData 내용이 바뀌었는지 여부. 앱을 열 때마다(js/12-init.js)
  // 항상 호출되는 함수라서, 바뀐 게 없는데도 매번 saveScheduleData()로 (특히 클라우드까지) 다시
  // 저장하는 낭비를 피하려고 변경 여부를 추적한다.
  function syncScheduleStaffFromAgents() {
    let changed = false;
    // 실제 오늘 날짜가 이전에 동기화했던 달을 지나 새 달로 넘어갔다면,
    // 그 이전 달은 이제 "지나간 달"이므로 지금까지의 실시간 인원 데이터를
    // 스냅샷으로 고정해서 남겨둔다. (해당 달을 아직 한 번도 안 열어봤어도
    // 여기서 바로 고정되므로, 나중에 상담사 관리에서 인원이 바뀌어도 안전하다)
    const currentMonthKey = scheduleCurrentMonthKey();
    if (scheduleData.lastSyncMonthKey && scheduleData.lastSyncMonthKey !== currentMonthKey) {
      if (!scheduleData.staffHistory[scheduleData.lastSyncMonthKey]) {
        scheduleData.staffHistory[scheduleData.lastSyncMonthKey] = JSON.parse(JSON.stringify(scheduleData.staff));
        changed = true;
      }
    }
    if (scheduleData.lastSyncMonthKey !== currentMonthKey) {
      scheduleData.lastSyncMonthKey = currentMonthKey;
      changed = true;
    }

    // 월별 스케줄에는 "근무중" 상태인 인원만 반영한다. "퇴사"로 표시된 인원은
    // 상담사 관리 목록에는 남아있어도 이번 달/앞으로의 스케줄에는 나타나지 않는다.
    // (단, 이미 지나간 달에 대한 기록·스냅샷은 그대로 보존된다)
    const nextStaff = agentsData.filter((a) => a.status !== "RESIGNED").map((a) => ({
      id: a.id,
      nickname: a.ldap || a.name,
      name: a.name,
      empNo: a.empNo,
      hireDate: a.hireDate,
      workHours: a.timezone,
      group: a.group === "night" ? "night" : "day",
      types: a.workTypes || [],
      isAdmin: !!a.isAdmin,
    }));
    // 인원 목록 자체가 실제로 달라졌을 때만 교체한다(매번 새 배열을 만들어 대입하면
    // 값이 똑같아도 "바뀐 것"으로 취급하게 되므로, 내용을 비교해서 진짜 변경만 반영).
    if (JSON.stringify(nextStaff) !== JSON.stringify(scheduleData.staff)) {
      scheduleData.staff = nextStaff;
      changed = true;
    }
    // 기록(근무/오프/지각 등)을 지울 때는, 지금 "상담사 관리"에 없는 인원이라도
    // 지나간 달의 스냅샷에 남아있는 인원이면 그 달 기록은 지우지 않는다.
    // (지나간 달을 고정해두는 의미가 없어지지 않도록)
    const validIds = {};
    agentsData.forEach((a) => { validIds[a.id] = true; });
    Object.keys(scheduleData.staffHistory).forEach((mk) => {
      (scheduleData.staffHistory[mk] || []).forEach((s) => { validIds[s.id] = true; });
    });
    Object.keys(scheduleData.records).forEach((key) => {
      const staffId = key.split("|")[0];
      if (!validIds[staffId]) { delete scheduleData.records[key]; changed = true; }
    });
    Object.keys(scheduleData.memos).forEach((key) => {
      const staffId = key.split("|")[0];
      if (!validIds[staffId]) { delete scheduleData.memos[key]; changed = true; }
    });
    return changed;
  }

  function saveScheduleData() {
    try { localStorage.setItem(SCHEDULE_KEY, JSON.stringify(scheduleData)); flashScheduleStatus("저장됨"); }
    catch (e) { flashScheduleStatus("저장 실패"); }
  }

  function flashScheduleStatus(msg) { flashStatusMessage("schedule-status", msg, 1200); }

  const scheduleUi = {
    year: today.getFullYear(),
    monthIndex: today.getMonth(), // 0-based. 실시간 기준 당월로 시작한다.
    collapsedRowGroups: new Set(), // 접힌 행 그룹(관리자/주간/야간/채팅/유선 등)의 키 모음
    colGroups: [], // 사용자가 지정한 열(날짜) 그룹: { id, start, end, collapsed }
    manualHiddenDays: new Set(), // 열 머리글을 직접 선택해서 접은 날짜(일자 숫자) 모음
    manualHiddenStaffIds: new Set(), // 인원 이름칸을 직접 선택해서 접은 staffId 모음
    manualHiddenInfoCols: new Set(), // 직접 선택해서 접은 인원 정보 열(닉네임~결근) 키 모음
    manualHiddenSummaryRows: new Set(), // 직접 선택해서 접은 집계행(관리자 인원/필요인력/대비 등) 키 모음
  };

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
    renderApp();
  }

  function scheduleAddColGroup(start, end) {
    const s = Math.min(start, end), e = Math.max(start, end);
    scheduleUi.colGroups.push({ id: `cg${Date.now()}${Math.random().toString(36).slice(2, 6)}`, start: s, end: e, collapsed: true });
    renderApp();
  }
  function scheduleRemoveColGroup(id) {
    scheduleUi.colGroups = scheduleUi.colGroups.filter((g) => g.id !== id);
    renderApp();
  }
  function scheduleToggleColGroup(id) {
    const g = scheduleUi.colGroups.find((g) => g.id === id);
    if (g) g.collapsed = !g.collapsed;
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
    scheduleHeaderSelCols.forEach((k) => {
      if (k.startsWith("d:")) scheduleUi.manualHiddenDays.add(Number(k.slice(2)));
      else if (k.startsWith("i:")) scheduleUi.manualHiddenInfoCols.add(k.slice(2));
    });
    scheduleHeaderSelRows.forEach((k) => {
      if (k.startsWith("s:")) scheduleUi.manualHiddenStaffIds.add(k.slice(2));
      else if (k.startsWith("r:")) scheduleUi.manualHiddenSummaryRows.add(k.slice(2));
    });
    scheduleHeaderSelCols = new Set();
    scheduleHeaderSelRows = new Set();
    closeScheduleMenu();
    renderApp();
    flashScheduleStatus(`${n}개 접었어요.`);
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
    positionFloatingMenu(menu, clientX, clientY + 4);
    menu.querySelector("[data-collapse-header-sel]").onclick = () => scheduleCollapseHeaderSelection();
    const clearBtn = menu.querySelector("[data-clear-header-sel]");
    clearBtn.onclick = () => { closeScheduleMenu(); scheduleClearHeaderSelection(); };
    setTimeout(() => document.addEventListener("mousedown", scheduleMenuOutsideHandler, true), 0);
  }
  // 개별로 접어둔 날짜/인원정보열/인원/집계행을 다시 펼친다.
  function scheduleUnhideDay(day) {
    scheduleUi.manualHiddenDays.delete(day);
    renderApp();
  }
  function scheduleUnhideInfoCol(key) {
    scheduleUi.manualHiddenInfoCols.delete(key);
    renderApp();
  }
  function scheduleUnhideSummaryRow(key) {
    scheduleUi.manualHiddenSummaryRows.delete(key);
    renderApp();
  }
  function scheduleUnhideStaff(staffId) {
    scheduleUi.manualHiddenStaffIds.delete(staffId);
    renderApp();
  }
  function scheduleUnhideAll() {
    scheduleUi.manualHiddenDays = new Set();
    scheduleUi.manualHiddenInfoCols = new Set();
    scheduleUi.manualHiddenStaffIds = new Set();
    scheduleUi.manualHiddenSummaryRows = new Set();
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
    { key: "nickname", label: "닉네임", width: 88 },
    { key: "name", label: "이름", width: 56 },
    { key: "empno", label: "사번", width: 80 },
    { key: "hiredate", label: "입사일자", width: 88 },
    { key: "workhours", label: "근무시간", width: 88 },
    { key: "work", label: "근무", width: 46, summaryOnly: true },
    { key: "off", label: "오프", width: 46, summaryOnly: true },
    { key: "annual", label: "연차", width: 46, summaryOnly: true },
    { key: "daehyu", label: "대휴", width: 46, summaryOnly: true },
    { key: "absent", label: "결근", width: 46, summaryOnly: true },
  ];
  // 지금 화면(hideSummaryCols=false 기준)에서, 접히지 않은 고정 열들이 각각 왼쪽에서
  // 몇 px 위치에 붙어야 하는지 계산한다. 접힌 열은 폭이 0이 되므로 뒤 열들이 그만큼 당겨진다.
  function scheduleInfoColLeftOffsets() {
    let offset = 0;
    const lefts = {};
    let lastVisibleKey = null;
    SCHEDULE_INFO_COLS.forEach((c) => {
      if (scheduleUi.manualHiddenInfoCols.has(c.key)) { lefts[c.key] = null; return; }
      lefts[c.key] = offset;
      offset += c.width;
      lastVisibleKey = c.key;
    });
    return { lefts, lastVisibleKey };
  }

  function scheduleDaysInMonth(year, monthIndex) { return new Date(year, monthIndex + 1, 0).getDate(); }
  function scheduleDateKey(year, monthIndex, day) { return `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`; }
  function scheduleRecordKey(staffId, dateKey) { return `${staffId}|${dateKey}`; }
  // ----- 주간/야간 · 채팅/유선 "필요인력" (사용자가 직접 입력하는 값) -----
  // 그룹(DAY/NIGHT) · 업무구분(채팅/유선) · 날짜별로 하나씩 숫자를 저장한다.
  // 값을 입력하지 않은 날짜는 null로 취급해서 "대비"·"인력 대비 편성"을 비워둔다.
  function scheduleRequiredKey(year, monthIndex, group, type, day) {
    return `${scheduleMonthKey(year, monthIndex)}|${group}|${type}|${day}`;
  }
  function getRequiredHeadcount(year, monthIndex, group, type, day) {
    const v = scheduleData.requiredHeadcount[scheduleRequiredKey(year, monthIndex, group, type, day)];
    return (typeof v === "number" && !isNaN(v)) ? v : null;
  }
  function setRequiredHeadcount(year, monthIndex, group, type, day, rawValue) {
    if (scheduleIsMonthLocked(year, monthIndex)) { flashScheduleStatus("잠긴 달이에요. 잠금을 해제한 뒤 수정해주세요."); return; }
    const key = scheduleRequiredKey(year, monthIndex, group, type, day);
    const trimmed = (rawValue || "").toString().trim();
    if (trimmed === "") {
      delete scheduleData.requiredHeadcount[key];
    } else {
      const n = Number(trimmed);
      if (isNaN(n)) return;
      scheduleData.requiredHeadcount[key] = n;
    }
    saveScheduleData();
  }
  // 특정 날짜에 실제로 투입(출근)된 인원 수. summaryRowHtml과 같은 집계 기준을 쓴다.
  function scheduleActualCount(staffList, type, dateKey) {
    return staffList.filter((s) => (!type || (s.types || []).indexOf(type) !== -1) && scheduleCountsAsWorked(getScheduleRecord(s.id, dateKey))).length;
  }
  function getScheduleRecord(staffId, dateKey) {
    return scheduleData.records[scheduleRecordKey(staffId, dateKey)] || { status: "WORK", attendance: null };
  }
  function setScheduleRecord(staffId, dateKey, patch) {
    if (scheduleIsDateLocked(dateKey)) { flashScheduleStatus("잠긴 달이에요. 잠금을 해제한 뒤 수정해주세요."); return; }
    recordUndo("스케줄 셀 변경", SCHEDULE_KEY, reloadScheduleData);
    const key = scheduleRecordKey(staffId, dateKey);
    const cur = scheduleData.records[key] || { status: "WORK", attendance: null };
    const next = Object.assign({}, cur, patch);
    if (next.status === "WORK" && !next.attendance) {
      delete scheduleData.records[key]; // 기본값이면 굳이 저장하지 않음
    } else {
      scheduleData.records[key] = next;
    }
    saveScheduleData();
  }
  // ----- 셀 메모 (엑셀의 "메모/노트"처럼, 스케줄 상태와 별개로 짧은 텍스트를 남긴다) -----
  function getScheduleMemo(staffId, dateKey) {
    return scheduleData.memos[scheduleRecordKey(staffId, dateKey)] || "";
  }
  function setScheduleMemo(staffId, dateKey, text) {
    if (scheduleIsDateLocked(dateKey)) { flashScheduleStatus("잠긴 달이에요. 잠금을 해제한 뒤 수정해주세요."); return; }
    const key = scheduleRecordKey(staffId, dateKey);
    const trimmed = (text || "").trim();
    if (trimmed === "") {
      delete scheduleData.memos[key];
    } else {
      scheduleData.memos[key] = trimmed;
    }
    saveScheduleData();
  }
  function scheduleCellDisplay(record) {
    if (record.status === "WORK" && record.attendance === "LATE") return { label: "지각", cls: "st-late" };
    if (record.status === "WORK" && record.attendance === "ABSENT") return { label: "결근", cls: "st-absent" };
    const meta = SCHEDULE_STATUS_META[record.status] || SCHEDULE_STATUS_META.WORK;
    return meta;
  }
  function scheduleCountsAsWorked(record) {
    return record.status === "WORK" && record.attendance !== "ABSENT";
  }

  // 이번 달 근무/오프/연차/대휴/결근 일수를 인원별로 집계.
  // "오프" 합계는 스케줄상 오프뿐 아니라 대휴·공휴·육휴·특휴까지 모두 포함해서 셈한다.
  // (대휴는 별도 열에도 단독으로 계속 표시되므로 DAEHYU 값 자체는 그대로 둔다)
  function scheduleStaffMonthCounts(staffId, year, monthIndex) {
    const numDays = scheduleDaysInMonth(year, monthIndex);
    const counts = { WORK: 0, OFF: 0, ANNUAL: 0, DAEHYU: 0, ABSENT: 0 };
    // "오프" 합계에 함께 포함시킬 휴무성 상태 목록 (대휴는 아래에서 DAEHYU로 별도 집계도 함께 함)
    const OFF_GROUP_STATUSES = ["OFF", "DAEHYU", "GONGHYU", "MATERNITY", "SPECIAL"];
    for (let d = 1; d <= numDays; d++) {
      const dateKey = scheduleDateKey(year, monthIndex, d);
      const record = getScheduleRecord(staffId, dateKey);
      if (record.status === "WORK" && record.attendance === "ABSENT") counts.ABSENT += 1;
      else if (record.status === "WORK") counts.WORK += 1;
      else if (record.status === "ANNUAL") counts.ANNUAL += 1;
      else if (record.status === "DAEHYU") counts.DAEHYU += 1;
      if (OFF_GROUP_STATUSES.indexOf(record.status) !== -1) counts.OFF += 1;
    }
    return counts;
  }

  // 조(주간/야간)는 "상담사 관리"에 등록된 값이 기본으로 반영되지만,
  // 이 스케줄 화면에서도 바로 전환할 수 있다. 이때는 "상담사 관리" 쪽
  // 데이터도 함께 바꿔서 두 화면이 항상 같은 값을 보여주도록 한다.
  // 이름/사번/입사일 등 나머지 정보는 "상담사 관리"에서 수정하면 자동으로 반영된다.
  function scheduleMonthLabel() { return `${scheduleUi.year}년 ${scheduleUi.monthIndex + 1}월`; }
  function scheduleShiftMonth(delta) {
    let m = scheduleUi.monthIndex + delta;
    let y = scheduleUi.year;
    while (m < 0) { m += 12; y -= 1; }
    while (m > 11) { m -= 12; y += 1; }
    scheduleUi.monthIndex = m;
    scheduleUi.year = y;
    // 달이 바뀌면 날짜 번호·인원 목록의 의미가 달라지므로 선택·개별 접기 상태를 모두 초기화한다.
    scheduleHeaderSelCols = new Set();
    scheduleHeaderSelRows = new Set();
    scheduleUi.manualHiddenDays = new Set();
    scheduleUi.manualHiddenStaffIds = new Set();
    renderApp();
  }

  // 채팅 담당자를 먼저, 유선만 담당하는 인원을 그다음에 배치하기 위한 순위.
  // (채팅+유선을 함께 하는 인원은 채팅 쪽에 먼저 표시)
  function scheduleTypeRank(s) {
    const types = s.types || [];
    if (types.indexOf("채팅") !== -1) return 0;
    if (types.indexOf("유선") !== -1) return 1;
    return 2;
  }
  // 근무시간(예: "09:00-18:00")에서 시작 시각을 분 단위로 추출한다.
  // 시간 형식을 찾을 수 없으면 맨 뒤로 보내기 위해 아주 큰 값을 반환한다.
  function scheduleStartMinutes(s) {
    const wh = s.workHours || "";
    const m = wh.match(/(\d{1,2}):(\d{2})/);
    if (!m) return Infinity;
    return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  }
  // 업무 구분(채팅/유선) 순으로 정렬하고, 같은 구분 안에서는 근무시간(시작 시각) 순으로,
  // 시간이 같거나 없으면 기존 등록 순서를 유지한다.
  function sortStaffByType(list) {
    return list
      .map((s, idx) => ({ s, idx }))
      .sort((a, b) => {
        const r = scheduleTypeRank(a.s) - scheduleTypeRank(b.s);
        if (r !== 0) return r;
        const t = scheduleStartMinutes(a.s) - scheduleStartMinutes(b.s);
        return t !== 0 ? t : a.idx - b.idx;
      })
      .map((x) => x.s);
  }
  function splitByType(list) {
    return {
      chat: list.filter((s) => scheduleTypeRank(s) === 0),
      voice: list.filter((s) => scheduleTypeRank(s) === 1),
      etc: list.filter((s) => scheduleTypeRank(s) === 2),
    };
  }

  // filterMode: 인자를 안 주면(undefined) 지금까지와 같은 "전체" 표(관리자+주간+야간)를 그린다.
  // "DAY"/"NIGHT"를 주면 그 조만, "VOICE"/"CHAT"을 주면 주야간을 통합하되 표 안에서는
  // 주간/야간 구획을 나눠서 보여준다. (월별 스케줄 캡처의 "주간 저장"·"야간 저장"·
  // "유선 저장"·"채팅 저장" 기능에서 사용)
  // hideRequiredRows: true면 "필요인력"/"대비"/"인력 대비 편성" 3행 묶음(입력칸 포함)을 아예 빼고 그린다.
  // (이미지로 저장할 때 켜서 씀. 이 행에는 <input>이 들어있어 캡처 대상에서 빼는 게 더 안전하고,
  //  캡처 이미지 안에 사용자가 직접 편집하는 입력용 요소가 노출되지 않게 한다.)
  function buildScheduleTableHtml(filterMode, hideSummaryCols, hideRequiredRows, hideMemoMarks) {
    const { year, monthIndex } = scheduleUi;
    const numDays = scheduleDaysInMonth(year, monthIndex);
    const days = [];
    for (let d = 1; d <= numDays; d++) days.push(d);
    const collapsedDays = scheduleCollapsedDaySet();
    const colHiddenCls = (d) => (collapsedDays.has(d) ? " sch-col-hidden" : "");
    // 이미지로 저장할 때는 근무~결근 집계 열 5개를 표에서 아예 빼고 그린다.
    // 화면(hideSummaryCols가 false)에서 개별로 접은 인원정보 열(사번 등)도 같은 이유로
    // "안 보이게" CSS로 숨기는 대신 마크업 자체에서 통째로 빼버린다 — "관리자 인원" 같은
    // 요약행들이 인원정보 영역 전체를 colspan 하나로 합친 칸을 쓰는데, 이 표에서는
    // CSS로 열을 숨기는 방식으로는 그 colspan 너비 계산이 정확히 안 맞아서(브라우저가
    // 숨긴 셀만큼 너비를 못 줄여줌) 표가 밀려 보인다. 아예 셀 자체를 안 만들면 이 문제가 없다.
    const infoColCount = hideSummaryCols
      ? 5
      : SCHEDULE_INFO_COLS.filter((c) => !scheduleUi.manualHiddenInfoCols.has(c.key)).length;
    const { lefts: infoColLefts, lastVisibleKey: infoColLastVisible } = scheduleInfoColLeftOffsets();

    const monthStaff = getStaffListForMonth(year, monthIndex);
    const adminStaff = monthStaff.filter((s) => s.isAdmin);
    const dayStaff = sortStaffByType(monthStaff.filter((s) => s.group !== "night" && !s.isAdmin));
    const nightStaff = sortStaffByType(monthStaff.filter((s) => s.group === "night" && !s.isAdmin));
    // 인원 정보 열(닉네임~결근) 하나를 그려주는 헬퍼. asTh=true면 헤더 셀(선택 가능),
    // false면 각 인원 행의 값 칸(행 선택 가능)을 만든다. 개별로 접어둔 열은 아예 마크업에서
    // 빼버린다(위 infoColCount 주석 참고) — 그래야 요약행들의 colspan 너비도 같이 맞는다.
    function infoColHtml(colDef, asTh, valueHtml, extraCls, staffId) {
      if (hideSummaryCols) {
        // 캡처용 마크업: 개별 열 숨김을 적용하지 않고 항상 그대로 그린다.
        if (colDef.summaryOnly) return "";
        const tag = asTh ? "th" : "td";
        return `<${tag} class="sch-info sch-col-${colDef.key}${extraCls ? ` ${extraCls}` : ""}">${asTh ? colDef.label : valueHtml}</${tag}>`;
      }
      if (scheduleUi.manualHiddenInfoCols.has(colDef.key)) return "";
      const tag = asTh ? "th" : "td";
      const stickyEndCls = colDef.key === infoColLastVisible ? " sch-sticky-end" : "";
      const leftStyle = ` style="left:${infoColLefts[colDef.key]}px"`;
      const selCls = asTh ? " sch-col-th" : " sch-row-th";
      const dataAttrs = asTh
        ? ` data-col-key="i:${colDef.key}" title="클릭해서 선택, 선택 후 오른쪽 클릭으로 접기"`
        : ` data-staff-id="${staffId || ""}" data-row-key="s:${staffId || ""}"`;
      return `<${tag} class="sch-info sch-col-${colDef.key}${stickyEndCls}${selCls}${extraCls ? ` ${extraCls}` : ""}"${leftStyle}${dataAttrs}>${asTh ? colDef.label : valueHtml}</${tag}>`;
    }

    const headRow1 = `<th class="sch-info" colspan="${infoColCount}"></th>` + days.map((d) => {
      const wd = new Date(year, monthIndex, d).getDay();
      const isHoliday = !!getHoliday(scheduleDateKey(year, monthIndex, d));
      const cls = wd === 6 ? "wd-sat" : (isHoliday || wd === 0) ? "wd-sun" : "";
      return `<th class="${cls}${colHiddenCls(d)} sch-col-th" data-col-key="d:${d}" title="${isHoliday ? esc(getHoliday(scheduleDateKey(year, monthIndex, d))) : "클릭해서 선택, 선택 후 오른쪽 클릭으로 접기"}">${pad2(monthIndex + 1)}/${pad2(d)}</th>`;
    }).join("");
    const headRow2 = SCHEDULE_INFO_COLS.map((c) => infoColHtml(c, true)).join("") +
      days.map((d) => {
        const wd = new Date(year, monthIndex, d).getDay();
        const isHoliday = !!getHoliday(scheduleDateKey(year, monthIndex, d));
        const cls = wd === 6 ? "wd-sat" : (isHoliday || wd === 0) ? "wd-sun" : "";
        return `<th class="${cls}${colHiddenCls(d)} sch-col-th" data-col-key="d:${d}" title="클릭해서 선택, 선택 후 오른쪽 클릭으로 접기">${WEEKDAYS[wd]}</th>`;
      }).join("");

    let scheduleRowCounter = 0; // 드래그 선택의 사각형 범위 계산에 쓰는, 렌더링될 때마다 매겨지는 행 순번
    function staffRowHtml(s) {
      const rowIdx = scheduleRowCounter++;
      const rowHiddenCls = scheduleUi.manualHiddenStaffIds.has(s.id) ? " sch-row-hidden" : "";
      const cells = days.map((d) => {
        const dateKey = scheduleDateKey(year, monthIndex, d);
        const record = getScheduleRecord(s.id, dateKey);
        const disp = scheduleCellDisplay(record);
        const memo = getScheduleMemo(s.id, dateKey);
        const memoDot = (memo && !hideMemoMarks) ? `<span class="sch-memo-dot" title="${esc(memo)}"></span>` : "";
        return `<td class="sch-cell ${disp.cls}${colHiddenCls(d)}" data-staff-id="${s.id}" data-date="${dateKey}" data-row-idx="${rowIdx}" data-day="${d}" title="${esc(memo)}">${disp.label}${memoDot}</td>`;
      }).join("");
      const counts = scheduleStaffMonthCounts(s.id, year, monthIndex);
      const infoColValues = {
        nickname: esc(s.nickname), name: esc(s.name), empno: esc(s.empNo),
        hiredate: esc(s.hireDate), workhours: esc(s.workHours),
        work: counts.WORK, off: counts.OFF, annual: counts.ANNUAL, daehyu: counts.DAEHYU, absent: counts.ABSENT,
      };
      const infoCells = SCHEDULE_INFO_COLS.map((c) => {
        const extraCls = c.key === "nickname" ? "sch-nickname" : (c.summaryOnly ? "sch-count" : "");
        return infoColHtml(c, false, infoColValues[c.key], extraCls, s.id);
      }).join("");
      return `
        <tr class="${rowHiddenCls.trim()}">
          ${infoCells}
          ${cells}
        </tr>
      `;
    }

    // 집계행(관리자 인원/필요인력/대비 등) 왼쪽 라벨 칸. rowKey가 있으면(=캡처가 아니면) 클릭해서
    // 선택 → 오른쪽 클릭으로 그 행 전체를 접을 수 있게 만든다.
    function summaryLabelCellHtml(rowKey, label) {
      if (hideSummaryCols || !rowKey) return `<td class="sch-info" colspan="${infoColCount}">${label}</td>`;
      return `<td class="sch-info sch-row-th" colspan="${infoColCount}" data-row-key="r:${esc(rowKey)}" title="클릭해서 선택, 선택 후 오른쪽 클릭으로 접기">${label}</td>`;
    }
    function summaryRowHiddenCls(rowKey) {
      return (!hideSummaryCols && rowKey && scheduleUi.manualHiddenSummaryRows.has(rowKey)) ? " sch-row-hidden" : "";
    }
    // type이 null/undefined면 업무 구분(채팅/유선)과 무관하게 목록 전체를 집계한다.
    // (관리자 인원 집계처럼 채팅/유선 구분 없이 셀 때 사용)
    function summaryRowHtml(label, staffList, type, rowKey) {
      const cells = days.map((d) => {
        const dateKey = scheduleDateKey(year, monthIndex, d);
        const count = staffList.filter((s) => (!type || (s.types || []).indexOf(type) !== -1) && scheduleCountsAsWorked(getScheduleRecord(s.id, dateKey))).length;
        return `<td class="${colHiddenCls(d).trim()}">${count}</td>`;
      }).join("");
      return `<tr class="sch-summary-row${summaryRowHiddenCls(rowKey)}">${summaryLabelCellHtml(rowKey, label)}${cells}</tr>`;
    }

    // "필요인력" 행: 사용자가 직접 숫자를 입력하는 칸(인풋). groupKey는 "DAY"/"NIGHT", type은 "채팅"/"유선".
    // 이 달이 잠겨 있으면(확정됨) 다른 스케줄 셀과 마찬가지로 입력칸 자체를 비활성화해서
    // 클릭·타이핑 자체가 안 먹게 한다. (예전에는 blur 시점에만 저장을 막아서, 입력은 계속
    // 가능해 보이는데 실제로는 저장이 안 되는 것처럼 보이는 문제가 있었다.)
    const monthLocked = scheduleIsMonthLocked(year, monthIndex);
    function requiredHeadcountRowHtml(groupKey, type, label, rowKey) {
      const cells = days.map((d) => {
        const val = getRequiredHeadcount(year, monthIndex, groupKey, type, d);
        return `<td class="sch-required-cell${colHiddenCls(d)}"><input type="number" class="sch-required-input${monthLocked ? " sch-required-input--locked" : ""}" min="0" step="1" inputmode="numeric" data-required-group="${groupKey}" data-required-type="${esc(type)}" data-required-day="${d}" value="${val === null ? "" : val}" placeholder="-"${monthLocked ? " disabled title=\"잠긴 달이에요. 잠금을 해제한 뒤 수정해주세요.\"" : ""}></td>`;
      }).join("");
      return `<tr class="sch-required-row${summaryRowHiddenCls(rowKey)}">${summaryLabelCellHtml(rowKey, label)}${cells}</tr>`;
    }
    // "대비" 행: 실제 투입 인력 - 필요인력 (필요인력을 입력하지 않은 날짜는 빈칸)
    function requiredDiffRowHtml(groupKey, type, staffList, label, rowKey) {
      const cells = days.map((d) => {
        const dateKey = scheduleDateKey(year, monthIndex, d);
        const required = getRequiredHeadcount(year, monthIndex, groupKey, type, d);
        const diff = required === null ? "" : (scheduleActualCount(staffList, type, dateKey) - required);
        return `<td class="${colHiddenCls(d).trim()}">${diff}</td>`;
      }).join("");
      return `<tr class="sch-diff-row${summaryRowHiddenCls(rowKey)}">${summaryLabelCellHtml(rowKey, label)}${cells}</tr>`;
    }
    // "인력 대비 편성" 행: 대비가 0 이상이면 O, 음수면 X (필요인력 미입력 날짜는 빈칸)
    function requiredStatusRowHtml(groupKey, type, staffList, label, rowKey) {
      const cells = days.map((d) => {
        const dateKey = scheduleDateKey(year, monthIndex, d);
        const required = getRequiredHeadcount(year, monthIndex, groupKey, type, d);
        let mark = "";
        let statusCls = "";
        if (required !== null) {
          const diff = scheduleActualCount(staffList, type, dateKey) - required;
          mark = diff >= 0 ? "O" : "X";
          statusCls = diff >= 0 ? " sch-status-ok" : " sch-status-ng";
        }
        return `<td class="${(colHiddenCls(d).trim() + statusCls).trim()}">${mark}</td>`;
      }).join("");
      return `<tr class="sch-status-row${summaryRowHiddenCls(rowKey)}">${summaryLabelCellHtml(rowKey, label)}${cells}</tr>`;
    }
    // 그룹(주간/야간)의 채팅·유선 필요인력 3행 묶음(필요인력/대비/인력 대비 편성)을 한 번에 만든다.
    function requiredHeadcountBlockHtml(groupKey, groupLabel, staffList) {
      return (
        requiredHeadcountRowHtml(groupKey, "채팅", `${groupLabel} 채팅 필요인력`, `${groupKey}·채팅·필요인력`) +
        requiredDiffRowHtml(groupKey, "채팅", staffList, "대비", `${groupKey}·채팅·대비`) +
        requiredStatusRowHtml(groupKey, "채팅", staffList, "인력 대비 편성", `${groupKey}·채팅·인력대비편성`) +
        requiredHeadcountRowHtml(groupKey, "유선", `${groupLabel} 유선 필요인력`, `${groupKey}·유선·필요인력`) +
        requiredDiffRowHtml(groupKey, "유선", staffList, "대비", `${groupKey}·유선·대비`) +
        requiredStatusRowHtml(groupKey, "유선", staffList, "인력 대비 편성", `${groupKey}·유선·인력대비편성`)
      );
    }

    function totalRowHtml(label, groups, rowKey) {
      const cells = days.map((d) => {
        const dateKey = scheduleDateKey(year, monthIndex, d);
        let total = 0;
        groups.forEach(({ staffList, type }) => {
          total += staffList.filter((s) => (s.types || []).indexOf(type) !== -1 && scheduleCountsAsWorked(getScheduleRecord(s.id, dateKey))).length;
        });
        return `<td class="${colHiddenCls(d).trim()}">${total}</td>`;
      }).join("");
      return `<tr class="sch-total-row${summaryRowHiddenCls(rowKey)}">${summaryLabelCellHtml(rowKey, label)}${cells}</tr>`;
    }

    // 행 그룹(관리자/주간/야간 등) 제목 행. 클릭하면 접히고 펼쳐지는 삼각형 토글을 함께 넣는다.
    function groupHeaderRow(key, label, isStatic) {
      const collapsed = scheduleIsRowGroupCollapsed(key);
      const toggle = `<span class="sch-row-toggle" data-toggle-row-group="${key}">${collapsed ? "▸" : "▾"}</span>`;
      const hiddenCls = summaryRowHiddenCls(key);
      const tdCls = hideSummaryCols ? "" : " sch-row-th";
      const tdAttrs = hideSummaryCols ? "" : ` data-row-key="r:${esc(key)}" title="클릭해서 선택, 선택 후 오른쪽 클릭으로 접기"`;
      return `<tr class="sch-group-row${isStatic ? " sch-group-row--static" : ""}${hiddenCls}" data-group-key="${key}"><td class="${tdCls.trim()}" colspan="${infoColCount + numDays}"${tdAttrs}>${toggle}${label}</td></tr>`;
    }
    // 소제목 행(채팅/유선/업무 구분 미지정). 부모 그룹 키에 이어 붙여서 고유 키를 만든다.
    function subGroupHeaderRow(key, label) {
      const collapsed = scheduleIsRowGroupCollapsed(key);
      const toggle = `<span class="sch-row-toggle" data-toggle-row-group="${key}">${collapsed ? "▸" : "▾"}</span>`;
      const hiddenCls = summaryRowHiddenCls(key);
      const tdCls = hideSummaryCols ? "" : " sch-row-th";
      const tdAttrs = hideSummaryCols ? "" : ` data-row-key="r:${esc(key)}" title="클릭해서 선택, 선택 후 오른쪽 클릭으로 접기"`;
      return `<tr class="sch-subgroup-row${hiddenCls}" data-group-key="${key}"><td class="${tdCls.trim()}" colspan="${infoColCount + numDays}"${tdAttrs}>${toggle}${label}</td></tr>`;
    }
    // 접힌 그룹은 제목 행만 남기고 본문(인원 행·집계 행)은 렌더링하지 않는다.
    function groupBody(key, renderFn) {
      return scheduleIsRowGroupCollapsed(key) ? "" : renderFn();
    }

    // 그룹(주간/야간) 안에서 다시 채팅 담당 → 유선 담당 순으로 소제목을 나눠 보여준다.
    function subGroupsHtml(staffList, parentKey) {
      const { chat, voice, etc } = splitByType(staffList);
      let html = "";
      if (chat.length > 0) {
        const key = `${parentKey}::CHAT`;
        html += subGroupHeaderRow(key, `채팅 (${chat.length}명)`);
        html += groupBody(key, () => chat.map(staffRowHtml).join(""));
      }
      if (voice.length > 0) {
        const key = `${parentKey}::VOICE`;
        html += subGroupHeaderRow(key, `유선 (${voice.length}명)`);
        html += groupBody(key, () => voice.map(staffRowHtml).join(""));
      }
      if (etc.length > 0) {
        const key = `${parentKey}::ETC`;
        html += subGroupHeaderRow(key, `업무 구분 미지정 (${etc.length}명)`);
        html += groupBody(key, () => etc.map(staffRowHtml).join(""));
      }
      return html;
    }

    let bodyHtml = "";
    if (filterMode === "ADMIN") {
      // "관리자 저장": 관리자로 등록된 인원만 보여준다.
      if (adminStaff.length === 0) {
        bodyHtml = `<tr><td class="sch-info sch-empty" colspan="${infoColCount + numDays}">등록된 관리자가 없어요.</td></tr>`;
      } else {
        const key = scheduleRowGroupKey(filterMode, "ADMIN");
        bodyHtml += groupHeaderRow(key, `${ICON_SHIELD} 관리자 (${adminStaff.length}명)`, true);
        bodyHtml += groupBody(key, () => adminStaff.map(staffRowHtml).join("") + summaryRowHtml("관리자 인원", adminStaff, null, "관리자"));
      }
    } else if (filterMode === "DAY" || filterMode === "NIGHT") {
      // "주간 저장" / "야간 저장": 관리자는 빼고 해당 조만 보여준다.
      const staffList = filterMode === "DAY" ? dayStaff : nightStaff;
      const groupTitle = filterMode === "DAY" ? `${ICON_SUN} 아침조 / 주간 (${staffList.length}명)` : `${ICON_MOON} 야간조 (${staffList.length}명)`;
      if (staffList.length === 0) {
        bodyHtml = `<tr><td class="sch-info sch-empty" colspan="${infoColCount + numDays}">등록된 인원이 없어요.</td></tr>`;
      } else {
        const key = scheduleRowGroupKey(filterMode, filterMode);
        bodyHtml += groupHeaderRow(key, groupTitle);
        bodyHtml += groupBody(key, () =>
          subGroupsHtml(staffList, key) + summaryRowHtml("채팅 인원", staffList, "채팅", `${filterMode}·채팅인원`) + summaryRowHtml("유선 인원", staffList, "유선", `${filterMode}·유선인원`) +
          (hideRequiredRows ? "" : requiredHeadcountBlockHtml(filterMode, filterMode === "DAY" ? "주간" : "야간", staffList))
        );
      }
    } else if (filterMode === "VOICE" || filterMode === "CHAT") {
      // "유선 저장" / "채팅 저장": 주야간은 통합하되, 캡처 안에서는 주간/야간 구획을 나눠 보여준다.
      const typeName = filterMode === "VOICE" ? "유선" : "채팅";
      const typeKey = filterMode === "VOICE" ? "voice" : "chat";
      const dayTyped = splitByType(dayStaff)[typeKey];
      const nightTyped = splitByType(nightStaff)[typeKey];
      if (dayTyped.length === 0 && nightTyped.length === 0) {
        bodyHtml = `<tr><td class="sch-info sch-empty" colspan="${infoColCount + numDays}">${typeName} 담당 인원이 없어요.</td></tr>`;
      } else {
        if (dayTyped.length > 0) {
          const key = scheduleRowGroupKey(filterMode, "DAY_TYPED");
          bodyHtml += groupHeaderRow(key, `${ICON_SUN} 주간 · ${typeName} (${dayTyped.length}명)`);
          bodyHtml += groupBody(key, () => dayTyped.map(staffRowHtml).join("") + summaryRowHtml(`${typeName} 인원`, dayTyped, typeName, `DAY_TYPED·${typeKey}`));
        }
        if (nightTyped.length > 0) {
          const key = scheduleRowGroupKey(filterMode, "NIGHT_TYPED");
          bodyHtml += groupHeaderRow(key, `${ICON_MOON} 야간 · ${typeName} (${nightTyped.length}명)`);
          bodyHtml += groupBody(key, () => nightTyped.map(staffRowHtml).join("") + summaryRowHtml(`${typeName} 인원`, nightTyped, typeName, `NIGHT_TYPED·${typeKey}`));
        }
        if (dayTyped.length > 0 && nightTyped.length > 0) {
          bodyHtml += totalRowHtml(`주/야간 총 ${typeName} 출근 인원`, [{ staffList: dayTyped, type: typeName }, { staffList: nightTyped, type: typeName }], `total·${typeKey}`);
        }
      }
    } else if (dayStaff.length === 0 && nightStaff.length === 0 && adminStaff.length === 0) {
      bodyHtml = `<tr><td class="sch-info sch-empty" colspan="${infoColCount + numDays}">등록된 인원이 없어요. "상담사 관리"에서 상담사를 등록하면 자동으로 표시돼요.</td></tr>`;
    } else {
      if (adminStaff.length > 0) {
        const key = scheduleRowGroupKey(filterMode, "ADMIN");
        bodyHtml += groupHeaderRow(key, `${ICON_SHIELD} 관리자 (${adminStaff.length}명)`, true);
        bodyHtml += groupBody(key, () => adminStaff.map(staffRowHtml).join("") + summaryRowHtml("관리자 인원", adminStaff, null, "관리자"));
      }
      if (dayStaff.length > 0) {
        const key = scheduleRowGroupKey(filterMode, "DAY");
        bodyHtml += groupHeaderRow(key, `${ICON_SUN} 아침조 / 주간 (${dayStaff.length}명)`);
        bodyHtml += groupBody(key, () =>
          subGroupsHtml(dayStaff, key) + summaryRowHtml("채팅 인원", dayStaff, "채팅", "DAY·채팅인원") + summaryRowHtml("유선 인원", dayStaff, "유선", "DAY·유선인원") +
          (hideRequiredRows ? "" : requiredHeadcountBlockHtml("DAY", "주간", dayStaff))
        );
      }
      if (nightStaff.length > 0) {
        const key = scheduleRowGroupKey(filterMode, "NIGHT");
        bodyHtml += groupHeaderRow(key, `${ICON_MOON} 야간조 (${nightStaff.length}명)`);
        bodyHtml += groupBody(key, () =>
          subGroupsHtml(nightStaff, key) + summaryRowHtml("채팅 인원", nightStaff, "채팅", "NIGHT·채팅인원") + summaryRowHtml("유선 인원", nightStaff, "유선", "NIGHT·유선인원") +
          (hideRequiredRows ? "" : requiredHeadcountBlockHtml("NIGHT", "야간", nightStaff))
        );
      }
      if (dayStaff.length > 0 && nightStaff.length > 0) {
        bodyHtml += totalRowHtml("주/야간 총 채팅 출근 인원", [{ staffList: dayStaff, type: "채팅" }, { staffList: nightStaff, type: "채팅" }], "total·채팅");
        bodyHtml += totalRowHtml("주/야간 총 유선 출근 인원", [{ staffList: dayStaff, type: "유선" }, { staffList: nightStaff, type: "유선" }], "total·유선");
      }
    }

    return `
      <table class="schedule-table">
        <thead>
          <tr>${headRow1}</tr>
          <tr>${headRow2}</tr>
        </thead>
        <tbody>${bodyHtml}</tbody>
      </table>
    `;
  }


  // 화면의 월별 스케줄 표와 같은 내용을 엑셀(.xlsx) 파일로 내려받는다.
  // HTML 표를 그대로 파싱하지 않고, 표를 만들 때 쓰는 것과 같은 데이터를
  // 다시 조립해서 셀 값(라벨 텍스트)을 그대로 넣는다.
  // 1-based 열 번호 -> 엑셀 열 문자(A, B, ..., Z, AA, ...)
  function scheduleColLetter(n) {
    let s = "";
    while (n > 0) {
      const rem = (n - 1) % 26;
      s = String.fromCharCode(65 + rem) + s;
      n = Math.floor((n - 1) / 26);
    }
    return s;
  }

  // 월별 스케줄 표를 엑셀(.xlsx)로 내려받는다.
  // - 화면(월별 스케줄 표)에 실제 적용 중인 색을 그대로 읽어와 상태별 셀 배경에 입혀서
  //   전체/관리자/주간/야간/유선/채팅 구분이 눈에 잘 들어오게 한다.
  // - 근무/오프/연차/대휴/결근 합계, 채팅·유선·관리자 인원 집계, 주야간 합계는 값이 아니라
  //   COUNTIF·합계 수식으로 넣어서, 엑셀에서 날짜 칸을 직접 고쳐도 합계가 자동으로 다시 계산된다.
  async function exportScheduleToExcel() {
    if (typeof ExcelJS === "undefined") {
      flashScheduleStatus("엑셀 변환 기능을 불러오지 못했어요. 인터넷 연결을 확인해주세요.");
      return;
    }
    const btn = document.getElementById("sch-excel-btn");
    if (btn) { btn.disabled = true; btn.textContent = "엑셀 생성 중..."; }

    try {
      const { year, monthIndex } = scheduleUi;
      const numDays = scheduleDaysInMonth(year, monthIndex);
      const days = [];
      for (let d = 1; d <= numDays; d++) days.push(d);
      const infoCols = 10;
      const totalCols = infoCols + numDays;

      const monthStaff = getStaffListForMonth(year, monthIndex);
      const adminStaff = monthStaff.filter((s) => s.isAdmin);
      const dayStaff = sortStaffByType(monthStaff.filter((s) => s.group !== "night" && !s.isAdmin));
      const nightStaff = sortStaffByType(monthStaff.filter((s) => s.group === "night" && !s.isAdmin));

      // 엑셀은 화면 밖에서(인쇄·공유 등) 보는 경우가 많으므로, 현재 켜둔 화면 테마(다크 등)와
      // 상관없이 항상 밝고 차분한 "보고용" 팔레트를 쓴다. 상태별 배경은 화면 월별 스케줄 표와
      // 같은 색을 옅게(흰 배경에 얹은 배지색) 넣고, 글자는 그 진한 원색을 써서 어떤 색인지는
      // 한눈에 들어오되 셀 전체가 원색으로 칠해지지 않게 한다.
      const blendWithWhite = (hex, alpha) => {
        const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
        const a = alpha / 255;
        const mix = (c) => Math.round(c * a + 255 * (1 - a)).toString(16).padStart(2, "0").toUpperCase();
        return mix(r) + mix(g) + mix(b);
      };
      const solid = (hex) => "FF" + hex;
      const pastel = (hex, alpha) => "FF" + blendWithWhite(hex, alpha || 0x26);

      const COLOR = {
        header: solid("EEF0F3"),
        headerText: solid("4D5057"),
        group: solid("E4E6EA"),
        groupText: solid("6C4FC2"),
        subgroup: solid("F2F3F5"),
        subgroupText: solid("5B5E66"),
        summary: solid("FAFBFC"),
        summaryText: solid("5B5E66"),
        total: pastel("6C4FC2", 0x30),
        totalText: solid("3D2E70"),
        border: solid("DEE1E6"),
        nickname: solid("24262B"),
        requiredBg: pastel("3778B0", 0x22),
        requiredText: solid("3D2E70"),
        statusOkText: solid("2C7F96"),
        statusNgText: solid("C94F4F"),
      };
      // 월별 스케줄 표의 범례와 같은 상태별 색(배경은 옅게, 글자는 진하게)
      const STATUS_BASE = {
        "오프": "3778B0",
        "연차": "B9791E",
        "대휴": "2C7F96",
        "반차": "C2603F",
        "공휴": "227D75",
        "공가": "7454B5",
        "육휴": "B5548F",
        "특휴": "A554B6",
        "교육": "2F9E63",
        "지각": "8A6A1F",
        "결근": "C94F4F",
      };
      const STATUS_FILL = {};
      const STATUS_TEXT = {};
      Object.keys(STATUS_BASE).forEach((label) => {
        STATUS_FILL[label] = pastel(STATUS_BASE[label]);
        STATUS_TEXT[label] = solid(STATUS_BASE[label]);
      });
      STATUS_FILL["퇴사"] = solid("E4E6EA");
      STATUS_TEXT["퇴사"] = solid("7C7D84");

      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet(`${year}년 ${monthIndex + 1}월`, {
        views: [{ state: "frozen", xSplit: infoCols, ySplit: 2, showGridLines: false }],
      });
      ws.columns = [
        { width: 12 }, { width: 8 }, { width: 10 }, { width: 11 }, { width: 12 },
        { width: 6 }, { width: 6 }, { width: 6 }, { width: 6 }, { width: 6 },
      ].concat(days.map(() => ({ width: 5 })));

      const thinBorder = { style: "thin", color: { argb: COLOR.border } };
      function applyBorder(cell) {
        cell.border = { top: thinBorder, left: thinBorder, bottom: thinBorder, right: thinBorder };
      }

      // 1행: 날짜, 2행: 항목명 · 요일
      const row1Vals = new Array(infoCols).fill("");
      days.forEach((d) => row1Vals.push(`${pad2(monthIndex + 1)}/${pad2(d)}`));
      const row1 = ws.addRow(row1Vals);
      ws.mergeCells(1, 1, 1, infoCols);

      const row2Vals = ["닉네임", "이름", "사번", "입사일자", "근무시간", "근무", "오프", "연차", "대휴", "결근"];
      days.forEach((d) => {
        const wd = new Date(year, monthIndex, d).getDay();
        row2Vals.push(WEEKDAYS[wd]);
      });
      const row2 = ws.addRow(row2Vals);

      // 화면의 월별 스케줄 표와 같은 기준(토=파랑, 일/공휴일=빨강)으로 날짜 열 글자색을 정한다.
      const dateColColor = days.map((d) => {
        const wd = new Date(year, monthIndex, d).getDay();
        const isHoliday = !!getHoliday(scheduleDateKey(year, monthIndex, d));
        if (wd === 6) return solid("3778B0");
        if (isHoliday || wd === 0) return solid("C94F4F");
        return null;
      });

      [row1, row2].forEach((row) => {
        for (let c = 1; c <= totalCols; c++) {
          const cell = row.getCell(c);
          const dateColor = c > infoCols ? dateColColor[c - infoCols - 1] : null;
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.header } };
          cell.font = { color: { argb: dateColor || COLOR.headerText }, bold: true };
          cell.alignment = { horizontal: "center", vertical: "middle" };
          applyBorder(cell);
        }
      });

      function addLabelRow(label, kind) {
        const row = ws.addRow([label]);
        ws.mergeCells(row.number, 1, row.number, totalCols);
        const fill = kind === "subgroup" ? COLOR.subgroup : COLOR.group;
        const textColor = kind === "subgroup" ? COLOR.subgroupText : COLOR.groupText;
        for (let c = 1; c <= totalCols; c++) {
          const cell = row.getCell(c);
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: fill } };
          cell.font = { color: { argb: textColor }, bold: kind !== "subgroup" };
          cell.alignment = { horizontal: "left", vertical: "middle" };
          applyBorder(cell);
        }
        return row.number;
      }

      function addStaffRow(s) {
        const rowValues = new Array(totalCols).fill("");
        rowValues[0] = s.nickname || "";
        rowValues[1] = s.name || "";
        rowValues[2] = s.empNo || "";
        rowValues[3] = s.hireDate || "";
        rowValues[4] = s.workHours || "";
        const labels = days.map((d) => {
          const dateKey = scheduleDateKey(year, monthIndex, d);
          return scheduleCellDisplay(getScheduleRecord(s.id, dateKey)).label;
        });
        labels.forEach((label, i) => { rowValues[infoCols + i] = label; });

        const row = ws.addRow(rowValues);
        const r = row.number;
        const rangeRef = `${scheduleColLetter(infoCols + 1)}${r}:${scheduleColLetter(infoCols + numDays)}${r}`;
        // 근무=WORK(라벨 "1")+지각, 연차/대휴/결근은 해당 라벨 개수를 그대로 센다.
        // 오프는 화면 집계(scheduleStaffMonthCounts)와 동일하게 오프뿐 아니라
        // 대휴·공휴·육휴·특휴까지 모두 포함해서 센다. (대휴는 별도 열에도 단독 표시됨)
        row.getCell(6).value = { formula: `COUNTIF(${rangeRef},"1")+COUNTIF(${rangeRef},"지각")` };
        row.getCell(7).value = { formula: `COUNTIF(${rangeRef},"오프")+COUNTIF(${rangeRef},"대휴")+COUNTIF(${rangeRef},"공휴")+COUNTIF(${rangeRef},"육휴")+COUNTIF(${rangeRef},"특휴")` };
        row.getCell(8).value = { formula: `COUNTIF(${rangeRef},"연차")` };
        row.getCell(9).value = { formula: `COUNTIF(${rangeRef},"대휴")` };
        row.getCell(10).value = { formula: `COUNTIF(${rangeRef},"결근")` };

        for (let c = 1; c <= totalCols; c++) applyBorder(row.getCell(c));
        row.getCell(1).font = { bold: true, color: { argb: COLOR.nickname } };
        row.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
        for (let c = 2; c <= 5; c++) row.getCell(c).alignment = { horizontal: "left", vertical: "middle" };
        for (let c = 6; c <= 10; c++) row.getCell(c).alignment = { horizontal: "center", vertical: "middle" };

        labels.forEach((label, i) => {
          const cell = row.getCell(infoCols + 1 + i);
          cell.alignment = { horizontal: "center", vertical: "middle" };
          const fillArgb = STATUS_FILL[label];
          if (fillArgb) {
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: fillArgb } };
            cell.font = { bold: label === "지각" || label === "결근", color: { argb: STATUS_TEXT[label] || COLOR.nickname } };
          }
          // 화면에서 남긴 셀 메모는 엑셀에서 "메모(노트)"로 그대로 들어간다 (셀에 빨간 삼각형 표시,
          // 마우스를 올리면 내용이 보임). 이미지 저장(html2canvas 캡처)과 달리 엑셀에는 항상 반영된다.
          const dayNum = days[i];
          const memo = getScheduleMemo(s.id, scheduleDateKey(year, monthIndex, dayNum));
          if (memo) {
            cell.note = { texts: [{ text: memo }], margins: { insetmode: "auto" } };
          }
        });
        return r;
      }

      // rowRanges: [{start,end}, ...] 연속된 행 구간들을 그대로 더한다. 구간이 없으면(해당
      // 업무 구분 인원이 0명) 수식 대신 0을 넣는다.
      function addSummaryRow(label, rowRanges) {
        const row = ws.addRow([label]);
        ws.mergeCells(row.number, 1, row.number, infoCols);
        days.forEach((d, i) => {
          const col = infoCols + 1 + i;
          const colL = scheduleColLetter(col);
          const cell = row.getCell(col);
          if (rowRanges.length === 0) {
            cell.value = 0;
          } else {
            const parts = rowRanges.map(({ start, end }) => `COUNTIF(${colL}${start}:${colL}${end},"1")+COUNTIF(${colL}${start}:${colL}${end},"지각")`);
            cell.value = { formula: parts.join("+") };
          }
        });
        for (let c = 1; c <= totalCols; c++) {
          const cell = row.getCell(c);
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.summary } };
          cell.font = { color: { argb: COLOR.summaryText } };
          cell.alignment = { horizontal: "center", vertical: "middle" };
          applyBorder(cell);
        }
        return row.number;
      }

      // summaryRowNums: 같은 날짜 열끼리 더할 위쪽 요약행들의 행 번호
      function addTotalRow(label, summaryRowNums) {
        const row = ws.addRow([label]);
        ws.mergeCells(row.number, 1, row.number, infoCols);
        days.forEach((d, i) => {
          const col = infoCols + 1 + i;
          const colL = scheduleColLetter(col);
          row.getCell(col).value = { formula: summaryRowNums.map((rn) => `${colL}${rn}`).join("+") };
        });
        for (let c = 1; c <= totalCols; c++) {
          const cell = row.getCell(c);
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.total } };
          cell.font = { color: { argb: COLOR.totalText }, bold: true };
          cell.alignment = { horizontal: "center", vertical: "middle" };
          applyBorder(cell);
        }
        return row.number;
      }

      // "필요인력" 행: 화면에서 사용자가 직접 입력한 숫자를 그대로 값으로 넣는다(입력 안 한 날짜는 빈칸).
      function addRequiredHeadcountRow(groupKey, type, label) {
        const row = ws.addRow([label]);
        ws.mergeCells(row.number, 1, row.number, infoCols);
        days.forEach((d, i) => {
          const col = infoCols + 1 + i;
          const val = getRequiredHeadcount(year, monthIndex, groupKey, type, d);
          if (val !== null) row.getCell(col).value = val;
        });
        for (let c = 1; c <= totalCols; c++) {
          const cell = row.getCell(c);
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.requiredBg } };
          cell.font = { color: { argb: COLOR.requiredText } };
          cell.alignment = { horizontal: "center", vertical: "middle" };
          applyBorder(cell);
        }
        return row.number;
      }
      // "대비" 행: 실제 투입 인력 - 필요인력(위 요약행의 COUNTIF 수식을 그대로 참조).
      // 필요인력 칸이 비어 있으면 빈칸을 유지하는 수식(IF)으로 넣어, 엑셀에서 값을 고쳐도 다시 계산된다.
      function addRequiredDiffRow(label, requiredRowNum, summaryRowNum) {
        const row = ws.addRow([label]);
        ws.mergeCells(row.number, 1, row.number, infoCols);
        days.forEach((d, i) => {
          const col = infoCols + 1 + i;
          const colL = scheduleColLetter(col);
          row.getCell(col).value = { formula: `IF(${colL}${requiredRowNum}="","",${colL}${summaryRowNum}-${colL}${requiredRowNum})` };
        });
        for (let c = 1; c <= totalCols; c++) {
          const cell = row.getCell(c);
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.summary } };
          cell.font = { color: { argb: COLOR.summaryText } };
          cell.alignment = { horizontal: "center", vertical: "middle" };
          applyBorder(cell);
        }
        return row.number;
      }
      // "인력 대비 편성" 행: 대비가 0 이상이면 O, 음수면 X, 필요인력 미입력 날짜는 빈칸.
      // computeMark는 셀 글자색(O=녹색/X=빨강)을 정하기 위해 화면과 같은 방식으로 미리 계산한 값이고,
      // 실제 셀 값은 수식으로 넣어 엑셀에서 원본 데이터를 고치면 자동으로 다시 계산된다.
      function addRequiredStatusRow(label, groupKey, type, staffList, requiredRowNum, summaryRowNum) {
        const row = ws.addRow([label]);
        ws.mergeCells(row.number, 1, row.number, infoCols);
        days.forEach((d, i) => {
          const col = infoCols + 1 + i;
          const colL = scheduleColLetter(col);
          row.getCell(col).value = { formula: `IF(${colL}${requiredRowNum}="","",IF(${colL}${summaryRowNum}-${colL}${requiredRowNum}>=0,"O","X"))` };
          const required = getRequiredHeadcount(year, monthIndex, groupKey, type, d);
          const cell = row.getCell(col);
          if (required !== null) {
            const dateKey = scheduleDateKey(year, monthIndex, d);
            const diff = scheduleActualCount(staffList, type, dateKey) - required;
            cell.font = { bold: true, color: { argb: diff >= 0 ? COLOR.statusOkText : COLOR.statusNgText } };
          }
        });
        for (let c = 1; c <= totalCols; c++) {
          const cell = row.getCell(c);
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.summary } };
          if (!cell.font) cell.font = { color: { argb: COLOR.summaryText } };
          cell.alignment = { horizontal: "center", vertical: "middle" };
          applyBorder(cell);
        }
        return row.number;
      }
      // 그룹(주간/야간)의 채팅·유선 필요인력 3행 묶음(필요인력/대비/인력 대비 편성)을 한 번에 만든다.
      // chatSummaryRowNum·voiceSummaryRowNum은 위에서 이미 만든 "채팅 인원"/"유선 인원" 요약행 번호.
      function addRequiredHeadcountBlock(groupKey, groupLabel, staffList, chatSummaryRowNum, voiceSummaryRowNum) {
        const chatReqRow = addRequiredHeadcountRow(groupKey, "채팅", `${groupLabel} 채팅 필요인력`);
        addRequiredDiffRow("대비", chatReqRow, chatSummaryRowNum);
        addRequiredStatusRow("인력 대비 편성", groupKey, "채팅", staffList, chatReqRow, chatSummaryRowNum);
        const voiceReqRow = addRequiredHeadcountRow(groupKey, "유선", `${groupLabel} 유선 필요인력`);
        addRequiredDiffRow("대비", voiceReqRow, voiceSummaryRowNum);
        addRequiredStatusRow("인력 대비 편성", groupKey, "유선", staffList, voiceReqRow, voiceSummaryRowNum);
      }

      // staffList를 채팅/유선/미지정 순으로 나눠 행을 쓰고, 채팅·유선 각각의(연속된) 행
      // 범위를 돌려준다. 요약행 수식이 이 범위를 그대로 참조하므로 화면 표와 항상 일치한다.
      function addSubGroups(staffList) {
        const { chat, voice, etc } = splitByType(staffList);
        const ranges = {};
        if (chat.length > 0) {
          addLabelRow(`채팅 (${chat.length}명)`, "subgroup");
          const start = ws.rowCount + 1;
          chat.forEach(addStaffRow);
          ranges.chat = { start, end: ws.rowCount };
        }
        if (voice.length > 0) {
          addLabelRow(`유선 (${voice.length}명)`, "subgroup");
          const start = ws.rowCount + 1;
          voice.forEach(addStaffRow);
          ranges.voice = { start, end: ws.rowCount };
        }
        if (etc.length > 0) {
          addLabelRow(`업무 구분 미지정 (${etc.length}명)`, "subgroup");
          etc.forEach(addStaffRow);
        }
        return ranges;
      }

      if (dayStaff.length === 0 && nightStaff.length === 0 && adminStaff.length === 0) {
        addLabelRow("등록된 인원이 없어요.");
      } else {
        let dayChatSummaryRow = null, dayVoiceSummaryRow = null;
        let nightChatSummaryRow = null, nightVoiceSummaryRow = null;

        if (adminStaff.length > 0) {
          addLabelRow(`관리자 (${adminStaff.length}명)`);
          const start = ws.rowCount + 1;
          adminStaff.forEach(addStaffRow);
          addSummaryRow("관리자 인원", [{ start, end: ws.rowCount }]);
        }
        if (dayStaff.length > 0) {
          addLabelRow(`아침조 / 주간 (${dayStaff.length}명)`);
          const ranges = addSubGroups(dayStaff);
          dayChatSummaryRow = addSummaryRow("채팅 인원", ranges.chat ? [ranges.chat] : []);
          dayVoiceSummaryRow = addSummaryRow("유선 인원", ranges.voice ? [ranges.voice] : []);
          addRequiredHeadcountBlock("DAY", "주간", dayStaff, dayChatSummaryRow, dayVoiceSummaryRow);
        }
        if (nightStaff.length > 0) {
          addLabelRow(`야간조 (${nightStaff.length}명)`);
          const ranges = addSubGroups(nightStaff);
          nightChatSummaryRow = addSummaryRow("채팅 인원", ranges.chat ? [ranges.chat] : []);
          nightVoiceSummaryRow = addSummaryRow("유선 인원", ranges.voice ? [ranges.voice] : []);
          addRequiredHeadcountBlock("NIGHT", "야간", nightStaff, nightChatSummaryRow, nightVoiceSummaryRow);
        }
        if (dayStaff.length > 0 && nightStaff.length > 0) {
          addTotalRow("주/야간 총 채팅 출근 인원", [dayChatSummaryRow, nightChatSummaryRow]);
          addTotalRow("주/야간 총 유선 출근 인원", [dayVoiceSummaryRow, nightVoiceSummaryRow]);
        }
      }

      // 셀마다 색상·굵기 등은 이미 위에서 개별로 지정했으므로, 그 속성은 그대로 두고
      // 폰트 크기만 기본 10으로 통일해준다.
      ws.eachRow((row) => {
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.font = Object.assign({}, cell.font, { size: 10 });
        });
      });

      const buffer = await wb.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `월별상담사스케줄_${year}${pad2(monthIndex + 1)}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
      flashScheduleStatus("엑셀 파일을 다운로드했어요.");
    } catch (err) {
      console.error(err);
      flashScheduleStatus("엑셀 파일을 만들지 못했어요.");
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = ICON_CHART + " 엑셀로 다운로드"; }
    }
  }

  // buildScheduleTableHtml의 filterMode와 같은 기준으로, 캡처 대상 인원만 골라
  // "이번 달 지각·결근 기록"도 캡처된 표 안의 인원과 항상 일치하도록 한다.
  function scheduleLogStaffForFilter(monthStaff, filterMode) {
    if (!filterMode) return monthStaff;
    if (filterMode === "ADMIN") return monthStaff.filter((s) => s.isAdmin);
    const nonAdmin = monthStaff.filter((s) => !s.isAdmin);
    if (filterMode === "DAY") return nonAdmin.filter((s) => s.group !== "night");
    if (filterMode === "NIGHT") return nonAdmin.filter((s) => s.group === "night");
    if (filterMode === "VOICE") return nonAdmin.filter((s) => (s.types || []).indexOf("유선") !== -1);
    if (filterMode === "CHAT") return nonAdmin.filter((s) => (s.types || []).indexOf("채팅") !== -1);
    return monthStaff;
  }

  function buildScheduleLogHtml(filterMode) {
    const { year, monthIndex } = scheduleUi;
    const numDays = scheduleDaysInMonth(year, monthIndex);
    const monthStaff = scheduleLogStaffForFilter(getStaffListForMonth(year, monthIndex), filterMode);
    const entries = [];
    for (let d = 1; d <= numDays; d++) {
      const dateKey = scheduleDateKey(year, monthIndex, d);
      monthStaff.forEach((s) => {
        const rec = scheduleData.records[scheduleRecordKey(s.id, dateKey)];
        if (rec && rec.attendance) {
          entries.push({ dateKey, d, staff: s, attendance: rec.attendance });
        }
      });
    }
    if (entries.length === 0) {
      return `<div class="agent-list-empty">이번 달에는 등록된 지각·결근 기록이 없어요.</div>`;
    }
    const items = entries.map((e) => {
      const tagCls = e.attendance === "LATE" ? "late" : "absent";
      const tagLabel = e.attendance === "LATE" ? "지각" : "결근";
      return `
        <div class="sch-log-item">
          <span class="sch-log-date">${pad2(monthIndex + 1)}/${pad2(e.d)}</span>
          <span class="sch-log-name">${esc(e.staff.nickname)} · ${esc(e.staff.name)}</span>
          <span class="sch-log-tag ${tagCls}">${tagLabel}</span>
          <button class="sch-staff-btn sch-log-clear" data-action="clear-sch-attendance" data-staff-id="${e.staff.id}" data-date="${e.dateKey}">되돌리기</button>
        </div>
      `;
    }).join("");
    return `<div class="sch-log-list">${items}</div>`;
  }

  function syncScheduleLogWidth() {
    const tableWrap = document.querySelector("#schedule-table-area .schedule-table-wrap");
    const logArea = document.getElementById("schedule-log-area");
    if (!tableWrap || !logArea) return;
    const w = tableWrap.offsetWidth;
    if (w > 0) {
      logArea.style.width = `${w}px`;
      logArea.style.maxWidth = "100%";
    }
  }

  // 메인 페이지의 월별 스케줄 표는 가로 스크롤 없이 항상 한 화면에 다 보이도록,
  // 표를 원래 크기로 그린 뒤 폭에 맞춰 JS로 축소(scale)한다.
  function fitScheduleTable() {
    const wrap = document.querySelector("#schedule-table-area .schedule-table-wrap");
    const inner = wrap ? wrap.querySelector(".schedule-scale-inner") : null;
    const table = inner ? inner.querySelector("table") : null;
    if (!wrap || !inner || !table) return;
    inner.style.transform = "none";
    inner.style.width = "auto";
    inner.style.height = "auto";
    wrap.style.height = "auto";
    // 모바일 화면을 포함해 모든 화면 폭에서, 표를 좌우로 밀어서(가로 스크롤) 봐야 하는 일이
    // 없도록 항상 화면 폭에 맞춰 축소한다. 인원이 많거나 화면이 아주 좁으면 글씨가 작아질 수
    // 있지만(핀치 확대는 가능), 좌우 스와이프 없이 표 전체가 한 화면에 들어오는 쪽을 우선한다.
    const naturalW = table.offsetWidth;
    const naturalH = table.offsetHeight;
    const availW = wrap.clientWidth;
    if (naturalW <= 0 || availW <= 0) return;
    const scale = Math.min(availW / naturalW, 1);
    const offsetX = Math.max(0, (availW - naturalW * scale) / 2);
    inner.style.width = `${naturalW}px`;
    inner.style.height = `${naturalH}px`;
    inner.style.transform = `translateX(${offsetX}px) scale(${scale})`;
    wrap.style.height = `${naturalH * scale}px`;
  }

  // wrap의 너비를 안정적으로 관찰해서, 폰트 늦게 로드/레이아웃 지연/화면 회전 등
  // 어떤 이유로 폭이 나중에 바뀌더라도 항상 다시 맞춤 계산되도록 한다.
  // (단순 window resize 이벤트만으로는 컨테이너 폭만 바뀌는 경우를 놓칠 수 있음)
  let _scheduleFitObserver = null;
  function watchScheduleTableSize() {
    const wrap = document.querySelector("#schedule-table-area .schedule-table-wrap");
    if (!wrap) return;
    if (_scheduleFitObserver) _scheduleFitObserver.disconnect();
    if (typeof ResizeObserver === "undefined") return;
    let lastW = 0;
    _scheduleFitObserver = new ResizeObserver((entries) => {
      const w = entries[0] && entries[0].contentRect ? entries[0].contentRect.width : 0;
      if (Math.abs(w - lastW) < 1) return;
      lastW = w;
      fitScheduleTable();
      syncScheduleLogWidth();
    });
    _scheduleFitObserver.observe(wrap);
  }

  function updateScheduleTableArea() {
    const tableArea = document.getElementById("schedule-table-area");
    const logArea = document.getElementById("schedule-log-area");
    if (tableArea) {
      tableArea.innerHTML = `<div class="schedule-table-wrap"><div class="schedule-scale-inner">${buildScheduleTableHtml()}</div></div>`;
      attachScheduleTableHandlers(tableArea);
    }
    if (logArea) {
      logArea.innerHTML = buildScheduleLogHtml();
      attachScheduleLogHandlers(logArea);
    }
    fitScheduleTable();
    syncScheduleLogWidth();
    watchScheduleTableSize();
  }

  // 월별 스케줄 표를 통째로 PNG 이미지로 캡처해서 다운로드한다.
  // 화면에 보이는 축소된 표 대신, 화면 밖에 원본 크기 그대로 다시 그려서 캡처하기 때문에
  // 화면 크기와 상관없이 항상 선명하고 잘리지 않은 이미지가 만들어진다.
  // 캡처 이미지의 배경/글자/범례 색은 하드코딩하지 않고, 캡처하는 시점에 실제 적용 중인
  // 다크모드/라이트모드 색상 변수를 그대로 읽어와 사용한다. (라이트모드에서 캡처해도
  // 검은 배경으로 나오지 않고, 현재 화면과 같은 톤으로 저장됨)
  // mode: "ALL"(기본, 전체) / "DAY"(주간) / "NIGHT"(야간) / "VOICE"(유선, 주야간 통합)
  // / "CHAT"(채팅, 주야간 통합). buildScheduleTableHtml·buildScheduleLogHtml에는
  // "ALL"일 때만 filterMode 없이(undefined) 넘겨서 지금까지와 완전히 같은 전체 표를 유지한다.
  function captureSchedulePage(mode) {
    const captureMode = mode || "ALL";
    const modeMeta = SCHEDULE_CAPTURE_MODES.find((m) => m.key === captureMode) || SCHEDULE_CAPTURE_MODES[0];
    const modeName = modeMeta.label.replace(/ 저장$/, "");
    const tableFilter = captureMode === "ALL" ? undefined : captureMode;
    const btn = document.getElementById("sch-capture-btn");
    if (typeof html2canvas === "undefined") {
      flashScheduleStatus("캡처 기능을 불러오지 못했어요 (인터넷 연결 확인)");
      return;
    }
    if (btn) { btn.disabled = true; btn.textContent = "이미지 생성 중..."; }

    const cs = getComputedStyle(document.documentElement);
    const themeColor = (name) => cs.getPropertyValue(name).trim();
    const cBg = themeColor("--bg");
    const cText = themeColor("--text");
    const cTextDim = themeColor("--text-dim");
    const cBlue = themeColor("--blue");
    const cOrange = themeColor("--orange");
    const cGreen = themeColor("--green");
    const cSalmon = themeColor("--salmon");
    const cTeal = themeColor("--teal");
    const cPurple = themeColor("--purple");
    const cPink = themeColor("--pink");
    const cIndigo = themeColor("--indigo");
    const cEdu = themeColor("--edu");
    const cYellow = themeColor("--yellow");
    const cRed = themeColor("--red");
    const cFaint = themeColor("--text-faint");

    const wrapper = document.createElement("div");
    wrapper.className = "sch-capture-flatten";
    wrapper.style.position = "fixed";
    wrapper.style.left = "-99999px";
    wrapper.style.top = "0";
    wrapper.style.background = cBg;
    wrapper.style.padding = "28px";
    wrapper.style.fontFamily = "'KoPub Dotum', system-ui, sans-serif";
    wrapper.style.color = cText;
    wrapper.style.width = "fit-content";
    wrapper.style.maxWidth = "none";
    wrapper.style.overflow = "visible";
    const lockedTag = scheduleIsMonthLocked(scheduleUi.year, scheduleUi.monthIndex) ? " · 확정됨" : "";
    const titleSuffix = captureMode === "ALL" ? "" : ` · ${modeName}`;
    wrapper.innerHTML = `
      <div style="font-size:22px;margin-bottom:4px;color:${cText};">월별 스케줄${titleSuffix}</div>
      <div style="font-size:15px;color:${cTextDim};margin-bottom:16px;">${esc(scheduleMonthLabel())}${lockedTag} · 캡처일 ${esc(todayISO())}</div>
      <div class="schedule-legend" style="margin-bottom:14px;">
        <span class="item"><span class="swatch" style="background:${cBlue};"></span>오프</span>
        <span class="item"><span class="swatch" style="background:${cOrange};"></span>연차</span>
        <span class="item"><span class="swatch" style="background:${cGreen};"></span>대휴</span>
        <span class="item"><span class="swatch" style="background:${cSalmon};"></span>반차</span>
        <span class="item"><span class="swatch" style="background:${cTeal};"></span>공휴</span>
        <span class="item"><span class="swatch" style="background:${cPurple};"></span>공가</span>
        <span class="item"><span class="swatch" style="background:${cPink};"></span>육휴</span>
        <span class="item"><span class="swatch" style="background:${cIndigo};"></span>특휴</span>
        <span class="item"><span class="swatch" style="background:${cEdu};"></span>교육</span>
        <span class="item"><span class="swatch" style="background:${cYellow};"></span>지각</span>
        <span class="item"><span class="swatch" style="background:${cRed};"></span>결근</span>
        <span class="item"><span class="swatch" style="background:${cFaint};"></span>퇴사</span>
      </div>
      ${buildScheduleTableHtml(tableFilter, true, true, true)}
    `;
    document.body.appendChild(wrapper);

    function cleanup(label) {
      if (wrapper.parentNode) document.body.removeChild(wrapper);
      if (btn) { btn.disabled = false; btn.innerHTML = ICON_CAMERA + " 이미지로 저장 ▾"; }
      if (label) flashScheduleStatus(label);
    }

    requestAnimationFrame(() => {
      try {
        const fullW = wrapper.scrollWidth;
        const fullH = wrapper.scrollHeight;
        html2canvas(wrapper, {
          backgroundColor: cBg,
          scale: 2,
          width: fullW,
          height: fullH,
          windowWidth: fullW,
          windowHeight: fullH,
        }).then((canvas) => {
          const fileSuffix = captureMode === "ALL" ? "" : `_${modeName}`;
          const filename = `상담사_스케줄${fileSuffix}_${scheduleUi.year}-${pad2(scheduleUi.monthIndex + 1)}.png`;
          const dataUrl = canvas.toDataURL("image/png");
          cleanup("");
          openSchedulePreview(dataUrl, filename, captureMode === "ALL" ? null : modeName);
        }).catch((err) => {
          console.error(err);
          cleanup("캡처 실패");
        });
      } catch (err) {
        // html2canvas를 부르기 전 단계에서 예외가 나도 버튼이 "이미지 생성 중..."에
        // 영원히 멈춰있지 않도록 여기서도 반드시 정리한다.
        console.error(err);
        cleanup("캡처 실패");
      }
    });
  }

  function closeScheduleMenu() {
    const existing = document.getElementById("sch-menu");
    if (existing) existing.remove();
    document.removeEventListener("mousedown", scheduleMenuOutsideHandler, true);
    scheduleClearSelection();
  }
  function scheduleMenuOutsideHandler(e) {
    const menu = document.getElementById("sch-menu");
    if (menu && !menu.contains(e.target)) closeScheduleMenu();
  }
  // ----- 스케줄 셀 드래그로 여러 칸 선택 후 한 번에 상태 적용 -----
  // 마우스로 셀을 누른 채 다른 셀 위로 드래그하면(행·열 사각형 범위) 선택되고,
  // 뗄 때 상태 선택 메뉴가 한 번만 뜬다. 드래그 없이 그냥 클릭하면 기존처럼
  // 그 칸 하나만 다루는 메뉴(openScheduleMenu)가 뜬다.
  let scheduleSelectDragging = false;
  let scheduleSelectMoved = false;
  let scheduleSelectAnchor = null; // { rowIdx, day }
  let scheduleSelectCurrent = null; // { rowIdx, day }

  function scheduleSelectionRectCells(root, anchor, current) {
    if (!root || !anchor || !current) return [];
    const minRow = Math.min(anchor.rowIdx, current.rowIdx);
    const maxRow = Math.max(anchor.rowIdx, current.rowIdx);
    const minDay = Math.min(anchor.day, current.day);
    const maxDay = Math.max(anchor.day, current.day);
    return Array.from(root.querySelectorAll(".sch-cell")).filter((cell) => {
      const rowIdx = Number(cell.getAttribute("data-row-idx"));
      const day = Number(cell.getAttribute("data-day"));
      return rowIdx >= minRow && rowIdx <= maxRow && day >= minDay && day <= maxDay;
    });
  }
  function scheduleApplySelectionHighlight() {
    const root = document.getElementById("schedule-table-area");
    if (!root) return;
    const selected = new Set(scheduleSelectionRectCells(root, scheduleSelectAnchor, scheduleSelectCurrent));
    root.querySelectorAll(".sch-cell").forEach((cell) => {
      cell.classList.toggle("sch-cell--selected", selected.has(cell));
    });
  }
  function scheduleClearSelection() {
    scheduleSelectDragging = false;
    scheduleSelectMoved = false;
    scheduleSelectAnchor = null;
    scheduleSelectCurrent = null;
    const root = document.getElementById("schedule-table-area");
    if (root) root.querySelectorAll(".sch-cell--selected").forEach((cell) => cell.classList.remove("sch-cell--selected"));
  }
  // 선택된 여러 칸에 상태를 한 번에 적용한다. 칸마다 저장하지 않고 한 번만 저장/동기화한다.
  function scheduleApplyBulk(cells, patch) {
    if (cells.length) recordUndo(`셀 ${cells.length}개 일괄 변경`, SCHEDULE_KEY, reloadScheduleData);
    cells.forEach((cell) => {
      const staffId = cell.getAttribute("data-staff-id");
      const dateKey = cell.getAttribute("data-date");
      const key = scheduleRecordKey(staffId, dateKey);
      const cur = scheduleData.records[key] || { status: "WORK", attendance: null };
      const next = Object.assign({}, cur, patch);
      if (next.status === "WORK" && !next.attendance) delete scheduleData.records[key];
      else scheduleData.records[key] = next;
    });
    saveScheduleData();
  }
  const SCHEDULE_STATUS_OPTIONS = [
    ["WORK", null, "근무"],
    ["OFF", null, "오프"],
    ["ANNUAL", null, "연차"],
    ["DAEHYU", null, "대휴"],
    ["HALF", null, "반차"],
    ["GONGHYU", null, "공휴"],
    ["GONGGA", null, "공가"],
    ["MATERNITY", null, "육휴"],
    ["SPECIAL", null, "특휴"],
    ["EDUCATION", null, "교육"],
    ["WORK", "LATE", "지각"],
    ["WORK", "ABSENT", "결근"],
    ["RESIGNED", null, "퇴사"],
  ];
  function openScheduleBulkMenu(cells, evt) {
    // 선택 범위 안에 잠긴 달의 날짜가 하나라도 있으면 전체를 막는다 (개별 셀 잠금 규칙과 동일).
    const lockedFound = cells.some((cell) => scheduleIsDateLocked(cell.getAttribute("data-date")));
    if (lockedFound) {
      flashScheduleStatus("선택한 범위에 잠긴 달이 포함돼 있어요. 잠금을 해제한 뒤 다시 선택해주세요.");
      scheduleClearSelection();
      return;
    }
    closeScheduleMenu();
    cells.forEach((cell) => cell.classList.add("sch-cell--selected")); // closeScheduleMenu가 지운 하이라이트를 다시 표시
    const menu = document.createElement("div");
    menu.id = "sch-menu";
    menu.className = "sch-menu";
    menu.innerHTML = `<div class="sch-menu-title">${cells.length}칸 선택됨</div>` +
      SCHEDULE_STATUS_OPTIONS.map((o) =>
        `<button type="button" data-status="${o[0]}" data-attendance="${o[1] || ""}">${o[2]}</button>`
      ).join("") +
      `<button type="button" class="sch-menu-reset" data-reset="1">기본값(근무)으로</button>`;
    document.body.appendChild(menu);
    const clientX = evt ? evt.clientX : window.innerWidth / 2;
    const clientY = evt ? evt.clientY : window.innerHeight / 2;
    positionFloatingMenu(menu, clientX, clientY + 4);
    function applyAndClose(status, attendance) {
      scheduleApplyBulk(cells, { status, attendance: attendance || null });
      closeScheduleMenu();
      updateScheduleTableArea();
      flashScheduleStatus(`${cells.length}칸에 적용했어요.`);
    }
    menu.querySelectorAll("button[data-status]").forEach((btn) => {
      btn.onclick = () => applyAndClose(btn.getAttribute("data-status"), btn.getAttribute("data-attendance"));
    });
    const resetBtn = menu.querySelector("[data-reset]");
    if (resetBtn) resetBtn.onclick = () => applyAndClose("WORK", null);
    setTimeout(() => document.addEventListener("mousedown", scheduleMenuOutsideHandler, true), 0);
  }
  // 마우스를 뗄 때(문서 전체 기준): 드래그해서 여러 칸을 옮겨다녔으면 일괄 적용 메뉴를 띄우고,
  // 그냥 제자리에서 뗐으면(=클릭) 아무 것도 하지 않고 이어서 그 칸의 onclick이 기존 방식대로 처리한다.
  function scheduleSelectionMouseUpHandler(e) {
    if (!scheduleSelectDragging) return;
    const root = document.getElementById("schedule-table-area");
    const wasMoved = scheduleSelectMoved;
    const anchor = scheduleSelectAnchor;
    const current = scheduleSelectCurrent;
    scheduleSelectDragging = false;
    if (wasMoved && root) {
      const cells = scheduleSelectionRectCells(root, anchor, current);
      if (cells.length > 1) {
        openScheduleBulkMenu(cells, e);
        return;
      }
    }
    scheduleClearSelection();
  }
  document.addEventListener("mouseup", scheduleSelectionMouseUpHandler);

  function openScheduleMenu(anchorEl, staffId, dateKey) {
    if (scheduleIsDateLocked(dateKey)) {
      flashScheduleStatus("잠긴 달이에요. 잠금을 해제한 뒤 수정해주세요.");
      return;
    }
    closeScheduleMenu();
    const rect = anchorEl.getBoundingClientRect();
    const menu = document.createElement("div");
    menu.id = "sch-menu";
    menu.className = "sch-menu";
    const options = SCHEDULE_STATUS_OPTIONS;
    const hasMemo = !!getScheduleMemo(staffId, dateKey);
    const memoLabel = hasMemo ? `${ICON_NOTE || ""} 메모 수정` : `${ICON_NOTE || ""} 메모 추가`;
    const memoDeleteBtnHtml = hasMemo ? `<button type="button" class="sch-menu-danger" data-memo-delete="1">${ICON_TRASH || ""} 메모 삭제</button>` : "";
    menu.innerHTML = options.map((o) =>
      `<button type="button" data-status="${o[0]}" data-attendance="${o[1] || ""}">${o[2]}</button>`
    ).join("")
      + `<div class="sch-menu-divider"></div>`
      + `<button type="button" data-memo="1">${memoLabel}</button>`
      + memoDeleteBtnHtml
      + `<button type="button" class="sch-menu-reset" data-reset="1">기본값(근무)으로</button>`;
    document.body.appendChild(menu);
    positionFloatingMenu(menu, rect.left, rect.bottom + 4);
    menu.querySelectorAll("button[data-status]").forEach((btn) => {
      btn.onclick = () => {
        setScheduleRecord(staffId, dateKey, { status: btn.getAttribute("data-status"), attendance: btn.getAttribute("data-attendance") || null });
        closeScheduleMenu();
        updateScheduleTableArea();
      };
    });
    const memoBtn = menu.querySelector("[data-memo]");
    if (memoBtn) {
      memoBtn.onclick = () => {
        closeScheduleMenu();
        openScheduleMemoModal(staffId, dateKey);
      };
    }
    const memoDeleteBtn = menu.querySelector("[data-memo-delete]");
    if (memoDeleteBtn) {
      memoDeleteBtn.onclick = () => {
        setScheduleMemo(staffId, dateKey, "");
        closeScheduleMenu();
        updateScheduleTableArea();
      };
    }
    const resetBtn = menu.querySelector("[data-reset]");
    if (resetBtn) {
      resetBtn.onclick = () => {
        setScheduleRecord(staffId, dateKey, { status: "WORK", attendance: null });
        closeScheduleMenu();
        updateScheduleTableArea();
      };
    }
    setTimeout(() => document.addEventListener("mousedown", scheduleMenuOutsideHandler, true), 0);
  }

  // ----- 셀 메모 입력 모달 -----
  function closeScheduleMemoModal() {
    const existing = document.getElementById("sch-memo-overlay");
    if (existing) existing.remove();
    document.removeEventListener("keydown", scheduleMemoEscHandler, true);
  }
  function scheduleMemoEscHandler(e) {
    if (e.key === "Escape") closeScheduleMemoModal();
  }
  function openScheduleMemoModal(staffId, dateKey) {
    if (scheduleIsDateLocked(dateKey)) {
      flashScheduleStatus("잠긴 달이에요. 잠금을 해제한 뒤 수정해주세요.");
      return;
    }
    closeScheduleMemoModal();
    const staff = getStaffListForMonth(scheduleUi.year, scheduleUi.monthIndex).find((s) => s.id === staffId) || scheduleData.staff.find((s) => s.id === staffId);
    const current = getScheduleMemo(staffId, dateKey);
    const overlay = document.createElement("div");
    overlay.id = "sch-memo-overlay";
    overlay.className = "sch-preview-overlay";
    overlay.innerHTML = `
      <div class="sch-preview-box sch-memo-box">
        <div class="sch-preview-head">
          <span>${esc(staff ? staff.name : "")} · ${esc(dateKey)} 메모</span>
          <button type="button" class="sch-preview-close" id="sch-memo-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="sch-preview-body sch-memo-body">
          <textarea class="add-input sch-memo-textarea" id="sch-memo-textarea" placeholder="이 날짜에 남길 메모를 입력하세요">${esc(current)}</textarea>
        </div>
        <div class="sch-preview-actions">
          ${current ? `<button type="button" class="ghost-btn danger" id="sch-memo-delete">삭제</button>` : ""}
          <button type="button" class="ghost-btn" id="sch-memo-cancel">취소</button>
          <button type="button" class="primary-btn" id="sch-memo-save">저장</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeScheduleMemoModal(); };
    document.getElementById("sch-memo-close-x").onclick = () => closeScheduleMemoModal();
    document.getElementById("sch-memo-cancel").onclick = () => closeScheduleMemoModal();
    const deleteBtn = document.getElementById("sch-memo-delete");
    if (deleteBtn) {
      deleteBtn.onclick = () => {
        setScheduleMemo(staffId, dateKey, "");
        closeScheduleMemoModal();
        updateScheduleTableArea();
      };
    }
    document.getElementById("sch-memo-save").onclick = () => {
      const val = document.getElementById("sch-memo-textarea").value;
      setScheduleMemo(staffId, dateKey, val);
      closeScheduleMemoModal();
      updateScheduleTableArea();
    };
    setTimeout(() => {
      document.addEventListener("keydown", scheduleMemoEscHandler, true);
      const ta = document.getElementById("sch-memo-textarea");
      if (ta) { ta.focus(); ta.select(); }
    }, 0);
  }

  function attachScheduleTableHandlers(root) {
    root.querySelectorAll(".sch-cell").forEach((cell) => {
      // 클릭(드래그 없이 눌렀다 뗌)만 기존처럼 그 칸 하나의 메뉴를 연다.
      // 드래그로 여러 칸을 선택한 경우의 처리는 mousedown/mouseenter + 문서 전체 mouseup에서 한다.
      cell.onclick = () => {
        if (scheduleSelectMoved) return;
        openScheduleMenu(cell, cell.getAttribute("data-staff-id"), cell.getAttribute("data-date"));
      };
      cell.onmousedown = (e) => {
        if (e.button !== 0) return; // 왼쪽 버튼만
        scheduleSelectDragging = true;
        scheduleSelectMoved = false;
        scheduleSelectAnchor = { rowIdx: Number(cell.getAttribute("data-row-idx")), day: Number(cell.getAttribute("data-day")) };
        scheduleSelectCurrent = scheduleSelectAnchor;
        e.preventDefault(); // 드래그 중 글자 선택(파랗게 칠해지는 것) 방지
      };
      cell.onmouseenter = () => {
        if (!scheduleSelectDragging) return;
        const rowIdx = Number(cell.getAttribute("data-row-idx"));
        const day = Number(cell.getAttribute("data-day"));
        if (rowIdx !== scheduleSelectAnchor.rowIdx || day !== scheduleSelectAnchor.day) scheduleSelectMoved = true;
        scheduleSelectCurrent = { rowIdx, day };
        scheduleApplySelectionHighlight();
      };
    });
    root.querySelectorAll(".sch-required-input").forEach((input) => {
      // 입력칸을 벗어날 때(blur) 또는 Enter 시 저장. 매 타이핑마다 전체를 다시 그리지 않아
      // 숫자 입력 중 표가 깜빡이거나 포커스가 빠지지 않는다.
      input.onchange = () => {
        const { year, monthIndex } = scheduleUi;
        setRequiredHeadcount(
          year, monthIndex,
          input.getAttribute("data-required-group"),
          input.getAttribute("data-required-type"),
          Number(input.getAttribute("data-required-day")),
          input.value
        );
        renderApp();
      };
      input.onkeydown = (e) => { if (e.key === "Enter") input.blur(); };
    });
    root.querySelectorAll("[data-toggle-row-group]").forEach((el) => {
      el.onclick = (e) => {
        e.stopPropagation();
        scheduleToggleRowGroup(el.getAttribute("data-toggle-row-group"));
      };
    });
    // 열 머리글(날짜)·행 머리글(닉네임 칸) 클릭 = 선택 토글, 오른쪽 클릭 = 접기 메뉴 열기
    root.querySelectorAll(".sch-col-th").forEach((th) => {
      th.onclick = (e) => { e.stopPropagation(); scheduleToggleColSelection(th.getAttribute("data-col-key")); };
      th.oncontextmenu = (e) => scheduleHeaderRightClick(th, e);
    });
    root.querySelectorAll(".sch-row-th").forEach((td) => {
      td.onclick = (e) => { e.stopPropagation(); scheduleToggleRowSelection(td.getAttribute("data-row-key")); };
      td.oncontextmenu = (e) => scheduleHeaderRightClick(td, e);
    });
    // 헤더가 아닌 다른 곳을 클릭하면 열/행 선택을 해제한다.
    root.onclick = (e) => {
      if (!e.target.closest(".sch-col-th") && !e.target.closest(".sch-row-th")) scheduleClearHeaderSelection();
    };
    scheduleApplyHeaderSelectionHighlight();
  }

  // ----- 월별 스케줄 일괄 삭제 -----
  // "등록된 일정 전체 삭제" 및 조/업무 구분별 삭제(주간 채팅·주간 유선·야간 채팅·야간 유선)를
  // 지원한다. 대상은 항상 "현재 화면에 보이는 달"이며, 대상 인원의 해당 달 1일~말일 기록을
  // 전부 기본값(근무)으로 되돌린다. 실수로 누르는 걸 막기 위해 실행 전에 꼭 확인을 받는다.
  const SCHEDULE_DELETE_SCOPES = [
    { key: "ALL", label: "등록된 일정 전체 삭제", danger: true },
    { key: "ADMIN", label: "관리자 삭제" },
    { key: "DAY_CHAT", label: "주간 채팅 삭제" },
    { key: "DAY_VOICE", label: "주간 유선 삭제" },
    { key: "NIGHT_CHAT", label: "야간 채팅 삭제" },
    { key: "NIGHT_VOICE", label: "야간 유선 삭제" },
  ];

  // scope에 해당하는 인원 목록과 화면 표시용 라벨을 반환한다.
  // (표를 그릴 때 쓰는 것과 같은 분류 기준 — 관리자/주간/야간, 채팅/유선 — 을 그대로 사용해서
  // "표에서 보이는 그룹"과 "삭제 대상"이 항상 일치하도록 한다)
  function scheduleDeleteTargets(scope, year, monthIndex) {
    const monthStaff = getStaffListForMonth(year, monthIndex);
    if (scope === "ALL") return monthStaff;
    if (scope === "ADMIN") return monthStaff.filter((s) => s.isAdmin);
    const nonAdmin = monthStaff.filter((s) => !s.isAdmin);
    const dayStaff = nonAdmin.filter((s) => s.group !== "night");
    const nightStaff = nonAdmin.filter((s) => s.group === "night");
    if (scope === "DAY_CHAT") return splitByType(dayStaff).chat;
    if (scope === "DAY_VOICE") return splitByType(dayStaff).voice;
    if (scope === "NIGHT_CHAT") return splitByType(nightStaff).chat;
    if (scope === "NIGHT_VOICE") return splitByType(nightStaff).voice;
    return [];
  }

  function scheduleBulkDelete(scope) {
    const meta = SCHEDULE_DELETE_SCOPES.find((s) => s.key === scope);
    const label = meta ? meta.label.replace(/ 삭제$/, "") : "선택한";
    const { year, monthIndex } = scheduleUi;
    if (scheduleIsMonthLocked(year, monthIndex)) {
      flashScheduleStatus("이 달은 잠겨 있어요. 잠금을 해제한 뒤 삭제해주세요.");
      return;
    }
    const targetStaff = scheduleDeleteTargets(scope, year, monthIndex);

    if (targetStaff.length === 0) {
      flashScheduleStatus(`${label} 대상 인원이 없어요.`);
      return;
    }
    const ok = window.confirm(
      `${scheduleMonthLabel()} "${label}" 일정을 모두 삭제할까요?\n대상 인원 ${targetStaff.length}명 · 이 달의 모든 날짜가 기본값(근무)으로 되돌아가요. (Ctrl+Z로 되돌리기 가능)`
    );
    if (!ok) return;

    recordUndo(`${label} 일괄 삭제`, SCHEDULE_KEY, reloadScheduleData);
    const numDays = scheduleDaysInMonth(year, monthIndex);
    let cleared = 0;
    targetStaff.forEach((s) => {
      for (let d = 1; d <= numDays; d++) {
        const dateKey = scheduleDateKey(year, monthIndex, d);
        const key = scheduleRecordKey(s.id, dateKey);
        if (scheduleData.records[key]) {
          delete scheduleData.records[key];
          cleared += 1;
        }
      }
    });
    saveScheduleData();
    updateScheduleTableArea();
    flashScheduleStatus(cleared > 0 ? `${label} 일정 삭제됨 (${targetStaff.length}명 · ${cleared}칸)` : `${label}에는 삭제할 일정이 없었어요.`);
  }

  function openScheduleDeleteMenu(anchorEl) {
    closeScheduleMenu();
    const rect = anchorEl.getBoundingClientRect();
    const menu = document.createElement("div");
    menu.id = "sch-menu";
    menu.className = "sch-menu";
    menu.innerHTML = SCHEDULE_DELETE_SCOPES.map((o, idx) => {
      const divider = idx === 1 ? `<div class="sch-menu-divider"></div>` : "";
      return `${divider}<button type="button" class="${o.danger ? "sch-menu-danger" : ""}" data-scope="${o.key}">${o.danger ? ICON_TRASH + " " : ""}${o.label}</button>`;
    }).join("");
    document.body.appendChild(menu);
    positionFloatingMenu(menu, rect.left, rect.bottom + 4);
    menu.querySelectorAll("button[data-scope]").forEach((btn) => {
      btn.onclick = () => {
        const scope = btn.getAttribute("data-scope");
        closeScheduleMenu();
        scheduleBulkDelete(scope);
      };
    });
    setTimeout(() => document.addEventListener("mousedown", scheduleMenuOutsideHandler, true), 0);
  }

  // ----- 이미지로 저장: 다운로드 전 미리보기 모달 -----
  function closeSchedulePreview() {
    const existing = document.getElementById("sch-preview-overlay");
    if (existing) existing.remove();
    document.removeEventListener("keydown", schedulePreviewEscHandler, true);
  }
  function schedulePreviewEscHandler(e) {
    if (e.key === "Escape") closeSchedulePreview();
  }
  // dataUrl: html2canvas로 만든 캡처 이미지, filename: 실제 다운로드할 때 쓸 파일명,
  // modeName: "주간"/"유선" 등 캡처 모드 이름 (전체 저장이면 null)
  function openSchedulePreview(dataUrl, filename, modeName) {
    closeSchedulePreview();
    const overlay = document.createElement("div");
    overlay.id = "sch-preview-overlay";
    overlay.className = "sch-preview-overlay";
    overlay.innerHTML = `
      <div class="sch-preview-box">
        <div class="sch-preview-head">
          <span>${modeName ? `${esc(modeName)} 이미지 미리보기` : "이미지 미리보기"}</span>
          <button type="button" class="sch-preview-close" id="sch-preview-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="sch-preview-body">
          <img src="${dataUrl}" alt="월별 스케줄 캡처 미리보기">
        </div>
        <div class="sch-preview-actions">
          <button type="button" class="ghost-btn" id="sch-preview-cancel">닫기</button>
          <button type="button" class="primary-btn" id="sch-preview-download">${ICON_DOWNLOAD} 이미지 다운로드</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeSchedulePreview(); };
    document.getElementById("sch-preview-close-x").onclick = () => closeSchedulePreview();
    document.getElementById("sch-preview-cancel").onclick = () => closeSchedulePreview();
    document.getElementById("sch-preview-download").onclick = () => {
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
      closeSchedulePreview();
      flashScheduleStatus("이미지 저장됨");
    };
    setTimeout(() => document.addEventListener("keydown", schedulePreviewEscHandler, true), 0);
  }

  // ----- 월별 스케줄 이미지로 저장: 전체/주간/야간/유선/채팅 -----
  // 유선·채팅은 주야간을 통합해서 한 장으로 캡처하되, 캡처 이미지 안에서는
  // 주간/야간 구획을 나눠서 보여준다. (buildScheduleTableHtml·buildScheduleLogHtml 참고)
  const SCHEDULE_CAPTURE_MODES = [
    { key: "ALL", label: "전체 저장" },
    { key: "ADMIN", label: "관리자 저장" },
    { key: "DAY", label: "주간 저장" },
    { key: "NIGHT", label: "야간 저장" },
    { key: "VOICE", label: "유선 저장" },
    { key: "CHAT", label: "채팅 저장" },
  ];

  function openScheduleCaptureMenu(anchorEl) {
    closeScheduleMenu();
    const rect = anchorEl.getBoundingClientRect();
    const menu = document.createElement("div");
    menu.id = "sch-menu";
    menu.className = "sch-menu";
    menu.innerHTML = SCHEDULE_CAPTURE_MODES.map((o) =>
      `<button type="button" data-capture-mode="${o.key}">${ICON_CAMERA} ${o.label}</button>`
    ).join("");
    document.body.appendChild(menu);
    positionFloatingMenu(menu, rect.left, rect.bottom + 4);
    menu.querySelectorAll("button[data-capture-mode]").forEach((btn) => {
      btn.onclick = () => {
        const mode = btn.getAttribute("data-capture-mode");
        closeScheduleMenu();
        captureSchedulePage(mode);
      };
    });
    setTimeout(() => document.addEventListener("mousedown", scheduleMenuOutsideHandler, true), 0);
  }

  // "이번 달 지각·결근 기록" 영역의 "되돌리기" 버튼에 클릭 이벤트를 연결한다.
  // 이 영역은 되돌리기를 누를 때마다 통째로 다시 그려지므로, 매번 다시 호출해서
  // 새로 그려진 버튼에도 이벤트가 붙도록 해야 한다.
  function attachScheduleLogHandlers(root) {
    root.querySelectorAll("[data-action='clear-sch-attendance']").forEach((btn) => {
      btn.onclick = () => {
        setScheduleRecord(btn.getAttribute("data-staff-id"), btn.getAttribute("data-date"), { attendance: null, status: "WORK" });
        updateScheduleTableArea();
      };
    });
  }

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
            인식되는 값: <b>1</b>(근무), <b>휴일 / 오프 / 휴무</b>(오프), <b>연차</b>, <b>대휴</b>, <b>반차</b>, <b>공휴</b>, <b>공가</b>, <b>육휴</b>, <b>특휴</b>, <b>교육</b>, <b>지각</b>, <b>결근</b>, <b>퇴사</b>. 값 개수가 이번 달 일수보다 적으면 앞에서부터만 반영되고, 많으면 초과분은 무시돼요.
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
        <span class="item"><span class="swatch" style="background:var(--blue);"></span>오프</span>
        <span class="item"><span class="swatch" style="background:var(--orange);"></span>연차</span>
        <span class="item"><span class="swatch" style="background:var(--green);"></span>대휴</span>
        <span class="item"><span class="swatch" style="background:var(--salmon);"></span>반차</span>
        <span class="item"><span class="swatch" style="background:var(--teal);"></span>공휴</span>
        <span class="item"><span class="swatch" style="background:var(--purple);"></span>공가</span>
        <span class="item"><span class="swatch" style="background:var(--pink);"></span>육휴</span>
        <span class="item"><span class="swatch" style="background:var(--indigo);"></span>특휴</span>
        <span class="item"><span class="swatch" style="background:var(--edu);"></span>교육</span>
        <span class="item"><span class="swatch" style="background:var(--yellow);"></span>지각</span>
        <span class="item"><span class="swatch" style="background:var(--red);"></span>결근</span>
        <span class="item"><span class="swatch" style="background:var(--text-faint);"></span>퇴사</span>
      </div>
      <div class="schedule-table-toolbar">
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
              ${Array.from(scheduleUi.manualHiddenDays).sort((a, b) => a - b).map((d) => `
                <span class="schedule-colgroup-chip">
                  ${pad2(scheduleUi.monthIndex + 1)}/${pad2(d)}
                  <button class="sch-colgroup-toggle-btn" data-unhide-day="${d}">펼치기</button>
                </span>
              `).join("")}
              ${Array.from(scheduleUi.manualHiddenInfoCols).map((key) => {
                const col = SCHEDULE_INFO_COLS.find((c) => c.key === key);
                return `
                <span class="schedule-colgroup-chip">
                  ${esc(col ? col.label : key)}
                  <button class="sch-colgroup-toggle-btn" data-unhide-infocol="${esc(key)}">펼치기</button>
                </span>
              `;
              }).join("")}
              ${Array.from(scheduleUi.manualHiddenStaffIds).map((id) => {
                const staff = getStaffListForMonth(scheduleUi.year, scheduleUi.monthIndex).find((s) => s.id === id);
                return `
                <span class="schedule-colgroup-chip">
                  ${esc(staff ? staff.nickname : "(알 수 없음)")}
                  <button class="sch-colgroup-toggle-btn" data-unhide-staff="${id}">펼치기</button>
                </span>
              `;
              }).join("")}
              ${Array.from(scheduleUi.manualHiddenSummaryRows).map((key) => `
                <span class="schedule-colgroup-chip">
                  ${esc(schedulePrettyRowKey(key))}
                  <button class="sch-colgroup-toggle-btn" data-unhide-summaryrow="${esc(key)}">펼치기</button>
                </span>
              `).join("")}
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
    root.querySelectorAll("[data-unhide-day]").forEach((btn) => {
      btn.onclick = () => scheduleUnhideDay(Number(btn.getAttribute("data-unhide-day")));
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
