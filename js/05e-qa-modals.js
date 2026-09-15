  // 05e-qa-modals.js — 업로드/상세 모달, 점수 셀·차이 HTML, 상담사 QA 미리보기
  // (05-qa.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  function closeQAUploadModal() {
    const existing = document.getElementById("qa-upload-overlay");
    if (existing) existing.remove();
    document.removeEventListener("keydown", qaUploadEscHandler, true);
  }
  function qaUploadEscHandler(e) { if (e.key === "Escape") closeQAUploadModal(); }

  function openQAUploadModal() {
    closeQAUploadModal();
    const { year, monthIndex } = qaUi;
    if (qaIsMonthLocked(year, monthIndex)) { flashQAStatus("잠긴 달이에요. 잠금을 해제한 뒤 업로드해주세요."); return; }

    const overlay = document.createElement("div");
    overlay.id = "qa-upload-overlay";
    overlay.className = "sch-preview-overlay";
    overlay.innerHTML = `
      <div class="sch-preview-box qa-upload-box">
        <div class="sch-preview-head">
          <span>QA 평가 엑셀 업로드 · ${esc(qaMonthLabel())}</span>
          <button type="button" class="sch-preview-close" id="qa-upload-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="sch-preview-body qa-upload-body">
          <div class="qa-upload-dropzone" id="qa-upload-dropzone">
            <div class="qa-upload-dropzone-icon">${ICON_UPLOAD}</div>
            <div class="qa-upload-dropzone-text">여기로 엑셀 파일을 끌어다 놓아주세요</div>
            <div class="qa-upload-dropzone-sub">여러 상담사 파일을 한꺼번에 놓아도 돼요</div>
            <button type="button" class="ghost-btn" id="qa-upload-pick-btn">파일 선택</button>
            <input type="file" id="qa-upload-input" accept=".xlsx" multiple style="display:none;">
          </div>
          <div class="qa-help-text" style="margin:12px 0 0;">상담사 1명당 파일 1개(시트명 또는 파일명 = 상담사 이름)도, 여러 상담사가 시트로 나뉜 파일 하나도 모두 지원돼요.</div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeQAUploadModal(); };
    document.getElementById("qa-upload-close-x").onclick = () => closeQAUploadModal();
    document.addEventListener("keydown", qaUploadEscHandler, true);

    const dropzone = document.getElementById("qa-upload-dropzone");
    const fileInput = document.getElementById("qa-upload-input");

    const runUpload = (fileList, source) => {
      console.log(`[QA 업로드] ${source}로 전달된 파일 수:`, fileList ? fileList.length : 0);
      if (!fileList || !fileList.length) {
        flashQAStatus("파일을 인식하지 못했어요.");
        return;
      }
      closeQAUploadModal();
      qaHandleExcelFiles(fileList).catch((err) => {
        console.error(`[QA 업로드] ${source} 처리 중 예상치 못한 오류:`, err);
        alert(`엑셀 업로드 중 예상치 못한 오류가 발생했어요.\n\n${err && err.message ? err.message : err}\n\nF12 콘솔에 자세한 내용이 남았어요.`);
      });
    };

    document.getElementById("qa-upload-pick-btn").onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
      const files = e.target.files;
      e.target.value = "";
      runUpload(files, "파일 선택");
    };

    ["dragenter", "dragover"].forEach((evt) => {
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add("qa-upload-dropzone-active");
      });
    });
    ["dragleave", "dragend"].forEach((evt) => {
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove("qa-upload-dropzone-active");
      });
    });
    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove("qa-upload-dropzone-active");
      runUpload(e.dataTransfer && e.dataTransfer.files, "드래그앤드롭");
    });
    // 모달 밖(브라우저 창 전체)에 실수로 파일을 떨어뜨려서 브라우저가 그 파일을
    // 통째로 열어버리는 사고 방지.
    ["dragover", "drop"].forEach((evt) => {
      overlay.addEventListener(evt, (e) => { if (e.target === overlay) e.preventDefault(); });
    });
  }

  function closeQADetailModal() {
    const existing = document.getElementById("qa-detail-overlay");
    if (existing) existing.remove();
    document.removeEventListener("keydown", qaDetailEscHandler, true);
  }
  function qaDetailEscHandler(e) { if (e.key === "Escape") closeQADetailModal(); }

  function openQADetailModal(agentId) {
    closeQADetailModal();
    qaPurgeExpiredDetails();
    const agent = agentsData.find((a) => a.id === agentId);
    if (!agent) return;
    const { year, monthIndex } = qaUi;
    const detail = getQADetail(agentId, year, monthIndex);

    const metaText = detail && detail.purged
      ? `원본 엑셀은 업로드 후 ${QA_DETAIL_EXPIRY_MONTHS}개월이 지나 자동 삭제됐어요 · 차수 ${detail.rounds.length}개`
      : detail
        ? `${esc(detail.fileName || "")} 업로드됨 · 차수 ${detail.rounds.length}개 (원문은 업로드 후 ${QA_DETAIL_EXPIRY_MONTHS}개월 뒤 자동 삭제돼요)`
        : "";

    const trendHtml = qaTrendSvgHtml(agentId, year, monthIndex);

    const bodyHtml = (detail && detail.resignedNote)
      ? `<div class="qa-detail-empty">퇴사 인원이에요.<br>점수만 반영되고, 차수별 감점/코멘트 원문은 가져오지 않아요.</div>`
      : (!detail || !detail.rounds || !detail.rounds.length)
      ? `<div class="qa-detail-empty">이번 달(${esc(qaMonthLabel())})에 업로드된 QA 평가 엑셀이 없어요.<br>상단 "${esc("엑셀 업로드")}" 버튼으로 이 상담사의 평가표를 올려주세요.</div>`
      : `
        <div class="qa-detail-meta">${metaText}</div>
        <div class="qa-detail-rounds">
          ${detail.rounds.map((round, idx) => {
            // itemCount가 없는 예전 데이터(이 필드가 생기기 전에 저장된 회차)는
            // items 개수로 대신 판단한다. items도 없다면(정말 원문이 없는 경우) 0으로 취급.
            const effectiveItemCount = (round.itemCount !== undefined && round.itemCount !== null)
              ? round.itemCount
              : (round.items ? round.items.length : 0);
            const isPerfect = effectiveItemCount === 0;
            const rawGone = !isPerfect && round.items.length === 0; // 원문 만료로 사라진 경우
            let bodyBlock;
            if (isPerfect) {
              bodyBlock = `<div class="qa-round-empty">감점/코멘트 항목이 없어요 (만점 처리된 차수예요).</div>`;
            } else if (rawGone) {
              bodyBlock = `<div class="qa-round-summary-box" id="qa-round-summary-${idx}"><span class="qa-round-hint" style="color:var(--red);">원문이 ${QA_DETAIL_EXPIRY_MONTHS}개월 만료되어 삭제됐어요.</span></div>`;
            } else {
              bodyBlock = `
              <div class="qa-round-raw">
                <button type="button" class="qa-round-raw-toggle" data-qa-raw-toggle="${idx}">원문 보기</button>
                <div class="qa-round-raw-box" id="qa-round-raw-${idx}" style="display:none;"></div>
              </div>`;
            }
            return `
            <div class="qa-round-card">
              <div class="qa-round-head" data-qa-round-toggle="${idx}">
                <div class="qa-round-title"><span class="qa-round-chevron" id="qa-round-chevron-${idx}">▶</span>${qaRoundSummaryLine(round)}</div>
              </div>
              <div class="qa-round-body" id="qa-round-body-${idx}" style="display:none;">
                ${bodyBlock}
              </div>
            </div>
          `;
          }).join("")}
        </div>
      `;

    const overlay = document.createElement("div");
    overlay.id = "qa-detail-overlay";
    overlay.className = "sch-preview-overlay";
    overlay.innerHTML = `
      <div class="sch-preview-box qa-detail-box">
        <div class="sch-preview-head">
          <span>${esc(agent.name)} · ${esc(qaMonthLabel())} QA 상세</span>
          <div class="qa-detail-head-actions">
            ${detail ? `<button type="button" class="ghost-btn qa-detail-delete-btn" id="qa-detail-delete-btn">${ICON_TRASH} 엑셀 삭제</button>` : ""}
            <button type="button" class="sch-preview-close" id="qa-detail-close-x" aria-label="닫기">✕</button>
          </div>
        </div>
        <div class="sch-preview-body qa-detail-body">
          ${trendHtml}
          ${bodyHtml}
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeQADetailModal(); };
    document.getElementById("qa-detail-close-x").onclick = () => closeQADetailModal();
    const deleteBtn = document.getElementById("qa-detail-delete-btn");
    if (deleteBtn) {
      deleteBtn.onclick = () => {
        if (!confirm(`${agent.name}님의 ${qaMonthLabel()} QA 엑셀 데이터를 삭제할까요?\n원문과 정리된 내용이 모두 함께 삭제되며, 되돌릴 수 없어요.`)) return;
        deleteQADetail(agentId, year, monthIndex);
        flashQAStatus("삭제됐어요.");
        openQADetailModal(agentId); // 모달을 "업로드된 엑셀 없음" 상태로 다시 그림
      };
    }

    // "원문 보기" 토글: 개별 버튼이 아니라 오버레이 전체에 위임해서 클릭을 잡는다.
    // 기본은 접힌 상태(style="display:none")이고, 누를 때마다 펼치고/접는다.
    overlay.addEventListener("click", (e) => {
      const toggleBtn = e.target.closest && e.target.closest("[data-qa-raw-toggle]");
      if (!toggleBtn) return;
      e.stopPropagation();
      const idx = Number(toggleBtn.getAttribute("data-qa-raw-toggle"));
      const round = detail.rounds[idx];
      const rawBox = document.getElementById(`qa-round-raw-${idx}`);
      if (!round || !rawBox) return;
      const opening = rawBox.style.display === "none";
      if (opening && !rawBox.dataset.filled) {
        rawBox.innerHTML = qaFormatSummaryHtml(qaOrganizeItemsText(round.items));
        rawBox.dataset.filled = "1";
      }
      rawBox.style.display = opening ? "" : "none";
      toggleBtn.textContent = opening ? "원문 접기" : "원문 보기";
    });

    // 회차 카드 헤드를 누르면 펼치기/접기 (버튼 클릭은 위에서 stopPropagation으로 분리됨)
    overlay.querySelectorAll("[data-qa-round-toggle]").forEach((head) => {
      head.onclick = () => {
        const idx = head.getAttribute("data-qa-round-toggle");
        const body = document.getElementById(`qa-round-body-${idx}`);
        const chevron = document.getElementById(`qa-round-chevron-${idx}`);
        if (!body) return;
        const opening = body.style.display === "none";
        body.style.display = opening ? "" : "none";
        if (chevron) chevron.textContent = opening ? "▼" : "▶";
      };
    });

    setTimeout(() => document.addEventListener("keydown", qaDetailEscHandler, true), 0);
  }

  function qaScoreCellHtml(agent, year, monthIndex) {
    const val = getQAScore(agent.id, year, monthIndex);
    const locked = qaIsMonthLocked(year, monthIndex);
    return `<td><input type="number" class="qa-score-input" min="0" max="100" step="0.1" inputmode="decimal"
      data-qa-agent="${agent.id}" value="${val === null ? "" : val.toFixed(1)}" placeholder="-" title="점수"${locked ? " disabled" : ""}></td>`;
  }

  function qaDiffHtml(agent, year, monthIndex) {
    const cur = qaOverallScore(agent.id, year, monthIndex);
    if (cur === null) return `<span class="qa-diff flat">-</span>`;
    const prev = qaPrevMonth(year, monthIndex);
    const prevScore = qaOverallScore(agent.id, prev.year, prev.monthIndex);
    if (prevScore === null) return `<span class="qa-diff flat">신규</span>`;
    const diff = cur - prevScore;
    if (Math.abs(diff) < 0.05) return `<span class="qa-diff flat">±0.0</span>`;
    const cls = diff > 0 ? "up" : "down";
    const sign = diff > 0 ? "▲" : "▼";
    return `<span class="qa-diff ${cls}">${sign} ${Math.abs(diff).toFixed(1)}</span>`;
  }

  // ----- 상담사 상세 카드용 "최근 QA 점수" 미리보기 -----
  // 이번 달 포함 최근 3개월 점수를 관리자→월별 스케줄 이동 없이 바로 보여준다.
  // QA 관리 대상이 아닌 관리자 계정은 표시하지 않는다.
  function renderAgentQAPreview(agent) {
    if (agent.isAdmin) return "";
    const months = [];
    for (let i = 0; i < 3; i++) {
      let m = today.getMonth() - i;
      let y = today.getFullYear();
      while (m < 0) { m += 12; y -= 1; }
      months.push({ year: y, monthIndex: m });
    }
    const cellsHtml = months.map(({ year, monthIndex }, idx) => {
      const val = getQAScore(agent.id, year, monthIndex);
      const label = idx === 0 ? "이번 달" : `${monthIndex + 1}월`;
      return `
        <div class="agent-qa-cell">
          <div class="agent-qa-cell-label">${esc(label)}</div>
          <div class="agent-qa-cell-value${val === null ? " empty" : ""}">${val === null ? "데이터 없음" : val.toFixed(1)}</div>
          <div class="agent-qa-cell-diff">${qaDiffHtml(agent, year, monthIndex)}</div>
        </div>
      `;
    }).join("");
    return `
      <div class="agent-interview-section agent-qa-preview">
        <div class="agent-interview-header">
          <div class="agent-interview-title">${ICON_QA} 최근 QA 점수</div>
          <button class="ghost-btn" data-action="agent-goto-qa" data-id="${agent.id}">${ICON_CHEVRON_RIGHT} 품질 관리로 이동</button>
        </div>
        <div class="agent-qa-preview-grid">${cellsHtml}</div>
      </div>
    `;
  }

  function qaStatDiff(cur, prev) {
    if (cur === null || prev === null || prev === undefined) return null;
    const diff = cur - prev;
    if (Math.abs(diff) < 0.05) return { cls: "flat", sign: "±", abs: 0 };
    return { cls: diff > 0 ? "up" : "down", sign: diff > 0 ? "▲" : "▼", abs: Math.abs(diff) };
  }

  function qaStatItemHtml(label, value, prevValue, accent) {
    const isEmpty = value === null;
    const d = qaStatDiff(value, prevValue);
    const diffHtml = d ? ` <span class="qa-stat-diff ${d.cls}">${d.sign} ${d.abs.toFixed(1)}</span>` : "";
    return `<div class="qa-stat-item${accent ? " accent" : ""}">
      <div class="qa-stat-num${isEmpty ? " empty" : ""}">${isEmpty ? "데이터 없음" : value.toFixed(1)}</div>
      <div class="qa-stat-label">${esc(label)}${diffHtml}</div>
    </div>`;
  }

  // 이미지 저장 시 유형별로 인원을 걸러낼 때 쓴다. (월별 스케줄과 동일한 구분 기준)
