// tests/calendar-render.test.js
// 달력 화면을 그리는 데 쓰이는 부분들 테스트.
// 달력 격자(buildGrid)는 "이번 달 1일이 무슨 요일 칸에 놓이는가", "앞뒤 달 날짜가
// 이어지는가"를 매달 눈으로 확인해야 하는 대표적인 곳이라, 12개월 전체를 한 번에
// 검사한다. 인라인 수정 폼은 HTML 문자열을 만들어 돌려주는 함수라 문자열을 직접 본다.
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { createSandbox, loadIntoContext, toPlain, exposeBindings } = require("./helpers/load-source");
const { createFakeDocument, createMemoryLocalStorage, countMatches } = require("./helpers/fake-dom");

function loadCalendar() {
  const sandbox = createSandbox({
    today: new Date(2026, 8, 15), // 2026-09-15(화)로 "오늘" 고정
    KR_HOLIDAYS: {},
    acctKey: (k) => k,
    localStorage: createMemoryLocalStorage(),
    document: createFakeDocument(),
    setTimeout: () => 0,
    clearTimeout: () => {},
    ICON_NOTE: "<svg data-icon=\"note\"></svg>",
    recordUndo: () => {},
    renderApp: () => {},
  });
  loadIntoContext(sandbox, [
    "js/01f-settings-menu-utils.js",
    "js/01k-calendar-shared-data.js",
    "js/02-calendar.js",
  ]);
  exposeBindings(sandbox, ["cal"]);
  return sandbox;
}

test("buildGrid: 어느 달이든 6주(42칸)를 채우고, 이번 달 날짜 칸 수가 정확하다", () => {
  const m = loadCalendar();
  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    const cells = toPlain(m.buildGrid(2026, monthIndex));
    const daysInMonth = new Date(2026, monthIndex + 1, 0).getDate();
    const firstWeekday = new Date(2026, monthIndex, 1).getDay();
    assert.equal(cells.length, 42, `${monthIndex + 1}월 칸 수`);

    const currentCells = cells.filter((c) => c.current);
    assert.equal(currentCells.length, daysInMonth, `${monthIndex + 1}월 이번달 칸 수`);
    // 이번 달 칸은 1일부터 말일까지 빠짐없이 순서대로 들어있어야 한다.
    assert.deepEqual(
      currentCells.map((c) => c.day),
      Array.from({ length: daysInMonth }, (_, i) => i + 1),
      `${monthIndex + 1}월 날짜 순서`,
    );
    // 1일은 그 달 1일의 실제 요일 칸(일=0 ... 토=6)에 놓여야 한다.
    assert.equal(cells.findIndex((c) => c.current), firstWeekday, `${monthIndex + 1}월 1일 요일 위치`);
  }
});

test("buildGrid: 앞 달 날짜는 말일에서 거꾸로, 뒷 달 날짜는 1일부터 이어진다", () => {
  const m = loadCalendar();
  // 2026년 9월 1일은 화요일 → 앞에 8월 30(일)·31(월) 두 칸이 붙는다.
  const cells = toPlain(m.buildGrid(2026, 8));
  assert.deepEqual(cells.slice(0, 2), [{ day: 30, current: false }, { day: 31, current: false }]);
  // 9월은 30일까지 → 2 + 30 = 32칸을 쓰고, 나머지 10칸은 10월 1~10일.
  assert.deepEqual(cells.slice(32).map((c) => c.day), Array.from({ length: 10 }, (_, i) => i + 1));
  assert.equal(cells.slice(32).every((c) => c.current === false), true);
});

test("buildGrid: 1일이 일요일이면 앞 달 칸 없이 바로 1일부터 시작한다", () => {
  const m = loadCalendar();
  // 2026년 2월 1일은 일요일.
  const cells = toPlain(m.buildGrid(2026, 1));
  assert.deepEqual(cells[0], { day: 1, current: true });
});

test("isTodayCell: 보고 있는 달이 이번 달일 때만 오늘 칸을 표시한다", () => {
  const m = loadCalendar();
  m.cal.year = 2026;
  m.cal.monthIndex = 8;
  assert.equal(m.isTodayCell(15, true), true);
  assert.equal(m.isTodayCell(14, true), false);
  assert.equal(m.isTodayCell(15, false), false); // 앞뒤 달에서 넘어온 15일 칸은 제외
  m.cal.monthIndex = 9; // 10월을 보고 있으면 15일이어도 오늘이 아님
  assert.equal(m.isTodayCell(15, true), false);
});

test("entryEditFormHtml: 기간 일정은 날짜 입력칸 2개를 쓰고 시간 입력칸은 빼고 그린다", () => {
  const m = loadCalendar();
  const html = m.entryEditFormHtml({
    id: "e1", text: "워크숍", rangeStart: "2026-09-16", rangeEnd: "2026-09-18",
  });
  assert.equal(html.includes(`id="edit-input-start"`), true);
  assert.equal(html.includes(`value="2026-09-16"`), true);
  assert.equal(html.includes(`value="2026-09-18"`), true);
  assert.equal(html.includes(`id="edit-input-time"`), false); // 기간 일정엔 시간칸 없음
  assert.equal(html.includes(`data-action="save-edit"`), true);
});

test("entryEditFormHtml: 하루짜리 일정은 시간 입력칸을 쓰고 기간 입력칸은 빼고 그린다", () => {
  const m = loadCalendar();
  const html = m.entryEditFormHtml({ id: "e2", text: "회의", time: "14:30" });
  assert.equal(html.includes(`id="edit-input-time"`), true);
  assert.equal(html.includes(`value="14:30"`), true);
  assert.equal(html.includes(`id="edit-input-start"`), false);
  // 시작=끝인 "기간"도 하루짜리로 취급한다.
  const sameDay = m.entryEditFormHtml({ id: "e3", text: "x", rangeStart: "2026-09-16", rangeEnd: "2026-09-16" });
  assert.equal(sameDay.includes(`id="edit-input-start"`), false);
});

test("entryEditFormHtml: 제목에 들어간 HTML 특수문자는 이스케이프해서 넣는다", () => {
  const m = loadCalendar();
  const html = m.entryEditFormHtml({ id: "e4", text: "<script>alert(1)</script>" });
  assert.equal(html.includes("<script>"), false);
  assert.equal(html.includes("&lt;script&gt;"), true);
});

test("entryEditFormHtml: 상세 내용은 펼쳐져 있을 때만 textarea로 그린다", () => {
  const m = loadCalendar();
  const entry = { id: "e5", text: "보고서", detail: "초안 작성" };

  m.cal.editDetailMode = false;
  const collapsed = m.entryEditFormHtml(entry);
  assert.equal(collapsed.includes(`id="edit-input-detail"`), false);
  assert.equal(collapsed.includes("상세 내용 추가"), true);

  m.cal.editDetailMode = true;
  const expanded = m.entryEditFormHtml(entry);
  assert.equal(expanded.includes(`id="edit-input-detail"`), true);
  assert.equal(expanded.includes("초안 작성"), true);
  assert.equal(expanded.includes("상세 내용 접기"), true);
});

test("entryEditFormHtml: 중요 표시 상태가 버튼의 active 클래스로 반영된다", () => {
  const m = loadCalendar();
  m.cal.editPriority = false;
  assert.equal(countMatches(m.entryEditFormHtml({ id: "e6", text: "a" }), `class="type-btn priority active"`), 0);
  m.cal.editPriority = true;
  assert.equal(countMatches(m.entryEditFormHtml({ id: "e6", text: "a" }), `class="type-btn priority active"`), 1);
});
