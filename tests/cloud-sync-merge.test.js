// tests/cloud-sync-merge.test.js
// js/01b-cloud-sync-core.js의 3-way 자동 병합(_merge3)과 동기화 대상 판별
// (isCloudSynced) 테스트.
//
// 여기는 "두 사람이 동시에 고쳤을 때 누구 것이 남는가"를 결정하는 자리라
// 눈으로 재현하기가 가장 어렵다(기기 두 대를 동시에 놓고 타이밍을 맞춰야 함).
// 그래서 실제로 서버에 붙지 않고, 병합 함수에 base/local/remote 세 값을 직접
// 넣어 결과만 확인한다.
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { createSandbox, loadIntoContext, toPlain } = require("./helpers/load-source");
const { createFakeDocument, createMemoryLocalStorage } = require("./helpers/fake-dom");

// 01b는 최상위에서 window.supabase로 클라이언트를 만든다. 실제 네트워크는 쓰지
// 않지만, isCloudSynced()가 "클라우드가 켜져 있을 때"의 동작을 하도록 껍데기만
// 있는 가짜 클라이언트를 넣어준다.
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

// _merge3는 병합 불가 지점을 MERGE_CONFLICT 심볼로 돌려준다. 그 심볼 자체는
// 최상위 const라 sandbox 밖으로 노출되지 않으므로 타입으로 판별한다.
function isConflict(value) {
  return typeof value === "symbol";
}

test("isCloudSynced: 이 브라우저에서만 의미 있는 값은 클라우드로 보내지 않는다", () => {
  const m = loadSyncCore();
  assert.equal(m.isCloudSynced("personal-calendar:2026-09"), true); // 앱 데이터는 동기화 대상
  assert.equal(m.isCloudSynced("app-theme-mode"), false); // 화면 테마
  assert.equal(m.isCloudSynced("personal-app:session"), false); // 로그인 세션
  assert.equal(m.isCloudSynced("personal-app:last-active"), false); // 로그인 유지 하트비트
  assert.equal(m.isCloudSynced("personal-app:page"), false); // 마지막으로 보던 페이지
  // Supabase Auth 로그인 토큰은 절대 kv_store로 새어 나가면 안 된다.
  assert.equal(m.isCloudSynced("sb-zsjnuueknhfrnnfunxad-auth-token"), false);
});

test("_deepEqual: 중첩된 객체·배열을 값 기준으로 비교한다", () => {
  const m = loadSyncCore();
  assert.equal(m._deepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] }), true);
  assert.equal(m._deepEqual({ a: 1 }, { a: 1, b: undefined }), false); // 키 개수가 다르면 다름
  assert.equal(m._deepEqual([1, 2], [2, 1]), false); // 배열은 순서까지 봄
  assert.equal(m._deepEqual(null, {}), false);
});

test("_isIdArray: id를 가진 객체 목록만 '항목 단위로 합칠 수 있는 배열'로 본다", () => {
  const m = loadSyncCore();
  assert.equal(m._isIdArray([{ id: "a" }, { id: 2 }]), true);
  assert.equal(m._isIdArray([]), false); // 빈 배열은 판단 근거가 없음
  assert.equal(m._isIdArray(["a", "b"]), false); // 순서만 있는 배열(즐겨찾기 등)
  assert.equal(m._isIdArray([{ id: "a" }, { name: "b" }]), false); // 하나라도 id가 없으면 제외
});

test("_merge3: 한쪽만 고친 부분은 그쪽 값을 그대로 받는다", () => {
  const m = loadSyncCore();
  const base = { a: 1, b: 2 };
  // 나는 a만, 상대는 b만 고쳤다 → 둘 다 살아남아야 한다.
  const merged = m._merge3(base, { a: 9, b: 2 }, { a: 1, b: 8 }, "", []);
  assert.deepEqual(toPlain(merged), { a: 9, b: 8 });
});

test("_merge3: 양쪽이 같은 값으로 고쳤으면 그대로 둔다", () => {
  const m = loadSyncCore();
  const merged = m._merge3({ a: 1 }, { a: 5 }, { a: 5 }, "", []);
  assert.deepEqual(toPlain(merged), { a: 5 });
});

test("_merge3: id 목록은 항목 단위로 합치고, 상대가 새로 넣은 항목도 잃지 않는다", () => {
  const m = loadSyncCore();
  const base = [{ id: "x", v: 1 }, { id: "y", v: 1 }];
  const local = [{ id: "x", v: 2 }, { id: "y", v: 1 }]; // 내가 x를 고침
  const remote = [{ id: "x", v: 1 }, { id: "y", v: 3 }, { id: "z", v: 1 }]; // 상대가 y를 고치고 z를 추가
  const merged = toPlain(m._merge3(base, local, remote, "", []));
  assert.deepEqual(merged, [{ id: "x", v: 2 }, { id: "y", v: 3 }, { id: "z", v: 1 }]);
});

test("_merge3: 내가 지운 항목을 상대가 건드리지 않았으면 삭제를 유지한다", () => {
  const m = loadSyncCore();
  const base = [{ id: "x", v: 1 }, { id: "y", v: 1 }];
  const merged = toPlain(m._merge3(base, [{ id: "x", v: 1 }], base, "", []));
  assert.deepEqual(merged, [{ id: "x", v: 1 }]); // y 삭제가 유지됨
});

test("_merge3: 내가 지운 항목을 상대가 그 사이 고쳤다면 삭제하지 않고 살려둔다", () => {
  const m = loadSyncCore();
  const base = [{ id: "x", v: 1 }, { id: "y", v: 1 }];
  const local = [{ id: "x", v: 1 }]; // 내가 y를 지움
  const remote = [{ id: "x", v: 1 }, { id: "y", v: 9 }]; // 상대는 y를 고침
  const merged = toPlain(m._merge3(base, local, remote, "", []));
  assert.deepEqual(merged, [{ id: "x", v: 1 }, { id: "y", v: 9 }]); // 남의 수정이 사라지지 않음
});

test("_merge3: 객체 키도 같은 규칙으로 삭제·추가를 구분한다", () => {
  const m = loadSyncCore();
  const base = { keep: 1, mine: 1, theirs: 1 };
  const local = { keep: 1, theirs: 1, added: 7 }; // 내가 mine을 지우고 added를 넣음
  const remote = { keep: 1, mine: 1 }; // 상대가 theirs를 지움
  const merged = toPlain(m._merge3(base, local, remote, "", []));
  assert.deepEqual(merged, { keep: 1, added: 7 }); // 양쪽 삭제가 모두 반영되고, 새로 넣은 값은 남음
});

test("_merge3: 목록 안쪽 한 지점만 진짜로 겹치면 그 자리만 기록하고 나머지는 계속 합친다", () => {
  const m = loadSyncCore();
  const conflicts = [];
  const base = [{ id: "x", memo: "a", other: 1 }];
  const local = [{ id: "x", memo: "b", other: 2 }];
  const remote = [{ id: "x", memo: "c", other: 1 }];
  const merged = toPlain(m._merge3(base, local, remote, "", conflicts));
  assert.equal(isConflict(merged), false); // 전체 저장이 막히지 않는다
  assert.deepEqual(merged, [{ id: "x", memo: "b", other: 2 }]); // 겹친 자리는 내 값 우선
  assert.deepEqual(toPlain(conflicts), ["[x].memo"]); // 어디가 겹쳤는지 경로로 남는다
});

test("_merge3: 최상위 값 자체가 쪼갤 수 없는 값이면 진짜 충돌로 돌려준다", () => {
  const m = loadSyncCore();
  // 문자열처럼 항목 단위로 나눌 수 없는 값을 양쪽이 서로 다르게 고친 경우.
  assert.equal(isConflict(m._merge3("a", "b", "c", "", [])), true);
  // id 없는 배열(순서만 있는 목록)도 마찬가지.
  assert.equal(isConflict(m._merge3(["a", "b"], ["b", "a"], ["a", "c"], "", [])), true);
});

test("_merge3: base를 모르는 상태(첫 동기화)에서도 양쪽 항목을 모두 살려둔다", () => {
  const m = loadSyncCore();
  const merged = toPlain(m._merge3(undefined, [{ id: "x" }], [{ id: "y" }], "", []));
  assert.deepEqual(merged, [{ id: "x" }, { id: "y" }]);
});
