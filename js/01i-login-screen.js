  // ==================== 로그인 화면 렌더링 ====================
  // (예전 01-common.js에서 분리됨 — 실행 순서·내용은 그대로입니다)
  async function renderLoginScreen() {
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

    // 2026-09 보안 업데이트: 로그인 화면은 더 이상 계정 목록을 직접 읽지 않고
    // (비밀번호 관련 값이 전혀 없는) 안전한 서버 함수로 필요한 정보만 물어본다.
    // 자세한 배경은 supabase/auth-lockdown-migration.sql 참고.
    root.innerHTML = `<div class="login-shell"><div class="login-card login-loading">${ICON_LOCK}<div class="login-loading-text">불러오는 중…</div></div></div>`;
    let bootstrap = { hasAnyAccount: false, hasMaster: false };
    if (cloud) {
      try {
        const { data } = await cloud.rpc("get_login_bootstrap");
        if (data) bootstrap = data;
      } catch (e) { /* 오프라인 등으로 실패하면 기본값(계정 없음)으로 "계정 만들기" 탭을 먼저 보여줌 */ }
    }

    // uiState.loginStep: "id"(아이디만 입력) → "auth"(팀용이면 인원 선택+비밀번호, 개인용이면 비밀번호만)
    const uiState = {
      tab: bootstrap.hasAnyAccount ? "login" : "signup", error: "",
      loginStep: "id", loginAccount: null, signupType: "personal",
      hasMaster: !!bootstrap.hasMaster, checkingId: false,
    };

    function resetLoginStep() { uiState.loginStep = "id"; uiState.loginAccount = null; }

    function draw() {
      const hasMaster = uiState.hasMaster;
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
                  <button type="submit" class="primary-btn login-submit" ${uiState.checkingId ? "disabled" : ""}>${uiState.checkingId ? "확인 중…" : "로그인"}</button>
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
        loginIdForm.onsubmit = async (e) => {
          e.preventDefault();
          const username = document.getElementById("login-username").value.trim();
          if (!username) { uiState.error = "아이디를 입력해주세요."; draw(); return; }
          if (!cloud) { uiState.error = "클라우드 연결이 필요해요. 인터넷 연결을 확인한 뒤 다시 시도해주세요."; draw(); return; }
          uiState.error = "";
          uiState.checkingId = true;
          draw();
          let info = null;
          try {
            const { data } = await cloud.rpc("get_login_account_info", { p_username: username });
            info = data || null;
          } catch (err) { /* 아래에서 "계정 없음"으로 처리 */ }
          uiState.checkingId = false;
          if (!info) { uiState.error = "등록된 계정이 없어요."; draw(); return; }
          uiState.loginAccount = info;
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

          // 아직 예전 방식으로 남아있는 계정이면, 이번 로그인에서 서버(Edge Function)가
          // 비밀번호를 한 번 확인하고 그 즉시 새 방식(사람 비밀번호 = 실제 로그인 비밀번호)으로
          // 전환해준다 — 비밀번호 해시는 이 과정에서 한 번도 브라우저 메모리 밖으로 나가지 않는다.
          if (!account.authMigrated) {
            const migrate = await cloudMigrateLegacyLogin(account.username, password);
            if (!migrate.ok) {
              uiState.error = /올바르지/.test(migrate.reason || "") ? "아이디 또는 비밀번호가 올바르지 않아요." : (migrate.reason || "로그인에 실패했어요.");
              draw();
              return;
            }
          }
          const cloudAuth = await cloudAuthSignInDirect(account.username, password);
          if (!cloudAuth.ok) {
            uiState.error = "아이디 또는 비밀번호가 올바르지 않아요.";
            draw();
            return;
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
          if (!cloud) { uiState.error = "클라우드 연결이 필요해요. 인터넷 연결을 확인한 뒤 다시 시도해주세요."; draw(); return; }
          try {
            const { data } = await cloud.rpc("get_login_account_info", { p_username: username });
            if (data) { uiState.error = "이미 사용 중인 아이디예요."; draw(); return; }
          } catch (err) { /* 확인 실패해도 가입 자체는 시도(가입 단계에서 중복이면 다시 걸러짐) */ }
          // 사람이 정한 비밀번호로 곧장 Supabase Auth에 가입한다(아래 계정을 만들기 전에
          // 먼저 해서, 여기서 실패하면 로컬 계정도 만들지 않는다 — 둘이 어긋나면 다음
          // 로그인부터 곤란해지기 때문).
          const cloudAuth = await cloudAuthSignUpDirect(username, password);
          if (!cloudAuth.ok) {
            uiState.error = `클라우드 연결에 실패해서 계정을 만들지 못했어요. 인터넷 연결을 확인한 뒤 다시 시도해주세요. (${cloudAuth.reason})`;
            draw();
            return;
          }
          // 이제 막 로그인 세션이 생겼으니, 다른 팀원들이 이미 만들어둔 계정 목록을 먼저
          // 서버에서 새로 받아온 뒤에(이 브라우저에 예전에 캐시된 게 없을 수 있으므로)
          // 내 계정을 추가해야, 저장할 때 다른 사람 계정을 실수로 지워버리지 않는다.
          if (typeof cloudHydrate === "function") { try { await cloudHydrate(); } catch (e) {} }
          const accountsList = loadAccounts();
          const wantsMaster = !uiState.hasMaster && !!document.getElementById("signup-master") && document.getElementById("signup-master").checked;
          const typeInput = document.querySelector('input[name="signup-type"]:checked');
          const accountType = typeInput && typeInput.value === "team" ? "team" : "personal";
          const newAccount = {
            id: genId(), username, createdAt: new Date().toISOString(), isMaster: wantsMaster,
            accountType, teamMembers: accountType === "team" ? [] : undefined,
            authMigrated: true,
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

