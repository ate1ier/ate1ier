  // 07a3-schedule-records.js — 필요인원, 셀 기록/메모, 조정요약, 정렬 헬퍼
  // (07-schedule.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
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
  // ----- 이름 메모 (이름 칸에 남기는 메모) -----
  // 셀 메모가 "인원 × 날짜"라면, 이름 메모는 "인원 × 달"이다. 그 달 스케줄을 볼 때 그 사람에 대해
  // 기억해 둘 내용(예: "9/15 퇴사 예정", "수습 기간")을 남기는 용도라서, 달이 바뀌면 새로 시작한다.
  // 그래서 잠금(확정)된 달의 이름 메모도 셀 메모처럼 수정이 막히고, 지난 달을 열어보면 그때 남긴 그대로 보인다.
  // key 형식: `staffId|YYYY-MM` (셀 메모의 `staffId|YYYY-MM-DD`와 섞이지 않도록 scheduleData.nameMemos에 따로 둔다)
  function scheduleNameMemoKey(staffId, year, monthIndex) {
    return `${staffId}|${scheduleMonthKey(year, monthIndex)}`;
  }
  function getScheduleNameMemo(staffId, year, monthIndex) {
    const map = scheduleData.nameMemos || {};
    return map[scheduleNameMemoKey(staffId, year, monthIndex)] || "";
  }
  function setScheduleNameMemo(staffId, year, monthIndex, text) {
    if (scheduleIsMonthLocked(year, monthIndex)) { flashScheduleStatus("잠긴 달이에요. 잠금을 해제한 뒤 수정해주세요."); return; }
    const trimmed = (text || "").trim();
    // 바뀐 게 없으면 저장도, 되돌리기 기록도 남기지 않는다(같은 내용으로 저장 버튼을 눌렀을 때 등).
    if (trimmed === getScheduleNameMemo(staffId, year, monthIndex)) return;
    recordUndo("스케줄 이름 메모 변경", SCHEDULE_KEY, reloadScheduleData);
    if (!scheduleData.nameMemos || typeof scheduleData.nameMemos !== "object") scheduleData.nameMemos = {};
    const key = scheduleNameMemoKey(staffId, year, monthIndex);
    if (trimmed === "") {
      delete scheduleData.nameMemos[key];
    } else {
      scheduleData.nameMemos[key] = trimmed;
    }
    saveScheduleData();
  }
  // ----- 메모 문구 기반 "가감점 취합" -----
  // 메모 안에 아래 문구들이 포함되어 있으면 해당 날짜를 카테고리별로 모아서 보여준다.
  // 표기가 다양해도(공백 유무 등) 같은 카테고리로 합쳐지도록 정리해뒀다.
  // "역동석"이 "동석"의 부분 문자열이라, 역동석을 먼저 확인하고 그 부분을 제거한 뒤에
  // 동석을 검사해서 한 메모가 "역동석"과 "동석" 두 개로 중복 집계되지 않게 한다.
  const SCHEDULE_ADJUST_CATEGORIES = [
    { label: "선 투입", patterns: ["선투입", "선 투입"] },
    { label: "연장 근무", patterns: ["연장근무", "연장 근무", "연장"] },
    { label: "초과", patterns: ["초과"] },
    { label: "라운딩", patterns: ["라운딩"] },
    { label: "역동석", patterns: ["역동석", "역 동석"] },
    { label: "동석", patterns: ["동석"] },
  ];
  // 한 메모(셀) 안에 여러 문구가 섞여 있어도(예: "선투입 후 연장근무"), 그중 텍스트상
  // 가장 앞에 나오는 문구 하나만 대표로 가져온다. 같은 위치에서 시작하는 경우
  // (예: "역동석" 안의 "동석") 더 긴/구체적인 문구가 우선하도록 한다.
  // 한 메모(셀) 안에 문구가 하나뿐이면 그걸 그대로 쓰고, 두 개 이상 섞여 있으면
  // (예: "선투입 후 연장근무") 어떤 조합이 섞여 있는지만 알려준다.
  // "역동석"이 "동석"의 부분 문자열이라, 역동석을 먼저 확인하고 그 부분을 제거한 뒤에
  // 동석을 검사해서 한 메모가 "역동석"과 "동석" 두 개로 중복 집계되지 않게 한다.
  // 반환값은 항상 SCHEDULE_ADJUST_CATEGORIES에 정의된 순서를 따른다(텍스트상 등장 순서가 아님).
  // → 같은 조합(예: "선 투입"+"연장 근무")이 여러 번 나와도 항상 같은 순서로 후보가 정해지고,
  //    그 순서를 기준으로 번갈아 뽑을 수 있게 하기 위함.
  function scheduleDetectMemoCategories(memoText) {
    let working = memoText || "";
    if (!working) return [];
    const found = [];
    SCHEDULE_ADJUST_CATEGORIES.forEach((cat) => {
      const hit = cat.patterns.some((p) => working.indexOf(p) !== -1);
      if (!hit) return;
      found.push(cat.label);
      cat.patterns.forEach((p) => { working = working.split(p).join(""); });
    });
    return found;
  }
  // 지금 화면에 보이는 달(scheduleUi.year/monthIndex) 기준으로, 메모에 위 문구가 포함된
  // 날짜를 상담사별로 모아서 [{ id, name, nickname, entries: [{ day, label }] }, ...] 형태로 돌려준다.
  // entries는 날짜순으로 정렬되고, 상담사는 이름 가나다순으로 정렬된다.
  // 한 메모에 문구가 두 개 이상 섞여 있는 "애매한" 경우엔 그중 하나만 골라야 하는데,
  // 이때 같은 상담사에게 같은 조합(예: "선 투입"+"연장 근무")이 여러 번 나오면
  // 매번 같은 것만 뽑지 않고 날짜 순서대로 번갈아가며 뽑는다.
  // (예: 8/12에 선투입+연장근무 → 선 투입, 8/14에 또 선투입+연장근무 → 연장 근무, 8/20에 또 나오면 → 다시 선 투입 ...)
  function scheduleBuildAdjustSummary(year, monthIndex) {
    const monthPrefix = `${year}-${pad2(monthIndex + 1)}-`;
    const staffList = getStaffListForMonth(year, monthIndex);
    const byStaff = {};
    Object.keys(scheduleData.memos).forEach((key) => {
      const sep = key.lastIndexOf("|");
      if (sep === -1) return;
      const staffId = key.slice(0, sep);
      const dateKey = key.slice(sep + 1);
      if (dateKey.indexOf(monthPrefix) !== 0) return;
      const day = parseInt(dateKey.slice(monthPrefix.length), 10);
      if (!day) return;
      const categories = scheduleDetectMemoCategories(scheduleData.memos[key]);
      if (!categories.length) return;
      if (!byStaff[staffId]) byStaff[staffId] = [];
      byStaff[staffId].push({ day, categories });
    });
    const result = Object.keys(byStaff).map((staffId) => {
      const staff = staffList.find((s) => s.id === staffId) || scheduleData.staff.find((s) => s.id === staffId);
      const raw = byStaff[staffId].sort((a, b) => a.day - b.day);
      const comboCounters = {}; // 같은 조합이 반복될 때 번갈아 뽑기 위한 카운터
      const entries = raw.map((item) => {
        let label;
        if (item.categories.length === 1) {
          label = item.categories[0];
        } else {
          const comboKey = item.categories.join("+");
          const idx = comboCounters[comboKey] || 0;
          label = item.categories[idx % item.categories.length];
          comboCounters[comboKey] = idx + 1;
        }
        return { day: item.day, label };
      });
      return {
        id: staffId,
        name: staff ? staff.name : "(삭제된 인원)",
        nickname: staff ? staff.nickname : "",
        entries,
      };
    });
    result.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    return result;
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
    // 달이 바뀌면 지금 선택 중이던 헤더는 의미가 없어지므로 선택 상태만 초기화하고,
    // 접기 상태는 새로 보는 달에 맞춰 서버에 저장돼 있던 값(scheduleData.collapseByMonth)을
    // 그대로 불러와서 유지한다 — 그래야 이전에 이 달을 접어뒀다면(나든 다른 사람이든)
    // 다시 열었을 때도 그 모습 그대로 보인다.
    scheduleHeaderSelCols = new Set();
    scheduleHeaderSelRows = new Set();
    scheduleSyncUiCollapseFromData();
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
