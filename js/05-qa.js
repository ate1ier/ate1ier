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

  function flashQAStatus(msg) { flashStatusMessage("qa-status", msg, 1200); }
  function saveQAData() {
    try { localStorage.setItem(QA_KEY, JSON.stringify(qaData)); flashQAStatus("저장됨"); }
    catch (e) { flashQAStatus("저장 실패"); }
  }

  const qaUi = {
    year: today.getFullYear(),
    monthIndex: today.getMonth(), // 0-based. 실시간 기준 당월로 시작한다.
  };
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

  function qaScoreCellHtml(agent, year, monthIndex) {
    const val = getQAScore(agent.id, year, monthIndex);
    const locked = qaIsMonthLocked(year, monthIndex);
    return `<td><input type="number" class="qa-score-input" min="0" max="100" step="0.1" inputmode="decimal"
      data-qa-agent="${agent.id}" value="${val === null ? "" : val}" placeholder="-" title="점수"${locked ? " disabled" : ""}></td>`;
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
                  <td class="qa-col-name">${esc(a.name)}</td>
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

  function renderQAPage(root) {
    const agentsList = qaWorkingAgents();
    const { year, monthIndex } = qaUi;
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
          <button class="ghost-btn" id="qa-capture-btn">${ICON_CAMERA} 이미지로 저장 ▾</button>
        </div>
      </div>
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
      ${buildQATableHtml(agentsList, year, monthIndex, false)}
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
      input.onkeydown = (e) => { if (e.key === "Enter") input.blur(); };
    });
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
    positionFloatingMenu(menu, rect.left, rect.bottom + 4);
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
    const cPanel = themeColor("--panel");
    const cHairline = themeColor("--hairline");
    const cAccent = themeColor("--accent");
    const cAccentSoft = themeColor("--accent-dim-soft");
    const cFaint = themeColor("--text-faint");
    const cGreen = themeColor("--green");
    const cRed = themeColor("--red");

    const { year, monthIndex } = qaUi;
    const agentsList = qaFilterAgentsByMode(qaWorkingAgents(), captureMode);
    const lockedTag = qaIsMonthLocked(year, monthIndex) ? " · 확정됨" : "";
    const titleSuffix = captureMode === "ALL" ? "" : ` · ${modeName}`;

    // 캡처용 통계 카드 한 칸. 화면용 .qa-stat-grid는 CSS grid를 쓰지만, html2canvas가
    // fit-content 래퍼 안에서 grid 너비를 안정적으로 못 잡는 경우가 있어 캡처본은
    // 고정 너비 flex 카드로 따로 그린다.
    function qaCaptureStatCard(label, value, prevValue, accent) {
      const isEmpty = value === null;
      const numColor = isEmpty ? cFaint : (accent ? cAccent : cText);
      const d = qaStatDiff(value, prevValue);
      const diffColor = d ? (d.cls === "up" ? cGreen : d.cls === "down" ? cRed : cFaint) : null;
      const diffHtml = d ? ` <span style="color:${diffColor};font-weight:600;">${d.sign} ${d.abs.toFixed(1)}</span>` : "";
      return `
        <div style="flex:0 0 130px;width:130px;box-sizing:border-box;background:${accent ? cAccentSoft : cPanel};border:1px solid ${accent ? cAccent : cHairline};border-radius:14px;padding:12px 10px;text-align:center;">
          <div style="font-size:${isEmpty ? "15px" : "20px"};line-height:24px;letter-spacing:-0.01em;color:${numColor};">${isEmpty ? "데이터 없음" : value.toFixed(1)}</div>
          <div style="font-size:11.5px;color:${cFaint};margin-top:4px;">${esc(label)}${diffHtml}</div>
        </div>
      `;
    }

    // "전체 저장"일 때만 상단 평균 통계도 표 위에 같이 캡처되게 한다.
    const stats = qaComputeStats(agentsList, year, monthIndex);
    const capturePrevYm = qaPrevMonth(year, monthIndex);
    const prevStats = qaComputeStats(agentsList, capturePrevYm.year, capturePrevYm.monthIndex);
    const statsHtml = captureMode === "ALL" ? `
      <div class="qa-capture-stats" style="display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-bottom:18px;">
        ${qaCaptureStatCard("전체 평균", stats.total, prevStats.total, true)}
        ${qaCaptureStatCard("유선 점수 평균", stats.voice, prevStats.voice)}
        ${qaCaptureStatCard("채팅 점수 평균", stats.chat, prevStats.chat)}
        ${qaCaptureStatCard("주간 점수 평균", stats.day, prevStats.day)}
        ${qaCaptureStatCard("야간 점수 평균", stats.night, prevStats.night)}
        ${qaCaptureStatCard("주간 채팅 평균", stats.dayChat, prevStats.dayChat)}
        ${qaCaptureStatCard("주간 유선 평균", stats.dayVoice, prevStats.dayVoice)}
        ${qaCaptureStatCard("야간 채팅 평균", stats.nightChat, prevStats.nightChat)}
        ${qaCaptureStatCard("야간 유선 평균", stats.nightVoice, prevStats.nightVoice)}
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
      try {
        // 표는 CSS(display:table + margin:auto)만으로 이미 표 크기에 맞춰 가운데 정렬된다.
        // 통계 카드만 두 줄로 나누기 위해 너비를 계산해서 고정한다(카드 너비 130px, 간격
        // 10px는 고정값이라 폰트 렌더링 차이 없이 항상 정확하게 계산된다).
        const statsWrapEl = wrapper.querySelector(".qa-capture-stats");
        if (statsWrapEl) {
          // 통계 카드를 한 줄로 쭉 나열하면 표보다 훨씬 넓어져서 표 양옆에 공백이 생긴다.
          // 카드를 두 줄로 나눠서 표 너비에 더 가깝게 만든다 (예: 9칸 → 5+4).
          const cardCount = statsWrapEl.children.length;
          const perRow = Math.ceil(cardCount / 2);
          const w = perRow * 130 + Math.max(0, perRow - 1) * 10;
          statsWrapEl.style.width = w + "px";
          statsWrapEl.style.margin = "0 auto 18px auto";
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
      } catch (err) {
        // html2canvas를 부르기 전 단계(카드 너비 계산 등)에서 예외가 나도 버튼이
        // "이미지 생성 중..."에 영원히 멈춰있지 않도록 여기서도 반드시 정리한다.
        console.error(err);
        cleanup("캡처 실패");
      }
    });
  }

  /* ===================== 면담일지 모듈 ===================== */
  const INTERVIEWS_KEY = acctKey("personal-interviews:data");
  const INTERVIEW_TYPES = ["정기", "수시", "경고"];

