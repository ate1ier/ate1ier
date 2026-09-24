  // ==================== 상태표시줄 시계 → "오늘의 브리핑" 사이드바 ====================
  // macOS 목업(ate1ier-macos-mockup)의 메뉴바 날짜·시간(#ck)을 누르면 우측에서 열리던
  // 알림 센터(#nc)를 실제로 동작하게 만든 것. 목업은 더미 데이터였지만, 여기서는 홈 화면
  // 로그인 직후 뜨는 "오늘의 브리핑" 토스트(js/08-home.js)와 완전히 같은 실제 데이터
  // (computeTodayBrief())를 써서 근무 현황·오늘 일정·면담 필요·고정 메모·오늘 할 일을 보여준다.
  // 드롭다운 열고 닫는 방식(바깥 클릭/Esc로 닫기)은 계정 메뉴(js/01n-status-bar-account.js)와
  // 동일한 패턴을 따른다.

  const BRIEFING_CLOCK_TICK_MS = 15000; // 분 단위 표시라 15초마다면 충분

  function briefingClockText(d) {
    const opts = { month: "long", day: "numeric", weekday: "long", hour: "numeric", minute: "2-digit" };
    return d.toLocaleString("ko-KR", opts);
  }

  let briefingClockTimer = null;
  function startBriefingClock() {
    const btn = document.getElementById("status-bar-clock-btn");
    if (!btn) return;
    const tick = () => { btn.textContent = briefingClockText(new Date()); };
    tick();
    // 화면을 돌리거나 창 크기를 바꿔 좁은/넓은 표기가 바뀌면 15초를 기다리지 않고 바로 갱신한다.
    window.addEventListener("resize", tick);
    if (briefingClockTimer) clearInterval(briefingClockTimer);
    briefingClockTimer = setInterval(tick, BRIEFING_CLOCK_TICK_MS);
  }

  // macOS 목업(ate1ier-macos-mockup)의 앱 아이콘 정의(const A=[...])와 완전히 같은
  // 그라데이션 색상 · path 데이터를 그대로 옮겨왔다(스케줄=청록, 캘린더=코랄, 면담=보라,
  // 메모=노랑). 목업의 ico() 함수처럼 흰색 stroke 아이콘을 그라데이션 사각 뱃지 위에 얹는다.
  const BRIEFING_ICON_DEFS = {
    schedule: { g1: "#22d3ee", g2: "#0891b2", d: "M3 5h18v14H3zM3 10h18M3 15h18M9 5v14M15 5v14" },
    calendar: { g1: "#ff7a7a", g2: "#e11d48", d: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" },
    interviews: { g1: "#a78bfa", g2: "#6d28d9", d: "M4 5h16v11H9l-5 4z" },
    notes: { g1: "#fde047", g2: "#f59e0b", d: "M6 3h9l3 3v15H6zM9 10h6M9 14h6M9 18h4" },
  };
  function briefingIconBadgeHtml(navKey) {
    const def = BRIEFING_ICON_DEFS[navKey];
    return `<span class="briefing-row-icon" style="background:linear-gradient(160deg,${def.g1},${def.g2})">
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${def.d}"/></svg>
    </span>`;
  }

  function briefingRowHtml(item) {
    return `
      <button type="button" class="briefing-row ${item.warn ? "warn" : ""}" data-briefing-nav="${item.nav}">
        ${briefingIconBadgeHtml(item.nav)}
        <span class="briefing-row-text">
          <b>${esc(item.title)}</b>
          <span>${esc(item.sub)}</span>
        </span>
      </button>`;
  }

  function briefingTodoRowHtml(t, iso) {
    const isOver = t.due && t.due < iso;
    return `
      <div class="briefing-todo-row">
        <button type="button" class="check-btn" data-briefing-todo-toggle="${t.id}" aria-label="완료 표시"></button>
        <span>${esc(t.text)}</span>
        ${t.due ? `<span class="due ${isOver ? "over" : ""}">${formatTodoDue(t.due)}${isOver ? " · 지남" : " · 오늘"}</span>` : ""}
      </div>`;
  }

  // computeTodayBrief()의 실제 수치를 목업(#nc)과 같은 알림 카드 4개(근무·일정·면담·메모)
  // 형식의 문구로 채운다.
  function briefingContentHtml() {
    const brief = computeTodayBrief();
    const iso = todayISO();

    const items = [
      {
        nav: "schedule",
        title: `오늘 근무 ${brief.working.length}명`,
        sub: (brief.lateList.length || brief.absentList.length)
          ? `지각 ${brief.lateList.length}명 · 결근 ${brief.absentList.length}명 확인해주세요`
          : "지각·결근 없이 모두 정상 출근했어요",
        warn: brief.lateList.length > 0 || brief.absentList.length > 0,
      },
      {
        nav: "calendar",
        title: `오늘 일정 ${brief.todayEntries.length}건`,
        sub: brief.todayEntries.length ? brief.todayEntries[0].text : "등록된 일정이 없어요",
        warn: false,
      },
      {
        nav: "interviews",
        title: `면담 필요 상담사 ${brief.staleInterviewAgents.length}명`,
        sub: brief.staleInterviewAgents.length ? "최근 3주간 면담 기록이 없어요" : "모두 최근에 면담을 진행했어요",
        warn: brief.staleInterviewAgents.length > 0,
      },
      {
        nav: "notes",
        title: `고정 메모 ${brief.pinnedNotes.length}개`,
        sub: brief.pinnedNotes.length ? brief.pinnedNotes[0].title : "고정된 메모가 없어요",
        warn: false,
      },
    ];

    const remaining = brief.todoRelevant.length;
    const todoListHtml = remaining === 0
      ? `<div class="briefing-empty">오늘까지 마감인 할 일이 없어요.</div>`
      : `<div class="briefing-todo-list">${brief.todoRelevant.slice(0, 8).map((t) => briefingTodoRowHtml(t, iso)).join("")}</div>`;

    return `
      <div class="briefing-head">
        <b>오늘의 브리핑</b>
        <small>${brief.m + 1}월 ${brief.d}일 ${brief.wd}요일${brief.holiday ? ` · ${esc(brief.holiday)}` : ""}</small>
      </div>
      <div class="briefing-body">
        ${items.map(briefingRowHtml).join("")}
        <div class="briefing-group-head"><span>오늘 할 일</span><span>${remaining}개 남음</span></div>
        ${todoListHtml}
      </div>
    `;
  }

  function renderBriefingSidebar() {
    const panel = document.getElementById("briefing-sidebar");
    if (!panel) return;
    panel.innerHTML = briefingContentHtml();
    panel.querySelectorAll("[data-briefing-nav]").forEach((btn) => {
      btn.onclick = () => {
        const nav = btn.getAttribute("data-briefing-nav");
        closeBriefingSidebar();
        setPage(nav);
      };
    });
    // 사이드바 안에서 바로 할 일을 체크할 수 있게 — 토글 후 다시 그려서 목록에서 사라지게 한다.
    panel.querySelectorAll("[data-briefing-todo-toggle]").forEach((btn) => {
      btn.onclick = () => {
        toggleTodoDone(btn.getAttribute("data-briefing-todo-toggle"));
        renderBriefingSidebar();
      };
    });
  }

  function briefingSidebarOutsideHandler(e) {
    const panel = document.getElementById("briefing-sidebar");
    const btn = document.getElementById("status-bar-clock-btn");
    if (panel && !panel.contains(e.target) && !(btn && btn.contains(e.target))) closeBriefingSidebar();
  }
  function briefingSidebarKeyHandler(e) {
    if (e.key === "Escape") closeBriefingSidebar();
  }
  // ---- 패널을 화면 가장자리(위·오른쪽·아래)에 여백 없이 붙이기 ----
  // 위쪽: 상태표시줄 높이가 고정값(39px)과 조금이라도 다르면 그만큼 틈이 생기므로, 열 때/창 크기가
  //       바뀔 때 실제 상태표시줄 하단 위치를 재서 --briefing-top으로 넣는다.
  // 오른쪽: position: fixed 요소는 브라우저 세로 스크롤바 폭만큼은 창 끝에 닿을 수 없다. 그래서
  //       패널이 열려 있는 동안 스크롤바를 숨기고(html.briefing-open), 그 폭을 css에서 대신 채운다.
  let briefingScrollLockTimer = null;
  function lockBriefingPageScroll() {
    const root = document.documentElement;
    if (briefingScrollLockTimer) { clearTimeout(briefingScrollLockTimer); briefingScrollLockTimer = null; }
    if (root.classList.contains("briefing-open")) return; // 닫히는 중에 다시 열린 경우 — 스크롤바 폭을 다시 재면 0이 나오므로 그대로 둔다
    const scrollbarW = Math.max(0, window.innerWidth - root.clientWidth);
    root.style.setProperty("--briefing-sbw", scrollbarW + "px");
    root.classList.add("briefing-open");
  }
  function unlockBriefingPageScroll() {
    // 슬라이드 아웃 트랜지션(0.34s)이 끝난 뒤에 스크롤바를 되돌려서, 닫히는 동안 패널이 옆으로 튀지 않게 한다.
    if (briefingScrollLockTimer) clearTimeout(briefingScrollLockTimer);
    briefingScrollLockTimer = setTimeout(() => {
      document.documentElement.classList.remove("briefing-open");
      briefingScrollLockTimer = null;
    }, 360);
  }
  function syncBriefingSidebarTop() {
    const panel = document.getElementById("briefing-sidebar");
    const bar = document.getElementById("app-status-bar");
    if (!panel || !bar) return;
    panel.style.setProperty("--briefing-top", Math.max(0, Math.round(bar.getBoundingClientRect().bottom)) + "px");
  }
  window.addEventListener("resize", syncBriefingSidebarTop);

  function closeBriefingSidebar() {
    const panel = document.getElementById("briefing-sidebar");
    const btn = document.getElementById("status-bar-clock-btn");
    if (panel && panel.classList.contains("open")) unlockBriefingPageScroll();
    if (panel) panel.classList.remove("open");
    if (btn) { btn.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    document.removeEventListener("mousedown", briefingSidebarOutsideHandler, true);
    document.removeEventListener("keydown", briefingSidebarKeyHandler);
  }
  function openBriefingSidebar() {
    let panel = document.getElementById("briefing-sidebar");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "briefing-sidebar";
      panel.className = "briefing-sidebar";
      document.body.appendChild(panel);
    }
    renderBriefingSidebar();
    lockBriefingPageScroll();
    syncBriefingSidebarTop();
    // 목업(#nc.on)과 동일하게, 다음 프레임에 .open을 붙여서 슬라이드인 트랜지션이 걸리게 한다.
    requestAnimationFrame(() => panel.classList.add("open"));
    const btn = document.getElementById("status-bar-clock-btn");
    if (btn) { btn.classList.add("open"); btn.setAttribute("aria-expanded", "true"); }
    setTimeout(() => {
      document.addEventListener("mousedown", briefingSidebarOutsideHandler, true);
      document.addEventListener("keydown", briefingSidebarKeyHandler);
    }, 0);
  }
  function toggleBriefingSidebar() {
    const panel = document.getElementById("briefing-sidebar");
    if (panel && panel.classList.contains("open")) closeBriefingSidebar();
    else openBriefingSidebar();
  }

  const statusBarClockBtn = document.getElementById("status-bar-clock-btn");
  if (statusBarClockBtn) {
    startBriefingClock();
    statusBarClockBtn.onclick = (e) => {
      e.stopPropagation();
      toggleBriefingSidebar();
    };
  }
