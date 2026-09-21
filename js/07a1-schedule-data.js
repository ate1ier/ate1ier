  // 07a1-schedule-data.js — 데이터 로드/저장/정규화, 월 잠금, 상담사 목록 동기화
  // (07-schedule.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
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
    return { staff: [], records: {}, staffHistory: {}, lastSyncMonthKey: null, requiredHeadcount: {}, monthLocks: {}, memos: {}, nameMemos: {} };
  }
  function normalizeScheduleData(d) {
    if (!d.requiredHeadcount) d.requiredHeadcount = {};
    // 셀(인원×날짜)마다 남길 수 있는 메모. key는 scheduleRecordKey와 같은 형식(staffId|dateKey).
    if (!d.memos || typeof d.memos !== "object") d.memos = {};
    // 이름 칸에 남기는 메모. 셀 메모와 달리 "인원 × 달" 단위라서 key는 `staffId|YYYY-MM` 형식이다.
    // (셀 메모와 같은 memos 안에 섞지 않는 이유: 셀 메모는 key 끝이 날짜(YYYY-MM-DD)라는 전제로
    //  가감점 취합·복사/붙여넣기·수정 이력이 동작하는데, 여기에 다른 모양의 key가 끼면 헷갈리기 때문)
    if (!d.nameMemos || typeof d.nameMemos !== "object") d.nameMemos = {};
    // 사용자가 직접 켜고 끄는 "월별 잠금". 잠긴 달은 셀 클릭·일괄 붙여넣기·삭제·필요인력 입력 등
    // 데이터를 바꾸는 조작이 전부 막혀서 실수로 수정되는 걸 막아준다. 다시 버튼을 눌러 풀면 그대로 수정 가능.
    if (!d.monthLocks || typeof d.monthLocks !== "object") d.monthLocks = {};
    // 사용자가 직접 접어둔 열/행 상태(행 그룹, 열 그룹, 개별로 숨긴 날짜·정보열·인원·집계행).
    // 달(월)마다 날짜 개수·인원 구성이 달라지므로 달 단위("YYYY-MM")로 따로 저장해서,
    // 그 달을 다시 열면(다른 사람이 열어도) 접어뒀던 그대로 보이게 한다.
    if (!d.collapseByMonth || typeof d.collapseByMonth !== "object") d.collapseByMonth = {};
    // "AI 자동 배치"에서 쓰는 인원별 선호 오프 요일. { [staffId]: { dows: [0~6, ...] } } 형태(0=일 … 6=토).
    // 달과 상관없이 그 사람에게 계속 적용되는 설정이고, 반드시 지켜야 하는 조건이 아니라
    // "최대한 맞춰주는" 소프트 조건이다(필요인력·연속 근무 제한이 우선). 비어 있으면 키 자체를 두지 않는다.
    if (!d.autoOffPrefs || typeof d.autoOffPrefs !== "object") d.autoOffPrefs = {};
    return d;
  }
  // 특정 달의 접기 상태 저장 칸을 가져온다(없으면 빈 상태로 만들어서 돌려준다).
  function scheduleGetMonthCollapseState(year, monthIndex) {
    const key = scheduleMonthKey(year, monthIndex);
    if (!scheduleData.collapseByMonth) scheduleData.collapseByMonth = {};
    if (!scheduleData.collapseByMonth[key]) {
      scheduleData.collapseByMonth[key] = {
        collapsedRowGroups: [], colGroups: [], manualHiddenDays: [],
        manualHiddenStaffIds: [], manualHiddenInfoCols: [], manualHiddenSummaryRows: [],
        manualHiddenBatches: [],
      };
    }
    return scheduleData.collapseByMonth[key];
  }
  // 되돌리기(undo)로 스냅샷을 복원한 뒤 이 함수를 호출해 scheduleData를 다시 읽어들인다.
  function reloadScheduleData() {
    scheduleData = normalizeScheduleData(loadScheduleData());
    // 되돌리기(undo)나 다른 사람의 원격 변경으로 데이터를 다시 읽어들인 뒤에도,
    // 지금 보고 있는 달의 접기 상태를 최신 저장값으로 다시 맞춰준다.
    scheduleSyncUiCollapseFromData();
  }
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
  // - 이번 달과 미래 달은 "상담사 관리"의 실시간 데이터(scheduleData.staff)를 기반으로 쓰되,
  //   "보고 있는 달" 자체를 기준으로 퇴사 여부를 한 번 더 거른다. 퇴사일이 속한 달까지는
  //   명단에 남고, 그 다음 달부터는(실제 오늘 날짜와 상관없이, 미리 열어보는 미래 달이라도)
  //   명단에서 완전히 빠진다. (예: 9월 30일에 퇴사해도 9월 스케줄은 그대로 남고, 10월
  //   스케줄을 미리 열어봐도 그 사람은 더 이상 보이지 않는다)
  function getStaffListForMonth(year, monthIndex) {
    const key = scheduleMonthKey(year, monthIndex);
    if (scheduleData.staffHistory[key]) return scheduleData.staffHistory[key];
    if (scheduleIsMonthPast(year, monthIndex)) {
      scheduleData.staffHistory[key] = JSON.parse(JSON.stringify(scheduleData.staff));
      saveScheduleData();
      return scheduleData.staffHistory[key];
    }
    return scheduleData.staff.filter((s) => {
      if (!s.resignDate) return true;
      const resignMonthKey = s.resignDate.slice(0, 7); // "YYYY-MM"
      return resignMonthKey >= key;
    });
  }

  // 월별 스케줄의 인원 목록을 "상담사 관리"의 목록으로 자동 반영한다.
  // 이름/사번/입사일/근무시간/업무구분(채팅·유선)/조(주간·야간) 모두
  // 상담사 관리 쪽 값을 그대로 따라간다. 조는 스케줄 화면에서도 바로
  // 바꿀 수 있는데, 그 경우 "상담사 관리" 쪽 값도 함께 바뀌어 항상 서로 일치한다.
  function syncScheduleStaffFromAgents() {
    // 실제 오늘 날짜가 이전에 동기화했던 달을 지나 새 달로 넘어갔다면,
    // 그 이전 달은 이제 "지나간 달"이므로 지금까지의 실시간 인원 데이터를
    // 스냅샷으로 고정해서 남겨둔다. (해당 달을 아직 한 번도 안 열어봤어도
    // 여기서 바로 고정되므로, 나중에 상담사 관리에서 인원이 바뀌어도 안전하다)
    const currentMonthKey = scheduleCurrentMonthKey();
    if (scheduleData.lastSyncMonthKey && scheduleData.lastSyncMonthKey !== currentMonthKey) {
      if (!scheduleData.staffHistory[scheduleData.lastSyncMonthKey]) {
        scheduleData.staffHistory[scheduleData.lastSyncMonthKey] = JSON.parse(JSON.stringify(scheduleData.staff));
      }
    }
    scheduleData.lastSyncMonthKey = currentMonthKey;

    // 월별 스케줄에는 "근무중" 상태인 인원과, "퇴사" 처리됐어도 아직 퇴사일이
    // 속한 달까지는(그 달이 지나기 전까지는) 계속 반영한다. 실제 오늘 날짜가
    // 퇴사일이 속한 달을 완전히 지나야(다음 달이 되어야) 명단에서 빠진다.
    // (단, 이미 지나간 달에 대한 기록·스냅샷은 그대로 보존된다)
    scheduleData.staff = agentsData.filter((a) => {
      if (a.status !== "RESIGNED") return true;
      if (!a.resignDate) return false;
      const resignMonthKey = a.resignDate.slice(0, 7); // "YYYY-MM"
      return resignMonthKey >= currentMonthKey;
    }).map((a) => ({
      id: a.id,
      nickname: a.ldap || a.name,
      name: a.name,
      empNo: a.empNo,
      hireDate: a.hireDate,
      workHours: a.timezone,
      group: a.group === "night" ? "night" : "day",
      types: a.workTypes || [],
      isAdmin: !!a.isAdmin,
      // getStaffListForMonth에서 "보고 있는 달" 기준으로 퇴사 여부를 다시 거르는 데 쓰인다.
      // 재직 상태(status)가 아직 "근무중"이어도(=퇴사일자를 미래로 예약해둔 경우) 이 값은
      // 그대로 채워서, 월별 스케줄에는 예약한 순간 바로 반영되게 한다.
      resignDate: a.resignDate || null,
    }));
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
      if (!validIds[staffId]) delete scheduleData.records[key];
    });
    Object.keys(scheduleData.memos).forEach((key) => {
      const staffId = key.split("|")[0];
      if (!validIds[staffId]) delete scheduleData.memos[key];
    });
    Object.keys(scheduleData.nameMemos || {}).forEach((key) => {
      const staffId = key.split("|")[0];
      if (!validIds[staffId]) delete scheduleData.nameMemos[key];
    });
  }

  function saveScheduleData() {
    try { localStorage.setItem(SCHEDULE_KEY, JSON.stringify(scheduleData)); flashScheduleStatus("저장됨"); }
    catch (e) { flashScheduleStatus("저장 실패"); }
  }

  // ----- 퇴사 처리 시 월별 스케줄 자동 반영 -----
  // "상담사 관리"에서 어떤 인원을 "퇴사"로 바꾸면, 입력한 퇴사일자 "다음 날"부터 그 달
  // 말일까지 월별 스케줄의 해당 인원 칸을 전부 "퇴사"로 자동 채운다(퇴사일 당일까지는
  // 마지막 근무일로 보고 그대로 둔다). 이미 손으로 다른 값을 넣어둔 칸이라도 퇴사
  // 처리 시점에는 더는 의미가 없으므로 덮어쓴다. 자동으로 채워진 칸도 잠금 처리는
  // 하지 않으므로, 필요하면 관리자가 다른 셀과 똑같이 클릭해서 다시 고칠 수 있다.
  // (퇴사일이 그 달의 말일이면 다음 날이 다음 달로 넘어가므로, 이 달에는 아무 칸도
  // 바뀌지 않고 그대로 유지된다 — 대신 다음 달 명단에서는 getStaffListForMonth가
  // 알아서 그 사람을 빼준다)
  function applyResignedScheduleFrom(staffId, resignDateStr) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(resignDateStr || "");
    if (!m) return;
    const year = Number(m[1]), monthIndex = Number(m[2]) - 1, startDay = Number(m[3]) + 1;
    // 다른 일괄 변경 기능들(붙여넣기/일괄삭제 등)과 마찬가지로, 퇴사일이 속한 달이
    // 잠겨 있으면(이미 확정된 지난 달 등) 자동 반영하지 않고 알려준다.
    if (scheduleIsMonthLocked(year, monthIndex)) {
      flashScheduleStatus("퇴사일이 속한 달이 잠겨 있어 스케줄에 자동 반영되지 않았어요.");
      return;
    }
    // 다른 일괄 변경 기능들처럼 되돌리기(undo) 스택에도 남겨서, 실수로 반영됐을 때
    // 관리자가 "되돌리기"로 바로 취소할 수 있게 한다.
    recordUndo("퇴사 처리 자동 반영", SCHEDULE_KEY, reloadScheduleData);
    const daysInMonth = scheduleDaysInMonth(year, monthIndex);
    for (let day = startDay; day <= daysInMonth; day++) {
      const key = scheduleRecordKey(staffId, scheduleDateKey(year, monthIndex, day));
      scheduleData.records[key] = { status: "RESIGNED", attendance: null };
    }
    saveScheduleData();
  }
  // 퇴사 처리를 취소(다시 "근무중"으로)하거나 퇴사일자를 다른 날짜로 고칠 때,
  // 예전 퇴사일자부터 채워뒀던 "퇴사" 칸을 지운다. 그사이 관리자가 개별 셀에서
  // 손으로 다른 값으로 바꿔둔 칸까지 지우지 않도록, 지금 값이 여전히 "퇴사"인
  // 칸만 지운다(지우면 기본값인 "근무"로 되돌아간다).
  function clearResignedScheduleFrom(staffId, resignDateStr) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(resignDateStr || "");
    if (!m) return;
    const year = Number(m[1]), monthIndex = Number(m[2]) - 1, startDay = Number(m[3]) + 1;
    const daysInMonth = scheduleDaysInMonth(year, monthIndex);
    let changed = false;
    for (let day = startDay; day <= daysInMonth; day++) {
      const key = scheduleRecordKey(staffId, scheduleDateKey(year, monthIndex, day));
      if (scheduleData.records[key] && scheduleData.records[key].status === "RESIGNED") changed = true;
    }
    if (!changed) return; // 지울 게 없으면 undo 스택도 더럽히지 않는다
    recordUndo("퇴사 취소로 스케줄 되돌리기", SCHEDULE_KEY, reloadScheduleData);
    for (let day = startDay; day <= daysInMonth; day++) {
      const key = scheduleRecordKey(staffId, scheduleDateKey(year, monthIndex, day));
      if (scheduleData.records[key] && scheduleData.records[key].status === "RESIGNED") {
        delete scheduleData.records[key];
      }
    }
    saveScheduleData();
  }

  let scheduleStatusTimer = null;
  // ms: 메시지를 보여줄 시간(생략하면 1.2초). 복사/붙여넣기 결과처럼 읽을 내용이 긴 안내만 더 길게 준다.
  function flashScheduleStatus(msg, ms) {
    const el = document.getElementById("schedule-status");
    if (!el) return;
    el.textContent = msg;
    clearTimeout(scheduleStatusTimer);
    scheduleStatusTimer = setTimeout(() => { el.textContent = ""; }, ms || 1200);
  }

  const scheduleUi = {
    year: today.getFullYear(),
    monthIndex: today.getMonth(), // 0-based. 실시간 기준 당월로 시작한다.
    collapsedRowGroups: new Set(), // 접힌 행 그룹(관리자/주간/야간/채팅/유선 등)의 키 모음
    colGroups: [], // 사용자가 지정한 열(날짜) 그룹: { id, start, end, collapsed }
    manualHiddenDays: new Set(), // 열 머리글을 직접 선택해서 접은 날짜(일자 숫자) 모음
    manualHiddenStaffIds: new Set(), // 인원 이름칸을 직접 선택해서 접은 staffId 모음
    manualHiddenInfoCols: new Set(), // 직접 선택해서 접은 인원 정보 열(닉네임~결근) 키 모음
    manualHiddenSummaryRows: new Set(), // 직접 선택해서 접은 집계행(관리자 인원/필요인력/대비 등) 키 모음
    // 인원 정보 칸·인원·집계행을 "한 번에 여러 개 선택해서 접었을 때" 그 묶음을 기억해두는 목록.
    // { id, infoCols: [key,...], staffIds: [id,...], summaryRows: [key,...] } 형태.
    // "숨긴 열/행" 패널에서 같이 접은 항목들을 한 덩어리로 보여주고, 버튼 하나로 한 번에
    // 펼칠 수 있게 하려는 용도다(날짜는 연속 여부로 자동 판단하므로 여기 포함 안 함).
    manualHiddenBatches: [],
    searchQuery: "", // 상담사 검색어. 쉼표(,)로 여러 명을 한 번에 검색할 수 있다.
  };

  // 지금 보고 있는 달(scheduleUi.year/monthIndex)의 접기 상태를 scheduleData.collapseByMonth에
  // 그대로 옮겨 담고 saveScheduleData()로 저장한다. saveScheduleData()가 localStorage에
  // 쓰는 순간 클라우드(Supabase)에도 함께 올라가므로, 접어둔 열/행이 다른 사람 화면에도
  // 그대로 보이고 새로고침해도 유지된다. 열/행을 접거나 펼치는 모든 동작 뒤에 호출한다.
