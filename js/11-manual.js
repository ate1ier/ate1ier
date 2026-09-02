  function closeManualModal() {
    const existing = document.getElementById("manual-modal-overlay");
    if (existing) existing.remove();
    if (manualKeyHandler) { document.removeEventListener("keydown", manualKeyHandler); manualKeyHandler = null; }
  }

  function openManualModal() {
    closeManualModal();
    manualUi.index = 0;
    manualUi.dir = "next";

    const overlay = document.createElement("div");
    overlay.id = "manual-modal-overlay";
    overlay.className = "manual-modal-overlay";
    overlay.innerHTML = `
      <div class="manual-modal-box" role="dialog" aria-modal="true" aria-label="사용설명서">
        <div class="manual-modal-head">
          <span>${ICON_BOOK} 사용설명서</span>
          <button type="button" class="manual-modal-close" id="manual-modal-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="manual-modal-body" id="manual-modal-body"></div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeManualModal(); };
    document.getElementById("manual-modal-close-x").onclick = () => closeManualModal();

    const root = document.getElementById("manual-modal-body");
    renderManualSlides(root);
  }

  // 사용설명서 각 슬라이드에 곁들일 "간단한 캡처" — 실제 화면을 그대로 찍는 대신,
  // 해당 페이지의 생김새를 알아볼 수 있을 정도로 단순화한 목업 그림을 그려준다.
  function manualPageShot(key) {
    const w = 440, h = 150;
    const frame = `<rect width="${w}" height="${h}" rx="16" fill="var(--elevated)"/>`;
    let inner = "";
    if (key === "home") {
      const cards = [[16, 16, false], [224, 16, true], [16, 80, false], [224, 80, false]];
      inner = cards.map(([x, y, dot]) => `
        <rect x="${x}" y="${y}" width="200" height="54" rx="10" fill="var(--panel)" stroke="var(--hairline)"/>
        <rect x="${x + 12}" y="${y + 14}" width="70" height="7" rx="3.5" fill="var(--text-faint)"/>
        ${dot ? `<circle cx="${x + 16}" cy="${y + 34}" r="4" fill="var(--accent)"/>` : ""}
        <rect x="${x + (dot ? 28 : 12)}" y="${y + 30}" width="${dot ? 134 : 150}" height="7" rx="3.5" fill="var(--text-dim)"/>
      `).join("");
    } else if (key === "calendar") {
      const cols = 7, rows = 4, cw = (w - 32) / cols, ch = (h - 32) / rows, ox = 16, oy = 16;
      let cells = "";
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = ox + c * cw, y = oy + r * ch;
          const hi = (r === 1 && c === 3) || (r === 2 && c === 5);
          cells += `<rect x="${x + 2}" y="${y + 2}" width="${cw - 4}" height="${ch - 4}" rx="6" fill="${hi ? "var(--accent-dim)" : "var(--panel)"}" stroke="var(--hairline)"/>`;
          if (hi) cells += `<circle cx="${x + cw / 2}" cy="${y + ch - 9}" r="3" fill="var(--accent)"/>`;
        }
      }
      inner = cells;
    } else if (key === "notes") {
      inner = [16, 58, 100].map((y, idx) => `
        <rect x="16" y="${y}" width="408" height="32" rx="9" fill="var(--panel)" stroke="var(--hairline)"/>
        ${idx === 0 ? `<circle cx="404" cy="${y + 16}" r="5" fill="var(--orange)"/>` : ""}
        <rect x="28" y="${y + 11}" width="${idx === 0 ? 120 : 90}" height="8" rx="4" fill="var(--text)"/>
        <rect x="${idx === 0 ? 156 : 126}" y="${y + 12}" width="190" height="7" rx="3.5" fill="var(--text-faint)"/>
      `).join("");
    } else if (key === "agents") {
      inner = [16, 58, 100].map((y) => `
        <rect x="16" y="${y}" width="408" height="32" rx="9" fill="var(--panel)" stroke="var(--hairline)"/>
        <circle cx="35" cy="${y + 16}" r="11" fill="var(--accent-dim)"/>
        <rect x="54" y="${y + 9}" width="92" height="7" rx="3.5" fill="var(--text)"/>
        <rect x="54" y="${y + 20}" width="60" height="6" rx="3" fill="var(--text-faint)"/>
        <rect x="360" y="${y + 10}" width="36" height="12" rx="6" fill="var(--green-dim)"/>
      `).join("");
    } else if (key === "qa") {
      const cols = 5, colW = (w - 32) / cols;
      let header = "";
      for (let c = 0; c < cols; c++) header += `<rect x="${16 + c * colW}" y="16" width="${colW - 4}" height="20" rx="6" fill="var(--elevated)" stroke="var(--hairline)"/>`;
      let rows = "";
      for (let r = 0; r < 3; r++) {
        const y = 44 + r * 28;
        for (let c = 0; c < cols; c++) {
          rows += `<rect x="${16 + c * colW}" y="${y}" width="${colW - 4}" height="20" rx="6" fill="var(--panel)" stroke="var(--hairline)"/>`;
        }
        rows += `<rect x="${16 + 3 * colW + 6}" y="${y + 5}" width="${colW - 16}" height="10" rx="5" fill="var(--accent-dim)"/>`;
      }
      inner = header + rows;
    } else if (key === "interviews") {
      inner = [16, 62, 108].map((y, idx) => `
        <rect x="16" y="${y}" width="408" height="38" rx="10" fill="var(--panel)" stroke="var(--hairline)"/>
        <rect x="28" y="${y + 11}" width="70" height="8" rx="4" fill="var(--text)"/>
        <rect x="106" y="${y + 10}" width="42" height="16" rx="8" fill="${idx === 0 ? "var(--purple-dim)" : "var(--blue-dim)"}"/>
        <rect x="28" y="${y + 24}" width="220" height="7" rx="3.5" fill="var(--text-faint)"/>
      `).join("");
    } else if (key === "schedule") {
      const cols = 10, rows = 4, cw = (w - 90) / cols, ch = (h - 32) / rows, ox = 90, oy = 16;
      let cells = `<rect x="16" y="16" width="66" height="${h - 32}" rx="8" fill="var(--elevated)"/>`;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = ox + c * cw, y = oy + r * ch;
          const idx = r * cols + c;
          const fill = idx % 9 === 0 ? "var(--blue-dim)" : idx % 11 === 0 ? "var(--orange-dim)" : "var(--panel)";
          cells += `<rect x="${x + 2}" y="${y + 2}" width="${cw - 4}" height="${ch - 4}" rx="5" fill="${fill}" stroke="var(--hairline)"/>`;
        }
      }
      inner = cells;
    }
    return `<div class="manual-slide-shot"><svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${frame}${inner}</svg></div>`;
  }

  function renderManualSlides(root) {
    const slides = [
      {
        key: "intro",
        icon: ICON_BOOK,
        title: "사용설명서",
        subtitle: "업무 종합 관리, 이렇게 사용하세요",
        desc: "왼쪽 메뉴에는 7가지 기능이 있어요. 이 사용설명서는 PPT처럼 옆으로 넘겨보면서 기능 하나하나를 확인할 수 있게 만들었어요. 위쪽 탭을 클릭하거나, 양옆 화살표 버튼, 키보드 ← → 방향키, 화면 스와이프로도 넘길 수 있어요. 메뉴 아래쪽에는 화면 테마 변경, 되돌리기(Ctrl+Z), 데이터 백업/복원, 새로고침 버튼도 있으니 참고하세요.",
        intro: true,
        chips: [
          { icon: ICON_HOME, label: "홈" },
          { icon: ICON_CALENDAR, label: "캘린더" },
          { icon: ICON_USERS, label: "상담사 관리" },
          { icon: ICON_NOTE, label: "업무 정리" },
          { icon: ICON_CLIPBOARD, label: "면담일지" },
          { icon: ICON_QA, label: "품질 관리" },
          { icon: ICON_CHART, label: "월별 스케줄" },
        ],
      },
      {
        key: "home",
        icon: ICON_HOME,
        title: "홈",
        subtitle: "로그인 후 가장 먼저 보이는 대시보드",
        desc: "오늘 하루를 시작할 때 필요한 정보를 한 화면에 모아서 보여줘요.",
        features: [
          "로그인하면 '오늘의 브리핑' 팝업이 한 번 떠서, 오늘 근무 현황·일정·면담 필요 알림·할 일·고정 메모를 요약해서 보여줘요.",
          "오늘 근무 현황 — 월별 스케줄을 기준으로 오늘 근무 중인 인원과 지각·결근 여부를 바로 확인해요.",
          "오늘 일정 — 캘린더에 등록된 오늘 일정을 미리 보여줘요.",
          "면담 필요 알림 — 최근 21일 내 면담 기록이 없는 상담사를 놓치지 않도록 알려줘요.",
          "할 일 / 고정 메모 — 자주 확인할 항목을 홈 화면에 바로 띄워둘 수 있어요.",
          "각 섹션 오른쪽의 '바로가기' 버튼을 누르면 해당 메뉴로 곧장 이동해요.",
        ],
      },
      {
        key: "calendar",
        icon: ICON_CALENDAR,
        title: "캘린더",
        subtitle: "일정을 등록하고 한 달 흐름을 확인",
        desc: "월 단위로 일정을 관리하고, 다가오는 일정을 놓치지 않게 도와줘요.",
        features: [
          "날짜를 클릭하면 그날의 일정을 확인하고 새로 추가할 수 있어요.",
          "'메모'와 '일정' 두 유형으로 구분해서 등록하고, 시간과 우선순위(★ 중요)도 지정할 수 있어요.",
          "시작일~종료일을 지정해서 여러 날에 걸친 일정도 만들 수 있고, 상세 내용도 함께 적어둘 수 있어요.",
          "완료한 일정은 체크 표시하고, '완료 항목 숨기기'로 화면에서 가려볼 수 있어요.",
          "공휴일은 자동으로 표시돼요.",
          "다가오는 일정 목록을 한눈에 확인할 수 있어요.",
          "캘린더 화면 안에 할 일(Todo) 카드도 있어서, 마감일을 정해 할 일을 등록하고 완료 체크할 수 있어요.",
        ],
      },
      {
        key: "agents",
        icon: ICON_USERS,
        title: "상담사 관리",
        subtitle: "인원 정보를 등록하고 관리",
        desc: "여기에 등록한 인원 정보가 월별 스케줄과 면담일지에도 함께 반영돼요.",
        features: [
          "상담사 정보를 등록하고 검색·필터링할 수 있어요 (재직 상태 · 업무 구분 · 조 등). 이름은 초성만 입력해도 검색돼요.",
          "정렬 기준을 바꾸거나, '사용자 지정' 정렬에서는 직접 드래그해서 순서를 바꿀 수 있어요.",
          "상담사를 클릭하면 상세 정보, QA 점수 미리보기, 면담 이력을 함께 확인할 수 있어요.",
          "자주 확인하는 상담사는 즐겨찾기로 고정해둘 수 있어요.",
        ],
      },
      {
        key: "notes",
        icon: ICON_NOTE,
        title: "업무 정리",
        subtitle: "메모를 남기고 폴더로 정리",
        desc: "업무 중 떠오르는 내용을 바로 기록하고 체계적으로 정리할 수 있어요.",
        features: [
          "새 메모를 작성하고 폴더별로 분류해서 관리해요. 폴더는 접었다 펼 수 있어요.",
          "중요한 메모는 최대 5개까지 화면 상단에 고정할 수 있어요.",
          "제목 수정, 삭제가 자유롭고, 드래그로 순서를 바꾸거나 다른 폴더로 옮길 수 있어요.",
        ],
      },
      {
        key: "interviews",
        icon: ICON_CLIPBOARD,
        title: "면담일지",
        subtitle: "상담사별 면담 기록 관리",
        desc: "면담 내용과 후속조치를 기록해서 다음 면담 때 이어서 참고할 수 있어요.",
        features: [
          "상담사별 면담 기록을 추가·수정·삭제할 수 있어요. 상담사는 이름·LDAP·초성으로 검색해서 바로 선택할 수 있어요.",
          "면담 유형(정기·수시·경고)이나 검색어로 필요한 기록만 걸러볼 수 있어요.",
          "후속조치 내용을 함께 남겨서 다음 면담 때 참고할 수 있어요.",
        ],
      },
      {
        key: "qa",
        icon: ICON_QA,
        title: "품질 관리",
        subtitle: "상담사별 월간 QA 점수 관리",
        desc: "상담사 관리에서 근무중인 인원을 자동으로 불러와서, 월별로 QA 점수를 입력하고 통계를 확인할 수 있어요.",
        features: [
          "월 이동 버튼으로 원하는 달의 QA 점수를 입력·확인할 수 있어요.",
          "인원마다 유선 점수·채팅 점수를 따로 입력하면, 종합 점수와 전월 대비 점수 차이가 자동으로 계산돼요.",
          "당월 전체/유선/채팅/주간/야간/주간 채팅/주간 유선/야간 채팅/야간 유선 평균을 상단에서 한눈에 확인할 수 있어요.",
          "'상담사 관리'에서 재직 상태가 '근무중'인 인원만 자동으로 표시돼요 (관리자는 제외).",
          "표를 전체·주간·야간·유선·채팅 기준으로 나눠서 이미지로 저장할 수 있어요.",
          "지난 달은 자동으로 '확정됨' 상태로 잠겨요. '잠금 해제' 버튼으로 다시 열어 수정한 뒤 '이 달 잠그기'로 다시 잠글 수 있어요.",
        ],
      },
      {
        key: "schedule",
        icon: ICON_CHART,
        title: "월별 스케줄",
        subtitle: "상담사들의 월간 근무표",
        desc: "상담사 관리에 등록한 인원이 자동으로 반영되는 월별 근무표예요.",
        features: [
          "이름·사번·조·업무 구분 등 인원 정보는 '상담사 관리'에서 수정하면 자동으로 반영돼요.",
          "재직 중인 인원만 자동으로 표시되고, 퇴사 처리된 인원은 스케줄에서 빠져요. 관리자는 표 맨 위에 따로 표시돼요.",
          "월 이동 버튼으로 지난 달·다음 달 스케줄도 확인할 수 있어요.",
          "일괄 붙여넣기로 여러 인원의 스케줄을 한 번에 입력할 수 있어요. 근무·오프·연차·대휴·반차·공휴·공가·육휴·특휴·교육·지각·결근·퇴사 등 다양한 값을 인식해요.",
          "셀을 드래그해서 여러 칸을 한 번에 선택한 뒤, 메뉴에서 상태를 골라 한 번에 적용할 수 있어요.",
          "셀을 클릭하면 근무/오프/연차 등 다양한 상태로 바로 바꿀 수 있고, 메모도 남길 수 있어요. 지각은 출근 인원에 포함, 결근은 제외돼요.",
          "날짜·조·업무 구분별로 필요 인원(헤드카운트)을 설정하면, 실제 근무 인원과의 차이를 자동으로 계산해서 보여줘요.",
          "필요 없는 열·행은 선택 후 오른쪽 클릭으로 접어서 숨길 수 있고, 날짜 범위를 묶어 그룹으로 한 번에 접었다 펼 수도 있어요.",
          "이미지로 저장하거나 엑셀 파일로 다운로드할 수 있고, '휴일대체 확인서'도 회사 양식 그대로 자동으로 만들 수 있어요.",
          "이번 달 지각·결근 기록을 표 아래에서 바로 확인할 수 있어요.",
          "지난 달은 자동으로 '확정됨' 상태로 잠기고 그 시점 인원 구성이 고정돼요. '잠금 해제' 버튼으로 다시 열어 수정할 수 있어요.",
        ],
      },
    ];

    if (manualUi.index >= slides.length) manualUi.index = 0;

    function goTo(nextIndex) {
      const clamped = Math.max(0, Math.min(slides.length - 1, nextIndex));
      if (clamped === manualUi.index) return;
      manualUi.dir = clamped > manualUi.index ? "next" : "prev";
      manualUi.index = clamped;
      draw();
    }

    function draw() {
      const i = manualUi.index;
      const s = slides[i];
      const animClass = manualUi.dir === "prev" ? "manual-anim-prev" : "manual-anim-next";

      const tabsHtml = slides.map((sl, idx) => `
        <button class="manual-tab ${idx === i ? "active" : ""}" data-goto="${idx}">
          <span class="manual-tab-icon">${sl.icon}</span><span>${sl.title}</span>
        </button>
      `).join("");

      const dotsHtml = slides.map((sl, idx) => `
        <button class="manual-dot ${idx === i ? "active" : ""}" data-goto="${idx}" title="${esc(sl.title)}"></button>
      `).join("");

      const bodyHtml = s.intro
        ? `<div class="manual-chip-grid">${s.chips.map((c, ci) => `
            <button class="manual-chip" data-goto="${ci + 1}">
              <span class="manual-chip-icon">${c.icon}</span><span>${c.label}</span>
            </button>
          `).join("")}</div>`
        : `<ul class="manual-feature-list">${s.features.map((f) => `<li>${f}</li>`).join("")}</ul>`;

      root.innerHTML = `
        <div class="manual-shell">
          <div class="manual-tabs">${tabsHtml}</div>
          <div class="manual-viewport">
            <button class="manual-arrow" id="manual-prev" ${i === 0 ? "disabled" : ""} title="이전">‹</button>
            <div class="manual-slide ${animClass}">
              <div class="manual-slide-head">
                <div class="manual-slide-icon">${s.icon}</div>
                <div>
                  <div class="manual-slide-title">${s.title}</div>
                  <div class="manual-slide-subtitle">${s.subtitle}</div>
                </div>
              </div>
              <p class="manual-slide-desc">${s.desc}</p>
              ${s.intro ? "" : manualPageShot(s.key)}
              ${bodyHtml}
            </div>
            <button class="manual-arrow" id="manual-next" ${i === slides.length - 1 ? "disabled" : ""} title="다음">›</button>
          </div>
          <div class="manual-footer">
            <div class="manual-dots">${dotsHtml}</div>
            <div class="manual-counter">${i + 1} / ${slides.length}</div>
          </div>
        </div>
      `;

      root.querySelectorAll("[data-goto]").forEach((btn) => {
        btn.onclick = () => goTo(parseInt(btn.getAttribute("data-goto"), 10));
      });
      const prevBtn = document.getElementById("manual-prev");
      const nextBtn = document.getElementById("manual-next");
      if (prevBtn) prevBtn.onclick = () => goTo(i - 1);
      if (nextBtn) nextBtn.onclick = () => goTo(i + 1);

      // 터치 스와이프로도 슬라이드를 넘길 수 있게 지원
      const viewport = root.querySelector(".manual-viewport");
      if (viewport) {
        let touchStartX = null;
        viewport.ontouchstart = (e) => { touchStartX = e.touches[0].clientX; };
        viewport.ontouchend = (e) => {
          if (touchStartX === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX;
          if (Math.abs(dx) > 40) goTo(dx < 0 ? i + 1 : i - 1);
          touchStartX = null;
        };
      }
    }

    // 사용설명서 팝업이 열려 있을 때만 좌우 방향키(Esc 포함)로 조작할 수 있게 한다.
    if (manualKeyHandler) document.removeEventListener("keydown", manualKeyHandler);
    manualKeyHandler = (e) => {
      if (!document.getElementById("manual-modal-overlay")) return;
      const tag = (document.activeElement && document.activeElement.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") goTo(manualUi.index + 1);
      else if (e.key === "ArrowLeft") goTo(manualUi.index - 1);
      else if (e.key === "Escape") closeManualModal();
    };
    document.addEventListener("keydown", manualKeyHandler);

    draw();
  }

