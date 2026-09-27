  // 05g-qa-capture-menu.js — 포커스 이동, 미리보기, 캡처 메뉴
  // (05-qa.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  function qaFocusScoreInput(agentId) {
    const el = document.querySelector(`.qa-score-input[data-qa-agent="${CSS.escape(agentId)}"]`);
    if (!el || el.disabled) return;
    el.focus();
    el.select();
  }

  // ----- 품질 관리 표를 이미지로 저장: 전체/주간/야간/유선/채팅 -----
  const QA_CAPTURE_MODES = [
    { key: "ALL", label: "전체 저장" },
    { key: "DAY", label: "주간 저장" },
    { key: "NIGHT", label: "야간 저장" },
    { key: "VOICE", label: "유선 저장" },
    { key: "CHAT", label: "채팅 저장" },
  ];

  function closeQAPreview() {
    const existing = document.getElementById("qa-preview-overlay");
    if (existing) existing.remove();
    document.removeEventListener("keydown", qaPreviewEscHandler, true);
  }
  function qaPreviewEscHandler(e) {
    if (e.key === "Escape") closeQAPreview();
  }
  function openQAPreview(dataUrl, filename, modeName) {
    closeQAPreview();
    const overlay = document.createElement("div");
    overlay.id = "qa-preview-overlay";
    overlay.className = "sch-preview-overlay";
    overlay.innerHTML = `
      <div class="sch-preview-box">
        <div class="sch-preview-head">
          <span>${modeName ? `${esc(modeName)} 이미지 미리보기` : "이미지 미리보기"}</span>
          <button type="button" class="sch-preview-close" id="qa-preview-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="sch-preview-body">
          <img src="${dataUrl}" alt="품질 관리 캡처 미리보기">
        </div>
        <div class="sch-preview-actions">
          <button type="button" class="ghost-btn" id="qa-preview-cancel">닫기</button>
          <button type="button" class="primary-btn" id="qa-preview-download">${ICON_DOWNLOAD} 이미지 다운로드</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeQAPreview(); };
    document.getElementById("qa-preview-close-x").onclick = () => closeQAPreview();
    document.getElementById("qa-preview-cancel").onclick = () => closeQAPreview();
    document.getElementById("qa-preview-download").onclick = () => {
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
      closeQAPreview();
      flashQAStatus("이미지 저장됨");
    };
    setTimeout(() => document.addEventListener("keydown", qaPreviewEscHandler, true), 0);
  }

  function closeQAMenu() {
    const existing = document.getElementById("qa-menu");
    if (existing) existing.remove();
    document.removeEventListener("mousedown", qaMenuOutsideHandler, true);
  }
  function qaMenuOutsideHandler(e) {
    const menu = document.getElementById("qa-menu");
    if (menu && !menu.contains(e.target)) closeQAMenu();
  }
  function openQACaptureMenu(anchorEl) {
    closeQAMenu();
    const rect = anchorEl.getBoundingClientRect();
    const menu = document.createElement("div");
    menu.id = "qa-menu";
    menu.className = "sch-menu";
    menu.innerHTML = QA_CAPTURE_MODES.map((o) =>
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
        closeQAMenu();
        captureQAPage(mode);
      };
    });
    setTimeout(() => document.addEventListener("mousedown", qaMenuOutsideHandler, true), 0);
  }

  // 품질 관리 표를 통째로 PNG 이미지로 캡처해서 다운로드한다. (월별 스케줄 캡처와 동일한 방식)
  function captureQAPage(mode) {
    const captureMode = mode || "ALL";
    const modeMeta = QA_CAPTURE_MODES.find((m) => m.key === captureMode) || QA_CAPTURE_MODES[0];
    const modeName = modeMeta.label.replace(/ 저장$/, "");
    const btn = document.getElementById("qa-capture-btn");
    if (typeof html2canvas === "undefined") {
      flashQAStatus("캡처 기능을 불러오지 못했어요 (인터넷 연결 확인)");
      return;
    }
    if (btn) { btn.disabled = true; btn.textContent = "이미지 생성 중..."; }

    const cs = getComputedStyle(document.documentElement);
    const themeColor = (name) => cs.getPropertyValue(name).trim();
    const cBg = themeColor("--bg");
    const cText = themeColor("--text");
    const cTextDim = themeColor("--text-dim");
    const cHairline = themeColor("--hairline");

    const { year, monthIndex } = qaUi;
    const agentsList = qaFilterAgentsByMode(qaWorkingAgents(), captureMode);
    const lockedTag = qaIsMonthLocked(year, monthIndex) ? " · 확정됨" : "";
    const titleSuffix = captureMode === "ALL" ? "" : ` · ${modeName}`;

    // "전체 저장"일 때만 상단 평균 통계도 표 위에 같이 캡처되게 한다.
    // 화면과 완전히 같은 마크업(qaStatItemHtml)을 그대로 재사용해서 스타일이 어긋나지 않게 한다.
    const stats = qaComputeStats(agentsList, year, monthIndex);
    const capturePrevYm = qaPrevMonth(year, monthIndex);
    const prevStats = qaComputeStats(agentsList, capturePrevYm.year, capturePrevYm.monthIndex);
    const statsHtml = captureMode === "ALL" ? `
      <div class="qa-stat-grid" style="margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid ${cHairline};">
        ${qaStatItemHtml("전체 평균", stats.total, prevStats.total, true)}
        ${qaStatItemHtml("유선 점수 평균", stats.voice, prevStats.voice)}
        ${qaStatItemHtml("채팅 점수 평균", stats.chat, prevStats.chat)}
        ${qaStatItemHtml("주간 점수 평균", stats.day, prevStats.day)}
        ${qaStatItemHtml("야간 점수 평균", stats.night, prevStats.night)}
        ${qaStatItemHtml("주간 채팅 평균", stats.dayChat, prevStats.dayChat)}
        ${qaStatItemHtml("주간 유선 평균", stats.dayVoice, prevStats.dayVoice)}
        ${qaStatItemHtml("야간 채팅 평균", stats.nightChat, prevStats.nightChat)}
        ${qaStatItemHtml("야간 유선 평균", stats.nightVoice, prevStats.nightVoice)}
      </div>
    ` : "";

    const wrapper = document.createElement("div");
    wrapper.className = "sch-capture-flatten";
    wrapper.style.position = "fixed";
    wrapper.style.left = "-99999px";
    wrapper.style.top = "0";
    wrapper.style.background = cBg;
    wrapper.style.padding = "28px";
    wrapper.style.fontFamily = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Apple SD Gothic Neo", "Helvetica Neue", Arial, sans-serif';
    wrapper.style.color = cText;
    wrapper.style.width = "fit-content";
    wrapper.style.maxWidth = "none";
    wrapper.style.overflow = "visible";
    wrapper.innerHTML = `
      <div style="font-size:22px;margin-bottom:4px;color:${cText};">품질 관리${titleSuffix}</div>
      <div style="font-size:15px;color:${cTextDim};margin-bottom:16px;">${esc(qaMonthLabel())}${lockedTag} · 캡처일 ${esc(todayISO())}</div>
      ${statsHtml}
      ${buildQATableHtml(agentsList, year, monthIndex, true)}
    `;
    document.body.appendChild(wrapper);

    function cleanup(label) {
      if (wrapper.parentNode) document.body.removeChild(wrapper);
      if (btn) { btn.disabled = false; btn.innerHTML = ICON_CAMERA + " 이미지로 저장 ▾"; }
      if (label) flashQAStatus(label);
    }

    requestAnimationFrame(() => {
      // 표는 CSS(display:table + margin:auto)만으로 이미 표 크기에 맞춰 가운데 정렬된다.
      // 통계 줄은 fit-content 래퍼 안에서는 justify-content:space-between이 퍼질 공간이
      // 없으므로, 표의 실제 렌더링 너비에 맞춰 폭을 직접 지정해서 표와 나란히 맞춘다.
      const statGridEl = wrapper.querySelector(".qa-stat-grid");
      const tableWrapEl = wrapper.querySelector(".qa-table-wrap");
      if (statGridEl && tableWrapEl) {
        statGridEl.style.width = tableWrapEl.getBoundingClientRect().width + "px";
      }

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
        const filename = `품질관리${fileSuffix}_${year}-${pad2(monthIndex + 1)}.png`;
        const dataUrl = canvas.toDataURL("image/png");
        cleanup("");
        openQAPreview(dataUrl, filename, captureMode === "ALL" ? null : modeName);
      }).catch((err) => {
        console.error(err);
        cleanup("캡처 실패");
      });
    });
  }

  /* ===================== 면담일지 모듈 ===================== */
  const INTERVIEWS_KEY = acctKey("personal-interviews:data");
  const INTERVIEW_TYPES = ["정기", "비정기", "경고", "퇴사"];


