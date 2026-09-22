  // ==================== 업무 구분(유선/채팅 + 사용자 추가 항목) 공용 설정 ====================
  // 예전에는 "유선"/"채팅" 두 가지가 코드 곳곳에 글자 그대로 박혀 있었다. 스케줄의
  // "필요인력" 자동 계산·자동 채움 로직(07c-schedule-auto-fill.js)은 이 두 가지를
  // 기준으로 짜여 있는 정산 로직이라 그대로 두고, 그 외에 상담사 관리 · 면담일지 ·
  // QA · 홈 화면처럼 "이 사람이 어떤 업무를 하는지 보여주는 용도"로 쓰이는 곳에서는
  // 사용자가 새 구분을 자유롭게 추가할 수 있게 한다.
  const WORK_TYPES_BUILTIN = ["유선", "채팅"];
  const WORK_TYPES_KEY = acctKey("work-types:custom-list");
  const WORK_TYPES_MAX_CUSTOM = 12;
  const WORK_TYPES_MAX_LEN = 8;

  function loadCustomWorkTypes() {
    try {
      const raw = localStorage.getItem(WORK_TYPES_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter((t) => typeof t === "string" && t.trim()) : [];
    } catch (e) { return []; }
  }
  let customWorkTypes = loadCustomWorkTypes();
  function saveCustomWorkTypes() {
    try { localStorage.setItem(WORK_TYPES_KEY, JSON.stringify(customWorkTypes)); }
    catch (e) {}
  }
  // 업무 구분 전체(기본 + 사용자 추가) 목록. 순서는 항상 "유선/채팅"이 먼저 오고,
  // 그 뒤에 추가한 순서대로 붙는다 — 배지 색상도 이 순서를 기준으로 고정된다.
  function getAllWorkTypes() { return WORK_TYPES_BUILTIN.concat(customWorkTypes); }
  function isBuiltinWorkType(t) { return WORK_TYPES_BUILTIN.indexOf(t) !== -1; }

  function addCustomWorkType(nameRaw) {
    const name = String(nameRaw || "").trim();
    if (!name) return { ok: false, reason: "이름을 입력해 주세요." };
    if (name.length > WORK_TYPES_MAX_LEN) return { ok: false, reason: `${WORK_TYPES_MAX_LEN}자 이내로 입력해 주세요.` };
    const dup = getAllWorkTypes().some((t) => t.toLowerCase() === name.toLowerCase());
    if (dup) return { ok: false, reason: "이미 있는 업무 구분이에요." };
    if (customWorkTypes.length >= WORK_TYPES_MAX_CUSTOM) return { ok: false, reason: `업무 구분은 최대 ${WORK_TYPES_MAX_CUSTOM}개까지 추가할 수 있어요.` };
    customWorkTypes.push(name);
    saveCustomWorkTypes();
    return { ok: true };
  }
  // 커스텀 업무 구분을 지우면서, 이미 그 구분이 붙어 있던 상담사들에게서도 함께 지운다
  // (상담사 기록에만 이름이 남아 배지가 "떠돌게" 되는 것을 막기 위해).
  function removeCustomWorkType(name) {
    if (isBuiltinWorkType(name)) return { ok: false, reason: "유선/채팅은 기본 항목이라 삭제할 수 없어요." };
    const idx = customWorkTypes.indexOf(name);
    if (idx === -1) return { ok: false, reason: "이미 삭제된 업무 구분이에요." };
    customWorkTypes.splice(idx, 1);
    saveCustomWorkTypes();
    if (typeof agentsData !== "undefined" && Array.isArray(agentsData)) {
      let touched = false;
      agentsData.forEach((a) => {
        if (a.workTypes && a.workTypes.indexOf(name) !== -1) {
          a.workTypes = a.workTypes.filter((t) => t !== name);
          touched = true;
        }
      });
      if (touched && typeof saveAgentsData === "function") saveAgentsData();
    }
    return { ok: true };
  }

  // 배지 색상 클래스. 유선/채팅은 기존 색을 그대로 쓰고, 추가한 항목들은 등록
  // 순서에 따라 teal → purple → pink 세 가지 색을 돌려가며 씀(css/06-agents.css 참고).
  const WORK_TYPE_CUSTOM_PALETTE = ["custom-1", "custom-2", "custom-3"];
  function workTypeBadgeClass(t) {
    if (t === "유선") return "voice";
    if (t === "채팅") return "chat";
    const idx = customWorkTypes.indexOf(t);
    if (idx === -1) return "custom-1"; // 삭제된 구분이 남아있던 옛 기록 등, 안전망
    return WORK_TYPE_CUSTOM_PALETTE[idx % WORK_TYPE_CUSTOM_PALETTE.length];
  }
  // 상담사 관리/QA/면담일지/홈에서 공통으로 쓰는 업무 구분 배지 렌더러.
  // sizeClass에 "sm"을 넣으면 작은 배지(.badge.sm)로 그려진다.
  function renderWorkTypeBadges(types, sizeClass) {
    return (types || [])
      .map((t) => `<span class="badge ${sizeClass ? "sm" : ""} ${workTypeBadgeClass(t)}">${esc(t)}</span>`)
      .join(" ");
  }

  /* ===================== 업무 구분 관리 모달 ===================== */
  // (다른 모달들과 같은 manual-modal-overlay/box 뼈대를 그대로 사용)
  function closeWorkTypesModal() {
    const el = document.getElementById("work-types-modal-overlay");
    if (el) el.remove();
  }
  // onChange: 추가/삭제가 실제로 일어났을 때 호출되는 콜백(각 화면에서 다시 그리는 용도).
  function openWorkTypesModal(onChange) {
    closeWorkTypesModal();
    const overlay = document.createElement("div");
    overlay.id = "work-types-modal-overlay";
    overlay.className = "manual-modal-overlay";
    function renderList() {
      return customWorkTypes.length
        ? customWorkTypes.map((t) => `
            <div class="work-type-row">
              <span class="badge ${workTypeBadgeClass(t)}">${esc(t)}</span>
              <button type="button" class="ghost-btn danger" data-remove-type="${esc(t)}" title="삭제">삭제</button>
            </div>
          `).join("")
        : `<div class="work-type-empty">아직 추가한 업무 구분이 없어요.</div>`;
    }
    overlay.innerHTML = `
      <div class="manual-modal-box work-types-modal-box" role="dialog" aria-modal="true" aria-label="업무 구분 관리">
        <div class="manual-modal-head">
          <span>업무 구분 관리</span>
          <button type="button" class="manual-modal-close" id="work-types-modal-close" aria-label="닫기">✕</button>
        </div>
        <div class="manual-modal-body">
          <div class="work-type-builtin-note">
            <span class="badge voice">유선</span><span class="badge chat">채팅</span>
            <span class="work-type-builtin-label">은 기본 항목이라 삭제할 수 없어요.</span>
          </div>
          <div id="work-types-list">${renderList()}</div>
          <div class="work-type-add-row">
            <input type="text" id="work-type-new-input" placeholder="예: 대면, 이메일" maxlength="${WORK_TYPES_MAX_LEN}">
            <button type="button" class="primary-btn" id="work-type-add-btn">추가</button>
          </div>
          <div class="work-type-add-error" id="work-type-add-error"></div>
          <p class="work-type-hint">여기서 추가한 업무 구분은 상담사 관리·면담일지·QA·홈 화면의 배지와 검색에 바로 반영돼요. (월별 스케줄의 필요인력 자동계산은 유선/채팅 기준을 그대로 사용해요.)</p>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    function refresh() {
      const list = document.getElementById("work-types-list");
      if (list) list.innerHTML = renderList();
      attachRemoveHandlers();
      if (typeof onChange === "function") onChange();
    }
    function attachRemoveHandlers() {
      overlay.querySelectorAll("[data-remove-type]").forEach((btn) => {
        btn.onclick = () => {
          const name = btn.getAttribute("data-remove-type");
          if (!confirm(`"${name}" 업무 구분을 삭제할까요? 이 구분이 붙어 있던 상담사에게서도 함께 지워져요.`)) return;
          removeCustomWorkType(name);
          refresh();
        };
      });
    }
    attachRemoveHandlers();
    overlay.querySelector("#work-types-modal-close").onclick = () => closeWorkTypesModal();
    overlay.onclick = (e) => { if (e.target === overlay) closeWorkTypesModal(); };
    const input = overlay.querySelector("#work-type-new-input");
    const errEl = overlay.querySelector("#work-type-add-error");
    function doAdd() {
      const res = addCustomWorkType(input.value);
      if (!res.ok) { errEl.textContent = res.reason; return; }
      errEl.textContent = "";
      input.value = "";
      refresh();
      input.focus();
    }
    overlay.querySelector("#work-type-add-btn").onclick = doAdd;
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); doAdd(); } });
    setTimeout(() => input.focus(), 0);
  }
