// tests/common-utils.test.js
// js/01f-settings-menu-utils.js의 공용 유틸(esc, pad2, paginateList) 테스트.
//
// esc()는 화면을 그리는 거의 모든 코드가 쓰는 함수라, 여기가 어긋나면 모든
// 화면이 한꺼번에 영향을 받는다. 특히 이 앱은 태그 사이뿐 아니라
// value="${esc(...)}" · title="${esc(...)}" 처럼 속성값 안에서도 esc()를 쓰기
// 때문에, 따옴표까지 확실히 막는지 고정해둔다.
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { createSandbox, loadIntoContext, toPlain } = require("./helpers/load-source");
const { createFakeDocument } = require("./helpers/fake-dom");

function loadUtils() {
  const sandbox = createSandbox({
    document: createFakeDocument(),
    setTimeout: () => 0,
    clearTimeout: () => {},
  });
  loadIntoContext(sandbox, ["js/01f-settings-menu-utils.js"]);
  return sandbox;
}

test("esc: HTML 특수문자를 모두 치환한다(따옴표 포함)", () => {
  const m = loadUtils();
  assert.equal(m.esc("<b>굵게</b>"), "&lt;b&gt;굵게&lt;/b&gt;");
  assert.equal(m.esc("a & b"), "a &amp; b");
  assert.equal(m.esc(`큰"따옴표`), "큰&quot;따옴표");
  assert.equal(m.esc("작은'따옴표"), "작은&#39;따옴표");
});

test("esc: 속성값 안에 넣어도 속성이 끊기지 않는다", () => {
  const m = loadUtils();
  // 예전 방식(따옴표를 그대로 두는 방식)에서는 아래 제목 하나로 value 속성이
  // 끊기면서 onerror=... 가 진짜 속성으로 들어가 버렸다.
  const title = `회의" onerror="alert(1)`;
  const html = `<input value="${m.esc(title)}">`;
  assert.equal(html.includes(`onerror="`), false);
  assert.equal(html, `<input value="회의&quot; onerror=&quot;alert(1)">`);
});

test("esc: 빈 값·null·숫자도 안전하게 문자열로 바꾼다", () => {
  const m = loadUtils();
  assert.equal(m.esc(null), "");
  assert.equal(m.esc(undefined), "");
  assert.equal(m.esc(0), "0");
  assert.equal(m.esc(""), "");
});

test("esc: 이미 이스케이프된 문자열을 두 번 넣으면 & 가 한 번 더 바뀐다(이중 적용 주의)", () => {
  const m = loadUtils();
  // 의도된 동작이지만 실수하기 쉬운 지점이라 명시해둔다 — esc()는 한 번만 쓸 것.
  assert.equal(m.esc(m.esc("<b>")), "&amp;lt;b&amp;gt;");
});

test("pad2: 한 자리 숫자를 0으로 채운다", () => {
  const m = loadUtils();
  assert.equal(m.pad2(1), "01");
  assert.equal(m.pad2(12), "12");
});

test("paginateList: 범위를 벗어난 페이지 번호를 안쪽으로 보정한다", () => {
  const m = loadUtils();
  const list = Array.from({ length: 30 }, (_, i) => i + 1);
  const first = toPlain(m.paginateList(list, 1));
  assert.equal(first.page, 1);
  assert.equal(first.totalPages, 3); // 페이지당 12개
  assert.equal(first.items.length, 12);

  assert.equal(toPlain(m.paginateList(list, 99)).page, 3); // 너무 큰 번호 → 마지막 페이지
  assert.equal(toPlain(m.paginateList(list, 0)).page, 1); // 0이나 없는 값 → 첫 페이지
  assert.equal(toPlain(m.paginateList(list, 3)).items.length, 6); // 마지막 페이지는 남은 개수만
  assert.equal(toPlain(m.paginateList([], 1)).totalPages, 1); // 빈 목록도 1페이지
});
