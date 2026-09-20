  // 07a9-schedule-copy-paste.js — 월별 스케줄 셀 복사(Ctrl/⌘+C) · 붙여넣기(Ctrl/⌘+V)
  // (07a6의 셀 선택/포커스 기능 위에 얹은 기능이라 07a6·07a5 뒤에 오도록 07a9로 이름 붙임)
  //
  // 사용법
  //  - 칸을 클릭하거나 드래그로 여러 칸을 선택한 뒤 Ctrl+C → 상태(근무/오프/연차…)와 메모를 함께 복사.
  //    (드래그로 고른 범위가 없으면 지금 포커스(파란 테두리)가 있는 칸 하나를 복사)
  //  - 붙여넣을 칸을 클릭(또는 범위를 드래그)한 뒤 Ctrl+V.
  //      · 클릭한 칸이 붙여넣기의 "왼쪽 위 시작점"이 되고, 복사한 크기만큼 오른쪽·아래로 채운다.
  //      · 1칸만 복사했고 붙여넣을 곳을 여러 칸 드래그해 뒀다면 그 범위 전체를 그 값으로 채운다.
  //      · 붙여넣기는 상태와 메모를 함께 덮어쓴다(복사한 칸에 메모가 없으면 대상 칸의 메모도 지워짐).
  //        Ctrl+Z 한 번으로 통째로 되돌릴 수 있다.
  //  - 엑셀 등 다른 곳에서 복사한 "오프/연차/1…" 같은 근태 값(탭·줄바꿈으로 구분)도 붙여넣을 수 있다.
  //    이 경우 메모 정보가 없으므로 상태만 바꾸고 기존 메모는 그대로 둔다.
  //  - Esc: 복사한 범위를 알려주는 점선 표시만 끈다(복사한 내용은 그대로 남음).
  //
  // 구현 메모
  //  - 복사(C)는 keydown에서, 붙여넣기(V)는 브라우저의 paste 이벤트에서 처리한다. V를 keydown에서
  //    가로채지 않는 이유: 키 이벤트 안에서는 클립보드를 동기로 읽을 수 없고, navigator.clipboard.readText()는
  //    권한 팝업이 뜨기 때문. paste 이벤트는 권한 없이 clipboardData로 바로 읽을 수 있다.
  //  - 메모는 시스템 클립보드(텍스트)에 실을 수 없어서 앱 안의 버퍼(scheduleCopyBuffer)에 따로 보관한다.
  //    붙여넣을 때 클립보드 텍스트가 복사 당시 넣어둔 텍스트와 같을 때만 그 버퍼(메모 포함)를 쓰고,
  //    다르면(그 사이 다른 곳에서 복사함) 클립보드 텍스트를 그대로 해석한다 — 그래야 옛날에
  //    복사해 둔 내용이 엉뚱하게 붙여넣어지지 않는다.

  // 앱 안에서 복사해 둔 칸들.
  //  - rows: 복사한 범위를 [행][열] 배열로 담은 것. 칸 하나는 { status, attendance, memo }.
  //  - text: 그때 시스템 클립보드에 같이 넣은 문자열 (붙여넣을 때 "내가 복사한 게 맞는지" 대조용).
  //  - keys: 복사한 칸들의 "인원id|날짜" 모음 (점선 표시용).
  //  - showOutline: false면 점선 표시를 끈 상태 (Esc).
  let scheduleCopyBuffer = null;

  // 키보드 이벤트가 특정 알파벳 키인지 판별한다. 한글 입력 상태에서는 Ctrl+C를 눌러도 e.key가
  // "c"가 아니라 "ㅊ"이나 "Process"로 올 수 있어서(특히 한글 IME), 알파벳이 아닌 값이 오면
  // 물리 키 위치(e.code)로 판단한다. 알파벳이 오면 e.key를 우선한다(Dvorak 등 다른 배열 존중).
  function scheduleKeyIsLetter(e, letter) {
    const k = e.key || "";
    if (/^[a-z]$/i.test(k)) return k.toLowerCase() === letter;
    return e.code === "Key" + letter.toUpperCase();
  }

  // 윈도우/엑셀은 줄바꿈을 \r\n으로, 끝에 빈 줄을 붙여 주기도 해서 비교 전에 맞춰준다.
  function scheduleNormalizeClipText(text) {
    return String(text == null ? "" : text).replace(/\r\n?/g, "\n").replace(/\n+$/, "");
  }

  // [행][열] 칸 배열 → 시스템 클립보드에 넣을 텍스트(탭·줄바꿈 구분). 칸에 보이는 글자
  // ("1", "오프", "연차", "지각" …)를 그대로 쓰므로 엑셀에 붙여넣어도 표 모양이 유지되고,
  // 이 글자들은 모두 scheduleTokenToRecord가 다시 알아본다(왕복 가능).
  function scheduleClipboardTextFromRows(rows) {
    return rows
      .map((row) => row.map((item) => (item ? scheduleCellDisplay(item).label : "")).join("\t"))
      .join("\n");
  }

  // 외부(엑셀 등)에서 온 텍스트 → [행][열] 칸 배열.
  // 빈 칸은 null(=건드리지 않음). 알아보지 못하는 값도 null로 두고 unknown에 모아서 알려준다.
  // memo가 null인 칸은 "메모 정보 없음"이라는 뜻이라 붙여넣어도 기존 메모를 지우지 않는다.
  function scheduleParseClipText(text) {
    const unknown = [];
    const rows = scheduleNormalizeClipText(text).split("\n").map((line) =>
      line.split("\t").map((raw) => {
        const tok = raw.trim();
        if (tok === "") return null;
        const mapped = scheduleTokenToRecord(tok);
        if (!mapped) { unknown.push(tok); return null; }
        return { status: mapped.status, attendance: mapped.attendance || null, memo: null };
      })
    );
    return { rows, unknown };
  }

  // 화면에 "보이는" 행 번호 목록(rowIdxList)과 날짜 목록(dayList) 위에서, 시작 칸을 왼쪽 위로
  // 두고 rows를 깔았을 때 각 칸이 어느 (행번호, 날짜)에 놓이는지 계산한다.
  // 접어둔(숨긴) 행·열은 목록에 없으므로 자연스럽게 건너뛰고, 표 끝을 넘어서는 부분은
  // 잘라내며 clipped=true로 알려준다. item이 null인 자리는 건너뛴다.
  function schedulePlanPaste(rows, rowIdxList, dayList, startRowIdx, startDay) {
    const r0 = rowIdxList.indexOf(startRowIdx);
    const c0 = dayList.indexOf(startDay);
    if (r0 === -1 || c0 === -1) return { targets: [], clipped: false };
    const targets = [];
    let clipped = false;
    rows.forEach((row, ri) => {
      row.forEach((item, ci) => {
        if (!item) return;
        const rowIdx = rowIdxList[r0 + ri];
        const day = dayList[c0 + ci];
        if (rowIdx === undefined || day === undefined) { clipped = true; return; }
        targets.push({ rowIdx, day, item });
      });
    });
    return { targets, clipped };
  }

  // 계산된 붙여넣기 결과를 실제 데이터에 반영한다(한 번에 저장, 되돌리기 한 번).
  // entries: [{ staffId, dateKey, item: { status, attendance, memo } }]
  // 붙여넣을 범위에 잠긴 달이 하나라도 있으면 아무것도 바꾸지 않고 locked=true로 돌려준다
  // (일괄 적용 메뉴의 잠금 규칙과 동일).
  function scheduleApplyPasteEntries(entries) {
    const result = { applied: 0, memoSet: 0, memoCleared: 0, locked: false };
    if (!entries.length) return result;
    if (entries.some((en) => scheduleIsDateLocked(en.dateKey))) { result.locked = true; return result; }
    recordUndo(`셀 ${entries.length}개 붙여넣기`, SCHEDULE_KEY, reloadScheduleData);
    entries.forEach(({ staffId, dateKey, item }) => {
      const key = scheduleRecordKey(staffId, dateKey);
      const cur = scheduleData.records[key] || { status: "WORK", attendance: null };
      const next = Object.assign({}, cur, { status: item.status, attendance: item.attendance || null });
      if (next.status === "WORK" && !next.attendance) delete scheduleData.records[key]; // 기본값이면 저장하지 않음
      else scheduleData.records[key] = next;
      if (item.memo !== null && item.memo !== undefined) {
        const memo = String(item.memo).trim();
        if (memo) { scheduleData.memos[key] = memo; result.memoSet += 1; }
        else if (scheduleData.memos[key]) { delete scheduleData.memos[key]; result.memoCleared += 1; }
      }
      result.applied += 1;
    });
    saveScheduleData();
    return result;
  }

  // ----- 여기부터는 실제 화면(DOM)과 붙는 부분 -----
  function scheduleCellRowIdx(cell) { return Number(cell.getAttribute("data-row-idx")); }
  function scheduleCellDay(cell) { return Number(cell.getAttribute("data-day")); }
  function scheduleCellKey(cell) { return `${cell.getAttribute("data-staff-id")}|${cell.getAttribute("data-date")}`; }
  function scheduleSortedUnique(nums) { return Array.from(new Set(nums)).sort((a, b) => a - b); }

  function scheduleCellItem(cell) {
    const staffId = cell.getAttribute("data-staff-id");
    const dateKey = cell.getAttribute("data-date");
    const rec = getScheduleRecord(staffId, dateKey);
    return { status: rec.status, attendance: rec.attendance || null, memo: getScheduleMemo(staffId, dateKey) };
  }

  // 드래그로 골라 둔 칸들(파란 선택 표시가 켜진 칸). 일괄 적용 메뉴가 떠 있는 동안에만 남아 있다.
  // (그 메뉴를 열 때 closeScheduleMenu가 선택 좌표 변수는 비우고 표시만 다시 켜기 때문에,
  //  지금 "선택된 칸"의 진실은 화면에 켜진 표시 자체다.) 접힌 행·열의 칸은 뺀다.
  function scheduleSelectedVisibleCells(root) {
    const visible = new Set(scheduleVisibleCells());
    return Array.from(root.querySelectorAll(".sch-cell--selected")).filter((c) => visible.has(c));
  }

  // 메모/이력/미리보기 같은 팝업이 떠 있으면(뒤쪽 표에 포커스가 남아 있을 수 있음) 복사·붙여넣기를 막는다.
  function scheduleCopyPasteBlocked() {
    return !!document.querySelector(".sch-preview-overlay");
  }

  // 복사해 둔 칸들에 점선 테두리를 켠다. 표를 다시 그릴 때마다(attachScheduleTableHandlers)
  // 다시 불러서 유지한다.
  function scheduleApplyCopiedOutline() {
    const root = document.getElementById("schedule-table-area");
    if (!root) return;
    const keys = (scheduleCopyBuffer && scheduleCopyBuffer.showOutline) ? scheduleCopyBuffer.keys : null;
    root.querySelectorAll(".sch-cell").forEach((cell) => {
      cell.classList.toggle("sch-cell--copied", !!keys && keys.has(scheduleCellKey(cell)));
    });
  }
  function scheduleClearCopiedOutline() {
    if (scheduleCopyBuffer) scheduleCopyBuffer.showOutline = false;
    scheduleApplyCopiedOutline();
  }

  // Ctrl/⌘+C
  function scheduleCopySelection(focusCell) {
    const root = document.getElementById("schedule-table-area");
    if (!root || scheduleCopyPasteBlocked()) return;
    let cells = scheduleSelectedVisibleCells(root);
    if (!cells.length && focusCell) cells = [focusCell];
    if (!cells.length) return;

    const rowIdxList = scheduleSortedUnique(cells.map(scheduleCellRowIdx));
    const dayList = scheduleSortedUnique(cells.map(scheduleCellDay));
    const rows = rowIdxList.map(() => dayList.map(() => null));
    const keys = new Set();
    let memoCount = 0;
    cells.forEach((cell) => {
      const item = scheduleCellItem(cell);
      rows[rowIdxList.indexOf(scheduleCellRowIdx(cell))][dayList.indexOf(scheduleCellDay(cell))] = item;
      keys.add(scheduleCellKey(cell));
      if (item.memo) memoCount += 1;
    });

    const text = scheduleClipboardTextFromRows(rows);
    scheduleCopyBuffer = { rows, text, keys, showOutline: true };
    // 드래그 선택 직후 떠 있던 "N칸 선택됨" 일괄 적용 메뉴와 파란 선택 표시를 정리하고,
    // 그 자리에 "복사됨" 점선 표시를 켠다.
    closeScheduleMenu();
    scheduleApplyCopiedOutline();

    const msg = `${cells.length}칸 복사됨${memoCount ? ` (메모 ${memoCount}개 포함)` : ""}`;
    scheduleCopyTextToClipboard(text, () => {
      // 구형 폴백(execCommand)은 임시 입력창에 포커스를 뺏기므로 원래 칸으로 돌려놓는다.
      if (focusCell && document.contains(focusCell) && document.activeElement !== focusCell) focusCell.focus();
      flashScheduleStatus(msg, 2200);
    });
  }

  // Ctrl/⌘+V (브라우저가 띄워주는 paste 이벤트)
  function scheduleHandlePaste(e) {
    const root = document.getElementById("schedule-table-area");
    if (!root) return; // 스케줄 화면이 아니면 다른 화면의 붙여넣기를 건드리지 않는다
    const active = document.activeElement;
    // 칸에 포커스가 있을 때만 처리한다. 입력창·메모 입력칸·일괄 붙여넣기 칸에 포커스가 있으면
    // 그 안의 평범한 붙여넣기가 그대로 동작해야 한다.
    if (!active || !active.classList || !active.classList.contains("sch-cell") || !root.contains(active)) return;
    if (scheduleCopyPasteBlocked()) return;
    e.preventDefault();
    const text = e.clipboardData ? e.clipboardData.getData("text/plain") : "";
    schedulePasteIntoCells(root, active, text);
  }

  function schedulePasteIntoCells(root, activeCell, text) {
    const visible = scheduleVisibleCells();
    const selected = scheduleSelectedVisibleCells(root);
    const anchorCells = selected.length ? selected : [activeCell];
    const startRowIdx = Math.min.apply(null, anchorCells.map(scheduleCellRowIdx));
    const startDay = Math.min.apply(null, anchorCells.map(scheduleCellDay));
    const rowIdxList = scheduleSortedUnique(visible.map(scheduleCellRowIdx));
    const dayList = scheduleSortedUnique(visible.map(scheduleCellDay));
    const cellAt = new Map(visible.map((c) => [`${scheduleCellRowIdx(c)}|${scheduleCellDay(c)}`, c]));

    // 무엇을 붙여넣을지: 방금 이 앱에서 복사한 게 맞으면 버퍼(메모 포함), 아니면 클립보드 텍스트 해석.
    const fromApp = !!scheduleCopyBuffer &&
      scheduleNormalizeClipText(text) === scheduleNormalizeClipText(scheduleCopyBuffer.text);
    let rows, unknown = [];
    if (fromApp) rows = scheduleCopyBuffer.rows;
    else { const parsed = scheduleParseClipText(text); rows = parsed.rows; unknown = parsed.unknown; }

    // 어디에 붙여넣을지
    let cellTargets, clipped = false;
    const single = rows.length === 1 && rows[0].length === 1 && rows[0][0];
    if (single && selected.length > 1) {
      cellTargets = selected.map((cell) => ({ cell, item: single })); // 1칸 → 선택 범위 전체 채우기
    } else {
      const plan = schedulePlanPaste(rows, rowIdxList, dayList, startRowIdx, startDay);
      clipped = plan.clipped;
      cellTargets = plan.targets
        .map((t) => ({ cell: cellAt.get(`${t.rowIdx}|${t.day}`), item: t.item }))
        .filter((t) => t.cell);
    }

    if (!cellTargets.length) {
      flashScheduleStatus(unknown.length
        ? `인식할 수 없는 값이라 붙여넣지 못했어요: "${unknown[0]}"${unknown.length > 1 ? " 외" : ""}`
        : "붙여넣을 내용이 없어요.", 2600);
      return;
    }

    const result = scheduleApplyPasteEntries(cellTargets.map((t) => ({
      staffId: t.cell.getAttribute("data-staff-id"),
      dateKey: t.cell.getAttribute("data-date"),
      item: t.item,
    })));
    if (result.locked) {
      flashScheduleStatus("붙여넣을 범위에 잠긴 달이 포함돼 있어요. 잠금을 해제한 뒤 다시 붙여넣어주세요.", 2600);
      return;
    }

    // 붙여넣기 후 표를 다시 그리면 포커스가 사라지므로, 원래 있던 칸에 포커스를 돌려준다.
    const focusStaffId = activeCell.getAttribute("data-staff-id");
    const focusDate = activeCell.getAttribute("data-date");
    closeScheduleMenu();
    updateScheduleTableArea();
    const again = scheduleFindCell(focusStaffId, focusDate);
    if (again) again.focus();

    const notes = [];
    if (result.memoSet) notes.push(`메모 ${result.memoSet}개 포함`);
    if (result.memoCleared) notes.push(`기존 메모 ${result.memoCleared}개 삭제됨`);
    if (clipped) notes.push("표 밖으로 넘치는 칸 제외");
    if (unknown.length) notes.push(`인식 못한 값 ${unknown.length}칸 제외`);
    // saveScheduleData가 방금 "저장됨"을 띄웠으므로, 그 위에 결과 요약을 덮어 보여준다.
    flashScheduleStatus(`${result.applied}칸 붙여넣음${notes.length ? ` (${notes.join(", ")})` : ""}`, 2600);
  }

  document.addEventListener("paste", scheduleHandlePaste);
