  function loadQAData() {
    try {
      const raw = localStorage.getItem(QA_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return (parsed && typeof parsed === "object" && parsed.scores) ? parsed : { scores: {} };
    } catch (e) { return { scores: {} }; }
  }
  let qaData = loadQAData();
  // 월별 스케줄과 동일한 방식의 "월별 잠금". 잠긴 달은 점수 입력이 막힌다.
  if (!qaData.monthLocks || typeof qaData.monthLocks !== "object") qaData.monthLocks = {};
  // 엑셀 업로드로 뽑아낸 상세 QA 내역(회차별 감점/코멘트 원문 + 정리된 텍스트 캐시).
  // qaData(=계정별 클라우드 동기화 대상) 안에 같이 저장한다.
  if (!qaData.details || typeof qaData.details !== "object") qaData.details = {};

  // ----- 업로드한 엑셀 원문의 자동 만료 -----
  // 업로드일로부터 2개월이 지나면 회차별 원문(감점 항목/코멘트)은 자동으로 지운다.
  // 단, 그 전에 만들어둔 정리된 텍스트(aiSummary)는 원문이 사라져도 그대로 남는다("박제").
  const QA_DETAIL_EXPIRY_MONTHS = 2;
  function qaDetailExpiryDate(detail) {
    if (!detail || !detail.uploadedAt) return null;
    const d = new Date(detail.uploadedAt);
    if (isNaN(d.getTime())) return null;
    d.setMonth(d.getMonth() + QA_DETAIL_EXPIRY_MONTHS);
    return d;
  }
  function qaIsDetailExpired(detail) {
    const exp = qaDetailExpiryDate(detail);
    return !!exp && new Date() >= exp;
  }
  function qaPurgeExpiredDetails() {
    let changed = false;
    Object.keys(qaData.details).forEach((key) => {
      const detail = qaData.details[key];
      if (!detail || detail.purged) return;
      if (!qaIsDetailExpired(detail)) return;
      (detail.rounds || []).forEach((round) => { round.items = []; });
      detail.fileName = "";
      detail.purged = true;
      changed = true;
    });
    if (changed) saveQAData();
  }
  qaPurgeExpiredDetails();

  function qaDetailKey(agentId, year, monthIndex) { return `${agentId}|${qaMonthKey(year, monthIndex)}`; }
  function getQADetail(agentId, year, monthIndex) { return qaData.details[qaDetailKey(agentId, year, monthIndex)] || null; }
  function setQADetail(agentId, year, monthIndex, detailObj) {
    qaData.details[qaDetailKey(agentId, year, monthIndex)] = detailObj;
    saveQAData();
  }
  // 상담사 1명의 등록된 엑셀(원문+정리된 텍스트 전부)을 완전히 삭제한다.
  function deleteQADetail(agentId, year, monthIndex) {
    delete qaData.details[qaDetailKey(agentId, year, monthIndex)];
    saveQAData();
  }
  // 해당 달에 등록된 모든 상담사의 엑셀(원문+정리된 텍스트 전부)을 한 번에 삭제한다.
  function deleteAllQADetails(year, monthIndex) {
    const suffix = `|${qaMonthKey(year, monthIndex)}`;
    let count = 0;
    Object.keys(qaData.details).forEach((key) => {
      if (key.endsWith(suffix)) { delete qaData.details[key]; count++; }
    });
    if (count > 0) saveQAData();
    return count;
  }

  let qaStatusTimer = null;
  function flashQAStatus(msg) {
    const el = document.getElementById("qa-status");
    if (!el) return;
    el.textContent = msg;
    clearTimeout(qaStatusTimer);
    qaStatusTimer = setTimeout(() => { el.textContent = ""; }, 1200);
  }
  function saveQAData() {
    try { localStorage.setItem(QA_KEY, JSON.stringify(qaData)); flashQAStatus("저장됨"); }
    catch (e) { flashQAStatus("저장 실패"); }
  }

  const qaUi = {
    year: today.getFullYear(),
    monthIndex: today.getMonth(), // 0-based. 실시간 기준 당월로 시작한다.
    searchQuery: "", // 상담사 검색어. 쉼표(,)로 여러 명을 한 번에 검색할 수 있다.
  };

  // ----- 상담사 검색 -----
  // "상담사 관리"의 검색(이름/LDAP/초성)과 같은 방식을 쓰되, 쉼표(,)로 여러 명을 구분해서
  // 입력하면 그 중 하나라도 일치하는 상담사를 모두 보여준다.
  function qaAgentMatchesSearch(a, query) {
    const terms = (query || "").split(",").map((t) => t.trim()).filter(Boolean);
    if (terms.length === 0) return true;
    return terms.some((t) => agentMatchesSearch(a, t));
  }
  // 상담사 상세에서 "품질 관리로 이동"을 눌렀을 때, 이동한 화면에서 그 인원의 행을
  // 한 번 강조해서 보여주기 위한 값. 렌더링 후 바로 비워서 다음 화면 갱신부터는
  // 강조가 남지 않게 한다.
  let qaHighlightAgentId = null;

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
  // 근무중인(재직) 상담사만 QA 관리 대상으로 가져온다. 관리자는 제외한다. "상담사 관리"의 기본 정렬을 그대로 따른다.
  function qaWorkingAgents() {
    return sortAgentList(agentsData.filter((a) => a.status !== "RESIGNED" && !a.isAdmin), "shift");
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

  function qaColLetterToNum(letters) {
    let n = 0;
    for (let i = 0; i < letters.length; i++) n = n * 26 + (letters.charCodeAt(i) - 64);
    return n;
  }
  // 병합 셀·수식 셀 어디서든 "실제로 화면에 보이는 값"을 안전하게 꺼낸다.
  function qaCellRawValue(ws, row, col) {
    const cell = ws.getRow(row).getCell(col);
    let val = cell.value;
    if (cell.isMerged && cell.master && cell.master !== cell) val = cell.master.value;
    if (val && typeof val === "object") {
      if (val instanceof Date) return val;
      if (Object.prototype.hasOwnProperty.call(val, "result")) val = val.result;
      else if (Array.isArray(val.richText)) val = val.richText.map((t) => t.text).join("");
      else if (Object.prototype.hasOwnProperty.call(val, "text")) val = val.text;
      else if (Object.prototype.hasOwnProperty.call(val, "error")) val = null;
    }
    return val;
  }
  function qaCellText(ws, row, col) {
    const v = qaCellRawValue(ws, row, col);
    if (v === null || v === undefined) return "";
    if (v instanceof Date) return "";
    return String(v).trim();
  }
  // 시트 전체(또는 위쪽 몇 줄)에서 특정 텍스트와 정확히 일치하는 칸을 찾는다.
  function qaFindCell(ws, targetText, opts) {
    opts = opts || {};
    const maxRow = opts.maxRow || ws.rowCount;
    const maxCol = opts.maxCol || ws.columnCount;
    for (let r = 1; r <= maxRow; r++) {
      for (let c = 1; c <= maxCol; c++) {
        if (qaCellText(ws, r, c) === targetText) return { row: r, col: c };
      }
    }
    return null;
  }
  // 위와 같지만 "포함" 여부로 찾는다(칸 이름이 "상담ID", "상담 ID" 등으로 조금씩 달라도 잡히게).
  function qaFindCellContains(ws, targetText, opts) {
    opts = opts || {};
    const maxRow = opts.maxRow || ws.rowCount;
    const maxCol = opts.maxCol || ws.columnCount;
    for (let r = 1; r <= maxRow; r++) {
      for (let c = 1; c <= maxCol; c++) {
        const t = qaCellText(ws, r, c).replace(/\s+/g, "");
        if (t && t.indexOf(targetText) !== -1) return { row: r, col: c };
      }
    }
    return null;
  }

  // 시트 하나를 분석해서 { totalScore, rounds } 형태로 돌려준다.
  // rounds: 구분 열의 "1차/2차/…" 라벨이 여러 행에 걸쳐 병합된 블록마다,
  // 그 블록 안에서 2칸 이상 가로로 병합된(=서술형 코멘트) 칸의 내용을 모은 것.
  function qaParseWorksheet(ws) {
    const avgCell = qaFindCell(ws, "평균");
    const totalCell = qaFindCell(ws, "총점", { maxRow: 12 });
    if (!avgCell || !totalCell) throw new Error("'평균' 행 또는 '총점' 열을 찾지 못했어요.");
    const rawScore = qaCellRawValue(ws, avgCell.row, totalCell.col);
    const scoreNum = Number(rawScore);
    if (rawScore === null || rawScore === undefined || isNaN(scoreNum)) throw new Error("평균×총점 칸의 값이 숫자가 아니에요.");
    // 엑셀 수식이 내부적으로 81.166666...처럼 소수점 아래 여러 자리를 들고 있어도,
    // 엑셀 화면(및 우리 목록)에는 소수점 첫째 자리까지만 보이므로 그 표시값과
    // 저장되는 값이 어긋나지 않도록 여기서 미리 소수 첫째 자리로 반올림해서 저장한다.
    const score = Math.round(scoreNum * 10) / 10;

    const merges = (ws.model && ws.model.merges ? ws.model.merges : [])
      .map((rangeStr) => {
        const m = /^([A-Z]+)(\d+):([A-Z]+)(\d+)$/.exec(rangeStr);
        if (!m) return null;
        return { c1: qaColLetterToNum(m[1]), r1: parseInt(m[2], 10), c2: qaColLetterToNum(m[3]), r2: parseInt(m[4], 10) };
      })
      .filter(Boolean);

    const gubunCell = qaFindCell(ws, "구분");
    const gubunCol = gubunCell ? gubunCell.col : 2;

    const roundBlocks = merges
      .filter((mg) => mg.c1 === gubunCol && mg.c2 === gubunCol && mg.r2 > mg.r1)
      .map((mg) => ({ label: qaCellText(ws, mg.r1, mg.c1).replace(/\s+/g, ""), startRow: mg.r1, endRow: mg.r2 }))
      .filter((b) => /^\d+차$/.test(b.label))
      .sort((a, b) => a.startRow - b.startRow);

    const roundSummaryRows = [];
    for (let r = 1; r <= ws.rowCount; r++) {
      const label = qaCellText(ws, r, gubunCol).replace(/\s+/g, "");
      if (!/^\d+차$/.test(label)) continue;
      if (roundBlocks.some((b) => r >= b.startRow && r <= b.endRow)) continue;
      roundSummaryRows.push({ label, row: r });
    }
    const dateCell = qaFindCell(ws, "상담일", { maxRow: 12 });
    // "상담ID"의 실제 헤더가 "상담 ID"처럼 띄어쓰기가 다르거나, 맨 위 12행이 아니라
    // 각 차수 표 근처(더 아래쪽)에 있을 수도 있어서 시트 전체를 대상으로 찾는다.
    const idCell = qaFindCell(ws, "상담ID") || qaFindCellContains(ws, "상담ID") || qaFindCellContains(ws, "상담아이디");
    // 서술형 피드백 칸은 항상 "총점" 열에서 끝나는 가로 병합(예: S19:X19)으로 되어 있다.
    // (카테고리 라벨처럼 폭이 좁은 다른 가로 병합과 구분하기 위한 기준)
    const feedbackMerges = merges.filter((mg) => mg.c2 > mg.c1 && mg.r1 === mg.r2 && mg.c2 === totalCell.col);
    const guidelineRe = /^\[-?\d+\]\s*/;

    const rounds = roundBlocks.map((block) => {
      const summary = roundSummaryRows.find((s) => s.label === block.label);
      let dateVal = summary && dateCell ? qaCellRawValue(ws, summary.row, dateCell.col) : null;
      if (dateVal instanceof Date) dateVal = `${dateVal.getFullYear()}-${pad2(dateVal.getMonth() + 1)}-${pad2(dateVal.getDate())}`;
      else dateVal = dateVal ? String(dateVal).trim() : "";
      // "상담ID"는 요약표(구분/상담사/상담일)가 아니라, 각 회차 상세표의 시작 행에만
      // 한 번 들어있다(예: "1차" 블록의 첫 행). summary.row(요약표) 기준으로 읽으면
      // 그 자리엔 상담사 이름이 있어서 엉뚱한 값이 나온다.
      let idVal = idCell ? qaCellRawValue(ws, block.startRow, idCell.col) : null;
      idVal = (idVal === null || idVal === undefined) ? "" : String(idVal).trim();
      const roundScoreRaw = summary ? qaCellRawValue(ws, summary.row, totalCell.col) : null;
      const roundScoreNum = Number(roundScoreRaw);
      const roundScore = (roundScoreRaw === null || roundScoreRaw === undefined || isNaN(roundScoreNum)) ? null : Math.round(roundScoreNum * 10) / 10;

      const items = [];
      for (let r = block.startRow; r <= block.endRow; r++) {
        const fbMerge = feedbackMerges.find((mg) => mg.r1 === r);
        const feedbackText = fbMerge ? qaCellText(ws, fbMerge.r1, fbMerge.c1) : "";
        if (!feedbackText) continue; // 코멘트가 없는(만점) 항목은 요약 대상에서 제외
        let guideline = "";
        const rowWidth = Math.min(ws.columnCount, 40);
        for (let c = 1; c <= rowWidth; c++) {
          const t = qaCellText(ws, r, c);
          if (t && guidelineRe.test(t)) { guideline = t.replace(guidelineRe, "").trim(); break; }
        }
        items.push({ guideline, feedback: feedbackText });
      }
      // itemCount는 원문이 나중에 만료되어 items가 비워져도 "원래 감점 항목이 있었는지"를
      // 계속 구분할 수 있도록 별도로 남겨둔다.
      return { label: block.label, date: dateVal, consultId: idVal, score: roundScore, items, itemCount: items.length };
    });

    return { totalScore: score, rounds };
  }

  // 여러 개의 xlsx 파일(상담사 1명당 1개, 또는 여러 상담사가 시트로 나뉜 파일 모두 지원)을
  // 한 번에 받아서, 시트 이름(없으면 파일명)을 상담사 이름과 맞춰 자동으로 반영한다.
  async function qaHandleExcelFiles(fileList) {
    console.log("[QA 업로드] onchange 발생, 선택된 파일 수:", fileList ? fileList.length : 0);
    const files = Array.from(fileList || []);
    if (!files.length) {
      console.warn("[QA 업로드] 선택된 파일이 없어요 (파일 선택 대화상자에서 취소했거나, 브라우저가 파일을 전달하지 못했어요).");
      return;
    }
    console.log("[QA 업로드] 파일 목록:", files.map((f) => f.name));
    const { year, monthIndex } = qaUi;
    if (qaIsMonthLocked(year, monthIndex)) {
      console.warn("[QA 업로드] 이 달은 잠겨 있어서 업로드를 막았어요:", qaMonthLabel());
      flashQAStatus("잠긴 달이에요. 잠금을 해제한 뒤 업로드해주세요.");
      alert(`${qaMonthLabel()}은(는) 잠겨 있어서 업로드할 수 없어요.\n상단의 "잠금 해제" 버튼을 먼저 눌러주세요.`);
      return;
    }
    if (typeof ExcelJS === "undefined") {
      console.error("[QA 업로드] ExcelJS 라이브러리가 로드되지 않았어요. CDN(cdn.jsdelivr.net)이 차단됐거나 인터넷 연결이 끊겼을 수 있어요. 개발자도구 Network 탭에서 exceljs.min.js 요청이 실패했는지 확인해주세요.");
      flashQAStatus("엑셀 처리 기능을 불러오지 못했어요 (인터넷 연결 확인)");
      alert("엑셀 처리 기능을 불러오지 못했어요.\n\n인터넷 연결을 확인하거나, 방화벽/보안 프로그램이 cdn.jsdelivr.net 접속을 막고 있지 않은지 확인해주세요.\n(F12 개발자도구 → Network 탭에서 exceljs.min.js 요청이 실패(빨간색)로 뜨는지 확인하시면 정확한 원인을 알 수 있어요.)");
      return;
    }

    let allAgents, normName, matchAgentByName, okCount, failList;
    try {
      allAgents = agentsData.filter((a) => !a.isAdmin);
      normName = (s) => String(s || "").trim().replace(/\s+/g, "");
      matchAgentByName = (name) => {
        const target = normName(name);
        if (!target) return null;
        return allAgents.find((a) => normName(a.name) === target) || null;
      };
      okCount = 0;
      failList = [];
    } catch (setupErr) {
      console.error("[QA 업로드] 초기화 단계에서 오류가 발생했어요:", setupErr);
      alert(`엑셀 업로드 준비 중 오류가 발생했어요.\n\n${setupErr.message}\n\n(F12 콘솔에 자세한 내용이 남았어요. 개발자에게 이 메시지를 전달해주세요.)`);
      return;
    }
    flashQAStatus("엑셀을 분석하고 있어요...");

    for (const file of files) {
      let wb;
      try {
        const buf = await file.arrayBuffer();
        wb = new ExcelJS.Workbook();
        await wb.xlsx.load(buf);
      } catch (readErr) {
        console.error(readErr);
        failList.push(`${file.name}: 파일을 읽지 못했어요 (.xlsx 파일이 맞는지 확인해주세요)`);
        continue;
      }
      const sheets = wb.worksheets || [];
      if (!sheets.length) { failList.push(`${file.name}: 시트를 찾지 못했어요.`); continue; }
      let matchedAny = false;
      for (const ws of sheets) {
        let agent = matchAgentByName(ws.name);
        if (!agent && sheets.length === 1) agent = matchAgentByName(file.name.replace(/\.xlsx$/i, ""));
        if (!agent) {
          console.warn(`[QA 업로드] 이름이 일치하는 상담사를 못 찾았어요. 시트명="${ws.name}", 파일명="${file.name}". 등록된 상담사 이름 목록:`, allAgents.map((a) => a.name));
          continue;
        }
        matchedAny = true;
        try {
          const parsed = qaParseWorksheet(ws);
          setQAScore(agent.id, year, monthIndex, String(parsed.totalScore));
          setQADetail(agent.id, year, monthIndex, {
            fileName: file.name,
            sheetName: ws.name,
            uploadedAt: new Date().toISOString(),
            rounds: parsed.rounds,
          });
          okCount++;
        } catch (parseErr) {
          failList.push(`${ws.name || file.name}: ${parseErr.message}`);
        }
      }
      if (!matchedAny) failList.push(`${file.name}: 이름이 일치하는 상담사를 찾지 못했어요 (시트명 또는 파일명을 상담사 이름과 맞춰주세요)`);
    }

    renderApp();
    if (failList.length) {
      flashQAStatus(`${okCount}명 반영됨 · ${failList.length}건 실패`);
      alert(`엑셀 업로드 결과\n\n반영됨: ${okCount}건\n실패: ${failList.length}건\n\n${failList.join("\n")}`);
    } else {
      flashQAStatus(`${okCount}명 반영됨`);
    }
  }

  /* ===================== 상담사 이름 클릭 → QA 상세 카드 팝업 (엑셀 원문 정리) ===================== */
  function qaFormatSummaryHtml(text) {
    return esc(text || "")
      .split("\n")
      .map((line) => {
        // 혹시 남아있는 마크다운 강조 기호(**)가 있어도 화면엔 남지 않게 제거한다.
        const clean = line.replace(/\*\*/g, "");
        const trimmed = clean.trim();
        // "[가이드라인명]" 같은 대괄호 제목 줄은 굵게 표시한다.
        if (/^\[[^\[\]]+\]$/.test(trimmed)) return `<strong>${trimmed}</strong>`;
        return clean;
      })
      .join("<br>");
  }

  // 엑셀에서 뽑아온 감점/코멘트 원문(items)을 그대로 읽기 좋게 줄바꿈해서 나열한다.
  // 항목마다 "[가이드라인]" 제목 줄 + 코멘트 원문 줄로 나열하고, 가이드라인이 없는
  // 항목은 번호만 붙여 구분한다. AI 요약 프롬프트의 재료 + "원문 전체 보기"에 쓰인다.
  function qaOrganizeItemsText(items) {
    return items
      .map((it, i) => {
        const label = it.guideline ? `[${it.guideline}]` : `[${i + 1}번째 항목]`;
        return `${label}\n${it.feedback}`;
      })
      .join("\n\n");
  }

  /* ===================== QA 회차 상세 AI 요약 (Groq) ===================== */
  // 실제 Groq API 키는 브라우저에 없고, 면담일지 AI 정리와 동일한 Supabase Edge
  // Function(qa-groq-summary)의 서버 환경변수에만 있다. 그 함수는 prompt 텍스트를
  // 넘기면 Groq 응답 텍스트를 돌려주는 범용 함수라서 여기서도 그대로 재사용한다.
  const QA_AI_SUMMARY_FN = "qa-groq-summary";

  // 감점 항목 원문이 방대해도, 상담사에게 실제로 전달할 "피드백/개선이 필요한 부분"만
  // 핵심 요점 위주로 추려달라고 요청하는 프롬프트.
  function qaBuildSummaryPrompt(items) {
    const itemsText = qaOrganizeItemsText(items);
    return `다음은 콜센터 상담사 QA(품질관리) 평가에서 감점된 항목들의 가이드라인명과 코멘트(원문)입니다.\n\n${itemsText}\n\n위 내용을 바탕으로, 이 상담사에게 전달할 "피드백/개선이 필요한 부분"만 핵심 요점 위주로 정리해주세요. 한국어로, 항목별로 줄을 나눠 쓰고 모든 줄은 반드시 "- "로 시작하세요. 서로 겹치거나 비슷한 지적은 하나로 묶고, 단순 사실 나열이 아니라 실제로 개선이 필요한 지적·피드백만 남기세요(이미 잘하고 있다는 칭찬이나 사소한 사유는 제외). 문장은 "~함", "~필요", "~권장"처럼 짧고 담백한 개조식으로 쓰고, 불필요한 서론·결론이나 섹션 제목은 쓰지 마세요. 마크다운 기호(**, *, # 등)는 절대 쓰지 마세요.`;
  }

  // AI 응답에서 여백을 걷어내고, "- "로 시작하는 개조식 줄 목록으로 다듬는다
  // (면담일지 AI 요약과 동일한 방식).
  function qaParseAiSummaryText(text) {
    const clean = String(text || "")
      .replace(/\*\*/g, "")
      .replace(/^\s*\[[^\[\]]+\]\s*/m, "")
      .trim();
    return clean
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => (line.startsWith("-") ? line : `- ${line}`))
      .join("\n");
  }

  async function qaOrganizeRoundItems(agentId, year, monthIndex, roundIdx, btnEl) {
    const detail = getQADetail(agentId, year, monthIndex);
    if (!detail || !detail.rounds || !detail.rounds[roundIdx]) return;
    const round = detail.rounds[roundIdx];
    if (!round.items || !round.items.length) { flashQAStatus("원문이 만료되어 정리할 내용이 없어요."); return; }
    if (!cloud) { flashQAStatus("AI 서버에 연결할 수 없어요 (네트워크 확인)."); return; }
    const box = document.getElementById(`qa-round-summary-${roundIdx}`);
    const originalLabel = btnEl ? btnEl.textContent : "";
    if (btnEl) { btnEl.disabled = true; btnEl.textContent = "정리 중..."; }
    if (box) box.innerHTML = `<span class="qa-round-hint">AI가 요점만 정리하고 있어요...</span>`;
    try {
      const prompt = qaBuildSummaryPrompt(round.items);
      const { data, error } = await cloud.functions.invoke(QA_AI_SUMMARY_FN, { body: { prompt } });
      if (error) {
        let msg = error.message || "요청 실패";
        try {
          const ctx = error.context && typeof error.context.json === "function" ? await error.context.json() : null;
          if (ctx && ctx.error) msg = ctx.error;
        } catch (_e) {}
        throw new Error(msg);
      }
      const raw = (data && data.text) ? String(data.text).trim() : "";
      if (!raw) throw new Error("응답에서 정리된 내용을 찾지 못했어요.");
      const text = qaParseAiSummaryText(raw);
      round.aiSummary = { text, generatedAt: new Date().toISOString() };
      setQADetail(agentId, year, monthIndex, detail);
      if (box) box.innerHTML = qaFormatSummaryHtml(text);
      if (btnEl) btnEl.textContent = "다시 정리";
    } catch (err) {
      console.error(err);
      if (box) box.innerHTML = `<span class="qa-round-hint" style="color:var(--red);">정리 실패: ${esc(err.message || String(err))}</span>`;
      flashQAStatus("AI 요약에 실패했어요.");
      if (btnEl) btnEl.textContent = originalLabel;
    } finally {
      if (btnEl) btnEl.disabled = false;
    }
  }


  function qaRoundSummaryLine(round) {
    const scoreText = (round.score === null || round.score === undefined) ? "-" : round.score;
    const dateText = round.date ? ` · ${esc(round.date)}` : "";
    const idText = round.consultId ? ` · 상담ID ${esc(round.consultId)}` : "";
    return `${esc(round.label)}${dateText}${idText} · 총점 ${esc(String(scoreText))}`;
  }

  /* ---- QA 상세 카드 상단: 최근 6개월 점수 추이 그래프 ----
     이미 있는 getQAScore()로 최근 N개월치 점수를 모아서, 데이터 없이 순수 SVG로
     간단한 라인 차트를 그린다(차트 라이브러리 없이 아이콘들과 같은 방식). 점수가
     없는 달은 그 지점만 건너뛰고 선을 잇지 않는다(중간에 끊긴 구간으로 표시).
     이번 달 라벨은 강조 색으로 표시해서 지금이 어디인지 바로 알 수 있게 한다. */
  const QA_TREND_MONTHS = 6;
  function qaComputeAgentTrend(agentId, year, monthIndex, count) {
    const months = [];
    for (let i = count - 1; i >= 0; i--) {
      let m = monthIndex - i;
      let y = year;
      while (m < 0) { m += 12; y -= 1; }
      months.push({ year: y, monthIndex: m, score: getQAScore(agentId, y, m) });
    }
    return months;
  }
  function qaTrendSvgHtml(agentId, year, monthIndex) {
    const months = qaComputeAgentTrend(agentId, year, monthIndex, QA_TREND_MONTHS);
    const validScores = months.map((m) => m.score).filter((s) => s !== null);
    if (validScores.length === 0) {
      return `<div class="qa-trend-empty">최근 ${QA_TREND_MONTHS}개월간 입력된 점수가 없어요.</div>`;
    }
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

    // 점수가 있는 달들끼리만 이어서 선을 그린다. 중간에 값이 없는 달이 끼어 있으면
    // 그 구간만 끊기고, 앞뒤 구간은 각각 따로 이어진다.
    const segments = [];
    let cur = [];
    months.forEach((m, i) => {
      if (m.score === null) { if (cur.length) segments.push(cur); cur = []; }
      else cur.push({ x: xAt(i), y: yAt(m.score) });
    });
    if (cur.length) segments.push(cur);
    const pathHtml = segments.map((seg) => {
      const d = seg.map((p, idx) => `${idx === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
      return `<path d="${d}" fill="none" stroke="var(--accent)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;
    }).join("");

    const dotHtml = months.map((m, i) => {
      if (m.score === null) return "";
      const x = xAt(i), y = yAt(m.score);
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.6" fill="var(--accent)"/><text x="${x.toFixed(1)}" y="${(y - 10).toFixed(1)}" text-anchor="middle" class="qa-trend-value">${m.score.toFixed(1)}</text>`;
    }).join("");

    const labelHtml = months.map((m, i) => {
      const x = xAt(i);
      const isCurrent = m.year === year && m.monthIndex === monthIndex;
      return `<text x="${x.toFixed(1)}" y="${H - 6}" text-anchor="middle" class="qa-trend-month${isCurrent ? " current" : ""}">${m.monthIndex + 1}월</text>`;
    }).join("");

    return `
      <div class="qa-trend-block">
        <div class="qa-trend-title">최근 ${QA_TREND_MONTHS}개월 추이</div>
        <svg viewBox="0 0 ${W} ${H}" class="qa-trend-svg" preserveAspectRatio="xMidYMid meet">
          ${pathHtml}
          ${dotHtml}
          ${labelHtml}
        </svg>
      </div>
    `;
  }

  function closeQAUploadModal() {
    const existing = document.getElementById("qa-upload-overlay");
    if (existing) existing.remove();
    document.removeEventListener("keydown", qaUploadEscHandler, true);
  }
  function qaUploadEscHandler(e) { if (e.key === "Escape") closeQAUploadModal(); }

  function openQAUploadModal() {
    closeQAUploadModal();
    const { year, monthIndex } = qaUi;
    if (qaIsMonthLocked(year, monthIndex)) { flashQAStatus("잠긴 달이에요. 잠금을 해제한 뒤 업로드해주세요."); return; }

    const overlay = document.createElement("div");
    overlay.id = "qa-upload-overlay";
    overlay.className = "sch-preview-overlay";
    overlay.innerHTML = `
      <div class="sch-preview-box qa-upload-box">
        <div class="sch-preview-head">
          <span>QA 평가 엑셀 업로드 · ${esc(qaMonthLabel())}</span>
          <button type="button" class="sch-preview-close" id="qa-upload-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="sch-preview-body qa-upload-body">
          <div class="qa-upload-dropzone" id="qa-upload-dropzone">
            <div class="qa-upload-dropzone-icon">${ICON_UPLOAD}</div>
            <div class="qa-upload-dropzone-text">여기로 엑셀 파일을 끌어다 놓아주세요</div>
            <div class="qa-upload-dropzone-sub">여러 상담사 파일을 한꺼번에 놓아도 돼요</div>
            <button type="button" class="ghost-btn" id="qa-upload-pick-btn">파일 선택</button>
            <input type="file" id="qa-upload-input" accept=".xlsx" multiple style="display:none;">
          </div>
          <div class="qa-help-text" style="margin:12px 0 0;">상담사 1명당 파일 1개(시트명 또는 파일명 = 상담사 이름)도, 여러 상담사가 시트로 나뉜 파일 하나도 모두 지원돼요.</div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeQAUploadModal(); };
    document.getElementById("qa-upload-close-x").onclick = () => closeQAUploadModal();
    document.addEventListener("keydown", qaUploadEscHandler, true);

    const dropzone = document.getElementById("qa-upload-dropzone");
    const fileInput = document.getElementById("qa-upload-input");

    const runUpload = (fileList, source) => {
      console.log(`[QA 업로드] ${source}로 전달된 파일 수:`, fileList ? fileList.length : 0);
      if (!fileList || !fileList.length) {
        flashQAStatus("파일을 인식하지 못했어요.");
        return;
      }
      closeQAUploadModal();
      qaHandleExcelFiles(fileList).catch((err) => {
        console.error(`[QA 업로드] ${source} 처리 중 예상치 못한 오류:`, err);
        alert(`엑셀 업로드 중 예상치 못한 오류가 발생했어요.\n\n${err && err.message ? err.message : err}\n\nF12 콘솔에 자세한 내용이 남았어요.`);
      });
    };

    document.getElementById("qa-upload-pick-btn").onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
      const files = e.target.files;
      e.target.value = "";
      runUpload(files, "파일 선택");
    };

    ["dragenter", "dragover"].forEach((evt) => {
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add("qa-upload-dropzone-active");
      });
    });
    ["dragleave", "dragend"].forEach((evt) => {
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove("qa-upload-dropzone-active");
      });
    });
    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove("qa-upload-dropzone-active");
      runUpload(e.dataTransfer && e.dataTransfer.files, "드래그앤드롭");
    });
    // 모달 밖(브라우저 창 전체)에 실수로 파일을 떨어뜨려서 브라우저가 그 파일을
    // 통째로 열어버리는 사고 방지.
    ["dragover", "drop"].forEach((evt) => {
      overlay.addEventListener(evt, (e) => { if (e.target === overlay) e.preventDefault(); });
    });
  }

  function closeQADetailModal() {
    const existing = document.getElementById("qa-detail-overlay");
    if (existing) existing.remove();
    document.removeEventListener("keydown", qaDetailEscHandler, true);
  }
  function qaDetailEscHandler(e) { if (e.key === "Escape") closeQADetailModal(); }

  function openQADetailModal(agentId) {
    closeQADetailModal();
    qaPurgeExpiredDetails();
    const agent = agentsData.find((a) => a.id === agentId);
    if (!agent) return;
    const { year, monthIndex } = qaUi;
    const detail = getQADetail(agentId, year, monthIndex);

    const metaText = detail && detail.purged
      ? `원본 엑셀은 업로드 후 ${QA_DETAIL_EXPIRY_MONTHS}개월이 지나 자동 삭제됐어요 · 차수 ${detail.rounds.length}개`
      : detail
        ? `${esc(detail.fileName || "")} 업로드됨 · 차수 ${detail.rounds.length}개 (원문은 업로드 후 ${QA_DETAIL_EXPIRY_MONTHS}개월 뒤 자동 삭제되며, 정리된 내용은 그대로 남아요)`
        : "";

    const trendHtml = qaTrendSvgHtml(agentId, year, monthIndex);

    const bodyHtml = (!detail || !detail.rounds || !detail.rounds.length)
      ? `<div class="qa-detail-empty">이번 달(${esc(qaMonthLabel())})에 업로드된 QA 평가 엑셀이 없어요.<br>상단 "${esc("엑셀 업로드")}" 버튼으로 이 상담사의 평가표를 올려주세요.</div>`
      : `
        <div class="qa-detail-meta">${metaText}</div>
        <div class="qa-detail-rounds">
          ${detail.rounds.map((round, idx) => {
            // itemCount가 없는 예전 데이터(이 필드가 생기기 전에 저장된 회차)는
            // items 개수로 대신 판단한다. items도 없다면(정말 원문이 없는 경우) 0으로 취급.
            const effectiveItemCount = (round.itemCount !== undefined && round.itemCount !== null)
              ? round.itemCount
              : (round.items ? round.items.length : 0);
            const isPerfect = effectiveItemCount === 0 && !round.aiSummary;
            const rawGone = !isPerfect && round.items.length === 0; // 원문 만료로 사라진 경우
            const showButton = round.items.length > 0; // 원문이 남아있을 때만 (다시) 정리 가능
            let bodyBlock;
            if (isPerfect) {
              bodyBlock = `<div class="qa-round-empty">감점/코멘트 항목이 없어요 (만점 처리된 차수예요).</div>`;
            } else if (rawGone) {
              bodyBlock = `<div class="qa-round-summary-box" id="qa-round-summary-${idx}">${round.aiSummary
                ? qaFormatSummaryHtml(round.aiSummary.text)
                : `<span class="qa-round-hint" style="color:var(--red);">원문이 만료되어 삭제됐어요.<br>만료 전에 정리해두지 않아 남은 내용이 없어요.</span>`}</div>`;
            } else {
              bodyBlock = `<div class="qa-round-summary-box" id="qa-round-summary-${idx}">${round.aiSummary ? qaFormatSummaryHtml(round.aiSummary.text) : `<span class="qa-round-hint">원문 ${round.items.length}건 · 버튼을 눌러 AI 요점 정리를 받아보세요.</span>`}</div>
              <div class="qa-round-raw">
                <button type="button" class="qa-round-raw-toggle" data-qa-raw-toggle="${idx}">원문 전체 보기</button>
                <div class="qa-round-raw-box" id="qa-round-raw-${idx}" style="display:none;"></div>
              </div>`;
            }
            return `
            <div class="qa-round-card">
              <div class="qa-round-head" data-qa-round-toggle="${idx}">
                <div class="qa-round-title"><span class="qa-round-chevron" id="qa-round-chevron-${idx}">▶</span>${qaRoundSummaryLine(round)}</div>
                ${showButton ? `<button type="button" class="ghost-btn" data-qa-summarize="${idx}">${round.aiSummary ? "다시 정리" : "AI 요점 정리"}</button>` : ""}
              </div>
              <div class="qa-round-body" id="qa-round-body-${idx}" style="display:none;">
                ${bodyBlock}
              </div>
            </div>
          `;
          }).join("")}
        </div>
      `;

    const overlay = document.createElement("div");
    overlay.id = "qa-detail-overlay";
    overlay.className = "sch-preview-overlay";
    overlay.innerHTML = `
      <div class="sch-preview-box qa-detail-box">
        <div class="sch-preview-head">
          <span>${esc(agent.name)} · ${esc(qaMonthLabel())} QA 상세</span>
          <div class="qa-detail-head-actions">
            ${detail ? `<button type="button" class="ghost-btn qa-detail-delete-btn" id="qa-detail-delete-btn">${ICON_TRASH} 엑셀 삭제</button>` : ""}
            <button type="button" class="sch-preview-close" id="qa-detail-close-x" aria-label="닫기">✕</button>
          </div>
        </div>
        <div class="sch-preview-body qa-detail-body">
          ${trendHtml}
          ${bodyHtml}
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeQADetailModal(); };
    document.getElementById("qa-detail-close-x").onclick = () => closeQADetailModal();
    const deleteBtn = document.getElementById("qa-detail-delete-btn");
    if (deleteBtn) {
      deleteBtn.onclick = () => {
        if (!confirm(`${agent.name}님의 ${qaMonthLabel()} QA 엑셀 데이터를 삭제할까요?\n원문과 정리된 내용이 모두 함께 삭제되며, 되돌릴 수 없어요.`)) return;
        deleteQADetail(agentId, year, monthIndex);
        flashQAStatus("삭제됐어요.");
        openQADetailModal(agentId); // 모달을 "업로드된 엑셀 없음" 상태로 다시 그림
      };
    }

    overlay.querySelectorAll("[data-qa-summarize]").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const idx = Number(btn.getAttribute("data-qa-summarize"));
        const body = document.getElementById(`qa-round-body-${idx}`);
        const chevron = document.getElementById(`qa-round-chevron-${idx}`);
        if (body && body.style.display === "none") { body.style.display = ""; if (chevron) chevron.textContent = "▼"; }
        qaOrganizeRoundItems(agentId, year, monthIndex, idx, btn);
      };
    });

    // "원문 전체 보기" 토글: AI 요약이 다시 만들어져 내용이 바뀌어도 계속 동작하도록
    // 개별 버튼이 아니라 오버레이 전체에 위임해서 클릭을 잡는다.
    overlay.addEventListener("click", (e) => {
      const toggleBtn = e.target.closest && e.target.closest("[data-qa-raw-toggle]");
      if (!toggleBtn) return;
      e.stopPropagation();
      const idx = Number(toggleBtn.getAttribute("data-qa-raw-toggle"));
      const round = detail.rounds[idx];
      const rawBox = document.getElementById(`qa-round-raw-${idx}`);
      if (!round || !rawBox) return;
      const opening = rawBox.style.display === "none";
      if (opening && !rawBox.dataset.filled) {
        rawBox.innerHTML = qaFormatSummaryHtml(qaOrganizeItemsText(round.items));
        rawBox.dataset.filled = "1";
      }
      rawBox.style.display = opening ? "" : "none";
      toggleBtn.textContent = opening ? "원문 접기" : "원문 전체 보기";
    });

    // 회차 카드 헤드를 누르면 펼치기/접기 (버튼 클릭은 위에서 stopPropagation으로 분리됨)
    overlay.querySelectorAll("[data-qa-round-toggle]").forEach((head) => {
      head.onclick = () => {
        const idx = head.getAttribute("data-qa-round-toggle");
        const body = document.getElementById(`qa-round-body-${idx}`);
        const chevron = document.getElementById(`qa-round-chevron-${idx}`);
        if (!body) return;
        const opening = body.style.display === "none";
        body.style.display = opening ? "" : "none";
        if (chevron) chevron.textContent = opening ? "▼" : "▶";
      };
    });

    setTimeout(() => document.addEventListener("keydown", qaDetailEscHandler, true), 0);
  }

  function qaScoreCellHtml(agent, year, monthIndex) {
    const val = getQAScore(agent.id, year, monthIndex);
    const locked = qaIsMonthLocked(year, monthIndex);
    return `<td><input type="number" class="qa-score-input" min="0" max="100" step="0.1" inputmode="decimal"
      data-qa-agent="${agent.id}" value="${val === null ? "" : val.toFixed(1)}" placeholder="-" title="점수"${locked ? " disabled" : ""}></td>`;
  }

  function qaDiffHtml(agent, year, monthIndex) {
    const cur = qaOverallScore(agent.id, year, monthIndex);
    if (cur === null) return `<span class="qa-diff flat">-</span>`;
    const prev = qaPrevMonth(year, monthIndex);
    const prevScore = qaOverallScore(agent.id, prev.year, prev.monthIndex);
    if (prevScore === null) return `<span class="qa-diff flat">신규</span>`;
    const diff = cur - prevScore;
    if (Math.abs(diff) < 0.05) return `<span class="qa-diff flat">±0.0</span>`;
    const cls = diff > 0 ? "up" : "down";
    const sign = diff > 0 ? "▲" : "▼";
    return `<span class="qa-diff ${cls}">${sign} ${Math.abs(diff).toFixed(1)}</span>`;
  }

  // ----- 상담사 상세 카드용 "최근 QA 점수" 미리보기 -----
  // 이번 달 포함 최근 3개월 점수를 관리자→월별 스케줄 이동 없이 바로 보여준다.
  // QA 관리 대상이 아닌 관리자 계정은 표시하지 않는다.
  function renderAgentQAPreview(agent) {
    if (agent.isAdmin) return "";
    const months = [];
    for (let i = 0; i < 3; i++) {
      let m = today.getMonth() - i;
      let y = today.getFullYear();
      while (m < 0) { m += 12; y -= 1; }
      months.push({ year: y, monthIndex: m });
    }
    const cellsHtml = months.map(({ year, monthIndex }, idx) => {
      const val = getQAScore(agent.id, year, monthIndex);
      const label = idx === 0 ? "이번 달" : `${monthIndex + 1}월`;
      return `
        <div class="agent-qa-cell">
          <div class="agent-qa-cell-label">${esc(label)}</div>
          <div class="agent-qa-cell-value${val === null ? " empty" : ""}">${val === null ? "데이터 없음" : val.toFixed(1)}</div>
          <div class="agent-qa-cell-diff">${qaDiffHtml(agent, year, monthIndex)}</div>
        </div>
      `;
    }).join("");
    return `
      <div class="agent-interview-section agent-qa-preview">
        <div class="agent-interview-header">
          <div class="agent-interview-title">${ICON_QA} 최근 QA 점수</div>
          <button class="ghost-btn" data-action="agent-goto-qa" data-id="${agent.id}">${ICON_CHEVRON_RIGHT} 품질 관리로 이동</button>
        </div>
        <div class="agent-qa-preview-grid">${cellsHtml}</div>
      </div>
    `;
  }

  function qaStatDiff(cur, prev) {
    if (cur === null || prev === null || prev === undefined) return null;
    const diff = cur - prev;
    if (Math.abs(diff) < 0.05) return { cls: "flat", sign: "±", abs: 0 };
    return { cls: diff > 0 ? "up" : "down", sign: diff > 0 ? "▲" : "▼", abs: Math.abs(diff) };
  }

  function qaStatItemHtml(label, value, prevValue, accent) {
    const isEmpty = value === null;
    const d = qaStatDiff(value, prevValue);
    const diffHtml = d ? ` <span class="qa-stat-diff ${d.cls}">${d.sign} ${d.abs.toFixed(1)}</span>` : "";
    return `<div class="qa-stat-item${accent ? " accent" : ""}">
      <div class="qa-stat-num${isEmpty ? " empty" : ""}">${isEmpty ? "데이터 없음" : value.toFixed(1)}</div>
      <div class="qa-stat-label">${esc(label)}${diffHtml}</div>
    </div>`;
  }

  // 이미지 저장 시 유형별로 인원을 걸러낼 때 쓴다. (월별 스케줄과 동일한 구분 기준)
  function qaFilterAgentsByMode(agentsList, mode) {
    if (!mode || mode === "ALL") return agentsList;
    const hasVoice = (a) => (a.workTypes || []).indexOf("유선") !== -1;
    const hasChat = (a) => (a.workTypes || []).indexOf("채팅") !== -1;
    if (mode === "DAY") return agentsList.filter((a) => a.group !== "night");
    if (mode === "NIGHT") return agentsList.filter((a) => a.group === "night");
    if (mode === "VOICE") return agentsList.filter(hasVoice);
    if (mode === "CHAT") return agentsList.filter(hasChat);
    return agentsList;
  }

  // 화면에 보이는 표와 이미지 캡처용 표가 같은 마크업을 쓰도록 분리해뒀다.
  // forCapture가 true면 점수 입력칸 대신 텍스트로 값을 보여준다(캡처 이미지에 <input>이 그대로 찍히지 않도록).
  function buildQATableHtml(agentsList, year, monthIndex, forCapture) {
    return `
      <div class="qa-table-wrap">
        <table class="qa-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>LDAP</th>
              <th>시간대</th>
              <th>업무구분</th>
              <th>조</th>
              <th>점수</th>
              <th>전월 대비</th>
            </tr>
          </thead>
          <tbody>
            ${agentsList.length === 0 ? `
              <tr><td class="qa-empty" colspan="7">${forCapture ? "해당하는 상담사가 없어요." : `근무중인 상담사가 없어요. "상담사 관리"에서 인원을 등록해주세요.`}</td></tr>
            ` : agentsList.map((a) => {
              const typeBadges = (a.workTypes || []).map((t) => `<span class="badge sm ${t === "유선" ? "voice" : "chat"}">${esc(t)}</span>`).join(" ");
              const groupBadge = `<span class="badge sm ${a.group === "night" ? "night" : "day"}">${a.group === "night" ? "야간" : "주간"}</span>`;
              const val = getQAScore(a.id, year, monthIndex);
              const scoreCell = forCapture
                ? `<td>${val === null ? "-" : val.toFixed(1)}</td>`
                : qaScoreCellHtml(a, year, monthIndex);
              const highlight = !forCapture && qaHighlightAgentId === a.id;
              return `
                <tr data-qa-row-agent="${a.id}" class="${highlight ? "qa-row-highlight" : ""}">
                  <td class="qa-col-name"${forCapture ? "" : ` data-qa-name-click="${a.id}"`}>${esc(a.name)}${forCapture ? "" : `<span class="qa-name-search-icon">${ICON_SEARCH_MINI}</span>`}</td>
                  <td class="qa-col-ldap">${esc(a.ldap || "-")}</td>
                  <td>${esc(a.timezone || "-")}</td>
                  <td class="qa-col-badges">${typeBadges || "-"}</td>
                  <td>${groupBadge}</td>
                  ${scoreCell}
                  <td>${qaDiffHtml(a, year, monthIndex)}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  // 검색창 자체는 다시 그리지 않고 표 영역만 갱신한다(agents/interviews 화면과 같은 방식).
  // IME(한글) 조합 중에도 입력이 끊기지 않고, 타이핑 즉시 결과가 반영된다.
  function updateQATableArea() {
    const tableArea = document.getElementById("qa-table-area");
    if (!tableArea) return;
    const { year, monthIndex } = qaUi;
    const filteredList = qaWorkingAgents().filter((a) => qaAgentMatchesSearch(a, qaUi.searchQuery));
    tableArea.innerHTML = buildQATableHtml(filteredList, year, monthIndex, false);
    attachQATableAreaHandlers(tableArea, filteredList, year, monthIndex);
  }

  function attachQATableAreaHandlers(root, agentsList, year, monthIndex) {
    root.querySelectorAll("[data-qa-name-click]").forEach((el) => {
      el.onclick = () => openQADetailModal(el.getAttribute("data-qa-name-click"));
    });

    root.querySelectorAll(".qa-score-input").forEach((input) => {
      // 필요인력 입력칸과 같은 방식: blur(포커스 아웃) 또는 Enter일 때만 저장해서
      // 타이핑 중에 표 전체가 다시 그려지며 깜빡이거나 포커스가 빠지지 않게 한다.
      input.onchange = () => {
        setQAScore(
          input.getAttribute("data-qa-agent"),
          year, monthIndex,
          input.value
        );
        renderApp();
      };
      // 엑셀처럼 Enter/Tab으로 다음(아래) 칸, Shift+Enter/Shift+Tab으로 이전(위) 칸으로
      // 바로 이동한다. blur()를 호출하면 값이 바뀐 경우 change 이벤트가 이 안에서
      // 그대로(동기적으로) 발생해서 저장 + 표 다시 그리기까지 끝나므로, blur() 호출이
      // 끝난 뒤에 다음 칸을 찾아 포커스를 옮기면 된다(다시 그려졌든 안 그려졌든 그
      // 시점엔 이미 최종 DOM이 갖춰져 있다).
      input.onkeydown = (e) => {
        if (e.key !== "Enter" && e.key !== "Tab") return;
        e.preventDefault();
        const idx = agentsList.findIndex((a) => a.id === input.getAttribute("data-qa-agent"));
        const delta = e.shiftKey ? -1 : 1;
        const nextAgent = idx !== -1 ? agentsList[idx + delta] : null;
        input.blur();
        if (nextAgent) qaFocusScoreInput(nextAgent.id);
      };
    });
  }

  function renderQAPage(root) {
    const agentsList = qaWorkingAgents();
    const filteredList = agentsList.filter((a) => qaAgentMatchesSearch(a, qaUi.searchQuery));
    const { year, monthIndex } = qaUi;
    // 통계(평균)는 검색어와 무관하게 항상 재직중인 전체 인원 기준으로 보여준다.
    const stats = qaComputeStats(agentsList, year, monthIndex);
    const prevYm = qaPrevMonth(year, monthIndex);
    const prevStats = qaComputeStats(agentsList, prevYm.year, prevYm.monthIndex);
    const locked = qaIsMonthLocked(year, monthIndex);

    root.innerHTML = `
      <div class="qa-top">
        <div class="qa-title">품질 관리</div>
        <div class="schedule-month-nav">
          <button class="schedule-month-btn" id="qa-prev-month">‹</button>
          <div class="schedule-month-label">${qaMonthLabel()}${locked ? ` <span class="sch-locked-badge">${ICON_LOCK} 확정됨</span>` : ""}</div>
          <button class="schedule-month-btn" id="qa-next-month">›</button>
          <button class="ghost-btn sch-lock-toggle-btn ${locked ? "locked" : ""}" id="qa-lock-btn" style="margin-left:8px;">${locked ? `${ICON_UNLOCK} 잠금 해제` : `${ICON_LOCK} 이 달 잠그기`}</button>
          <button class="ghost-btn" id="qa-excel-upload-btn">${ICON_UPLOAD} 엑셀 업로드</button>
          <button class="ghost-btn qa-bulk-delete-btn" id="qa-bulk-delete-btn">${ICON_TRASH} 엑셀 일괄삭제</button>
          <button class="ghost-btn" id="qa-capture-btn">${ICON_CAMERA} 이미지로 저장 ▾</button>
        </div>
      </div>
      <div class="qa-help-text">QA 평가 엑셀(.xlsx)을 올리면 "평균" 행 × "총점" 열 값을 자동으로 점수에 반영해요.<br>상담사 1명당 파일 1개(시트명 또는 파일명 = 상담사 이름)도, 여러 상담사가 시트로 나뉜 파일 하나도 모두 지원돼요.<br>이름을 누르면 회차별 상세 내용을 볼 수 있어요.</div>
      <div class="status" id="qa-status"></div>
      <div class="qa-stat-grid">
        ${qaStatItemHtml("전체 평균", stats.total, prevStats.total, true)}
        ${qaStatItemHtml("유선 점수 평균", stats.voice, prevStats.voice)}
        ${qaStatItemHtml("채팅 점수 평균", stats.chat, prevStats.chat)}
        ${qaStatItemHtml("주간 점수 평균", stats.day, prevStats.day)}
        ${qaStatItemHtml("야간 점수 평균", stats.night, prevStats.night)}
        ${qaStatItemHtml("주간 채팅 평균", stats.dayChat, prevStats.dayChat)}
        ${qaStatItemHtml("주간 유선 평균", stats.dayVoice, prevStats.dayVoice)}
        ${qaStatItemHtml("야간 채팅 평균", stats.nightChat, prevStats.nightChat)}
        ${qaStatItemHtml("야간 유선 평균", stats.nightVoice, prevStats.nightVoice)}
      </div>
      <div class="agent-search-input" style="margin-bottom:10px;">
        <input type="text" class="agent-search-input-field" id="qa-search-input" placeholder="상담사 검색 (쉼표로 여러 명)" value="${esc(qaUi.searchQuery)}" autocomplete="off">
        ${ICON_SEARCH_MINI}
      </div>
      <div id="qa-table-area">${buildQATableHtml(filteredList, year, monthIndex, false)}</div>
    `;

    // 상담사 상세에서 "품질 관리로 이동"으로 넘어온 경우, 그 인원의 행으로
    // 스크롤하고 한 번만 강조 표시한다.
    if (qaHighlightAgentId) {
      const targetId = qaHighlightAgentId;
      qaHighlightAgentId = null;
      const row = root.querySelector(`[data-qa-row-agent="${CSS.escape(targetId)}"]`);
      if (row) {
        row.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => row.classList.remove("qa-row-highlight"), 2200);
      }
    }

    document.getElementById("qa-prev-month").onclick = () => qaShiftMonth(-1);
    document.getElementById("qa-next-month").onclick = () => qaShiftMonth(1);
    document.getElementById("qa-lock-btn").onclick = () => qaToggleMonthLock(year, monthIndex);
    document.getElementById("qa-capture-btn").onclick = (e) => openQACaptureMenu(e.currentTarget);
    document.getElementById("qa-bulk-delete-btn").onclick = () => {
      if (qaIsMonthLocked(year, monthIndex)) { flashQAStatus("잠긴 달이에요. 잠금을 해제한 뒤 삭제해주세요."); return; }
      if (!confirm(`${qaMonthLabel()}에 등록된 모든 상담사의 QA 엑셀 데이터를 일괄삭제할까요?\n원문과 정리된 내용이 모두 함께 삭제되며, 되돌릴 수 없어요.`)) return;
      const count = deleteAllQADetails(year, monthIndex);
      flashQAStatus(count > 0 ? `${count}건 삭제됐어요.` : "삭제할 데이터가 없어요.");
      renderApp();
    };
    document.getElementById("qa-excel-upload-btn").onclick = () => openQAUploadModal();

    const qaSearchInput = document.getElementById("qa-search-input");
    if (qaSearchInput) {
      qaSearchInput.oninput = (e) => {
        qaUi.searchQuery = e.target.value;
        updateQATableArea();
      };
    }

    attachQATableAreaHandlers(root.querySelector("#qa-table-area"), filteredList, year, monthIndex);
  }
  // 특정 상담사의 점수 입력칸에 포커스를 주고 기존 값을 선택 상태로 만든다
  // (Enter/Tab으로 다음 칸으로 넘어갈 때, 바로 덮어쓸 수 있게).
  function qaFocusScoreInput(agentId) {
    const el = document.querySelector(`.qa-score-input[data-qa-agent="${CSS.escape(agentId)}"]`);
    if (!el || el.disabled) return;
    el.focus();
    el.select();
  }

  // ----- 품질 관리 표를 이미지로 저장: 전체/주간/야간/유선/채팅 -----
  const QA_CAPTURE_MODES = [
    { key: "ALL", label: "전체 저장" },
    { key: "DAY", label: "주간 저장" },
    { key: "NIGHT", label: "야간 저장" },
    { key: "VOICE", label: "유선 저장" },
    { key: "CHAT", label: "채팅 저장" },
  ];

  function closeQAPreview() {
    const existing = document.getElementById("qa-preview-overlay");
    if (existing) existing.remove();
    document.removeEventListener("keydown", qaPreviewEscHandler, true);
  }
  function qaPreviewEscHandler(e) {
    if (e.key === "Escape") closeQAPreview();
  }
  function openQAPreview(dataUrl, filename, modeName) {
    closeQAPreview();
    const overlay = document.createElement("div");
    overlay.id = "qa-preview-overlay";
    overlay.className = "sch-preview-overlay";
    overlay.innerHTML = `
      <div class="sch-preview-box">
        <div class="sch-preview-head">
          <span>${modeName ? `${esc(modeName)} 이미지 미리보기` : "이미지 미리보기"}</span>
          <button type="button" class="sch-preview-close" id="qa-preview-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="sch-preview-body">
          <img src="${dataUrl}" alt="품질 관리 캡처 미리보기">
        </div>
        <div class="sch-preview-actions">
          <button type="button" class="ghost-btn" id="qa-preview-cancel">닫기</button>
          <button type="button" class="primary-btn" id="qa-preview-download">${ICON_DOWNLOAD} 이미지 다운로드</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeQAPreview(); };
    document.getElementById("qa-preview-close-x").onclick = () => closeQAPreview();
    document.getElementById("qa-preview-cancel").onclick = () => closeQAPreview();
    document.getElementById("qa-preview-download").onclick = () => {
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
      closeQAPreview();
      flashQAStatus("이미지 저장됨");
    };
    setTimeout(() => document.addEventListener("keydown", qaPreviewEscHandler, true), 0);
  }

  function closeQAMenu() {
    const existing = document.getElementById("qa-menu");
    if (existing) existing.remove();
    document.removeEventListener("mousedown", qaMenuOutsideHandler, true);
  }
  function qaMenuOutsideHandler(e) {
    const menu = document.getElementById("qa-menu");
    if (menu && !menu.contains(e.target)) closeQAMenu();
  }
  function openQACaptureMenu(anchorEl) {
    closeQAMenu();
    const rect = anchorEl.getBoundingClientRect();
    const menu = document.createElement("div");
    menu.id = "qa-menu";
    menu.className = "sch-menu";
    menu.innerHTML = QA_CAPTURE_MODES.map((o) =>
      `<button type="button" data-capture-mode="${o.key}">${ICON_CAMERA} ${o.label}</button>`
    ).join("");
    document.body.appendChild(menu);
    const top = Math.min(rect.bottom + 4, window.innerHeight - menu.offsetHeight - 8);
    const left = Math.min(rect.left, window.innerWidth - menu.offsetWidth - 8);
    menu.style.top = `${Math.max(8, top)}px`;
    menu.style.left = `${Math.max(8, left)}px`;
    menu.querySelectorAll("button[data-capture-mode]").forEach((btn) => {
      btn.onclick = () => {
        const mode = btn.getAttribute("data-capture-mode");
        closeQAMenu();
        captureQAPage(mode);
      };
    });
    setTimeout(() => document.addEventListener("mousedown", qaMenuOutsideHandler, true), 0);
  }

  // 품질 관리 표를 통째로 PNG 이미지로 캡처해서 다운로드한다. (월별 스케줄 캡처와 동일한 방식)
  function captureQAPage(mode) {
    const captureMode = mode || "ALL";
    const modeMeta = QA_CAPTURE_MODES.find((m) => m.key === captureMode) || QA_CAPTURE_MODES[0];
    const modeName = modeMeta.label.replace(/ 저장$/, "");
    const btn = document.getElementById("qa-capture-btn");
    if (typeof html2canvas === "undefined") {
      flashQAStatus("캡처 기능을 불러오지 못했어요 (인터넷 연결 확인)");
      return;
    }
    if (btn) { btn.disabled = true; btn.textContent = "이미지 생성 중..."; }

    const cs = getComputedStyle(document.documentElement);
    const themeColor = (name) => cs.getPropertyValue(name).trim();
    const cBg = themeColor("--bg");
    const cText = themeColor("--text");
    const cTextDim = themeColor("--text-dim");
    const cHairline = themeColor("--hairline");

    const { year, monthIndex } = qaUi;
    const agentsList = qaFilterAgentsByMode(qaWorkingAgents(), captureMode);
    const lockedTag = qaIsMonthLocked(year, monthIndex) ? " · 확정됨" : "";
    const titleSuffix = captureMode === "ALL" ? "" : ` · ${modeName}`;

    // "전체 저장"일 때만 상단 평균 통계도 표 위에 같이 캡처되게 한다.
    // 화면과 완전히 같은 마크업(qaStatItemHtml)을 그대로 재사용해서 스타일이 어긋나지 않게 한다.
    const stats = qaComputeStats(agentsList, year, monthIndex);
    const capturePrevYm = qaPrevMonth(year, monthIndex);
    const prevStats = qaComputeStats(agentsList, capturePrevYm.year, capturePrevYm.monthIndex);
    const statsHtml = captureMode === "ALL" ? `
      <div class="qa-stat-grid" style="margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid ${cHairline};">
        ${qaStatItemHtml("전체 평균", stats.total, prevStats.total, true)}
        ${qaStatItemHtml("유선 점수 평균", stats.voice, prevStats.voice)}
        ${qaStatItemHtml("채팅 점수 평균", stats.chat, prevStats.chat)}
        ${qaStatItemHtml("주간 점수 평균", stats.day, prevStats.day)}
        ${qaStatItemHtml("야간 점수 평균", stats.night, prevStats.night)}
        ${qaStatItemHtml("주간 채팅 평균", stats.dayChat, prevStats.dayChat)}
        ${qaStatItemHtml("주간 유선 평균", stats.dayVoice, prevStats.dayVoice)}
        ${qaStatItemHtml("야간 채팅 평균", stats.nightChat, prevStats.nightChat)}
        ${qaStatItemHtml("야간 유선 평균", stats.nightVoice, prevStats.nightVoice)}
      </div>
    ` : "";

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
    wrapper.innerHTML = `
      <div style="font-size:22px;margin-bottom:4px;color:${cText};">품질 관리${titleSuffix}</div>
      <div style="font-size:15px;color:${cTextDim};margin-bottom:16px;">${esc(qaMonthLabel())}${lockedTag} · 캡처일 ${esc(todayISO())}</div>
      ${statsHtml}
      ${buildQATableHtml(agentsList, year, monthIndex, true)}
    `;
    document.body.appendChild(wrapper);

    function cleanup(label) {
      if (wrapper.parentNode) document.body.removeChild(wrapper);
      if (btn) { btn.disabled = false; btn.innerHTML = ICON_CAMERA + " 이미지로 저장 ▾"; }
      if (label) flashQAStatus(label);
    }

    requestAnimationFrame(() => {
      // 표는 CSS(display:table + margin:auto)만으로 이미 표 크기에 맞춰 가운데 정렬된다.
      // 통계 줄은 fit-content 래퍼 안에서는 justify-content:space-between이 퍼질 공간이
      // 없으므로, 표의 실제 렌더링 너비에 맞춰 폭을 직접 지정해서 표와 나란히 맞춘다.
      const statGridEl = wrapper.querySelector(".qa-stat-grid");
      const tableWrapEl = wrapper.querySelector(".qa-table-wrap");
      if (statGridEl && tableWrapEl) {
        statGridEl.style.width = tableWrapEl.getBoundingClientRect().width + "px";
      }

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
        const filename = `품질관리${fileSuffix}_${year}-${pad2(monthIndex + 1)}.png`;
        const dataUrl = canvas.toDataURL("image/png");
        cleanup("");
        openQAPreview(dataUrl, filename, captureMode === "ALL" ? null : modeName);
      }).catch((err) => {
        console.error(err);
        cleanup("캡처 실패");
      });
    });
  }

  /* ===================== 면담일지 모듈 ===================== */
  const INTERVIEWS_KEY = acctKey("personal-interviews:data");
  const INTERVIEW_TYPES = ["정기", "수시", "경고"];

