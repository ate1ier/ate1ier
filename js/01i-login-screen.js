  // ==================== 로그인 화면 렌더링 ====================
  // (예전 01-common.js에서 분리됨 — 실행 순서·내용은 그대로입니다)
  // 목업(macOS 잠금화면)과 같은 사람 모양 아바타 아이콘
  const LOGIN_AVATAR_ICON = `<svg viewBox="0 0 24 24" width="46" height="46" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>`;

  async function renderLoginScreen() {
    // 안전장치: 혹시라도(예: 브라우저의 뒤로가기/앞으로가기 캐시 복원처럼 스크립트가
    // 다시 실행되지 않는 특수한 경우) 이전 화면에서 뜨던 팝업류(드롭다운/날짜·시간
    // 선택 팝업, 설정 메뉴, 동기화 배너)가 화면 위에 그대로 남아있으면, 그 투명한
    // 영역이 로그인 폼 위를 덮어서 클릭·입력이 먹히지 않는 것처럼 보일 수 있다.
    // 로그인 화면을 그리기 전에 이런 잔재를 먼저 확실히 치운다.
    // 로그인 화면이 실제로 그려진다는 건 앱으로 못 들어왔다는 뜻이므로, 로그인 직후 표시(부팅
    // 덮개용 플래그)가 남아있지 않게 치운다(플래그는 부팅 초반에 이미 읽혔다).
    try { sessionStorage.removeItem("app:just-logged-in"); } catch (e) {}
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
    root.innerHTML = `<div class="login-shell"><div class="login-center"><div class="login-loading"><div class="login-avatar">${LOGIN_AVATAR_ICON}</div><div class="login-loading-text">불러오는 중…</div></div></div></div>`;
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
      username: "", memberId: "", shake: false, lastView: null, glideFrom: null, glideEls: null, glideTab: null,
    };

    // 목업처럼 큰 시계/날짜를 보여주고 계속 갱신한다. draw()가 화면을 통째로 다시
    // 그려도 매번 새로 찾아서 값만 바꾸고, 로그인 화면이 사라지면(요소가 없으면) 멈춘다.
    function tickLoginClock() {
      const t = document.querySelector(".login-time");
      const d = document.querySelector(".login-date");
      if (!t && !d) { clearInterval(loginClockTimer); return; }
      const now = new Date();
      if (t) t.textContent = now.toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit", hour12: false });
      if (d) d.textContent = now.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" });
    }
    if (window.__loginClockTimer) clearInterval(window.__loginClockTimer);
    const loginClockTimer = window.__loginClockTimer = setInterval(tickLoginClock, 5000);

    // 에러를 띄울 때는 목업처럼 입력 폼이 좌우로 흔들리게 한다.
    // 로그인/가입 성공 후 새로고침 직전에, 화면 내용을 스르륵 걷어내서 "툭" 끊기지 않게 한다.
    function leaveLoginScreen() {
      const shell = root.querySelector(".login-shell");
      if (shell) shell.classList.add("leaving");
      return new Promise((r) => setTimeout(r, 420));
    }
    function showError(msg) { uiState.error = msg; uiState.shake = !!msg; draw(); }

    function resetLoginStep() { uiState.loginStep = "id"; uiState.loginAccount = null; uiState.memberId = ""; }

    // 탭(로그인 ↔ 계정 생성)·단계(아이디 ↔ 비밀번호) 전환 애니메이션 — 목업의 go()와 같은 방식.
    // 1) 지금 내용(.login-body)을 현재 높이로 고정하고 위로 살짝 사라지게 한 뒤,
    // 2) 상태를 바꿔 다시 그리고, 새 내용은 아래(10px)에서 투명하게 시작해서
    // 3) 이전 높이 → 새 높이로 부드럽게 늘었다 줄면서 나타난다.
    // 전환 중에 또 눌리면 마지막 요청 하나만 기억했다가 끝난 뒤 이어서 실행한다.
    let stepBusy = false;
    let stepQueued = null;
    function animateLoginStepTransition(mutate) {
      if (stepBusy) { stepQueued = mutate; return; }
      const prev = root.querySelector(".login-body");
      if (!prev) { mutate(); draw(); return; }
      stepBusy = true;
      // 화면 전체를 다시 그리기 때문에, 시계 크기·위치와 하단 탭 강조가 "툭" 바뀌지 않게
      // 지금 값을 기억했다가 새로 그린 뒤 그 값에서 출발해 부드럽게 이어준다.
      const q = (sel) => root.querySelector(sel);
      const cs = (el, prop) => (el ? getComputedStyle(el)[prop] : null);
      const before = {
        clockMt: cs(q(".login-clock"), "marginTop"),
        timeFs: cs(q(".login-time"), "fontSize"),
        dateFs: cs(q(".login-date"), "fontSize"),
        dockPb: cs(q(".login-dock"), "paddingBottom"),
        tab: (q(".login-tab.active") || {}).dataset ? q(".login-tab.active").dataset.tab : null,
      };
      const prevHeight = prev.offsetHeight;
      prev.style.height = `${prevHeight}px`;
      prev.classList.add("an", "out");
      uiState.glideFrom = before;
      setTimeout(() => {
        mutate();
        draw();
        const next = root.querySelector(".login-body");
        if (!next) { stepBusy = false; return; }
        // draw()가 새 요소를 그리자마자(포커스 등으로 스타일이 확정되기 전에) 이전 값을 넣어뒀다.
        // 여기서 한 번 반영시킨 뒤 원래 값으로 되돌리면 transition으로 부드럽게 이어진다.
        const glide = uiState.glideEls || [];
        const tabFrom = uiState.glideTab || null;
        const activeNow = tabFrom ? root.querySelector(".login-tab[data-glide-to]") : null;
        const targetHeight = next.scrollHeight;
        next.style.height = `${prevHeight}px`;
        next.classList.add("an", "in");
        void next.offsetHeight; // 시작 값을 한 번 반영시켜야 transition으로 이어진다
        next.classList.remove("in");
        next.style.height = `${targetHeight}px`;
        glide.forEach(([el, prop]) => { el.style[prop] = ""; });
        if (tabFrom && activeNow) { tabFrom.classList.remove("active"); activeNow.classList.add("active"); activeNow.removeAttribute("data-glide-to"); }
        uiState.glideFrom = null; uiState.glideEls = null; uiState.glideTab = null;
        setTimeout(() => {
          next.style.height = "";
          next.classList.remove("an");
          stepBusy = false;
          if (stepQueued) { const f = stepQueued; stepQueued = null; animateLoginStepTransition(f); }
        }, 620);
      }, 220);
    }

    // 아이디로 계정을 찾은 뒤(인증 단계)에는 그 사람 이름의 첫 글자를 아바타에
    // 보여주고, 이름마다 다른 색이 나오게 이름 문자코드 합으로 색상을 정한다.
    function loginAvatarHue(str) {
      let sum = 0;
      for (const ch of String(str || "")) sum += ch.charCodeAt(0);
      return (sum * 37) % 360;
    }

    function draw() {
      const hasMaster = uiState.hasMaster;
      const loginAcc = uiState.loginAccount;
      const isTeamLogin = !!loginAcc && loginAcc.accountType === "team";
      const teamMembers = isTeamLogin && Array.isArray(loginAcc.teamMembers) ? loginAcc.teamMembers : [];
      const isAuthStep = uiState.tab === "login" && uiState.loginStep === "auth" && loginAcc;
      // 화면을 다시 그리기 전에, 입력하던 아이디를 기억해뒀다가 다시 채워준다
      // (에러가 뜰 때 입력값이 사라지지 않게 — 목업과 동일한 동작).
      const prevLoginInput = document.getElementById("login-username");
      const prevSignupInput = document.getElementById("signup-username");
      const prevMemberSelect = document.getElementById("login-member");
      if (prevMemberSelect) uiState.memberId = prevMemberSelect.value; // 에러로 다시 그려져도 고른 인원 유지
      if (prevLoginInput) uiState.username = prevLoginInput.value;
      else if (prevSignupInput) uiState.username = prevSignupInput.value;

      const avatarStyle = isAuthStep
        ? ` style="background:linear-gradient(160deg, hsl(${loginAvatarHue(loginAcc.username)} 55% 62%), hsl(${(loginAvatarHue(loginAcc.username) + 45) % 360} 55% 42%))"`
        : "";
      const avatarInner = isAuthStep ? `<span class="login-avatar-letter">${esc((loginAcc.username || "?")[0].toUpperCase())}</span>` : LOGIN_AVATAR_ICON;
      const viewKey = `${uiState.tab}:${uiState.loginStep}`;
      const avatarPop = uiState.lastView !== null && uiState.lastView !== viewKey;
      uiState.lastView = viewKey;
      const errorHtml = `<div class="login-error">${esc(uiState.error)}</div>`;
      const savedUsername = esc(uiState.username || "");
      root.innerHTML = `
        <div class="login-shell${uiState.tab === "signup" ? " signup" : ""}">
          <div class="login-cloud${cloud ? "" : " off"}"><i></i>${cloud ? "클라우드 연결됨" : "오프라인"}</div>
          <div class="login-clock">
            <div class="login-time"></div>
            <div class="login-date"></div>
          </div>
          <div class="login-center">
            <div class="login-avatar${avatarPop ? " pop" : ""}"${avatarStyle}>${avatarInner}</div>
            <div class="login-body">
              ${uiState.tab === "login" ? `
                <div class="login-step-area" id="login-step-area">
                  ${uiState.loginStep === "id" ? `
                    <div class="login-name">업무 종합 관리</div>
                    ${errorHtml}
                    <form class="login-form" id="login-id-form">
                      <div class="login-pill has-go">
                        <input class="login-pin" id="login-username" value="${savedUsername}" autocomplete="username" placeholder="아이디">
                        <button type="submit" class="login-go" ${uiState.checkingId ? "disabled" : ""} aria-label="다음">${uiState.checkingId ? "…" : "›"}</button>
                      </div>
                    </form>
                  ` : `
                    <div class="login-name">${esc(loginAcc.username)}${isTeamLogin ? '<span class="login-tag">팀용</span>' : ""}</div>
                    ${errorHtml}
                    <form class="login-form" id="login-auth-form">
                      ${isTeamLogin ? `
                        ${teamMembers.length ? `
                          <label class="login-pill">
                            <select id="login-member" data-trigger-class="login-pin">
                              <option value="">로그인 인원 선택</option>
                              ${teamMembers.map((m) => `<option value="${esc(m.id)}"${m.id === uiState.memberId ? " selected" : ""}>${esc(m.name)}</option>`).join("")}
                            </select>
                          </label>
                        ` : `<div class="login-hint">아직 등록된 로그인 인원이 없어요. 마스터 계정에서 먼저 추가해달라고 해주세요.</div>`}
                      ` : ""}
                      <div class="login-pill has-go">
                        <input class="login-pin" id="login-password" type="password" autocomplete="current-password" placeholder="비밀번호">
                        <button type="submit" class="login-go" ${isTeamLogin && !teamMembers.length ? "disabled" : ""} aria-label="로그인">›</button>
                      </div>
                    </form>
                    <button type="button" class="login-back-link" id="login-back-btn">← 다른 계정으로</button>
                  `}
                </div>
              ` : `
                <div class="login-name">계정 생성</div>
                ${errorHtml}
                <form class="login-form" id="signup-form">
                  <input class="login-pin" id="signup-username" value="${savedUsername}" autocomplete="username" placeholder="아이디">
                  <div class="login-seg">
                    <label><input type="radio" name="signup-type" value="personal" ${uiState.signupType === "team" ? "" : "checked"}><span>개인용</span></label>
                    <label><input type="radio" name="signup-type" value="team" ${uiState.signupType === "team" ? "checked" : ""}><span>팀용</span></label>
                  </div>
                  <div class="login-hint" id="signup-team-hint" ${uiState.signupType === "team" ? "" : "hidden"}>팀용은 여러 명이 함께 사용합니다.</div>
                  <input class="login-pin" id="signup-password" type="password" autocomplete="new-password" placeholder="비밀번호 (6자 이상)">
                  <input class="login-pin" id="signup-password2" type="password" autocomplete="new-password" placeholder="비밀번호 확인">
                  ${!hasMaster ? `
                    <label class="login-mk">
                      <input type="checkbox" id="signup-master">
                      <span>이 계정을 마스터 계정으로 만들기<small>(마스터 계정은 다른 모든 계정을 선택해서 들어가보고, 삭제할 수 있어요. 아직 마스터 계정이 없어서 지금만 선택할 수 있어요.)</small></span>
                    </label>
                  ` : ""}
                  <button type="submit" class="primary-btn login-submit">계정 만들고 시작하기</button>
                </form>
              `}
            </div>
          </div>
          <div class="login-dock">
            <div class="login-tabs">
              <button type="button" class="login-tab ${uiState.tab === "login" ? "active" : ""}" data-tab="login">로그인</button>
              <button type="button" class="login-tab ${uiState.tab === "signup" ? "active" : ""}" data-tab="signup">계정 생성</button>
            </div>
          </div>
        </div>
      `;
      tickLoginClock();

      // 전환 중이면 시계 크기·위치·하단 여백·탭 강조를 "이전 값"으로 먼저 넣어둔다(위 전환 함수 참고).
      if (uiState.glideFrom) {
        const gf = uiState.glideFrom;
        const qq = (sel) => root.querySelector(sel);
        uiState.glideEls = [
          [qq(".login-clock"), "marginTop", gf.clockMt],
          [qq(".login-time"), "fontSize", gf.timeFs],
          [qq(".login-date"), "fontSize", gf.dateFs],
          [qq(".login-dock"), "paddingBottom", gf.dockPb],
        ].filter(([el, , v]) => el && v);
        uiState.glideEls.forEach(([el, prop, v]) => { el.style[prop] = v; });
        const tabEls = Array.from(root.querySelectorAll(".login-tab"));
        const nowEl = tabEls.find((t) => t.classList.contains("active"));
        const fromEl = gf.tab && nowEl && nowEl.dataset.tab !== gf.tab ? tabEls.find((t) => t.dataset.tab === gf.tab) : null;
        uiState.glideTab = fromEl;
        if (fromEl) { nowEl.classList.remove("active"); nowEl.setAttribute("data-glide-to", "1"); fromEl.classList.add("active"); }
      }

      // 에러가 새로 떴을 때만 폼을 흔들고 에러 문구를 살짝 등장시킨다.
      if (uiState.shake) {
        uiState.shake = false;
        const errEl = root.querySelector(".login-error");
        const formEl = root.querySelector(".login-form");
        if (errEl) errEl.classList.add("pop");
        if (formEl) formEl.classList.add("shake");
      }

      root.querySelectorAll("[data-tab]").forEach((btn) => {
        btn.onclick = () => {
          const nextTab = btn.getAttribute("data-tab");
          if (nextTab === uiState.tab) return;
          animateLoginStepTransition(() => { uiState.tab = nextTab; uiState.error = ""; resetLoginStep(); });
        };
      });

      const backBtn = document.getElementById("login-back-btn");
      if (backBtn) {
        backBtn.onclick = () => { animateLoginStepTransition(() => { uiState.error = ""; resetLoginStep(); }); };
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

      if (uiState.tab === "signup") {
        const signupField = document.getElementById("signup-username");
        if (signupField && !signupField.value) signupField.focus();
      }

      const loginIdForm = document.getElementById("login-id-form");
      if (loginIdForm) {
        loginIdForm.onsubmit = async (e) => {
          e.preventDefault();
          const username = document.getElementById("login-username").value.trim();
          if (!username) { showError("아이디를 입력해주세요."); return; }
          if (!cloud) { showError("클라우드 연결이 필요해요. 인터넷 연결을 확인한 뒤 다시 시도해주세요."); return; }
          uiState.error = "";
          uiState.checkingId = true;
          draw();
          let info = null;
          try {
            const { data } = await cloud.rpc("get_login_account_info", { p_username: username });
            info = data || null;
          } catch (err) { /* 아래에서 "계정 없음"으로 처리 */ }
          uiState.checkingId = false;
          if (!info) { showError("등록된 계정이 없어요."); return; }
          animateLoginStepTransition(() => {
            uiState.loginAccount = info;
            uiState.loginStep = "auth";
            uiState.error = "";
          });
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
            if (!memberId) { showError("로그인 인원을 선택해주세요."); return; }
            member = (Array.isArray(account.teamMembers) ? account.teamMembers : []).find((m) => m.id === memberId) || null;
            if (!member) { showError("로그인 인원을 다시 선택해주세요."); return; }
          }
          const password = document.getElementById("login-password").value;
          if (!password) { showError("비밀번호를 입력해주세요."); return; }

          // 아직 예전 방식으로 남아있는 계정이면, 이번 로그인에서 서버(Edge Function)가
          // 비밀번호를 한 번 확인하고 그 즉시 새 방식(사람 비밀번호 = 실제 로그인 비밀번호)으로
          // 전환해준다 — 비밀번호 해시는 이 과정에서 한 번도 브라우저 메모리 밖으로 나가지 않는다.
          if (!account.authMigrated) {
            const migrate = await cloudMigrateLegacyLogin(account.username, password);
            if (!migrate.ok) {
              showError(/올바르지/.test(migrate.reason || "") ? "아이디 또는 비밀번호가 올바르지 않아요." : (migrate.reason || "로그인에 실패했어요."));
              return;
            }
          }
          const cloudAuth = await cloudAuthSignInDirect(account.username, password);
          if (!cloudAuth.ok) {
            showError("아이디 또는 비밀번호가 올바르지 않아요.");
            return;
          }
          setSession(account.id);
          setTeamLoginMember(member ? { id: member.id, name: member.name } : null);
          touchLastActive();
          try { sessionStorage.setItem("app:just-logged-in", "1"); } catch (e) {}
          const leaving = leaveLoginScreen();
          await flushCloudWrites();
          await leaving;
          location.reload();
        };
      }
      const signupForm = document.getElementById("signup-form");
      if (signupForm) {
        root.querySelectorAll('input[name="signup-type"]').forEach((radio) => {
          radio.onchange = () => {
            uiState.signupType = radio.value;
            const hint = document.getElementById("signup-team-hint");
            if (hint) hint.hidden = radio.value !== "team";
          };
        });
        signupForm.onsubmit = async (e) => {
          e.preventDefault();
          const username = document.getElementById("signup-username").value.trim();
          const password = document.getElementById("signup-password").value;
          const password2 = document.getElementById("signup-password2").value;
          if (!username || !password) { showError("아이디와 비밀번호를 입력해주세요."); return; }
          if (password.length < 6) { showError("비밀번호는 6자 이상으로 만들어주세요."); return; }
          if (password !== password2) { showError("비밀번호 확인이 일치하지 않아요."); return; }
          if (!cloud) { showError("클라우드 연결이 필요해요. 인터넷 연결을 확인한 뒤 다시 시도해주세요."); return; }
          try {
            const { data } = await cloud.rpc("get_login_account_info", { p_username: username });
            if (data) { showError("이미 사용 중인 아이디예요."); return; }
          } catch (err) { /* 확인 실패해도 가입 자체는 시도(가입 단계에서 중복이면 다시 걸러짐) */ }
          // 사람이 정한 비밀번호로 곧장 Supabase Auth에 가입한다(아래 계정을 만들기 전에
          // 먼저 해서, 여기서 실패하면 로컬 계정도 만들지 않는다 — 둘이 어긋나면 다음
          // 로그인부터 곤란해지기 때문).
          const cloudAuth = await cloudAuthSignUpDirect(username, password);
          if (!cloudAuth.ok) {
            showError(`클라우드 연결에 실패해서 계정을 만들지 못했어요. 인터넷 연결을 확인한 뒤 다시 시도해주세요. (${cloudAuth.reason})`);
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
          const leaving = leaveLoginScreen();
          await flushCloudWrites();
          await leaving;
          location.reload();
        };
      }
    }

    draw();
    if (typeof window !== "undefined" && window.__hideBootLoader) window.__hideBootLoader();
  }

