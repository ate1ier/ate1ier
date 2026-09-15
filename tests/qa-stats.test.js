// tests/qa-stats.test.js
// js/05b-qa-stats.js의 점수 계산(getQAScore/setQAScore/qaComputeStats)과
// 퇴사자 유지 기간(qaResignKeepUntilKey/qaAgentVisibleInMonth) 로직 테스트.
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { createSandbox, loadIntoContext } = require("./helpers/load-source");

// qaData/qaUi/today 등 05b-qa-stats.js가 참조하는 최소한의 전역값을 넣어준다.
// saveQAData/flashQAStatus/renderApp은 실제 저장·UI 갱신 대신 아무 것도 안 하는
// 스텁으로 대체해, 순수 로직만 테스트한다.
function loadStatsModule() {
  const sandbox = createSandbox({
    today: new Date(2026, 8, 15), // "오늘"을 2026-09-15로 고정
    qaUi: { year: 2026, monthIndex: 8 },
    qaData: { scores: {}, monthLocks: {} },
    saveQAData: () => {},
    flashQAStatus: () => {},
    renderApp: () => {},
  });
  loadIntoContext(sandbox, ["js/01f-settings-menu-utils.js", "js/05b-qa-stats.js"]);
  return sandbox;
}

test("qaMonthKey: 연도-월(2자리) 형식의 키를 만든다", () => {
  const m = loadStatsModule();
  assert.equal(m.qaMonthKey(2026, 0), "2026-01");
  assert.equal(m.qaMonthKey(2025, 11), "2025-12");
});

test("setQAScore/getQAScore: 값을 저장·조회하고 0~100 범위로 잘라낸다", () => {
  const m = loadStatsModule();
  // "오늘"을 2026-09-15로 고정해뒀으므로, 지나간 달(예: 1월)은 기본적으로
  // 잠겨 있어 저장이 안 된다(퇴사자 유지기간과는 다른 규칙). 그래서 여기서는
  // "오늘이 속한 달"인 9월(monthIndex 8)로 테스트한다.
  m.setQAScore("a1", 2026, 8, "150");
  assert.equal(m.getQAScore("a1", 2026, 8), 100);
  m.setQAScore("a1", 2026, 8, "-10");
  assert.equal(m.getQAScore("a1", 2026, 8), 0);
  m.setQAScore("a1", 2026, 8, "  ");
  assert.equal(m.getQAScore("a1", 2026, 8), null); // 빈 값은 삭제
  m.setQAScore("a1", 2026, 8, "숫자아님");
  assert.equal(m.getQAScore("a1", 2026, 8), null); // 숫자가 아니면 무시
});

test("getQAScore: 예전 유선/채팅 분리 저장 데이터는 평균으로 자동 변환한다", () => {
  const m = loadStatsModule();
  m.qaData.scores["a1|2026-01"] = { voice: 90, chat: 80 };
  assert.equal(m.getQAScore("a1", 2026, 0), 85);
  m.qaData.scores["a2|2026-01"] = { voice: 90, chat: null };
  assert.equal(m.getQAScore("a2", 2026, 0), 90); // 값이 있는 쪽만 평균에 반영
});

test("setQAScore: 잠긴 달에는 값을 저장하지 않는다", () => {
  const m = loadStatsModule();
  // "오늘"이 속한 9월은 기본적으로 잠겨 있지 않으므로, 사용자가 직접 잠근
  // 경우를 흉내내기 위해 monthLocks를 true로 명시한다.
  m.qaData.monthLocks["2026-09"] = true;
  m.setQAScore("a1", 2026, 8, "77");
  assert.equal(m.getQAScore("a1", 2026, 8), null);
});

test("qaAvg: null/undefined은 제외하고 평균을 낸다", () => {
  const m = loadStatsModule();
  assert.equal(m.qaAvg([80, 90, null, undefined]), 85);
  assert.equal(m.qaAvg([null, undefined]), null);
});

test("qaComputeStats: 업무구분(유선/채팅)·조(주간/야간) 기준으로 평균을 나눠 계산한다", () => {
  const m = loadStatsModule();
  const agents = [
    { id: "a1", workTypes: ["유선"], group: "day" },
    { id: "a2", workTypes: ["채팅"], group: "day" },
    { id: "a3", workTypes: ["유선", "채팅"], group: "night" },
  ];
  // 지나간 달(1월)은 기본적으로 잠겨 있으므로 "오늘"이 속한 9월로 저장한다.
  m.setQAScore("a1", 2026, 8, "90");
  m.setQAScore("a2", 2026, 8, "80");
  m.setQAScore("a3", 2026, 8, "70");

  const stats = m.qaComputeStats(agents, 2026, 8);
  assert.equal(stats.voice, 80); // (90+70)/2
  assert.equal(stats.chat, 75); // (80+70)/2
  assert.equal(stats.day, 85); // (90+80)/2
  assert.equal(stats.night, 70);
  assert.equal(stats.total, 80); // (90+80+70)/3
});

test("qaResignMonthKey/qaResignKeepUntilKey: 퇴사월 다음 달까지 유지하고, 12월이면 연도가 넘어간다", () => {
  const m = loadStatsModule();
  assert.equal(m.qaResignMonthKey("2026-03-15"), "2026-03");
  assert.equal(m.qaResignKeepUntilKey("2026-03-15"), "2026-04");
  assert.equal(m.qaResignKeepUntilKey("2026-12-01"), "2027-01"); // 연말 → 다음 해 1월
  assert.equal(m.qaResignKeepUntilKey(""), null);
  assert.equal(m.qaResignKeepUntilKey(undefined), null);
});

test("qaAgentVisibleInMonth: 재직자는 항상 보이고, 퇴사자는 퇴사월+1개월까지만 보인다", () => {
  const m = loadStatsModule();
  const resigned = { status: "RESIGNED", resignDate: "2026-03-15" };
  assert.equal(m.qaAgentVisibleInMonth(resigned, 2026, 2), true); // 3월(퇴사월)
  assert.equal(m.qaAgentVisibleInMonth(resigned, 2026, 3), true); // 4월(다음달)까지는 유지
  assert.equal(m.qaAgentVisibleInMonth(resigned, 2026, 4), false); // 5월부터는 목록에서 빠짐

  const working = { status: "ACTIVE" };
  assert.equal(m.qaAgentVisibleInMonth(working, 2020, 0), true);

  const noResignDate = { status: "RESIGNED", resignDate: "" };
  assert.equal(m.qaAgentVisibleInMonth(noResignDate, 2099, 11), true); // 정보 없으면 안전하게 계속 표시
});
