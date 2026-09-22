  // 07c-schedule-auto-fill.js — 월별 스케줄 "AI 자동 배치"
  // (07-schedule.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  //
  // 하는 일: 그 달의 "공휴일 + 토요일 + 일요일" 개수를 인원별 목표 오프(OFF) 개수로 잡고,
  // 이미 뭔가 입력된 칸(연차·공가·특휴·교육·기존 오프·대휴 등 무엇이든)은 절대 건드리지 않은 채
  // 기본값(근무)인 빈 칸에만 새로 "오프"를 채운다. 채울 때는 조(주간/야간)×업무구분(채팅/유선)별
  // 필요인력 대비, 금·토·월은 부족을 절대 허용하지 않고 0만 허용하며, 그 외 요일은 되도록 -1
  // (정 안 되면 최후의 수단으로 -2까지) 범위 안에서 가장 안전한 날짜를 고른다. 대비(투입-필요인력)가 +인 날(인원이 남는 날)은
  // 항상 허용하고 "부족"(-)만 제한한다. 단, 그 날짜가 공휴일인 평일(월~금)이면 금·토·월이어도 -2까지 허용한다.
  // 목표 개수를 계산할 때, 이미 입력된 "오프류" 중 대휴·공휴는 그대로 빼주고, "오프"는 그 칸의
  // 메모에 "필휴"라고 적혀 있을 때만 뺀다(필휴 표시가 없는 오프는 연차·공가·육휴·특휴와 같은 취급으로
  // 목표 달성에 포함시키지 않는다). 연차·공가·육휴·특휴는 항상 별도로 취급해서 목표 달성에 포함시키지 않는다.
  // 실제로 저장하지 않고 "계획(plan)"만 만든 뒤, 미리보기 팝업에서 "이대로 입력"을 눌러야
  // 비로소 scheduleData에 반영된다.
  //
  // ---- 배치 조건: 제외할 인원 (이번 배치 한정, 저장 안 함) ----
  //  미리보기 팝업의 "배치 조건"에서 인원을 고르면(여러 명 가능) 그 인원은 이번 계산에서 "그 달 재직 인원에
  //  없는 것처럼" 취급한다. 그 인원에게는 오프를 새로 배정하지 않고, 조×업무구분 출근 인원수·필요인력 대비·
  //  출근 인원수·필요인력 대비 재직 인원수를 셀 때도 빠진다(= 나머지 인원만으로 필요인력을 맞춘다). 미리보기 표에서도
  //  그 인원을 빼고 그려서 집계·대비·O/X가 계획과 같은 기준으로 보인다. 실제 스케줄의 그 인원 칸은 건드리지 않는다.
  //  팝업을 열 때마다 비워지므로 다음 배치에 남아서 조용히 빠지는 일은 없다.
  //
  // ---- 대전제: 구분별 하루 출근 인원 최소 3명 (예외 없음, 아래 모든 조건보다 우선) ----
  //  주간 유선/주간 채팅/야간 유선/야간 채팅 각 구분에서, 어느 날이든 출근 인원이 3명 밑으로 떨어지지 않게 한다.
  //  오프를 넣었을 때 그 날 그 구분의 출근 인원이 3명 미만이 되는 배치는 다른 조건(연속 근무·필요인력·선호 요일)과
  //  상관없이 후보에서 아예 제외한다. 그래서 목표 오프 개수를 못 채우거나 연속 근무 5일 제한을 못 지켜도 이 조건이 먼저다
  //  (그 경우는 경고로 알려준다). "출근 인원"은 월별 스케줄 표의 투입 인원과 같은 기준(근무·결근 제외)으로 센다.
  //  - 이미 입력된 값(연차·공가 등) 때문에 원래부터 3명 미만인 날은 새 오프를 넣지 않고, 경고로 알려준다.
  //  - 그 구분의 재직 인원이 3명 미만이면 애초에 지킬 수 없으므로 그 구분에는 적용하지 않고 경고로 알려준다.
  //  - 이번 배치에서 제외한 인원은 재직 인원에서 빠진 것으로 세어 나머지 인원으로 이 조건을 지킨다.
  //
  // ---- 날짜를 고를 때 지키는 조건 (강한 순서) ----
  //  1) 연속 근무 5일 제한(SCHEDULE_AUTO_MAX_WORK_STREAK): 원칙적으로 6일 연속 근무가 나오지 않게 한다.
  //     단, 필휴가 기존 일정에 몰려 빈 칸이 부족해 5일 제한을 피할 수 없는 경우에는 6일까지 허용한다.
  //     7일 이상 연속 근무는 허용하지 않는다.
  //     - 이번 달 안에서는 물론이고, "지난달에도 있던 인원"은 지난달 말일부터 이어진 연속 근무일수를
  //       월 초에 그대로 이어서 센다(예: 지난달 마지막 4일을 연속 근무했으면 이번 달은 1~2일 안에 오프가 필요).
  //     - 근무일로 세는 것: 근무(결근 제외)·반차·교육. 오프류·연차·공가·퇴사 등은 쉬는 날로 본다.
  //     - 오프 개수는 목표(공휴일+토+일)를 넘겨서 늘리지 않는다. 그 개수 안에서 못 막는 구간(빈 칸이
  //       없거나 이미 입력된 값 때문에)은 경고로 알려준다.
  //  2) 필요인력 허용범위: 금·토·월은 0(부족 없음)만 허용한다. -1까지 넓히는 최후의 수단은 없다. 그 외 요일(화·수·목·일)은 1순위로 -1을 찾고, 정 안 되면 최후의 수단으로
  //     -2까지 넓혀서 고른다. 대비가 +(인원이 남음)인 건 언제나 허용한다(부족만 제한).
  //     추가로 각 구분(조×업무구분)마다 모든 인원이 출근하는 날이 생기지 않도록, 그런 날을 우선해서 오프를 배정한다.
  //     이때 그 날을 해소하기 위해 필요한 경우에만 해당 구분의 필요인력 부족을 -1까지 한시적으로 허용한다.
  //     즉, 모든 인원 출근을 피하기 위한 날짜에서만 기존 허용범위보다 -1을 더 허용하며, 다른 날짜에는 기존 범위를 그대로 적용한다.
  //     다만 그 날짜가 평일 공휴일이면 금·토·월이어도 -2까지 허용한다
  //     (토요일 자체는 "평일"이 아니므로 이 예외 대상이 아니다).
  //     허용범위(금·토·월은 0, 그 외/공휴일은 -2)를 넘겨서(더 부족하게) 배치될 때만 경고로 알려준다.
  //  3) 연속 오프 3일 제한(SCHEDULE_AUTO_MAX_OFF_STREAK): 새로 배정하는 오프 때문에
  //     기존 휴무(필휴 포함)와 연결되어 연속 휴무가 4일 이상 생기지 않게 고른다.
  //     필휴도 실제 연속 오프 구간에 포함해서 계산한다. 이미 입력된 4일 이상 연속 휴무는
  //     기존 일정을 건드리지 않고 경고로 알려주며, 그 구간을 더 늘리는 새 오프는 넣지 않는다.
  //  4) 인원별 "선호 오프 / 선호 출근 요일"(소프트 조건): 위 1)~3)의 강한 조건과
  //     필요인력 1순위 범위를 지키면서, 같은 수준의 후보끼리는 선호를 이전보다 더 적극적으로 반영한다.
  //     선호를 강제하지 않으며 필요인력/연속근무/연속오프 같은 앞선 조건을 깨지 않는다.
  //  5) 그 밖의 분산 기준(제약 없는 날 우선, 여유가 큰 날, 이미 몰린 날 회피, 빠른 날짜)
  //
  // ---- 관리자는 대상에서 제외 ----
  //  관리자(isAdmin)는 애초에 필요인력 집계에도 들어가지 않을 뿐 아니라, 자동 배치 자체의 대상에서도
  //  완전히 빠진다 — 목표 오프 개수를 계산하지도, 빈 칸에 오프를 채우지도 않는다(관리자 일정은 짤 필요가
  //  없다는 요청에 따름). 미리보기 표·요약에도 관리자는 변경 사항 없이 그대로 나온다.

  let scheduleAutoPlan = null; // 미리보기에 띄워둔 계획. 적용 버튼에서 이 값을 그대로 씀.
  let scheduleAutoChecklistCollapsed = false; // 조건 체크리스트 접힘 상태(모달을 새로 열면 초기화됨)
  let scheduleAutoSettingsLastKind = "off"; // 인원별 설정 팝업에서 마지막으로 본 탭("off" | "work")
  let scheduleAutoFitObserver = null; // 미리보기 표를 팝업 폭에 맞춰 축소할 때, 폭이 바뀌면 다시 맞추기 위한 관찰자

  // 하이브리드 자동배치: 기존 규칙으로만 유효한 후보를 여러 개 만든 뒤,
  // Groq는 그 후보의 번호만 선택한다. Groq가 일정/조건 자체를 생성하거나 수정할 수는 없다.
  const SCHEDULE_AUTO_HYBRID_CANDIDATE_COUNT = 6;
  let scheduleAutoHybridRequestId = 0;

  // 이 일수를 넘는 연속 근무(=6일째부터)는 만들지 않는다.
  const SCHEDULE_AUTO_MAX_WORK_STREAK = 5;
  // 새로 배정하는 오프가 기존 휴무(필휴 포함)와 연결되어 연속 휴무가 4일 이상 생기지 않게 한다.
  // 필휴도 연속 오프 길이에 포함한다. (필휴 자체는 자동배치가 수정하지 않는 보호 일정이다.)
  const SCHEDULE_AUTO_MAX_OFF_STREAK = 3;
  // 선호 오프 요일이 있는 인원은, 목표 오프 개수 안에서 적어도 이 개수(목표 오프 개수가 이보다
  // 작으면 목표 개수까지만)는 선호 요일에 맞추도록 마지막 보정 단계에서 우선적으로 스왑을 배정한다.
  const SCHEDULE_AUTO_PREF_FLOOR = 5;
  // ----- 최소 출근 인원 때문에 자리가 하나도 안 나는 사람을 위한 "빌려오기" 한도 -----
  // 어떤 인원이 구분별 하루 최소 출근 인원 조건에 막혀 목표 오프를 못 채우면(이응님 사례),
  // 같은 조·같은 업무구분의 동료 중 그 날 자동배치로 오프를 받은 사람의 오프를 다른 빈 날로
  // 옮겨서 자리를 만들어준다(최소출근/필요인력 허용범위·연속근무·연속오프는 그대로 지킨다).
  // 옮기는 동료의 그 날이 그 동료의 "선호 오프 요일"이었다면 선호 적중이 하나 깎이는데,
  // 이 손해를 한 사람당 최대 이 개수까지만 허용한다(선호 우선순위 자체는 바꾸지 않고,
  // 자리가 정말 안 나는 최후의 경우에만 쓰는 한도다). 선호가 아닌 날을 옮기는 건 이 한도에
  // 포함하지 않는다(공짜이므로 항상 우선 시도한다).
  const SCHEDULE_AUTO_SHORTFALL_PREF_SACRIFICE_LIMIT = 3;
  const SCHEDULE_AUTO_DOW_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

  // 대전제: 구분(조×업무구분)별 하루 최소 출근 인원.
  const SCHEDULE_AUTO_MIN_WORKING = 3;
  // 구분별 하루 최소 출근 인원. 자동 배치 팝업에서 직접 설정한다.
  let scheduleAutoMinWorkingByGroup = {
    DAY_채팅: SCHEDULE_AUTO_MIN_WORKING, DAY_유선: SCHEDULE_AUTO_MIN_WORKING,
    NIGHT_채팅: SCHEDULE_AUTO_MIN_WORKING, NIGHT_유선: SCHEDULE_AUTO_MIN_WORKING,
  };
  function scheduleAutoMinWorkingKey(g, t) { return `${g}_${t}`; }
  function scheduleAutoGetMinWorking(g, t) {
    const n = Number(scheduleAutoMinWorkingByGroup[scheduleAutoMinWorkingKey(g, t)]);
    return Number.isFinite(n) && n >= 0 ? Math.floor(n) : SCHEDULE_AUTO_MIN_WORKING;
  }

  // 연차(ANNUAL)·공가(GONGGA)·육휴(MATERNITY)·특휴(SPECIAL)는 목표 개수 계산에 포함시키지 않는다(별도 취급 요청).
  // 특휴(SPECIAL)도 연차·공가·육휴와 같이 목표 개수에서 빼지 않는다(미차감).
  // 그 밖의 오프류 중 "오프"를 뺀 나머지(대휴·공휴)는 항상 목표 개수에서 뺀다.
  const SCHEDULE_AUTO_ALWAYS_OFF_STATUSES = ["DAEHYU", "GONGHYU"];

  // 이 칸이 인원별 목표 오프 개수에서 "이미 채운 것"으로 차감돼야 하는지.
  //  - "오프"는 그 칸 메모에 "필휴"라는 문구가 있을 때만 차감한다(필휴 표시가 없는 오프는
  //    연차·공가·육휴처럼 목표 달성에 포함시키지 않는다 — 다만 칸 자체는 그대로 유지된다).
  //  - 대휴·공휴는 메모와 상관없이 항상 차감한다.
  //  - 연차·공가·육휴·특휴는 항상 차감하지 않는다.
  function scheduleAutoCountsTowardTarget(staffId, dateKey, rec) {
    if (!rec) return false;
    if (rec.status === "OFF") return getScheduleMemo(staffId, dateKey).indexOf("필휴") !== -1;
    return SCHEDULE_AUTO_ALWAYS_OFF_STATUSES.indexOf(rec.status) !== -1;
  }

  // 이미 입력된 OFF 중 "필휴" 메모가 붙은 날은 자동 배치에서 보호되는 휴무일이다.
  // 자동 배치가 새로 넣는 OFF는 항상 보호일이 아니다.
  function scheduleAutoIsProtectedOffDay(staffId, dateKey, rec) {
    return !!rec &&
      rec.status === "OFF" &&
      getScheduleMemo(staffId, dateKey).indexOf("필휴") !== -1;
  }


  // 필요인력 허용범위. 여기서 ideal/max는 "허용하는 부족 인원(대비가 -몇까지인지)"이다.
  // 금·토·월은 일반일에는 부족을 절대 허용하지 않고 0만 허용한다(ideal=0, max=0).
  // 그 외 요일(화·수·목·일)은 1순위 -1, 최후의 수단 -2까지 허용한다.
  // 대비가 +(인원이 남음)인 건 언제나 허용하고, 부족(-)만 제한한다.
  // 단, 평일(월~금) 공휴일은 요일과 관계없이 기존 예외대로 -2까지 허용한다.
  // 토요일은 평일이 아니므로 이 공휴일 예외에 포함되지 않는다.
  function scheduleAutoToleranceInfo(dow, dateKey) {
    const isWeekdayHoliday = dow !== 0 && dow !== 6 && !!getHoliday(dateKey);
    if (isWeekdayHoliday) return { ideal: 2, max: 2 };
    if (dow === 5 || dow === 6 || dow === 1) return { ideal: 0, max: 0 };
    return { ideal: 1, max: 2 };
  }

  // 대전제(구분별 하루 출근 최소 3명): 이 오프를 넣으면 그 인원이 속한 구분(조×업무구분) 중 하나라도 그 날 출근
  // 인원이 3명 미만이 되는지. 그러면 후보에서 제외한다(경고로 넘어가는 "최후의 수단"도 없다).
  // 재직 인원이 3명 미만인 구분은 오프를 하나도 안 넣어도 3명이 안 되므로 적용하지 않는다(그 구분은 경고로 알려줌).
  // minWorking는 기본값 SCHEDULE_AUTO_MIN_WORKING(3)이다(scheduleAutoBuildPlan의 options.minWorking으로만 바꿀 수 있고, 화면에서는 바꾸지 않는다).
  function scheduleAutoMinWorkingBlocked(g, staffTypes, working, totalCount, d, minWorkingByGroup) {
    return staffTypes.some((t) => {
      const key = scheduleAutoMinWorkingKey(g, t);
      const minWorking = Number(minWorkingByGroup && Object.prototype.hasOwnProperty.call(minWorkingByGroup, key)
        ? minWorkingByGroup[key] : scheduleAutoGetMinWorking(g, t));
      if (!(minWorking > 0)) return false;
      if (totalCount[g][t] < minWorking) return false;
      return working[g][t][d] - 1 < minWorking; // 이 오프를 반영했다고 가정했을 때 남는 출근 인원
    });
  }

  // ----- 추가 대전제: 주간(DAY) 유선/채팅 각 구분, 07:00 시작(이른 조) 인원 하루 최소 1명 -----
  // 근무시간(workHours) 문자열의 "시작 시각"이 07:00이면 종료 시각과 상관없이 "이른 조"로 본다
  // (예: "07:00-14:00", "07:00-16:00" 모두 해당). 위 구분별 하루 최소 출근 인원(3명)과 같은 급의
  // 강한 조건으로, 야간(NIGHT)에는 적용하지 않는다.
  const SCHEDULE_AUTO_EARLY_SHIFT_START_MIN = 7 * 60; // 07:00을 분으로 환산
  const SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING = 1;
  function scheduleAutoIsEarlyShiftStaff(s) {
    return !!s && scheduleStartMinutes(s) === SCHEDULE_AUTO_EARLY_SHIFT_START_MIN;
  }
  // 이 인원이 "이른 조"이고, 이 오프를 넣었을 때 그 인원이 속한 구분(조×업무구분) 중 하나라도
  // 그 날 이른 조 출근 인원이 0명이 되는지. DAY에서만 적용한다. 그 구분에 이른 조 인원이 애초에
  // 한 명도 없으면 지킬 수 없는 조건이므로 적용하지 않는다(그 구분은 경고로 알려줌).
  function scheduleAutoEarlyShiftBlocked(g, s, staffTypes, earlyWorking, earlyTotalCount, d) {
    if (g !== "DAY" || !scheduleAutoIsEarlyShiftStaff(s)) return false;
    return staffTypes.some((t) => {
      if (!(earlyTotalCount[g][t] >= SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING)) return false;
      return earlyWorking[g][t][d] - 1 < SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING; // 이 오프를 반영했다고 가정했을 때 남는 이른 조 출근 인원

    });
  }

  // ----- 인원별 "선호 오프 / 선호 출근 요일" (소프트 조건) -----
  // 두 설정 모두 달과 상관없이 계속 적용된다. 같은 사람의 같은 요일은 둘 중 하나만 선택할 수 있다.
  function scheduleAutoGetPrefDowsFromMap(map, staffId) {
    const entry = map && typeof map === "object" ? map[staffId] : null;
    const raw = entry && Array.isArray(entry.dows) ? entry.dows : [];
    const out = [];
    raw.forEach((n) => { if (Number.isInteger(n) && n >= 0 && n <= 6 && out.indexOf(n) === -1) out.push(n); });
    return out.sort((a, b) => a - b);
  }
  function scheduleAutoGetPrefDows(staffId) { return scheduleAutoGetPrefDowsFromMap(scheduleData.autoOffPrefs, staffId); }
  function scheduleAutoGetWorkPrefDows(staffId) { return scheduleAutoGetPrefDowsFromMap(scheduleData.autoWorkPrefs, staffId); }
  function scheduleAutoSetPrefDow(staffId, dow, kind) {
    if (!scheduleData.autoOffPrefs || typeof scheduleData.autoOffPrefs !== "object") scheduleData.autoOffPrefs = {};
    if (!scheduleData.autoWorkPrefs || typeof scheduleData.autoWorkPrefs !== "object") scheduleData.autoWorkPrefs = {};
    const targetMap = kind === "work" ? scheduleData.autoWorkPrefs : scheduleData.autoOffPrefs;
    const otherMap = kind === "work" ? scheduleData.autoOffPrefs : scheduleData.autoWorkPrefs;
    const cur = scheduleAutoGetPrefDowsFromMap(targetMap, staffId);
    const idx = cur.indexOf(dow);
    if (idx === -1) cur.push(dow); else cur.splice(idx, 1);
    cur.sort((a, b) => a - b);
    if (cur.length === 0) delete targetMap[staffId];
    else targetMap[staffId] = { dows: cur };
    const other = scheduleAutoGetPrefDowsFromMap(otherMap, staffId).filter((d) => d !== dow);
    if (other.length === 0) delete otherMap[staffId];
    else otherMap[staffId] = { dows: other };
    saveScheduleData();
  }
  function scheduleAutoTogglePrefDow(staffId, dow) { scheduleAutoSetPrefDow(staffId, dow, "off"); }
  function scheduleAutoToggleWorkPrefDow(staffId, dow) { scheduleAutoSetPrefDow(staffId, dow, "work"); }
  function scheduleAutoPrefLabel(dows) { return dows.map((n) => SCHEDULE_AUTO_DOW_LABELS[n]).join("·"); }
  // 탭 하나(선호 오프 또는 선호 출근) 전체를 통째로 비운다. 다른 쪽 탭 설정은 건드리지 않는다.
  function scheduleAutoClearPrefKind(kind) {
    const map = kind === "work" ? "autoWorkPrefs" : "autoOffPrefs";
    scheduleData[map] = {};
    saveScheduleData();
  }

  // ----- 이번 배치에서 제외할 인원 (조건) -----
  // 저장하지 않는 "이번 실행 한정" 조건. openScheduleAutoModal이 열 때마다 비운다.
  let scheduleAutoExcludedIds = [];
  function scheduleAutoGetExcluded() { return scheduleAutoExcludedIds.slice(); }
  function scheduleAutoResetExcluded() { scheduleAutoExcludedIds = []; }
  function scheduleAutoSetExcluded(staffId, on) {
    const idx = scheduleAutoExcludedIds.indexOf(staffId);
    if (on && idx === -1) scheduleAutoExcludedIds.push(staffId);
    else if (!on && idx !== -1) scheduleAutoExcludedIds.splice(idx, 1);
  }

  // ----- 연속 근무 계산 -----
  // 연속 근무일수를 셀 때 "근무일"로 보는 칸인지. 기록이 없는 칸은 기본값(근무)이다.
  // 반차·교육은 출근하는 날이라 근무일로 세고, 오프류·연차·공가·육휴·특휴·퇴사·결근은 쉬는 날로 본다.
  function scheduleAutoIsWorkRecord(rec) {
    if (!rec) return true;
    if (rec.status === "WORK") return rec.attendance !== "ABSENT";
    return rec.status === "HALF" || rec.status === "EDUCATION";
  }

  // 그 인원이 (year, monthIndex)달의 인원 명단에 있었는지. getStaffListForMonth와 달리
  // "아직 스냅샷이 없는 지난 달"이어도 스냅샷을 새로 만들어 저장하지 않는다(미리보기 계산이 데이터를 건드리면 안 되므로).
  function scheduleAutoStaffWasInMonth(staffId, year, monthIndex) {
    const key = scheduleMonthKey(year, monthIndex);
    const hist = scheduleData.staffHistory && scheduleData.staffHistory[key];
    const list = hist || scheduleData.staff || [];
    const s = list.find((x) => x && x.id === staffId);
    if (!s) return false;
    if (!hist && !scheduleIsMonthPast(year, monthIndex) && typeof s.resignDate === "string" && s.resignDate && s.resignDate.slice(0, 7) < key) return false;
    const lastDayKey = scheduleDateKey(year, monthIndex, scheduleDaysInMonth(year, monthIndex));
    if (typeof s.hireDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s.hireDate) && s.hireDate > lastDayKey) return false;
    return true;
  }

  // 지난달 말일부터 거꾸로 센 "연속 근무일수". 이번 달 1일부터 이어질 수 있는 구간이다.
  // - 지난달에도 있던 인원만 센다(지난달 명단에 없던 신규 인원은 0).
  // - 지난달에 그 인원 기록이 하나도 없으면(아직 안 짠 달) 기본값 "근무"를 전부 근무로 세면
  //   말이 안 되므로 0으로 본다.
  function scheduleAutoCarryStreak(staffId, year, monthIndex) {
    const py = monthIndex === 0 ? year - 1 : year;
    const pm = monthIndex === 0 ? 11 : monthIndex - 1;
    if (!scheduleAutoStaffWasInMonth(staffId, py, pm)) return 0;
    const prevDays = scheduleDaysInMonth(py, pm);
    let hasAny = false;
    for (let d = 1; d <= prevDays; d++) {
      if (Object.prototype.hasOwnProperty.call(scheduleData.records, scheduleRecordKey(staffId, scheduleDateKey(py, pm, d)))) { hasAny = true; break; }
    }
    if (!hasAny) return 0;
    let n = 0;
    for (let d = prevDays; d >= 1; d--) {
      const rec = scheduleData.records[scheduleRecordKey(staffId, scheduleDateKey(py, pm, d))];
      if (!scheduleAutoIsWorkRecord(rec)) break;
      n++;
    }
    return n;
  }

  // 지난달 말일부터 이어진 연속 휴무 길이(필휴 포함).
  // 지난달 기록이 하나도 없으면 기본값 근무로 보고 0으로 시작한다.
  function scheduleAutoCarryOffStreak(staffId, year, monthIndex) {
    const py = monthIndex === 0 ? year - 1 : year;
    const pm = monthIndex === 0 ? 11 : monthIndex - 1;
    if (!scheduleAutoStaffWasInMonth(staffId, py, pm)) return 0;
    const prevDays = scheduleDaysInMonth(py, pm);
    let hasAny = false;
    for (let d = 1; d <= prevDays; d++) {
      if (Object.prototype.hasOwnProperty.call(scheduleData.records, scheduleRecordKey(staffId, scheduleDateKey(py, pm, d)))) {
        hasAny = true; break;
      }
    }
    if (!hasAny) return 0;
    let n = 0;
    for (let d = prevDays; d >= 1; d--) {
      const dateKey = scheduleDateKey(py, pm, d);
      const rec = scheduleData.records[scheduleRecordKey(staffId, dateKey)];
      if (!rec || scheduleAutoIsWorkRecord(rec)) break;
      n++;
    }
    return n;
  }


  // 벡터(숫자 배열)를 앞자리부터 비교한다(클수록 좋음). 앞자리가 같을 때만 다음 자리를 본다.
  function scheduleAutoCmpVec(a, b) {
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
    }
    return 0;
  }

  // 한 인원의 오프 날짜를 "한꺼번에" 고르는 정확한 계산(동적 계획법).
  //  - K = min(needed, 빈 칸 수)개의 날짜를 빈 칸 중에서 고른다.
  //  - 가장 먼저 "5일 초과 연속 근무가 되는 근무일 수"를 최소로 만든다. 지난달 말에서 이어지는 일수(carry)도
  //    월 초에 그대로 이어서 센다. 오프 개수 안에서 못 없애는 구간은 그만큼만 남는다(늘려서 채우지 않음).
  //  - 그다음에는 날짜별 점수(dayScore(d), 클수록 좋은 숫자 배열)를 고른 날짜들에 대해 더한 값을
  //    앞자리부터 비교해 가장 좋은 조합을 고른다. 날짜를 하나씩 탐욕적으로 고르면 "선호 요일 위주로 먼저 골라
  //    놓고 나중에 연속 근무 때문에 다른 요일이 끼어드는" 식으로 손해를 볼 수 있어서 전체 조합으로 푼다.
  //  - isRest(d): 이미 쉬는 날(기록된 휴무류)인지 / isFree(d): 비어 있어서 오프를 넣을 수 있는 칸인지
  // 반환: { picked: 오름차순 날짜들, violations: 5일 초과 연속 근무가 되는 근무일 수 }
  function scheduleAutoSolveDays(opts) {
    const {
      daysInMonth, carry, offCarry = 0, limit, offLimit = SCHEDULE_AUTO_MAX_OFF_STREAK,
      needed, isRest, isFree, isProtectedRest = () => false, dayScore,
      maxWorkStreak
    } = opts;
    let freeCount = 0, firstFreeDay = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      if (!isRest(d) && isFree(d)) { freeCount++; if (!firstFreeDay) firstFreeDay = d; }
    }
    const K = Math.min(needed, freeCount);
    const hardWorkCap = Number.isInteger(maxWorkStreak) ? Math.max(limit, maxWorkStreak) : limit + 1;
    const workCap = hardWorkCap;
    // 기존 일정만으로 이미 4일 이상 이어진 휴무 구간은 그대로 둘 수 있지만,
    // 그 구간을 더 늘리는 새 OFF는 허용하지 않는다. 필휴도 이 연속 길이에 포함한다.
    const offCap = daysInMonth + 1;
    const width = 1 + (firstFreeDay ? dayScore(firstFreeDay).length : 0); // [위반 수(음수), ...날짜 점수 합]
    const zero = () => new Array(width).fill(0);

    // cur[k][workStreak][offStreak] = { v, prev, day }
    let cur = [];
    for (let k = 0; k <= K; k++) {
      cur.push(new Array(workCap + 1));
      for (let ws = 0; ws <= workCap; ws++) cur[k][ws] = new Array(offCap + 1).fill(null);
    }
    cur[0][Math.min(carry, workCap)][Math.min(offCarry, offCap)] = { v: zero(), prev: null, day: 0 };

    function relax(next, k, ws, os, v, prev, day) {
      const old = next[k][ws][os];
      if (!old || scheduleAutoCmpVec(v, old.v) > 0) next[k][ws][os] = { v, prev, day };
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const next = [];
      for (let k = 0; k <= K; k++) {
        next.push(new Array(workCap + 1));
        for (let ws = 0; ws <= workCap; ws++) next[k][ws] = new Array(offCap + 1).fill(null);
      }
      for (let k = 0; k <= K; k++) {
        for (let ws = 0; ws <= workCap; ws++) {
          for (let os = 0; os <= offCap; os++) {
            const node = cur[k][ws][os];
            if (!node) continue;
            const rest = isRest(d), free = !rest && isFree(d);

            if (rest) {
              // 기존 휴무는 모두 연속 휴무로 이어서 센다. 필휴도 포함한다.
              // 필휴 자체는 보호 일정이지만, 연속 오프 3일 제한에서는 길이를 끊지 않는다.
              const nextOs = Math.min(os + 1, offCap);
              relax(next, k, 0, nextOs, node.v, node, 0);
              continue;
            }

            // 이 날을 근무로 두는 경우.
            // 새로 만들어지는 연속 근무는 6일(=limit+1)까지만 허용한다.
            // 6일째가 불가피한 경우에는 위반 1회로 기록하되, 7일째부터는
            // 더 이어지는 상태를 만들지 않는다. 지난달에서 이미 6일을 넘겨
            // 들어온 carry는 기존 일정이므로 별도 경고로 처리한다.
            if (ws < workCap || !Number.isInteger(maxWorkStreak)) {
              const streak = Math.min(ws + 1, workCap);
              const v = node.v.slice();
              if (ws + 1 > limit) v[0] -= 1;
              relax(next, k, streak, 0, v, node, 0);
            }

            // 이 날을 새 오프로 고르는 경우.
            // 앞쪽의 기존 휴무(필휴 포함)뿐 아니라, 바로 뒤에 붙어 있는
            // 기존 휴무(필휴 포함)까지 합쳐서 3일을 넘으면 이 OFF를 금지한다.
            // 예: 10~12가 기존 휴무(12일이 메모의 필휴)라면 9일/13일 모두
            // 새 OFF로 넣을 수 없다. 필휴를 연속 휴무에서 끊는 날로 취급하지 않는다.
            if (free && k < K && os < offLimit) {
              let fixedRestAfter = 0;
              for (let rd = d + 1; rd <= daysInMonth && isRest(rd); rd++) fixedRestAfter++;
              if (os + 1 + fixedRestAfter <= offLimit) {
                const v2 = node.v.slice();
                const score = dayScore(d);
                for (let i = 0; i < score.length; i++) v2[1 + i] += score[i];
                relax(next, k + 1, 0, os + 1, v2, node, d);
              }
            }
          }
        }
      }
      cur = next;
    }

    let bestNode = null;
    for (let ws = 0; ws <= workCap; ws++) {
      for (let os = 0; os <= offCap; os++) {
        const node = cur[K][ws][os];
        if (node && (!bestNode || scheduleAutoCmpVec(node.v, bestNode.v) > 0)) bestNode = node;
      }
    }
    const picked = [];
    let violations = 0;
    if (bestNode) {
      violations = -bestNode.v[0];
      for (let n = bestNode; n; n = n.prev) if (n.day) picked.push(n.day);
    }
    picked.sort((a, b) => a - b);
    return { picked, violations };
  }


  // 최종 결과에서 limit일을 넘는 연속 근무 구간 목록. start가 1보다 작으면 지난달 말부터 이어진 구간이다.
  function scheduleAutoFindLongRuns(daysInMonth, isRest, carry, limit) {
    const runs = [];
    let streak = carry;
    let start = 1 - carry;
    for (let d = 1; d <= daysInMonth; d++) {
      if (isRest(d)) {
        if (streak > limit) runs.push({ start, end: d - 1, length: streak });
        streak = 0; start = d + 1;
        continue;
      }
      streak++;
    }
    if (streak > limit) runs.push({ start, end: daysInMonth, length: streak });
    return runs;
  }

  // 필휴를 포함해 3일을 넘는 연속 휴무 구간을 찾는다.
  // start/end는 실제 달력 날짜다.
  function scheduleAutoFindLongOffRuns(staffId, year, monthIndex, daysInMonth, carryOff, isRest) {
    const runs = [];
    let streak = carryOff;
    let start = streak > 0 ? 1 - carryOff : 1;
    for (let d = 1; d <= daysInMonth; d++) {
      if (!isRest(d)) {
        if (streak > SCHEDULE_AUTO_MAX_OFF_STREAK) runs.push({ start, end: d - 1, length: streak });
        streak = 0;
        start = d + 1;
        continue;
      }
      // 필휴도 연속 휴무에 포함되므로 별도로 끊지 않는다.
      streak++;
    }
    if (streak > SCHEDULE_AUTO_MAX_OFF_STREAK) runs.push({ start, end: daysInMonth, length: streak });
    return runs;
  }


  // 그 달의 "공휴일(평일) + 토요일 + 일요일" 개수. 공휴일이 주말과 겹치는 날은 주말 쪽으로만
  // 한 번 세어서 중복 집계되지 않게 한다.
  function scheduleAutoTargetInfo(year, monthIndex) {
    const daysInMonth = scheduleDaysInMonth(year, monthIndex);
    let holidayCount = 0, saturdayCount = 0, sundayCount = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const dow = new Date(year, monthIndex, d).getDay();
      if (dow === 6) { saturdayCount++; continue; }
      if (dow === 0) { sundayCount++; continue; }
      if (getHoliday(scheduleDateKey(year, monthIndex, d))) holidayCount++;
    }
    return { target: holidayCount + saturdayCount + sundayCount, holidayCount, saturdayCount, sundayCount };
  }

  // 이번 달 이미 목표에서 차감돼야 하는 칸 개수 (연차·공가·육휴 제외, 오프는 "필휴" 메모가 있을 때만 포함).
  function scheduleAutoAlreadyOffCount(staffId, year, monthIndex) {
    const daysInMonth = scheduleDaysInMonth(year, monthIndex);
    let n = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = scheduleDateKey(year, monthIndex, d);
      const rec = scheduleData.records[scheduleRecordKey(staffId, dateKey)];
      if (scheduleAutoCountsTowardTarget(staffId, dateKey, rec)) n++;
    }
    return n;
  }

  // 아직 아무 값도 입력되지 않은(=기본값 "근무") 날짜만 후보로 돌려준다.
  function scheduleAutoFreeDays(staffId, year, monthIndex) {
    const daysInMonth = scheduleDaysInMonth(year, monthIndex);
    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const key = scheduleRecordKey(staffId, scheduleDateKey(year, monthIndex, d));
      if (!Object.prototype.hasOwnProperty.call(scheduleData.records, key)) days.push(d);
    }
    return days;
  }

  // ----- 계획 세우기 -----
  // 실제로 scheduleData를 바꾸지 않고, "누구를 며칠에 오프로 채울지"만 계산해서 돌려준다.
  // options.excludeStaffIds: 이번 계산에서 재직 인원에 넣지 않을 인원 id들(배치 조건). 그 인원은 오프를
  // 배정받지 않고, 출근 인원수·필요인력 대비의 재직 인원수에서도 빠진다.
  function scheduleAutoBuildPlan(year, monthIndex, options) {
    const daysInMonth = scheduleDaysInMonth(year, monthIndex);
    const variant = Number.isInteger(options && options.variant) ? Math.max(0, options.variant) : 0;
    const targetInfo = scheduleAutoTargetInfo(year, monthIndex);
    const target = targetInfo.target;
    const excludeIds = new Set(options && Array.isArray(options.excludeStaffIds) ? options.excludeStaffIds : []);
    // 대전제: 구분별 하루 최소 출근 인원(기본 3). options.minWorking은 테스트·확장용 — 화면에서는 넘기지 않는다.
    let minWorkingByGroup;
    if (options && Number.isInteger(options.minWorking) && options.minWorking >= 0) {
      minWorkingByGroup = {};
      ["DAY", "NIGHT"].forEach((g) => ["채팅", "유선"].forEach((t) => { minWorkingByGroup[scheduleAutoMinWorkingKey(g, t)] = options.minWorking; }));
    } else {
      minWorkingByGroup = options && options.minWorkingByGroup && typeof options.minWorkingByGroup === "object"
        ? options.minWorkingByGroup : scheduleAutoMinWorkingByGroup;
    }
    const fullMonthStaff = getStaffListForMonth(year, monthIndex);
    const excluded = fullMonthStaff
      .filter((s) => excludeIds.has(s.id))
      .map((s) => ({ id: s.id, name: s.name, nickname: s.nickname }));
    const monthStaff = fullMonthStaff.filter((s) => !excludeIds.has(s.id));
    const TYPES = ["채팅", "유선"];
    const LIMIT = SCHEDULE_AUTO_MAX_WORK_STREAK;
    const nonAdmin = monthStaff.filter((s) => !s.isAdmin);

    // 조(DAY/NIGHT)×업무구분×날짜별 "현재 투입 인원수"를 시뮬레이션하면서 하나씩 줄여나간다.
    // (관리자는 필요인력 집계 자체에서 빠지므로 여기 포함하지 않는다 — 표 렌더링과 동일한 기준)
    const working = {};
    const required = {};
    const totalCount = {}; // 조×업무구분별 그 달 재직 인원수(최소 출근 인원 조건 계산용)
    const earlyWorking = {}; // 조×업무구분×날짜별 "이른 조(07:00 시작)" 출근 인원수(DAY에서만 사용)
    const earlyTotalCount = {}; // 조×업무구분별 그 달 이른 조 재직 인원수
    ["DAY", "NIGHT"].forEach((g) => {
      const groupStaff = nonAdmin.filter((s) => (g === "NIGHT" ? s.group === "night" : s.group !== "night"));
      working[g] = {}; required[g] = {}; totalCount[g] = {};
      earlyWorking[g] = {}; earlyTotalCount[g] = {};
      TYPES.forEach((t) => {
        working[g][t] = {}; required[g][t] = {};
        totalCount[g][t] = groupStaff.filter((s) => (s.types || []).indexOf(t) !== -1).length;
        const earlyStaff = groupStaff.filter((s) => (s.types || []).indexOf(t) !== -1 && scheduleAutoIsEarlyShiftStaff(s));
        earlyTotalCount[g][t] = earlyStaff.length;
        earlyWorking[g][t] = {};
        for (let d = 1; d <= daysInMonth; d++) {
          const dateKey = scheduleDateKey(year, monthIndex, d);
          working[g][t][d] = scheduleActualCount(groupStaff, t, dateKey);
          required[g][t][d] = getRequiredHeadcount(year, monthIndex, g, t, d);
          earlyWorking[g][t][d] = scheduleActualCount(earlyStaff, t, dateKey);
        }
      });
    });

    const assignedCountByDay = {}; // 이번 실행에서 그 날짜에 이미 몇 명 배정했는지(분산용)
    for (let d = 1; d <= daysInMonth; d++) assignedCountByDay[d] = 0;

    // 인원별로 "최소 출근 인원 조건 때문에 오프를 못 넣은 빈 칸" 날짜 목록(빌려오기 보정 단계에서 사용).
    const staffMinBlockedDayList = new Map();
    // 인원별로 "이른 조(07:00) 최소 1명 조건 때문에 오프를 못 넣은 빈 칸" 날짜 목록(빌려오기 보정 단계에서 사용).
    const staffEarlyBlockedDayList = new Map();

    const warnings = [];
    const perStaffPlan = [];
    const monthNo = monthIndex + 1;
    // 인원별 경고와 계산 맥락. 배치 뒤에 오프를 옮기는 보정 단계(선호 교환·전원 출근 해소·선호 최대화)가 있어서,
    // 경고는 바로 warnings에 넣지 않고 모아 두었다가 "최종 계획" 기준으로 다시 확정한다(옮겨진 칸에 대한 낡은 경고 방지).
    const staffWarnCtx = new Map();
    const staffWarnOrder = [];

    // 처리 순서(먼저 처리될수록 빈 칸이 아직 많이 남아 있어 유리하다):
    //  ①이월 연속근무일수(carry)가 많은 사람 우선 — 한도(5일, 불가피시 6일)에 가깝거나 이미 넘은 사람은
    //    월초 며칠 안에 오프를 넣지 못하면 그 초과를 영영 못 끊으므로 가장 급하다.
    //  ②그다음은 이번 달 남은 목표 오프 개수가 많은 사람 우선 — 빈 칸이 다른 사람 오프로 먼저
    //    소진되면 필요인력/최소출근 조건에 막혀 목표를 채울 기회 자체가 사라지기 때문이다.
    //  ③선호 요일 설정 여부는 위 두 기준이 동률일 때만 살짝 우선한다. 선호 자체는 이 순서와
    //    무관하게 개인별 점수(dayVec, 아래)와 마지막 "선호 요일 최대화" 보정 단계에서 별도로 반영되므로,
    //    선호 유무를 최우선 기준으로 두면(예전 방식) 선호 없는 고수요 인원이 항상 뒤로 밀려
    //    필요인력 하한에 막혀 목표 오프를 하나도 못 받는 문제가 있었다.
    // 관리자는 자동 배치 대상에서 완전히 제외한다. 필요인력 집계뿐 아니라 목표 오프 계산·신규 오프 배정도 하지 않는다.
    const hasPref = (id) => (scheduleAutoGetPrefDows(id).length > 0 || scheduleAutoGetWorkPrefDows(id).length > 0 ? 1 : 0);
    const order = monthStaff
      .filter((s) => !s.isAdmin)
      .map((s, idx) => ({
        s, idx,
        carry: scheduleAutoCarryStreak(s.id, year, monthIndex),
        needed: Math.max(0, target - scheduleAutoAlreadyOffCount(s.id, year, monthIndex)),
        pref: hasPref(s.id),
      }));
    order.sort((a, b) => {
      if (a.carry !== b.carry) return b.carry - a.carry;
      if (a.needed !== b.needed) return b.needed - a.needed;
      if (a.pref !== b.pref) return b.pref - a.pref;
      // 후보별로 동률 순서를 바꿔 같은 강한 조건 안에서 다른 조합을 만든다.
      if (variant % 3 === 1) return b.idx - a.idx;
      if (variant % 3 === 2) return ((a.idx + variant) % Math.max(1, order.length)) - ((b.idx + variant) % Math.max(1, order.length));
      return a.idx - b.idx;
    });

    order.forEach(({ s }) => {
      const staffLabel = s.name || s.nickname || "이름 없음";
      const alreadyOff = scheduleAutoAlreadyOffCount(s.id, year, monthIndex);
      const needed = Math.max(0, target - alreadyOff);
      const g = s.group === "night" ? "NIGHT" : "DAY";
      const staffTypes = s.isAdmin ? [] : TYPES.filter((t) => (s.types || []).indexOf(t) !== -1);
      const remainingFree = scheduleAutoFreeDays(s.id, year, monthIndex);
      const assigned = [];
      const prefDows = scheduleAutoGetPrefDows(s.id);
      const workPrefDows = scheduleAutoGetWorkPrefDows(s.id);
      const carry = scheduleAutoCarryStreak(s.id, year, monthIndex);
      const offCarry = scheduleAutoCarryOffStreak(s.id, year, monthIndex);

      // 연속 근무/오프 계산용: 이미 입력된 값 중 "쉬는 날"인 칸, 그리고 비어 있어서 오프를 넣을 수 있는 칸.
      // 대전제(구분별 출근 최소 3명)에 걸리는 날은 어떤 요일이든 빈 칸이어도 후보에서 제외한다.
      const baseRest = {}, isFreeDay = {};
      let minBlockedDays = 0; // 대전제 때문에 오프를 못 넣는 (그 인원의) 빈 칸 수 — 목표를 못 채웠을 때 원인 안내용
      const minBlockedDayList = []; // 위와 같은 날짜의 실제 번호 목록(빌려오기 보정 단계에서 사용)
      let earlyBlockedDays = 0; // 이른 조(07:00) 최소 1명 조건 때문에 오프를 못 넣는 (그 인원의) 빈 칸 수
      const earlyBlockedDayList = [];
      for (let d = 1; d <= daysInMonth; d++) {
        const key = scheduleRecordKey(s.id, scheduleDateKey(year, monthIndex, d));
        const has = Object.prototype.hasOwnProperty.call(scheduleData.records, key);
        const minBlocked = !has && scheduleAutoMinWorkingBlocked(g, staffTypes, working, totalCount, d, minWorkingByGroup);
        const earlyBlocked = !has && !minBlocked && scheduleAutoEarlyShiftBlocked(g, s, staffTypes, earlyWorking, earlyTotalCount, d);
        if (minBlocked) { minBlockedDays++; minBlockedDayList.push(d); }
        if (earlyBlocked) { earlyBlockedDays++; earlyBlockedDayList.push(d); }
        isFreeDay[d] = !has && !minBlocked && !earlyBlocked;
        baseRest[d] = has && !scheduleAutoIsWorkRecord(scheduleData.records[key]);
      }
      staffMinBlockedDayList.set(s.id, minBlockedDayList);
      staffEarlyBlockedDayList.set(s.id, earlyBlockedDayList);
      const chosen = {};
      if (typeof globalThis.__DEBUG_STAFF !== "undefined" && s.id === globalThis.__DEBUG_STAFF) {
        console.log("DEBUG", s.id, "needed", needed, "carry", carry, "offCarry", offCarry, "minBlockedDays", minBlockedDays, "remainingFree", remainingFree.length, "freeAfterBlock", remainingFree.filter(d=>isFreeDay[d]).length);
      }


      // 날짜별 점수(클수록 좋고, 앞 항목이 우선. 고른 날짜들의 합을 앞자리부터 비교한다):
      // ① 그 인원의 조×업무구분 필요인력이 최후 허용범위 안인지
      // ② 모두 출근 상태를 해소하는지
      // ③ 선호 오프/선호 출근인지
      // ④ 1순위 필요인력 범위인지 ⑤ 제약 없음 ⑥ 여유 ⑦ 분산 ⑧ 빠른 날짜
      // ※ 선호는 이 단계에서 반영하고, 아래 최종 보정 단계에서 서로의 오프를 안전하게 교환해
      //    선호가 실제 결과에 더 많이 반영되도록 한다. 강한 조건을 깨는 교환은 하지 않는다.
      const dayFeasible = {}, dayVec = {};
      remainingFree.forEach((d) => {
        const dow = new Date(year, monthIndex, d).getDay();
        const dateKey = scheduleDateKey(year, monthIndex, d);
        const tolInfo = scheduleAutoToleranceInfo(dow, dateKey);
        let idealOk = true, maxOk = true;
        let hasConstraint = false;
        let minSlack = Infinity;
        let breaksAllWorking = false;
        staffTypes.forEach((t) => {
          const req = required[g][t][d];
          if (req === null) return;
          hasConstraint = true;
          const beforeWorking = working[g][t][d];
          const total = totalCount[g][t];
          // 현재 이 구분의 모든 인원이 출근 중이고, 바로 이 인원에게 오프를 넣으면
          // 해당 구분의 '모두 출근' 상태가 해소된다. 이런 날짜를 최우선으로 선택한다.
          const breaksThisGroupAllWorking = total > 0 && beforeWorking === total;
          if (breaksThisGroupAllWorking) breaksAllWorking = true;
          const diff = (beforeWorking - 1) - req;
          // 대비(diff)가 +(인원이 남음)이면 항상 허용, 부족(-)일 때만 제한한다.
          // 모든 인원 출근 상태를 해소하는 날짜에 한해서만 필요하면 -1까지 추가 허용한다.
          const effectiveMax = breaksThisGroupAllWorking ? Math.max(tolInfo.max, 1) : tolInfo.max;
          if (-diff > tolInfo.ideal) idealOk = false;
          if (-diff > effectiveMax) maxOk = false;
          minSlack = Math.min(minSlack, effectiveMax + diff); // 클수록 여유(인원이 더 남을수록 안전)
        });
        // 경고("허용범위를 벗어나 배치됐어요")는 "최후의 수단 범위"까지 넘겼을 때만 띄운다.
        // 1순위 범위를 못 맞춰 최후의 수단 범위로 배치된 건 정상 동작이라 경고 대상이 아니다.
        dayFeasible[d] = maxOk;
        const prefWeight = [3, 5, 2, 4, 6, 1][variant % 6];
        const workPrefWeight = [3, 5, 2, 4, 6, 1][(variant + 2) % 6];
        const prefScore = prefDows.indexOf(dow) !== -1 ? prefWeight : (workPrefDows.indexOf(dow) !== -1 ? -workPrefWeight : 0);
        const distributionWeight = [1, 2, 1, 3, 2, 1][variant % 6];
        // 우선순위: ① 최후 허용범위(maxOk)를 벗어나지 않는 것 → ② 선호 오프/출근 →
        // ③ 이상적인 필요인력 범위 → ④ 모두 출근 상태 해소 → ⑤ 여유/분산/날짜.
        // 이전에는 "모든 인원이 출근 중인 날을 해소"가 선호보다 앞에 있어,
        // 선호일을 선택해도 충분히 조정 가능한 상황에서 비선호일로 밀리는 문제가 있었다.
        // 선호를 강제하지는 않되, 강한 조건을 지키는 후보끼리는 선호를 더 우선한다.
        dayVec[d] = [
          maxOk ? 1 : 0,
          prefScore,
          idealOk ? 1 : 0,
          breaksAllWorking ? 1 : 0,
          hasConstraint ? 0 : 1,
          hasConstraint ? minSlack : 0,
          -assignedCountByDay[d] * distributionWeight,
          variant % 2 ? d : -d,
        ];
      });
      const tolWarn = []; // 필요인력 허용범위를 넘겨 배치된 칸 — 나중에 그 칸이 옮겨지면 경고도 함께 사라진다
      const solved = scheduleAutoSolveDays({
        daysInMonth, carry, limit: LIMIT, maxWorkStreak: 6, needed,
        isRest: (d) => !!baseRest[d],
        // 필요인력 허용범위(최후 기준, dayFeasible)를 넘기는 날은 애초에 후보에서 제외한다.
        // 이전에는 dayFeasible이 dayScore(점수)에만 반영돼서, 연속근무 5일 제한을 지키려고
        // 오히려 필요인력 허용범위를 넘는 날을 골라버리는 경우가 있었다(그 반대가 맞다:
        // 필요인력 허용범위는 -2/0에서 더 물러설 수단이 없는 절대 기준이고, 연속근무는
        // 6일까지 예외가 있는 쪽이라 필요인력 쪽이 먼저 지켜져야 한다).
        isFree: (d) => !!isFreeDay[d] && !!dayFeasible[d],
        isProtectedRest: (d) => {
          const dateKey = scheduleDateKey(year, monthIndex, d);
          const rec = scheduleData.records[scheduleRecordKey(s.id, dateKey)];
          return scheduleAutoIsProtectedOffDay(s.id, dateKey, rec);
        },
        offCarry,
        offLimit: SCHEDULE_AUTO_MAX_OFF_STREAK,
        dayScore: (d) => dayVec[d],
      });
      solved.picked.forEach((d) => {
        if (!dayFeasible[d]) {
          tolWarn.push({ d, text: `${staffLabel}님 ${monthNo}/${d} — 필요인력 허용범위를 벗어나 배치됐어요. 확인해주세요.` });
        }
        assigned.push(d);
        chosen[d] = true;
        assignedCountByDay[d] += 1;
        staffTypes.forEach((t) => { working[g][t][d] -= 1; });
        if (scheduleAutoIsEarlyShiftStaff(s)) staffTypes.forEach((t) => { earlyWorking[g][t][d] -= 1; });
      });

      let shortfallText = null;
      if (assigned.length < needed) {
        const minNote = minBlockedDays > 0
          ? ` 구분별 하루 출근 최소 인원 조건을 지키느라 오프를 넣을 수 없는 날이 ${minBlockedDays}일 있어요.`
          : "";
        const earlyNote = earlyBlockedDays > 0
          ? ` 주간 유선/채팅 07:00 근무 인원 최소 1명 조건을 지키느라 오프를 넣을 수 없는 날이 ${earlyBlockedDays}일 있어요.`
          : "";
        shortfallText = `${staffLabel}님은 빈 칸이 부족해 목표 ${needed}개 중 ${assigned.length}개만 배정됐어요.${minNote}${earlyNote}`;
      }

      // 연속 휴무/연속 근무 경고는 오프를 옮기는 보정 단계가 끝난 뒤 최종 계획으로 계산한다(flushStaffWarnings).
      staffWarnCtx.set(s.id, {
        label: staffLabel, g, staffTypes, carry, offCarry, baseRest,
        prefSet: new Set(prefDows), workPrefSet: new Set(workPrefDows),
        tolWarn, shortfallText, isEarly: scheduleAutoIsEarlyShiftStaff(s),
      });
      staffWarnOrder.push(s.id);

      if (needed > 0 || assigned.length > 0) {
        const sorted = assigned.slice().sort((a, b) => a - b);
        perStaffPlan.push({
          staffId: s.id,
          name: s.name,
          nickname: s.nickname,
          alreadyOff,
          needed,
          assigned: sorted,
          carry,
          prefDows,
          prefHits: sorted.filter((d) => prefDows.indexOf(new Date(year, monthIndex, d).getDay()) !== -1).length,
          ...(workPrefDows.length ? { workPrefDows, workPrefHits: sorted.filter((d) => workPrefDows.indexOf(new Date(year, monthIndex, d).getDay()) === -1).length } : {}),
        });
      }
    });

    // ----- 선호 오프/출근 최종 보정 -----
    // 사람별로 독립적으로 오프를 고르면, 앞에서 처리된 다른 사람이 선호일을 먼저 차지해
    // 뒤 사람의 선호가 사라질 수 있다. 여기서는 같은 조·같은 업무구분의 두 사람 사이에서만
    // "선호일 OFF ↔ 비선호일 OFF"를 교환한다. 두 사람의 하루 출근 인원수는 그대로라서
    // 필요인력/최소출근 조건을 건드리지 않고, 양쪽의 연속근무·연속휴무 한도도 다시 검사한다.
    function autoPlanIsWorkFor(staffId, d, assignedSet) {
      const key = scheduleRecordKey(staffId, scheduleDateKey(year, monthIndex, d));
      const rec = scheduleData.records[key];
      if (rec) return scheduleAutoIsWorkRecord(rec) && !assignedSet.has(d);
      return !assignedSet.has(d);
    }
    function autoPlanValidSet(staffId, assignedSet) {
      let workStreak = scheduleAutoCarryStreak(staffId, year, monthIndex);
      let offStreak = scheduleAutoCarryOffStreak(staffId, year, monthIndex);
      for (let d = 1; d <= daysInMonth; d++) {
        const key = scheduleRecordKey(staffId, scheduleDateKey(year, monthIndex, d));
        const rec = scheduleData.records[key];
        const isOff = assignedSet.has(d) || (!!rec && !scheduleAutoIsWorkRecord(rec));
        if (isOff) {
          offStreak++;
          workStreak = 0;
          if (offStreak > SCHEDULE_AUTO_MAX_OFF_STREAK) return false;
        } else {
          offStreak = 0;
          workStreak++;
          if (workStreak > SCHEDULE_AUTO_MAX_WORK_STREAK + 1) return false;
        }
      }
      return true;
    }
    const planById = new Map(perStaffPlan.map((p) => [p.staffId, p]));
    const staffById = new Map(monthStaff.map((s) => [s.id, s]));

    // 선호 오프 교환처럼 두 사람의 자동 오프 위치를 동시에 바꾸는 단계에서는
    // 개별 인원의 연속근무/휴무만 검사해서는 안 된다. 특히 07:00 시작 인원이
    // 아닌 사람과 이른 조 인원의 오프를 교환하면, 초기 배치에서 지켜졌던
    // "주간 유선/채팅 07:00 최소 1명" 조건이 깨질 수 있다.
    // 현재 perStaffPlan을 기준으로 overrides에 들어온 인원만 새 오프 집합으로
    // 대체해, 두 사람의 교환 결과 전체를 다시 계산한다.
    function autoPlanEarlyValidWithOverrides(overrides) {
      for (const t of TYPES) {
        if (earlyTotalCount.DAY[t] < SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING) continue;
        const earlyStaff = nonAdmin.filter((st) =>
          st.group !== "night" &&
          (st.types || []).indexOf(t) !== -1 &&
          scheduleAutoIsEarlyShiftStaff(st)
        );
        for (let d = 1; d <= daysInMonth; d++) {
          const dateKey = scheduleDateKey(year, monthIndex, d);
          let workingCount = 0;
          for (const st of earlyStaff) {
            const rec = scheduleData.records[scheduleRecordKey(st.id, dateKey)];
            const override = overrides && overrides.get(st.id);
            const currentPlan = override || (() => {
              const p = planById.get(st.id);
              return p ? new Set(p.assigned) : new Set();
            })();
            const isOff = currentPlan.has(d) || (!!rec && !scheduleAutoIsWorkRecord(rec));
            if (!isOff) workingCount++;
          }
          if (workingCount < SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING) return false;
        }
      }
      return true;
    }

    // ----- 최소 출근 인원 때문에 자리가 안 나는 사람을 위한 "빌려오기" 보정 -----
    // (이응님 사례) 어떤 인원이 목표 오프 개수를 다 못 채운 게 "구분별 하루 최소 출근 인원"
    // 조건 때문이면, 같은 조·업무구분의 동료 중 그 날 자동배치로 오프를 받은 사람의 오프를
    // 다른 빈 날로 옮겨서 그 자리를 대신 내어준다. 선호 반영 우선순위 자체는 그대로 두되(이
    // 단계는 선호 요일 최대화보다 먼저 실행해 부족 인원에게 빈 칸을 최우선으로 확보해 준다),
    // 동료의 그 날이 동료 자신의 선호 오프 요일이었을 때만 "선호 적중 1개 손해"로 치고,
    // 그 손해를 동료 한 명당 SCHEDULE_AUTO_SHORTFALL_PREF_SACRIFICE_LIMIT(3)개까지만 허용한다.
    // 선호와 무관한 날을 옮기는 건 공짜이므로 항상 먼저 시도한다.
    // 이미 입력된 칸(필휴·연차 등)과 이번 실행에서 아직 배정 안 된 빈 칸은 건드리지 않는다.
    const sacrificedPrefByStaff = new Map(); // staffId -> 이번 보정으로 깎인 선호 오프 적중 개수(누적, 한도 체크용)

    // day의 (group×type) 실제 투입 인원이, 거기 새로 오프 하나를 더 넣어도(=1명 줄어도) 안전한지.
    // 최소 출근 인원(예외 없음)과 필요인력 허용범위(최후 기준, tolInfo.max)를 함께 본다.
    // isEarly: 이 슬롯을 내주는(또는 받는) 인원이 "이른 조(07:00 시작)"인지. 이른 조 인원이면
    // 주간 07:00 최소 1명 조건도 함께 확인한다(야간은 대상이 아니다).
    function scheduleAutoBorrowSlotFeasible(g, types, d, isEarly) {
      const dow = new Date(year, monthIndex, d).getDay();
      const dateKey = scheduleDateKey(year, monthIndex, d);
      const tolInfo = scheduleAutoToleranceInfo(dow, dateKey);
      return types.every((t) => {
        const key = scheduleAutoMinWorkingKey(g, t);
        const minWorking = Number(Object.prototype.hasOwnProperty.call(minWorkingByGroup, key) ? minWorkingByGroup[key] : scheduleAutoGetMinWorking(g, t));
        const total = totalCount[g][t];
        if (minWorking > 0 && total >= minWorking && working[g][t][d] - 1 < minWorking) return false;
        const req = required[g][t][d];
        if (req !== null && req !== undefined) {
          const diff = (working[g][t][d] - 1) - req;
          if (-diff > tolInfo.max) return false;
        }
        if (g === "DAY" && isEarly && earlyTotalCount[g][t] >= SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING) {
          if (earlyWorking[g][t][d] - 1 < SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING) return false;
        }
        return true;
      });
    }
    function scheduleAutoApplyOffDelta(types, g, d, delta, isEarly) {
      types.forEach((t) => { if (working[g] && working[g][t]) working[g][t][d] += delta; });
      if (isEarly) types.forEach((t) => { if (earlyWorking[g] && earlyWorking[g][t]) earlyWorking[g][t][d] += delta; });
    }
    function scheduleAutoStaffTypesOf(st) { return TYPES.filter((t) => (st.types || []).indexOf(t) !== -1); }

    function scheduleAutoBorrowFor(targetPlan) {
      const targetStaff = staffById.get(targetPlan.staffId);
      if (!targetStaff) return;
      const g = targetStaff.group === "night" ? "NIGHT" : "DAY";
      const staffTypes = scheduleAutoStaffTypesOf(targetStaff);
      if (!staffTypes.length) return;
      const targetIsEarly = scheduleAutoIsEarlyShiftStaff(targetStaff);
      const blockedDays = (staffMinBlockedDayList.get(targetPlan.staffId) || []).slice();
      let gap = targetPlan.needed - targetPlan.assigned.length;

      blockedDays.forEach((d) => {
        if (gap <= 0) return;
        if (targetPlan.assigned.indexOf(d) !== -1) return;
        const targetKey = scheduleRecordKey(targetPlan.staffId, scheduleDateKey(year, monthIndex, d));
        if (Object.prototype.hasOwnProperty.call(scheduleData.records, targetKey)) return;
        const nextTargetSet = new Set(targetPlan.assigned); nextTargetSet.add(d);
        if (!autoPlanValidSet(targetPlan.staffId, nextTargetSet)) return;

        const dow = new Date(year, monthIndex, d).getDay();
        let candidates = perStaffPlan.filter((p) => {
          if (p.staffId === targetPlan.staffId) return false;
          const st = staffById.get(p.staffId);
          if (!st) return false;
          const sg = st.group === "night" ? "NIGHT" : "DAY";
          if (sg !== g) return false;
          const sTypes = scheduleAutoStaffTypesOf(st);
          if (!sTypes.some((t) => staffTypes.indexOf(t) !== -1)) return false;
          return p.assigned.indexOf(d) !== -1;
        });
        // 선호 요일이 아닌(=공짜인) 동료부터 시도한다.
        candidates = candidates.slice().sort((a, b) => {
          const costA = (a.prefDows || []).indexOf(dow) !== -1 ? 1 : 0;
          const costB = (b.prefDows || []).indexOf(dow) !== -1 ? 1 : 0;
          return costA - costB;
        });

        const moved = []; // 롤백용: { sourcePlan, sTypes, oldAssigned, oldPrefHits, d2 }
        for (const sourcePlan of candidates) {
          if (scheduleAutoBorrowSlotFeasible(g, staffTypes, d, targetIsEarly)) break;
          const st = staffById.get(sourcePlan.staffId);
          const sTypes = scheduleAutoStaffTypesOf(st);
          const sIsEarly = scheduleAutoIsEarlyShiftStaff(st);
          const isPrefDay = (sourcePlan.prefDows || []).indexOf(dow) !== -1;
          const used = sacrificedPrefByStaff.get(sourcePlan.staffId) || 0;
          if (isPrefDay && used >= SCHEDULE_AUTO_SHORTFALL_PREF_SACRIFICE_LIMIT) continue;

          const sourceAssignedSet = new Set(sourcePlan.assigned);
          let d2Found = -1;
          for (let d2 = 1; d2 <= daysInMonth; d2++) {
            if (d2 === d || sourceAssignedSet.has(d2)) continue;
            const key2 = scheduleRecordKey(sourcePlan.staffId, scheduleDateKey(year, monthIndex, d2));
            if (Object.prototype.hasOwnProperty.call(scheduleData.records, key2)) continue;
            if (!scheduleAutoBorrowSlotFeasible(g, sTypes, d2, sIsEarly)) continue;
            const nextSourceSet = new Set(sourceAssignedSet); nextSourceSet.delete(d); nextSourceSet.add(d2);
            if (!autoPlanValidSet(sourcePlan.staffId, nextSourceSet)) continue;
            d2Found = d2;
            break;
          }
          if (d2Found === -1) continue;

          const oldAssigned = sourcePlan.assigned.slice();
          const oldPrefHits = sourcePlan.prefHits || 0;
          scheduleAutoApplyOffDelta(sTypes, g, d, +1, sIsEarly);
          scheduleAutoApplyOffDelta(sTypes, g, d2Found, -1, sIsEarly);
          sourcePlan.assigned = oldAssigned.filter((x) => x !== d).concat([d2Found]).sort((a, b) => a - b);
          if (sourcePlan.prefDows) {
            sourcePlan.prefHits = sourcePlan.assigned.filter((x) => sourcePlan.prefDows.indexOf(new Date(year, monthIndex, x).getDay()) !== -1).length;
          }
          const newPrefHits = sourcePlan.prefHits || 0;
          const sacrificedDelta = Math.max(0, oldPrefHits - newPrefHits);
          if (sacrificedDelta > 0) sacrificedPrefByStaff.set(sourcePlan.staffId, used + sacrificedDelta);
          moved.push({ sourcePlan, sTypes, oldAssigned, oldPrefHits, d2: d2Found, sacrificedDelta, sIsEarly });
        }

        if (!scheduleAutoBorrowSlotFeasible(g, staffTypes, d, targetIsEarly)) {
          // 이 날짜는 결국 못 풀었다 — 이번에 옮긴 것들을 전부 원위치(날짜·선호 적중·손해 한도)로 되돌린다.
          moved.forEach(({ sourcePlan, sTypes, oldAssigned, oldPrefHits, d2, sacrificedDelta, sIsEarly }) => {
            scheduleAutoApplyOffDelta(sTypes, g, d, -1, sIsEarly);
            scheduleAutoApplyOffDelta(sTypes, g, d2, +1, sIsEarly);
            sourcePlan.assigned = oldAssigned;
            sourcePlan.prefHits = oldPrefHits;
            if (sacrificedDelta > 0) {
              const used = sacrificedPrefByStaff.get(sourcePlan.staffId) || 0;
              sacrificedPrefByStaff.set(sourcePlan.staffId, Math.max(0, used - sacrificedDelta));
            }
          });
          return;
        }

        scheduleAutoApplyOffDelta(staffTypes, g, d, -1, targetIsEarly);
        targetPlan.assigned = targetPlan.assigned.concat([d]).sort((a, b) => a - b);
        gap--;
      });
    }

    perStaffPlan
      .filter((p) => (staffMinBlockedDayList.get(p.staffId) || []).length > 0 && p.needed > p.assigned.length)
      .sort((a, b) => (b.needed - b.assigned.length) - (a.needed - a.assigned.length))
      .forEach(scheduleAutoBorrowFor);

    // 이번 보정으로 부족분이 줄었거나 해소됐으면, 경고 문구도 최신 배정 개수 기준으로 다시 만든다.
    perStaffPlan.forEach((p) => {
      const ctx = staffWarnCtx.get(p.staffId);
      if (!ctx || !ctx.shortfallText) return;
      if (p.assigned.length >= p.needed) { ctx.shortfallText = null; return; }
      const stillBlocked = (staffMinBlockedDayList.get(p.staffId) || []).filter((d) => p.assigned.indexOf(d) === -1).length;
      const minNote = stillBlocked > 0
        ? ` 구분별 하루 출근 최소 인원 조건을 지키느라 오프를 넣을 수 없는 날이 ${stillBlocked}일 있어요.`
        : "";
      ctx.shortfallText = `${ctx.label}님은 빈 칸이 부족해 목표 ${p.needed}개 중 ${p.assigned.length}개만 배정됐어요.${minNote}`;
    });

    // 목표선(SCHEDULE_AUTO_PREF_FLOOR, 목표 오프 개수보다 작으면 그 개수까지)에 아직 못 미친 사람을
    // 가장 먼저 처리해 남은 스왑 기회를 우선 배정한다. 목표선을 채운 사람들 사이에서는 (기존처럼)
    // 선호 요일을 더 많이 설정한 사람 순으로 추가 최적화를 시도한다.
    const prefRepairOrder = perStaffPlan
      .filter((p) => (p.prefDows && p.prefDows.length) || (p.workPrefDows && p.workPrefDows.length))
      .slice()
      .sort((a, b) => {
        const floorA = (a.prefDows && a.prefDows.length) ? Math.min(a.needed, SCHEDULE_AUTO_PREF_FLOOR) : 0;
        const floorB = (b.prefDows && b.prefDows.length) ? Math.min(b.needed, SCHEDULE_AUTO_PREF_FLOOR) : 0;
        const gapA = Math.max(0, floorA - (a.prefHits || 0));
        const gapB = Math.max(0, floorB - (b.prefHits || 0));
        if (gapA !== gapB) return gapB - gapA;
        return ((b.prefDows?.length || 0) + (b.workPrefDows?.length || 0)) - ((a.prefDows?.length || 0) + (a.workPrefDows?.length || 0));
      });

    prefRepairOrder.forEach((targetPlan) => {
      const targetStaff = staffById.get(targetPlan.staffId);
      if (!targetStaff) return;
      const targetPref = new Set(targetPlan.prefDows || []);
      const targetWorkPref = new Set(targetPlan.workPrefDows || []);
      const targetAssigned = new Set(targetPlan.assigned);
      const targetGroup = targetStaff.group === "night" ? "NIGHT" : "DAY";
      const targetTypes = TYPES.filter((t) => (targetStaff.types || []).indexOf(t) !== -1).sort().join("|");

      for (let d = 1; d <= daysInMonth; d++) {
        const dow = new Date(year, monthIndex, d).getDay();
        if (!targetPref.has(dow) || targetAssigned.has(d)) continue;
        const targetKey = scheduleRecordKey(targetPlan.staffId, scheduleDateKey(year, monthIndex, d));
        if (Object.prototype.hasOwnProperty.call(scheduleData.records, targetKey)) continue;

        let swapped = false;
        for (const sourcePlan of perStaffPlan) {
          if (sourcePlan.staffId === targetPlan.staffId) continue;
          const sourceStaff = staffById.get(sourcePlan.staffId);
          if (!sourceStaff) continue;
          const sourceGroup = sourceStaff.group === "night" ? "NIGHT" : "DAY";
          const sourceTypes = TYPES.filter((t) => (sourceStaff.types || []).indexOf(t) !== -1).sort().join("|");
          if (sourceGroup !== targetGroup || sourceTypes !== targetTypes) continue;
          const sourceAssigned = new Set(sourcePlan.assigned);
          if (!sourceAssigned.has(d)) continue;
          const sourcePref = new Set(sourcePlan.prefDows || []);
          const sourceWorkPref = new Set(sourcePlan.workPrefDows || []);
          if (sourcePref.has(dow) || sourceWorkPref.has(dow)) continue;

          // target가 가진 비선호 OFF를 source에게 넘긴다. source의 선호일이면 교환하지 않는다.
          const swapOut = targetPlan.assigned.find(x => {
            if (targetPref.has(new Date(year, monthIndex, x).getDay())) return false;
            if (targetWorkPref.has(new Date(year, monthIndex, x).getDay())) return false;
            const sourceKey = scheduleRecordKey(sourcePlan.staffId, scheduleDateKey(year, monthIndex, x));
            return !Object.prototype.hasOwnProperty.call(scheduleData.records, sourceKey);
          });
          if (!swapOut) continue;

          const nextTarget = new Set(targetAssigned);
          nextTarget.delete(swapOut); nextTarget.add(d);
          const nextSource = new Set(sourceAssigned);
          nextSource.delete(d); nextSource.add(swapOut);
          if (!autoPlanValidSet(targetPlan.staffId, nextTarget) || !autoPlanValidSet(sourcePlan.staffId, nextSource)) continue;

          // 두 사람의 교환 결과를 동시에 대입해서, 주간 유선/채팅의 07:00
          // 시작 인원이 하루라도 0명이 되지 않는지 확인한다.
          const earlyOverrides = new Map([
            [targetPlan.staffId, nextTarget],
            [sourcePlan.staffId, nextSource],
          ]);
          if (!autoPlanEarlyValidWithOverrides(earlyOverrides)) continue;

          targetAssigned.clear(); nextTarget.forEach(x => targetAssigned.add(x));
          sourceAssigned.clear(); nextSource.forEach(x => sourceAssigned.add(x));
          targetPlan.assigned = Array.from(targetAssigned).sort((a, b) => a - b);
          sourcePlan.assigned = Array.from(sourceAssigned).sort((a, b) => a - b);
          targetPlan.prefHits = targetPlan.assigned.filter(x => targetPref.has(new Date(year, monthIndex, x).getDay())).length;
          if (sourcePlan.prefDows) sourcePlan.prefHits = sourcePlan.assigned.filter(x => sourcePref.has(new Date(year, monthIndex, x).getDay())).length;
          swapped = true;
          break;
        }
        if (swapped) continue;
      }
    });

    // ----- 모두 출근하는 날 최종 제거 -----
    // 자동으로 새 오프를 하나 더 만드는 것이 아니라, 이미 자동 배치된 오프의 위치를
    // 교환해서 해결한다. 따라서 월 오프 총량은 그대로 유지한다.
    // 대상일의 최소 출근 인원/필요인력 허용범위를 지키고, 이동한 오프의 원래 날짜가
    // 다시 모두 출근 상태가 되지 않도록 검사한다. 기존에 입력된 일정은 절대 이동하지 않는다.
    function repairAllWorkingDays() {
      let repaired = 0;
      let changed = true;
      let guard = 0;
      while (changed && guard++ < daysInMonth * Math.max(1, perStaffPlan.length) * 2) {
        changed = false;
        const currentWorking = {};
        const currentEarlyWorking = {};
        ["DAY", "NIGHT"].forEach((g) => {
          currentWorking[g] = {};
          currentEarlyWorking[g] = {};
          TYPES.forEach((t) => {
            currentWorking[g][t] = {};
            currentEarlyWorking[g][t] = {};
            const groupStaff = nonAdmin.filter((st) => (g === "NIGHT" ? st.group === "night" : st.group !== "night") && (st.types || []).indexOf(t) !== -1);
            const earlyGroupStaff = groupStaff.filter((st) => scheduleAutoIsEarlyShiftStaff(st));
            for (let d = 1; d <= daysInMonth; d++) {
              const dateKey = scheduleDateKey(year, monthIndex, d);
              let w = scheduleActualCount(groupStaff, t, dateKey);
              let ew = scheduleActualCount(earlyGroupStaff, t, dateKey);
              groupStaff.forEach((st) => {
                const set = planByIdForRepair.get(st.id);
                if (set && set.has(d)) w -= 1;
              });
              earlyGroupStaff.forEach((st) => {
                const set = planByIdForRepair.get(st.id);
                if (set && set.has(d)) ew -= 1;
              });
              currentWorking[g][t][d] = w;
              currentEarlyWorking[g][t][d] = ew;
            }
          });
        });

        let fixedOne = false;
        for (const g of ["DAY", "NIGHT"]) {
          if (fixedOne) break;
          // 전원 출근의 기준은 조(DAY/NIGHT) 전체 인원이다. 채팅/유선 중 한 업무의
          // 일부 인원만 전원 출근인 것은 '구분 전체 전원 출근'으로 보지 않는다.
          const groupStaff = nonAdmin.filter((st) => g === "NIGHT" ? st.group === "night" : st.group !== "night");
          const total = groupStaff.length;
          if (total <= 0) continue;

          for (let d = 1; d <= daysInMonth; d++) {
            const targetDateKey = scheduleDateKey(year, monthIndex, d);
            let groupWorking = 0;
            for (const st of groupStaff) {
              const rec = scheduleData.records[scheduleRecordKey(st.id, targetDateKey)];
              const set = planByIdForRepair.get(st.id);
              const isOff = (set && set.has(d)) || (rec && !scheduleAutoIsWorkRecord(rec));
              if (!isOff) groupWorking++;
            }
            if (groupWorking !== total) continue;

            const targetDow = new Date(year, monthIndex, d).getDay();
            // 이 조의 전원 출근을 해소할 사람을 찾되, 그 사람의 모든 업무구분에서
            // 최소 출근 인원과 전원 출근 해소용 허용범위를 함께 확인한다.
            for (const st of groupStaff) {
              const plan = perStaffPlan.find((x) => x.staffId === st.id);
              if (!plan) continue;
              const assigned = new Set(plan.assigned);
              const targetKey = scheduleRecordKey(st.id, targetDateKey);
              if (assigned.has(d) || Object.prototype.hasOwnProperty.call(scheduleData.records, targetKey)) continue;

              let targetSafe = true;
              for (const t of TYPES) {
                if ((st.types || []).indexOf(t) === -1) continue;
                const typeWorking = currentWorking[g][t][d];
                const minWorking = Number(minWorkingByGroup[scheduleAutoMinWorkingKey(g, t)] ?? SCHEDULE_AUTO_MIN_WORKING);
                if (typeWorking - 1 < minWorking) { targetSafe = false; break; }
                const targetReq = required[g][t][d];
                if (targetReq !== null && targetReq !== undefined) {
                  const tol = scheduleAutoToleranceInfo(targetDow, targetDateKey);
                  const effectiveMax = Math.max(Number(tol.max || 0), 1);
                  if (targetReq - (typeWorking - 1) > effectiveMax) { targetSafe = false; break; }
                }
                // 주간 07:00 근무 인원 최소 1명 조건: 이 사람이 이른 조라면, 오프를 넣었을 때
                // 그 구분의 이른 조 출근 인원이 0명이 되지 않는지도 함께 확인한다.
                if (g === "DAY" && scheduleAutoIsEarlyShiftStaff(st) && earlyTotalCount[g][t] >= SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING) {
                  const earlyTypeWorking = currentEarlyWorking[g][t][d];
                  if (earlyTypeWorking - 1 < SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING) { targetSafe = false; break; }
                }
              }
              if (!targetSafe) continue;

              for (const sourceDay of plan.assigned.slice()) {
                if (sourceDay === d) continue;
                const sourceDateKey = scheduleDateKey(year, monthIndex, sourceDay);
                const sourceKey = scheduleRecordKey(st.id, sourceDateKey);
                if (Object.prototype.hasOwnProperty.call(scheduleData.records, sourceKey)) continue;

                // OFF를 원래 날짜에서 빼면 그 날짜에 전원 출근이 생기는 교환은 금지한다.
                let sourceWouldBeAllWorking = true;
                for (const sourceStaff of groupStaff) {
                  const sourceRec = scheduleData.records[scheduleRecordKey(sourceStaff.id, sourceDateKey)];
                  const sourceSet = planByIdForRepair.get(sourceStaff.id);
                  const sourceIsOff = (sourceSet && sourceSet.has(sourceDay)) || (sourceRec && !scheduleAutoIsWorkRecord(sourceRec));
                  if (sourceStaff.id === st.id) continue;
                  if (sourceIsOff) { sourceWouldBeAllWorking = false; break; }
                }
                if (sourceWouldBeAllWorking) continue;

                const next = new Set(assigned);
                next.delete(sourceDay);
                next.add(d);
                if (!autoPlanValidSet(st.id, next)) continue;

                plan.assigned = Array.from(next).sort((x, y) => x - y);
                planByIdForRepair.set(st.id, new Set(plan.assigned));
                if (plan.prefDows) {
                  const pref = new Set(plan.prefDows);
                  plan.prefHits = plan.assigned.filter((x) => pref.has(new Date(year, monthIndex, x).getDay())).length;
                }
                if (plan.workPrefDows) {
                  const wp = new Set(plan.workPrefDows);
                  plan.workPrefHits = plan.assigned.filter((x) => !wp.has(new Date(year, monthIndex, x).getDay())).length;
                }
                repaired++;
                fixedOne = true;
                changed = true;
                break;
              }
              if (fixedOne) break;
            }
            if (fixedOne) break;
          }
        }
        if (!fixedOne) break;
      }
      return repaired;
    }

    // 위 함수에서 빠르게 참조할 수 있도록 현재 계획의 OFF 집합을 만든다.
    const planByIdForRepair = new Map(perStaffPlan.map((p) => [p.staffId, new Set(p.assigned)]));
    const repairedAllWorkingDays = repairAllWorkingDays();

    // ----- 선호 요일 최대화: 검증을 통과한 "오프 이동"만 반영 -----
    // 오프 한 칸을 다른 날로 옮기는 이동(또는 두 사람이 서로 맞바꾸는 이동 묶음)을 하나씩 시험해서,
    // 아래 강한 조건을 전부 통과하고 목표 점수가 좋아질 때만 채택한다. 하나라도 어긋나면 그 이동은 버린다.
    //  - 옮길 수 있는 것: 이번 계획이 새로 배정한 오프뿐. 옮겨 갈 곳: 기록이 하나도 없는 빈 칸뿐.
    //    → 필휴·연차·공가 등 이미 입력된 칸은 구조적으로 옮기거나 덮어쓸 수 없다.
    //  - 옮긴 뒤 어떤 (조×업무구분×날짜) 칸이든 부족이 허용 최대치(금·토·월 0, 그 외 -2, 평일 공휴일 -2,
    //    전원 출근 해소 예외 -1)를 넘으면 안 된다(-3 같은 값이 새로 생기지 않는다). 이미 넘은 칸은 더 나빠지지 않아야 한다.
    //  - 구분별 하루 최소 출근 인원을 지킨다. 전원 출근하는 날(업무구분별·조 전체)이 새로 생기지 않는다.
    //  - 옮기는 인원의 연속 근무(6일째 이상 횟수·7일째 금지)와 연속 오프(3일 초과분)가 지금보다 나빠지지 않는다.
    //  - 인원별 오프 개수는 그대로다(이동만 하고 늘리거나 줄이지 않는다).
    // 목표 점수(클수록 좋음, 앞자리 우선): ① 선호 오프 요일 적중 − 선호 출근 요일에 잡힌 오프 ② 필요인력 부족 감소 ③ 오프 분산.
    const improve = { localMoves: 0, groqProposed: 0, groqAccepted: 0, groqRejected: [] };
    const planByStaff = new Map(perStaffPlan.map((p) => [p.staffId, p]));
    const dowOfDay = [], dateKeyOfDay = [];
    for (let d = 1; d <= daysInMonth; d++) {
      dowOfDay[d] = new Date(year, monthIndex, d).getDay();
      dateKeyOfDay[d] = scheduleDateKey(year, monthIndex, d);
    }
    const hasRecordAt = (id, d) => Object.prototype.hasOwnProperty.call(scheduleData.records, scheduleRecordKey(id, dateKeyOfDay[d]));
    const groupStaffAll = {
      DAY: nonAdmin.filter((st) => st.group !== "night"),
      NIGHT: nonAdmin.filter((st) => st.group === "night"),
    };
    const cellWorking = { DAY: {}, NIGHT: {} };  // [조][업무구분][날짜] 현재(계획 반영) 출근 인원
    const groupWorking = { DAY: [], NIGHT: [] }; // [조][날짜] 조 전체 출근 인원
    const offByDay = new Array(daysInMonth + 1).fill(0); // 날짜별 이번 계획의 오프 수(분산 점수용)
    perStaffPlan.forEach((p) => p.assigned.forEach((d) => { offByDay[d] += 1; }));
    ["DAY", "NIGHT"].forEach((g) => {
      groupWorking[g] = new Array(daysInMonth + 1).fill(0);
      TYPES.forEach((t) => {
        cellWorking[g][t] = new Array(daysInMonth + 1).fill(0);
        for (let d = 1; d <= daysInMonth; d++) {
          let w = scheduleActualCount(groupStaffAll[g], t, dateKeyOfDay[d]);
          groupStaffAll[g].forEach((st) => {
            const set = planByIdForRepair.get(st.id);
            if (set && set.has(d) && (st.types || []).indexOf(t) !== -1) w -= 1;
          });
          cellWorking[g][t][d] = w;
        }
      });
      for (let d = 1; d <= daysInMonth; d++) {
        let w = 0;
        groupStaffAll[g].forEach((st) => {
          const rec = scheduleData.records[scheduleRecordKey(st.id, dateKeyOfDay[d])];
          const set = planByIdForRepair.get(st.id);
          const isOff = (set && set.has(d)) || (rec && !scheduleAutoIsWorkRecord(rec));
          if (!isOff) w++;
        });
        groupWorking[g][d] = w;
      }
    });

    // [조][업무구분][날짜] 현재(계획 반영) "이른 조(07:00 시작)" 출근 인원. 선호 요일 최대화 단계의
    // 오프 이동이 이 조건(주간 유선/채팅 하루 최소 1명)을 깨지 않도록 cellWorking과 같은 방식으로 추적한다.
    const cellEarlyWorking = { DAY: {}, NIGHT: {} };
    ["DAY", "NIGHT"].forEach((g) => {
      TYPES.forEach((t) => {
        const earlyStaffAll = groupStaffAll[g].filter((st) => (st.types || []).indexOf(t) !== -1 && scheduleAutoIsEarlyShiftStaff(st));
        cellEarlyWorking[g][t] = new Array(daysInMonth + 1).fill(0);
        for (let d = 1; d <= daysInMonth; d++) {
          let w = scheduleActualCount(earlyStaffAll, t, dateKeyOfDay[d]);
          earlyStaffAll.forEach((st) => {
            const set = planByIdForRepair.get(st.id);
            if (set && set.has(d)) w -= 1;
          });
          cellEarlyWorking[g][t][d] = w;
        }
      });
    });

    // 한 인원의 연속 근무/오프 위반 정도. 구간 "수"만 보면 이미 길어진 구간을 더 늘려도 같은 값이라서,
    // 초과한 "일수"까지 함께 센다(이동 후 어느 하나라도 커지면 그 이동은 거부한다).
    //  runs: 5일 초과 연속 근무 구간 수 / ex5: 5일을 넘긴 일수 합 / ex6: 6일을 넘긴 일수 합 / offEx: 3일을 넘긴 연속 오프 일수 합
    function moveRunStats(ctx, set) {
      let ws = ctx.carry, os = ctx.offCarry, runs = 0, ex5 = 0, ex6 = 0, offEx = 0;
      const endWork = () => {
        if (ws > LIMIT) { runs++; ex5 += ws - LIMIT; }
        if (ws > LIMIT + 1) ex6 += ws - (LIMIT + 1);
      };
      for (let d = 1; d <= daysInMonth; d++) {
        if (set.has(d) || ctx.baseRest[d]) {
          endWork();
          ws = 0; os++;
        } else {
          if (os > SCHEDULE_AUTO_MAX_OFF_STREAK) offEx += os - SCHEDULE_AUTO_MAX_OFF_STREAK;
          os = 0; ws++;
        }
      }
      endWork();
      if (os > SCHEDULE_AUTO_MAX_OFF_STREAK) offEx += os - SCHEDULE_AUTO_MAX_OFF_STREAK;
      return { runs, ex5, ex6, offEx };
    }
    function moveDayValue(ctx, d) {
      return (ctx.prefSet.has(dowOfDay[d]) ? 1 : 0) - (ctx.workPrefSet.has(dowOfDay[d]) ? 1 : 0);
    }
    function movePrefNet(ctx, set) {
      let n = 0;
      set.forEach((d) => { n += moveDayValue(ctx, d); });
      return n;
    }

    // moves: [{ staffId, from, to }, ...] (최대 4개). 통과하면 { ok: true, vec, ... }, 아니면 { ok: false, reason }.
    function evaluateMoveGroup(moves) {
      const fail = (reason) => ({ ok: false, reason });
      if (!Array.isArray(moves) || moves.length === 0 || moves.length > 4) return fail("이동 묶음 형식");
      const newSets = new Map();
      const cellDelta = new Map();
      const earlyCellDelta = new Map();
      const offDayDelta = new Map();
      const bump = (map, key, n) => map.set(key, (map.get(key) || 0) + n);
      for (const mv of moves) {
        const ctx = mv ? staffWarnCtx.get(mv.staffId) : null;
        const baseSet = ctx ? planByIdForRepair.get(mv.staffId) : null;
        if (!ctx || !baseSet) return fail("배치 대상 인원이 아님");
        const from = mv.from, to = mv.to;
        if (!Number.isInteger(from) || !Number.isInteger(to) || from < 1 || to < 1 || from > daysInMonth || to > daysInMonth || from === to) return fail("날짜 형식");
        const cur = newSets.get(mv.staffId) || new Set(baseSet);
        if (!cur.has(from)) return fail("이번 계획이 배정한 오프가 아님");
        if (cur.has(to)) return fail("이미 오프인 날");
        if (hasRecordAt(mv.staffId, to)) return fail("이미 입력된 칸");
        cur.delete(from); cur.add(to);
        newSets.set(mv.staffId, cur);
        ctx.staffTypes.forEach((t) => { bump(cellDelta, `${ctx.g}|${t}|${from}`, 1); bump(cellDelta, `${ctx.g}|${t}|${to}`, -1); });
        bump(cellDelta, `${ctx.g}||${from}`, 1); bump(cellDelta, `${ctx.g}||${to}`, -1);
        if (ctx.isEarly) {
          ctx.staffTypes.forEach((t) => { bump(earlyCellDelta, `${ctx.g}|${t}|${from}`, 1); bump(earlyCellDelta, `${ctx.g}|${t}|${to}`, -1); });
        }
        bump(offDayDelta, from, -1); bump(offDayDelta, to, 1);
      }
      for (const [id, set] of newSets) {
        const ctx = staffWarnCtx.get(id);
        const before = moveRunStats(ctx, planByIdForRepair.get(id));
        const after = moveRunStats(ctx, set);
        if (after.runs > before.runs || after.ex5 > before.ex5 || after.ex6 > before.ex6 || after.offEx > before.offEx) return fail("연속 근무·연속 오프 제한");
      }
      let shortGain = 0;
      for (const [key, delta] of cellDelta) {
        if (delta === 0) continue;
        const [g, t, dStr] = key.split("|");
        const d = Number(dStr);
        if (t === "") {
          const totalGroup = groupStaffAll[g].length;
          const before = groupWorking[g][d], after = before + delta;
          if (totalGroup > 0 && after === totalGroup && before !== totalGroup) return fail("조 전체가 전원 출근하는 날이 생김");
          continue;
        }
        const before = cellWorking[g][t][d], after = before + delta, total = totalCount[g][t];
        if (total > 0 && after === total && before !== total) return fail("전원 출근하는 날이 생김");
        const req = required[g][t][d];
        const hasReq = req !== null && req !== undefined;
        if (after < before) {
          const minW = Number(minWorkingByGroup[scheduleAutoMinWorkingKey(g, t)] ?? SCHEDULE_AUTO_MIN_WORKING);
          if (minW > 0 && total >= minW && after < minW) return fail("구분별 최소 출근 인원");
          if (hasReq) {
            const tol = scheduleAutoToleranceInfo(dowOfDay[d], dateKeyOfDay[d]);
            const effMax = (total > 0 && before === total) ? Math.max(tol.max, 1) : tol.max;
            if (req - after > effMax) return fail("필요인력 허용범위 초과");
          }
        }
        if (hasReq) shortGain += Math.max(0, req - before) - Math.max(0, req - after);
      }
      for (const [key, delta] of earlyCellDelta) {
        if (delta === 0) continue;
        const [g, t, dStr] = key.split("|");
        if (g !== "DAY") continue; // 주간 유선/채팅에만 적용하는 조건
        const d = Number(dStr);
        const before = cellEarlyWorking[g][t][d], after = before + delta;
        if (after < before && earlyTotalCount[g][t] >= SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING && after < SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING) {
          return fail("주간 07:00 근무 인원 최소 1명");
        }
      }
      let v0 = 0;
      for (const [id, set] of newSets) {
        const ctx = staffWarnCtx.get(id);
        v0 += movePrefNet(ctx, set) - movePrefNet(ctx, planByIdForRepair.get(id));
      }
      let v2 = 0;
      for (const [d, dd] of offDayDelta) {
        if (dd === 0) continue;
        v2 -= Math.pow(offByDay[d] + dd, 2) - Math.pow(offByDay[d], 2);
      }
      return { ok: true, vec: [v0, shortGain, v2], newSets, cellDelta, earlyCellDelta, offDayDelta };
    }
    function applyEvaluatedMoves(ev) {
      ev.newSets.forEach((set, id) => {
        planByIdForRepair.set(id, set);
        const p = planByStaff.get(id);
        const ctx = staffWarnCtx.get(id);
        p.assigned = Array.from(set).sort((a, b) => a - b);
        p.prefHits = p.assigned.filter((d) => ctx.prefSet.has(dowOfDay[d])).length;
        if (p.workPrefDows) p.workPrefHits = p.assigned.filter((d) => !ctx.workPrefSet.has(dowOfDay[d])).length;
      });
      ev.cellDelta.forEach((delta, key) => {
        const [g, t, dStr] = key.split("|");
        const d = Number(dStr);
        if (t === "") groupWorking[g][d] += delta;
        else cellWorking[g][t][d] += delta;
      });
      if (ev.earlyCellDelta) {
        ev.earlyCellDelta.forEach((delta, key) => {
          const [g, t, dStr] = key.split("|");
          cellEarlyWorking[g][t][Number(dStr)] += delta;
        });
      }
      ev.offDayDelta.forEach((dd, d) => { offByDay[d] += dd; });
    }
    const moveVecBetter = (vec) => vec[0] > 0 || (vec[0] === 0 && (vec[1] > 0 || (vec[1] === 0 && vec[2] > 0)));

    // (1) 규칙 기반 탐색: 선호 점수(vec[0])가 좋아지는 이동만 시도한다. 단일 이동이 막히면 같은 조의 두 사람이 서로 맞바꾸는 묶음도 시험한다.
    function improvePreferences() {
      const prefPlans = perStaffPlan
        .filter((p) => (p.prefDows && p.prefDows.length) || (p.workPrefDows && p.workPrefDows.length))
        .slice()
        .sort((a, b) => ((b.prefDows?.length || 0) + (b.workPrefDows?.length || 0)) - ((a.prefDows?.length || 0) + (a.workPrefDows?.length || 0)));
      let guard = 0;
      for (let pass = 0; pass < 8 && guard < 400; pass++) {
        let progress = false;
        for (const p of prefPlans) {
          const ctx = staffWarnCtx.get(p.staffId);
          const cur = planByIdForRepair.get(p.staffId);
          const freeDays = [];
          for (let d = 1; d <= daysInMonth; d++) if (!cur.has(d) && !hasRecordAt(p.staffId, d)) freeDays.push(d);
          const pairs = [];
          cur.forEach((a) => freeDays.forEach((b) => {
            const gain = moveDayValue(ctx, b) - moveDayValue(ctx, a);
            if (gain > 0) pairs.push({ a, b, gain });
          }));
          if (pairs.length === 0) continue;
          pairs.sort((x, y) => (y.gain - x.gain) || (x.b - y.b) || (x.a - y.a));
          let best = null;
          pairs.forEach(({ a, b }) => {
            const ev = evaluateMoveGroup([{ staffId: p.staffId, from: a, to: b }]);
            if (ev.ok && ev.vec[0] > 0 && (!best || scheduleAutoCmpVec(ev.vec, best.vec) > 0)) best = ev;
          });
          if (!best) {
            // 단일 이동이 전부 막혔다면, 같은 조의 다른 인원이 그 날짜의 오프를 서로 바꿔 주는 묶음을 시험한다.
            for (const { a, b } of pairs.slice(0, 12)) {
              for (const q of perStaffPlan) {
                if (q.staffId === p.staffId) continue;
                const qctx = staffWarnCtx.get(q.staffId);
                if (!qctx || qctx.g !== ctx.g) continue;
                const qset = planByIdForRepair.get(q.staffId);
                if (!qset.has(b) || qset.has(a) || hasRecordAt(q.staffId, a)) continue;
                const ev = evaluateMoveGroup([{ staffId: p.staffId, from: a, to: b }, { staffId: q.staffId, from: b, to: a }]);
                if (ev.ok && ev.vec[0] > 0 && (!best || scheduleAutoCmpVec(ev.vec, best.vec) > 0)) best = ev;
              }
              if (best) break;
            }
          }
          if (best) { applyEvaluatedMoves(best); improve.localMoves += 1; guard++; progress = true; }
        }
        if (!progress) break;
      }
    }
    improvePreferences();

    // (2) 외부(Groq) 제안: 각 묶음을 같은 검증에 통과시켜서 통과한 것만 반영한다. 선호 점수가 나빠지는 제안은 어떤 경우에도 버린다.
    const proposedGroups = options && Array.isArray(options.groqMoveGroups) ? options.groqMoveGroups.slice(0, 8) : [];
    proposedGroups.forEach((moves, gi) => {
      improve.groqProposed += 1;
      const ev = evaluateMoveGroup(moves);
      if (!ev.ok) { improve.groqRejected.push({ index: gi, reason: ev.reason }); return; }
      if (ev.vec[0] < 0 || !moveVecBetter(ev.vec)) { improve.groqRejected.push({ index: gi, reason: "개선되지 않음" }); return; }
      applyEvaluatedMoves(ev);
      improve.groqAccepted += 1;
    });

    // 선호 적중 집계를 최종 배정 기준으로 전부 다시 계산한다. (앞의 선호 교환 단계는 선호 출근 회피 값을 갱신하지 않아서
    // 화면·검증 지표에 낡은 값이 남을 수 있었다.)
    perStaffPlan.forEach((p) => {
      const ctx = staffWarnCtx.get(p.staffId);
      if (!ctx) return;
      p.prefHits = p.assigned.filter((d) => ctx.prefSet.has(dowOfDay[d])).length;
      if (p.workPrefDows) p.workPrefHits = p.assigned.filter((d) => !ctx.workPrefSet.has(dowOfDay[d])).length;
    });

    // 인원별 경고를 최종 계획 기준으로 확정한다. (옮겨진 칸의 "허용범위 초과" 경고는 사라지고,
    // 연속 휴무/연속 근무 경고는 옮긴 뒤의 실제 구간으로 다시 계산한다.)
    staffWarnOrder.forEach((id) => {
      const ctx = staffWarnCtx.get(id);
      const finalSet = planByIdForRepair.get(id) || new Set();
      ctx.tolWarn.forEach((w) => { if (finalSet.has(w.d)) warnings.push(w.text); });
      if (ctx.shortfallText) warnings.push(ctx.shortfallText);
      const finalRest = (d) => finalSet.has(d) || !!ctx.baseRest[d];
      scheduleAutoFindLongOffRuns(id, year, monthIndex, daysInMonth, ctx.offCarry, finalRest).forEach((r) => {
        const span = r.start < 1
          ? `지난달 말부터 이어져 ${monthNo}/${r.end}까지`
          : `${monthNo}/${r.start}~${monthNo}/${r.end}`;
        warnings.push(`${ctx.label}님 ${span} ${r.length}일 연속 휴무가 이미 입력되어 있어요(필휴 포함 최대 ${SCHEDULE_AUTO_MAX_OFF_STREAK}일). 기존 일정은 유지했으니 확인해주세요.`);
      });
      scheduleAutoFindLongRuns(daysInMonth, finalRest, ctx.carry, LIMIT).forEach((r) => {
        const span = r.start < 1
          ? `지난달 말부터 이어져 ${monthNo}/${r.end}까지`
          : `${monthNo}/${r.start}~${monthNo}/${r.end}`;
        warnings.push(`${ctx.label}님 ${span} ${r.length}일 연속 근무가 남아요(최대 ${LIMIT}일). 오프 목표 개수 안에서는 해소할 수 없어서 직접 조정이 필요해요.`);
      });
    });
    // ----- 업무구분별(채팅/유선 단독) 전원 출근 제거 -----
    // 위 repairAllWorkingDays()는 "조 전체(예: 주간 9명)"가 다 출근했을 때만 손을 대서,
    // "채팅 4명만 전원 출근" 같은 구분 단위 전원 출근은 잡지 못했다(원래도 -1 추가 허용
    // 예외는 있었지만, 배치 단계에서 아무도 그 날을 고르지 않으면 그대로 남았다). 여기서는
    // (조×업무구분) 단위로 같은 방식(이미 배정된 오프의 자리만 서로 바꾸고, 총 오프 개수는
    // 그대로 유지)으로 다시 찾아서 없앤다. 필요인력 허용범위는 전원 출근 해소 목적에 한해
    // 기존과 동일하게 -1까지 추가로 허용한다(금·토·월 부족 0 규칙도 이 한도 안에서는 예외).
    function repairTypeAllWorkingDays() {
      let repaired = 0;
      let changed = true;
      let guard = 0;
      // 어떤 사람이 (조×업무구분) t2에서 day에 실제로 출근 중인 인원수.
      function typeWorkingOn(g, t2, day, excludeId) {
        const groupStaff2 = nonAdmin.filter((s2) => (g === "NIGHT" ? s2.group === "night" : s2.group !== "night") && (s2.types || []).indexOf(t2) !== -1);
        let count = 0;
        groupStaff2.forEach((s2) => {
          if (s2.id === excludeId) { count++; return; } // 지금 이동을 시도 중인 당사자는 별도로 처리
          const rec2 = scheduleData.records[scheduleRecordKey(s2.id, scheduleDateKey(year, monthIndex, day))];
          const set2 = planByIdForRepair.get(s2.id);
          const isOff2 = (set2 && set2.has(day)) || (rec2 && !scheduleAutoIsWorkRecord(rec2));
          if (!isOff2) count++;
        });
        return { count, total: groupStaff2.length };
      }
      while (changed && guard++ < daysInMonth * Math.max(1, perStaffPlan.length) * 2) {
        changed = false;
        let fixedOne = false;
        for (const g of ["DAY", "NIGHT"]) {
          if (fixedOne) break;
          for (const t of TYPES) {
            if (fixedOne) break;
            const groupStaff = nonAdmin.filter((st) => (g === "NIGHT" ? st.group === "night" : st.group !== "night") && (st.types || []).indexOf(t) !== -1);
            const total = groupStaff.length;
            if (total <= 0) continue;

            for (let d = 1; d <= daysInMonth; d++) {
              const targetDateKey = scheduleDateKey(year, monthIndex, d);
              const { count: typeWorkingNow } = typeWorkingOn(g, t, d, null);
              if (typeWorkingNow !== total) continue;

              const targetDow = new Date(year, monthIndex, d).getDay();
              for (const st of groupStaff) {
                const plan = perStaffPlan.find((x) => x.staffId === st.id);
                if (!plan) continue;
                const assigned = new Set(plan.assigned);
                const targetKey = scheduleRecordKey(st.id, targetDateKey);
                if (assigned.has(d) || Object.prototype.hasOwnProperty.call(scheduleData.records, targetKey)) continue;

                // 이 사람이 겸직 중인 모든 업무구분에서 최소 출근/필요인력 허용범위(전원 출근
                // 해소용 -1 포함)를 함께 확인한다.
                let targetSafe = true;
                for (const t2 of TYPES) {
                  if ((st.types || []).indexOf(t2) === -1) continue;
                  const { count: typeWorking2 } = typeWorkingOn(g, t2, d, null);
                  const minWorking = Number(minWorkingByGroup[scheduleAutoMinWorkingKey(g, t2)] ?? SCHEDULE_AUTO_MIN_WORKING);
                  if (typeWorking2 - 1 < minWorking) { targetSafe = false; break; }
                  const targetReq = required[g][t2][d];
                  if (targetReq !== null && targetReq !== undefined) {
                    const tol = scheduleAutoToleranceInfo(targetDow, targetDateKey);
                    const effectiveMax = Math.max(Number(tol.max || 0), 1);
                    if (targetReq - (typeWorking2 - 1) > effectiveMax) { targetSafe = false; break; }
                  }
                }
                if (!targetSafe) continue;

                for (const sourceDay of plan.assigned.slice()) {
                  if (sourceDay === d) continue;
                  const sourceDateKey = scheduleDateKey(year, monthIndex, sourceDay);
                  const sourceKey = scheduleRecordKey(st.id, sourceDateKey);
                  if (Object.prototype.hasOwnProperty.call(scheduleData.records, sourceKey)) continue;

                  // 이 오프를 원래 날짜에서 빼면, 이 사람이 겸직 중인 어떤 업무구분이든
                  // 그 날 새로 전원 출근이 생기지 않는지 확인한다.
                  let sourceCreatesAllWorking = false;
                  for (const t2 of TYPES) {
                    if ((st.types || []).indexOf(t2) === -1) continue;
                    const { count: working2, total: total2 } = typeWorkingOn(g, t2, sourceDay, st.id);
                    if (working2 === total2) { sourceCreatesAllWorking = true; break; }
                  }
                  if (sourceCreatesAllWorking) continue;

                  const next = new Set(assigned);
                  next.delete(sourceDay);
                  next.add(d);
                  if (!autoPlanValidSet(st.id, next)) continue;

                  plan.assigned = Array.from(next).sort((a, b) => a - b);
                  planByIdForRepair.set(st.id, new Set(plan.assigned));
                  if (plan.prefDows) {
                    const pref = new Set(plan.prefDows);
                    plan.prefHits = plan.assigned.filter((x) => pref.has(new Date(year, monthIndex, x).getDay())).length;
                  }
                  if (plan.workPrefDows) {
                    const wp = new Set(plan.workPrefDows);
                    plan.workPrefHits = plan.assigned.filter((x) => !wp.has(new Date(year, monthIndex, x).getDay())).length;
                  }
                  repaired++;
                  fixedOne = true;
                  changed = true;
                  break;
                }
                if (fixedOne) break;
              }
              if (fixedOne) break;
            }
          }
        }
        if (!fixedOne) break;
      }
      return repaired;
    }
    const repairedTypeAllWorkingDays = repairTypeAllWorkingDays();
    if (repairedTypeAllWorkingDays > 0) {
      warnings.push(`구분(채팅/유선)만 전원 출근 상태인 날을 ${repairedTypeAllWorkingDays}건 자동으로 해소했어요(전원 출근 해소 목적에 한해 필요인력 부족 -1까지 추가 허용). 기존 입력 일정과 최소 출근 인원 조건은 유지했어요.`);
    }

    if (repairedAllWorkingDays > 0) {
      warnings.push(`모든 인원 출근 상태를 ${repairedAllWorkingDays}건 자동으로 해소했어요. 기존 입력 일정과 최소 출근 인원 조건은 유지했어요.`);
    }

    // 최종 확인: 보정 후의 실제 계획을 다시 계산한다.
    // 위의 `working`은 최초 후보 생성 직후의 스냅샷이므로, 오프를 교환한 뒤에는 사용하면 안 된다.
    // 따라서 최종 경고/검증은 records + 현재 자동배치 계획을 기준으로 다시 집계한다.
    const monthLabelNo = monthIndex + 1;
    const finalWorking = {};
    ["DAY", "NIGHT"].forEach((g) => {
      finalWorking[g] = {};
      TYPES.forEach((t) => {
        finalWorking[g][t] = {};
        const groupStaff = nonAdmin.filter((s) => (g === "NIGHT" ? s.group === "night" : s.group !== "night"));
        for (let d = 1; d <= daysInMonth; d++) {
          const dateKey = scheduleDateKey(year, monthIndex, d);
          let w = scheduleActualCount(groupStaff, t, dateKey);
          groupStaff.forEach((st) => {
            if ((st.types || []).indexOf(t) === -1) return;
            const set = planByIdForRepair.get(st.id);
            if (set && set.has(d)) w -= 1;
          });
          finalWorking[g][t][d] = w;
        }
      });
    });
    ["DAY", "NIGHT"].forEach((g) => {
      TYPES.forEach((t) => {
        const total = totalCount[g][t];
        if (total <= 0) return;
        const allWorkingDays = [];
        for (let d = 1; d <= daysInMonth; d++) {
          if (finalWorking[g][t][d] === total) allWorkingDays.push(`${monthLabelNo}/${d}`);
        }
        if (allWorkingDays.length > 0) {
          const label = `${g === "NIGHT" ? "야간" : "주간"} ${t}`;
          warnings.push(`${label} 구분에 모든 인원이 출근하는 날이 남아 있어요: ${allWorkingDays.join(", ")}. 기존 일정 또는 출근 최소 인원 조건 때문에 자동으로 해소할 수 없는 날입니다.`);
        }
      });
    });

    // 조 전체 기준 최종 전원 출근 확인. Groq가 성공했든 fallback이든 동일한 기준으로 검사한다.
    ["DAY", "NIGHT"].forEach((g) => {
      const groupStaff = nonAdmin.filter((st) => g === "NIGHT" ? st.group === "night" : st.group !== "night");
      const totalGroup = groupStaff.length;
      if (totalGroup <= 0) return;
      const allWorkingDays = [];
      for (let d = 1; d <= daysInMonth; d++) {
        let workingCount = 0;
        groupStaff.forEach((st) => {
          const dateKey = scheduleDateKey(year, monthIndex, d);
          const rec = scheduleData.records[scheduleRecordKey(st.id, dateKey)];
          const set = planByIdForRepair.get(st.id);
          const isOff = (set && set.has(d)) || (rec && !scheduleAutoIsWorkRecord(rec));
          if (!isOff) workingCount++;
        });
        if (workingCount === totalGroup) allWorkingDays.push(`${monthLabelNo}/${d}`);
      }
      if (allWorkingDays.length) warnings.push(`${g === "NIGHT" ? "야간" : "주간"} 구분에 모든 인원이 출근하는 날이 남아 있어요: ${allWorkingDays.join(", ")}. 기존 입력 일정 또는 최소 출근 인원 조건 때문에 자동 해소할 수 없는 날입니다.`);
    });

    // 대전제 최종 확인: 배정을 끝낸 뒤에도 출근 인원이 3명 미만인 날이 있는지 구분별로 알려준다.
    // 새 오프는 3명 미만이 되는 날에는 넣지 않으므로, 여기 걸리는 날은 이미 입력된 값(연차·공가·결근 등) 때문이다.
    // 재직 인원이 3명 미만인 구분은 지킬 수 없어서(위 후보 제외 대상도 아님) 그 사실만 한 줄로 알려준다.
    ["DAY", "NIGHT"].forEach((g) => {
      TYPES.forEach((t) => {
        const minWorking = Number(minWorkingByGroup[scheduleAutoMinWorkingKey(g, t)] ?? scheduleAutoGetMinWorking(g, t));
        if (!(minWorking > 0)) return;
        const label = `${g === "NIGHT" ? "야간" : "주간"} ${t}`;
        const total = totalCount[g][t];
        if (total === 0) return;
        if (total < minWorking) {
          warnings.push(`${label} 구분은 재직 인원이 ${total}명뿐이라 하루 출근 ${minWorking}명 이상 조건을 지킬 수 없어서 이 구분에는 적용하지 않았어요.`);
          return;
        }
        const low = [];
        for (let d = 1; d <= daysInMonth; d++) {
          if (working[g][t][d] < minWorking) low.push(`${monthLabelNo}/${d}(${working[g][t][d]}명)`);
        }
        if (low.length > 0) {
          warnings.push(`${label} 구분은 이미 입력된 일정 때문에 출근 인원이 ${minWorking}명 미만인 날이 있어요: ${low.join(", ")}. 이 구분 인원에게는 그 날 새 오프를 넣지 않았어요.`);
        }
      });
    });

    // 추가 대전제 최종 확인: 주간(DAY) 유선/채팅 각 구분, 07:00 근무(이른 조) 인원이 배정 후에도
    // 0명이 되는 날이 있는지 알려준다. 새 오프는 0명이 되는 날에는 넣지 않으므로, 여기 걸리는 날은
    // 이미 입력된 값(연차·공가·결근 등) 때문이다. 그 구분에 애초에 이른 조 인원이 없으면(=이 조건이
    // 적용될 대상 자체가 없으면) 조용히 건너뛴다(경고로 알리지 않음 — 07:00 근무제를 안 쓰는
    // 조직에서는 이 조건 자체가 항상 해당 없음이라 매번 경고가 뜨면 소음이 된다).
    TYPES.forEach((t) => {
      const g = "DAY";
      const label = `주간 ${t}`;
      const earlyTotal = earlyTotalCount[g][t];
      if (earlyTotal === 0) return;
      const low = [];
      for (let d = 1; d <= daysInMonth; d++) {
        if (earlyWorking[g][t][d] < SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING) low.push(`${monthLabelNo}/${d}(${earlyWorking[g][t][d]}명)`);
      }
      if (low.length > 0) {
        warnings.push(`${label} 구분은 이미 입력된 일정 때문에 07:00 근무 인원이 0명인 날이 있어요: ${low.join(", ")}. 이 구분 인원에게는 그 날 새 오프를 넣지 않았어요.`);
      }
    });

    return { year, monthIndex, target, targetInfo, perStaffPlan, warnings, excluded, improve };
  }

  // ----- 적용: 미리보기에서 "이대로 입력"을 눌렀을 때만 실제로 scheduleData에 반영한다. -----
  function scheduleAutoApplyPlan(plan) {
    if (!plan) return;
    if (scheduleIsMonthLocked(plan.year, plan.monthIndex)) {
      flashScheduleStatus("잠긴 달이에요. 잠금을 해제한 뒤 다시 시도해주세요.");
      return;
    }
    const cellsToWrite = [];
    plan.perStaffPlan.forEach((p) => {
      p.assigned.forEach((d) => {
        const key = scheduleRecordKey(p.staffId, scheduleDateKey(plan.year, plan.monthIndex, d));
        // 미리보기를 띄운 사이 다른 경로로 그 칸이 채워졌을 수도 있으니, 적용 직전에 한 번 더
        // "아직 빈 칸"인지 확인해서 이미 입력된 칸은 절대 덮어쓰지 않는다.
        if (!Object.prototype.hasOwnProperty.call(scheduleData.records, key)) cellsToWrite.push(key);
      });
    });
    if (cellsToWrite.length === 0) {
      flashScheduleStatus("적용할 칸이 없어요.");
      closeScheduleAutoModal();
      return;
    }
    recordUndo("자동 배치", SCHEDULE_KEY, reloadScheduleData);
    cellsToWrite.forEach((key) => { scheduleData.records[key] = { status: "OFF", attendance: null }; });
    saveScheduleData();
    closeScheduleAutoModal();
    renderApp();
    flashScheduleStatus(`자동 배치 ${cellsToWrite.length}칸 적용 완료`, 2000);
  }

  // ----- 자동 배치 버튼 드롭다운: "자동 배치" / "필휴·연차 제외 스케줄 삭제" -----
  const SCHEDULE_AUTO_MENU_ITEMS = [
    { key: "OPEN", label: "자동 배치" },
    { key: "DELETE_EXCEPT_PROTECTED", label: "필휴·연차 제외 스케줄 삭제", danger: true },
  ];

  function openScheduleAutoMenu(anchorEl) {
    closeScheduleMenu();
    const rect = anchorEl.getBoundingClientRect();
    const menu = document.createElement("div");
    menu.id = "sch-menu";
    menu.className = "sch-menu";
    menu.innerHTML = SCHEDULE_AUTO_MENU_ITEMS.map((o, idx) => {
      const divider = idx === 1 ? `<div class="sch-menu-divider"></div>` : "";
      return `${divider}<button type="button" class="${o.danger ? "sch-menu-danger" : ""}" data-auto-menu="${o.key}">${o.danger ? ICON_TRASH + " " : ""}${esc(o.label)}</button>`;
    }).join("");
    document.body.appendChild(menu);
    const top = Math.min(rect.bottom + 4, window.innerHeight - menu.offsetHeight - 8);
    const left = Math.min(rect.left, window.innerWidth - menu.offsetWidth - 8);
    menu.style.top = `${Math.max(8, top)}px`;
    menu.style.left = `${Math.max(8, left)}px`;
    menu.querySelectorAll("button[data-auto-menu]").forEach((btn) => {
      btn.onclick = () => {
        const key = btn.getAttribute("data-auto-menu");
        closeScheduleMenu();
        if (key === "OPEN") openScheduleAutoModal();
        else if (key === "DELETE_EXCEPT_PROTECTED") scheduleAutoDeleteExceptProtected();
      };
    });
    setTimeout(() => document.addEventListener("mousedown", scheduleMenuOutsideHandler, true), 0);
  }

  // 보호 대상: "필휴" 메모가 있는 오프, 그리고 연차(ANNUAL). 아래 일괄삭제에서 이 둘은 건드리지 않는다.
  function scheduleAutoIsProtectedFromDelete(staffId, dateKey, rec) {
    if (!rec) return false;
    if (rec.status === "ANNUAL") return true;
    if (rec.status === "OFF") return getScheduleMemo(staffId, dateKey).indexOf("필휴") !== -1;
    return false;
  }

  // "필휴" 메모가 있는 오프와 연차만 남기고, 이 달에 실제로 등록된 나머지 일정을 전부 삭제한다.
  // (미리보기 없이 바로 scheduleData.records에 반영되므로 실행 전 확인창을 띄운다. Ctrl+Z로 되돌리기 가능.)
  function scheduleAutoDeleteExceptProtected() {
    const { year, monthIndex } = scheduleUi;
    if (scheduleIsMonthLocked(year, monthIndex)) {
      flashScheduleStatus("잠긴 달이에요. 잠금을 해제한 뒤 다시 시도해주세요.");
      return;
    }
    const monthStaff = getStaffListForMonth(year, monthIndex);
    const numDays = scheduleDaysInMonth(year, monthIndex);
    const ok = window.confirm(
      `${scheduleMonthLabel()} 일정을 "필휴" 메모가 있는 오프와 연차만 남기고 모두 삭제할까요?\n그 외 날짜는 전부 기본값(근무)으로 되돌아가요. (Ctrl+Z로 되돌리기 가능)`
    );
    if (!ok) return;

    recordUndo("필휴·연차 제외 스케줄 삭제", SCHEDULE_KEY, reloadScheduleData);
    let cleared = 0;
    monthStaff.forEach((s) => {
      for (let d = 1; d <= numDays; d++) {
        const dateKey = scheduleDateKey(year, monthIndex, d);
        const key = scheduleRecordKey(s.id, dateKey);
        const rec = scheduleData.records[key];
        if (!rec) continue;
        if (scheduleAutoIsProtectedFromDelete(s.id, dateKey, rec)) continue;
        delete scheduleData.records[key];
        cleared += 1;
      }
    });
    saveScheduleData();
    updateScheduleTableArea();
    flashScheduleStatus(cleared > 0 ? `필휴·연차 제외 스케줄 삭제됨 (${cleared}칸)` : "삭제할 일정이 없었어요.");
  }

  // ----- 미리보기 팝업 -----
  function closeScheduleAutoModal() {
    scheduleAutoHybridRequestId += 1;
    closeScheduleAutoSettingsPopup();
    const existing = document.getElementById("sch-auto-overlay");
    if (existing) existing.remove();
    document.removeEventListener("keydown", scheduleAutoEscHandler, true);
    if (scheduleAutoFitObserver) { scheduleAutoFitObserver.disconnect(); scheduleAutoFitObserver = null; }
  }
  // ESC: "인원별 설정" 팝업이 위에 떠 있으면 그것만 닫고, 아니면 미리보기 팝업을 닫는다.
  function scheduleAutoEscHandler(e) {
    if (e.key !== "Escape") return;
    if (document.getElementById("sch-auto-settings-overlay")) {
      e.stopPropagation();
      closeScheduleAutoSettingsPopup();
      return;
    }
    closeScheduleAutoModal();
  }

  // 인원 이름 표기(이름 → 닉네임 → "이름 없음")
  function scheduleAutoStaffLabel(s) { return s.name || s.nickname || "이름 없음"; }

  // 주간 → 야간 → 관리자 순서로 묶는다(월별 스케줄 표와 같은 정렬). 비어 있는 묶음은 뺀다.
  function scheduleAutoStaffGroups(staffList) {
    const list = staffList.filter((s) => s);
    return [
      { key: "DAY", label: "주간", list: sortStaffByType(list.filter((s) => s.group !== "night" && !s.isAdmin)) },
      { key: "NIGHT", label: "야간", list: sortStaffByType(list.filter((s) => s.group === "night" && !s.isAdmin)) },
      { key: "ADMIN", label: "관리자", list: list.filter((s) => s.isAdmin) },
    ].filter((g) => g.list.length > 0);
  }

  // "인원별 설정" 버튼 옆에 붙는 요약 문구
  function scheduleAutoPrefsCountText(staffList) {
    const setCount = new Set(staffList.filter((s) => scheduleAutoGetPrefDows(s.id).length > 0 || scheduleAutoGetWorkPrefDows(s.id).length > 0).map((s) => s.id)).size;
    return setCount > 0 ? `(${setCount}명 설정됨)` : "(설정 없음)";
  }

  // 배치 조건 중 "제외할 인원" 영역: 아직 제외하지 않은 인원을 고르는 드롭다운 + 제외된 인원 칩(✕로 해제).
  // 드롭다운은 팝업(오버레이) 위에서 z-index 문제가 없도록 브라우저 기본 select를 그대로 쓴다.
  function scheduleAutoExcludeAreaHtml(staffList, excludedIds) {
    const excludedSet = new Set(excludedIds);
    const chips = excludedIds
      .map((id) => staffList.find((s) => s.id === id))
      .filter(Boolean)
      .map((s) => `<span class="sch-auto-exclude-chip">${esc(scheduleAutoStaffLabel(s))}<button type="button" class="sch-auto-exclude-remove" data-auto-exclude-remove="${esc(s.id)}" aria-label="${esc(scheduleAutoStaffLabel(s))} 제외 해제">✕</button></span>`)
      .join("");
    const groups = scheduleAutoStaffGroups(staffList.filter((s) => !excludedSet.has(s.id)));
    const selectHtml = groups.length === 0
      ? `<span class="sch-auto-cond-empty">제외할 수 있는 인원이 없어요.</span>`
      : `<select class="add-input sch-auto-exclude-select" data-auto-exclude-select aria-label="제외할 인원 선택"><option value="">인원 선택…</option>${groups.map((g) => `<optgroup label="${g.label}">${g.list.map((s) => `<option value="${esc(s.id)}">${esc(scheduleAutoStaffLabel(s))}${s.name && s.nickname ? ` (${esc(s.nickname)})` : ""}</option>`).join("")}</optgroup>`).join("")}</select>`;
    return `${selectHtml}<span class="sch-auto-exclude-chips">${chips}</span>`;
  }

  function scheduleAutoMinWorkingInputsHtml() {
    const rows = [
      ["DAY", "채팅", "주간 채팅"], ["DAY", "유선", "주간 유선"],
      ["NIGHT", "채팅", "야간 채팅"], ["NIGHT", "유선", "야간 유선"],
    ];
    return rows.map(([g, t, label]) => {
      const key = scheduleAutoMinWorkingKey(g, t);
      return `<label class="sch-auto-min-working-item"><span>${label}</span><input type="number" min="0" max="99" step="1" value="${scheduleAutoGetMinWorking(g, t)}" data-auto-min-working="${key}" aria-label="${label} 하루 최소 출근 인원"></label>`;
    }).join("");
  }

  // 미리보기 팝업 위쪽의 "배치 조건" 영역.
  // 제외할 인원은 인원별 설정 버튼 바로 왼쪽에 배치한다.
  function scheduleAutoConditionsHtml(staffList) {
    return `
      <div class="sch-auto-conds">
        <div class="sch-auto-conds-head">
          <span class="sch-auto-conds-title">배치 조건</span>
          <div class="sch-auto-conds-actions">
            <div class="sch-auto-exclude-inline">
              <span class="sch-auto-cond-label">제외할 인원</span>
              <div class="sch-auto-cond-body" id="sch-auto-exclude-area">${scheduleAutoExcludeAreaHtml(staffList, scheduleAutoExcludedIds)}</div>
            </div>
            <div class="sch-auto-settings-buttons" aria-label="인원별 설정">
              <button type="button" class="ghost-btn sch-auto-settings-btn" id="sch-auto-settings-btn">인원별 설정</button>
            </div>
          </div>
        </div>
        <div class="sch-auto-cond-row">
          <span class="sch-auto-cond-label">구분별 최소 출근</span>
          <div class="sch-auto-min-working-grid">${scheduleAutoMinWorkingInputsHtml()}</div>
        </div>
      </div>`;
  }

  // 인원별 설정 팝업. 위쪽 탭(선호 오프 설정 / 선호 출근 설정)을 눌러 같은 팝업 안에서
  // 두 화면을 오갈 수 있다. 요일은 월~일 순서로 표시한다. kind: "off" | "work"
  function scheduleAutoSettingsPopupHtml(staffList, excludedIds, kind) {
    const mode = kind === "work" ? "work" : "off";
    const excludedSet = new Set(excludedIds || []);
    const dayOrder = [1, 2, 3, 4, 5, 6, 0]; // 월~일
    const isWork = mode === "work";
    const descTitle = isWork ? "선호 출근 요일" : "선호 오프 요일";
    const desc = isWork
      ? "각 인원이 출근을 선호하는 요일을 선택하세요. 선택한 요일에는 오프 배정을 피해서 배치해요."
      : "각 인원이 오프를 선호하는 요일을 선택하세요. 선택한 요일에는 오프를 우선 배정해요.";
    const tabsHtml = `
      <div class="sch-auto-set-tabs" role="tablist">
        <button type="button" class="sch-auto-set-tab${!isWork ? " is-active" : ""}" data-auto-set-tab="off" role="tab" aria-selected="${!isWork}">선호 오프 설정</button>
        <button type="button" class="sch-auto-set-tab${isWork ? " is-active" : ""}" data-auto-set-tab="work" role="tab" aria-selected="${isWork}">선호 출근 설정</button>
        <button type="button" class="ghost-btn sch-auto-set-reset-btn" id="sch-auto-set-reset-btn" data-auto-set-reset="${mode}">${isWork ? "선호 출근" : "선호 오프"} 초기화</button>
      </div>`;
    const head = dayOrder.map((dow) => {
      const label = SCHEDULE_AUTO_DOW_LABELS[dow];
      return `<th class="sch-auto-set-dow${dow === 0 ? " is-sun" : dow === 6 ? " is-sat" : ""}">${label}</th>`;
    }).join("");
    const groups = scheduleAutoStaffGroups(staffList);
    const body = groups.map((g) => {
      const rows = g.list.map((s) => {
        const selectedDows = isWork ? scheduleAutoGetWorkPrefDows(s.id) : scheduleAutoGetPrefDows(s.id);
        const cells = dayOrder.map((dow) => {
          const on = selectedDows.indexOf(dow) !== -1;
          const kindClass = isWork ? "sch-auto-pref-choice-btn--work" : "sch-auto-pref-choice-btn--off";
          return `<td class="sch-auto-set-pref-cell">
            <button type="button" class="sch-auto-pref-choice-btn ${kindClass}${on ? " on" : ""}" data-auto-pref-staff="${esc(s.id)}" data-auto-pref-dow="${dow}" data-auto-pref-kind="${mode}" aria-pressed="${on ? "true" : "false"}" title="${esc(descTitle)}">${on ? "선택" : "-"}</button>
          </td>`;
        }).join("");
        const isEx = excludedSet.has(s.id);
        return `
          <tr class="sch-auto-set-row${isEx ? " is-excluded" : ""}">
            <th scope="row" class="sch-auto-set-name">${esc(s.name || "")}${s.nickname ? ` <span class="sch-adjust-nick">${esc(s.nickname)}</span>` : ""}${isEx ? ` <span class="sch-auto-set-excluded-tag">이번 배치 제외 중</span>` : ""}</th>
            ${cells}
          </tr>`;
      }).join("");
      return `<tr class="sch-auto-set-group"><th colspan="8">${g.label} <span class="sch-auto-set-group-count">${g.list.length}명</span></th></tr>${rows}`;
    }).join("");
    return `
      <div class="sch-preview-box sch-auto-set-box" data-auto-set-kind="${mode}">
        <div class="sch-preview-head">
          <span>인원별 설정 <span class="sch-auto-prefs-count" id="sch-auto-set-count">${esc(scheduleAutoPrefsCountText(staffList))}</span></span>
          <button type="button" class="sch-preview-close" id="sch-auto-set-close-x" aria-label="닫기">✕</button>
        </div>
        ${tabsHtml}
        <div class="sch-preview-body sch-auto-set-body">
          <div class="sch-auto-set-desc"><b>${descTitle}</b> — ${desc} <span class="sch-auto-set-note">설정은 달이 바뀌어도 계속 적용돼요. 필수 조건은 아니며 필요인력·연속 근무 제한 등과 충돌하면 다른 날로 조정될 수 있어요.</span></div>
          ${groups.length === 0 ? `<div class="sch-adjust-empty">이번 달 인원이 없어요.</div>` : `
          <table class="sch-auto-set-table">
            <thead><tr><th class="sch-auto-set-name-th">인원</th>${head}</tr></thead>
            <tbody>${body}</tbody>
          </table>`}
        </div>
        <div class="sch-preview-actions">
          <button type="button" class="primary-btn" id="sch-auto-set-done-btn">닫기</button>
        </div>
      </div>`;
  }

  function closeScheduleAutoSettingsPopup() {
    const existing = document.getElementById("sch-auto-settings-overlay");
    if (existing) existing.remove();
  }

  // 선호 요일 칸을 눌렀을 때: 저장 → 칸 모양·요약 문구 갱신 → 미리보기 다시 계산
  // (목록 전체를 다시 그리지 않아서 스크롤 위치가 유지된다).
  function scheduleAutoHandlePrefChipClick(chip) {
    const staffId = chip.getAttribute("data-auto-pref-staff");
    const dow = Number(chip.getAttribute("data-auto-pref-dow"));
    const kind = chip.getAttribute("data-auto-pref-kind") === "work" ? "work" : "off";
    scheduleAutoSetPrefDow(staffId, dow, kind);
    const offOn = scheduleAutoGetPrefDows(staffId).indexOf(dow) !== -1;
    const workOn = scheduleAutoGetWorkPrefDows(staffId).indexOf(dow) !== -1;
    const cell = chip.closest(".sch-auto-set-pref-cell");
    if (cell) {
      const offBtn = cell.querySelector('[data-auto-pref-kind="off"]');
      const workBtn = cell.querySelector('[data-auto-pref-kind="work"]');
      [[offBtn, offOn], [workBtn, workOn]].forEach(([btn, on]) => {
        if (!btn) return;
        btn.classList.toggle("on", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }
    const text = scheduleAutoPrefsCountText(getStaffListForMonth(scheduleUi.year, scheduleUi.monthIndex));
    ["sch-auto-prefs-count", "sch-auto-set-count"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    });
    scheduleAutoRefreshPreview();
  }

  function openScheduleAutoSettingsPopup(kind) {
    closeScheduleAutoSettingsPopup();
    const mode = kind === "work" ? "work" : "off";
    scheduleAutoSettingsLastKind = mode;
    const staffList = getStaffListForMonth(scheduleUi.year, scheduleUi.monthIndex);
    const overlay = document.createElement("div");
    overlay.id = "sch-auto-settings-overlay";
    overlay.className = "sch-preview-overlay sch-auto-set-overlay";
    overlay.innerHTML = scheduleAutoSettingsPopupHtml(staffList, scheduleAutoExcludedIds, mode);
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeScheduleAutoSettingsPopup(); };
    document.getElementById("sch-auto-set-close-x").onclick = () => closeScheduleAutoSettingsPopup();
    document.getElementById("sch-auto-set-done-btn").onclick = () => closeScheduleAutoSettingsPopup();
    // 상단 탭(선호 오프 설정 / 선호 출근 설정): 팝업을 닫지 않고 같은 자리에서 화면만 바꾼다.
    overlay.addEventListener("click", (e) => {
      const tab = e.target && e.target.closest ? e.target.closest("[data-auto-set-tab]") : null;
      if (!tab) return;
      const nextKind = tab.getAttribute("data-auto-set-tab") === "work" ? "work" : "off";
      if (nextKind === mode) return;
      openScheduleAutoSettingsPopup(nextKind);
    });
    // 초기화: 지금 보고 있는 탭(선호 오프 또는 선호 출근)의 전체 인원 설정을 한 번에 비운다.
    // 다른 탭 설정은 건드리지 않는다.
    overlay.addEventListener("click", (e) => {
      const resetBtn = e.target && e.target.closest ? e.target.closest("[data-auto-set-reset]") : null;
      if (!resetBtn) return;
      const resetKind = resetBtn.getAttribute("data-auto-set-reset") === "work" ? "work" : "off";
      const label = resetKind === "work" ? "선호 출근" : "선호 오프";
      if (!window.confirm(`${label} 설정을 전체 인원 기준으로 모두 초기화할까요? 되돌릴 수 없어요.`)) return;
      scheduleAutoClearPrefKind(resetKind);
      openScheduleAutoSettingsPopup(resetKind);
      if (scheduleAutoPlan) scheduleAutoRefreshPreview();
    });
    overlay.addEventListener("click", (e) => {
      const chip = e.target && e.target.closest ? e.target.closest("[data-auto-pref-staff]") : null;
      if (chip) scheduleAutoHandlePrefChipClick(chip);
    });
  }

  // 제외 인원을 바꿨을 때: 조건 영역을 다시 그리고 계획·미리보기를 다시 계산한다.
  function scheduleAutoRefreshExcludeArea() {
    const area = document.getElementById("sch-auto-exclude-area");
    if (area) area.innerHTML = scheduleAutoExcludeAreaHtml(getStaffListForMonth(scheduleUi.year, scheduleUi.monthIndex), scheduleAutoExcludedIds);
  }

  // 미리보기 표: 화면의 월별 스케줄 표(buildScheduleTableHtml)를 그대로 그리되, 계획에 있는 "새로 배정될 오프"를
  // 오프로 채워서 보여준다. 그래서 인원 집계·근무/오프 합계·필요인력 대비·인력 대비 편성(O/X)까지 적용 후 모습 그대로 나온다.
  //  - 계획한 칸을 scheduleData.records에 잠깐 넣었다가 그린 직후 반드시 원래대로 되돌린다(저장하지 않음).
  //  - 지금 화면에서 접어둔 열·행이나 검색어가 미리보기에 영향을 주지 않도록, 그 상태도 잠깐 비웠다가 되돌린다
  //    (일부 인원이 안 보이면 계획을 확인할 수 없으므로 항상 전체를 보여준다).
  function scheduleAutoPreviewTableHtml(plan) {
    const ui = scheduleUi;
    const saved = {
      searchQuery: ui.searchQuery, collapsedRowGroups: ui.collapsedRowGroups, colGroups: ui.colGroups,
      manualHiddenDays: ui.manualHiddenDays, manualHiddenStaffIds: ui.manualHiddenStaffIds,
      manualHiddenInfoCols: ui.manualHiddenInfoCols, manualHiddenSummaryRows: ui.manualHiddenSummaryRows,
    };
    const injected = [];
    const marks = {};
    let html = "";
    try {
      // 이번 배치에서 제외한 인원은 표(집계·필요인력 대비 포함)에서도 뺀다 — 계획을 세운 기준과 같아야 한다.
      schedulePreviewExcludedIds = new Set((plan.excluded || []).map((x) => x.id));
      ui.searchQuery = "";
      ui.collapsedRowGroups = new Set();
      ui.colGroups = [];
      ui.manualHiddenDays = new Set();
      ui.manualHiddenStaffIds = new Set();
      ui.manualHiddenInfoCols = new Set();
      ui.manualHiddenSummaryRows = new Set();
      plan.perStaffPlan.forEach((p) => p.assigned.forEach((d) => {
        const key = scheduleRecordKey(p.staffId, scheduleDateKey(plan.year, plan.monthIndex, d));
        if (Object.prototype.hasOwnProperty.call(scheduleData.records, key)) return; // 이미 값이 있는 칸은 건드리지 않는다
        scheduleData.records[key] = { status: "OFF", attendance: null };
        injected.push(key);
        const dow = new Date(plan.year, plan.monthIndex, d).getDay();
        marks[key] = p.prefDows.indexOf(dow) !== -1 ? 2 : 1;
      }));
      schedulePreviewMarks = marks;
      html = buildScheduleTableHtml();
    } finally {
      schedulePreviewMarks = null;
      schedulePreviewExcludedIds = null;
      injected.forEach((key) => { delete scheduleData.records[key]; });
      Object.assign(ui, saved);
    }
    // 미리보기 표는 눌러서 편집하는 표가 아니다: 포커스·"클릭해서 선택" 안내·필요인력 입력칸을 막는다.
    return html
      .replace(/ tabindex="0"/g, "")
      .replace(/ title="클릭해서 선택, 선택 후 오른쪽 클릭으로 접기"/g, "")
      .replace(/<input /g, "<input disabled ");
  }

  // 계획에 따라 달라지는 부분(요약 + 경고 + 월별 스케줄 표 모양의 미리보기). 선호 요일을 바꿀 때마다 이 부분만 다시 그린다.
  function scheduleAutoPreviewHtml(plan) {
    const totalAssigned = plan.perStaffPlan.reduce((sum, p) => sum + p.assigned.length, 0);
    const prefTotal = plan.perStaffPlan.reduce((sum, p) => sum + (p.prefDows.length ? p.assigned.length : 0), 0);
    const prefHits = plan.perStaffPlan.reduce((sum, p) => sum + p.prefHits, 0);
    const workPrefTotal = plan.perStaffPlan.reduce((sum, p) => sum + (p.workPrefDows && p.workPrefDows.length ? p.assigned.length : 0), 0);
    const workPrefAvoided = plan.perStaffPlan.reduce((sum, p) => sum + (p.workPrefHits || 0), 0);

    const warningsHtml = plan.warnings.length === 0 ? "" : `
      <div class="sch-auto-warnings">
        <div class="sch-auto-warnings-title">⚠ 확인이 필요해요</div>
        ${plan.warnings.map((w) => `<div class="sch-auto-warning-item">${esc(w)}</div>`).join("")}
      </div>
    `;
    const excludedHtml = plan.excluded && plan.excluded.length > 0
      ? `<div class="sch-auto-excluded-note">제외한 인원: <b>${plan.excluded.map((x) => esc(scheduleAutoStaffLabel(x))).join(", ")}</b> — 재직 인원에서 뺀 채로 계산했고 아래 표에서도 빠져 있어요. 실제 스케줄 표의 이 인원 칸은 바뀌지 않아요.</div>`
      : "";
    const emptyHtml = totalAssigned === 0
      ? `<div class="sch-auto-none">이번 달은 새로 배정할 칸이 없어요(이미 목표 개수를 채웠거나 대상 인원이 없어요).</div>`
      : "";
    const hybrid = plan.hybrid || null;
    let hybridHtml = "";
    if (hybrid) {
      if (hybrid.groqStatus === "success") {
        const usage = hybrid.groqUsage || {};
        const tokenText = Number.isFinite(Number(usage.total_tokens)) ? ` · 토큰 ${Number(usage.total_tokens)}` : "";
        const modelText = hybrid.groqModel ? ` · ${esc(hybrid.groqModel)}` : "";
        hybridHtml = `<div class="sch-auto-hybrid-note sch-auto-hybrid-note--ok">Groq 호출 성공 · 후보 ${hybrid.allowedCandidateCount}개 중 ${hybrid.selectedCandidate + 1}번 선택${modelText}${tokenText}</div>`;
      } else if (hybrid.groqStatus === "fallback") {
        hybridHtml = `<div class="sch-auto-hybrid-note sch-auto-hybrid-note--fallback">Groq 호출 실패 · 기준 자동배치로 안전하게 계속했어요.${hybrid.groqError ? ` <span>${esc(hybrid.groqError)}</span>` : ""}</div>`;
      } else if (hybrid.groqStatus === "invalid-response") {
        hybridHtml = `<div class="sch-auto-hybrid-note sch-auto-hybrid-note--fallback">Groq 응답 검증 실패 · 기준 자동배치로 안전하게 계속했어요.</div>`;
      } else if (hybrid.groqStatus === "skipped") {
        hybridHtml = `<div class="sch-auto-hybrid-note">Groq 호출 생략 · 기존 조건을 만족하는 후보가 ${hybrid.allowedCandidateCount}개라 추가 선택이 필요하지 않았어요.</div>`;
      } else if (hybrid.groqStatus === "unavailable") {
        hybridHtml = `<div class="sch-auto-hybrid-note sch-auto-hybrid-note--fallback">Groq 연결을 사용할 수 없어 기준 자동배치로 진행했어요.</div>`;
      }
    }
    const imp = hybrid && hybrid.improve ? hybrid.improve : null;
    if (imp) {
      const local = imp.localMoves > 0 ? `규칙 탐색으로 ${imp.localMoves}건 이동` : "";
      let text = "";
      if (imp.status === "success") {
        text = `Groq 제안 ${imp.proposed}건 중 ${imp.accepted}건을 조건 검증 후 반영${imp.rejected > 0 ? ` (${imp.rejected}건은 조건 위반·무개선으로 제외)` : ""}`;
      } else if (imp.status === "no-headroom") {
        text = "선호 요일을 더 맞출 여지가 없어요";
      } else if (imp.status === "no-proposal") {
        text = "Groq가 더 나은 이동을 찾지 못했어요";
      } else if (imp.status === "all-rejected" || imp.status === "discarded") {
        text = `Groq 제안 ${imp.proposed}건은 조건 검증을 통과하지 못해 반영하지 않았어요`;
      } else if (imp.status !== "skipped") {
        text = "Groq 개선 제안은 쓰지 못해 기존 계획 그대로예요";
      }
      const parts = [local, text].filter(Boolean);
      if (parts.length) hybridHtml += `<div class="sch-auto-hybrid-note">선호 요일 개선 · ${esc(parts.join(" · "))}</div>`;
    }
    return `
      ${scheduleAutoChecklistHtml(plan)}
      <div class="sch-auto-total">총 <b>${totalAssigned}칸</b>이 새로 채워질 예정이에요.${prefTotal > 0 ? ` 선호 오프 <b>${prefHits}/${prefTotal}칸</b>.` : ""}${workPrefTotal > 0 ? ` 선호 출근일 회피 <b>${workPrefAvoided}/${workPrefTotal}칸</b>.` : ""}</div>
      ${hybridHtml}
      ${excludedHtml}
      ${warningsHtml}
      ${emptyHtml}
      <div class="sch-auto-legend">
        <span class="sch-auto-legend-item"><span class="sch-auto-swatch"></span>새로 배정될 오프</span>
        ${prefHits > 0 ? `<span class="sch-auto-legend-item"><span class="sch-auto-swatch sch-auto-swatch--pref">★</span>선호 요일과 맞은 오프</span>` : ""}
        <span class="sch-auto-legend-note">나머지 칸은 지금 입력된 값 그대로예요.</span>
      </div>
      <div class="schedule-table-wrap sch-auto-table-wrap"><div class="schedule-scale-inner">${scheduleAutoPreviewTableHtml(plan)}</div></div>
    `;
  }

  // 월별 스케줄 화면처럼, 미리보기 표가 팝업 폭에 딱 맞게 보이도록 축소한다(fitScheduleTable과 같은 방식).
  // 모바일 폭에서는 축소하지 않고 가로 스크롤로 본다.
  function scheduleAutoFitPreview() {
    const area = document.getElementById("sch-auto-preview-area");
    const wrap = area ? area.querySelector(".sch-auto-table-wrap") : null;
    const inner = wrap ? wrap.querySelector(".schedule-scale-inner") : null;
    const table = inner ? inner.querySelector("table") : null;
    if (!wrap || !inner || !table) return;
    inner.style.transform = "none";
    inner.style.width = "auto";
    inner.style.height = "auto";
    wrap.style.height = "auto";
    wrap.style.overflowX = "";
    if (window.innerWidth <= 720) return;
    const naturalW = table.offsetWidth;
    const naturalH = table.offsetHeight;
    const availW = wrap.clientWidth;
    if (naturalW <= 0 || availW <= 0) return;
    const scale = Math.min(availW / naturalW, 1);
    const offsetX = Math.max(0, (availW - naturalW * scale) / 2);
    inner.style.width = `${naturalW}px`;
    inner.style.height = `${naturalH}px`;
    inner.style.transform = `translateX(${offsetX}px) scale(${scale})`;
    wrap.style.overflowX = "hidden";
    wrap.style.height = `${naturalH * scale}px`;
  }

  // ----- 하이브리드 후보 검증/선택 -----
  // 아래 검증은 Groq의 판단보다 항상 우선한다. 후보는 전부 기존 deterministic 로직으로
  // 생성되며, Groq는 후보 번호 외의 값을 적용할 권한이 없다.
  function scheduleAutoPlanMetrics(plan) {
    const year = plan.year, monthIndex = plan.monthIndex;
    const daysInMonth = scheduleDaysInMonth(year, monthIndex);
    const excludedIds = new Set((plan.excluded || []).map((x) => x.id));
    const monthStaff = getStaffListForMonth(year, monthIndex).filter((s) => !excludedIds.has(s.id));
    const nonAdmin = monthStaff.filter((s) => !s.isAdmin);
    const assignedByStaff = new Map(plan.perStaffPlan.map((p) => [p.staffId, new Set(p.assigned)]));
    const assignedKeys = new Set();
    let protectedOverlap = 0;
    let targetShortage = 0;
    let workViolationRuns = 0;   // 5일 초과 구간(6일·7일 이상 모두 포함)
    let sixDayRuns = 0;          // 정확히 6일(원칙 위반은 아니지만 예외로만 허용)
    let sevenPlusRuns = 0;       // 7일 이상(규칙 위반)
    let offViolationRuns = 0;
    let offViolationExcess = 0;
    let prefHits = 0, prefTotal = 0, workPrefAvoided = 0, workPrefTotal = 0;

    plan.perStaffPlan.forEach((p) => {
      const set = assignedByStaff.get(p.staffId) || new Set();
      p.assigned.forEach((d) => {
        const key = scheduleRecordKey(p.staffId, scheduleDateKey(year, monthIndex, d));
        assignedKeys.add(key);
        if (Object.prototype.hasOwnProperty.call(scheduleData.records, key)) protectedOverlap += 1;
      });
      targetShortage += Math.max(0, Number(p.needed || 0) - p.assigned.length);
      prefHits += Number(p.prefHits || 0);
      if (p.prefDows && p.prefDows.length) prefTotal += p.assigned.length;
      workPrefAvoided += Number(p.workPrefHits || 0);
      if (p.workPrefDows && p.workPrefDows.length) workPrefTotal += p.assigned.length;
      const carry = scheduleAutoCarryStreak(p.staffId, year, monthIndex);
      const finalRest = (d) => {
        if (set.has(d)) return true;
        const rec = scheduleData.records[scheduleRecordKey(p.staffId, scheduleDateKey(year, monthIndex, d))];
        return !!rec && !scheduleAutoIsWorkRecord(rec);
      };
      const longRuns = scheduleAutoFindLongRuns(daysInMonth, finalRest, carry, SCHEDULE_AUTO_MAX_WORK_STREAK);
      workViolationRuns += longRuns.length;
      longRuns.forEach((r) => { if (r.length > SCHEDULE_AUTO_MAX_WORK_STREAK + 1) sevenPlusRuns += 1; else sixDayRuns += 1; });
      const offCarry = scheduleAutoCarryOffStreak(p.staffId, year, monthIndex);
      const longOffRuns = scheduleAutoFindLongOffRuns(p.staffId, year, monthIndex, daysInMonth, offCarry, finalRest);
      offViolationRuns += longOffRuns.length;
      offViolationExcess += longOffRuns.reduce((sum, r) => sum + Math.max(0, r.length - SCHEDULE_AUTO_MAX_OFF_STREAK), 0);
    });

    const working = {}, required = {}, totalCount = {};
    const earlyWorking = {}, earlyTotalCount = {};
    ["DAY", "NIGHT"].forEach((g) => {
      const groupStaff = nonAdmin.filter((s) => (g === "NIGHT" ? s.group === "night" : s.group !== "night"));
      working[g] = {}; required[g] = {}; totalCount[g] = {};
      earlyWorking[g] = {}; earlyTotalCount[g] = {};
      ["채팅", "유선"].forEach((t) => {
        working[g][t] = {}; required[g][t] = {};
        totalCount[g][t] = groupStaff.filter((s) => (s.types || []).indexOf(t) !== -1).length;
        const earlyStaff = groupStaff.filter((s) => (s.types || []).indexOf(t) !== -1 && scheduleAutoIsEarlyShiftStaff(s));
        earlyTotalCount[g][t] = earlyStaff.length;
        earlyWorking[g][t] = {};
        for (let d = 1; d <= daysInMonth; d++) {
          const dateKey = scheduleDateKey(year, monthIndex, d);
          let w = scheduleActualCount(groupStaff, t, dateKey);
          let ew = scheduleActualCount(earlyStaff, t, dateKey);
          groupStaff.forEach((st) => {
            if ((st.types || []).indexOf(t) === -1) return;
            const set = assignedByStaff.get(st.id);
            if (set && set.has(d)) w -= 1;
          });
          earlyStaff.forEach((st) => {
            const set = assignedByStaff.get(st.id);
            if (set && set.has(d)) ew -= 1;
          });
          working[g][t][d] = w;
          required[g][t][d] = getRequiredHeadcount(year, monthIndex, g, t, d);
          earlyWorking[g][t][d] = ew;
        }
      });
    });

    // 주간(DAY) 유선/채팅 07:00 근무(이른 조) 인원 최소 1명 조건 위반 칸 수.
    let earlyWorkingViolations = 0;
    ["채팅", "유선"].forEach((t) => {
      if (earlyTotalCount.DAY[t] < SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING) return;
      for (let d = 1; d <= daysInMonth; d++) {
        if (earlyWorking.DAY[t][d] < SCHEDULE_AUTO_EARLY_SHIFT_MIN_WORKING) earlyWorkingViolations += 1;
      }
    });

    let minWorkingViolations = 0;
    let toleranceViolations = 0;   // 최후 허용범위(max)까지 넘은 칸
    let idealMissCells = 0;        // 최후 허용범위(max) 안이지만 1순위(ideal) 범위는 못 지킨 칸
    let toleranceCellsWithReq = 0; // 필요인력이 설정된 칸 수(비율 계산용)
    const toleranceViolationDates = []; // 초과 칸이 며칠·어느 구분인지(체크리스트에 날짜로 보여주기 위함)
    const toleranceGroupLabels = { DAY: { 채팅: "주간채팅", 유선: "주간유선" }, NIGHT: { 채팅: "야간채팅", 유선: "야간유선" } };
    let allWorkingDays = 0;
    let totalSlack = 0;
    let maxShortage = 0; // 가장 깊은 필요인력 부족(예: 3이면 -3인 칸이 있음)
    const minWorkingByGroup = scheduleAutoMinWorkingByGroup;
    ["DAY", "NIGHT"].forEach((g) => ["채팅", "유선"].forEach((t) => {
      const total = totalCount[g][t];
      const minWorking = Number(minWorkingByGroup[scheduleAutoMinWorkingKey(g, t)] ?? SCHEDULE_AUTO_MIN_WORKING);
      for (let d = 1; d <= daysInMonth; d++) {
        const w = working[g][t][d];
        const req = required[g][t][d];
        if (total > 0 && w === total) allWorkingDays += 1;
        if (minWorking > 0 && total >= minWorking && w < minWorking) minWorkingViolations += 1;
        if (req !== null && req !== undefined) {
          const dow = new Date(year, monthIndex, d).getDay();
          const tol = scheduleAutoToleranceInfo(dow, scheduleDateKey(year, monthIndex, d));
          const wasAllWorking = total > 0 && (w + 1) === total;
          const effectiveMax = wasAllWorking ? Math.max(tol.max, 1) : tol.max;
          const diff = w - req;
          toleranceCellsWithReq += 1;
          if (-diff > effectiveMax) {
            toleranceViolations += 1;
            toleranceViolationDates.push(`${monthIndex + 1}/${d}(${toleranceGroupLabels[g][t]})`);
          } else if (-diff > tol.ideal) idealMissCells += 1;
          if (-diff > maxShortage) maxShortage = -diff;
          totalSlack += diff;
        }
      }
    }));

    // 조(DAY/NIGHT) 전체 인원의 전원 출근을 별도 하드 조건으로 집계한다.
    // 기존 allWorkingDays는 채팅/유선별 집계였기 때문에, 한 조 전체의 전원 출근을 놓칠 수 있었다.
    let groupAllWorkingDays = 0;
    ["DAY", "NIGHT"].forEach((g) => {
      const groupStaff = nonAdmin.filter((st) => g === "NIGHT" ? st.group === "night" : st.group !== "night");
      const totalGroup = groupStaff.length;
      for (let d = 1; d <= daysInMonth; d++) {
        let workingCount = 0;
        groupStaff.forEach((st) => {
          const dateKey = scheduleDateKey(year, monthIndex, d);
          const rec = scheduleData.records[scheduleRecordKey(st.id, dateKey)];
          const set = assignedByStaff.get(st.id);
          const isOff = (set && set.has(d)) || (rec && !scheduleAutoIsWorkRecord(rec));
          if (!isOff) workingCount++;
        });
        if (totalGroup > 0 && workingCount === totalGroup) groupAllWorkingDays++;
      }
    });

    const offByDay = new Array(daysInMonth + 1).fill(0);
    plan.perStaffPlan.forEach((p) => p.assigned.forEach((d) => { offByDay[d] += 1; }));
    const offMean = daysInMonth ? offByDay.slice(1).reduce((a, b) => a + b, 0) / daysInMonth : 0;
    const offVariance = daysInMonth ? offByDay.slice(1).reduce((sum, x) => sum + Math.pow(x - offMean, 2), 0) / daysInMonth : 0;

    return {
      totalAssigned: plan.perStaffPlan.reduce((sum, p) => sum + p.assigned.length, 0),
      protectedOverlap, targetShortage, workViolationRuns, sixDayRuns, sevenPlusRuns, offViolationRuns, offViolationExcess,
      minWorkingViolations, earlyWorkingViolations, toleranceViolations, idealMissCells, toleranceCellsWithReq, toleranceViolationDates,
      allWorkingDays, groupAllWorkingDays, prefHits, prefTotal,
      workPrefAvoided, workPrefTotal, offVariance, totalSlack, maxShortage,
      // 선호 점수 = 선호 오프 요일에 잡힌 오프 수 − 선호 출근 요일에 잡힌 오프 수
      prefNet: prefHits - (workPrefTotal - workPrefAvoided),
      warningCount: Array.isArray(plan.warnings) ? plan.warnings.length : 0,
    };
  }

  // ----- 조건 체크리스트: 미리보기에 "지금 이 계획이 설정한 조건을 지켰는지"를 항목별로 보여준다 -----
  //  ok(✓)  : 완전히 지켰다.
  //  warn(△): 규칙 위반은 아니지만 이상적인 수준까지는 못 미쳤다(허용된 예외 포함).
  //  bad(✗) : 규칙을 어겼다. scheduleAutoBuildPlan은 구조적으로 이 상태를 만들 수 없어야 하므로,
  //           실제로 뜨면 버그를 의심해야 한다(방어적 표시).
  // 위반 칸 날짜 목록을 "(10/17(야간채팅), 10/22(주간유선))"처럼 짧게 표시한다.
  // 너무 많으면 앞쪽 몇 개만 보여주고 나머지는 "외 N건"으로 줄인다.
  function scheduleAutoFormatDateList(dates, max) {
    if (!dates || dates.length === 0) return "";
    const limit = max || 8;
    const shown = dates.slice(0, limit);
    const extra = dates.length - shown.length;
    return `(${shown.join(", ")}${extra > 0 ? ` 외 ${extra}건` : ""})`;
  }

  function scheduleAutoChecklistItems(plan, metrics) {
    const items = [];
    const add = (label, mark, note) => items.push({ label, mark, note: note || "" });

    add(
      "기존 입력값 보호",
      metrics.protectedOverlap === 0 ? "ok" : "bad",
      metrics.protectedOverlap === 0 ? "덮어쓴 칸 없음" : `덮어쓴 칸 ${metrics.protectedOverlap}개`
    );

    const minWLabels = { DAY_채팅: "주간채팅", DAY_유선: "주간유선", NIGHT_채팅: "야간채팅", NIGHT_유선: "야간유선" };
    const minWText = Object.keys(minWLabels)
      .map((key) => `${minWLabels[key]} ${scheduleAutoMinWorkingByGroup[key] ?? SCHEDULE_AUTO_MIN_WORKING}명`)
      .join(" · ");
    add(
      "구분별 하루 최소 출근 인원",
      metrics.minWorkingViolations === 0 ? "ok" : "bad",
      `설정값(${minWText}) — 미만 칸 ${metrics.minWorkingViolations}개`
    );

    add(
      "주간 07:00 근무 인원 최소 1명",
      metrics.earlyWorkingViolations === 0 ? "ok" : "bad",
      metrics.earlyWorkingViolations === 0 ? "미만 칸 없음" : `미만 칸 ${metrics.earlyWorkingViolations}개`
    );

    add(
      "연속 오프 최대 3일",
      metrics.offViolationRuns === 0 ? "ok" : "warn",
      metrics.offViolationRuns === 0
        ? "4일 이상 연휴 없음"
        : `${metrics.offViolationRuns}건 — 기존 입력(연차·공가 등)에 의한 것, 자동배치가 만든 건 아님`
    );

    add(
      "연속 근무 최대 5일(불가피하면 6일)",
      metrics.sevenPlusRuns > 0 ? "bad" : (metrics.sixDayRuns > 0 ? "warn" : "ok"),
      metrics.sevenPlusRuns > 0
        ? `7일 이상 ${metrics.sevenPlusRuns}건 — 확인 필요`
        : (metrics.sixDayRuns > 0 ? `6일 연속 ${metrics.sixDayRuns}건 — 규칙상 허용 범위` : "5일 이내")
    );

    add(
      "필요인력 허용범위(최후 기준)",
      metrics.toleranceViolations === 0 ? "ok" : "bad",
      metrics.toleranceViolations === 0
        ? "초과 칸 없음"
        : `초과 칸 ${metrics.toleranceViolations}개 ${scheduleAutoFormatDateList(metrics.toleranceViolationDates)}`
    );

    if (metrics.toleranceCellsWithReq > 0) {
      add(
        "필요인력 1순위(이상적) 범위",
        metrics.idealMissCells === 0 ? "ok" : "warn",
        metrics.idealMissCells === 0 ? "전 칸 충족" : `1순위 미달 ${metrics.idealMissCells}칸 — 최후 범위 안`
      );
    }

    const prefDenom = metrics.prefTotal + metrics.workPrefTotal;
    if (prefDenom > 0) {
      const fullyMet = metrics.prefHits === metrics.prefTotal && metrics.workPrefAvoided === metrics.workPrefTotal;
      add(
        "선호 오프·선호 출근 요일",
        fullyMet ? "ok" : "warn",
        `선호 오프 ${metrics.prefHits}/${metrics.prefTotal} · 선호 출근일 회피 ${metrics.workPrefAvoided}/${metrics.workPrefTotal}`
      );
    }

    add(
      "모든 인원이 출근하는 날 해소",
      (metrics.allWorkingDays === 0 && metrics.groupAllWorkingDays === 0) ? "ok" : "warn",
      (metrics.allWorkingDays === 0 && metrics.groupAllWorkingDays === 0)
        ? "잔여 없음"
        : `잔여 ${metrics.allWorkingDays + metrics.groupAllWorkingDays}건 — 다른 하드 조건과 충돌`
    );

    add(
      "오프 목표 개수 충족",
      metrics.targetShortage === 0 ? "ok" : "warn",
      metrics.targetShortage === 0 ? "전원 목표 충족" : `목표 대비 부족 ${metrics.targetShortage}칸`
    );

    return items;
  }

  // 지금 이 배치에 실제로 적용된 설정값(제외 인원·최소 출근 인원·선호 설정 인원 수)을 한 줄로 보여준다.
  // 아래 체크리스트는 "이 값들을 지켰는지"를 판정하고, 이 줄은 "무엇을 설정했는지" 자체를 보여준다.
  function scheduleAutoSettingsSummaryHtml(plan) {
    const excludedCount = (plan.excluded || []).length;
    const minWLabels = { DAY_채팅: "주간채팅", DAY_유선: "주간유선", NIGHT_채팅: "야간채팅", NIGHT_유선: "야간유선" };
    const minWText = Object.keys(minWLabels).map((key) => `${minWLabels[key]} ${scheduleAutoMinWorkingByGroup[key] ?? SCHEDULE_AUTO_MIN_WORKING}명`).join(" · ");
    const staffList = getStaffListForMonth(plan.year, plan.monthIndex);
    const prefCount = staffList.filter((s) => scheduleAutoGetPrefDows(s.id).length > 0 || scheduleAutoGetWorkPrefDows(s.id).length > 0).length;
    return `
      <div class="sch-auto-settings-summary">
        <span><b>최소 출근 인원</b> ${esc(minWText)}</span>
        <span><b>제외 인원</b> ${excludedCount > 0 ? `${excludedCount}명` : "없음"}</span>
        <span><b>선호 요일 설정</b> ${prefCount > 0 ? `${prefCount}명` : "없음"}</span>
      </div>
    `;
  }

  function scheduleAutoChecklistHtml(plan) {
    const metrics = scheduleAutoPlanMetrics(plan);
    const items = scheduleAutoChecklistItems(plan, metrics);
    const glyph = { ok: "✓", warn: "△", bad: "✗" };
    const rows = items.map((it) => `
      <div class="sch-auto-check-row sch-auto-check-row--${it.mark}">
        <span class="sch-auto-check-mark" aria-hidden="true">${glyph[it.mark]}</span>
        <div class="sch-auto-check-text">
          <div class="sch-auto-check-label">${esc(it.label)}</div>
          ${it.note ? `<div class="sch-auto-check-note">${esc(it.note)}</div>` : ""}
        </div>
      </div>
    `).join("");
    const collapsed = scheduleAutoChecklistCollapsed;
    return `
      <div class="sch-auto-checklist${collapsed ? " sch-auto-checklist--collapsed" : ""}">
        <button type="button" class="sch-auto-checklist-toggle" aria-expanded="${collapsed ? "false" : "true"}">
          <span class="sch-auto-checklist-title">조건 체크리스트 <span class="sch-auto-checklist-legend">✓ 지킴 · △ 규칙상 문제 없음 · ✗ 규칙 위반</span></span>
          <span class="sch-auto-checklist-caret" aria-hidden="true">${collapsed ? "▸" : "▾"}</span>
        </button>
        <div class="sch-auto-checklist-body">
          ${scheduleAutoSettingsSummaryHtml(plan)}
          ${rows}
        </div>
      </div>
    `;
  }

  function scheduleAutoMetricsNotWorseThanBase(candidate, base) {
    const hardKeys = [
      "protectedOverlap", "workViolationRuns", "offViolationRuns", "offViolationExcess",
      "minWorkingViolations", "earlyWorkingViolations", "toleranceViolations", "allWorkingDays", "groupAllWorkingDays", "targetShortage",
    ];
    return hardKeys.every((key) => Number(candidate[key] || 0) <= Number(base[key] || 0));
  }

  function scheduleAutoCandidatePrompt(metricsList) {
    const compact = metricsList.map((m, i) => ({
      candidate: i,
      assigned: m.totalAssigned,
      targetShortage: m.targetShortage,
      preferenceHits: m.prefHits,
      preferenceTotal: m.prefTotal,
      workPreferenceConflicts: m.workPrefAvoided,
      workPreferenceTotal: m.workPrefTotal,
      allWorkingDays: m.allWorkingDays,
      offVariance: Number(m.offVariance.toFixed(4)),
      staffingSlack: m.totalSlack,
      warnings: m.warningCount,
      groupAllWorkingDays: m.groupAllWorkingDays,
    }));
    return `당신은 월별 직원 스케줄의 후보 선택기입니다. 이미 프로그램이 기존 배치 규칙을 적용해 만든 후보들 중 하나만 선택합니다. 새 일정을 만들거나 기존 일정을 수정하지 마세요.\n\n절대 조건: candidate 번호 외에는 어떤 값도 변경하지 않습니다. 특히 groupAllWorkingDays가 기준 후보에서 0이면 반드시 0인 후보만 선택하고, 0보다 큰 후보는 절대 선택하지 마세요. 업무구분별 allWorkingDays도 기준 후보보다 나쁘게 만들지 마세요. 필휴, 연차, 기존 입력 일정, 최소 출근 인원, 필요인력 허용범위, 연속근무/연속오프 제한, 모든 인원 출근 방지 조건을 완화하거나 예외 처리할 수 없습니다. 후보 자체가 이 조건을 깨는 정도가 기준 후보보다 나쁘면 선택하지 마세요.\n\n선택 우선순위: 1) 위 절대 조건이 기준 후보보다 나쁘지 않을 것 2) 선호 오프는 많이, 선호 출근 충돌은 적게 3) 목표 오프 충족 4) 오프 분산 5) 필요인력 여유와 경고 수. 동률이면 candidate 번호가 작은 것을 선택하세요.\n\n후보 데이터:\n${JSON.stringify(compact)}\n\n반드시 JSON 한 줄만 반환하세요. 형식: {"candidate": 0}`;
  }

  function scheduleAutoParseCandidateChoice(data, count) {
    const raw = data && typeof data.text === "string" ? data.text.trim() : "";
    if (!raw) return null;
    const candidates = [];
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fenced) candidates.push(fenced[1]);
    candidates.push(raw);
    for (const text of candidates) {
      try {
        const parsed = JSON.parse(text);
        const n = Number(parsed && parsed.candidate);
        if (Number.isInteger(n) && n >= 0 && n < count) return n;
      } catch (_e) {}
    }
    return null;
  }


  // ----- Groq 개선 제안 (검증을 통과한 이동만 반영) -----
  // Groq는 "오프를 어디로 옮기면 선호가 더 맞는지"만 제안한다. 제안은 scheduleAutoBuildPlan의 이동 검증
  // (필휴 등 기존 입력 칸 불가침, 필요인력 허용범위·최소 출근·연속 근무/오프·전원 출근 방지)을 통과한 것만 반영되고,
  // 반영 결과는 한 번 더 metrics로 확인해서 기준 계획보다 나쁘면 통째로 버린다.
  const SCHEDULE_AUTO_IMPROVE_MAX_PROMPT = 18000;

  // 선호 때문에 더 옮길 여지가 있는지의 상한. 0이면 Groq를 부르지 않는다.
  function scheduleAutoPreferenceHeadroom(plan) {
    const year = plan.year, monthIndex = plan.monthIndex;
    const daysInMonth = scheduleDaysInMonth(year, monthIndex);
    let total = 0;
    plan.perStaffPlan.forEach((p) => {
      const off = new Set(p.prefDows || []);
      const work = new Set(p.workPrefDows || []);
      if (off.size === 0 && work.size === 0) return;
      const val = (d) => { const w = new Date(year, monthIndex, d).getDay(); return (off.has(w) ? 1 : 0) - (work.has(w) ? 1 : 0); };
      const assigned = new Set(p.assigned);
      const freeVals = [];
      for (let d = 1; d <= daysInMonth; d++) {
        if (assigned.has(d)) continue;
        if (Object.prototype.hasOwnProperty.call(scheduleData.records, scheduleRecordKey(p.staffId, scheduleDateKey(year, monthIndex, d)))) continue;
        freeVals.push(val(d));
      }
      const assignedVals = p.assigned.map(val);
      const better = freeVals.slice().sort((a, b) => b - a);
      const worse = assignedVals.slice().sort((a, b) => a - b);
      for (let i = 0; i < Math.min(better.length, worse.length); i++) {
        if (better[i] > worse[i]) total += better[i] - worse[i]; else break;
      }
    });
    return total;
  }

  function scheduleAutoImprovementPrompt(plan) {
    const year = plan.year, monthIndex = plan.monthIndex;
    const daysInMonth = scheduleDaysInMonth(year, monthIndex);
    const nonAdminAll = getStaffListForMonth(year, monthIndex).filter((s) => !s.isAdmin && !(plan.excluded || []).some((x) => x.id === s.id));
    const planByStaff = new Map(plan.perStaffPlan.map((p) => [p.staffId, p]));
    const keyMap = new Map(); // "S1" -> staffId
    const lines = [];
    const dowText = (arr) => (arr && arr.length ? arr.map((n) => SCHEDULE_AUTO_DOW_LABELS[n]).join("") : "-");
    // 선호가 있는 인원과 오프가 배정된 인원 순서(맞교환 상대가 될 수 있는 인원 포함).
    const ordered = nonAdminAll
      .filter((s) => planByStaff.has(s.id))
      .sort((a, b) => {
        const pa = planByStaff.get(a.id), pb = planByStaff.get(b.id);
        const ha = ((pa.prefDows || []).length + (pa.workPrefDows || []).length) > 0 ? 1 : 0;
        const hb = ((pb.prefDows || []).length + (pb.workPrefDows || []).length) > 0 ? 1 : 0;
        return hb - ha;
      });
    ordered.forEach((s, i) => {
      const p = planByStaff.get(s.id);
      const key = `S${i + 1}`;
      const assigned = new Set(p.assigned);
      const movable = [], fixed = [];
      for (let d = 1; d <= daysInMonth; d++) {
        const rec = scheduleData.records[scheduleRecordKey(s.id, scheduleDateKey(year, monthIndex, d))];
        if (rec) { if (!scheduleAutoIsWorkRecord(rec)) fixed.push(d); }
        else if (!assigned.has(d)) movable.push(d);
      }
      const grp = s.group === "night" ? "야" : "주";
      const types = (s.types || []).join("/") || "-";
      lines.push(`${key} ${grp}·${types} 선호오프=${dowText(p.prefDows)} 선호출근=${dowText(p.workPrefDows)} 배정=[${p.assigned.join(",")}] 이동가능=[${movable.join(",")}] 고정휴무=[${fixed.join(",")}] 전월연속근무=${p.carry || 0}`);
      keyMap.set(key, s.id);
    });
    // 날짜별 "오프를 더 넣어도 되는 여유"(spare): 0 이하인 날에는 오프를 추가하는 이동이 반드시 폐기된다.
    const assignedByStaff = new Map(plan.perStaffPlan.map((p) => [p.staffId, new Set(p.assigned)]));
    const spareLines = [];
    ["DAY", "NIGHT"].forEach((g) => ["채팅", "유선"].forEach((t) => {
      const groupStaff = nonAdminAll.filter((s) => (g === "NIGHT" ? s.group === "night" : s.group !== "night"));
      const total = groupStaff.filter((s) => (s.types || []).indexOf(t) !== -1).length;
      if (total === 0) return;
      const minW = Number(scheduleAutoMinWorkingByGroup[scheduleAutoMinWorkingKey(g, t)] ?? SCHEDULE_AUTO_MIN_WORKING);
      const arr = [];
      for (let d = 1; d <= daysInMonth; d++) {
        const dateKey = scheduleDateKey(year, monthIndex, d);
        let w = scheduleActualCount(groupStaff, t, dateKey);
        groupStaff.forEach((st) => { const set = assignedByStaff.get(st.id); if (set && set.has(d) && (st.types || []).indexOf(t) !== -1) w -= 1; });
        let spare = minW > 0 && total >= minW ? w - minW : w;
        const req = getRequiredHeadcount(year, monthIndex, g, t, d);
        if (req !== null && req !== undefined) {
          const tol = scheduleAutoToleranceInfo(new Date(year, monthIndex, d).getDay(), dateKey);
          spare = Math.min(spare, w - (req - tol.max));
        }
        arr.push(spare);
      }
      spareLines.push(`${g === "NIGHT" ? "야" : "주"}·${t}: ${arr.join(",")}`);
    }));
    const prompt = `당신은 월별 직원 스케줄의 "개선 제안자"입니다. 이미 규칙으로 만든 계획에서, 인원별 선호 요일이 더 잘 맞도록 오프를 옮기는 제안만 합니다.\n\n`
      + `목표: 각 인원의 선호오프 요일에 오프가 더 많이, 선호출근 요일에 오프는 더 적게 잡히게 하세요. 그 밖의 것은 목표가 아닙니다.\n\n`
      + `제안 방식: 이동 = 한 인원의 "배정" 날짜 하나를 같은 인원의 "이동가능" 날짜 하나로 옮기는 것. 여러 이동을 한 묶음(최대 4개)으로 만들 수 있고, 묶음은 통째로 적용되거나 통째로 버려집니다(두 사람이 오프를 서로 맞바꾸는 용도).\n`
      + `- "고정휴무"(필휴·연차 등)와 "이동가능"에 없는 날짜는 절대 사용할 수 없습니다.\n`
      + `- 아래 "여유" 표에서 오프를 옮겨 갈 날짜가 0 이하이면 그 날 오프를 추가할 수 없습니다(같은 조·업무구분 기준). 이동으로 비워지는 날은 여유가 1 늘어납니다.\n`
      + `- 연속 근무는 5일까지(불가피하면 6일), 연속 오프는 3일까지입니다. 인원별 오프 개수는 바꾸지 않습니다.\n`
      + `- 규칙을 어기는 제안은 프로그램이 자동으로 폐기하니, 확신이 없으면 제안하지 마세요. 개선할 수 없으면 {"groups":[]}를 반환하세요.\n\n`
      + `여유 표(날짜 1일부터 ${daysInMonth}일까지):\n${spareLines.join("\n")}\n\n`
      + `인원(선호오프/선호출근은 요일):\n${lines.join("\n")}\n\n`
      + `반드시 JSON 한 줄만 반환하세요. 형식: {"groups":[[{"staff":"S3","from":12,"to":13}],[{"staff":"S1","from":5,"to":6},{"staff":"S2","from":6,"to":5}]]}`;
    return { prompt, keyMap };
  }

  function scheduleAutoParseImprovementGroups(text, keyMap) {
    const raw = typeof text === "string" ? text.trim() : "";
    if (!raw) return null;
    const candidates = [];
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fenced) candidates.push(fenced[1]);
    candidates.push(raw);
    const braces = raw.match(/\{[\s\S]*\}/);
    if (braces) candidates.push(braces[0]);
    for (const c of candidates) {
      let parsed;
      try { parsed = JSON.parse(c); } catch (_e) { continue; }
      if (!parsed || !Array.isArray(parsed.groups)) continue;
      const groups = [];
      parsed.groups.slice(0, 8).forEach((g) => {
        if (!Array.isArray(g) || g.length === 0 || g.length > 4) return;
        const moves = [];
        for (const mv of g) {
          const staffId = mv && keyMap.get(String(mv.staff));
          const from = Number(mv && mv.from), to = Number(mv && mv.to);
          if (!staffId || !Number.isInteger(from) || !Number.isInteger(to)) return;
          moves.push({ staffId, from, to });
        }
        groups.push(moves);
      });
      return groups;
    }
    return null;
  }

  async function scheduleAutoAskGroqImprove(plan) {
    if (!cloud || typeof cloud.functions?.invoke !== "function") {
      return { status: "unavailable", groups: [] };
    }
    const { prompt, keyMap } = scheduleAutoImprovementPrompt(plan);
    if (prompt.length > SCHEDULE_AUTO_IMPROVE_MAX_PROMPT) {
      return { status: "too-large", groups: [] };
    }
    const res = await cloud.functions.invoke("qa-groq-summary", {
      body: { prompt, mode: "schedule-auto-improvement" },
    });
    if (res && res.error) throw res.error;
    const data = res && res.data;
    const groups = scheduleAutoParseImprovementGroups(data && data.text, keyMap);
    if (groups === null) return { status: "invalid-response", groups: [], model: data?.model || null, usage: data?.usage || null };
    return { status: "success", groups, model: data?.model || null, usage: data?.usage || null };
  }

  // 선택된 계획에 개선 단계를 적용한다. 어떤 실패든 원래 계획을 그대로 돌려준다.
  async function scheduleAutoImprovePlanWithGroq(year, monthIndex, baseOptions, selectedIndex, selectedPlan, selectedMetrics) {
    const info = {
      status: "skipped", localMoves: selectedPlan.improve ? selectedPlan.improve.localMoves : 0,
      proposed: 0, accepted: 0, rejected: 0, rejectReasons: [], model: null, usage: null, error: null,
    };
    try {
      if (scheduleAutoPreferenceHeadroom(selectedPlan) <= 0) { info.status = "no-headroom"; return { plan: selectedPlan, info }; }
      const asked = await scheduleAutoAskGroqImprove(selectedPlan);
      info.model = asked.model || null; info.usage = asked.usage || null;
      if (asked.status !== "success") { info.status = asked.status; return { plan: selectedPlan, info }; }
      info.proposed = asked.groups.length;
      if (asked.groups.length === 0) { info.status = "no-proposal"; return { plan: selectedPlan, info }; }
      const improved = scheduleAutoBuildPlan(year, monthIndex, Object.assign({}, baseOptions, { variant: selectedIndex, groqMoveGroups: asked.groups }));
      const m = scheduleAutoPlanMetrics(improved);
      info.accepted = improved.improve.groqAccepted;
      info.rejected = improved.improve.groqRejected.length;
      info.rejectReasons = improved.improve.groqRejected.map((r) => r.reason);
      // 2차 안전 확인: 이동 검증과 별개로, 최종 계획의 metrics가 기준보다 나쁘거나 -N이 더 깊어지면 통째로 버린다.
      const safe = scheduleAutoMetricsNotWorseThanBase(m, selectedMetrics)
        && m.maxShortage <= selectedMetrics.maxShortage
        && m.prefNet >= selectedMetrics.prefNet
        && m.warningCount <= selectedMetrics.warningCount;
      if (improved.improve.groqAccepted > 0 && safe) { info.status = "success"; return { plan: improved, info }; }
      info.status = improved.improve.groqAccepted > 0 ? "discarded" : "all-rejected";
      return { plan: selectedPlan, info };
    } catch (err) {
      info.status = "fallback";
      info.error = String(err?.message || err || "Groq 호출 실패");
      console.warn("자동 배치 개선 제안 호출 실패 — 기존 계획으로 계속합니다.", err);
      return { plan: selectedPlan, info };
    }
  }

  async function scheduleAutoAskGroq(metricsList, allowedIndexes) {
    if (!cloud || typeof cloud.functions?.invoke !== "function") {
      return { status: "unavailable", selectedIndex: null, error: "서버 연결 기능을 사용할 수 없어요." };
    }
    if (allowedIndexes.length <= 1) {
      return { status: "skipped", selectedIndex: allowedIndexes[0] ?? null, allowedCandidateCount: allowedIndexes.length };
    }
    const filtered = allowedIndexes.map((i) => metricsList[i]);
    const remapped = await cloud.functions.invoke("qa-groq-summary", {
      body: {
        prompt: scheduleAutoCandidatePrompt(filtered),
        mode: "schedule-auto-candidate-selection",
      },
    });
    if (remapped && remapped.error) throw remapped.error;
    const data = remapped && remapped.data;
    const localChoice = scheduleAutoParseCandidateChoice(data, filtered.length);
    if (localChoice === null) {
      return {
        status: "invalid-response",
        selectedIndex: null,
        model: data?.model || null,
        usage: data?.usage || null,
        requestId: data?.groq_request_id || null,
      };
    }
    return {
      status: data?.groq_verified ? "success" : "invalid-response",
      selectedIndex: data?.groq_verified ? allowedIndexes[localChoice] : null,
      model: data?.model || null,
      usage: data?.usage || null,
      requestId: data?.groq_request_id || null,
    };
  }

  async function scheduleAutoBuildHybridPlan(year, monthIndex, options) {
    const baseOptions = Object.assign({}, options || {});
    const candidates = [];
    for (let i = 0; i < SCHEDULE_AUTO_HYBRID_CANDIDATE_COUNT; i++) {
      candidates.push(scheduleAutoBuildPlan(year, monthIndex, Object.assign({}, baseOptions, { variant: i })));
    }
    const metricsList = candidates.map(scheduleAutoPlanMetrics);
    const baseMetrics = metricsList[0];
    const allowedIndexes = metricsList
      .map((m, i) => ({ m, i }))
      .filter(({ m }) => scheduleAutoMetricsNotWorseThanBase(m, baseMetrics))
      .map(({ i }) => i);
    let selectedIndex = 0;
    let groqResult;
    try {
      groqResult = await scheduleAutoAskGroq(metricsList, allowedIndexes);
      if (Number.isInteger(groqResult?.selectedIndex) && allowedIndexes.indexOf(groqResult.selectedIndex) !== -1) {
        selectedIndex = groqResult.selectedIndex;
      }
    } catch (err) {
      groqResult = {
        status: "fallback",
        selectedIndex: null,
        error: String(err?.message || err || "Groq 호출 실패"),
      };
      console.warn("자동 배치 후보 선택 서버 호출 실패 — 기준 후보로 계속합니다.", err);
    }
    // Groq 응답이 없거나 검증되지 않았거나, 허용 후보 밖을 가리키면 기준 후보만 사용한다.
    if (!scheduleAutoMetricsNotWorseThanBase(metricsList[selectedIndex], baseMetrics)) selectedIndex = 0;
    if (groqResult && groqResult.status === "invalid-response") groqResult.status = "fallback";
    let selected = candidates[selectedIndex];
    const improvedResult = await scheduleAutoImprovePlanWithGroq(year, monthIndex, baseOptions, selectedIndex, selected, metricsList[selectedIndex]);
    selected = improvedResult.plan;
    selected.hybrid = {
      improve: improvedResult.info,
      enabled: true,
      candidateCount: candidates.length,
      allowedCandidateCount: allowedIndexes.length,
      selectedCandidate: selectedIndex,
      metrics: improvedResult.plan === candidates[selectedIndex] ? metricsList[selectedIndex] : scheduleAutoPlanMetrics(selected),
      groqStatus: groqResult?.status || "fallback",
      groqModel: groqResult?.model || null,
      groqUsage: groqResult?.usage || null,
      groqRequestId: groqResult?.requestId || null,
      groqError: groqResult?.error || null,
    };
    return selected;
  }

  // 계획을 다시 계산해서 미리보기 영역과 "이대로 입력" 버튼 상태를 갱신한다.
  async function scheduleAutoRefreshPreview() {
    const requestId = ++scheduleAutoHybridRequestId;
    const area = document.getElementById("sch-auto-preview-area");
    if (area) area.innerHTML = `<div class="sch-auto-none">조건을 확인하고 배치 후보를 최적화하는 중...</div>`;
    const plan = await scheduleAutoBuildHybridPlan(scheduleUi.year, scheduleUi.monthIndex, { excludeStaffIds: scheduleAutoExcludedIds, minWorkingByGroup: scheduleAutoMinWorkingByGroup });
    if (requestId !== scheduleAutoHybridRequestId || !document.getElementById("sch-auto-overlay")) return;
    scheduleAutoPlan = plan;
    if (area) area.innerHTML = scheduleAutoPreviewHtml(scheduleAutoPlan);
    scheduleAutoFitPreview();
    const total = scheduleAutoPlan.perStaffPlan.reduce((sum, p) => sum + p.assigned.length, 0);
    const applyBtn = document.getElementById("sch-auto-apply-btn");
    if (applyBtn) applyBtn.disabled = total === 0;
  }

  // "?" 버튼을 누르면 뜨는 배치 조건 안내를, 그냥 나열된 문장 목록이 아니라
  // 실제로 자동배치가 조건을 적용하는 우선순위 순서대로 도식표(위→아래, 화살표로 연결)로 보여준다.
  // 각 단계(tier)는 { badge: 배지 텍스트, items: [{ title, desc }] } 형태.
  function scheduleAutoInfoDiagramHtml() {
    const tiers = [
      {
        badge: "1순위 · 절대 불가침",
        items: [
          { title: "기존 입력값 보호", desc: "이미 값이 입력된 칸은 그대로 유지, 기본값(근무)인 빈 칸에만 새 오프를 배정해요." },
          { title: "구분별 하루 최소 출근 인원", desc: "설정한 최소 출근 인원 밑으로는 어떤 경우에도 내려가지 않아요." },
          { title: "주간 07:00 근무 인원 최소 1명", desc: "주간 유선·채팅 각 구분마다 근무시간이 07:00 시작인 인원이 하루 최소 1명은 출근하도록 해요(종료 시각은 상관없어요). 그 구분에 07:00 시작 인원이 아예 없으면 지킬 수 없어서 적용하지 않고 안내해요." },
        ],
      },
      {
        badge: "2순위 · 최후 허용선",
        items: [
          { title: "필요인력 허용범위(최후 기준)", desc: "금·토·월 0 / 그 외 요일 -1(최후의 수단 -2) / 평일 공휴일은 금·토·월도 -2까지 허용해요. (대비 +는 항상 허용, 부족만 제한)" },
        ],
      },
      {
        badge: "3순위 · 규칙(불가피하면 예외)",
        items: [
          { title: `연속 근무 최대 ${SCHEDULE_AUTO_MAX_WORK_STREAK}일`, desc: "불가피하면 6일까지 허용해요. 전월 말일부터 이어진 연속 근무일수도 포함해서 계산해요." },
          { title: `연속 오프 최대 ${SCHEDULE_AUTO_MAX_OFF_STREAK}일`, desc: "메모에 \"필휴\"로 표시된 오프도 연결된 연속 오프 계산에 포함돼요." },
          { title: "전원 출근하는 날 방지", desc: "각 구분별로 모든 인원이 출근하는 날은 만들지 않아요. 이를 피하기 위해 필요한 경우에 한해 그 날짜의 필요인력 부족을 -1까지 더 허용해요." },
        ],
      },
      {
        badge: "4순위 · 가능하면 지키는 선호",
        items: [
          { title: "선호 출근·오프 요일", desc: "\"인원별 설정\" 기준으로 선호 출근일엔 오프를 피하고 선호 오프일엔 오프를 우선 배정해요. 필수는 아니라 위 조건과 충돌하면 조정돼요." },
          { title: "오프 목표 개수 충족", desc: "목표 개수 = 공휴일+토요일+일요일 기준 인원별 자동 계산. 대휴·공휴는 항상 차감, 오프는 \"필휴\" 표시가 있을 때만 차감, 연차·공가·육휴·특휴는 차감 안 해요." },
        ],
      },
    ];
    const tierHtml = tiers.map((tier, i) => `
      <div class="sch-auto-priority-tier">
        <div class="sch-auto-priority-badge">${esc(tier.badge)}</div>
        <div class="sch-auto-priority-boxes">
          ${tier.items.map((it) => `
            <div class="sch-auto-priority-box">
              <div class="sch-auto-priority-box-title">${esc(it.title)}</div>
              <div class="sch-auto-priority-box-desc">${it.desc}</div>
            </div>
          `).join("")}
        </div>
      </div>
      ${i < tiers.length - 1 ? `<div class="sch-auto-priority-arrow" aria-hidden="true">↓</div>` : ""}
    `).join("");
    return `
      <div class="sch-auto-priority-diagram">${tierHtml}</div>
      <div class="sch-auto-priority-notes">
        <div>제외할 인원: 이번 배치에만 적용(저장 안 됨) · 재직 인원에서 빠진 것으로 필요인력 계산 · 오프 신규 배정 없음 · 미리보기 표에서 제외(실제 스케줄 표의 해당 인원 칸은 변경 없음)</div>
        <div>저장 방식: 미리보기 단계에서는 저장되지 않음, "이대로 입력" 클릭 시에만 반영돼요.</div>
      </div>
    `;
  }

  function openScheduleAutoModal() {
    const { year, monthIndex } = scheduleUi;
    if (scheduleIsMonthLocked(year, monthIndex)) {
      flashScheduleStatus("잠긴 달이에요. 잠금을 해제한 뒤 다시 시도해주세요.");
      return;
    }
    closeScheduleAutoModal();
    scheduleAutoResetExcluded(); // 제외 조건은 이번 실행 한정이라 열 때마다 비운다
    scheduleAutoPlan = null;
    scheduleAutoChecklistCollapsed = false;
    const monthStaff = getStaffListForMonth(year, monthIndex);

    const overlay = document.createElement("div");
    overlay.id = "sch-auto-overlay";
    overlay.className = "sch-preview-overlay";
    overlay.innerHTML = `
      <div class="sch-preview-box sch-auto-box">
        <div class="sch-preview-head">
          <span class="sch-auto-head-title">
            자동 배치 조건 설정 · ${esc(scheduleMonthLabel())}
            <button type="button" class="sch-auto-info-btn" id="sch-auto-info-btn" aria-label="배치 조건 안내" title="배치 조건 안내">?</button>
          </span>
          <button type="button" class="sch-preview-close" id="sch-auto-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="sch-auto-info-card" id="sch-auto-info-card" hidden>
          ${scheduleAutoInfoDiagramHtml()}
        </div>
        <div class="sch-preview-body sch-auto-body">
          ${scheduleAutoConditionsHtml(monthStaff)}
          <div id="sch-auto-preview-area"><div class="sch-auto-none">조건을 설정한 뒤 <b>배치</b> 버튼을 누르면 미리보기가 생성됩니다.</div></div>
        </div>
        <div class="sch-preview-actions">
          <button type="button" class="ghost-btn" id="sch-auto-cancel-btn">취소</button>
          <button type="button" class="primary-btn" id="sch-auto-build-btn">배치</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeScheduleAutoModal(); };
    document.getElementById("sch-auto-close-x").onclick = () => closeScheduleAutoModal();
    document.getElementById("sch-auto-cancel-btn").onclick = () => closeScheduleAutoModal();
    // 조건 안내(물음표 아이콘): 누르면 카드를 열고 닫고, 카드 밖을 클릭하면 닫힌다.
    const infoBtn = document.getElementById("sch-auto-info-btn");
    const infoCard = document.getElementById("sch-auto-info-card");
    if (infoBtn && infoCard) {
      infoBtn.onclick = (e) => {
        e.stopPropagation();
        infoCard.hidden = !infoCard.hidden;
      };
      overlay.addEventListener("click", (e) => {
        if (infoCard.hidden) return;
        if (e.target === infoBtn || infoCard.contains(e.target)) return;
        infoCard.hidden = true;
      });
    }
    const applyBtn = document.getElementById("sch-auto-apply-btn");
    if (applyBtn) applyBtn.onclick = () => scheduleAutoApplyPlan(scheduleAutoPlan);
    const buildBtn = document.getElementById("sch-auto-build-btn");
    if (buildBtn) buildBtn.onclick = async () => {
      buildBtn.disabled = true;
      await scheduleAutoRefreshPreview();
      buildBtn.disabled = false;
      const title = document.querySelector("#sch-auto-overlay .sch-auto-head-title");
      // ICON_SPARK는 SVG HTML 문자열이므로 textContent에 넣으면 SVG 소스가 그대로 화면에 노출된다.
      // 제목 전체를 HTML로 다시 그려 아이콘은 실제 SVG로 렌더링한다.
      if (title) {
        title.innerHTML = `자동 배치 미리보기 · ${esc(scheduleMonthLabel())}<button type="button" class="sch-auto-info-btn" id="sch-auto-info-btn" aria-label="배치 조건 안내" title="배치 조건 안내">?</button>`;
        const newInfoBtn = title.querySelector("#sch-auto-info-btn");
        const infoCard = document.getElementById("sch-auto-info-card");
        if (newInfoBtn && infoCard) {
          newInfoBtn.onclick = (e) => {
            e.stopPropagation();
            infoCard.hidden = !infoCard.hidden;
          };
        }
      }
      if (buildBtn) buildBtn.style.display = "none";
      const actions = document.querySelector("#sch-auto-overlay .sch-preview-actions");
      if (actions && !document.getElementById("sch-auto-apply-btn")) {
        const applyBtn = document.createElement("button");
        applyBtn.type = "button";
        applyBtn.className = "primary-btn";
        applyBtn.id = "sch-auto-apply-btn";
        applyBtn.textContent = "이대로 입력";
        applyBtn.disabled = !scheduleAutoPlan || scheduleAutoPlan.perStaffPlan.reduce((sum, p) => sum + p.assigned.length, 0) === 0;
        applyBtn.onclick = () => scheduleAutoApplyPlan(scheduleAutoPlan);
        actions.appendChild(applyBtn);
      }
    };
    // 조건 체크리스트 접기/펼치기: 미리보기를 다시 그릴 때도(배치 재실행 등) 접힌 상태가
    // 유지되도록 상태를 모듈 변수(scheduleAutoChecklistCollapsed)에 저장해둔다.
    overlay.addEventListener("click", (e) => {
      const toggle = e.target && e.target.closest ? e.target.closest(".sch-auto-checklist-toggle") : null;
      if (!toggle) return;
      const box = toggle.closest(".sch-auto-checklist");
      if (!box) return;
      scheduleAutoChecklistCollapsed = !scheduleAutoChecklistCollapsed;
      box.classList.toggle("sch-auto-checklist--collapsed", scheduleAutoChecklistCollapsed);
      toggle.setAttribute("aria-expanded", scheduleAutoChecklistCollapsed ? "false" : "true");
      const caret = toggle.querySelector(".sch-auto-checklist-caret");
      if (caret) caret.textContent = scheduleAutoChecklistCollapsed ? "▸" : "▾";
    });
    overlay.addEventListener("change", (e) => {
      const input = e.target && e.target.closest ? e.target.closest("[data-auto-min-working]") : null;
      if (!input) return;
      const key = input.getAttribute("data-auto-min-working");
      const value = Math.max(0, Math.min(99, Math.floor(Number(input.value) || 0)));
      input.value = String(value);
      scheduleAutoMinWorkingByGroup[key] = value;
      if (scheduleAutoPlan) scheduleAutoRefreshPreview();
    });
    // 배치 조건: "인원별 설정"을 누르면 팝업이 바로 뜬다(마지막으로 본 탭을 기억).
    const settingsBtn = document.getElementById("sch-auto-settings-btn");
    if (settingsBtn) {
      settingsBtn.onclick = () => openScheduleAutoSettingsPopup(scheduleAutoSettingsLastKind);
    }
    overlay.addEventListener("change", (e) => {
      const sel = e.target && e.target.closest ? e.target.closest("[data-auto-exclude-select]") : null;
      if (!sel || !sel.value) return;
      scheduleAutoSetExcluded(sel.value, true);
      scheduleAutoRefreshExcludeArea();
      // 미리보기 생성 후 제외 인원을 추가한 경우에도 기존 계획을 폐기하고
      // 제외 조건을 반영해 계획/미리보기를 즉시 다시 계산한다.
      if (scheduleAutoPlan) scheduleAutoRefreshPreview();
    });
    overlay.addEventListener("click", (e) => {
      const rm = e.target && e.target.closest ? e.target.closest("[data-auto-exclude-remove]") : null;
      if (!rm) return;
      scheduleAutoSetExcluded(rm.getAttribute("data-auto-exclude-remove"), false);
      scheduleAutoRefreshExcludeArea();
      // 미리보기 생성 후 제외를 해제한 경우에도 변경된 조건을 즉시 반영한다.
      if (scheduleAutoPlan) scheduleAutoRefreshPreview();
    });
    // 미리보기 표를 팝업 폭에 맞추고, 스크롤바가 생기거나 창 크기가 바뀌어 폭이 달라져도 다시 맞춘다.
    scheduleAutoFitPreview();
    const previewArea = document.getElementById("sch-auto-preview-area");
    if (previewArea && typeof ResizeObserver !== "undefined") {
      let lastW = 0;
      scheduleAutoFitObserver = new ResizeObserver((entries) => {
        const w = entries[0] && entries[0].contentRect ? entries[0].contentRect.width : 0;
        if (Math.abs(w - lastW) < 1) return;
        lastW = w;
        scheduleAutoFitPreview();
      });
      scheduleAutoFitObserver.observe(previewArea);
    }
    setTimeout(() => document.addEventListener("keydown", scheduleAutoEscHandler, true), 0);
  }
