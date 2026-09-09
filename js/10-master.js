  function renderMasterPage(root) {
    if (!CURRENT_ACCOUNT_IS_MASTER) { setPage("home"); return; }
    const uiState = {
      tab: "accounts", resettingId: null, renamingId: null, error: "", renameError: "",
      logAccountFilter: "all", expandedLogIds: new Set(),
      backupList: null, backupLoading: false, expandedBackupDates: new Set(),
    };

    function draw() {
      root.innerHTML = `
        <div class="agent-list-header">
          <div class="agent-list-title">마스터 계정 관리</div>
        </div>
        <div class="login-tabs" style="max-width:420px; margin-bottom:16px;">
          <button type="button" class="login-tab ${uiState.tab === "accounts" ? "active" : ""}" data-master-tab="accounts">계정 관리</button>
          <button type="button" class="login-tab ${uiState.tab === "activity" ? "active" : ""}" data-master-tab="activity">활동 로그</button>
          <button type="button" class="login-tab ${uiState.tab === "backups" ? "active" : ""}" data-master-tab="backups">자동 백업</button>
          <button type="button" class="login-tab ${uiState.tab === "notify" ? "active" : ""}" data-master-tab="notify">디스코드 알림</button>
        </div>
        <div id="master-tab-body"></div>
      `;
      root.querySelectorAll("[data-master-tab]").forEach((btn) => {
        btn.onclick = () => { uiState.tab = btn.getAttribute("data-master-tab"); draw(); };
      });
      const body = document.getElementById("master-tab-body");
      if (uiState.tab === "activity") drawActivityLog(body);
      else if (uiState.tab === "backups") drawBackups(body);
      else if (uiState.tab === "notify") drawNotifySettings(body);
      else drawAccounts(body);
    }

    // ----- 디스코드 알림 탭: 계정별로 디스코드 알림을 받을지 토글로 켜고 끈다 -----
    // 기본은 전부 "제한"이고, 허용으로 켠 계정에만 알림이 간다(여러 계정 동시 허용 가능).
    function drawNotifySettings(root) {
      const accounts = loadAccounts().slice().sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""));
      const settings = loadDiscordNotifySettings();
      const rows = accounts.map((a) => {
        const allowed = settings[a.id] === true;
        return `
          <div class="agent-row master-account-row">
            <div class="agent-row-main" style="cursor:default;">
              <span class="agent-row-name">${esc(a.username)}${a.isMaster ? ' <span class="badge sm master">마스터</span>' : ""}</span>
              <span class="agent-row-ldap">${allowed ? "이 계정의 일정·할일 알림이 디스코드로 전송돼요." : "디스코드 알림이 제한되어 있어요."}</span>
            </div>
            <div class="agent-row-badges">
              <label class="notify-toggle">
                <input type="checkbox" data-notify-toggle="${a.id}" ${allowed ? "checked" : ""}>
                <span class="notify-toggle-track"><span class="notify-toggle-thumb"></span></span>
                <span class="notify-toggle-label">${allowed ? "허용" : "제한"}</span>
              </label>
            </div>
          </div>
        `;
      }).join("");
      const allowedCount = accounts.filter((a) => settings[a.id] === true).length;
      root.innerHTML = `
        <div class="agent-summary">
          디스코드 알림 웹훅은 이제 계정별로 켜고 끌 수 있어요. 기본값은 전부 "제한"이고, 여기서 "허용"으로 켠 계정의
          일정·할일만 디스코드로 알림이 가요(여러 계정을 동시에 허용해도 돼요). 지금 ${accounts.length}개 계정 중 ${allowedCount}개 허용 중.
        </div>
        <div class="status" id="notify-status"></div>
        <div class="agent-list">${rows || `<div class="agent-list-empty">등록된 계정이 없어요.</div>`}</div>
      `;
      const statusEl = document.getElementById("notify-status");
      function flash(msg) {
        if (!statusEl) return;
        statusEl.textContent = msg;
        setTimeout(() => { if (statusEl.textContent === msg) statusEl.textContent = ""; }, 2200);
      }
      root.querySelectorAll("[data-notify-toggle]").forEach((input) => {
        input.onchange = () => {
          const id = input.getAttribute("data-notify-toggle");
          const target = accounts.find((a) => a.id === id);
          const nextAllowed = input.checked;
          setDiscordNotifyAllowed(id, nextAllowed);
          draw();
          flash(`"${target ? target.username : ""}" 계정 알림을 ${nextAllowed ? "허용" : "제한"}으로 바꿨어요.`);
        };
      });
    }

    function drawAccounts(root) {
      const accounts = loadAccounts().slice().sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""));
      const rows = accounts.map((a) => {
        const isSelf = a.id === CURRENT_ACCOUNT_ID;
        const created = a.createdAt ? esc(a.createdAt.slice(0, 10)) : "-";
        const isResetting = uiState.resettingId === a.id;
        const isRenaming = uiState.renamingId === a.id;
        return `
          <div class="agent-row master-account-row">
            <div class="agent-row-main" style="cursor:default;">
              <span class="agent-row-name">${esc(a.username)}${a.isMaster ? ' <span class="badge sm master">마스터</span>' : ""}${isSelf ? ' <span class="badge sm working">현재 로그인 중</span>' : ""}</span>
              <span class="agent-row-ldap">가입일 ${created}</span>
            </div>
            <div class="agent-row-badges">
              <button class="ghost-btn ${isRenaming ? "active" : ""}" data-action="master-rename" data-id="${a.id}">${isRenaming ? "취소" : "이름 수정"}</button>
              <button class="ghost-btn ${isResetting ? "active" : ""}" data-action="master-reset" data-id="${a.id}">${isResetting ? "취소" : "비밀번호 초기화"}</button>
              <button class="ghost-btn" data-action="master-enter" data-id="${a.id}" ${isSelf ? "disabled" : ""}>이 계정으로 들어가기</button>
              <button class="ghost-btn danger" data-action="master-delete" data-id="${a.id}" ${isSelf ? "disabled" : ""}>삭제</button>
            </div>
            ${isRenaming ? `
              <form class="login-form master-rename-form" data-rename-form="${a.id}" style="width:100%; margin-top:10px;">
                <label class="login-field"><span>새 계정 이름</span>
                  <input class="add-input" id="rename-username-${a.id}" type="text" autocomplete="off" placeholder="계정 이름" value="${esc(a.username)}">
                </label>
                ${uiState.renameError ? `<div class="login-error">${esc(uiState.renameError)}</div>` : ""}
                <button type="submit" class="primary-btn login-submit">이름 저장</button>
              </form>
            ` : ""}
            ${isResetting ? `
              <form class="login-form master-reset-form" data-reset-form="${a.id}" style="width:100%; margin-top:10px;">
                <label class="login-field"><span>새 비밀번호</span>
                  <input class="add-input" id="reset-password-${a.id}" type="password" autocomplete="new-password" placeholder="비밀번호 (4자 이상)">
                </label>
                <label class="login-field"><span>새 비밀번호 확인</span>
                  <input class="add-input" id="reset-password2-${a.id}" type="password" autocomplete="new-password" placeholder="비밀번호 확인">
                </label>
                ${uiState.error ? `<div class="login-error">${esc(uiState.error)}</div>` : ""}
                <button type="submit" class="primary-btn login-submit">비밀번호 저장</button>
              </form>
            ` : ""}
          </div>
        `;
      }).join("");
      root.innerHTML = `
        <div class="agent-summary">마스터 계정으로 다른 계정을 선택해서 들어가보거나, 비밀번호를 초기화하거나, 필요 없는 계정을 삭제할 수 있어요. 총 ${accounts.length}개 계정.</div>
        <div class="status" id="master-status"></div>
        <div class="agent-list">${rows || `<div class="agent-list-empty">등록된 계정이 없어요.</div>`}</div>
      `;
      const statusEl = document.getElementById("master-status");
      function flash(msg) {
        if (!statusEl) return;
        statusEl.textContent = msg;
        setTimeout(() => { if (statusEl.textContent === msg) statusEl.textContent = ""; }, 2200);
      }
      root.querySelectorAll("[data-action='master-enter']").forEach((btn) => {
        btn.onclick = () => masterEnterAccount(btn.getAttribute("data-id"));
      });
      root.querySelectorAll("[data-action='master-delete']").forEach((btn) => {
        btn.onclick = () => {
          const id = btn.getAttribute("data-id");
          const target = accounts.find((a) => a.id === id);
          if (!target) return;
          if (!window.confirm(`"${target.username}" 계정을 정말 삭제할까요? 이 계정의 데이터도 함께 지워지고, 되돌릴 수 없어요.`)) return;
          const result = deleteAccount(id);
          if (!result.ok) { flash(result.reason || "삭제하지 못했어요."); return; }
          draw();
        };
      });
      root.querySelectorAll("[data-action='master-reset']").forEach((btn) => {
        btn.onclick = () => {
          const id = btn.getAttribute("data-id");
          uiState.error = "";
          uiState.resettingId = uiState.resettingId === id ? null : id;
          draw();
        };
      });
      root.querySelectorAll("[data-action='master-rename']").forEach((btn) => {
        btn.onclick = () => {
          const id = btn.getAttribute("data-id");
          uiState.renameError = "";
          uiState.renamingId = uiState.renamingId === id ? null : id;
          draw();
        };
      });
      root.querySelectorAll("[data-rename-form]").forEach((form) => {
        form.onsubmit = (e) => {
          e.preventDefault();
          const id = form.getAttribute("data-rename-form");
          const newUsername = document.getElementById(`rename-username-${id}`).value;
          const result = renameAccount(id, newUsername);
          if (!result.ok) { uiState.renameError = result.reason || "이름을 바꾸지 못했어요."; draw(); return; }
          uiState.renamingId = null;
          uiState.renameError = "";
          if (id === CURRENT_ACCOUNT_ID) { location.reload(); return; }
          draw();
          flash(`계정 이름을 "${newUsername.trim()}"(으)로 바꿨어요.`);
        };
      });
      root.querySelectorAll("[data-reset-form]").forEach((form) => {
        form.onsubmit = async (e) => {
          e.preventDefault();
          const id = form.getAttribute("data-reset-form");
          const target = accounts.find((a) => a.id === id);
          const pw1 = document.getElementById(`reset-password-${id}`).value;
          const pw2 = document.getElementById(`reset-password2-${id}`).value;
          if (pw1 !== pw2) { uiState.error = "비밀번호 확인이 일치하지 않아요."; draw(); return; }
          const result = await resetAccountPassword(id, pw1);
          if (!result.ok) { uiState.error = result.reason || "비밀번호를 초기화하지 못했어요."; draw(); return; }
          uiState.resettingId = null;
          uiState.error = "";
          draw();
          flash(`"${target ? target.username : ""}" 계정의 비밀번호를 초기화했어요.`);
        };
      });
    }

    // ----- 활동 로그 탭: 계정별 데이터 변경 이력을 간단한 목록으로 보여준다 -----
    function drawActivityLog(root) {
      const entries = loadActivityLog();
      const accounts = loadAccounts();
      const accountNameOf = (id) => { const a = accounts.find((x) => x.id === id); return a ? a.username : null; };

      const accountOptionsMap = {};
      entries.forEach((e) => {
        if (!accountOptionsMap[e.accountId]) accountOptionsMap[e.accountId] = accountNameOf(e.accountId) || e.accountName || e.accountId;
      });
      const accountOptions = Object.keys(accountOptionsMap)
        .map((id) => ({ id, name: accountOptionsMap[id] }))
        .sort((a, b) => a.name.localeCompare(b.name, "ko"));

      const filtered = uiState.logAccountFilter === "all"
        ? entries
        : entries.filter((e) => e.accountId === uiState.logAccountFilter);

      const shown = filtered.slice(0, 200);
      const rows = shown.map((e) => {
        const isExpanded = uiState.expandedLogIds.has(e.id);
        const startLabel = e.at ? esc(formatKSTDateTime(e.at)) : "-";
        const endLabel = e.endedAt ? esc(formatKSTTime(e.endedAt)) : "";
        const dt = endLabel && endLabel !== startLabel.slice(-5) ? `${startLabel} ~ ${endLabel}` : startLabel;
        const whereLabel = esc(e.subLabel ? `${e.categoryLabel} · ${e.subLabel}` : (e.categoryLabel || "기타"));
        return `
          <div class="interview-row ${isExpanded ? "expanded" : ""}">
            <div class="interview-row-top" data-action="toggle-log-row" data-id="${e.id}">
              <span class="interview-row-chevron">${ICON_CHEVRON_RIGHT}</span>
              <span class="interview-date">${dt}</span>
              <span class="agent-row-name">${esc(e.accountName || "(삭제된 계정)")}</span>
              ${e.viaMasterName ? `<span class="badge sm master">마스터: ${esc(e.viaMasterName)}</span>` : ""}
              <span class="badge sm working">${whereLabel}</span>
            </div>
            ${isExpanded ? `
              <div class="interview-row-body">
                ${(e.diff && e.diff.length) ? e.diff.map((d) => `<div class="interview-content">${esc(d)}</div>`).join("") : `<div class="interview-content">세부 내용이 없어요.</div>`}
              </div>
            ` : ""}
          </div>
        `;
      }).join("");

      root.innerHTML = `
        <div class="agent-summary">
          각 계정에서 데이터가 바뀔 때마다 자동으로 기록돼요(시각은 한국 표준시 기준). 목록을 누르면 자세한 변경 내용을 볼 수 있어요.
          ${ACTIVITY_LOG_RETENTION_DAYS}일 지난 로그는 자동으로 정리돼요. 총 ${filtered.length}건${filtered.length > shown.length ? ` (최근 ${shown.length}건만 표시)` : ""}.
        </div>
        <div style="display:flex; gap:8px; align-items:center; margin-bottom:14px; flex-wrap:wrap;">
          <select class="agent-sort-select" id="log-account-filter">
            <option value="all" ${uiState.logAccountFilter === "all" ? "selected" : ""}>전체 계정</option>
            ${accountOptions.map((a) => `<option value="${esc(a.id)}" ${uiState.logAccountFilter === a.id ? "selected" : ""}>${esc(a.name)}</option>`).join("")}
          </select>
          ${entries.length ? `<button type="button" class="ghost-btn danger" id="log-clear-btn">로그 전체 지우기</button>` : ""}
        </div>
        <div class="interview-list">${rows || `<div class="agent-list-empty">${entries.length ? "이 계정에는 아직 활동 기록이 없어요." : "아직 쌓인 활동 기록이 없어요."}</div>`}</div>
      `;

      const filterEl = document.getElementById("log-account-filter");
      if (filterEl) filterEl.onchange = () => { uiState.logAccountFilter = filterEl.value; draw(); };

      const clearBtn = document.getElementById("log-clear-btn");
      if (clearBtn) {
        clearBtn.onclick = () => {
          if (!window.confirm("모든 계정의 활동 로그를 전부 지울까요? 되돌릴 수 없어요.")) return;
          clearActivityLog();
          uiState.expandedLogIds.clear();
          draw();
        };
      }

      root.querySelectorAll("[data-action='toggle-log-row']").forEach((row) => {
        row.onclick = () => {
          const id = row.getAttribute("data-id");
          if (uiState.expandedLogIds.has(id)) uiState.expandedLogIds.delete(id);
          else uiState.expandedLogIds.add(id);
          draw();
        };
      });
    }

    // ----- 자동 백업 탭: 매일 자정 이후 자동으로 남겨진 스냅샷 목록 -----
    function drawBackups(root) {
      if (uiState.backupList === null && !uiState.backupLoading) {
        uiState.backupLoading = true;
        fetchBackupList().then((list) => {
          uiState.backupList = list;
          uiState.backupLoading = false;
          if (uiState.tab === "backups") draw();
        });
      }
      if (uiState.backupLoading) {
        root.innerHTML = `<div class="agent-summary">불러오는 중…</div>`;
        return;
      }
      const list = uiState.backupList || [];
      const rows = list.map((day) => {
        const isExpanded = uiState.expandedBackupDates.has(day.date);
        const accountRows = Object.keys(day.accounts).map((accountId) => {
          const acc = day.accounts[accountId];
          const cats = (acc.categories || []).map((c) => `
            <button type="button" class="badge sm working" style="cursor:pointer; border:none;" data-backup-cat-download="${esc(accountId)}|${esc(c.key)}|${esc(day.date)}">${esc(c.label)} ⬇</button>
          `).join(" ");
          return `
            <div class="agent-row master-account-row" style="padding:10px 14px;">
              <div class="agent-row-main" style="cursor:default;">
                <span class="agent-row-name">${esc(acc.accountName || "(삭제된 계정)")}</span>
                <span class="agent-row-ldap">그날 바뀐 항목만 개별 다운로드</span>
              </div>
              <div class="agent-row-badges" style="flex-wrap:wrap;">${cats || `<span class="agent-row-ldap">-</span>`}</div>
            </div>
          `;
        }).join("");
        return `
          <div class="interview-row ${isExpanded ? "expanded" : ""}">
            <div class="interview-row-top" data-action="toggle-backup-date" data-date="${esc(day.date)}">
              <span class="interview-row-chevron">${ICON_CHEVRON_RIGHT}</span>
              <span class="interview-date">${esc(day.date)}</span>
              <span class="badge sm working">변경 있던 계정 ${Object.keys(day.accounts).length}개</span>
              ${day.all ? `<button type="button" class="ghost-btn" style="margin-left:auto;" data-backup-all-download="${esc(day.date)}">${ICON_BACKUP} 전체 백업 다운로드</button>` : ""}
            </div>
            ${isExpanded ? `
              <div class="interview-row-body">
                ${accountRows || `<div class="agent-list-empty">이 날짜에는 변경이 있던 계정이 없어요.</div>`}
              </div>
            ` : ""}
          </div>
        `;
      }).join("");

      root.innerHTML = `
        <div class="agent-summary">
          자정이 지난 뒤 처음 접속이 있을 때, 어제 하루치 데이터를 자동으로 스냅샷으로 남겨요.
          매일 "전체 백업"이 하나씩 쌓이고, 그날 실제로 뭔가를 바꾼 계정이 있으면 그 계정의 바뀐 항목만 따로도 받을 수 있어요.
          최근 ${BACKUP_RETENTION_DAYS}일치만 보관되고 그 이전은 자동으로 정리돼요.
        </div>
        <div class="interview-list">${rows || `<div class="agent-list-empty">아직 쌓인 자동 백업이 없어요. (자정이 한 번 지나야 첫 백업이 생겨요)</div>`}</div>
      `;

      root.querySelectorAll("[data-action='toggle-backup-date']").forEach((row) => {
        row.onclick = () => {
          const date = row.getAttribute("data-date");
          if (uiState.expandedBackupDates.has(date)) uiState.expandedBackupDates.delete(date);
          else uiState.expandedBackupDates.add(date);
          draw();
        };
      });
      root.querySelectorAll("[data-backup-all-download]").forEach((btn) => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const date = btn.getAttribute("data-backup-all-download");
          const day = list.find((d) => d.date === date);
          if (!day || !day.all) return;
          downloadJsonPayload(day.all, `자동백업_전체_${date}.json`);
        };
      });
      root.querySelectorAll("[data-backup-cat-download]").forEach((btn) => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const [accountId, catKey, date] = btn.getAttribute("data-backup-cat-download").split("|");
          const day = list.find((d) => d.date === date);
          const acc = day && day.accounts[accountId];
          const payload = acc && acc.catData && acc.catData[catKey];
          if (!payload) return;
          downloadJsonPayload(payload, `자동백업_${sanitizeFilenamePart(payload.accountName || accountId)}_${sanitizeFilenamePart(payload.categoryLabel || catKey)}_${date}.json`);
        };
      });
    }
    function downloadJsonPayload(payload, filename) {
      const json = JSON.stringify(payload, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    draw();
  }

  /* ===================== 사용설명서 팝업 (PPT처럼 옆으로 넘겨보기) ===================== */
  const manualUi = { index: 0, dir: "next" };
  let manualKeyHandler = null;

