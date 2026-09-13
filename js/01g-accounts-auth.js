  // ==================== 비밀번호 해시(PBKDF2), 계정 CRUD, 디스코드 알림 허용 설정, 세션/마스터 모드/팀원, 로그아웃 ====================
  // (예전 01-common.js에서 분리됨 — 실행 순서·내용은 그대로입니다)

  /* ===================== 로그인(로컬 전용) 모듈 =====================
     지금은 서버 없이 이 브라우저의 localStorage에만 계정 정보를 저장하는
     "로컬 프로토타입" 로그인입니다. 서버가 없는 한 브라우저 안의 어떤 값도
     완전히 안전할 수는 없으므로, 진짜 보안이 필요해지면 반드시 서버 기반
     인증(암호화된 비밀번호 저장, 세션/토큰 검증 등)으로 교체해야 합니다.
     비밀번호는 브라우저 내장 SubtleCrypto의 PBKDF2(HMAC-SHA256, 30만 회 반복)로
     계정마다 다른 salt를 붙여 해시해 저장한다(2026-09 강화, 아래 makeNewPasswordRecord
     참고). 예전에 만든 계정(2세대: SHA-256 1회, 1세대: salt 없음)도 다음 로그인
     때 자동으로 이 방식으로 업그레이드된다(verifyAndMaybeUpgradePassword 참고).
     계정별 데이터는 저장 키 앞에 "acct:{계정ID}:" 접두어를 붙여 브라우저 안에서만
     서로 분리해둡니다. */
  const ACCOUNTS_KEY = "personal-app:accounts";
  // 로그인 세션(누가 로그인해 있는지)은 localStorage에 저장해서, 탭을 닫았다 새로
  // 열어도(같은 브라우저인 한) 로그인이 그대로 유지되게 한다. 대신 아래 LAST_ACTIVE_KEY
  // 하트비트로 "너무 오래(=컴퓨터를 껐다 켤 정도로) 닫혀 있었는지"를 따로 판단해서,
  // 그 경우에만 자동으로 로그아웃시킨다.
  const SESSION_KEY = "personal-app:session";
  // 마스터 계정이 다른 계정을 "들어가서 보기" 했을 때, 원래(마스터) 계정으로
  // 돌아올 수 있도록 원래 세션을 잠깐 보관해두는 키.
  const MASTER_ORIGIN_KEY = "personal-app:master-origin";
  // 이 앱이 마지막으로 화면에 떠 있었던 시각(하트비트). 탭이 열려 있는 동안 주기적으로
  // 갱신되고, 탭/브라우저가 닫히면 더 이상 갱신되지 않는다. 다음에 열었을 때 이 시각과
  // 지금 시각의 차이가 SESSION_GAP_LIMIT_MS보다 크면 "그동안 컴퓨터를 껐다 켰거나
  // 오래 자리를 비운 것"으로 보고 자동 로그아웃시킨다. 그보다 짧으면(탭만 잠깐 닫았다
  // 연 경우 등) 로그인 상태를 그대로 유지한다. 기준 시간을 바꾸고 싶으면 이 숫자만
  // 고치면 된다.
  const LAST_ACTIVE_KEY = "personal-app:last-active";
  const SESSION_GAP_LIMIT_MS = 5 * 60 * 1000; // 5분

  const HAS_SUBTLE_CRYPTO = !!(window.crypto && window.crypto.subtle);
  // 예전(salt 없는 단순 해시) 방식 — 신규 계정에는 쓰지 않고, 예전에 만든
  // 계정을 로그인할 때 한 번 확인해서 새 방식으로 자동 업그레이드하는 용도로만 남겨둔다.
  function legacyHash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return String(h);
  }
  function genSalt() {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  function hexToBytes(hex) {
    const bytes = new Uint8Array(Math.floor(hex.length / 2));
    for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    return bytes;
  }
  async function sha256Hex(str) {
    const bytes = new TextEncoder().encode(str);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // 예전(2세대) 방식 — salt를 붙여 SHA-256으로 "딱 1번" 해시한다. 그래프카드(GPU)로
  // 초당 수십억 번씩 계산할 수 있어서, 유출되면 흔한 비밀번호는 금방 뚫린다.
  // 새 계정에는 쓰지 않고, 예전에 만든 계정을 아래 PBKDF2 방식으로 자동
  // 업그레이드하기 위한 "확인용"으로만 남겨둔다.
  async function hashPasswordSha256(password, salt) {
    if (!HAS_SUBTLE_CRYPTO) return legacyHash(`${salt}:${password}`);
    return sha256Hex(`${salt}:${password}`);
  }
  // 지금(3세대) 비밀번호 저장 방식: PBKDF2(HMAC-SHA256, 30만 회 반복). 같은 계산을
  // 30만 번 반복시켜서, 유출된 해시로 비밀번호를 무차별 대입하려는 시도를 앞의
  // SHA-256 1회 방식보다 훨씬 느리고 비싸게 만든다(GPU로 돌려도 초당 계산 가능
  // 횟수가 수천~수만 배 줄어듦). 브라우저 내장 SubtleCrypto의 PBKDF2 구현만
  // 쓰고, 외부 라이브러리는 쓰지 않는다.
  const PBKDF2_ITERATIONS = 300000;
  async function hashPasswordPBKDF2(password, saltHex, iterations) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveBits"]);
    const derivedBits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt: hexToBytes(saltHex), iterations: iterations || PBKDF2_ITERATIONS, hash: "SHA-256" },
      keyMaterial,
      256
    );
    return Array.from(new Uint8Array(derivedBits)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // 새 비밀번호를 정할 때(가입, 마스터의 비밀번호 초기화) 쓰는 함수. SubtleCrypto를
  // 못 쓰는 예외적인 환경에서는(PBKDF2 자체를 돌릴 수 없으므로) 어쩔 수 없이 예전
  // SHA-256 salted 방식으로 대신하고, 나중에 SubtleCrypto를 쓸 수 있는 환경에서
  // 로그인하면 그때 자동으로 PBKDF2로 업그레이드된다.
  async function makeNewPasswordRecord(password) {
    const salt = genSalt();
    if (!HAS_SUBTLE_CRYPTO) {
      return { salt, passwordHash: await hashPasswordSha256(password, salt), hashAlgo: "sha256" };
    }
    return { salt, passwordHash: await hashPasswordPBKDF2(password, salt, PBKDF2_ITERATIONS), hashAlgo: "pbkdf2", iterations: PBKDF2_ITERATIONS };
  }
  // 계정에 저장된 방식이 무엇이든(1세대: salt 없음 / 2세대: salt+SHA-256 1회 /
  // 3세대: salt+PBKDF2) 알맞게 확인하고, 맞으면 { ok: true, upgrade: <새 레코드 또는 null> }
  // 를 돌려준다. upgrade가 있으면(구버전 확인 통과) 로그인 쪽에서 그 즉시 계정에
  // 저장해 다음 로그인부터는 최신 방식으로 확인하게 한다.
  async function verifyAndMaybeUpgradePassword(account, password) {
    if (account.hashAlgo === "pbkdf2") {
      const ok = account.passwordHash === (await hashPasswordPBKDF2(password, account.salt, account.iterations || PBKDF2_ITERATIONS));
      return { ok, upgrade: null }; // 이미 최신 방식이라 업그레이드할 게 없음
    }
    if (account.salt) {
      // 2세대(salt+SHA-256 1회) 계정: 이 방식으로 확인하고, 맞으면 PBKDF2로 업그레이드
      const ok = account.passwordHash === (await hashPasswordSha256(password, account.salt));
      if (!ok) return { ok: false, upgrade: null };
      return { ok: true, upgrade: HAS_SUBTLE_CRYPTO ? await makeNewPasswordRecord(password) : null };
    }
    // 1세대(salt 없음) 계정: 예전 단순 해시로 확인하고, 맞으면 곧장 PBKDF2로 업그레이드
    const ok = account.passwordHash === legacyHash(password);
    if (!ok) return { ok: false, upgrade: null };
    return { ok: true, upgrade: HAS_SUBTLE_CRYPTO ? await makeNewPasswordRecord(password) : null };
  }
  function loadAccounts() {
    try {
      const raw = localStorage.getItem(ACCOUNTS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }
  function saveAccounts(list) {
    try { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list)); } catch (e) {}
  }
  /* ---- 디스코드 알림 허용 계정 설정 ----
     어떤 계정의 일정/할일을 디스코드로 보낼지를 계정 단위 토글로 관리한다.
     { [accountId]: true } 형태로 "허용"된 계정만 담아두고, 여기 없는 계정은
     전부 기본값인 "제한"으로 취급한다(허용 목록 방식이라 새 계정도 자동으로
     제한 상태로 시작한다). 이 키도 다른 설정들처럼 클라우드(kv_store)에
     함께 저장돼서 discord-notify 서버 함수가 그대로 읽어갈 수 있다. */
  const DISCORD_NOTIFY_SETTINGS_KEY = "personal-app:discord-notify-settings";
  function loadDiscordNotifySettings() {
    try {
      const raw = localStorage.getItem(DISCORD_NOTIFY_SETTINGS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return (parsed && typeof parsed === "object" && !Array.isArray(parsed)) ? parsed : {};
    } catch (e) { return {}; }
  }
  function saveDiscordNotifySettings(obj) {
    try { localStorage.setItem(DISCORD_NOTIFY_SETTINGS_KEY, JSON.stringify(obj)); } catch (e) {}
  }
  function isDiscordNotifyAllowed(accountId) {
    return loadDiscordNotifySettings()[accountId] === true;
  }
  function setDiscordNotifyAllowed(accountId, allowed) {
    const settings = loadDiscordNotifySettings();
    if (allowed) settings[accountId] = true;
    else delete settings[accountId];
    saveDiscordNotifySettings(settings);
  }
  function getSession() {
    try { return localStorage.getItem(SESSION_KEY); } catch (e) { return null; }
  }
  function setSession(accountId) {
    try { localStorage.setItem(SESSION_KEY, accountId); } catch (e) {}
  }
  function clearSession() {
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
  }
  function getMasterOrigin() {
    try { return localStorage.getItem(MASTER_ORIGIN_KEY); } catch (e) { return null; }
  }
  function setMasterOrigin(accountId) {
    try { localStorage.setItem(MASTER_ORIGIN_KEY, accountId); } catch (e) {}
  }
  function clearMasterOrigin() {
    try { localStorage.removeItem(MASTER_ORIGIN_KEY); } catch (e) {}
  }
  function getLastActive() {
    try { return Number(localStorage.getItem(LAST_ACTIVE_KEY)) || 0; } catch (e) { return 0; }
  }
  // 하트비트를 지금 시각으로 갱신한다. 로그인 직후, 그리고 탭이 열려 있는 동안
  // 주기적으로 호출된다.
  function touchLastActive() {
    try { localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now())); } catch (e) {}
  }
  function clearLastActive() {
    try { localStorage.removeItem(LAST_ACTIVE_KEY); } catch (e) {}
  }
  // 마스터 계정이 다른 계정으로 들어가서 볼 때 쓰는 함수.
  // 지금 세션(마스터)을 origin으로 저장해두고, 세션을 대상 계정으로 바꾼다.
  async function masterEnterAccount(targetAccountId) {
    const origin = getMasterOrigin() || getSession();
    if (origin) setMasterOrigin(origin);
    setSession(targetAccountId);
    clearTeamLoginMember();
    await flushCloudWrites();
    location.reload();
  }
  // 마스터가 다른 계정을 보다가 원래 마스터 계정으로 돌아간다.
  async function masterReturnToOrigin() {
    const origin = getMasterOrigin();
    if (!origin) return;
    clearMasterOrigin();
    setSession(origin);
    clearTeamLoginMember();
    await flushCloudWrites();
    location.reload();
  }
  // 계정을 삭제한다. 현재 로그인 중인 계정이거나, 남은 계정이 1개뿐이면 삭제하지 않는다.
  // 계정을 지울 때 그 계정의 개인 데이터(acct:{id}: 로 시작하는 저장 값)도 함께 정리한다.
  function deleteAccount(accountId) {
    const list = loadAccounts();
    if (list.length <= 1) return { ok: false, reason: "마지막 남은 계정은 삭제할 수 없어요." };
    if (accountId === CURRENT_ACCOUNT_ID) return { ok: false, reason: "현재 로그인 중인 계정은 삭제할 수 없어요." };
    const target = list.find((a) => a.id === accountId);
    const next = list.filter((a) => a.id !== accountId);
    saveAccounts(next);
    setDiscordNotifyAllowed(accountId, false);
    try {
      const prefix = `acct:${accountId}:`;
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.indexOf(prefix) === 0) keysToRemove.push(k);
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) { /* 데이터 정리 실패해도 계정 삭제 자체는 유지 */ }
    appendActivityLog({
      accountId,
      accountName: target ? target.username : accountId,
      viaMasterName: CURRENT_ACCOUNT_NAME,
      categoryKey: "account",
      categoryLabel: "계정 관리",
      subLabel: "",
      diff: ["계정이 삭제됐어요."],
    });
    return { ok: true };
  }
  // 마스터가 다른 계정의 비밀번호를 새 비밀번호로 초기화한다.
  async function resetAccountPassword(accountId, newPassword) {
    if (!newPassword || newPassword.length < 4) return { ok: false, reason: "비밀번호는 4자 이상으로 만들어주세요." };
    const list = loadAccounts();
    const idx = list.findIndex((a) => a.id === accountId);
    if (idx === -1) return { ok: false, reason: "계정을 찾을 수 없어요." };
    const record = await makeNewPasswordRecord(newPassword);
    list[idx] = { ...list[idx], ...record };
    saveAccounts(list);
    appendActivityLog({
      accountId,
      accountName: list[idx].username,
      viaMasterName: CURRENT_ACCOUNT_NAME,
      categoryKey: "account",
      categoryLabel: "계정 관리",
      subLabel: "",
      diff: ["비밀번호가 초기화됐어요."],
    });
    return { ok: true };
  }
  // 마스터가 다른 계정의 이름(아이디)을 바꾼다. 이미 쓰이고 있는 이름으로는 바꿀 수 없다.
  function renameAccount(accountId, newUsername) {
    const trimmed = (newUsername || "").trim();
    if (!trimmed) return { ok: false, reason: "계정 이름을 입력해주세요." };
    const list = loadAccounts();
    const idx = list.findIndex((a) => a.id === accountId);
    if (idx === -1) return { ok: false, reason: "계정을 찾을 수 없어요." };
    const norm = trimmed.toLowerCase();
    const dup = list.find((a) => a.id !== accountId && a.username.toLowerCase() === norm);
    if (dup) return { ok: false, reason: "이미 사용 중인 계정 이름이에요." };
    const oldUsername = list[idx].username;
    list[idx] = { ...list[idx], username: trimmed };
    saveAccounts(list);
    appendActivityLog({
      accountId,
      accountName: trimmed,
      viaMasterName: CURRENT_ACCOUNT_NAME,
      categoryKey: "account",
      categoryLabel: "계정 관리",
      subLabel: "",
      diff: [`계정 이름: ${oldUsername} → ${trimmed}`],
    });
    return { ok: true };
  }
  function findAccountByUsername(username) {
    const norm = username.trim().toLowerCase();
    return loadAccounts().find((a) => a.username.toLowerCase() === norm) || null;
  }
  function findAccountById(id) {
    return loadAccounts().find((a) => a.id === id) || null;
  }
  /* ---- 팀용 계정의 "로그인 인원" ----
     팀용 계정은 비밀번호 하나를 여러 명이 함께 쓰되, 로그인할 때 누가 접속했는지
     이름표만 골라서 들어간다. 이 목록(teamMembers)은 마스터 계정에서만 추가/삭제할
     수 있고, 실제 인증(비밀번호 검증)에는 관여하지 않는다 — 활동 로그 등에서
     "누가"를 조금 더 구체적으로 보여주기 위한 용도. */
  function addTeamMember(accountId, name) {
    const trimmed = (name || "").trim();
    if (!trimmed) return { ok: false, reason: "이름을 입력해주세요." };
    const list = loadAccounts();
    const idx = list.findIndex((a) => a.id === accountId);
    if (idx === -1) return { ok: false, reason: "계정을 찾을 수 없어요." };
    if (list[idx].accountType !== "team") return { ok: false, reason: "팀용 계정이 아니에요." };
    const members = Array.isArray(list[idx].teamMembers) ? list[idx].teamMembers.slice() : [];
    if (members.some((m) => m.name === trimmed)) return { ok: false, reason: "이미 있는 이름이에요." };
    members.push({ id: genId(), name: trimmed });
    list[idx] = { ...list[idx], teamMembers: members };
    saveAccounts(list);
    appendActivityLog({
      accountId,
      accountName: list[idx].username,
      viaMasterName: CURRENT_ACCOUNT_NAME,
      categoryKey: "account",
      categoryLabel: "계정 관리",
      subLabel: "로그인 인원",
      diff: [`로그인 인원 추가: ${trimmed}`],
    });
    return { ok: true };
  }
  function removeTeamMember(accountId, memberId) {
    const list = loadAccounts();
    const idx = list.findIndex((a) => a.id === accountId);
    if (idx === -1) return { ok: false, reason: "계정을 찾을 수 없어요." };
    const members = Array.isArray(list[idx].teamMembers) ? list[idx].teamMembers : [];
    const target = members.find((m) => m.id === memberId);
    if (!target) return { ok: false, reason: "인원을 찾을 수 없어요." };
    list[idx] = { ...list[idx], teamMembers: members.filter((m) => m.id !== memberId) };
    saveAccounts(list);
    appendActivityLog({
      accountId,
      accountName: list[idx].username,
      viaMasterName: CURRENT_ACCOUNT_NAME,
      categoryKey: "account",
      categoryLabel: "계정 관리",
      subLabel: "로그인 인원",
      diff: [`로그인 인원 삭제: ${target.name}`],
    });
    return { ok: true };
  }
  // 마스터가 이미 만들어진 계정의 유형(개인용/팀용)을 바꾼다. 팀용으로 바꿀 때 로그인
  // 인원 목록이 없으면 빈 목록으로 시작하고, 개인용으로 바꿔도 이미 등록해둔 인원
  // 목록 자체는 지우지 않는다(나중에 다시 팀용으로 바꾸면 그대로 남아있게).
  function setAccountType(accountId, newType) {
    const type = newType === "team" ? "team" : "personal";
    const list = loadAccounts();
    const idx = list.findIndex((a) => a.id === accountId);
    if (idx === -1) return { ok: false, reason: "계정을 찾을 수 없어요." };
    const prevType = list[idx].accountType === "team" ? "team" : "personal";
    if (prevType === type) return { ok: true };
    const updated = { ...list[idx], accountType: type };
    if (type === "team" && !Array.isArray(updated.teamMembers)) updated.teamMembers = [];
    list[idx] = updated;
    saveAccounts(list);
    appendActivityLog({
      accountId,
      accountName: list[idx].username,
      viaMasterName: CURRENT_ACCOUNT_NAME,
      categoryKey: "account",
      categoryLabel: "계정 관리",
      subLabel: "",
      diff: [`계정 유형: ${prevType === "team" ? "팀용" : "개인용"} → ${type === "team" ? "팀용" : "개인용"}`],
    });
    // 지금 로그인해 있는 계정 자신의 유형이 팀용이 아니게 바뀌면, 남아있던 "로그인 인원"
    // 선택도 더는 의미가 없으니 같이 지운다.
    if (accountId === CURRENT_ACCOUNT_ID && type !== "team") clearTeamLoginMember();
    return { ok: true };
  }
  // 지금 선택된 "로그인 인원"(팀용 계정에서만 의미 있음)을 브라우저에 잠깐 저장해서,
  // 새로고침 후에도(같은 세션이 유지되는 동안) 계속 같은 인원으로 표시되게 한다.
  const TEAM_MEMBER_KEY = "personal-app:team-login-member";
  function getTeamLoginMember() {
    try {
      const raw = localStorage.getItem(TEAM_MEMBER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function setTeamLoginMember(member) {
    try {
      if (member) localStorage.setItem(TEAM_MEMBER_KEY, JSON.stringify(member));
      else localStorage.removeItem(TEAM_MEMBER_KEY);
    } catch (e) {}
  }
  function clearTeamLoginMember() {
    try { localStorage.removeItem(TEAM_MEMBER_KEY); } catch (e) {}
  }
  async function logout() {
    clearSession();
    clearMasterOrigin();
    clearLastActive();
    clearTeamLoginMember();
    await flushCloudWrites();
    if (cloud) { try { await cloud.auth.signOut(); } catch (e) {} }
    location.reload();
  }

