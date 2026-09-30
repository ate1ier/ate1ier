// tests/perf-step1.test.js
// 성능 1단계(css/99z-perf-step1.css + js/09a의 hd-interacting)가 빌드 결과물에 실제로 들어갔는지,
// 그리고 창 안 상시 노출 요소에 블러가 다시 살아나지 않았는지 고정해둔다.
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ROOT = path.join(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

test("99z-perf-step1.css가 css 번호순 맨 끝에 온다(다른 규칙을 덮어쓰려면 마지막이어야 함)", () => {
  const files = fs.readdirSync(path.join(ROOT, "css")).filter((f) => f.endsWith(".css")).sort();
  assert.equal(files[files.length - 1], "99z-perf-step1.css");
});

test("창 안 상시 노출 요소(툴바/사이드바/폴더창/sticky 머리글)는 backdrop-filter가 none", () => {
  const css = read("css/99z-perf-step1.css");
  for (const sel of [".mac-calendar-toolbar", ".mac-calendar-sidebar", ".dfw-toolbar", ".dfw-list-head", ".iv-month-label", ".qa-list-head"]) {
    assert.ok(css.includes(sel), sel + " 규칙이 없음");
  }
  assert.ok(/backdrop-filter:\s*none/.test(css));
});

test("창이 열리면 뒤 위젯은 blur() 대신 불투명도로 물러난다", () => {
  const css = read("css/99z-perf-step1.css");
  const m = css.match(/body\.home-desktop\.hd-win-open #wg \.wd \{[^}]*\}/);
  assert.ok(m, "hd-win-open 위젯 규칙이 없음");
  assert.ok(/filter:\s*none/.test(m[0]) && /backdrop-filter:\s*none/.test(m[0]) && /opacity:\s*0?\.62/.test(m[0]));
});

test("빌드 결과물(styles.min.css, app.js)에 반영돼 있다", () => {
  assert.ok(read("styles.min.css").includes("hd-win-open #wg .wd"), "styles.min.css에 미반영 — node build.js 필요");
  assert.ok(read("app.js").includes("hdInteractingClass"), "app.js에 미반영 — node build.js 필요");
});

test("2단계: 창 이동/크기 조절 핸들러 4곳이 rAF 래퍼를 쓰고 놓을 때 flush한다", () => {
  const js = read("js/09a-home-desktop.js");
  assert.equal((js.match(/hdRafMove\(move(SE)?Now\)/g) || []).length, 4);
  assert.equal((js.match(/move(SE)?\.flush\(\)/g) || []).length, 4);
});

test("2단계: hdRafMove는 프레임당 한 번만 적용하고 flush가 마지막 좌표를 즉시 반영한다", () => {
  const src = read("js/09a-home-desktop.js");
  const fn = src.slice(src.indexOf("function hdRafMove"), src.indexOf("// 리사이즈 중 매 프레임"));
  const queue = [];
  const sandbox = new Function("requestAnimationFrame", "cancelAnimationFrame", fn + "; return hdRafMove;")(
    (cb) => { queue.push(cb); return queue.length; }, () => { queue.length = 0; });
  const calls = [];
  const h = sandbox((v) => calls.push(v.clientX));
  h({ clientX: 1, clientY: 0 }); h({ clientX: 2, clientY: 0 }); h({ clientX: 3, clientY: 0 });
  assert.equal(queue.length, 1, "프레임당 하나만 예약");
  queue.shift()();
  assert.deepEqual(calls, [3], "마지막 좌표로 한 번만");
  h({ clientX: 9, clientY: 0 });
  h.flush();
  assert.deepEqual(calls, [3, 9], "flush는 예약된 마지막 좌표를 즉시 반영");
});

test("2단계: 상담사/면담일지 목록 측정은 리사이즈 중 미뤄진다", () => {
  assert.ok(read("js/04-agents.js").includes("hdTrailing(() => measureAndSyncAgentPageSize()"));
  assert.ok(read("js/06-interviews.js").includes("hdTrailing(() => measureAndSyncInterviewPageSize()"));
});
