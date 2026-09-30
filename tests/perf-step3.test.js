// tests/perf-step3.test.js
// 성능 3단계: renderApp()이 열려 있는 창 전부를 매번 다시 그리지 않고,
// 맨 앞 창만 즉시 / 내려간 창은 표시만 / 뒤에 보이는 창은 미뤄서 그리는지 고정해둔다.
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ROOT = path.join(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

// js/09a-home-desktop.js에서 3단계 블록만 잘라 가짜 환경에서 실행한다.
function loadStep3() {
  const src = read("js/09a-home-desktop.js");
  const block = src.slice(src.indexOf("function hdTopVisiblePageNow"), src.indexOf("// 창 열림/내림/최대화 상태와"));
  assert.ok(block.includes("function renderHomeDesktopWindows"), "3단계 블록을 못 찾음");

  const timers = [];
  const frames = {};
  const rendered = [];
  const bodyClasses = new Set();
  const docListeners = {};
  const env = {
    CURRENT_ACCOUNT_IS_MASTER: false,
    hdWin: { order: [], state: {}, dirty: {} },
    syncCalls: 0,
    syncAppWindows() { env.syncCalls++; },
    hdPageRenderer(page) { return page === "nope" ? null : (inner) => { rendered.push(page); inner._n = (inner._n || 0) + 1; }; },
    document: {
      getElementById: (id) => frames[id.replace("app-win-", "")] || null,
      addEventListener: (t, fn) => { (docListeners[t] = docListeners[t] || []).push(fn); },
      body: { classList: { contains: (c) => bodyClasses.has(c) } },
    },
    window: { addEventListener() {} },
    setTimeout: (fn, ms) => { timers.push({ fn, ms }); return timers.length; },
    clearTimeout() {},
  };
  const fn = new Function(...Object.keys(env), block + "; return { renderHomeDesktopWindows, hdFlushDirtyWindows, hdNeedsRender, hdRenderWindow, hdTopVisiblePageNow };");
  const api = fn(...Object.values(env));
  const open = (page, st) => {
    const inner = { classList: { toggle() {} }, scrollTop: 5 };
    frames[page] = { querySelector: () => inner, inner };
    env.hdWin.order.push(page);
    env.hdWin.state[page] = Object.assign({ minimized: false }, st);
    return frames[page];
  };
  return { api, env, timers, rendered, bodyClasses, docListeners, open, frames };
}

test("맨 앞 창은 즉시, 이미 그려진 뒤쪽 창은 미뤄서 그린다", () => {
  const t = loadStep3();
  t.open("calendar"); t.open("schedule"); // schedule이 맨 앞
  t.api.renderHomeDesktopWindows();        // 처음 호출: 둘 다 처음 그리는 창이라 즉시
  assert.deepEqual(t.rendered.sort(), ["calendar", "schedule"]);
  t.rendered.length = 0;
  t.api.renderHomeDesktopWindows();        // 두 번째: 맨 앞만 즉시
  assert.deepEqual(t.rendered, ["schedule"]);
  assert.equal(t.env.hdWin.dirty.calendar, true, "뒤 창은 dirty 표시");
  assert.equal(t.timers.length, 1, "미룬 렌더 예약 1개");
  assert.equal(t.timers[0].ms, 150);
});

test("여러 번 불려도 미룬 렌더는 한 번만 예약하고, 실행하면 뒤 창이 최신이 된다", () => {
  const t = loadStep3();
  t.open("calendar"); t.open("schedule");
  t.api.renderHomeDesktopWindows(); t.rendered.length = 0;
  for (let i = 0; i < 5; i++) t.api.renderHomeDesktopWindows();
  assert.equal(t.timers.length, 1);
  t.rendered.length = 0;
  t.timers.shift().fn();
  assert.deepEqual(t.rendered, ["calendar"]);
  assert.equal(t.env.hdWin.dirty.calendar, undefined);
});

test("내려간(최소화) 창은 그리지 않고 표시만 하며 예약도 안 한다", () => {
  const t = loadStep3();
  t.open("calendar", { minimized: true }); t.open("schedule");
  t.api.renderHomeDesktopWindows();
  assert.deepEqual(t.rendered, ["schedule"], "처음이어도 최소화 창은 안 그림");
  t.rendered.length = 0;
  t.api.renderHomeDesktopWindows();
  assert.equal(t.env.hdWin.dirty.calendar, true);
  assert.equal(t.timers.length, 0);
  // 다시 펼치면(minimized=false) 필요 판정이 켜지고, 앞으로 올라오면 즉시 그린다
  t.env.hdWin.state.calendar.minimized = false;
  assert.equal(t.api.hdNeedsRender("calendar"), true);
  t.env.hdWin.order = ["schedule", "calendar"];
  t.rendered.length = 0;
  t.api.renderHomeDesktopWindows();
  assert.deepEqual(t.rendered, ["calendar"]);
});

test("맨 앞 창 판단은 state.page가 아니라 창 순서(hdWin.order)를 따른다", () => {
  const t = loadStep3();
  t.open("notes"); t.open("agents", { minimized: true });
  assert.equal(t.api.hdTopVisiblePageNow(), "notes", "맨 위가 내려가 있으면 그 아래 보이는 창");
});

test("끌기/크기 조절 중이거나 마우스를 누르고 있으면 미룬 렌더를 더 뒤로 미룬다", () => {
  const t = loadStep3();
  t.open("calendar"); t.open("schedule");
  t.api.renderHomeDesktopWindows(); t.api.renderHomeDesktopWindows(); t.rendered.length = 0;
  t.bodyClasses.add("hd-interacting");
  t.timers.shift().fn();
  assert.deepEqual(t.rendered, [], "끄는 중엔 안 그림");
  assert.equal(t.timers.length, 1, "다시 예약");
  t.bodyClasses.delete("hd-interacting");
  t.docListeners.pointerdown[0]();             // 마우스 누름
  t.timers.shift().fn();
  assert.deepEqual(t.rendered, [], "누르는 중엔 안 그림(클릭이 끊기지 않게)");
  t.docListeners.pointerup[0]();
  t.timers.shift().fn();
  assert.deepEqual(t.rendered, ["calendar"]);
});

test("렌더러가 없는 창은 무한 재예약을 만들지 않는다", () => {
  const t = loadStep3();
  t.open("nope"); t.open("schedule");
  t.api.renderHomeDesktopWindows(); t.api.renderHomeDesktopWindows();
  assert.equal(t.api.hdNeedsRender("nope"), false);
});

test("홈 위젯: 내용이 같으면 다시 안 그리고, 카드를 끌어 옮긴 뒤엔 강제로 다시 그린다", () => {
  const js = read("js/08-home.js");
  assert.ok(js.includes("root._hwHtml === homeWidgetHtml && root.firstChild"));
  const drop = js.slice(js.indexOf("saveHomeLayout(newLayout);"), js.indexOf("saveHomeLayout(newLayout);") + 260);
  assert.ok(drop.includes("_hwHtml = null"));
});

test("메뉴(nav)·바탕화면 폴더: 같으면 건너뛰고, 이름 바꾸기/끌기 시작 때 캐시를 비운다", () => {
  assert.ok(read("js/09-nav.js").includes("nav._navHtml === navHtml"));
  const f = read("js/09b-desktop-folders.js");
  assert.ok(f.includes("layer._dfHtml !== foldersHtml"));
  assert.equal((f.match(/_dfHtml = null/g) || []).length, 2);
});

test("빌드 결과물(app.js)에 반영돼 있다", () => {
  const app = read("app.js");
  assert.ok(app.includes("hdFlushDirtyWindows"), "app.js에 미반영 — node build.js 필요");
  assert.ok(app.includes("_hwHtml"), "app.js에 미반영 — node build.js 필요");
});
