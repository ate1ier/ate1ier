// tests/schedule-auto-fill.test.js
// js/07c-schedule-auto-fill.js — 월별 스케줄 "AI 자동 배치"의 조건 테스트.
//
//  - 연속 근무 5일 제한: 이번 달 안에서, 그리고 지난달에서 이어지는 월 초 구간(지난달에도 있던 인원만)
//  - 인원별 선호 오프 요일: 소프트 조건(최대한 맞추되 필요인력·연속 근무 제한에는 양보)
//  - 계획을 세우는 동안 scheduleData를 바꾸지 않는다(미리보기 단계에서는 아무것도 저장 안 됨)
//  - 배치 조건 "제외할 인원": 그 인원은 재직 인원·필요인력 계산·오프 배정·미리보기 표에서 모두 빠진다(이번 배치 한정)
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

// setupOpts.premise: true면 대전제(구분별 하루 출근 최소 3명)를 실제 기본값 그대로 켠 채로 계획을 세운다.
// 그렇지 않으면(기본) 이 파일의 예전 테스트들이 2~4명짜리 작은 명단으로 다른 조건(연속 근무·선호 요일·제외 인원 등)만
// 검증하도록, scheduleAutoBuildPlan을 부를 때 options.minWorking을 0(대전제 끔)으로 채워준다. 대전제 자체는 아래
// "대전제" 구역의 테스트들이 기본값(3) 그대로 검증한다.
function setup(fixtureOverrides, setupOpts) {
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
  if (!(setupOpts && setupOpts.premise)) {
    const rawBuildPlan = sandbox.scheduleAutoBuildPlan;
    sandbox.scheduleAutoBuildPlan = (y, mi, opts) => rawBuildPlan(y, mi, Object.assign({ minWorking: 0 }, opts));
  }
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
  const { m } = setup({ staff: [staff("a"), staff("e"), staff("v"), staff("z")], records, memos: { [`a|${sep(1)}`]: "필휴", [`a|${sep(14)}`]: "필휴" } });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const recs = withPlan(m.scheduleData.records, plan);
  ["a", "e", "v", "z"].forEach((id) => assert.ok(maxRun(recs, id, 0) <= 5, `${id}: 연속 근무 5일 초과`));
  assert.ok(planOf(plan, "e").assigned.includes(1) && planOf(plan, "e").assigned.includes(7), "교육 5일 앞뒤는 오프");
  assert.equal(planOf(plan, "a").assigned.length, 8 - 2); // 목표 개수는 그대로(기존 오프 2개 제외)
  assert.deepEqual(toPlain(plan.warnings).filter((w) => w.includes("연속 근무")), []);
});

test("오프 목표 개수를 넘겨서까지 늘리지는 않고, 못 고치는 연속 근무는 경고로 알려준다", () => {
  const records = {};
  const memos = {};
  for (let d = 1; d <= 8; d++) { records[`q|${sep(d)}`] = OFF; memos[`q|${sep(d)}`] = "필휴"; } // 이미 목표 8개를 채운 필휴 8개 — 그런데 9/9~9/30은 22일 연속 근무
  const { m } = setup({ staff: [staff("q")], records, memos });
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

/* ===================== 연속 오프: 자동 배치 ===================== */

test("자동 배치는 필휴가 아닌 기존 휴무 3일 연속 뒤에 4번째 새 오프를 붙이지 않는다", () => {
  const records = {
    [`s1|${sep(10)}`]: OFF,
    [`s1|${sep(11)}`]: OFF,
    [`s1|${sep(12)}`]: OFF,
  };
  const { m } = setup({ staff: [staff("s1")], records });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const p = planOf(plan, "s1");
  assert.ok(p, "나머지 목표 오프는 계속 계산되어야 한다");
  assert.ok(!p.assigned.includes(9) && !p.assigned.includes(13), "3일 연속 기존 휴무의 양쪽에 4일째 새 오프를 만들지 않는다");
});

test("메모의 필휴도 연속 오프에 포함되어 새 OFF가 3일을 초과하는 연결을 만들지 않는다", () => {
  const records = {
    [`s1|${sep(10)}`]: OFF,
    [`s1|${sep(11)}`]: OFF,
    [`s1|${sep(12)}`]: OFF,
  };
  const memos = {
    [`s1|${sep(12)}`]: "필휴",
  };
  const { m } = setup({ staff: [staff("s1")], records, memos });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const p = planOf(plan, "s1");
  assert.ok(p);
  // 10~12가 기존 휴무이고 12일 메모가 필휴이므로, 9일/13일에 OFF를 붙이면
  // 4일 연속이 된다. 따라서 양쪽 모두 새 OFF 후보에서 제외되어야 한다.
  assert.ok(!p.assigned.includes(9), "필휴를 포함한 기존 3일 휴무 앞에 4일째 OFF를 붙이지 않는다");
  assert.ok(!p.assigned.includes(13), "필휴를 포함한 기존 3일 휴무 뒤에 4일째 OFF를 붙이지 않는다");
});


/* ===================== 선호 오프 요일 ===================== */
test("선호 오프는 강한 조건을 크게 해치지 않는 범위에서 주말 선택을 실제로 밀어준다", () => {
  const people = [staff("s1"), staff("s2"), staff("s3"), staff("s4"), staff("s5", { name: "김보배" })];
  const { m } = setup({ staff: people, autoOffPrefs: { s5: { dows: [0, 6] } } }, { premise: true });
  const p = planOf(m.scheduleAutoBuildPlan(YEAR, MI), "s5");
  const weekend = p.assigned.filter(d => [0, 6].includes(new Date(YEAR, MI, d).getDay()));
  assert.ok(weekend.length >= 2, `주말 선호가 전혀 반영되지 않음: ${p.assigned.join(",")}`);
  assert.ok(p.prefHits >= 2, `선호 오프 적중 수가 낮음: ${p.prefHits}`);
});

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

test("선호 요일은 최후 허용범위를 지키는 후보 안에서 필요인력 1순위보다 우선한다", () => {
  const requiredHeadcount = {};
  // 9/8(화): 2명 필요, 2명 투입이라 오프를 넣으면 -1이지만 최후 허용범위 안이다.
  // 9/9(수): 1명 필요, 2명 투입이라 오프를 넣어도 부족이 없다.
  requiredHeadcount[`2026-09|DAY|채팅|8`] = 2;
  requiredHeadcount[`2026-09|DAY|채팅|9`] = 1;
  const { m } = setup({
    staff: [staff("s1"), staff("s2")],
    requiredHeadcount,
    autoOffPrefs: { s1: { dows: [2] } },
  });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const s1 = planOf(plan, "s1");
  assert.ok(s1.assigned.some((d) => d === 8), `선호 화요일(9/8)을 우선하지 않음: ${s1.assigned.join(",")}`);
});

test("선호 요일은 필요인력 허용범위에 양보한다(월요일은 부족 -1명까지)", () => {
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
    assert.ok(offCount <= 1, `9/${d}: 둘 다 쉬면 0명(-2)이라 허용범위(-1)를 벗어남`);
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



test("선호 출근 요일: 저장되고 같은 요일의 선호 오프와 상호 배타적이다", () => {
  const { m, saved } = setup();
  m.scheduleAutoToggleWorkPrefDow("s1", 6);
  m.scheduleAutoToggleWorkPrefDow("s1", 0);
  assert.deepEqual(toPlain(saved().autoWorkPrefs), { s1: { dows: [0, 6] } });
  m.scheduleAutoTogglePrefDow("s1", 6);
  assert.deepEqual(toPlain(saved().autoWorkPrefs), { s1: { dows: [0] } });
  assert.deepEqual(toPlain(saved().autoOffPrefs), { s1: { dows: [6] } });
  m.scheduleAutoToggleWorkPrefDow("s1", 0);
  assert.deepEqual(toPlain(saved().autoWorkPrefs), {});
});

test("선호 출근 요일이 지정된 날에는 새 오프 배정을 우선 피한다", () => {
  const { m } = setup({
    staff: [staff("s1")],
    autoWorkPrefs: { s1: { dows: [0, 6] } },
  });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const assigned = planOf(plan, "s1").assigned;
  assert.equal(assigned.length, 8);
  assert.ok(assigned.every((d) => ![0, 6].includes(dowOf(d))), `선호 출근일에 오프가 배정됨: ${assigned}`);
});

test("normalizeScheduleData: autoOffPrefs가 없던 예전 데이터에도 빈 객체를 채워준다", () => {
  const { m } = setup();
  assert.deepEqual(toPlain(m.normalizeScheduleData({ staff: [], records: {} }).autoOffPrefs), {});
  assert.deepEqual(toPlain(m.normalizeScheduleData({ staff: [], records: {} }).autoWorkPrefs), {});
  assert.deepEqual(toPlain(m.normalizeScheduleData({ staff: [], records: {}, autoOffPrefs: null, autoWorkPrefs: null }).autoOffPrefs), {});
  assert.deepEqual(toPlain(m.normalizeScheduleData({ staff: [], records: {}, autoOffPrefs: null, autoWorkPrefs: null }).autoWorkPrefs), {});
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

test("인원별 설정은 오프/선호 출근을 별도 팝업으로 열고 월~일 순서다", () => {
  const { m } = setup({
    staff: [staff("s1", { name: "<b>홍</b>" }), staff("s2")],
    autoOffPrefs: { s1: { dows: [2, 3] } },
    autoWorkPrefs: { s1: { dows: [5] } },
  });
  const list = m.getStaffListForMonth(YEAR, MI);
  const offHtml = m.scheduleAutoSettingsPopupHtml(list, [], "off");
  const workHtml = m.scheduleAutoSettingsPopupHtml(list, [], "work");
  assert.ok(offHtml.includes("선호 오프 설정") && offHtml.includes('data-auto-set-tab="off" role="tab" aria-selected="true"'));
  assert.ok(workHtml.includes("선호 출근 설정") && workHtml.includes('data-auto-set-tab="work" role="tab" aria-selected="true"'));
  assert.equal(count(offHtml, /data-auto-pref-kind="off"/g), 14);
  assert.equal(count(offHtml, /data-auto-pref-kind="work"/g), 0);
  assert.equal(count(workHtml, /data-auto-pref-kind="work"/g), 14);
  assert.equal(count(workHtml, /data-auto-pref-kind="off"/g), 0);
  assert.ok(offHtml.includes('data-auto-pref-kind="off" aria-pressed="true"'));
  assert.ok(workHtml.includes('data-auto-pref-kind="work" aria-pressed="true"'));
  for (const html of [offHtml, workHtml]) {
    const header = html.match(/<thead><tr><th[^>]*>인원<\/th>([\s\S]*?)<\/tr><\/thead>/)[1];
    assert.deepEqual([...header.matchAll(/<th[^>]*>([일월화수목금토])<\/th>/g)].map((m) => m[1]), ["월", "화", "수", "목", "금", "토", "일"]);
    assert.ok(!html.includes("<b>홍</b>"));
    assert.ok(html.includes("&lt;b&gt;홍&lt;/b&gt;"));
  }
  assert.ok(offHtml.includes('data-auto-set-reset="off"') && offHtml.includes("선호 오프 초기화"));
  assert.ok(workHtml.includes('data-auto-set-reset="work"') && workHtml.includes("선호 출근 초기화"));
});

test("탭별 초기화: 그 탭 설정만 전체 인원 기준으로 비우고 다른 탭 설정은 그대로 둔다", () => {
  const { m, saved } = setup({
    staff: [staff("s1"), staff("s2")],
    autoOffPrefs: { s1: { dows: [1] }, s2: { dows: [2] } },
    autoWorkPrefs: { s1: { dows: [5] } },
  });
  m.scheduleAutoClearPrefKind("off");
  assert.deepEqual(toPlain(m.scheduleAutoGetPrefDows("s1")), []);
  assert.deepEqual(toPlain(m.scheduleAutoGetPrefDows("s2")), []);
  assert.deepEqual(toPlain(m.scheduleAutoGetWorkPrefDows("s1")), [5], "선호 출근 설정은 건드리지 않는다");
  assert.equal(saved().autoOffPrefs && Object.keys(saved().autoOffPrefs).length, 0);
});

test("인원별 설정 팝업: 주간·야간·관리자로 묶고 제외 중인 인원은 표시한다", () => {
  const { m } = setup({
    staff: [
      staff("d1", { name: "김주간" }),
      staff("n1", { name: "박야간", group: "night" }),
      staff("a1", { name: "최관리", isAdmin: true }),
    ],
  });
  const list = m.getStaffListForMonth(YEAR, MI);
  const html = m.scheduleAutoSettingsPopupHtml(list, ["n1"]);
  const iDay = html.indexOf("김주간"), iNight = html.indexOf("박야간"), iAdmin = html.indexOf("최관리");
  assert.ok(iDay > 0 && iDay < iNight && iNight < iAdmin, "주간 → 야간 → 관리자 순서");
  assert.ok(html.includes("sch-auto-set-group") && /주간 <span[^>]*>1명/.test(html) && html.includes("야간 <span") && html.includes("관리자 <span"));
  assert.equal(count(html, /이번 배치 제외 중/g), 1);
  assert.ok(/is-excluded[\s\S]*박야간[\s\S]*이번 배치 제외 중/.test(html));
  assert.equal(count(html, /data-auto-pref-staff="n1"/g), 7);
  assert.equal(m.scheduleAutoStaffGroups([]).length, 0);
  assert.ok(m.scheduleAutoSettingsPopupHtml([], []).includes("이번 달 인원이 없어요"));
});

/* ===================== 배치 조건: 제외할 인원 ===================== */

test("제외한 인원에게는 오프를 배정하지 않고, 계획에 제외 인원 정보가 담긴다", () => {
  const { m } = setup({ staff: [staff("s1"), staff("s2"), staff("s3", { name: "제외될이름", nickname: "제외닉" })] });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI, { excludeStaffIds: ["s3"] });
  assert.equal(planOf(plan, "s3"), undefined, "제외한 인원은 계획에 없다");
  assert.equal(planOf(plan, "s1").assigned.length, 8);
  assert.equal(planOf(plan, "s2").assigned.length, 8);
  assert.deepEqual(toPlain(plan.excluded), [{ id: "s3", name: "제외될이름", nickname: "제외닉" }]);
  assert.deepEqual(toPlain(plan.warnings), []);
});

test("제외 조건이 없거나 비어 있거나 없는 id면 기존 결과와 완전히 같다", () => {
  const { m } = setup({ staff: [staff("s1"), staff("s2")], autoOffPrefs: { s1: { dows: [2] } } });
  const base = toPlain(m.scheduleAutoBuildPlan(YEAR, MI));
  assert.deepEqual(base.excluded, []);
  assert.deepEqual(toPlain(m.scheduleAutoBuildPlan(YEAR, MI, {})), base);
  assert.deepEqual(toPlain(m.scheduleAutoBuildPlan(YEAR, MI, { excludeStaffIds: [] })), base);
  assert.deepEqual(toPlain(m.scheduleAutoBuildPlan(YEAR, MI, { excludeStaffIds: ["nobody"] })), base, "없는 id는 무시");
});

test("제외한 인원은 출근 인원수·필요인력 계산에서도 빠진다(나머지 인원만으로 필요인력을 맞춘다)", () => {
  const fridays = [4, 11, 18, 25];
  const requiredHeadcount = {};
  fridays.forEach((d) => { requiredHeadcount[`2026-09|DAY|채팅|${d}`] = 2; }); // 금요일마다 2명 필요
  const build = (opts) => setup({
    staff: [staff("s1"), staff("s2"), staff("s3")],
    requiredHeadcount,
    autoOffPrefs: { s1: { dows: [5] } }, // s1은 금요일 선호
  }).m.scheduleAutoBuildPlan(YEAR, MI, opts);

  // 셋 다 재직: s1이 금요일에 쉬면 2명이 남아 필요인력(2명)과 대비 0(부족 없음) → 선호대로 금요일 4번이 모두 오프가 된다
  const all = planOf(build(), "s1");
  assert.equal(all.prefHits, 4);
  assert.ok(fridays.every((d) => all.assigned.includes(d)));

  // s3 제외: 재직 2명 → s1이 금요일에 쉬면 1명만 남아 대비 -1이지만,
  // 이제 1순위가 0~-1 범위이므로 금요일도 선호대로 선택할 수 있다.
  const plan = build({ excludeStaffIds: ["s3"] });
  const p1 = planOf(plan, "s1");
  assert.equal(p1.prefHits, 4);
  assert.ok(fridays.every((d) => p1.assigned.includes(d)));
  assert.equal(planOf(plan, "s3"), undefined);
  assert.deepEqual(toPlain(plan.warnings), []);
});

test("제외한 인원의 기존 기록은 그대로이고(계획이 건드리지 않음), 저장·기록도 바뀌지 않는다", () => {
  const { m, store } = setup({
    staff: [staff("s1"), staff("s2")],
    records: { [`s2|${sep(2)}`]: OFF },
  });
  const before = store.getItem("sched");
  const snapshot = JSON.stringify(m.scheduleData);
  const plan = m.scheduleAutoBuildPlan(YEAR, MI, { excludeStaffIds: ["s2"] });
  assert.equal(planOf(plan, "s2"), undefined);
  assert.equal(JSON.stringify(m.scheduleData), snapshot);
  assert.equal(store.getItem("sched"), before);
});

test("제외 조건 상태: 추가·해제·초기화, 중복 없이 넣은 순서를 유지한다", () => {
  const { m } = setup();
  assert.deepEqual(toPlain(m.scheduleAutoGetExcluded()), []);
  m.scheduleAutoSetExcluded("s2", true);
  m.scheduleAutoSetExcluded("s1", true);
  m.scheduleAutoSetExcluded("s2", true); // 중복
  assert.deepEqual(toPlain(m.scheduleAutoGetExcluded()), ["s2", "s1"]);
  m.scheduleAutoSetExcluded("s2", false);
  m.scheduleAutoSetExcluded("nobody", false); // 없는 id 해제는 무해
  assert.deepEqual(toPlain(m.scheduleAutoGetExcluded()), ["s1"]);
  m.scheduleAutoGetExcluded().push("hack"); // 복사본을 돌려주므로 원본은 안 바뀐다
  assert.deepEqual(toPlain(m.scheduleAutoGetExcluded()), ["s1"]);
  m.scheduleAutoResetExcluded();
  assert.deepEqual(toPlain(m.scheduleAutoGetExcluded()), []);
});

test("제외 조건은 저장되지 않는다(scheduleData·저장소에 남지 않음)", () => {
  const { m, saved } = setup();
  m.scheduleAutoSetExcluded("s1", true);
  m.scheduleAutoBuildPlan(YEAR, MI, { excludeStaffIds: m.scheduleAutoGetExcluded() });
  assert.ok(!JSON.stringify(saved()).includes("exclude"));
  assert.equal(Object.prototype.hasOwnProperty.call(m.scheduleData, "autoExcluded"), false);
});


test("미리보기 생성 후 제외 인원을 추가하면 기존 계획이 제외 조건으로 다시 계산된다", () => {
  const { m } = setup({
    staff: [
      staff("s1", { name: "김주간" }),
      staff("s2", { name: "이주간" }),
      staff("s3", { name: "박주간" }),
      staff("s4", { name: "최주간" }),
    ],
  });
  const before = m.scheduleAutoBuildPlan(YEAR, MI);
  assert.ok(assignedTotal(before) > 0, "제외 전에는 배정 계획이 있어야 한다");

  // UI 이벤트에서 호출하는 것과 동일한 순서로 제외를 추가하고 미리보기를 다시 계산한다.
  m.scheduleAutoSetExcluded("s1", true);
  const after = m.scheduleAutoBuildPlan(YEAR, MI, { excludeStaffIds: m.scheduleAutoGetExcluded() });

  assert.ok(after.excluded.some((x) => x.id === "s1"));
  assert.equal(planOf(after, "s1"), undefined, "제외된 인원은 새 계획에 포함되면 안 된다");
});

test("제외 영역 HTML: 아직 제외하지 않은 인원만 선택지에 나오고, 제외된 인원은 해제(✕) 칩으로 나온다", () => {
  const { m } = setup({ staff: [staff("s1", { name: "김주간" }), staff("s2", { name: "<i>이</i>", nickname: "닉" }), staff("s3", { name: "박야간", group: "night" })] });
  const list = m.getStaffListForMonth(YEAR, MI);
  const none = m.scheduleAutoExcludeAreaHtml(list, []);
  assert.ok(none.includes("data-auto-exclude-select") && none.includes("인원 선택…"));
  assert.equal(count(none, /<option value="s/g), 3);
  assert.ok(none.includes('<optgroup label="주간">') && none.includes('<optgroup label="야간">'));
  assert.ok(!none.includes("data-auto-exclude-remove"));

  const one = m.scheduleAutoExcludeAreaHtml(list, ["s2"]);
  assert.equal(count(one, /<option value="s/g), 2, "제외된 인원은 선택지에서 빠진다");
  assert.ok(!one.includes('<option value="s2"'));
  assert.ok(one.includes('data-auto-exclude-remove="s2"'));
  assert.ok(!one.includes("<i>이</i>") && one.includes("&lt;i&gt;이&lt;/i&gt;"), "이름은 이스케이프");

  const all = m.scheduleAutoExcludeAreaHtml(list, ["s1", "s2", "s3"]);
  assert.ok(!all.includes("<select") && all.includes("제외할 수 있는 인원이 없어요"));
  assert.equal(count(all, /data-auto-exclude-remove=/g), 3);
});

test("배치 조건 영역: 인원별 설정 버튼을 누르면 팝업이 바로 뜬다(드롭다운 없음)", () => {
  const { m } = setup({ staff: [staff("s1"), staff("s2")], autoOffPrefs: { s1: { dows: [1] } } });
  const html = m.scheduleAutoConditionsHtml(m.getStaffListForMonth(YEAR, MI));
  assert.ok(html.includes("배치 조건") && html.includes("제외할 인원"));
  assert.ok(html.includes('id="sch-auto-settings-btn"') && html.includes("인원별 설정"));
  assert.ok(!html.includes("sch-auto-settings-menu"), "드롭다운 메뉴는 더 이상 없어야 한다");
  assert.ok(!html.includes("<details"));
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

test("제외한 인원은 미리보기 표(집계 포함)에서 빠지고 안내가 나오며, 그린 뒤에는 실제 표에 다시 보인다", () => {
  const { m } = setup({ staff: [staff("s1", { name: "김주간" }), staff("s2", { name: "이채팅" })] });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI, { excludeStaffIds: ["s2"] });
  const html = m.scheduleAutoPreviewHtml(plan);
  assert.ok(html.includes('data-staff-id="s1"'));
  assert.ok(!html.includes('data-staff-id="s2"'), "제외한 인원의 행은 표에서 빠진다");
  assert.ok(html.includes("제외한 인원:") && html.includes("<b>이채팅</b>"));
  assert.ok(html.includes("총 <b>8칸</b>"), "제외한 인원의 칸은 세지 않는다");
  // 미리보기를 그리는 동안만 빼는 것이라, 이후 실제 월별 스케줄 표에는 그 인원이 그대로 있다
  const real = m.buildScheduleTableHtml();
  assert.ok(real.includes('data-staff-id="s2"') && real.includes('data-staff-id="s1"'));
  // 제외가 없으면 안내 문구도 없다
  assert.ok(!m.scheduleAutoPreviewHtml(m.scheduleAutoBuildPlan(YEAR, MI)).includes("제외한 인원:"));
});

test("표를 그리다 예외가 나도 제외 인원 필터가 남지 않아 실제 표에 그 인원이 그대로 보인다", () => {
  const { m } = setup({ staff: [staff("s1", { name: "김주간" }), staff("s2", { name: "이채팅" })] });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI, { excludeStaffIds: ["s2"] });
  const original = m.buildScheduleTableHtml;
  m.buildScheduleTableHtml = () => { throw new Error("boom"); };
  assert.throws(() => m.scheduleAutoPreviewHtml(plan), /boom/);
  m.buildScheduleTableHtml = original;
  assert.ok(m.buildScheduleTableHtml().includes('data-staff-id="s2"'));
});

test("배정할 칸이 없으면 안내 문구와 함께 현재 표를 그대로 보여준다", () => {
  const records = {};
  const memos = {};
  for (let d = 1; d <= 8; d++) { records[`s1|${sep(d)}`] = OFF; memos[`s1|${sep(d)}`] = "필휴"; } // 이미 목표 8개를 채운 필휴 8개
  const { m } = setup({ staff: [staff("s1")], records, memos });
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

test("scheduleAutoSolveDays: 6일 연속 근무까지만 허용하고 7일째는 오프로 끊을 수 있으면 끊는다", () => {
  const { m } = setup();
  const scores = {};
  for (let d = 1; d <= 7; d++) scores[d] = [0, 0, -d];
  const res = toPlain(m.scheduleAutoSolveDays({
    daysInMonth: 7,
    carry: 0,
    offCarry: 0,
    offLimit: 10,
    limit: 5,
    maxWorkStreak: 6,
    needed: 1,
    isRest: () => false,
    isFree: (d) => d === 7,
    isProtectedRest: () => false,
    dayScore: (d) => scores[d],
  }));
  assert.deepEqual(res.picked, [7]);
  assert.equal(res.violations, 1, "1~6일은 근무, 7일은 오프로 끊어 6일 연속까지만 허용");
});

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

    const res = toPlain(m.scheduleAutoSolveDays({ daysInMonth: days, carry, offCarry: 0, offLimit: days + 1, limit, needed, isRest, isFree, isProtectedRest: () => false, dayScore }));
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

/* ===================== 대전제: 구분별 하루 출근 인원 최소 3명 ===================== */
// 주간 유선/주간 채팅/야간 유선/야간 채팅 각 구분에서 어느 날이든 출근 인원이 3명 밑으로 떨어지면 안 된다.
// 아래 테스트는 대전제를 끄지 않은 기본값(setup(..., { premise: true }))으로 검증하고, 출근 인원은 소스의 함수를 쓰지 않고
// 여기서 따로 센다(월별 스케줄 표의 투입 인원과 같은 기준: 기록 없음=근무, 근무 상태이면서 결근이 아닌 것만 출근).
const countsAsWorked = (rec) => !rec || (rec.status === "WORK" && rec.attendance !== "ABSENT");
function headcount(records, staffList, isNight, type, d) {
  return staffList.filter((s) => !s.isAdmin
    && (isNight ? s.group === "night" : s.group !== "night")
    && (s.types || []).includes(type)
    && countsAsWorked(records[`${s.id}|${sep(d)}`])).length;
}
function minHeadcount(records, staffList, isNight, type) {
  let min = Infinity;
  for (let d = 1; d <= 30; d++) min = Math.min(min, headcount(records, staffList, isNight, type, d));
  return min;
}
const mkStaff = (prefix, n, extra) => Array.from({ length: n }, (_, i) => staff(`${prefix}${i + 1}`, extra));
const ANNUAL = { status: "ANNUAL", attendance: null };
const premise = (overrides) => setup(overrides, { premise: true });
// 목표가 남아 있으면 배정이 0칸이어도 perStaffPlan에는 항목이 남으므로, "배정 없음"은 assigned 개수로 확인한다.
const assignedOf = (plan, id) => { const p = planOf(plan, id); return p ? p.assigned.length : 0; };
const assignedTotal = (plan) => plan.perStaffPlan.reduce((sum, p) => sum + p.assigned.length, 0);

test("대전제: 주간 채팅 6명 전원에게 목표(8개)를 채워도 모든 날 출근 인원이 3명 이상이다", () => {
  const list = mkStaff("a", 6);
  const { m } = premise({ staff: list });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const recs = withPlan(m.scheduleData.records, plan);
  assert.ok(minHeadcount(recs, list, false, "채팅") >= 3, "어느 날도 3명 밑으로 떨어지면 안 됨");
  list.forEach((s) => assert.equal(planOf(plan, s.id).assigned.length, 8, `${s.id}: 목표 개수는 그대로 채운다`));
  assert.deepEqual(toPlain(plan.warnings), []);
});

test("대전제: 재직 4명이면 하루에 한 명만 쉴 수 있다(둘이 쉬면 2명이라 3명 미만)", () => {
  const list = mkStaff("b", 4);
  const { m } = premise({ staff: list });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const recs = withPlan(m.scheduleData.records, plan);
  assert.ok(minHeadcount(recs, list, false, "채팅") >= 3);
  for (let d = 1; d <= 30; d++) assert.ok(headcount(recs, list, false, "채팅", d) >= 3, `9/${d}`);
});

test("대전제: 주간 채팅·주간 유선·야간 채팅·야간 유선 네 구분을 각각 따로 지킨다", () => {
  const list = [
    ...mkStaff("dc", 5, { types: ["채팅"], group: "day" }),
    ...mkStaff("dw", 5, { types: ["유선"], group: "day" }),
    ...mkStaff("nc", 5, { types: ["채팅"], group: "night" }),
    ...mkStaff("nw", 5, { types: ["유선"], group: "night" }),
  ];
  const { m } = premise({ staff: list });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const recs = withPlan(m.scheduleData.records, plan);
  [[false, "채팅"], [false, "유선"], [true, "채팅"], [true, "유선"]].forEach(([night, type]) => {
    assert.ok(minHeadcount(recs, list, night, type) >= 3, `${night ? "야간" : "주간"} ${type}`);
  });
});

test("대전제: 채팅·유선을 함께 하는 인원은 두 구분 모두에서 출근 인원으로 센다", () => {
  // 채팅 전용 2명 + 채팅·유선 겸업 2명 → 채팅 4명, 유선 2명(겸업 둘뿐이라 유선은 3명 미만으로 지킬 수 없는 구분이라 적용 안 함).
  // 유선을 3명으로 늘려(겸업 2 + 유선 전용 1) 두 구분 모두 지킬 수 있는 경우를 검증한다.
  const list = [
    ...mkStaff("c", 2, { types: ["채팅"] }),
    ...mkStaff("both", 3, { types: ["채팅", "유선"] }),
    ...mkStaff("w", 2, { types: ["유선"] }),
  ]; // 채팅 5명(c2+both3), 유선 5명(both3+w2)
  const { m } = premise({ staff: list });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const recs = withPlan(m.scheduleData.records, plan);
  assert.ok(minHeadcount(recs, list, false, "채팅") >= 3, "채팅");
  assert.ok(minHeadcount(recs, list, false, "유선") >= 3, "유선");
});

test("대전제: 이미 3명만 출근하는 날(연차 등 입력됨)에는 나머지 인원에게 새 오프를 넣지 않는다", () => {
  const list = mkStaff("e", 5);
  // 9/8(화): e1·e2가 연차 → 출근 3명. 나머지 e3~e5 중 누구도 9/8에 쉬면 2명이 된다.
  const records = { [`e1|${sep(8)}`]: ANNUAL, [`e2|${sep(8)}`]: ANNUAL };
  const { m } = premise({ staff: list, records });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  ["e3", "e4", "e5"].forEach((id) => assert.ok(!planOf(plan, id).assigned.includes(8), `${id}는 9/8에 오프 불가`));
  const recs = withPlan(m.scheduleData.records, plan);
  assert.equal(headcount(recs, list, false, "채팅", 8), 3);
  assert.ok(minHeadcount(recs, list, false, "채팅") >= 3);
  assert.deepEqual(toPlain(plan.warnings).filter((w) => w.includes("미만인 날")), [], "3명은 충족이므로 경고 없음");
});

test("대전제: 이미 입력된 값 때문에 원래부터 3명 미만인 날은 새 오프를 넣지 않고 경고로 알린다", () => {
  const list = mkStaff("f", 5);
  // 9/8: f1·f2·f3 연차 → 출근 2명. 이건 이번 배치와 상관없는 기존 입력이라 고칠 수 없다.
  const records = {};
  ["f1", "f2", "f3"].forEach((id) => { records[`${id}|${sep(8)}`] = ANNUAL; });
  const { m } = premise({ staff: list, records });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  ["f4", "f5"].forEach((id) => assert.ok(!planOf(plan, id).assigned.includes(8), `${id}: 9/8에는 오프 불가`));
  const warn = toPlain(plan.warnings).filter((w) => w.includes("미만인 날"));
  assert.equal(warn.length, 1);
  assert.ok(warn[0].includes("주간 채팅") && warn[0].includes("9/8(2명)"), warn[0]);
  // 다른 날은 여전히 3명 이상
  const recs = withPlan(m.scheduleData.records, plan);
  for (let d = 1; d <= 30; d++) if (d !== 8) assert.ok(headcount(recs, list, false, "채팅", d) >= 3, `9/${d}`);
});

test("대전제: 결근(ABSENT)·반차·교육은 출근 인원으로 세지 않는다(월별 스케줄 표의 투입 인원과 같은 기준)", () => {
  const list = mkStaff("g", 5);
  // 9/9: g1 결근, g2 반차, g3 교육 → 투입 인원 2명(g4·g5)
  const records = {
    [`g1|${sep(9)}`]: { status: "WORK", attendance: "ABSENT" },
    [`g2|${sep(9)}`]: { status: "HALF", attendance: null },
    [`g3|${sep(9)}`]: { status: "EDUCATION", attendance: null },
  };
  const { m } = premise({ staff: list, records });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  ["g4", "g5"].forEach((id) => assert.ok(!planOf(plan, id).assigned.includes(9), `${id}: 9/9에는 오프 불가`));
  assert.ok(toPlain(plan.warnings).some((w) => w.includes("9/9(2명)")));
});

test("대전제: 재직 인원이 3명 미만인 구분은 지킬 수 없어서 적용하지 않고 경고로 알린다", () => {
  const list = mkStaff("h", 2);
  const { m } = premise({ staff: list });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  list.forEach((s) => assert.equal(planOf(plan, s.id).assigned.length, 8, `${s.id}: 그래도 목표 개수는 배정한다`));
  const warn = toPlain(plan.warnings).filter((w) => w.includes("재직 인원이 2명뿐"));
  assert.equal(warn.length, 1);
  assert.ok(warn[0].includes("주간 채팅"));
});

test("대전제: 재직 인원이 딱 3명이면 누가 쉬어도 2명이 되므로 오프를 넣지 않고, 목표를 못 채운 이유를 알려준다", () => {
  const list = mkStaff("i", 3);
  const { m } = premise({ staff: list });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  list.forEach((s) => assert.equal(assignedOf(plan, s.id), 0, `${s.id}: 배정 없음`));
  const short = toPlain(plan.warnings).filter((w) => w.includes("목표 8개 중 0개만"));
  assert.equal(short.length, 3);
  assert.ok(short.every((w) => w.includes("출근 3명 이상을 지키느라 오프를 넣을 수 없는 날이 30일")), short[0]);
});

test("대전제: 대전제가 연속 근무 5일 제한보다 우선한다(못 지키는 연속 근무는 경고로 남는다)", () => {
  // j1은 지난달 말 5일 연속 근무 → 원래는 9/1이 오프여야 한다. 그런데 j2가 9/1에 이미 오프라 9/1 출근은 3명(j1·j3·j4)뿐이다.
  const list = mkStaff("j", 4);
  const records = { [`j1|${aug(26)}`]: OFF, [`j2|${sep(1)}`]: OFF };
  const { m } = premise({ staff: list, records });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  assert.equal(m.scheduleAutoCarryStreak("j1", YEAR, MI), 5);
  assert.ok(!planOf(plan, "j1").assigned.includes(1), "9/1에 j1이 쉬면 출근 2명이라 배정 불가");
  assert.ok(toPlain(plan.warnings).some((w) => w.includes("이름-j1") && w.includes("지난달 말부터 이어져")));
  const recs = withPlan(m.scheduleData.records, plan);
  assert.ok(minHeadcount(recs, list, false, "채팅") >= 3);
});

test("대전제: 이번 배치에서 제외한 인원은 재직 인원에서 빠진 것으로 세어 나머지로 3명을 지킨다", () => {
  const list = mkStaff("k", 6);
  const { m } = premise({ staff: list });
  // 6명 중 2명 제외 → 재직 4명: 하루 한 명만 쉴 수 있다
  const plan4 = m.scheduleAutoBuildPlan(YEAR, MI, { excludeStaffIds: ["k5", "k6"] });
  const included = list.slice(0, 4);
  const recs4 = withPlan(m.scheduleData.records, plan4);
  for (let d = 1; d <= 30; d++) assert.ok(headcount(recs4, included, false, "채팅", d) >= 3, `9/${d}`);
  // 6명 중 3명 제외 → 재직 3명: 누구도 쉴 수 없다
  const plan3 = m.scheduleAutoBuildPlan(YEAR, MI, { excludeStaffIds: ["k4", "k5", "k6"] });
  assert.equal(assignedTotal(plan3), 0);
  assert.ok(assignedTotal(plan4) > 0, "재직 4명이면 배정은 된다");
});

test("대전제: 관리자는 구분별 출근 인원에 들어가지 않고 이 조건에도 걸리지 않는다", () => {
  const list = [...mkStaff("m", 3), staff("boss", { isAdmin: true, types: ["채팅"] })];
  const { m } = premise({ staff: list });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  assert.equal(planOf(plan, "boss"), undefined, "관리자는 자동 배치 대상에서 완전히 제외");
  list.slice(0, 3).forEach((s) => assert.equal(assignedOf(plan, s.id), 0, "관리자를 빼면 채팅은 딱 3명이라 배정 불가"));
});

test("대전제: 여러 구분·무작위 연차/교육/결근·필요인력 조합 150개에서 계획이 3명 미만인 날을 새로 만들지 않는다", () => {
  const rnd = mulberry32(20260922);
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  for (let iter = 0; iter < 150; iter++) {
    const list = [];
    [["day", "채팅"], ["day", "유선"], ["night", "채팅"], ["night", "유선"]].forEach(([group, type], gi) => {
      const n = 2 + Math.floor(rnd() * 9); // 구분별 2~10명(3명 미만인 구분도 섞는다)
      mkStaff(`g${gi}x`, n, { group, types: [type] }).forEach((s) => list.push(s));
    });
    const records = {};
    const kinds = [ANNUAL, OFF, { status: "EDUCATION", attendance: null }, { status: "HALF", attendance: null }, { status: "WORK", attendance: "ABSENT" }];
    list.forEach((s) => { for (let d = 1; d <= 30; d++) if (rnd() < 0.08) records[`${s.id}|${sep(d)}`] = pick(kinds); });
    const requiredHeadcount = {};
    ["DAY", "NIGHT"].forEach((g) => ["채팅", "유선"].forEach((t) => { for (let d = 1; d <= 30; d++) if (rnd() < 0.5) requiredHeadcount[`2026-09|${g}|${t}|${d}`] = 2 + Math.floor(rnd() * 6); }));
    const { m } = premise({ staff: list, records, requiredHeadcount });
    const before = JSON.stringify(m.scheduleData.records);
    const plan = m.scheduleAutoBuildPlan(YEAR, MI);
    assert.equal(JSON.stringify(m.scheduleData.records), before, `iter ${iter}: 계획 단계에서는 데이터를 바꾸지 않는다`);
    const recs = withPlan(m.scheduleData.records, plan);
    // 새로 넣은 칸은 전부 원래 비어 있던 칸
    plan.perStaffPlan.forEach((p) => p.assigned.forEach((d) => assert.ok(!(`${p.staffId}|${sep(d)}` in records), `iter ${iter}: ${p.staffId} 9/${d} 덮어씀`)));
    [[false, "채팅"], [false, "유선"], [true, "채팅"], [true, "유선"]].forEach(([night, type]) => {
      const total = list.filter((s) => (night ? s.group === "night" : s.group !== "night") && s.types.includes(type)).length;
      if (total < 3) return; // 지킬 수 없는 구분은 적용 대상이 아님
      for (let d = 1; d <= 30; d++) {
        const now = headcount(recs, list, night, type, d), was = headcount(records, list, night, type, d);
        assert.ok(now >= Math.min(3, was), `iter ${iter}: ${night ? "야간" : "주간"} ${type} 9/${d} 출근 ${was}명 → ${now}명(3명 미만으로 내려감)`);
      }
    });
  }
});

test("대전제: options.minWorking를 0으로 주면 예전처럼 제한 없이 배정된다(기본값은 3)", () => {
  const list = mkStaff("z", 3);
  const { m } = premise({ staff: list });
  assert.equal(assignedTotal(m.scheduleAutoBuildPlan(YEAR, MI)), 0, "기본값 3");
  assert.equal(assignedTotal(m.scheduleAutoBuildPlan(YEAR, MI, { minWorking: 0 })), 24, "0이면 끔: 3명 × 목표 8개");
  const two = m.scheduleAutoBuildPlan(YEAR, MI, { minWorking: 2 });
  assert.ok(assignedTotal(two) > 0, "2명 유지면 3명 중 한 명씩 쉴 수 있음");
  for (let d = 1; d <= 30; d++) assert.ok(headcount(withPlan(m.scheduleData.records, two), list, false, "채팅", d) >= 2, `9/${d}`);
});

/* ===================== 목표 차감: 특휴는 미차감 / 필요인력 허용범위: 부족(-) 기준 — 그 외 요일 -1(최후 -2) ===================== */

test("목표 차감: 대휴·공휴는 항상 차감, 특휴·연차·공가·육휴는 차감하지 않는다", () => {
  const { m } = setup({});
  const rec = (status) => ({ status, attendance: null });
  assert.equal(m.scheduleAutoCountsTowardTarget("s1", sep(2), rec("DAEHYU")), true);
  assert.equal(m.scheduleAutoCountsTowardTarget("s1", sep(2), rec("GONGHYU")), true);
  ["SPECIAL", "ANNUAL", "GONGGA", "MATERNITY"].forEach((st) => {
    assert.equal(m.scheduleAutoCountsTowardTarget("s1", sep(2), rec(st)), false, `${st}는 미차감`);
  });
  assert.equal(m.scheduleAutoCountsTowardTarget("s1", sep(2), rec("OFF")), false, "필휴 메모 없는 오프는 미차감");
});

test("특휴가 입력돼 있어도 목표 오프 개수는 줄지 않는다(대휴는 줄어든다)", () => {
  const { m } = setup({
    staff: [staff("sp"), staff("dh")],
    records: {
      [`sp|${sep(2)}`]: { status: "SPECIAL", attendance: null }, [`sp|${sep(3)}`]: { status: "SPECIAL", attendance: null },
      [`dh|${sep(2)}`]: { status: "DAEHYU", attendance: null }, [`dh|${sep(3)}`]: { status: "DAEHYU", attendance: null },
    },
  });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  assert.equal(planOf(plan, "sp").assigned.length, 8, "특휴 2개가 있어도 목표 8개를 그대로 채운다");
  assert.equal(planOf(plan, "dh").assigned.length, 6, "대휴 2개는 목표에서 차감");
});

test("필요인력 허용범위: 금·토·월은 0만 허용 / 그 외 요일은 -1(최후 -2) / 평일 공휴일은 -2까지", () => {
  const { m } = setup({});
  const tol = (dow) => toPlain(m.scheduleAutoToleranceInfo(dow, "2026-09-01")); // getHoliday는 항상 null
  [5, 6, 1].forEach((d) => assert.deepEqual(tol(d), { ideal: 0, max: 0 }, `dow ${d}`));
  [0, 2, 3, 4].forEach((d) => assert.deepEqual(tol(d), { ideal: 1, max: 2 }, `dow ${d}`));
  m.getHoliday = () => ({ name: "공휴일" });
  [5, 1].forEach((d) => assert.deepEqual(toPlain(m.scheduleAutoToleranceInfo(d, "2026-09-01")), { ideal: 2, max: 2 }, `평일 공휴일 dow ${d}`));
  assert.deepEqual(toPlain(m.scheduleAutoToleranceInfo(6, "2026-09-05")), { ideal: 0, max: 0 }, "토요일은 일반일 0만 허용");
  assert.deepEqual(toPlain(m.scheduleAutoToleranceInfo(0, "2026-09-06")), { ideal: 1, max: 2 });
});

test("수요일은 0~-1 범위를 먼저 지키고, 다른 날이 남아 있으면 -2로 넓히지 않는다", () => {
  // 수요일(2·9·16·23·30)마다 2명 필요 / 재직 4명. 3명이 쉬면 남는 1명(대비 -1)까지가 1순위, 4명이 다 쉬면 0명(대비 -2)이라 최후의 수단.
  const requiredHeadcount = {};
  [2, 9, 16, 23, 30].forEach((d) => { requiredHeadcount[`2026-09|DAY|채팅|${d}`] = 2; });
  const ids = ["w1", "w2", "w3", "w4"];
  const { m } = setup({
    staff: ids.map((id) => staff(id)),
    requiredHeadcount,
    autoOffPrefs: Object.fromEntries(ids.map((id) => [id, { dows: [3] }])), // 모두 수요일 선호
  });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  [2, 9, 16, 23, 30].forEach((d) => {
    const off = ids.filter((id) => planOf(plan, id).assigned.includes(d)).length;
    assert.ok(off <= 3, `9/${d}: ${off}명이 쉬면 -2(최후의 수단)까지 가는데, 다른 날이 남아 있어 -1 안에서 끝내야 함`);
  });
  // 이 테스트는 "필요인력 허용범위"만 검증한다. 4명이 모두 수요일을 선호하는 값으로 골라 만든 픽스처라
  // 연속 근무 5일 제한과 부딪혀 일부 인원은 6일 연속 근무가 남을 수 있는데, 그건 이 테스트의 관심사가 아니다.
  assert.deepEqual(toPlain(plan.warnings).filter((w) => w.includes("허용범위")), []);
});

test("대비가 +(인원이 남는 날)는 항상 허용하고, 부족(-)만 제한한다", () => {
  // 금요일마다 1명 필요 / 재직 3명: s1이 쉬어도 2명이 남아 대비 +1 → 허용이라 선호대로 금요일 4번이 모두 오프가 된다
  const fridays = [4, 11, 18, 25];
  const requiredHeadcount = {};
  fridays.forEach((d) => { requiredHeadcount[`2026-09|DAY|채팅|${d}`] = 1; });
  const { m } = setup({
    staff: [staff("s1"), staff("s2"), staff("s3")],
    requiredHeadcount,
    autoOffPrefs: { s1: { dows: [5] } },
  });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const p1 = planOf(plan, "s1");
  assert.equal(p1.prefHits, 4);
  assert.ok(fridays.every((d) => p1.assigned.includes(d)));
  assert.deepEqual(toPlain(plan.warnings), []);
});

test("각 구분별 모든 인원 출근일을 우선 해소하고, 필요하면 그 날짜만 부족 -1까지 허용한다", () => {
  const six = Array.from({ length: 6 }, (_, i) => staff(`aw${i + 1}`));
  const { m } = setup({ staff: six, requiredHeadcount: {} }, { premise: true });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const assigned = withPlan({}, plan);
  for (let d = 1; d <= 30; d++) {
    const key = sep(d);
    const working = six.filter((s) => !assigned[`${s.id}|${key}`]).length;
    assert.ok(working < 6, `9/${d}에 6명 전원 출근하면 안 됨`);
  }
});

test("모두 출근하는 날을 없애기 위해 필요한 경우에만 -1 부족을 허용한다", () => {
  const six = Array.from({ length: 6 }, (_, i) => staff(`fb${i + 1}`));
  const requiredHeadcount = { "2026-09|DAY|채팅|7": 6 };
  const { m } = setup({ staff: six, requiredHeadcount }, { premise: true });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const assigned = withPlan({}, plan);
  const offOn7 = six.filter((s) => !!assigned[`${s.id}|2026-09-07`]).length;
  assert.ok(offOn7 >= 1, "9/7(월) 전원 출근을 피하기 위해 최소 1명은 쉬어야 함");
  assert.ok(offOn7 <= 1, "9/7에는 불필요하게 여러 명을 쉬게 하지 않아야 함");
  assert.ok(!plan.warnings.some((w) => w.includes("9/7") && w.includes("필요인력 허용범위를 벗어나")), "전원 출근 해소를 위한 -1 허용은 범위 이탈 경고 대상이 아님");
});

/* ===================== 선호 요일 최대화 + Groq 개선 제안(검증을 통과한 이동만 반영) ===================== */
// 규칙:
//  - 오프를 옮길 수 있는 건 "이번 계획이 새로 배정한 오프"뿐이고, 옮겨 갈 곳은 "기록이 없는 빈 칸"뿐이다(필휴·연차 불가침).
//  - 옮긴 뒤 필요인력 부족이 허용 최대치(-2 등)를 넘으면(-3 등) 그 이동은 버린다.
//  - 선호 점수가 나빠지는 이동은 절대 반영하지 않는다.

const reqAllDays = (n) => { const o = {}; for (let d = 1; d <= 30; d++) o[`2026-09|DAY|채팅|${d}`] = n; return o; };
// 검산기: 계획에서 직접 센 선호 점수 = 선호 오프 요일에 잡힌 오프 수 - 선호 출근 요일에 잡힌 오프 수
function prefNetOf(plan, offPrefs, workPrefs) {
  let net = 0;
  plan.perStaffPlan.forEach((p) => {
    const off = new Set(((offPrefs || {})[p.staffId] || {}).dows || []);
    const work = new Set(((workPrefs || {})[p.staffId] || {}).dows || []);
    p.assigned.forEach((d) => { const w = dowOf(d); if (off.has(w)) net++; if (work.has(w)) net--; });
  });
  return net;
}
const prefFixture = () => ({
  staff: ["s1", "s2", "s3", "s4", "s5"].map((id) => staff(id)),
  requiredHeadcount: reqAllDays(3),
  autoOffPrefs: { s1: { dows: [3] }, s2: { dows: [3] }, s3: { dows: [3] }, s4: { dows: [4] }, s5: { dows: [4] } },
});

test("선호 최대화: 규칙 기반 이동으로 선호 오프가 더 맞고, 인원별 오프 개수는 그대로다", () => {
  const fx = prefFixture();
  const { m } = setup(fx);
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  // 이동 없이 한 사람씩 독립적으로 고르면 17까지만 나오던 시나리오(이동 단계 도입 전 결과)
  assert.equal(prefNetOf(plan, fx.autoOffPrefs), 18);
  assert.ok(plan.improve.localMoves >= 1);
  plan.perStaffPlan.forEach((p) => assert.equal(p.assigned.length, 8, `${p.staffId}: 오프 개수는 목표(8)에서 바뀌면 안 됨`));
});

test("선호 집계(prefHits·workPrefHits)는 최종 배정 기준으로 다시 계산되어 화면·검증 지표와 맞는다", () => {
  const fx = prefFixture();
  fx.autoWorkPrefs = { s1: { dows: [6] }, s2: { dows: [0] } }; // s1·s2는 토/일 출근 선호(선호 오프와 겹치지 않음)
  const { m } = setup(fx);
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  plan.perStaffPlan.forEach((p) => {
    const off = new Set(((fx.autoOffPrefs || {})[p.staffId] || {}).dows || []);
    assert.equal(p.prefHits, p.assigned.filter((d) => off.has(dowOf(d))).length, `${p.staffId} prefHits`);
    if (p.workPrefDows) {
      const work = new Set(p.workPrefDows);
      assert.equal(p.workPrefHits, p.assigned.filter((d) => !work.has(dowOf(d))).length, `${p.staffId} workPrefHits`);
    }
  });
  assert.equal(m.scheduleAutoPlanMetrics(plan).prefNet, prefNetOf(plan, fx.autoOffPrefs, fx.autoWorkPrefs));
});

test("Groq 제안: 조건을 지키면서 목표 점수가 좋아지는 이동은 반영된다", () => {
  const fx = { staff: Array.from({ length: 6 }, (_, i) => staff(`g${i + 1}`)), requiredHeadcount: reqAllDays(1) };
  const { m } = setup(fx);
  const base = m.scheduleAutoBuildPlan(YEAR, MI);
  const g1 = planOf(base, "g1");
  assert.ok(g1.assigned.includes(3) && !g1.assigned.includes(4));
  const plan = m.scheduleAutoBuildPlan(YEAR, MI, { groqMoveGroups: [[{ staffId: "g1", from: 3, to: 4 }]] });
  assert.equal(plan.improve.groqAccepted, 1);
  const p1 = planOf(plan, "g1");
  assert.ok(!p1.assigned.includes(3) && p1.assigned.includes(4));
  assert.equal(p1.assigned.length, g1.assigned.length);
});

test("Groq 제안: 필휴·연차 칸으로 옮기거나 그 칸을 옮기려는 제안은 전부 버려지고, 기존 입력은 그대로다", () => {
  const records = { [`s1|${sep(10)}`]: OFF, [`s1|${sep(11)}`]: ANNUAL };
  const memos = { [`s1|${sep(10)}`]: "필휴" };
  const { m } = setup({ staff: ["s1", "s2", "s3"].map((id) => staff(id)), records, memos });
  const base = m.scheduleAutoBuildPlan(YEAR, MI);
  const from = planOf(base, "s1").assigned[0];
  const plan = m.scheduleAutoBuildPlan(YEAR, MI, { groqMoveGroups: [
    [{ staffId: "s1", from, to: 10 }],
    [{ staffId: "s1", from, to: 11 }],
    [{ staffId: "s1", from: 10, to: 12 }],
    [{ staffId: "s1", from: 11, to: 12 }],
    [{ staffId: "nobody", from: 1, to: 2 }],
  ] });
  assert.equal(plan.improve.groqAccepted, 0);
  assert.deepEqual(toPlain(plan.improve.groqRejected).map((r) => r.reason), [
    "이미 입력된 칸", "이미 입력된 칸", "이번 계획이 배정한 오프가 아님", "이번 계획이 배정한 오프가 아님", "배치 대상 인원이 아님",
  ]);
  assert.deepEqual(toPlain(planOf(plan, "s1").assigned), toPlain(planOf(base, "s1").assigned));
  assert.deepEqual(toPlain(m.scheduleData.records), toPlain(records));
});

test("Groq 제안: 필요인력 부족이 허용 최대치(-2)를 넘어 -3이 되는 이동은 버려진다", () => {
  // 9/9(수) 필요인력 5명인데 s4·s5가 연차 → 이미 출근 3명(부족 2 = 수요일 허용 최대). 여기에 오프를 더 넣으면 -3.
  const records = { [`s4|${sep(9)}`]: ANNUAL, [`s5|${sep(9)}`]: ANNUAL };
  const { m } = setup({ staff: ["s1", "s2", "s3", "s4", "s5"].map((id) => staff(id)), records, requiredHeadcount: { "2026-09|DAY|채팅|9": 5 } });
  const base = m.scheduleAutoBuildPlan(YEAR, MI);
  const s1Days = planOf(base, "s1").assigned;
  assert.ok(!s1Days.includes(9));
  s1Days.forEach((from) => {
    const plan = m.scheduleAutoBuildPlan(YEAR, MI, { groqMoveGroups: [[{ staffId: "s1", from, to: 9 }]] });
    assert.equal(plan.improve.groqAccepted, 0, `${from}→9 제안은 반영되면 안 됨`);
    assert.ok(!planOf(plan, "s1").assigned.includes(9));
  });
  const first = m.scheduleAutoBuildPlan(YEAR, MI, { groqMoveGroups: [[{ staffId: "s1", from: s1Days[0], to: 9 }]] });
  assert.equal(first.improve.groqRejected[0].reason, "필요인력 허용범위 초과");
});

test("Groq 제안: 이미 길어진 연속 근무를 더 늘리는 이동은 버려진다", () => {
  // 지난달 말 8일 연속 근무를 이어받은 s1: 9/1부터 오프가 급하다. 그 오프를 뒤로 미루는 제안은 구간을 늘리므로 반영되면 안 된다.
  const records = {}; records[`s1|${aug(22)}`] = OFF; records[`s2|${aug(22)}`] = OFF;
  const { m } = setup({ staff: ["s1", "s2", "s3", "s4"].map((id) => staff(id)), records });
  const base = m.scheduleAutoBuildPlan(YEAR, MI);
  const first = planOf(base, "s1").assigned[0];
  const later = [first + 3, first + 4, first + 5].find((d) => !planOf(base, "s1").assigned.includes(d));
  assert.ok(m.scheduleAutoCarryStreak("s1", YEAR, MI) > 6, "전제: 이미 6일을 넘겨 이어받은 연속 근무");
  const plan = m.scheduleAutoBuildPlan(YEAR, MI, { groqMoveGroups: [[{ staffId: "s1", from: first, to: later }]] });
  assert.equal(plan.improve.groqAccepted, 0);
  assert.equal(plan.improve.groqRejected[0].reason, "연속 근무·연속 오프 제한");
});

test("Groq 제안 파서: 코드펜스·잘못된 항목·5개 이상 이동 묶음은 걸러낸다", () => {
  const { m } = setup({ staff: [staff("s1"), staff("s2")] });
  const keyMap = new Map([["S1", "s1"], ["S2", "s2"]]);
  const ok = m.scheduleAutoParseImprovementGroups("```json\n{\"groups\":[[{\"staff\":\"S1\",\"from\":3,\"to\":4}],[{\"staff\":\"S9\",\"from\":1,\"to\":2}],[{\"staff\":\"S2\",\"from\":1,\"to\":\"x\"}]]}\n```", keyMap);
  assert.deepEqual(toPlain(ok), [[{ staffId: "s1", from: 3, to: 4 }]]);
  const five = Array.from({ length: 5 }, () => ({ staff: "S1", from: 1, to: 2 }));
  assert.deepEqual(toPlain(m.scheduleAutoParseImprovementGroups(JSON.stringify({ groups: [five] }), keyMap)), []);
  assert.equal(m.scheduleAutoParseImprovementGroups("이건 JSON이 아니에요", keyMap), null);
  assert.equal(m.scheduleAutoParseImprovementGroups("", keyMap), null);
});

// 하이브리드 전체 흐름(가짜 서버 함수). 선택 호출과 개선 호출을 구분해서 돌려준다.
async function runHybridWithStub(fx, improvementReply) {
  const { m } = setup(fx);
  const zero = {}; ["DAY", "NIGHT"].forEach((g) => ["채팅", "유선"].forEach((t) => { zero[`${g}_${t}`] = 0; }));
  exposeBindings(m, ["scheduleAutoMinWorkingByGroup"]);
  Object.assign(m.scheduleAutoMinWorkingByGroup, zero);
  const calls = { select: 0, improve: 0 };
  m.cloud = { functions: { invoke: async (_name, { body }) => {
    if (body.mode === "schedule-auto-improvement") { calls.improve++; return { data: { text: improvementReply(body.prompt), model: "stub" } }; }
    calls.select++; return { data: { text: "{\"candidate\":0}", groq_verified: true, model: "stub" } };
  } } };
  const plan = await m.scheduleAutoBuildHybridPlan(YEAR, MI, { minWorkingByGroup: zero });
  return { m, plan, calls };
}
const lineOf = (prompt, key) => (prompt.split("\n").find((l) => l.startsWith(`${key} `)) || "");
const listOf = (line, label) => { const mm = line.match(new RegExp(`${label}=\\[([^\\]]*)\\]`)); return mm && mm[1] ? mm[1].split(",").map(Number) : []; };

test("하이브리드: Groq가 필휴 칸·연차 칸을 건드리는 제안을 섞어 보내도 결과에는 절대 반영되지 않는다", async () => {
  const fx = prefFixture();
  fx.records = { [`s1|${sep(10)}`]: OFF, [`s2|${sep(11)}`]: ANNUAL };
  fx.memos = { [`s1|${sep(10)}`]: "필휴" };
  const { m, plan, calls } = await runHybridWithStub(fx, (prompt) => {
    const l1 = lineOf(prompt, "S1");
    const assigned = listOf(l1, "배정"), fixed = listOf(l1, "고정휴무"), movable = listOf(l1, "이동가능");
    return JSON.stringify({ groups: [
      [{ staff: "S1", from: assigned[0], to: fixed[0] }],
      [{ staff: "S1", from: fixed[0], to: movable[0] }],
      [{ staff: "S1", from: assigned[0], to: movable[0] }],
    ] });
  });
  assert.ok(calls.improve >= 1, "선호를 더 맞출 여지가 있어서 Groq 개선 제안을 요청해야 함");
  const s1 = planOf(plan, "s1").assigned;
  assert.ok(!s1.includes(10), "필휴 칸에는 오프가 새로 배정되면 안 됨");
  plan.perStaffPlan.forEach((p) => p.assigned.forEach((d) => {
    assert.ok(!Object.prototype.hasOwnProperty.call(m.scheduleData.records, `${p.staffId}|${sep(d)}`), `${p.staffId} 9/${d}은 기존 입력 칸`);
  }));
  assert.deepEqual(toPlain(m.scheduleData.records), toPlain(fx.records));
  // 선호 점수는 규칙 기반 결과보다 나빠지지 않는다.
  const baseIdx = plan.hybrid.selectedCandidate;
  const base = m.scheduleAutoBuildPlan(YEAR, MI, { variant: baseIdx });
  assert.ok(prefNetOf(plan, fx.autoOffPrefs) >= prefNetOf(base, fx.autoOffPrefs));
  assert.ok(plan.hybrid.improve && ["all-rejected", "success", "discarded"].includes(plan.hybrid.improve.status));
});

test("하이브리드: Groq 응답이 JSON이 아니거나 호출이 실패하면 규칙 기반 계획을 그대로 쓴다", async () => {
  const fx = prefFixture();
  const bad = await runHybridWithStub(fx, () => "죄송하지만 JSON이 아니에요");
  const ref = bad.m.scheduleAutoBuildPlan(YEAR, MI, { variant: bad.plan.hybrid.selectedCandidate });
  assert.deepEqual(toPlain(bad.plan.perStaffPlan.map((p) => p.assigned)), toPlain(ref.perStaffPlan.map((p) => p.assigned)));
  assert.equal(bad.plan.hybrid.improve.status, "invalid-response");

  const { m } = setup(fx);
  const zero = {}; ["DAY", "NIGHT"].forEach((g) => ["채팅", "유선"].forEach((t) => { zero[`${g}_${t}`] = 0; }));
  exposeBindings(m, ["scheduleAutoMinWorkingByGroup"]);
  Object.assign(m.scheduleAutoMinWorkingByGroup, zero);
  m.cloud = { functions: { invoke: async () => { throw new Error("네트워크 오류"); } } };
  const plan = await m.scheduleAutoBuildHybridPlan(YEAR, MI, { minWorkingByGroup: zero });
  assert.equal(plan.hybrid.improve.status, "fallback");
  assert.ok(plan.perStaffPlan.every((p) => p.assigned.length === 8));
});

/* ===================== 조건 체크리스트 (미리보기에 ✓/△/✗로 보여주는 부분) ===================== */

test("체크리스트: 아무 문제도 없으면 모든 항목이 ✓다", () => {
  const { m } = setup({ staff: ["s1", "s2", "s3", "s4", "s5"].map((id) => staff(id)) }, { premise: true });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const metrics = m.scheduleAutoPlanMetrics(plan);
  const items = m.scheduleAutoChecklistItems(plan, metrics);
  assert.deepEqual(toPlain(plan.warnings), []);
  items.forEach((it) => assert.equal(it.mark, "ok", `${it.label}은 ok여야 함`));
});

test("체크리스트: 이미 6일 연속 근무가 남는 경우 '연속 근무'만 △이고 다른 항목은 그대로 ✓다", () => {
  const ids = ["c1", "c2", "c3", "c4", "c5"];
  const records = {};
  ids.forEach((id, i) => { records[`${id}|${aug(31 - (i + 1))}`] = OFF; });
  const { m } = setup({ staff: ids.map((id) => staff(id)), records });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const metrics = m.scheduleAutoPlanMetrics(plan);
  const items = m.scheduleAutoChecklistItems(plan, metrics);
  const byLabel = Object.fromEntries(items.map((it) => [it.label, it.mark]));
  assert.equal(byLabel["기존 입력값 보호"], "ok");
  assert.equal(byLabel["필요인력 허용범위(최후 기준)"], "ok");
  assert.ok(byLabel["연속 근무 최대 5일(불가피하면 6일)"] !== "bad", "6일까지는 규칙 위반(✗)이 아니라 ok 또는 warn");
});

test("체크리스트: 필요인력 허용범위를 넘겨 배치된 칸이 있으면 그 항목만 ✗다", () => {
  const requiredHeadcount = { "2026-09|DAY|채팅|9": 5 };
  const records = { [`s4|${sep(9)}`]: ANNUAL, [`s5|${sep(9)}`]: ANNUAL };
  const { m } = setup({ staff: ["s1", "s2", "s3", "s4", "s5"].map((id) => staff(id)), records, requiredHeadcount }, { premise: true });
  const base = m.scheduleAutoBuildPlan(YEAR, MI);
  // 검증기를 우회해 억지로 -3을 만든 가짜 계획으로 체크리스트가 실제로 감지하는지 확인한다.
  const forced = JSON.parse(JSON.stringify(base));
  const p1 = forced.perStaffPlan.find((p) => !p.assigned.includes(9));
  if (p1) p1.assigned.push(9);
  const metrics = m.scheduleAutoPlanMetrics(forced);
  const items = m.scheduleAutoChecklistItems(forced, metrics);
  const byLabel = Object.fromEntries(items.map((it) => [it.label, it.mark]));
  assert.equal(byLabel["필요인력 허용범위(최후 기준)"], "bad");
  const byNote = Object.fromEntries(items.map((it) => [it.label, it.note]));
  // 초과 칸이 며칠인지(9/9) 노트에 날짜로 함께 나와야 한다.
  assert.match(byNote["필요인력 허용범위(최후 기준)"], /9\/9/);
});

test("체크리스트: 필요인력 허용범위 초과 칸이 많으면 앞쪽 몇 개만 보여주고 '외 N건'으로 줄인다", () => {
  const { m } = setup({ staff: [staff("s1")] }, { premise: true });
  const dates = Array.from({ length: 10 }, (_, i) => `9/${i + 1}(주간채팅)`);
  const text = m.scheduleAutoFormatDateList(dates);
  assert.equal(text, "(9/1(주간채팅), 9/2(주간채팅), 9/3(주간채팅), 9/4(주간채팅), 9/5(주간채팅), 9/6(주간채팅), 9/7(주간채팅), 9/8(주간채팅) 외 2건)");
  assert.equal(m.scheduleAutoFormatDateList([]), "");
});

test("체크리스트: 선호 요일 미설정이면 그 항목 자체가 나타나지 않는다", () => {
  const { m } = setup({ staff: [staff("s1"), staff("s2"), staff("s3")] }, { premise: true });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const metrics = m.scheduleAutoPlanMetrics(plan);
  const items = m.scheduleAutoChecklistItems(plan, metrics);
  assert.ok(!items.some((it) => it.label.includes("선호")), "선호를 아무도 설정 안 했으면 항목을 보여주지 않아야 함");
});

test("미리보기 HTML에 체크리스트와 설정값 요약이 포함된다", () => {
  const { m } = setup({ staff: [staff("s1"), staff("s2"), staff("s3")] }, { premise: true });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const html = m.scheduleAutoPreviewHtml(plan);
  assert.ok(html.includes("sch-auto-checklist"));
  assert.ok(html.includes("sch-auto-settings-summary"));
  assert.ok(html.includes("최소 출근 인원"));
});

/* ===================== 추가 대전제: 주간 07:00 시작 인원 최소 1명 ===================== */
function earlyHeadcount(records, staffList, type, d) {
  return staffList.filter((st) => !st.isAdmin
    && st.group !== "night"
    && (st.types || []).includes(type)
    && /^07:00(?:-|$)/.test(String(st.workHours || ""))
    && countsAsWorked(records[`${st.id}|${sep(d)}`])).length;
}

test("07:00 조건: 시작 시각만 보므로 07:00-14:00와 07:00-16:00 모두 이른 조로 인정한다", () => {
  const list = [
    staff("e1", { workHours: "07:00-14:00" }),
    staff("e2", { workHours: "07:00-16:00" }),
    ...mkStaff("n", 3, { workHours: "09:00-18:00" }),
  ];
  const { m } = premise({ staff: list });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const recs = withPlan(m.scheduleData.records, plan);
  for (let d = 1; d <= 30; d++) {
    assert.ok(earlyHeadcount(recs, list, "채팅", d) >= 1, `9/${d}: 07:00 시작 인원이 최소 1명이어야 함`);
  }
});

test("07:00 조건: 07:00 인원 2명 중 1명이 기존 필휴면 다른 1명에게 같은 날 자동 오프를 주지 않는다", () => {
  const list = [
    staff("e1", { workHours: "07:00-14:00" }),
    staff("e2", { workHours: "07:00-16:00" }),
    ...mkStaff("n", 3, { workHours: "09:00-18:00" }),
  ];
  const records = { [`e1|${sep(8)}`]: OFF };
  const memos = { [`e1|${sep(8)}`]: "필휴" };
  const { m } = premise({ staff: list, records, memos });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  assert.ok(!planOf(plan, "e2").assigned.includes(8), "e2는 e1의 필휴 때문에 9/8에 자동 오프가 될 수 없음");
  const recs = withPlan(m.scheduleData.records, plan);
  assert.equal(earlyHeadcount(recs, list, "채팅", 8), 1);
});

test("07:00 조건: 두 07:00 인원이 모두 기존 필휴인 날은 자동배치가 건드리지 않고 기존 0명을 경고한다", () => {
  const list = [
    staff("f1", { workHours: "07:00-14:00" }),
    staff("f2", { workHours: "07:00-16:00" }),
    ...mkStaff("n", 3, { workHours: "09:00-18:00" }),
  ];
  const records = {
    [`f1|${sep(8)}`]: OFF,
    [`f2|${sep(8)}`]: OFF,
  };
  const memos = { [`f1|${sep(8)}`]: "필휴", [`f2|${sep(8)}`]: "필휴" };
  const { m } = premise({ staff: list, records, memos });
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  assert.ok(!planOf(plan, "f1").assigned.includes(8));
  assert.ok(!planOf(plan, "f2").assigned.includes(8));
  const recs = withPlan(m.scheduleData.records, plan);
  assert.equal(earlyHeadcount(recs, list, "채팅", 8), 0, "기존 필휴 2개는 자동배치가 수정하지 않음");
  assert.ok(plan.warnings.some((w) => w.includes("07:00 근무 인원이 0명") && w.includes("9/8")));
});

test("07:00 조건: 선호 보정·전원출근 해소 후에도 기존에 지켜지던 07:00 최소 1명이 깨지지 않는다", () => {
  const rnd = mulberry32(20260922 + 700);
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const list = [
    staff("p1", { workHours: "07:00-14:00" }),
    staff("p2", { workHours: "07:00-16:00" }),
    ...Array.from({ length: 6 }, (_, i) => staff(`p${i + 3}`, { workHours: "09:00-18:00" })),
  ];
  const records = {};
  const memos = {};
  for (const st of list) {
    for (let d = 1; d <= 30; d++) {
      if (rnd() < 0.05) {
        const kind = pick([OFF, ANNUAL, { status: "WORK", attendance: "ABSENT" }]);
        records[`${st.id}|${sep(d)}`] = kind;
        if (kind.status === "OFF") memos[`${st.id}|${sep(d)}`] = "필휴";
      }
    }
  }
  const { m } = premise({ staff: list, records, memos });
  const before = {};
  for (let d = 1; d <= 30; d++) before[d] = earlyHeadcount(records, list, "채팅", d);
  const plan = m.scheduleAutoBuildPlan(YEAR, MI);
  const recs = withPlan(m.scheduleData.records, plan);
  for (let d = 1; d <= 30; d++) {
    const after = earlyHeadcount(recs, list, "채팅", d);
    if (before[d] >= 1) assert.ok(after >= 1, `9/${d}: 기존에 07:00 인원이 있었는데 자동배치 후 0명이 됨`);
    else assert.equal(after, 0, `9/${d}: 기존 입력으로 07:00 인원이 0명이면 자동배치가 기존 입력을 되살리거나 새로 만들지 않음`);
  }
  assert.equal(m.scheduleAutoPlanMetrics(plan).earlyWorkingViolations, 0);
});
