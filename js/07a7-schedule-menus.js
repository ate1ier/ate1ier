  // 07a7-schedule-menus.js — 삭제/미리보기/캡처 메뉴
  // (07-schedule.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  function scheduleDeleteTargets(scope, year, monthIndex) {
    const monthStaff = getStaffListForMonth(year, monthIndex);
    if (scope === "ALL") return monthStaff;
    if (scope === "ADMIN") return monthStaff.filter((s) => s.isAdmin);
    const nonAdmin = monthStaff.filter((s) => !s.isAdmin);
    const dayStaff = nonAdmin.filter((s) => s.group !== "night");
    const nightStaff = nonAdmin.filter((s) => s.group === "night");
    if (scope === "DAY_CHAT") return splitByType(dayStaff).chat;
    if (scope === "DAY_VOICE") return splitByType(dayStaff).voice;
    if (scope === "NIGHT_CHAT") return splitByType(nightStaff).chat;
    if (scope === "NIGHT_VOICE") return splitByType(nightStaff).voice;
    return [];
  }

  function scheduleBulkDelete(scope) {
    const meta = SCHEDULE_DELETE_SCOPES.find((s) => s.key === scope);
    const label = meta ? meta.label.replace(/ 삭제$/, "") : "선택한";
    const { year, monthIndex } = scheduleUi;
    if (scheduleIsMonthLocked(year, monthIndex)) {
      flashScheduleStatus("이 달은 잠겨 있어요. 잠금을 해제한 뒤 삭제해주세요.");
      return;
    }
    const targetStaff = scheduleDeleteTargets(scope, year, monthIndex);

    if (targetStaff.length === 0) {
      flashScheduleStatus(`${label} 대상 인원이 없어요.`);
      return;
    }
    const ok = window.confirm(
      `${scheduleMonthLabel()} "${label}" 일정을 모두 삭제할까요?\n대상 인원 ${targetStaff.length}명 · 이 달의 모든 날짜가 기본값(근무)으로 되돌아가요. (Ctrl+Z로 되돌리기 가능)`
    );
    if (!ok) return;

    recordUndo(`${label} 일괄 삭제`, SCHEDULE_KEY, reloadScheduleData);
    const numDays = scheduleDaysInMonth(year, monthIndex);
    let cleared = 0;
    targetStaff.forEach((s) => {
      for (let d = 1; d <= numDays; d++) {
        const dateKey = scheduleDateKey(year, monthIndex, d);
        const key = scheduleRecordKey(s.id, dateKey);
        if (scheduleData.records[key]) {
          delete scheduleData.records[key];
          cleared += 1;
        }
      }
    });
    saveScheduleData();
    updateScheduleTableArea();
    flashScheduleStatus(cleared > 0 ? `${label} 일정 삭제됨 (${targetStaff.length}명 · ${cleared}칸)` : `${label}에는 삭제할 일정이 없었어요.`);
  }

  function openScheduleDeleteMenu(anchorEl) {
    closeScheduleMenu();
    const rect = anchorEl.getBoundingClientRect();
    const menu = document.createElement("div");
    menu.id = "sch-menu";
    menu.className = "sch-menu";
    menu.innerHTML = SCHEDULE_DELETE_SCOPES.map((o, idx) => {
      const divider = idx === 1 ? `<div class="sch-menu-divider"></div>` : "";
      return `${divider}<button type="button" class="${o.danger ? "sch-menu-danger" : ""}" data-scope="${o.key}">${o.danger ? ICON_TRASH + " " : ""}${o.label}</button>`;
    }).join("");
    document.body.appendChild(menu);
    const top = Math.min(rect.bottom + 4, window.innerHeight - menu.offsetHeight - 8);
    const left = Math.min(rect.left, window.innerWidth - menu.offsetWidth - 8);
    menu.style.top = `${Math.max(8, top)}px`;
    menu.style.left = `${Math.max(8, left)}px`;
    menu.querySelectorAll("button[data-scope]").forEach((btn) => {
      btn.onclick = () => {
        const scope = btn.getAttribute("data-scope");
        closeScheduleMenu();
        scheduleBulkDelete(scope);
      };
    });
    setTimeout(() => document.addEventListener("mousedown", scheduleMenuOutsideHandler, true), 0);
  }

  // ----- 이미지로 저장: 다운로드 전 미리보기 모달 -----
  function closeSchedulePreview() {
    const existing = document.getElementById("sch-preview-overlay");
    if (existing) existing.remove();
    document.removeEventListener("keydown", schedulePreviewEscHandler, true);
  }
  function schedulePreviewEscHandler(e) {
    if (e.key === "Escape") closeSchedulePreview();
  }
  // dataUrl: html2canvas로 만든 캡처 이미지, filename: 실제 다운로드할 때 쓸 파일명,
  // modeName: "주간"/"유선" 등 캡처 모드 이름 (전체 저장이면 null)
  function openSchedulePreview(dataUrl, filename, modeName) {
    closeSchedulePreview();
    const overlay = document.createElement("div");
    overlay.id = "sch-preview-overlay";
    overlay.className = "sch-preview-overlay";
    overlay.innerHTML = `
      <div class="sch-preview-box">
        <div class="sch-preview-head">
          <span>${modeName ? `${esc(modeName)} 이미지 미리보기` : "이미지 미리보기"}</span>
          <button type="button" class="sch-preview-close" id="sch-preview-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="sch-preview-body">
          <img src="${dataUrl}" alt="월별 스케줄 캡처 미리보기">
        </div>
        <div class="sch-preview-actions">
          <button type="button" class="ghost-btn" id="sch-preview-cancel">닫기</button>
          <button type="button" class="primary-btn" id="sch-preview-download">${ICON_DOWNLOAD} 이미지 다운로드</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeSchedulePreview(); };
    document.getElementById("sch-preview-close-x").onclick = () => closeSchedulePreview();
    document.getElementById("sch-preview-cancel").onclick = () => closeSchedulePreview();
    document.getElementById("sch-preview-download").onclick = () => {
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
      closeSchedulePreview();
      flashScheduleStatus("이미지 저장됨");
    };
    setTimeout(() => document.addEventListener("keydown", schedulePreviewEscHandler, true), 0);
  }

  // ----- 월별 스케줄 이미지로 저장: 전체/주간/야간/유선/채팅 -----
  // 유선·채팅은 주야간을 통합해서 한 장으로 캡처하되, 캡처 이미지 안에서는
  // 주간/야간 구획을 나눠서 보여준다. (buildScheduleTableHtml·buildScheduleLogHtml 참고)
  const SCHEDULE_CAPTURE_MODES = [
    { key: "ALL", label: "전체 저장" },
    { key: "ADMIN", label: "관리자 저장" },
    { key: "DAY", label: "주간 저장" },
    { key: "NIGHT", label: "야간 저장" },
    { key: "VOICE", label: "유선 저장" },
    { key: "CHAT", label: "채팅 저장" },
  ];

  function openScheduleCaptureMenu(anchorEl) {
    closeScheduleMenu();
    const rect = anchorEl.getBoundingClientRect();
    const menu = document.createElement("div");
    menu.id = "sch-menu";
    menu.className = "sch-menu";
    menu.innerHTML = SCHEDULE_CAPTURE_MODES.map((o) =>
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
        closeScheduleMenu();
        captureSchedulePage(mode);
      };
    });
    setTimeout(() => document.addEventListener("mousedown", scheduleMenuOutsideHandler, true), 0);
  }

  // "이번 달 지각·결근 기록" 영역의 "되돌리기" 버튼에 클릭 이벤트를 연결한다.
  // 이 영역은 되돌리기를 누를 때마다 통째로 다시 그려지므로, 매번 다시 호출해서
  // 새로 그려진 버튼에도 이벤트가 붙도록 해야 한다.
  function attachScheduleLogHandlers(root) {
    root.querySelectorAll("[data-action='clear-sch-attendance']").forEach((btn) => {
      btn.onclick = () => {
        setScheduleRecord(btn.getAttribute("data-staff-id"), btn.getAttribute("data-date"), { attendance: null, status: "WORK" });
        updateScheduleTableArea();
      };
    });
  }

  // "숨긴 열/행" 패널에 나열할 칩들의 HTML을 만든다. 연속 날짜는 범위로, 한 번에 같이
  // 접은 정보 칸/인원/집계행 묶음(2개 이상)은 한 칩으로 묶어서 보여준다.
  function scheduleHiddenItemsListHtml() {
    const effectiveBatches = scheduleEffectiveHiddenBatches();
    const coveredInfoCols = new Set();
    const coveredStaffIds = new Set();
    const coveredSummaryRows = new Set();
    effectiveBatches.forEach((b) => {
      b.infoCols.forEach((k) => coveredInfoCols.add(k));
      b.staffIds.forEach((k) => coveredStaffIds.add(k));
      b.summaryRows.forEach((k) => coveredSummaryRows.add(k));
    });
    const batchLabel = (b) => {
      const parts = [];
      b.infoCols.forEach((key) => {
        const col = SCHEDULE_INFO_COLS.find((c) => c.key === key);
        parts.push(esc(col ? col.label : key));
      });
      b.staffIds.forEach((id) => {
        const staff = getStaffListForMonth(scheduleUi.year, scheduleUi.monthIndex).find((s) => s.id === id);
        parts.push(esc(staff ? staff.nickname : "(알 수 없음)"));
      });
      b.summaryRows.forEach((key) => parts.push(esc(schedulePrettyRowKey(key))));
      return parts.join(", ");
    };
    return `
      ${scheduleGroupConsecutiveDays(scheduleUi.manualHiddenDays).map((r) => `
        <span class="schedule-colgroup-chip">
          ${pad2(scheduleUi.monthIndex + 1)}/${pad2(r.start)}${r.end > r.start ? `~${pad2(scheduleUi.monthIndex + 1)}/${pad2(r.end)}` : ""}
          <button class="sch-colgroup-toggle-btn" data-unhide-day-range="${r.start}-${r.end}">펼치기</button>
        </span>
      `).join("")}
      ${effectiveBatches.map((b) => `
        <span class="schedule-colgroup-chip">
          ${batchLabel(b)}
          <button class="sch-colgroup-toggle-btn" data-unhide-batch="${b.id}">펼치기</button>
        </span>
      `).join("")}
      ${Array.from(scheduleUi.manualHiddenInfoCols).filter((key) => !coveredInfoCols.has(key)).map((key) => {
        const col = SCHEDULE_INFO_COLS.find((c) => c.key === key);
        return `
        <span class="schedule-colgroup-chip">
          ${esc(col ? col.label : key)}
          <button class="sch-colgroup-toggle-btn" data-unhide-infocol="${esc(key)}">펼치기</button>
        </span>
      `;
      }).join("")}
      ${Array.from(scheduleUi.manualHiddenStaffIds).filter((id) => !coveredStaffIds.has(id)).map((id) => {
        const staff = getStaffListForMonth(scheduleUi.year, scheduleUi.monthIndex).find((s) => s.id === id);
        return `
        <span class="schedule-colgroup-chip">
          ${esc(staff ? staff.nickname : "(알 수 없음)")}
          <button class="sch-colgroup-toggle-btn" data-unhide-staff="${id}">펼치기</button>
        </span>
      `;
      }).join("")}
      ${Array.from(scheduleUi.manualHiddenSummaryRows).filter((key) => !coveredSummaryRows.has(key)).map((key) => `
        <span class="schedule-colgroup-chip">
          ${esc(schedulePrettyRowKey(key))}
          <button class="sch-colgroup-toggle-btn" data-unhide-summaryrow="${esc(key)}">펼치기</button>
        </span>
      `).join("")}
    `;
  }

