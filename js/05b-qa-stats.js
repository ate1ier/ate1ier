  // 05b-qa-stats.js — 월 키/점수 getter·setter, 통계, 홈 화면 트렌드 계산
  // (05-qa.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  function qaMonthKey(year, monthIndex) { return `${year}-${pad2(monthIndex + 1)}`; }
  function qaMonthLabel() { return `${qaUi.year}년 ${qaUi.monthIndex + 1}월`; }
  function qaScoreEntryKey(agentId, year, monthIndex) { return `${agentId}|${qaMonthKey(year, monthIndex)}`; }

  // ----- 월별 "잠금" (월별 스케줄과 동일한 규칙) -----
  // monthLocks[key] === true  → 사용자가 강제로 잠가둔 상태
  // monthLocks[key] === false → 사용자가 강제로 잠금을 풀어둔 상태(지나간 달이라도 수정 가능)
  // 없으면 → 지나간 달은 기본적으로 잠기고, 이번 달·미래 달은 기본적으로 풀려 있다.
  function qaCurrentMonthKey() { return qaMonthKey(today.getFullYear(), today.getMonth()); }
  function qaIsMonthPast(year, monthIndex) { return qaMonthKey(year, monthIndex) < qaCurrentMonthKey(); }
  function qaIsMonthLocked(year, monthIndex) {
    const key = qaMonthKey(year, monthIndex);
    if (Object.prototype.hasOwnProperty.call(qaData.monthLocks, key)) return !!qaData.monthLocks[key];
    return qaIsMonthPast(year, monthIndex);
  }
  function qaToggleMonthLock(year, monthIndex) {
    const key = qaMonthKey(year, monthIndex);
    qaData.monthLocks[key] = !qaIsMonthLocked(year, monthIndex);
    saveQAData();
    renderApp();
  }

  function qaShiftMonth(delta) {
    let m = qaUi.monthIndex + delta;
    let y = qaUi.year;
    while (m < 0) { m += 12; y -= 1; }
    while (m > 11) { m -= 12; y += 1; }
    qaUi.monthIndex = m;
    qaUi.year = y;
    renderApp();
  }

  // 해당 인원·월의 점수를 반환한다. 없으면 null.
  // (예전 버전에서는 유선/채팅 점수를 따로 저장했는데, 그 형식으로 남아있는 데이터는
  //  두 값의 평균으로 자동 변환해서 보여준다.)
  function getQAScore(agentId, year, monthIndex) {
    const rec = qaData.scores[qaScoreEntryKey(agentId, year, monthIndex)];
    if (rec === undefined || rec === null) return null;
    if (typeof rec === "object") {
      const vals = [rec.voice, rec.chat].filter((v) => v !== null && v !== undefined);
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
    }
    return rec;
  }
  // rawValue가 빈 문자열이면 그 값을 지운다.
  function setQAScore(agentId, year, monthIndex, rawValue) {
    if (qaIsMonthLocked(year, monthIndex)) { flashQAStatus("잠긴 달이에요. 잠금을 해제한 뒤 입력해주세요."); return; }
    const key = qaScoreEntryKey(agentId, year, monthIndex);
    const trimmed = String(rawValue == null ? "" : rawValue).trim();
    if (trimmed === "") { delete qaData.scores[key]; saveQAData(); return; }
    const parsed = Number(trimmed);
    if (isNaN(parsed)) return;
    qaData.scores[key] = Math.max(0, Math.min(100, parsed));
    saveQAData();
  }

  // 한 인원의 그 달 점수(입력값 그 자체).
  function qaOverallScore(agentId, year, monthIndex) {
    return getQAScore(agentId, year, monthIndex);
  }

  function qaAvg(list) {
    const vals = list.filter((v) => v !== null && v !== undefined);
    if (vals.length === 0) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }

  // ----- 퇴사자의 품질 관리 목록 유지 기간 -----
  // "상담사 관리"에서 퇴사로 바뀌어도 품질관리에서 바로 사라지지 않는다. 퇴사 처리된
  // 달과 그 다음 달까지는 이름에 취소선을 그은 채로 목록에 계속 남아있다가, 그 다음
  // 달(=퇴사월+2)부터는 자연스럽게 목록에서 빠진다.
  function qaResignMonthKey(resignDate) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(resignDate || "");
    return m ? `${m[1]}-${m[2]}` : null;
  }
  function qaResignKeepUntilKey(resignDate) {
    const key = qaResignMonthKey(resignDate);
    if (!key) return null;
    const parts = key.split("-").map(Number);
    let year = parts[0], monthIndex = parts[1]; // parts[1]은 1-based 월이므로 그대로 쓰면 "다음 달"의 0-based 인덱스가 된다
    if (monthIndex > 11) { monthIndex -= 12; year += 1; }
    return qaMonthKey(year, monthIndex);
  }
  // 특정 달의 품질관리 목록에 이 상담사가 보여야 하는지 판단한다.
  // 재직중이면 항상 보이고, 퇴사자는 퇴사월과 그 다음달까지만 보인다.
  function qaAgentVisibleInMonth(a, year, monthIndex) {
    if (a.status !== "RESIGNED") return true;
    const keepUntil = qaResignKeepUntilKey(a.resignDate);
    if (!keepUntil) return true; // 퇴사일자 정보가 없으면 안전하게 계속 보여준다
    return qaMonthKey(year, monthIndex) <= keepUntil;
  }

  // QA 관리 대상 상담사 목록. 관리자는 제외하고, 재직중인 인원 + (유지 기간 안의) 퇴사자를
  // 함께 가져온다. year/monthIndex를 생략하면 현재 화면에 보이는 달(qaUi) 기준으로 계산한다.
  // "상담사 관리"의 기본 정렬을 그대로 따른다.
  function qaWorkingAgents(year, monthIndex) {
    const y = (year === undefined || year === null) ? qaUi.year : year;
    const mi = (monthIndex === undefined || monthIndex === null) ? qaUi.monthIndex : monthIndex;
    return sortAgentList(agentsData.filter((a) => !a.isAdmin && qaAgentVisibleInMonth(a, y, mi)), "shift");
  }

  // 인원마다 점수는 하나뿐이지만, "업무구분"(유선/채팅) · "조"(주간/야간) 태그를 기준으로
  // 그 점수를 여러 통계에 나눠 담는다.
  function qaComputeStats(agentsList, year, monthIndex) {
    const hasVoice = (a) => (a.workTypes || []).indexOf("유선") !== -1;
    const hasChat = (a) => (a.workTypes || []).indexOf("채팅") !== -1;
    const isDay = (a) => a.group !== "night";
    const isNight = (a) => a.group === "night";
    const scoreOf = (a) => qaOverallScore(a.id, year, monthIndex);

    return {
      voice: qaAvg(agentsList.filter(hasVoice).map(scoreOf)),
      chat: qaAvg(agentsList.filter(hasChat).map(scoreOf)),
      day: qaAvg(agentsList.filter(isDay).map(scoreOf)),
      night: qaAvg(agentsList.filter(isNight).map(scoreOf)),
      dayChat: qaAvg(agentsList.filter((a) => isDay(a) && hasChat(a)).map(scoreOf)),
      dayVoice: qaAvg(agentsList.filter((a) => isDay(a) && hasVoice(a)).map(scoreOf)),
      nightChat: qaAvg(agentsList.filter((a) => isNight(a) && hasChat(a)).map(scoreOf)),
      nightVoice: qaAvg(agentsList.filter((a) => isNight(a) && hasVoice(a)).map(scoreOf)),
      total: qaAvg(agentsList.map(scoreOf)),
    };
  }

  function qaPrevMonth(year, monthIndex) {
    let m = monthIndex - 1;
    let y = year;
    if (m < 0) { m = 11; y -= 1; }
    return { year: y, monthIndex: m };
  }

  /* ---- 홈 화면 QA 카드: "이번 달"이 아니라 "점수가 입력된 가장 최근 달" 찾기 ----
     달이 막 바뀌면 그 달 점수는 한동안 입력이 안 되어 있는 게 정상이라, 이번 달
     기준으로만 보면 계속 "점수 없음"으로 보인다. 이번 달부터 거꾸로 훑어서 전체
     평균이 있는 첫 달을 찾아 그 달 기준으로 보여준다. */
  const QA_HOME_LATEST_LOOKBACK_MONTHS = 12;
  function qaHomeFindLatestMonthWithData(agentsList, year, monthIndex) {
    let y = year, m = monthIndex;
    for (let i = 0; i < QA_HOME_LATEST_LOOKBACK_MONTHS; i++) {
      const stats = qaComputeStats(agentsList, y, m);
      if (stats.total !== null) return { year: y, monthIndex: m, stats };
      const prev = qaPrevMonth(y, m);
      y = prev.year; m = prev.monthIndex;
    }
    return null;
  }

  /* ---- 홈 화면 QA 카드: 최근 N개월 전체 평균 추이 꺾은선 그래프 ----
     qaTrendSvgHtml(개인별)과 같은 방식이지만, 인원 개인이 아니라 매달 전체
     평균(qaComputeStats(...).total)을 점으로 찍는다. */
  const QA_HOME_TREND_MONTHS = 6;
  function qaHomeComputeTrend(agentsList, year, monthIndex, count) {
    const months = [];
    for (let i = count - 1; i >= 0; i--) {
      let m = monthIndex - i;
      let y = year;
      while (m < 0) { m += 12; y -= 1; }
      months.push({ year: y, monthIndex: m, score: qaComputeStats(agentsList, y, m).total });
    }
    return months;
  }
  function qaHomeTrendSvgHtml(agentsList, year, monthIndex) {
    const months = qaHomeComputeTrend(agentsList, year, monthIndex, QA_HOME_TREND_MONTHS);
    const validScores = months.map((mo) => mo.score).filter((s) => s !== null);
    if (validScores.length === 0) return "";

    const W = 560, H = 148, padL = 10, padR = 10, padT = 22, padB = 24;
    const plotW = W - padL - padR, plotH = H - padT - padB;
    const n = months.length;
    const xAt = (i) => padL + (n === 1 ? plotW / 2 : (plotW * i) / (n - 1));
    let min = Math.min(...validScores);
    let max = Math.max(...validScores);
    if (min === max) { min -= 5; max += 5; } else { const pad = (max - min) * 0.2; min -= pad; max += pad; }
    min = Math.max(0, min);
    max = Math.min(100, max);
    if (max - min < 1) max = min + 1;
    const yAt = (score) => padT + plotH - ((score - min) / (max - min)) * plotH;

    const segments = [];
    let cur = [];
    months.forEach((mo, i) => {
      if (mo.score === null) { if (cur.length) segments.push(cur); cur = []; }
      else cur.push({ x: xAt(i), y: yAt(mo.score) });
    });
    if (cur.length) segments.push(cur);
    const pathHtml = segments.map((seg) => {
      const d = seg.map((p, idx) => `${idx === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
      return `<path d="${d}" fill="none" stroke="var(--accent)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;
    }).join("");

    const dotHtml = months.map((mo, i) => {
      if (mo.score === null) return "";
      const x = xAt(i), y = yAt(mo.score);
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.6" fill="var(--accent)"/><text x="${x.toFixed(1)}" y="${(y - 10).toFixed(1)}" text-anchor="middle" class="qa-trend-value">${mo.score.toFixed(1)}</text>`;
    }).join("");

    const labelHtml = months.map((mo, i) => {
      const x = xAt(i);
      const isCurrent = mo.year === year && mo.monthIndex === monthIndex;
      return `<text x="${x.toFixed(1)}" y="${H - 6}" text-anchor="middle" class="qa-trend-month${isCurrent ? " current" : ""}">${mo.monthIndex + 1}월</text>`;
    }).join("");

    return `
      <div class="qa-trend-block home-qa-trend-block">
        <div class="qa-trend-title">최근 ${QA_HOME_TREND_MONTHS}개월 전체 평균 추이</div>
        <svg viewBox="0 0 ${W} ${H}" class="qa-trend-svg" preserveAspectRatio="xMidYMid meet">
          ${pathHtml}
          ${dotHtml}
          ${labelHtml}
        </svg>
      </div>
    `;
  }

  /* ===================== QA 평가 엑셀 업로드 → 점수/상세 자동 반영 ===================== */
  // 파일마다 "평균" 행, "총점" 열, "구분" 열의 실제 위치(행/열)가 달라질 수 있어서
  // 매번 셀 값을 직접 탐색해서 찾는다(고정된 셀 주소를 쓰지 않음).

