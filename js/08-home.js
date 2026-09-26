  /* ===================== 홈 위젯 (macOS 목업의 #wg 위젯 스택 그대로) =====================
     마크업 구조·클래스 이름·문구는 ate1ier-macos-mockup의 위젯(WD/wc/rw/td/qaTrend)과 같고,
     목업에서 가짜 데이터가 들어가던 자리에 이 앱의 실제 데이터를 채운다. 생김새는 css/02-home.css.
     카드(위젯) 배치는 계정별로 저장하고, 위젯 제목줄을 잡고 끌어서 순서/열을 바꿀 수 있다.
     계정 데이터라 클라우드 동기화 대상에도 자동으로 포함된다(CLOUD_EXCLUDED_KEYS에 없는 키라서).
     (v2: 기본 배치를 목업과 같게 바꾸면서 저장 키를 새로 만들어, 예전에 저장된 배치는 쓰지 않는다) */
  const HOME_LAYOUT_KEY = acctKey("home:card-layout-v2");
  const HOME_CARD_IDS = ["status", "calendar", "todos", "notes", "interviews", "qa"];
  function defaultHomeLayout() {
    // 목업: [['status'], ['calendar','todos','notes'], ['interviews','qa']]
    return [["status"], ["calendar", "todos", "notes"], ["interviews", "qa"]];
  }
  function loadHomeLayout() {
    try {
      const raw = localStorage.getItem(HOME_LAYOUT_KEY);
      if (!raw) return defaultHomeLayout();
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) return defaultHomeLayout();
      const cleaned = parsed.map((col) => (Array.isArray(col) ? col.filter((id) => HOME_CARD_IDS.includes(id)) : []));
      const flat = cleaned.flat();
      const missing = HOME_CARD_IDS.filter((id) => !flat.includes(id));
      if (missing.length) cleaned[0] = (cleaned[0] || []).concat(missing); // 새로 생긴 카드 종류는 첫 칸에 추가
      while (cleaned.length < 3) cleaned.push([]);
      return cleaned;
    } catch (e) { return defaultHomeLayout(); }
  }
  function saveHomeLayout(layout) {
    try { localStorage.setItem(HOME_LAYOUT_KEY, JSON.stringify(layout)); } catch (e) {}
  }
  // 위젯 제목줄(.wh)을 잡고 끌어서 위치 바꾸기. 살짝 눌렀다 떼는 클릭은 드래그로 치지 않도록 5px 넘게 움직여야 시작한다.
  function bindHomeCardDrag(grid) {
    if (!grid) return;
    grid.querySelectorAll(".wd[data-home-card] > .wh").forEach((handle) => {
      handle.addEventListener("pointerdown", (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        if (e.pointerType === "touch" || e.target.closest("button")) return;
        const card = handle.closest(".wd[data-home-card]");
        if (!card) return;
        const startX = e.clientX, startY = e.clientY;
        const wg = document.getElementById("wg");
        let started = false, placeholder = null, offsetX = 0, offsetY = 0, baseX = 0, baseY = 0;

        function begin() {
          started = true;
          const rect = card.getBoundingClientRect();
          // #wg에 transform(lift)이 걸려 있으면 그 안의 position:fixed는 화면이 아니라 #wg 기준이라, 그만큼 빼준다
          const shifted = wg && getComputedStyle(wg).transform !== "none";
          const wgRect = shifted ? wg.getBoundingClientRect() : { left: 0, top: 0 };
          baseX = wgRect.left; baseY = wgRect.top;
          offsetX = startX - rect.left; offsetY = startY - rect.top;
          placeholder = document.createElement("div");
          placeholder.className = "home-card-placeholder";
          placeholder.style.height = rect.height + "px";
          card.parentNode.insertBefore(placeholder, card.nextSibling);
          card.classList.add("dg");
          Object.assign(card.style, {
            position: "fixed", width: rect.width + "px", left: (rect.left - baseX) + "px", top: (rect.top - baseY) + "px",
          });
          document.body.classList.add("home-card-drag-active");
        }
        function onMove(ev) {
          if (!started) {
            if (Math.hypot(ev.clientX - startX, ev.clientY - startY) < 5) return;
            begin();
          }
          card.style.left = (ev.clientX - offsetX - baseX) + "px";
          card.style.top = (ev.clientY - offsetY - baseY) + "px";
          card.style.pointerEvents = "none";
          const elUnder = document.elementFromPoint(ev.clientX, ev.clientY);
          card.style.pointerEvents = "";
          if (!elUnder) return;
          const overCard = elUnder.closest(".wd[data-home-card]");
          const overCol = elUnder.closest(".col");
          if (overCard && overCard !== card) {
            const rectOver = overCard.getBoundingClientRect();
            const before = (ev.clientY - rectOver.top) < rectOver.height / 2;
            overCard.parentNode.insertBefore(placeholder, before ? overCard : overCard.nextSibling);
          } else if (overCol && !overCard) {
            overCol.appendChild(placeholder);
          }
        }
        function onUp() {
          document.removeEventListener("pointermove", onMove);
          document.removeEventListener("pointerup", onUp);
          document.removeEventListener("pointercancel", onUp);
          if (!started) return;
          document.body.classList.remove("home-card-drag-active");
          placeholder.parentNode.insertBefore(card, placeholder);
          placeholder.remove();
          card.classList.remove("dg");
          Object.assign(card.style, { position: "", width: "", left: "", top: "", pointerEvents: "" });
          const newLayout = Array.from(grid.querySelectorAll(".col")).map((col) =>
            Array.from(col.querySelectorAll(".wd[data-home-card]")).map((c) => c.getAttribute("data-home-card"))
          );
          saveHomeLayout(newLayout);
        }
        document.addEventListener("pointermove", onMove);
        document.addEventListener("pointerup", onUp);
        document.addEventListener("pointercancel", onUp);
      });
    });
  }

  // 목업의 lift(): 위젯 묶음이 세로 가운데에 놓이되, 맨 위(날짜 카드)가 상단 바 아래 기준 간격(44px+상태표시줄 차이 11px+위젯을 아래로 내린 24px = 79px)보다 더 내려가 있으면 그만큼 끌어올린다(최대 100px)
  function homeWidgetLift() {
    const w = document.getElementById("wg");
    if (!w) return;
    const h = w.firstElementChild;
    w.style.transform = "";
    if (window.innerWidth <= 900 || !h) return;
    const t = h.getBoundingClientRect().top;
    w.style.transform = `translateY(${-Math.max(0, Math.min(100, t - 79))}px)`;
  }
  window.addEventListener("resize", homeWidgetLift);
  window.addEventListener("load", homeWidgetLift);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(homeWidgetLift);

  // 목업 qaTrend(): 최근 6개월 전체 평균 꺾은선(340x116). 점수가 없는 달은 점/선을 건너뛴다.
  function homeQaTrendHtml(agentsList, year, monthIndex) {
    const months = qaHomeComputeTrend(agentsList, year, monthIndex, QA_HOME_TREND_MONTHS);
    const vals = months.map((mo) => mo.score).filter((v) => v !== null);
    if (vals.length === 0) return "";
    const W = 340, H = 116, pl = 18, pr = 18, pt = 26, pb = 22, pw = W - pl - pr, ph = H - pt - pb;
    let lo = Math.min(...vals), hi = Math.max(...vals);
    if (lo === hi) { lo -= 5; hi += 5; }
    const pd = (hi - lo) * .2, mn = lo - pd, mx = hi + pd;
    const n = months.length;
    const X = (i) => pl + pw * i / (n - 1);
    const Y = (v) => pt + ph - (v - mn) / (mx - mn) * ph;
    const segs = [];
    let curSeg = [];
    months.forEach((mo, i) => {
      if (mo.score === null) { if (curSeg.length) segs.push(curSeg); curSeg = []; }
      else curSeg.push([X(i), Y(mo.score)]);
    });
    if (curSeg.length) segs.push(curSeg);
    const paths = segs.map((sg) => {
      const d = sg.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
      return `<path d="${d}" fill="none" stroke="var(--ac)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;
    }).join("");
    const dots = months.map((mo, i) => mo.score === null ? "" :
      `<circle cx="${X(i).toFixed(1)}" cy="${Y(mo.score).toFixed(1)}" r="3.3" fill="var(--ac)"/><text x="${X(i).toFixed(1)}" y="${(Y(mo.score) - 9).toFixed(1)}" class="qv">${mo.score.toFixed(1)}</text>`).join("");
    const labels = months.map((mo, i) =>
      `<text x="${X(i).toFixed(1)}" y="${H - 6}" class="qm${i === n - 1 ? " cur" : ""}">${mo.monthIndex + 1}월</text>`).join("");
    return `<div class="qtb"><div class="qtt">최근 ${QA_HOME_TREND_MONTHS}개월 추이</div><svg viewBox="0 0 ${W} ${H}" class="qts">${paths}${dots}${labels}</svg></div>`;
  }

  function renderHomePage(root) {
    const y = today.getFullYear(), m = today.getMonth(), d = today.getDate();
    const iso = todayISO();
    const holiday = getHoliday(iso);
    const wd = WEEKDAYS[today.getDay()];

    // 목업 rw(): 이름 · 보조 글씨 · (빈 칸) · 오른쪽 알약(fl)
    const rw = (name, sub, flag, flagCls) =>
      `<div class="rw"><b>${esc(name)}</b><small>${esc(sub)}</small><i></i>${flag ? `<em class="fl${flagCls ? " " + flagCls : ""}">${esc(flag)}</em>` : ""}</div>`;

    /* ---- 오늘 근무 현황 (월별 스케줄 데이터 기준) ---- */
    const staffList = getStaffListForMonth(y, m).filter((s) => !s.isAdmin);
    const dateKey = scheduleDateKey(y, m, d);
    const staffToday = staffList.map((s) => {
      const record = getScheduleRecord(s.id, dateKey);
      return Object.assign({}, s, { record });
    });
    const working = staffToday.filter((s) => scheduleCountsAsWorked(s.record));
    const lateList = working.filter((s) => s.record.attendance === "LATE");
    const absentList = staffToday.filter((s) => s.record.status === "WORK" && s.record.attendance === "ABSENT");
    const offList = staffToday.filter((s) => s.record.status !== "WORK");
    const dayWorking = sortStaffByType(working.filter((s) => s.group !== "night"));
    const nightWorking = sortStaffByType(working.filter((s) => s.group === "night"));

    function staffRowHtml(s) {
      const sub = s.nickname && s.nickname !== s.name ? s.nickname : "";
      if (s.record.attendance === "ABSENT") return rw(s.name, sub, "결근", "ab");
      if (s.record.attendance === "LATE") return rw(s.name, sub, "지각");
      if (s.record.status !== "WORK") {
        const meta = SCHEDULE_STATUS_META[s.record.status];
        return rw(s.name, sub, meta ? meta.label : "휴무");
      }
      return rw(s.name, sub);
    }

    let scheduleSectionHtml;
    if (staffList.length === 0) {
      scheduleSectionHtml = `<p class="s">등록된 상담사가 없어요.<br>"상담사 관리"에서 추가해보세요.</p>`;
    } else {
      const parts = [];
      if (dayWorking.length) parts.push(`<div class="gl">☀ 주간 근무 (${dayWorking.length}명)</div>${dayWorking.map(staffRowHtml).join("")}`);
      if (nightWorking.length) parts.push(`<div class="gl">☾ 야간 근무 (${nightWorking.length}명)</div>${nightWorking.map(staffRowHtml).join("")}`);
      if (absentList.length) parts.push(`<div class="gl">결근</div>${absentList.map(staffRowHtml).join("")}`);
      if (parts.length === 0) parts.push(`<p class="s">오늘 근무 인원이 없어요.</p>`);
      scheduleSectionHtml = parts.join("");
    }

    /* ---- 오늘 일정 (캘린더) ---- */
    const todayEntries = sortEntries(readMonthRaw(y, m)[pad2(d)] || []);
    const entriesHtml = todayEntries.length === 0
      ? `<p class="s">오늘 등록된 일정이 없어요.</p>`
      : todayEntries.map((e) => `<div class="rw"><span style="color:#ffc766;width:10px">${e.priority && !e.done ? "★" : ""}</span>${e.time ? `<small>${esc(e.time)}</small>` : ""}<span${e.done ? ' style="text-decoration:line-through;color:var(--t2)"' : ""}>${esc(e.text)}</span></div>`).join("");

    /* ---- 할 일: 오늘 마감이거나 이미 지난 할 일 ---- */
    const todoRelevant = todos
      .filter((t) => !t.done && (!t.due || t.due <= iso))
      .sort((a, b) => (a.due || "").localeCompare(b.due || ""));
    const remainingCount = todos.filter((t) => !t.done).length;
    const todoHtml = todoRelevant.length === 0
      ? `<p class="s">오늘까지 마감인 할 일이 없어요.</p>`
      : todoRelevant.slice(0, 6).map((t) => {
          const isOver = t.due && t.due < iso;
          return `<div class="rw"><button class="cb" data-home-todo-toggle="${t.id}" aria-label="완료 표시"></button><span>${esc(t.text)}</span><i></i>${t.due ? `<em class="fl${isOver ? " ab" : ""}">${isOver ? "지남" : "오늘"}</em>` : ""}</div>`;
        }).join("");

    /* ---- 고정 메모 ---- */
    const pinnedNotes = notesData.pinnedOrder.map((id) => notesData.notes[id]).filter(Boolean);
    const notesHtml = pinnedNotes.length === 0
      ? `<p class="s">고정된 메모가 없어요.</p>`
      : pinnedNotes.slice(0, 5).map((n) => {
          const snippet = String(n.content || "").replace(/\s+/g, " ").trim();
          return `<div class="rw" data-a="notes" style="display:block"><div>${esc(n.title)}</div>${snippet ? `<small>${esc(snippet.length > 80 ? snippet.slice(0, 80) + "…" : snippet)}</small>` : ""}</div>`;
        }).join("");

    const totalAgents = agentsData.filter((a) => a.status !== "RESIGNED").length;

    /* ---- 장기 미면담 상담사 (최근 3주 = 21일 이내 면담 기록이 없는 경우) ---- */
    const NO_INTERVIEW_DAYS = 21;
    const activeAgents = agentsData.filter((a) => a.status !== "RESIGNED" && !a.isAdmin);
    const staleInterviewAgents = activeAgents.map((a) => {
      const records = interviewsData.filter((r) => r.agentId === a.id && r.date);
      const lastDate = records.length ? records.map((r) => r.date).sort().slice(-1)[0] : null;
      return { agent: a, lastDate };
    }).filter((x) => !x.lastDate || x.lastDate < addDaysISO(iso, -NO_INTERVIEW_DAYS))
      .sort((x, y) => (x.lastDate || "").localeCompare(y.lastDate || ""));
    const INTERVIEW_ALERT_VISIBLE = 5;
    const interviewAlertHasMore = staleInterviewAgents.length > INTERVIEW_ALERT_VISIBLE;
    const interviewAlertShown = homeUi.interviewAlertExpanded
      ? staleInterviewAgents
      : staleInterviewAgents.slice(0, INTERVIEW_ALERT_VISIBLE);
    const staleInterviewHtml = staleInterviewAgents.length === 0
      ? `<p class="s">최근 ${NO_INTERVIEW_DAYS}일 내 면담 기록이 없는 상담사가 없어요.</p>`
      : `${interviewAlertShown.map((x) => rw(x.agent.name, x.agent.ldap || "", x.lastDate ? `마지막 면담 ${x.lastDate}` : "면담 기록 없음", !x.lastDate ? "interview-empty" : "")).join("")}${interviewAlertHasMore ? `<button class="more" id="btn-interview-alert-toggle" type="button">${homeUi.interviewAlertExpanded ? "접기 ▲" : `전체 ${staleInterviewAgents.length}명 보기 ▾`}</button>` : ""}<p class="s">최근 ${NO_INTERVIEW_DAYS}일 내 면담 기록이 없는 상담사예요.</p>`;

    /* ---- QA(품질 관리) 전체 평균 점수 ----
       이번 달 점수가 아직 입력 안 된 경우가 많으므로(달이 막 바뀐 시점 등),
       이번 달부터 거꾸로 훑어서 점수가 입력된 가장 최근 달을 찾아 보여준다. */
    const qaAgentsList = qaWorkingAgents(y, m);
    const qaLatest = qaHomeFindLatestMonthWithData(qaAgentsList, y, m);
    let qaSummaryHtml;
    if (!qaLatest) {
      qaSummaryHtml = `<p class="s">최근 QA 점수가 아직 없어요.</p>`;
    } else {
      const qaPrevYm = qaPrevMonth(qaLatest.year, qaLatest.monthIndex);
      const qaStatsPrev = qaComputeStats(qaAgentsList, qaPrevYm.year, qaPrevYm.monthIndex);
      const qaHomeDiff = qaStatDiff(qaLatest.stats.total, qaStatsPrev.total);
      const qaHomeDiffHtml = qaHomeDiff
        ? ` <span${qaHomeDiff.cls === "up" ? ' class="up"' : qaHomeDiff.cls === "down" ? ' class="dn"' : ""}>${qaHomeDiff.sign} ${qaHomeDiff.abs.toFixed(1)}</span>`
        : "";
      const qaIsCurrentMonth = qaLatest.year === y && qaLatest.monthIndex === m;
      qaSummaryHtml = `<div class="big" style="font-size:2.4em">${qaLatest.stats.total.toFixed(1)}<small>점</small></div><small>${qaIsCurrentMonth ? "" : `${qaLatest.year}년 `}${qaLatest.monthIndex + 1}월 전체 평균${qaHomeDiffHtml}</small>`;
    }
    qaSummaryHtml += homeQaTrendHtml(qaAgentsList, y, m);

    /* ---- 위젯별 제목/링크/내용 (목업 WD) → 저장된 배치 순서대로 조립 ---- */
    const cardMeta = {
      status: { label: "오늘 근무 현황", link: { nav: "schedule", label: "스케줄 보기 ›" }, content: scheduleSectionHtml },
      qa: { label: "QA 평균 점수", link: { nav: "qa", label: "품질 관리 보기 ›" }, content: qaSummaryHtml },
      calendar: { label: "오늘 일정", link: { nav: "calendar", label: "캘린더 보기 ›" }, content: entriesHtml },
      interviews: { label: "면담 필요 알림", link: { nav: "interviews", label: "면담일지 보기 ›" }, content: staleInterviewHtml },
      todos: { label: "할 일", link: null, content: todoHtml },
      notes: { label: "고정 메모", link: { nav: "notes", label: "업무 정리 보기 ›" }, content: notesHtml },
    };
    // 목업 wc()
    function cardHtml(id) {
      const meta = cardMeta[id];
      if (!meta) return "";
      return `<div class="wd" data-home-card="${id}"><div class="wh"><span>${meta.label}</span>${meta.link ? `<button data-a="${meta.link.nav}">${meta.link.label}</button>` : ""}</div>${meta.content}</div>`;
    }
    const homeColumnsHtml = loadHomeLayout().map((colIds, i) => `<div class="col" data-home-col="${i}">${colIds.map(cardHtml).join("")}</div>`).join("");

    // 목업 히어로: 날짜 + 5칸 통계. (공휴일이면 날짜 아래에 목업의 .hero .wh small 자리로 공휴일 이름을 작게 붙인다)
    const stats = [
      [working.length, "오늘 근무", "ok"],
      [lateList.length + absentList.length, "지각·결근", "warn"],
      [offList.length, "휴무·연차 등", ""],
      [remainingCount, "남은 할 일", "ac"],
      [totalAgents, "전체 상담사", ""],
    ];
    root.innerHTML = `<div id="wg"><div class="wd hero"><div class="wh"><span style="color:var(--t)">${m + 1}월 ${d}일 <span>${wd}요일</span></span>${holiday ? `<small>${esc(holiday)}</small>` : ""}</div><div class="st">${stats.map((x) => `<div class="${x[2]}"><b>${x[0]}</b><small>${x[1]}</small></div>`).join("")}</div></div><div class="cols" id="home-card-grid">${homeColumnsHtml}</div></div>`;

    root.querySelectorAll("[data-a]").forEach((el) => {
      el.onclick = () => setPage(el.getAttribute("data-a"));
    });
    const interviewAlertToggleBtn = document.getElementById("btn-interview-alert-toggle");
    if (interviewAlertToggleBtn) {
      interviewAlertToggleBtn.onclick = () => {
        homeUi.interviewAlertExpanded = !homeUi.interviewAlertExpanded;
        renderHomePage(root);
      };
    }
    // 목업처럼 동그라미가 먼저 채워지고(취소선) 잠깐 뒤 완료 처리되면서 목록에서 빠진다
    root.querySelectorAll("[data-home-todo-toggle]").forEach((btn) => {
      btn.onclick = () => {
        if (btn.classList.contains("on")) return;
        btn.classList.add("on");
        const id = btn.getAttribute("data-home-todo-toggle");
        setTimeout(() => {
          toggleTodoDone(id);
          renderHomePage(root); // 창이 열려 있어도 바탕화면 위젯은 보이므로 항상 다시 그린다
        }, 260);
      };
    });
    bindHomeCardDrag(document.getElementById("home-card-grid"));
    homeWidgetLift();
  }

  /* ===================== 오늘의 브리핑 히어로 팝업 =====================
     로그인 직후 한 번, 홈 화면 위에 "오늘 확인해야 할 것들"을 요약한 카드가
     애니메이션과 함께 떠오른다. 항목을 누르면 해당 페이지로 이동하면서 닫힌다. */
  function computeTodayBrief() {
    const y = today.getFullYear(), m = today.getMonth(), d = today.getDate();
    const iso = todayISO();
    const holiday = getHoliday(iso);
    const wd = WEEKDAYS[today.getDay()];

    const staffList = getStaffListForMonth(y, m).filter((s) => !s.isAdmin);
    const dateKey = scheduleDateKey(y, m, d);
    const staffToday = staffList.map((s) => Object.assign({}, s, { record: getScheduleRecord(s.id, dateKey) }));
    const working = staffToday.filter((s) => scheduleCountsAsWorked(s.record));
    const lateList = working.filter((s) => s.record.attendance === "LATE");
    const absentList = staffToday.filter((s) => s.record.status === "WORK" && s.record.attendance === "ABSENT");

    const todayEntries = sortEntries(readMonthRaw(y, m)[pad2(d)] || []);

    const todoRelevant = todos
      .filter((t) => !t.done && (!t.due || t.due <= iso))
      .sort((a, b) => (a.due || "").localeCompare(b.due || ""));

    const NO_INTERVIEW_DAYS = 21;
    const activeAgents = agentsData.filter((a) => a.status !== "RESIGNED" && !a.isAdmin);
    const staleInterviewAgents = activeAgents
      .map((a) => {
        const records = interviewsData.filter((r) => r.agentId === a.id && r.date);
        const lastDate = records.length ? records.map((r) => r.date).sort().slice(-1)[0] : null;
        return { agent: a, lastDate };
      })
      .filter((x) => !x.lastDate || x.lastDate < addDaysISO(iso, -NO_INTERVIEW_DAYS));

    const pinnedNotes = notesData.pinnedOrder.map((id) => notesData.notes[id]).filter(Boolean);

    return { y, m, d, wd, holiday, staffList, working, lateList, absentList, todayEntries, todoRelevant, staleInterviewAgents, pinnedNotes };
  }

  // macOS 목업(ate1ier-macos-mockup)에서는 로그인 직후 화면을 가리는 카드 팝업이 아니라,
  // "오늘의 브리핑 · 근무 3명 · 일정 3건 · 면담 필요 1명"처럼 한 줄짜리 토스트가 잠깐 떴다가
  // 저절로 사라진다(toast(...,6000), 6초 후 자동으로 없어짐). 예전 히어로 카드 팝업(확인 버튼을
  // 눌러야 닫히던 방식) 대신 이 한 줄 토스트로 바꿨다 — computeTodayBrief()로 계산한 실제
  // 숫자를 목업과 같은 문구 형식(근무 N명 · 일정 N건 · 면담 필요 N명)에 채워 넣는다.
  let todayBriefToastTimer = null;
  function todayBriefToastText(brief) {
    return `오늘의 브리핑 · 근무 ${brief.working.length}명 · 일정 ${brief.todayEntries.length}건 · 면담 필요 ${brief.staleInterviewAgents.length}명`;
  }
  function showTodayBriefToast() {
    const brief = computeTodayBrief();
    let el = document.getElementById("today-brief-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "today-brief-toast";
      el.className = "today-brief-toast";
      document.body.appendChild(el);
    }
    el.innerHTML = `${ICON_SUN}<span>${esc(todayBriefToastText(brief))}</span>`;
    if (todayBriefToastTimer) clearTimeout(todayBriefToastTimer);
    requestAnimationFrame(() => el.classList.add("visible"));
    // 목업의 toast()와 동일하게, 사라질 때는 페이드아웃 없이 시간이 다 되면 곧바로 없앤다.
    todayBriefToastTimer = setTimeout(() => {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, 6000);
  }

  /* ===================== 월마감 확인 팝업 =====================
     달이 바뀌면(예: 9월이 지나 10월이 되면), 방금 지나간 달(9월)의 "최종 스케줄 확정 /
     품질 관리 확정"을 마쳤는지 로그인할 때마다 확인시켜주는 팝업.
     - 최종 스케줄 확정 = 월별 스케줄에서 그 달을 잠금(scheduleIsMonthLocked)
     - 품질 관리 확정  = 품질 관리(QA)에서 그 달을 잠금(qaIsMonthLocked)
     두 항목 모두 매번 그 자리에서 실시간으로(잠금 여부를 직접) 확인하기 때문에,
     확정했다가 수정하려고 다시 풀고 나중에 또 잠그면 자연스럽게 다시 "완료" 상태가
     되어 팝업이 뜨지 않는다 — 별도로 "한 번 확정한 적 있음" 같은 상태를 저장해두지
     않는다. "앞으로 뜨지 않음"만 그 달 단위로 저장해서, 체크해두면 다시 풀었다
     잠가도(또는 아예 안 잠가도) 그 달에 대해서는 로그인해도 더 이상 뜨지 않는다. */
  const MONTH_CLOSE_KEY = acctKey("personal-monthclose:data");
  function loadMonthCloseData() {
    try {
      const raw = localStorage.getItem(MONTH_CLOSE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed && typeof parsed === "object") {
        if (!parsed.dismissed || typeof parsed.dismissed !== "object") parsed.dismissed = {};
        return parsed;
      }
    } catch (e) {}
    return { dismissed: {} };
  }
  let monthCloseData = loadMonthCloseData();
  function saveMonthCloseData() {
    try { localStorage.setItem(MONTH_CLOSE_KEY, JSON.stringify(monthCloseData)); } catch (e) {}
  }
  // "마감 확인"의 대상이 되는 달 = 오늘이 속한 달의 바로 전 달(=방금 지나간 달).
  function monthCloseTargetMonth() {
    const d = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    return { year: d.getFullYear(), monthIndex: d.getMonth() };
  }
  function monthCloseKeyStr(year, monthIndex) { return `${year}-${pad2(monthIndex + 1)}`; }
  function monthCloseStatus() {
    const { year, monthIndex } = monthCloseTargetMonth();
    const key = monthCloseKeyStr(year, monthIndex);
    const scheduleDone = scheduleIsMonthLocked(year, monthIndex);
    const qaDone = qaIsMonthLocked(year, monthIndex);
    return {
      year, monthIndex, key, scheduleDone, qaDone,
      allDone: scheduleDone && qaDone,
      dismissed: !!monthCloseData.dismissed[key],
    };
  }
  function shouldShowMonthClosePopup() {
    const s = monthCloseStatus();
    return !s.allDone && !s.dismissed;
  }
  function setMonthCloseDismissed(flag) {
    const s = monthCloseStatus();
    if (flag) monthCloseData.dismissed[s.key] = true;
    else delete monthCloseData.dismissed[s.key];
    saveMonthCloseData();
  }

  let monthCloseKeyHandler = null;
  function closeMonthClosePopup() {
    const overlay = document.getElementById("month-close-overlay");
    if (!overlay) return;
    if (monthCloseKeyHandler) { document.removeEventListener("keydown", monthCloseKeyHandler); monthCloseKeyHandler = null; }
    overlay.classList.add("closing");
    setTimeout(() => overlay.remove(), 200);
  }
  function monthCloseRowsHtml(s) {
    const rows = [
      {
        done: s.scheduleDone, icon: ICON_CLIPBOARD, nav: "schedule",
        title: "최종 스케줄 확정",
        sub: s.scheduleDone ? "확정(잠금) 완료" : "이 달 스케줄을 확정(잠금)해주세요",
      },
      {
        done: s.qaDone, icon: ICON_QA, nav: "qa",
        title: "품질 관리 확정",
        sub: s.qaDone ? "확정(잠금) 완료" : "이 달 QA 점수를 확정(잠금)해주세요",
      },
    ];
    return rows.map((r, i) => `
      <button type="button" class="today-brief-row month-close-row ${r.done ? "done" : ""}" data-monthclose-nav="${r.nav}" style="animation-delay:${80 + i * 55}ms">
        <span class="today-brief-row-icon">${r.done ? ICON_CHECK : r.icon}</span>
        <span class="today-brief-row-text">
          <b>${esc(r.title)}</b>
          <span>${esc(r.sub)}</span>
        </span>
        ${ICON_CHEVRON_RIGHT}
      </button>
    `).join("");
  }
  function monthCloseCardHtml(s) {
    return `
      <div class="today-brief-card month-close-card" role="dialog" aria-modal="true" aria-label="월마감 확인">
        <button type="button" class="today-brief-close" id="month-close-close" aria-label="닫기">${ICON_CLOSE_SM}</button>
        <div class="today-brief-head">
          <div class="today-brief-badge">${ICON_CLIPBOARD} 월마감 확인</div>
          <div class="today-brief-date">${s.year}년 ${s.monthIndex + 1}월 마감</div>
        </div>
        <div class="today-brief-rows month-close-rows">
          ${monthCloseRowsHtml(s)}
        </div>
        <label class="month-close-dismiss-row" for="month-close-dismiss-checkbox">
          <input type="checkbox" id="month-close-dismiss-checkbox" ${s.dismissed ? "checked" : ""}>
          <span>앞으로 뜨지 않음</span>
        </label>
        <button type="button" class="today-brief-cta" id="month-close-cta">확인했어요</button>
      </div>
    `;
  }
  function bindMonthCloseEvents(overlay) {
    document.getElementById("month-close-close").onclick = () => closeMonthClosePopup();
    document.getElementById("month-close-cta").onclick = () => closeMonthClosePopup();
    document.getElementById("month-close-dismiss-checkbox").onchange = (e) => {
      setMonthCloseDismissed(e.target.checked);
    };
    overlay.querySelectorAll("[data-monthclose-nav]").forEach((btn) => {
      btn.onclick = () => {
        const nav = btn.getAttribute("data-monthclose-nav");
        const s = monthCloseStatus();
        closeMonthClosePopup();
        if (nav === "schedule" || nav === "qa") setPage(nav, { year: s.year, monthIndex: s.monthIndex });
        else setPage(nav);
      };
    });
  }
  function showMonthClosePopup() {
    if (document.getElementById("month-close-overlay")) return;
    const overlay = document.createElement("div");
    overlay.id = "month-close-overlay";
    overlay.className = "today-brief-overlay month-close-overlay";
    document.body.appendChild(overlay);
    overlay.innerHTML = monthCloseCardHtml(monthCloseStatus());
    bindMonthCloseEvents(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeMonthClosePopup(); };
    monthCloseKeyHandler = (e) => { if (e.key === "Escape") closeMonthClosePopup(); };
    document.addEventListener("keydown", monthCloseKeyHandler);
  }

