  // ==================== 클라우드 동기화 런타임: 실시간 변경 반영, 충돌 배너 UI, 실제 push/pull(cloudPush/cloudHydrate), 실시간 구독 ====================
  // (예전 01-common.js에서 분리됨 — 실행 순서·내용은 그대로입니다)

  const CLOUD_KEY_LABELS = [
    ["personal-schedule:data", "월별 스케줄"],
    ["personal-qa:data", "품질 관리(QA)"],
    ["personal-interviews:data", "면담일지"],
    ["personal-agents:data", "상담사 관리"],
    ["personal-notes:data", "업무 정리(메모)"],
    ["personal-calendar:todos", "캘린더/할일"],
    ["personal-monthclose:data", "월마감 확인"],
    ["personal-app:accounts", "계정 목록"],
    ["personal-app:discord-notify-settings", "디스코드 알림 설정"],
  ];
  function cloudKeyLabel(key) {
    const found = CLOUD_KEY_LABELS.find(([frag]) => key.indexOf(frag) !== -1);
    return found ? found[1] : "데이터";
  }

  /* ---- 실시간 변경 사항을 "지금 이 화면이 들고 있는 메모리"에 곧바로 반영하기.
     각 화면(모듈)은 localStorage에서 한 번 읽어들인 값을 자바스크립트 변수(interviewsData,
     notesData 등)에 담아두고 그걸로 화면을 그린다. 그래서 남이 저장한 내용이 localStorage에만
     반영되고 이 변수들을 다시 안 읽어오면, 다른 화면 갔다가 돌아와도 여전히 예전 내용이 보인다.
     아래 함수는 바뀐 key에 맞는 모듈 변수를 즉시 다시 읽어들이고, 그 데이터를 사용하는
     화면 이름들을 돌려준다 — "지금 보고 있는 화면"이 그 목록에 있을 때만 그 자리에서
     다시 그려줄지 말지를 판단하는 데 쓴다. */
  function _monthDataKeyMatch(key) {
    const m = key.match(/personal-calendar:(\d{4})-(\d{2})$/);
    if (!m) return null;
    return { year: Number(m[1]), monthIndex: Number(m[2]) - 1 };
  }
  function _applyRemoteChangeToMemory(key) {
    if (key.indexOf("personal-calendar:todos") !== -1) {
      todos = loadTodos();
      return ["calendar", "home"];
    }
    const monthMatch = _monthDataKeyMatch(key);
    if (monthMatch) {
      // 지금 화면에 열려 있는 달과 같을 때만 그 자리에서 다시 읽어들인다(다른 달 데이터는
      // 어차피 화면에 안 보이니 나중에 그 달로 이동할 때 자연스럽게 새로 읽힌다).
      if (cal.year === monthMatch.year && cal.monthIndex === monthMatch.monthIndex) loadMonth(cal.year, cal.monthIndex);
      return ["calendar", "home"];
    }
    if (key.indexOf("personal-notes:data") !== -1) {
      undoRestoreObjectInPlace(notesData, loadNotesData());
      return ["notes", "home"];
    }
    if (key.indexOf("personal-agents:data") !== -1) {
      agentsData = loadAgentsData();
      return ["agents", "home", "interviews", "schedule", "qa"];
    }
    if (key.indexOf("personal-qa:data") !== -1) {
      qaData = loadQAData();
      return ["qa"];
    }
    if (key.indexOf("personal-interviews:data") !== -1) {
      interviewsData = loadInterviewsData();
      return ["interviews", "home"];
    }
    if (key.indexOf("personal-schedule:data") !== -1) {
      reloadScheduleData();
      return ["schedule", "home"];
    }
    if (key.indexOf("personal-monthclose:data") !== -1) {
      monthCloseData = loadMonthCloseData();
      return ["home"];
    }
    return [];
  }
  // 지금 어딘가에 글자를 입력 중인지(텍스트칸에 커서가 가 있는지) 확인한다. 입력 중일 때
  // 화면을 억지로 다시 그리면 커서 위치나 아직 저장 안 된 입력 내용이 날아갈 수 있어서,
  // 그럴 때는 그 자리에서 바로 반영하지 않고 예전처럼 "새로고침" 배너로만 알린다.
  // 예외: 하단 내비게이션의 "이름 통합 검색"(#global-search-root 안, #gs-input)은
  // renderApp()이 다시 그리는 #page-inner 밖에 따로 떠 있고, 그 자체 로직도 renderApp()과
  // 무관하게 매번 자기 결과 패널만 갱신하도록 만들어져 있어서(13-global-search.js 상단 주석
  // 참고) — renderApp()이 실행돼도 이 입력창의 값이나 커서는 전혀 건드리지 않는다. 그런데도
  // 이 검사에 포함시키면, 검색창에 커서만 가 있어도(실제로는 아무 데이터도 편집 중이 아닌데)
  // 다른 사람이 전혀 무관한 걸 저장할 때마다 "다른 관리자가 방금 수정했어요" 배너가 매번
  // 떠서, 마치 같은 항목을 동시에 고친 것처럼 잘못 보이는 문제가 있었다. 그래서 이 검색창은
  // "편집 중"으로 치지 않는다.
  function _hasActiveEditableFocus() {
    const el = document.activeElement;
    if (!el) return false;
    if (el.id === "gs-input") return false;
    // 목록 화면의 검색/필터 입력칸(면담일지 "상담사 이름 또는 LDAP 검색", 상담사 관리
    // 검색 등)도 위 gs-input과 똑같은 이유로 예외 처리한다: 이 칸에 값이 있어도 그건
    // interviewsUi.searchQuery 같은 상태값에 그대로 남아있고 다시 그릴 때도 그 값 그대로
    // 복원되므로, 화면을 다시 그린다고 해서 "입력 중이던 내용"이 사라지지 않는다. 이런
    // 칸에 커서만 가 있어도 무관한 저장 때마다 마치 편집 중인 것처럼 취급되는 걸 막는다.
    if (el.classList && el.classList.contains("agent-search-input-field")) return false;
    return el.tagName === "TEXTAREA" || el.tagName === "INPUT" || !!el.isContentEditable;
  }
  // 지금 이 브라우저 탭이 실제로 화면에 보이고 있는지. 탭을 다른 곳으로 전환해도
  // document.activeElement는 그대로 남아있어서(포커스가 자동으로 풀리지 않음),
  // 백그라운드 탭에 있는 동안 들어온 변경까지 "지금 입력 중"으로 오판해 팝업을
  // 만들어버리는 문제가 있었다. 화면이 실제로 보이는 상태인지까지 함께 확인해서,
  // 안 보이는 동안 생긴 변경은 조용히 메모리에만 반영하고 팝업 없이 넘어가게 한다.
  function _isTabVisible() {
    return document.visibilityState === "visible" && document.hasFocus();
  }

  /* ---- 배너 UI: "남이 방금 고쳤어요" / "저장 충돌" 을 화면 위쪽에 띄운다.
     화면을 그 자리에서 억지로 다시 그리면 입력 중이던 내용이 튈 수 있어서,
     실제 반영은 사용자가 버튼을 눌러 새로고침할 때만 이뤄지게 한다. */
  function _liveBannerWrap() {
    let el = document.getElementById("cloud-live-banner-wrap");
    if (!el) {
      el = document.createElement("div");
      el.id = "cloud-live-banner-wrap";
      el.className = "cloud-live-banner-wrap";
      document.body.appendChild(el);
    }
    return el;
  }
  function _renderConflictBanner() {
    let el = document.getElementById("cloud-conflict-banner");
    if (!_conflictedKeys.size) { if (el) el.remove(); return; }
    if (!el) {
      el = document.createElement("div");
      el.id = "cloud-conflict-banner";
      el.className = "cloud-live-banner conflict";
      _liveBannerWrap().prepend(el);
    }
    const labels = Array.from(_conflictedKeys).map(cloudKeyLabel).join(", ");
    el.innerHTML = `
      ${ICON_BELL}
      <div class="cloud-live-banner-body">
        <div class="cloud-live-banner-title">저장 충돌</div>
        <div class="cloud-live-banner-desc"><b>${esc(labels)}</b>의 같은 항목을 다른 관리자(또는 다른 탭)가 거의 같은 순간에 고쳐서, 자동으로 합칠 수 없었어요.<br>내가 방금 한 변경이 아직 저장되지 못했어요.</div>
        <div class="cloud-live-banner-actions">
          <button type="button" class="ghost-btn" id="cloud-conflict-reload">최신 내용 불러오기</button>
          <button type="button" class="primary-btn" id="cloud-conflict-force">내 변경으로 덮어쓰기</button>
        </div>
      </div>
    `;
    document.getElementById("cloud-conflict-reload").onclick = () => location.reload();
    document.getElementById("cloud-conflict-force").onclick = async () => {
      const keys = Array.from(_conflictedKeys);
      _conflictedKeys.clear();
      _renderConflictBanner();
      for (const k of keys) {
        try { await cloudPush(k, localStorage.getItem(k), { force: true }); } catch (e) {}
      }
    };
  }
  // 예전에는 여기에 "다른 관리자가 방금 수정했어요"라는 배너가 하나 더 있었다. 그런데
  // 이 배너는 "지금 이 화면과 관련된 데이터가 바뀌었고, 마침 내가 뭔가 입력 중이었다"는
  // 것만 볼 뿐 실제로 내가 지금 만지고 있는 항목·필드와 겹쳤는지는 전혀 확인하지
  // 않았다. 그래서 완전히 무관한 항목이 추가/수정돼도(예: 다른 상담사의 면담 기록을
  // 새로 추가) 화면 아무 입력칸에 커서만 가 있으면(심지어 검색창이거나, 다른 브라우저
  // 탭으로 넘어가기 전에 마지막으로 커서를 뒀던 칸이어도) 마치 뭔가 겹친 것처럼
  // 떠버렸다. 진짜로 같은 항목의 같은 필드를 동시에 고쳤는지는 저장 시점의 3-way
  // 병합(_merge3)이 훨씬 정확하게 판단할 수 있으므로, 이 추측성 배너는 없앴다.
  // 대신 원격 변경은 아래 실시간 구독 핸들러에서 메모리(및 로컬 저장소)에는 항상
  // 즉시 반영해두고, 화면을 다시 그리는 것만 "지금 입력 중이 아닐 때"로 미룬다 —
  // 편집을 마치고 저장하면 그 시점에 자동 병합/충돌 감지가 실제로 겹친 부분만
  // 정확히 짚어서 알려준다(_renderFieldConflictBanner, _renderConflictBanner).
  // "저장은 정상적으로 진행됐지만, 그중 일부 지점만 다른 관리자와 겹쳐서 내가 방금
  // 저장한 값으로 정했어요"를 알려주는 가벼운 배너. _renderConflictBanner(저장 충돌)와
  // 달리 저장을 막지 않으며, 확인 버튼을 누르면 그냥 사라진다.
  function _renderFieldConflictBanner() {
    let el = document.getElementById("cloud-field-conflict-banner");
    if (!_fieldConflictNotices.size) { if (el) el.remove(); return; }
    if (!el) {
      el = document.createElement("div");
      el.id = "cloud-field-conflict-banner";
      el.className = "cloud-live-banner";
      _liveBannerWrap().appendChild(el);
    }
    const labels = Array.from(new Set(Array.from(_fieldConflictNotices.keys()).map(cloudKeyLabel))).join(", ");
    const spotCount = Array.from(_fieldConflictNotices.values()).reduce((sum, s) => sum + s.size, 0);
    el.innerHTML = `
      ${ICON_BELL}
      <div class="cloud-live-banner-body">
        <div class="cloud-live-banner-title">일부 항목이 거의 동시에 수정됐어요</div>
        <div class="cloud-live-banner-desc"><b>${esc(labels)}</b>에서 ${spotCount}곳을 다른 관리자(또는 다른 탭)와 겹쳐서 고쳤어요.<br>겹치지 않은 나머지 변경은 자동으로 함께 합쳐 저장했고, 겹친 부분만 방금 내가 저장한 값으로 반영됐어요.<br>혹시 다른 관리자가 그 부분을 다르게 고치려던 거였다면 다시 확인해 주세요.</div>
        <div class="cloud-live-banner-actions">
          <button type="button" class="primary-btn" id="cloud-field-conflict-dismiss">확인</button>
        </div>
      </div>
      <button type="button" class="cloud-live-banner-close" id="cloud-field-conflict-close" aria-label="닫기">✕</button>
    `;
    const dismiss = () => { _fieldConflictNotices.clear(); _renderFieldConflictBanner(); };
    document.getElementById("cloud-field-conflict-dismiss").onclick = dismiss;
    document.getElementById("cloud-field-conflict-close").onclick = dismiss;
  }

  async function _doCloudPush(key, value, opts) {
    const force = !!(opts && opts.force);
    const attempt = (opts && opts.attempt) || 0;
    try {
      const newTs = new Date().toISOString();
      const expected = _knownServerUpdatedAt[key];
      let wroteOk = true;
      let handledByPatch = false;
      if (expected && !force) {
        const patched = await _tryPatchPush(key, value, expected, newTs);
        if (patched) { wroteOk = patched.applied; handledByPatch = true; }
      }
      if (!handledByPatch) {
        if (expected && !force) {
          // 낙관적 동시성 제어: 마지막으로 확인한 서버 버전이 그대로일 때만 저장한다.
          // 그 사이 다른 사람이 먼저 저장해서 updated_at이 바뀌었으면 이 update는
          // 아무 행도 바꾸지 못하고 0건으로 끝난다 → 그걸로 충돌을 감지한다.
          const { data, error } = await cloud
            .from("kv_store")
            .update({ value, updated_at: newTs })
            .eq("key", key)
            .eq("updated_at", expected)
            .select("key");
          if (error) throw error;
          wroteOk = !!(data && data.length);
        } else {
          await cloud.from("kv_store").upsert({ key, value, updated_at: newTs });
        }
      }
      if (!wroteOk) {
        // 곧바로 팝업을 띄우지 않고, 먼저 자동으로 합쳐볼 수 있는지 시도한다. 서로 다른
        // 항목을 고친 경우가 대부분이라 여기서 대부분 조용히 해결된다(최대 3번 재시도).
        if (attempt < 3) {
          const merged = await _tryAutoMergeConflict(key, value);
          if (merged !== null) return _doCloudPush(key, merged, { force: false, attempt: attempt + 1 });
        }
        _conflictedKeys.add(key);
        _renderConflictBanner();
        notifyCloudSyncSettle(false);
        return;
      }
      _conflictedKeys.delete(key);
      _renderConflictBanner();
      _knownServerUpdatedAt[key] = newTs;
      _knownServerValue[key] = value;
      _ourWriteTimestamps[key] = newTs;
      notifyCloudSyncSettle(true);
    } catch (e) {
      /* 네트워크 문제로 실패해도 로컬 저장은 이미 되어 있어 화면은 그대로 동작 */
      notifyCloudSyncSettle(false);
    }
  }
  function cloudPush(key, value, opts) {
    if (!isCloudSynced(key)) return Promise.resolve();
    notifyCloudSyncStart();
    const force = !!(opts && opts.force);
    const prev = _pushChains[key] || Promise.resolve();
    const run = prev.then(
      () => _doCloudPush(key, value, { force }),
      () => _doCloudPush(key, value, { force })
    );
    _pushChains[key] = run.catch(() => {});
    return _trackCloudWrite(run);
  }
  async function _doCloudDelete(key) {
    try {
      await cloud.from("kv_store").delete().eq("key", key);
      delete _knownServerUpdatedAt[key];
      delete _knownServerValue[key];
      _conflictedKeys.delete(key);
      _renderConflictBanner();
      notifyCloudSyncSettle(true);
    } catch (e) { notifyCloudSyncSettle(false); }
  }
  function cloudDelete(key) {
    if (!isCloudSynced(key)) return Promise.resolve();
    notifyCloudSyncStart();
    const prev = _pushChains[key] || Promise.resolve();
    const run = prev.then(() => _doCloudDelete(key), () => _doCloudDelete(key));
    _pushChains[key] = run.catch(() => {});
    return _trackCloudWrite(run);
  }
  // localStorage.setItem / removeItem을 감싸기 전에 먼저 원본 함수를 바인딩해둔다.
  // cloudHydrate()가 클라우드에서 값을 끌어올 때 이 "원본" 함수로 직접 저장해야,
  // 방금 받아온 값을 다시 클라우드로 그대로 되쏘는(불필요한 업서트 + 페이지를 열 때마다
  // "동기화 중…" 토스트가 잠깐 뜨는) 낭비를 막을 수 있다.
  const _origSetItem = localStorage.setItem.bind(localStorage);
  const _origRemoveItem = localStorage.removeItem.bind(localStorage);
  async function cloudHydrate() {
    if (!cloud) return;
    try {
      const { data, error } = await cloud.from("kv_store").select("key,value,updated_at");
      if (error || !data) return;
      data.forEach((row) => {
        try { _origSetItem(row.key, row.value); } catch (e) {}
        _knownServerUpdatedAt[row.key] = row.updated_at;
        _knownServerValue[row.key] = row.value;
      });
    } catch (e) { /* 오프라인 등으로 실패하면 이전에 이 브라우저에 남아있던 값으로 동작 */ }
  }
  // localStorage.setItem / removeItem을 감싸서, 로컬 저장은 그대로 즉시 처리하고
  // 필요한 키만 조용히 Supabase에도 함께 저장/삭제한다 (실패해도 화면엔 영향 없음).
  localStorage.setItem = function (key, value) {
    _origSetItem(key, value);
    cloudPush(key, value);
  };
  localStorage.removeItem = function (key) {
    _origRemoveItem(key);
    cloudDelete(key);
  };
  // 이 업데이트(Supabase Auth 전환) 이전부터 로그인 상태가 유지되던 브라우저는
  // 이 앱 자체의 로그인 세션(SESSION_KEY)은 남아있어도 Supabase Auth 세션은
  // 아직 없다. 그 상태로 두면 화면은 "로그인됨"으로 보이는데 kv_store 읽기/
  // 쓰기는 전부 막혀서(RLS가 authenticated만 허용) 데이터가 안 보이거나 저장이
  // 계속 실패하는 것처럼 보이므로, 이 경우엔 로그인 화면으로 돌려보내
  // 한 번 더 로그인하게 한다(그 로그인 과정에서 Supabase Auth 세션도 함께
  // 만들어진다).
  if (cloud && getSession()) {
    try {
      const { data } = await cloud.auth.getSession();
      if (!data || !data.session) {
        clearSession();
        clearMasterOrigin();
        clearTeamLoginMember();
      }
    } catch (e) {}
  }
  await cloudHydrate();
  runDailyAutoBackupIfNeeded().catch(() => {}); // 자정이 지난 뒤 처음 여는 경우, 어제치 백업을 조용히 만들어둠(화면엔 영향 없음)

  /* ---- 실시간 구독: 다른 사람(또는 다른 탭)이 저장하면 곧바로 반영한다.
     - 우선 로컬 저장소(localStorage)에도 최신 값을 바로 써둔다. 이렇게 해야 지금 다른
       화면을 보고 있다가 나중에 그 화면으로 돌아왔을 때(또는 그 모듈이 새로 데이터를
       읽어들일 때) 새로고침 없이도 최신 내용이 보인다.
     - 그 다음 해당 데이터를 들고 있는 모듈의 메모리 변수도 즉시 다시 읽어들인다.
     - "지금 보고 있는 화면"이 바로 그 데이터를 쓰는 화면이라면: 입력 중인 칸이 없을 때는
       그 자리에서 곧장 다시 그려서 보여주고, 입력 중인 칸이 있을 때는(화면을 억지로 다시
       그리면 커서/미저장 입력이 튈 수 있으므로) 예전처럼 "바뀌었어요 + 새로고침" 배너로만
       알린다. 지금 보고 있는 화면과 무관한 데이터라면 이미 메모리에 반영해뒀으니 배너 없이
       조용히 넘어간다. 내가 방금 보낸 저장이 그대로 돌아온 경우(에코)는 제외한다. */
  if (cloud) {
    cloud
      .channel("kv_store_live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "kv_store" },
        (payload) => {
          if (!_appBooted) return; // 로그인 화면 등 앱이 아직 초기화되기 전에는 안전하게 무시
          const row = payload.new && payload.new.key ? payload.new : payload.old;
          if (!row || !row.key || !isCloudSynced(row.key)) return;
          if (payload.eventType === "DELETE") {
            delete _knownServerUpdatedAt[row.key];
            delete _knownServerValue[row.key];
            return;
          }
          if (_ourWriteTimestamps[row.key] === row.updated_at) return; // 내가 방금 쓴 것의 에코
          _knownServerUpdatedAt[row.key] = row.updated_at;
          _knownServerValue[row.key] = row.value;
          if (localStorage.getItem(row.key) === row.value) return; // 이미 같은 내용이면 반영할 필요 없음
          _origSetItem(row.key, row.value); // 로컬 저장소에는 언제나 즉시 최신 내용 반영 (탭이 안 보이는 동안에도 마찬가지)
          let affectedPages = [];
          try { affectedPages = _applyRemoteChangeToMemory(row.key); } catch (e) {}
          const isCurrentPageAffected = affectedPages.indexOf(state.page) !== -1;
          // 화면(그림)을 다시 그리는 것만 "지금 이 탭이 실제로 보이고 있고 + 뭔가
          // 입력 중인 칸에 커서가 가 있지 않을 때"로 미룬다. 데이터 자체(메모리·로컬
          // 저장소)는 위에서 이미 최신 상태로 반영해뒀으니, 지금 당장 다시 그리지
          // 않아도 잃어버리는 내용은 없다 — 나중에 화면이 다시 그려질 때(탭으로
          // 돌아오거나, 입력을 마치거나, 다른 조작으로 renderApp이 호출될 때) 자동으로
          // 최신 내용이 보인다. 겹쳤는지 여부를 추측해서 알리는 배너는 띄우지 않는다:
          // 진짜로 같은 항목·같은 필드가 겹친 경우는 저장 시점의 3-way 병합이 정확하게
          // 잡아내서 _renderFieldConflictBanner / _renderConflictBanner로 알려준다.
          if (isCurrentPageAffected && !_hasActiveEditableFocus() && _isTabVisible()) {
            renderApp();
          }
        }
      )
      .subscribe();
  }
  // 탭이 백그라운드에 있는 동안에도 데이터(메모리·로컬 저장소)는 이미 최신으로
  // 반영해뒀지만, 화면을 다시 그리는 것만 미뤄뒀을 수 있다. 탭이 다시 보이게 되거나
  // 입력 중이던 칸에서 포커스가 빠지면, 지금 화면이 안전하게 다시 그릴 수 있는
  // 상태인지 확인해서 최신 내용으로 갱신한다 — 그래야 "다른 탭 보고 오니 화면이
  // 예전 내용"인 채로 남아있는 일이 없다. 배너 없이 조용히 갱신만 한다.
  function _catchUpRenderIfSafe() {
    if (!_appBooted) return; // 로그인 화면에서는 아직 renderApp()이 참조하는 값들이 없으므로 건너뜀
    if (!_isTabVisible() || _hasActiveEditableFocus()) return;
    try { renderApp(); } catch (e) {}
  }
  document.addEventListener("visibilitychange", _catchUpRenderIfSafe);
  window.addEventListener("focus", _catchUpRenderIfSafe);
