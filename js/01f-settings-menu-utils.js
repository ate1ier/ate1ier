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
  // pageSize를 생략하면(또는 0 이하면) 기본값 PAGE_SIZE를 쓴다 — 상담사 관리처럼
  // 화면 높이에 맞춰 쪽당 개수를 동적으로 계산하는 화면에서만 값을 넘겨준다.
  function paginateList(list, page, pageSize) {
    const size = pageSize && pageSize > 0 ? pageSize : PAGE_SIZE;
    const totalPages = Math.max(1, Math.ceil(list.length / size));
    const safePage = Math.min(Math.max(1, page || 1), totalPages);
    const start = (safePage - 1) * size;
    return { items: list.slice(start, start + size), page: safePage, totalPages };
  }
  // actionName은 클릭 시 data-page-action 값으로 붙어서, 각 화면에서 이 값으로
  // 자기 목록의 페이지 상태를 구분해 처리한다. alwaysShow를 true로 주면 전체
  // 페이지가 1개뿐이라 실제로 다음 페이지로 넘어갈 일이 없어도 "1 / 1페이지"
  // 형태로 이전/다음 버튼(둘 다 비활성)과 함께 계속 표시한다.
  function renderPaginationHtml(page, totalPages, actionName, alwaysShow) {
    if (totalPages <= 1 && !alwaysShow) return "";
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

  /* ===================== 표 부분 patch (domReconcileTable) =====================
   * [성능 개선 계획 Phase 2] 셀 하나만 바뀌어도 표 전체를 문자열로 다시 만들어
   * innerHTML을 통째로 교체하던 것을, 실제로 값이 달라진 <td>/<th>만 그 자리에서
   * 고쳐 쓰도록 하는 공용 유틸. QA 표(05f-qa-render.js)·월별 스케줄 표
   * (07a5-schedule-log-capture.js)가 함께 쓴다.
   *
   * tableEl: 지금 화면에 붙어있는 <table> 엘리먼트(기존 DOM, 이벤트가 이미 붙어있음)
   * newTableHtml: build*TableHtml()이 새로 만들어낸 문자열. <table>이 그 문자열
   *   어딘가(바깥에 wrap용 div가 있어도 됨)에 있기만 하면 된다.
   * 반환값: true면 그 자리에서 다 고쳐 썼으니 이벤트 재바인딩이 필요 없다는 뜻.
   *   false면 (예: 행 개수 자체가 달라짐) patch를 포기했다는 뜻이니, 호출부가
   *   지금까지처럼 표 전체를 다시 그리고 이벤트를 다시 붙여야 한다.
   *
   * 규칙(자세한 이유는 각 처리 위 주석 참고):
   * - <thead>/<tbody> 각각 행 개수가 안 맞으면 그 표 전체를 포기(false)한다.
   *   (인원이 추가/삭제되는 등 "행 자체가 달라지는" 흔치 않은 경우는 여기서
   *   걸러지고, 안전하게 표 전체를 새로 그린다.)
   * - 칸(행 포함) 자체는 절대 새로 만들지 않고, 기존 DOM 노드의 class/속성/내용만
   *   필요한 만큼 고쳐 쓴다 — 그래야 그 칸에 이미 붙어있는 이벤트 핸들러가 그대로
   *   남아있는다(재바인딩 불필요).
   * - class 이름이 "…--selected"/"…--copied"로 끝나는 것들은 렌더링 함수가 만드는
   *   문자열에는 없고 화면에서만 나중에 JS로 붙이는 상태 표시라, 새 class로
   *   덮어쓰지 않고 그대로 보존한다.
   * - class에 "…--editing"이 붙어있는 칸(지금 사용자가 그 칸을 직접 타이핑해서
   *   고치는 중)은 아예 건드리지 않고 건너뛴다.
   * - <input> 하나만 든 칸은 칸 전체를 다시 쓰지 않고 그 input의 값/비활성 여부만
   *   바꾼다. 지금 포커스가 가 있는(사용자가 타이핑 중인) input은 값을 건드리지
   *   않아서, 다른 칸이 저장되며 표가 patch될 때 타이핑 중이던 값이 사라지지 않는다.
   */
  function domReconcileTable(tableEl, newTableHtml) {
    if (!tableEl || !newTableHtml) return false;
    let newTable;
    try {
      const tmp = document.createElement("template");
      tmp.innerHTML = newTableHtml;
      newTable = tmp.content.querySelector("table");
    } catch (e) { return false; }
    if (!newTable) return false;

    const RUNTIME_CLASS_RE = /--(selected|copied)$/;
    const EDITING_CLASS_RE = /--editing$/;

    function syncClassName(oldEl, newEl) {
      const oldTokens = (oldEl.className || "").split(/\s+/).filter(Boolean);
      const newTokens = (newEl.className || "").split(/\s+/).filter(Boolean);
      const preserved = oldTokens.filter((t) => RUNTIME_CLASS_RE.test(t));
      const merged = newTokens.slice();
      preserved.forEach((t) => { if (merged.indexOf(t) === -1) merged.push(t); });
      const mergedStr = merged.join(" ");
      if (oldEl.className !== mergedStr) oldEl.className = mergedStr;
    }
    function syncPlainAttributes(oldEl, newEl, skipNames) {
      const skip = skipNames || [];
      Array.from(newEl.attributes).forEach((attr) => {
        if (attr.name === "class" || skip.indexOf(attr.name) !== -1) return;
        if (oldEl.getAttribute(attr.name) !== attr.value) oldEl.setAttribute(attr.name, attr.value);
      });
      Array.from(oldEl.attributes).forEach((attr) => {
        if (attr.name === "class" || skip.indexOf(attr.name) !== -1) return;
        if (!newEl.hasAttribute(attr.name)) oldEl.removeAttribute(attr.name);
      });
    }
    function soleInput(el) {
      return (el.children.length === 1 && el.children[0].tagName === "INPUT") ? el.children[0] : null;
    }
    function reconcileCell(oldCell, newCell) {
      if (oldCell.tagName !== newCell.tagName) { oldCell.outerHTML = newCell.outerHTML; return; }
      if (EDITING_CLASS_RE.test(oldCell.className || "")) return; // 편집 중인 칸은 손대지 않는다
      syncClassName(oldCell, newCell);
      syncPlainAttributes(oldCell, newCell);

      const oldInput = soleInput(oldCell);
      const newInput = soleInput(newCell);
      if (oldInput && newInput) {
        if (document.activeElement !== oldInput) {
          const newVal = newInput.getAttribute("value") || "";
          if (oldInput.value !== newVal) oldInput.value = newVal;
        }
        const newDisabled = newInput.hasAttribute("disabled");
        if (oldInput.disabled !== newDisabled) oldInput.disabled = newDisabled;
        syncClassName(oldInput, newInput);
        syncPlainAttributes(oldInput, newInput, ["value", "disabled"]);
        return;
      }
      if (oldCell.innerHTML !== newCell.innerHTML) oldCell.innerHTML = newCell.innerHTML;
    }
    function reconcileRow(oldRow, newRow) {
      syncClassName(oldRow, newRow);
      syncPlainAttributes(oldRow, newRow);
      const oldCells = Array.from(oldRow.children);
      const newCells = Array.from(newRow.children);
      if (oldCells.length !== newCells.length) { oldRow.innerHTML = newRow.innerHTML; return; }
      for (let i = 0; i < oldCells.length; i++) reconcileCell(oldCells[i], newCells[i]);
    }
    function reconcileSection(oldSection, newSection) {
      if (!oldSection && !newSection) return true;
      if (!oldSection || !newSection) return false;
      const oldRows = Array.from(oldSection.children);
      const newRows = Array.from(newSection.children);
      if (oldRows.length !== newRows.length) return false;
      for (let i = 0; i < oldRows.length; i++) reconcileRow(oldRows[i], newRows[i]);
      return true;
    }

    if (!reconcileSection(tableEl.tHead, newTable.tHead)) return false;
    if (!reconcileSection(tableEl.tBodies[0], newTable.tBodies[0])) return false;
    return true;
  }
