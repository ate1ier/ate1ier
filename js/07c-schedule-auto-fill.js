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

  let scheduleAutoPlan = null; // 미리보기에 띄워둔 계획. 적용 버튼에서 이 값을 그대로 씀.

  // scheduleStaffMonthCounts()의 "오프" 합계와 같은 기준. 연차(ANNUAL)·공가(GONGGA)는
  // 여기 포함시키지 않는다 — 목표 개수 계산에서 "별도로 계산"해달라는 요청 때문.
  function scheduleAutoOffGroupStatuses() {
    return ["OFF", "DAEHYU", "GONGHYU", "MATERNITY", "SPECIAL"];
  }

  // 금(5)·토(6)·월(1)은 필요인력 허용범위를 ±1명으로 더 타이트하게, 그 외 요일은 ±1~2명까지 허용.
  function scheduleAutoTolerance(dow) {
    return (dow === 5 || dow === 6 || dow === 1) ? 1 : 2;
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

    // 목표까지 더 많이 남은 인원부터 먼저 좋은 날짜를 고를 수 있게 정렬(안정 정렬 유지)
    const order = monthStaff.map((s, idx) => ({ s, idx }));
    order.sort((a, b) => {
      const na = Math.max(0, target - scheduleAutoAlreadyOffCount(a.s.id, year, monthIndex));
      const nb = Math.max(0, target - scheduleAutoAlreadyOffCount(b.s.id, year, monthIndex));
      if (nb !== na) return nb - na;
      return a.idx - b.idx;
    });

    order.forEach(({ s }) => {
      const alreadyOff = scheduleAutoAlreadyOffCount(s.id, year, monthIndex);
      const needed = Math.max(0, target - alreadyOff);
      const g = s.group === "night" ? "NIGHT" : "DAY";
      const staffTypes = s.isAdmin ? [] : TYPES.filter((t) => (s.types || []).indexOf(t) !== -1);
      const remainingFree = scheduleAutoFreeDays(s.id, year, monthIndex);
      const assigned = [];

      for (let i = 0; i < needed; i++) {
        if (remainingFree.length === 0) break;

        // 후보 날짜 채점: ① 배정해도 그 인원의 조×업무구분 필요인력 허용범위(±1~2, 금/토/월은
        // ±1) 안에 들어오는지 ② 필요인력이 아예 입력 안 된(제약 없는) 날짜 우선 ③ 여유가 가장
        // 큰(가장 안전한) 날짜 우선 ④ 이번 실행에서 이미 몰린 날짜는 피해서 분산 ⑤ 그래도 같으면 빠른 날짜.
        let best = null;
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
          const cand = { d, feasible, hasConstraint, minSlack: hasConstraint ? minSlack : Infinity, crowding: assignedCountByDay[d] };
          if (!best) { best = cand; return; }
          if (cand.feasible !== best.feasible) { if (cand.feasible) best = cand; return; }
          if (cand.hasConstraint !== best.hasConstraint) { if (!cand.hasConstraint) best = cand; return; }
          if (cand.minSlack !== best.minSlack) { if (cand.minSlack > best.minSlack) best = cand; return; }
          if (cand.crowding !== best.crowding) { if (cand.crowding < best.crowding) best = cand; return; }
          if (cand.d < best.d) best = cand;
        });

        if (!best) break;
        if (!best.feasible) {
          warnings.push(`${s.name || s.nickname || "이름 없음"}님 ${monthIndex + 1}/${best.d} — 필요인력 허용범위를 벗어나 배치됐어요. 확인해주세요.`);
        }
        assigned.push(best.d);
        assignedCountByDay[best.d] += 1;
        staffTypes.forEach((t) => { working[g][t][best.d] -= 1; });
        const pos = remainingFree.indexOf(best.d);
        if (pos !== -1) remainingFree.splice(pos, 1);
      }

      if (assigned.length < needed) {
        warnings.push(`${s.name || s.nickname || "이름 없음"}님은 빈 칸이 부족해 목표 ${needed}개 중 ${assigned.length}개만 배정됐어요.`);
      }

      if (needed > 0 || assigned.length > 0) {
        perStaffPlan.push({
          staffId: s.id,
          name: s.name,
          nickname: s.nickname,
          alreadyOff,
          needed,
          assigned: assigned.slice().sort((a, b) => a - b),
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
  }
  function scheduleAutoEscHandler(e) {
    if (e.key === "Escape") closeScheduleAutoModal();
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
    const totalAssigned = plan.perStaffPlan.reduce((sum, p) => sum + p.assigned.length, 0);

    const rowsHtml = plan.perStaffPlan.length === 0
      ? `<div class="sch-adjust-empty">이번 달은 새로 배정할 인원이 없어요(이미 목표 개수를 채웠거나 대상 인원이 없어요).</div>`
      : `<table class="sch-auto-table">
          <thead><tr><th>이름</th><th>기존 오프류</th><th>목표</th><th>새로 배정</th><th>배정 날짜</th></tr></thead>
          <tbody>
            ${plan.perStaffPlan.map((p) => `
              <tr>
                <td>${esc(p.name || "")}${p.nickname ? ` <span class="sch-adjust-nick">${esc(p.nickname)}</span>` : ""}</td>
                <td>${p.alreadyOff}</td>
                <td>${plan.target}</td>
                <td>${p.assigned.length}${p.assigned.length < p.needed ? ` <span class="sch-auto-short">부족</span>` : ""}</td>
                <td>${p.assigned.length ? p.assigned.map((d) => `${monthIndex + 1}/${d}`).join(", ") : "-"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>`;

    const warningsHtml = plan.warnings.length === 0 ? "" : `
      <div class="sch-auto-warnings">
        <div class="sch-auto-warnings-title">⚠ 확인이 필요해요</div>
        ${plan.warnings.map((w) => `<div class="sch-auto-warning-item">${esc(w)}</div>`).join("")}
      </div>
    `;

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
            아직 아무것도 저장되지 않았고, 아래에서 "이대로 입력"을 눌러야 반영돼요. 총 <b>${totalAssigned}칸</b>이 새로 채워질 예정이에요.
          </div>
          ${warningsHtml}
          ${rowsHtml}
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
    setTimeout(() => document.addEventListener("keydown", scheduleAutoEscHandler, true), 0);
  }
