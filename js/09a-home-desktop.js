  // ==================== 바탕화면: 오른쪽 데스크톱 아이콘 + 하단 독 + 여러 개의 페이지 창 (macOS 방식) ====================
  // ate1ier-macos-mockup의 #icons(.di, 오른쪽 세로 줄)와 #dock(.dk, 아래 가운데)을 그대로 옮겼다.
  // 아이콘/독을 누르면 예전처럼 화면 전체가 그 페이지로 바뀌는 대신, 진짜 macOS 데스크톱처럼 바탕화면 위에
  // 그 페이지만의 독립된 창이 새로 뜬다. 이미 다른 페이지 창이 열려 있어도 그 창은 그대로 남아 있고,
  // 두 창이 동시에 떠서 서로 겹치거나 따로 옮겨둘 수 있다 — 다른 아이콘을 눌러도 기존 창이 그 창으로
  // "바뀌지" 않는다.
  //   - 창 = .app-win (제목줄 .aw-tb + 그 페이지가 그려지는 .page-inner). 페이지 화면 자체는 예전과 동일.
  //   - 같은 아이콘을 다시 누르면: 열려 있지 않으면 새로 열고, 열려 있으면 앞으로 가져오고(포커스),
  //     내려가 있으면(노랑 버튼) 복원한다.
  //   - 창이 열려 있어도 홈 위젯(#wg, #home-root)은 뒤 바탕화면에 그대로 보인다.
  //   - 제목줄: 빨강 = 이 창만 닫기, 노랑 = 내리기(창만 숨김, 같은 아이콘을 다시 누르면 복원),
  //     초록/제목줄 더블클릭 = 크게·작게, 제목줄을 잡고 끌면 이동, 오른쪽 아래 모서리로 크기 조절.
  //     창 아무 곳이나 누르면 그 창이 맨 앞으로 온다(다른 창에 가려져 있었다면).
  //   - setPage(p)를 부르는 곳(아이콘·독·홈 위젯 링크·전역 검색·오늘의 브리핑 등)은 모두 그대로 두면
  //     자동으로 이 "열거나 포커스" 동작을 타게 했다 — js/01j-session-boot.js의 setPage 참고.
  // 일반 계정에서는 항상 바탕화면 모드(body.home-desktop)이고, 그동안엔 오른쪽 내비게이션 사이드바(#nav-dock)를
  // css/01b-home-desktop.css에서 숨긴다. 마스터 계정은 홈 화면이 없어(계정 관리 전용) 기존 그대로 옛 #page-area를 쓴다.
  const HOME_DESKTOP_APPS = [
    ["calendar", "캘린더", "#ff7a7a,#e11d48", "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"],
    ["agents", "상담사 관리", "#34d399,#059669", "M9 11a3 3 0 100-6 3 3 0 000 6zM3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M16 5a3 3 0 010 6M18 14c2 .7 3 2.6 3 5"],
    ["notes", "업무 정리", "#fde047,#f59e0b", "M6 3h9l3 3v15H6zM9 10h6M9 14h6M9 18h4"],
    ["interviews", "면담일지", "#a78bfa,#6d28d9", "M4 5h16v11H9l-5 4z"],
    ["qa", "품질 관리", "#fb923c,#ea580c", "M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3"],
    ["schedule", "월별 스케줄", "#22d3ee,#0891b2", "M3 5h18v14H3zM3 10h18M3 15h18M9 5v14M15 5v14"],
  ];
  // small=true면 창 제목줄용 작은 아이콘(css의 .hd-ic.aw-ic, 목업 제목줄처럼 작고 단정하게)을 그린다.
  // 바탕화면/독 아이콘은 기존처럼 큰 아이콘(기본값) 그대로.
  function homeDesktopIconHtml(app, small) {
    return `<span class="hd-ic${small ? " aw-ic" : ""}" style="--g:linear-gradient(160deg,${app[2]})"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${app[3]}"/></svg></span>`;
  }
  // 품질 관리는 상담사 관리 → 전체 QA 점수에서 사용하므로 앱 정보는 유지하되,
  // 바탕화면/하단 Dock의 독립 실행 아이콘에서는 제외한다.
  const HOME_DESKTOP_LAUNCH_APPS = HOME_DESKTOP_APPS.filter((a) => a[0] !== "qa");
  const HOME_DESKTOP_APP_BY_ID = {};
  HOME_DESKTOP_APPS.forEach((a) => { HOME_DESKTOP_APP_BY_ID[a[0]] = a; });
  // 창으로 열 수 있는 대상의 정보([id, 이름, 그라데이션, 아이콘 path]). 기본 앱 6개 외에, 바탕화면에서 우클릭으로
  // 만든 폴더("folder:<id>", js/09b-desktop-folders.js)도 같은 창 시스템을 그대로 타도록 여기서 함께 돌려준다.
  function hdAppInfo(page) {
    if (HOME_DESKTOP_APP_BY_ID[page]) return HOME_DESKTOP_APP_BY_ID[page];
    if (typeof desktopFolderAppInfo === "function") return desktopFolderAppInfo(page);
    return null;
  }

  // 지금 열려 있는 창들의 상태. order = 뒤(아래)→앞(맨 위) 쌓임 순서(z-index 순서와 같음, 마지막이 포커스된 창).
  // state[page] = { minimized, maximized, justOpened } — justOpened는 "방금 새로 연" 창에만 켜서(복원 때는
  // 켜지 않음) 팝 애니메이션을 돌리고 스크롤을 맨 위로 되돌린다. 복원(내려간 창을 다시 열기)은 이 플래그를
  // 켜지 않아서, 스크롤 위치 등 그 페이지 안에서 하던 작업 화면이 그대로 남아 있는다.
  const hdWin = { order: [], state: {} };
  // 화면 좌/우 절반 붙이기(스냅) 관련 임시 상태: 어시스트 패널 DOM과 그 패널을 닫기 위한 문서 이벤트 핸들러.
  const hdSnap = { assistEl: null, onDown: null, onKey: null };

  function hdWindowsLayer() { return document.getElementById("hd-windows"); }

  /* ===================== 열린 창 목록: 이 "탭"에만 남는 저장/복원 =====================
     어떤 페이지 창이 열려 있는지·접혀 있는지·최대화됐는지·어디에 얼마만한 크기로 떠
     있는지는 지금 이 탭에서만 의미 있는 화면 상태이므로 클라우드(서버)로 보내지 않고,
     새로고침에는 살아남지만 탭을 껐다 다시 열면 깨끗이 사라지는 sessionStorage에만
     남긴다. (localStorage와 달리 sessionStorage는 js/01c-cloud-sync-runtime.js가
     감싸둔 대상이 아니라서 애초에 클라우드로 올라갈 일이 없다.) 그 창 "안"에서 실제로
     고친 내용(스케줄·메모 등)은 지금처럼 그대로 서버에 저장되고 다른 기기와도 동기화된다
     — 이건 오직 "지금 이 탭에서 무슨 창이 떠 있었는지"만 다루는 별개의 저장소라, 다른
     사람이 다른 환경(다른 브라우저·기기)에서 로그인해도 그쪽엔 전달되지 않는다.
     계정별로 따로 남긴다. */
  function hdOpenWindowsKey() {
    return "personal-app:open-windows:" + CURRENT_ACCOUNT_ID;
  }
  function hdSaveOpenWindowsState() {
    if (CURRENT_ACCOUNT_IS_MASTER) return;
    try {
      const data = hdWin.order.map((page) => {
        const frame = document.getElementById("app-win-" + page);
        const st = hdWin.state[page] || {};
        return {
          page,
          minimized: !!st.minimized,
          maximized: !!st.maximized,
          snap: st.snap || "",
          left: frame ? frame.style.left : "",
          top: frame ? frame.style.top : "",
          width: frame ? frame.style.width : "",
          height: frame ? frame.style.height : "",
        };
      });
      sessionStorage.setItem(hdOpenWindowsKey(), JSON.stringify(data));
    } catch (e) { /* 저장 실패는 화면 동작에 영향 없이 조용히 무시 */ }
  }
  function hdLoadOpenWindowsState() {
    try {
      const raw = sessionStorage.getItem(hdOpenWindowsKey());
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }
  // 새로고침 시 한 번: 같은 탭에서 방금 전까지 열어뒀던 창들을(순서·위치·크기·접힘/최대화
  // 상태까지) 그대로 되살린다. 실제 내용은 뒤이은 renderApp()이 채워 넣는다. 탭을 아예
  // 껐다가 새로 열면 sessionStorage 자체가 비어 있으므로 자연스럽게 아무 것도 복원되지 않는다.
  function hdRestoreOpenWindows() {
    if (CURRENT_ACCOUNT_IS_MASTER) return;
    const saved = hdLoadOpenWindowsState();
    saved.forEach((entry) => {
      if (!entry || !hdAppInfo(entry.page)) return;
      const snap = entry.snap === "l" || entry.snap === "r" ? entry.snap : null;
      const frame = hdCreateWindowFrame(entry.page, { minimized: entry.minimized, maximized: entry.maximized, snap });
      if (!frame) return;
      if (entry.left) frame.style.left = entry.left;
      if (entry.top) frame.style.top = entry.top;
      if (entry.width) frame.style.width = entry.width;
      if (entry.height) frame.style.height = entry.height;
      hdWin.state[entry.page] = { minimized: !!entry.minimized, maximized: !!entry.maximized, snap, justOpened: false };
      hdBringToFront(entry.page);
    });
    if (hdWin.order.length) state.page = hdWin.order[hdWin.order.length - 1];
  }

  function hdPageRenderer(page) {
    if (typeof page === "string" && page.indexOf("folder:") === 0) return (inner) => renderDesktopFolderWindow(inner, page.slice(7));
    if (page === "notes") return renderNotesPage;
    if (page === "agents") return renderAgentsPage;
    if (page === "qa") return renderQAPage;
    if (page === "interviews") return renderInterviewsPage;
    if (page === "schedule") return renderSchedulePage;
    if (page === "calendar") return renderCalendarPage;
    return null;
  }

  // 새로 뜨는 창의 기본 위치: 가운데 정렬 기준에서, 이미 열려 있는 창 개수만큼 살짝씩 어긋나게(카스케이드)
  // 배치해서 여러 창이 완전히 겹쳐 보이지 않게 한다. 한 번 연 뒤 끌거나 크기를 바꾸면 그 값을 그대로 기억한다
  // (창 DOM 자체가 닫기 전까진 사라지지 않으므로 인라인 스타일이 계속 남아 있음).
  function hdCascadeRect(index, page) {
    const vw = window.innerWidth, vh = window.innerHeight;
    const off = (index % 5) * 28;
    // 폴더 창은 페이지 창보다 훨씬 작게(탐색기 창 정도) 띄운다.
    if (typeof page === "string" && page.indexOf("folder:") === 0) {
      const w = Math.round(Math.min(760, vw - 40)), h = Math.round(Math.min(480, vh - 190));
      return { left: Math.round(Math.max(12, (vw - w) / 2)) + off, top: 84 + off, width: w, height: h };
    }
    return {
      left: Math.round(Math.max(112, (vw - 1240) / 2)) + off,
      top: 52 + off,
      width: Math.round(Math.min(1240, vw - 224)),
      height: Math.round(vh - 52 - 132),
    };
  }

  // 열려 있는 순서(hdWin.order)대로 z-index를 50부터 다시 매긴다 — 맨 뒤(마지막)가 가장 위.
  // 열림 순서가 바뀔 때마다(새로 열기·포커스·복원) 로컬에도 그대로 남겨서, 다음에 이
  // 브라우저를 다시 열었을 때 같은 순서로 되살아나게 한다.
  function hdBringToFront(page) {
    const idx = hdWin.order.indexOf(page);
    if (idx !== -1) hdWin.order.splice(idx, 1);
    hdWin.order.push(page);
    hdWin.order.forEach((p, i) => {
      const frame = document.getElementById("app-win-" + p);
      if (frame) frame.style.zIndex = String(50 + i);
    });
    hdSaveOpenWindowsState();
  }

  // opts.minimized/opts.maximized를 넘기면(부팅 시 복원 전용) 그 상태로 접힌 채/최대화된 채
  // 처음부터 만들어서, 창이 DOM에 나타나는 순간 잠깐 펼쳐졌다 접히는 깜빡임이 없게 한다.
  function hdCreateWindowFrame(page, opts) {
    const app = hdAppInfo(page);
    const layer = hdWindowsLayer();
    if (!app || !layer) return null;
    const rect = hdCascadeRect(hdWin.order.length, page);
    const frame = document.createElement("div");
    frame.className = "app-win" + (opts && opts.minimized ? " win-min" : "") + (opts && opts.maximized ? " win-max" : "") + (opts && opts.snap && !(opts && opts.maximized) ? " win-snap-" + opts.snap : "");
    frame.id = "app-win-" + page;
    frame.setAttribute("data-page", page);
    frame.style.left = rect.left + "px";
    frame.style.top = rect.top + "px";
    frame.style.width = rect.width + "px";
    frame.style.height = rect.height + "px";
    frame.innerHTML = `
      <div class="aw-tb">
        <div class="aw-tl">
          <button type="button" class="aw-tlb" data-win="close" data-g="✕" style="--c:#ff5f57" aria-label="창 닫기" title="닫기"></button>
          <button type="button" class="aw-tlb" data-win="min" data-g="−" style="--c:#febc2e" aria-label="창 내리기" title="내리기"></button>
          <button type="button" class="aw-tlb" data-win="max" data-g="⤢" style="--c:#28c840" aria-label="창 크게/작게" title="크게/작게"></button>
        </div>
        <div class="aw-tt">${homeDesktopIconHtml(app, true)}${esc(app[1])}</div>
        <div class="aw-tr"></div>
      </div>
      <div class="page-inner"></div>
      <span class="aw-resize-handle aw-rz-n" data-resize="n"></span><span class="aw-resize-handle aw-rz-e" data-resize="e"></span><span class="aw-resize-handle aw-rz-s" data-resize="s"></span><span class="aw-resize-handle aw-rz-w" data-resize="w"></span>
      <span class="aw-resize-handle aw-rz-ne" data-resize="ne"></span><span class="aw-resize-handle aw-rz-se" data-resize="se"></span><span class="aw-resize-handle aw-rz-sw" data-resize="sw"></span><span class="aw-resize-handle aw-rz-nw" data-resize="nw"></span>
    `;
    layer.appendChild(frame);
    hdWireWindowFrame(frame, page);
    return frame;
  }

  // 크게/작게 전환 순간에만 위치·크기 트랜지션을 잠깐 걸어준다(css/01c-app-window.css의 .aw-resize-anim).
  // 전환이 끝나면 클래스를 다시 떼어내서, 그 뒤에 창을 끌거나 모서리로 크기를 손수 바꿀 때는
  // 트랜지션 없이 항상 마우스에 딱 붙어 즉각적으로 움직이게 한다.
  // kind === "snap"이면 스냅 전용(더 길고 부드러운) 트랜지션 클래스(aw-snap-anim, .6s)를 쓰고, 아니면 기존 크게/작게(aw-resize-anim, .45s).
  function hdAnimateWindowResize(frame, kind) {
    const cls = kind === "snap" ? "aw-snap-anim" : "aw-resize-anim";
    frame.classList.remove("aw-resize-anim", "aw-snap-anim", "aw-unsnap-anim");
    frame.classList.add(cls);
    clearTimeout(frame._hdResizeAnimTimer);
    frame._hdResizeAnimTimer = setTimeout(() => frame.classList.remove(cls), kind === "snap" ? 660 : 500);
  }

  function hdWireWindowFrame(frame, page) {
    const bar = frame.querySelector(".aw-tb");

    // 우하단 대각선 리사이즈는 캡처 단계에서 직접 처리한다.
    // page-inner/overflow 요소가 pointerdown을 가로채더라도 이 핸들 영역은 항상 창이 받도록 한다.
    frame.addEventListener("pointerdown", (e) => {
      const st = hdWin.state[page];
      const r = frame.getBoundingClientRect();
      const hit = e.clientX >= r.right - 28 && e.clientY >= r.bottom - 28;
      if (!hit || !st || st.maximized || st.minimized || e.button !== 0) return;
      if (st.snap) {
        st.snap = null;
        frame.classList.remove("win-snap-l", "win-snap-r", "aw-snap-anim", "aw-unsnap-anim");
        hdHideSnapAssist(true);
      }
      e.preventDefault();
      e.stopPropagation();
      frame.classList.remove("aw-resize-anim", "aw-snap-anim", "aw-unsnap-anim");
      const startX = e.clientX, startY = e.clientY;
      const startW = r.width, startH = r.height;
      const minW = 340, minH = 240;
      const maxW = Math.max(minW, window.innerWidth - 16);
      const maxH = Math.max(minH, window.innerHeight - 55);
      frame.style.cursor = "nwse-resize";
      try { frame.setPointerCapture?.(e.pointerId); } catch (_) {}
      const move = (v) => {
        const width = Math.min(maxW, Math.max(minW, startW + (v.clientX - startX)));
        const height = Math.min(maxH, Math.max(minH, startH + (v.clientY - startY)));
        frame.style.width = Math.round(width) + "px";
        frame.style.height = Math.round(height) + "px";
      };
      const up = () => {
        document.removeEventListener("pointermove", move, true);
        document.removeEventListener("pointerup", up, true);
        document.removeEventListener("pointercancel", up, true);
        frame.style.cursor = "";
        try { frame.releasePointerCapture?.(e.pointerId); } catch (_) {}
        hdSaveOpenWindowsState();
      };
      document.addEventListener("pointermove", move, true);
      document.addEventListener("pointerup", up, true);
      document.addEventListener("pointercancel", up, true);
    }, true);
    // 창 안 아무 곳이나 누르면(제목줄이든 본문이든) 이 창을 맨 앞으로 가져온다.
    frame.addEventListener("pointerdown", (e) => {
      // 일부 페이지의 내부 스크롤/오버플로 요소가 우하단 핸들을 덮더라도
      // 창 자체에서 우하단 모서리 드래그를 확실히 받을 수 있도록 보조 히트 테스트를 둔다.
      // 별도 표시 없이 창의 실제 우하단 20px 영역만 감지한다.
      const st = hdWin.state[page];
      const r = frame.getBoundingClientRect();
      const nearSE = e.clientX >= r.right - 20 && e.clientY >= r.bottom - 20;
      if (nearSE && st && !st.maximized && !st.minimized && e.button === 0) {
        if (st.snap) { st.snap = null; frame.classList.remove("win-snap-l", "win-snap-r", "aw-snap-anim", "aw-unsnap-anim"); hdHideSnapAssist(true); }
        e.preventDefault();
        e.stopPropagation();
        frame.classList.remove("aw-resize-anim", "aw-snap-anim", "aw-unsnap-anim");
        const startX = e.clientX, startY = e.clientY;
        const startW = r.width, startH = r.height;
        const minW = 340, minH = 240;
        const maxW = Math.max(minW, window.innerWidth - 16);
        const maxH = Math.max(minH, window.innerHeight - 55);
        const moveSE = (v) => {
          const width = Math.min(maxW, Math.max(minW, startW + (v.clientX - startX)));
          const height = Math.min(maxH, Math.max(minH, startH + (v.clientY - startY)));
          frame.style.width = Math.round(width) + "px";
          frame.style.height = Math.round(height) + "px";
        };
        const upSE = () => {
          document.removeEventListener("pointermove", moveSE);
          document.removeEventListener("pointerup", upSE);
          document.removeEventListener("pointercancel", upSE);
          hdSaveOpenWindowsState();
        };
        document.addEventListener("pointermove", moveSE);
        document.addEventListener("pointerup", upSE);
        document.addEventListener("pointercancel", upSE);
        try { frame.setPointerCapture?.(e.pointerId); } catch (_) {}
        return;
      }
      hdBringToFront(page);
    });
    // 창의 상·하·좌·우 면과 네 모서리를 직접 드래그해 크기를 조절한다.
    // 브라우저 기본 resize는 오른쪽 아래 모서리만 지원하므로 모든 방향을 동일한 방식으로 제공한다.
    frame.querySelectorAll("[data-resize]").forEach((handle) => {
      handle.addEventListener("pointerdown", (e) => {
        const st = hdWin.state[page];
        if (!st || st.maximized || st.minimized || e.button !== 0) return;
        if (st.snap) { st.snap = null; frame.classList.remove("win-snap-l", "win-snap-r", "aw-snap-anim", "aw-unsnap-anim"); hdHideSnapAssist(true); }
        e.preventDefault(); e.stopPropagation();
        if (handle.setPointerCapture) { try { handle.setPointerCapture(e.pointerId); } catch (_) {} }
        frame.classList.remove("aw-resize-anim", "aw-snap-anim", "aw-unsnap-anim");
        const dir = handle.getAttribute("data-resize");
        const start = frame.getBoundingClientRect();
        const startX = e.clientX, startY = e.clientY;
        const minW = 340, minH = 240;
        const maxW = Math.max(minW, window.innerWidth - 16);
        const maxH = Math.max(minH, window.innerHeight - 55);
        const move = (v) => {
          const dx = v.clientX - startX, dy = v.clientY - startY;
          let left = start.left, top = start.top, width = start.width, height = start.height;
          if (dir.includes("e")) width = Math.min(maxW, Math.max(minW, start.width + dx));
          if (dir.includes("s")) height = Math.min(maxH, Math.max(minH, start.height + dy));
          if (dir.includes("w")) {
            const nextLeft = Math.max(0, Math.min(start.left + start.width - minW, start.left + dx));
            left = nextLeft; width = start.width + (start.left - nextLeft);
          }
          if (dir.includes("n")) {
            const nextTop = Math.max(39, Math.min(start.top + start.height - minH, start.top + dy));
            top = nextTop; height = start.height + (start.top - nextTop);
          }
          width = Math.min(maxW, Math.max(minW, width));
          height = Math.min(maxH, Math.max(minH, height));
          frame.style.left = Math.round(left) + "px"; frame.style.top = Math.round(top) + "px";
          frame.style.width = Math.round(width) + "px"; frame.style.height = Math.round(height) + "px";
        };
        const up = () => {
          document.removeEventListener("pointermove", move);
          document.removeEventListener("pointerup", up);
          document.removeEventListener("pointercancel", up);
          try { if (handle.releasePointerCapture) handle.releasePointerCapture(e.pointerId); } catch (_) {}
          hdSaveOpenWindowsState();
        };
        document.addEventListener("pointermove", move);
        document.addEventListener("pointerup", up);
        document.addEventListener("pointercancel", up);
      });
    });
    // 창 크기를 손으로 바꾼 뒤에도 그 크기를 로컬에 남긴다.
    if (window.ResizeObserver) {
      let resizeSaveTimer = null;
      new ResizeObserver(() => {
        clearTimeout(resizeSaveTimer);
        resizeSaveTimer = setTimeout(hdSaveOpenWindowsState, 400);
      }).observe(frame);
    }
    bar.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-win]");
      if (!btn) return;
      const k = btn.getAttribute("data-win");
      if (k === "close") { hdCloseWindow(page); return; }
      const st = hdWin.state[page];
      if (!st) return;
      if (k === "min") { hdMinimizeWindow(page); return; }
      hdAnimateWindowResize(frame);
      if (!st.maximized) st.snap = null; // 반쪽으로 붙어 있던 창을 최대화하면 스냅은 풀리고, 다시 작게 하면 붙이기 전 크기로 돌아간다
      st.maximized = !st.maximized;
      syncAppWindows();
      hdSaveOpenWindowsState();
    });
    bar.addEventListener("dblclick", (e) => {
      if (e.target.closest(".aw-tl")) return;
      const st = hdWin.state[page];
      if (!st) return;
      hdAnimateWindowResize(frame);
      if (!st.maximized) st.snap = null; // 반쪽으로 붙어 있던 창을 최대화하면 스냅은 풀리고, 다시 작게 하면 붙이기 전 크기로 돌아간다
      st.maximized = !st.maximized;
      syncAppWindows();
      hdSaveOpenWindowsState();
    });
    // 제목줄을 잡고 끌어서 창 이동 (최대화 상태에선 이동 안 함)
    // + 화면 왼쪽/오른쪽 끝까지 끌고 가면 그쪽 절반 자리에 미리보기가 뜨고, 놓으면 그 절반에 붙는다(스냅).
    //   반쪽으로 붙어 있는 창은 제목줄을 조금(6px 이상) 끌면 붙이기 전 크기로 풀리면서 마우스를 따라온다.
    bar.addEventListener("pointerdown", (e) => {
      const st = hdWin.state[page];
      if (e.target.closest(".aw-tl") || !st || st.maximized || (e.button !== undefined && e.button !== 0)) return;
      frame.classList.remove("aw-resize-anim", "aw-snap-anim", "aw-unsnap-anim"); // 방금 끝난 크게/작게·스냅 트랜지션이 남아 있으면 끌 때 마우스보다 늦게 따라온다
      const r = frame.getBoundingClientRect();
      let dx = e.clientX - r.left;
      const dy = e.clientY - r.top;
      let width = r.width;
      const startX = e.clientX, startY = e.clientY;
      // 끌기 시작 전 위치 — 끌다가 화면 가장자리에서 스냅되면, 나중에 스냅을 풀었을 때 가장자리가 아니라 이 자리로 돌아가게 한다.
      const origLeft = frame.style.left, origTop = frame.style.top;
      const topMin = 39;
      let side = null;
      const move = (v) => {
        if (st.snap) {
          if (Math.abs(v.clientX - startX) < 6 && Math.abs(v.clientY - startY) < 6) return;
          // 붙어 있던 창을 끌어내는 순간: 인라인 left/top/width/height에는 붙이기 전 값이 그대로 남아 있으므로
          // 스냅 클래스만 떼면 원래 크기로 돌아간다. 잡은 위치의 가로 비율은 유지해서 마우스 아래에 그대로 매달리게 한다.
          const w0 = parseFloat(frame.style.width) || width;
          dx = Math.max(24, Math.min(w0 - 24, (dx / r.width) * w0));
          width = w0;
          st.snap = null;
          // 위치(left/top)는 마우스에 바로 붙고, 크기(width/height)만 반쪽 → 원래 크기로 부드럽게 커진다(css의 .aw-unsnap-anim)
          frame.classList.add("aw-unsnap-anim");
          frame.classList.remove("win-snap-l", "win-snap-r");
          clearTimeout(frame._hdResizeAnimTimer);
          frame._hdResizeAnimTimer = setTimeout(() => frame.classList.remove("aw-unsnap-anim"), 420);
          hdHideSnapAssist(true);
        }
        frame.style.left = Math.max(-width + 90, Math.min(window.innerWidth - 90, v.clientX - dx)) + "px";
        frame.style.top = Math.max(topMin, Math.min(window.innerHeight - 60, v.clientY - dy)) + "px";
        const next = hdSnapSideAt(v.clientX);
        if (next !== side) { side = next; hdShowSnapPreview(side); }
      };
      const up = () => {
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerup", up);
        document.removeEventListener("pointercancel", up);
        hdShowSnapPreview(null);
        if (side && !st.snap && hdWin.state[page] === st) { hdSnapWindow(page, side, true, { left: origLeft, top: origTop }); return; }
        hdSaveOpenWindowsState(); // 끌기가 끝나면(놓았을 때) 바뀐 위치를 로컬에 남긴다.
      };
      document.addEventListener("pointermove", move);
      document.addEventListener("pointerup", up);
      document.addEventListener("pointercancel", up);
      e.preventDefault();
    });
  }

  // 내리기(노랑 버튼): 끄는 게 아니라 macOS처럼 하단 독의 그 아이콘 쪽으로 접혀 들어가는
  // 모션(지니 효과)으로 창을 감춘다. 창의 실제 위치·크기(left/top/width/height)는 전혀
  // 건드리지 않고 transform만 바꾸는 방식이라, 독에서 다시 눌러 펼치면(transform이 원래
  // 값으로 돌아오며) 접기 전 크기·위치가 그대로 복원된다 — 페이지 안 스크롤 위치 등
  // 하던 작업 화면도 창 DOM 자체가 사라지지 않으므로 그대로 남아 있는다.
  function hdMinimizeWindow(page) {
    const frame = document.getElementById("app-win-" + page);
    const st = hdWin.state[page];
    if (!frame || !st) return;
    const dockBtn = document.querySelector('#home-dock [data-hd-page="' + page + '"]');
    if (dockBtn) {
      const fr = frame.getBoundingClientRect();
      const dr = dockBtn.getBoundingClientRect();
      const dx = (dr.left + dr.width / 2) - (fr.left + fr.width / 2);
      const dy = (dr.top + dr.height / 2) - (fr.top + fr.height / 2);
      const scale = Math.max(0.04, Math.min(0.5, dr.width / fr.width));
      frame.style.setProperty("--mac-min-dx", dx.toFixed(1) + "px");
      frame.style.setProperty("--mac-min-dy", dy.toFixed(1) + "px");
      frame.style.setProperty("--mac-min-scale", scale.toFixed(4));
    }
    st.minimized = true;
    hdHideSnapAssist();
    syncAppWindows();
    hdSaveOpenWindowsState(); // 내리는 즉시 로컬에 남겨야, 내리자마자 새로고침해도 접힌 채로 복원된다.
  }

  // setPage(p)에서 부른다: 이미 그 페이지 창이 열려 있으면 앞으로 가져오거나(포커스) 내려가 있으면 복원하고,
  // 없으면 새로 연다. 다른 창은 절대 건드리지 않는다 — 이게 "다른 아이콘을 눌러도 기존 창이 그대로 남아 있는" 부분.
  function hdOpenOrFocusWindow(page) {
    if (CURRENT_ACCOUNT_IS_MASTER || !hdAppInfo(page)) return;
    let frame = document.getElementById("app-win-" + page);
    // 닫히는 애니메이션이 아직 안 끝나 DOM에 잠깐 남아 있는 창은 "열려 있는 것"으로 치지 않고 바로
    // 지운 뒤 새로 만든다 — 안 그러면 닫자마자 같은 아이콘을 다시 눌렀을 때 사라지는 중이던 그 창이
    // 도로 앞으로 나오는 것처럼 보인다.
    if (frame && frame.classList.contains("aw-closing")) {
      frame.remove();
      frame = null;
    }
    if (!frame) {
      frame = hdCreateWindowFrame(page);
      if (!frame) return;
      hdWin.state[page] = { minimized: false, maximized: false, snap: null, justOpened: true };
    } else if (hdWin.state[page] && hdWin.state[page].minimized) {
      // 접혀 있던 창을 독에서 다시 눌러 펼치는 경우: justOpened를 켜지 않는다 — 그래야
      // (1) 새로 여는 창의 팝 애니메이션 대신 위 transform이 원래대로 되돌아가는 "펼침" 모션만
      // 보이고, (2) renderHomeDesktopWindows()가 스크롤을 맨 위로 되돌리지 않아 접기 전
      // 보고 있던 위치 그대로 펼쳐진다.
      hdWin.state[page].minimized = false;
    }
    hdBringToFront(page);
  }

  // 폴더 이름을 바꿨을 때, 이미 열려 있는 그 폴더 창의 제목줄도 새 이름으로 바꾼다.
  function hdRefreshWindowTitle(page) {
    const frame = document.getElementById("app-win-" + page);
    const app = hdAppInfo(page);
    const tt = frame && frame.querySelector(".aw-tt");
    if (tt && app) tt.innerHTML = homeDesktopIconHtml(app, true) + esc(app[1]);
  }

  // 창 하나를 닫는다(빨강 버튼). 그 페이지의 펼침 상태(목록 펼침 등)는 이때 초기화해서, 나중에 다시 열면
  // 항상 접힌 채로 깔끔하게 보이게 한다 — 예전엔 "다른 페이지로 바뀔 때" 초기화했지만, 이제 창이 배경에
  // 계속 떠 있을 수 있으므로 "닫힐 때"로 옮겼다(그래야 보이는 채로 갑자기 접히는 일이 없다).
  function hdCloseWindow(page) {
    hdHideSnapAssist();
    const frame = document.getElementById("app-win-" + page);
    if (frame) {
      // 바로 지우지 않고 살짝 작아지며 페이드아웃하는 동안(css의 .aw-closing, 0.23s) 기다렸다가 지운다.
      frame.classList.add("aw-closing");
      setTimeout(() => frame.remove(), 230);
    }
    delete hdWin.state[page];
    const idx = hdWin.order.indexOf(page);
    if (idx !== -1) hdWin.order.splice(idx, 1);
    if (typeof _resetExpandedStateForPage === "function") _resetExpandedStateForPage(page);
    hdSaveOpenWindowsState(); // 닫은 창은 저장된 목록에서도 바로 빠져야, 다음에 열 때 되살아나지 않는다.
    state.page = hdWin.order.length ? hdWin.order[hdWin.order.length - 1] : "home";
    renderApp();
  }

  // 열려 있는 창을 전부 닫는다 — 마스터 계정으로 전환되거나(계정 관리 화면엔 창이 없음) setPage("home")이
  // 호출되는 드문 안전망 경로에서만 쓴다.
  function hdCloseAllWindows() {
    hdHideSnapAssist(true);
    hdWin.order.slice().forEach((page) => {
      const frame = document.getElementById("app-win-" + page);
      if (frame) frame.remove();
      if (typeof _resetExpandedStateForPage === "function") _resetExpandedStateForPage(page);
    });
    hdWin.order = [];
    hdWin.state = {};
    document.body.classList.remove("hd-win-open"); // 창이 하나도 없으니 바탕화면 위젯 블러도 해제
    hdSaveOpenWindowsState();
  }

  // renderApp()이 홈 위젯을 그린 뒤 불린다: 열려 있는 모든 창 각각에 그 페이지를 새로 그려서, 여러 창이
  // 동시에 열려 있어도(다른 기기 동기화 등으로) 전부 최신 내용을 보여주게 한다. 실제로 화면에 없던 창을
  // 새로 열 때는 appWin 상태가 이미 09a-home-desktop.js 쪽에서 만들어져 있다.
  function renderHomeDesktopWindows() {
    if (CURRENT_ACCOUNT_IS_MASTER) return;
    hdWin.order.forEach((page) => {
      const frame = document.getElementById("app-win-" + page);
      const fn = hdPageRenderer(page);
      if (!frame || !fn) return;
      const inner = frame.querySelector(".page-inner");
      if (!inner) return;
      inner.classList.toggle("wide", page === "schedule" || page === "calendar");
      fn(inner);
      const st = hdWin.state[page];
      if (st && st.justOpened) inner.scrollTop = 0;
    });
    syncAppWindows();
  }

  // 창 열림/내림/최대화 상태와 독·바탕화면 아이콘의 "실행 중"/"포커스" 표시를 현재 상태에 맞춘다.
  function syncAppWindows() {
    // 화면에 실제로 떠 있는(내려가지 않은) 창이 하나라도 있으면 body.hd-win-open — 뒤 바탕화면 위젯을 옅게 블러 처리
    // (css/01c-app-window.css). 전부 닫히거나 내려가면 클래스가 빠져 위젯이 원래대로 돌아온다.
    document.body.classList.toggle("hd-win-open", hdWin.order.some((p) => hdWin.state[p] && !hdWin.state[p].minimized));
    document.querySelectorAll("[data-hd-page]").forEach((el) => {
      const page = el.getAttribute("data-hd-page");
      const st = hdWin.state[page];
      const focused = !!st && !st.minimized && page === state.page;
      el.classList.toggle("on", focused && el.classList.contains("hd-di"));
      el.classList.toggle("run", !!st && el.classList.contains("hd-dk"));
    });
    if (typeof syncDesktopFolderStates === "function") syncDesktopFolderStates(); // 열려 있는 폴더 아이콘 강조
    hdWin.order.forEach((page) => {
      const st = hdWin.state[page];
      const frame = document.getElementById("app-win-" + page);
      if (!frame || !st) return;
      frame.classList.toggle("win-min", !!st.minimized);
      frame.classList.toggle("win-max", !!st.maximized);
      frame.classList.toggle("win-snap-l", st.snap === "l" && !st.maximized);
      frame.classList.toggle("win-snap-r", st.snap === "r" && !st.maximized);
      if (st.justOpened) {
        st.justOpened = false;
        frame.classList.remove("aw-pop");
        void frame.offsetWidth;
        frame.classList.add("aw-pop");
        frame.addEventListener("animationend", () => frame.classList.remove("aw-pop"), { once: true });
      }
    });
  }

  // 페이지 창이 열려 있는 동안 뒤 바탕화면 위젯만 다시 그린다 (다른 기기에서 바뀐 내용 반영용 — 창 안 화면은 건드리지 않음)
  function refreshHomeWidgetsBehindWindow() {
    if (CURRENT_ACCOUNT_IS_MASTER || state.page === "master") return;
    const homeRoot = document.getElementById("home-root");
    if (homeRoot && typeof renderHomePage === "function") renderHomePage(homeRoot);
    if (typeof renderDesktopFolders === "function") renderDesktopFolders(); // 다른 기기에서 만든/옮긴/지운 폴더도 바로 반영
  }

  // ===================== 반쪽 붙이기(스냅) + 반대편 페이지 고르기(스냅 어시스트) =====================
  // 창 제목줄을 화면 왼쪽/오른쪽 끝까지 끌면 그쪽 절반 자리에 미리보기(#hd-snap-preview)가 뜨고, 놓으면 창이 그 절반에
  // 딱 붙는다(win-snap-l / win-snap-r — 위치·크기는 css/01c-app-window.css가 정하므로 화면 크기가 바뀌어도 알아서 맞춰진다).
  // 붙인 직후 반대편 절반에는 "어떤 페이지를 띄울까요?" 패널(#hd-snap-assist)이 떠서, 앱 아이콘을 누르면 그 페이지가
  // 반대편에 붙어 열린다(이미 열려 있거나 내려가 있던 창이면 그 창이 옮겨 붙는다). 패널은 Esc·바깥 클릭·"건너뛰기"로 닫힌다.
  // 좁은 화면(700px 이하)은 창이 항상 전체 폭이라 이 기능을 쓰지 않는다.
  function hdSnapSideAt(x) {
    if (window.innerWidth <= 700) return null;
    if (x <= 16) return "l";
    if (x >= window.innerWidth - 16) return "r";
    return null;
  }

  // side: "l" | "r" | null(미리보기 숨김)
  function hdShowSnapPreview(side) {
    let el = document.getElementById("hd-snap-preview");
    if (!side) { if (el) el.classList.remove("on"); return; }
    if (!el) {
      el = document.createElement("div");
      el.id = "hd-snap-preview";
      document.body.appendChild(el);
    }
    if (el.getAttribute("data-side") !== side) {
      // 숨겨져 있던 미리보기가 반대편에서 미끄러져 오지 않도록, 안 보이는 상태에선 자리를 바로 옮기고
      // 이미 보이는 중(왼쪽 → 오른쪽으로 끌고 간 경우)에만 트랜지션으로 부드럽게 넘어가게 한다.
      const visible = el.classList.contains("on");
      if (!visible) el.style.transition = "none";
      el.setAttribute("data-side", side);
      if (!visible) { void el.offsetWidth; el.style.transition = ""; }
    }
    el.classList.add("on");
  }

  // 창을 해당 쪽 절반에 붙이고(animate면 부드럽게), 반대편에 페이지 고르기 패널을 띄운다.
  // restore = { left, top }: 나중에 스냅을 풀 때 돌아갈 위치(인라인 값). 스냅 클래스가 !important로 위치를 덮고 있어서, 붙는 모션에는
  // 영향 없이(모션은 끌던 자리에서 출발) 인라인 값만 미리 원래 자리로 되돌려 둘 수 있다.
  function hdSnapWindow(page, side, animate, restore) {
    const st = hdWin.state[page];
    const frame = document.getElementById("app-win-" + page);
    if (!st || !frame || window.innerWidth <= 700) return;
    if (animate) hdAnimateWindowResize(frame, "snap");
    st.snap = side;
    st.maximized = false;
    syncAppWindows();
    if (restore) { frame.style.left = restore.left; frame.style.top = restore.top; }
    hdSaveOpenWindowsState();
    hdShowSnapAssist(page, side);
  }

  function hdHideSnapAssist(immediate) {
    const el = hdSnap.assistEl;
    if (!el) return;
    hdSnap.assistEl = null;
    document.removeEventListener("pointerdown", hdSnap.onDown, true);
    document.removeEventListener("keydown", hdSnap.onKey, true);
    if (immediate) { el.remove(); return; }
    el.classList.add("out");
    setTimeout(() => el.remove(), 320);
  }

  // page 창을 side 쪽에 붙인 뒤, 반대편 절반 자리에 "여기에 띄울 페이지" 고르기 패널을 띄운다.
  function hdShowSnapAssist(page, side) {
    hdHideSnapAssist(true);
    if (window.innerWidth <= 700) return;
    const other = side === "l" ? "r" : "l";
    // 반대편에 이미 붙어서 떠 있는 창이 있으면 그 자리는 이미 찼으므로 패널을 띄우지 않는다.
    if (hdWin.order.some((p) => p !== page && hdWin.state[p] && !hdWin.state[p].minimized && hdWin.state[p].snap === other)) return;
    const items = HOME_DESKTOP_APPS.filter((a) => a[0] !== page);
    if (!items.length) return;
    const el = document.createElement("div");
    el.id = "hd-snap-assist";
    el.setAttribute("data-side", other);
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", "반대편에 띄울 페이지 고르기");
    el.innerHTML = `
      <div class="hd-sa-head">
        <div class="hd-sa-tt"><b>${other === "r" ? "오른쪽" : "왼쪽"}에 함께 띄울 페이지</b><small>페이지를 누르면 이 자리에 열려요</small></div>
        <button type="button" class="hd-sa-skip" data-sa-skip>건너뛰기</button>
      </div>
      <div class="hd-sa-grid">
        ${items.map((a, i) => `<button type="button" class="hd-sa-item" data-sa-page="${a[0]}" style="--i:${i}">${homeDesktopIconHtml(a)}<span class="hd-sa-name">${esc(a[1])}</span>${hdWin.state[a[0]] ? '<i class="hd-sa-run">열려 있음</i>' : ""}</button>`).join("")}
      </div>
    `;
    el.addEventListener("click", (e) => {
      if (e.target.closest("[data-sa-skip]")) { hdHideSnapAssist(); return; }
      const b = e.target.closest("[data-sa-page]");
      if (b) hdSnapPick(b.getAttribute("data-sa-page"), other);
    });
    hdSnap.onDown = (e) => { if (hdSnap.assistEl && !hdSnap.assistEl.contains(e.target)) hdHideSnapAssist(); };
    hdSnap.onKey = (e) => { if (e.key === "Escape") hdHideSnapAssist(); };
    document.addEventListener("pointerdown", hdSnap.onDown, true);
    document.addEventListener("keydown", hdSnap.onKey, true);
    document.body.appendChild(el);
    hdSnap.assistEl = el;
  }

  // 패널에서 페이지를 골랐을 때: 그 페이지 창을 열거나(이미 열려 있으면 앞으로/복원) side 쪽 절반에 붙인다.
  function hdSnapPick(page, side) {
    hdHideSnapAssist();
    const existed = !!hdWin.state[page];
    setPage(page); // 다른 진입점(아이콘·독)과 똑같이 setPage를 타므로 페이지별 초기화(당월 표시 등)도 같다
    const st = hdWin.state[page];
    const frame = document.getElementById("app-win-" + page);
    if (!st || !frame) return;
    if (existed) hdAnimateWindowResize(frame, "snap"); // 새로 뜨는 창은 열림 모션이 이미 있으므로 이동 트랜지션은 기존 창에만
    st.snap = side;
    st.maximized = false;
    st.minimized = false;
    syncAppWindows();
    hdSaveOpenWindowsState();
  }

  // 하단 독 아이콘을 눌렀을 때: 그 페이지 창이 지금 화면에 펼쳐져 있고 맨 앞(포커스)이면 접는다(노랑 버튼과 같은 모션).
  // 그 밖에는 기존 그대로 setPage() — 안 열려 있으면 열고, 내려가 있으면 복원하고, 다른 창에 가려져 있으면 앞으로 가져온다
  // (가려진 창까지 무조건 접어버리면 독으로는 그 창을 앞으로 꺼낼 방법이 없어지므로, 윈도우 작업표시줄과 같은 규칙).
  // 바탕화면 아이콘(#home-icons)은 이 규칙을 타지 않고 예전처럼 항상 열기/포커스만 한다.
  function hdDockClick(page) {
    const st = hdWin.state[page];
    if (st && !st.minimized) {
      let frontVisible = null;
      for (let i = hdWin.order.length - 1; i >= 0; i--) {
        const p = hdWin.order[i], s = hdWin.state[p];
        if (s && !s.minimized) { frontVisible = p; break; }
      }
      if (frontVisible === page) { hdMinimizeWindow(page); return; }
    }
    setPage(page);
  }

  function renderHomeDesktop() {
    const on = !CURRENT_ACCOUNT_IS_MASTER;
    document.body.classList.toggle("home-desktop", on);
    if (!on) { hdCloseAllWindows(); return; }
    const icons = document.getElementById("home-icons");
    const dock = document.getElementById("home-dock");
    // 독립 실행 아이콘으로는 품질 관리를 사용하지 않는다. 이미 렌더된 이전 아이콘도 즉시 제거한다.
    [icons, dock].forEach((container) => {
      if (!container) return;
      container.querySelectorAll('[data-hd-page="qa"]').forEach((el) => el.remove());
    });
    // 아이콘/독은 한 번만 그려둔다 — renderApp이 다시 불려도 hover 확대 상태가 끊기지 않게.
    // 누르면 setPage()를 통해 그 페이지의 창이 열리거나(이미 열려 있으면 앞으로/복원) — 다른 창은 그대로 둔다.
    if (icons && !icons.firstChild) {
      icons.innerHTML = HOME_DESKTOP_LAUNCH_APPS.map((a) => `<button type="button" class="hd-di" data-hd-page="${a[0]}">${homeDesktopIconHtml(a)}${a[1]}</button>`).join("");
      icons.onclick = (e) => { const b = e.target.closest("[data-hd-page]"); if (b) setPage(b.getAttribute("data-hd-page")); };
    }
    if (dock && !dock.firstChild) {
      dock.innerHTML = HOME_DESKTOP_LAUNCH_APPS.map((a) => `<button type="button" class="hd-dk" data-hd-page="${a[0]}" data-n="${a[1]}" aria-label="${a[1]}">${homeDesktopIconHtml(a)}</button>`).join("");
      dock.onclick = (e) => { const b = e.target.closest("[data-hd-page]"); if (b) hdDockClick(b.getAttribute("data-hd-page")); };
    }
    if (typeof renderDesktopFolders === "function") renderDesktopFolders(); // 바탕화면에 직접 만든 폴더 아이콘 (js/09b-desktop-folders.js)
    syncAppWindows();
  }

  // 홈 화면에선 사이드바(및 그 안의 "마스터로 복귀" 버튼)가 숨겨지므로, 마스터 계정이 다른 계정으로 들어와 있는
  // 동안엔 목업(#mo)처럼 상단 상태표시줄에 "마스터로 복귀" 버튼을 대신 보여준다.
  const statusBarMasterReturnBtn = document.getElementById("status-bar-master-return-btn");
  if (statusBarMasterReturnBtn && MASTER_ORIGIN_ACCOUNT) {
    statusBarMasterReturnBtn.hidden = false;
    statusBarMasterReturnBtn.onclick = (e) => { e.stopPropagation(); masterReturnToOrigin(); };
  }
