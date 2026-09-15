// tests/helpers/fake-worksheet.js
//
// ExcelJS의 Worksheet를 실제로 만들지 않고도 js/05c-qa-excel-import.js의
// 파싱 함수들이 필요로 하는 최소한의 모양(getRow/getCell/isMerged/master,
// model.merges, rowCount/columnCount)만 흉내 낸 가짜 워크시트를 만든다.
//
// values: { "행,열": 값 } 형태로 셀 값을 지정 (예: "3,2": "구분")
// merges: ["B2:B4", "C3:D3"] 처럼 실제 엑셀 병합 범위 문자열 배열
function colNumToLetters(n) {
  let s = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}
function colLetterToNum(letters) {
  let n = 0;
  for (let i = 0; i < letters.length; i++) n = n * 26 + (letters.charCodeAt(i) - 64);
  return n;
}
function parseMergeSpec(rangeStr) {
  const m = /^([A-Z]+)(\d+):([A-Z]+)(\d+)$/.exec(rangeStr);
  if (!m) throw new Error(`잘못된 병합 범위 문자열: ${rangeStr}`);
  return { c1: colLetterToNum(m[1]), r1: parseInt(m[2], 10), c2: colLetterToNum(m[3]), r2: parseInt(m[4], 10) };
}

function buildWorksheet({ rowCount, columnCount, values, merges }) {
  const cellValues = values || {};
  const mergeRanges = (merges || []).map(parseMergeSpec);
  function findMerge(r, c) {
    return mergeRanges.find((m) => r >= m.r1 && r <= m.r2 && c >= m.c1 && c <= m.c2);
  }
  const cache = new Map();
  function getCellObj(r, c) {
    const key = `${r},${c}`;
    if (cache.has(key)) return cache.get(key);
    const hasValue = Object.prototype.hasOwnProperty.call(cellValues, key);
    const obj = { value: hasValue ? cellValues[key] : null, isMerged: false, master: undefined };
    cache.set(key, obj);
    const mg = findMerge(r, c);
    if (mg) {
      obj.isMerged = true;
      obj.master = (r === mg.r1 && c === mg.c1) ? obj : getCellObj(mg.r1, mg.c1);
    }
    return obj;
  }
  return {
    rowCount,
    columnCount,
    model: { merges: (merges || []).slice() },
    getRow(r) {
      return { getCell: (c) => getCellObj(r, c) };
    },
  };
}

module.exports = { buildWorksheet, colNumToLetters };
