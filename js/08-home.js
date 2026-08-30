  function renderHomePage(root) {
    const y = today.getFullYear(), m = today.getMonth(), d = today.getDate();
    const iso = todayISO();
    const holiday = getHoliday(iso);
    const wd = WEEKDAYS[today.getDay()];

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
      const flags = [];
      if (s.record.attendance === "LATE") flags.push('<span class="flag late">지각</span>');
      if (s.record.attendance === "ABSENT") flags.push('<span class="flag absent">결근</span>');
      if (s.record.status !== "WORK") {
        const meta = SCHEDULE_STATUS_META[s.record.status];
        flags.push(`<span class="flag off">${esc(meta ? meta.label : "휴무")}</span>`);
      }
      const typeBadges = (s.types || []).map((t) => `<span class="badge sm ${t === "유선" ? "voice" : "chat"}">${esc(t)}</span>`).join("");
      return `
        <div class="home-staff-row ${s.record.status !== "WORK" ? "is-off" : ""}">
          <span class="name">${esc(s.name)}</span>
          ${typeBadges}
          <span class="spacer"></span>
          ${flags.join("")}
        </div>`;
    }

    let scheduleSectionHtml;
    if (staffList.length === 0) {
      scheduleSectionHtml = `<div class="home-empty">등록된 상담사가 없어요. "상담사 관리"에서 추가해보세요.</div>`;
    } else {
      const parts = [];
      if (dayWorking.length) parts.push(`<div class="staff-group-label">${ICON_SUN} 주간 근무 (${dayWorking.length}명)</div><div class="home-staff-list">${dayWorking.map(staffRowHtml).join("")}</div>`);
      if (nightWorking.length) parts.push(`<div class="staff-group-label">${ICON_MOON} 야간 근무 (${nightWorking.length}명)</div><div class="home-staff-list">${nightWorking.map(staffRowHtml).join("")}</div>`);
      if (absentList.length) parts.push(`<div class="staff-group-label">결근</div><div class="home-staff-list">${absentList.map(staffRowHtml).join("")}</div>`);
      if (parts.length === 0) parts.push(`<div class="home-empty">오늘 근무 인원이 없어요.</div>`);
      scheduleSectionHtml = parts.join("");
    }

    /* ---- 오늘 일정 (캘린더) ---- */
    const todayEntries = sortEntries(readMonthRaw(y, m)[pad2(d)] || []);
    const entriesHtml = todayEntries.length === 0
      ? `<div class="home-empty">오늘 등록된 일정이 없어요.</div>`
      : `<div class="home-entry-list">${todayEntries.map((e) => `
        <div class="home-entry-row ${e.type === "event" ? "event" : ""}">
          ${e.priority && !e.done ? '<span class="star">★</span>' : ""}
          ${e.time ? `<span class="time">${esc(e.time)}</span>` : ""}
          <span class="text" style="${e.done ? "text-decoration:line-through;color:var(--text-faint);" : ""}">${esc(e.text)}</span>
        </div>`).join("")}</div>`;

    /* ---- 할 일: 오늘 마감이거나 이미 지난 할 일 ---- */
    const todoRelevant = todos
      .filter((t) => !t.done && (!t.due || t.due <= iso))
      .sort((a, b) => (a.due || "").localeCompare(b.due || ""));
    const remainingCount = todos.filter((t) => !t.done).length;
    const todoHtml = todoRelevant.length === 0
      ? `<div class="home-empty">오늘까지 마감인 할 일이 없어요.</div>`
      : `<div class="home-todo-list">${todoRelevant.slice(0, 6).map((t) => {
          const isOver = t.due && t.due < iso;
          return `<div class="home-todo-row">
            <span>${esc(t.text)}</span>
            ${t.due ? `<span class="due ${isOver ? "over" : ""}">${formatTodoDue(t.due)}${isOver ? " · 지남" : " · 오늘"}</span>` : ""}
          </div>`;
        }).join("")}</div>`;

    /* ---- 고정 메모 ---- */
    const pinnedNotes = notesData.pinnedOrder.map((id) => notesData.notes[id]).filter(Boolean);
    const notesHtml = pinnedNotes.length === 0
      ? `<div class="home-empty">고정된 메모가 없어요.</div>`
      : `<div class="home-note-list">${pinnedNotes.slice(0, 5).map((n) => `
          <div class="home-note-row" data-note-nav="notes">
            <div>${esc(n.title)}</div>
            ${n.content ? `<div class="snippet">${esc(n.content)}</div>` : ""}
          </div>`).join("")}</div>`;

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
      ? `<div class="home-empty">최근 ${NO_INTERVIEW_DAYS}일 내 면담 기록이 없는 상담사가 없어요.</div>`
      : `<div class="home-staff-list">${interviewAlertShown.map((x) => `
          <div class="home-staff-row">
            <span class="name">${esc(x.agent.name)}</span>
            <span class="spacer"></span>
            <span class="flag late">${x.lastDate ? `마지막 면담 ${x.lastDate}` : "면담 기록 없음"}</span>
          </div>`).join("")}</div>${interviewAlertHasMore ? `
          <button class="home-more-btn" id="btn-interview-alert-toggle" type="button">
            ${homeUi.interviewAlertExpanded ? "접기 ▲" : `전체 ${staleInterviewAgents.length}명 보기 ▾`}
          </button>` : ""}`;

    root.innerHTML = `
      <div class="card home-hero">
        <div>
          <div class="home-hero-date">${y}년 ${m + 1}월 ${d}일 <span class="wd">${wd}요일</span></div>
          <div class="home-hero-sub">오늘 하루를 한눈에 확인해보세요</div>
        </div>
        ${holiday ? `<span class="home-holiday-tag">${esc(holiday)}</span>` : ""}
      </div>

      <div class="card" style="margin-top:16px;">
        <div class="stat-grid">
          <div class="stat-item ok"><div class="stat-num">${working.length}</div><div class="stat-label">오늘 근무</div></div>
          <div class="stat-item warn"><div class="stat-num">${lateList.length + absentList.length}</div><div class="stat-label">지각·결근</div></div>
          <div class="stat-item"><div class="stat-num">${offList.length}</div><div class="stat-label">휴무·연차 등</div></div>
          <div class="stat-item accent"><div class="stat-num">${remainingCount}</div><div class="stat-label">남은 할 일</div></div>
          <div class="stat-item"><div class="stat-num">${totalAgents}</div><div class="stat-label">전체 상담사</div></div>
        </div>
      </div>

      <div class="home-grid has-status-col" style="margin-top:20px;">
        <div class="home-col home-col-status">
          <div class="card">
            <div class="home-section-title"><h3>${ICON_USERS} 오늘 근무 현황</h3><button class="home-section-link" data-nav="schedule">스케줄 보기 ›</button></div>
            ${scheduleSectionHtml}
          </div>
        </div>
        <div class="home-col">
          <div class="card">
            <div class="home-section-title"><h3>${ICON_CALENDAR} 오늘 일정</h3><button class="home-section-link" data-nav="calendar">캘린더 보기 ›</button></div>
            ${entriesHtml}
          </div>
          <div class="card">
            <div class="home-section-title"><h3>${ICON_BELL} 면담 필요 알림</h3><button class="home-section-link" data-nav="interviews">면담일지 보기 ›</button></div>
            ${staleInterviewHtml}
          </div>
        </div>
        <div class="home-col">
          <div class="card">
            <div class="home-section-title"><h3>${ICON_CHECK} 할 일</h3></div>
            ${todoHtml}
          </div>
          <div class="card">
            <div class="home-section-title"><h3>${ICON_PIN} 고정 메모</h3><button class="home-section-link" data-nav="notes">업무 정리 보기 ›</button></div>
            ${notesHtml}
          </div>
        </div>
      </div>
    `;

    root.querySelectorAll("[data-nav]").forEach((btn) => {
      btn.onclick = () => setPage(btn.getAttribute("data-nav"));
    });
    root.querySelectorAll("[data-note-nav]").forEach((el) => {
      el.onclick = () => setPage(el.getAttribute("data-note-nav"));
    });
    const interviewAlertToggleBtn = document.getElementById("btn-interview-alert-toggle");
    if (interviewAlertToggleBtn) {
      interviewAlertToggleBtn.onclick = () => {
        homeUi.interviewAlertExpanded = !homeUi.interviewAlertExpanded;
        renderHomePage(root);
      };
    }
  }

