  function defaultNotesData() {
    return { folders: [], notes: {}, pinnedOrder: [], folderOrder: { [UNFILED]: [] } };
  }
  function loadNotesData() {
    try {
      const raw = localStorage.getItem(NOTES_KEY);
      if (!raw) return defaultNotesData();
      const parsed = JSON.parse(raw);
      if (!parsed.folderOrder) parsed.folderOrder = {};
      if (!parsed.folderOrder[UNFILED]) parsed.folderOrder[UNFILED] = [];
      if (!parsed.pinnedOrder) parsed.pinnedOrder = [];
      if (!parsed.folders) parsed.folders = [];
      if (!parsed.notes) parsed.notes = {};
      const nowIso = new Date().toISOString();
      Object.values(parsed.notes).forEach((n) => {
        if (!n.attachments) n.attachments = [];
        // 옛 데이터(날짜 정보 없이 저장된 메모)를 새 목업의 "생성일/마지막 수정" 표시와
        // 맞추기 위한 최소 보정. 실제 생성/수정 시점을 알 수 없으므로 지금 시각으로 채운다.
        if (!n.createdAt) n.createdAt = nowIso;
        if (!n.updatedAt) n.updatedAt = n.createdAt;
      });
      return parsed;
    } catch (e) { return defaultNotesData(); }
  }
  const notesData = loadNotesData();

  /* ---- 메모 첨부파일 (Supabase Storage) ----
     메모 내용(text)은 지금까지처럼 localStorage → kv_store로 동기화되지만,
     첨부파일 원본은 크기가 클 수 있어 같은 방식(JSON 문자열)으로 넣기 적합하지
     않다. 그래서 파일 원본은 Supabase Storage의 "note-attachments" 버킷에 직접
     올리고, notesData(=메모 JSON)에는 파일 메타데이터(이름/크기/저장 경로)만
     남겨서 지금처럼 kv_store로 함께 동기화되게 한다.
     버킷/권한 설정은 supabase/notes-attachments-storage-setup.sql 1회 실행 필요. */
  const NOTES_ATTACHMENTS_BUCKET = "note-attachments";
  const NOTES_ATTACHMENT_MAX_MB = 20;
  // 팀 전체가 같은 저장 공간을 쓰는 구조라, 누군가(계정이 도용됐거나 실수로)
  // 실행 파일류를 올리면 다른 사람이 무심코 내려받아 실행할 위험이 있다.
  // 그런 확장자는 아예 업로드 단계에서 막는다(내용 검사가 아니라 확장자 기준의
  // 최소한의 방어선이며, 완전한 백신 검사를 대신하지는 않는다).
  const NOTES_ATTACHMENT_BLOCKED_EXT = [
    "exe", "msi", "bat", "cmd", "com", "scr", "pif", "js", "jse", "vbs", "vbe",
    "wsf", "wsh", "ps1", "psm1", "jar", "apk", "app", "dmg", "pkg", "sh",
    "command", "hta", "html", "htm", "svg",
  ];
  function getFileExtension(name) {
    const m = /\.([a-z0-9]+)$/i.exec(String(name || "").trim());
    return m ? m[1].toLowerCase() : "";
  }

  function formatAttachmentSize(bytes) {
    const n = Number(bytes) || 0;
    if (n >= 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)}MB`;
    if (n >= 1024) return `${Math.round(n / 1024)}KB`;
    return `${n}B`;
  }
  function sanitizeAttachmentFileName(name) {
    // Supabase Storage 키는 AWS S3 오브젝트 키 규칙(대략 영문/숫자/일부 안전 특수문자)만
    // 허용하며, 한글 등 비-ASCII 문자가 포함되면 "Invalid key" 오류로 업로드가 실패한다.
    // 화면에 보이는 파일명(att.name, 다운로드 시 사용)은 원본 그대로 두고, 이 함수는
    // Storage 저장 경로에만 쓰일 안전한 이름을 만든다.
    const raw = String(name || "file").trim();
    const dot = raw.lastIndexOf(".");
    const hasExt = dot > 0 && dot < raw.length - 1;
    const rawExt = hasExt ? raw.slice(dot + 1) : "";
    const rawBase = hasExt ? raw.slice(0, dot) : raw;
    const ext = rawExt.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10);
    let base = rawBase
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9!\-_.'()]/g, "") // 한글 등 비-ASCII 및 기타 특수문자 제거
      .replace(/_+/g, "_")
      .replace(/^[_.]+|[_.]+$/g, "")
      .slice(0, 100);
    if (!base) base = "file";
    return ext ? `${base}.${ext}` : base;
  }
  function attachmentStoragePath(noteId, att) {
    return `${CURRENT_ACCOUNT_ID}/${noteId}/${att.id}_${sanitizeAttachmentFileName(att.name)}`;
  }
  async function uploadNoteAttachments(noteId, fileList) {
    const note = notesData.notes[noteId];
    if (!note) return;
    if (!cloud) { alert("클라우드 연결이 안 되어 있어 파일을 업로드할 수 없어요."); return; }
    if (!note.attachments) note.attachments = [];
    const files = Array.from(fileList || []);
    if (!files.length) return;
    notesUi.uploadingNoteId = noteId;
    renderApp();
    for (const file of files) {
      if (file.size > NOTES_ATTACHMENT_MAX_MB * 1024 * 1024) {
        alert(`"${file.name}"은(는) ${NOTES_ATTACHMENT_MAX_MB}MB를 초과해서 업로드할 수 없어요.`);
        continue;
      }
      const ext = getFileExtension(file.name);
      if (ext && NOTES_ATTACHMENT_BLOCKED_EXT.includes(ext)) {
        alert(`"${file.name}"(.${ext}) 형식은 보안상 첨부할 수 없어요. 실행 파일류나 웹페이지로 열리는 형식은 막아뒀어요. 필요하면 zip으로 압축해서 올려주세요.`);
        continue;
      }
      const att = { id: genId(), name: file.name, size: file.size, type: file.type || "", uploadedAt: new Date().toISOString() };
      const path = attachmentStoragePath(noteId, att);
      try {
        const { error } = await cloud.storage.from(NOTES_ATTACHMENTS_BUCKET).upload(path, file, { upsert: false, contentType: "application/octet-stream" });
        if (error) throw error;
        att.path = path;
        note.attachments.push(att);
        note.updatedAt = notesNowIso();
        saveNotesData();
      } catch (e) {
        alert(`"${file.name}" 업로드에 실패했어요: ${(e && e.message) || e}\n\n버킷 설정이 아직 안 되어 있다면 supabase/notes-attachments-storage-setup.sql을 Supabase에서 먼저 실행해주세요.`);
      }
    }
    notesUi.uploadingNoteId = null;
    renderApp();
  }
  async function downloadNoteAttachment(noteId, attId) {
    const note = notesData.notes[noteId];
    const att = note && note.attachments && note.attachments.find((a) => a.id === attId);
    if (!att) return;
    if (!cloud) { alert("클라우드 연결이 안 되어 있어 파일을 내려받을 수 없어요."); return; }
    try {
      const { data, error } = await cloud.storage.from(NOTES_ATTACHMENTS_BUCKET).download(att.path);
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
      alert(`파일을 내려받지 못했어요: ${(e && e.message) || e}`);
    }
  }
  async function deleteNoteAttachment(noteId, attId) {
    const note = notesData.notes[noteId];
    if (!note || !note.attachments) return;
    const att = note.attachments.find((a) => a.id === attId);
    if (!att) return;
    if (!window.confirm(`"${att.name}" 파일을 삭제할까요?`)) return;
    if (cloud && att.path) {
      try { await cloud.storage.from(NOTES_ATTACHMENTS_BUCKET).remove([att.path]); } catch (e) {}
    }
    note.attachments = note.attachments.filter((a) => a.id !== attId);
    note.updatedAt = notesNowIso();
    saveNotesData();
    renderApp();
  }

  let notesStatusTimer = null;
  function flashNotesStatus(msg) {
    const el = document.getElementById("notes-status");
    if (!el) return;
    el.textContent = msg;
    clearTimeout(notesStatusTimer);
    notesStatusTimer = setTimeout(() => { el.textContent = ""; }, 1500);
  }
  function saveNotesData() {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(notesData));
      flashNotesStatus("저장됨");
    } catch (e) { flashNotesStatus("저장 실패"); }
  }

  /* ---- 메모 내용 입력 debounce ----
     예전엔 글자를 한 자 칠 때마다(oninput) saveNotesData()가 그대로 불려서
     localStorage.setItem → (js/01c-cloud-sync-runtime.js가 가로채서) 매번
     전체 메모 데이터를 JSON.stringify + Supabase 네트워크 전송까지 했다.
     저사양 PC에서 타이핑이 밀리는 가장 큰 원인이라 실제 저장(및 네트워크 전송)만
     debounce로 늦춘다. 화면에 보이는 값(note.title/content)은 각 update 함수에서
     이미 즉시 반영되므로, 그동안 다른 곳에서 메모 내용을 참조해도(목록 미리보기 등)
     최신 글자 그대로 보인다 — 늦춰지는 건 "저장" 그 자체뿐이다. */
  const NOTES_SAVE_DEBOUNCE_MS = 400;
  let _notesSaveTimer = null;
  function scheduleSaveNotesData() {
    flashNotesStatus("저장 중…");
    clearTimeout(_notesSaveTimer);
    _notesSaveTimer = setTimeout(() => {
      _notesSaveTimer = null;
      saveNotesData();
    }, NOTES_SAVE_DEBOUNCE_MS);
  }
  // 탭을 닫거나(beforeunload) 다른 탭/화면으로 넘어가기 전(visibilitychange)에는
  // 미뤄둔 저장을 그 자리에서 바로 끝낸다 — 그렇지 않으면 debounce 시간(400ms)
  // 안에 탭을 닫아버렸을 때 방금 친 글자가 저장되지 않고 사라질 수 있다.
  function flushNotesSaveIfPending() {
    if (_notesSaveTimer === null) return;
    clearTimeout(_notesSaveTimer);
    _notesSaveTimer = null;
    saveNotesData();
  }
  window.addEventListener("beforeunload", flushNotesSaveIfPending);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushNotesSaveIfPending();
  });

  /* ===================== 업무 정리 — macOS Notes 스타일 3단 구성 =====================
     사이드바(폴더 트리) · 목록(검색+메모 리스트) · 본문(선택된 메모 편집)으로 나눈
     레이아웃. 목업(업무_정리___macOS_스타일_목업.html)의 state{view, selectedId, search} /
     renderSidebar·renderList·renderDetail 구조를 실제 데이터(notesData)와
     첨부파일·되돌리기 기능에 그대로 연결한 버전. */
  const notesUi = {
    view: "all", // "all" | "pinned" | 폴더 id
    selectedId: null,
    search: "",
    uploadingNoteId: null,
  };

  function notesNowIso() { return new Date().toISOString(); }
  // 목업과 동일한 표기: 본문에서는 "YYYY-MM-DD HH:MM", 목록 한 줄 메타에는 날짜만.
  function fmtNoteDateTime(iso) { return iso ? String(iso).replace("T", " ").slice(0, 16) : ""; }
  function fmtNoteDateOnly(iso) { return iso ? String(iso).slice(0, 10) : ""; }

  function visibleNotesList() {
    let list = Object.values(notesData.notes);
    if (notesUi.view === "pinned") list = list.filter((n) => n.pinned);
    else if (notesUi.view !== "all") list = list.filter((n) => n.folderId === notesUi.view);
    const q = notesUi.search.trim().toLowerCase();
    if (q) list = list.filter((n) => `${n.title}${n.content}`.toLowerCase().includes(q));
    return list.slice().sort((a, b) =>
      (Number(b.pinned) - Number(a.pinned)) || String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""))
    );
  }

  // 현재 선택된 메모가 없거나(처음 진입) 삭제/필터링으로 더는 유효하지 않으면
  // 보이는 목록의 첫 번째 메모로 자동 보정한다(목업의 selectedId:'n1' 기본 선택과 동일한 역할).
  function ensureNotesSelection() {
    if (notesUi.selectedId && notesData.notes[notesUi.selectedId]) return;
    const first = visibleNotesList()[0];
    notesUi.selectedId = first ? first.id : null;
  }

  function createFolder(name) {
    const trimmed = (name || "").trim();
    if (!trimmed) return;
    const id = genId();
    notesData.folders.push({ id, name: trimmed });
    notesData.folderOrder[id] = [];
    saveNotesData();
  }
  function deleteFolder(id) {
    recordUndo("폴더 삭제", NOTES_KEY, () => undoRestoreObjectInPlace(notesData, loadNotesData()));
    const orphaned = notesData.folderOrder[id] || [];
    notesData.folderOrder[UNFILED] = (notesData.folderOrder[UNFILED] || []).concat(orphaned);
    orphaned.forEach((noteId) => { if (notesData.notes[noteId]) notesData.notes[noteId].folderId = null; });
    notesData.folders = notesData.folders.filter((f) => f.id !== id);
    delete notesData.folderOrder[id];
    if (notesUi.view === id) notesUi.view = "all";
    saveNotesData();
  }
  function createNote(folderIdRaw) {
    const folderId = folderIdRaw && folderIdRaw !== UNFILED ? folderIdRaw : null;
    const id = genId();
    const now = notesNowIso();
    notesData.notes[id] = { id, title: "새 메모", content: "", folderId, pinned: false, attachments: [], createdAt: now, updatedAt: now };
    const key = folderId || UNFILED;
    if (!notesData.folderOrder[key]) notesData.folderOrder[key] = [];
    notesData.folderOrder[key].push(id);
    saveNotesData();
    return id;
  }
  function deleteNote(id) {
    const note = notesData.notes[id];
    if (!note) return;
    recordUndo("메모 삭제", NOTES_KEY, () => undoRestoreObjectInPlace(notesData, loadNotesData()));
    const key = note.folderId || UNFILED;
    if (notesData.folderOrder[key]) notesData.folderOrder[key] = notesData.folderOrder[key].filter((x) => x !== id);
    notesData.pinnedOrder = notesData.pinnedOrder.filter((x) => x !== id);
    if (cloud && note.attachments && note.attachments.length) {
      const paths = note.attachments.map((a) => a.path).filter(Boolean);
      if (paths.length) cloud.storage.from(NOTES_ATTACHMENTS_BUCKET).remove(paths).catch(() => {});
    }
    delete notesData.notes[id];
    if (notesUi.selectedId === id) notesUi.selectedId = null; // renderApp() 직전에 ensureNotesSelection()이 다음 메모를 골라준다
    saveNotesData();
  }
  function togglePin(id) {
    const note = notesData.notes[id];
    if (!note) return;
    if (note.pinned) {
      note.pinned = false;
      notesData.pinnedOrder = notesData.pinnedOrder.filter((x) => x !== id);
    } else {
      if (notesData.pinnedOrder.length >= 5) {
        alert("고정 메모는 최대 5개까지 지정할 수 있어요.");
        return;
      }
      note.pinned = true;
      notesData.pinnedOrder.push(id);
    }
    note.updatedAt = notesNowIso();
    saveNotesData();
    renderApp();
  }
  function updateNoteTitle(id, title) {
    const note = notesData.notes[id];
    if (!note) return;
    note.title = title; // 화면에 쓸 값은 즉시 반영, 실제 저장(및 네트워크 전송)만 debounce
    note.updatedAt = notesNowIso();
    // 본문 입력창(타이틀) 자체는 다시 그리지 않는다 — renderApp()을 부르면 매 글자마다
    // 커서/포커스가 끊긴다. 목록에 보이는 제목만 살짝 고쳐서 목업의 renderList() 동기화와
    // 같은 효과를 낸다.
    const rowTitleEl = document.querySelector(`.notes-row[data-id="${id}"] .notes-row-title`);
    if (rowTitleEl) rowTitleEl.textContent = title;
    scheduleSaveNotesData();
  }
  function updateNoteContent(id, content) {
    const note = notesData.notes[id];
    if (!note) return;
    note.content = content; // 화면에 쓸 값은 즉시 반영, 실제 저장(및 네트워크 전송)만 debounce
    note.updatedAt = notesNowIso();
    const rowSnipEl = document.querySelector(`.notes-row[data-id="${id}"] .notes-row-snip`);
    if (rowSnipEl) rowSnipEl.textContent = content.split("\n")[0];
    scheduleSaveNotesData();
  }
  function changeNoteFolder(id, folderIdRaw) {
    const note = notesData.notes[id];
    if (!note) return;
    note.folderId = folderIdRaw && folderIdRaw !== UNFILED ? folderIdRaw : null;
    note.updatedAt = notesNowIso();
    saveNotesData();
    renderApp();
  }

  function renderNoteAttachments(note) {
    const attachments = note.attachments || [];
    const uploading = notesUi.uploadingNoteId === note.id;
    return `
      <div class="note-attachments">
        <div class="note-attachments-head">
          <span class="note-attachments-label">${ICON_PAPERCLIP} 첨부파일${attachments.length ? ` (${attachments.length})` : ""}</span>
          <button type="button" class="ghost-btn note-attach-btn" data-action="attach-file" ${uploading ? "disabled" : ""}>
            ${uploading ? "업로드 중…" : `${ICON_UPLOAD} 파일 첨부`}
          </button>
          <input type="file" multiple style="display:none;" data-file-input="${note.id}">
        </div>
        ${attachments.length === 0
          ? `<div class="note-attachment-empty">첨부된 파일이 없어요.</div>`
          : `<div class="note-attachment-list">
              ${attachments.map((a) => `
                <div class="note-attachment-row">
                  <span class="note-attachment-name" title="${esc(a.name)}">${esc(a.name)}</span>
                  <span class="note-attachment-size">${formatAttachmentSize(a.size)}</span>
                  <button type="button" class="note-attachment-icon-btn" data-action="download-attachment" data-att-id="${a.id}" title="다운로드">${ICON_DOWNLOAD}</button>
                  <button type="button" class="note-attachment-icon-btn note-attachment-icon-btn-danger" data-action="delete-attachment" data-att-id="${a.id}" title="삭제">${ICON_TRASH}</button>
                </div>
              `).join("")}
            </div>`}
      </div>
    `;
  }

  function attachNoteAttachmentEvents(root, noteId) {
    const attachBtn = root.querySelector("[data-action='attach-file']");
    const fileInput = root.querySelector("[data-file-input]");
    if (attachBtn && fileInput) {
      attachBtn.onclick = (e) => { e.stopPropagation(); fileInput.click(); };
      fileInput.addEventListener("click", (e) => e.stopPropagation());
      fileInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files.length) uploadNoteAttachments(noteId, e.target.files);
        e.target.value = "";
      });
    }
    root.querySelectorAll("[data-action='download-attachment']").forEach((btn) => {
      btn.onclick = (e) => { e.stopPropagation(); downloadNoteAttachment(noteId, btn.getAttribute("data-att-id")); };
    });
    root.querySelectorAll("[data-action='delete-attachment']").forEach((btn) => {
      btn.onclick = (e) => { e.stopPropagation(); deleteNoteAttachment(noteId, btn.getAttribute("data-att-id")); };
    });
  }

  // ---- 사이드바: 스마트 폴더(전체·고정) + 폴더 목록 ----
  function renderNotesSidebar() {
    const el = document.getElementById("notes-sidebar");
    if (!el) return;
    const notesArr = Object.values(notesData.notes);
    const countInFolder = (folderId) => notesArr.filter((n) => n.folderId === folderId).length;
    const pinnedCount = notesArr.filter((n) => n.pinned).length;

    const rows = [
      `<div class="notes-sidebar-title">업무 정리</div>`,
      `<div class="notes-sidebar-item ${notesUi.view === "all" ? "active" : ""}" data-view="all">
        <span class="notes-sidebar-ic">🗒️</span><span class="notes-sidebar-name">전체 메모</span><span class="notes-sidebar-cnt">${notesArr.length}</span>
      </div>`,
      `<div class="notes-sidebar-item ${notesUi.view === "pinned" ? "active" : ""}" data-view="pinned">
        <span class="notes-sidebar-ic">★</span><span class="notes-sidebar-name">고정된 메모</span><span class="notes-sidebar-cnt">${pinnedCount}/5</span>
      </div>`,
      `<div class="notes-sidebar-group-label">폴더</div>`,
    ];
    notesData.folders.forEach((f) => {
      rows.push(`
        <div class="notes-sidebar-item ${notesUi.view === f.id ? "active" : ""}" data-view="${f.id}">
          <span class="notes-sidebar-ic">📁</span>
          <span class="notes-sidebar-name">${esc(f.name)}</span>
          <span class="notes-sidebar-cnt">${countInFolder(f.id)}</span>
          <button class="notes-sidebar-del" data-del-folder="${f.id}" title="폴더 삭제">✕</button>
        </div>
      `);
    });

    el.innerHTML = rows.join("") +
      `<div class="notes-sidebar-spacer"></div>
      <div class="notes-sidebar-footer"><button class="notes-sidebar-newfolder" id="notes-new-folder-btn">＋ 새 폴더</button></div>`;

    el.querySelectorAll(".notes-sidebar-item[data-view]").forEach((item) => {
      item.onclick = (e) => {
        if (e.target.closest("[data-del-folder]")) return;
        notesUi.view = item.getAttribute("data-view");
        renderApp();
      };
    });
    el.querySelectorAll("[data-del-folder]").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-del-folder");
        if (window.confirm("이 폴더를 삭제할까요? 폴더 안의 메모는 '미분류'로 이동해요.")) {
          deleteFolder(id);
          renderApp();
        }
      };
    });
    const newFolderBtn = document.getElementById("notes-new-folder-btn");
    if (newFolderBtn) {
      newFolderBtn.onclick = () => {
        const name = window.prompt("폴더 이름을 입력하세요");
        if (name && name.trim()) { createFolder(name); renderApp(); }
      };
    }
  }

  // ---- 목록: 검색 결과(또는 현재 view)에 해당하는 메모들 ----
  function renderNotesList() {
    const el = document.getElementById("notes-list");
    if (!el) return;
    const list = visibleNotesList();
    if (list.length === 0) {
      el.innerHTML = `<div class="notes-list-empty">표시할 메모가 없어요.</div>`;
      return;
    }
    el.innerHTML = list.map((n) => `
      <div class="notes-row ${n.id === notesUi.selectedId ? "sel" : ""}" data-id="${n.id}">
        <div class="notes-row-top">
          ${n.pinned ? '<span class="notes-row-star">★</span>' : ""}
          <span class="notes-row-title">${esc(n.title)}</span>
        </div>
        <div class="notes-row-meta"><span>${fmtNoteDateOnly(n.updatedAt)}</span><span class="notes-row-snip">${esc((n.content || "").split("\n")[0])}</span></div>
      </div>
    `).join("");
    el.querySelectorAll(".notes-row").forEach((row) => {
      row.onclick = () => {
        notesUi.selectedId = row.getAttribute("data-id");
        renderApp();
      };
    });
  }

  // ---- 본문: 선택된 메모 1건 편집 ----
  function renderNotesDetail() {
    const el = document.getElementById("notes-detail");
    if (!el) return;
    const n = notesData.notes[notesUi.selectedId];
    if (!n) {
      el.innerHTML = `<div class="notes-detail-empty">왼쪽 목록에서 메모를 선택하세요.</div>`;
      return;
    }
    // 분류(폴더) 선택: 드롭다운 대신 면담일지 유형 필터와 동일한 가로 알약 버튼 한 줄로 표시.
    const folderChoices = [{ id: UNFILED, name: "미분류" }].concat(notesData.folders.map((f) => ({ id: f.id, name: f.name })));
    const currentFolderKey = n.folderId || UNFILED;
    const folderFilterBtns = folderChoices.map((f) => `
      <button type="button" class="agent-filter-btn ${currentFolderKey === f.id ? "active" : ""}" data-folder-choice="${f.id}">${esc(f.name)}</button>
    `).join("");

    el.innerHTML = `
      <div class="notes-detail-top">
        <div class="agent-filter-row notes-folder-filter-row">${folderFilterBtns}</div>
        <div class="notes-detail-spacer"></div>
        <button class="notes-icon-btn ${n.pinned ? "pinned" : ""}" id="notes-detail-pin-btn" title="고정">★</button>
        <button class="notes-icon-btn danger" id="notes-detail-del-btn" title="삭제">✕</button>
      </div>
      <div class="notes-detail-body">
        <input type="text" class="notes-detail-title" id="notes-detail-title-input" value="${esc(n.title)}" placeholder="제목 없음" autocomplete="off">
        <div class="notes-detail-date">마지막 수정 ${esc(fmtNoteDateTime(n.updatedAt))}</div>
        <textarea class="notes-detail-content" id="notes-detail-content-input" placeholder="메모 내용을 입력하세요">${esc(n.content)}</textarea>
        ${renderNoteAttachments(n)}
      </div>
      <div class="notes-detail-status" id="notes-status"></div>
    `;

    el.querySelectorAll("[data-folder-choice]").forEach((btn) => {
      btn.onclick = () => changeNoteFolder(n.id, btn.getAttribute("data-folder-choice"));
    });
    const titleInput = document.getElementById("notes-detail-title-input");
    if (titleInput) titleInput.oninput = (e) => updateNoteTitle(n.id, e.target.value);
    const contentInput = document.getElementById("notes-detail-content-input");
    if (contentInput) {
      contentInput.addEventListener("input", (e) => updateNoteContent(n.id, e.target.value));
      // 이 칸에서 포커스가 빠지면(다른 메모 클릭 등으로 이 textarea가 다시 그려져
      // 사라지기 전) 미뤄둔 저장을 바로 끝낸다.
      contentInput.addEventListener("blur", flushNotesSaveIfPending);
    }
    const pinBtn = document.getElementById("notes-detail-pin-btn");
    if (pinBtn) pinBtn.onclick = () => togglePin(n.id);
    const delBtn = document.getElementById("notes-detail-del-btn");
    if (delBtn) {
      delBtn.onclick = () => {
        if (!window.confirm("이 메모를 삭제할까요?")) return;
        deleteNote(n.id);
        renderApp();
      };
    }
    attachNoteAttachmentEvents(el, n.id);
  }

  function renderNotesPage(root) {
    ensureNotesSelection();

    // 검색창은 타이핑 중 renderApp()이 다른 이유로 다시 불려도(다른 창의 실시간 동기화 등)
    // 포커스/커서가 끊기지 않도록, 이미 그려져 있으면 뼈대는 다시 만들지 않고
    // 사이드바·목록·본문 세 영역만 갱신한다(상담사 관리 검색창과 같은 방식).
    let shell = root.querySelector(".notes-shell");
    if (!shell) {
      root.innerHTML = `
        <div class="notes-shell">
          <div class="notes-sidebar" id="notes-sidebar"></div>
          <div class="notes-list-col">
            <div class="notes-list-top">
              <div class="agent-search-input notes-search">
                <input type="text" class="agent-search-input-field" id="notes-search-input" placeholder="메모 검색" autocomplete="off" value="${esc(notesUi.search)}">
                ${ICON_SEARCH_MINI}
              </div>
              <button class="notes-new-btn" id="notes-new-btn" title="새 메모">＋</button>
            </div>
            <div class="notes-list-scroll" id="notes-list"></div>
          </div>
          <div class="notes-detail" id="notes-detail"></div>
        </div>
      `;
      shell = root.querySelector(".notes-shell");

      const searchInput = document.getElementById("notes-search-input");
      if (searchInput) {
        searchInput.oninput = (e) => {
          notesUi.search = e.target.value;
          renderNotesList();
        };
      }
      const newNoteBtn = document.getElementById("notes-new-btn");
      if (newNoteBtn) {
        newNoteBtn.onclick = () => {
          const folderId = (notesUi.view === "all" || notesUi.view === "pinned") ? null : notesUi.view;
          const id = createNote(folderId);
          notesUi.selectedId = id;
          renderApp();
          setTimeout(() => {
            const titleEl = document.getElementById("notes-detail-title-input");
            if (titleEl) { titleEl.focus(); titleEl.select(); }
          }, 0);
        };
      }
    }

    renderNotesSidebar();
    renderNotesList();
    renderNotesDetail();
  }

  /* ===================== 상담사 관리 모듈 ===================== */
  const AGENTS_KEY = acctKey("personal-agents:data");
