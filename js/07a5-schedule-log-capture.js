  // 07a5-schedule-log-capture.js — 변경 로그, 표 크기 맞춤, 이미지 캡처
  // (07-schedule.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  function scheduleLogStaffForFilter(monthStaff, filterMode) {
    if (!filterMode) return monthStaff;
    if (filterMode === "ADMIN") return monthStaff.filter((s) => s.isAdmin);
    const nonAdmin = monthStaff.filter((s) => !s.isAdmin);
    if (filterMode === "DAY") return nonAdmin.filter((s) => s.group !== "night");
    if (filterMode === "NIGHT") return nonAdmin.filter((s) => s.group === "night");
    if (filterMode === "VOICE") return nonAdmin.filter((s) => (s.types || []).indexOf("유선") !== -1);
    if (filterMode === "CHAT") return nonAdmin.filter((s) => (s.types || []).indexOf("채팅") !== -1);
    return monthStaff;
  }

  function buildScheduleLogHtml(filterMode) {
    const { year, monthIndex } = scheduleUi;
    const numDays = scheduleDaysInMonth(year, monthIndex);
    const monthStaff = scheduleLogStaffForFilter(getStaffListForMonth(year, monthIndex), filterMode);
    const entries = [];
    for (let d = 1; d <= numDays; d++) {
      const dateKey = scheduleDateKey(year, monthIndex, d);
      monthStaff.forEach((s) => {
        const rec = scheduleData.records[scheduleRecordKey(s.id, dateKey)];
        if (rec && rec.attendance) {
          entries.push({ dateKey, d, staff: s, attendance: rec.attendance });
        }
      });
    }
    if (entries.length === 0) {
      return `<div class="agent-list-empty">이번 달에는 등록된 지각·결근 기록이 없어요.</div>`;
    }
    const items = entries.map((e) => {
      const tagCls = e.attendance === "LATE" ? "late" : "absent";
      const tagLabel = e.attendance === "LATE" ? "지각" : "결근";
      return `
        <div class="sch-log-item">
          <span class="sch-log-date">${pad2(monthIndex + 1)}/${pad2(e.d)}</span>
          <span class="sch-log-name">${esc(e.staff.nickname)} · ${esc(e.staff.name)}</span>
          <span class="sch-log-tag ${tagCls}">${tagLabel}</span>
          <button class="sch-staff-btn sch-log-clear" data-action="clear-sch-attendance" data-staff-id="${e.staff.id}" data-date="${e.dateKey}">되돌리기</button>
        </div>
      `;
    }).join("");
    return `<div class="sch-log-list">${items}</div>`;
  }

  function syncScheduleLogWidth() {
    const tableWrap = document.querySelector("#schedule-table-area .schedule-table-wrap");
    const logArea = document.getElementById("schedule-log-area");
    if (!tableWrap || !logArea) return;
    const w = tableWrap.offsetWidth;
    if (w > 0) {
      logArea.style.width = `${w}px`;
      logArea.style.maxWidth = "100%";
    }
  }

  // 메인 페이지의 월별 스케줄 표는 가로 스크롤 없이 항상 한 화면에 다 보이도록,
  // 표를 원래 크기로 그린 뒤 폭에 맞춰 JS로 축소(scale)한다.
  // (예전엔 축소 비율이 일정 밑으로 내려가면 더 줄이지 않고 가로 스크롤로 넘기게 했었는데,
  //  그러면 오른쪽 날짜 칸들이 화면 밖으로 잘려서 안 보이는 문제가 있었다. 그래서 지금은
  //  글씨가 아무리 작아지더라도 항상 폭에 딱 맞춰 전체 날짜가 한 번에 다 보이게 한다.)
  function fitScheduleTable() {
    const wrap = document.querySelector("#schedule-table-area .schedule-table-wrap");
    const inner = wrap ? wrap.querySelector(".schedule-scale-inner") : null;
    const table = inner ? inner.querySelector("table") : null;
    if (!wrap || !inner || !table) return;
    inner.style.transform = "none";
    inner.style.width = "auto";
    inner.style.height = "auto";
    wrap.style.height = "auto";
    // 모바일 화면에서는 표를 억지로 축소해서 글씨를 읽을 수 없게 만드는 대신,
    // 표를 원래 크기 그대로 두고 가로 스크롤(스크린 좌우로 넘기기)로 보게 한다.
    // (고정된 인원 정보 열이 sticky로 남아있어 스크롤해도 어떤 상담사인지 계속 보임)
    if (window.innerWidth <= 720) return;
    const naturalW = table.offsetWidth;
    const naturalH = table.offsetHeight;
    const availW = wrap.clientWidth;
    if (naturalW <= 0 || availW <= 0) return;
    const scale = Math.min(availW / naturalW, 1);
    const scaledW = naturalW * scale;
    const offsetX = Math.max(0, (availW - scaledW) / 2);
    inner.style.width = `${naturalW}px`;
    inner.style.height = `${naturalH}px`;
    inner.style.transform = `translateX(${offsetX}px) scale(${scale})`;
    wrap.style.overflowX = "hidden";
    wrap.style.height = `${naturalH * scale}px`;
  }

  // wrap의 너비를 안정적으로 관찰해서, 폰트 늦게 로드/레이아웃 지연/화면 회전 등
  // 어떤 이유로 폭이 나중에 바뀌더라도 항상 다시 맞춤 계산되도록 한다.
  // (단순 window resize 이벤트만으로는 컨테이너 폭만 바뀌는 경우를 놓칠 수 있음)
  let _scheduleFitObserver = null;
  function watchScheduleTableSize() {
    const wrap = document.querySelector("#schedule-table-area .schedule-table-wrap");
    if (!wrap) return;
    if (_scheduleFitObserver) _scheduleFitObserver.disconnect();
    if (typeof ResizeObserver === "undefined") return;
    let lastW = 0;
    _scheduleFitObserver = new ResizeObserver((entries) => {
      const w = entries[0] && entries[0].contentRect ? entries[0].contentRect.width : 0;
      if (Math.abs(w - lastW) < 1) return;
      lastW = w;
      fitScheduleTable();
      syncScheduleLogWidth();
    });
    _scheduleFitObserver.observe(wrap);
  }

  function updateScheduleTableArea() {
    const tableArea = document.getElementById("schedule-table-area");
    const logArea = document.getElementById("schedule-log-area");
    if (tableArea) {
      tableArea.innerHTML = `<div class="schedule-table-wrap"><div class="schedule-scale-inner">${buildScheduleTableHtml()}</div></div>`;
      attachScheduleTableHandlers(tableArea);
    }
    if (logArea) {
      logArea.innerHTML = buildScheduleLogHtml();
      attachScheduleLogHandlers(logArea);
    }
    fitScheduleTable();
    syncScheduleLogWidth();
    watchScheduleTableSize();
  }

  // 월별 스케줄 표를 통째로 PNG 이미지로 캡처해서 다운로드한다.
  // 화면에 보이는 축소된 표 대신, 화면 밖에 원본 크기 그대로 다시 그려서 캡처하기 때문에
  // 화면 크기와 상관없이 항상 선명하고 잘리지 않은 이미지가 만들어진다.
  // 캡처 이미지의 배경/글자/범례 색은 하드코딩하지 않고, 캡처하는 시점에 실제 적용 중인
  // 다크모드/라이트모드 색상 변수를 그대로 읽어와 사용한다. (라이트모드에서 캡처해도
  // 검은 배경으로 나오지 않고, 현재 화면과 같은 톤으로 저장됨)
  // mode: "ALL"(기본, 전체) / "DAY"(주간) / "NIGHT"(야간) / "VOICE"(유선, 주야간 통합)
  // / "CHAT"(채팅, 주야간 통합). buildScheduleTableHtml·buildScheduleLogHtml에는
  // "ALL"일 때만 filterMode 없이(undefined) 넘겨서 지금까지와 완전히 같은 전체 표를 유지한다.
  function captureSchedulePage(mode) {
    const captureMode = mode || "ALL";
    const modeMeta = SCHEDULE_CAPTURE_MODES.find((m) => m.key === captureMode) || SCHEDULE_CAPTURE_MODES[0];
    const modeName = modeMeta.label.replace(/ 저장$/, "");
    const tableFilter = captureMode === "ALL" ? undefined : captureMode;
    const btn = document.getElementById("sch-capture-btn");
    if (typeof html2canvas === "undefined") {
      flashScheduleStatus("캡처 기능을 불러오지 못했어요 (인터넷 연결 확인)");
      return;
    }
    if (btn) { btn.disabled = true; btn.textContent = "이미지 생성 중..."; }

    const cs = getComputedStyle(document.documentElement);
    const themeColor = (name) => cs.getPropertyValue(name).trim();
    const cBg = themeColor("--bg");
    const cText = themeColor("--text");
    const cTextDim = themeColor("--text-dim");
    const cBlue = themeColor("--blue");
    const cOrange = themeColor("--orange");
    const cGreen = themeColor("--green");
    const cSalmon = themeColor("--salmon");
    const cTeal = themeColor("--teal");
    const cPurple = themeColor("--purple");
    const cPink = themeColor("--pink");
    const cIndigo = themeColor("--indigo");
    const cEdu = themeColor("--edu");
    const cYellow = themeColor("--yellow");
    const cRed = themeColor("--red");
    const cFaint = themeColor("--text-faint");

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
    const lockedTag = scheduleIsMonthLocked(scheduleUi.year, scheduleUi.monthIndex) ? " · 확정됨" : "";
    const titleSuffix = captureMode === "ALL" ? "" : ` · ${modeName}`;
    wrapper.innerHTML = `
      <div style="font-size:22px;margin-bottom:4px;color:${cText};">월별 스케줄${titleSuffix}</div>
      <div style="font-size:15px;color:${cTextDim};margin-bottom:16px;">${esc(scheduleMonthLabel())}${lockedTag} · 캡처일 ${esc(todayISO())}</div>
      <div class="schedule-legend" style="margin-bottom:14px;">
        <span class="item"><span class="swatch" style="background:${cBlue};"></span>오프</span>
        <span class="item"><span class="swatch" style="background:${cOrange};"></span>연차</span>
        <span class="item"><span class="swatch" style="background:${cGreen};"></span>대휴</span>
        <span class="item"><span class="swatch" style="background:${cSalmon};"></span>반차</span>
        <span class="item"><span class="swatch" style="background:${cTeal};"></span>공휴</span>
        <span class="item"><span class="swatch" style="background:${cPurple};"></span>공가</span>
        <span class="item"><span class="swatch" style="background:${cPink};"></span>육휴</span>
        <span class="item"><span class="swatch" style="background:${cIndigo};"></span>특휴</span>
        <span class="item"><span class="swatch" style="background:${cEdu};"></span>교육</span>
        <span class="item"><span class="swatch" style="background:${cYellow};"></span>지각</span>
        <span class="item"><span class="swatch" style="background:${cRed};"></span>결근</span>
        <span class="item"><span class="swatch" style="background:${cFaint};"></span>퇴사</span>
      </div>
      ${buildScheduleTableHtml(tableFilter, true, true, true)}
    `;
    document.body.appendChild(wrapper);

    function cleanup(label) {
      if (wrapper.parentNode) document.body.removeChild(wrapper);
      if (btn) { btn.disabled = false; btn.innerHTML = ICON_CAMERA + " 이미지로 저장 ▾"; }
      if (label) flashScheduleStatus(label);
    }

    requestAnimationFrame(() => {
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
        const filename = `상담사_스케줄${fileSuffix}_${scheduleUi.year}-${pad2(scheduleUi.monthIndex + 1)}.png`;
        const dataUrl = canvas.toDataURL("image/png");
        cleanup("");
        openSchedulePreview(dataUrl, filename, captureMode === "ALL" ? null : modeName);
      }).catch((err) => {
        console.error(err);
        cleanup("캡처 실패");
      });
    });
  }

  function closeScheduleMenu() {
    const existing = document.getElementById("sch-menu");
    if (existing) existing.remove();
    document.removeEventListener("mousedown", scheduleMenuOutsideHandler, true);
    scheduleClearSelection();
  }
  function scheduleMenuOutsideHandler(e) {
    const menu = document.getElementById("sch-menu");
    if (menu && !menu.contains(e.target)) closeScheduleMenu();
  }
  // ----- 스케줄 셀 드래그로 여러 칸 선택 후 한 번에 상태 적용 -----
  // 마우스로 셀을 누른 채 다른 셀 위로 드래그하면(행·열 사각형 범위) 선택되고,
  // 뗄 때 상태 선택 메뉴가 한 번만 뜬다. 드래그 없이 그냥 클릭하면 기존처럼
  // 그 칸 하나만 다루는 메뉴(openScheduleMenu)가 뜬다.
  let scheduleSelectDragging = false;
  let scheduleSelectMoved = false;
  let scheduleSelectAnchor = null; // { rowIdx, day }
  let scheduleSelectCurrent = null; // { rowIdx, day }

