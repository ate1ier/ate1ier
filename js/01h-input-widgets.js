  // ==================== 커스텀 드롭다운/날짜/시간 선택 위젯 (모든 select·date·time input 공통 적용), 앱 공용 플로팅 메뉴 ====================
  // (예전 01-common.js에서 분리됨 — 실행 순서·내용은 그대로입니다)
  /* ---- 커스텀 드롭다운/날짜선택(모든 <select>·<input type="date">에 공통 적용) ----
     기본 <select>와 <input type="date">는 목록/달력 부분이 브라우저 기본 스타일로
     떠서 앱 디자인과 어울리지 않아서, 월별 스케줄 화면의 떠있는 메뉴(.sch-menu)와
     같은 느낌으로 직접 그리는 드롭다운/달력으로 감싸준다. 원본 엘리먼트는 화면에서만
     숨기고 DOM에 그대로 둬서, 각 화면에서 쓰던 select.value / input.value /
     .onchange / addEventListener("change", ...) 같은 기존 코드는 손댈 필요가 없다.
     렌더링마다 매번 새로 그려지는 이 앱 구조상 각 화면은 자기 select/date input을
     그린 뒤 enhanceSelect(...) / enhanceDateInput(...)만 호출해주면 된다. */
  function closeAllAppFloatingMenus() {
    document.querySelectorAll(".app-select-menu").forEach((m) => m.remove());
    document.querySelectorAll(".app-select-trigger.open").forEach((t) => t.classList.remove("open"));
    document.querySelectorAll(".app-date-menu").forEach((m) => m.remove());
    document.querySelectorAll(".app-date-trigger.open").forEach((t) => t.classList.remove("open"));
    document.querySelectorAll(".app-time-menu").forEach((m) => m.remove());
    document.querySelectorAll(".app-time-trigger.open").forEach((t) => t.classList.remove("open"));
    document.removeEventListener("mousedown", appFloatingOutsideHandler, true);
  }
  // 이전 이름으로 부르는 코드가 있어도 그대로 동작하도록 별칭을 남겨둔다.
  const closeAllAppSelectMenus = closeAllAppFloatingMenus;
  function appFloatingOutsideHandler(e) {
    // 드롭다운/날짜/시간 팝업(.app-select-menu, .app-date-menu, .app-time-menu)은 위치 계산 때문에
    // document.body에 바로 붙기 때문에 .app-select / .app-date / .app-time의 자손이 아니다.
    // 이 셋도 함께 확인하지 않으면, 팝업 안의 항목을 누르는 순간(mousedown)
    // "바깥을 눌렀다"고 오판해서 클릭이 완료되기 전에 팝업을 지워버려
    // 선택이 반영되지 않는 문제가 생긴다.
    if (
      !e.target.closest(".app-select") && !e.target.closest(".app-date") && !e.target.closest(".app-time") &&
      !e.target.closest(".app-select-menu") && !e.target.closest(".app-date-menu") && !e.target.closest(".app-time-menu")
    ) {
      closeAllAppFloatingMenus();
    }
  }
  function enhanceSelect(selectEl) {
    if (!selectEl || selectEl.tagName !== "SELECT") return;
    if (selectEl.classList.contains("app-select-native")) return; // 이미 적용됨 (중복 방지)
    const wrap = document.createElement("div");
    wrap.className = "app-select";
    selectEl.parentNode.insertBefore(wrap, selectEl);
    wrap.appendChild(selectEl);
    selectEl.classList.add("app-select-native");

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = `${selectEl.getAttribute("data-trigger-class") || "add-input"} app-select-trigger`;
    if (selectEl.id) trigger.id = `${selectEl.id}-trigger`;
    trigger.disabled = selectEl.disabled;
    const textSpan = document.createElement("span");
    textSpan.className = "app-select-trigger-text";
    const caretSpan = document.createElement("span");
    caretSpan.className = "app-select-caret";
    caretSpan.innerHTML = `<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.6 6 8 10.4 12.4 6"/></svg>`;
    trigger.appendChild(textSpan);
    trigger.appendChild(caretSpan);
    wrap.appendChild(trigger);

    const syncLabel = () => {
      const opt = selectEl.options[selectEl.selectedIndex];
      textSpan.textContent = opt ? opt.textContent : "";
    };
    syncLabel();

    trigger.onclick = () => {
      if (trigger.disabled) return;
      const wasOpen = trigger.classList.contains("open");
      closeAllAppFloatingMenus();
      if (wasOpen) return; // 토글: 열려 있었으면 닫기만 하고 끝
      trigger.classList.add("open");
      const menu = document.createElement("div");
      menu.className = "app-select-menu";
      Array.from(selectEl.options).forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = opt.textContent;
        if (opt.disabled) btn.disabled = true;
        if (opt.value === selectEl.value) btn.classList.add("selected");
        btn.onclick = () => {
          selectEl.value = opt.value;
          syncLabel();
          closeAllAppFloatingMenus();
          selectEl.dispatchEvent(new Event("change", { bubbles: true }));
        };
        menu.appendChild(btn);
      });
      document.body.appendChild(menu);
      const rect = trigger.getBoundingClientRect();
      menu.style.minWidth = `${rect.width}px`;
      const top = Math.min(rect.bottom + 4, window.innerHeight - menu.offsetHeight - 8);
      const left = Math.min(rect.left, window.innerWidth - menu.offsetWidth - 8);
      menu.style.top = `${Math.max(8, top)}px`;
      menu.style.left = `${Math.max(8, left)}px`;
      setTimeout(() => document.addEventListener("mousedown", appFloatingOutsideHandler, true), 0);
    };
  }

  /* ---- 커스텀 날짜선택(모든 <input type="date">에 공통 적용) ----
     드롭다운과 같은 방식: 실제 <input type="date">는 화면에서만 숨기고
     DOM/값은 그대로 유지한 채, 버튼(트리거) + 미니 달력 팝업으로 대신 그려준다.
     기존 코드의 input.value 읽기, .min 속성, onchange 핸들러는 그대로 동작한다. */
  function enhanceDateInput(inputEl) {
    if (!inputEl || inputEl.tagName !== "INPUT" || inputEl.type !== "date") return;
    if (inputEl.classList.contains("app-date-native")) return; // 이미 적용됨 (중복 방지)
    const wrap = document.createElement("div");
    wrap.className = "app-date";
    inputEl.parentNode.insertBefore(wrap, inputEl);
    wrap.appendChild(inputEl);
    const triggerClass = inputEl.className;
    inputEl.classList.add("app-date-native");
    // 값을 지울 수 있는 선택 항목인지(할 일 마감일/입사일/면접일처럼 비워둘 수 있는 칸인지)는
    // "date-input" 클래스(캘린더 일정의 기간·반복 종료일처럼 반드시 값이 있어야 하는 칸)
    // 유무로 구분한다.
    const clearable = !inputEl.classList.contains("date-input");

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = `${triggerClass} app-date-trigger`;
    if (inputEl.id) trigger.id = `${inputEl.id}-trigger`;
    trigger.disabled = inputEl.disabled;
    const textSpan = document.createElement("span");
    textSpan.className = "app-date-trigger-text";
    const iconSpan = document.createElement("span");
    iconSpan.className = "app-date-icon";
    iconSpan.innerHTML = `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3.2" width="12" height="10.8" rx="2"/><path d="M2 6.4h12M5.2 1.6v2.4M10.8 1.6v2.4"/></svg>`;
    trigger.appendChild(textSpan);
    trigger.appendChild(iconSpan);
    wrap.appendChild(trigger);

    const fmt = (iso) => {
      const [y, m, d] = iso.split("-").map(Number);
      return `${y}. ${m}. ${d}.`;
    };
    const syncLabel = () => {
      const hasVal = !!inputEl.value;
      textSpan.textContent = hasVal ? fmt(inputEl.value) : (inputEl.placeholder || "날짜 선택");
      textSpan.classList.toggle("app-date-placeholder", !hasVal);
    };
    syncLabel();

    trigger.onclick = () => {
      if (trigger.disabled) return;
      const wasOpen = trigger.classList.contains("open");
      closeAllAppFloatingMenus();
      if (wasOpen) return; // 토글: 열려 있었으면 닫기만 하고 끝
      trigger.classList.add("open");

      const parseLocalISO = (iso) => {
        const [y, m, d] = iso.split("-").map(Number);
        return new Date(y, m - 1, d);
      };
      const base = inputEl.value ? parseLocalISO(inputEl.value) : new Date();
      let viewY = base.getFullYear();
      let viewM = base.getMonth();

      const menu = document.createElement("div");
      menu.className = "app-date-menu";

      const renderPanel = () => {
        const minISO = inputEl.min || "";
        const maxISO = inputEl.max || "";
        const firstOfMonth = new Date(viewY, viewM, 1);
        const startOffset = firstOfMonth.getDay(); // 0=일요일
        const daysInMonth = new Date(viewY, viewM + 1, 0).getDate();
        const daysInPrevMonth = new Date(viewY, viewM, 0).getDate();
        const now = new Date();
        const todayISOStr = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;

        let cellsHtml = "";
        for (let i = 0; i < startOffset; i++) {
          const d = daysInPrevMonth - startOffset + 1 + i;
          cellsHtml += `<span class="app-date-day other-month">${d}</span>`;
        }
        for (let d = 1; d <= daysInMonth; d++) {
          const iso = `${viewY}-${pad2(viewM + 1)}-${pad2(d)}`;
          const disabled = (minISO && iso < minISO) || (maxISO && iso > maxISO);
          const isSelected = inputEl.value === iso;
          const isToday = iso === todayISOStr;
          const cls = ["app-date-day"];
          if (isSelected) cls.push("selected");
          else if (isToday) cls.push("today");
          if (disabled) cls.push("disabled");
          cellsHtml += `<button type="button" class="${cls.join(" ")}" ${disabled ? "disabled" : ""} data-iso="${iso}">${d}</button>`;
        }
        const totalCells = startOffset + daysInMonth;
        const trailing = (7 - (totalCells % 7)) % 7;
        for (let d = 1; d <= trailing; d++) {
          cellsHtml += `<span class="app-date-day other-month">${d}</span>`;
        }

        menu.innerHTML = `
          <div class="app-date-panel-header">
            <button type="button" class="app-date-nav-btn" data-nav="-1" aria-label="이전 달">‹</button>
            <span class="app-date-panel-month">${viewY}년 ${MONTH_NAMES[viewM]}</span>
            <button type="button" class="app-date-nav-btn" data-nav="1" aria-label="다음 달">›</button>
          </div>
          <div class="app-date-weekdays">${WEEKDAYS.map((w) => `<span>${w}</span>`).join("")}</div>
          <div class="app-date-days">${cellsHtml}</div>
          <div class="app-date-panel-footer">
            <button type="button" class="app-date-footer-btn" data-action="today">오늘</button>
            ${clearable ? `<button type="button" class="app-date-footer-btn" data-action="clear">지우기</button>` : ""}
          </div>
        `;

        menu.querySelector('[data-nav="-1"]').onclick = () => { viewM -= 1; if (viewM < 0) { viewM = 11; viewY -= 1; } renderPanel(); };
        menu.querySelector('[data-nav="1"]').onclick = () => { viewM += 1; if (viewM > 11) { viewM = 0; viewY += 1; } renderPanel(); };
        menu.querySelectorAll(".app-date-day[data-iso]").forEach((btn) => {
          btn.onclick = () => {
            inputEl.value = btn.getAttribute("data-iso");
            syncLabel();
            closeAllAppFloatingMenus();
            inputEl.dispatchEvent(new Event("change", { bubbles: true }));
          };
        });
        const todayBtn = menu.querySelector('[data-action="today"]');
        if (todayBtn) todayBtn.onclick = () => {
          inputEl.value = todayISOStr;
          syncLabel();
          closeAllAppFloatingMenus();
          inputEl.dispatchEvent(new Event("change", { bubbles: true }));
        };
        const clearBtn = menu.querySelector('[data-action="clear"]');
        if (clearBtn) clearBtn.onclick = () => {
          inputEl.value = "";
          syncLabel();
          closeAllAppFloatingMenus();
          inputEl.dispatchEvent(new Event("change", { bubbles: true }));
        };
      };
      renderPanel();

      document.body.appendChild(menu);
      const rect = trigger.getBoundingClientRect();
      const top = Math.min(rect.bottom + 4, window.innerHeight - menu.offsetHeight - 8);
      const left = Math.min(rect.left, window.innerWidth - menu.offsetWidth - 8);
      menu.style.top = `${Math.max(8, top)}px`;
      menu.style.left = `${Math.max(8, left)}px`;
      setTimeout(() => document.addEventListener("mousedown", appFloatingOutsideHandler, true), 0);
    };
  }

  /* ---- 커스텀 시간선택(모든 <input type="time">에 공통 적용) ----
     날짜선택과 같은 방식: 실제 <input type="time">는 화면에서만 숨기고
     DOM/값은 그대로 유지한 채, 버튼(트리거) + 시/분 목록 팝업으로 대신 그려준다. */
  function enhanceTimeInput(inputEl) {
    if (!inputEl || inputEl.tagName !== "INPUT" || inputEl.type !== "time") return;
    if (inputEl.classList.contains("app-time-native")) return; // 이미 적용됨 (중복 방지)
    const wrap = document.createElement("div");
    wrap.className = "app-time";
    inputEl.parentNode.insertBefore(wrap, inputEl);
    wrap.appendChild(inputEl);
    const triggerClass = inputEl.className;
    inputEl.classList.add("app-time-native");

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = `${triggerClass} app-time-trigger`;
    if (inputEl.id) trigger.id = `${inputEl.id}-trigger`;
    trigger.disabled = inputEl.disabled;
    const textSpan = document.createElement("span");
    textSpan.className = "app-time-trigger-text";
    const iconSpan = document.createElement("span");
    iconSpan.className = "app-time-icon";
    iconSpan.innerHTML = `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.4"/><path d="M8 4.8V8l2.4 1.4"/></svg>`;
    trigger.appendChild(textSpan);
    trigger.appendChild(iconSpan);
    wrap.appendChild(trigger);

    const syncLabel = () => {
      const hasVal = !!inputEl.value;
      textSpan.textContent = hasVal ? inputEl.value : (inputEl.placeholder || "시간 선택");
      textSpan.classList.toggle("app-time-placeholder", !hasVal);
    };
    syncLabel();

    trigger.onclick = () => {
      if (trigger.disabled) return;
      const wasOpen = trigger.classList.contains("open");
      closeAllAppFloatingMenus();
      if (wasOpen) return; // 토글: 열려 있었으면 닫기만 하고 끝
      trigger.classList.add("open");

      const parts = (inputEl.value || "").split(":");
      let curHour = parts[0] !== undefined && parts[0] !== "" ? parseInt(parts[0], 10) : null;
      let curMinute = parts[1] !== undefined && parts[1] !== "" ? parseInt(parts[1], 10) : null;

      const menu = document.createElement("div");
      menu.className = "app-time-menu";

      const commit = () => {
        const h = curHour === null ? 0 : curHour;
        const m = curMinute === null ? 0 : curMinute;
        inputEl.value = `${pad2(h)}:${pad2(m)}`;
        syncLabel();
        inputEl.dispatchEvent(new Event("change", { bubbles: true }));
      };

      const renderPanel = () => {
        const hourItems = Array.from({ length: 24 }, (_, h) => h)
          .map((h) => `<button type="button" class="app-time-item ${h === curHour ? "selected" : ""}" data-hour="${h}">${pad2(h)}</button>`)
          .join("");
        const minuteItems = Array.from({ length: 12 }, (_, i) => i * 5)
          .map((m) => `<button type="button" class="app-time-item ${m === curMinute ? "selected" : ""}" data-minute="${m}">${pad2(m)}</button>`)
          .join("");

        menu.innerHTML = `
          <div class="app-time-columns">
            <div class="app-time-col">
              <div class="app-time-col-label">시</div>
              <div class="app-time-col-list" data-col="hour">${hourItems}</div>
            </div>
            <div class="app-time-col">
              <div class="app-time-col-label">분</div>
              <div class="app-time-col-list" data-col="minute">${minuteItems}</div>
            </div>
          </div>
          <div class="app-date-panel-footer">
            <button type="button" class="app-date-footer-btn" data-action="now">지금</button>
            <button type="button" class="app-date-footer-btn" data-action="clear">지우기</button>
            <button type="button" class="app-date-footer-btn app-time-done" data-action="done">확인</button>
          </div>
        `;

        menu.querySelectorAll(".app-time-item[data-hour]").forEach((btn) => {
          btn.onclick = () => { curHour = parseInt(btn.getAttribute("data-hour"), 10); commit(); renderPanel(); };
        });
        menu.querySelectorAll(".app-time-item[data-minute]").forEach((btn) => {
          btn.onclick = () => { curMinute = parseInt(btn.getAttribute("data-minute"), 10); commit(); renderPanel(); };
        });
        menu.querySelector('[data-action="now"]').onclick = () => {
          const now = new Date();
          curHour = now.getHours();
          curMinute = now.getMinutes();
          commit();
          closeAllAppFloatingMenus();
        };
        menu.querySelector('[data-action="clear"]').onclick = () => {
          curHour = null; curMinute = null;
          inputEl.value = "";
          syncLabel();
          inputEl.dispatchEvent(new Event("change", { bubbles: true }));
          closeAllAppFloatingMenus();
        };
        menu.querySelector('[data-action="done"]').onclick = () => { closeAllAppFloatingMenus(); };

        // 스크롤 목록에서 지금 고른 항목이 보이도록 가운데쯤에 위치시킨다.
        menu.querySelectorAll(".app-time-col-list").forEach((list) => {
          const sel = list.querySelector(".selected");
          if (sel) list.scrollTop = sel.offsetTop - list.clientHeight / 2 + sel.clientHeight / 2;
        });
      };
      renderPanel();

      document.body.appendChild(menu);
      const rect = trigger.getBoundingClientRect();
      const top = Math.min(rect.bottom + 4, window.innerHeight - menu.offsetHeight - 8);
      const left = Math.min(rect.left, window.innerWidth - menu.offsetWidth - 8);
      menu.style.top = `${Math.max(8, top)}px`;
      menu.style.left = `${Math.max(8, left)}px`;
      setTimeout(() => document.addEventListener("mousedown", appFloatingOutsideHandler, true), 0);
    };
  }

