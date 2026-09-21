// tests/schedule-auto-fill.test.js
// js/07c-schedule-auto-fill.js — 월별 스케줄 "AI 자동 배치"의 조건 테스트.
//
//  - 연속 근무 5일 제한: 이번 달 안에서, 그리고 지난달에서 이어지는 월 초 구간(지난달에도 있던 인원만)
//  - 인원별 선호 오프 요일: 소프트 조건(최대한 맞추되 필요인력·연속 근무 제한에는 양보)
//  - 계획을 세우는 동안 scheduleData를 바꾸지 않는다(미리보기 단계에서는 아무것도 저장 안 됨)
//
// 진짜 DOM이 없으므로 팝업 열기/이벤트 연결(openScheduleAutoModal)은 여기서 검증할 수 없고,
// 그 안에서 쓰는 "HTML 문자열을 만드는 부분"과 계획 계산·저장 로직만 검증한다.
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { createSandbox, loadIntoContext, toPlain, exposeBindings } = require("./helpers/load-source");
const { createFakeDocument, createMemoryLocalStorage } = require("./helpers/fake-dom");

const YEAR = 2026, MI = 8; // 2026년 9월 (토 4일 + 일 4일 = 목표 오프 8개, 공휴일은 테스트에서 없다고 가정)
const pad = (n) => String(n).padStart(2, "0");
const sep = (d) => `2026-09-${pad(d)}`;
const aug = (d) => `2026-08-${pad(d)}`;
const OFF = { status: "OFF", attendance: null };

function staff(id, extra) {
  return Object.assign({ id, name: `이름-${id}`, nickname: `닉-${id}`, empNo: id, hireDate: "2024-01-02", workHours: "09:00-18:00", types: ["채팅"], group: "day" }, extra || {});
}

function setup(fixtureOverrides) {
  const fixture = Object.assign({
    staff: [staff("s1"), staff("s2")],
    records: {},
    memos: {}, staffHistory: {}, lastSyncMonthKey: null, requiredHeadcount: {}, monthLocks: {}, collapseByMonth: {},
  }, fixtureOverrides || {});
  const store = createMemoryLocalStorage({ sched: JSON.stringify(fixture) });
  const sandbox = createSandbox({
    today: new Date(2026, 8, 15), // 9월은 "이번 달", 8월은 "지난 달"
    SCHEDULE_KEY: "sched",
    acctKey: (k) => k,
    localStorage: store,
    document: createFakeDocument(),
    setTimeout: () => 0,
    clearTimeout: () => {},
    recordUndo: () => {},
    renderApp: () => {},
    agentsData: [],
  });
  loadIntoContext(sandbox, [
    "js/01a-icons.js",
    "js/01f-settings-menu-utils.js",
    "js/01k-calendar-shared-data.js",
    "js/07a1-schedule-data.js",
    "js/07a2-schedule-ui-state.js",
    "js/07a3-schedule-records.js",
    "js/07a4-schedule-table-render.js",
    "js/07c-schedule-auto-fill.js",
  ]);
  sandbox.getHoliday = () => null; // 01k의 실제 공휴일 데이터 대신, 목표 개수가 주말만으로 정해지게 고정
  exposeBindings(sandbox, ["scheduleData", "scheduleUi"]);
  sandbox.scheduleUi.year = YEAR;
  sandbox.scheduleUi.monthIndex = MI;
  return { m: sandbox, store, saved: () => JSON.parse(store.getItem("sched")) };
}

// ---- 테스트용 검산기(소스의 함수를 쓰지 않고 따로 구현해서 서로 교차 확인한다) ----
function isWork(rec) {
  if (!rec) return true; // 기록 없음 = 기본값 근무
  if (rec.status === "WORK") return rec.attendance !== "ABSENT";
  return rec.status === "HALF" || rec.status === "EDUCATION";
}
// 계획을 반영한 뒤의 기록(원본은 건드리지 않음)
function withPlan(records, plan) {
  const out = JSON.parse(JSON.stringify(records));
  plan.perStaffPlan.forEach((p) => p.assigned.forEach((d) => { out[`${p.staffId}|${sep(d)}`] = OFF; }));
  return out;
}
// 이번 달에서 가장 길게 이어진 연속 근무일수 (carry: 지난달 말에서 이어지는 일수)
function maxRun(records, staffId, carry) {
  let run = carry, max = carry;
  for (let d = 1; d <= 30; d++) {
    if (isWork(records[`${staffId}|${sep(d)}`])) { run++; if (run > max) max = run; } else run = 0;
  }
  return max;
}
function firstOffDay(records, staffId) {
  for (let d = 1; d <= 30; d++) if (!isWork(records[`${staffId}|${sep(d)}`])) return d;
  return null;
}
const dowOf = (d) => new Date(YEAR, MI, d).getDay();
const planOf = (plan, id) => plan.perStaffPlan.find((p) => p.staffId === id);

/* ===================== 연속 근무: 지난달에서 이어지는 월 초 ===================== */

test("지난달 말에 5일 연속 근무한 인원은 이번 달 1일이 오프로 배정된다(월 초 5일 초과 방지)", () => {
  const { m } = setup({
    records: { [`s1|${aug(26)}`]: OFF, [`s2|${aug(30)}`]: OFF }, // s1: 8/27~8/31 5일 연속, s2: 8/31 하루
  });
  assert.equal(m.scheduleAutoCarryStreak("s1", YEAR, MI), 5);
  assert.equal(m.scheduleAutoCarryStreak("s2", YEAR, MI), 1);
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  assert.ok(planOf(plan, "s1").assigned.includes(1), "5일 연속 뒤라서 9/1은 반드시 오프");
  const recs = withPlan(m.scheduleData.records, plan);
  assert.ok(maxRun(recs, "s1", 5) <= 5);
  assert.ok(maxRun(recs, "s2", 1) <= 5);
  assert.deepEqual(toPlain(plan.warnings).filter((w) => w.includes("연속 근무")), []);
});

test("지난달 말 연속 근무가 1~5일이면, (6 - 연속일수)일 안에 첫 오프가 들어간다", () => {
  const ids = ["c1", "c2", "c3", "c4", "c5"];
  const records = {};
  ids.forEach((id, i) => {
    const c = i + 1;
    records[`${id}|${aug(31 - c)}`] = OFF; // 8/(31-c)에 오프 → 그 뒤 c일 연속 근무
  });
  const { m } = setup({ staff: ids.map((id) => staff(id)), records });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const recs = withPlan(m.scheduleData.records, plan);
  ids.forEach((id, i) => {
    const c = i + 1;
    assert.equal(m.scheduleAutoCarryStreak(id, YEAR, MI), c);
    assert.ok(firstOffDay(recs, id) <= 6 - c, `${id}: 첫 오프가 ${6 - c}일 이내여야 함`);
    assert.ok(maxRun(recs, id, c) <= 5, `${id}: 연속 근무 5일 초과`);
  });
});

test("지난달에 없던 인원·지난달 기록이 비어 있는 인원·지난달 뒤에 입사한 인원은 이월하지 않는다", () => {
  const { m } = setup({
    staff: [staff("old"), staff("newbie"), staff("blank"), staff("late", { hireDate: "2026-09-01" })],
    // 지난달 명단 스냅샷: newbie는 없음. 그런데 기록(8/27~8/31 근무 + 8/26 오프)은 있다고 가정해도 이월하면 안 됨.
    staffHistory: { "2026-08": [staff("old"), staff("blank")] },
    records: {
      [`old|${aug(26)}`]: OFF,
      [`newbie|${aug(26)}`]: OFF,
      [`late|${aug(26)}`]: OFF,
      // blank: 지난달 기록이 하나도 없음 → 기본값 '근무'를 31일 연속으로 세면 안 된다
    },
  });
  assert.equal(m.scheduleAutoCarryStreak("old", YEAR, MI), 5);
  assert.equal(m.scheduleAutoCarryStreak("newbie", YEAR, MI), 0);
  assert.equal(m.scheduleAutoCarryStreak("blank", YEAR, MI), 0);
  assert.equal(m.scheduleAutoCarryStreak("late", YEAR, MI), 0);
});

test("1월 스케줄이면 지난해 12월 말에서 이어서 센다", () => {
  const { m } = setup({ records: { "s1|2025-12-28": OFF } }); // 12/29~12/31 3일 연속
  assert.equal(m.scheduleAutoCarryStreak("s1", 2026, 0), 3);
});

test("지난달 말이 오프·연차·공가 같은 쉬는 날이면 이월 0, 반차·교육은 근무일로 이어 센다", () => {
  const { m } = setup({
    records: {
      [`s1|${aug(31)}`]: { status: "ANNUAL", attendance: null },
      [`s1|${aug(30)}`]: { status: "WORK", attendance: null },
      [`s2|${aug(31)}`]: { status: "EDUCATION", attendance: null },
      [`s2|${aug(30)}`]: { status: "HALF", attendance: null },
      [`s2|${aug(29)}`]: { status: "GONGGA", attendance: null },
    },
  });
  assert.equal(m.scheduleAutoCarryStreak("s1", YEAR, MI), 0);
  assert.equal(m.scheduleAutoCarryStreak("s2", YEAR, MI), 2);
});

/* ===================== 연속 근무: 이번 달 안 ===================== */

test("이미 입력된 오프·연차·교육이 섞여 있어도 이번 달 연속 근무가 5일을 넘지 않는다", () => {
  const records = {
    // a: 오프가 1일과 14일에만 있어서 사이가 13일이나 비어 있음
    [`a|${sep(1)}`]: OFF, [`a|${sep(14)}`]: OFF,
    // e: 9/2~9/6 교육 5일(교육도 출근이라 근무일) → 9/1과 9/7이 오프여야 5일 이하
    [`e|${sep(2)}`]: { status: "EDUCATION", attendance: null }, [`e|${sep(3)}`]: { status: "EDUCATION", attendance: null },
    [`e|${sep(4)}`]: { status: "EDUCATION", attendance: null }, [`e|${sep(5)}`]: { status: "EDUCATION", attendance: null },
    [`e|${sep(6)}`]: { status: "EDUCATION", attendance: null },
    // v: 연차는 쉬는 날로 본다
    [`v|${sep(10)}`]: { status: "ANNUAL", attendance: null }, [`v|${sep(11)}`]: { status: "ANNUAL", attendance: null },
  };
  const { m } = setup({ staff: [staff("a"), staff("e"), staff("v"), staff("z")], records });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const recs = withPlan(m.scheduleData.records, plan);
  ["a", "e", "v", "z"].forEach((id) => assert.ok(maxRun(recs, id, 0) <= 5, `${id}: 연속 근무 5일 초과`));
  assert.ok(planOf(plan, "e").assigned.includes(1) && planOf(plan, "e").assigned.includes(7), "교육 5일 앞뒤는 오프");
  assert.equal(planOf(plan, "a").assigned.length, 8 - 2); // 목표 개수는 그대로(기존 오프 2개 제외)
  assert.deepEqual(toPlain(plan.warnings).filter((w) => w.includes("연속 근무")), []);
});

test("오프 목표 개수를 넘겨서까지 늘리지는 않고, 못 고치는 연속 근무는 경고로 알려준다", () => {
  const records = {};
  for (let d = 1; d <= 8; d++) records[`q|${sep(d)}`] = OFF; // 이미 8개(목표 달성) — 그런데 9/9~9/30은 22일 연속 근무
  const { m } = setup({ staff: [staff("q")], records });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  assert.equal(planOf(plan, "q"), undefined, "목표를 이미 채웠으면 새로 배정하지 않는다");
  assert.ok(plan.warnings.some((w) => w.includes("이름-q") && w.includes("9/9~9/30") && w.includes("22일 연속 근무")));
});

test("지난달에서 이어진 5일 뒤 1일이 이미 근무 기록(교육)이라 오프로 못 고치면 경고한다", () => {
  const { m } = setup({
    staff: [staff("p")],
    records: { [`p|${aug(26)}`]: OFF, [`p|${sep(1)}`]: { status: "EDUCATION", attendance: null } },
  });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const recs = withPlan(m.scheduleData.records, plan);
  // 8/27~9/1 = 6일 연속은 9/1이 잠겨 있어서(입력된 칸) 못 없앤다 → 경고. 그 뒤 구간은 정상이어야 한다.
  assert.ok(plan.warnings.some((w) => w.includes("지난달 말부터 이어져") && w.includes("6일 연속 근무")));
  let run = 0, maxAfter = 0;
  for (let d = 2; d <= 30; d++) { if (isWork(recs[`p|${sep(d)}`])) { run++; maxAfter = Math.max(maxAfter, run); } else run = 0; }
  assert.ok(maxAfter <= 5);
});

/* ===================== 선호 오프 요일 ===================== */

test("선호 요일(화·수)을 지정하면, 다른 조건이 방해하지 않는 한 그 요일에 오프가 배정된다", () => {
  const { m } = setup({
    staff: [staff("s1"), staff("s2")],
    autoOffPrefs: { s1: { dows: [2, 3] } },
  });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const p = planOf(plan, "s1");
  assert.equal(p.assigned.length, 8);
  assert.deepEqual(toPlain(p.prefDows), [2, 3]);
  assert.ok(p.assigned.every((d) => [2, 3].includes(dowOf(d))), `s1 배정: ${p.assigned.join(",")}`);
  assert.equal(p.prefHits, 8);
  assert.ok(maxRun(withPlan(m.scheduleData.records, plan), "s1", 0) <= 5);
});

test("선호 요일은 소프트 조건: 후보가 모자라면 다른 요일로 채우고, 연속 근무 5일 제한이 우선한다", () => {
  const { m } = setup({
    staff: [staff("s1")],
    autoOffPrefs: { s1: { dows: [2] } }, // 화요일만 → 9월엔 5번뿐인데 목표는 8개
  });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const p = planOf(plan, "s1");
  assert.equal(p.assigned.length, 8, "목표 개수는 그대로 채운다");
  // 화요일 5번을 전부 쓰면 화요일 사이가 6일씩 4구간이라 나머지 오프 3개로는 다 못 끊는다 → 5일 제한이 우선이라 4번만 반영
  assert.equal(p.prefHits, 4, "5일 제한을 지키는 범위에서 최대한 반영");
  assert.ok(maxRun(withPlan(m.scheduleData.records, plan), "s1", 0) <= 5);
  assert.deepEqual(toPlain(plan.warnings), []);
});

test("선호 요일은 필요인력 허용범위에 양보한다(월요일은 ±1명)", () => {
  const requiredHeadcount = {};
  [7, 14, 21, 28].forEach((d) => { requiredHeadcount[`2026-09|DAY|채팅|${d}`] = 2; }); // 월요일마다 2명 필요, 투입 가능은 2명
  const { m } = setup({
    staff: [staff("s1"), staff("s2")],
    requiredHeadcount,
    autoOffPrefs: { s1: { dows: [1] }, s2: { dows: [1] } }, // 둘 다 월요일 선호
  });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  [7, 14, 21, 28].forEach((d) => {
    const offCount = ["s1", "s2"].filter((id) => planOf(plan, id).assigned.includes(d)).length;
    assert.ok(offCount <= 1, `9/${d}: 둘 다 쉬면 0명이라 허용범위(±1)를 벗어남`);
  });
  // 선호가 같은 날에 겹치면 먼저 고른 사람(등록 순서상 s1)이 우선한다.
  assert.equal(planOf(plan, "s1").prefHits, 4);
  assert.equal(planOf(plan, "s2").prefHits, 0);
  assert.deepEqual(toPlain(plan.warnings), []);
});

test("선호 요일이 없는 인원의 결과는 기존과 같은 기준(제약 없는 날 → 분산 → 빠른 날짜)으로 채워진다", () => {
  const { m } = setup({ staff: [staff("s1"), staff("s2")] });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  assert.equal(plan.target, 8);
  assert.equal(planOf(plan, "s1").assigned.length, 8);
  assert.equal(planOf(plan, "s2").assigned.length, 8);
  // 두 사람이 같은 날에 몰리지 않고 서로 다른 날을 우선 쓴다(분산): 처음 8일 동안 겹치는 날이 없어야 함
  const a = planOf(plan, "s1").assigned, b = planOf(plan, "s2").assigned;
  assert.equal(a.filter((d) => b.includes(d)).length, 0);
});

/* ===================== 저장·정규화·HTML ===================== */

test("선호 요일 토글: 저장되고, 모두 해제하면 항목이 사라지며, 잘못된 값은 걸러서 읽는다", () => {
  const { m, saved } = setup();
  m.scheduleAutoTogglePrefDow("s1", 3);
  m.scheduleAutoTogglePrefDow("s1", 1);
  assert.deepEqual(toPlain(saved().autoOffPrefs), { s1: { dows: [1, 3] } });
  m.scheduleAutoTogglePrefDow("s1", 3);
  assert.deepEqual(toPlain(m.scheduleAutoGetPrefDows("s1")), [1]);
  m.scheduleAutoTogglePrefDow("s1", 1);
  assert.deepEqual(toPlain(saved().autoOffPrefs), {});

  m.scheduleData.autoOffPrefs = { s2: { dows: [9, "a", 2, 2, -1, 6] } };
  assert.deepEqual(toPlain(m.scheduleAutoGetPrefDows("s2")), [2, 6]);
  assert.deepEqual(toPlain(m.scheduleAutoGetPrefDows("nobody")), []);
});

test("normalizeScheduleData: autoOffPrefs가 없던 예전 데이터에도 빈 객체를 채워준다", () => {
  const { m } = setup();
  assert.deepEqual(toPlain(m.normalizeScheduleData({ staff: [], records: {} }).autoOffPrefs), {});
  assert.deepEqual(toPlain(m.normalizeScheduleData({ staff: [], records: {}, autoOffPrefs: null }).autoOffPrefs), {});
});

test("계획을 세우는 동안 scheduleData(지난달 스냅샷 포함)를 바꾸거나 저장하지 않는다", () => {
  const { m, store } = setup({ records: { [`s1|${aug(26)}`]: OFF }, autoOffPrefs: { s1: { dows: [2] } } });
  const before = store.getItem("sched");
  const snapshot = JSON.stringify(m.scheduleData);
  m.scheduleAutoBuildPlan(YEAR, MI);
  assert.equal(JSON.stringify(m.scheduleData), snapshot);
  assert.equal(store.getItem("sched"), before);
  assert.equal(m.scheduleData.staffHistory["2026-08"], undefined, "지난 달 스냅샷을 새로 만들지 않는다");
});

test("설정 HTML: 선택된 요일 칸 표시, 이름 이스케이프", () => {
  const { m } = setup({
    staff: [staff("s1", { name: "<b>홍</b>" }), staff("s2")],
    autoOffPrefs: { s1: { dows: [2, 3] } },
  });
  const prefsHtml = m.scheduleAutoPrefsHtml(m.getStaffListForMonth(YEAR, MI));
  assert.ok(prefsHtml.includes("(1명 설정됨)"));
  assert.ok(prefsHtml.includes(`data-auto-pref-staff="s1" data-auto-pref-dow="2" aria-pressed="true"`));
  assert.ok(prefsHtml.includes(`data-auto-pref-staff="s1" data-auto-pref-dow="0" aria-pressed="false"`));
  assert.ok(!prefsHtml.includes("<b>홍</b>"), "이름은 이스케이프되어야 함");
  assert.ok(prefsHtml.includes("&lt;b&gt;홍&lt;/b&gt;"));
});

/* ===================== 미리보기: 월별 스케줄 표 모양 ===================== */

const count = (html, re) => (html.match(re) || []).length;

test("미리보기는 월별 스케줄 표(schedule-table)이고, 새로 배정될 오프 칸에만 강조 클래스가 붙는다", () => {
  const { m } = setup({
    staff: [staff("s1", { name: "김주간" }), staff("s2", { name: "이채팅" })],
    autoOffPrefs: { s1: { dows: [2, 3] } },
    records: { [`s2|${sep(2)}`]: OFF }, // 원래 있던 오프 1칸(강조되면 안 됨)
  });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const html = m.scheduleAutoPreviewHtml(plan);
  const total = plan.perStaffPlan.reduce((n, p) => n + p.assigned.length, 0);
  const hits = plan.perStaffPlan.reduce((n, p) => n + p.prefHits, 0);
  assert.ok(html.includes('<table class="schedule-table">'), "실제 월별 스케줄 표와 같은 표");
  assert.ok(html.includes("김주간") && html.includes("이채팅"));
  assert.equal(count(html, /sch-cell--auto(?![-\w])/g), total, "새로 배정될 칸마다 강조");
  assert.equal(count(html, /sch-cell--auto-pref/g), hits, "선호와 맞은 칸에만 ★ 클래스");
  assert.ok(hits > 0);
  // 배정된 칸은 오프로 그려지고(기존 오프 1칸 포함), 강조는 새로 배정된 칸에만 있다
  assert.equal(count(html, /sch-cell st-off/g), total + 1);
  assert.ok(html.includes(`총 <b>${total}칸</b>`));
  assert.ok(html.includes(`선호 요일 반영 <b>${hits}/`));
  // 요약 행(집계·필요인력 대비 등)도 표에 그대로 있다
  assert.ok(html.includes("sch-summary-row"));
});

test("미리보기 표: 집계 열(오프 합계)에 적용 후 개수가 나오고, 편집용 요소는 막혀 있다", () => {
  const { m } = setup({ staff: [staff("s1", { name: "김주간" })] });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const html = m.scheduleAutoPreviewHtml(plan);
  // 이 인원은 기존 오프 0 → 8개가 채워지므로 "오프" 집계 칸이 8
  assert.ok(/sch-col-off[^>]*>8<\/td>/.test(html), "오프 합계가 8");
  assert.ok(!html.includes('tabindex="0"'), "칸에 포커스가 가지 않는다");
  assert.ok(!html.includes("클릭해서 선택"), "편집 안내 툴팁 제거");
  assert.equal(count(html, /<input /g), count(html, /<input disabled /g), "필요인력 입력칸은 모두 비활성");
  assert.ok(count(html, /<input /g) > 0);
});

test("미리보기 표를 그리는 동안만 계획을 records에 얹고, 끝나면 records·화면 상태를 원래대로 되돌린다", () => {
  const { m, store } = setup({
    staff: [staff("s1", { name: "김주간" }), staff("s2", { name: "이채팅" })],
  });
  // 화면에서 검색·접기 중인 상태(미리보기에는 영향을 주면 안 되고, 끝나면 그대로여야 한다)
  m.scheduleUi.searchQuery = "이채팅";
  m.scheduleUi.manualHiddenStaffIds.add("s1");
  m.scheduleUi.manualHiddenDays.add(3);
  m.scheduleUi.collapsedRowGroups.add("ALL::DAY");
  const before = JSON.stringify(m.scheduleData);
  const uiBefore = JSON.stringify({
    q: m.scheduleUi.searchQuery, h: [...m.scheduleUi.manualHiddenStaffIds], d: [...m.scheduleUi.manualHiddenDays], g: [...m.scheduleUi.collapsedRowGroups],
  });

  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const html = m.scheduleAutoPreviewHtml(plan);
  assert.ok(html.includes("김주간") && html.includes("이채팅"), "검색·숨김과 무관하게 전체 인원을 보여준다");
  assert.ok(!html.includes("sch-row-hidden") && !html.includes("sch-col-hidden"), "접힌 행·열 없이 전부 보여준다");

  assert.equal(JSON.stringify(m.scheduleData), before, "records에 얹은 칸이 남지 않는다");
  assert.equal(store.getItem("sched"), JSON.stringify(JSON.parse(store.getItem("sched"))), "저장소는 그대로");
  assert.equal(JSON.stringify({
    q: m.scheduleUi.searchQuery, h: [...m.scheduleUi.manualHiddenStaffIds], d: [...m.scheduleUi.manualHiddenDays], g: [...m.scheduleUi.collapsedRowGroups],
  }), uiBefore, "화면 상태 복원");
  // 실제 월별 스케줄 표에는 미리보기 강조가 전혀 새어 나오지 않는다
  const real = m.buildScheduleTableHtml();
  assert.ok(!real.includes("sch-cell--auto"));
  assert.equal(count(real, /sch-cell st-off/g), 0);
});

test("표를 그리다 예외가 나도 records·화면 상태·강조 표시를 원래대로 되돌린다", () => {
  const { m } = setup({ staff: [staff("s1")] });
  m.scheduleUi.searchQuery = "abc";
  const before = JSON.stringify(m.scheduleData);
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const original = m.buildScheduleTableHtml;
  m.buildScheduleTableHtml = () => { throw new Error("boom"); };
  assert.throws(() => m.scheduleAutoPreviewHtml(plan), /boom/);
  m.buildScheduleTableHtml = original;
  assert.equal(JSON.stringify(m.scheduleData), before);
  assert.equal(m.scheduleUi.searchQuery, "abc");
  m.scheduleUi.searchQuery = ""; // (검색 매칭용 초성 유틸은 이 테스트에서 로드하지 않으므로 검색어를 비운 뒤 그린다)
  assert.ok(!m.buildScheduleTableHtml().includes("sch-cell--auto"));
});

test("배정할 칸이 없으면 안내 문구와 함께 현재 표를 그대로 보여준다", () => {
  const records = {};
  for (let d = 1; d <= 8; d++) records[`s1|${sep(d)}`] = OFF; // 이미 목표 8개를 채움
  const { m } = setup({ staff: [staff("s1")], records });
  const html = m.scheduleAutoPreviewHtml(m.scheduleAutoBuildPlan(YEAR, MI));
  assert.ok(html.includes("새로 배정할 칸이 없어요"));
  assert.ok(html.includes('<table class="schedule-table">'));
  assert.equal(count(html, /sch-cell--auto(?![-\w])/g), 0);
});

/* ===================== 조합 계산기(scheduleAutoSolveDays) 검증 ===================== */

// 작은 경우를 전부 나열(브루트포스)해서 "위반 최소 → 날짜 점수 합 최대" 조합과 같은 값이 나오는지 확인한다.
function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function evalSet(days, picks, carry, limit, isRest, dayScore) {
  const set = new Set(picks);
  let streak = carry, viol = 0;
  for (let d = 1; d <= days; d++) {
    if (isRest(d) || set.has(d)) { streak = 0; continue; }
    streak++;
    if (streak > limit) viol++;
  }
  const sum = picks.reduce((acc, d) => acc.map((x, i) => x + dayScore(d)[i]), [0, 0, 0]);
  return [-viol, ...sum];
}
function cmp(a, b) { for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1; return 0; }
function combos(arr, k) {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  const [h, ...t] = arr;
  return combos(t, k - 1).map((c) => [h, ...c]).concat(combos(t, k));
}

test("scheduleAutoSolveDays: 무작위 작은 경우 300개에서 브루트포스 최적값과 항상 같다", () => {
  const { m } = setup();
  const rnd = mulberry32(20260921);
  for (let iter = 0; iter < 300; iter++) {
    const days = 12 + Math.floor(rnd() * 5);          // 12~16일
    const limit = 2 + Math.floor(rnd() * 4);          // 2~5일
    const carry = Math.floor(rnd() * (limit + 3));    // 지난달 말에서 이어지는 일수(한도 초과도 포함)
    const restSet = new Set(), freeSet = new Set();
    for (let d = 1; d <= days; d++) { const r = rnd(); if (r < 0.15) restSet.add(d); else if (r < 0.85) freeSet.add(d); }
    const needed = Math.floor(rnd() * 7);
    const scores = {};
    for (let d = 1; d <= days; d++) scores[d] = [Math.floor(rnd() * 2), Math.floor(rnd() * 3), -d];
    const isRest = (d) => restSet.has(d), isFree = (d) => freeSet.has(d), dayScore = (d) => scores[d];

    const res = toPlain(m.scheduleAutoSolveDays({ daysInMonth: days, carry, limit, needed, isRest, isFree, dayScore }));
    const freeDays = [...freeSet];
    const K = Math.min(needed, freeDays.length);
    assert.equal(res.picked.length, K, `iter ${iter}: 개수`);
    assert.ok(res.picked.every((d) => freeSet.has(d)), `iter ${iter}: 빈 칸만 고른다`);
    let best = null;
    combos(freeDays, K).forEach((c) => {
      const v = evalSet(days, c, carry, limit, isRest, dayScore);
      if (!best || cmp(v, best) > 0) best = v;
    });
    const got = evalSet(days, res.picked, carry, limit, isRest, dayScore);
    assert.deepEqual(got, best, `iter ${iter}: days=${days} limit=${limit} carry=${carry} needed=${needed}`);
    assert.equal(res.violations, -best[0], `iter ${iter}: 위반 수`);
  }
});
