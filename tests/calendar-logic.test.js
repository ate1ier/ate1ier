// tests/calendar-logic.test.js
// js/02-calendar.js의 날짜 계산 로직 테스트.
// 날짜 계산(월 넘김·윤년·말일 보정)과 반복 일정 생성은 눈으로 확인하기 가장
// 번거로운데(달을 일일이 넘겨봐야 함) 실수는 가장 쉬운 곳이라 우선 덮었다.
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { createSandbox, loadIntoContext, toPlain, exposeBindings } = require("./helpers/load-source");
const { createFakeDocument, createMemoryLocalStorage } = require("./helpers/fake-dom");

// 02-calendar.js는 최상위에서 today/acctKey/localStorage를 참조하지만 DOM은
// 함수 안에서만 건드리므로, 아래 스텁만 있으면 통째로 읽어 들일 수 있다.
// "오늘"은 2026-09-15(화)로 고정한다.
function loadCalendar(extra) {
  const sandbox = createSandbox(Object.assign({
    today: new Date(2026, 8, 15),
    KR_HOLIDAYS: { "2026-09-16": "가짜 공휴일" },
    acctKey: (k) => k,
    localStorage: createMemoryLocalStorage(),
    document: createFakeDocument(),
    setTimeout: () => 0,
    clearTimeout: () => {},
    ICON_NOTE: "<svg data-icon=\"note\"></svg>",
    recordUndo: () => {},
    renderApp: () => {},
  }, extra || {}));
  loadIntoContext(sandbox, [
    "js/01f-settings-menu-utils.js", // pad2, esc
    "js/01k-calendar-shared-data.js", // WEEKDAYS
    "js/02-calendar.js",
  ]);
  // cal/todos는 최상위 const·let이라 기본적으로 sandbox에 노출되지 않는다.
  exposeBindings(sandbox, ["cal"]);
  return sandbox;
}

test("toISODate/parseISODate/addDaysISO: 월·연 경계를 넘어가도 날짜가 맞는다", () => {
  const m = loadCalendar();
  assert.equal(m.toISODate(2026, 0, 5), "2026-01-05"); // monthIndex는 0부터
  assert.equal(m.addDaysISO("2026-02-28", 1), "2026-03-01"); // 2026년은 윤년이 아님
  assert.equal(m.addDaysISO("2024-02-28", 1), "2024-02-29"); // 2024년은 윤년
  assert.equal(m.addDaysISO("2026-01-01", -1), "2025-12-31"); // 연도를 거꾸로 넘어감
  const d = m.parseISODate("2026-09-15");
  assert.equal(d.getFullYear(), 2026);
  assert.equal(d.getMonth(), 8);
  assert.equal(d.getDate(), 15);
});

test("dateRangeDays: 시작·끝 날짜를 거꾸로 넣어도 순서를 바로잡아 하루씩 채운다", () => {
  const m = loadCalendar();
  const days = m.dateRangeDays("2026-03-03", "2026-03-01");
  assert.deepEqual(toPlain(days.map((d) => d.iso)), ["2026-03-01", "2026-03-02", "2026-03-03"]);
  const oneDay = m.dateRangeDays("2026-03-01", "2026-03-01");
  assert.equal(oneDay.length, 1);
});

test("dateRangeDays: 아주 긴 기간을 넣어도 366일에서 끊어 무한 루프에 빠지지 않는다", () => {
  const m = loadCalendar();
  const days = m.dateRangeDays("2020-01-01", "2030-01-01");
  assert.equal(days.length, 366); // 안전장치(guard)가 동작
});

test("clampedMonthDate/addMonthsClamped: 그 달에 없는 날짜는 말일로 맞춘다", () => {
  const m = loadCalendar();
  const feb = m.clampedMonthDate(2026, 1, 31); // 2026년 2월 31일 → 2월 28일
  assert.equal(m.toISODate(feb.getFullYear(), feb.getMonth(), feb.getDate()), "2026-02-28");
  const next = m.addMonthsClamped(new Date(2026, 0, 31), 1); // 1/31 + 1개월
  assert.equal(m.toISODate(next.getFullYear(), next.getMonth(), next.getDate()), "2026-02-28");
});

test("computeRepeatDates(매월): 2월에 말일로 밀려도 다음 달엔 원래 날짜(31일)로 돌아온다", () => {
  const m = loadCalendar();
  // 28일로 한 번 밀린 뒤 계속 28일에 머무르는 버그가 나기 쉬운 지점.
  assert.deepEqual(
    toPlain(m.computeRepeatDates("2026-01-31", "monthly", "2026-04-30", 31)),
    ["2026-01-31", "2026-02-28", "2026-03-31", "2026-04-30"],
  );
});

test("computeRepeatDates(매주): 시작일부터 7일 간격으로 종료일까지만 만든다", () => {
  const m = loadCalendar();
  assert.deepEqual(
    toPlain(m.computeRepeatDates("2026-09-15", "weekly", "2026-10-06")),
    ["2026-09-15", "2026-09-22", "2026-09-29", "2026-10-06"],
  );
  // 종료일이 시작일보다 앞이면 하나도 만들지 않는다.
  assert.deepEqual(toPlain(m.computeRepeatDates("2026-09-15", "weekly", "2026-09-01")), []);
});

test("computeRepeatDates: 종료일이 아주 멀어도 최대 104개에서 멈춘다", () => {
  const m = loadCalendar();
  const dates = m.computeRepeatDates("2026-01-01", "weekly", "2099-12-31");
  assert.equal(dates.length, 104); // 무한 생성 방지 안전장치
});

test("firstRuleMatchOnOrAfter: 고른 요일/날짜가 이미 지났으면 다음 주·다음 달로 넘어간다", () => {
  const m = loadCalendar();
  // 2026-09-15는 화요일. "매주 수요일"을 고르면 바로 다음날부터 시작.
  assert.equal(m.firstRuleMatchOnOrAfter("2026-09-15", "weekly", 3), "2026-09-16");
  // 같은 요일(화요일=2)을 고르면 그날 그대로 시작.
  assert.equal(m.firstRuleMatchOnOrAfter("2026-09-15", "weekly", 2), "2026-09-15");
  // "매월 5일"인데 시작일이 이미 9/20이면 다음 달 5일.
  assert.equal(m.firstRuleMatchOnOrAfter("2026-09-20", "monthly", null, 5), "2026-10-05");
  // 아직 안 지났으면 이번 달.
  assert.equal(m.firstRuleMatchOnOrAfter("2026-09-01", "monthly", null, 5), "2026-09-05");
  // "매월 31일"인데 다음 달이 11월(30일까지)이면 말일로 맞춘다.
  assert.equal(m.firstRuleMatchOnOrAfter("2026-10-31", "monthly", null, 31), "2026-10-31");
});

test("repeatRuleLabel: 반복 규칙을 사람이 읽는 문구로 바꾼다", () => {
  const m = loadCalendar();
  assert.equal(m.repeatRuleLabel("weekly", 1), "매주 월요일");
  assert.equal(m.repeatRuleLabel("weekly", 0), "매주 일요일");
  assert.equal(m.repeatRuleLabel("monthly", null, 15), "매월 15일");
});

test("sortEntries: 완료된 항목은 뒤로, 중요 표시는 앞으로, 그다음 시간순으로 정렬한다", () => {
  const m = loadCalendar();
  const sorted = toPlain(m.sortEntries([
    { id: "done", done: true, priority: true, time: "01:00" },
    { id: "late", time: "18:00" },
    { id: "notime" },
    { id: "early", time: "09:00" },
    { id: "important", priority: true, time: "23:00" },
  ])).map((e) => e.id);
  // 중요(시간 상관없이 먼저) → 일반 시간순 → 시간 없음 → 완료
  assert.deepEqual(sorted, ["important", "early", "late", "notime", "done"]);
});

test("formatRangeLabel: 기간을 '9/1 → 10/3' 형태로 보여준다", () => {
  const m = loadCalendar();
  assert.equal(m.formatRangeLabel("2026-09-01", "2026-10-03"), "9/1 → 10/3");
});

test("computeUpcoming: 이번 달이면 오늘 이후, 다른 달이면 1일부터 모아 날짜·중요·시간순으로 준다", () => {
  const m = loadCalendar();
  m.cal.year = 2026;
  m.cal.monthIndex = 8; // 오늘(2026-09-15)이 속한 달
  m.cal.monthData = {
    10: [{ id: "past", text: "지난 일정" }], // 오늘보다 앞이라 빠짐
    15: [
      { id: "todayLate", text: "오늘 늦게", time: "18:00" },
      { id: "todayImportant", text: "오늘 중요", priority: true, time: "23:00" },
    ],
    20: [
      { id: "done", text: "완료됨", done: true }, // 완료된 건 빠짐
      { id: "later", text: "나중 일정" },
    ],
  };
  assert.deepEqual(toPlain(m.computeUpcoming()).map((e) => e.id), ["todayImportant", "todayLate", "later"]);

  // 다른 달을 보고 있으면 그 달 1일부터 전부 보여준다.
  m.cal.monthIndex = 9; // 10월
  assert.deepEqual(toPlain(m.computeUpcoming()).map((e) => e.id), ["past", "todayImportant", "todayLate", "later"]);
});

test("computeUpcoming: 기간 일정처럼 여러 날에 같은 id가 들어있어도 한 번만 보여준다", () => {
  const m = loadCalendar();
  m.cal.year = 2026;
  m.cal.monthIndex = 8;
  const entry = { id: "trip", text: "출장", rangeStart: "2026-09-16", rangeEnd: "2026-09-18" };
  m.cal.monthData = { 16: [entry], 17: [entry], 18: [entry] };
  const upcoming = m.computeUpcoming();
  assert.equal(upcoming.length, 1);
  assert.equal(upcoming[0].dayNum, 16); // 가장 이른 날짜 기준으로 한 번만
});

test("sortTodos: 완료된 할 일은 뒤로, 마감일 있는 것부터 날짜순으로 정렬한다", () => {
  const m = loadCalendar();
  const sorted = toPlain(m.sortTodos([
    { id: "done", done: true, due: "2026-01-01" },
    { id: "noDue" },
    { id: "late", due: "2026-12-31" },
    { id: "soon", due: "2026-09-16" },
  ])).map((t) => t.id);
  assert.deepEqual(sorted, ["soon", "late", "noDue", "done"]);
});

test("formatTodoDue: 마감일을 '9/16' 형태로 짧게 보여준다", () => {
  const m = loadCalendar();
  assert.equal(m.formatTodoDue("2026-09-16"), "9/16");
  assert.equal(m.formatTodoDue("2026-12-01"), "12/1");
  // 마감일이 없거나 형식이 깨진 값이면 "NaN/NaN" 대신 빈 문자열.
  assert.equal(m.formatTodoDue(""), "");
  assert.equal(m.formatTodoDue(undefined), "");
  assert.equal(m.formatTodoDue("날짜아님"), "");
});
