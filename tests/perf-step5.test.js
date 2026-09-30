// tests/perf-step5.test.js
// 성능 5단계: 그래픽 효과 끔/약/강 3단계, 처음 실행 프레임 측정 자동 조절, 기기별 저장, 그림자·배경화면 정리를 고정해둔다.
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ROOT = path.join(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

// 01d의 효과 단계 블록만 잘라 가짜 document/localStorage로 실행한다.
function loadFx(opts = {}) {
  const src = read("js/01d-undo-theme-dock.js");
  const a = src.indexOf("const FX_KEY");
  const b = src.indexOf("/* ===================== 데스크톱 독(Dock)");
  assert.ok(a > 0 && b > a, "fx 블록을 찾지 못함");
  const store = Object.assign({}, opts.store || {});
  const attrs = {};
  const calls = { renderNav: 0, banners: [], raf: 0, listeners: {}, rafCbs: [] };
  const env = {
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
    },
    document: {
      hidden: false,
      documentElement: {
        setAttribute: (k, v) => { attrs[k] = v; },
        getAttribute: (k) => (k in attrs ? attrs[k] : null),
        removeAttribute: (k) => { delete attrs[k]; },
      },
      addEventListener(ev, fn) { (calls.listeners[ev] = calls.listeners[ev] || []).push(fn); }, removeEventListener() {},
      createElement: () => ({ style: {}, setAttribute() {}, appendChild() {}, remove() {}, set innerHTML(v) { calls.banners.push(v); } }),
      getElementById: () => ({ set onclick(f) {} }),
      body: { appendChild() {} },
    },
    window: { matchMedia: () => ({ matches: !!opts.osReduce }), innerWidth: 1200, innerHeight: 800 },
    renderNav() { calls.renderNav++; },
    _liveBannerWrap: () => ({ appendChild() {} }),
    requestAnimationFrame(cb) { calls.raf++; calls.rafCbs.push(cb); },
  };
  const api = new Function(...Object.keys(env),
    src.slice(a, b) + "; return { getFxLevel, setFxLevel, isFxReduced, setFxReduced, applyFxLevel, fxDecideLevel, maybeSuggestLowGraphicsMode };")(...Object.values(env));
  return { api, store, attrs, calls };
}

test("저장값 → 단계: 기존 \"1\"(끔)/\"0\"(강) 그대로, \"2\"는 약", () => {
  assert.equal(loadFx({ store: { "app-fx-reduced": "1" } }).attrs["data-fx"], "reduced");
  assert.equal(loadFx({ store: { "app-fx-reduced": "0" } }).attrs["data-fx"], "normal");
  const lite = loadFx({ store: { "app-fx-reduced": "2" } });
  assert.equal(lite.attrs["data-fx"], "lite");
  assert.equal(lite.api.getFxLevel(), "lite");
  assert.equal(lite.api.isFxReduced(), false, "약은 '끔'이 아니다");
  assert.equal(loadFx().attrs["data-fx"], undefined, "한 번도 안 골랐으면 속성 없음");
});

test("setFxLevel: 저장·속성이 맞고, 직접 고르면 자동 표시가 지워진다", () => {
  const t = loadFx({ store: { "app-fx-auto": "1" } });
  t.api.setFxLevel("lite");
  assert.equal(t.store["app-fx-reduced"], "2");
  assert.equal(t.attrs["data-fx"], "lite");
  assert.equal(t.store["app-fx-auto"], undefined);
  t.api.setFxLevel("off", { auto: true });
  assert.equal(t.store["app-fx-reduced"], "1");
  t.api.setFxReduced(false); // 예전 API 호환
  assert.equal(t.store["app-fx-reduced"], "0");
  assert.equal(t.api.getFxLevel(), "full");
});

test("OS 동작 줄이기: 속성이 없으면 끔으로 보고, 명시적으로 고르면 그 선택이 이긴다", () => {
  assert.equal(loadFx({ osReduce: true }).api.getFxLevel(), "off");
  assert.equal(loadFx({ osReduce: true, store: { "app-fx-reduced": "2" } }).api.getFxLevel(), "lite");
});

test("fxDecideLevel: 프레임 간격 중앙값으로 강/약/끔을 정한다", () => {
  const { api } = loadFx();
  const arr = (ms, n = 90) => Array.from({ length: n }, () => ms);
  assert.equal(api.fxDecideLevel(arr(16.7)), "full");
  assert.equal(api.fxDecideLevel(arr(8.3, 200)), "full");
  assert.equal(api.fxDecideLevel(arr(33)), "lite");
  assert.equal(api.fxDecideLevel(arr(60)), "off");
  assert.equal(api.fxDecideLevel(arr(16.7, 10)), null, "표본 부족은 판단 보류");
  assert.equal(api.fxDecideLevel(null), null);
  // 앞 3프레임의 시작 지연은 무시한다
  assert.equal(api.fxDecideLevel([300, 250, 200, ...arr(16.7)]), "full");
  // 중앙값이 정상이면 가끔 크게 끊겨도(시작 직후 렌더링 등) 낮추지 않는다
  const janky = [...arr(16.7, 70), ...arr(120, 20)];
  assert.equal(api.fxDecideLevel(janky), "full");
});

test("자동 측정은 이미 고른/측정한 기기와 OS 동작 줄이기 사용자를 건너뛰고, 새 기기에서는 시작한다", () => {
  for (const o of [{ store: { "app-fx-reduced": "0" } }, { store: { "app-fx-probed": "1" } }, { osReduce: true }]) {
    const t = loadFx(o);
    t.api.maybeSuggestLowGraphicsMode();
    assert.equal(t.calls.raf, 0, "측정이 시작되면 안 됨: " + JSON.stringify(o));
  }
  const fresh = loadFx();
  fresh.api.maybeSuggestLowGraphicsMode();
  assert.ok(fresh.calls.raf >= 1, "새 기기는 측정을 시작해야 함");
});

test("자동 측정 중 사용자 입력이 있으면 측정을 버리고 아무것도 바꾸지 않는다", () => {
  const t = loadFx();
  t.api.maybeSuggestLowGraphicsMode();
  assert.ok(t.calls.listeners.pointerdown && t.calls.listeners.keydown, "입력 감지 리스너가 있어야 함");
  t.calls.rafCbs.shift()(1000);               // 첫 프레임
  t.calls.listeners.pointerdown[0]({});       // 사용자가 클릭
  t.calls.rafCbs.shift()(1016);               // 다음 프레임에서 중단 처리
  assert.equal(t.store["app-fx-probed"], undefined, "중단되면 측정 완료로 기록하지 않는다(다음 실행 때 다시 잰다)");
  assert.equal(t.attrs["data-fx"], undefined);
});

test("효과 설정은 클라우드로 동기화하지 않는다(기기별)", () => {
  const src = read("js/01b-cloud-sync-core.js");
  const block = src.slice(src.indexOf("CLOUD_EXCLUDED_KEYS = new Set(["), src.indexOf("function isCloudSynced"));
  for (const k of ["app-fx-reduced", "app-fx-probed", "app-fx-auto"]) assert.ok(block.includes(`"${k}"`), k + " 누락");
});

test("CSS: 약 단계 정의, OS 규칙이 약을 덮지 않음, 끔에서 drop-shadow 제거", () => {
  const css = read("css/00-variables.css");
  assert.match(css, /html\[data-fx="lite"\]\s*\{[^}]*--fx-blur-scale:\s*0\.45/);
  assert.ok(!css.includes('html:not([data-fx="normal"]) *'), "OS 규칙이 lite를 덮는다");
  assert.match(css, /html\[data-fx="reduced"\] \.hd-fld-svg/);
  assert.match(read("body.html"), /_fxRaw === "2"/);
});

test("메뉴: 끔/약/강 3개 버튼", () => {
  const src = read("js/01m-status-bar-mode.js");
  for (const id of ["off", "lite", "full"]) assert.ok(src.includes(`["${id}"`), id);
  assert.ok(src.includes("setFxLevel("));
});

test("배경화면 WebP가 있고 CSS가 JPG 폴백과 함께 쓴다", () => {
  for (const f of ["home-wallpaper.webp", "home-wallpaper-light.webp"]) assert.ok(fs.statSync(path.join(ROOT, f)).size < 120 * 1024, f);
  const css = read("css/01b-home-desktop.css");
  assert.ok(css.includes('url("home-wallpaper.jpg")') && css.includes("home-wallpaper.webp") && css.includes("@supports"));
});
