// tests/perf-step4.test.js
// 성능 4단계: 스케줄 표는 바뀐 행(<tr>)만 교체하고, QA 점수 수정은 통계 카드 + 바뀐 행만 갱신하는지 고정해둔다.
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ROOT = path.join(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

// 07a5에서 행 분해/패치 함수만 잘라 최소한의 가짜 DOM으로 실행한다.
function loadSchedulePatch() {
  const src = read("js/07a5-schedule-log-capture.js");
  const block = src.slice(src.indexOf("function scheduleSplitRows"), src.indexOf("function updateScheduleTableArea"));
  const calls = { handlers: 0, header: 0, copied: 0 };
  const replaced = [];
  const makeTr = (html) => ({ html, closest() { return null; }, replaceWith(n) { replaced.push([this.html, n.html]); } });
  const env = {
    document: {
      createElement: () => {
        const tpl = { content: { querySelector: () => makeTr(tpl._html.replace(/^<table><tbody>|<\/tbody><\/table>$/g, "")) } };
        Object.defineProperty(tpl, "innerHTML", { set(v) { tpl._html = v; } });
        return tpl;
      },
    },
    attachScheduleElementHandlers() { calls.handlers++; },
    scheduleApplyHeaderSelectionHighlight() { calls.header++; },
    scheduleApplyCopiedOutline() { calls.copied++; },
  };
  const api = new Function(...Object.keys(env), block + "; return { scheduleSplitRows, schedulePatchTableRows };")(...Object.values(env));
  const area = (rows, extra) => {
    const trs = rows.map(makeTr);
    return Object.assign({
      querySelector: (s) => (s === ".schedule-table-wrap" ? {} : null),
      querySelectorAll: (s) => (s === "tr" ? trs : []),
      trs,
    }, extra);
  };
  return { api, calls, replaced, area };
}

const table = (rows, tail = "</tbody></table>") =>
  "<table><thead>" + rows[0] + "</thead><tbody>" + rows.slice(1).join("") + tail;
const R = (n, v) => `<tr class="r${n}"><td>${v}</td></tr>`;

test("scheduleSplitRows: <tr> 단위로 나누고 앞뒤 조각을 보존한다", () => {
  const t = loadSchedulePatch();
  const html = table([R(0, "h"), R(1, "a"), R(2, "b")]);
  const s = t.api.scheduleSplitRows(html);
  assert.equal(s.rows.length, 3);
  assert.equal(s.rows[1], R(1, "a"));
  assert.equal(s.tail, "</tbody></table>");
  assert.equal(s.pre[0], "<table><thead>");
  assert.equal(s.pre[1], "</thead><tbody>");
  // 이어붙이면 원본 그대로
  const back = s.rows.map((r, i) => s.pre[i] + r).join("") + s.tail;
  assert.equal(back, html);
});

test("schedulePatchTableRows: 달라진 행만 교체하고 새 행에만 핸들러를 붙인다", () => {
  const t = loadSchedulePatch();
  const prev = t.api.scheduleSplitRows(table([R(0, "h"), R(1, "a"), R(2, "b"), R(3, "c"), R(4, "d"), R(5, "e")]));
  const next = t.api.scheduleSplitRows(table([R(0, "h"), R(1, "a"), R(2, "B"), R(3, "c"), R(4, "d"), R(5, "e")]));
  const ok = t.api.schedulePatchTableRows(t.area(prev.rows), prev, next);
  assert.equal(ok, true);
  assert.equal(t.replaced.length, 1);
  assert.equal(t.replaced[0][0], R(2, "b"));
  assert.equal(t.replaced[0][1], R(2, "B"));
  assert.equal(t.calls.handlers, 1);
  assert.equal(t.calls.header, 1);
  assert.equal(t.calls.copied, 1);
});

test("schedulePatchTableRows: 행 수/머리글/꼬리가 다르면 false(통째로 다시 그림)", () => {
  const t = loadSchedulePatch();
  const base = t.api.scheduleSplitRows(table([R(0, "h"), R(1, "a"), R(2, "b")]));
  const moreRows = t.api.scheduleSplitRows(table([R(0, "h"), R(1, "a"), R(2, "b"), R(3, "c")]));
  const otherPre = t.api.scheduleSplitRows(table([R(0, "h"), R(1, "a"), R(2, "b")]).replace("<thead>", "<thead class=\"x\">"));
  const otherTail = t.api.scheduleSplitRows(table([R(0, "h"), R(1, "a"), R(2, "b")], "</tbody></table><p>x</p>"));
  assert.equal(t.api.schedulePatchTableRows(t.area(base.rows), base, moreRows), false);
  assert.equal(t.api.schedulePatchTableRows(t.area(base.rows), base, otherPre), false);
  assert.equal(t.api.schedulePatchTableRows(t.area(base.rows), base, otherTail), false);
  assert.equal(t.api.schedulePatchTableRows(t.area(base.rows), null, base), false, "처음(지난 값 없음)엔 통째로");
  assert.equal(t.replaced.length, 0);
});

test("schedulePatchTableRows: 대부분 바뀌면 통째로 그리는 쪽이 더 빠르므로 false", () => {
  const t = loadSchedulePatch();
  const prev = t.api.scheduleSplitRows(table([R(0, "h"), R(1, "a"), R(2, "b"), R(3, "c")]));
  const next = t.api.scheduleSplitRows(table([R(0, "H"), R(1, "A"), R(2, "B"), R(3, "c")]));
  assert.equal(t.api.schedulePatchTableRows(t.area(prev.rows), prev, next), false);
});

test("schedulePatchTableRows: DOM의 <tr> 개수가 다르면 안전하게 false", () => {
  const t = loadSchedulePatch();
  const prev = t.api.scheduleSplitRows(table([R(0, "h"), R(1, "a"), R(2, "b")]));
  const next = t.api.scheduleSplitRows(table([R(0, "h"), R(1, "a"), R(2, "B")]));
  assert.equal(t.api.schedulePatchTableRows(t.area(prev.rows.slice(0, 2)), prev, next), false);
});

test("스케줄: 편집 중인 칸·거부된 필요인력 입력이 있는 행은 문자열이 같아도 교체하도록 코드가 있다", () => {
  const js = read("js/07a5-schedule-log-capture.js");
  assert.ok(js.includes(".sch-cell--editing, .sch-cell-input"));
  assert.ok(js.includes("el.value === el.defaultValue"));
});

test("스케줄: 이벤트 핸들러가 요소용/영역용으로 나뉘고, 필요인력 입력은 renderApp 대신 표만 갱신한다", () => {
  const js = read("js/07a6-schedule-cell-edit.js");
  assert.ok(js.includes("function attachScheduleElementHandlers(root)"));
  const area = js.slice(js.indexOf("function attachScheduleTableHandlers"));
  assert.ok(/attachScheduleElementHandlers\(root\);\s*root\.onmouseover/.test(area));
  assert.ok(js.includes("updateScheduleTableArea(); // 성능 4단계"));
  assert.equal((js.match(/setRequiredHeadcount\([\s\S]{0,200}?renderApp\(\)/g) || []).length, 0);
});

test("스케줄: 로그 영역·맞춤 계산은 바뀐 게 없으면 건너뛴다", () => {
  const js = read("js/07a5-schedule-log-capture.js");
  assert.ok(js.includes("logArea._schLogHtml !== logHtml"));
  assert.ok(js.includes("inner._fitNatW = naturalW"));
  assert.ok(js.includes("needFit = !stable"));
});

test("QA: 점수 수정은 renderApp() 대신 qaRefreshAfterScoreEdit()를 부르고, 통계 카드는 한 함수로 만든다", () => {
  const js = read("js/05f-qa-render.js");
  assert.ok(/setQAScore\([\s\S]{0,160}?qaRefreshAfterScoreEdit\(\);/.test(js));
  assert.ok(!/setQAScore\([\s\S]{0,160}?renderApp\(\)/.test(js));
  assert.equal((js.match(/function qaStatGridHtml/g) || []).length, 1);
  assert.ok(js.includes('<div class="qa-stat-grid">${qaStatGridHtml(agentsList, year, monthIndex)}</div>'));
});

test("QA: 행 구성이 달라지면 표 영역 전체 갱신으로 물러서고, 다른 창/위젯은 hdRefreshAfterLocalEdit로 갱신한다", () => {
  const js = read("js/05f-qa-render.js");
  const fn = js.slice(js.indexOf("function qaRefreshAfterScoreEdit"), js.indexOf("function renderQAPage"));
  assert.ok(fn.includes("updateQATableArea()"));
  assert.ok(fn.includes('hdRefreshAfterLocalEdit("qa")'));
  assert.ok(fn.includes("input.value !== input.defaultValue"));
  const hd = read("js/09a-home-desktop.js");
  assert.ok(hd.includes("function hdRefreshAfterLocalEdit(exceptPage)"));
});

test("빌드 결과물(app.js)에 반영돼 있다", () => {
  const app = read("app.js");
  for (const k of ["schedulePatchTableRows", "qaRefreshAfterScoreEdit", "attachScheduleElementHandlers", "hdRefreshAfterLocalEdit"]) {
    assert.ok(app.includes(k), k + " 미반영 — node build.js 필요");
  }
});
