  // ==================== 공통 유틸(esc/pad2/genId), 공용 페이지네이션 ====================
  // (예전에 있던 오른쪽 아래 "설정" 메뉴 팝오버는 삭제됨 — 디스코드 채널은 상단 상태표시줄로 옮겼고,
  //  업무 구분 관리는 상담사 관리 화면의 업무 구분 "관리" 버튼에서 그대로 열 수 있다.)
  // (예전 01-common.js에서 분리됨 — 실행 순서·내용은 그대로입니다)
  /* ===================== 공통 유틸 ===================== */
  function pad2(n) { return String(n).padStart(2, "0"); }
  // HTML에 끼워 넣을 문자열을 안전하게 만든다.
  // 예전에는 document.createElement("div")에 textContent를 넣고 innerHTML을
  // 읽는 방식이었는데, 그 방식은 브라우저 규칙상 &, <, > 세 글자만 바꾸고
  // 따옴표는 그대로 둔다. 그런데 이 앱은 esc()를 태그 사이뿐 아니라
  // value="${esc(...)}" · title="${esc(...)}" 처럼 "속성값 안"에서도 많이 쓰기
  // 때문에, 일정 제목이나 셀 메모에 큰따옴표가 하나만 들어가도 속성이 거기서
  // 끊겨 마크업이 깨졌다. 그래서 따옴표까지 포함해 직접 치환한다
  // (DOM을 안 쓰므로 더 빠르고, 로그인 전처럼 document가 준비되지 않은
  //  시점에 호출돼도 안전하다).
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  function genId() { return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

  /* ===================== 공용 페이지네이션 ===================== */
  // 목록이 길어질 때 10개 단위로 잘라서 보여주기 위한 공용 헬퍼.
  const PAGE_SIZE = 12; // 상담사 관리 / 면담일지 목록 페이지당 표시 개수
  // list 전체와 원하는 page(1부터 시작)를 넣으면, 범위를 벗어난 page는 알아서
  // 안쪽으로 보정해서 { items, page, totalPages }를 돌려준다.
  function paginateList(list, page) {
    const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    const safePage = Math.min(Math.max(1, page || 1), totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    return { items: list.slice(start, start + PAGE_SIZE), page: safePage, totalPages };
  }
  // actionName은 클릭 시 data-page-action 값으로 붙어서, 각 화면에서 이 값으로
  // 자기 목록의 페이지 상태를 구분해 처리한다.
  function renderPaginationHtml(page, totalPages, actionName) {
    if (totalPages <= 1) return "";
    return `
      <div class="page-nav" data-page-action="${actionName}">
        <button type="button" class="page-nav-btn" data-page-nav="prev" ${page <= 1 ? "disabled" : ""}>이전</button>
        <span class="page-nav-info">${page} / ${totalPages}페이지</span>
        <button type="button" class="page-nav-btn" data-page-nav="next" ${page >= totalPages ? "disabled" : ""}>다음</button>
      </div>
    `;
  }
  // renderPaginationHtml로 그려진 이전/다음 버튼에 동작을 붙인다.
  // 버튼은 이미 범위를 벗어나면 disabled 처리되어 있으므로, 여기서는 그냥
  // -1(이전)/+1(다음)만큼 페이지를 옮겨달라고 onDelta(delta)를 호출해주면 된다.
  function attachPaginationHandlers(root, actionName, onDelta) {
    const nav = root.querySelector(`.page-nav[data-page-action="${actionName}"]`);
    if (!nav) return;
    const prevBtn = nav.querySelector('[data-page-nav="prev"]');
    const nextBtn = nav.querySelector('[data-page-nav="next"]');
    if (prevBtn) prevBtn.onclick = () => onDelta(-1);
    if (nextBtn) nextBtn.onclick = () => onDelta(1);
  }
