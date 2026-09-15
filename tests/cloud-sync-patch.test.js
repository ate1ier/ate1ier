// tests/cloud-sync-patch.test.js
// js/01b-cloud-sync-core.js의 부분 업데이트(patch) 분해 로직(_diffToOps) 테스트.
//
// "바뀐 자리만 서버로 보내기"는 잘못 분해하면 데이터가 조용히 어긋나는(화면엔
// 멀쩡해 보이는) 종류의 버그가 나는 곳이다. 그래서 "어떤 경우에 분해를 포기하고
// 통째로 보내는지"까지 함께 고정해둔다 — 폴백이 살아 있어야 안전하기 때문.
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { createSandbox, loadIntoContext, toPlain } = require("./helpers/load-source");
const { createFakeDocument, createMemoryLocalStorage } = require("./helpers/fake-dom");

function loadSyncCore() {
  const sandbox = createSandbox({
    today: new Date(2026, 8, 15),
    window: {
      supabase: { createClient: () => ({ from: () => ({}), channel: () => ({ on: () => ({ subscribe: () => {} }) }), auth: {} }) },
      addEventListener: () => {},
    },
    document: createFakeDocument(),
    localStorage: createMemoryLocalStorage(),
    setTimeout: () => 0,
    clearTimeout: () => {},
    setInterval: () => 0,
  });
  loadIntoContext(sandbox, ["js/01b-cloud-sync-core.js"]);
  return sandbox;
}

// 편의 함수: 분해 성공 여부와 만들어진 patch 목록을 함께 돌려준다.
function diff(m, oldVal, newVal) {
  const ops = [];
  const ok = m._diffToOps(oldVal, newVal, [], ops);
  return { ok, ops: toPlain(ops) };
}

test("_diffToOps: 바뀐 곳이 없으면 patch를 하나도 만들지 않는다", () => {
  const m = loadSyncCore();
  const r = diff(m, { a: { b: 1 } }, { a: { b: 1 } });
  assert.equal(r.ok, true);
  assert.deepEqual(r.ops, []);
});

test("_diffToOps: 깊이 들어있는 값 하나만 바뀌면 그 자리 경로 하나만 뽑는다", () => {
  const m = loadSyncCore();
  const r = diff(m, { scores: { "a1|2026-09": 80 }, memo: "x" }, { scores: { "a1|2026-09": 95 }, memo: "x" });
  assert.equal(r.ok, true);
  assert.deepEqual(r.ops, [{ path: ["scores", "a1|2026-09"], value: 95 }]);
});

test("_diffToOps: 키를 새로 넣으면 추가로, 지우면 remove 표시로 남긴다", () => {
  const m = loadSyncCore();
  const added = diff(m, { a: 1 }, { a: 1, b: 2 });
  assert.deepEqual(added.ops, [{ path: ["b"], value: 2 }]);

  const removed = diff(m, { a: 1, b: 2 }, { a: 1 });
  assert.deepEqual(removed.ops, [{ path: ["b"], remove: true }]);
});

test("_diffToOps: id 목록의 항목 내용만 바뀌면 그 항목 안쪽만 patch한다", () => {
  const m = loadSyncCore();
  const oldVal = [{ id: "x", done: false }, { id: "y", done: false }];
  const newVal = [{ id: "x", done: false }, { id: "y", done: true }];
  const r = diff(m, oldVal, newVal);
  assert.equal(r.ok, true);
  assert.deepEqual(r.ops, [{ path: [1, "done"], value: true }]); // 두 번째 항목의 done만
});

test("_diffToOps: 항목이 추가·삭제되거나 순서가 바뀌면 분해를 포기한다(통째로 저장으로 폴백)", () => {
  const m = loadSyncCore();
  const base = [{ id: 1, v: 1 }, { id: 2, v: 1 }];
  assert.equal(diff(m, base, [{ id: 2, v: 1 }, { id: 1, v: 1 }]).ok, false); // 순서 변경
  assert.equal(diff(m, base, [{ id: 1, v: 1 }]).ok, false); // 삭제
  assert.equal(diff(m, base, base.concat([{ id: 3, v: 1 }])).ok, false); // 추가
});

test("_diffToOps: 최상위 값 자체가 문자열/숫자면 쪼갤 안쪽이 없어 분해를 포기한다", () => {
  const m = loadSyncCore();
  assert.equal(diff(m, "이전", "이후").ok, false);
  assert.equal(diff(m, 1, 2).ok, false);
});

test("_diffToOps: 순서만 있는 배열은 그 자리 전체를 하나의 patch로 통째로 바꾼다", () => {
  const m = loadSyncCore();
  const r = diff(m, { order: ["a", "b"] }, { order: ["b", "a"] });
  assert.equal(r.ok, true);
  assert.deepEqual(r.ops, [{ path: ["order"], value: ["b", "a"] }]);
});

test("_diffToOps: 바뀐 자리가 너무 많으면(사실상 전체 교체) 분해를 포기한다", () => {
  const m = loadSyncCore();
  const oldVal = {};
  const newVal = {};
  for (let i = 0; i < 40; i++) { oldVal["k" + i] = i; newVal["k" + i] = i + 1; }
  assert.equal(diff(m, oldVal, newVal).ok, false); // 상한(30개)을 넘김

  // 상한 안쪽이면 정상적으로 분해된다.
  const small = {};
  const smallNew = {};
  for (let i = 0; i < 10; i++) { small["k" + i] = i; smallNew["k" + i] = i + 1; }
  const r = diff(m, small, smallNew);
  assert.equal(r.ok, true);
  assert.equal(r.ops.length, 10);
});
