  function loadAgentsData() {
    try {
      const raw = localStorage.getItem(AGENTS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }
  let agentsData = loadAgentsData();

  // "오늘" 날짜를 "YYYY-MM-DD" 문자열로. 퇴사일자와 그대로 비교하기 위해 쓴다.
  function agentTodayStr() { return `${today.getFullYear()}-${pad2(today.getMonth() + 1)}-${pad2(today.getDate())}`; }
  // 퇴사일자를 미래 날짜로 입력해둔("예약된 퇴사") 사람인지. 이런 사람은 그 날짜가
  // 되기 전까지는 "상담사 관리"에서 여전히 "근무중"으로 보이고(자동으로는 안 바뀜),
  // 월별 스케줄에는 입력한 순간 바로 반영돼 있다.
  function isAgentScheduledResign(a) {
    return a.status === "WORKING" && !!a.resignDate && a.resignDate > agentTodayStr();
  }
  // 예약해둔 퇴사일자가 실제로 지나면(오늘이 되거나 지나면) 자동으로 "퇴사" 상태로
  // 바꿔준다. 앱을 열 때마다(=날짜가 바뀐 뒤 새로 열었을 때) 한 번씩 확인한다.
  function autoFlipResignedAgents() {
    const todayStr = agentTodayStr();
    let changed = false;
    agentsData.forEach((a) => {
      if (a.status === "WORKING" && a.resignDate && a.resignDate <= todayStr) {
        a.status = "RESIGNED";
        changed = true;
      }
    });
    return changed;
  }

  const agentsUi = {
    selectedId: null,
    mode: "view", // "view" | "add" | "edit"
    editingId: null,
    searchQuery: "",
    filterTypes: new Set(), // 비어있으면 "전체". "voice"|"chat"|"day"|"night"|"working"|"resigned"|"need"|"other" 중복 선택(AND 조합) 가능
    sortBy: "shift", // "shift" | "custom" | "name" | "type" | "chat" | "night" | "created"
    interviewMode: "list", // "list" | "add" | "edit" — 상담사 상세의 면담 이력 섹션용
    interviewEditingId: null,
    page: 1, // 고정 인원을 제외한 목록의 현재 페이지(PAGE_SIZE개씩)
    popoverOpen: false, // 사이드바에서 상담사를 클릭했을 때 옆에 뜨는 요약 카드(팝오버) 표시 여부
    popoverEdit: false, // 팝오버 안에서 바로 수정 중인지
    popoverEditGroup: null, // 팝오버 수정 중 임시로 고른 주간/야간 값
    popoverEditAdmin: null, // 팝오버 수정 중 임시로 고른 상담사/관리자 값
    popoverEditWorkTypes: null, // 팝오버 수정 중 임시로 고른 업무 구분 목록
    interviewTypeFilter: "all", // 상담사 상세의 면담 이력 섹션 전용 유형 필터
    interviewSearchQuery: "", // 상담사 상세의 면담 이력 섹션 전용 내용 검색어
    interviewListPage: 1, // 상담사 상세의 면담 이력 섹션 전용 페이지
    topTab: "agents", // "agents" | "all" | "qa-all" — 사이드바 옆 상단 세그먼트("상담사"/"전체 면담일지"/"전체 QA 점수").
    // 지금은 버튼(선택 표시)만 만들어 둔 상태라 "all"/"qa-all"을 눌러도 화면은 그대로다.
  };

  let agentStatusTimer = null;
  function flashAgentStatus(msg) {
    const el = document.getElementById("agent-status");
    if (!el) return;
    el.textContent = msg;
    clearTimeout(agentStatusTimer);
    agentStatusTimer = setTimeout(() => { el.textContent = ""; }, 1200);
  }
  function saveAgentsData() {
    try { localStorage.setItem(AGENTS_KEY, JSON.stringify(agentsData)); flashAgentStatus("저장됨"); }
    catch (e) { flashAgentStatus("저장 실패"); }
    // 상담사 관리 목록이 바뀔 때마다 월별 스케줄의 인원 목록도 자동으로 맞춰준다.
    if (typeof syncScheduleStaffFromAgents === "function") {
      syncScheduleStaffFromAgents();
      saveScheduleData();
    }
  }

  // 앱을 여는 시점에 예약된 퇴사일이 이미 지난 사람이 있으면 바로 "퇴사"로 넘겨준다.
  if (autoFlipResignedAgents()) saveAgentsData();

  function addAgent(values) {

    const id = genId();
    agentsData.push(Object.assign({ id }, values));
    saveAgentsData();
    return id;
  }
  function updateAgent(id, values) {
    const idx = agentsData.findIndex((a) => a.id === id);
    if (idx === -1) return;
    agentsData[idx] = Object.assign({}, agentsData[idx], values);
    saveAgentsData();
  }
  function deleteAgent(id) {
    // 상담사를 지울 때 그 사람의 면담 기록·QA 평가 기록(점수 + 업로드된 엑셀 파일 정보)도
    // 함께 정리되므로, 관련 저장소를 모두 함께 스냅샷해둔다.
    recordUndo("상담사 삭제", [AGENTS_KEY, INTERVIEWS_KEY, QA_KEY], () => {
      agentsData = loadAgentsData();
      interviewsData = loadInterviewsData();
      if (typeof loadQAData === "function") qaData = loadQAData();
    });
    agentsData = agentsData.filter((a) => a.id !== id);
    if (agentsUi.selectedId === id) agentsUi.selectedId = null;
    saveAgentsData();
    // 상담사를 지울 때 그 사람의 면담 기록도 함께 정리한다.
    if (typeof interviewsData !== "undefined") {
      interviewsData = interviewsData.filter((r) => r.agentId !== id);
      saveInterviewsData();
    }
    // 상담사를 지울 때, 그 사람 앞으로 업로드해뒀던 QA 점수·평가 엑셀(원문/정리된 텍스트 전부)도
    // 모든 달에 걸쳐 함께 삭제한다. 이걸 안 지우면 "파일은 있는데 상담사 목록엔 없는"
    // 유령 데이터로 계속 남게 된다.
    if (typeof qaData !== "undefined" && qaData) {
      const prefix = `${id}|`;
      let qaChanged = false;
      if (qaData.scores) {
        Object.keys(qaData.scores).forEach((key) => {
          if (key.indexOf(prefix) === 0) { delete qaData.scores[key]; qaChanged = true; }
        });
      }
      if (qaData.details) {
        Object.keys(qaData.details).forEach((key) => {
          if (key.indexOf(prefix) === 0) { delete qaData.details[key]; qaChanged = true; }
        });
      }
      if (qaChanged && typeof saveQAData === "function") saveQAData();
    }
  }
  function reorderAgents(fromId, toId) {
    const fromIdx = agentsData.findIndex((a) => a.id === fromId);
    const toIdx = agentsData.findIndex((a) => a.id === toId);
    if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return;
    const [item] = agentsData.splice(fromIdx, 1);
    const newToIdx = agentsData.findIndex((a) => a.id === toId);
    agentsData.splice(newToIdx, 0, item);
    saveAgentsData();
  }
  const AGENT_PIN_LIMIT = 10;
  function togglePinAgent(id) {
    const agent = agentsData.find((a) => a.id === id);
    if (!agent) return;
    if (!agent.pinned) {
      const pinnedCount = agentsData.filter((a) => a.pinned).length;
      if (pinnedCount >= AGENT_PIN_LIMIT) {
        flashAgentStatus(`고정은 최대 ${AGENT_PIN_LIMIT}개까지 가능해요`);
        return;
      }
    }
    agent.pinned = !agent.pinned;
    saveAgentsData();
    renderApp();
  }

  // 리스트에서 바로 "근무중" ↔ "퇴사"를 전환한다. 수정 화면을 열지 않아도 되도록
  // 리스트 안의 배지를 클릭하면 즉시 상태가 바뀌고, 저장과 동시에 월별 스케줄
  // 반영 여부도 자동으로 다시 계산된다. "퇴사"로 바꿀 때는 퇴사일자를 물어보고,
  // 그 날짜부터 해당 월 말일까지 월별 스케줄이 자동으로 "퇴사"로 채워진다.
  // 입력한 퇴사일자가 오늘보다 미래라면, "상담사 관리"의 재직 상태는 그 날짜가
  // 될 때까지 "근무중"으로 남아있고(자동으로 바로 "퇴사"로 바뀌지 않음) 그 날짜가
  // 되면 자동으로 "퇴사"로 전환된다. 다만 월별 스케줄에는 입력한 즉시 반영된다.
  function toggleAgentStatus(id) {
    const agent = agentsData.find((a) => a.id === id);
    if (!agent) return;
    if (agent.status === "RESIGNED") {
      if (typeof clearResignedScheduleFrom === "function" && agent.resignDate) {
        clearResignedScheduleFrom(agent.id, agent.resignDate);
      }
      agent.status = "WORKING";
      agent.resignDate = null;
    } else {
      const defaultDate = agentTodayStr();
      const input = window.prompt(
        `${agent.name}님의 퇴사일자를 입력해주세요 (예: ${defaultDate}).\n이 날짜부터 이번 달 말일까지 월별 스케줄에 자동으로 "퇴사"로 표시돼요.\n미래 날짜를 입력하면, 그 날짜가 될 때까지는 "상담사 관리"에서 재직 상태가 "근무중"으로 유지되다가 그 날짜에 자동으로 "퇴사"로 바뀌어요(스케줄에는 지금 바로 반영돼요).`,
        defaultDate
      );
      if (input === null) return; // 취소하면 상태를 바꾸지 않는다
      const trimmed = input.trim();
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
      const parsed = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
      const isValid = m && parsed.getFullYear() === Number(m[1]) && parsed.getMonth() === Number(m[2]) - 1 && parsed.getDate() === Number(m[3]);
      if (!isValid) {
        flashAgentStatus("퇴사일자 형식이 올바르지 않아요 (예: 2026-09-14)");
        return;
      }
      agent.status = trimmed <= agentTodayStr() ? "RESIGNED" : "WORKING";
      agent.resignDate = trimmed;
      if (typeof applyResignedScheduleFrom === "function") applyResignedScheduleFrom(agent.id, trimmed);
    }
    saveAgentsData();
    renderApp();
  }

  // 사이드바 아바타 원형에 쓸 이니셜(이름 마지막 두 글자)과, id를 기반으로 한
  // 고정 색상(테마의 강조색 팔레트 중 하나)을 계산한다. 같은 상담사는 항상 같은 색.
  const AGENT_AVATAR_PALETTE = ["--accent", "--purple", "--teal", "--pink", "--indigo", "--blue", "--salmon", "--orange"];
  function agentAvatarColor(id) {
    let sum = 0;
    for (const ch of String(id || "")) sum += ch.charCodeAt(0);
    return `var(${AGENT_AVATAR_PALETTE[sum % AGENT_AVATAR_PALETTE.length]})`;
  }
  function agentInitials(name) {
    const s = (name || "").trim();
    return s.slice(-2) || "?";
  }

  // 사이드바 목록에서 "면담 필요" 표시(빨간 점)에 쓰는 판정. 홈 화면의 "장기 미면담"
  // 알림(js/08-home.js, 최근 21일 내 면담 기록 없음)과 같은 기준을 그대로 따른다.
  const AGENT_INTERVIEW_ALERT_DAYS = 21;
  function agentLastInterviewDate(id) {
    if (typeof interviewsData === "undefined") return null;
    const dates = interviewsData.filter((r) => r.agentId === id && r.date).map((r) => r.date);
    return dates.length ? dates.sort().slice(-1)[0] : null;
  }
  function agentNeedsInterview(a) {
    if (!a || a.status === "RESIGNED" || a.isAdmin) return false;
    const last = agentLastInterviewDate(a.id);
    if (!last) return true;
    return last < addDaysISO(agentTodayStr(), -AGENT_INTERVIEW_ALERT_DAYS);
  }

  // ---- 카드 팝오버의 "QA 점수"(최근 3개월) / "면담 현황" 섹션에 쓰는 계산 ----
  // 근속: calcTenureMonths()(06-interviews.js)가 뽑아주는 총 개월수를 "N년 M개월" 문구로.
  function formatTenureFromHireDate(hireDateStr) {
    const months = (typeof calcTenureMonths === "function") ? calcTenureMonths(hireDateStr) : null;
    if (months === null || months === undefined) return "";
    const y = Math.floor(months / 12), m = months % 12;
    if (y <= 0) return `${m}개월`;
    if (m === 0) return `${y}년`;
    return `${y}년 ${m}개월`;
  }
  // 이번 달 포함 최근 3개월 점수 + 전월 대비 증감(목업의 qa[a.id]/df()와 동일한 방식)을 구한다.
  // 표에 보여줄 건 3개월치지만, 가장 오래된 달까지도 "전월 대비" 등락을 계산할 수 있도록
  // 그 바로 앞달(4번째) 점수까지 한 달 더 여유 있게 가져온다.
  function agentPopoverQaMonths(agentId) {
    const months = [];
    for (let i = 0; i < 4; i++) {
      let m = today.getMonth() - i, y = today.getFullYear();
      while (m < 0) { m += 12; y -= 1; }
      months.push({ year: y, monthIndex: m, score: (typeof getQAScore === "function") ? getQAScore(agentId, y, m) : null });
    }
    return months;
  }
  function agentPopoverQaTrendHtml(months, i) {
    const cur = months[i] ? months[i].score : null;
    const prev = months[i + 1] ? months[i + 1].score : null;
    if (cur === null || cur === undefined || prev === null || prev === undefined) return '<em class="agent-popover-qa-flat">-</em>';
    const d = cur - prev;
    if (d > 0) return `<em class="agent-popover-qa-up">▲ ${d.toFixed(1)}</em>`;
    if (d < 0) return `<em class="agent-popover-qa-down">▼ ${Math.abs(d).toFixed(1)}</em>`;
    return '<em class="agent-popover-qa-flat">－</em>';
  }
  // ---- QA 팝오버(카드 팝오버·면담일지 팝오버 옆, 남은 여백에 뜨는 QA 점수 카드) ----
  // 1) 최근 6개월 추이 그래프 → 2) 최근 3개월 점수표 + 전월 대비 등락 →
  // 3) 엑셀로 등록된 이번 달 회차(1~5차수) 순으로 보여준다.
  function renderAgentQaRoundsHtml(agent, year, monthIndex) {
    const monthLabel = `${year}년 ${monthIndex + 1}월`;
    const detail = (typeof getQADetail === "function") ? getQADetail(agent.id, year, monthIndex) : null;
    if (detail && detail.resignedNote) {
      return `<div class="agent-qa-popover-empty">퇴사 인원이에요. 점수만 반영되고 회차별 내역은 없어요.</div>`;
    }
    if (!detail || !detail.rounds || !detail.rounds.length) {
      return `<div class="agent-qa-popover-empty">${esc(monthLabel)}에 등록된 QA 엑셀이 없어요.</div>`;
    }
    const rows = detail.rounds.map((round) => `
      <div class="agent-qa-popover-round-row">
        <span class="agent-qa-popover-round-label">${esc(round.label)}</span>
        <span class="agent-qa-popover-round-score">${round.score === null || round.score === undefined ? "-" : round.score}</span>
      </div>
    `).join("");
    return `<div class="agent-qa-popover-rounds">${rows}</div>`;
  }
  function renderAgentQaPopover(agent) {
    const year = today.getFullYear(), monthIndex = today.getMonth();
    const months = agentPopoverQaMonths(agent.id);
    // 표에는 최근 3개월만 보여준다(4번째는 오직 가장 오래된 달의 전월 대비 계산용).
    const cells = months.slice(0, 3).map((mo, i) => `
      <div class="agent-popover-qa-cell">
        <small>${mo.monthIndex + 1}월</small>
        <b>${mo.score === null || mo.score === undefined ? '<span class="agent-popover-qa-none">없음</span>' : mo.score.toFixed(1)}</b>
        ${agentPopoverQaTrendHtml(months, i)}
      </div>
    `).join("");
    const trendHtml = qaTrendSvgHtml(agent.id, year, monthIndex);
    const roundsHtml = renderAgentQaRoundsHtml(agent, year, monthIndex);
    return `
      <div class="card agent-qa-popover">
        <div class="mac-iv-head">
          <div class="mac-iv-titles">
            <div class="mac-iv-title">${esc(agent.name)}${agent.ldap ? `<span class="mac-iv-title-ldap">${esc(agent.ldap)}</span>` : ""}의 QA 점수</div>
          </div>
        </div>
        <div class="agent-popover-sec-title">최근 6개월 QA 추이</div>
        <div class="agent-popover-qa-trend">${trendHtml}</div>
        <div class="agent-popover-sec-title">최근 3개월 점수</div>
        <div class="agent-popover-qa-grid">${cells}</div>
        <div class="agent-popover-sec-title">${monthIndex + 1}월 등록 회차 (엑셀)</div>
        ${roundsHtml}
        <button type="button" class="ghost-btn agent-qa-popover-goto" data-action="agent-goto-qa" data-id="${agent.id}">${ICON_CHEVRON_RIGHT} 품질 관리로 이동</button>
      </div>
    `;
  }
  function syncAgentQaTrendFontSize(pop) {
    const svg = pop && pop.querySelector(".agent-popover-qa-trend .qa-trend-svg");
    if (!svg) return;
    const viewBox = svg.viewBox && svg.viewBox.baseVal;
    const viewWidth = viewBox && viewBox.width ? viewBox.width : 560;
    const renderedWidth = svg.getBoundingClientRect().width;
    if (!renderedWidth || !viewWidth) return;
    // SVG는 viewBox가 팝오버 너비에 맞춰 확대되므로, SVG 내부의 14px은
    // 브라우저 화면에서 14px보다 크게 보일 수 있다. 화면상 실제 글자 크기가
    // 정확히 14px이 되도록 viewBox 배율의 역수를 적용한다.
    const fontSize = 13 * viewWidth / renderedWidth;
    svg.querySelectorAll(".qa-trend-value, .qa-trend-month").forEach((el) => {
      el.style.setProperty("font-size", `${fontSize}px`, "important");
    });
  }

  function attachAgentQaPopoverEvents(root, agent) {
    const pop = root.querySelector(".agent-qa-popover");
    if (!pop) return;
    syncAgentQaTrendFontSize(pop);
    if (typeof ResizeObserver === "function") {
      const svg = pop.querySelector(".agent-popover-qa-trend .qa-trend-svg");
      if (svg) {
        const observer = new ResizeObserver(() => syncAgentQaTrendFontSize(pop));
        observer.observe(svg);
        pop._qaTrendFontObserver = observer;
      }
    }
    const gotoBtn = pop.querySelector("[data-action='agent-goto-qa']");
    if (gotoBtn) {
      gotoBtn.onclick = () => {
        qaUi.year = today.getFullYear();
        qaUi.monthIndex = today.getMonth();
        qaHighlightAgentId = agent.id;
        setPage("qa");
      };
    }
  }
  // "면담 현황": 총 면담 건수 / 마지막 면담(며칠 전) / 다음 면담 필요 여부.
  function renderAgentPopoverInterviewSection(agent) {
    const all = (typeof agentInterviewFilteredList === "function") ? agentInterviewFilteredList(agent).all : [];
    const last = all[0] || null;
    const ago = last && typeof daysAgoFromISO === "function" ? daysAgoFromISO(last.date) : null;
    const needsIv = agentNeedsInterview(agent);
    const row = (label, value, sub) => `
      <div class="agent-popover-row">
        <span class="agent-popover-row-label">${label}</span>
        <span class="agent-popover-row-value">${value}${sub ? `<small class="agent-popover-row-sub">${sub}</small>` : ""}</span>
      </div>
    `;
    return `
      <div class="agent-popover-sec-title">면담 현황</div>
      <div class="agent-popover-group">
        ${row("총 면담", `${all.length}건`)}
        ${row("마지막 면담", last ? esc(last.date) : "기록 없음", last && ago !== null ? `${ago}일 전` : "")}
        ${row("다음 면담", needsIv ? '<span class="agent-popover-need">면담 필요</span>' : "여유 있음")}
      </div>
    `;
  }

  // 이름 초성만으로도 검색이 되도록 한글 음절에서 초성을 뽑아내는 헬퍼.
  const CHOSUNG_LIST = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
  function getChosungString(str) {
    let out = "";
    for (const ch of (str || "")) {
      const code = ch.charCodeAt(0);
      if (code >= 0xac00 && code <= 0xd7a3) out += CHOSUNG_LIST[Math.floor((code - 0xac00) / 588)];
      else out += ch;
    }
    return out;
  }
  // 이름/LDAP/초성 외에, "주간"/"야간"/"채팅"/"유선" 같은 근무 형태 키워드로도 검색할 수 있게 한다.
  // 이름에 이 단어들이 실제로 들어갈 일은 거의 없으므로, 이름 검색과 그냥 OR로 묶어도 안전하다.
  const AGENT_SEARCH_KEYWORD_MATCHERS = {
    "주간": (a) => a.group !== "night",
    "야간": (a) => a.group === "night",
    "채팅": (a) => (a.workTypes || []).indexOf("채팅") !== -1,
    "유선": (a) => (a.workTypes || []).indexOf("유선") !== -1,
  };
  function agentMatchesSearchKeyword(a, needle) {
    const fn = AGENT_SEARCH_KEYWORD_MATCHERS[needle];
    if (fn) return fn(a);
    // 사용자가 추가한 업무 구분 이름도 그대로 검색어로 쓸 수 있게 한다(대소문자 무시).
    const customHit = customWorkTypes.some((t) => t.toLowerCase() === needle && (a.workTypes || []).indexOf(t) !== -1);
    return customHit;
  }
  function agentMatchesSearch(a, query) {
    const needle = (query || "").trim().toLowerCase();
    if (!needle) return true;
    if ((a.name || "").toLowerCase().indexOf(needle) !== -1) return true;
    if ((a.ldap || "").toLowerCase().indexOf(needle) !== -1) return true;
    if (getChosungString(a.name || "").indexOf(needle) !== -1) return true;
    if (agentMatchesSearchKeyword(a, needle)) return true;
    return false;
  }
  function agentMatchesFilterType(a, filterType) {
    if (filterType === "voice") return (a.workTypes || []).indexOf("유선") !== -1;
    if (filterType === "chat") return (a.workTypes || []).indexOf("채팅") !== -1;
    if (filterType === "day") return a.group !== "night";
    if (filterType === "night") return a.group === "night";
    if (filterType === "working") return a.status !== "RESIGNED";
    if (filterType === "resigned") return a.status === "RESIGNED";
    if (filterType === "need") return agentNeedsInterview(a);
    // "기타": 채팅도 유선도 아닌(업무구분에 둘 다 없는) 나머지 인원.
    if (filterType === "other") return (a.workTypes || []).indexOf("유선") === -1 && (a.workTypes || []).indexOf("채팅") === -1;
    // 사용자가 추가한 업무 구분 필터 버튼은 "custom:이름" 형태의 filterType으로 들어온다.
    if (filterType && filterType.indexOf("custom:") === 0) {
      const typeName = filterType.slice("custom:".length);
      return (a.workTypes || []).indexOf(typeName) !== -1;
    }
    return true;
  }
  // filterTypes: Set(문자열). 비어있으면 전체 통과. 여러 개면 모두 만족(AND)해야 통과 — 버튼 중복 선택 지원.
  function agentMatchesFilter(a, filterTypes) {
    if (!filterTypes || filterTypes.size === 0) return true;
    for (const ft of filterTypes) {
      if (!agentMatchesFilterType(a, ft)) return false;
    }
    return true;
  }
  function agentTypeRank(a) {
    const hasVoice = (a.workTypes || []).indexOf("유선") !== -1;
    const hasChat = (a.workTypes || []).indexOf("채팅") !== -1;
    if (hasVoice && hasChat) return 1;
    if (hasVoice) return 0;
    if (hasChat) return 2;
    return 3;
  }
  function agentChatRank(a) {
    const hasVoice = (a.workTypes || []).indexOf("유선") !== -1;
    const hasChat = (a.workTypes || []).indexOf("채팅") !== -1;
    if (hasChat && hasVoice) return 1;
    if (hasChat) return 0;
    if (hasVoice) return 2;
    return 3;
  }
  function agentNightRank(a) {
    return a.group === "night" ? 0 : 1;
  }
  // 기본 정렬(주간→야간, 그 안에서 채팅→유선, 그 중에서도 근무 시작 시각 순)을 위한 순위들.
  function agentGroupRank(a) {
    return a.group === "night" ? 1 : 0;
  }
  function agentShiftTypeRank(a) {
    const types = a.workTypes || [];
    if (types.indexOf("채팅") !== -1) return 0;
    if (types.indexOf("유선") !== -1) return 1;
    return 2;
  }
  // 근무시간(예: "09:00-18:00") 문자열에서 시작 시각을 분 단위로 추출한다.
  // 형식을 찾을 수 없으면 맨 뒤로 보내기 위해 아주 큰 값을 반환한다.
  function agentStartMinutes(a) {
    const wh = a.timezone || "";
    const m = wh.match(/(\d{1,2}):(\d{2})/);
    if (!m) return Infinity;
    return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  }
  function sortAgentList(list, sortBy) {
    const arr = [...list];
    if (sortBy === "shift") {
      arr.sort((a, b) => {
        const g = agentGroupRank(a) - agentGroupRank(b);
        if (g !== 0) return g;
        const t = agentShiftTypeRank(a) - agentShiftTypeRank(b);
        if (t !== 0) return t;
        const s = agentStartMinutes(a) - agentStartMinutes(b);
        if (s !== 0) return s;
        return a.name.localeCompare(b.name, "ko");
      });
    } else if (sortBy === "name") {
      arr.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    } else if (sortBy === "type") {
      arr.sort((a, b) => {
        const r = agentTypeRank(a) - agentTypeRank(b);
        return r !== 0 ? r : a.name.localeCompare(b.name, "ko");
      });
    } else if (sortBy === "chat") {
      arr.sort((a, b) => {
        const r = agentChatRank(a) - agentChatRank(b);
        return r !== 0 ? r : a.name.localeCompare(b.name, "ko");
      });
    } else if (sortBy === "night") {
      arr.sort((a, b) => {
        const r = agentNightRank(a) - agentNightRank(b);
        return r !== 0 ? r : a.name.localeCompare(b.name, "ko");
      });
    } else if (sortBy === "created") {
      arr.sort((a, b) => a.id.localeCompare(b.id));
    }
    // "custom" -> keep existing (drag-defined) order

    // 정렬 기준과 무관하게, 퇴사 처리된 인원은 항상 목록 맨 아래로 보낸다.
    // sort는 안정 정렬이라 같은 재직 상태 안에서는 위에서 정한 순서가 그대로 유지된다.
    arr.sort((a, b) => (a.status === "RESIGNED" ? 1 : 0) - (b.status === "RESIGNED" ? 1 : 0));
    return arr;
  }

  function workTypeBadgesHtml(types) {
    if (!types || types.length === 0) return `<span class="agent-field-empty">-</span>`;
    return renderWorkTypeBadges(types);
  }
  function scheduleGroupLabel(group) { return group === "night" ? `${ICON_MOON} 야간` : `${ICON_SUN} 주간`; }
  function scheduleGroupBadgeHtml(group) {
    return `<span class="badge ${group === "night" ? "night" : "day"}">${scheduleGroupLabel(group)}</span>`;
  }

  function renderAgentRow(a, section, draggable) {
    const selected = a.id === agentsUi.selectedId;
    const typeBadges = renderWorkTypeBadges(a.workTypes, "sm");
    const groupBadge = `<span class="badge sm ${a.group === "night" ? "night" : "day"}">${a.group === "night" ? "야간" : "주간"}</span>`;
    const isResigned = a.status === "RESIGNED";
    const scheduledResign = isAgentScheduledResign(a);
    const statusLabel = isResigned ? "퇴사" : (scheduledResign ? "퇴사예정" : "");
    // 목업(사이드바)에는 "근무중"은 아예 표시하지 않고, 퇴사/퇴사예정인 사람만 배지를 보여준다.
    // 클릭하면 여전히 재직 상태를 되돌릴 수 있도록 버튼은 유지하되, 목록에서는 테두리·전환 아이콘
    // 없는 "plain" 모양으로 그린다.
    const statusBadge = (isResigned || scheduledResign)
      ? `<button type="button" class="badge-btn sm plain resigned" data-action="toggle-agent-status" data-id="${a.id}" title="${scheduledResign ? `${a.resignDate}부터 자동으로 퇴사 처리돼요. 클릭하면 재직 상태가 바로 바뀌어요` : "클릭하면 재직 상태가 바로 바뀌어요"}">${statusLabel}</button>`
      : "";
    const needsIv = agentNeedsInterview(a);
    const ivCount = typeof interviewsData !== "undefined" ? interviewsData.filter((r) => r.agentId === a.id).length : 0;
    return `
      <div class="agent-row ${selected ? "selected" : ""}" draggable="${draggable ? "true" : "false"}" data-agent-id="${a.id}" data-agent-section="${section}">
        <span class="drag-handle ${draggable ? "" : "drag-handle-disabled"}" title="${draggable ? "드래그해서 순서 변경" : "사용자 지정 정렬에서만 드래그할 수 있어요"}">⠿</span>
        <button class="pin-btn ${a.pinned ? "pinned" : ""}" data-action="pin-agent" data-id="${a.id}" title="${a.pinned ? "고정 해제" : "상단에 고정"}">${a.pinned ? "★" : "☆"}</button>
        <div class="agent-avatar" style="background:${agentAvatarColor(a.id)}">${esc(agentInitials(a.name))}</div>
        <div class="agent-row-main" data-action="select-agent" data-id="${a.id}">
          <div class="agent-row-top">
            <span class="agent-row-name">${esc(a.name)}</span>
            ${a.ldap ? `<span class="agent-row-ldap-inline">${esc(a.ldap)}</span>` : ""}
          </div>
          <div class="agent-row-badges-line">${a.isAdmin ? '<span class="badge sm admin">관리자</span>' : ""}${typeBadges}${groupBadge}${statusBadge}</div>
        </div>
        <div class="agent-row-count">${needsIv ? '<span class="need-dot" title="면담 필요"></span>' : ""}${ivCount ? `<span class="agent-row-count-num">${ivCount}건</span>` : ""}</div>
      </div>
    `;
  }

  function renderAgentForm(agent) {
    const isEdit = !!agent;
    const v = agent || { name: "", ldap: "", empNo: "", hireDate: "", contact: "", workTypes: [], timezone: "", group: "day", isAdmin: false, status: "WORKING", resignDate: "" };
    const workTypes = v.workTypes || [];
    const group = v.group === "night" ? "night" : "day";
    // 아직 날짜가 안 된 "예약된 퇴사"(status는 WORKING인데 resignDate가 미래)여도
    // 수정 화면에서는 "퇴사" 쪽을 선택해둔 상태로 보여준다. 그래야 나중에 다시
    // 열었을 때 예약해둔 날짜를 확인하거나 취소(근무중으로 되돌리기)할 수 있다.
    const status = (v.status === "RESIGNED" || v.resignDate) ? "RESIGNED" : "WORKING";
    return `
      <div class="agent-form-title">${isEdit ? "상담사 정보 수정" : "새 상담사 추가"}</div>
      <form class="agent-form" id="agent-form">
        <label class="agent-form-label">상담사 이름
          <input type="text" class="add-input" id="agent-input-name" value="${esc(v.name)}" placeholder="예: 홍길동" autocomplete="off">
        </label>
        <label class="agent-form-label">LDAP 이름
          <input type="text" class="add-input" id="agent-input-ldap" value="${esc(v.ldap)}" placeholder="예: hong.gd" autocomplete="off">
        </label>
        <label class="agent-form-label">사번
          <input type="text" class="add-input" id="agent-input-empno" value="${esc(v.empNo)}" placeholder="예: T25070840" autocomplete="off">
        </label>
        <label class="agent-form-label">입사일자
          <input type="date" class="add-input" id="agent-input-hiredate" value="${esc(v.hireDate)}" autocomplete="off">
        </label>
        <label class="agent-form-label">연락처
          <input type="text" class="add-input" id="agent-input-contact" value="${esc(v.contact)}" placeholder="예: 010-1234-5678" autocomplete="off">
        </label>
        <div class="agent-form-label">업무 구분
          <div class="agent-checkbox-row">
            <label class="agent-checkbox"><input type="checkbox" id="agent-input-voice" ${workTypes.indexOf("유선") !== -1 ? "checked" : ""}> 유선</label>
            <label class="agent-checkbox"><input type="checkbox" id="agent-input-chat" ${workTypes.indexOf("채팅") !== -1 ? "checked" : ""}> 채팅</label>
            ${customWorkTypes.map((t) => `
              <label class="agent-checkbox"><input type="checkbox" class="agent-input-custom-type" data-worktype="${esc(t)}" ${workTypes.indexOf(t) !== -1 ? "checked" : ""}> ${esc(t)}</label>
            `).join("")}
            <button type="button" class="ghost-btn agent-worktype-manage-btn" id="agent-worktype-manage-btn">+ 관리</button>
          </div>
        </div>
        <div class="agent-form-label">근무 조
          <div class="agent-radio-row">
            <label class="agent-radio"><input type="radio" name="agent-input-group" id="agent-input-group-day" value="day" ${group === "day" ? "checked" : ""}> ${ICON_SUN} 주간</label>
            <label class="agent-radio"><input type="radio" name="agent-input-group" id="agent-input-group-night" value="night" ${group === "night" ? "checked" : ""}> ${ICON_MOON} 야간</label>
          </div>
        </div>
        <label class="agent-form-label">시간대
          <input type="text" class="add-input" id="agent-input-timezone" value="${esc(v.timezone)}" placeholder="예: 09:00-18:00" autocomplete="off">
        </label>
        <div class="agent-form-label">재직 상태
          <div class="agent-radio-row">
            <label class="agent-radio"><input type="radio" name="agent-input-status" id="agent-input-status-working" value="WORKING" ${status === "WORKING" ? "checked" : ""}> 근무중</label>
            <label class="agent-radio"><input type="radio" name="agent-input-status" id="agent-input-status-resigned" value="RESIGNED" ${status === "RESIGNED" ? "checked" : ""}> 퇴사</label>
          </div>
        </div>
        <label class="agent-form-label" id="agent-resigndate-wrap" style="${status === "RESIGNED" ? "" : "display:none;"}">퇴사일자
          <input type="date" class="add-input" id="agent-input-resigndate" value="${esc(v.resignDate || "")}" autocomplete="off">
          <span class="agent-form-hint">오늘 이전(또는 오늘) 날짜면 바로 "퇴사"로 처리돼요. 미래 날짜를 넣으면 그 날짜가 될 때까지 재직 상태는 "근무중"으로 유지되다 그 날 자동으로 "퇴사"로 바뀌어요 — 월별 스케줄에는 지금 바로 그 날짜부터 반영됩니다.</span>
        </label>
        <div class="agent-form-label">권한
          <div class="agent-checkbox-row">
            <label class="agent-checkbox"><input type="checkbox" id="agent-input-admin" ${v.isAdmin ? "checked" : ""}> 관리자</label>
          </div>
        </div>
        <div class="agent-form-actions">
          <button type="submit" class="primary-btn">${isEdit ? "저장" : "추가"}</button>
          <button type="button" class="cancel-btn" id="agent-form-cancel">취소</button>
        </div>
      </form>
    `;
  }

  function buildAgentListAreaHtml(pinnedAgents, listAgents, filtered, pinnedCount, draggable) {
    let pinnedHtml = "";
    if (pinnedAgents.length > 0) {
      pinnedHtml = `
        <div class="pinned-block">
          <div class="pinned-title">${ICON_PIN} 고정된 인원 <span class="pinned-count">(${pinnedCount}/${AGENT_PIN_LIMIT})</span></div>
          <div class="agent-list">${pinnedAgents.map((a) => renderAgentRow(a, "pinned", draggable)).join("")}</div>
        </div>
      `;
    }

    let listHtml = "";
    let paginationHtml = "";
    if (agentsData.length === 0) {
      listHtml = `<div class="agent-list-empty">등록된 상담사가 없어요.<br>오른쪽 위 "＋ 상담사 추가"로 첫 상담사를 등록해보세요.</div>`;
    } else if (filtered.length === 0) {
      listHtml = `<div class="agent-list-empty">검색 또는 필터 조건에 맞는 상담사가 없어요.</div>`;
    } else if (listAgents.length > 0) {
      // 고정되지 않은 인원 목록은 화면 높이에 맞춰 동적으로 계산된 개수(agentListDynamicPageSize)만큼
      // 페이지를 나눠서 보여준다(계산 전이거나 계산에 실패하면 기본 PAGE_SIZE로 대체됨).
      const { items, page, totalPages } = paginateList(listAgents, agentsUi.page, agentListDynamicPageSize);
      agentsUi.page = page;
      listHtml = `
        ${pinnedAgents.length > 0 ? `<div class="agent-sidebar-section-lbl">전체</div>` : ""}
        <div class="agent-list">${items.map((a) => renderAgentRow(a, "list", draggable)).join("")}</div>
      `;
      // 이전/다음 버튼은 스크롤되는 목록 영역 밖(#agent-list-pagination)에 따로 그려서,
      // 창 세로 길이가 얼마든 늘 사이드바 맨 아래에 붙어 있게 한다.
      paginationHtml = renderPaginationHtml(page, totalPages, "agent-list");
    }

    return { areaHtml: `${pinnedHtml}${listHtml}`, paginationHtml };
  }

  // ---- 사이드바 목록이 창 높이에 꽉 차도록, 화면에 보이는 실제 크기를 재서
  //      "한 페이지에 몇 명을 보여줄지"를 동적으로 계산한다 ----
  // 고정 개수(예전 PAGE_SIZE=12)로만 나누면 창이 세로로 긴 화면에서는 목록 중간에
  // 여백이 뜬 채로 "다음"이 나타나고, 반대로 창이 작을 땐 목록이 넘쳐 잘려 보인다.
  // #agent-list-area의 실제 렌더링된 높이와 상담사 행 하나의 높이를 재서, 그 안에
  // 몇 줄이 들어가는지 계산해 페이지 크기로 쓴다.
  let agentListDynamicPageSize = null;
  let agentListResizeObserver = null;

  function measureAndSyncAgentPageSize() {
    const listArea = document.getElementById("agent-list-area");
    if (!listArea) return;
    // 소수점 아래 서브픽셀 오차가 누적되면(19줄이면 0.x px * 19 → 몇 px) 마지막 한
    // 줄이 살짝 넘쳐서 세로 스크롤이 생겨버린다. 가용 높이는 내림, 행 높이는
    // 올림으로 재서 "실제보다 넉넉하게 잡는 일"이 없도록 한다(항상 안전한 쪽으로).
    const availableHeight = Math.floor(listArea.clientHeight);
    if (!availableHeight) return; // 창이 접혀 있는 등, 아직 잴 수 없는 상태면 건너뜀

    const sampleRow = listArea.querySelector(".agent-list .agent-row");
    if (!sampleRow) return; // 목록이 비어 있으면(검색결과 없음 등) 계산할 기준이 없으므로 건너뜀
    const rowHeight = Math.ceil(sampleRow.getBoundingClientRect().height);
    if (!rowHeight) return;
    const listGap = Math.ceil(parseFloat(window.getComputedStyle(sampleRow.parentElement).rowGap || "0") || 0);

    // 고정된 인원 블록 + "전체" 라벨처럼, 일반 목록 위에 고정으로 차지하는 높이는
    // 빼고 나머지 공간만 행 높이로 나눈다.
    let reserved = 0;
    const pinnedBlock = listArea.querySelector(".pinned-block");
    const sectionLbl = listArea.querySelector(".agent-sidebar-section-lbl");
    if (pinnedBlock) reserved += Math.ceil(pinnedBlock.getBoundingClientRect().height);
    if (sectionLbl) reserved += Math.ceil(sectionLbl.getBoundingClientRect().height);

    // 반올림 오차에 대비한 최소한의 안전 여백(2px). 이게 없으면 계산이 "딱 맞아
    // 떨어지는" 경계값에서 한 줄이 1px 남짓 넘쳐 스크롤이 생기는 경우가 있었다.
    const SAFETY_MARGIN = 2;
    const usableHeight = Math.max(0, availableHeight - reserved - SAFETY_MARGIN);
    const computed = Math.max(4, Math.floor((usableHeight + listGap) / (rowHeight + listGap)));
    if (computed === agentListDynamicPageSize) {
      // 계산값은 그대로라도, 폰트 스왑 등으로 실제 렌더링 결과가 이미 넘쳐 있을
      // 수 있으니(계산이 안 바뀌면 위 updateAgentListArea가 다시 안 불리므로)
      // 여기서도 한 번은 실측 검증을 해준다.
      enforceAgentListFit();
      return;
    }
    agentListDynamicPageSize = computed;
    agentsUi.page = 1; // 페이지 크기가 바뀌면 이전 페이지 번호가 더 이상 맞지 않으므로 처음으로
    updateAgentListArea();
  }

  // ---- 계산이 아무리 정교해도(서브픽셀 반올림, 폰트 로딩 타이밍 등) 몇 px 차이로
  //      어긋나서 마지막 한 줄만 살짝 넘쳐 스크롤이 생기는 경우가 있었다. 계산에
  //      기대는 대신, 실제로 그려진 결과(scrollHeight)를 직접 재서 넘치면 그 자리에서
  //      한 줄씩 과감하게 줄여 다음 페이지로 밀어낸다 — "스크롤이 생기느니 마지막
  //      상담사는 2페이지로 넘긴다"는 원칙. ----
  function enforceAgentListFit(attemptsLeft) {
    const listArea = document.getElementById("agent-list-area");
    if (!listArea) return;
    if (typeof attemptsLeft !== "number") attemptsLeft = 8;
    if (attemptsLeft <= 0) return;
    if (listArea.scrollHeight <= listArea.clientHeight + 1) return; // 이미 딱 맞음(1px은 반올림 오차 허용)

    const current = agentListDynamicPageSize && agentListDynamicPageSize > 4 ? agentListDynamicPageSize : PAGE_SIZE;
    agentListDynamicPageSize = Math.max(4, current - 1);
    agentsUi.page = 1;
    renderAgentListAreaOnly(); // measureAndSyncAgentPageSize를 다시 부르지 않는, 순수 다시 그리기
    enforceAgentListFit(attemptsLeft - 1); // 한 줄 줄이고도 여전히 넘치면 더 줄인다
  }

  // updateAgentListArea와 내용은 같지만, 끝에서 measureAndSyncAgentPageSize를
  // 다시 부르지 않는다 — enforceAgentListFit이 이미 정한 페이지 크기가 계산값으로
  // 되돌아가 버리는(줄였다가 다시 늘어나는) 걸 막기 위한 전용 버전.
  function renderAgentListAreaOnly() {
    const listArea = document.getElementById("agent-list-area");
    const paginationArea = document.getElementById("agent-list-pagination");
    if (!listArea) return;

    const filtered = agentsData.filter((a) => agentMatchesSearch(a, agentsUi.searchQuery) && agentMatchesFilter(a, agentsUi.filterTypes));
    const pinnedAgents = sortAgentList(filtered.filter((a) => a.pinned), agentsUi.sortBy);
    const listAgents = sortAgentList(filtered.filter((a) => !a.pinned), agentsUi.sortBy);
    const draggable = agentsUi.sortBy === "custom";
    const pinnedCount = agentsData.filter((a) => a.pinned).length;

    const { areaHtml, paginationHtml } = buildAgentListAreaHtml(pinnedAgents, listAgents, filtered, pinnedCount, draggable);
    listArea.innerHTML = areaHtml;
    if (paginationArea) paginationArea.innerHTML = paginationHtml;
    attachAgentListAreaHandlers(listArea, paginationArea);
  }

  // #agent-list-area의 실제 크기가 바뀔 때마다(브라우저 창 크기 변경은 물론,
  // 이 앱의 창을 손으로 늘리거나 최대화할 때도) 다시 계산한다.
  function watchAgentListSize() {
    const listArea = document.getElementById("agent-list-area");
    if (!listArea) return;
    if (agentListResizeObserver) agentListResizeObserver.disconnect();
    if (typeof ResizeObserver === "undefined") return;
    let lastH = 0;
    agentListResizeObserver = new ResizeObserver((entries) => {
      const h = entries[0] && entries[0].contentRect ? entries[0].contentRect.height : 0;
      if (Math.abs(h - lastH) < 1) return;
      lastH = h;
      measureAndSyncAgentPageSize();
    });
    agentListResizeObserver.observe(listArea);
  }

  // 검색어/필터/정렬이 바뀔 때 목록 영역만 다시 그림.
  // 입력창(input) 자체는 건드리지 않으므로 한글 조합(IME) 중에도
  // 입력이 끊기지 않고, 목록은 타이핑하는 즉시 반영됨.
  function updateAgentListArea() {
    const listArea = document.getElementById("agent-list-area");
    const paginationArea = document.getElementById("agent-list-pagination");
    if (!listArea) return;

    const filtered = agentsData.filter((a) => agentMatchesSearch(a, agentsUi.searchQuery) && agentMatchesFilter(a, agentsUi.filterTypes));
    const pinnedAgents = sortAgentList(filtered.filter((a) => a.pinned), agentsUi.sortBy);
    const listAgents = sortAgentList(filtered.filter((a) => !a.pinned), agentsUi.sortBy);
    const draggable = agentsUi.sortBy === "custom";
    const pinnedCount = agentsData.filter((a) => a.pinned).length;

    const { areaHtml, paginationHtml } = buildAgentListAreaHtml(pinnedAgents, listAgents, filtered, pinnedCount, draggable);
    listArea.innerHTML = areaHtml;
    if (paginationArea) paginationArea.innerHTML = paginationHtml;
    attachAgentListAreaHandlers(listArea, paginationArea);
    // 목록 내용이 바뀌면(검색/필터/페이지 이동 등) 실제 행 높이·개수가 달라질 수 있으므로
    // 다음 배치 때 다시 한 번 크기를 확인해 필요하면 페이지 크기를 보정한다.
    measureAndSyncAgentPageSize();
    // 계산 기반 보정이 끝난 뒤에도, 실제로 그려진 결과가 넘치면 마지막으로 한 번 더
    // 실측 기반으로 강제 보정한다(위 measureAndSyncAgentPageSize가 계산값이 그대로라고
    // 판단해 다시 그리지 않은 경우까지 포함해서).
    enforceAgentListFit();
  }

  function attachAgentListAreaHandlers(root, paginationRoot) {
    root.querySelectorAll("[data-action='select-agent']").forEach((btn) => {
      btn.onclick = () => {
        // 전체 면담일지 화면에서 상담사를 선택하면 즉시 상담사 탭으로 전환하고
        // 선택한 상담사의 팝오버를 다시 연다.
        agentsUi.topTab = "agents";
        agentsUi.selectedId = btn.getAttribute("data-id");
        agentsUi.mode = "view";
        agentsUi.interviewMode = "list";
        agentsUi.interviewEditingId = null;
        agentsUi.popoverOpen = true;
        agentsUi.popoverEdit = false;
        agentsUi.popoverEditGroup = null;
        agentsUi.interviewTypeFilter = "all";
        agentsUi.interviewSearchQuery = "";
        agentsUi.interviewListPage = 1;
        renderApp();
      };
    });
    root.querySelectorAll("[data-action='pin-agent']").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        togglePinAgent(btn.getAttribute("data-id"));
      };
    });
    root.querySelectorAll("[data-action='toggle-agent-status']").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        toggleAgentStatus(btn.getAttribute("data-id"));
      };
    });
    // 이전/다음 버튼은 이제 #agent-list-area 밖(#agent-list-pagination)에 따로 그려지므로,
    // 그 컨테이너를 못 받으면 root 자신에서라도 찾아본다(초기 렌더링 때는 root가 페이지
    // 전체라 둘 다 포함하고 있음).
    attachPaginationHandlers(paginationRoot || root, "agent-list", (delta) => {
      agentsUi.page = agentsUi.page + delta;
      updateAgentListArea();
    });
    attachAgentDragHandlers(root);
  }

  // ---- 카드 팝오버(사이드바에서 상담사를 클릭하면 옆에 뜨는 요약 카드) ----
  function renderAgentPopover(agent) {
    const edit = !!agentsUi.popoverEdit;
    const isResigned = agent.status === "RESIGNED";
    const scheduledResign = isAgentScheduledResign(agent);
    const statusLabel = isResigned ? "퇴사" : (scheduledResign ? "근무중(퇴사예정)" : "근무중");
    // 편집 중에는 agentsUi.popoverEdit*에 임시로 담아둔 값을 우선 쓰고, 보기 모드거나
    // 아직 편집을 시작하지 않았으면(=null) agent 원본 값을 그대로 쓴다.
    const curGroup = agentsUi.popoverEditGroup || agent.group || "day";
    const curAdmin = agentsUi.popoverEditAdmin != null ? agentsUi.popoverEditAdmin : !!agent.isAdmin;
    const curWorkTypes = agentsUi.popoverEditWorkTypes || agent.workTypes || [];

    const topHtml = edit
      ? `
        <input type="text" class="agent-popover-input agent-popover-name-input" id="pv-name" value="${esc(agent.name)}" placeholder="이름">
        <input type="text" class="agent-popover-input agent-popover-ldap-input" id="pv-ldap" value="${esc(agent.ldap)}" placeholder="LDAP">
      `
      : `
        <div class="agent-popover-name">${esc(agent.name)}</div>
        <div class="agent-popover-ldap">${esc(agent.ldap)}</div>
      `;

    // 상담사/관리자 배지: 보기 모드에서는 그냥 표시만, 수정 모드에서는 누르면 드롭다운으로
    // 상담사/관리자를 고를 수 있는 트리거 버튼이 된다. 수정 모드에서는 배지 안쪽에 작은
    // 화살표를 같이 넣어서 "이건 눌러서 바꿀 수 있다"는 걸 표시한다.
    const roleBadgeHtml = edit
      ? `<button type="button" class="badge agent-role-badge ${curAdmin ? "admin" : "staff"}" id="pv-role-badge">${curAdmin ? "관리자" : "상담사"}<span class="agent-role-trigger-arrow">▾</span></button>`
      : `<span class="badge agent-role-badge ${curAdmin ? "admin" : "staff"}">${curAdmin ? "관리자" : "상담사"}</span>`;
    const badgesHtml = `
      <div class="${edit ? "agent-popover-edit-badges" : "agent-popover-badges"}">
        ${roleBadgeHtml}
      </div>
    `;

    // 목업의 .c-act(원형 아이콘 + 아래 라벨)와 동일한 형태로 구성.
    const actionsHtml = edit
      ? `
        <div class="agent-popover-actions">
          <button type="button" class="agent-popover-act save" data-pv-act="save"><b>✓</b>저장</button>
          <button type="button" class="agent-popover-act" data-pv-act="cancel"><b>↩</b>취소</button>
        </div>
      `
      : `
        <div class="agent-popover-actions">
          <button type="button" class="agent-popover-act" data-pv-act="edit"><b>✎</b>수정</button>
          <button type="button" class="agent-popover-act" data-pv-act="pin"><b>${agent.pinned ? "★" : "☆"}</b>고정</button>
          <button type="button" class="agent-popover-act" data-pv-act="qa"><b>▤</b>QA</button>
          <button type="button" class="agent-popover-act dg" data-pv-act="del"><b>🗑</b>삭제</button>
        </div>
      `;

    const fieldRow = (label, viewHtml, editHtml, viewSub) => `
      <div class="agent-popover-row">
        <span class="agent-popover-row-label">${label}</span>
        <span class="agent-popover-row-value">${edit ? editHtml : viewHtml}${!edit && viewSub ? `<small class="agent-popover-row-sub">${viewSub}</small>` : ""}</span>
      </div>
    `;

    const tenureText = agent.hireDate ? formatTenureFromHireDate(agent.hireDate) : "";

    // 근무 조/업무 구분: 배지(알약형) 대신 다른 행들과 같은 일반 텍스트로 표기한다.
    // 수정 모드에서는 같은 텍스트를 누르면 드롭다운(openAgentFieldDropdown)으로 값을
    // 고를 수 있는 트리거 버튼이 되고, 눌러서 바꿀 수 있다는 걸 보여주려고 작은
    // 화살표(▾)가 옆에 붙는다(agent-field-trigger의 ::after).
    const groupText = curGroup === "night" ? "야간" : "주간";
    const groupValueHtml = edit
      ? `<button type="button" class="agent-field-trigger" id="pv-group-badge">${esc(groupText)}</button>`
      : esc(groupText);
    const worktypeText = curWorkTypes.join(", ");
    const worktypeDisplay = worktypeText ? esc(worktypeText) : '<span class="agent-field-empty">-</span>';
    const worktypeValueHtml = edit
      ? `<button type="button" class="agent-field-trigger" id="pv-worktype-badge">${worktypeDisplay}</button>`
      : worktypeDisplay;

    const infoHtml = `
      <div class="agent-popover-group">
        ${fieldRow("사번", agent.empNo ? esc(agent.empNo) : '<span class="agent-field-empty">-</span>', `<input type="text" class="agent-popover-input" id="pv-empno" value="${esc(agent.empNo)}">`)}
        ${fieldRow("입사일", agent.hireDate ? esc(agent.hireDate) : '<span class="agent-field-empty">-</span>', `<input type="date" class="agent-popover-input" id="pv-hiredate" value="${esc(agent.hireDate)}">`, tenureText ? `근속 ${tenureText}` : "")}
        ${fieldRow("연락처", agent.contact ? esc(agent.contact) : '<span class="agent-field-empty">-</span>', `<input type="text" class="agent-popover-input" id="pv-contact" value="${esc(agent.contact)}">`)}
        ${fieldRow("근무 시간", agent.timezone ? esc(agent.timezone) : '<span class="agent-field-empty">-</span>', `<input type="text" class="agent-popover-input" id="pv-timezone" value="${esc(agent.timezone)}">`)}
        ${fieldRow("근무 조", groupValueHtml, groupValueHtml)}
        ${fieldRow("업무 구분", worktypeValueHtml, worktypeValueHtml)}
        ${!edit ? fieldRow("재직 상태", isResigned ? `퇴사 · ${esc(agent.resignDate || "")}` : (scheduledResign ? `근무중(퇴사예정 · ${esc(agent.resignDate)})` : "근무중"), "") : ""}
      </div>
    `;

    return `
      <div class="card agent-popover">
        <div class="agent-popover-top">
          <div class="agent-popover-avatar" style="background:${agentAvatarColor(agent.id)}">${esc(agentInitials(agent.name))}</div>
          ${topHtml}
          ${badgesHtml}
        </div>
        ${actionsHtml}
        ${infoHtml}
        ${renderAgentPopoverInterviewSection(agent)}
      </div>
    `;
  }

  // 팝오버(수정 화면 없이 바로 카드에서 처리 가능한 항목들만): 이름·LDAP·사번·입사일·연락처·시간대·
  // 업무구분·주야간·관리자 여부. 재직 상태(퇴사일자)는 스케줄 자동 반영 로직이 얽혀 있어 기존
  // toggleAgentStatus()(뱃지 클릭)와 상세 수정 폼 쪽 로직을 그대로 쓰고, 여기서는 건드리지 않는다.
  function attachAgentPopoverEvents(root, agent) {
    const pop = root.querySelector(".agent-popover");
    if (!pop) return;
    pop.querySelectorAll("[data-pv-act]").forEach((btn) => {
      btn.onclick = () => {
        const act = btn.getAttribute("data-pv-act");
        if (act === "close") {
          agentsUi.popoverOpen = false;
          agentsUi.popoverEdit = false;
          agentsUi.popoverEditGroup = null;
          agentsUi.popoverEditAdmin = null;
          agentsUi.popoverEditWorkTypes = null;
          closeAgentFieldDropdown();
          renderApp();
        } else if (act === "edit") {
          agentsUi.popoverEdit = true;
          agentsUi.popoverEditGroup = agent.group;
          agentsUi.popoverEditAdmin = !!agent.isAdmin;
          agentsUi.popoverEditWorkTypes = (agent.workTypes || []).slice();
          renderApp();
        } else if (act === "cancel") {
          agentsUi.popoverEdit = false;
          agentsUi.popoverEditGroup = null;
          agentsUi.popoverEditAdmin = null;
          agentsUi.popoverEditWorkTypes = null;
          closeAgentFieldDropdown();
          renderApp();
        } else if (act === "pin") {
          togglePinAgent(agent.id);
        } else if (act === "del") {
          if (window.confirm("이 상담사 정보를 삭제할까요?")) {
            deleteAgent(agent.id);
            renderApp();
          }
        } else if (act === "qa") {
          // 팝오버 안에 이미 요약 QA 점수(agent-popover-qa-grid)가 있으니, 여기서는 더 자세히
          // 볼 수 있는 품질 관리 화면으로 이동한다(이 상담사가 있는 달로 맞춰서 강조 표시).
          if (agent.isAdmin) { flashAgentStatus("관리자는 QA 대상이 아니에요"); return; }
          qaUi.year = today.getFullYear();
          qaUi.monthIndex = today.getMonth();
          qaHighlightAgentId = agent.id;
          setPage("qa");
        } else if (act === "save") {
          const name = document.getElementById("pv-name").value.trim();
          const ldap = document.getElementById("pv-ldap").value.trim();
          if (!name || !ldap) { flashAgentStatus("이름과 LDAP은 필수예요"); return; }
          const empNo = document.getElementById("pv-empno").value.trim();
          const hireDate = document.getElementById("pv-hiredate").value.trim();
          const contact = document.getElementById("pv-contact").value.trim();
          const timezone = document.getElementById("pv-timezone").value.trim();
          const workTypes = agentsUi.popoverEditWorkTypes || (agent.workTypes || []).slice();
          const isAdmin = agentsUi.popoverEditAdmin != null ? agentsUi.popoverEditAdmin : !!agent.isAdmin;
          const group = agentsUi.popoverEditGroup || agent.group || "day";
          updateAgent(agent.id, { name, ldap, empNo, hireDate, contact, timezone, workTypes, isAdmin, group });
          agentsUi.popoverEdit = false;
          agentsUi.popoverEditGroup = null;
          agentsUi.popoverEditAdmin = null;
          agentsUi.popoverEditWorkTypes = null;
          closeAgentFieldDropdown();
          renderApp();
        }
      };
    });
    if (agentsUi.popoverEdit) {
      const roleBadgeBtn = pop.querySelector("#pv-role-badge");
      if (roleBadgeBtn) roleBadgeBtn.onclick = (e) => { e.stopPropagation(); openAgentFieldDropdown(roleBadgeBtn, "role", agent, pop); };
      const groupBadgeBtn = pop.querySelector("#pv-group-badge");
      if (groupBadgeBtn) groupBadgeBtn.onclick = (e) => { e.stopPropagation(); openAgentFieldDropdown(groupBadgeBtn, "group", agent, pop); };
      const worktypeBadgeBtn = pop.querySelector("#pv-worktype-badge");
      if (worktypeBadgeBtn) worktypeBadgeBtn.onclick = (e) => { e.stopPropagation(); openAgentFieldDropdown(worktypeBadgeBtn, "worktype", agent, pop); };
    }
  }

  // ---- 상담사 팝오버 수정 중, 근무 조/업무 구분/상담사·관리자 배지를 누르면 뜨는
  //      작은 드롭다운(카드 밖 body에 붙는 앵커형 패널). 근무 조·역할은 단일 선택이라
  //      고르면 바로 닫히고, 업무 구분은 여러 개를 고를 수 있어 계속 열려 있는다. ----
  function closeAgentFieldDropdown() {
    const el = document.getElementById("agent-field-dropdown");
    if (el) el.remove();
    document.removeEventListener("mousedown", agentFieldDropdownOutsideHandler, true);
  }
  function agentFieldDropdownOutsideHandler(e) {
    const el = document.getElementById("agent-field-dropdown");
    if (el && !el.contains(e.target)) closeAgentFieldDropdown();
  }
  function openAgentFieldDropdown(anchorEl, field, agent, popRoot) {
    closeAgentFieldDropdown();

    function currentGroup() { return agentsUi.popoverEditGroup || agent.group || "day"; }
    function currentAdmin() { return agentsUi.popoverEditAdmin != null ? agentsUi.popoverEditAdmin : !!agent.isAdmin; }
    function currentTypes() { return agentsUi.popoverEditWorkTypes || (agent.workTypes || []).slice(); }

    function optionRow(value, label, checked) {
      return `<div class="afd-option ${checked ? "checked" : ""}" data-v="${esc(String(value))}"><span class="afd-check">${checked ? "✓" : ""}</span><span class="afd-label">${esc(label)}</span></div>`;
    }
    function renderOptions() {
      if (field === "group") {
        const cur = currentGroup();
        return [["day", "주간"], ["night", "야간"]].map(([v, l]) => optionRow(v, l, cur === v)).join("");
      }
      if (field === "role") {
        const cur = currentAdmin();
        return [["false", "상담사"], ["true", "관리자"]].map(([v, l]) => optionRow(v, l, String(cur) === v)).join("");
      }
      const cur = currentTypes();
      return getAllWorkTypes().map((t) => optionRow(t, t, cur.indexOf(t) !== -1)).join("");
    }

    const panel = document.createElement("div");
    panel.id = "agent-field-dropdown";
    panel.className = "agent-field-dropdown";
    panel.innerHTML = `
      <div class="afd-options">${renderOptions()}</div>
      ${field === "worktype" ? `
        <div class="afd-add-row">
          <input type="text" id="afd-new-type" placeholder="새 업무 구분" maxlength="${WORK_TYPES_MAX_LEN}">
          <button type="button" class="primary-btn" id="afd-add-btn">추가</button>
        </div>
        <div class="afd-add-error" id="afd-add-error"></div>
      ` : ""}
    `;
    document.body.appendChild(panel);

    function reposition() {
      const rect = anchorEl.getBoundingClientRect();
      const top = Math.min(rect.bottom + 6, window.innerHeight - panel.offsetHeight - 8);
      const left = Math.min(rect.left, window.innerWidth - panel.offsetWidth - 8);
      panel.style.top = `${Math.max(8, top)}px`;
      panel.style.left = `${Math.max(8, left)}px`;
    }
    reposition();

    function updateTrigger() {
      if (field === "group") {
        const cur = currentGroup();
        const trigger = popRoot.querySelector("#pv-group-badge");
        if (trigger) trigger.textContent = cur === "night" ? "야간" : "주간";
      } else if (field === "role") {
        const cur = currentAdmin();
        const trigger = popRoot.querySelector("#pv-role-badge");
        if (trigger) {
          trigger.className = `badge agent-role-badge ${cur ? "admin" : "staff"}`;
          trigger.innerHTML = `${cur ? "관리자" : "상담사"}<span class="agent-role-trigger-arrow">▾</span>`;
        }
      } else {
        const cur = currentTypes();
        const trigger = popRoot.querySelector("#pv-worktype-badge");
        if (trigger) trigger.innerHTML = cur.length ? esc(cur.join(", ")) : '<span class="agent-field-empty">-</span>';
      }
    }

    function attachOptionHandlers() {
      panel.querySelectorAll(".afd-option").forEach((row) => {
        row.onclick = () => {
          const v = row.getAttribute("data-v");
          if (field === "group") {
            agentsUi.popoverEditGroup = v;
            updateTrigger();
            closeAgentFieldDropdown();
          } else if (field === "role") {
            agentsUi.popoverEditAdmin = (v === "true");
            updateTrigger();
            closeAgentFieldDropdown();
          } else {
            const list = currentTypes();
            const idx = list.indexOf(v);
            if (idx === -1) list.push(v); else list.splice(idx, 1);
            agentsUi.popoverEditWorkTypes = list;
            updateTrigger();
            row.classList.toggle("checked");
            row.querySelector(".afd-check").textContent = row.classList.contains("checked") ? "✓" : "";
          }
        };
      });
    }
    attachOptionHandlers();

    if (field === "worktype") {
      const input = panel.querySelector("#afd-new-type");
      const errEl = panel.querySelector("#afd-add-error");
      const doAdd = () => {
        const res = addCustomWorkType(input.value);
        if (!res.ok) { errEl.textContent = res.reason; return; }
        errEl.textContent = "";
        input.value = "";
        const added = getAllWorkTypes()[getAllWorkTypes().length - 1];
        const list = currentTypes();
        if (list.indexOf(added) === -1) list.push(added);
        agentsUi.popoverEditWorkTypes = list;
        updateTrigger();
        panel.querySelector(".afd-options").innerHTML = renderOptions();
        attachOptionHandlers();
        reposition();
      };
      panel.querySelector("#afd-add-btn").onclick = doAdd;
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); doAdd(); } });
    }

    setTimeout(() => document.addEventListener("mousedown", agentFieldDropdownOutsideHandler, true), 0);
  }

  function renderAgentsPage(root) {
    const selected = agentsData.find((a) => a.id === agentsUi.selectedId) || null;

    const filtered = agentsData.filter((a) => agentMatchesSearch(a, agentsUi.searchQuery) && agentMatchesFilter(a, agentsUi.filterTypes));
    const pinnedAgents = sortAgentList(filtered.filter((a) => a.pinned), agentsUi.sortBy);
    const listAgents = sortAgentList(filtered.filter((a) => !a.pinned), agentsUi.sortBy);
    const draggable = agentsUi.sortBy === "custom";

    const totalCount = agentsData.length;
    const resignedCount = agentsData.filter((a) => a.status === "RESIGNED").length;
    const workingCount = totalCount - resignedCount;
    const nonAdminAgents = agentsData.filter((a) => !a.isAdmin);
    const adminCount = agentsData.filter((a) => a.isAdmin).length;
    const voiceCount = nonAdminAgents.filter((a) => (a.workTypes || []).indexOf("유선") !== -1).length;
    const chatCount = nonAdminAgents.filter((a) => (a.workTypes || []).indexOf("채팅") !== -1).length;
    const dayCount = nonAdminAgents.filter((a) => a.group !== "night").length;
    const nightCount = nonAdminAgents.filter((a) => a.group === "night").length;
    const pinnedCount = agentsData.filter((a) => a.pinned).length;
    const needCount = agentsData.filter((a) => agentNeedsInterview(a)).length;

    const summaryHtml = `<div class="agent-summary">전체 ${totalCount}명 · 재직 ${workingCount}명 · 퇴사 ${resignedCount}명 · 면담 필요 ${needCount}명 · 관리자 ${adminCount}명 · 유선 ${voiceCount}명 · 채팅 ${chatCount}명 · 주간 ${dayCount}명 · 야간 ${nightCount}명 · 고정 ${pinnedCount}명${customWorkTypes.map((t) => ` · ${esc(t)} ${nonAdminAgents.filter((a) => (a.workTypes || []).indexOf(t) !== -1).length}명`).join("")}</div>`;

    const controlsHtml = `
      <div class="agent-controls">
        <div class="agent-filter-row agent-filter-row-single">
          <button type="button" class="agent-filter-btn ${agentsUi.filterTypes.size === 0 ? "active" : ""}" data-filter="all">전체</button>
          <button type="button" class="agent-filter-btn ${agentsUi.filterTypes.has("chat") ? "active" : ""}" data-filter="chat">채팅</button>
          <button type="button" class="agent-filter-btn ${agentsUi.filterTypes.has("voice") ? "active" : ""}" data-filter="voice">유선</button>
          <button type="button" class="agent-filter-btn ${agentsUi.filterTypes.has("day") ? "active" : ""}" data-filter="day">주간</button>
          <button type="button" class="agent-filter-btn ${agentsUi.filterTypes.has("night") ? "active" : ""}" data-filter="night">야간</button>
          <button type="button" class="agent-filter-btn ${agentsUi.filterTypes.has("working") ? "active" : ""}" data-filter="working">재직</button>
          <button type="button" class="agent-filter-btn ${agentsUi.filterTypes.has("resigned") ? "active" : ""}" data-filter="resigned">퇴사</button>
          <button type="button" class="agent-filter-btn ${agentsUi.filterTypes.has("other") ? "active" : ""}" data-filter="other">기타</button>
        </div>
        <div class="agent-search-row">
          <div class="agent-search-input">
            <input type="text" class="agent-search-input-field" id="agent-search-input" placeholder="이름 · LDAP · 초성 검색" value="${esc(agentsUi.searchQuery)}" autocomplete="off">
            ${ICON_SEARCH_MINI}
          </div>
          <select class="agent-sort-select" id="agent-sort-select" data-trigger-class="agent-sort-select">
            <option value="shift" ${agentsUi.sortBy === "shift" ? "selected" : ""}>기본순</option>
            <option value="custom" ${agentsUi.sortBy === "custom" ? "selected" : ""}>사용자 지정</option>
            <option value="name" ${agentsUi.sortBy === "name" ? "selected" : ""}>이름순</option>
            <option value="type" ${agentsUi.sortBy === "type" ? "selected" : ""}>업무구분별</option>
            <option value="chat" ${agentsUi.sortBy === "chat" ? "selected" : ""}>채팅순</option>
            <option value="night" ${agentsUi.sortBy === "night" ? "selected" : ""}>야간순</option>
            <option value="created" ${agentsUi.sortBy === "created" ? "selected" : ""}>등록순</option>
          </select>
        </div>
      </div>
    `;

    const { areaHtml: listAreaHtml, paginationHtml: listPaginationHtml } = buildAgentListAreaHtml(pinnedAgents, listAgents, filtered, pinnedCount, draggable);

    let rightHtml;
    if (agentsUi.topTab === "all") {
      // 실제 면담일지 페이지를 상담사 관리 영역에 그대로 렌더링한다.
      rightHtml = `<div class="agent-embedded-page" id="agent-interviews-embedded"></div>`;
    } else if (agentsUi.topTab === "qa-all") {
      // 실제 QA 점수 페이지를 상담사 관리 영역에 그대로 렌더링한다.
      rightHtml = `<div class="agent-embedded-page agent-qa-embedded-page" id="agent-qa-embedded"></div>`;
    } else if (agentsUi.mode === "add") {
      rightHtml = renderAgentForm(null);
    } else if (agentsUi.mode === "edit") {
      const editing = agentsData.find((a) => a.id === agentsUi.editingId) || null;
      rightHtml = renderAgentForm(editing);
    } else if (selected) {
      // "OOO님의 면담일지"(헤더 버튼·필터·검색·상세 행 전부)는 이제 왼쪽 팝오버 쪽
      // (js/06-interviews.js의 renderAgentInterviewListPopover, 내용은 renderAgentInterviewMain 그대로 재사용)으로
      // 옮겨갔으므로, 오른쪽 큰 패널은 더 이상 같은 내용을 중복해서 그리지 않고 안내 문구만 보여준다.
      rightHtml = `<div class="agent-detail-empty">${esc(selected.name)}님의 면담일지는<br>왼쪽 팝오버에서 확인할 수 있어요.</div>`;
    } else {
      rightHtml = `<div class="agent-detail-empty">왼쪽 목록에서 상담사를 선택하면<br>상세 정보를 볼 수 있어요.</div>`;
    }

    // 팝오버(사이드바 옆 요약 카드)는 "보기" 모드에서, 상담사가 선택되어 있고 열려 있을 때만 보여준다.
    // 추가/수정 큰 폼이 오른쪽에 떠 있는 동안에는 겹치지 않도록 숨긴다.
    // "전체 면담일지"에서는 상담사 선택 팝오버를 완전히 닫고 실제 면담일지 페이지를 보여준다.
    // 탭을 다시 "상담사"로 돌아와도 사용자가 직접 상담사를 눌러야 팝오버가 열리도록 한다.
    const showPopover = !!selected && agentsUi.popoverOpen && agentsUi.mode === "view" && agentsUi.topTab === "agents";
    const popoverHtml = showPopover ? renderAgentPopover(selected) : "";
    // "상담사" 탭이 눌려 있을 때만: 정보 팝오버 옆에 같은 팝오버 형식으로
    // 선택한 상담사의 면담일지 목록을 띄운다(남은 공간의 절반 사용).
    const showIvPopover = showPopover && agentsUi.topTab === "agents";
    const ivPopoverHtml = showIvPopover ? renderAgentInterviewListPopover(selected) : "";
    // 면담일지 팝오버 옆, 카드+면담일지를 제외한 "남은 여백"에 QA 점수 팝오버를 띄운다
    // (같은 조건: "상담사" 탭이고 면담일지 팝오버가 뜬 상태일 때만, 그 옆에 자리가 있으므로).
    const showQaPopover = showIvPopover;
    const qaPopoverHtml = showQaPopover ? renderAgentQaPopover(selected) : "";

    // 사이드바 옆 상단의 보기 전환 세그먼트.
    // "전체 면담일지"는 독립 면담일지 페이지(renderInterviewsPage)를 이 영역에 그대로 이식한다.
    const topbarHtml = `
      <div class="agent-topbar">
        <div class="agent-view-seg" id="agent-view-seg">
          <button type="button" class="agent-view-seg-btn ${agentsUi.topTab === "agents" ? "on" : ""}" data-view="agents">상담사</button>
          <button type="button" class="agent-view-seg-btn ${agentsUi.topTab === "all" ? "on" : ""}" data-view="all">전체 면담일지</button>
          <button type="button" class="agent-view-seg-btn ${agentsUi.topTab === "qa-all" ? "on" : ""}" data-view="qa-all">전체 QA 점수</button>
        </div>
      </div>
    `;

    if (root._agentPopoverResponsiveCleanup) {
      root._agentPopoverResponsiveCleanup();
      root._agentPopoverResponsiveCleanup = null;
    }

    root.innerHTML = `
      <div class="agent-shell ${showPopover ? "has-popover" : ""} ${showIvPopover ? "has-iv-popover" : ""} ${showQaPopover ? "has-qa-popover" : ""} ${agentsUi.topTab === "all" ? "agent-top-tab-all" : agentsUi.topTab === "qa-all" ? "agent-top-tab-qa-all" : "agent-top-tab-agents"}">
        <div class="card agent-list-card agent-sidebar">
          <div class="agent-sidebar-header">
            <div class="agent-sidebar-title">상담사</div>
            <button class="agent-add-btn" id="btn-agent-add">＋ 상담사 추가</button>
          </div>
          <div class="status" id="agent-status"></div>
          ${agentsData.length > 0 ? summaryHtml : ""}
          ${agentsData.length > 0 ? controlsHtml : ""}
          <div id="agent-list-area">${listAreaHtml}</div>
          <div id="agent-list-pagination">${listPaginationHtml}</div>
        </div>
        ${topbarHtml}
        ${popoverHtml}
        ${ivPopoverHtml}
        ${qaPopoverHtml}
        <div class="card agent-detail-card">
          ${rightHtml}
        </div>
      </div>
    `;

    attachAgentEvents(root);
    if (showPopover) attachAgentPopoverEvents(root, selected);
    if (showIvPopover) attachAgentInterviewListPopoverEvents(root, selected);
    if (showQaPopover) attachAgentQaPopoverEvents(root, selected);

    // 상담사 상세 팝오버는 바탕화면(앱 창) 가로폭의 절반을 기준으로 자동 배치한다.
    // 창이 절반 이하로 줄어들면 면담일지/QA를 세로로 쌓고, 다시 절반보다 넓어지면 가로로 복귀한다.
    const agentShell = root.querySelector(".agent-shell");
    if (agentShell) {
      const syncAgentPopoverLayout = () => {
        const shellWidth = agentShell.getBoundingClientRect().width;
        const useVertical = shellWidth <= (window.innerWidth * 0.5);
        // 전체 면담일지/전체 QA 점수는 "상담사 관리 창이 바탕화면의 절반 이하"가
        // 되는 순간에도 실제 페이지를 숨기지 않고 창 전체를 사용해야 한다.
        // 기존의 고정 760px 기준은 화면/앱 창 크기에 따라 절반 이하인데도
        // compact 클래스가 붙지 않는 구간을 만들었다.
        const isWholePage = agentsUi.topTab === "all" || agentsUi.topTab === "qa-all";
        const useCompactWholePage = useVertical && isWholePage;
        agentShell.classList.toggle("agent-popovers-vertical", useVertical);
        agentShell.classList.toggle("agent-whole-page-compact", useCompactWholePage);
      };
      const resizeObserver = typeof ResizeObserver === "function" ? new ResizeObserver(syncAgentPopoverLayout) : null;
      if (resizeObserver) resizeObserver.observe(agentShell);
      window.addEventListener("resize", syncAgentPopoverLayout);
      syncAgentPopoverLayout();
      root._agentPopoverResponsiveCleanup = () => {
        if (resizeObserver) resizeObserver.disconnect();
        window.removeEventListener("resize", syncAgentPopoverLayout);
      };
    }

    // 전체 면담일지 탭에서는 독립 면담일지 페이지와 동일한 렌더러를 사용한다.
    // 팝오버/상담사 상세 DOM을 재사용하지 않으므로 실제 면담일지의 헤더·필터·검색·
    // 추가/수정·페이지네이션·행 펼침/다운로드 등의 동작도 그대로 유지된다.
    if (agentsUi.topTab === "all") {
      const interviewRoot = document.getElementById("agent-interviews-embedded");
      if (interviewRoot && typeof renderInterviewsPage === "function") {
        renderInterviewsPage(interviewRoot);
      }
    } else if (agentsUi.topTab === "qa-all") {
      const qaRoot = document.getElementById("agent-qa-embedded");
      if (qaRoot && typeof renderQAPage === "function") {
        renderQAPage(qaRoot);
      }
    }

    // 사이드바가 실제로 차지하는 높이를 재서 페이지당 개수를 맞추고,
    // 이후 창 크기가 바뀔 때마다도 다시 맞추도록 관찰을 새로 건다
    // (root.innerHTML을 통째로 새로 그렸으므로 #agent-list-area도 매번 새 DOM 노드).
    watchAgentListSize();
    measureAndSyncAgentPageSize();
    enforceAgentListFit();
    // 커스텀 웹폰트(KoPub 돋움체)가 이 시점엔 아직 로드 중이면, fallback 폰트
    // 기준으로 행 높이를 재서 페이지 크기를 정하게 된다. 폰트가 실제로 적용되고
    // 나면 줄 높이가 달라질 수 있는데, 이때는 #agent-list-area 자신의 박스
    // 크기는 그대로라 ResizeObserver가 반응하지 않아 스크롤이 생겨도 못 잡아냈다.
    // 폰트 로드가 끝나는 시점에 한 번 더 재계산 + 실측 보정한다.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        measureAndSyncAgentPageSize();
        enforceAgentListFit();
      });
    }
  }

  function attachAgentDragHandlers(root) {
    let dragState = null; // { id, section }
    root.querySelectorAll(".agent-row").forEach((row) => {
      if (row.getAttribute("draggable") !== "true") return;
      const id = row.getAttribute("data-agent-id");
      const section = row.getAttribute("data-agent-section");
      row.addEventListener("dragstart", (e) => {
        dragState = { id, section };
        row.classList.add("dragging");
        try { e.dataTransfer.effectAllowed = "move"; } catch (err) {}
      });
      row.addEventListener("dragend", () => {
        row.classList.remove("dragging");
        dragState = null;
        root.querySelectorAll(".agent-row").forEach((r) => r.classList.remove("drag-over"));
      });
      row.addEventListener("dragover", (e) => {
        if (!dragState || dragState.id === id || dragState.section !== section) return;
        e.preventDefault();
        row.classList.add("drag-over");
      });
      row.addEventListener("dragleave", () => row.classList.remove("drag-over"));
      row.addEventListener("drop", (e) => {
        e.preventDefault();
        row.classList.remove("drag-over");
        if (!dragState || dragState.id === id || dragState.section !== section) return;
        reorderAgents(dragState.id, id);
        renderApp();
      });
    });
  }

  function attachAgentEvents(root) {
    const addBtn = document.getElementById("btn-agent-add");
    if (addBtn) {
      addBtn.onclick = () => {
        agentsUi.mode = "add";
        agentsUi.editingId = null;
        renderApp();
        setTimeout(() => { const el = document.getElementById("agent-input-name"); if (el) el.focus(); }, 0);
      };
    }

    const viewSeg = document.getElementById("agent-view-seg");
    if (viewSeg) {
      viewSeg.querySelectorAll("[data-view]").forEach((btn) => {
        btn.onclick = () => {
          const v = btn.getAttribute("data-view");
          if (agentsUi.topTab === v) return;

          agentsUi.topTab = v;

          // 전체 면담일지로 이동하는 순간 기존 상담사 팝오버를 닫는다.
          // 다시 상담사 탭으로 돌아왔을 때도 자동으로 팝오버가 재등장하지 않는다.
          if (v === "all" || v === "qa-all") {
            agentsUi.popoverOpen = false;
            agentsUi.popoverEdit = false;
            agentsUi.popoverEditGroup = null;
            agentsUi.popoverEditAdmin = null;
            agentsUi.popoverEditWorkTypes = null;
            agentsUi.interviewMode = "list";
            agentsUi.interviewEditingId = null;
          }

          // 실제 페이지 전체를 다시 렌더링하여 탭 전환과 레이아웃을 동시에 반영한다.
          renderApp();
        };
      });
    }

    attachAgentListAreaHandlers(root);

    const searchInput = document.getElementById("agent-search-input");
    if (searchInput) {
      // 목록 영역(#agent-list-area)만 갱신하고 검색창 자체는 다시 그리지 않음.
      // - 검색창 DOM이 그대로 유지되므로 한글 조합(IME) 중에도 입력이 끊기지 않음.
      // - 매 입력마다 목록 영역을 갱신하므로 검색 결과가 타이핑 즉시 반영됨.
      searchInput.oninput = (e) => {
        agentsUi.searchQuery = e.target.value;
        agentsUi.page = 1;
        updateAgentListArea();
      };
    }
    root.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.onclick = () => {
        const key = btn.getAttribute("data-filter");
        if (key === "all") {
          agentsUi.filterTypes.clear();
        } else if (agentsUi.filterTypes.has(key)) {
          agentsUi.filterTypes.delete(key);
        } else {
          agentsUi.filterTypes.add(key);
        }
        agentsUi.page = 1;
        renderApp();
      };
    });
    const sortSelect = document.getElementById("agent-sort-select");
    if (sortSelect) {
      enhanceSelect(sortSelect);
      sortSelect.onchange = (e) => {
        agentsUi.sortBy = e.target.value;
        agentsUi.page = 1;
        renderApp();
      };
    }
    root.querySelectorAll("[data-action='edit-agent']").forEach((btn) => {
      btn.onclick = () => {
        agentsUi.mode = "edit";
        agentsUi.editingId = btn.getAttribute("data-id");
        renderApp();
      };
    });
    root.querySelectorAll("[data-action='delete-agent']").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-id");
        if (window.confirm("이 상담사 정보를 삭제할까요?")) {
          deleteAgent(id);
          renderApp();
        }
      };
    });

    const form = document.getElementById("agent-form");
    if (form) {
      const worktypeManageBtn = document.getElementById("agent-worktype-manage-btn");
      // 관리 모달에서 추가/삭제가 일어나면 renderApp()으로 폼을 다시 그려서
      // 방금 추가한 업무 구분 체크박스가 바로 나타나게 한다. 단, 입력 중이던
      // 이름/사번 등 다른 값은 폼을 새로 그리며 날아가므로, 다시 그리기 전에
      // 지금까지 고른 업무 구분만 v.workTypes에 반영해 모달을 열기 전 상태를 최대한 살린다.
      if (worktypeManageBtn) {
        worktypeManageBtn.onclick = () => {
          openWorkTypesModal(() => renderApp());
        };
      }
      enhanceDateInput(document.getElementById("agent-input-hiredate"));
      const resignDateInput = document.getElementById("agent-input-resigndate");
      if (resignDateInput) enhanceDateInput(resignDateInput);
      // 재직 상태 라디오에 따라 퇴사일자 입력칸을 보이거나 숨긴다. "퇴사"로 바꿨는데
      // 아직 날짜가 비어있으면 오늘 날짜를 기본값으로 채워준다.
      const resignWrap = document.getElementById("agent-resigndate-wrap");
      const statusWorkingRadio = document.getElementById("agent-input-status-working");
      const statusResignedRadio = document.getElementById("agent-input-status-resigned");
      const syncResignWrapVisibility = () => {
        if (!resignWrap) return;
        const isResigned = !!(statusResignedRadio && statusResignedRadio.checked);
        resignWrap.style.display = isResigned ? "" : "none";
        if (isResigned && resignDateInput && !resignDateInput.value) {
          resignDateInput.value = agentTodayStr();
        }
      };
      if (statusWorkingRadio) statusWorkingRadio.onchange = syncResignWrapVisibility;
      if (statusResignedRadio) statusResignedRadio.onchange = syncResignWrapVisibility;

      form.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById("agent-input-name").value.trim();
        const ldap = document.getElementById("agent-input-ldap").value.trim();
        if (!name || !ldap) return;
        const empNo = document.getElementById("agent-input-empno").value.trim();
        const hireDate = document.getElementById("agent-input-hiredate").value.trim();
        const contact = document.getElementById("agent-input-contact").value.trim();
        const timezone = document.getElementById("agent-input-timezone").value.trim();
        const workTypes = [];
        if (document.getElementById("agent-input-voice").checked) workTypes.push("유선");
        if (document.getElementById("agent-input-chat").checked) workTypes.push("채팅");
        form.querySelectorAll(".agent-input-custom-type:checked").forEach((el) => workTypes.push(el.getAttribute("data-worktype")));
        const group = document.getElementById("agent-input-group-night").checked ? "night" : "day";
        const isAdmin = document.getElementById("agent-input-admin").checked;
        const selectedResigned = document.getElementById("agent-input-status-resigned").checked;
        let resignDate = null;
        if (selectedResigned) {
          const rawResignDate = resignDateInput ? resignDateInput.value.trim() : "";
          resignDate = rawResignDate || agentTodayStr();
        }
        // 퇴사일자가 오늘 이전(또는 오늘)이면 바로 "퇴사"로 저장하지만, 미래 날짜면
        // 그 날짜가 될 때까지 재직 상태는 "근무중"으로 남아있다가 그 날 자동으로
        // "퇴사"로 바뀐다(autoFlipResignedAgents). 월별 스케줄 자동 반영 여부는
        // 이 저장 상태(status)가 아니라 아래에서 selectedResigned로 따로 판단하므로,
        // 미래 날짜를 입력해도 스케줄에는 지금 바로 반영된다.
        const status = (selectedResigned && !(resignDate && resignDate > agentTodayStr())) ? "RESIGNED" : "WORKING";
        const values = { name, ldap, empNo, hireDate, contact, workTypes, timezone, group, isAdmin, status, resignDate };

        const prevAgent = (agentsUi.mode === "edit" && agentsUi.editingId)
          ? agentsData.find((a) => a.id === agentsUi.editingId)
          : null;
        const prevResigning = !!(prevAgent && prevAgent.resignDate);
        const prevResignDate = prevAgent ? prevAgent.resignDate : null;

        let targetId;
        if (agentsUi.mode === "edit" && agentsUi.editingId) {
          updateAgent(agentsUi.editingId, values);
          agentsUi.selectedId = agentsUi.editingId;
          targetId = agentsUi.editingId;
        } else {
          targetId = addAgent(values);
          agentsUi.selectedId = targetId;
        }

        // 재직 상태/퇴사일자가 실제로 바뀐 경우에만 월별 스케줄의 자동 "퇴사" 반영을
        // 다시 계산한다. 퇴사일자를 고쳤을 때는 예전 날짜로 채워둔 칸을 먼저 지우고
        // 새 날짜로 다시 채운다. (퇴사일자가 미래라 재직 상태 자체는 아직 "근무중"으로
        // 남아있는 경우에도, 스케줄에는 선택한 날짜를 그대로 바로 반영한다)
        if (selectedResigned && (!prevResigning || prevResignDate !== resignDate)) {
          if (prevResigning && prevResignDate && typeof clearResignedScheduleFrom === "function") {
            clearResignedScheduleFrom(targetId, prevResignDate);
          }
          if (typeof applyResignedScheduleFrom === "function") applyResignedScheduleFrom(targetId, resignDate);
        } else if (!selectedResigned && prevResigning && prevResignDate) {
          if (typeof clearResignedScheduleFrom === "function") clearResignedScheduleFrom(targetId, prevResignDate);
        }

        agentsUi.mode = "view";
        agentsUi.editingId = null;
        renderApp();
      };
      const cancelBtn = document.getElementById("agent-form-cancel");
      if (cancelBtn) {
        cancelBtn.onclick = () => {
          agentsUi.mode = "view";
          agentsUi.editingId = null;
          renderApp();
        };
      }
    }

    // "OOO님의 면담일지" 내용이 이제 왼쪽 팝오버 하나에만 있으므로, 그 이벤트는 위의
    // attachAgentInterviewListPopoverEvents(showIvPopover일 때)에서만 바인딩하면 충분하다.

    attachAgentDragHandlers(root);
  }

  /* ===================== 품질 관리(QA) 모듈 ===================== */
  const QA_KEY = acctKey("personal-qa:data");

