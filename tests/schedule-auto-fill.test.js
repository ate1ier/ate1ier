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

test("인원별 설정 팝업: 인원 × 요일 표에 선택된 칸이 표시되고, 이름은 이스케이프된다", () => {
  const { m } = setup({
    staff: [staff("s1", { name: "<b>홍</b>" }), staff("s2")],
    autoOffPrefs: { s1: { dows: [2, 3] } },
  });
  const list = m.getStaffListForMonth(YEAR, MI);
  assert.equal(m.scheduleAutoPrefsCountText(list), "(1명 설정됨)");
  const html = m.scheduleAutoSettingsPopupHtml(list, []);
  assert.ok(html.includes("인원별 설정") && html.includes("(1명 설정됨)"));
  assert.ok(html.includes('<table class="sch-auto-set-table">'), "한눈에 보이는 표");
  assert.ok(!html.includes("<details"), "접었다 펴는 영역이 아니라 팝업 안의 표");
  assert.ok(html.includes(`data-auto-pref-staff="s1" data-auto-pref-dow="2" aria-pressed="true"`));
  assert.ok(html.includes(`data-auto-pref-staff="s1" data-auto-pref-dow="0" aria-pressed="false"`));
  assert.equal(count(html, /data-auto-pref-staff="s1"/g), 7, "인원 한 명당 일~토 7칸");
  assert.equal(count(html, /data-auto-pref-staff="s2"/g), 7);
  assert.ok(!html.includes("<b>홍</b>"), "이름은 이스케이프되어야 함");
  assert.ok(html.includes("&lt;b&gt;홍&lt;/b&gt;"));
  assert.ok(!html.includes("이번 배치 제외 중"));
  assert.equal(m.scheduleAutoPrefsCountText([]), "(설정 없음)");
});

test("인원별 설정 팝업: 주간·야간·관리자로 묶어 보여주고, 이번 배치에서 제외 중인 인원은 표시만 한다", () => {
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
  // 제외 중이어도 선호 요일 칸은 그대로 눌러서 설정할 수 있다
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

  // s3 제외: 재직 2명 → s1이 금요일에 쉬면 1명만 남아 대비 -1(금요일은 0이 1순위, -1은 최후의 수단)이라 다른 날을 고른다
  const plan = build({ excludeStaffIds: ["s3"] });
  const p1 = planOf(plan, "s1");
  assert.equal(p1.prefHits, 0);
  assert.ok(fridays.every((d) => !p1.assigned.includes(d)));
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

test("배치 조건 영역: '인원별 설정' 버튼(요약 문구 포함)과 '제외할 인원'이 함께 있고, 예전 '선호 오프 요일' 접이식 영역은 없다", () => {
  const { m } = setup({ staff: [staff("s1"), staff("s2")], autoOffPrefs: { s1: { dows: [1] } } });
  const html = m.scheduleAutoConditionsHtml(m.getStaffListForMonth(YEAR, MI));
  assert.ok(html.includes("배치 조건") && html.includes("제외할 인원"));
  assert.ok(html.includes('id="sch-auto-settings-btn"') && html.includes("인원별 설정") && html.includes("(1명 설정됨)"));
  assert.ok(!html.includes("선호 오프 요일") && !html.includes("<details"));
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
  assert.equal(planOf(plan, "boss").assigned.length, 8, "관리자는 필요인력 집계 밖이라 그대로 배정");
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

test("필요인력 허용범위(부족 기준): 금·토·월 0(최후 -1) / 그 외 요일 -1(최후 -2) / 평일 공휴일 금·월은 -2", () => {
  const { m } = setup({});
  const tol = (dow) => toPlain(m.scheduleAutoToleranceInfo(dow, "2026-09-01")); // getHoliday는 항상 null
  [5, 6, 1].forEach((d) => assert.deepEqual(tol(d), { ideal: 0, max: 1 }, `dow ${d}`));
  [0, 2, 3, 4].forEach((d) => assert.deepEqual(tol(d), { ideal: 1, max: 2 }, `dow ${d}`));
  m.getHoliday = () => ({ name: "공휴일" });
  [5, 1].forEach((d) => assert.deepEqual(toPlain(m.scheduleAutoToleranceInfo(d, "2026-09-01")), { ideal: 2, max: 2 }, `평일 공휴일 dow ${d}`));
  assert.deepEqual(toPlain(m.scheduleAutoToleranceInfo(6, "2026-09-05")), { ideal: 0, max: 1 }, "토요일은 평일이 아니라 예외 아님");
  assert.deepEqual(toPlain(m.scheduleAutoToleranceInfo(0, "2026-09-06")), { ideal: 1, max: 2 });
});

test("그 외 요일(수요일)은 -1 범위를 먼저 지키고, 다른 날이 남아 있으면 -2로 넓히지 않는다", () => {
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
  assert.deepEqual(toPlain(plan.warnings), []);
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
