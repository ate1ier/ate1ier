// tests/cloud-sync-echo.test.js
// 내가 연달아 저장했을 때(폴더 만들기 → 이름 바꾸기 → 파일 올리기), 앞선 저장의 실시간 에코가
// 뒤늦게 도착해도 "남이 고친 것"으로 오인하지 않는지 확인한다. 오인하면 화면·저장소가 옛 값으로
// 되돌아가서 바탕화면 폴더 이름이 "새 폴더"로 초기화되고 올린 파일이 사라졌다.
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { createSandbox, loadIntoContext } = require("./helpers/load-source");
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

test("연달아 저장한 것 중 앞선 저장의 에코도 내 것으로 알아본다", () => {
  const m = loadSyncCore();
  m._rememberOwnWrite("acct:a:desktop-folders:data", "T1");
  m._rememberOwnWrite("acct:a:desktop-folders:data", "T2");
  m._rememberOwnWrite("acct:a:desktop-folders:data", "T3");
  assert.equal(m._isOwnWriteEcho("acct:a:desktop-folders:data", "T1"), true);
  assert.equal(m._isOwnWriteEcho("acct:a:desktop-folders:data", "T2"), true);
  assert.equal(m._isOwnWriteEcho("acct:a:desktop-folders:data", "T3"), true);
});

test("남이 저장한 것(내가 보낸 적 없는 시각)은 에코로 취급하지 않는다", () => {
  const m = loadSyncCore();
  m._rememberOwnWrite("k", "T1");
  assert.equal(m._isOwnWriteEcho("k", "OTHER"), false);
  assert.equal(m._isOwnWriteEcho("other-key", "T1"), false);
});

test("기억하는 개수는 제한되어 있고 가장 오래된 것부터 잊는다", () => {
  const m = loadSyncCore();
  for (let i = 0; i < 80; i++) m._rememberOwnWrite("k", "T" + i);
  assert.equal(m._isOwnWriteEcho("k", "T79"), true);
  assert.equal(m._isOwnWriteEcho("k", "T0"), false);
});
