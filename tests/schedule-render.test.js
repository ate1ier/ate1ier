// tests/schedule-render.test.js
// js/07a3-schedule-records.js(집계·정렬·메모 취합)와 js/07a4-schedule-table-render.js
// (월별 스케줄 표 마크업) 테스트.
//
// 월별 스케줄 표는 이 앱에서 가장 복잡한 화면이다. 행 순서(관리자→주간→야간,
// 채팅→유선, 근무 시작시각순), 셀 상태 라벨, 월별 집계 숫자, 캡처용 마크업 분기,
// 접은 열/행 처리까지 전부 사람이 표를 훑으면서 확인해야 했던 부분이라, 표를
// 실제로 한 번 그려놓고 결과 HTML을 검사하는 방식으로 덮는다.
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { createSandbox, loadIntoContext, toPlain, exposeBindings } = require("./helpers/load-source");
const { createFakeDocument, createMemoryLocalStorage, countMatches, extractAll } = require("./helpers/fake-dom");

// 2026년 9월(30일, 1일=화요일) 기준 픽스처.
// - 관리자 1명 + 주간 2명(채팅/유선) + 야간 1명
// - 오프/연차/지각/결근을 하나씩 넣어 셀 라벨과 집계를 동시에 확인한다.
// - 메모 3건은 가감점 취합(선 투입/역동석/라운딩) 확인용.
function buildFixture() {
  return {
    staff: [
      { id: "s1", name: "김주간", nickname: "주간이", empNo: "1001", hireDate: "2024-01-02", workHours: "09:00-18:00", types: ["유선"], group: "day" },
      { id: "s2", name: "이채팅", nickname: "채팅이", empNo: "1002", hireDate: "2024-03-02", workHours: "10:00-19:00", types: ["채팅"], group: "day" },
      { id: "s3", name: "박야간", nickname: "야간이", empNo: "1003", hireDate: "2023-05-02", workHours: "22:00-07:00", types: ["유선"], group: "night" },
      { id: "a1", name: "관리자", nickname: "관리", empNo: "9001", hireDate: "2020-01-01", workHours: "09:00-18:00", types: [], group: "day", isAdmin: true },
    ],
    records: {
      "s1|2026-09-02": { status: "OFF", attendance: null },
      "s1|2026-09-03": { status: "ANNUAL", attendance: null },
      "s2|2026-09-02": { status: "WORK", attendance: "LATE" },
      "s3|2026-09-04": { status: "WORK", attendance: "ABSENT" },
    },
    memos: {
      "s1|2026-09-05": "선투입 후 연장근무",
      "s2|2026-09-07": "역동석 진행",
      "s3|2026-09-09": "라운딩",
    },
    staffHistory: {}, lastSyncMonthKey: null, requiredHeadcount: {}, monthLocks: {}, collapseByMonth: {},
  };
}

function loadSchedule(fixture) {
  const sandbox = createSandbox({
    today: new Date(2026, 8, 15),
    SCHEDULE_KEY: "sched", // 원래는 06-interviews.js에 있는 값. 여기선 픽스처 키로만 쓴다.
    acctKey: (k) => k,
    // 9/16을 공휴일로 넣어서, 평일인데도 휴일 색(wd-sun)이 붙는지 확인한다.
    getHoliday: (iso) => (iso === "2026-09-16" ? "임시공휴일" : null),
    localStorage: createMemoryLocalStorage({ sched: JSON.stringify(fixture || buildFixture()) }),
    document: createFakeDocument(),
    setTimeout: () => 0,
    clearTimeout: () => {},
    recordUndo: () => {},
    renderApp: () => {},
    saveScheduleData: () => {},
    agentsData: [],
  });
  loadIntoContext(sandbox, [
    "js/01a-icons.js",
    "js/01f-settings-menu-utils.js", // pad2, esc
    "js/01k-calendar-shared-data.js", // WEEKDAYS
    "js/07a1-schedule-data.js",
    "js/07a2-schedule-ui-state.js",
    "js/07a3-schedule-records.js",
    "js/07a4-schedule-table-render.js",
  ]);
  // scheduleData/scheduleUi는 최상위 let·const라 기본적으로 노출되지 않는다.
  exposeBindings(sandbox, ["scheduleData", "scheduleUi"]);
  sandbox.scheduleUi.year = 2026;
  sandbox.scheduleUi.monthIndex = 8; // 2026년 9월로 고정
  return sandbox;
}

/* ===================== 집계·정렬 로직 ===================== */

test("scheduleCellDisplay: 지각·결근은 근무 상태보다 우선해서 표시한다", () => {
  const m = loadSchedule();
  assert.equal(m.scheduleCellDisplay({ status: "WORK", attendance: "LATE" }).label, "지각");
  assert.equal(m.scheduleCellDisplay({ status: "WORK", attendance: "ABSENT" }).label, "결근");
  assert.equal(m.scheduleCellDisplay({ status: "WORK", attendance: null }).label, "1");
  assert.equal(m.scheduleCellDisplay({ status: "ANNUAL" }).label, "연차");
  // 모르는 상태값이 들어와도 기본값(근무)으로 안전하게 표시한다.
  assert.equal(m.scheduleCellDisplay({ status: "???" }).label, "1");
});

test("scheduleCountsAsWorked: 결근한 날은 실제 투입 인원으로 세지 않는다", () => {
  const m = loadSchedule();
  assert.equal(m.scheduleCountsAsWorked({ status: "WORK", attendance: null }), true);
  assert.equal(m.scheduleCountsAsWorked({ status: "WORK", attendance: "LATE" }), true); // 지각은 출근한 것
  assert.equal(m.scheduleCountsAsWorked({ status: "WORK", attendance: "ABSENT" }), false);
  assert.equal(m.scheduleCountsAsWorked({ status: "OFF" }), false);
});

test("scheduleStaffMonthCounts: 한 달 근무/오프/연차/결근 일수를 맞게 센다", () => {
  const m = loadSchedule();
  // 9월은 30일. s1은 오프 1일 + 연차 1일 → 근무 28일.
  assert.deepEqual(toPlain(m.scheduleStaffMonthCounts("s1", 2026, 8)), { WORK: 28, OFF: 1, ANNUAL: 1, DAEHYU: 0, ABSENT: 0 });
  // s3은 결근 1일 → 근무 29일(결근은 근무에 안 들어감).
  assert.deepEqual(toPlain(m.scheduleStaffMonthCounts("s3", 2026, 8)), { WORK: 29, OFF: 0, ANNUAL: 0, DAEHYU: 0, ABSENT: 1 });
});

test("scheduleStaffMonthCounts: 대휴·공휴·육휴·특휴도 '오프' 합계에 함께 들어간다", () => {
  const fx = buildFixture();
  fx.records["s1|2026-09-10"] = { status: "DAEHYU", attendance: null };
  fx.records["s1|2026-09-11"] = { status: "GONGHYU", attendance: null };
  fx.records["s1|2026-09-12"] = { status: "SPECIAL", attendance: null };
  const m = loadSchedule(fx);
  const counts = toPlain(m.scheduleStaffMonthCounts("s1", 2026, 8));
  assert.equal(counts.OFF, 4); // 기존 오프 1 + 대휴·공휴·특휴 3
  assert.equal(counts.DAEHYU, 1); // 대휴는 별도 열에도 그대로 남는다
});

test("sortStaffByType/splitByType: 채팅 담당을 먼저, 같은 구분 안에서는 근무 시작시각순으로 둔다", () => {
  const m = loadSchedule();
  const list = [
    { id: "late", types: ["채팅"], workHours: "13:00-22:00" },
    { id: "voice", types: ["유선"], workHours: "09:00-18:00" },
    { id: "early", types: ["채팅"], workHours: "09:00-18:00" },
    { id: "none", types: [], workHours: "" }, // 시간 정보 없는 인원은 맨 뒤
  ];
  assert.deepEqual(toPlain(m.sortStaffByType(list)).map((s) => s.id), ["early", "late", "voice", "none"]);

  const split = toPlain(m.splitByType(list));
  assert.deepEqual(split.chat.map((s) => s.id), ["late", "early"]);
  assert.deepEqual(split.voice.map((s) => s.id), ["voice"]);
  assert.deepEqual(split.etc.map((s) => s.id), ["none"]);
});

test("scheduleDetectMemoCategories: '역동석'을 '동석'으로 중복 집계하지 않는다", () => {
  const m = loadSchedule();
  assert.deepEqual(toPlain(m.scheduleDetectMemoCategories("역동석 진행")), ["역동석"]);
  assert.deepEqual(toPlain(m.scheduleDetectMemoCategories("동석 진행")), ["동석"]);
  // 표기가 달라도(공백 유무) 같은 카테고리로 묶인다.
  assert.deepEqual(toPlain(m.scheduleDetectMemoCategories("선 투입")), ["선 투입"]);
  assert.deepEqual(toPlain(m.scheduleDetectMemoCategories("선투입 후 연장근무")), ["선 투입", "연장 근무"]);
  assert.deepEqual(toPlain(m.scheduleDetectMemoCategories("특이사항 없음")), []);
  assert.deepEqual(toPlain(m.scheduleDetectMemoCategories("")), []);
});

test("scheduleBuildAdjustSummary: 메모가 있는 인원만 이름순으로 모으고 날짜순으로 정리한다", () => {
  const m = loadSchedule();
  const summary = toPlain(m.scheduleBuildAdjustSummary(2026, 8));
  assert.deepEqual(summary.map((s) => s.name), ["김주간", "박야간", "이채팅"]); // 가나다순
  assert.deepEqual(summary.find((s) => s.id === "s3").entries, [{ day: 9, label: "라운딩" }]);
});

test("scheduleBuildAdjustSummary: 같은 조합이 여러 번 나오면 번갈아가며 골라준다", () => {
  const fx = buildFixture();
  fx.memos = {
    "s1|2026-09-12": "선투입 후 연장근무",
    "s1|2026-09-14": "선투입 후 연장근무",
    "s1|2026-09-20": "선투입 후 연장근무",
  };
  const m = loadSchedule(fx);
  const entries = toPlain(m.scheduleBuildAdjustSummary(2026, 8))[0].entries;
  assert.deepEqual(entries, [
    { day: 12, label: "선 투입" },
    { day: 14, label: "연장 근무" },
    { day: 20, label: "선 투입" }, // 다시 처음으로 돌아가며 번갈아 뽑음
  ]);
});

test("scheduleBuildAdjustSummary: 다른 달의 메모는 섞이지 않는다", () => {
  const fx = buildFixture();
  fx.memos["s1|2026-10-05"] = "라운딩"; // 10월 메모
  const m = loadSchedule(fx);
  const sep = toPlain(m.scheduleBuildAdjustSummary(2026, 8)).find((s) => s.id === "s1");
  assert.deepEqual(sep.entries.map((e) => e.day), [5]); // 9월 것만
  const oct = toPlain(m.scheduleBuildAdjustSummary(2026, 9)).find((s) => s.id === "s1");
  assert.deepEqual(oct.entries.map((e) => e.day), [5]);
  assert.equal(oct.entries[0].label, "라운딩");
});

test("scheduleInfoColLeftOffsets: 열을 접으면 뒤따르는 고정 열들이 그만큼 왼쪽으로 당겨진다", () => {
  const m = loadSchedule();
  const before = toPlain(m.scheduleInfoColLeftOffsets());
  assert.equal(before.lefts.nickname, 0);
  assert.equal(before.lefts.name, 92); // 닉네임 너비만큼 밀림
  assert.equal(before.lastVisibleKey, "absent");

  m.scheduleUi.manualHiddenInfoCols.add("nickname");
  const after = toPlain(m.scheduleInfoColLeftOffsets());
  assert.equal(after.lefts.nickname, null); // 접힌 열은 위치 없음
  assert.equal(after.lefts.name, 0); // 그 자리를 이름 열이 대신 차지
});

test("scheduleColLetter: 엑셀식 열 문자(A, Z, AA ...)로 바꾼다", () => {
  const m = loadSchedule();
  assert.equal(m.scheduleColLetter(1), "A");
  assert.equal(m.scheduleColLetter(26), "Z");
  assert.equal(m.scheduleColLetter(27), "AA");
  assert.equal(m.scheduleColLetter(52), "AZ");
});

/* ===================== 표 마크업 ===================== */

test("buildScheduleTableHtml: 그 달 일수만큼 날짜 열을 만들고 주말·공휴일에 색 클래스를 준다", () => {
  const m = loadSchedule();
  const html = m.buildScheduleTableHtml();
  // 날짜 열 머리글은 위(일자)·아래(요일) 두 줄이라 30일 × 2 = 60개.
  assert.equal(countMatches(html, /data-col-key="d:/), 60);
  assert.equal(html.includes(">09/01<"), true);
  assert.equal(html.includes(">09/30<"), true);
  assert.equal(html.includes(">10/01<"), false); // 다음 달은 안 그림

  // 2026년 9월의 토요일은 5·12·19·26 네 번 → 두 줄이므로 8개.
  assert.equal(countMatches(html, /wd-sat/), 8);
  // 일요일 6·13·20·27 네 번 + 공휴일로 지정한 9/16 → 다섯 번 × 두 줄 = 10개.
  assert.equal(countMatches(html, /wd-sun/), 10);
  assert.equal(html.includes("임시공휴일"), true); // 공휴일 이름은 머리글 툴팁으로
});

test("buildScheduleTableHtml: 행 순서는 관리자 → 주간(채팅→유선) → 야간이다", () => {
  const m = loadSchedule();
  const html = m.buildScheduleTableHtml();
  const rowOrder = extractAll(html, /<tr[^>]*>\s*<t[dh][^>]*data-staff-id="([^"]+)"/);
  assert.deepEqual(rowOrder, ["a1", "s2", "s1", "s3"]); // 관리자, 채팅(10시), 유선(9시), 야간
});

test("buildScheduleTableHtml: 셀에 오프·연차·지각·결근 라벨이 제자리에 들어간다", () => {
  const m = loadSchedule();
  const html = m.buildScheduleTableHtml();
  assert.equal(countMatches(html, /st-off/), 1);
  assert.equal(countMatches(html, /st-annual/), 1);
  assert.equal(countMatches(html, /st-late/), 1);
  assert.equal(countMatches(html, /st-absent/), 1);
  // 지각은 s2의 9/2 칸이어야 한다.
  assert.equal(/<td class="sch-cell st-late[^"]*"[^>]*data-staff-id="s2" data-date="2026-09-02"/.test(html), true);
});

test("buildScheduleTableHtml: 메모가 있는 칸에만 메모 표시가 붙는다", () => {
  const m = loadSchedule();
  assert.equal(countMatches(m.buildScheduleTableHtml(), /sch-memo-dot/), 3); // 픽스처의 메모 3건
  // hideMemoMarks(이미지 저장용)를 켜면 표시가 빠진다.
  assert.equal(countMatches(m.buildScheduleTableHtml(undefined, false, false, true), /sch-memo-dot/), 0);
});

test("buildScheduleTableHtml: 캡처용 표에는 입력칸과 집계 열이 들어가지 않는다", () => {
  const m = loadSchedule();
  const screen = m.buildScheduleTableHtml();
  assert.equal(countMatches(screen, /<input/) > 0, true); // 화면용엔 필요인력 입력칸이 있다

  const capture = m.buildScheduleTableHtml(undefined, true, true, true);
  assert.equal(countMatches(capture, /<input/), 0); // 이미지에 입력 요소가 찍히지 않도록
  // 근무~결근 집계 열 5개는 통째로 빠진다("근무시간"(sch-col-workhours) 열과 헷갈리지 않게 확인).
  assert.equal(countMatches(capture, /sch-col-work[^h]/), 0);
  assert.equal(capture.includes("sch-col-absent"), false);
  assert.equal(countMatches(screen, /sch-col-work[^h]/) > 0, true);
  assert.equal(capture.includes("sch-col-name"), true); // 이름 등 기본 정보 열은 그대로
});

test("buildScheduleTableHtml: 필터를 주면 그 조의 인원만 그린다", () => {
  const m = loadSchedule();
  const day = extractAll(m.buildScheduleTableHtml("DAY"), /<tr[^>]*>\s*<t[dh][^>]*data-staff-id="([^"]+)"/);
  assert.equal(day.includes("s3"), false); // 야간 인원 제외
  assert.equal(day.includes("s1") && day.includes("s2"), true);

  const night = extractAll(m.buildScheduleTableHtml("NIGHT"), /<tr[^>]*>\s*<t[dh][^>]*data-staff-id="([^"]+)"/);
  assert.deepEqual(night, ["s3"]);
});

test("buildScheduleTableHtml: 개별로 접은 날짜·인원에는 숨김 클래스가 붙는다", () => {
  const m = loadSchedule();
  assert.equal(countMatches(m.buildScheduleTableHtml(), /sch-col-hidden/), 0);

  m.scheduleUi.manualHiddenDays.add(3);
  const html = m.buildScheduleTableHtml();
  // 접은 날짜의 머리글(일자·요일 두 줄)에 숨김 클래스가 붙는다.
  assert.equal(countMatches(html, /sch-col-hidden[^"]*"[^>]*data-col-key="d:3"/), 2);
  // 인원 행의 그 날짜 칸도 전부 숨겨지고, 접지 않은 날짜 칸은 그대로다.
  assert.equal(countMatches(html, /sch-col-hidden"[^>]*data-date="2026-09-03"/), 4);
  assert.equal(countMatches(html, /sch-col-hidden"[^>]*data-date="2026-09-02"/), 0);

  m.scheduleUi.manualHiddenStaffIds.add("s1");
  assert.equal(countMatches(m.buildScheduleTableHtml(), /sch-row-hidden/), 1);
});

test("buildScheduleTableHtml: 인원 정보 칸의 특수문자는 이스케이프해서 넣는다", () => {
  const fx = buildFixture();
  fx.staff[0].name = "<b>김주간</b>";
  const m = loadSchedule(fx);
  const html = m.buildScheduleTableHtml();
  assert.equal(html.includes("<b>김주간</b>"), false);
  assert.equal(html.includes("&lt;b&gt;김주간&lt;/b&gt;"), true);
});

test("buildScheduleTableHtml: 인원 행에 그 달 집계 숫자가 그대로 실린다", () => {
  const m = loadSchedule();
  const html = m.buildScheduleTableHtml();
  // s1 행: 근무 28 / 오프 1 / 연차 1 / 대휴 0 / 결근 0
  const s1Row = html.slice(html.indexOf(`data-staff-id="s1"`));
  const nums = extractAll(s1Row.slice(0, 2000), /class="sch-info sch-col-(?:work|off|annual|daehyu|absent)[^"]*"[^>]*>(\d+)</);
  assert.deepEqual(nums, ["28", "1", "1", "0", "0"]);
});

/* ===================== 이름 메모 ===================== */

test("getScheduleNameMemo: 인원·달 단위로 저장되고, 없으면 빈 문자열이다", () => {
  const fx = buildFixture();
  fx.nameMemos = { "s1|2026-09": "9/15 퇴사 예정" };
  const m = loadSchedule(fx);
  assert.equal(m.getScheduleNameMemo("s1", 2026, 8), "9/15 퇴사 예정");
  assert.equal(m.getScheduleNameMemo("s1", 2026, 9), ""); // 다른 달엔 이어지지 않는다
  assert.equal(m.getScheduleNameMemo("s2", 2026, 8), ""); // 다른 인원 것도 아니다
});

test("getScheduleNameMemo: nameMemos 필드가 없는 예전 데이터도 에러 없이 빈 값이다", () => {
  const m = loadSchedule(); // buildFixture()에는 nameMemos가 아예 없다
  assert.equal(m.getScheduleNameMemo("s1", 2026, 8), "");
});

test("setScheduleNameMemo: 저장·수정·삭제(빈 문자열)가 되고 앞뒤 공백은 잘린다", () => {
  const m = loadSchedule();
  m.setScheduleNameMemo("s1", 2026, 8, "  수습 기간  ");
  assert.equal(m.getScheduleNameMemo("s1", 2026, 8), "수습 기간");
  m.setScheduleNameMemo("s1", 2026, 8, "수습 종료");
  assert.equal(m.getScheduleNameMemo("s1", 2026, 8), "수습 종료");
  m.setScheduleNameMemo("s1", 2026, 8, "   ");
  assert.equal(m.getScheduleNameMemo("s1", 2026, 8), "");
  assert.equal("s1|2026-09" in toPlain(m.scheduleData.nameMemos), false); // 빈 메모는 키째 지운다
});

test("setScheduleNameMemo: 이름 메모는 셀 메모(memos)와 섞이지 않는다", () => {
  const m = loadSchedule();
  const before = toPlain(m.scheduleData.memos);
  m.setScheduleNameMemo("s1", 2026, 8, "이름 메모");
  assert.deepEqual(toPlain(m.scheduleData.memos), before);
  // 가감점 취합도 셀 메모만 본다(이름 메모에 라운딩이 들어 있어도 집계되지 않는다).
  m.setScheduleNameMemo("s2", 2026, 8, "라운딩 담당");
  const s2 = toPlain(m.scheduleBuildAdjustSummary(2026, 8)).find((x) => x.id === "s2");
  assert.deepEqual(s2.entries, [{ day: 7, label: "역동석" }]);
});

test("setScheduleNameMemo: 잠긴 달에서는 저장도 삭제도 되지 않는다", () => {
  const fx = buildFixture();
  fx.nameMemos = { "s1|2026-09": "기존 메모" };
  fx.monthLocks = { "2026-09": true };
  const m = loadSchedule(fx);
  m.setScheduleNameMemo("s1", 2026, 8, "바꾸려는 메모");
  assert.equal(m.getScheduleNameMemo("s1", 2026, 8), "기존 메모");
  m.setScheduleNameMemo("s1", 2026, 8, "");
  assert.equal(m.getScheduleNameMemo("s1", 2026, 8), "기존 메모");
});

test("setScheduleNameMemo: 내용이 그대로면 되돌리기 기록을 남기지 않는다", () => {
  let undoCalls = 0;
  const m = loadSchedule();
  m.recordUndo = () => { undoCalls += 1; };
  m.setScheduleNameMemo("s1", 2026, 8, "메모");
  assert.equal(undoCalls, 1);
  m.setScheduleNameMemo("s1", 2026, 8, "메모"); // 똑같이 저장
  m.setScheduleNameMemo("s2", 2026, 8, "  "); // 없던 메모를 빈 값으로 저장
  assert.equal(undoCalls, 1);
});

test("normalizeScheduleData: nameMemos가 없거나 이상한 값이면 빈 객체로 채운다", () => {
  const m = loadSchedule();
  assert.deepEqual(toPlain(m.normalizeScheduleData({}).nameMemos), {});
  assert.deepEqual(toPlain(m.normalizeScheduleData({ nameMemos: null }).nameMemos), {});
  assert.deepEqual(toPlain(m.normalizeScheduleData({ nameMemos: { "s1|2026-09": "x" } }).nameMemos), { "s1|2026-09": "x" });
});

test("buildScheduleTableHtml: 이름 메모가 있는 인원의 이름 칸에만 표시와 툴팁이 붙는다", () => {
  const fx = buildFixture();
  fx.nameMemos = { "s2|2026-09": "수습 기간" };
  const m = loadSchedule(fx);
  const html = m.buildScheduleTableHtml();
  assert.equal(countMatches(html, /sch-memo-dot--name/), 1);
  // 표시는 s2(이채팅)의 이름 칸 안에 있고, 그 칸에 메모 툴팁이 달린다.
  const nameTd = extractAll(html, /(<td class="sch-info sch-col-name[^>]*data-staff-id="s2"[^>]*>.*?<\/td>)/)[0];
  assert.equal(nameTd.includes("sch-memo-dot--name"), true);
  assert.equal(nameTd.includes('title="수습 기간"'), true);
  assert.equal(nameTd.includes("이채팅"), true);
  // 메모가 없는 인원(s1)의 이름 칸에는 표시도 툴팁도 없다.
  const otherTd = extractAll(html, /(<td class="sch-info sch-col-name[^>]*data-staff-id="s1"[^>]*>.*?<\/td>)/)[0];
  assert.equal(otherTd.includes("sch-memo-dot"), false);
  assert.equal(otherTd.includes("title="), false);
});

test("buildScheduleTableHtml: 이름 메모 표시는 다른 달에 나타나지 않는다", () => {
  const fx = buildFixture();
  fx.nameMemos = { "s2|2026-09": "수습 기간" };
  const m = loadSchedule(fx);
  m.scheduleUi.monthIndex = 9; // 10월
  assert.equal(countMatches(m.buildScheduleTableHtml(), /sch-memo-dot--name/), 0);
});

test("buildScheduleTableHtml: 이미지 저장용(hideMemoMarks)에서는 이름 메모 표시가 빠진다", () => {
  const fx = buildFixture();
  fx.nameMemos = { "s2|2026-09": "수습 기간" };
  const m = loadSchedule(fx);
  assert.equal(countMatches(m.buildScheduleTableHtml(undefined, false, false, true), /sch-memo-dot--name/), 0);
  assert.equal(countMatches(m.buildScheduleTableHtml(undefined, true, true, true), /sch-memo-dot--name/), 0);
  assert.equal(m.buildScheduleTableHtml(undefined, true, true, true).includes("수습 기간"), false); // 메모 내용도 안 찍힌다
});

test("buildScheduleTableHtml: 이름 메모의 특수문자는 이스케이프해서 넣는다", () => {
  const fx = buildFixture();
  fx.nameMemos = { "s1|2026-09": '"><script>alert(1)</script>' };
  const m = loadSchedule(fx);
  const html = m.buildScheduleTableHtml();
  assert.equal(html.includes("<script>alert(1)</script>"), false);
  assert.equal(html.includes("&lt;script&gt;"), true);
});

test("buildScheduleTableHtml: 이름 메모가 있어도 셀 메모 표시 개수는 그대로다", () => {
  const fx = buildFixture();
  fx.nameMemos = { "s1|2026-09": "a", "s2|2026-09": "b" };
  const m = loadSchedule(fx);
  const html = m.buildScheduleTableHtml();
  // 이름 표시는 셀 표시와 같은 모양(sch-memo-dot)에 --name 수식어가 하나 더 붙은 형태다.
  // 셀 표시(수식어 없음)는 여전히 셀 메모 3건 그대로이고, 이름 표시는 이름 메모 2건이다.
  assert.equal(countMatches(html, /class="sch-memo-dot"/), 3);
  assert.equal(countMatches(html, /class="sch-memo-dot sch-memo-dot--name"/), 2);
});

/* ===================== 머리글 드래그 범위 선택 ===================== */

test("scheduleRangeBetween: 시작·끝을 포함한 범위를 돌려주고, 거꾸로 끌어도 같다", () => {
  const m = loadSchedule();
  const keys = ["d:1", "d:2", "d:3", "d:4", "d:5"];
  assert.deepEqual(toPlain(m.scheduleRangeBetween(keys, "d:2", "d:4")), ["d:2", "d:3", "d:4"]);
  assert.deepEqual(toPlain(m.scheduleRangeBetween(keys, "d:4", "d:2")), ["d:2", "d:3", "d:4"]); // 오른쪽에서 왼쪽으로
  assert.deepEqual(toPlain(m.scheduleRangeBetween(keys, "d:3", "d:3")), ["d:3"]); // 제자리
});

test("scheduleRangeBetween: 목록에 없는 key(접힌 열, 종류가 다른 key)가 끼면 빈 범위다", () => {
  const m = loadSchedule();
  assert.deepEqual(toPlain(m.scheduleRangeBetween(["d:1", "d:2"], "d:1", "d:9")), []);
  assert.deepEqual(toPlain(m.scheduleRangeBetween(["d:1", "d:2"], "d:1", "i:name")), []);
});

test("scheduleVisibleColKeys: 날짜 열은 그 달 일수만큼, 접은 날짜는 빠진다", () => {
  const m = loadSchedule();
  const all = toPlain(m.scheduleVisibleColKeys("d:"));
  assert.equal(all.length, 30); // 9월
  assert.equal(all[0], "d:1");
  assert.equal(all[29], "d:30");
  m.scheduleUi.manualHiddenDays.add(3);
  m.scheduleUi.colGroups.push({ id: "g1", start: 10, end: 12, collapsed: true }); // 접힌 열 그룹
  const now = toPlain(m.scheduleVisibleColKeys("d:"));
  assert.equal(now.includes("d:3"), false);
  assert.equal([10, 11, 12].some((d) => now.includes(`d:${d}`)), false);
  assert.equal(now.length, 26);
  // 범위는 접힌 열을 건너뛰고 보이는 열만 잡는다: 2~4 사이에서 3이 접혀 있으면 2, 4만.
  assert.deepEqual(toPlain(m.scheduleRangeBetween(now, "d:2", "d:4")), ["d:2", "d:4"]);
});

test("scheduleVisibleColKeys: 인원 정보 열은 접은 열을 빼고 표 순서대로 준다", () => {
  const m = loadSchedule();
  assert.deepEqual(toPlain(m.scheduleVisibleColKeys("i:")).slice(0, 3), ["i:nickname", "i:name", "i:empno"]);
  m.scheduleUi.manualHiddenInfoCols.add("name");
  assert.deepEqual(toPlain(m.scheduleVisibleColKeys("i:")).slice(0, 3), ["i:nickname", "i:empno", "i:hiredate"]);
});
