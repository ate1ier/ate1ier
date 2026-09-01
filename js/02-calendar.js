  function getHoliday(iso) { return KR_HOLIDAYS[iso] || null; }

  const cal = {
    year: today.getFullYear(),
    monthIndex: today.getMonth(),
    selectedDay: today.getDate(),
    monthData: {},
    hideDone: false,
    formType: "memo",
    formPriority: false,
    rangeMode: false,
    formDetailMode: false, // 추가 폼에서 "상세 내용" 입력칸을 펼쳐서 보고 있는지
    expandedEntries: {}, // 일정/메모 목록에서 상세 내용을 펼쳐서 보고 있는 항목의 id 모음
    upcomingExpanded: false, // "다가오는 일정"을 5개 넘게 펼쳐서 보고 있는지
  };

  function monthKey(y, m) { return acctKey(`personal-calendar:${y}-${pad2(m + 1)}`); }
  function toISODate(y, m, d) { return `${y}-${pad2(m + 1)}-${pad2(d)}`; }
  function parseISODate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  function addDaysISO(iso, delta) {
    const dt = parseISODate(iso);
    dt.setDate(dt.getDate() + delta);
    return toISODate(dt.getFullYear(), dt.getMonth(), dt.getDate());
  }
  function readMonthRaw(y, m) {
    try {
      const raw = localStorage.getItem(monthKey(y, m));
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }
  function writeMonthRaw(y, m, data) {
    try { localStorage.setItem(monthKey(y, m), JSON.stringify(data)); return true; }
    catch (e) { return false; }
  }
  function loadMonth(y, m) { cal.monthData = readMonthRaw(y, m); }

  let calStatusTimer = null;
  function flashCalStatus(msg) {
    const el = document.getElementById("cal-status");
    if (!el) return;
    el.textContent = msg;
    clearTimeout(calStatusTimer);
    calStatusTimer = setTimeout(() => { el.textContent = ""; }, 1500);
  }
  function saveCurrentMonth() {
    const ok = writeMonthRaw(cal.year, cal.monthIndex, cal.monthData);
    flashCalStatus(ok ? "저장됨" : "저장 실패");
  }

  function sortEntries(list) {
    return [...list].sort((a, b) => {
      if (!!a.done !== !!b.done) return a.done ? 1 : -1;
      if (!!a.priority !== !!b.priority) return a.priority ? -1 : 1;
      if (!a.time && !b.time) return 0;
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });
  }
  function dateRangeDays(startISO, endISO) {
    let start = parseISODate(startISO);
    let end = parseISODate(endISO);
    if (start > end) { const t = start; start = end; end = t; }
    const days = [];
    const cur = new Date(start);
    let guard = 0;
    while (cur <= end && guard < 366) {
      days.push({ y: cur.getFullYear(), m: cur.getMonth(), d: cur.getDate(), iso: toISODate(cur.getFullYear(), cur.getMonth(), cur.getDate()) });
      cur.setDate(cur.getDate() + 1);
      guard++;
    }
    return days;
  }
  function buildGrid(year, monthIndex) {
    const firstWeekday = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();
    const cells = [];
    for (let i = firstWeekday - 1; i >= 0; i--) cells.push({ day: daysInPrevMonth - i, current: false });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true });
    while (cells.length % 7 !== 0 || cells.length < 42) {
      cells.push({ day: cells.length - (firstWeekday + daysInMonth) + 1, current: false });
    }
    return cells;
  }
  function isTodayCell(day, current) {
    return current && day === today.getDate() && cal.monthIndex === today.getMonth() && cal.year === today.getFullYear();
  }
  function formatRangeLabel(iso1, iso2) {
    const a = parseISODate(iso1), b = parseISODate(iso2);
    return `${a.getMonth() + 1}/${a.getDate()} → ${b.getMonth() + 1}/${b.getDate()}`;
  }
  function computeUpcoming() {
    const isCurrentMonth = cal.year === today.getFullYear() && cal.monthIndex === today.getMonth();
    const fromDay = isCurrentMonth ? today.getDate() : 1;
    const dayKeys = Object.keys(cal.monthData).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
    const items = [];
    const seen = new Set();
    dayKeys.forEach((dayKey) => {
      const dayNum = parseInt(dayKey, 10);
      if (dayNum < fromDay) return;
      (cal.monthData[dayKey] || []).forEach((entry) => {
        if (entry.done) return;
        if (seen.has(entry.id)) return;
        seen.add(entry.id);
        items.push(Object.assign({}, entry, { dayKey, dayNum }));
      });
    });
    items.sort((a, b) => {
      if (a.dayNum !== b.dayNum) return a.dayNum - b.dayNum;
      if (!!a.priority !== !!b.priority) return a.priority ? -1 : 1;
      if (!a.time && !b.time) return 0;
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });
    return items;
  }

  const UPCOMING_COLLAPSED_COUNT = 5; // 접었을 때 기본으로 보여줄 개수

  function renderCalendarPage(root) {
    const grid = buildGrid(cal.year, cal.monthIndex);
    const selectedKey = pad2(cal.selectedDay);
    const selectedEntries = cal.monthData[selectedKey] || [];
    const selectedWeekday = WEEKDAYS[new Date(cal.year, cal.monthIndex, cal.selectedDay).getDay()];
    const upcomingAll = computeUpcoming();
    const upcoming = cal.upcomingExpanded ? upcomingAll : upcomingAll.slice(0, UPCOMING_COLLAPSED_COUNT);
    const selectedISO = toISODate(cal.year, cal.monthIndex, cal.selectedDay);

    let gridHtml = "";
    grid.forEach((c, i) => {
      const weekend = i % 7 === 0 || i % 7 === 6;
      const weekdayIdx = i % 7;
      const entries = c.current ? (cal.monthData[pad2(c.day)] || []) : [];
      const cellISO = c.current ? toISODate(cal.year, cal.monthIndex, c.day) : null;

      const rangeEntries = entries.filter((e) => e.rangeStart && e.rangeEnd && e.rangeStart !== e.rangeEnd);
      rangeEntries.sort((a, b) => (a.rangeStart + a.id).localeCompare(b.rangeStart + b.id));
      const normalEntries = entries.filter((e) => !(e.rangeStart && e.rangeEnd && e.rangeStart !== e.rangeEnd));
      const combined = rangeEntries.concat(normalEntries);
      const visible = combined.slice(0, 3);
      const extra = combined.length - visible.length;

      const holidayName = cellISO ? getHoliday(cellISO) : null;
      const selected = c.current && c.day === cal.selectedDay;
      const classes = ["cell", c.current ? "current" : "dim", weekend ? "weekend" : "", holidayName ? "holiday" : "", selected ? "selected" : "", isTodayCell(c.day, c.current) ? "today" : ""].join(" ").trim();

      let entriesHtml = "";
      if (visible.length > 0) {
        const chips = visible.map((entry) => {
          const isRange = entry.rangeStart && entry.rangeEnd && entry.rangeStart !== entry.rangeEnd;
          let bridgeCls = "";
          if (isRange && cellISO) {
            const continuesLeft = cellISO !== entry.rangeStart && weekdayIdx !== 0;
            const continuesRight = cellISO !== entry.rangeEnd && weekdayIdx !== 6;
            bridgeCls = (continuesLeft ? "bridge-l " : "") + (continuesRight ? "bridge-r" : "");
          }
          const star = entry.priority && !entry.done ? '<span class="star">★</span>' : "";
          const timePart = (!isRange && entry.time) ? esc(entry.time) + " " : "";
          return `<span class="chip ${entry.type} ${entry.done ? "done" : ""} ${bridgeCls}">${star}${timePart}${esc(entry.text)}</span>`;
        }).join("");
        const more = extra > 0 ? `<span class="chip-more">+${extra}개 더보기</span>` : "";
        entriesHtml = `<div class="cell-entries">${chips}${more}</div>`;
      }
      const holidayHtml = holidayName ? `<span class="holiday-label" title="${esc(holidayName)}">${esc(holidayName)}</span>` : "";

      gridHtml += `<div class="${classes}" data-day="${c.day}" data-current="${c.current}" tabindex="${c.current ? 0 : -1}">
        <span class="day-num">${c.day}</span>
        ${holidayHtml}
        ${entriesHtml}
      </div>`;
    });

    let entriesHtml = "";
    const visibleEntries = selectedEntries.filter((e) => !cal.hideDone || !e.done);
    if (visibleEntries.length === 0) {
      entriesHtml = `<div class="empty">이 날짜엔 아직 기록이 없어요.<br>아래에서 일정이나 메모를 추가해보세요.</div>`;
    } else {
      entriesHtml = `<div class="entries">` + visibleEntries.map((entry) => {
        const isRange = entry.rangeStart && entry.rangeEnd && entry.rangeStart !== entry.rangeEnd;
        const hasDetail = !!(entry.detail && entry.detail.trim());
        const expanded = hasDetail && !!cal.expandedEntries[entry.id];
        return `
        <div class="entry ${entry.type} ${entry.done ? "done" : ""} ${expanded ? "expanded" : ""}" data-id="${entry.id}">
          <button class="check-btn" data-action="toggle" data-id="${entry.id}">${entry.done ? "✓" : ""}</button>
          <div class="body">
            <span class="meta-row">
              ${isRange ? `<span class="range-badge">${formatRangeLabel(entry.rangeStart, entry.rangeEnd)}</span>` : ""}
              ${(!isRange && entry.time) ? `<span class="time">${esc(entry.time)}</span>` : ""}
              ${entry.priority && !entry.done ? `<span class="priority-tag">★ 중요</span>` : ""}
            </span>
            ${hasDetail ? `
              <button type="button" class="entry-title-btn" data-action="expand" data-id="${entry.id}">
                <span class="text">${esc(entry.text)}</span>
                <span class="expand-chevron">${ICON_CHEVRON_RIGHT}</span>
              </button>
              ${expanded ? `<div class="entry-detail-card">${esc(entry.detail)}</div>` : ""}
            ` : `
              <span class="text">${esc(entry.text)}</span>
            `}
          </div>
          <button class="del" data-action="delete" data-id="${entry.id}">✕</button>
        </div>`;
      }).join("") + `</div>`;
    }

    let upcomingHtml = "";
    if (upcomingAll.length > 0) {
      const remaining = upcomingAll.length - upcoming.length;
      upcomingHtml = `<div class="upcoming">
        <div class="upcoming-title">${ICON_CLIPBOARD} 다가오는 일정</div>
        <div class="upcoming-list">
          ${upcoming.map((item) => {
            const isRange = item.rangeStart && item.rangeEnd && item.rangeStart !== item.rangeEnd;
            const dayLabel = isRange ? formatRangeLabel(item.rangeStart, item.rangeEnd) : `${cal.monthIndex + 1}/${item.dayNum}`;
            return `
            <button class="upcoming-item" data-goto-day="${item.dayNum}">
              <span class="upcoming-day">${dayLabel}</span>
              ${item.priority ? '<span class="upcoming-star">★</span>' : ""}
              <span class="upcoming-text ${item.type}">${esc(item.text)}</span>
            </button>`;
          }).join("")}
        </div>
        ${upcomingAll.length > UPCOMING_COLLAPSED_COUNT ? `
          <button type="button" class="upcoming-toggle" id="btn-upcoming-toggle">
            ${cal.upcomingExpanded ? "접기 ▲" : `더보기 (${remaining}개) ▾`}
          </button>
        ` : ""}
      </div>`;
    }

    root.innerHTML = `
      <div class="shell">
        <div class="card">
          <div class="cal-header">
            <div class="cal-title"><span class="year">${cal.year}</span>${MONTH_NAMES[cal.monthIndex]}</div>
            <div class="cal-nav">
              <button class="today-btn" id="btn-today">오늘</button>
              <button class="icon-btn" id="btn-prev" aria-label="이전 달">‹</button>
              <button class="icon-btn" id="btn-next" aria-label="다음 달">›</button>
            </div>
          </div>
          <div class="weekday-row">${WEEKDAYS.map((w) => `<span>${w}</span>`).join("")}</div>
          <div class="grid">${gridHtml}</div>
        </div>

        <div class="side-col">
          <div class="card">
            <div class="side-date">${cal.monthIndex + 1}월 ${cal.selectedDay}일 <span class="wd">${selectedWeekday}요일</span>${getHoliday(selectedISO) ? ` <span class="side-holiday">${esc(getHoliday(selectedISO))}</span>` : ""}</div>
            <div class="status" id="cal-status"></div>
            <div class="legend">
              <span class="item"><span class="dot memo"></span>메모</span>
              <span class="item"><span class="dot event"></span>일정</span>
              <label class="hide-done">
                <input type="checkbox" id="hide-done-check" ${cal.hideDone ? "checked" : ""}>
                완료 항목 숨기기
              </label>
            </div>
            ${entriesHtml}
            ${upcomingHtml}
            <form class="add-form" id="add-form">
              <div class="type-row">
                <button type="button" class="type-btn memo ${cal.formType === "memo" ? "active" : ""}" data-form-type="memo">메모</button>
                <button type="button" class="type-btn event ${cal.formType === "event" ? "active" : ""}" data-form-type="event">일정</button>
                <button type="button" class="type-btn priority ${cal.formPriority ? "active" : ""}" id="btn-priority">★ 중요</button>
                <button type="button" class="type-btn rangetoggle ${cal.rangeMode ? "active" : ""}" id="btn-range">기간 설정</button>
              </div>
              ${cal.rangeMode ? `
              <div class="range-row">
                <input type="date" class="date-input" id="input-start" value="${selectedISO}">
                <span class="arrow">→</span>
                <input type="date" class="date-input" id="input-end" value="${selectedISO}">
              </div>` : ""}
              <div class="add-row">
                ${cal.rangeMode ? "" : `<input class="add-input time-input" id="input-time" placeholder="시간">`}
                <input class="add-input text-input" id="input-text" placeholder="제목을 입력하세요" autocomplete="off">
                <button type="submit" class="submit-btn" aria-label="추가">＋</button>
              </div>
              <button type="button" class="detail-toggle-link ${cal.formDetailMode ? "active" : ""}" id="btn-detail-toggle">
                ${ICON_NOTE} ${cal.formDetailMode ? "상세 내용 접기" : "상세 내용 추가"}
              </button>
              ${cal.formDetailMode ? `<textarea class="add-textarea" id="input-detail" placeholder="상세 내용을 입력하세요 (선택)" rows="3"></textarea>` : ""}
            </form>
          </div>
          ${renderTodoCard()}
        </div>
      </div>
    `;

    attachCalEvents();
    attachTodoEvents();
  }

  function attachCalEvents() {
    document.getElementById("btn-today").onclick = () => {
      cal.year = today.getFullYear();
      cal.monthIndex = today.getMonth();
      cal.selectedDay = today.getDate();
      loadMonth(cal.year, cal.monthIndex);
      renderApp();
    };
    document.getElementById("btn-prev").onclick = () => goMonth(-1);
    document.getElementById("btn-next").onclick = () => goMonth(1);

    document.querySelectorAll(".cell[data-current='true']").forEach((cellEl) => {
      cellEl.onclick = () => {
        cal.selectedDay = parseInt(cellEl.getAttribute("data-day"), 10);
        renderApp();
      };
      cellEl.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") cellEl.click(); };
    });

    document.getElementById("hide-done-check").onchange = (e) => {
      cal.hideDone = e.target.checked;
      renderApp();
    };

    const upcomingToggleBtn = document.getElementById("btn-upcoming-toggle");
    if (upcomingToggleBtn) {
      upcomingToggleBtn.onclick = () => {
        cal.upcomingExpanded = !cal.upcomingExpanded;
        renderApp();
      };
    }

    document.querySelectorAll("[data-action='toggle']").forEach((btn) => {
      btn.onclick = () => toggleDoneEntry(btn.getAttribute("data-id"));
    });
    document.querySelectorAll("[data-action='delete']").forEach((btn) => {
      btn.onclick = () => deleteEntry(btn.getAttribute("data-id"));
    });
    document.querySelectorAll("[data-action='expand']").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-id");
        cal.expandedEntries[id] = !cal.expandedEntries[id];
        renderApp();
      };
    });
    document.querySelectorAll("[data-goto-day]").forEach((btn) => {
      btn.onclick = () => { cal.selectedDay = parseInt(btn.getAttribute("data-goto-day"), 10); renderApp(); };
    });

    document.querySelectorAll("[data-form-type]").forEach((btn) => {
      btn.onclick = () => {
        cal.formType = btn.getAttribute("data-form-type");
        document.querySelectorAll("[data-form-type]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      };
    });
    document.getElementById("btn-priority").onclick = (e) => {
      cal.formPriority = !cal.formPriority;
      e.currentTarget.classList.toggle("active", cal.formPriority);
    };
    document.getElementById("btn-range").onclick = () => { cal.rangeMode = !cal.rangeMode; renderApp(); };
    document.getElementById("btn-detail-toggle").onclick = () => {
      cal.formDetailMode = !cal.formDetailMode;
      const btn = document.getElementById("btn-detail-toggle");
      btn.classList.toggle("active", cal.formDetailMode);
      btn.innerHTML = `${ICON_NOTE} ${cal.formDetailMode ? "상세 내용 접기" : "상세 내용 추가"}`;
      let ta = document.getElementById("input-detail");
      if (cal.formDetailMode) {
        if (!ta) {
          ta = document.createElement("textarea");
          ta.className = "add-textarea";
          ta.id = "input-detail";
          ta.placeholder = "상세 내용을 입력하세요 (선택)";
          ta.rows = 3;
          btn.insertAdjacentElement("afterend", ta);
        }
        ta.focus();
      } else if (ta) {
        ta.remove();
      }
    };

    document.getElementById("add-form").onsubmit = (e) => {
      e.preventDefault();
      const textInput = document.getElementById("input-text");
      const trimmed = textInput.value.trim();
      if (!trimmed) return;
      const detailInput = document.getElementById("input-detail");
      const detailVal = detailInput ? detailInput.value.trim() : "";

      const id = `${Date.now()}`;
      const baseEntry = { id, text: trimmed, type: cal.formType, priority: cal.formPriority, done: false, detail: detailVal };

      if (cal.rangeMode) {
        const startVal = document.getElementById("input-start").value;
        const endVal = document.getElementById("input-end").value;
        if (!startVal || !endVal) return;
        const days = dateRangeDays(startVal, endVal);
        const rangeStart = days[0].iso;
        const rangeEnd = days[days.length - 1].iso;
        days.forEach(({ y, m, d }) => {
          const dayKey = pad2(d);
          const entry = Object.assign({}, baseEntry, { time: "", rangeStart, rangeEnd });
          if (y === cal.year && m === cal.monthIndex) {
            const list = cal.monthData[dayKey] ? [...cal.monthData[dayKey]] : [];
            list.push(entry);
            cal.monthData[dayKey] = sortEntries(list);
          } else {
            const otherData = readMonthRaw(y, m);
            const list = otherData[dayKey] ? [...otherData[dayKey]] : [];
            list.push(entry);
            otherData[dayKey] = sortEntries(list);
            writeMonthRaw(y, m, otherData);
          }
        });
        saveCurrentMonth();
      } else {
        const timeInput = document.getElementById("input-time");
        const key = pad2(cal.selectedDay);
        const iso = toISODate(cal.year, cal.monthIndex, cal.selectedDay);
        const entry = Object.assign({}, baseEntry, { time: timeInput.value.trim(), rangeStart: iso, rangeEnd: iso });
        const list = cal.monthData[key] ? [...cal.monthData[key]] : [];
        list.push(entry);
        cal.monthData[key] = sortEntries(list);
        saveCurrentMonth();
      }

      cal.formPriority = false;
      cal.formDetailMode = false;
      renderApp();
      const nt = document.getElementById("input-text");
      if (nt) nt.focus();
    };
  }

  function goMonth(delta) {
    let m = cal.monthIndex + delta;
    let y = cal.year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    cal.monthIndex = m; cal.year = y; cal.selectedDay = 1;
    loadMonth(y, m);
    renderApp();
  }

  function findEntry(id) {
    const key = pad2(cal.selectedDay);
    return (cal.monthData[key] || []).find((it) => it.id === id);
  }
  function forEachRangeDay(entry, fn) {
    if (entry.rangeStart && entry.rangeEnd && entry.rangeStart !== entry.rangeEnd) {
      dateRangeDays(entry.rangeStart, entry.rangeEnd).forEach(({ y, m, d }) => fn(y, m, pad2(d)));
    } else {
      fn(cal.year, cal.monthIndex, pad2(cal.selectedDay));
    }
  }
  function toggleDoneEntry(id) {
    const entry = findEntry(id);
    if (!entry) return;
    const newDone = !entry.done;
    forEachRangeDay(entry, (y, m, dayKey) => {
      if (y === cal.year && m === cal.monthIndex) {
        const list = (cal.monthData[dayKey] || []).map((it) => (it.id === id ? Object.assign({}, it, { done: newDone }) : it));
        cal.monthData[dayKey] = sortEntries(list);
      } else {
        const data = readMonthRaw(y, m);
        const list = (data[dayKey] || []).map((it) => (it.id === id ? Object.assign({}, it, { done: newDone }) : it));
        data[dayKey] = sortEntries(list);
        writeMonthRaw(y, m, data);
      }
    });
    saveCurrentMonth();
    renderApp();
  }
  function deleteEntry(id) {
    const entry = findEntry(id);
    if (!entry) return;
    // 여러 달에 걸친 일정이면 관련된 모든 달의 저장 키를 함께 스냅샷해둔다.
    const touchedMonthKeys = new Set([monthKey(cal.year, cal.monthIndex)]);
    forEachRangeDay(entry, (y, m) => { touchedMonthKeys.add(monthKey(y, m)); });
    const undoYear = cal.year, undoMonthIndex = cal.monthIndex;
    recordUndo("일정 삭제", Array.from(touchedMonthKeys), () => {
      if (cal.year === undoYear && cal.monthIndex === undoMonthIndex) loadMonth(cal.year, cal.monthIndex);
    });
    forEachRangeDay(entry, (y, m, dayKey) => {
      if (y === cal.year && m === cal.monthIndex) {
        const list = (cal.monthData[dayKey] || []).filter((it) => it.id !== id);
        if (list.length) cal.monthData[dayKey] = list; else delete cal.monthData[dayKey];
      } else {
        const data = readMonthRaw(y, m);
        const list = (data[dayKey] || []).filter((it) => it.id !== id);
        if (list.length) data[dayKey] = list; else delete data[dayKey];
        writeMonthRaw(y, m, data);
      }
    });
    saveCurrentMonth();
    renderApp();
  }

  loadMonth(cal.year, cal.monthIndex);

  /* ===================== 할 일(To-do) 모듈 ===================== */
  const TODO_KEY = acctKey("personal-calendar:todos");
  const todoUi = { dueInput: "", doneExpanded: false, formDetailMode: false, expanded: {} }; // doneExpanded: 완료된 할 일을 펼쳐서 보고 있는지, expanded: 상세 내용을 펼쳐서 보고 있는 할 일 id 모음

  function loadTodos() {
    try {
      const raw = localStorage.getItem(TODO_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }
  let todos = loadTodos();

  let todoStatusTimer = null;
  function flashTodoStatus(msg) {
    const el = document.getElementById("todo-status");
    if (!el) return;
    el.textContent = msg;
    clearTimeout(todoStatusTimer);
    todoStatusTimer = setTimeout(() => { el.textContent = ""; }, 1200);
  }
  function saveTodos() {
    try { localStorage.setItem(TODO_KEY, JSON.stringify(todos)); flashTodoStatus("저장됨"); }
    catch (e) { flashTodoStatus("저장 실패"); }
  }

  function todayISO() { return toISODate(today.getFullYear(), today.getMonth(), today.getDate()); }

  function addTodo(text, due, detail) {
    const trimmed = text.trim();
    if (!trimmed) return;
    todos.push({ id: genId(), text: trimmed, due: due || "", done: false, detail: (detail || "").trim() });
    saveTodos();
  }
  function toggleTodoDone(id) {
    todos = todos.map((t) => (t.id === id ? Object.assign({}, t, { done: !t.done }) : t));
    saveTodos();
  }
  function deleteTodo(id) {
    if (!todos.some((t) => t.id === id)) return;
    recordUndo("할 일 삭제", TODO_KEY, () => { todos = loadTodos(); });
    todos = todos.filter((t) => t.id !== id);
    saveTodos();
  }
  function sortTodos(list) {
    return [...list].sort((a, b) => {
      if (!!a.done !== !!b.done) return a.done ? 1 : -1;
      if (!a.due && !b.due) return 0;
      if (!a.due) return 1;
      if (!b.due) return -1;
      return a.due.localeCompare(b.due);
    });
  }
  function formatTodoDue(due) {
    const d = parseISODate(due);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  }

  function renderTodoCard() {
    const tISO = todayISO();
    const activeTodos = sortTodos(todos.filter((t) => !t.done));
    const doneTodos = sortTodos(todos.filter((t) => t.done));
    const remaining = activeTodos.length;

    function todoItemHtml(t) {
      const isDueToday = !!t.due && t.due === tISO && !t.done;
      const isOverdue = !!t.due && t.due < tISO && !t.done;
      const dueCls = isDueToday ? "today" : (isOverdue ? "over" : "");
      const dueLabel = t.due ? `${formatTodoDue(t.due)}${isDueToday ? " · 오늘" : (isOverdue ? " · 지남" : "")}` : "";
      const hasDetail = !!(t.detail && t.detail.trim());
      const expanded = hasDetail && !!todoUi.expanded[t.id];
      return `
        <div class="todo-item ${t.done ? "done" : ""} ${isDueToday ? "due-today" : ""} ${expanded ? "expanded" : ""}" data-id="${t.id}">
          <div class="todo-body">
            ${hasDetail ? `
              <button type="button" class="todo-title-btn" data-action="todo-expand" data-id="${t.id}">
                <span class="todo-text">${esc(t.text)}</span>
                <span class="expand-chevron">${ICON_CHEVRON_RIGHT}</span>
              </button>
              ${expanded ? `<div class="todo-detail-card">${esc(t.detail)}</div>` : ""}
            ` : `
              <span class="todo-text">${esc(t.text)}</span>
            `}
            ${t.due ? `<span class="todo-due ${dueCls}">${dueLabel}</span>` : ""}
          </div>
          <button class="check-btn" data-action="todo-toggle" data-id="${t.id}">${t.done ? "✓" : ""}</button>
          <button class="del" data-action="todo-delete" data-id="${t.id}">✕</button>
        </div>`;
    }

    let listHtml = "";
    if (activeTodos.length === 0 && doneTodos.length === 0) {
      listHtml = `<div class="todo-empty">할 일이 없어요.<br>아래에서 새 할 일을 추가해보세요.</div>`;
    } else if (activeTodos.length === 0) {
      listHtml = `<div class="todo-empty">남은 할 일이 없어요. 다 처리했어요!</div>`;
    } else {
      listHtml = activeTodos.map(todoItemHtml).join("");
    }

    // 완료된 항목은 기본적으로 접어두고, 버튼을 눌러야 펼쳐서 볼 수 있게 한다.
    let doneSectionHtml = "";
    if (doneTodos.length > 0) {
      doneSectionHtml = `
        <button type="button" class="todo-done-toggle" id="btn-todo-done-toggle">
          ${todoUi.doneExpanded ? "완료 항목 접기 ▲" : `완료 ${doneTodos.length}개 보기 ▾`}
        </button>
        ${todoUi.doneExpanded ? `<div class="todo-done-list">${doneTodos.map(todoItemHtml).join("")}</div>` : ""}
      `;
    }

    return `
      <div class="card todo-card">
        <div class="todo-header">
          <div class="todo-title">${ICON_CHECK} To-Do List</div>
          <div class="todo-count">${remaining}개 남음</div>
        </div>
        <div class="status" id="todo-status"></div>
        <div class="todo-list">${listHtml}</div>
        ${doneSectionHtml}
        <form class="todo-add-form" id="todo-add-form">
          <div class="todo-add-row">
            <input class="add-input text-input" id="todo-input-text" placeholder="할 일 제목을 입력하세요" autocomplete="off">
            <button type="submit" class="submit-btn" aria-label="추가">＋</button>
          </div>
          <div class="todo-add-row">
            <input class="add-input todo-due-input" type="date" id="todo-input-due" value="${todoUi.dueInput}">
          </div>
          <button type="button" class="detail-toggle-link ${todoUi.formDetailMode ? "active" : ""}" id="btn-todo-detail-toggle">
            ${ICON_NOTE} ${todoUi.formDetailMode ? "상세 내용 접기" : "상세 내용 추가"}
          </button>
          ${todoUi.formDetailMode ? `<textarea class="add-textarea" id="todo-input-detail" placeholder="상세 내용을 입력하세요 (선택)" rows="3"></textarea>` : ""}
        </form>
      </div>
    `;
  }

  function attachTodoEvents() {
    document.querySelectorAll("[data-action='todo-toggle']").forEach((btn) => {
      btn.onclick = () => { toggleTodoDone(btn.getAttribute("data-id")); renderApp(); };
    });
    document.querySelectorAll("[data-action='todo-delete']").forEach((btn) => {
      btn.onclick = () => { deleteTodo(btn.getAttribute("data-id")); renderApp(); };
    });
    document.querySelectorAll("[data-action='todo-expand']").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-id");
        todoUi.expanded[id] = !todoUi.expanded[id];
        renderApp();
      };
    });
    const doneToggleBtn = document.getElementById("btn-todo-done-toggle");
    if (doneToggleBtn) {
      doneToggleBtn.onclick = () => {
        todoUi.doneExpanded = !todoUi.doneExpanded;
        renderApp();
      };
    }
    const detailToggleBtn = document.getElementById("btn-todo-detail-toggle");
    if (detailToggleBtn) {
      detailToggleBtn.onclick = () => {
        todoUi.formDetailMode = !todoUi.formDetailMode;
        detailToggleBtn.classList.toggle("active", todoUi.formDetailMode);
        detailToggleBtn.innerHTML = `${ICON_NOTE} ${todoUi.formDetailMode ? "상세 내용 접기" : "상세 내용 추가"}`;
        let ta = document.getElementById("todo-input-detail");
        if (todoUi.formDetailMode) {
          if (!ta) {
            ta = document.createElement("textarea");
            ta.className = "add-textarea";
            ta.id = "todo-input-detail";
            ta.placeholder = "상세 내용을 입력하세요 (선택)";
            ta.rows = 3;
            detailToggleBtn.insertAdjacentElement("afterend", ta);
          }
          ta.focus();
        } else if (ta) {
          ta.remove();
        }
      };
    }
    const form = document.getElementById("todo-add-form");
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const textInput = document.getElementById("todo-input-text");
        const dueInput = document.getElementById("todo-input-due");
        const detailInput = document.getElementById("todo-input-detail");
        addTodo(textInput.value, dueInput.value, detailInput ? detailInput.value : "");
        todoUi.dueInput = dueInput.value;
        todoUi.formDetailMode = false;
        renderApp();
        const nt = document.getElementById("todo-input-text");
        if (nt) nt.focus();
      };
      const dueInput = document.getElementById("todo-input-due");
      if (dueInput) dueInput.onchange = (e) => { todoUi.dueInput = e.target.value; };
    }
  }

  /* ===================== 업무 정리(메모) 모듈 ===================== */
  const NOTES_KEY = acctKey("personal-notes:data");
  const UNFILED = "unfiled";

