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
      Object.values(parsed.notes).forEach((n) => { if (!n.attachments) n.attachments = []; });
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

  const notesUi = {
    expanded: {},
    collapsedFolders: {},
    showNewNote: false,
    showNewFolder: false,
    uploadingNoteId: null,
  };

  function createFolder(name) {
    const trimmed = name.trim();
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
    saveNotesData();
  }
  function createNote(title, folderIdRaw) {
    const trimmed = title.trim();
    if (!trimmed) return;
    const folderId = folderIdRaw && folderIdRaw !== UNFILED ? folderIdRaw : null;
    const id = genId();
    notesData.notes[id] = { id, title: trimmed, content: "", folderId, pinned: false, attachments: [] };
    const key = folderId || UNFILED;
    if (!notesData.folderOrder[key]) notesData.folderOrder[key] = [];
    notesData.folderOrder[key].push(id);
    saveNotesData();
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
    delete notesUi.expanded[id];
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
    saveNotesData();
    renderApp();
  }
  function updateNoteContent(id, content) {
    const note = notesData.notes[id];
    if (!note) return;
    note.content = content;
    saveNotesData();
  }
  function renameNote(id) {
    const note = notesData.notes[id];
    if (!note) return;
    const next = window.prompt("메모 제목 수정", note.title);
    if (next === null) return;
    const trimmed = next.trim();
    if (!trimmed) return;
    note.title = trimmed;
    saveNotesData();
    renderApp();
  }

  let dragState = null; // { id, listKey }

  function reorderList(listKey, draggedId, targetId) {
    let arr;
    if (listKey === "pinned") arr = notesData.pinnedOrder;
    else arr = notesData.folderOrder[listKey.replace("folder:", "")];
    if (!arr) return;
    const from = arr.indexOf(draggedId);
    const to = arr.indexOf(targetId);
    if (from === -1 || to === -1 || from === to) return;
    arr.splice(from, 1);
    arr.splice(to, 0, draggedId);
    saveNotesData();
    renderApp();
  }

  function isFolderKind(listKey) { return listKey.indexOf("folder:") === 0; }
  function folderKeyOf(listKey) { return listKey.replace("folder:", ""); }

  function moveNoteAcrossFolders(noteId, fromKey, toKey, targetId) {
    if (!notesData.folderOrder[fromKey]) notesData.folderOrder[fromKey] = [];
    if (!notesData.folderOrder[toKey]) notesData.folderOrder[toKey] = [];
    notesData.folderOrder[fromKey] = notesData.folderOrder[fromKey].filter((x) => x !== noteId);
    notesData.folderOrder[toKey] = notesData.folderOrder[toKey].filter((x) => x !== noteId);
    if (targetId && notesData.folderOrder[toKey].includes(targetId)) {
      notesData.folderOrder[toKey].splice(notesData.folderOrder[toKey].indexOf(targetId), 0, noteId);
    } else {
      notesData.folderOrder[toKey].push(noteId);
    }
    const note = notesData.notes[noteId];
    if (note) note.folderId = toKey === UNFILED ? null : toKey;
    saveNotesData();
    renderApp();
  }

  function attachDragHandlers(root) {
    root.querySelectorAll(".note-row[draggable='true']").forEach((row) => {
      const id = row.getAttribute("data-note-id");
      const listKey = row.getAttribute("data-list-key");
      row.addEventListener("dragstart", (e) => {
        dragState = { id, listKey };
        row.classList.add("dragging");
        try { e.dataTransfer.setData("text/plain", id); } catch (err) {}
        e.dataTransfer.effectAllowed = "move";
      });
      row.addEventListener("dragend", () => {
        row.classList.remove("dragging");
        root.querySelectorAll(".drag-over").forEach((r) => r.classList.remove("drag-over"));
        dragState = null;
      });
      row.addEventListener("dragover", (e) => {
        if (!dragState) return;
        const compatible = (dragState.listKey === "pinned" && listKey === "pinned") ||
          (isFolderKind(dragState.listKey) && isFolderKind(listKey));
        if (!compatible) return;
        e.preventDefault();
        e.stopPropagation();
        row.classList.add("drag-over");
      });
      row.addEventListener("dragleave", () => row.classList.remove("drag-over"));
      row.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();
        row.classList.remove("drag-over");
        if (!dragState || dragState.id === id) return;
        if (dragState.listKey === "pinned" && listKey === "pinned") {
          reorderList("pinned", dragState.id, id);
        } else if (isFolderKind(dragState.listKey) && isFolderKind(listKey)) {
          const fromKey = folderKeyOf(dragState.listKey);
          const toKey = folderKeyOf(listKey);
          if (fromKey === toKey) reorderList(listKey, dragState.id, id);
          else moveNoteAcrossFolders(dragState.id, fromKey, toKey, id);
        }
      });
    });

    root.querySelectorAll("[data-folder-drop]").forEach((zone) => {
      const toKey = zone.getAttribute("data-folder-drop");
      zone.addEventListener("dragover", (e) => {
        if (!dragState || !isFolderKind(dragState.listKey)) return;
        e.preventDefault();
        zone.classList.add("drag-over-zone");
      });
      zone.addEventListener("dragleave", () => zone.classList.remove("drag-over-zone"));
      zone.addEventListener("drop", (e) => {
        e.preventDefault();
        zone.classList.remove("drag-over-zone");
        if (!dragState || !isFolderKind(dragState.listKey)) return;
        const fromKey = folderKeyOf(dragState.listKey);
        if (fromKey === toKey) return;
        moveNoteAcrossFolders(dragState.id, fromKey, toKey, null);
      });
    });
  }

  function renderNoteRow(note, listKey) {
    const isExpanded = !!notesUi.expanded[note.id];
    const folder = note.folderId ? notesData.folders.find((f) => f.id === note.folderId) : null;
    return `
      <div class="note-row" draggable="true" data-note-id="${note.id}" data-list-key="${listKey}">
        <div class="note-head">
          <span class="drag-handle" title="드래그해서 순서 변경">⠿</span>
          <button class="pin-btn ${note.pinned ? "pinned" : ""}" data-action="pin" data-id="${note.id}" title="${note.pinned ? "고정 해제" : "상단에 고정"}">${note.pinned ? "★" : "☆"}</button>
          <button class="note-title-btn ${isExpanded ? "expanded" : ""}" data-action="expand" data-id="${note.id}">
            <span class="caret">▸</span>
            <span>${esc(note.title)}</span>
            ${folder && listKey === "pinned" ? `<span class="note-folder-tag">${esc(folder.name)}</span>` : ""}
          </button>
          <button class="note-del" data-action="rename" data-id="${note.id}" title="제목 수정">✎</button>
          <button class="note-del" data-action="delete-note" data-id="${note.id}" title="삭제">✕</button>
        </div>
        ${isExpanded ? `
        <div class="note-body">
          <textarea class="note-content" data-content-id="${note.id}" placeholder="메모 내용을 입력하세요">${esc(note.content)}</textarea>
          ${renderNoteAttachments(note)}
        </div>` : ""}
      </div>
    `;
  }

  function renderNoteAttachments(note) {
    const attachments = note.attachments || [];
    const uploading = notesUi.uploadingNoteId === note.id;
    return `
      <div class="note-attachments">
        <div class="note-attachments-head">
          <span class="note-attachments-label">${ICON_PAPERCLIP} 첨부파일${attachments.length ? ` (${attachments.length})` : ""}</span>
          <button type="button" class="ghost-btn note-attach-btn" data-action="attach-file" data-id="${note.id}" ${uploading ? "disabled" : ""}>
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
                  <button type="button" class="note-attachment-icon-btn" data-action="download-attachment" data-id="${note.id}" data-att-id="${a.id}" title="다운로드">${ICON_DOWNLOAD}</button>
                  <button type="button" class="note-attachment-icon-btn note-attachment-icon-btn-danger" data-action="delete-attachment" data-id="${note.id}" data-att-id="${a.id}" title="삭제">${ICON_TRASH}</button>
                </div>
              `).join("")}
            </div>`}
      </div>
    `;
  }

  function renderNotesPage(root) {
    const pinnedNotes = notesData.pinnedOrder.map((id) => notesData.notes[id]).filter(Boolean);
    const folderOptions = `<option value="${UNFILED}">미분류</option>` + notesData.folders.map((f) => `<option value="${f.id}">${esc(f.name)}</option>`).join("");

    let pinnedHtml = "";
    if (pinnedNotes.length > 0) {
      pinnedHtml = `
        <div class="pinned-block">
          <div class="pinned-title">${ICON_PIN} 고정된 메모 <span class="pinned-count">(${pinnedNotes.length}/5)</span></div>
          <div class="folder-body" style="padding:0;">
            ${pinnedNotes.map((n) => renderNoteRow(n, "pinned")).join("")}
          </div>
        </div>
      `;
    }

    const allFolders = [{ id: null, name: "미분류", key: UNFILED }].concat(notesData.folders.map((f) => ({ id: f.id, name: f.name, key: f.id })));
    let foldersHtml = "";
    allFolders.forEach((f) => {
      const noteIds = notesData.folderOrder[f.key] || [];
      const notesInFolder = noteIds.map((id) => notesData.notes[id]).filter(Boolean);
      if (f.key === UNFILED && notesInFolder.length === 0) return; // 미분류가 비어있으면 숨김
      const collapsed = !!notesUi.collapsedFolders[f.key];
      foldersHtml += `
        <div class="folder-block">
          <div class="folder-header" data-action="toggle-folder" data-key="${f.key}">
            <span class="folder-chevron">${collapsed ? "▸" : "▾"}</span>
            <span class="folder-name">${esc(f.name)}</span>
            <span class="folder-count">${notesInFolder.length}개</span>
            ${f.id ? `<button class="folder-del" data-action="delete-folder" data-id="${f.id}" title="폴더 삭제">✕</button>` : ""}
          </div>
          ${collapsed ? "" : `
          <div class="folder-body" data-folder-drop="${f.key}">
            ${notesInFolder.length === 0
              ? `<div class="folder-empty">이 폴더에는 아직 메모가 없어요.<br>다른 메모를 여기로 드래그해서 옮길 수도 있어요.</div>`
              : notesInFolder.map((n) => renderNoteRow(n, `folder:${f.key}`)).join("")}
          </div>`}
        </div>
      `;
    });

    const totalNotes = Object.keys(notesData.notes).length;
    const hasFolders = notesData.folders.length > 0;

    root.innerHTML = `
      <div class="notes-header">
        <div class="notes-title">업무 정리</div>
        <div class="notes-actions">
          <button class="ghost-btn solid-accent-btn" id="btn-new-folder">+ 새 폴더</button>
          <button class="ghost-btn solid-accent-btn" id="btn-new-note">+ 새 메모</button>
        </div>
      </div>
      <div class="card">
      <div class="status" id="notes-status" style="margin-bottom:10px;"></div>

      ${notesUi.showNewFolder ? `
      <form class="inline-form" id="folder-form">
        <input type="text" id="new-folder-name" placeholder="폴더 이름 (예: 업무 매뉴얼)" autocomplete="off">
        <button type="submit" class="primary-btn">만들기</button>
        <button type="button" class="cancel-btn" id="cancel-folder">취소</button>
      </form>` : ""}

      ${notesUi.showNewNote ? `
      <form class="inline-form" id="note-form">
        <input type="text" id="new-note-title" placeholder="메모 제목" autocomplete="off">
        <select id="new-note-folder">${folderOptions}</select>
        <button type="submit" class="primary-btn">추가</button>
        <button type="button" class="cancel-btn" id="cancel-note">취소</button>
      </form>` : ""}

      ${pinnedHtml}

      ${(totalNotes === 0 && !hasFolders) ? `<div class="notes-empty">아직 메모가 없어요.<br>오른쪽 위 "＋ 새 메모"로 첫 업무 메모를 만들어보세요.</div>` : foldersHtml}
      </div>
    `;

    attachNotesEvents(root);
  }

  function attachNotesEvents(root) {
    const noteFolderSelect = document.getElementById("new-note-folder");
    if (noteFolderSelect) enhanceSelect(noteFolderSelect);
    const newFolderBtn = document.getElementById("btn-new-folder");
    const newNoteBtn = document.getElementById("btn-new-note");
    if (newFolderBtn) newFolderBtn.onclick = () => { notesUi.showNewFolder = true; notesUi.showNewNote = false; renderApp(); setTimeout(() => { const el = document.getElementById("new-folder-name"); if (el) el.focus(); }, 0); };
    if (newNoteBtn) newNoteBtn.onclick = () => { notesUi.showNewNote = true; notesUi.showNewFolder = false; renderApp(); setTimeout(() => { const el = document.getElementById("new-note-title"); if (el) el.focus(); }, 0); };

    const folderForm = document.getElementById("folder-form");
    if (folderForm) {
      folderForm.onsubmit = (e) => {
        e.preventDefault();
        const val = document.getElementById("new-folder-name").value;
        createFolder(val);
        notesUi.showNewFolder = false;
        renderApp();
      };
      const cancelFolder = document.getElementById("cancel-folder");
      if (cancelFolder) cancelFolder.onclick = () => { notesUi.showNewFolder = false; renderApp(); };
    }

    const noteForm = document.getElementById("note-form");
    if (noteForm) {
      noteForm.onsubmit = (e) => {
        e.preventDefault();
        const title = document.getElementById("new-note-title").value;
        const folderId = document.getElementById("new-note-folder").value;
        createNote(title, folderId);
        notesUi.showNewNote = false;
        renderApp();
      };
      const cancelNote = document.getElementById("cancel-note");
      if (cancelNote) cancelNote.onclick = () => { notesUi.showNewNote = false; renderApp(); };
    }

    root.querySelectorAll("[data-action='toggle-folder']").forEach((el) => {
      el.onclick = () => {
        const key = el.getAttribute("data-key");
        notesUi.collapsedFolders[key] = !notesUi.collapsedFolders[key];
        renderApp();
      };
    });
    root.querySelectorAll("[data-action='delete-folder']").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        if (window.confirm("이 폴더를 삭제할까요? 폴더 안의 메모는 '미분류'로 이동해요.")) {
          deleteFolder(btn.getAttribute("data-id"));
          renderApp();
        }
      };
    });
    root.querySelectorAll("[data-action='pin']").forEach((btn) => {
      btn.onclick = (e) => { e.stopPropagation(); togglePin(btn.getAttribute("data-id")); };
    });
    root.querySelectorAll("[data-action='rename']").forEach((btn) => {
      btn.onclick = (e) => { e.stopPropagation(); renameNote(btn.getAttribute("data-id")); };
    });
    root.querySelectorAll("[data-action='delete-note']").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        deleteNote(btn.getAttribute("data-id"));
        renderApp();
      };
    });
    root.querySelectorAll("[data-action='expand']").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-id");
        notesUi.expanded[id] = !notesUi.expanded[id];
        renderApp();
      };
    });
    root.querySelectorAll("[data-content-id]").forEach((ta) => {
      ta.addEventListener("input", (e) => { updateNoteContent(ta.getAttribute("data-content-id"), e.target.value); });
    });

    root.querySelectorAll("[data-action='attach-file']").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        const input = root.querySelector(`[data-file-input="${id}"]`);
        if (input) input.click();
      };
    });
    root.querySelectorAll("[data-file-input]").forEach((input) => {
      input.addEventListener("click", (e) => e.stopPropagation());
      input.addEventListener("change", (e) => {
        const id = input.getAttribute("data-file-input");
        if (e.target.files && e.target.files.length) uploadNoteAttachments(id, e.target.files);
        input.value = "";
      });
    });
    root.querySelectorAll("[data-action='download-attachment']").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        downloadNoteAttachment(btn.getAttribute("data-id"), btn.getAttribute("data-att-id"));
      };
    });
    root.querySelectorAll("[data-action='delete-attachment']").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        deleteNoteAttachment(btn.getAttribute("data-id"), btn.getAttribute("data-att-id"));
      };
    });

    attachDragHandlers(root);
  }

  /* ===================== 상담사 관리 모듈 ===================== */
  const AGENTS_KEY = acctKey("personal-agents:data");

