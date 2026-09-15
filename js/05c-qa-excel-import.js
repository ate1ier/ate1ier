  // 05c-qa-excel-import.js — 엑셀 셀/워크시트 파싱, 업로드 처리
  // (05-qa.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  function qaColLetterToNum(letters) {
    let n = 0;
    for (let i = 0; i < letters.length; i++) n = n * 26 + (letters.charCodeAt(i) - 64);
    return n;
  }
  // 병합 셀·수식 셀 어디서든 "실제로 화면에 보이는 값"을 안전하게 꺼낸다.
  function qaCellRawValue(ws, row, col) {
    const cell = ws.getRow(row).getCell(col);
    let val = cell.value;
    if (cell.isMerged && cell.master && cell.master !== cell) val = cell.master.value;
    if (val && typeof val === "object") {
      if (val instanceof Date) return val;
      if (Object.prototype.hasOwnProperty.call(val, "result")) val = val.result;
      else if (Array.isArray(val.richText)) val = val.richText.map((t) => t.text).join("");
      else if (Object.prototype.hasOwnProperty.call(val, "text")) val = val.text;
      else if (Object.prototype.hasOwnProperty.call(val, "error")) val = null;
    }
    return val;
  }
  function qaCellText(ws, row, col) {
    const v = qaCellRawValue(ws, row, col);
    if (v === null || v === undefined) return "";
    if (v instanceof Date) return "";
    return String(v).trim();
  }
  // 시트 전체(또는 위쪽 몇 줄)에서 특정 텍스트와 정확히 일치하는 칸을 찾는다.
  function qaFindCell(ws, targetText, opts) {
    opts = opts || {};
    const maxRow = opts.maxRow || ws.rowCount;
    const maxCol = opts.maxCol || ws.columnCount;
    for (let r = 1; r <= maxRow; r++) {
      for (let c = 1; c <= maxCol; c++) {
        if (qaCellText(ws, r, c) === targetText) return { row: r, col: c };
      }
    }
    return null;
  }
  // 위와 같지만 "포함" 여부로 찾는다(칸 이름이 "상담ID", "상담 ID" 등으로 조금씩 달라도 잡히게).
  function qaFindCellContains(ws, targetText, opts) {
    opts = opts || {};
    const maxRow = opts.maxRow || ws.rowCount;
    const maxCol = opts.maxCol || ws.columnCount;
    for (let r = 1; r <= maxRow; r++) {
      for (let c = 1; c <= maxCol; c++) {
        const t = qaCellText(ws, r, c).replace(/\s+/g, "");
        if (t && t.indexOf(targetText) !== -1) return { row: r, col: c };
      }
    }
    return null;
  }

  // 시트 하나를 분석해서 { totalScore, rounds } 형태로 돌려준다.
  // rounds: 구분 열의 "1차/2차/…" 라벨이 여러 행에 걸쳐 병합된 블록마다,
  // 그 블록 안에서 2칸 이상 가로로 병합된(=서술형 코멘트) 칸의 내용을 모은 것.
  function qaParseWorksheet(ws) {
    const avgCell = qaFindCell(ws, "평균");
    const totalCell = qaFindCell(ws, "총점", { maxRow: 12 });
    if (!avgCell || !totalCell) throw new Error("'평균' 행 또는 '총점' 열을 찾지 못했어요.");
    const rawScore = qaCellRawValue(ws, avgCell.row, totalCell.col);
    const scoreNum = Number(rawScore);
    if (rawScore === null || rawScore === undefined || isNaN(scoreNum)) throw new Error("평균×총점 칸의 값이 숫자가 아니에요.");
    // 엑셀 수식이 내부적으로 81.166666...처럼 소수점 아래 여러 자리를 들고 있어도,
    // 엑셀 화면(및 우리 목록)에는 소수점 첫째 자리까지만 보이므로 그 표시값과
    // 저장되는 값이 어긋나지 않도록 여기서 미리 소수 첫째 자리로 반올림해서 저장한다.
    const score = Math.round(scoreNum * 10) / 10;

    const merges = (ws.model && ws.model.merges ? ws.model.merges : [])
      .map((rangeStr) => {
        const m = /^([A-Z]+)(\d+):([A-Z]+)(\d+)$/.exec(rangeStr);
        if (!m) return null;
        return { c1: qaColLetterToNum(m[1]), r1: parseInt(m[2], 10), c2: qaColLetterToNum(m[3]), r2: parseInt(m[4], 10) };
      })
      .filter(Boolean);

    const gubunCell = qaFindCell(ws, "구분");
    const gubunCol = gubunCell ? gubunCell.col : 2;

    const roundBlocks = merges
      .filter((mg) => mg.c1 === gubunCol && mg.c2 === gubunCol && mg.r2 > mg.r1)
      .map((mg) => ({ label: qaCellText(ws, mg.r1, mg.c1).replace(/\s+/g, ""), startRow: mg.r1, endRow: mg.r2 }))
      .filter((b) => /^\d+차$/.test(b.label))
      .sort((a, b) => a.startRow - b.startRow);

    const roundSummaryRows = [];
    for (let r = 1; r <= ws.rowCount; r++) {
      const label = qaCellText(ws, r, gubunCol).replace(/\s+/g, "");
      if (!/^\d+차$/.test(label)) continue;
      if (roundBlocks.some((b) => r >= b.startRow && r <= b.endRow)) continue;
      roundSummaryRows.push({ label, row: r });
    }
    const dateCell = qaFindCell(ws, "상담일", { maxRow: 12 });
    // "상담ID"의 실제 헤더가 "상담 ID"처럼 띄어쓰기가 다르거나, 맨 위 12행이 아니라
    // 각 차수 표 근처(더 아래쪽)에 있을 수도 있어서 시트 전체를 대상으로 찾는다.
    const idCell = qaFindCell(ws, "상담ID") || qaFindCellContains(ws, "상담ID") || qaFindCellContains(ws, "상담아이디");
    // 서술형 피드백 칸은 항상 "총점" 열에서 끝나는 가로 병합(예: S19:X19)으로 되어 있다.
    // (카테고리 라벨처럼 폭이 좁은 다른 가로 병합과 구분하기 위한 기준)
    const feedbackMerges = merges.filter((mg) => mg.c2 > mg.c1 && mg.r1 === mg.r2 && mg.c2 === totalCell.col);
    const guidelineRe = /^\[-?\d+\]\s*/;

    const rounds = roundBlocks.map((block) => {
      const summary = roundSummaryRows.find((s) => s.label === block.label);
      let dateVal = summary && dateCell ? qaCellRawValue(ws, summary.row, dateCell.col) : null;
      if (dateVal instanceof Date) dateVal = `${dateVal.getFullYear()}-${pad2(dateVal.getMonth() + 1)}-${pad2(dateVal.getDate())}`;
      else dateVal = dateVal ? String(dateVal).trim() : "";
      // "상담ID"는 요약표(구분/상담사/상담일)가 아니라, 각 회차 상세표의 시작 행에만
      // 한 번 들어있다(예: "1차" 블록의 첫 행). summary.row(요약표) 기준으로 읽으면
      // 그 자리엔 상담사 이름이 있어서 엉뚱한 값이 나온다.
      let idVal = idCell ? qaCellRawValue(ws, block.startRow, idCell.col) : null;
      idVal = (idVal === null || idVal === undefined) ? "" : String(idVal).trim();
      const roundScoreRaw = summary ? qaCellRawValue(ws, summary.row, totalCell.col) : null;
      const roundScoreNum = Number(roundScoreRaw);
      const roundScore = (roundScoreRaw === null || roundScoreRaw === undefined || isNaN(roundScoreNum)) ? null : Math.round(roundScoreNum * 10) / 10;

      const items = [];
      for (let r = block.startRow; r <= block.endRow; r++) {
        const fbMerge = feedbackMerges.find((mg) => mg.r1 === r);
        const feedbackText = fbMerge ? qaCellText(ws, fbMerge.r1, fbMerge.c1) : "";
        if (!feedbackText) continue; // 코멘트가 없는(만점) 항목은 요약 대상에서 제외
        let guideline = "";
        const rowWidth = Math.min(ws.columnCount, 40);
        for (let c = 1; c <= rowWidth; c++) {
          const t = qaCellText(ws, r, c);
          if (t && guidelineRe.test(t)) { guideline = t.replace(guidelineRe, "").trim(); break; }
        }
        items.push({ guideline, feedback: feedbackText });
      }
      // itemCount는 원문이 나중에 만료되어 items가 비워져도 "원래 감점 항목이 있었는지"를
      // 계속 구분할 수 있도록 별도로 남겨둔다.
      return { label: block.label, date: dateVal, consultId: idVal, score: roundScore, items, itemCount: items.length };
    });

    return { totalScore: score, rounds };
  }

  // 여러 개의 xlsx 파일(상담사 1명당 1개, 또는 여러 상담사가 시트로 나뉜 파일 모두 지원)을
  // 한 번에 받아서, 시트 이름(없으면 파일명)을 상담사 이름과 맞춰 자동으로 반영한다.
  async function qaHandleExcelFiles(fileList) {
    console.log("[QA 업로드] onchange 발생, 선택된 파일 수:", fileList ? fileList.length : 0);
    const files = Array.from(fileList || []);
    if (!files.length) {
      console.warn("[QA 업로드] 선택된 파일이 없어요 (파일 선택 대화상자에서 취소했거나, 브라우저가 파일을 전달하지 못했어요).");
      return;
    }
    console.log("[QA 업로드] 파일 목록:", files.map((f) => f.name));
    const { year, monthIndex } = qaUi;
    if (qaIsMonthLocked(year, monthIndex)) {
      console.warn("[QA 업로드] 이 달은 잠겨 있어서 업로드를 막았어요:", qaMonthLabel());
      flashQAStatus("잠긴 달이에요. 잠금을 해제한 뒤 업로드해주세요.");
      alert(`${qaMonthLabel()}은(는) 잠겨 있어서 업로드할 수 없어요.\n상단의 "잠금 해제" 버튼을 먼저 눌러주세요.`);
      return;
    }
    if (typeof ExcelJS === "undefined") {
      console.error("[QA 업로드] ExcelJS 라이브러리가 로드되지 않았어요. CDN(cdn.jsdelivr.net)이 차단됐거나 인터넷 연결이 끊겼을 수 있어요. 개발자도구 Network 탭에서 exceljs.min.js 요청이 실패했는지 확인해주세요.");
      flashQAStatus("엑셀 처리 기능을 불러오지 못했어요 (인터넷 연결 확인)");
      alert("엑셀 처리 기능을 불러오지 못했어요.\n\n인터넷 연결을 확인하거나, 방화벽/보안 프로그램이 cdn.jsdelivr.net 접속을 막고 있지 않은지 확인해주세요.\n(F12 개발자도구 → Network 탭에서 exceljs.min.js 요청이 실패(빨간색)로 뜨는지 확인하시면 정확한 원인을 알 수 있어요.)");
      return;
    }

    let allAgents, normName, matchAgentByName, okCount, failList;
    try {
      allAgents = agentsData.filter((a) => !a.isAdmin);
      normName = (s) => String(s || "").trim().replace(/\s+/g, "");
      matchAgentByName = (name) => {
        const target = normName(name);
        if (!target) return null;
        return allAgents.find((a) => normName(a.name) === target) || null;
      };
      okCount = 0;
      failList = [];
    } catch (setupErr) {
      console.error("[QA 업로드] 초기화 단계에서 오류가 발생했어요:", setupErr);
      alert(`엑셀 업로드 준비 중 오류가 발생했어요.\n\n${setupErr.message}\n\n(F12 콘솔에 자세한 내용이 남았어요. 개발자에게 이 메시지를 전달해주세요.)`);
      return;
    }
    flashQAStatus("엑셀을 분석하고 있어요...");

    for (const file of files) {
      let wb;
      try {
        const buf = await file.arrayBuffer();
        wb = new ExcelJS.Workbook();
        await wb.xlsx.load(buf);
      } catch (readErr) {
        console.error(readErr);
        failList.push(`${file.name}: 파일을 읽지 못했어요 (.xlsx 파일이 맞는지 확인해주세요)`);
        continue;
      }
      const sheets = wb.worksheets || [];
      if (!sheets.length) { failList.push(`${file.name}: 시트를 찾지 못했어요.`); continue; }
      let matchedAny = false;
      for (const ws of sheets) {
        let agent = matchAgentByName(ws.name);
        if (!agent && sheets.length === 1) agent = matchAgentByName(file.name.replace(/\.xlsx$/i, ""));
        if (!agent) {
          console.warn(`[QA 업로드] 이름이 일치하는 상담사를 못 찾았어요. 시트명="${ws.name}", 파일명="${file.name}". 등록된 상담사 이름 목록:`, allAgents.map((a) => a.name));
          continue;
        }
        matchedAny = true;
        try {
          const parsed = qaParseWorksheet(ws);
          setQAScore(agent.id, year, monthIndex, String(parsed.totalScore));
          // 퇴사한 상담사는 점수만 반영하고, 차수별 원문(감점/코멘트)은 어차피
          // 볼 일이 없으므로 가져오지 않는다. 상세 카드에는 "퇴사 인원"이라고만 표시된다.
          if (agent.status === "RESIGNED") {
            setQADetail(agent.id, year, monthIndex, {
              fileName: file.name,
              sheetName: ws.name,
              uploadedAt: new Date().toISOString(),
              rounds: [],
              resignedNote: true,
            });
          } else {
            setQADetail(agent.id, year, monthIndex, {
              fileName: file.name,
              sheetName: ws.name,
              uploadedAt: new Date().toISOString(),
              rounds: parsed.rounds,
            });
          }
          okCount++;
        } catch (parseErr) {
          failList.push(`${ws.name || file.name}: ${parseErr.message}`);
        }
      }
      if (!matchedAny) failList.push(`${file.name}: 이름이 일치하는 상담사를 찾지 못했어요 (시트명 또는 파일명을 상담사 이름과 맞춰주세요)`);
    }

    renderApp();
    if (failList.length) {
      flashQAStatus(`${okCount}명 반영됨 · ${failList.length}건 실패`);
      alert(`엑셀 업로드 결과\n\n반영됨: ${okCount}건\n실패: ${failList.length}건\n\n${failList.join("\n")}`);
    } else {
      flashQAStatus(`${okCount}명 반영됨`);
    }
  }

  /* ===================== 상담사 이름 클릭 → QA 상세 카드 팝업 (엑셀 원문 정리) ===================== */
