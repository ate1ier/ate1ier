  // 07a4-schedule-table-render.js — 월별 스케줄 표 렌더링 (buildScheduleTableHtml)
  // (07-schedule.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  // "AI 자동 배치" 미리보기 표에서만 쓴다. { "staffId|YYYY-MM-DD": 1 또는 2 } 형태로, 새로 배정될 오프 칸을
  // 알려주면 그 칸에 강조 클래스를 붙인다(1 = 새로 배정될 오프, 2 = 그중 선호 요일과 맞은 칸).
  // 평소에는 null이라 화면의 실제 월별 스케줄 표에는 아무 영향이 없다.
  let schedulePreviewMarks = null;
  // "AI 자동 배치" 미리보기 전용: 이번 배치에서 제외한 인원의 id 집합. 표(인원 행·집계·필요인력 대비)에서 이 인원을 뺀다.
  // 평소에는 null이라 실제 월별 스케줄 표에는 아무 영향이 없다.
  let schedulePreviewExcludedIds = null;
  function buildScheduleTableHtml(filterMode, hideSummaryCols, hideRequiredRows, hideMemoMarks) {
    const { year, monthIndex } = scheduleUi;
    const numDays = scheduleDaysInMonth(year, monthIndex);
    const days = [];
    for (let d = 1; d <= numDays; d++) days.push(d);
    // 상담사 검색 중(캡처용 표는 제외)이면 그룹 제목 행·소제목 행·집계행(관리자 인원/필요인력/대비/
    // 인력 대비 편성/총 인원 등)을 전부 숨기고, 검색어와 일치하는 인원 행만 보이게 한다.
    const searchActive = !hideSummaryCols && !!(scheduleUi.searchQuery && scheduleUi.searchQuery.trim());
    const collapsedDays = scheduleCollapsedDaySet();
    const colHiddenCls = (d) => (collapsedDays.has(d) ? " sch-col-hidden" : "");
    // 이미지로 저장할 때는 근무~결근 집계 열 5개를 표에서 아예 빼고 그린다.
    // 화면(hideSummaryCols가 false)에서 개별로 접은 인원정보 열(사번 등)도 같은 이유로
    // "안 보이게" CSS로 숨기는 대신 마크업 자체에서 통째로 빼버린다 — "관리자 인원" 같은
    // 요약행들이 인원정보 영역 전체를 colspan 하나로 합친 칸을 쓰는데, 이 표에서는
    // CSS로 열을 숨기는 방식으로는 그 colspan 너비 계산이 정확히 안 맞아서(브라우저가
    // 숨긴 셀만큼 너비를 못 줄여줌) 표가 밀려 보인다. 아예 셀 자체를 안 만들면 이 문제가 없다.
    const infoColCount = hideSummaryCols
      ? 5
      : SCHEDULE_INFO_COLS.filter((c) => !scheduleUi.manualHiddenInfoCols.has(c.key)).length;
    const { lefts: infoColLefts, lastVisibleKey: infoColLastVisible } = scheduleInfoColLeftOffsets();

    const monthStaff = getStaffListForMonth(year, monthIndex).filter((s) => !schedulePreviewExcludedIds || !schedulePreviewExcludedIds.has(s.id));
    const adminStaff = monthStaff.filter((s) => s.isAdmin);
    const dayStaff = sortStaffByType(monthStaff.filter((s) => s.group !== "night" && !s.isAdmin));
    const nightStaff = sortStaffByType(monthStaff.filter((s) => s.group === "night" && !s.isAdmin));
    // 인원 정보 열(닉네임~결근) 하나를 그려주는 헬퍼. asTh=true면 헤더 셀(선택 가능),
    // false면 각 인원 행의 값 칸(행 선택 가능)을 만든다. 개별로 접어둔 열은 아예 마크업에서
    // 빼버린다(위 infoColCount 주석 참고) — 그래야 요약행들의 colspan 너비도 같이 맞는다.
    // titleText: 값 칸(td)에 마우스를 올렸을 때 보여줄 툴팁. 이름 칸의 메모 내용을 보여주는 데 쓴다.
    function infoColHtml(colDef, asTh, valueHtml, extraCls, staffId, titleText) {
      if (hideSummaryCols) {
        // 캡처용 마크업: 개별 열 숨김을 적용하지 않고 항상 그대로 그린다.
        if (colDef.summaryOnly) return "";
        const tag = asTh ? "th" : "td";
        return `<${tag} class="sch-info sch-col-${colDef.key}${extraCls ? ` ${extraCls}` : ""}">${asTh ? colDef.label : valueHtml}</${tag}>`;
      }
      if (scheduleUi.manualHiddenInfoCols.has(colDef.key)) return "";
      const tag = asTh ? "th" : "td";
      const stickyEndCls = colDef.key === infoColLastVisible ? " sch-sticky-end" : "";
      const leftStyle = ` style="left:${infoColLefts[colDef.key]}px"`;
      const selCls = asTh ? " sch-col-th" : " sch-row-th";
      const dataAttrs = asTh
        ? ` data-col-key="i:${colDef.key}" title="클릭해서 선택, 선택 후 오른쪽 클릭으로 접기"`
        : ` data-staff-id="${staffId || ""}" data-row-key="s:${staffId || ""}"${titleText ? ` title="${esc(titleText)}"` : ""}`;
      return `<${tag} class="sch-info sch-col-${colDef.key}${stickyEndCls}${selCls}${extraCls ? ` ${extraCls}` : ""}"${leftStyle}${dataAttrs}>${asTh ? colDef.label : valueHtml}</${tag}>`;
    }

    const headRow1 = `<th class="sch-info" colspan="${infoColCount}"></th>` + days.map((d) => {
      const wd = new Date(year, monthIndex, d).getDay();
      const isHoliday = !!getHoliday(scheduleDateKey(year, monthIndex, d));
      const cls = wd === 6 ? "wd-sat" : (isHoliday || wd === 0) ? "wd-sun" : "";
      return `<th class="${cls}${colHiddenCls(d)} sch-col-th" data-col-key="d:${d}" title="${isHoliday ? esc(getHoliday(scheduleDateKey(year, monthIndex, d))) : "클릭해서 선택, 선택 후 오른쪽 클릭으로 접기"}">${pad2(monthIndex + 1)}/${pad2(d)}</th>`;
    }).join("");
    const headRow2 = SCHEDULE_INFO_COLS.map((c) => infoColHtml(c, true)).join("") +
      days.map((d) => {
        const wd = new Date(year, monthIndex, d).getDay();
        const isHoliday = !!getHoliday(scheduleDateKey(year, monthIndex, d));
        const cls = wd === 6 ? "wd-sat" : (isHoliday || wd === 0) ? "wd-sun" : "";
        return `<th class="${cls}${colHiddenCls(d)} sch-col-th" data-col-key="d:${d}" title="클릭해서 선택, 선택 후 오른쪽 클릭으로 접기">${WEEKDAYS[wd]}</th>`;
      }).join("");

    let scheduleRowCounter = 0; // 드래그 선택의 사각형 범위 계산에 쓰는, 렌더링될 때마다 매겨지는 행 순번
    function staffRowHtml(s) {
      const rowIdx = scheduleRowCounter++;
      const searchHidden = !scheduleStaffMatchesSearch(s, scheduleUi.searchQuery);
      const rowHiddenCls = (scheduleUi.manualHiddenStaffIds.has(s.id) || searchHidden) ? " sch-row-hidden" : "";
      const cells = days.map((d) => {
        const dateKey = scheduleDateKey(year, monthIndex, d);
        const record = getScheduleRecord(s.id, dateKey);
        const disp = scheduleCellDisplay(record);
        const memo = getScheduleMemo(s.id, dateKey);
        const memoDot = (memo && !hideMemoMarks) ? `<span class="sch-memo-dot" title="${esc(memo)}"></span>` : "";
        const previewMark = schedulePreviewMarks ? schedulePreviewMarks[scheduleRecordKey(s.id, dateKey)] : 0;
        const previewCls = previewMark ? (previewMark === 2 ? " sch-cell--auto sch-cell--auto-pref" : " sch-cell--auto") : "";
        return `<td class="sch-cell ${disp.cls}${previewCls}${colHiddenCls(d)}" data-staff-id="${s.id}" data-date="${dateKey}" data-row-idx="${rowIdx}" data-day="${d}" title="${esc(memo)}" tabindex="0"><span class="sch-cell-label">${disp.label}</span>${memoDot}</td>`;
      }).join("");
      const counts = scheduleStaffMonthCounts(s.id, year, monthIndex);
      // 이름 칸 메모: 셀 메모와 같은 주황 삼각형 표시(이미지 저장 시엔 hideMemoMarks로 빠진다)를 붙이고,
      // 마우스를 올리면 메모 내용이 툴팁으로 보인다. 이름 칸을 오른쪽 클릭하면 추가/수정/삭제할 수 있다.
      const nameMemo = getScheduleNameMemo(s.id, year, monthIndex);
      const nameMemoDot = (nameMemo && !hideMemoMarks) ? `<span class="sch-memo-dot sch-memo-dot--name"></span>` : "";
      const infoColValues = {
        nickname: esc(s.nickname), name: esc(s.name) + nameMemoDot, empno: esc(s.empNo),
        hiredate: esc(s.hireDate), workhours: esc(s.workHours),
        work: counts.WORK, off: counts.OFF, annual: counts.ANNUAL, daehyu: counts.DAEHYU, absent: counts.ABSENT,
      };
      const infoCells = SCHEDULE_INFO_COLS.map((c) => {
        const extraCls = c.key === "nickname" ? "sch-nickname" : (c.summaryOnly ? "sch-count" : "");
        return infoColHtml(c, false, infoColValues[c.key], extraCls, s.id, c.key === "name" ? nameMemo : "");
      }).join("");
      return `
        <tr class="${rowHiddenCls.trim()}">
          ${infoCells}
          ${cells}
        </tr>
      `;
    }

    // 집계행(관리자 인원/필요인력/대비 등) 왼쪽 라벨 칸. rowKey가 있으면(=캡처가 아니면) 클릭해서
    // 선택 → 오른쪽 클릭으로 그 행 전체를 접을 수 있게 만든다.
    function summaryLabelCellHtml(rowKey, label) {
      if (hideSummaryCols || !rowKey) return `<td class="sch-info" colspan="${infoColCount}">${label}</td>`;
      return `<td class="sch-info sch-row-th" colspan="${infoColCount}" data-row-key="r:${esc(rowKey)}" title="클릭해서 선택, 선택 후 오른쪽 클릭으로 접기">${label}</td>`;
    }
    function summaryRowHiddenCls(rowKey) {
      if (hideSummaryCols) return "";
      if (searchActive) return " sch-row-hidden";
      return (rowKey && scheduleUi.manualHiddenSummaryRows.has(rowKey)) ? " sch-row-hidden" : "";
    }
    // type이 null/undefined면 업무 구분(채팅/유선)과 무관하게 목록 전체를 집계한다.
    // (관리자 인원 집계처럼 채팅/유선 구분 없이 셀 때 사용)
    function summaryRowHtml(label, staffList, type, rowKey) {
      const cells = days.map((d) => {
        const dateKey = scheduleDateKey(year, monthIndex, d);
        const count = staffList.filter((s) => (!type || (s.types || []).indexOf(type) !== -1) && scheduleCountsAsWorked(getScheduleRecord(s.id, dateKey))).length;
        return `<td class="${colHiddenCls(d).trim()}">${count}</td>`;
      }).join("");
      return `<tr class="sch-summary-row${summaryRowHiddenCls(rowKey)}">${summaryLabelCellHtml(rowKey, label)}${cells}</tr>`;
    }

    // "필요인력" 행: 사용자가 직접 숫자를 입력하는 칸(인풋). groupKey는 "DAY"/"NIGHT", type은 "채팅"/"유선".
    // 이 달이 잠겨 있으면(확정됨) 다른 스케줄 셀과 마찬가지로 입력칸 자체를 비활성화해서
    // 클릭·타이핑 자체가 안 먹게 한다. (예전에는 blur 시점에만 저장을 막아서, 입력은 계속
    // 가능해 보이는데 실제로는 저장이 안 되는 것처럼 보이는 문제가 있었다.)
    const monthLocked = scheduleIsMonthLocked(year, monthIndex);
    function requiredHeadcountRowHtml(groupKey, type, label, rowKey) {
      const cells = days.map((d) => {
        const val = getRequiredHeadcount(year, monthIndex, groupKey, type, d);
        return `<td class="sch-required-cell${colHiddenCls(d)}"><input type="number" class="sch-required-input${monthLocked ? " sch-required-input--locked" : ""}" min="0" step="1" inputmode="numeric" data-required-group="${groupKey}" data-required-type="${esc(type)}" data-required-day="${d}" value="${val === null ? "" : val}" placeholder="-"${monthLocked ? " disabled title=\"잠긴 달이에요. 잠금을 해제한 뒤 수정해주세요.\"" : ""}></td>`;
      }).join("");
      return `<tr class="sch-required-row${summaryRowHiddenCls(rowKey)}">${summaryLabelCellHtml(rowKey, label)}${cells}</tr>`;
    }
    // "대비" 행: 실제 투입 인력 - 필요인력 (필요인력을 입력하지 않은 날짜는 빈칸)
    function requiredDiffRowHtml(groupKey, type, staffList, label, rowKey) {
      const cells = days.map((d) => {
        const dateKey = scheduleDateKey(year, monthIndex, d);
        const required = getRequiredHeadcount(year, monthIndex, groupKey, type, d);
        const diff = required === null ? "" : (scheduleActualCount(staffList, type, dateKey) - required);
        return `<td class="${colHiddenCls(d).trim()}">${diff}</td>`;
      }).join("");
      return `<tr class="sch-diff-row${summaryRowHiddenCls(rowKey)}">${summaryLabelCellHtml(rowKey, label)}${cells}</tr>`;
    }
    // "인력 대비 편성" 행: 대비가 0 이상이면 O, 음수면 X (필요인력 미입력 날짜는 빈칸)
    function requiredStatusRowHtml(groupKey, type, staffList, label, rowKey) {
      const cells = days.map((d) => {
        const dateKey = scheduleDateKey(year, monthIndex, d);
        const required = getRequiredHeadcount(year, monthIndex, groupKey, type, d);
        let mark = "";
        let statusCls = "";
        if (required !== null) {
          const diff = scheduleActualCount(staffList, type, dateKey) - required;
          mark = diff >= 0 ? "O" : "X";
          statusCls = diff >= 0 ? " sch-status-ok" : " sch-status-ng";
        }
        return `<td class="${(colHiddenCls(d).trim() + statusCls).trim()}">${mark}</td>`;
      }).join("");
      return `<tr class="sch-status-row${summaryRowHiddenCls(rowKey)}">${summaryLabelCellHtml(rowKey, label)}${cells}</tr>`;
    }
    // 그룹(주간/야간)의 채팅·유선 필요인력 3행 묶음(필요인력/대비/인력 대비 편성)을 한 번에 만든다.
    function requiredHeadcountBlockHtml(groupKey, groupLabel, staffList) {
      return (
        requiredHeadcountRowHtml(groupKey, "채팅", `${groupLabel} 채팅 필요인력`, `${groupKey}·채팅·필요인력`) +
        requiredDiffRowHtml(groupKey, "채팅", staffList, "대비", `${groupKey}·채팅·대비`) +
        requiredStatusRowHtml(groupKey, "채팅", staffList, "인력 대비 편성", `${groupKey}·채팅·인력대비편성`) +
        requiredHeadcountRowHtml(groupKey, "유선", `${groupLabel} 유선 필요인력`, `${groupKey}·유선·필요인력`) +
        requiredDiffRowHtml(groupKey, "유선", staffList, "대비", `${groupKey}·유선·대비`) +
        requiredStatusRowHtml(groupKey, "유선", staffList, "인력 대비 편성", `${groupKey}·유선·인력대비편성`)
      );
    }

    function totalRowHtml(label, groups, rowKey) {
      const cells = days.map((d) => {
        const dateKey = scheduleDateKey(year, monthIndex, d);
        let total = 0;
        groups.forEach(({ staffList, type }) => {
          total += staffList.filter((s) => (s.types || []).indexOf(type) !== -1 && scheduleCountsAsWorked(getScheduleRecord(s.id, dateKey))).length;
        });
        return `<td class="${colHiddenCls(d).trim()}">${total}</td>`;
      }).join("");
      return `<tr class="sch-total-row${summaryRowHiddenCls(rowKey)}">${summaryLabelCellHtml(rowKey, label)}${cells}</tr>`;
    }

    // 행 그룹(관리자/주간/야간 등) 제목 행. 클릭하면 접히고 펼쳐지는 삼각형 토글을 함께 넣는다.
    function groupHeaderRow(key, label, isStatic) {
      const collapsed = scheduleIsRowGroupCollapsed(key);
      const toggle = `<span class="sch-row-toggle" data-toggle-row-group="${key}">${collapsed ? "▸" : "▾"}</span>`;
      const hiddenCls = summaryRowHiddenCls(key);
      const tdCls = hideSummaryCols ? "" : " sch-row-th";
      const tdAttrs = hideSummaryCols ? "" : ` data-row-key="r:${esc(key)}" title="클릭해서 선택, 선택 후 오른쪽 클릭으로 접기"`;
      return `<tr class="sch-group-row${isStatic ? " sch-group-row--static" : ""}${hiddenCls}" data-group-key="${key}"><td class="${tdCls.trim()}" colspan="${infoColCount + numDays}"${tdAttrs}>${toggle}${label}</td></tr>`;
    }
    // 소제목 행(채팅/유선/업무 구분 미지정). 부모 그룹 키에 이어 붙여서 고유 키를 만든다.
    function subGroupHeaderRow(key, label) {
      const collapsed = scheduleIsRowGroupCollapsed(key);
      const toggle = `<span class="sch-row-toggle" data-toggle-row-group="${key}">${collapsed ? "▸" : "▾"}</span>`;
      const hiddenCls = summaryRowHiddenCls(key);
      const tdCls = hideSummaryCols ? "" : " sch-row-th";
      const tdAttrs = hideSummaryCols ? "" : ` data-row-key="r:${esc(key)}" title="클릭해서 선택, 선택 후 오른쪽 클릭으로 접기"`;
      return `<tr class="sch-subgroup-row${hiddenCls}" data-group-key="${key}"><td class="${tdCls.trim()}" colspan="${infoColCount + numDays}"${tdAttrs}>${toggle}${label}</td></tr>`;
    }
    // 접힌 그룹은 제목 행만 남기고 본문(인원 행·집계 행)은 렌더링하지 않는다.
    function groupBody(key, renderFn) {
      return scheduleIsRowGroupCollapsed(key) ? "" : renderFn();
    }

    // 그룹(주간/야간) 안에서 다시 채팅 담당 → 유선 담당 순으로 소제목을 나눠 보여준다.
    function subGroupsHtml(staffList, parentKey) {
      const { chat, voice, etc } = splitByType(staffList);
      let html = "";
      if (chat.length > 0) {
        const key = `${parentKey}::CHAT`;
        html += subGroupHeaderRow(key, `채팅 (${chat.length}명)`);
        html += groupBody(key, () => chat.map(staffRowHtml).join(""));
      }
      if (voice.length > 0) {
        const key = `${parentKey}::VOICE`;
        html += subGroupHeaderRow(key, `유선 (${voice.length}명)`);
        html += groupBody(key, () => voice.map(staffRowHtml).join(""));
      }
      if (etc.length > 0) {
        const key = `${parentKey}::ETC`;
        html += subGroupHeaderRow(key, `업무 구분 미지정 (${etc.length}명)`);
        html += groupBody(key, () => etc.map(staffRowHtml).join(""));
      }
      return html;
    }

    let bodyHtml = "";
    if (filterMode === "ADMIN") {
      // "관리자 저장": 관리자로 등록된 인원만 보여준다.
      if (adminStaff.length === 0) {
        bodyHtml = `<tr><td class="sch-info sch-empty" colspan="${infoColCount + numDays}">등록된 관리자가 없어요.</td></tr>`;
      } else {
        const key = scheduleRowGroupKey(filterMode, "ADMIN");
        bodyHtml += groupHeaderRow(key, `${ICON_SHIELD} 관리자 (${adminStaff.length}명)`, true);
        bodyHtml += groupBody(key, () => adminStaff.map(staffRowHtml).join("") + summaryRowHtml("관리자 인원", adminStaff, null, "관리자"));
      }
    } else if (filterMode === "DAY" || filterMode === "NIGHT") {
      // "주간 저장" / "야간 저장": 관리자는 빼고 해당 조만 보여준다.
      const staffList = filterMode === "DAY" ? dayStaff : nightStaff;
      const groupTitle = filterMode === "DAY" ? `${ICON_SUN} 아침조 / 주간 (${staffList.length}명)` : `${ICON_MOON} 야간조 (${staffList.length}명)`;
      if (staffList.length === 0) {
        bodyHtml = `<tr><td class="sch-info sch-empty" colspan="${infoColCount + numDays}">등록된 인원이 없어요.</td></tr>`;
      } else {
        const key = scheduleRowGroupKey(filterMode, filterMode);
        bodyHtml += groupHeaderRow(key, groupTitle);
        bodyHtml += groupBody(key, () =>
          subGroupsHtml(staffList, key) + summaryRowHtml("채팅 인원", staffList, "채팅", `${filterMode}·채팅인원`) + summaryRowHtml("유선 인원", staffList, "유선", `${filterMode}·유선인원`) +
          (hideRequiredRows ? "" : requiredHeadcountBlockHtml(filterMode, filterMode === "DAY" ? "주간" : "야간", staffList))
        );
      }
    } else if (filterMode === "VOICE" || filterMode === "CHAT") {
      // "유선 저장" / "채팅 저장": 주야간은 통합하되, 캡처 안에서는 주간/야간 구획을 나눠 보여준다.
      const typeName = filterMode === "VOICE" ? "유선" : "채팅";
      const typeKey = filterMode === "VOICE" ? "voice" : "chat";
      const dayTyped = splitByType(dayStaff)[typeKey];
      const nightTyped = splitByType(nightStaff)[typeKey];
      if (dayTyped.length === 0 && nightTyped.length === 0) {
        bodyHtml = `<tr><td class="sch-info sch-empty" colspan="${infoColCount + numDays}">${typeName} 담당 인원이 없어요.</td></tr>`;
      } else {
        if (dayTyped.length > 0) {
          const key = scheduleRowGroupKey(filterMode, "DAY_TYPED");
          bodyHtml += groupHeaderRow(key, `${ICON_SUN} 주간 · ${typeName} (${dayTyped.length}명)`);
          bodyHtml += groupBody(key, () => dayTyped.map(staffRowHtml).join("") + summaryRowHtml(`${typeName} 인원`, dayTyped, typeName, `DAY_TYPED·${typeKey}`));
        }
        if (nightTyped.length > 0) {
          const key = scheduleRowGroupKey(filterMode, "NIGHT_TYPED");
          bodyHtml += groupHeaderRow(key, `${ICON_MOON} 야간 · ${typeName} (${nightTyped.length}명)`);
          bodyHtml += groupBody(key, () => nightTyped.map(staffRowHtml).join("") + summaryRowHtml(`${typeName} 인원`, nightTyped, typeName, `NIGHT_TYPED·${typeKey}`));
        }
        if (dayTyped.length > 0 && nightTyped.length > 0) {
          bodyHtml += totalRowHtml(`주/야간 총 ${typeName} 출근 인원`, [{ staffList: dayTyped, type: typeName }, { staffList: nightTyped, type: typeName }], `total·${typeKey}`);
        }
      }
    } else if (dayStaff.length === 0 && nightStaff.length === 0 && adminStaff.length === 0) {
      bodyHtml = `<tr><td class="sch-info sch-empty" colspan="${infoColCount + numDays}">등록된 인원이 없어요. "상담사 관리"에서 상담사를 등록하면 자동으로 표시돼요.</td></tr>`;
    } else {
      if (adminStaff.length > 0) {
        const key = scheduleRowGroupKey(filterMode, "ADMIN");
        bodyHtml += groupHeaderRow(key, `${ICON_SHIELD} 관리자 (${adminStaff.length}명)`, true);
        bodyHtml += groupBody(key, () => adminStaff.map(staffRowHtml).join("") + summaryRowHtml("관리자 인원", adminStaff, null, "관리자"));
      }
      if (dayStaff.length > 0) {
        const key = scheduleRowGroupKey(filterMode, "DAY");
        bodyHtml += groupHeaderRow(key, `${ICON_SUN} 아침조 / 주간 (${dayStaff.length}명)`);
        bodyHtml += groupBody(key, () =>
          subGroupsHtml(dayStaff, key) + summaryRowHtml("채팅 인원", dayStaff, "채팅", "DAY·채팅인원") + summaryRowHtml("유선 인원", dayStaff, "유선", "DAY·유선인원") +
          (hideRequiredRows ? "" : requiredHeadcountBlockHtml("DAY", "주간", dayStaff))
        );
      }
      if (nightStaff.length > 0) {
        const key = scheduleRowGroupKey(filterMode, "NIGHT");
        bodyHtml += groupHeaderRow(key, `${ICON_MOON} 야간조 (${nightStaff.length}명)`);
        bodyHtml += groupBody(key, () =>
          subGroupsHtml(nightStaff, key) + summaryRowHtml("채팅 인원", nightStaff, "채팅", "NIGHT·채팅인원") + summaryRowHtml("유선 인원", nightStaff, "유선", "NIGHT·유선인원") +
          (hideRequiredRows ? "" : requiredHeadcountBlockHtml("NIGHT", "야간", nightStaff))
        );
      }
      if (dayStaff.length > 0 && nightStaff.length > 0) {
        bodyHtml += totalRowHtml("주/야간 총 채팅 출근 인원", [{ staffList: dayStaff, type: "채팅" }, { staffList: nightStaff, type: "채팅" }], "total·채팅");
        bodyHtml += totalRowHtml("주/야간 총 유선 출근 인원", [{ staffList: dayStaff, type: "유선" }, { staffList: nightStaff, type: "유선" }], "total·유선");
      }
    }

    return `
      <table class="schedule-table">
        <thead>
          <tr>${headRow1}</tr>
          <tr>${headRow2}</tr>
        </thead>
        <tbody>${bodyHtml}</tbody>
      </table>
    `;
  }


  // 화면의 월별 스케줄 표와 같은 내용을 엑셀(.xlsx) 파일로 내려받는다.
  // HTML 표를 그대로 파싱하지 않고, 표를 만들 때 쓰는 것과 같은 데이터를
  // 다시 조립해서 셀 값(라벨 텍스트)을 그대로 넣는다.
  // 1-based 열 번호 -> 엑셀 열 문자(A, B, ..., Z, AA, ...)
  function scheduleColLetter(n) {
    let s = "";
    while (n > 0) {
      const rem = (n - 1) % 26;
      s = String.fromCharCode(65 + rem) + s;
      n = Math.floor((n - 1) / 26);
    }
    return s;
  }

  // 월별 스케줄 표를 엑셀(.xlsx)로 내려받는다.
  // 사내에서 예전부터 쓰던 수기 엑셀 양식(통합/채팅/유선 3개 시트, 기준일 하나에서
  // 수식으로 이어지는 날짜 행, 근무=SUM 수식 등)과 열 순서·수식 스타일을 맞췄다.
  // - 통합 시트: 전체 인원(관리자+주간+야간, 주간/야간은 다시 채팅/유선/미지정 순)
  // - 채팅/유선 시트: 업무 구분이 채팅(또는 유선)인 인원만 모아서 같은 양식으로 반복
  // - 근무/휴일/연차/대휴/결근 합계와 채팅·유선 인원 집계는 값이 아니라 SUM·COUNTIF
  //   수식으로 넣어서, 엑셀에서 날짜 칸을 직접 고쳐도 합계가 자동으로 다시 계산된다.
  //   (반차는 인원 집계에서 0.5명으로 센다.)
  // - "필요인력 대비 편성(O/X)" 판정은 앱에 없는 날짜별 수기 허용치가 있어야 하는
  //   부분이라 이 내보내기에는 포함하지 않는다.
  async function exportScheduleToExcel() {
    if (typeof ExcelJS === "undefined") {
      flashScheduleStatus("엑셀 변환 기능을 불러오지 못했어요. 인터넷 연결을 확인해주세요.");
      return;
    }
    const btn = document.getElementById("sch-excel-btn");
    if (btn) { btn.disabled = true; btn.textContent = "엑셀 생성 중..."; }

    try {
      const { year, monthIndex } = scheduleUi;
      const numDays = scheduleDaysInMonth(year, monthIndex);
      const days = [];
      for (let d = 1; d <= numDays; d++) days.push(d);
      // A: 이름 참조(=C{row}, 정렬·검색용) ~ K: 결근. L부터 날짜 열.
      const infoCols = 11;
      const totalCols = infoCols + numDays;
      const anchorCol = totalCols + 1; // 날짜 수식이 참조하는 "기준 월" 칸(맨 오른쪽)
      const anchorColL = scheduleColLetter(anchorCol);
      const firstDayColL = scheduleColLetter(infoCols + 1);
      const lastDayColL = scheduleColLetter(infoCols + numDays);

      const monthStaff = getStaffListForMonth(year, monthIndex);

      // 엑셀은 화면 밖에서(인쇄·공유 등) 보는 경우가 많으므로, 현재 켜둔 화면 테마(다크 등)와
      // 상관없이 항상 밝고 차분한 "보고용" 팔레트를 쓴다. 상태별 배경은 화면 월별 스케줄 표와
      // 같은 색을 옅게(흰 배경에 얹은 배지색) 넣고, 글자는 그 진한 원색을 써서 어떤 색인지는
      // 한눈에 들어오되 셀 전체가 원색으로 칠해지지 않게 한다.
      const blendWithWhite = (hex, alpha) => {
        const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
        const a = alpha / 255;
        const mix = (c) => Math.round(c * a + 255 * (1 - a)).toString(16).padStart(2, "0").toUpperCase();
        return mix(r) + mix(g) + mix(b);
      };
      const solid = (hex) => "FF" + hex;
      const pastel = (hex, alpha) => "FF" + blendWithWhite(hex, alpha || 0x26);

      const COLOR = {
        headerBg: solid("DBEEF3"),
        headerText: solid("4D5057"),
        dateGray: solid("BFBFBF"),
        summary: solid("D7E4BC"),
        summaryText: solid("000000"),
        total: solid("B3A2C7"),
        totalText: solid("000000"),
        border: solid("DEE1E6"),
        nickname: solid("24262B"),
        groupLabel: solid("FF0000"),
        anchorBg: solid("FFC000"),
        amountBg: solid("FFFFCC"),
      };
      // 월별 스케줄 표의 범례와 같은 상태별 색(배경은 옅게, 글자는 진하게)
      const STATUS_BASE = {
        "휴일": "3778B0",
        "연차": "B9791E",
        "대휴": "2C7F96",
        "반차": "C2603F",
        "공휴": "227D75",
        "공가": "7454B5",
        "육휴": "B5548F",
        "특휴": "A554B6",
        "교육": "2F9E63",
        "지각": "8A6A1F",
        "결근": "C94F4F",
      };
      const STATUS_FILL = {};
      const STATUS_TEXT = {};
      Object.keys(STATUS_BASE).forEach((label) => {
        STATUS_FILL[label] = pastel(STATUS_BASE[label]);
        STATUS_TEXT[label] = solid(STATUS_BASE[label]);
      });
      STATUS_FILL["퇴사"] = solid("E4E6EA");
      STATUS_TEXT["퇴사"] = solid("7C7D84");

      const wb = new ExcelJS.Workbook();
      const thinBorder = { style: "thin", color: { argb: COLOR.border } };
      function applyBorder(cell) {
        cell.border = { top: thinBorder, left: thinBorder, bottom: thinBorder, right: thinBorder };
      }

      // sheetName: 시트 이름("통합"/"채팅"/"유선"). staffList: 이 시트에 실을 인원(이미
      // 업무 구분으로 걸러진 목록). singleTypeLabel: "채팅"/"유선"이면 주간·야간을 채팅/유선으로
      // 다시 나누지 않고 통째로 하나의 인원 집계행만 만든다(통합 시트는 undefined로 호출).
      function buildSheet(sheetName, staffList, singleTypeLabel) {
        const adminStaff = staffList.filter((s) => s.isAdmin);
        const dayStaff = sortStaffByType(staffList.filter((s) => s.group !== "night" && !s.isAdmin));
        const nightStaff = sortStaffByType(staffList.filter((s) => s.group === "night" && !s.isAdmin));

        const ws = wb.addWorksheet(sheetName, {
          views: [{ state: "frozen", xSplit: infoCols, ySplit: 3, showGridLines: false }],
        });
        ws.columns = [
          { width: 6 }, { width: 11 }, { width: 8 }, { width: 10 }, { width: 10 }, { width: 11 },
          { width: 6 }, { width: 6 }, { width: 6 }, { width: 6 }, { width: 6 },
        ].concat(days.map(() => ({ width: 4.7 }))).concat([{ width: 9.5 }]);

        // 1행: 일(day) 숫자만 수식으로 표시 (=DAY(같은 열의 2행))
        const row1 = ws.addRow([]);
        days.forEach((d, i) => {
          const col = infoCols + 1 + i;
          const cell = row1.getCell(col);
          cell.value = { formula: `DAY(${scheduleColLetter(col)}2)` };
          cell.font = { color: { argb: COLOR.dateGray } };
          cell.alignment = { horizontal: "center", vertical: "middle" };
        });

        // 2행: 인원정보 항목명 + 날짜(기준 월 칸에서 이어지는 수식 체인)
        const row2 = ws.addRow([]);
        ["", "LDAP", "이름", "사번", "입사일자", "근무시간", "근무", "휴일", "연차", "대휴", "결근"].forEach((h, i) => {
          if (i === 0) return;
          row2.getCell(i + 1).value = h;
        });
        days.forEach((d, i) => {
          const col = infoCols + 1 + i;
          const cell = row2.getCell(col);
          cell.value = { formula: i === 0 ? `${anchorColL}3` : `${scheduleColLetter(col - 1)}2+1` };
          cell.numFmt = "mm/dd";
        });
        row2.getCell(anchorCol).value = "기준 월";
        row2.getCell(anchorCol).font = { bold: true };
        row2.getCell(anchorCol).fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.anchorBg } };
        applyBorder(row2.getCell(anchorCol));
        row2.getCell(anchorCol).alignment = { horizontal: "center", vertical: "middle" };

        // 3행: 요일(=TEXT(2행,"AAA")) + 기준일(그 달 1일) 값
        const row3 = ws.addRow([]);
        days.forEach((d, i) => {
          const col = infoCols + 1 + i;
          row3.getCell(col).value = { formula: `TEXT(${scheduleColLetter(col)}2,"AAA")` };
        });
        row3.getCell(anchorCol).value = new Date(year, monthIndex, 1);
        row3.getCell(anchorCol).numFmt = 'mm"월" dd"일"';
        applyBorder(row3.getCell(anchorCol));
        row3.getCell(anchorCol).alignment = { horizontal: "center", vertical: "middle" };

        [row2, row3].forEach((row) => {
          for (let c = 2; c <= totalCols; c++) {
            const cell = row.getCell(c);
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.headerBg } };
            cell.font = Object.assign({ color: { argb: COLOR.headerText } }, cell.font);
            cell.alignment = { horizontal: "center", vertical: "middle" };
            applyBorder(cell);
          }
        });
        for (let c = 2; c <= infoCols; c++) ws.mergeCells(2, c, 3, c);

        function addStaffRow(s) {
          const row = ws.addRow([]);
          const r = row.number;
          row.getCell(1).value = { formula: `C${r}` };
          row.getCell(2).value = s.nickname || "";
          row.getCell(3).value = s.name || "";
          row.getCell(4).value = s.empNo || "";
          if (s.hireDate) {
            row.getCell(5).value = new Date(s.hireDate);
            row.getCell(5).numFmt = "yyyy-mm-dd";
          }
          row.getCell(6).value = s.workHours || "";

          const rangeRef = `${firstDayColL}${r}:${lastDayColL}${r}`;
          const rangeAbs = `$${firstDayColL}${r}:$${lastDayColL}${r}`;
          // 근무=근무일(SUM)+반차+공가, 휴일=휴일류(육휴·특휴·대휴·공휴 포함) 개수,
          // 연차/대휴/결근은 해당 라벨 개수를 그대로 센다.
          row.getCell(7).value = { formula: `SUM(${rangeRef})+COUNTIF(${rangeRef},"반차")+COUNTIF(${rangeRef},"공가")` };
          row.getCell(8).value = { formula: `COUNTIF(${rangeAbs},H$2)+COUNTIF(${rangeAbs},"육휴")+COUNTIF(${rangeAbs},"특휴")+COUNTIF(${rangeAbs},"대휴")+COUNTIF(${rangeAbs},"공휴")` };
          row.getCell(9).value = { formula: `COUNTIF(${rangeAbs},I$2)` };
          row.getCell(10).value = { formula: `COUNTIF(${rangeAbs},J$2)` };
          row.getCell(11).value = { formula: `COUNTIF(${rangeAbs},K$2)` };

          for (let c = 2; c <= totalCols; c++) {
            applyBorder(row.getCell(c));
            row.getCell(c).alignment = { horizontal: "center", vertical: "middle" };
          }
          for (let c = 7; c <= 11; c++) {
            const amountCell = row.getCell(c);
            amountCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.amountBg } };
            amountCell.numFmt = '_-* #,##0_-;-* #,##0_-;_-* "-"_-;_-@';
          }
          row.getCell(2).font = { bold: true, color: { argb: COLOR.nickname } };
          // 이름 칸에 남긴 메모도 셀 메모처럼 엑셀 "메모(노트)"로 넣는다.
          const nameMemo = getScheduleNameMemo(s.id, year, monthIndex);
          if (nameMemo) {
            row.getCell(3).note = { texts: [{ text: nameMemo }], margins: { insetmode: "auto" } };
          }

          days.forEach((d, i) => {
            const col = infoCols + 1 + i;
            const cell = row.getCell(col);
            const dateKey = scheduleDateKey(year, monthIndex, d);
            const appLabel = scheduleCellDisplay(getScheduleRecord(s.id, dateKey)).label;
            // 화면·복사/붙여넣기 등 앱 내부에서는 "오프"라는 값을 그대로 쓰지만,
            // 엑셀 내보내기에서는(헤더도 "휴일"로 통일했으므로) 이 칸의 표시 값도
            // "휴일"로 바꿔서 써야 헤더 문구·COUNTIF(H$2 등) 수식과 어긋나지 않는다.
            const label = appLabel === "오프" ? "휴일" : appLabel;
            // 근무("1")는 SUM 수식이 실제로 더할 수 있게 문자열이 아닌 숫자로 넣는다.
            cell.value = label === "1" ? 1 : label;
            const fillArgb = STATUS_FILL[label];
            if (fillArgb) {
              cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: fillArgb } };
              cell.font = { bold: label === "지각" || label === "결근", color: { argb: STATUS_TEXT[label] || COLOR.nickname } };
            }
            // 화면에서 남긴 셀 메모는 엑셀에서 "메모(노트)"로 그대로 들어간다.
            const memo = getScheduleMemo(s.id, dateKey);
            if (memo) {
              cell.note = { texts: [{ text: memo }], margins: { insetmode: "auto" } };
            }
          });
          return r;
        }

        // "주간"/"야간" 같은 조 라벨 한 줄(굵은 빨강 글자 + 인원 수). 채팅/유선 구분 없이
        // 짧게 표시만 하고, 별도 배경색·테두리는 넣지 않는다.
        function addGroupLabelRow(label, count) {
          const row = ws.addRow([]);
          row.getCell(2).value = label;
          row.getCell(2).font = { bold: true, color: { argb: COLOR.groupLabel } };
          row.getCell(2).alignment = { horizontal: "center", vertical: "middle" };
          row.getCell(3).value = count;
          row.getCell(3).alignment = { horizontal: "center", vertical: "middle" };
          row.height = 15;
          return row.number;
        }

        // range의 각 날짜 열에서 근무("1")+반차 0.5명을 더한 인원 집계 행.
        function addPersonSummaryRow(label, range) {
          const row = ws.addRow([]);
          ws.mergeCells(row.number, 2, row.number, infoCols);
          row.getCell(2).value = label;
          days.forEach((d, i) => {
            const col = infoCols + 1 + i;
            const colL = scheduleColLetter(col);
            row.getCell(col).value = { formula: `COUNTIF(${colL}${range.start}:${colL}${range.end},"1")+(COUNTIF(${colL}${range.start}:${colL}${range.end},"반차")*0.5)` };
          });
          for (let c = 2; c <= totalCols; c++) {
            const cell = row.getCell(c);
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.summary } };
            cell.font = { color: { argb: COLOR.summaryText } };
            cell.alignment = { horizontal: "center", vertical: "middle" };
            applyBorder(cell);
          }
          return row.number;
        }

        function addTotalRow(label, rowNums) {
          const row = ws.addRow([]);
          ws.mergeCells(row.number, 2, row.number, infoCols);
          row.getCell(2).value = label;
          days.forEach((d, i) => {
            const col = infoCols + 1 + i;
            const colL = scheduleColLetter(col);
            row.getCell(col).value = { formula: `SUM(${rowNums.map((rn) => `${colL}${rn}`).join("+")})` };
          });
          for (let c = 2; c <= totalCols; c++) {
            const cell = row.getCell(c);
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.total } };
            cell.font = { color: { argb: COLOR.totalText }, bold: true };
            cell.alignment = { horizontal: "center", vertical: "middle" };
            applyBorder(cell);
          }
          return row.number;
        }

        // groupLabel(주간/야간) 한 조 전체를 쓴다. 통합 시트(singleTypeLabel 없음)는 채팅/유선을
        // 나눠 각각 인원 집계행을 만들고, 채팅/유선 시트는 이미 한 업무 구분만 모여 있으므로
        // 나누지 않고 인원 집계행 하나만 만든다.
        function addGroupBlock(groupLabel, groupStaff) {
          addGroupLabelRow(groupLabel, groupStaff.length);
          // 샘플 양식과 동일하게: "주간" 조의 집계행에만 "총"을 붙이고("주간 총 채팅 인원"),
          // "야간" 조는 붙이지 않는다("야간 채팅 인원").
          const totalPrefix = groupLabel === "주간" ? `${groupLabel} 총` : groupLabel;
          if (!singleTypeLabel) {
            const { chat, voice, etc } = splitByType(groupStaff);
            let chatRange = null, voiceRange = null;
            if (chat.length > 0) { const start = ws.rowCount + 1; chat.forEach(addStaffRow); chatRange = { start, end: ws.rowCount }; }
            if (voice.length > 0) { const start = ws.rowCount + 1; voice.forEach(addStaffRow); voiceRange = { start, end: ws.rowCount }; }
            if (etc.length > 0) etc.forEach(addStaffRow);
            const result = {};
            if (chatRange) result.chatRow = addPersonSummaryRow(`${totalPrefix} 채팅 인원`, chatRange);
            if (voiceRange) result.voiceRow = addPersonSummaryRow(`${totalPrefix} 유선 인원`, voiceRange);
            return result;
          }
          const start = ws.rowCount + 1;
          groupStaff.forEach(addStaffRow);
          return { sumRow: addPersonSummaryRow(`${totalPrefix} ${singleTypeLabel} 인원`, { start, end: ws.rowCount }) };
        }

        if (adminStaff.length === 0 && dayStaff.length === 0 && nightStaff.length === 0) {
          ws.getCell(4, 2).value = "등록된 인원이 없어요.";
        } else {
          if (adminStaff.length > 0) adminStaff.forEach(addStaffRow);
          let dayRes = null, nightRes = null;
          if (dayStaff.length > 0) dayRes = addGroupBlock("주간", dayStaff);
          if (nightStaff.length > 0) nightRes = addGroupBlock("야간", nightStaff);
          if (singleTypeLabel && dayRes && nightRes) {
            addTotalRow(`주/야간 총 ${singleTypeLabel} 출근 인원`, [dayRes.sumRow, nightRes.sumRow]);
          }
        }

        // 셀마다 색상·굵기 등은 이미 위에서 개별로 지정했으므로, 그 속성은 그대로 두고
        // 폰트 크기만 기본 10으로 통일해준다.
        ws.eachRow((row) => {
          row.eachCell({ includeEmpty: true }, (cell) => {
            cell.font = Object.assign({}, cell.font, { size: 8 });
          });
        });
      }

      buildSheet("통합", monthStaff);
      const chatStaff = monthStaff.filter((s) => (s.types || []).indexOf("채팅") !== -1);
      const voiceStaff = monthStaff.filter((s) => (s.types || []).indexOf("유선") !== -1);
      if (chatStaff.length > 0) buildSheet("채팅", chatStaff, "채팅");
      if (voiceStaff.length > 0) buildSheet("유선", voiceStaff, "유선");

      const buffer = await wb.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `월별상담사스케줄_${year}${pad2(monthIndex + 1)}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
      flashScheduleStatus("엑셀 파일을 다운로드했어요.");
    } catch (err) {
      console.error(err);
      flashScheduleStatus("엑셀 파일을 만들지 못했어요.");
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = ICON_CHART + " 엑셀로 다운로드"; }
    }
  }

  // buildScheduleTableHtml의 filterMode와 같은 기준으로, 캡처 대상 인원만 골라
  // "이번 달 지각·결근 기록"도 캡처된 표 안의 인원과 항상 일치하도록 한다.
