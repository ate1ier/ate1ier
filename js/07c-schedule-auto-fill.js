  // 07c-schedule-auto-fill.js — 월별 스케줄 "AI 자동 배치"
  // (07-schedule.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  //
  // 하는 일: 그 달의 "공휴일 + 토요일 + 일요일" 개수를 인원별 목표 오프(OFF) 개수로 잡고,
  // 이미 뭔가 입력된 칸(연차·공가·특휴·교육·기존 오프·대휴 등 무엇이든)은 절대 건드리지 않은 채
  // 기본값(근무)인 빈 칸에만 새로 "오프"를 채운다. 채울 때는 조(주간/야간)×업무구분(채팅/유선)별
  // 필요인력 대비, 금·토·월은 되도록 ±0(정 안 되면 최후의 수단으로 ±1까지), 그 외 요일은 ±2 범위
  // 안에서 가장 안전한 날짜를 고른다. 단, 그 날짜가 공휴일인 평일(월~금)이면 금·토·월이어도 ±2까지 허용한다.
  // 목표 개수를 계산할 때, 이미 입력된 "오프류" 중 대휴·공휴·특휴는 그대로 빼주고, "오프"는 그 칸의
  // 메모에 "필휴"라고 적혀 있을 때만 뺀다(필휴 표시가 없는 오프는 연차·공가·육휴와 같은 취급으로
  // 목표 달성에 포함시키지 않는다). 연차·공가·육휴는 항상 별도로 취급해서 목표 달성에 포함시키지 않는다.
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
  //  1) 연속 근무 5일 제한(SCHEDULE_AUTO_MAX_WORK_STREAK): 6일 연속 근무가 나오지 않게 한다.
  //     - 이번 달 안에서는 물론이고, "지난달에도 있던 인원"은 지난달 말일부터 이어진 연속 근무일수를
  //       월 초에 그대로 이어서 센다(예: 지난달 마지막 4일을 연속 근무했으면 이번 달은 1~2일 안에 오프가 필요).
  //     - 근무일로 세는 것: 근무(결근 제외)·반차·교육. 오프류·연차·공가·퇴사 등은 쉬는 날로 본다.
  //     - 오프 개수는 목표(공휴일+토+일)를 넘겨서 늘리지 않는다. 그 개수 안에서 못 막는 구간(빈 칸이
  //       없거나 이미 입력된 값 때문에)은 경고로 알려준다.
  //  2) 필요인력 허용범위: 금·토·월은 1순위로 ±0을 찾고, 그게 정말 불가능할 때만 최후의 수단으로
  //     ±1까지 넓혀서 고른다. 그 외 요일(화·수·목·일)은 ±2. 다만 그 날짜가 평일 공휴일이면
  //     금·토·월이어도 ±2까지 허용한다(토요일 자체는 "평일"이 아니므로 이 예외 대상이 아니다).
  //     허용범위(금·토·월은 ±1, 그 외/공휴일은 ±2)를 넘겨서 배치될 때만 경고로 알려준다.
  //  3) 인원별 "선호 오프 요일"(소프트 조건): 위 1)·2)를 해치지 않는 범위에서 최대한 맞춘다.
  //     못 맞추면 다른 날로 바뀔 수 있고, 미리보기에서 어떤 날이 선호와 맞았는지 표시해준다.
  //  4) 그 밖의 분산 기준(제약 없는 날 우선, 여유가 큰 날, 이미 몰린 날 회피, 빠른 날짜)

  let scheduleAutoPlan = null; // 미리보기에 띄워둔 계획. 적용 버튼에서 이 값을 그대로 씀.
  let scheduleAutoFitObserver = null; // 미리보기 표를 팝업 폭에 맞춰 축소할 때, 폭이 바뀌면 다시 맞추기 위한 관찰자

  // 이 일수를 넘는 연속 근무(=6일째부터)는 만들지 않는다.
  const SCHEDULE_AUTO_MAX_WORK_STREAK = 5;
  const SCHEDULE_AUTO_DOW_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

  // 대전제: 구분(조×업무구분)별 하루 최소 출근 인원.
  const SCHEDULE_AUTO_MIN_WORKING = 3;

  // 연차(ANNUAL)·공가(GONGGA)·육휴(MATERNITY)는 목표 개수 계산에 포함시키지 않는다(별도 취급 요청).
  // 그 밖의 오프류 중 "오프"를 뺀 나머지(대휴·공휴·특휴)는 항상 목표 개수에서 뺀다.
  const SCHEDULE_AUTO_ALWAYS_OFF_STATUSES = ["DAEHYU", "GONGHYU", "SPECIAL"];

  // 이 칸이 인원별 목표 오프 개수에서 "이미 채운 것"으로 차감돼야 하는지.
  //  - "오프"는 그 칸 메모에 "필휴"라는 문구가 있을 때만 차감한다(필휴 표시가 없는 오프는
  //    연차·공가·육휴처럼 목표 달성에 포함시키지 않는다 — 다만 칸 자체는 그대로 유지된다).
  //  - 대휴·공휴·특휴는 메모와 상관없이 항상 차감한다.
  //  - 연차·공가·육휴는 항상 차감하지 않는다.
  function scheduleAutoCountsTowardTarget(staffId, dateKey, rec) {
    if (!rec) return false;
    if (rec.status === "OFF") return getScheduleMemo(staffId, dateKey).indexOf("필휴") !== -1;
    return SCHEDULE_AUTO_ALWAYS_OFF_STATUSES.indexOf(rec.status) !== -1;
  }

  // 금(5)·토(6)·월(1)은 필요인력 허용범위를 1순위로 ±0으로 좁히되, 정 안 되면 최후의 수단으로
  // ±1까지 넓혀서 고른다(ideal=0, max=1). 그 외 요일(화·수·목·일)은 ±2(ideal=max=2).
  // 단, 그 날짜가 "평일"(월~금)이면서 공휴일이면 금·토·월이어도 ±2까지 허용한다.
  // (토요일은 "평일"이 아니므로 이 예외 대상이 아니라 항상 ±0/최후의 수단 ±1로 남는다.)
  function scheduleAutoToleranceInfo(dow, dateKey) {
    const isWeekdayHoliday = dow !== 0 && dow !== 6 && !!getHoliday(dateKey);
    if (isWeekdayHoliday) return { ideal: 2, max: 2 };
    if (dow === 5 || dow === 6 || dow === 1) return { ideal: 0, max: 1 };
    return { ideal: 2, max: 2 };
  }

  // 대전제(구분별 하루 출근 최소 3명): 이 오프를 넣으면 그 인원이 속한 구분(조×업무구분) 중 하나라도 그 날 출근
  // 인원이 3명 미만이 되는지. 그러면 후보에서 제외한다(경고로 넘어가는 "최후의 수단"도 없다).
  // 재직 인원이 3명 미만인 구분은 오프를 하나도 안 넣어도 3명이 안 되므로 적용하지 않는다(그 구분은 경고로 알려줌).
  // minWorking는 기본값 SCHEDULE_AUTO_MIN_WORKING(3)이다(scheduleAutoBuildPlan의 options.minWorking으로만 바꿀 수 있고, 화면에서는 바꾸지 않는다).
  function scheduleAutoMinWorkingBlocked(g, staffTypes, working, totalCount, d, minWorking) {
    if (!(minWorking > 0)) return false;
    return staffTypes.some((t) => {
      if (totalCount[g][t] < minWorking) return false;
      return working[g][t][d] - 1 < minWorking; // 이 오프를 반영했다고 가정했을 때 남는 출근 인원
    });
  }

  // ----- 인원별 "선호 오프 요일" (소프트 조건) -----
  // scheduleData.autoOffPrefs[staffId] = { dows: [0~6, ...] } (0=일 … 6=토). 달과 상관없이 계속 적용된다.
  function scheduleAutoGetPrefDows(staffId) {
    const map = scheduleData.autoOffPrefs;
    const entry = map && typeof map === "object" ? map[staffId] : null;
    const raw = entry && Array.isArray(entry.dows) ? entry.dows : [];
    const out = [];
    raw.forEach((n) => { if (Number.isInteger(n) && n >= 0 && n <= 6 && out.indexOf(n) === -1) out.push(n); });
    return out.sort((a, b) => a - b);
  }
  // 요일 하나를 켜고 끈다. 하나도 안 남으면 그 인원의 항목 자체를 지운다.
  function scheduleAutoTogglePrefDow(staffId, dow) {
    if (!scheduleData.autoOffPrefs || typeof scheduleData.autoOffPrefs !== "object") scheduleData.autoOffPrefs = {};
    const cur = scheduleAutoGetPrefDows(staffId);
    const idx = cur.indexOf(dow);
    if (idx === -1) cur.push(dow); else cur.splice(idx, 1);
    cur.sort((a, b) => a - b);
    if (cur.length === 0) delete scheduleData.autoOffPrefs[staffId];
    else scheduleData.autoOffPrefs[staffId] = { dows: cur };
    saveScheduleData();
  }
  function scheduleAutoPrefLabel(dows) {
    return dows.map((n) => SCHEDULE_AUTO_DOW_LABELS[n]).join("·");
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
    const { daysInMonth, carry, limit, needed, isRest, isFree, dayScore } = opts;
    let freeCount = 0, firstFreeDay = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      if (!isRest(d) && isFree(d)) { freeCount++; if (!firstFreeDay) firstFreeDay = d; }
    }
    const K = Math.min(needed, freeCount);
    const cap = limit + 1; // 연속 근무일수는 limit+1까지만 기억한다(넘는 날마다 위반으로 센다)
    const width = 1 + (firstFreeDay ? dayScore(firstFreeDay).length : 0); // [위반 수(음수), ...날짜 점수 합]
    const zero = () => new Array(width).fill(0);

    // cur[k][s] = { v: 지금까지의 벡터, prev: 이전 노드, day: 이 노드에서 오프로 고른 날(없으면 0) }
    let cur = [];
    for (let k = 0; k <= K; k++) cur.push(new Array(cap + 1).fill(null));
    cur[0][Math.min(carry, cap)] = { v: zero(), prev: null, day: 0 };

    function relax(next, k, s, v, prev, day) {
      const old = next[k][s];
      if (!old || scheduleAutoCmpVec(v, old.v) > 0) next[k][s] = { v, prev, day };
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const next = [];
      for (let k = 0; k <= K; k++) next.push(new Array(cap + 1).fill(null));
      const rest = isRest(d), free = !rest && isFree(d);
      const score = free ? dayScore(d) : null;
      for (let k = 0; k <= K; k++) {
        for (let st = 0; st <= cap; st++) {
          const node = cur[k][st];
          if (!node) continue;
          if (rest) { relax(next, k, 0, node.v, node, 0); continue; }
          // 이 날을 근무로 두는 경우
          const streak = Math.min(st + 1, cap);
          const v = node.v.slice();
          if (st + 1 > limit) v[0] -= 1; // 5일을 넘긴 근무일 하나당 위반 1
          relax(next, k, streak, v, node, 0);
          // 이 날을 오프로 고르는 경우
          if (free && k < K) {
            const v2 = node.v.slice();
            for (let i = 0; i < score.length; i++) v2[1 + i] += score[i];
            relax(next, k + 1, 0, v2, node, d);
          }
        }
      }
      cur = next;
    }
    let bestNode = null;
    for (let st = 0; st <= cap; st++) {
      const node = cur[K][st];
      if (node && (!bestNode || scheduleAutoCmpVec(node.v, bestNode.v) > 0)) bestNode = node;
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
    const targetInfo = scheduleAutoTargetInfo(year, monthIndex);
    const target = targetInfo.target;
    const excludeIds = new Set(options && Array.isArray(options.excludeStaffIds) ? options.excludeStaffIds : []);
    // 대전제: 구분별 하루 최소 출근 인원(기본 3). options.minWorking은 테스트·확장용 — 화면에서는 넘기지 않는다.
    const minWorking = options && Number.isInteger(options.minWorking) && options.minWorking >= 0 ? options.minWorking : SCHEDULE_AUTO_MIN_WORKING;
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
    ["DAY", "NIGHT"].forEach((g) => {
      const groupStaff = nonAdmin.filter((s) => (g === "NIGHT" ? s.group === "night" : s.group !== "night"));
      working[g] = {}; required[g] = {}; totalCount[g] = {};
      TYPES.forEach((t) => {
        working[g][t] = {}; required[g][t] = {};
        totalCount[g][t] = groupStaff.filter((s) => (s.types || []).indexOf(t) !== -1).length;
        for (let d = 1; d <= daysInMonth; d++) {
          const dateKey = scheduleDateKey(year, monthIndex, d);
          working[g][t][d] = scheduleActualCount(groupStaff, t, dateKey);
          required[g][t][d] = getRequiredHeadcount(year, monthIndex, g, t, d);
        }
      });
    });

    const assignedCountByDay = {}; // 이번 실행에서 그 날짜에 이미 몇 명 배정했는지(분산용)
    for (let d = 1; d <= daysInMonth; d++) assignedCountByDay[d] = 0;

    const warnings = [];
    const perStaffPlan = [];
    const monthNo = monthIndex + 1;

    // 선호 요일이 있는 인원이 먼저 좋은 날짜를 고를 수 있게 하고, 그다음은 목표까지 더 많이 남은
    // 인원 순으로 정렬(안정 정렬 유지). 선호 요일이 같은 날에 몰리면 먼저 고른 사람이 우선한다.
    const order = monthStaff.map((s, idx) => ({ s, idx }));
    const hasPref = (id) => (scheduleAutoGetPrefDows(id).length > 0 ? 1 : 0);
    order.sort((a, b) => {
      const pa = hasPref(a.s.id), pb = hasPref(b.s.id);
      if (pa !== pb) return pb - pa;
      const na = Math.max(0, target - scheduleAutoAlreadyOffCount(a.s.id, year, monthIndex));
      const nb = Math.max(0, target - scheduleAutoAlreadyOffCount(b.s.id, year, monthIndex));
      if (nb !== na) return nb - na;
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
      const carry = scheduleAutoCarryStreak(s.id, year, monthIndex);

      // 연속 근무 계산용: 이미 입력된 값 중 "쉬는 날"인 칸, 그리고 비어 있어서 오프를 넣을 수 있는 칸.
      // 대전제(구분별 출근 최소 3명)에 걸리는 날은 어떤 요일이든 빈 칸이어도 후보에서 제외한다.
      const baseRest = {}, isFreeDay = {};
      let minBlockedDays = 0; // 대전제 때문에 오프를 못 넣는 (그 인원의) 빈 칸 수 — 목표를 못 채웠을 때 원인 안내용
      for (let d = 1; d <= daysInMonth; d++) {
        const key = scheduleRecordKey(s.id, scheduleDateKey(year, monthIndex, d));
        const has = Object.prototype.hasOwnProperty.call(scheduleData.records, key);
        const minBlocked = !has && scheduleAutoMinWorkingBlocked(g, staffTypes, working, totalCount, d, minWorking);
        if (minBlocked) minBlockedDays++;
        isFreeDay[d] = !has && !minBlocked;
        baseRest[d] = has && !scheduleAutoIsWorkRecord(scheduleData.records[key]);
      }
      const chosen = {};

      // 날짜별 점수(클수록 좋고, 앞 항목이 우선. 고른 날짜들의 합을 앞자리부터 비교한다):
      // ① 그 인원의 조×업무구분 필요인력이 "1순위 범위"(금/토/월은 ±0, 그 외/공휴일은 ±2) 안인지
      // ② 그 범위를 못 지켜도 "최후의 수단 범위"(금/토/월은 ±1) 안에는 들어오는지
      // ③ 선호 오프 요일인지(소프트 조건) ④ 필요인력이 아예 입력 안 된(제약 없는) 날짜인지
      // ⑤ 여유(최후의 수단 범위 - 오차)가 큰(가장 안전한) 날짜인지 ⑥ 이번 실행에서 이미 몰린 날짜는 피해서 분산
      // ⑦ 그래도 같으면 빠른 날짜. 이 앞에 "5일 초과 연속 근무 최소화"가 항상 가장 먼저 적용된다.
      const dayFeasible = {}, dayVec = {};
      remainingFree.forEach((d) => {
        const dow = new Date(year, monthIndex, d).getDay();
        const dateKey = scheduleDateKey(year, monthIndex, d);
        const tolInfo = scheduleAutoToleranceInfo(dow, dateKey);
        let idealOk = true, maxOk = true;
        let hasConstraint = false;
        let minSlack = Infinity;
        staffTypes.forEach((t) => {
          const req = required[g][t][d];
          if (req === null) return;
          hasConstraint = true;
          const diff = (working[g][t][d] - 1) - req;
          if (Math.abs(diff) > tolInfo.ideal) idealOk = false;
          if (Math.abs(diff) > tolInfo.max) maxOk = false;
          minSlack = Math.min(minSlack, tolInfo.max - Math.abs(diff));
        });
        // 경고("허용범위를 벗어나 배치됐어요")는 "최후의 수단 범위"까지 넘겼을 때만 띄운다.
        // ±0을 못 맞춰 ±1(최후의 수단)로 배치된 건 정상 동작이라 경고 대상이 아니다.
        dayFeasible[d] = maxOk;
        dayVec[d] = [
          idealOk ? 1 : 0,
          maxOk ? 1 : 0,
          prefDows.indexOf(dow) !== -1 ? 1 : 0,
          hasConstraint ? 0 : 1,
          hasConstraint ? minSlack : 0,
          -assignedCountByDay[d],
          -d,
        ];
      });
      const solved = scheduleAutoSolveDays({
        daysInMonth, carry, limit: LIMIT, needed,
        isRest: (d) => !!baseRest[d],
        isFree: (d) => !!isFreeDay[d],
        dayScore: (d) => dayVec[d],
      });
      solved.picked.forEach((d) => {
        if (!dayFeasible[d]) {
          warnings.push(`${staffLabel}님 ${monthNo}/${d} — 필요인력 허용범위를 벗어나 배치됐어요. 확인해주세요.`);
        }
        assigned.push(d);
        chosen[d] = true;
        assignedCountByDay[d] += 1;
        staffTypes.forEach((t) => { working[g][t][d] -= 1; });
      });

      if (assigned.length < needed) {
        const minNote = minBlockedDays > 0
          ? ` 구분별 하루 출근 ${minWorking}명 이상을 지키느라 오프를 넣을 수 없는 날이 ${minBlockedDays}일 있어요.`
          : "";
        warnings.push(`${staffLabel}님은 빈 칸이 부족해 목표 ${needed}개 중 ${assigned.length}개만 배정됐어요.${minNote}`);
      }

      // 최종 확인: 배정을 끝낸 뒤에도 5일을 넘는 연속 근무가 남아 있으면 알려준다
      // (오프 목표 개수를 넘겨서까지 늘리지는 않으므로, 개수가 모자라거나 빈 칸이 없으면 남을 수 있다).
      const longRuns = scheduleAutoFindLongRuns(daysInMonth, (d) => !!(baseRest[d] || chosen[d]), carry, LIMIT);
      longRuns.forEach((r) => {
        const span = r.start < 1
          ? `지난달 말부터 이어져 ${monthNo}/${r.end}까지`
          : `${monthNo}/${r.start}~${monthNo}/${r.end}`;
        warnings.push(`${staffLabel}님 ${span} ${r.length}일 연속 근무가 남아요(최대 ${LIMIT}일). 오프 목표 개수 안에서는 해소할 수 없어서 직접 조정이 필요해요.`);
      });

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
        });
      }
    });

    // 대전제 최종 확인: 배정을 끝낸 뒤에도 출근 인원이 3명 미만인 날이 있는지 구분별로 알려준다.
    // 새 오프는 3명 미만이 되는 날에는 넣지 않으므로, 여기 걸리는 날은 이미 입력된 값(연차·공가·결근 등) 때문이다.
    // 재직 인원이 3명 미만인 구분은 지킬 수 없어서(위 후보 제외 대상도 아님) 그 사실만 한 줄로 알려준다.
    const monthLabelNo = monthIndex + 1;
    if (minWorking > 0) ["DAY", "NIGHT"].forEach((g) => {
      TYPES.forEach((t) => {
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

    return { year, monthIndex, target, targetInfo, perStaffPlan, warnings, excluded };
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
    recordUndo("AI 자동 배치", SCHEDULE_KEY, reloadScheduleData);
    cellsToWrite.forEach((key) => { scheduleData.records[key] = { status: "OFF", attendance: null }; });
    saveScheduleData();
    closeScheduleAutoModal();
    renderApp();
    flashScheduleStatus(`AI 자동 배치 ${cellsToWrite.length}칸 적용 완료`, 2000);
  }

  // ----- AI 자동 배치 버튼 드롭다운: "AI 자동 배치" / "필휴·연차 제외 스케줄 삭제" -----
  const SCHEDULE_AUTO_MENU_ITEMS = [
    { key: "OPEN", label: "AI 자동 배치" },
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
    const setCount = staffList.filter((s) => scheduleAutoGetPrefDows(s.id).length > 0).length;
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

  // 미리보기 팝업 위쪽의 "배치 조건" 영역(제외할 인원 + "인원별 설정" 버튼).
  function scheduleAutoConditionsHtml(staffList) {
    return `
      <div class="sch-auto-conds">
        <div class="sch-auto-conds-head">
          <span class="sch-auto-conds-title">배치 조건</span>
          <button type="button" class="ghost-btn sch-auto-settings-btn" id="sch-auto-settings-btn">인원별 설정 <span class="sch-auto-prefs-count" id="sch-auto-prefs-count">${esc(scheduleAutoPrefsCountText(staffList))}</span></button>
        </div>
        <div class="sch-auto-cond-row">
          <span class="sch-auto-cond-label">제외할 인원</span>
          <div class="sch-auto-cond-body" id="sch-auto-exclude-area">${scheduleAutoExcludeAreaHtml(staffList, scheduleAutoExcludedIds)}</div>
        </div>
        <div class="sch-auto-cond-hint">
          이번 배치에서만 적용돼요(저장되지 않아요). 제외한 인원은 재직 인원에서 빠진 것처럼 필요인력을 계산하고, 오프도 새로 배정하지 않아요.
          미리보기 표에서도 빠지지만 실제 스케줄 표의 그 인원 칸은 그대로예요.
        </div>
      </div>`;
  }

  // "인원별 설정" 팝업: 인원 × 요일(일~토) 표 하나에 모든 인원의 선호 오프 요일이 한눈에 보인다.
  // 칸을 누르면 바로 저장되고 뒤의 미리보기가 다시 계산된다. 이번 배치에서 제외 중인 인원은 표시만 해둔다.
  function scheduleAutoSettingsPopupHtml(staffList, excludedIds) {
    const excludedSet = new Set(excludedIds || []);
    const head = SCHEDULE_AUTO_DOW_LABELS.map((label, dow) => `<th class="sch-auto-set-dow${dow === 0 ? " is-sun" : dow === 6 ? " is-sat" : ""}">${label}</th>`).join("");
    const groups = scheduleAutoStaffGroups(staffList);
    const body = groups.map((g) => {
      const rows = g.list.map((s) => {
        const on = scheduleAutoGetPrefDows(s.id);
        const cells = SCHEDULE_AUTO_DOW_LABELS.map((label, dow) => {
          const isOn = on.indexOf(dow) !== -1;
          return `<td><button type="button" class="sch-auto-pref-chip${isOn ? " on" : ""}" data-auto-pref-staff="${esc(s.id)}" data-auto-pref-dow="${dow}" aria-pressed="${isOn ? "true" : "false"}" aria-label="${esc(scheduleAutoStaffLabel(s))} ${label}요일">${label}</button></td>`;
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
      <div class="sch-preview-box sch-auto-set-box">
        <div class="sch-preview-head">
          <span>인원별 설정 <span class="sch-auto-prefs-count" id="sch-auto-set-count">${esc(scheduleAutoPrefsCountText(staffList))}</span></span>
          <button type="button" class="sch-preview-close" id="sch-auto-set-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="sch-preview-body sch-auto-set-body">
          <div class="sch-auto-set-desc">
            <b>선호 오프 요일</b> — 오프를 넣고 싶은 요일을 눌러 두면(여러 개 가능) 자동 배치가 그 요일을 우선해서 골라요.
            반드시 지키는 조건은 아니라서, 필요인력 허용범위나 연속 근무 5일 제한 때문에 조정이 필요하면 다른 날로 바뀔 수 있어요.
            설정은 달이 바뀌어도 그 사람에게 계속 적용돼요.
          </div>
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
    scheduleAutoTogglePrefDow(staffId, dow);
    const isOn = scheduleAutoGetPrefDows(staffId).indexOf(dow) !== -1;
    chip.classList.toggle("on", isOn);
    chip.setAttribute("aria-pressed", isOn ? "true" : "false");
    const text = scheduleAutoPrefsCountText(getStaffListForMonth(scheduleUi.year, scheduleUi.monthIndex));
    ["sch-auto-prefs-count", "sch-auto-set-count"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    });
    scheduleAutoRefreshPreview();
  }

  function openScheduleAutoSettingsPopup() {
    closeScheduleAutoSettingsPopup();
    const staffList = getStaffListForMonth(scheduleUi.year, scheduleUi.monthIndex);
    const overlay = document.createElement("div");
    overlay.id = "sch-auto-settings-overlay";
    overlay.className = "sch-preview-overlay sch-auto-set-overlay";
    overlay.innerHTML = scheduleAutoSettingsPopupHtml(staffList, scheduleAutoExcludedIds);
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeScheduleAutoSettingsPopup(); };
    document.getElementById("sch-auto-set-close-x").onclick = () => closeScheduleAutoSettingsPopup();
    document.getElementById("sch-auto-set-done-btn").onclick = () => closeScheduleAutoSettingsPopup();
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
    return `
      <div class="sch-auto-total">총 <b>${totalAssigned}칸</b>이 새로 채워질 예정이에요.${prefTotal > 0 ? ` 선호 요일 반영 <b>${prefHits}/${prefTotal}칸</b>.` : ""}</div>
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

  // 계획을 다시 계산해서 미리보기 영역과 "이대로 입력" 버튼 상태를 갱신한다.
  function scheduleAutoRefreshPreview() {
    scheduleAutoPlan = scheduleAutoBuildPlan(scheduleUi.year, scheduleUi.monthIndex, { excludeStaffIds: scheduleAutoExcludedIds });
    const area = document.getElementById("sch-auto-preview-area");
    if (area) area.innerHTML = scheduleAutoPreviewHtml(scheduleAutoPlan);
    scheduleAutoFitPreview();
    const total = scheduleAutoPlan.perStaffPlan.reduce((sum, p) => sum + p.assigned.length, 0);
    const applyBtn = document.getElementById("sch-auto-apply-btn");
    if (applyBtn) applyBtn.disabled = total === 0;
  }

  function openScheduleAutoModal() {
    const { year, monthIndex } = scheduleUi;
    if (scheduleIsMonthLocked(year, monthIndex)) {
      flashScheduleStatus("잠긴 달이에요. 잠금을 해제한 뒤 다시 시도해주세요.");
      return;
    }
    closeScheduleAutoModal();
    scheduleAutoResetExcluded(); // 제외 조건은 이번 실행 한정이라 열 때마다 비운다
    scheduleAutoPlan = scheduleAutoBuildPlan(year, monthIndex, { excludeStaffIds: scheduleAutoExcludedIds });
    const plan = scheduleAutoPlan;
    const monthStaff = getStaffListForMonth(year, monthIndex);
    const totalAssigned = plan.perStaffPlan.reduce((sum, p) => sum + p.assigned.length, 0);

    const overlay = document.createElement("div");
    overlay.id = "sch-auto-overlay";
    overlay.className = "sch-preview-overlay";
    overlay.innerHTML = `
      <div class="sch-preview-box sch-auto-box">
        <div class="sch-preview-head">
          <span class="sch-auto-head-title">
            ${ICON_SPARK} AI 자동 배치 미리보기 · ${esc(scheduleMonthLabel())}
            <button type="button" class="sch-auto-info-btn" id="sch-auto-info-btn" aria-label="배치 조건 안내" title="배치 조건 안내">?</button>
          </span>
          <button type="button" class="sch-preview-close" id="sch-auto-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="sch-auto-info-card" id="sch-auto-info-card" hidden>
          <ul>
            <li>목표 오프 개수 = 공휴일 ${plan.targetInfo.holidayCount}일 + 토요일 ${plan.targetInfo.saturdayCount}일 + 일요일 ${plan.targetInfo.sundayCount}일 = 인원별 <b>${plan.target}개</b></li>
            <li>목표 차감: 대휴·공휴·특휴는 항상 차감 / 오프는 메모에 "필휴" 표시가 있을 때만 차감 / 연차·공가·육휴는 차감 안 함</li>
            <li>배치 범위: 이미 값이 입력된 칸은 그대로 유지, 기본값(근무)인 빈 칸에만 새 오프 배정</li>
            <li>필요인력 허용범위: 금·토·월 ±0(최후의 수단 ±1) / 그 외 요일 ±2 / 평일 공휴일은 금·토·월도 ±2까지 허용</li>
            <li>대전제(최우선, 예외 없음): 주간 유선·주간 채팅·야간 유선·야간 채팅 각 구분, 하루 출근 최소 <b>${SCHEDULE_AUTO_MIN_WORKING}명</b></li>
            <li>연속 근무 제한: 최대 <b>${SCHEDULE_AUTO_MAX_WORK_STREAK}일</b> (전월 말일부터 이어진 연속 근무일수 포함)</li>
            <li>저장 방식: 미리보기 단계에서는 저장되지 않음, "이대로 입력" 클릭 시에만 반영</li>
          </ul>
        </div>
        <div class="sch-preview-body sch-auto-body">
          ${scheduleAutoConditionsHtml(monthStaff)}
          <div id="sch-auto-preview-area">${scheduleAutoPreviewHtml(plan)}</div>
        </div>
        <div class="sch-preview-actions">
          <button type="button" class="ghost-btn" id="sch-auto-cancel-btn">취소</button>
          <button type="button" class="primary-btn" id="sch-auto-apply-btn"${totalAssigned === 0 ? " disabled" : ""}>이대로 입력</button>
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
    // 배치 조건: "인원별 설정" 팝업 열기 / 제외할 인원 추가·해제(바로 계획과 미리보기를 다시 계산한다)
    document.getElementById("sch-auto-settings-btn").onclick = () => openScheduleAutoSettingsPopup();
    overlay.addEventListener("change", (e) => {
      const sel = e.target && e.target.closest ? e.target.closest("[data-auto-exclude-select]") : null;
      if (!sel || !sel.value) return;
      scheduleAutoSetExcluded(sel.value, true);
      scheduleAutoRefreshExcludeArea();
      scheduleAutoRefreshPreview();
    });
    overlay.addEventListener("click", (e) => {
      const rm = e.target && e.target.closest ? e.target.closest("[data-auto-exclude-remove]") : null;
      if (!rm) return;
      scheduleAutoSetExcluded(rm.getAttribute("data-auto-exclude-remove"), false);
      scheduleAutoRefreshExcludeArea();
      scheduleAutoRefreshPreview();
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
