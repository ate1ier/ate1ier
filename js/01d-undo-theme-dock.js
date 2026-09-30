  // ==================== 되돌리기(Undo), 테마, 좌측 내비게이션 독 열고 닫기, 설정 토글 버튼 ====================
  // (예전 01-common.js에서 분리됨 — 실행 순서·내용은 그대로입니다)

  /* ===================== ↩️ 실행 취소(Undo) =====================
     스케줄 셀 상태 변경 · 일괄 적용 · 일괄 붙여넣기 · 일괄 삭제, 그리고 메모·폴더·
     상담사·면담일지·할일·캘린더 일정의 "삭제"처럼 되돌리기 어려운 조작을 하기 직전에
     관련 localStorage 값을 스냅샷으로 남겨두고, Ctrl+Z(맥은 Cmd+Z) 또는 상단 상태표시줄
     오른쪽의 "되돌리기"(↶) 버튼으로 바로 직전 동작 하나를 되돌릴 수 있게 한다
     (예전엔 화면 오른쪽 아래 바로가기 메뉴에 있던 버튼을 옮겼다 —
     js/01q-status-bar-refresh-undo.js 참고). 최근 30개까지
     기억한다. 메모 본문·셀 메모처럼 계속 타이핑하는 값은 스냅샷을 남기지 않는다 —
     글자 하나하나가 되돌리기 대상이 되면 오히려 불편하기 때문이다. */
  const UNDO_STACK_LIMIT = 30;
  const undoStack = [];
  // const로 선언된 state 객체(notesData 등)는 재할당할 수 없으니, 내용을 비우고
  // 새로 불러온 값으로 다시 채워 넣는 방식으로 복원한다.
  function undoRestoreObjectInPlace(obj, fresh) {
    Object.keys(obj).forEach((k) => delete obj[k]);
    Object.assign(obj, fresh);
  }
  function undoSnapshotKeys(keys) {
    return (Array.isArray(keys) ? keys : [keys]).map((key) => {
      let value = null;
      try { value = localStorage.getItem(key); } catch (e) {}
      return { key, value };
    });
  }
  // label: 되돌리기 버튼/토스트에 보여줄 동작 이름.
  // keys: 이 동작으로 바뀌는 localStorage 키(문자열 하나 또는 배열).
  // reloadFn: 스냅샷을 localStorage에 되돌려놓은 뒤, 화면이 참조하는 메모리상의
  //           state 변수(scheduleData, notesData 등)를 다시 읽어들이는 함수.
  function recordUndo(label, keys, reloadFn) {
    undoStack.push({ label, snaps: undoSnapshotKeys(keys), reloadFn });
    if (undoStack.length > UNDO_STACK_LIMIT) undoStack.shift();
    renderUndoToggle();
  }
  function performUndo() {
    const entry = undoStack.pop();
    if (!entry) { renderUndoToggle(); flashUndoToast("되돌릴 작업이 없어요", true); return; }
    entry.snaps.forEach(({ key, value }) => {
      try {
        if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, value);
      } catch (e) {}
    });
    entry.reloadFn();
    renderApp();
    flashUndoToast(`"${entry.label}" 되돌림`);
  }
  let undoToastHideTimer = null;
  function flashUndoToast(msg, isEmpty) {
    const el = document.getElementById("undo-toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle("undo-toast--empty", !!isEmpty);
    el.classList.add("visible");
    clearTimeout(undoToastHideTimer);
    undoToastHideTimer = setTimeout(() => el.classList.remove("visible"), 2200);
  }
  // 입력창에 포커스가 있을 때는 브라우저 기본 Ctrl+Z(텍스트 입력 취소)를 그대로 두고,
  // 그 외의 경우에만 앱의 되돌리기를 실행한다.
  document.addEventListener("keydown", (e) => {
    const k = e.key ? e.key.toLowerCase() : "";
    if (k !== "z" || !(e.ctrlKey || e.metaKey) || e.shiftKey || e.altKey) return;
    const active = document.activeElement;
    const tag = (active && active.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || (active && active.isContentEditable)) return;
    e.preventDefault();
    performUndo();
  });
  // 되돌리기 버튼: 상단 상태표시줄의 ↶ 버튼(#status-bar-undo-btn, body.html)이다.
  // 되돌릴 작업이 없으면 비활성화하고, 있으면 마지막 작업 이름을 툴팁으로 보여준다.
  // 되돌리기 스택이 바뀔 때(recordUndo/performUndo)와 화면을 다시 그릴 때(renderNav)
  // 호출된다. #undo-toggle-root에는 버튼 없이 결과 토스트(#undo-toast)만 남는다 —
  // 토스트는 백업 복원 등 다른 안내 문구를 잠깐 띄울 때도 함께 쓴다(flashUndoToast).
  function renderUndoToggle() {
    const has = undoStack.length > 0;
    const lastLabel = has ? undoStack[undoStack.length - 1].label : "";
    const btn = document.getElementById("status-bar-undo-btn");
    if (btn) {
      const title = has ? `되돌리기 — ${lastLabel} (Ctrl+Z)` : "되돌릴 작업이 없어요";
      btn.disabled = !has;
      btn.title = title;
      btn.setAttribute("aria-label", title);
    }
    const root = document.getElementById("undo-toggle-root");
    if (!root) return;
    root.innerHTML = `<div class="undo-toast" id="undo-toast"></div>`;
  }

  /* ===================== 테마(다크/라이트/그레이/파스텔) ===================== */
  const THEME_KEY = "app-theme-mode";
  // 각 테마의 미리보기용 색(배경/포인트색)과 라벨. CSS의 실제 변수값과 맞춰서 관리한다.
  const THEME_LIST = [
    { id: "dark", label: "다크", bg: "#232327", accent: "#ec6fae" },
    { id: "light", label: "라이트", bg: "#fcfcfd", accent: "#7c5cd1" },
  ];
  function themeMeta(id) { return THEME_LIST.find((t) => t.id === id) || THEME_LIST[0]; }
  function isValidTheme(id) { return THEME_LIST.some((t) => t.id === id); }
  function getStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function applyTheme(mode) {
    if (!mode || mode === "dark") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", mode);
  }
  function getCurrentTheme() {
    return document.documentElement.getAttribute("data-theme") || "dark";
  }
  function setTheme(mode) {
    applyTheme(mode);
    try { localStorage.setItem(THEME_KEY, mode); } catch (e) { /* 저장 실패해도 화면 전환은 그대로 동작 */ }
    renderNav();
  }
  applyTheme(isValidTheme(getStoredTheme()) ? getStoredTheme() : "light");

  /* ===================== 그래픽 효과 단계(끔/약/강) =====================
     사양이 낮은 컴퓨터에서 backdrop-filter 블러·그림자 계산 부담을 줄이는 3단계 스위치.
       강(full)  : 모든 효과(기본)                        → data-fx="normal"
       약(lite)  : 블러 반경 절반 + 그림자 작게, 전환은 유지 → data-fx="lite"
       끔(off)   : 블러·그림자·전환 전부 제거              → data-fx="reduced"
     저장값(localStorage "app-fx-reduced"): "0"=강, "2"=약, "1"=끔. "1"/"0"은 예전 토글
     (켜면 끔, 끄면 강)과 같은 값이라 기존에 저장된 설정이 그대로 이어진다. null=한 번도 안 골랐음.
     이 값은 기기별이다(js/01b-cloud-sync-core.js CLOUD_EXCLUDED_KEYS — 클라우드로 동기화하지 않는다). */
  const FX_KEY = "app-fx-reduced";
  const FX_PROBED_KEY = "app-fx-probed"; // 처음 실행 프레임 측정을 이미 했는지(기기별)
  const FX_AUTO_KEY = "app-fx-auto";     // 효과 단계를 자동으로 낮춘 기기인지(기기별)
  function getStoredFxRaw() {
    try { return localStorage.getItem(FX_KEY); } catch (e) { return null; }
  }
  function getStoredFxReduced() {
    return getStoredFxRaw() === "1";
  }
  // level: "full" | "lite" | "off" | null(속성 없음 = 한 번도 안 건드림 → OS "동작 줄이기"가 있으면 따름)
  function applyFxLevel(level) {
    const el = document.documentElement;
    if (level === "off") el.setAttribute("data-fx", "reduced");
    else if (level === "lite") el.setAttribute("data-fx", "lite");
    else if (level === "full") el.setAttribute("data-fx", "normal");
    else el.removeAttribute("data-fx");
  }
  function applyFxReduced(on) { // 예전 이름(호환): true=끔, false=강, null=속성 없음
    applyFxLevel(on === true ? "off" : on === false ? "full" : null);
  }
  function getFxLevel() {
    const attr = document.documentElement.getAttribute("data-fx");
    if (attr === "reduced") return "off";
    if (attr === "lite") return "lite";
    if (attr === "normal") return "full";
    try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "off" : "full"; } catch (e) { return "full"; }
  }
  function isFxReduced() { return getFxLevel() === "off"; }
  function setFxLevel(level, opts) {
    applyFxLevel(level);
    try { localStorage.setItem(FX_KEY, level === "off" ? "1" : level === "lite" ? "2" : "0"); } catch (e) { /* 저장 실패해도 화면 전환은 그대로 동작 */ }
    // 사용자가 직접 고르면 "자동으로 낮춘 기기" 표시는 지운다(자동 감지가 고른 경우에만 auto:true).
    if (!(opts && opts.auto)) { try { localStorage.removeItem(FX_AUTO_KEY); } catch (e) {} }
    renderNav();
  }
  function setFxReduced(on) { setFxLevel(on ? "off" : "full"); }
  {
    const _fxRaw = getStoredFxRaw();
    applyFxLevel(_fxRaw === "1" ? "off" : _fxRaw === "2" ? "lite" : _fxRaw === "0" ? "full" : null);
  }

  /* ---- 저사양 자동 감지(처음 실행 때 한 번): 코어 수 같은 스펙 추측 대신 "실제로 얼마나 부드럽게
     그려지는지"를 재서 정한다. 화면 위에 눈에 안 띄는 반투명 유리판(backdrop-filter)을 1.5초 동안
     움직이며 프레임 간격을 재고, 중앙값으로 단계를 정한다.
       ≥45ms(약 22fps 이하) → 끔 / ≥28ms(약 36fps 이하) → 약 / 그 외 → 그대로(강)
     이미 단계를 골라본 기기(FX_KEY), 이미 측정한 기기(FX_PROBED_KEY), OS "동작 줄이기" 사용자는 건너뛴다.
     측정 중 탭이 가려지거나 사용자가 입력(클릭·키·스크롤)하면 결과를 버리고 다음 실행 때 다시 잰다. 자동으로 낮췄을 땐 안내 배너로 알리고
     "강으로 되돌리기" 버튼을 준다. */
  function fxDecideLevel(deltas) {
    const d = (deltas || []).slice(3).filter((x) => x > 0 && x < 1000); // 앞 몇 프레임은 시작 지연이라 버린다
    if (d.length < 12) return null; // 표본 부족 → 판단 보류
    const sorted = d.slice().sort((x, y) => x - y);
    const median = sorted[Math.floor(sorted.length / 2)];
    if (median >= 45) return "off";
    if (median >= 28) return "lite";
    // 중앙값이 정상이면 가끔 튀는 프레임(시작 직후 렌더링·GC·네트워크 응답 등)은 GPU 문제가 아니므로 무시한다.
    // (예전엔 p90 >= 60ms만으로도 "약"으로 낮췄는데, 시작 직후 일시적 끊김에 빠른 PC까지 낮아질 수 있었다.)
    return "full";
  }
  function fxRunProbe(done) {
    const W = 520, H = 340, DURATION = 1500;
    const probe = document.createElement("div");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText = "position:fixed;left:0;top:0;width:" + W + "px;height:" + H + "px;pointer-events:none;z-index:99999;" +
      "opacity:0.02;background:rgba(255,255,255,0.5);will-change:transform;" +
      "-webkit-backdrop-filter:blur(16px) saturate(1.6);backdrop-filter:blur(16px) saturate(1.6);";
    document.body.appendChild(probe);
    const deltas = [];
    let last = 0, start = 0, aborted = false, finished = false;
    // 측정 중 사용자가 무언가 하면(클릭·키 입력·스크롤·터치) 그 순간의 렌더링 부담이 섞여 측정이 왜곡되고,
    // 느린 PC에서는 측정용 유리판 때문에 클릭 반응도 둔해진다 → 즉시 중단하고(결과 버림) 다음 실행 때 다시 잰다.
    const onVis = () => { if (document.hidden) aborted = true; };
    const onInput = () => { aborted = true; if (probe.parentNode) probe.parentNode.removeChild(probe); };
    const INPUT_EVENTS = ["pointerdown", "keydown", "wheel", "touchstart"];
    document.addEventListener("visibilitychange", onVis);
    INPUT_EVENTS.forEach((ev) => document.addEventListener(ev, onInput, true));
    function finish(result) {
      if (finished) return;
      finished = true;
      document.removeEventListener("visibilitychange", onVis);
      INPUT_EVENTS.forEach((ev) => document.removeEventListener(ev, onInput, true));
      if (probe.parentNode) probe.parentNode.removeChild(probe);
      done(result);
    }
    function step(t) {
      if (aborted) return finish(null);
      if (!start) start = t;
      if (last) deltas.push(t - last);
      last = t;
      const p = (t - start) / DURATION;
      if (p >= 1) return finish(deltas);
      const x = Math.max(0, window.innerWidth - W) * Math.abs(Math.sin(p * Math.PI * 2));
      const y = Math.max(0, window.innerHeight - H) * Math.abs(Math.cos(p * Math.PI * 2));
      probe.style.transform = "translate(" + Math.round(x) + "px," + Math.round(y) + "px)";
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const FX_LEVEL_LABEL = { lite: "약", off: "끔" };
  function _showFxAutoBanner(level) {
    const el = document.createElement("div");
    el.className = "cloud-live-banner";
    el.id = "fx-suggest-banner";
    el.innerHTML = `
      <div class="cloud-live-banner-body">
        <div class="cloud-live-banner-title">그래픽 효과를 "${FX_LEVEL_LABEL[level]}"으로 낮췄어요</div>
        <div class="cloud-live-banner-desc">이 컴퓨터에서 화면이 부드럽게 그려지지 않아 자동으로 조절했어요. 상태표시줄 → 모드 메뉴에서 끔/약/강을 언제든 바꿀 수 있어요.</div>
        <div class="cloud-live-banner-actions">
          <button type="button" class="ghost-btn" id="fx-suggest-dismiss">괜찮아요</button>
          <button type="button" class="primary-btn" id="fx-suggest-revert">강으로 되돌리기</button>
        </div>
      </div>
    `;
    _liveBannerWrap().appendChild(el);
    document.getElementById("fx-suggest-dismiss").onclick = () => el.remove();
    document.getElementById("fx-suggest-revert").onclick = () => { setFxLevel("full"); el.remove(); };
  }
  function maybeSuggestLowGraphicsMode() { // 이름은 예전 그대로(js/12-init.js가 호출): 이제 "자동 측정 후 조절"
    try {
      if (localStorage.getItem(FX_KEY) !== null) return;        // 직접 골라본 사람은 그 선택을 존중
      if (localStorage.getItem(FX_PROBED_KEY)) return;          // 이 기기는 이미 측정함
    } catch (e) { return; }                                     // 저장소를 못 쓰면 매번 재게 되므로 건너뜀
    try { if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; } catch (e) {}
    if (document.hidden) {
      const once = () => { if (!document.hidden) { document.removeEventListener("visibilitychange", once); maybeSuggestLowGraphicsMode(); } };
      document.addEventListener("visibilitychange", once);
      return;
    }
    fxRunProbe((deltas) => {
      if (!deltas) return; // 중단됨 — 기록 안 남기고 다음 실행 때 다시 잰다
      const level = fxDecideLevel(deltas);
      if (!level) return;
      try { localStorage.setItem(FX_PROBED_KEY, "1"); } catch (e) {}
      if (level === "full") return; // 충분히 빠름: 아무것도 바꾸지 않는다
      setFxLevel(level, { auto: true });
      try { localStorage.setItem(FX_AUTO_KEY, "1"); } catch (e) {}
      _showFxAutoBanner(level);
    });
  }

  /* ===================== 데스크톱 독(Dock) 펼치기/닫기 =====================
     독 안에는 메뉴 카테고리(#nav)가 들어있고, 펼치기/접기 대상은 그걸 감싸는
     #nav-dock 전체다. (예전엔 전역 검색 바도 이 독 안, 카테고리 바로 위에 있었는데
     상단 상태표시줄의 검색 버튼으로 옮겼다 — js/01r-status-bar-search.js 참고) */
  function isDockOpen() {
    const navDock = document.getElementById("nav-dock");
    return !!(navDock && navDock.classList.contains("dock-open"));
  }
  function dockOutsideHandler(e) {
    const navDock = document.getElementById("nav-dock");
    const btn = document.getElementById("dock-toggle-btn");
    if (navDock && !navDock.contains(e.target) && !(btn && btn.contains(e.target))) closeDock();
  }
  function openDock() {
    const navDock = document.getElementById("nav-dock");
    const btn = document.getElementById("dock-toggle-btn");
    if (navDock) navDock.classList.add("dock-open");
    if (btn) { btn.classList.add("open"); btn.setAttribute("aria-expanded", "true"); btn.title = "메뉴 닫기"; btn.setAttribute("aria-label", "메뉴 닫기"); }
    setTimeout(() => document.addEventListener("mousedown", dockOutsideHandler, true), 0);
  }
  function closeDock() {
    const navDock = document.getElementById("nav-dock");
    const btn = document.getElementById("dock-toggle-btn");
    if (navDock) navDock.classList.remove("dock-open");
    if (btn) { btn.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); btn.title = "메뉴 열기"; btn.setAttribute("aria-label", "메뉴 열기"); }
    document.removeEventListener("mousedown", dockOutsideHandler, true);
  }
  function toggleDock() {
    if (isDockOpen()) closeDock(); else openDock();
  }
  const dockToggleBtn = document.getElementById("dock-toggle-btn");
  if (dockToggleBtn) {
    dockToggleBtn.onclick = (e) => { e.stopPropagation(); toggleDock(); };
  }

  // 일정/할일 알림을 공지하는 디스코드 서버 초대 링크. 만료되지 않는 링크로 만들어두면 됨.
  // (실제 알림 발송은 이 사이트가 아니라 Supabase Edge Function + pg_cron이 처리하고,
  //  여기서는 그 알림이 올라오는 서버로 바로 이동할 수 있는 상단 상태표시줄의 "디스코드" 버튼만 둔다 — js/01s-status-bar-discord.js.)
  const DISCORD_INVITE_URL = "https://discord.gg/QFpBnYMp4";

  /* ===================== 데이터 백업/복원 =====================
     상담사 정보 · 스케줄 · 면담일지 · QA 점수 · 메모 · 캘린더처럼
     "acct:{계정id}:" 접두어가 붙어 저장되는 이 계정 소유의 데이터를
     JSON 파일로 내보내고 다시 불러올 수 있게 한다.
     가져오기는 파일 안에 어떤 계정 이름이 적혀 있었든 상관없이 항상
     "지금 로그인한 계정"의 접두어로 다시 저장한다 — 그래야 다른 계정에서
     내보낸 백업이라도 가져오는 즉시 지금 계정 소유가 되고, 다른 계정의
     데이터에는 절대 영향을 주지 않는다. */
