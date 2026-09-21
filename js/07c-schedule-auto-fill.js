  // 07c-schedule-auto-fill.js — 월별 스케줄 "AI 자동 배치"
  // (07-schedule.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  //
  // 하는 일: 그 달의 "공휴일 + 토요일 + 일요일" 개수를 인원별 목표 오프(OFF) 개수로 잡고,
  // 이미 뭔가 입력된 칸(연차·공가·특휴·교육·기존 오프·대휴 등 무엇이든)은 절대 건드리지 않은 채
  // 기본값(근무)인 빈 칸에만 새로 "오프"를 채운다. 채울 때는 조(주간/야간)×업무구분(채팅/유선)별
  // 필요인력 대비 ±1~2명(금·토·월은 ±1명) 범위 안에서 가장 안전한 날짜를 고른다.
  // 목표 개수를 계산할 때, 이미 입력된 "오프류"(오프·공휴·대휴·육휴·특휴)는 빼주지만
  // 연차·공가는 별도로 취급해서 목표 달성에 포함시키지 않는다(요청 사항).
  // 실제로 저장하지 않고 "계획(plan)"만 만든 뒤, 미리보기 팝업에서 "이대로 입력"을 눌러야
  // 비로소 scheduleData에 반영된다.
  //
  // ---- 날짜를 고를 때 지키는 조건 (강한 순서) ----
  //  1) 연속 근무 5일 제한(SCHEDULE_AUTO_MAX_WORK_STREAK): 6일 연속 근무가 나오지 않게 한다.
  //     - 이번 달 안에서는 물론이고, "지난달에도 있던 인원"은 지난달 말일부터 이어진 연속 근무일수를
  //       월 초에 그대로 이어서 센다(예: 지난달 마지막 4일을 연속 근무했으면 이번 달은 1~2일 안에 오프가 필요).
  //     - 근무일로 세는 것: 근무(결근 제외)·반차·교육. 오프류·연차·공가·퇴사 등은 쉬는 날로 본다.
  //     - 오프 개수는 목표(공휴일+토+일)를 넘겨서 늘리지 않는다. 그 개수 안에서 못 막는 구간(빈 칸이
  //       없거나 이미 입력된 값 때문에)은 경고로 알려준다.
  //  2) 필요인력 허용범위(±1~2명, 금·토·월은 ±1명)
  //  3) 인원별 "선호 오프 요일"(소프트 조건): 위 1)·2)를 해치지 않는 범위에서 최대한 맞춘다.
  //     못 맞추면 다른 날로 바뀔 수 있고, 미리보기에서 어떤 날이 선호와 맞았는지 표시해준다.
  //  4) 그 밖의 분산 기준(제약 없는 날 우선, 여유가 큰 날, 이미 몰린 날 회피, 빠른 날짜)

  let scheduleAutoPlan = null; // 미리보기에 띄워둔 계획. 적용 버튼에서 이 값을 그대로 씀.
  let scheduleAutoFitObserver = null; // 미리보기 표를 팝업 폭에 맞춰 축소할 때, 폭이 바뀌면 다시 맞추기 위한 관찰자

  // 이 일수를 넘는 연속 근무(=6일째부터)는 만들지 않는다.
  const SCHEDULE_AUTO_MAX_WORK_STREAK = 5;
  const SCHEDULE_AUTO_DOW_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

  // scheduleStaffMonthCounts()의 "오프" 합계와 같은 기준. 연차(ANNUAL)·공가(GONGGA)는
  // 여기 포함시키지 않는다 — 목표 개수 계산에서 "별도로 계산"해달라는 요청 때문.
  function scheduleAutoOffGroupStatuses() {
    return ["OFF", "DAEHYU", "GONGHYU", "MATERNITY", "SPECIAL"];
  }

  // 금(5)·토(6)·월(1)은 필요인력 허용범위를 ±1명으로 더 타이트하게, 그 외 요일은 ±1~2명까지 허용.
  function scheduleAutoTolerance(dow) {
    return (dow === 5 || dow === 6 || dow === 1) ? 1 : 2;
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

  // 이번 달 이미 채워진 "오프류" 칸 개수 (연차·공가는 제외).
  function scheduleAutoAlreadyOffCount(staffId, year, monthIndex) {
    const offGroup = scheduleAutoOffGroupStatuses();
    const daysInMonth = scheduleDaysInMonth(year, monthIndex);
    let n = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const rec = scheduleData.records[scheduleRecordKey(staffId, scheduleDateKey(year, monthIndex, d))];
      if (rec && offGroup.indexOf(rec.status) !== -1) n++;
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
  function scheduleAutoBuildPlan(year, monthIndex) {
    const daysInMonth = scheduleDaysInMonth(year, monthIndex);
    const targetInfo = scheduleAutoTargetInfo(year, monthIndex);
    const target = targetInfo.target;
    const monthStaff = getStaffListForMonth(year, monthIndex);
    const TYPES = ["채팅", "유선"];
    const LIMIT = SCHEDULE_AUTO_MAX_WORK_STREAK;
    const nonAdmin = monthStaff.filter((s) => !s.isAdmin);

    // 조(DAY/NIGHT)×업무구분×날짜별 "현재 투입 인원수"를 시뮬레이션하면서 하나씩 줄여나간다.
    // (관리자는 필요인력 집계 자체에서 빠지므로 여기 포함하지 않는다 — 표 렌더링과 동일한 기준)
    const working = {};
    const required = {};
    ["DAY", "NIGHT"].forEach((g) => {
      const groupStaff = nonAdmin.filter((s) => (g === "NIGHT" ? s.group === "night" : s.group !== "night"));
      working[g] = {}; required[g] = {};
      TYPES.forEach((t) => {
        working[g][t] = {}; required[g][t] = {};
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
      const baseRest = {}, isFreeDay = {};
      for (let d = 1; d <= daysInMonth; d++) {
        const key = scheduleRecordKey(s.id, scheduleDateKey(year, monthIndex, d));
        const has = Object.prototype.hasOwnProperty.call(scheduleData.records, key);
        isFreeDay[d] = !has;
        baseRest[d] = has && !scheduleAutoIsWorkRecord(scheduleData.records[key]);
      }
      const chosen = {};

      // 날짜별 점수(클수록 좋고, 앞 항목이 우선. 고른 날짜들의 합을 앞자리부터 비교한다):
      // ① 그 인원의 조×업무구분 필요인력 허용범위(±1~2, 금/토/월은 ±1) 안에 들어오는지
      // ② 선호 오프 요일인지(소프트 조건) ③ 필요인력이 아예 입력 안 된(제약 없는) 날짜인지
      // ④ 여유(허용범위 - 오차)가 큰(가장 안전한) 날짜인지 ⑤ 이번 실행에서 이미 몰린 날짜는 피해서 분산
      // ⑥ 그래도 같으면 빠른 날짜. 이 앞에 "5일 초과 연속 근무 최소화"가 항상 가장 먼저 적용된다.
      const dayFeasible = {}, dayVec = {};
      remainingFree.forEach((d) => {
        const dow = new Date(year, monthIndex, d).getDay();
        const tol = scheduleAutoTolerance(dow);
        let feasible = true;
        let hasConstraint = false;
        let minSlack = Infinity;
        staffTypes.forEach((t) => {
          const req = required[g][t][d];
          if (req === null) return;
          hasConstraint = true;
          const diff = (working[g][t][d] - 1) - req;
          if (Math.abs(diff) > tol) feasible = false;
          minSlack = Math.min(minSlack, tol - Math.abs(diff));
        });
        dayFeasible[d] = feasible;
        dayVec[d] = [
          feasible ? 1 : 0,
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
        warnings.push(`${staffLabel}님은 빈 칸이 부족해 목표 ${needed}개 중 ${assigned.length}개만 배정됐어요.`);
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

    return { year, monthIndex, target, targetInfo, perStaffPlan, warnings };
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

  // ----- 미리보기 팝업 -----
  function closeScheduleAutoModal() {
    const existing = document.getElementById("sch-auto-overlay");
    if (existing) existing.remove();
    document.removeEventListener("keydown", scheduleAutoEscHandler, true);
    if (scheduleAutoFitObserver) { scheduleAutoFitObserver.disconnect(); scheduleAutoFitObserver = null; }
  }
  function scheduleAutoEscHandler(e) {
    if (e.key === "Escape") closeScheduleAutoModal();
  }

  // 인원별 선호 오프 요일 설정 영역(접었다 펼 수 있음). 칸을 누르면 바로 저장되고 미리보기가 다시 계산된다.
  function scheduleAutoPrefsHtml(staffList) {
    const setCount = staffList.filter((s) => scheduleAutoGetPrefDows(s.id).length > 0).length;
    const rows = staffList.map((s) => {
      const on = scheduleAutoGetPrefDows(s.id);
      const chips = SCHEDULE_AUTO_DOW_LABELS.map((label, dow) => {
        const isOn = on.indexOf(dow) !== -1;
        return `<button type="button" class="sch-auto-pref-chip${isOn ? " on" : ""}" data-auto-pref-staff="${esc(s.id)}" data-auto-pref-dow="${dow}" aria-pressed="${isOn ? "true" : "false"}">${label}</button>`;
      }).join("");
      return `
        <div class="sch-auto-pref-row">
          <span class="sch-auto-pref-name">${esc(s.name || "")}${s.nickname ? ` <span class="sch-adjust-nick">${esc(s.nickname)}</span>` : ""}</span>
          <span class="sch-auto-pref-chips">${chips}</span>
        </div>`;
    }).join("");
    return `
      <details class="sch-auto-prefs">
        <summary>인원별 선호 오프 요일 <span class="sch-auto-prefs-count" id="sch-auto-prefs-count">${setCount > 0 ? `(${setCount}명 설정됨)` : "(설정 없음)"}</span></summary>
        <div class="sch-auto-prefs-desc">
          오프를 넣고 싶은 요일을 눌러 두면(여러 개 가능) 자동 배치가 그 요일을 우선해서 골라요. 반드시 지키는 조건은 아니라서,
          필요인력 허용범위나 연속 근무 5일 제한 때문에 조정이 필요하면 다른 날로 바뀔 수 있어요. 설정은 달이 바뀌어도 그 사람에게 계속 적용돼요.
        </div>
        <div class="sch-auto-prefs-list">${rows || `<div class="sch-adjust-empty">이번 달 인원이 없어요.</div>`}</div>
      </details>`;
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
    const emptyHtml = totalAssigned === 0
      ? `<div class="sch-auto-none">이번 달은 새로 배정할 칸이 없어요(이미 목표 개수를 채웠거나 대상 인원이 없어요).</div>`
      : "";
    return `
      <div class="sch-auto-total">총 <b>${totalAssigned}칸</b>이 새로 채워질 예정이에요.${prefTotal > 0 ? ` 선호 요일 반영 <b>${prefHits}/${prefTotal}칸</b>.` : ""}</div>
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
    scheduleAutoPlan = scheduleAutoBuildPlan(scheduleUi.year, scheduleUi.monthIndex);
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
    scheduleAutoPlan = scheduleAutoBuildPlan(year, monthIndex);
    const plan = scheduleAutoPlan;
    const monthStaff = getStaffListForMonth(year, monthIndex);
    const totalAssigned = plan.perStaffPlan.reduce((sum, p) => sum + p.assigned.length, 0);

    const overlay = document.createElement("div");
    overlay.id = "sch-auto-overlay";
    overlay.className = "sch-preview-overlay";
    overlay.innerHTML = `
      <div class="sch-preview-box sch-auto-box">
        <div class="sch-preview-head">
          <span>${ICON_SPARK} AI 자동 배치 미리보기 · ${esc(scheduleMonthLabel())}</span>
          <button type="button" class="sch-preview-close" id="sch-auto-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="sch-preview-body sch-auto-body">
          <div class="sch-auto-desc">
            이번 달 공휴일 ${plan.targetInfo.holidayCount}일 + 토요일 ${plan.targetInfo.saturdayCount}일 + 일요일 ${plan.targetInfo.sundayCount}일 = 인원별 목표 <b>${plan.target}개</b>.
            이미 입력된 오프류(오프·공휴·대휴·육휴·특휴)는 목표에서 빼고, 연차·공가는 별도로 두고(목표 달성에 포함 안 함) 계산했어요.
            이미 뭔가 입력된 칸은 손대지 않고 기본값(근무)인 빈 칸에만, 조×업무구분 필요인력 대비 ±1~2명(금·토·월은 ±1명) 범위 안에서 골라 채워요.
            <br>연속 근무는 <b>최대 ${SCHEDULE_AUTO_MAX_WORK_STREAK}일</b>까지만 나오게 배치해요. 지난달에도 있던 인원은 지난달 말일부터 이어진 연속 근무일수를 월 초에 포함해서 세요(근무·반차·교육은 근무일, 오프류·연차·공가 등은 쉬는 날로 셈).
            <br>아래 미리보기는 월별 스케줄 표와 같은 모양이고, 새로 배정될 오프는 파란 테두리로 표시돼요. 아직 아무것도 저장되지 않았고, "이대로 입력"을 눌러야 반영돼요.
          </div>
          ${scheduleAutoPrefsHtml(monthStaff)}
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
    const applyBtn = document.getElementById("sch-auto-apply-btn");
    if (applyBtn) applyBtn.onclick = () => scheduleAutoApplyPlan(scheduleAutoPlan);
    // 선호 요일 칸: 누르면 바로 저장하고, 칸 모양만 바꾼 뒤 미리보기를 다시 계산한다
    // (목록 전체를 다시 그리지 않아서 스크롤·펼침 상태가 유지된다).
    overlay.addEventListener("click", (e) => {
      const chip = e.target && e.target.closest ? e.target.closest("[data-auto-pref-staff]") : null;
      if (!chip) return;
      const staffId = chip.getAttribute("data-auto-pref-staff");
      const dow = Number(chip.getAttribute("data-auto-pref-dow"));
      scheduleAutoTogglePrefDow(staffId, dow);
      const isOn = scheduleAutoGetPrefDows(staffId).indexOf(dow) !== -1;
      chip.classList.toggle("on", isOn);
      chip.setAttribute("aria-pressed", isOn ? "true" : "false");
      const setCount = monthStaff.filter((s) => scheduleAutoGetPrefDows(s.id).length > 0).length;
      const countEl = document.getElementById("sch-auto-prefs-count");
      if (countEl) countEl.textContent = setCount > 0 ? `(${setCount}명 설정됨)` : "(설정 없음)";
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
