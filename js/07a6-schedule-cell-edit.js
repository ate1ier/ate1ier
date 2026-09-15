  // 07a6-schedule-cell-edit.js — 셀 선택/편집/키보드 핸들링
  // (07-schedule.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  function scheduleSelectionRectCells(root, anchor, current) {
    if (!root || !anchor || !current) return [];
    const minRow = Math.min(anchor.rowIdx, current.rowIdx);
    const maxRow = Math.max(anchor.rowIdx, current.rowIdx);
    const minDay = Math.min(anchor.day, current.day);
    const maxDay = Math.max(anchor.day, current.day);
    return Array.from(root.querySelectorAll(".sch-cell")).filter((cell) => {
      const rowIdx = Number(cell.getAttribute("data-row-idx"));
      const day = Number(cell.getAttribute("data-day"));
      return rowIdx >= minRow && rowIdx <= maxRow && day >= minDay && day <= maxDay;
    });
  }
  function scheduleApplySelectionHighlight() {
    const root = document.getElementById("schedule-table-area");
    if (!root) return;
    const selected = new Set(scheduleSelectionRectCells(root, scheduleSelectAnchor, scheduleSelectCurrent));
    root.querySelectorAll(".sch-cell").forEach((cell) => {
      cell.classList.toggle("sch-cell--selected", selected.has(cell));
    });
  }
  function scheduleClearSelection() {
    scheduleSelectDragging = false;
    scheduleSelectMoved = false;
    scheduleSelectAnchor = null;
    scheduleSelectCurrent = null;
    const root = document.getElementById("schedule-table-area");
    if (root) root.querySelectorAll(".sch-cell--selected").forEach((cell) => cell.classList.remove("sch-cell--selected"));
  }
  // 선택된 여러 칸에 상태를 한 번에 적용한다. 칸마다 저장하지 않고 한 번만 저장/동기화한다.
  function scheduleApplyBulk(cells, patch) {
    if (cells.length) recordUndo(`셀 ${cells.length}개 일괄 변경`, SCHEDULE_KEY, reloadScheduleData);
    cells.forEach((cell) => {
      const staffId = cell.getAttribute("data-staff-id");
      const dateKey = cell.getAttribute("data-date");
      const key = scheduleRecordKey(staffId, dateKey);
      const cur = scheduleData.records[key] || { status: "WORK", attendance: null };
      const next = Object.assign({}, cur, patch);
      if (next.status === "WORK" && !next.attendance) delete scheduleData.records[key];
      else scheduleData.records[key] = next;
    });
    saveScheduleData();
  }
  const SCHEDULE_STATUS_OPTIONS = [
    ["WORK", null, "근무"],
    ["OFF", null, "오프"],
    ["ANNUAL", null, "연차"],
    ["DAEHYU", null, "대휴"],
    ["HALF", null, "반차"],
    ["GONGHYU", null, "공휴"],
    ["GONGGA", null, "공가"],
    ["MATERNITY", null, "육휴"],
    ["SPECIAL", null, "특휴"],
    ["EDUCATION", null, "교육"],
    ["WORK", "LATE", "지각"],
    ["WORK", "ABSENT", "결근"],
    ["RESIGNED", null, "퇴사"],
  ];
  function openScheduleBulkMenu(cells, evt) {
    // 선택 범위 안에 잠긴 달의 날짜가 하나라도 있으면 전체를 막는다 (개별 셀 잠금 규칙과 동일).
    const lockedFound = cells.some((cell) => scheduleIsDateLocked(cell.getAttribute("data-date")));
    if (lockedFound) {
      flashScheduleStatus("선택한 범위에 잠긴 달이 포함돼 있어요. 잠금을 해제한 뒤 다시 선택해주세요.");
      scheduleClearSelection();
      return;
    }
    closeScheduleMenu();
    cells.forEach((cell) => cell.classList.add("sch-cell--selected")); // closeScheduleMenu가 지운 하이라이트를 다시 표시
    const menu = document.createElement("div");
    menu.id = "sch-menu";
    menu.className = "sch-menu";
    menu.innerHTML = `<div class="sch-menu-title">${cells.length}칸 선택됨</div>` +
      SCHEDULE_STATUS_OPTIONS.map((o) =>
        `<button type="button" data-status="${o[0]}" data-attendance="${o[1] || ""}">${o[2]}</button>`
      ).join("") +
      `<button type="button" class="sch-menu-reset" data-reset="1">기본값(근무)으로</button>`;
    document.body.appendChild(menu);
    const clientX = evt ? evt.clientX : window.innerWidth / 2;
    const clientY = evt ? evt.clientY : window.innerHeight / 2;
    const top = Math.min(clientY + 4, window.innerHeight - menu.offsetHeight - 8);
    const left = Math.min(clientX, window.innerWidth - menu.offsetWidth - 8);
    menu.style.top = `${Math.max(8, top)}px`;
    menu.style.left = `${Math.max(8, left)}px`;
    function applyAndClose(status, attendance) {
      scheduleApplyBulk(cells, { status, attendance: attendance || null });
      closeScheduleMenu();
      updateScheduleTableArea();
      flashScheduleStatus(`${cells.length}칸에 적용했어요.`);
    }
    menu.querySelectorAll("button[data-status]").forEach((btn) => {
      btn.onclick = () => applyAndClose(btn.getAttribute("data-status"), btn.getAttribute("data-attendance"));
    });
    const resetBtn = menu.querySelector("[data-reset]");
    if (resetBtn) resetBtn.onclick = () => applyAndClose("WORK", null);
    setTimeout(() => document.addEventListener("mousedown", scheduleMenuOutsideHandler, true), 0);
  }
  // 마우스를 뗄 때(문서 전체 기준): 드래그해서 여러 칸을 옮겨다녔으면 일괄 적용 메뉴를 띄우고,
  // 그냥 제자리에서 뗐으면(=클릭) 선택만 풀고 끝낸다. 그 칸 하나의 메뉴(상태 변경 등)는
  // 더 이상 왼쪽 클릭으로 열리지 않고, 셀의 오른쪽 클릭(우클릭, oncontextmenu)으로 연다.
  function scheduleSelectionMouseUpHandler(e) {
    if (!scheduleSelectDragging) return;
    const root = document.getElementById("schedule-table-area");
    const wasMoved = scheduleSelectMoved;
    const anchor = scheduleSelectAnchor;
    const current = scheduleSelectCurrent;
    scheduleSelectDragging = false;
    if (wasMoved && root) {
      const cells = scheduleSelectionRectCells(root, anchor, current);
      if (cells.length > 1) {
        openScheduleBulkMenu(cells, e);
        return;
      }
    }
    scheduleClearSelection();
  }
  document.addEventListener("mouseup", scheduleSelectionMouseUpHandler);

  function openScheduleMenu(anchorEl, staffId, dateKey) {
    closeScheduleMenu();
    const locked = scheduleIsDateLocked(dateKey);
    const rect = anchorEl.getBoundingClientRect();
    const menu = document.createElement("div");
    menu.id = "sch-menu";
    menu.className = "sch-menu";
    if (locked) {
      // 잠긴 달은 수정은 막되, 수정 이력만큼은 그대로 볼 수 있게 한다.
      menu.innerHTML = `<div class="sch-menu-title">잠긴 달이에요</div>`
        + `<button type="button" data-history="1">${ICON_CLOCK || ""} 수정 이력 보기</button>`;
    } else {
      const options = SCHEDULE_STATUS_OPTIONS;
      const hasMemo = !!getScheduleMemo(staffId, dateKey);
      const memoLabel = hasMemo ? `${ICON_NOTE || ""} 메모 수정` : `${ICON_NOTE || ""} 메모 추가`;
      const memoDeleteBtnHtml = hasMemo ? `<button type="button" class="sch-menu-danger" data-memo-delete="1">${ICON_TRASH || ""} 메모 삭제</button>` : "";
      menu.innerHTML = options.map((o) =>
        `<button type="button" data-status="${o[0]}" data-attendance="${o[1] || ""}">${o[2]}</button>`
      ).join("")
        + `<div class="sch-menu-divider"></div>`
        + `<button type="button" data-memo="1">${memoLabel}</button>`
        + memoDeleteBtnHtml
        + `<button type="button" data-history="1">${ICON_CLOCK || ""} 수정 이력 보기</button>`
        + `<button type="button" class="sch-menu-reset" data-reset="1">기본값(근무)으로</button>`;
    }
    document.body.appendChild(menu);
    const top = Math.min(rect.bottom + 4, window.innerHeight - menu.offsetHeight - 8);
    const left = Math.min(rect.left, window.innerWidth - menu.offsetWidth - 8);
    menu.style.top = `${Math.max(8, top)}px`;
    menu.style.left = `${Math.max(8, left)}px`;
    menu.querySelectorAll("button[data-status]").forEach((btn) => {
      btn.onclick = () => {
        setScheduleRecord(staffId, dateKey, { status: btn.getAttribute("data-status"), attendance: btn.getAttribute("data-attendance") || null });
        closeScheduleMenu();
        updateScheduleTableArea();
      };
    });
    const memoBtn = menu.querySelector("[data-memo]");
    if (memoBtn) {
      memoBtn.onclick = () => {
        closeScheduleMenu();
        openScheduleMemoModal(staffId, dateKey);
      };
    }
    const memoDeleteBtn = menu.querySelector("[data-memo-delete]");
    if (memoDeleteBtn) {
      memoDeleteBtn.onclick = () => {
        setScheduleMemo(staffId, dateKey, "");
        closeScheduleMenu();
        updateScheduleTableArea();
      };
    }
    const resetBtn = menu.querySelector("[data-reset]");
    if (resetBtn) {
      resetBtn.onclick = () => {
        setScheduleRecord(staffId, dateKey, { status: "WORK", attendance: null });
        closeScheduleMenu();
        updateScheduleTableArea();
      };
    }
    const historyBtn = menu.querySelector("[data-history]");
    if (historyBtn) {
      historyBtn.onclick = () => {
        closeScheduleMenu();
        openScheduleCellHistoryModal(staffId, dateKey);
      };
    }
    setTimeout(() => document.addEventListener("mousedown", scheduleMenuOutsideHandler, true), 0);
  }

  // ----- 스케줄 셀 "수정 이력" -----
  // 스케줄 저장은 전체 스케줄 데이터를 한 번에 저장하는 구조라, 실제 변경 이력은
  // 계정 활동 로그(appendActivityLog)에 "records.{staffId}|{dateKey}...", "memos.{staffId}|{dateKey}..."
  // 형태의 일반 diff 텍스트로 이미 쌓이고 있다. 이 함수들은 그 로그에서 특정 셀(사람×날짜)에
  // 해당하는 줄만 골라내 사람이 읽기 쉬운 문장으로 바꿔준다.
  function scheduleHistoryStatusLabel(status, attendance) {
    if (status === "WORK" && attendance === "LATE") return "지각";
    if (status === "WORK" && attendance === "ABSENT") return "결근";
    if (status === "WORK") return "근무";
    const meta = SCHEDULE_STATUS_META[status];
    return meta ? meta.label : (status || "근무");
  }
  function scheduleHistoryTranslateFieldValue(fieldName, raw) {
    if (raw === "(없음)" || raw === "(비어있음)" || raw === "(빈 값)") return "없음";
    if (fieldName === "status") {
      if (raw === "WORK") return "근무";
      const meta = SCHEDULE_STATUS_META[raw];
      return meta ? meta.label : raw;
    }
    if (fieldName === "attendance") {
      if (raw === "LATE") return "지각";
      if (raw === "ABSENT") return "결근";
      return raw;
    }
    return raw;
  }
  function scheduleHistoryDescribeBlob(raw) {
    if (raw === "(없음)" || raw === "(비어있음)" || raw === "(빈 값)") return "없음";
    try {
      const obj = JSON.parse(raw);
      if (obj && typeof obj === "object" && "status" in obj) return scheduleHistoryStatusLabel(obj.status, obj.attendance);
    } catch (e) { /* 잘렸거나 JSON이 아니면 원문 그대로 보여준다 */ }
    return raw;
  }
  // 활동 로그 한 줄(예: "[14:32] 월별 스케줄 — records.abc123|2026-08-12.status: WORK → OFF")에서
  // 이 셀(cellKey)에 해당하는 부분만 사람이 읽기 쉬운 { time, text } 형태로 뽑아낸다.
  // 이 셀과 무관한 줄이면 null을 돌려준다.
  function scheduleDescribeCellHistoryLine(cellKey, rawLine) {
    const sepIdx = rawLine.indexOf(" — ");
    if (sepIdx === -1) return null;
    const prefix = rawLine.slice(0, sepIdx);
    const content = rawLine.slice(sepIdx + 3);
    const timeMatch = /^\[(\d{2}:\d{2})\]/.exec(prefix);
    const time = timeMatch ? timeMatch[1] : "";
    const recPrefix = `records.${cellKey}`;
    const memoPrefix = `memos.${cellKey}`;
    let isMemo = false, rest = null;
    if (content.indexOf(recPrefix) === 0) rest = content.slice(recPrefix.length);
    else if (content.indexOf(memoPrefix) === 0) { isMemo = true; rest = content.slice(memoPrefix.length); }
    if (rest === null) return null;
    let m = /^\.(\w+): (.*) → (.*)$/.exec(rest);
    if (m) {
      const fieldName = m[1];
      if (isMemo) return { time, text: `메모: "${m[2]}" → "${m[3]}"` };
      const fieldLabel = fieldName === "status" ? "근태" : (fieldName === "attendance" ? "출결" : fieldName);
      const oldLabel = scheduleHistoryTranslateFieldValue(fieldName, m[2]);
      const newLabel = scheduleHistoryTranslateFieldValue(fieldName, m[3]);
      return { time, text: `${fieldLabel}: ${oldLabel} → ${newLabel}` };
    }
    m = /^: (.*) → (.*)$/.exec(rest);
    if (m) {
      if (isMemo) {
        const oldLabel = (m[1] === "(없음)" || m[1] === "(비어있음)" || m[1] === "(빈 값)") ? "없음" : m[1];
        const newLabel = (m[2] === "(없음)" || m[2] === "(비어있음)" || m[2] === "(빈 값)") ? "없음" : m[2];
        return { time, text: `메모: "${oldLabel}" → "${newLabel}"` };
      }
      return { time, text: `근태: ${scheduleHistoryDescribeBlob(m[1])} → ${scheduleHistoryDescribeBlob(m[2])}` };
    }
    // 정규식으로 못 잡은 형태는 원문이라도 그대로 보여준다(정보 유실 방지).
    return { time, text: rest.replace(/^[.:]\s*/, "") || content };
  }
  // 이 계정(CURRENT_ACCOUNT_ID)의 활동 로그 전체를 훑어서, 특정 사람×날짜 셀에 대한
  // 변경 내역만 최신순으로 모아 돌려준다. { when, who, text }[] 형태.
  // (활동 로그는 이제 변경이 생기자마자 곧바로 activity-log:entries에 기록되므로,
  // 방금 고친 셀도 바로 이 목록에 나타난다. "여러 변경을 묶어서 보여주기"는 마스터
  // 계정의 활동 로그 화면에서만 화면 표시용으로 따로 처리한다.)
  function scheduleCellHistoryEntries(staffId, dateKey) {
    const cellKey = scheduleRecordKey(staffId, dateKey);
    const log = loadActivityLog();
    const out = [];
    log.forEach((entry) => {
      if (entry.accountId !== CURRENT_ACCOUNT_ID) return;
      const lines = Array.isArray(entry.diff) ? entry.diff : [];
      lines.forEach((line) => {
        if (line.indexOf(`records.${cellKey}`) === -1 && line.indexOf(`memos.${cellKey}`) === -1) return;
        const parsed = scheduleDescribeCellHistoryLine(cellKey, line);
        if (!parsed) return;
        const ts = entry.endedAt || entry.at || "";
        const dateStr = formatKSTDateTime(ts).slice(0, 10);
        out.push({
          sortKey: `${ts}|${parsed.time}`,
          when: parsed.time ? `${dateStr} ${parsed.time}` : dateStr,
          who: entry.viaMasterName ? `${entry.accountName || "-"} (마스터 진입: ${entry.viaMasterName})` : (entry.accountName || "-"),
          text: parsed.text,
        });
      });
    });
    out.sort((a, b) => b.sortKey.localeCompare(a.sortKey));
    return out;
  }
  function closeScheduleCellHistoryModal() {
    const existing = document.getElementById("sch-history-overlay");
    if (existing) existing.remove();
    document.removeEventListener("keydown", scheduleCellHistoryEscHandler, true);
  }
  function scheduleCellHistoryEscHandler(e) {
    if (e.key === "Escape") closeScheduleCellHistoryModal();
  }
  function openScheduleCellHistoryModal(staffId, dateKey) {
    closeScheduleCellHistoryModal();
    const staff = getStaffListForMonth(scheduleUi.year, scheduleUi.monthIndex).find((s) => s.id === staffId) || scheduleData.staff.find((s) => s.id === staffId);
    const d = new Date(`${dateKey}T00:00:00`);
    const wd = isNaN(d.getTime()) ? "" : WEEKDAYS[d.getDay()];
    const dateLabel = wd ? `${dateKey} (${wd})` : dateKey;
    const entries = scheduleCellHistoryEntries(staffId, dateKey);
    const rows = entries.map((e) => `
      <div class="sch-history-row">
        <div class="sch-history-meta"><span class="sch-history-when">${esc(e.when)}</span><span class="sch-history-who">${esc(e.who)}</span></div>
        <div class="sch-history-text">${esc(e.text)}</div>
      </div>
    `).join("");
    const overlay = document.createElement("div");
    overlay.id = "sch-history-overlay";
    overlay.className = "sch-preview-overlay";
    overlay.innerHTML = `
      <div class="sch-preview-box sch-history-box">
        <div class="sch-preview-head">
          <span>${esc(staff ? staff.name : "")} · ${esc(dateLabel)} 수정 이력</span>
          <button type="button" class="sch-preview-close" id="sch-history-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="sch-preview-body sch-history-body">
          <div class="sch-adjust-desc">최근 ${ACTIVITY_LOG_RETENTION_DAYS}일 이내에 이 칸에서 있었던 변경 내역이에요.</div>
          ${rows ? `<div class="sch-history-list">${rows}</div>` : `<div class="sch-adjust-empty">이 칸에는 아직 기록된 변경 이력이 없어요.</div>`}
        </div>
        <div class="sch-preview-actions">
          <button type="button" class="ghost-btn" id="sch-history-close-btn">닫기</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeScheduleCellHistoryModal(); };
    document.getElementById("sch-history-close-x").onclick = () => closeScheduleCellHistoryModal();
    document.getElementById("sch-history-close-btn").onclick = () => closeScheduleCellHistoryModal();
    setTimeout(() => document.addEventListener("keydown", scheduleCellHistoryEscHandler, true), 0);
  }

  // ----- 셀 메모 입력 모달 -----
  function closeScheduleMemoModal() {
    const existing = document.getElementById("sch-memo-overlay");
    if (existing) existing.remove();
    document.removeEventListener("keydown", scheduleMemoEscHandler, true);
  }
  function scheduleMemoEscHandler(e) {
    if (e.key === "Escape") closeScheduleMemoModal();
  }
  function openScheduleMemoModal(staffId, dateKey) {
    if (scheduleIsDateLocked(dateKey)) {
      flashScheduleStatus("잠긴 달이에요. 잠금을 해제한 뒤 수정해주세요.");
      return;
    }
    closeScheduleMemoModal();
    const staff = getStaffListForMonth(scheduleUi.year, scheduleUi.monthIndex).find((s) => s.id === staffId) || scheduleData.staff.find((s) => s.id === staffId);
    const current = getScheduleMemo(staffId, dateKey);
    const overlay = document.createElement("div");
    overlay.id = "sch-memo-overlay";
    overlay.className = "sch-preview-overlay";
    overlay.innerHTML = `
      <div class="sch-preview-box sch-memo-box">
        <div class="sch-preview-head">
          <span>${esc(staff ? staff.name : "")} · ${esc(dateKey)} 메모</span>
          <button type="button" class="sch-preview-close" id="sch-memo-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="sch-preview-body sch-memo-body">
          <textarea class="add-input sch-memo-textarea" id="sch-memo-textarea" placeholder="이 날짜에 남길 메모를 입력하세요">${esc(current)}</textarea>
        </div>
        <div class="sch-preview-actions">
          ${current ? `<button type="button" class="ghost-btn danger" id="sch-memo-delete">삭제</button>` : ""}
          <button type="button" class="ghost-btn" id="sch-memo-cancel">취소</button>
          <button type="button" class="primary-btn" id="sch-memo-save">저장</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeScheduleMemoModal(); };
    document.getElementById("sch-memo-close-x").onclick = () => closeScheduleMemoModal();
    document.getElementById("sch-memo-cancel").onclick = () => closeScheduleMemoModal();
    const deleteBtn = document.getElementById("sch-memo-delete");
    if (deleteBtn) {
      deleteBtn.onclick = () => {
        setScheduleMemo(staffId, dateKey, "");
        closeScheduleMemoModal();
        updateScheduleTableArea();
      };
    }
    document.getElementById("sch-memo-save").onclick = () => {
      const val = document.getElementById("sch-memo-textarea").value;
      setScheduleMemo(staffId, dateKey, val);
      closeScheduleMemoModal();
      updateScheduleTableArea();
    };
    setTimeout(() => {
      document.addEventListener("keydown", scheduleMemoEscHandler, true);
      const ta = document.getElementById("sch-memo-textarea");
      if (ta) { ta.focus(); ta.select(); }
    }, 0);
  }

  // ----- "가감점 취합" 팝업: 메모에 선 투입/연장/초과/라운딩/동석/역동석 문구가 있는
  // 날짜를 상담사별로 모아서 보여준다. -----
  function closeScheduleAdjustModal() {
    const existing = document.getElementById("sch-adjust-overlay");
    if (existing) existing.remove();
    document.removeEventListener("keydown", scheduleAdjustEscHandler, true);
  }
  function scheduleAdjustEscHandler(e) {
    if (e.key === "Escape") closeScheduleAdjustModal();
  }
  // 한 상담사의 entries를 "8/12 선투입, 8/14 연장근무" 형태의 텍스트로 만든다.
  function scheduleAdjustCopyText(monthIndex, entries) {
    return entries.map((en) => `${monthIndex + 1}/${en.day} ${en.label}`).join(", ");
  }
  function openScheduleAdjustModal() {
    closeScheduleAdjustModal();
    const { year, monthIndex } = scheduleUi;
    const summary = scheduleBuildAdjustSummary(year, monthIndex);
    const bodyHtml = summary.length === 0
      ? `<div class="sch-adjust-empty">${esc(scheduleMonthLabel())}에는 "선 투입 / 연장 / 초과 / 라운딩 / 동석 / 역동석" 문구가 담긴 메모가 없어요.</div>`
      : `<div class="sch-adjust-list">
          ${summary.map((agent) => `
            <div class="sch-adjust-row" data-staff-id="${esc(agent.id)}">
              <div class="sch-adjust-row-head">
                <div class="sch-adjust-name">${esc(agent.name)}${agent.nickname ? ` <span class="sch-adjust-nick">${esc(agent.nickname)}</span>` : ""}</div>
                <button type="button" class="sch-adjust-copy-btn" data-copy-staff="${esc(agent.id)}">${ICON_CLIPBOARD} 복사</button>
              </div>
              <div class="sch-adjust-detail">${agent.entries.map((en) => `<span class="sch-adjust-chip">${monthIndex + 1}/${en.day} ${esc(en.label)}</span>`).join("")}</div>
            </div>
          `).join("")}
        </div>`;

    const overlay = document.createElement("div");
    overlay.id = "sch-adjust-overlay";
    overlay.className = "sch-preview-overlay";
    overlay.innerHTML = `
      <div class="sch-preview-box sch-adjust-box">
        <div class="sch-preview-head">
          <span>가감점 취합 · ${esc(scheduleMonthLabel())}</span>
          <button type="button" class="sch-preview-close" id="sch-adjust-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="sch-preview-body sch-adjust-body">
          <div class="sch-adjust-desc">메모에 <b>선투입 / 선 투입 / 연장 / 연장근무 / 연장 근무 / 초과 / 라운딩 / 동석 / 역동석</b> 문구가 포함된 날짜를 상담사별로 모아서 보여줘요.</div>
          ${bodyHtml}
        </div>
        <div class="sch-preview-actions">
          <button type="button" class="ghost-btn" id="sch-adjust-close-btn">닫기</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeScheduleAdjustModal(); };
    document.getElementById("sch-adjust-close-x").onclick = () => closeScheduleAdjustModal();
    document.getElementById("sch-adjust-close-btn").onclick = () => closeScheduleAdjustModal();
    overlay.querySelectorAll(".sch-adjust-copy-btn").forEach((btn) => {
      btn.onclick = () => {
        const staffId = btn.getAttribute("data-copy-staff");
        const agent = summary.find((a) => a.id === staffId);
        if (!agent) return;
        const text = scheduleAdjustCopyText(monthIndex, agent.entries);
        scheduleCopyTextToClipboard(text, () => {
          const original = `${ICON_CLIPBOARD} 복사`;
          btn.innerHTML = "복사됨!";
          btn.classList.add("is-copied");
          setTimeout(() => { btn.innerHTML = original; btn.classList.remove("is-copied"); }, 1200);
        });
      };
    });
    setTimeout(() => document.addEventListener("keydown", scheduleAdjustEscHandler, true), 0);
  }
  // 클립보드 복사 (구형 환경 대비 execCommand 폴백 포함)
  function scheduleCopyTextToClipboard(text, onDone) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => { if (onDone) onDone(); }).catch(() => {
        scheduleCopyTextFallback(text, onDone);
      });
    } else {
      scheduleCopyTextFallback(text, onDone);
    }
  }
  function scheduleCopyTextFallback(text, onDone) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      if (onDone) onDone();
    } catch (e) {
      flashScheduleStatus("복사 실패");
    }
  }

  // ----- 스케줄 셀: 키보드로 상하좌우/Tab 이동 + 텍스트 직접 입력 -----
  // 칸을 클릭하거나 방향키로 이동해서 포커스를 두면(파란 테두리), 그 상태에서
  // 글자를 바로 치기 시작하면 입력창이 뜬다. Enter/Tab으로 확정하고, 확정한 값이
  // scheduleTokenToRecord가 알아보는 값(근무/오프/연차 등)이 아니면 저장하지 않고
  // 빨간 테두리로 오류를 표시한 채 그 칸에 그대로 머문다. Esc는 취소.
  let scheduleActiveEdit = null; // { cell }

  function scheduleFindCell(staffId, dateKey) {
    const root = document.getElementById("schedule-table-area");
    if (!root) return null;
    const cells = root.querySelectorAll(".sch-cell");
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].getAttribute("data-staff-id") === staffId && cells[i].getAttribute("data-date") === dateKey) return cells[i];
    }
    return null;
  }
  function scheduleVisibleCells() {
    const root = document.getElementById("schedule-table-area");
    if (!root) return [];
    return Array.from(root.querySelectorAll(".sch-cell")).filter((c) => {
      if (c.classList.contains("sch-col-hidden")) return false;
      const tr = c.closest("tr");
      if (tr && tr.classList.contains("sch-row-hidden")) return false;
      return true;
    });
  }
  function scheduleNeighborCell(cell, dir) {
    const visible = scheduleVisibleCells();
    const rowIdx = Number(cell.getAttribute("data-row-idx"));
    const day = Number(cell.getAttribute("data-day"));
    if (dir === "left" || dir === "right") {
      const rowCells = visible.filter((c) => Number(c.getAttribute("data-row-idx")) === rowIdx)
        .sort((a, b) => Number(a.getAttribute("data-day")) - Number(b.getAttribute("data-day")));
      const idx = rowCells.indexOf(cell);
      if (idx === -1) return null;
      return (dir === "right") ? (rowCells[idx + 1] || null) : (rowCells[idx - 1] || null);
    }
    const colCells = visible.filter((c) => Number(c.getAttribute("data-day")) === day)
      .sort((a, b) => Number(a.getAttribute("data-row-idx")) - Number(b.getAttribute("data-row-idx")));
    const idx2 = colCells.indexOf(cell);
    if (idx2 === -1) return null;
    return (dir === "down") ? (colCells[idx2 + 1] || null) : (colCells[idx2 - 1] || null);
  }
  function scheduleMoveFocus(cell, dir) {
    const target = scheduleNeighborCell(cell, dir);
    if (target) target.focus();
  }
  // 편집 중 저장/취소가 끝나면 표를 다시 그리고, 가능하면 같은 칸(또는 이동한 칸)에 포커스를 되돌린다.
  function scheduleExitCellEdit(staffId, dateKey, moveDir) {
    scheduleActiveEdit = null;
    updateScheduleTableArea();
    const cell = (staffId != null && dateKey != null) ? scheduleFindCell(staffId, dateKey) : null;
    if (!cell) return;
    if (moveDir) scheduleMoveFocus(cell, moveDir);
    else cell.focus();
  }
  // 입력값을 확정 시도한다. 빈 값이면 기본값(근무)으로, 알아보는 근태 표현이면 그 값으로 저장.
  // 알아보지 못하는 텍스트면 mode에 따라: "block"=그 칸에 그대로 머물며 오류 표시,
  // "revert"=저장하지 않고 원래 값으로 되돌리며 안내만 띄움.
  // 반환값: 실제로 편집 모드를 빠져나갔으면(저장/되돌림) true, 오류로 그 칸에 계속 머물면 false.
  function scheduleFinalizeCellEdit(cell, staffId, dateKey, rawValue, mode, moveDir) {
    const trimmed = (rawValue || "").trim();
    const mapped = trimmed === "" ? { status: "WORK", attendance: null } : scheduleTokenToRecord(trimmed);
    if (!mapped) {
      if (mode === "revert") {
        scheduleExitCellEdit(staffId, dateKey, null);
        flashScheduleStatus(`인식할 수 없는 값이라 되돌렸어요: "${trimmed}"`);
        return true;
      }
      const input = cell.querySelector(".sch-cell-input");
      if (input) {
        input.classList.add("sch-cell-input--error");
        input.title = `"${trimmed}"은(는) 등록된 근태가 아니에요.`;
        input.focus();
        input.select();
      }
      flashScheduleStatus(`인식할 수 없는 값이에요: "${trimmed}"`);
      return false;
    }
    setScheduleRecord(staffId, dateKey, { status: mapped.status, attendance: mapped.attendance || null });
    scheduleExitCellEdit(staffId, dateKey, moveDir);
    return true;
  }
  function scheduleStartCellEdit(cell, typedChar) {
    if (cell.classList.contains("sch-cell--editing")) return;
    const staffId = cell.getAttribute("data-staff-id");
    const dateKey = cell.getAttribute("data-date");
    if (scheduleIsDateLocked(dateKey)) { flashScheduleStatus("잠긴 달이에요. 잠금을 해제한 뒤 수정해주세요."); return; }
    closeScheduleMenu();
    const labelEl = cell.querySelector(".sch-cell-label");
    const originalLabel = labelEl ? labelEl.textContent : "";
    const startValue = (typedChar === null) ? originalLabel : typedChar;
    cell.classList.add("sch-cell--editing");
    cell.innerHTML = `<input type="text" class="sch-cell-input" />`;
    const input = cell.querySelector(".sch-cell-input");
    input.value = startValue;
    scheduleActiveEdit = { cell };
    let finished = false;
    // 값이 틀려서 그 칸에 그대로 머무는 경우(mode="block"이고 인식 실패)엔 finished를
    // true로 고정하면 안 된다. 그러면 사용자가 값을 바로잡아도 이후의 Enter/Tab이
    // "이미 끝난 편집"으로 취급되어 아무 반응이 없는 문제가 생긴다.
    function finish(mode, moveDir) {
      if (finished) return;
      if (mode === "cancel") { finished = true; scheduleExitCellEdit(staffId, dateKey, null); return; }
      const done = scheduleFinalizeCellEdit(cell, staffId, dateKey, input.value, mode, moveDir);
      if (done) finished = true;
    }
    input.onkeydown = (e) => {
      e.stopPropagation();
      if (e.key === "Enter") { e.preventDefault(); finish("block", null); }
      else if (e.key === "Escape") { e.preventDefault(); finish("cancel", null); }
      else if (e.key === "Tab") { e.preventDefault(); finish("block", e.shiftKey ? "left" : "right"); }
    };
    // 오류로 빨갛게 표시된 뒤 글자를 다시 고치기 시작하면, 확정하기 전이라도 오류 표시를 지운다.
    input.oninput = () => {
      if (input.classList.contains("sch-cell-input--error")) {
        input.classList.remove("sch-cell-input--error");
        input.title = "";
      }
    };
    input.onblur = () => finish("revert", null);
    requestAnimationFrame(() => {
      input.focus();
      if (typedChar === null) input.select();
      else input.setSelectionRange(input.value.length, input.value.length);
    });
  }
  function scheduleCommitActiveEditIfOutside(target) {
    if (!scheduleActiveEdit) return;
    if (scheduleActiveEdit.cell.contains(target)) return;
    // 이 핸들러는 mousedown "캡처" 단계라, 사용자가 실제로 누른 요소(target)에
    // 이벤트가 도달하기도 전에 먼저 실행된다. 여기서 곧바로 blur()를 호출해
    // 표 전체를 innerHTML로 다시 그리면, 방금 클릭한 그 DOM 노드가 target에
    // 닿기 전에 파괴되어 click 이벤트 자체가 발생하지 않는 문제가 있었다
    // (다른 칸 클릭, 행 그룹 접기/펼치기 화살표 클릭 등 첫 클릭이 씹힘).
    // 그래서 커밋(재렌더링)을 한 틱(setTimeout 0) 늦춰서, 원래 클릭이 target까지
    // 정상적으로 전달되고 처리된 뒤에 편집을 정리하도록 한다.
    const cellAtCapture = scheduleActiveEdit.cell;
    setTimeout(() => {
      if (!scheduleActiveEdit || scheduleActiveEdit.cell !== cellAtCapture) return; // 그 사이 이미 다른 방식으로 정리됨
      if (!document.contains(cellAtCapture)) { scheduleActiveEdit = null; return; } // 그 사이 다른 재렌더링으로 이미 떨어져 나감
      const input = cellAtCapture.querySelector(".sch-cell-input");
      if (input) input.blur(); // blur 핸들러(finish("revert"))가 정리를 맡는다.
    }, 0);
  }
  document.addEventListener("mousedown", (e) => scheduleCommitActiveEditIfOutside(e.target), true);

  function scheduleCellKeydown(e, cell) {
    if (cell.classList.contains("sch-cell--editing")) return;
    const key = e.key;
    if (key === "ArrowUp") { e.preventDefault(); scheduleMoveFocus(cell, "up"); return; }
    if (key === "ArrowDown") { e.preventDefault(); scheduleMoveFocus(cell, "down"); return; }
    if (key === "ArrowLeft") { e.preventDefault(); scheduleMoveFocus(cell, "left"); return; }
    if (key === "ArrowRight") { e.preventDefault(); scheduleMoveFocus(cell, "right"); return; }
    if (key === "Tab") { e.preventDefault(); scheduleMoveFocus(cell, e.shiftKey ? "left" : "right"); return; }
    if (key === "Enter" || key === "F2") { e.preventDefault(); scheduleStartCellEdit(cell, null); return; }
    if (key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      scheduleStartCellEdit(cell, key);
    }
  }

  function attachScheduleTableHandlers(root) {
    root.querySelectorAll(".sch-cell").forEach((cell) => {
      // 왼쪽 클릭(드래그 없이 눌렀다 뗌)은 이제 메뉴를 열지 않는다 — 셀 선택/드래그 선택
      // 용도로만 쓰고, 그 칸 하나의 메뉴(상태 변경/메모/이력 등)는 오른쪽 클릭(우클릭)
      // 으로 연다.
      cell.oncontextmenu = (e) => {
        e.preventDefault();
        openScheduleMenu(cell, cell.getAttribute("data-staff-id"), cell.getAttribute("data-date"));
      };
      cell.onmousedown = (e) => {
        if (e.button !== 0) return; // 왼쪽 버튼만
        scheduleSelectDragging = true;
        scheduleSelectMoved = false;
        scheduleSelectAnchor = { rowIdx: Number(cell.getAttribute("data-row-idx")), day: Number(cell.getAttribute("data-day")) };
        scheduleSelectCurrent = scheduleSelectAnchor;
        e.preventDefault(); // 드래그 중 글자 선택(파랗게 칠해지는 것) 방지
        // mousedown에서 preventDefault()를 하면 브라우저가 클릭에 따른 기본 포커스 이동까지
        // 취소해버려서, 셀을 클릭해도 이 tabindex="0" 셀에 실제 포커스가 잡히지 않는 문제가
        // 있었다. 그러면 클릭 직후 방향키·Tab 이동이나 글자 바로 입력(scheduleCellKeydown)이
        // 전혀 동작하지 않으므로, 여기서 명시적으로 포커스를 줘서 이어서 키보드 조작이
        // 가능하게 한다.
        cell.focus();
      };
      cell.onmouseenter = () => {
        if (!scheduleSelectDragging) return;
        const rowIdx = Number(cell.getAttribute("data-row-idx"));
        const day = Number(cell.getAttribute("data-day"));
        if (rowIdx !== scheduleSelectAnchor.rowIdx || day !== scheduleSelectAnchor.day) scheduleSelectMoved = true;
        scheduleSelectCurrent = { rowIdx, day };
        scheduleApplySelectionHighlight();
      };
      cell.onkeydown = (e) => scheduleCellKeydown(e, cell);
    });
    root.querySelectorAll(".sch-required-input").forEach((input) => {
      // 입력칸을 벗어날 때(blur) 또는 Enter 시 저장. 매 타이핑마다 전체를 다시 그리지 않아
      // 숫자 입력 중 표가 깜빡이거나 포커스가 빠지지 않는다.
      input.onchange = () => {
        const { year, monthIndex } = scheduleUi;
        setRequiredHeadcount(
          year, monthIndex,
          input.getAttribute("data-required-group"),
          input.getAttribute("data-required-type"),
          Number(input.getAttribute("data-required-day")),
          input.value
        );
        renderApp();
      };
      input.onkeydown = (e) => { if (e.key === "Enter") input.blur(); };
    });
    root.querySelectorAll("[data-toggle-row-group]").forEach((el) => {
      el.onclick = (e) => {
        e.stopPropagation();
        scheduleToggleRowGroup(el.getAttribute("data-toggle-row-group"));
      };
    });
    // 열 머리글(날짜)·행 머리글(닉네임 칸) 클릭 = 선택 토글, 오른쪽 클릭 = 접기 메뉴 열기
    root.querySelectorAll(".sch-col-th").forEach((th) => {
      th.onclick = (e) => { e.stopPropagation(); scheduleToggleColSelection(th.getAttribute("data-col-key")); };
      th.oncontextmenu = (e) => scheduleHeaderRightClick(th, e);
    });
    root.querySelectorAll(".sch-row-th").forEach((td) => {
      td.onclick = (e) => { e.stopPropagation(); scheduleToggleRowSelection(td.getAttribute("data-row-key")); };
      td.oncontextmenu = (e) => scheduleHeaderRightClick(td, e);
    });
    // 헤더가 아닌 다른 곳을 클릭하면 열/행 선택을 해제한다.
    root.onclick = (e) => {
      if (!e.target.closest(".sch-col-th") && !e.target.closest(".sch-row-th")) scheduleClearHeaderSelection();
    };
    scheduleApplyHeaderSelectionHighlight();
  }

  // ----- 월별 스케줄 일괄 삭제 -----
  // "등록된 일정 전체 삭제" 및 조/업무 구분별 삭제(주간 채팅·주간 유선·야간 채팅·야간 유선)를
  // 지원한다. 대상은 항상 "현재 화면에 보이는 달"이며, 대상 인원의 해당 달 1일~말일 기록을
  // 전부 기본값(근무)으로 되돌린다. 실수로 누르는 걸 막기 위해 실행 전에 꼭 확인을 받는다.
  const SCHEDULE_DELETE_SCOPES = [
    { key: "ALL", label: "등록된 일정 전체 삭제", danger: true },
    { key: "ADMIN", label: "관리자 삭제" },
    { key: "DAY_CHAT", label: "주간 채팅 삭제" },
    { key: "DAY_VOICE", label: "주간 유선 삭제" },
    { key: "NIGHT_CHAT", label: "야간 채팅 삭제" },
    { key: "NIGHT_VOICE", label: "야간 유선 삭제" },
  ];

  // scope에 해당하는 인원 목록과 화면 표시용 라벨을 반환한다.
  // (표를 그릴 때 쓰는 것과 같은 분류 기준 — 관리자/주간/야간, 채팅/유선 — 을 그대로 사용해서
  // "표에서 보이는 그룹"과 "삭제 대상"이 항상 일치하도록 한다)
