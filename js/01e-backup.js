  // ==================== 데이터 백업/복원(수동 다운로드·업로드), 일별 자동 백업 및 정리 ====================
  // (예전 01-common.js에서 분리됨 — 실행 순서·내용은 그대로입니다)
  const BACKUP_CATEGORIES = [
    { key: "calendar", label: "캘린더 · 할 일", icon: ICON_CALENDAR, keyPrefixes: ["personal-calendar:"] },
    { key: "notes", label: "업무 정리(메모)", icon: ICON_NOTE, keyPrefixes: ["personal-notes:"] },
    { key: "agents", label: "상담사 관리", icon: ICON_USERS, keyPrefixes: ["personal-agents:"] },
    { key: "interviews", label: "면담일지", icon: ICON_CLIPBOARD, keyPrefixes: ["personal-interviews:"] },
    { key: "qa", label: "품질 관리(QA)", icon: ICON_QA, keyPrefixes: ["personal-qa:"] },
    { key: "schedule", label: "월별 스케줄", icon: ICON_CHART, keyPrefixes: ["personal-schedule:"] },
  ];
  function backupAllPrefixes() {
    return BACKUP_CATEGORIES.reduce((acc, c) => acc.concat(c.keyPrefixes), []);
  }
  // 지금 로그인한 계정 소유의 키만 모아서, "acct:{id}:" 접두어를 뗀 상대 키 기준으로 돌려준다.
  function collectAccountStorageEntries(prefixFilter) {
    const acctPrefix = `acct:${CURRENT_ACCOUNT_ID}:`;
    const entries = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k || k.indexOf(acctPrefix) !== 0) continue;
        const rel = k.slice(acctPrefix.length);
        if (prefixFilter && !prefixFilter.some((p) => rel.indexOf(p) === 0)) continue;
        const v = localStorage.getItem(k);
        if (v !== null) entries[rel] = v;
      }
    } catch (e) { /* localStorage 접근 실패 시 빈 결과로 진행 */ }
    return entries;
  }
  function buildBackupPayload(categoryKey) {
    const cat = categoryKey === "all" ? null : BACKUP_CATEGORIES.find((c) => c.key === categoryKey);
    const entries = collectAccountStorageEntries(cat ? cat.keyPrefixes : backupAllPrefixes());
    return {
      app: "업무 종합 관리",
      backupVersion: 1,
      exportedAt: new Date().toISOString(),
      accountName: CURRENT_ACCOUNT_NAME,
      category: categoryKey,
      categoryLabel: cat ? cat.label : "전체 데이터",
      data: entries,
    };
  }
  function backupFilenameStamp() {
    const d = new Date();
    return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}-${pad2(d.getHours())}${pad2(d.getMinutes())}`;
  }
  function sanitizeFilenamePart(s) {
    return String(s).replace(/[\\/:*?"<>|]/g, "_");
  }
  function downloadBackup(categoryKey) {
    const payload = buildBackupPayload(categoryKey);
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `백업_${sanitizeFilenamePart(CURRENT_ACCOUNT_NAME)}_${sanitizeFilenamePart(payload.categoryLabel)}_${backupFilenameStamp()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    flashBackupStatus(`"${payload.categoryLabel}" 백업 파일을 내려받았어요.`);
  }
  function readBackupFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try { resolve(JSON.parse(reader.result)); }
        catch (e) { reject(e); }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file, "utf-8");
    });
  }
  // restrictCategory가 있으면 그 카테고리에 속한 키만 반영하고(다른 카테고리 값은
  // 파일 안에 섞여 있어도 무시), 없으면(=전체 가져오기) 알려진 모든 카테고리의
  // 키를 반영한다. 백업 파일에 적힌 계정 이름 등은 참고용일 뿐 저장에는 쓰지
  // 않고, 항상 "지금 로그인한 계정" 접두어로만 써서 다른 계정에는 영향이 없다.
  async function applyBackupPayload(payload, restrictCategory) {
    if (!payload || typeof payload !== "object" || !payload.data || typeof payload.data !== "object") {
      return { ok: false, reason: "올바른 백업 파일이 아니에요." };
    }
    const allowedPrefixes = restrictCategory
      ? ((BACKUP_CATEGORIES.find((c) => c.key === restrictCategory) || {}).keyPrefixes || [])
      : backupAllPrefixes();
    const acctPrefix = `acct:${CURRENT_ACCOUNT_ID}:`;
    let count = 0;
    Object.keys(payload.data).forEach((relKey) => {
      if (!allowedPrefixes.some((p) => relKey.indexOf(p) === 0)) return;
      const value = payload.data[relKey];
      if (typeof value !== "string") return;
      try { localStorage.setItem(acctPrefix + relKey, value); count += 1; } catch (e) {}
    });
    if (count === 0) return { ok: false, reason: "이 백업 파일에서 가져올 수 있는 데이터를 찾지 못했어요." };
    await flushCloudWrites();
    return { ok: true, count };
  }

  /* ===================== 🗄️ 자동 일일 백업 =====================
     서버에 진짜 "정확히 자정 0시"에 실행되는 스케줄러가 있는 게 아니라, 자정이 지난
     뒤 누군가(어떤 계정이든) 앱을 맨 처음 열 때 "어제 하루치" 백업이 아직 없으면
     그 시점에 만든다. 그래서 실제로 만들어지는 시각은 자정보다 조금 늦어질 수 있지만
     (예: 새벽엔 아무도 안 열고 오전 9시에 첫 출근자가 열면 그때 만들어짐), 내용 자체는
     "그 날짜가 끝난 시점의 데이터" 그대로를 담는다. 같은 날짜는 marker 키로 한 번만
     만들어지게 막는다. 별도 DB 테이블 없이 기존 kv_store에 다음 키들로 함께 저장한다.
       - backup:all:{yyyy-mm-dd}                모든 계정의 전체 데이터 스냅샷 (그날 변경 여부와 무관하게 매일)
       - backup:acct:{accountId}:{yyyy-mm-dd}    그 계정이 그날 바꾼 카테고리 목록(메타데이터)
       - backup:cat:{accountId}:{category}:{yyyy-mm-dd}  그 계정의 그 카테고리만 담은 개별 스냅샷(바뀐 것만)
       - backup:marker:{yyyy-mm-dd}              중복 생성 방지용 표시 */
  const BACKUP_RETENTION_DAYS = 30;
  function _localDateStr(d) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }
  function _prevLocalDateStr() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return _localDateStr(d);
  }
  function _dateStrMinusOne(dateStr) {
    const d = new Date(`${dateStr}T00:00:00`);
    d.setDate(d.getDate() - 1);
    return _localDateStr(d);
  }
  // 특정 계정(대상 계정 아무나)의, 주어진 접두어들에 해당하는 상대 키만 모아 온다.
  // (기존 buildBackupPayload는 "지금 로그인한 계정"만 다뤘는데, 여기서는 모든 계정을 다뤄야 해서 별도로 둔다.)
  function _accountCategoryEntries(accountId, prefixes) {
    const acctPrefix = `acct:${accountId}:`;
    const entries = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k || k.indexOf(acctPrefix) !== 0) continue;
        const rel = k.slice(acctPrefix.length);
        if (!prefixes.some((p) => rel.indexOf(p) === 0)) continue;
        const v = localStorage.getItem(k);
        if (v !== null) entries[rel] = v;
      }
    } catch (e) { /* 접근 실패 시 빈 결과로 진행 */ }
    return entries;
  }
  async function runDailyAutoBackupIfNeeded() {
    if (!cloud) return;
    const targetDate = _prevLocalDateStr(); // "어제"를 기준으로 하루치를 남긴다
    const markerKey = `backup:marker:${targetDate}`;
    try {
      const { data } = await cloud.from("kv_store").select("key").eq("key", markerKey).maybeSingle();
      if (data) return; // 이미 다른 사람이 만들어둔 날짜
    } catch (e) { return; } // 확인 자체가 안 되면(오프라인 등) 시도하지 않고, 다음에 여는 사람에게 맡긴다
    try {
      const accounts = loadAccounts();
      // 1) 계정 무관 전체 스냅샷 — 바뀐 게 있든 없든 매일 남긴다.
      const allSnapshot = { createdAt: new Date().toISOString(), date: targetDate, accounts: {} };
      accounts.forEach((acc) => {
        const entries = _accountCategoryEntries(acc.id, backupAllPrefixes());
        if (Object.keys(entries).length) allSnapshot.accounts[acc.id] = { accountName: acc.username, data: entries };
      });
      await cloud.from("kv_store").upsert({ key: `backup:all:${targetDate}`, value: JSON.stringify(allSnapshot), updated_at: new Date().toISOString() });

      // 2) 전날 스냅샷과 비교해서, 계정별로 실제 바뀐 카테고리만 개별 저장한다.
      let prevAllSnapshot = null;
      try {
        const { data } = await cloud.from("kv_store").select("value").eq("key", `backup:all:${_dateStrMinusOne(targetDate)}`).maybeSingle();
        if (data && data.value) prevAllSnapshot = JSON.parse(data.value);
      } catch (e) { /* 전날 스냅샷이 없으면(첫 백업 등) 전부 "새로 생김" 취급 */ }
      for (const acc of accounts) {
        const changedCats = [];
        const prevAcctData = (prevAllSnapshot && prevAllSnapshot.accounts[acc.id] && prevAllSnapshot.accounts[acc.id].data) || {};
        for (const cat of BACKUP_CATEGORIES) {
          const curEntries = _accountCategoryEntries(acc.id, cat.keyPrefixes);
          if (!Object.keys(curEntries).length) continue;
          const prevForCat = {};
          Object.keys(prevAcctData).forEach((k) => { if (cat.keyPrefixes.some((p) => k.indexOf(p) === 0)) prevForCat[k] = prevAcctData[k]; });
          if (JSON.stringify(curEntries) === JSON.stringify(prevForCat)) continue; // 안 바뀐 카테고리는 건너뜀
          changedCats.push({ key: cat.key, label: cat.label });
          await cloud.from("kv_store").upsert({
            key: `backup:cat:${acc.id}:${cat.key}:${targetDate}`,
            value: JSON.stringify({ createdAt: new Date().toISOString(), date: targetDate, accountId: acc.id, accountName: acc.username, category: cat.key, categoryLabel: cat.label, data: curEntries }),
            updated_at: new Date().toISOString(),
          });
        }
        if (changedCats.length) {
          await cloud.from("kv_store").upsert({
            key: `backup:acct:${acc.id}:${targetDate}`,
            value: JSON.stringify({ createdAt: new Date().toISOString(), date: targetDate, accountId: acc.id, accountName: acc.username, categories: changedCats }),
            updated_at: new Date().toISOString(),
          });
        }
      }
      await cloud.from("kv_store").upsert({ key: markerKey, value: "1", updated_at: new Date().toISOString() });
      await _pruneOldBackups();
    } catch (e) { /* 실패해도 평소 앱 사용에는 영향 없음 — 다음에 여는 사람이 다시 시도하게 된다 */ }
  }
  async function _pruneOldBackups() {
    if (!cloud) return;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - BACKUP_RETENTION_DAYS);
    const cutoffStr = _localDateStr(cutoff);
    try {
      const { data } = await cloud.from("kv_store").select("key").like("key", "backup:%");
      if (!data) return;
      const toDelete = data.filter((r) => {
        const m = /:(\d{4}-\d{2}-\d{2})$/.exec(r.key);
        return m && m[1] < cutoffStr;
      }).map((r) => r.key);
      for (const k of toDelete) { try { await cloud.from("kv_store").delete().eq("key", k); } catch (e) {} }
    } catch (e) {}
  }
  // 마스터 화면의 "자동 백업" 탭에서 쓸 목록: 날짜별로 묶어서 최신순으로 돌려준다.
  async function fetchBackupList() {
    if (!cloud) return [];
    const { data, error } = await cloud.from("kv_store").select("key,value").like("key", "backup:%");
    if (error || !data) return [];
    const byDate = {};
    data.forEach((row) => {
      if (/^backup:marker:/.test(row.key)) return;
      let m;
      if ((m = /^backup:all:(\d{4}-\d{2}-\d{2})$/.exec(row.key))) {
        const date = m[1];
        byDate[date] = byDate[date] || { date, all: null, accounts: {} };
        try { byDate[date].all = JSON.parse(row.value); } catch (e) {}
      } else if ((m = /^backup:acct:([^:]+):(\d{4}-\d{2}-\d{2})$/.exec(row.key))) {
        const [, accountId, date] = m;
        byDate[date] = byDate[date] || { date, all: null, accounts: {} };
        try { byDate[date].accounts[accountId] = Object.assign({ categories: [] }, JSON.parse(row.value), { catData: (byDate[date].accounts[accountId] || {}).catData || {} }); } catch (e) {}
      } else if ((m = /^backup:cat:([^:]+):([^:]+):(\d{4}-\d{2}-\d{2})$/.exec(row.key))) {
        const [, accountId, catKey, date] = m;
        byDate[date] = byDate[date] || { date, all: null, accounts: {} };
        byDate[date].accounts[accountId] = byDate[date].accounts[accountId] || { categories: [], catData: {} };
        if (!byDate[date].accounts[accountId].catData) byDate[date].accounts[accountId].catData = {};
        try { byDate[date].accounts[accountId].catData[catKey] = JSON.parse(row.value); } catch (e) {}
      }
    });
    return Object.values(byDate).sort((a, b) => b.date.localeCompare(a.date));
  }

  // 새로고침 버튼: 백업 버튼이 있던 오른쪽 아래 자리에 항상 떠 있는 고정 버튼으로 표시.
  // 다른 사람이 다른 기기/탭에서 저장한 내용을 서버에서 다시 받아오기 위한 용도로,
  // 누른 시점에 보고 있던 페이지(홈/상담사 관리 등)는 그대로 유지된다.
  function renderRefreshToggle() {
    const root = document.getElementById("refresh-toggle-root");
    if (!root) return;
    root.innerHTML = `
      <div class="manual-toggle-wrap">
        <button class="theme-picker-btn" id="nav-refresh-toggle" type="button" aria-label="최신 내용으로 새로고침" title="최신 내용으로 새로고침">
          ${ICON_REFRESH}
          <span class="theme-picker-label">새로고침</span>
        </button>
      </div>
    `;
    const refreshBtn = document.getElementById("nav-refresh-toggle");
    if (refreshBtn) refreshBtn.onclick = () => performServerRefresh();
  }
  function closeBackupModal() {
    const existing = document.getElementById("backup-modal-overlay");
    if (existing) existing.remove();
  }
  function flashBackupStatus(msg, isError) {
    const el = document.getElementById("backup-modal-status");
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle("error", !!isError);
  }
  function backupCategoryRowHtml(cat) {
    return `
      <div class="backup-cat-row">
        <div class="backup-cat-label">${cat.icon} ${esc(cat.label)}</div>
        <div class="backup-cat-actions">
          <button type="button" class="ghost-btn" data-backup-export="${cat.key}">${ICON_DOWNLOAD} 내보내기</button>
          <button type="button" class="ghost-btn" data-backup-import="${cat.key}">${ICON_UPLOAD} 가져오기</button>
        </div>
      </div>
    `;
  }
  // 파일 선택창을 열기 직전에 "이번 가져오기가 어느 카테고리 대상인지"를 여기에
  // 담아두고, 파일이 선택되면 이 값을 기준으로 어떤 키만 반영할지 정한다.
  let backupImportRestrict = null;
  function openBackupModal() {
    closeBackupModal();
    const overlay = document.createElement("div");
    overlay.id = "backup-modal-overlay";
    overlay.className = "manual-modal-overlay";
    overlay.innerHTML = `
      <div class="manual-modal-box backup-modal-box" role="dialog" aria-modal="true" aria-label="데이터 백업/복원">
        <div class="manual-modal-head">
          <span>${ICON_BACKUP} 데이터 백업/복원</span>
          <button type="button" class="manual-modal-close" id="backup-modal-close-x" aria-label="닫기">✕</button>
        </div>
        <div class="manual-modal-body">
          <p class="backup-modal-desc">
            상담사 정보 · 월별 스케줄 · 면담일지 · QA 점수 · 업무 정리(메모) · 캘린더 등
            <b>"${esc(CURRENT_ACCOUNT_NAME)}"</b> 계정의 데이터를 JSON 파일로 내려받거나 다시 불러올 수 있어요.
            가져오기는 파일이 원래 어느 계정에서 만들어졌든 상관없이 항상 <b>지금 로그인한 이 계정에만</b>
            적용되고, 다른 계정의 데이터에는 전혀 영향을 주지 않아요.
          </p>
          <div class="backup-section">
            <div class="backup-section-title">전체 데이터</div>
            <div class="backup-all-actions">
              <button type="button" class="primary-btn" id="backup-export-all">${ICON_DOWNLOAD} 전체 백업 다운로드</button>
              <button type="button" class="ghost-btn" id="backup-import-all">${ICON_UPLOAD} 전체 백업 가져오기</button>
            </div>
          </div>
          <div class="backup-section">
            <div class="backup-section-title">카테고리별 백업</div>
            <div class="backup-cat-list">${BACKUP_CATEGORIES.map(backupCategoryRowHtml).join("")}</div>
          </div>
          <div class="status backup-modal-status" id="backup-modal-status"></div>
          <input type="file" accept="application/json" id="backup-file-input" style="display:none;">
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = (e) => { if (e.target === overlay) closeBackupModal(); };
    document.getElementById("backup-modal-close-x").onclick = () => closeBackupModal();

    const fileInput = document.getElementById("backup-file-input");
    fileInput.onchange = async () => {
      const file = fileInput.files && fileInput.files[0];
      fileInput.value = "";
      if (!file) return;
      const restrict = backupImportRestrict;
      const restrictLabel = restrict
        ? ((BACKUP_CATEGORIES.find((c) => c.key === restrict) || {}).label || restrict)
        : "전체 데이터";
      let payload;
      try { payload = await readBackupFile(file); }
      catch (e) { flashBackupStatus("파일을 읽을 수 없어요. 올바른 백업 JSON 파일인지 확인해주세요.", true); return; }
      const proceed = window.confirm(
        `"${restrictLabel}" 데이터를 이 백업 파일 내용으로 덮어쓸까요?\n(지금 로그인한 계정 "${CURRENT_ACCOUNT_NAME}"에만 적용되고, 다른 계정에는 영향이 없어요)`
      );
      if (!proceed) return;
      flashBackupStatus("가져오는 중…");
      const result = await applyBackupPayload(payload, restrict);
      if (!result.ok) { flashBackupStatus(result.reason, true); return; }
      flashBackupStatus(`${result.count}개 항목을 가져왔어요. 화면을 새로고침할게요…`);
      setTimeout(() => location.reload(), 700);
    };

    document.getElementById("backup-export-all").onclick = () => downloadBackup("all");
    document.getElementById("backup-import-all").onclick = () => {
      backupImportRestrict = null;
      fileInput.click();
    };
    overlay.querySelectorAll("[data-backup-export]").forEach((btn) => {
      btn.onclick = () => downloadBackup(btn.getAttribute("data-backup-export"));
    });
    overlay.querySelectorAll("[data-backup-import]").forEach((btn) => {
      btn.onclick = () => {
        backupImportRestrict = btn.getAttribute("data-backup-import");
        fileInput.click();
      };
    });
  }

