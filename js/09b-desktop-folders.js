  // ==================== 바탕화면 폴더: 빈 바탕화면 우클릭 → "새 폴더", 누르면 폴더 창 ====================
  // 바탕화면(위젯·아이콘·창이 없는 빈 자리)에서 마우스 오른쪽 버튼을 누르면 "새 폴더" 메뉴가 뜨고, 누른 자리에
  // 폴더 아이콘이 생긴다(생기자마자 이름을 바로 고칠 수 있는 입력칸이 뜬다 — Enter 확정 / Esc 취소).
  //   - 폴더 아이콘을 누르면 그 폴더 창이 뜬다. 창은 기존 페이지 창(js/09a-home-desktop.js)과 똑같은 창 시스템을 탄다
  //     (제목줄 이동·크기 조절·내리기·최대화·좌우 스냅). 폴더 창의 page 값은 "folder:<폴더 id>" 이고,
  //     09a의 hdAppInfo()/hdPageRenderer()가 이 파일의 desktopFolderAppInfo()/renderDesktopFolderWindow()로 이어준다.
  //   - 폴더 아이콘은 끌어서 자리를 옮길 수 있고(놓은 자리가 저장됨), 우클릭하면 열기·이름 바꾸기·삭제 메뉴가 뜬다.
  //   - 폴더 목록(이름·위치)은 계정별 localStorage 키 하나(acct:<id>:desktop-folders:data)에 저장돼서
  //     다른 localStorage 값들과 똑같이 자동으로 클라우드(kv_store)에 동기화된다(js/01b-cloud-sync-core.js의 isCloudSynced).
  //     열려 있는 창/위치 같은 "이 탭의 화면 상태"는 기존처럼 sessionStorage(09a)에만 남는다.
  //   - 폴더 창은 macOS Finder 창처럼 아이콘 보기(파일마다 문서 아이콘/이미지 썸네일)로 보여준다. 내 컴퓨터의 파일을
  //     폴더 창으로(또는 바탕화면의 폴더 아이콘 위로) 끌어다 놓으면 업로드되고, 파일 아이콘이 생긴다.
  //     파일 원본은 메모 첨부와 같은 Supabase Storage 버킷("note-attachments")의 `<계정id>/desktop/<폴더id>/…` 경로에 올리고
  //     (그래서 별도 SQL 실행이 필요 없다), 폴더 데이터에는 파일 이름/크기/저장 경로만 남겨 함께 동기화한다.
  //     크기 제한·차단 확장자·이름 정리 함수는 js/03-notes.js의 것을 그대로 쓴다.
  const DESKTOP_FOLDERS_KEY = acctKey("desktop-folders:data");
  const DESKTOP_FOLDER_PREFIX = "folder:";
  const DESKTOP_FOLDER_NAME_MAX = 40;
  // macOS(Big Sur 이후) 폴더 아이콘: 뒤판(탭 달린 진한 파랑) + 앞판(밝은 파랑) + 앞판 윗선 하이라이트.
  // 그라데이션(#dfg-back/#dfg-front)은 body.html 맨 위의 숨김 svg에 한 번만 정의해두고 여기서 참조한다.
  const DESKTOP_FOLDER_SVG = `<svg class="hd-fld-svg" viewBox="0 0 96 78" aria-hidden="true"><path fill="url(#dfg-back)" d="M0 10.5C0 4.7 4.7 0 10.5 0h22.6c2.5 0 4.9.9 6.8 2.6L45 7.5h40.5C91.3 7.5 96 12.2 96 18v49.5C96 73.3 91.3 78 85.5 78h-75C4.7 78 0 73.3 0 67.5z"/><path fill="url(#dfg-front)" d="M0 24.5C0 18.7 4.7 14 10.5 14h75C91.3 14 96 18.7 96 24.5v43C96 73.3 91.3 78 85.5 78h-75C4.7 78 0 73.3 0 67.5z"/><path fill="none" stroke="rgba(255,255,255,.7)" stroke-width="1" d="M1 25C1 19.5 5.5 15 11 15h74c5.5 0 10 4.5 10 10"/><path fill="none" stroke="rgba(0,50,130,.22)" stroke-width="1" d="M.5 26v41.5C.5 73 5 77.5 10.5 77.5h75c5.5 0 10-4.5 10-10V26"/></svg>`;

  function defaultDesktopFoldersData() { return { folders: {} }; }
  function loadDesktopFoldersData() {
    try {
      const raw = localStorage.getItem(DESKTOP_FOLDERS_KEY);
      if (!raw) return defaultDesktopFoldersData();
      const parsed = JSON.parse(raw);
      const out = defaultDesktopFoldersData();
      if (parsed && parsed.folders && typeof parsed.folders === "object") out.folders = parsed.folders;
      Object.values(out.folders).forEach((f) => { if (f && !Array.isArray(f.files)) f.files = []; });
      return out;
    } catch (e) { return defaultDesktopFoldersData(); }
  }
  const desktopFoldersData = loadDesktopFoldersData();
  function saveDesktopFoldersData() {
    try { localStorage.setItem(DESKTOP_FOLDERS_KEY, JSON.stringify(desktopFoldersData)); } catch (e) { /* 저장 실패는 화면 동작에 영향 없이 무시 */ }
  }

  // ---- 순수 계산 함수들 (tests/desktop-folders.test.js에서 검사) ----
  // "새 폴더", "새 폴더 (2)", "새 폴더 (3)" … 이미 있는 이름과 겹치지 않는 이름을 돌려준다.
  function desktopFolderUniqueName(baseName, existingNames) {
    const used = new Set((existingNames || []).map((n) => String(n)));
    if (!used.has(baseName)) return baseName;
    let i = 2;
    while (used.has(`${baseName} (${i})`)) i++;
    return `${baseName} (${i})`;
  }
  // 아이콘(가로 86px)이 화면 밖·상단 상태표시줄 밑으로 삐져나가지 않게 좌표를 화면 안으로 눌러준다.
  // 저장된 좌표는 그대로 두고 그릴 때만 보정하므로, 창을 다시 키우면 원래 자리로 돌아온다.
  function desktopFolderClampPos(x, y, vw, vh) {
    const W = vw == null ? window.innerWidth : vw;
    const H = vh == null ? window.innerHeight : vh;
    const nx = Math.max(0, Math.min(W - 86, Number(x) || 0));
    const ny = Math.max(42, Math.min(H - 110, Number(y) || 0));
    return { x: Math.round(nx), y: Math.round(ny) };
  }

  const dfUi = { renamingId: null, dragging: false, suppressClickUntil: 0, menuEl: null, menuCleanup: null };
  // 폴더 창 안 화면 상태(저장하지 않는 화면 상태): 선택된 파일, 업로드 중인 파일, 이미지 썸네일 주소 캐시.
  const dfState = { selected: {}, uploading: {}, lastClicked: {}, thumbs: new Map() };
  function dfPage(id) { return DESKTOP_FOLDER_PREFIX + id; }
  function dfLayer() { return document.getElementById("hd-folders"); }

  // 09a의 hdAppInfo()가 부른다: "folder:<id>" → [page, 이름, 그라데이션, 아이콘 path] (창 제목줄 아이콘용).
  function desktopFolderAppInfo(page) {
    if (typeof page !== "string" || page.indexOf(DESKTOP_FOLDER_PREFIX) !== 0) return null;
    const f = desktopFoldersData.folders[page.slice(DESKTOP_FOLDER_PREFIX.length)];
    if (!f) return null;
    return [page, f.name, "#7cc4ff,#2f7cf6", "M3 7.5A1.5 1.5 0 014.5 6h4.6l2 2.2h8.4A1.5 1.5 0 0121 9.7v8.8a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 18.5z"];
  }

  // 바탕화면 폴더 아이콘들을 다시 그린다(renderApp → renderNav → renderHomeDesktop에서 매번 불림).
  // 이름을 고치는 중이거나 끌고 있는 중에는 그 요소가 사라지지 않게 건너뛴다.
  function renderDesktopFolders() {
    const layer = dfLayer();
    if (!layer || CURRENT_ACCOUNT_IS_MASTER) return;
    if (dfUi.renamingId || dfUi.dragging) return;
    const list = Object.values(desktopFoldersData.folders).sort((a, b) => String(a.createdAt || "").localeCompare(String(b.createdAt || "")));
    layer.innerHTML = list.map((f) => {
      const p = desktopFolderClampPos(f.x, f.y);
      return `<div class="hd-fld" role="button" tabindex="0" data-fld-id="${esc(f.id)}" style="left:${p.x}px;top:${p.y}px" title="${esc(f.name)}">${DESKTOP_FOLDER_SVG}<span class="hd-fld-name">${esc(f.name)}</span></div>`;
    }).join("");
    syncDesktopFolderStates();
  }

  // 창이 펼쳐져 있는 폴더의 아이콘을 강조한다(09a의 syncAppWindows가 부름).
  function syncDesktopFolderStates() {
    const layer = dfLayer();
    if (!layer) return;
    layer.querySelectorAll(".hd-fld").forEach((el) => {
      const st = hdWin.state[dfPage(el.getAttribute("data-fld-id"))];
      el.classList.toggle("on", !!st && !st.minimized);
    });
  }

  // ---- 만들기 / 이름 바꾸기 / 삭제 ----
  function createDesktopFolder(clientX, clientY) {
    const id = genId();
    const names = Object.values(desktopFoldersData.folders).map((f) => f.name);
    const pos = desktopFolderClampPos(clientX - 43, clientY - 30);
    desktopFoldersData.folders[id] = {
      id, name: desktopFolderUniqueName("새 폴더", names), x: pos.x, y: pos.y, createdAt: new Date().toISOString(), files: [],
    };
    saveDesktopFoldersData();
    renderDesktopFolders();
    startDesktopFolderRename(id);
  }

  // 아이콘의 이름 자리를 입력칸으로 바꾼다. Enter/바깥 클릭 = 확정, Esc = 취소(빈 값도 취소로 취급해 이름을 그대로 둔다).
  function startDesktopFolderRename(id) {
    const layer = dfLayer();
    const f = desktopFoldersData.folders[id];
    const el = layer && layer.querySelector(`.hd-fld[data-fld-id="${id}"]`);
    if (!f || !el || dfUi.renamingId) return;
    dfUi.renamingId = id;
    el.classList.add("renaming");
    const nameEl = el.querySelector(".hd-fld-name");
    nameEl.innerHTML = `<input type="text" class="hd-fld-input" maxlength="${DESKTOP_FOLDER_NAME_MAX}" spellcheck="false" aria-label="폴더 이름" value="${esc(f.name)}">`;
    const input = nameEl.firstChild;
    input.focus();
    input.select();
    let done = false;
    const finish = (commit) => {
      if (done) return;
      done = true;
      dfUi.renamingId = null;
      const v = input.value.trim().slice(0, DESKTOP_FOLDER_NAME_MAX);
      if (commit && v && v !== f.name) {
        f.name = v;
        saveDesktopFoldersData();
        hdRefreshWindowTitle(dfPage(id)); // 이미 열려 있는 폴더 창의 제목줄도 새 이름으로
      }
      renderDesktopFolders();
    };
    input.addEventListener("keydown", (e) => {
      e.stopPropagation(); // 입력 중 키가 다른 단축키(되돌리기 등)로 새지 않게
      if (e.key === "Enter") { e.preventDefault(); finish(true); }
      else if (e.key === "Escape") { e.preventDefault(); finish(false); }
    });
    input.addEventListener("blur", () => finish(true));
    input.addEventListener("pointerdown", (e) => e.stopPropagation());
    input.addEventListener("click", (e) => e.stopPropagation());
    input.addEventListener("dblclick", (e) => e.stopPropagation());
  }

  function deleteDesktopFolder(id) {
    const f = desktopFoldersData.folders[id];
    if (!f) return;
    const files = dfFolderFiles(f);
    const msg = files.length
      ? `"${f.name}" 폴더와 안의 파일 ${files.length}개를 삭제할까요?\n올려둔 파일도 함께 지워지고 되돌릴 수 없어요.`
      : `"${f.name}" 폴더를 삭제할까요?`;
    if (!window.confirm(msg)) return;
    // 빈 폴더만 되돌리기(Ctrl+Z) 대상이다 — 파일이 있는 폴더는 저장소의 원본까지 지우기 때문에 되돌릴 수 없다.
    if (!files.length) recordUndo("바탕화면 폴더 삭제", DESKTOP_FOLDERS_KEY, () => undoRestoreObjectInPlace(desktopFoldersData, loadDesktopFoldersData()));
    else dfRemoveStorageObjects(files.map((a) => a.path));
    delete desktopFoldersData.folders[id];
    delete dfState.selected[id];
    delete dfState.uploading[id];
    saveDesktopFoldersData();
    if (hdWin.state[dfPage(id)]) hdCloseWindow(dfPage(id)); // 열려 있던 폴더 창도 닫는다 (안에서 renderApp도 불림)
    else renderDesktopFolders();
  }

  // ---- 우클릭 메뉴 ----
  function dfCloseMenu() {
    if (dfUi.menuCleanup) { dfUi.menuCleanup(); dfUi.menuCleanup = null; }
    if (dfUi.menuEl) { dfUi.menuEl.remove(); dfUi.menuEl = null; }
  }
  // items: [{ label, run, danger? } | { sep: true }]
  function dfShowMenu(x, y, items) {
    dfCloseMenu();
    const el = document.createElement("div");
    el.className = "hd-ctx";
    el.setAttribute("role", "menu");
    el.innerHTML = items.map((it, i) => it.sep
      ? `<i class="hd-ctx-sep"></i>`
      : `<button type="button" role="menuitem" data-i="${i}"${it.danger ? ' class="danger"' : ""}>${esc(it.label)}</button>`).join("");
    document.body.appendChild(el);
    const r = el.getBoundingClientRect();
    el.style.left = Math.max(4, Math.min(x, window.innerWidth - r.width - 4)) + "px";
    el.style.top = Math.max(4, Math.min(y, window.innerHeight - r.height - 4)) + "px";
    el.addEventListener("click", (e) => {
      const b = e.target.closest("[data-i]");
      if (!b) return;
      const it = items[Number(b.getAttribute("data-i"))];
      dfCloseMenu();
      if (it && it.run) it.run();
    });
    const onDown = (e) => { if (!el.contains(e.target)) dfCloseMenu(); };
    const onKey = (e) => { if (e.key === "Escape") dfCloseMenu(); };
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("keydown", onKey, true);
    window.addEventListener("resize", dfCloseMenu);
    window.addEventListener("blur", dfCloseMenu);
    dfUi.menuCleanup = () => {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("keydown", onKey, true);
      window.removeEventListener("resize", dfCloseMenu);
      window.removeEventListener("blur", dfCloseMenu);
    };
    dfUi.menuEl = el;
  }

  // "빈 바탕화면"인지: 위젯·아이콘·독·창·상태표시줄·팝업 위에서 우클릭한 게 아니라, 배경이 그대로 드러난 자리인지.
  // (#wg 위젯 컨테이너는 pointer-events:none이라 그 사이 빈 곳은 #layout/body가 이벤트를 받는다.)
  function desktopFolderIsBareDesktop(t) {
    if (!t || t.nodeType !== 1) return false;
    return t === document.body || t === document.documentElement
      || t.id === "layout" || t.id === "home-root" || t.id === "hd-windows" || t.id === "hd-folders";
  }

  document.addEventListener("contextmenu", (e) => {
    if (!document.body.classList.contains("home-desktop") || CURRENT_ACCOUNT_IS_MASTER) return;
    const item = e.target.closest && e.target.closest(".dfw-item");
    if (item) {
      e.preventDefault();
      if (item.classList.contains("pending")) return;
      const root = item.closest(".dfw");
      const folderId = root.getAttribute("data-dfw-folder");
      const fid = item.getAttribute("data-fid");
      const sel = dfSelSet(folderId);
      if (!sel.has(fid)) { sel.clear(); sel.add(fid); dfApplySelection(root, folderId); }
      const ids = Array.from(sel);
      dfShowMenu(e.clientX, e.clientY, [
        { label: ids.length > 1 ? `다운로드 (${ids.length}개)` : "다운로드", run: () => downloadDesktopFiles(folderId, ids) },
        { sep: true },
        { label: ids.length > 1 ? `${ids.length}개 삭제` : "삭제", danger: true, run: () => deleteDesktopFiles(folderId, ids) },
      ]);
      return;
    }
    if (e.target.closest && e.target.closest(".dfw")) { e.preventDefault(); return; } // 폴더 창 빈 자리: 브라우저 기본 메뉴만 막는다
    const fld = e.target.closest && e.target.closest(".hd-fld");
    if (fld) {
      e.preventDefault();
      const id = fld.getAttribute("data-fld-id");
      dfShowMenu(e.clientX, e.clientY, [
        { label: "열기", run: () => setPage(dfPage(id)) },
        { label: "이름 바꾸기", run: () => startDesktopFolderRename(id) },
        { sep: true },
        { label: "삭제", danger: true, run: () => deleteDesktopFolder(id) },
      ]);
      return;
    }
    if (!desktopFolderIsBareDesktop(e.target)) return;
    e.preventDefault();
    const x = e.clientX, y = e.clientY;
    dfShowMenu(x, y, [{ label: "새 폴더", run: () => createDesktopFolder(x, y) }]);
  });

  // ---- 아이콘 누르기(열기) / 끌기(자리 옮기기) / 키보드 ----
  // 아이콘은 renderDesktopFolders()가 매번 새로 그리므로, 이벤트는 바뀌지 않는 컨테이너(#hd-folders)에 한 번만 붙인다.
  (function wireDesktopFolderLayer() {
    const layer = dfLayer();
    if (!layer) return;
    layer.addEventListener("pointerdown", (e) => {
      const el = e.target.closest(".hd-fld");
      if (!el || (e.button !== undefined && e.button !== 0) || dfUi.renamingId || e.target.closest(".hd-fld-input")) return;
      const id = el.getAttribute("data-fld-id");
      const f = desktopFoldersData.folders[id];
      if (!f) return;
      const startX = e.clientX, startY = e.clientY;
      const r = el.getBoundingClientRect();
      const offX = startX - r.left, offY = startY - r.top;
      let moved = false;
      const move = (v) => {
        if (!moved && Math.abs(v.clientX - startX) < 5 && Math.abs(v.clientY - startY) < 5) return;
        moved = true;
        dfUi.dragging = true;
        el.classList.add("dragging");
        const p = desktopFolderClampPos(v.clientX - offX, v.clientY - offY);
        el.style.left = p.x + "px";
        el.style.top = p.y + "px";
      };
      const up = () => {
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerup", up);
        document.removeEventListener("pointercancel", up);
        if (!moved) return;
        dfUi.dragging = false;
        dfUi.suppressClickUntil = Date.now() + 120; // 끌기를 끝낸 직후 따라오는 click이 "열기"로 처리되지 않게
        el.classList.remove("dragging");
        f.x = parseFloat(el.style.left) || 0;
        f.y = parseFloat(el.style.top) || 0;
        saveDesktopFoldersData();
      };
      document.addEventListener("pointermove", move);
      document.addEventListener("pointerup", up);
      document.addEventListener("pointercancel", up);
    });
    layer.addEventListener("click", (e) => {
      const el = e.target.closest(".hd-fld");
      if (!el || dfUi.renamingId || Date.now() < dfUi.suppressClickUntil) return;
      setPage(dfPage(el.getAttribute("data-fld-id")));
    });
    // 내 컴퓨터의 파일을 바탕화면 폴더 아이콘 위에 바로 놓아도 그 폴더로 올라간다.
    layer.addEventListener("dragover", (e) => {
      const el = e.target.closest(".hd-fld");
      if (!el || !dfHasFiles(e)) return;
      e.preventDefault();
      try { e.dataTransfer.dropEffect = "copy"; } catch (err) {}
      el.classList.add("dropping");
    });
    layer.addEventListener("dragleave", (e) => {
      const el = e.target.closest(".hd-fld");
      if (el && !el.contains(e.relatedTarget)) el.classList.remove("dropping");
    });
    layer.addEventListener("drop", (e) => {
      const el = e.target.closest(".hd-fld");
      if (!el || !dfHasFiles(e)) return;
      e.preventDefault();
      el.classList.remove("dropping");
      const got = dfCollectDropped(e.dataTransfer);
      uploadToDesktopFolder(el.getAttribute("data-fld-id"), got.files, got.dirs);
    });
    layer.addEventListener("keydown", (e) => {
      const el = e.target.closest(".hd-fld");
      if (!el || dfUi.renamingId || e.target.closest(".hd-fld-input")) return;
      const id = el.getAttribute("data-fld-id");
      if (e.key === "Enter") { e.preventDefault(); setPage(dfPage(id)); }
      else if (e.key === "F2") { e.preventDefault(); startDesktopFolderRename(id); }
    });
  })();


  // 어디에도 놓을 수 없는 자리에 파일을 놓으면 브라우저가 그 파일을 새 탭으로 열어버려 앱을 벗어나므로 막아둔다.
  // (이미 다른 곳 — 폴더 창, QA 업로드 창 등 — 이 처리한 이벤트(defaultPrevented)는 건드리지 않는다)
  window.addEventListener("dragover", (e) => {
    if (!document.body.classList.contains("home-desktop") || e.defaultPrevented || !dfHasFiles(e)) return;
    e.preventDefault();
    try { e.dataTransfer.dropEffect = "none"; } catch (err) {}
  });
  window.addEventListener("drop", (e) => {
    if (!document.body.classList.contains("home-desktop") || e.defaultPrevented || !dfHasFiles(e)) return;
    e.preventDefault();
  });

  // ==================== 폴더 안의 파일 (Supabase Storage) ====================
  function dfHasFiles(e) {
    return !!(e.dataTransfer && Array.from(e.dataTransfer.types || []).indexOf("Files") !== -1);
  }
  function dfFolderFiles(f) {
    if (!Array.isArray(f.files)) f.files = [];
    return f.files;
  }
  function dfSelSet(folderId) {
    if (!dfState.selected[folderId]) dfState.selected[folderId] = new Set();
    return dfState.selected[folderId];
  }
  function dfCloud() { return typeof cloud !== "undefined" ? cloud : null; }
  function dfStoragePath(folderId, att) {
    return `${CURRENT_ACCOUNT_ID}/desktop/${folderId}/${att.id}_${sanitizeAttachmentFileName(att.name)}`;
  }
  function dfRemoveStorageObjects(paths) {
    const c = dfCloud();
    const list = (paths || []).filter(Boolean);
    if (!c || !list.length) return Promise.resolve();
    return c.storage.from(NOTES_ATTACHMENTS_BUCKET).remove(list).catch(() => {});
  }
  function dfToast(msg) { if (typeof flashUndoToast === "function") flashUndoToast(msg); }

  // 폴더 창이 열려 있으면 그 창 안만 다시 그린다(renderApp은 열린 창 전체를 다시 그려 무거우므로 쓰지 않는다).
  function dfRefreshWindow(folderId) {
    const frame = document.getElementById("app-win-" + dfPage(folderId));
    const inner = frame && frame.querySelector(".page-inner");
    if (inner) renderDesktopFolderWindow(inner, folderId);
  }

  // drop 이벤트의 dataTransfer에서 "파일만" 뽑는다(폴더째 끌어온 건 올릴 수 없어 개수만 센다). drop 핸들러 안에서 동기로 불러야 한다.
  function dfCollectDropped(dt) {
    const files = [];
    let dirs = 0;
    const items = dt && dt.items ? Array.from(dt.items) : [];
    if (items.length && typeof items[0].webkitGetAsEntry === "function") {
      items.forEach((it) => {
        if (it.kind !== "file") return;
        const ent = it.webkitGetAsEntry();
        if (ent && ent.isDirectory) { dirs++; return; }
        const file = it.getAsFile();
        if (file) files.push(file);
      });
    } else if (dt && dt.files) {
      Array.prototype.push.apply(files, Array.from(dt.files));
    }
    return { files, dirs };
  }

  async function uploadToDesktopFolder(folderId, fileList, skippedDirs) {
    const folder = desktopFoldersData.folders[folderId];
    if (!folder) return;
    if (skippedDirs) alert(`폴더(디렉터리)는 올릴 수 없어요. 폴더 안의 파일을 직접 끌어다 놓거나, zip으로 압축해서 올려주세요.`);
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const c = dfCloud();
    if (!c) { alert("클라우드 연결이 안 되어 있어 파일을 업로드할 수 없어요."); return; }
    const problems = [];
    const jobs = [];
    const queue = dfState.uploading[folderId] || (dfState.uploading[folderId] = []);
    files.forEach((file) => {
      if (file.size > NOTES_ATTACHMENT_MAX_MB * 1024 * 1024) { problems.push(`"${file.name}"은(는) ${NOTES_ATTACHMENT_MAX_MB}MB를 초과해서 올릴 수 없어요.`); return; }
      const ext = getFileExtension(file.name);
      if (ext && NOTES_ATTACHMENT_BLOCKED_EXT.includes(ext)) { problems.push(`"${file.name}"(.${ext}) 형식은 보안상 올릴 수 없어요. 실행 파일류나 웹페이지로 열리는 형식은 막아뒀어요. 필요하면 zip으로 압축해서 올려주세요.`); return; }
      const tmp = { id: genId(), name: file.name, size: file.size };
      queue.push(tmp);
      jobs.push({ tmp, file });
    });
    if (jobs.length) dfRefreshWindow(folderId);
    let done = 0;
    for (const { tmp, file } of jobs) {
      const att = { id: genId(), name: file.name, size: file.size, type: file.type || "", uploadedAt: new Date().toISOString() };
      const path = dfStoragePath(folderId, att);
      try {
        const { error } = await c.storage.from(NOTES_ATTACHMENTS_BUCKET).upload(path, file, { upsert: false, contentType: "application/octet-stream" });
        if (error) throw error;
        const cur = desktopFoldersData.folders[folderId]; // 올리는 사이 폴더가 지워졌을 수 있다
        if (cur) {
          att.path = path;
          dfFolderFiles(cur).push(att);
          saveDesktopFoldersData();
          done++;
        } else {
          dfRemoveStorageObjects([path]);
        }
      } catch (e) {
        problems.push(`"${file.name}" 업로드에 실패했어요: ${(e && e.message) || e}\n(버킷 설정이 아직이라면 supabase/notes-attachments-storage-setup.sql을 먼저 실행해주세요.)`);
      } finally {
        const i = queue.indexOf(tmp);
        if (i !== -1) queue.splice(i, 1);
        dfRefreshWindow(folderId);
      }
    }
    if (done) dfToast(`"${folder.name}" 폴더에 파일 ${done}개를 올렸어요`);
    if (problems.length) alert(problems.join("\n\n"));
  }

  async function downloadDesktopFiles(folderId, ids) {
    const f = desktopFoldersData.folders[folderId];
    const c = dfCloud();
    if (!f) return;
    if (!c) { alert("클라우드 연결이 안 되어 있어 파일을 내려받을 수 없어요."); return; }
    for (let i = 0; i < ids.length; i++) {
      const att = dfFolderFiles(f).find((a) => a.id === ids[i]);
      if (!att || !att.path) continue;
      try {
        const { data, error } = await c.storage.from(NOTES_ATTACHMENTS_BUCKET).download(att.path);
        if (error) throw error;
        const url = URL.createObjectURL(data);
        const a = document.createElement("a");
        a.href = url;
        a.download = att.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 3000);
      } catch (e) {
        alert(`"${att.name}" 파일을 내려받지 못했어요: ${(e && e.message) || e}`);
        return;
      }
      if (i < ids.length - 1) await new Promise((r) => setTimeout(r, 350)); // 여러 개를 연달아 받을 때 브라우저가 막지 않도록 간격을 둔다
    }
  }

  async function deleteDesktopFiles(folderId, ids) {
    const f = desktopFoldersData.folders[folderId];
    if (!f) return;
    const targets = dfFolderFiles(f).filter((a) => ids.indexOf(a.id) !== -1);
    if (!targets.length) return;
    const msg = targets.length === 1 ? `"${targets[0].name}" 파일을 삭제할까요?` : `선택한 파일 ${targets.length}개를 삭제할까요?`;
    if (!window.confirm(msg + "\n삭제하면 되돌릴 수 없어요.")) return;
    await dfRemoveStorageObjects(targets.map((a) => a.path));
    const cur = desktopFoldersData.folders[folderId];
    if (!cur) return;
    cur.files = dfFolderFiles(cur).filter((a) => ids.indexOf(a.id) === -1);
    const sel = dfSelSet(folderId);
    ids.forEach((id) => sel.delete(id));
    saveDesktopFoldersData();
    dfRefreshWindow(folderId);
  }

  // ---- 파일 아이콘 (순수 함수: tests/desktop-folders.test.js) ----
  const DF_FILE_KINDS = [
    [["pdf"], "#e5484d"],
    [["doc", "docx", "hwp", "hwpx", "rtf", "odt", "pages"], "#2f6fe4"],
    [["xls", "xlsx", "csv", "ods", "numbers"], "#1f9d55"],
    [["ppt", "pptx", "key", "odp"], "#e8710a"],
    [["txt", "md", "log", "json"], "#7b8190"],
    [["zip", "7z", "rar", "tar", "gz", "alz", "egg"], "#8a5cf5"],
    [["mp3", "wav", "m4a", "flac", "aac", "ogg"], "#e0489a"],
    [["mp4", "mov", "avi", "mkv", "webm", "wmv"], "#0ea5b7"],
  ];
  const DF_IMAGE_EXT = ["png", "jpg", "jpeg", "gif", "webp", "bmp"];
  const DF_THUMB_MAX_BYTES = 10 * 1024 * 1024;
  // 확장자에 따라 문서 아이콘 아래 배지의 글자·색을 정한다. isImage면 썸네일을 시도한다.
  function desktopFileKind(name) {
    const m = /\.([a-z0-9]+)$/i.exec(String(name || "").trim());
    const ext = m ? m[1].toLowerCase() : "";
    const found = DF_FILE_KINDS.find((k) => k[0].indexOf(ext) !== -1);
    const isImage = DF_IMAGE_EXT.indexOf(ext) !== -1;
    return { ext, label: (ext || "file").slice(0, 4).toUpperCase(), color: found ? found[1] : (isImage ? "#16a34a" : "#8e94a3"), isImage };
  }
  // macOS 문서 아이콘: 접힌 모서리가 있는 흰 종이 + 아래쪽 확장자 배지.
  function desktopFileIconSvg(name) {
    const k = desktopFileKind(name);
    return `<svg class="dfw-doc" viewBox="0 0 56 72" aria-hidden="true"><path class="dfw-doc-page" d="M6 4a4 4 0 014-4h25l17 17v51a4 4 0 01-4 4H10a4 4 0 01-4-4z"/><path class="dfw-doc-fold" d="M35 0v13a4 4 0 004 4h13z"/><rect x="10" y="47" width="36" height="16" rx="4" fill="${k.color}"/><text x="28" y="58.4" text-anchor="middle" class="dfw-doc-ext">${esc(k.label)}</text></svg>`;
  }
  // 아래 상태줄 문구: "12개 항목 · 2개 선택됨 (1.4MB) · 1개 업로드 중…"
  function desktopFolderStatusText(total, selCount, selBytes, uploadingCount) {
    let t = `${total}개 항목`;
    if (selCount) t += ` · ${selCount}개 선택됨 (${formatAttachmentSize(selBytes)})`;
    if (uploadingCount) t += ` · ${uploadingCount}개 업로드 중…`;
    return t;
  }

  // 이미지는 저장소에서 잠깐 유효한 주소(signed URL)를 받아 썸네일로 보여준다(macOS가 이미지 파일을 미리보기로 보여주는 것처럼).
  // 받은 주소는 55분 동안 캐시해서 창을 다시 그릴 때 깜빡이지 않게 한다. 실패하면 문서 아이콘 그대로 둔다.
  function dfCachedThumb(path) {
    const hit = dfState.thumbs.get(path);
    return hit && hit.exp > Date.now() ? hit.url : "";
  }
  async function dfFillThumbs(inner, folderId) {
    const c = dfCloud();
    const f = desktopFoldersData.folders[folderId];
    if (!c || !f) return;
    const els = Array.from(inner.querySelectorAll('.dfw-item[data-thumb="1"]:not(.has-thumb)')).slice(0, 30);
    await Promise.all(els.map(async (el) => {
      const att = dfFolderFiles(f).find((a) => a.id === el.getAttribute("data-fid"));
      if (!att || !att.path) return;
      try {
        let url = dfCachedThumb(att.path);
        if (!url) {
          const { data, error } = await c.storage.from(NOTES_ATTACHMENTS_BUCKET).createSignedUrl(att.path, 3600);
          if (error || !data || !data.signedUrl) return;
          url = data.signedUrl;
          dfState.thumbs.set(att.path, { url, exp: Date.now() + 55 * 60 * 1000 });
        }
        if (!document.body.contains(el)) return;
        dfShowThumb(el, url, att.name);
      } catch (e) { /* 썸네일 실패는 문서 아이콘으로 대신한다 */ }
    }));
  }
  function dfShowThumb(el, url, name) {
    const ico = el.querySelector(".dfw-ico");
    if (!ico) return;
    ico.innerHTML = `<img class="dfw-thumb" alt="" draggable="false" src="${esc(url)}">`;
    el.classList.add("has-thumb");
    ico.firstChild.onerror = () => { ico.innerHTML = desktopFileIconSvg(name); el.classList.remove("has-thumb"); el.removeAttribute("data-thumb"); };
  }

  // ---- 폴더 창 안 화면 (09a의 hdPageRenderer가 부름): macOS Finder "아이콘 보기" ----
  // 창 HTML만 만드는 순수 함수(테스트용). files는 이미 정렬된 배열, pending은 업로드 중인 임시 항목들.
  function desktopFolderWindowHtml(f, folderId, files, pending, selected) {
    const sel = selected || new Set();
    const tiles = files.map((a) => {
      const k = desktopFileKind(a.name);
      const url = k.isImage && a.path && a.size <= DF_THUMB_MAX_BYTES ? dfCachedThumb(a.path) : "";
      const wantThumb = k.isImage && a.path && a.size <= DF_THUMB_MAX_BYTES;
      const ico = url ? `<img class="dfw-thumb" alt="" draggable="false" src="${esc(url)}">` : desktopFileIconSvg(a.name);
      return `<div class="dfw-item${sel.has(a.id) ? " sel" : ""}${url ? " has-thumb" : ""}" data-fid="${esc(a.id)}"${wantThumb ? ' data-thumb="1"' : ""} title="${esc(a.name)} · ${esc(formatAttachmentSize(a.size))}"><div class="dfw-ico">${ico}</div><div class="dfw-nm">${esc(a.name)}</div></div>`;
    }).concat((pending || []).map((p) => `<div class="dfw-item pending" data-fid="${esc(p.id)}" title="${esc(p.name)} 업로드 중"><div class="dfw-ico">${desktopFileIconSvg(p.name)}<i class="dfw-spin"></i></div><div class="dfw-nm">${esc(p.name)}</div></div>`));
    const selBytes = files.filter((a) => sel.has(a.id)).reduce((n, a) => n + (Number(a.size) || 0), 0);
    return `
      <div class="dfw" tabindex="0" data-dfw-folder="${esc(folderId)}">
        <div class="dfw-toolbar">
          <div class="dfw-tb-title">${DESKTOP_FOLDER_SVG}<b>${esc(f.name)}</b></div>
          <span class="dfw-tb-sp"></span>
          <button type="button" class="dfw-add" data-dfw-add>＋ 파일 추가</button>
          <input type="file" multiple hidden data-dfw-input>
        </div>
        <div class="dfw-body">
          ${tiles.length ? `<div class="dfw-grid">${tiles.join("")}</div>` : `<div class="dfw-empty">${DESKTOP_FOLDER_SVG}<b>이 폴더는 비어 있어요</b><small>내 컴퓨터의 파일을 이 창으로 끌어다 놓으면 올라가요</small></div>`}
          <div class="dfw-drop"><b>여기에 놓아서 업로드</b></div>
        </div>
        <div class="dfw-status">${esc(desktopFolderStatusText(files.length, sel.size, selBytes, (pending || []).length))}</div>
      </div>`;
  }

  // 선택 표시와 상태줄만 갱신한다(창 전체를 다시 그리지 않아 썸네일이 깜빡이지 않는다).
  function dfApplySelection(root, folderId) {
    const f = desktopFoldersData.folders[folderId];
    if (!f) return;
    const sel = dfSelSet(folderId);
    root.querySelectorAll(".dfw-item").forEach((el) => el.classList.toggle("sel", sel.has(el.getAttribute("data-fid"))));
    const files = dfFolderFiles(f);
    const bytes = files.filter((a) => sel.has(a.id)).reduce((n, a) => n + (Number(a.size) || 0), 0);
    const st = root.querySelector(".dfw-status");
    if (st) st.textContent = desktopFolderStatusText(files.length, sel.size, bytes, (dfState.uploading[folderId] || []).length);
  }

  function renderDesktopFolderWindow(inner, folderId) {
    const f = desktopFoldersData.folders[folderId];
    inner.classList.add("dfw-inner");
    if (!f) { inner.innerHTML = ""; return; }
    const oldBody = inner.querySelector && inner.querySelector(".dfw-body");
    const scrollTop = oldBody ? oldBody.scrollTop : 0;
    const files = dfFolderFiles(f).slice().sort((a, b) => String(a.name).localeCompare(String(b.name), "ko", { numeric: true }));
    const sel = dfSelSet(folderId);
    Array.from(sel).forEach((id) => { if (!files.some((a) => a.id === id)) sel.delete(id); }); // 다른 기기에서 지워진 파일은 선택에서 뺀다
    inner.innerHTML = desktopFolderWindowHtml(f, folderId, files, dfState.uploading[folderId] || [], sel);
    const root = inner.querySelector ? inner.querySelector(".dfw") : null;
    if (!root) return;
    const body = root.querySelector(".dfw-body");
    if (body) body.scrollTop = scrollTop;
    const input = root.querySelector("[data-dfw-input]");

    // 선택: 클릭 = 하나만, Ctrl/Cmd+클릭 = 추가/해제, Shift+클릭 = 범위, 빈 자리 클릭 = 선택 해제
    root.addEventListener("click", (e) => {
      if (e.target.closest("[data-dfw-add]")) { input.click(); return; }
      const it = e.target.closest(".dfw-item");
      const set = dfSelSet(folderId);
      const multi = e.ctrlKey || e.metaKey;
      if (!it || it.classList.contains("pending")) {
        if (!it && !multi) { set.clear(); dfApplySelection(root, folderId); }
        return;
      }
      const fid = it.getAttribute("data-fid");
      const all = Array.from(root.querySelectorAll(".dfw-item:not(.pending)")).map((el) => el.getAttribute("data-fid"));
      const last = dfState.lastClicked[folderId];
      if (e.shiftKey && last && all.indexOf(last) !== -1) {
        const a = all.indexOf(last), b = all.indexOf(fid);
        set.clear();
        all.slice(Math.min(a, b), Math.max(a, b) + 1).forEach((id) => set.add(id));
      } else if (multi) {
        if (set.has(fid)) set.delete(fid); else set.add(fid);
        dfState.lastClicked[folderId] = fid;
      } else {
        set.clear(); set.add(fid);
        dfState.lastClicked[folderId] = fid;
      }
      dfApplySelection(root, folderId);
      root.focus({ preventScroll: true });
    });
    // 두 번 누르면 내려받기(macOS에서 파일을 두 번 눌러 여는 것과 같은 자리)
    root.addEventListener("dblclick", (e) => {
      const it = e.target.closest(".dfw-item");
      if (!it || it.classList.contains("pending")) return;
      downloadDesktopFiles(folderId, [it.getAttribute("data-fid")]);
    });
    root.addEventListener("keydown", (e) => {
      const set = dfSelSet(folderId);
      if ((e.key === "a" || e.key === "A") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        root.querySelectorAll(".dfw-item:not(.pending)").forEach((el) => set.add(el.getAttribute("data-fid")));
        dfApplySelection(root, folderId);
      } else if ((e.key === "Delete" || e.key === "Backspace") && set.size) {
        e.preventDefault();
        deleteDesktopFiles(folderId, Array.from(set));
      } else if (e.key === "Enter" && set.size) {
        e.preventDefault();
        downloadDesktopFiles(folderId, Array.from(set));
      }
    });
    // "＋ 파일 추가" 버튼(파일 선택창)
    input.addEventListener("change", () => {
      const picked = Array.from(input.files || []);
      input.value = "";
      uploadToDesktopFolder(folderId, picked, 0);
    });
    // 내 컴퓨터에서 파일을 끌어다 놓기 — 끄는 동안 창에 파란 테두리와 안내가 뜬다.
    let depth = 0;
    root.addEventListener("dragenter", (e) => {
      if (!dfHasFiles(e)) return;
      e.preventDefault();
      depth++;
      root.classList.add("dragover");
    });
    root.addEventListener("dragover", (e) => {
      if (!dfHasFiles(e)) return;
      e.preventDefault();
      try { e.dataTransfer.dropEffect = "copy"; } catch (err) {}
    });
    root.addEventListener("dragleave", (e) => {
      if (!dfHasFiles(e)) return;
      depth = Math.max(0, depth - 1);
      if (!depth) root.classList.remove("dragover");
    });
    root.addEventListener("drop", (e) => {
      if (!dfHasFiles(e)) return;
      e.preventDefault();
      depth = 0;
      root.classList.remove("dragover");
      const got = dfCollectDropped(e.dataTransfer);
      uploadToDesktopFolder(folderId, got.files, got.dirs);
    });
    dfFillThumbs(inner, folderId);
  }
