// tests/qa-render.test.js
// js/05f-qa-render.js의 QA 표 마크업(buildQATableHtml)·필터(qaFilterAgentsByMode)와
// js/05d-qa-summary-trend.js의 추이 그래프(qaTrendSvgHtml) 테스트.
//
// 이 함수들은 화면에 붙이기 전 단계의 "HTML 문자열"을 만들어 돌려주기 때문에,
// 브라우저 없이도 결과 문자열을 그대로 검사할 수 있다. 특히 캡처용 표(forCapture)는
// 화면용과 마크업이 달라야 하는데(입력칸이 이미지에 찍히면 안 됨) 매번 이미지를
// 저장해보며 확인해야 했던 부분이라 여기서 고정해둔다.
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { createSandbox, loadIntoContext, toPlain, exposeBindings } = require("./helpers/load-source");
const { createFakeDocument, createMemoryLocalStorage, countMatches, extractAll } = require("./helpers/fake-dom");

function loadQA() {
  const sandbox = createSandbox({
    today: new Date(2026, 8, 15), // 2026-09
    agentsData: [],
    saveQAData: () => {},
    flashQAStatus: () => {},
    renderApp: () => {},
    sortAgentList: (list) => list,
    agentMatchesSearch: () => true,
    acctKey: (k) => `acct:test:${k}`,
    document: createFakeDocument(),
    localStorage: createMemoryLocalStorage(),
    setTimeout: () => 0,
    clearTimeout: () => {},
  });
  loadIntoContext(sandbox, [
    "js/01a-icons.js",
    "js/01f-settings-menu-utils.js",
    "js/01l-work-types-config.js",
    "js/05a-qa-data.js",
    "js/05b-qa-stats.js",
    "js/05d-qa-summary-trend.js",
    "js/05e-qa-modals.js",
    "js/05f-qa-render.js",
  ]);
  // qaData/qaUi는 05a-qa-data.js 안의 최상위 let·const라 기본적으로 sandbox에
  // 노출되지 않는다. 테스트에서 점수를 직접 넣어보려면 꺼내와야 한다.
  exposeBindings(sandbox, ["qaData", "qaUi"]);
  return sandbox;
}

// 잠긴 달 검사를 우회해서 과거 달 점수를 직접 넣는다(테스트 픽스처용).
function putScore(m, agentId, year, monthIndex, score) {
  m.qaData.scores[`${agentId}|${m.qaMonthKey(year, monthIndex)}`] = score;
}

const AGENTS = [
  { id: "a1", name: "김주간", ldap: "kim", timezone: "09-18", workTypes: ["유선"], group: "day" },
  { id: "a2", name: "이채팅", ldap: "lee", timezone: "10-19", workTypes: ["채팅"], group: "day" },
  { id: "a3", name: "박야간", ldap: "park", timezone: "22-07", workTypes: ["유선", "채팅"], group: "night" },
];

test("qaFilterAgentsByMode: 조·업무구분별로 걸러내고, 둘 다 하는 인원은 양쪽에 모두 걸린다", () => {
  const m = loadQA();
  const ids = (mode) => toPlain(m.qaFilterAgentsByMode(AGENTS, mode)).map((a) => a.id);
  assert.deepEqual(ids("ALL"), ["a1", "a2", "a3"]);
  assert.deepEqual(ids(undefined), ["a1", "a2", "a3"]); // 모드를 안 주면 전체
  assert.deepEqual(ids("DAY"), ["a1", "a2"]);
  assert.deepEqual(ids("NIGHT"), ["a3"]);
  assert.deepEqual(ids("VOICE"), ["a1", "a3"]);
  assert.deepEqual(ids("CHAT"), ["a2", "a3"]);
});

test("buildQATableHtml: 인원 수만큼 행을 만들고 이름·LDAP·조 배지를 채운다", () => {
  const m = loadQA();
  const html = m.buildQATableHtml(AGENTS, 2026, 8, false);
  assert.equal(countMatches(html, /<tr data-qa-row-agent=/), 3);
  assert.deepEqual(extractAll(html, /data-qa-row-agent="([^"]+)"/), ["a1", "a2", "a3"]);
  assert.equal(html.includes("김주간"), true);
  assert.equal(html.includes("park"), true);
  assert.equal(countMatches(html, /badge sm night/), 1); // 야간 인원 한 명
  assert.equal(countMatches(html, /badge sm day/), 2);
});

test("buildQATableHtml: 인원이 없으면 안내 문구 한 줄만 그리고, 캡처용은 문구가 다르다", () => {
  const m = loadQA();
  const screen = m.buildQATableHtml([], 2026, 8, false);
  assert.equal(countMatches(screen, /<tr data-qa-row-agent=/), 0);
  assert.equal(screen.includes("상담사 관리"), true); // 화면용: 등록을 안내

  const capture = m.buildQATableHtml([], 2026, 8, true);
  assert.equal(capture.includes("해당하는 상담사가 없어요."), true); // 캡처용: 필터 결과 안내
});

test("buildQATableHtml: 캡처용 표에는 점수 입력칸(<input>)이 들어가지 않는다", () => {
  const m = loadQA();
  putScore(m, "a1", 2026, 8, 87.5);

  const screen = m.buildQATableHtml(AGENTS, 2026, 8, false);
  assert.equal(countMatches(screen, /<input/), 3); // 화면용은 인원마다 입력칸

  const capture = m.buildQATableHtml(AGENTS, 2026, 8, true);
  assert.equal(countMatches(capture, /<input/), 0); // 캡처용은 입력칸 없음
  assert.equal(capture.includes("<td>87.5</td>"), true); // 점수는 글자로
  assert.equal(capture.includes("<td>-</td>"), true); // 점수 없는 인원은 -
  assert.equal(capture.includes("qa-name-search-icon"), false); // 검색 아이콘도 빠짐
});

test("buildQATableHtml: 잠긴 달이면 점수 입력칸을 못 쓰게 막는다", () => {
  const m = loadQA();
  assert.equal(countMatches(m.buildQATableHtml(AGENTS, 2026, 8, false), /disabled/), 0);
  m.qaData.monthLocks[m.qaMonthKey(2026, 8)] = true;
  assert.equal(countMatches(m.buildQATableHtml(AGENTS, 2026, 8, false), /disabled/), 3);
});

test("buildQATableHtml: 전월 대비는 오름/내림/신규를 구분해서 표시한다", () => {
  const m = loadQA();
  putScore(m, "a1", 2026, 7, 80); // 8월
  putScore(m, "a1", 2026, 8, 85); // 9월 → 상승
  putScore(m, "a2", 2026, 7, 90);
  putScore(m, "a2", 2026, 8, 88); // → 하락
  putScore(m, "a3", 2026, 8, 70); // 전월 점수 없음 → 신규

  const html = m.buildQATableHtml(AGENTS, 2026, 8, false);
  assert.equal(html.includes(`qa-diff up">▲ 5.0`), true);
  assert.equal(html.includes(`qa-diff down">▼ 2.0`), true);
  assert.equal(html.includes(`qa-diff flat">신규`), true);
});

test("buildQATableHtml: 퇴사자 행에는 퇴사 배지와 전용 클래스가 붙는다", () => {
  const m = loadQA();
  const html = m.buildQATableHtml(
    [{ id: "r1", name: "최퇴사", workTypes: ["유선"], group: "day", status: "RESIGNED" }],
    2026, 8, false,
  );
  assert.equal(html.includes("qa-row-resigned"), true);
  assert.equal(html.includes(`badge sm resigned">퇴사`), true);
});

test("buildQATableHtml: 이름에 든 HTML 특수문자는 이스케이프해서 넣는다", () => {
  const m = loadQA();
  const html = m.buildQATableHtml(
    [{ id: "x", name: "<b>굵게</b>", workTypes: [], group: "day" }],
    2026, 8, true,
  );
  assert.equal(html.includes("<b>굵게</b>"), false);
  assert.equal(html.includes("&lt;b&gt;굵게&lt;/b&gt;"), true);
});

test("qaComputeAgentTrend: 최근 N개월을 연도 넘김까지 맞춰 오래된 순으로 돌려준다", () => {
  const m = loadQA();
  putScore(m, "a1", 2025, 11, 70); // 2025-12
  const trend = toPlain(m.qaComputeAgentTrend("a1", 2026, 1, 3)); // 2026-02 기준 3개월
  assert.deepEqual(
    trend.map((t) => `${t.year}-${t.monthIndex}`),
    ["2025-11", "2026-0", "2026-1"],
  );
  assert.equal(trend[0].score, 70);
  assert.equal(trend[1].score, null); // 점수 없는 달은 null
});

test("qaTrendSvgHtml: 점수가 하나도 없으면 그래프 대신 안내 문구를 보여준다", () => {
  const m = loadQA();
  const html = m.qaTrendSvgHtml("a1", 2026, 8);
  assert.equal(html.includes("qa-trend-empty"), true);
  assert.equal(html.includes("<svg"), false);
});

test("qaTrendSvgHtml: 중간에 점수가 빈 달이 있으면 선을 끊어서 두 구간으로 그린다", () => {
  const m = loadQA();
  putScore(m, "a1", 2026, 4, 80); // 5월
  putScore(m, "a1", 2026, 5, 82); // 6월
  // 7월은 비움 → 여기서 선이 끊긴다
  putScore(m, "a1", 2026, 7, 90); // 8월
  putScore(m, "a1", 2026, 8, 92); // 9월

  const html = m.qaTrendSvgHtml("a1", 2026, 8);
  assert.equal(countMatches(html, /<path /), 2); // 끊긴 구간마다 선 하나씩
  assert.equal(countMatches(html, /<circle /), 4); // 점수가 있는 달에만 점
  assert.equal(countMatches(html, /class="qa-trend-month/), 6); // 라벨은 6개월 전부
  assert.equal(countMatches(html, /qa-trend-month current/), 1); // 이번 달만 강조
});

test("qaFormatSummaryHtml: 줄바꿈은 <br>로 바꾸고 대괄호 제목 줄만 굵게 만든다", () => {
  const m = loadQA();
  const html = m.qaFormatSummaryHtml("[인사말]\n밝게 응대 필요\n**강조기호 제거**");
  assert.equal(html.includes("<strong>[인사말]</strong>"), true);
  assert.equal(countMatches(html, /<br>/), 2);
  assert.equal(html.includes("**"), false); // 남아있던 마크다운 기호는 제거
});

test("qaFormatSummaryHtml: 요약 원문에 든 HTML 태그는 그대로 실행되지 않게 이스케이프한다", () => {
  const m = loadQA();
  const html = m.qaFormatSummaryHtml("<img src=x onerror=1>");
  assert.equal(html.includes("<img"), false);
  assert.equal(html.includes("&lt;img"), true);
});
