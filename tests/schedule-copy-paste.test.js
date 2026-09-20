// tests/schedule-copy-paste.test.js
// js/07a9-schedule-copy-paste.js — 월별 스케줄 셀 복사(Ctrl+C)/붙여넣기(Ctrl+V) 테스트.
//
// 두 층으로 나눠서 확인한다.
//  1) 순수 로직: 클립보드 텍스트 변환/해석, 붙여넣기 위치 계산, 데이터 반영(메모 포함·잠금·되돌리기).
//  2) 화면 접착 코드(scheduleCopySelection / scheduleHandlePaste): 진짜 DOM은 없으므로 이 파일 안에서
//     "칸 요소"만 흉내 낸 최소한의 가짜 표를 만들어서, 선택 범위 → 복사 버퍼 → 붙여넣기 → 저장까지
//     한 바퀴 도는지 확인한다. (브라우저의 실제 Ctrl+C/V 키 이벤트 자체는 여기서 검증할 수 없다.)
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const { createSandbox, loadIntoContext, toPlain, exposeBindings } = require("./helpers/load-source");
const { createFakeDocument, createMemoryLocalStorage } = require("./helpers/fake-dom");

function buildFixture(extra) {
  return Object.assign({
    staff: [
      { id: "s1", name: "김주간", nickname: "주간이", empNo: "1001", hireDate: "2024-01-02", workHours: "09:00-18:00", types: ["유선"], group: "day" },
      { id: "s2", name: "이채팅", nickname: "채팅이", empNo: "1002", hireDate: "2024-03-02", workHours: "10:00-19:00", types: ["채팅"], group: "day" },
      { id: "s3", name: "박야간", nickname: "야간이", empNo: "1003", hireDate: "2023-05-02", workHours: "22:00-07:00", types: ["유선"], group: "night" },
    ],
    records: {
      "s1|2026-09-01": { status: "OFF", attendance: null },
      "s1|2026-09-02": { status: "ANNUAL", attendance: null },
      "s1|2026-09-03": { status: "WORK", attendance: "LATE" },
      "s2|2026-09-01": { status: "DAEHYU", attendance: null },
    },
    memos: {
      "s1|2026-09-01": "선투입 후 연장근무",
      "s1|2026-09-03": "30분 지각",
      "s3|2026-09-01": "기존 메모(덮어써질 것)",
    },
    staffHistory: {}, lastSyncMonthKey: null, requiredHeadcount: {}, monthLocks: {}, collapseByMonth: {},
  }, extra || {});
}

// ---- 아주 작은 가짜 칸/표 ----
function makeCell(doc, staffId, day, rowIdx) {
  const classes = new Set(["sch-cell"]); // 실제 표의 칸(td)은 항상 sch-cell 클래스를 갖는다
  const attrs = {
    "data-staff-id": staffId,
    "data-date": `2026-09-${String(day).padStart(2, "0")}`,
    "data-row-idx": String(rowIdx),
    "data-day": String(day),
  };
  const cell = {
    getAttribute: (k) => (k in attrs ? attrs[k] : null),
    classList: {
      add: (c) => classes.add(c),
      remove: (c) => classes.delete(c),
      toggle: (c, on) => { if (on === undefined ? !classes.has(c) : on) classes.add(c); else classes.delete(c); },
      contains: (c) => classes.has(c),
    },
    closest: () => null, // 접힌 행(tr.sch-row-hidden)은 이 테스트에서 쓰지 않는다
    focus() { doc.activeElement = cell; },
    _classes: classes,
  };
  return cell;
}

// staffIds 순서대로 행(rowIdx 0,1,2…), days 열로 이루어진 표를 만든다.
function loadWithTable(fixture, staffIds, days) {
  const doc = createFakeDocument();
  const cells = [];
  staffIds.forEach((sid, r) => days.forEach((d) => cells.push(makeCell(doc, sid, d, r))));
  const statusEl = { textContent: "" };
  const root = {
    querySelectorAll: (sel) => (sel === ".sch-cell" ? cells : sel === ".sch-cell--selected" ? cells.filter((c) => c._classes.has("sch-cell--selected")) : []),
    contains: (el) => cells.indexOf(el) !== -1,
  };
  doc.getElementById = (id) => (id === "schedule-table-area" ? root : id === "schedule-status" ? statusEl : null);
  doc.contains = () => true;
  doc.activeElement = null;

  const store = createMemoryLocalStorage({ sched: JSON.stringify(fixture || buildFixture()) });
  const undoLabels = [];
  let clipboardText = null;
  let tableRedraws = 0;
  const sandbox = createSandbox({
    today: new Date(2026, 8, 15),
    SCHEDULE_KEY: "sched",
    acctKey: (k) => k,
    getHoliday: () => null,
    localStorage: store,
    document: doc,
    setTimeout: () => 0,
    clearTimeout: () => {},
    recordUndo: (label) => { undoLabels.push(label); },
    renderApp: () => {},
    agentsData: [],
    navigator: { clipboard: { writeText: (t) => { clipboardText = t; return Promise.resolve(); } } },
  });
  loadIntoContext(sandbox, [
    "js/01a-icons.js",
    "js/01f-settings-menu-utils.js",
    "js/01k-calendar-shared-data.js",
    "js/07a1-schedule-data.js",
    "js/07a2-schedule-ui-state.js",
    "js/07a3-schedule-records.js",
    "js/07a4-schedule-table-render.js",
    "js/07a5-schedule-log-capture.js",
    "js/07a6-schedule-cell-edit.js",
    "js/07a9-schedule-copy-paste.js",
  ]);
  // 표 전체를 다시 그리는 함수는 가짜 DOM에선 의미가 없으니 횟수만 센다.
  sandbox.updateScheduleTableArea = () => { tableRedraws += 1; };
  exposeBindings(sandbox, ["scheduleData", "scheduleUi"]);
  sandbox.scheduleUi.year = 2026;
  sandbox.scheduleUi.monthIndex = 8;

  const at = (sid, day) => cells.find((c) => c.getAttribute("data-staff-id") === sid && c.getAttribute("data-day") === String(day));
  const saved = () => JSON.parse(store.getItem("sched"));
  const buffer = () => vm.runInContext("scheduleCopyBuffer", sandbox);
  const select = (list) => list.forEach((c) => c.classList.add("sch-cell--selected"));
  return {
    m: sandbox, cells, at, saved, buffer, select, statusEl, undoLabels,
    clip: () => clipboardText, redraws: () => tableRedraws, doc,
  };
}
const flush = () => new Promise((r) => setImmediate(r));
const pasteEvent = (text) => ({ clipboardData: { getData: () => text }, preventDefault() { this.prevented = true; }, prevented: false });

/* ===================== 순수 로직 ===================== */

test("scheduleKeyIsLetter: 한글 입력 상태(ㅊ/Process)에서도 물리 키(KeyC)로 Ctrl+C를 알아본다", () => {
  const { m } = loadWithTable(null, ["s1"], [1]);
  assert.equal(m.scheduleKeyIsLetter({ key: "c", code: "KeyC" }, "c"), true);
  assert.equal(m.scheduleKeyIsLetter({ key: "C", code: "KeyC" }, "c"), true); // CapsLock
  assert.equal(m.scheduleKeyIsLetter({ key: "ㅊ", code: "KeyC" }, "c"), true); // 한글 자판
  assert.equal(m.scheduleKeyIsLetter({ key: "Process", code: "KeyC" }, "c"), true); // IME 조합 중
  assert.equal(m.scheduleKeyIsLetter({ key: "v", code: "KeyV" }, "c"), false);
  assert.equal(m.scheduleKeyIsLetter({ key: "ㅍ", code: "KeyV" }, "c"), false);
  // Dvorak처럼 알파벳이 오면 e.key를 존중한다: 물리 KeyC 자리에 j가 찍히는 배열에서 Ctrl+J를 복사로 오인하지 않는다.
  assert.equal(m.scheduleKeyIsLetter({ key: "j", code: "KeyC" }, "c"), false);
  assert.equal(m.scheduleKeyIsLetter({ key: "c", code: "KeyJ" }, "c"), true);
});

test("클립보드 텍스트: 칸 글자 ↔ 탭/줄바꿈 표가 왕복되고, CRLF·끝 줄바꿈·빈 칸·모르는 값을 처리한다", () => {
  const { m } = loadWithTable(null, ["s1"], [1]);
  const rows = [
    [{ status: "WORK", attendance: null }, { status: "OFF", attendance: null }],
    [{ status: "WORK", attendance: "LATE" }, { status: "RESIGNED", attendance: null }],
  ];
  const text = m.scheduleClipboardTextFromRows(rows);
  assert.equal(text, "1\t오프\n지각\t퇴사");
  // 엑셀은 \r\n과 끝 줄바꿈을 붙여 주기도 한다.
  const parsed = toPlain(m.scheduleParseClipText("1\t오프\r\n지각\t퇴사\r\n"));
  assert.deepEqual(parsed.unknown, []);
  assert.deepEqual(parsed.rows, [
    [{ status: "WORK", attendance: null, memo: null }, { status: "OFF", attendance: null, memo: null }],
    [{ status: "WORK", attendance: "LATE", memo: null }, { status: "RESIGNED", attendance: null, memo: null }],
  ]);
  // 빈 칸은 null(건드리지 않음), 모르는 값은 null + unknown에 기록.
  const messy = toPlain(m.scheduleParseClipText("연차\t\t뭐지"));
  assert.deepEqual(messy.rows, [[{ status: "ANNUAL", attendance: null, memo: null }, null, null]]);
  assert.deepEqual(messy.unknown, ["뭐지"]);
  // 13가지 표시 글자가 전부 되돌아온다(복사한 글자를 못 알아보는 값이 없어야 함).
  const allStatuses = ["WORK", "OFF", "ANNUAL", "DAEHYU", "HALF", "GONGHYU", "GONGGA", "MATERNITY", "SPECIAL", "EDUCATION", "RESIGNED"]
    .map((s) => ({ status: s, attendance: null })).concat([{ status: "WORK", attendance: "LATE" }, { status: "WORK", attendance: "ABSENT" }]);
  const back = toPlain(m.scheduleParseClipText(m.scheduleClipboardTextFromRows([allStatuses])));
  assert.deepEqual(back.unknown, []);
  assert.deepEqual(back.rows[0].map((x) => [x.status, x.attendance]), allStatuses.map((x) => [x.status, x.attendance]));
});

test("schedulePlanPaste: 시작 칸부터 깔고, 접힌 열은 건너뛰며, 표 밖은 잘라낸다", () => {
  const { m } = loadWithTable(null, ["s1"], [1]);
  const it = (s) => ({ status: s, attendance: null, memo: "" });
  const rows = [[it("OFF"), it("ANNUAL"), it("HALF")], [it("EDUCATION"), null, it("SPECIAL")]];
  // 보이는 행 0,1,2 / 보이는 날짜 1,2,4,5 (3일은 접혀 있음). 2일에서 시작.
  let plan = toPlain(m.schedulePlanPaste(rows, [0, 1, 2], [1, 2, 4, 5], 0, 2));
  assert.deepEqual(plan.targets.map((t) => [t.rowIdx, t.day, t.item.status]), [
    [0, 2, "OFF"], [0, 4, "ANNUAL"], [0, 5, "HALF"], [1, 2, "EDUCATION"], [1, 5, "SPECIAL"], // null 칸은 건너뜀
  ]);
  assert.equal(plan.clipped, false);
  // 마지막 행에서 시작하면 아래쪽 행이 표 밖 → 잘림.
  plan = toPlain(m.schedulePlanPaste(rows, [0, 1, 2], [1, 2, 4, 5], 2, 4));
  assert.deepEqual(plan.targets.map((t) => [t.rowIdx, t.day]), [[2, 4], [2, 5]]);
  assert.equal(plan.clipped, true);
  // 시작 칸이 보이는 칸이 아니면 아무것도 하지 않는다.
  assert.deepEqual(toPlain(m.schedulePlanPaste(rows, [0, 1, 2], [1, 2, 4, 5], 0, 3)), { targets: [], clipped: false });
});

test("scheduleApplyPasteEntries: 상태+메모를 덮어쓰고 한 번만 저장·되돌리기 기록", () => {
  const t = loadWithTable(null, ["s1", "s2", "s3"], [1, 2, 3]);
  const res = t.m.scheduleApplyPasteEntries([
    { staffId: "s2", dateKey: "2026-09-02", item: { status: "OFF", attendance: null, memo: "  새 메모  " } }, // 앞뒤 공백 정리
    { staffId: "s1", dateKey: "2026-09-01", item: { status: "WORK", attendance: null, memo: "" } }, // 근무 기본값 + 메모 삭제
    { staffId: "s3", dateKey: "2026-09-01", item: { status: "ANNUAL", attendance: null, memo: null } }, // 메모 정보 없음 → 유지
  ]);
  assert.deepEqual(toPlain(res), { applied: 3, memoSet: 1, memoCleared: 1, locked: false });
  const d = t.saved();
  assert.deepEqual(d.records["s2|2026-09-02"], { status: "OFF", attendance: null });
  assert.equal(d.memos["s2|2026-09-02"], "새 메모");
  assert.equal("s1|2026-09-01" in d.records, false); // 기본값(근무)이면 기록 자체를 지운다
  assert.equal("s1|2026-09-01" in d.memos, false);
  assert.equal(d.records["s3|2026-09-01"].status, "ANNUAL");
  assert.equal(d.memos["s3|2026-09-01"], "기존 메모(덮어써질 것)"); // memo:null이면 그대로
  assert.deepEqual(t.undoLabels, ["셀 3개 붙여넣기"]);
});

test("scheduleApplyPasteEntries: 잠긴 달이 하나라도 포함되면 아무것도 바꾸지 않는다", () => {
  const t = loadWithTable(buildFixture({ monthLocks: { "2026-09": true } }), ["s1"], [1]);
  const before = JSON.stringify(t.saved());
  const res = t.m.scheduleApplyPasteEntries([{ staffId: "s1", dateKey: "2026-09-05", item: { status: "OFF", attendance: null, memo: "x" } }]);
  assert.equal(res.locked, true);
  assert.equal(res.applied, 0);
  assert.equal(JSON.stringify(t.saved()), before);
  assert.deepEqual(t.undoLabels, []);
});

/* ===================== 복사 → 붙여넣기 (가짜 표) ===================== */

test("Ctrl+C: 포커스된 칸 하나를 상태와 메모까지 버퍼에 담고, 텍스트는 시스템 클립보드로 보낸다", async () => {
  const t = loadWithTable(null, ["s1", "s2", "s3"], [1, 2, 3, 4]);
  const cell = t.at("s1", 1);
  cell.focus();
  t.m.scheduleCopySelection(cell);
  await flush();
  const buf = t.buffer();
  assert.deepEqual(toPlain(buf.rows), [[{ status: "OFF", attendance: null, memo: "선투입 후 연장근무" }]]);
  assert.equal(t.clip(), "오프");
  assert.equal(cell._classes.has("sch-cell--copied"), true); // 점선 표시
  assert.match(t.statusEl.textContent, /1칸 복사됨 \(메모 1개 포함\)/);
});

test("Ctrl+C: 드래그로 고른 범위는 행×열 그대로 복사하고, 접힌 열은 빼고 복사한다", async () => {
  const t = loadWithTable(null, ["s1", "s2"], [1, 2, 3]);
  // 2일 열이 접혀 있다고 가정 (실제로는 열을 접으면 그 날짜의 모든 행 칸에 클래스가 붙는다)
  t.at("s1", 2)._classes.add("sch-col-hidden");
  t.at("s2", 2)._classes.add("sch-col-hidden");
  t.select(t.cells.filter((c) => ["s1", "s2"].includes(c.getAttribute("data-staff-id")))); // 2행×3열 전부 선택
  t.at("s1", 1).focus();
  t.m.scheduleCopySelection(t.at("s1", 1));
  await flush();
  // 2일 열이 빠진 2행×2열: s1(1일=오프, 3일=지각), s2(1일=대휴, 3일=근무)
  assert.equal(t.clip(), "오프\t지각\n대휴\t1");
  assert.deepEqual(toPlain(t.buffer().rows.map((r) => r.map((x) => x.memo))), [["선투입 후 연장근무", "30분 지각"], ["", ""]]);
  assert.equal(t.statusEl.textContent, "4칸 복사됨 (메모 2개 포함)");
});

test("Ctrl+V: 이 앱에서 복사한 내용은 다른 칸으로 메모까지 붙여넣고, 복사한 칸에 메모가 없으면 대상 메모를 지운다", async () => {
  const t = loadWithTable(null, ["s1", "s2", "s3"], [1, 2, 3, 4]);
  // s1의 1~3일(오프/연차/지각, 메모는 1일·3일에만 있음)을 복사
  t.select([t.at("s1", 1), t.at("s1", 2), t.at("s1", 3)]);
  t.at("s1", 1).focus();
  t.m.scheduleCopySelection(t.at("s1", 1));
  await flush();
  const copiedText = t.clip();
  assert.equal(copiedText, "오프\t연차\t지각");

  // s3의 1일 칸을 클릭(포커스만)한 상태에서 붙여넣기 → s3의 1~3일이 채워진다.
  t.at("s3", 1).focus();
  const ev = pasteEvent(copiedText);
  t.m.scheduleHandlePaste(ev);
  assert.equal(ev.prevented, true);

  const d = t.saved();
  assert.deepEqual(d.records["s3|2026-09-01"], { status: "OFF", attendance: null });
  assert.deepEqual(d.records["s3|2026-09-02"], { status: "ANNUAL", attendance: null });
  assert.deepEqual(d.records["s3|2026-09-03"], { status: "WORK", attendance: "LATE" });
  assert.equal(d.memos["s3|2026-09-01"], "선투입 후 연장근무"); // 메모 복사됨(기존 "기존 메모"를 덮어씀)
  assert.equal("s3|2026-09-02" in d.memos, false); // 복사한 칸(2일)엔 메모가 없었음
  assert.equal(d.memos["s3|2026-09-03"], "30분 지각");
  // 원본은 그대로
  assert.equal(d.records["s1|2026-09-01"].status, "OFF");
  assert.equal(d.memos["s1|2026-09-01"], "선투입 후 연장근무");
  assert.equal(t.redraws(), 1);
  assert.equal(t.undoLabels.length, 1);
  assert.equal(t.doc.activeElement, t.at("s3", 1)); // 붙여넣은 뒤에도 원래 칸에 포커스
  assert.equal(t.statusEl.textContent, "3칸 붙여넣음 (메모 2개 포함)");
});

test("Ctrl+V: 붙여넣기 도중 기존 메모가 지워지면 그 사실을 알려준다", async () => {
  const t = loadWithTable(null, ["s1", "s3"], [1, 2]);
  t.at("s1", 2).focus(); // s1 2일: 연차, 메모 없음
  t.m.scheduleCopySelection(t.at("s1", 2));
  await flush();
  t.at("s3", 1).focus(); // s3 1일에는 기존 메모가 있다
  t.m.scheduleHandlePaste(pasteEvent(t.clip()));
  const d = t.saved();
  assert.equal(d.records["s3|2026-09-01"].status, "ANNUAL");
  assert.equal("s3|2026-09-01" in d.memos, false);
  assert.match(t.statusEl.textContent, /기존 메모 1개 삭제됨/);
});

test("Ctrl+V: 1칸을 복사해 두고 여러 칸을 선택해 붙여넣으면 선택 범위 전체를 채운다", async () => {
  const t = loadWithTable(null, ["s1", "s2", "s3"], [1, 2, 3]);
  t.at("s1", 1).focus();
  t.m.scheduleCopySelection(t.at("s1", 1)); // 오프 + 메모
  await flush();
  const text = t.clip();
  const target = [t.at("s2", 2), t.at("s2", 3), t.at("s3", 2), t.at("s3", 3)];
  t.select(target);
  t.at("s2", 2).focus();
  t.m.scheduleHandlePaste(pasteEvent(text));
  const d = t.saved();
  target.forEach((c) => {
    const key = `${c.getAttribute("data-staff-id")}|${c.getAttribute("data-date")}`;
    assert.equal(d.records[key].status, "OFF", key);
    assert.equal(d.memos[key], "선투입 후 연장근무", key);
  });
  assert.equal(t.statusEl.textContent, "4칸 붙여넣음 (메모 4개 포함)");
});

test("Ctrl+V: 다른 곳(엑셀 등)에서 복사한 텍스트는 상태만 반영하고 기존 메모는 건드리지 않는다", async () => {
  const t = loadWithTable(null, ["s1", "s2", "s3"], [1, 2, 3]);
  // 먼저 앱 안에서 뭔가 복사해 둔 상태(오래된 버퍼)
  t.at("s1", 3).focus();
  t.m.scheduleCopySelection(t.at("s1", 3));
  await flush();
  // 그 뒤 엑셀에서 다른 내용을 복사했다고 가정 → 클립보드 텍스트가 버퍼와 다르다.
  t.at("s3", 1).focus(); // s3 1일에 기존 메모가 있다
  t.m.scheduleHandlePaste(pasteEvent("연차\t반차\r\n교육\t오프\r\n"));
  const d = t.saved();
  assert.equal(d.records["s3|2026-09-01"].status, "ANNUAL");
  assert.equal(d.records["s3|2026-09-02"].status, "HALF");
  assert.equal(d.memos["s3|2026-09-01"], "기존 메모(덮어써질 것)"); // 메모 그대로
  assert.equal("s3|2026-09-03" in d.records, false); // 표 밖(3행)으로 나가는 부분은 없음. s3는 마지막 행이라 2행째는 잘림
  assert.match(t.statusEl.textContent, /2칸 붙여넣음/);
  assert.match(t.statusEl.textContent, /표 밖으로 넘치는 칸 제외/);
  // 옛 버퍼(지각)가 엉뚱하게 붙지 않았다.
  assert.notEqual(d.records["s3|2026-09-01"].attendance, "LATE");
});

test("Ctrl+V: 인식할 수 없는 텍스트나 빈 클립보드는 아무것도 바꾸지 않고 안내만 한다", () => {
  const t = loadWithTable(null, ["s1"], [1, 2]);
  const before = JSON.stringify(t.saved());
  t.at("s1", 1).focus();
  t.m.scheduleHandlePaste(pasteEvent("안녕하세요 그냥 문장"));
  assert.equal(JSON.stringify(t.saved()), before);
  assert.match(t.statusEl.textContent, /인식할 수 없는 값이라 붙여넣지 못했어요/);
  t.m.scheduleHandlePaste(pasteEvent(""));
  assert.equal(JSON.stringify(t.saved()), before);
  assert.equal(t.statusEl.textContent, "붙여넣을 내용이 없어요.");
  assert.deepEqual(t.undoLabels, []);
});

test("Ctrl+V: 잠긴 달이면 막고, 칸에 포커스가 없거나 팝업이 떠 있으면 아예 손대지 않는다", async () => {
  // 잠긴 달
  const locked = loadWithTable(buildFixture({ monthLocks: { "2026-09": true } }), ["s1"], [1, 2]);
  const before = JSON.stringify(locked.saved());
  locked.at("s1", 1).focus();
  const ev = pasteEvent("연차");
  locked.m.scheduleHandlePaste(ev);
  assert.equal(JSON.stringify(locked.saved()), before);
  assert.match(locked.statusEl.textContent, /잠긴 달/);

  // 칸이 아닌 곳(예: 입력창)에 포커스가 있으면 기본 붙여넣기 동작을 그대로 둔다.
  const t = loadWithTable(null, ["s1"], [1, 2]);
  t.doc.activeElement = { classList: { contains: () => false }, tagName: "TEXTAREA" };
  const ev2 = pasteEvent("연차");
  t.m.scheduleHandlePaste(ev2);
  assert.equal(ev2.prevented, false);
  assert.deepEqual(t.undoLabels, []);

  // 메모/이력 같은 팝업이 떠 있으면 뒤쪽 표에 붙여넣지 않는다.
  t.at("s1", 1).focus();
  t.doc.querySelector = (sel) => (sel === ".sch-preview-overlay" ? {} : null);
  const ev3 = pasteEvent("연차");
  t.m.scheduleHandlePaste(ev3);
  assert.equal(ev3.prevented, false);
  assert.deepEqual(t.undoLabels, []);
});

test("Esc: 점선 표시만 끄고 복사한 내용은 남아 있다 / 표를 다시 그려도 점선이 유지된다", async () => {
  const t = loadWithTable(null, ["s1"], [1, 2]);
  const c = t.at("s1", 1);
  c.focus();
  t.m.scheduleCopySelection(c);
  await flush();
  assert.equal(c._classes.has("sch-cell--copied"), true);
  // 표를 다시 그리면 클래스가 사라지는데(새 요소), attach 단계에서 다시 켜준다 → 여기선 클래스를 직접 지워 흉내.
  c._classes.delete("sch-cell--copied");
  t.m.scheduleApplyCopiedOutline();
  assert.equal(c._classes.has("sch-cell--copied"), true);
  t.m.scheduleClearCopiedOutline();
  assert.equal(c._classes.has("sch-cell--copied"), false);
  assert.equal(t.buffer().text, "오프"); // 내용은 유지
});

test("키 입력: Ctrl+C(한글 ㅊ 포함)와 Cmd+C는 복사, Shift/Alt가 섞이면 무시, Ctrl+V는 가로채지 않는다", async () => {
  const t = loadWithTable(null, ["s1"], [1]);
  const cell = t.at("s1", 1);
  cell.focus();
  const key = (o) => Object.assign({ preventDefault() { this.prevented = true; }, prevented: false, shiftKey: false, altKey: false, ctrlKey: false, metaKey: false }, o);

  const kr = key({ ctrlKey: true, key: "ㅊ", code: "KeyC" });
  t.m.scheduleCellKeydown(kr, cell);
  assert.equal(kr.prevented, true);
  assert.equal(t.buffer().text, "오프");

  // 버퍼를 비우고 Cmd+C(Mac)를 다시 검증
  vm.runInContext("scheduleCopyBuffer = null", t.m);
  const mac = key({ metaKey: true, key: "c", code: "KeyC" });
  t.m.scheduleCellKeydown(mac, cell);
  assert.equal(mac.prevented, true);
  assert.equal(t.buffer().text, "오프");

  vm.runInContext("scheduleCopyBuffer = null", t.m);
  const shifted = key({ ctrlKey: true, shiftKey: true, key: "C", code: "KeyC" });
  t.m.scheduleCellKeydown(shifted, cell);
  assert.equal(t.buffer(), null);

  const paste = key({ ctrlKey: true, key: "v", code: "KeyV" });
  t.m.scheduleCellKeydown(paste, cell);
  assert.equal(paste.prevented, false); // paste 이벤트가 발생하도록 그대로 통과
  await flush();
});
