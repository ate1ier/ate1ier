  function renderMasterPage(root) {
    if (!CURRENT_ACCOUNT_IS_MASTER) { setPage("home"); return; }
    const uiState = { resettingId: null, renamingId: null, error: "", renameError: "" };

    function draw() {
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
        <div class="agent-list-header">
          <div class="agent-list-title">계정 관리</div>
        </div>
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

    draw();
  }

  /* ===================== 사용설명서 팝업 (PPT처럼 옆으로 넘겨보기) ===================== */
  const manualUi = { index: 0, dir: "next" };
  let manualKeyHandler = null;

