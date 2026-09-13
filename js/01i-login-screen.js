  // ==================== 로그인 화면 렌더링 ====================
  // (예전 01-common.js에서 분리됨 — 실행 순서·내용은 그대로입니다)
  function renderLoginScreen() {
    // 안전장치: 혹시라도(예: 브라우저의 뒤로가기/앞으로가기 캐시 복원처럼 스크립트가
    // 다시 실행되지 않는 특수한 경우) 이전 화면에서 뜨던 팝업류(드롭다운/날짜·시간
    // 선택 팝업, 설정 메뉴, 동기화 배너)가 화면 위에 그대로 남아있으면, 그 투명한
    // 영역이 로그인 폼 위를 덮어서 클릭·입력이 먹히지 않는 것처럼 보일 수 있다.
    // 로그인 화면을 그리기 전에 이런 잔재를 먼저 확실히 치운다.
    if (typeof closeAllAppFloatingMenus === "function") { try { closeAllAppFloatingMenus(); } catch (e) {} }
    const staleOverlayIds = ["settings-menu", "cloud-live-banner-wrap"];
    staleOverlayIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
    const nav = document.getElementById("nav");
    if (nav) nav.innerHTML = "";
    document.body.classList.add("login-screen");
    const root = document.getElementById("page-inner");
    root.classList.remove("wide");
    // uiState.loginStep: "id"(아이디만 입력) → "auth"(팀용이면 인원 선택+비밀번호, 개인용이면 비밀번호만)
    const uiState = {
      tab: loadAccounts().length ? "login" : "signup", error: "",
      loginStep: "id", loginAccount: null, signupType: "personal",
    };

    function resetLoginStep() { uiState.loginStep = "id"; uiState.loginAccount = null; }

    function draw() {
      const accounts = loadAccounts();
      const hasMaster = accounts.some((a) => a.isMaster);
      const loginAcc = uiState.loginAccount;
      const isTeamLogin = !!loginAcc && loginAcc.accountType === "team";
      const teamMembers = isTeamLogin && Array.isArray(loginAcc.teamMembers) ? loginAcc.teamMembers : [];
      root.innerHTML = `
        <div class="login-shell">
          <div class="login-card">
            <div class="login-badge">${ICON_LOCK}</div>
            <div class="login-title">업무 종합 관리</div>
            <div class="login-tabs">
              <button class="login-tab ${uiState.tab === "login" ? "active" : ""}" data-tab="login">로그인</button>
              <button class="login-tab ${uiState.tab === "signup" ? "active" : ""}" data-tab="signup">계정 만들기</button>
            </div>
            ${uiState.error ? `<div class="login-error">${esc(uiState.error)}</div>` : ""}
            ${uiState.tab === "login" ? (
              uiState.loginStep === "id" ? `
                <form class="login-form" id="login-id-form">
                  <label class="login-field"><span>아이디</span>
                    <input class="add-input" id="login-username" autocomplete="username" placeholder="아이디">
                  </label>
                  <button type="submit" class="primary-btn login-submit">로그인</button>
                </form>
              ` : `
                <button type="button" class="login-back-link" id="login-back-btn">← 다른 계정으로</button>
                <div class="login-selected-account">
                  <b>${esc(loginAcc.username)}</b>${isTeamLogin ? ' <span class="badge sm type">팀용</span>' : ""}
                </div>
                <form class="login-form" id="login-auth-form">
                  ${isTeamLogin ? `
                    <label class="login-field"><span>로그인 인원</span>
                      <select class="add-input" id="login-member" ${!teamMembers.length ? "disabled" : ""}>
                        <option value="">${teamMembers.length ? "선택해주세요" : "등록된 인원이 없어요"}</option>
                        ${teamMembers.map((m) => `<option value="${esc(m.id)}">${esc(m.name)}</option>`).join("")}
                      </select>
                    </label>
                    ${!teamMembers.length ? `<div class="login-accounts-hint">아직 등록된 로그인 인원이 없어요. 마스터 계정에서 먼저 추가해달라고 해주세요.</div>` : ""}
                  ` : ""}
                  <label class="login-field"><span>비밀번호</span>
                    <input class="add-input" id="login-password" type="password" autocomplete="current-password" placeholder="비밀번호">
                  </label>
                  <button type="submit" class="primary-btn login-submit" ${isTeamLogin && !teamMembers.length ? "disabled" : ""}>로그인</button>
                </form>
              `
            ) : `
              <form class="login-form" id="signup-form">
                <label class="login-field"><span>아이디</span>
                  <input class="add-input" id="signup-username" autocomplete="username" placeholder="아이디">
                </label>
                <label class="login-field"><span>계정 유형</span>
                  <div class="login-type-radios">
                    <label class="login-type-radio"><input type="radio" name="signup-type" value="personal" ${uiState.signupType === "team" ? "" : "checked"}> 개인용</label>
                    <label class="login-type-radio"><input type="radio" name="signup-type" value="team" ${uiState.signupType === "team" ? "checked" : ""}> 팀용</label>
                  </div>
                  ${uiState.signupType === "team" ? `<span class="login-master-hint">팀용은 여러 명이 비밀번호 하나를 같이 쓰고, 로그인할 때 인원만 골라요. 로그인 인원은 나중에 마스터 계정에서 추가할 수 있어요.</span>` : ""}
                </label>
                <label class="login-field"><span>비밀번호</span>
                  <input class="add-input" id="signup-password" type="password" autocomplete="new-password" placeholder="비밀번호 (4자 이상)">
                </label>
                <label class="login-field"><span>비밀번호 확인</span>
                  <input class="add-input" id="signup-password2" type="password" autocomplete="new-password" placeholder="비밀번호 확인">
                </label>
                ${!hasMaster ? `
                  <label class="login-master-check">
                    <input type="checkbox" id="signup-master">
                    <span>이 계정을 마스터 계정으로 만들기 <span class="login-master-hint">(마스터 계정은 다른 모든 계정을 선택해서 들어가보고, 삭제할 수 있어요. 아직 마스터 계정이 없어서 지금만 선택할 수 있어요.)</span></span>
                  </label>
                ` : ""}
                <button type="submit" class="primary-btn login-submit">계정 만들고 시작하기</button>
              </form>
            `}
          </div>
        </div>
      `;

      root.querySelectorAll("[data-tab]").forEach((btn) => {
        btn.onclick = () => { uiState.tab = btn.getAttribute("data-tab"); uiState.error = ""; resetLoginStep(); draw(); };
      });

      const backBtn = document.getElementById("login-back-btn");
      if (backBtn) {
        backBtn.onclick = () => { uiState.error = ""; resetLoginStep(); draw(); };
      }

      // 단계가 바뀔 때마다(아이디 입력→인증 단계) 커서를 직접 옮길 필요 없이 바로
      // 입력할 수 있게, 지금 단계에 맞는 입력칸에 자동으로 포커스를 준다.
      if (uiState.tab === "login") {
        if (uiState.loginStep === "id") {
          const usernameField = document.getElementById("login-username");
          if (usernameField) usernameField.focus();
        } else {
          const memberSelect = document.getElementById("login-member");
          if (memberSelect) enhanceSelect(memberSelect);
          const memberTrigger = document.getElementById("login-member-trigger");
          const passwordField = document.getElementById("login-password");
          if (isTeamLogin && memberSelect && !memberSelect.value) {
            // 팀용 계정: 인원을 먼저 골라야 하니 인원 선택 버튼에 포커스해두고,
            // 인원을 고르는 순간 바로 비밀번호 칸으로 넘어가게 한다.
            if (memberTrigger) memberTrigger.focus();
          } else if (passwordField) {
            passwordField.focus();
          }
          if (memberSelect) {
            memberSelect.addEventListener("change", () => {
              if (memberSelect.value && passwordField) passwordField.focus();
            });
          }
        }
      }

      const loginIdForm = document.getElementById("login-id-form");
      if (loginIdForm) {
        loginIdForm.onsubmit = (e) => {
          e.preventDefault();
          const username = document.getElementById("login-username").value.trim();
          if (!username) { uiState.error = "아이디를 입력해주세요."; draw(); return; }
          const account = findAccountByUsername(username);
          if (!account) { uiState.error = "등록된 계정이 없어요."; draw(); return; }
          uiState.loginAccount = account;
          uiState.loginStep = "auth";
          uiState.error = "";
          draw();
        };
      }

      const loginAuthForm = document.getElementById("login-auth-form");
      if (loginAuthForm) {
        loginAuthForm.onsubmit = async (e) => {
          e.preventDefault();
          const account = uiState.loginAccount;
          if (!account) { resetLoginStep(); draw(); return; }
          let member = null;
          if (account.accountType === "team") {
            const memberSelect = document.getElementById("login-member");
            const memberId = memberSelect ? memberSelect.value : "";
            if (!memberId) { uiState.error = "로그인 인원을 선택해주세요."; draw(); return; }
            member = (Array.isArray(account.teamMembers) ? account.teamMembers : []).find((m) => m.id === memberId) || null;
            if (!member) { uiState.error = "로그인 인원을 다시 선택해주세요."; draw(); return; }
          }
          const password = document.getElementById("login-password").value;
          if (!password) { uiState.error = "비밀번호를 입력해주세요."; draw(); return; }
          const check = await verifyAndMaybeUpgradePassword(account, password);
          if (!check.ok) {
            uiState.error = "아이디 또는 비밀번호가 올바르지 않아요.";
            draw();
            return;
          }
          // 로컬 확인을 통과했으니, 이제 Supabase Auth 세션을 만든다(=서버가
          // 인정하는 로그인 토큰 발급). 이게 있어야 이후 kv_store 읽기/쓰기가
          // (강화된 RLS 아래에서) 정상적으로 동작한다. 아래 해시 업그레이드
          // 저장도 이 세션이 있어야 클라우드에 반영되므로, 반드시 이 세션을
          // 먼저 확보한 뒤에 저장한다.
          const cloudAuth = await cloudAuthSignInForAccount(account);
          if (!cloudAuth.ok) {
            uiState.error = `클라우드 연결에 실패했어요. 인터넷 연결을 확인한 뒤 다시 시도해주세요. (${cloudAuth.reason})`;
            draw();
            return;
          }
          if (check.upgrade) {
            const list = loadAccounts();
            const idx = list.findIndex((a) => a.id === account.id);
            if (idx !== -1) { list[idx] = { ...list[idx], ...check.upgrade }; saveAccounts(list); }
          }
          setSession(account.id);
          setTeamLoginMember(member ? { id: member.id, name: member.name } : null);
          touchLastActive();
          try { sessionStorage.setItem("app:just-logged-in", "1"); } catch (e) {}
          await flushCloudWrites();
          location.reload();
        };
      }
      const signupForm = document.getElementById("signup-form");
      if (signupForm) {
        root.querySelectorAll('input[name="signup-type"]').forEach((radio) => {
          radio.onchange = () => { uiState.signupType = radio.value; draw(); };
        });
        signupForm.onsubmit = async (e) => {
          e.preventDefault();
          const username = document.getElementById("signup-username").value.trim();
          const password = document.getElementById("signup-password").value;
          const password2 = document.getElementById("signup-password2").value;
          if (!username || !password) { uiState.error = "아이디와 비밀번호를 입력해주세요."; draw(); return; }
          if (password.length < 4) { uiState.error = "비밀번호는 4자 이상으로 만들어주세요."; draw(); return; }
          if (password !== password2) { uiState.error = "비밀번호 확인이 일치하지 않아요."; draw(); return; }
          if (findAccountByUsername(username)) { uiState.error = "이미 사용 중인 아이디예요."; draw(); return; }
          // 로컬 계정을 만들기 전에 먼저 Supabase Auth 쪽에 가입해서 세션을 만든다.
          // 여기서 실패하면(예: 인터넷 연결 문제) 로컬 계정도 만들지 않는다 — 둘이
          // 어긋나면 다음 로그인부터 곤란해지기 때문.
          const cloudAuthSecret = genCloudAuthSecret();
          const cloudAuth = await cloudAuthSignUp(username, cloudAuthSecret);
          if (!cloudAuth.ok) {
            uiState.error = `클라우드 연결에 실패해서 계정을 만들지 못했어요. 인터넷 연결을 확인한 뒤 다시 시도해주세요. (${cloudAuth.reason})`;
            draw();
            return;
          }
          const accountsList = loadAccounts();
          const wantsMaster = !accountsList.some((a) => a.isMaster) && !!document.getElementById("signup-master") && document.getElementById("signup-master").checked;
          const typeInput = document.querySelector('input[name="signup-type"]:checked');
          const accountType = typeInput && typeInput.value === "team" ? "team" : "personal";
          const passwordRecord = await makeNewPasswordRecord(password);
          const newAccount = {
            id: genId(), username, ...passwordRecord, cloudAuthSecret, createdAt: new Date().toISOString(), isMaster: wantsMaster,
            accountType, teamMembers: accountType === "team" ? [] : undefined,
          };
          accountsList.push(newAccount);
          saveAccounts(accountsList);
          setSession(newAccount.id);
          clearTeamLoginMember();
          touchLastActive();
          try { sessionStorage.setItem("app:just-logged-in", "1"); } catch (e) {}
          await flushCloudWrites();
          location.reload();
        };
      }
    }

    draw();
  }

