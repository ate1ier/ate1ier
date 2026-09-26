  // 05a-qa-data.js — 데이터 로드/저장, 상세 만료 처리, 월 잠금
  // (05-qa.js를 기능 단위로 분할한 파일 중 하나. 실행 순서는 파일명 정렬로 유지됨)
  function loadQAData() {
    try {
      const raw = localStorage.getItem(QA_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return (parsed && typeof parsed === "object" && parsed.scores) ? parsed : { scores: {} };
    } catch (e) { return { scores: {} }; }
  }
  let qaData = loadQAData();
  // 월별 스케줄과 동일한 방식의 "월별 잠금". 잠긴 달은 점수 입력이 막힌다.
  if (!qaData.monthLocks || typeof qaData.monthLocks !== "object") qaData.monthLocks = {};
  // 엑셀 업로드로 뽑아낸 상세 QA 내역(회차별 감점/코멘트 원문 + 정리된 텍스트 캐시).
  // qaData(=계정별 클라우드 동기화 대상) 안에 같이 저장한다.
  if (!qaData.details || typeof qaData.details !== "object") qaData.details = {};

  // ----- 업로드한 엑셀 원문의 자동 만료 -----
  // 업로드일로부터 3개월이 지나면 회차별 원문(감점 항목/코멘트)을 서버(클라우드)와
  // 이 기기 양쪽 모두에서 완전히 지운다. 예전 요약본을 남겨두지 않고, 흔적 없이 삭제한다.
  const QA_DETAIL_EXPIRY_MONTHS = 3;
  function qaDetailExpiryDate(detail) {
    if (!detail || !detail.uploadedAt) return null;
    const d = new Date(detail.uploadedAt);
    if (isNaN(d.getTime())) return null;
    d.setMonth(d.getMonth() + QA_DETAIL_EXPIRY_MONTHS);
    return d;
  }
  function qaIsDetailExpired(detail) {
    const exp = qaDetailExpiryDate(detail);
    return !!exp && new Date() >= exp;
  }
  function qaPurgeExpiredDetails() {
    let changed = false;
    Object.keys(qaData.details).forEach((key) => {
      const detail = qaData.details[key];
      if (!detail || detail.purged) return;
      if (!qaIsDetailExpired(detail)) return;
      (detail.rounds || []).forEach((round) => {
        // 원문(감점/코멘트)을 흔적 없이 완전히 지운다. 별도 요약본도 남기지 않는다.
        round.items = [];
        delete round.localSummary;
      });
      detail.fileName = "";
      detail.purged = true;
      changed = true;
    });
    // saveQAData()가 localStorage에 쓰는 즉시 클라우드(Supabase)에도 같은 내용으로
    // 덮어써지므로, 지워진 원문은 이 기기뿐 아니라 서버에도 남지 않는다.
    if (changed) saveQAData();
  }
  qaPurgeExpiredDetails();

  function qaDetailKey(agentId, year, monthIndex) { return `${agentId}|${qaMonthKey(year, monthIndex)}`; }
  function getQADetail(agentId, year, monthIndex) { return qaData.details[qaDetailKey(agentId, year, monthIndex)] || null; }
  function setQADetail(agentId, year, monthIndex, detailObj) {
    qaData.details[qaDetailKey(agentId, year, monthIndex)] = detailObj;
    saveQAData();
  }
  // 상담사 1명의 등록된 엑셀(원문+정리된 텍스트 전부)을 완전히 삭제한다.
  function deleteQADetail(agentId, year, monthIndex) {
    delete qaData.details[qaDetailKey(agentId, year, monthIndex)];
    saveQAData();
  }
  // 해당 달에 등록된 모든 상담사의 엑셀(원문+정리된 텍스트 전부)을 한 번에 삭제한다.
  function deleteAllQADetails(year, monthIndex) {
    const suffix = `|${qaMonthKey(year, monthIndex)}`;
    let count = 0;
    Object.keys(qaData.details).forEach((key) => {
      if (key.endsWith(suffix)) { delete qaData.details[key]; count++; }
    });
    if (count > 0) saveQAData();
    return count;
  }

  let qaStatusTimer = null;
  function flashQAStatus(msg) {
    const el = document.getElementById("qa-status");
    if (!el) return;
    el.textContent = msg;
    clearTimeout(qaStatusTimer);
    qaStatusTimer = setTimeout(() => { el.textContent = ""; }, 1200);
  }
  function saveQAData() {
    try { localStorage.setItem(QA_KEY, JSON.stringify(qaData)); flashQAStatus("저장됨"); }
    catch (e) { flashQAStatus("저장 실패"); }
  }

  const qaUi = {
    year: today.getFullYear(),
    monthIndex: today.getMonth(), // 0-based. 실시간 기준 당월로 시작한다.
    searchQuery: "", // 상담사 검색어. 쉼표(,)로 여러 명을 한 번에 검색할 수 있다.
    // [macOS 스타일 재설계 4단계] 유형 필터 pill(전체/주간/야간/유선/채팅)의 현재 선택 상태.
    // qaFilterAgentsByMode()가 받는 mode 값과 동일한 키를 쓴다. 검색어와는 별개로 함께 적용된다.
    filterMode: "ALL",
  };

  // ----- 상담사 검색 -----
  // "상담사 관리"의 검색(이름/LDAP/초성)과 같은 방식을 쓰되, "주간"/"야간"/"채팅"/"유선"
  // 키워드를 입력하면 그 조건에 해당하는 인원이 모두 걸린다. 쉼표(,)로 여러 조건을 구분해서
  // 입력하면(이름+키워드를 섞어도 됨) 그 중 하나라도 일치하는 상담사를 모두 보여준다.
  function qaAgentMatchesSearch(a, query) {
    const terms = (query || "").split(",").map((t) => t.trim()).filter(Boolean);
    if (terms.length === 0) return true;
    return terms.some((t) => agentMatchesSearch(a, t));
  }
  // 상담사 상세에서 "품질 관리로 이동"을 눌렀을 때, 이동한 화면에서 그 인원의 행을
  // 한 번 강조해서 보여주기 위한 값. 렌더링 후 바로 비워서 다음 화면 갱신부터는
  // 강조가 남지 않게 한다.
  let qaHighlightAgentId = null;

