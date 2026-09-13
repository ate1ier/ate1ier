  // ==================== 현재 계정 컨텍스트 부트스트랩, KST 시간 헬퍼, 활동 로그, 앱 상태(state)·페이지 이동 ====================
  // (예전 01-common.js에서 분리됨 — 실행 순서·내용은 그대로입니다)
  // 세션 확인: 로그인 상태가 아니면 로그인 화면만 그리고 나머지 앱 코드는 실행하지 않는다.
  const _session = getSession();
  let _account = _session ? findAccountById(_session) : null;
  // 하트비트 확인: 마지막으로 이 앱이 열려 있었던 시각으로부터 너무 오래(컴퓨터를
  // 껐다 켤 정도로) 지났으면 자동으로 로그아웃 처리한다. 탭만 잠깐 닫았다 연 경우처럼
  // 그 안에 다시 열렸다면 로그인 상태를 그대로 유지한다.
  if (_account) {
    const lastActive = getLastActive();
    if (!lastActive || Date.now() - lastActive >= SESSION_GAP_LIMIT_MS) {
      clearSession();
      clearMasterOrigin();
      clearLastActive();
      clearTeamLoginMember();
      _account = null;
    }
  }
  if (!_account) {
    renderLoginScreen();
    return;
  }
  document.body.classList.remove("login-screen");
  const CURRENT_ACCOUNT_ID = _account.id;
  const CURRENT_ACCOUNT_NAME = _account.username;
  const CURRENT_ACCOUNT_IS_MASTER = !!_account.isMaster;
  // 팀용 계정은 여러 명이 하나의 계정(비밀번호)을 같이 쓰되, 로그인할 때 고른 "인원"
  // 이름표를 함께 들고 있는다. 개인용 계정이거나, 옛날에 만들어져 accountType이 아예
  // 없는 계정은 전부 "personal"로 취급한다.
  const CURRENT_ACCOUNT_TYPE = _account.accountType === "team" ? "team" : "personal";
  const CURRENT_TEAM_MEMBER = CURRENT_ACCOUNT_TYPE === "team" ? getTeamLoginMember() : null;
  const CURRENT_ACCOUNT_DISPLAY_NAME = CURRENT_TEAM_MEMBER ? `${CURRENT_ACCOUNT_NAME} (${CURRENT_TEAM_MEMBER.name})` : CURRENT_ACCOUNT_NAME;
  // 마스터 계정이 다른 계정으로 들어와서 보고 있는 중인지 확인 (원래 마스터 계정 정보가 남아있는지로 판단)
  const _masterOriginId = getMasterOrigin();
  const MASTER_ORIGIN_ACCOUNT = _masterOriginId && _masterOriginId !== CURRENT_ACCOUNT_ID ? findAccountById(_masterOriginId) : null;
  if (_masterOriginId && !MASTER_ORIGIN_ACCOUNT) clearMasterOrigin();
  // 계정별로 데이터를 분리하기 위해 저장 키 앞에 이 접두어를 붙인다.
  function acctKey(key) { return `acct:${CURRENT_ACCOUNT_ID}:${key}`; }

  /* ===================== 📋 계정 활동 로그 (마스터 전용) =====================
     각 계정에서 실제 데이터(할일/메모/상담사/면담일지/QA/스케줄 등)가 저장될 때마다
     "언제 · 누가 · 어디서(어떤 메뉴) · 무엇이 어떻게 바뀌었는지"를 간단히 기록해서
     쌓아둔다. 이 로그 자체도 클라우드(kv_store)에 함께 저장되므로, 다른 관리자의
     브라우저에서 생긴 활동도 마스터 계정이라면 새로고침 후 같이 볼 수 있다.
     계정 목록 자체를 다루는 동작(비밀번호 초기화·이름 변경·삭제)은 acct: 접두어를
     쓰지 않으므로, 해당 함수(resetAccountPassword 등) 안에서 직접 기록한다. */
  /* ---- 시각 표시는 항상 한국 표준시(KST, UTC+9)로 ----
     저장은 new Date().toISOString()(UTC)로 하고, 화면에 보여줄 때 이 함수들을 거쳐
     KST로 변환한다. 이렇게 해야 보고 있는 사람의 브라우저 시간대 설정과 무관하게
     항상 한국 시간 기준으로 보인다. (한국은 서머타임이 없어서 항상 UTC+9 고정이면 된다.) */
  function _toKSTParts(iso) {
    if (!iso) return null;
    const t = Date.parse(iso);
    if (isNaN(t)) return null;
    const kst = new Date(t + 9 * 60 * 60 * 1000);
    return {
      y: kst.getUTCFullYear(), mo: pad2(kst.getUTCMonth() + 1), da: pad2(kst.getUTCDate()),
      h: pad2(kst.getUTCHours()), mi: pad2(kst.getUTCMinutes()),
    };
  }
  function formatKSTDateTime(iso) {
    const p = _toKSTParts(iso);
    return p ? `${p.y}-${p.mo}-${p.da} ${p.h}:${p.mi}` : "-";
  }
  function formatKSTTime(iso) {
    const p = _toKSTParts(iso);
    return p ? `${p.h}:${p.mi}` : "";
  }

  const ACTIVITY_LOG_KEY = "activity-log:entries";
  const ACTIVITY_LOG_MAX = 500; // 너무 오래 쌓이지 않도록 최신 N건만 유지
  const ACTIVITY_LOG_RETENTION_DAYS = 30; // 이보다 오래된 로그는 자동으로 정리
  function _pruneOldActivityEntries(list) {
    const cutoff = Date.now() - ACTIVITY_LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000;
    return list.filter((e) => {
      const ts = Date.parse(e.endedAt || e.at || "");
      return isNaN(ts) ? true : ts >= cutoff; // 날짜를 못 읽으면 안전하게 남겨둔다
    });
  }
  function loadActivityLog() {
    try {
      const raw = localStorage.getItem(ACTIVITY_LOG_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }
  function appendActivityLog(entry) {
    try {
      let list = loadActivityLog();
      list.unshift(Object.assign({ id: genId(), at: new Date().toISOString() }, entry));
      list = _pruneOldActivityEntries(list);
      if (list.length > ACTIVITY_LOG_MAX) list.length = ACTIVITY_LOG_MAX;
      localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(list));
    } catch (e) { /* 로그 저장 실패가 실제 데이터 저장에 영향을 주면 안 된다 */ }
  }
  // 새 활동이 한동안 없어도(=appendActivityLog가 한동안 안 불려도) 30일 지난
  // 로그는 앱을 열 때마다 한 번씩 조용히 정리한다.
  function pruneActivityLogIfStale() {
    try {
      const list = loadActivityLog();
      const pruned = _pruneOldActivityEntries(list);
      if (pruned.length !== list.length) localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(pruned));
    } catch (e) {}
  }
  function clearActivityLog() {
    try { localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify([])); } catch (e) {}
  }
  // acct:{id}:personal-xxx:... 형태의 저장 키에서 "어디서 바뀌었는지" 카테고리를 찾아낸다.
  // (BACKUP_CATEGORIES를 그대로 재사용해 백업 화면의 분류와 일관성을 맞춘다.)
  function activityCategoryForRelKey(relKey) {
    const cat = BACKUP_CATEGORIES.find((c) => c.keyPrefixes.some((p) => relKey.indexOf(p) === 0));
    if (cat) return { key: cat.key, label: cat.label };
    return { key: "etc", label: "기타" };
  }
  // 캘린더처럼 한 카테고리 안에 저장 키가 여러 개(월별 일정 / 할 일 목록)로 나뉜 경우,
  // 리스트에서 조금 더 구체적으로 어디가 바뀌었는지 보여주기 위한 부가 설명.
  function activitySubLabel(relKey) {
    if (relKey === "personal-calendar:todos") return "할 일 목록";
    const m = /^personal-calendar:(\d{4}-\d{2})$/.exec(relKey);
    if (m) return `${m[1]} 캘린더 일정`;
    return "";
  }
  function _activityItemLabel(item) {
    if (item === null || item === undefined) return "(없음)";
    if (typeof item !== "object") return String(item);
    const v = item.name || item.title || item.content || item.username || item.label || item.date;
    if (v) return String(v).slice(0, 40);
    return item.id ? `#${item.id}` : "항목";
  }
  function _activityScalar(v) {
    if (v === undefined) return "(없음)";
    if (v === null) return "(비어있음)";
    if (typeof v === "object") { try { return JSON.stringify(v).slice(0, 60); } catch (e) { return "(객체)"; } }
    const s = String(v);
    if (s === "") return "(빈 값)";
    return s.length > 60 ? `${s.slice(0, 60)}…` : s;
  }
  // 저장 전/후 값을 비교해 사람이 읽을 수 있는 변경 내역 줄들을 만든다. 배열은 id 기준으로
  // 추가/삭제/수정을 구분하고, 객체는 키 기준으로(최대 2단계까지) 비교한다. 완벽한 diff는
  // 아니지만 "대략 뭐가 바뀌었는지" 파악하기엔 충분한 수준을 목표로 한다.
  function diffActivityValues(oldVal, newVal, depth) {
    const lines = [];
    if (oldVal === undefined && newVal !== undefined) return ["새로 만들어졌어요."];
    if (oldVal !== undefined && newVal === undefined) return ["삭제됐어요."];
    if (Array.isArray(oldVal) && Array.isArray(newVal)) {
      const idBased = (oldVal.length && oldVal.every((x) => x && typeof x === "object" && x.id != null))
        || (newVal.length && newVal.every((x) => x && typeof x === "object" && x.id != null));
      if (idBased) {
        const oldMap = {}; oldVal.forEach((x) => { if (x && x.id != null) oldMap[x.id] = x; });
        const newMap = {}; newVal.forEach((x) => { if (x && x.id != null) newMap[x.id] = x; });
        Object.keys(newMap).forEach((id) => {
          if (!(id in oldMap)) { lines.push(`+ 추가됨: ${_activityItemLabel(newMap[id])}`); return; }
          const fieldLines = diffActivityValues(oldMap[id], newMap[id], (depth || 0) + 1);
          if (fieldLines.length) lines.push(`✎ 수정됨: ${_activityItemLabel(newMap[id])} — ${fieldLines.join(" / ")}`);
        });
        Object.keys(oldMap).forEach((id) => {
          if (!(id in newMap)) lines.push(`- 삭제됨: ${_activityItemLabel(oldMap[id])}`);
        });
      } else if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
        lines.push(oldVal.length === newVal.length ? "목록 내용이 바뀌었어요." : `목록 항목 수: ${oldVal.length}개 → ${newVal.length}개`);
      }
      return lines;
    }
    if (oldVal && newVal && typeof oldVal === "object" && typeof newVal === "object") {
      if ((depth || 0) >= 3) {
        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) lines.push("내용이 바뀌었어요.");
        return lines;
      }
      const keys = Array.from(new Set(Object.keys(oldVal).concat(Object.keys(newVal))));
      keys.forEach((k) => {
        const ov = oldVal[k];
        const nv = newVal[k];
        if (JSON.stringify(ov) === JSON.stringify(nv)) return;
        if (ov && nv && typeof ov === "object" && typeof nv === "object") {
          const sub = diffActivityValues(ov, nv, (depth || 0) + 1);
          if (sub.length) sub.forEach((s) => lines.push(`${k}.${s}`));
          else lines.push(`${k}: 내용이 바뀌었어요.`);
        } else {
          lines.push(`${k}: ${_activityScalar(ov)} → ${_activityScalar(nv)}`);
        }
      });
      return lines;
    }
    if (oldVal !== newVal) lines.push(`${_activityScalar(oldVal)} → ${_activityScalar(newVal)}`);
    return lines;
  }
  function buildActivityDiffLines(oldRaw, newRaw) {
    if (oldRaw === newRaw) return [];
    let oldVal, newVal;
    try { oldVal = oldRaw != null ? JSON.parse(oldRaw) : undefined; } catch (e) { oldVal = oldRaw; }
    try { newVal = newRaw != null ? JSON.parse(newRaw) : undefined; } catch (e) { newVal = newRaw; }
    const lines = diffActivityValues(oldVal, newVal, 0);
    if (lines.length > 40) return lines.slice(0, 40).concat([`...외 ${lines.length - 40}건 더`]);
    return lines.length ? lines : ["내용이 바뀌었어요."];
  }

  /* ---- 활동 로그는 즉시 기록한다 ----
     예전에는 한 계정에서 짧은 시간(3분) 안에 생긴 변경들을 클라우드의 임시 저장소
     (activity-log:pending)에 모아뒀다가, 3분이 지나야 실제 목록(activity-log:entries)
     으로 확정하는 방식이었다. 이 "3분 묶음"은 마스터 계정의 활동 로그 화면을 깔끔하게
     보여주기 위한 것이었는데, 문제는 이 지연이 스케줄 셀 "수정 이력 보기"에도 그대로
     적용돼서 — 방금 고친 셀이 최대 3분 동안 이력에 전혀 안 보이는 부작용이 있었다.
     그래서 저장(기록) 자체는 항상 즉시 하나의 로그 항목으로 남기고, "여러 변경을 하나로
     묶어 보여주는 것"은 마스터 계정의 활동 로그 화면(10-master.js)에서 화면에 그릴 때만
     (표시 전용으로) 묶어서 보여주도록 바꿨다. 그래야 실제 데이터(activity-log:entries)는
     항상 최신 상태이고, 셀 수정 이력도 곧바로 반영된다. */
  // 마스터 활동 로그 화면에서 "짧은 시간 안의 여러 변경"을 한 줄로 묶어 보여줄 때
  // 쓰는 창(표시 전용). 실제 저장 시점과는 무관하다.
  const ACTIVITY_DISPLAY_GROUP_MS = 3 * 60 * 1000;
  function recordActivityChange(change) {
    const timeLabel = formatKSTTime(new Date().toISOString());
    const where = change.subLabel ? `${change.categoryLabel} · ${change.subLabel}` : change.categoryLabel;
    const diffLines = (change.diff && change.diff.length ? change.diff : ["내용이 바뀌었어요."])
      .map((line) => `[${timeLabel}] ${where} — ${line}`);
    appendActivityLog({
      accountId: change.accountId,
      accountName: change.accountName,
      viaMasterName: change.viaMasterName,
      categoryKey: change.categoryKey,
      categoryLabel: change.categoryLabel,
      subLabel: change.subLabel,
      diff: diffLines,
    });
  }
  pruneActivityLogIfStale();

  // acct:{계정id}:{나머지 키} 형태의 저장에만 반응해서 활동 로그를 남긴다. 계정 목록
  // (비밀번호/이름/삭제)처럼 이 접두어를 쓰지 않는 값은 여기서 잡히지 않고, 해당
  // 동작을 하는 함수(renameAccount 등) 안에서 직접 appendActivityLog를 호출한다.
  const _preActivityLogSetItem = localStorage.setItem;
  localStorage.setItem = function (key, value) {
    const m = typeof key === "string" ? /^acct:([^:]+):(.+)$/.exec(key) : null;
    let oldRaw = null;
    if (m) { try { oldRaw = localStorage.getItem(key); } catch (e) {} }
    _preActivityLogSetItem(key, value);
    if (!m || oldRaw === value) return; // 실제로 값이 바뀐 경우에만 기록
    try {
      const accountId = m[1];
      const relKey = m[2];
      const acc = accountId === CURRENT_ACCOUNT_ID ? { username: CURRENT_ACCOUNT_DISPLAY_NAME } : (findAccountById(accountId) || {});
      const cat = activityCategoryForRelKey(relKey);
      recordActivityChange({
        accountId,
        accountName: acc.username || "(삭제된 계정)",
        viaMasterName: MASTER_ORIGIN_ACCOUNT ? MASTER_ORIGIN_ACCOUNT.username : null,
        categoryKey: cat.key,
        categoryLabel: cat.label,
        subLabel: activitySubLabel(relKey),
        diff: buildActivityDiffLines(oldRaw, value),
      });
    } catch (e) { /* 로그 기록 실패가 실제 저장에 영향을 주면 안 된다 */ }
  };


  // 화면 오른쪽 아래 "새로고침" 버튼을 누르면, 다른 사람/다른 기기에서 바뀐 내용을
  // 서버에서 다시 받아오기 위해 페이지를 실제로 다시 불러온다(location.reload()).
  // 다만 이 경우에는 평소처럼 "홈"으로 돌아가지 않고, 누르기 직전에 보고 있던
  // 페이지를 그대로 유지해야 하므로, 새로고침 직전에 sessionStorage에 현재 페이지를
  // 잠깐 남겨두고 새로 불러온 뒤 한 번만 복원하고 지운다.
  // 방금 로그인/계정 생성으로 들어온 경우에만(=이 새로고침이 로그인 직후인 경우에만)
  // "오늘의 브리핑" 히어로 팝업을 한 번 띄운다. 세션 유지 중 브라우저를 새로 열거나
  // "새로고침" 버튼을 눌렀을 때는 뜨지 않는다.
  let _justLoggedIn = false;
  try {
    if (sessionStorage.getItem("app:just-logged-in") === "1") {
      _justLoggedIn = true;
      sessionStorage.removeItem("app:just-logged-in");
    }
  } catch (e) {}

  const REFRESH_RESTORE_PAGE_KEY = "app:refresh-restore-page";
  const VALID_PAGES = ["home", "calendar", "agents", "notes", "interviews", "qa", "schedule"];
  let _refreshRestorePage = null;
  try {
    const saved = sessionStorage.getItem(REFRESH_RESTORE_PAGE_KEY);
    sessionStorage.removeItem(REFRESH_RESTORE_PAGE_KEY);
    if (saved && VALID_PAGES.indexOf(saved) !== -1) _refreshRestorePage = saved;
  } catch (e) {}

  const state = {
    // 마스터 계정은 다른 페이지를 볼 필요가 없으므로 항상 "계정 관리" 페이지만 보여준다.
    // 마스터가 아닌 계정은 (로그인 직후든, 세션이 유지된 채 브라우저를 껐다 켰든)
    // 앱을 새로 열 때마다 항상 "홈" 화면을 메인으로 보여준다. 이전에 보던
    // 페이지를 기억해서 복원하지 않는다. 예외적으로, "새로고침" 버튼을 눌러서
    // 다시 불러온 경우에는 누르기 직전 페이지를 그대로 복원한다.
    page: CURRENT_ACCOUNT_IS_MASTER ? "master" : (_refreshRestorePage || "home"),
  };

  // "새로고침" 버튼 클릭 핸들러: 지금 보던 페이지를 기억해두고 나서 새로 불러온다.
  // cloudHydrate()가 페이지를 새로 불러올 때 다시 실행되므로, 서버에 가장 최근에
  // 저장된 내용으로 자연스럽게 갱신된다.
  function performServerRefresh() {
    try { sessionStorage.setItem(REFRESH_RESTORE_PAGE_KEY, state.page); } catch (e) {}
    location.reload();
  }

  // 목록에서 눌러서 펼쳐본 상태(면담일지 펼침, 캘린더/할일 상세 펼침, 메모 펼침, "더보기" 등)는
  // 그 화면을 잠깐 보다가 떠나면 초기화해서, 나중에 다시 들어올 때는 항상 접힌 채로 깔끔하게
  // 보이게 한다. 전역 검색 결과를 눌러 다른 화면의 특정 항목을 펼쳐서 보여주는 기능은 "이동할
  // 목적지" 화면의 상태를 미리 켜둔 뒤 setPage를 호출하는 방식이라, 여기서는 "떠나는 화면"의
  // 상태만 초기화해야 서로 부딪히지 않는다.
  function _resetExpandedStateForPage(p) {
    if (p === "home") {
      if (typeof homeUi !== "undefined") homeUi.interviewAlertExpanded = false;
    } else if (p === "calendar") {
      if (typeof cal !== "undefined") { cal.expandedEntries = {}; cal.upcomingExpanded = false; }
      if (typeof todoUi !== "undefined") { todoUi.expanded = {}; todoUi.doneExpanded = false; }
    } else if (p === "notes") {
      if (typeof notesUi !== "undefined") notesUi.expanded = {};
    } else if (p === "interviews") {
      if (typeof interviewsUi !== "undefined") interviewsUi.expandedIds = new Set();
    }
  }

  // opts.year / opts.monthIndex를 넘기면 "월별 스케줄"·"품질 관리" 페이지를 그 달로 열어준다
  // (예: 월마감 확인 팝업에서 지난달 항목을 눌렀을 때). 넘기지 않으면 기존과 동일하게
  // 항상 실시간 기준 당월을 보여준다.
  function setPage(p, opts) {
    // 마스터 계정은 계정 관리 페이지 외에는 이동하지 않는다.
    if (CURRENT_ACCOUNT_IS_MASTER) { state.page = "master"; renderApp(); return; }
    if (p !== state.page) _resetExpandedStateForPage(state.page); // 떠나는 화면의 펼침 상태 초기화
    const hasTargetMonth = !!(opts && typeof opts.year === "number" && typeof opts.monthIndex === "number");
    // "월별 스케줄" 카테고리를 누르면 기본적으로 실시간 기준 당월 스케줄을 보여준다.
    if (p === "schedule" && typeof scheduleUi !== "undefined") {
      scheduleUi.year = hasTargetMonth ? opts.year : today.getFullYear();
      scheduleUi.monthIndex = hasTargetMonth ? opts.monthIndex : today.getMonth();
    }
    // "품질 관리" 카테고리를 누르면 기본적으로 실시간 기준 당월 QA 점수를 보여준다.
    if (p === "qa" && typeof qaUi !== "undefined") {
      qaUi.year = hasTargetMonth ? opts.year : today.getFullYear();
      qaUi.monthIndex = hasTargetMonth ? opts.monthIndex : today.getMonth();
    }
    // 이제 마지막으로 보던 페이지를 저장/복원하지 않으므로(항상 홈에서 시작),
    // localStorage에 따로 기록하지 않는다.
    state.page = p;
    renderApp();
  }

