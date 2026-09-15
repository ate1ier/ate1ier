// tests/qa-excel-import.test.js
// js/05c-qa-excel-import.js의 엑셀 파싱 로직(qaParseWorksheet 등)에 대한 테스트.
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { createSandbox, loadIntoContext, toPlain } = require("./helpers/load-source");
const { buildWorksheet } = require("./helpers/fake-worksheet");

// pad2(qaParseWorksheet의 날짜 포맷팅에 필요)까지 함께 로드한다.
function loadExcelImportModule() {
  const sandbox = createSandbox();
  loadIntoContext(sandbox, ["js/01f-settings-menu-utils.js", "js/05c-qa-excel-import.js"]);
  return sandbox;
}

test("qaColLetterToNum: 엑셀 열 문자를 숫자로 변환한다", () => {
  const m = loadExcelImportModule();
  assert.equal(m.qaColLetterToNum("A"), 1);
  assert.equal(m.qaColLetterToNum("Z"), 26);
  assert.equal(m.qaColLetterToNum("AA"), 27);
});

test("qaCellRawValue: 병합 셀은 하위 셀에서 읽어도 마스터 셀 값을 반환한다", () => {
  const m = loadExcelImportModule();
  const ws = buildWorksheet({
    rowCount: 3,
    columnCount: 1,
    values: { "1,1": "총점" },
    merges: ["A1:A2"],
  });
  assert.equal(m.qaCellRawValue(ws, 1, 1), "총점"); // 마스터 셀
  assert.equal(m.qaCellRawValue(ws, 2, 1), "총점"); // 병합된 하위 셀도 같은 값
});

test("qaCellRawValue: 수식 결과(result)/서식있는 텍스트(richText)/에러 값을 안전하게 꺼낸다", () => {
  const m = loadExcelImportModule();
  const ws = buildWorksheet({
    rowCount: 1,
    columnCount: 3,
    values: {
      "1,1": { formula: "=A2+A3", result: 81.166666 },
      "1,2": { richText: [{ text: "안녕" }, { text: "하세요" }] },
      "1,3": { error: "#N/A" },
    },
  });
  assert.equal(m.qaCellRawValue(ws, 1, 1), 81.166666);
  assert.equal(m.qaCellRawValue(ws, 1, 2), "안녕하세요");
  assert.equal(m.qaCellRawValue(ws, 1, 3), null);
});

test("qaCellText: 날짜 값은 빈 문자열로, 나머지는 trim한 문자열로 바꾼다", () => {
  const m = loadExcelImportModule();
  // vm 샌드박스 안의 instanceof Date 검사를 통과하려면 반드시 그 샌드박스의
  // Date 생성자로 만들어야 한다(호스트의 Date로 만들면 다른 realm이라 걸리지 않음).
  const ws = buildWorksheet({
    rowCount: 1,
    columnCount: 2,
    values: { "1,1": new m.Date(2026, 0, 1), "1,2": "  총점  " },
  });
  assert.equal(m.qaCellText(ws, 1, 1), "");
  assert.equal(m.qaCellText(ws, 1, 2), "총점");
});

test("qaFindCell / qaFindCellContains: 정확히 일치 vs 공백 무시 포함 검색", () => {
  const m = loadExcelImportModule();
  const ws = buildWorksheet({
    rowCount: 2,
    columnCount: 2,
    values: { "1,1": "상담 ID", "2,2": "평균" },
  });
  assert.deepEqual(toPlain(m.qaFindCell(ws, "평균")), { row: 2, col: 2 });
  assert.equal(m.qaFindCell(ws, "상담ID"), null); // 띄어쓰기가 달라 정확히 일치하지 않음
  assert.deepEqual(toPlain(m.qaFindCellContains(ws, "상담ID")), { row: 1, col: 1 }); // 공백 제거 후 포함 비교라 찾아짐
});

// 실제 QA 평가 엑셀과 같은 구조(평균/총점 교차 셀, 회차별 병합 블록, 서술형
// 코멘트 병합, 상담ID·상담일)를 흉내 낸 워크시트로 qaParseWorksheet 전체를 검증한다.
test("qaParseWorksheet: 총점, 회차별 코멘트/상담ID/상담일을 올바르게 추출한다", () => {
  const m = loadExcelImportModule();
  const ws = buildWorksheet({
    rowCount: 11,
    columnCount: 5,
    values: {
      // 헤더 행
      "1,1": "상담사", "1,2": "구분", "1,3": "상담일", "1,4": "총점", "1,5": "상담ID",
      // 1차 상세표(2~4행이 "구분"열에서 세로 병합됨)
      "2,2": "1차", "2,5": "C001",
      "3,1": "[-5] 본인확인 절차", "3,3": "고객 확인 절차 누락",
      // 2차 상세표(5~6행 병합)
      "5,2": "2차", "5,5": "C002",
      "6,1": "[-3] 처리시간 준수", "6,3": "상담 시간 초과",
      // 회차 요약 행(구분/상담일/총점만 있는 행, 병합 블록 밖)
      "8,2": "1차", "8,3": new m.Date(2026, 0, 10), "8,4": 87.833333,
      "9,2": "2차", "9,3": new m.Date(2026, 0, 12), "9,4": 95,
      // 평균 행 × 총점 열 교차 셀 = 전체 점수
      "11,1": "평균", "11,4": 91.816666,
    },
    merges: ["B2:B4", "C3:D3", "B5:B6", "C6:D6"],
  });

  const result = m.qaParseWorksheet(ws);

  assert.equal(result.totalScore, 91.8); // 소수 둘째 자리에서 반올림되어 저장됨
  assert.equal(result.rounds.length, 2);

  const [round1, round2] = result.rounds;
  assert.equal(round1.label, "1차");
  assert.equal(round1.date, "2026-01-10");
  assert.equal(round1.consultId, "C001");
  assert.equal(round1.score, 87.8);
  assert.equal(round1.itemCount, 1);
  assert.deepEqual(toPlain(round1.items), [{ guideline: "본인확인 절차", feedback: "고객 확인 절차 누락" }]);

  assert.equal(round2.label, "2차");
  assert.equal(round2.date, "2026-01-12");
  assert.equal(round2.consultId, "C002");
  assert.equal(round2.score, 95);
  assert.deepEqual(toPlain(round2.items), [{ guideline: "처리시간 준수", feedback: "상담 시간 초과" }]);
});

test("qaParseWorksheet: 만점(코멘트 없음) 항목은 items에서 제외하되 itemCount는 0으로 남는다", () => {
  const m = loadExcelImportModule();
  const ws = buildWorksheet({
    rowCount: 6,
    columnCount: 5,
    values: {
      "1,1": "상담사", "1,2": "구분", "1,3": "상담일", "1,4": "총점", "1,5": "상담ID",
      "2,2": "1차", "2,5": "C001", // 2~3행 병합, 코멘트 병합 셀 자체가 없음(전부 만점)
      "4,2": "1차", "4,3": new m.Date(2026, 0, 5), "4,4": 100,
      "6,1": "평균", "6,4": 100,
    },
    merges: ["B2:B3"],
  });

  const result = m.qaParseWorksheet(ws);
  assert.equal(result.totalScore, 100);
  assert.equal(result.rounds[0].items.length, 0);
  assert.equal(result.rounds[0].itemCount, 0);
});

test("qaParseWorksheet: '평균' 또는 '총점' 칸을 못 찾으면 에러를 던진다", () => {
  const m = loadExcelImportModule();
  const ws = buildWorksheet({ rowCount: 2, columnCount: 2, values: { "1,1": "구분" } });
  assert.throws(() => m.qaParseWorksheet(ws), /'평균'.*'총점'.*찾지 못했어요/);
});

test("qaParseWorksheet: 평균×총점 교차 칸 값이 숫자가 아니면 에러를 던진다", () => {
  const m = loadExcelImportModule();
  // "평균"이 1행, "총점"이 2열 → 교차 셀(1,2)은 "총점" 텍스트 자신이라 숫자가 아님
  const ws = buildWorksheet({ rowCount: 1, columnCount: 2, values: { "1,1": "평균", "1,2": "총점" } });
  assert.throws(() => m.qaParseWorksheet(ws), /숫자가 아니에요/);
});
