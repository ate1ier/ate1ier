// tests/desktop-folders.test.js
// js/09b-desktop-folders.js(바탕화면 폴더)의 "순수 계산" 부분 테스트:
// 이름 겹침 방지, 화면 안으로 좌표 보정, 창 정보/창 안 화면 생성.
// 우클릭 메뉴·끌기·이름 입력칸처럼 진짜 DOM 이벤트가 필요한 부분은 브라우저에서 눈으로 확인해야 한다.
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { createSandbox, loadIntoContext, exposeBindings, toPlain } = require("./helpers/load-source");
const { createFakeDocument } = require("./helpers/fake-dom");

function loadFolders(storedJson) {
  const sandbox = createSandbox({
    document: createFakeDocument(),
    window: { innerWidth: 1200, innerHeight: 800, addEventListener() {}, removeEventListener() {} },
    localStorage: { getItem: () => (storedJson === undefined ? null : storedJson), setItem() {} },
    acctKey: (k) => `acct:test:${k}`,
    CURRENT_ACCOUNT_IS_MASTER: false,
    formatAttachmentSize: (n) => `${n}B`, // js/03-notes.js의 함수 대역
  });
  loadIntoContext(sandbox, ["js/01f-settings-menu-utils.js", "js/09b-desktop-folders.js"]);
  exposeBindings(sandbox, ["desktopFoldersData"]);
  return sandbox;
}

test("desktopFolderUniqueName: 겹치지 않으면 그대로, 겹치면 (2), (3)… 을 붙인다", () => {
  const m = loadFolders();
  assert.equal(m.desktopFolderUniqueName("새 폴더", []), "새 폴더");
  assert.equal(m.desktopFolderUniqueName("새 폴더", ["새 폴더"]), "새 폴더 (2)");
  assert.equal(m.desktopFolderUniqueName("새 폴더", ["새 폴더", "새 폴더 (2)"]), "새 폴더 (3)");
  // 가운데 번호가 비어 있으면 그 자리부터 채운다
  assert.equal(m.desktopFolderUniqueName("새 폴더", ["새 폴더", "새 폴더 (3)"]), "새 폴더 (2)");
});

test("desktopFolderClampPos: 화면 밖·상태표시줄 밑 좌표를 안쪽으로 눌러준다", () => {
  const m = loadFolders();
  assert.deepEqual(toPlain(m.desktopFolderClampPos(300, 200, 1200, 800)), { x: 300, y: 200 });
  assert.deepEqual(toPlain(m.desktopFolderClampPos(-50, 5, 1200, 800)), { x: 0, y: 42 });
  assert.deepEqual(toPlain(m.desktopFolderClampPos(5000, 5000, 1200, 800)), { x: 1114, y: 690 });
  assert.deepEqual(toPlain(m.desktopFolderClampPos("abc", undefined, 1200, 800)), { x: 0, y: 42 });
});

// 테스트 환경(가짜 document)에서는 #home-icons를 잴 수 없어 항상 기본 여백(GRID_RIGHT_MARGIN_FALLBACK=124)을
// 쓴다. 화면 1200px 기준 0번째 열(col0,row0) 좌표는 1200-124-86 = 990, y는 그대로 50.
const ORIGIN_X = 990;
const ORIGIN_Y = 50;

test("desktopFolderSnapToGrid: 놓은 자리를 가장 가까운 그리드 칸으로 맞춘다(우상단 기준)", () => {
  const m = loadFolders();
  // 원점 칸(990,50) 언저리는 그대로 원점으로 스냅된다
  assert.deepEqual(toPlain(m.desktopFolderSnapToGrid(ORIGIN_X + 4, ORIGIN_Y + 5, 1200, 800)), { x: ORIGIN_X, y: ORIGIN_Y });
  // 칸 절반을 넘어가면 다음 칸으로 스냅된다 (칸 크기 96×112) — 열은 오른쪽 기준이라 왼쪽으로 갈수록 커진다
  assert.deepEqual(toPlain(m.desktopFolderSnapToGrid(ORIGIN_X - 50, ORIGIN_Y + 60, 1200, 800)), { x: ORIGIN_X - 96, y: ORIGIN_Y + 112 });
  // 같은 칸 안 여러 좌표는 모두 같은 칸으로 스냅된다(겹치지 않는 일관된 규칙)
  const a = m.desktopFolderSnapToGrid(300, 300, 1200, 800);
  const b = m.desktopFolderSnapToGrid(320, 280, 1200, 800);
  assert.deepEqual(toPlain(a), toPlain(b));
  // 화면 왼쪽·아래 밖으로 나가는 칸은 화면 안으로 눌린다(열이 늘어나는 방향이라 왼쪽으로 갈수록 커진다)
  assert.deepEqual(toPlain(m.desktopFolderSnapToGrid(-5000, 5000, 1200, 800)), toPlain(m.desktopFolderClampPos(-5000, 5000, 1200, 800)));
  // 화면 오른쪽 밖으로 나가는 칸(=원점보다 더 오른쪽)은 0번째 열(원점)보다 더 오른쪽으로 가지 않는다
  // — 그렇지 않으면 #home-icons와 겹치는 자리까지 밀려날 수 있다
  assert.deepEqual(toPlain(m.desktopFolderSnapToGrid(5000, 5000, 1200, 800)), { x: ORIGIN_X, y: toPlain(m.desktopFolderClampPos(5000, 5000, 1200, 800)).y });
});

test("desktopFolderSnapToFreeGrid: 목표 칸이 비어 있으면 그대로, 차 있으면 가장 가까운 빈 칸으로 옮긴다", () => {
  const m = loadFolders();
  const folders = {
    a: { id: "a", x: ORIGIN_X, y: ORIGIN_Y }, // (col0,row0) 칸을 이미 차지
  };
  // 다른 폴더(b)가 같은 칸에 놓이면 옆의 빈 칸(가까운 칸)으로 밀려난다
  const p1 = m.desktopFolderSnapToFreeGrid(ORIGIN_X + 4, ORIGIN_Y + 5, folders, "b", 1200, 800);
  assert.notDeepEqual(toPlain(p1), { x: ORIGIN_X, y: ORIGIN_Y });
  // 자기 자신은 비교 대상에서 빠지므로, a를 그 자리에 다시 스냅하면 그대로 원래 칸에 남는다
  const p2 = m.desktopFolderSnapToFreeGrid(ORIGIN_X + 4, ORIGIN_Y + 5, folders, "a", 1200, 800);
  assert.deepEqual(toPlain(p2), { x: ORIGIN_X, y: ORIGIN_Y });
  // 비어 있는 칸을 목표로 하면 그 칸 그대로 스냅된다(왼쪽으로 5칸, 아래로 5칸)
  const p3 = m.desktopFolderSnapToFreeGrid(ORIGIN_X - 96 * 5, ORIGIN_Y + 112 * 5, folders, "b", 1200, 800);
  assert.deepEqual(toPlain(p3), { x: ORIGIN_X - 96 * 5, y: ORIGIN_Y + 112 * 5 });
});

test("desktopFolderNearestFreeCell: 칸이 꽉 찬 경우 점점 넓혀가며 빈 칸을 찾고, 화면을 벗어나지 않는다", () => {
  const m = loadFolders();
  const occupied = new Set(["2,2"]);
  assert.deepEqual(toPlain(m.desktopFolderNearestFreeCell(2, 2, occupied, 10, 10)), { col: 1, row: 1 });
  // 목표 칸 자체가 비어 있으면 그대로
  assert.deepEqual(toPlain(m.desktopFolderNearestFreeCell(5, 5, occupied, 10, 10)), { col: 5, row: 5 });
  // 화면 가장자리(0,0)가 차 있어도 화면 밖(-1,-1)으로 나가지 않고 화면 안의 빈 칸을 찾는다
  const edgeOccupied = new Set(["0,0"]);
  const p = m.desktopFolderNearestFreeCell(0, 0, edgeOccupied, 10, 10);
  assert.ok(p.col >= 0 && p.row >= 0);
  assert.notDeepEqual(toPlain(p), { col: 0, row: 0 });
});

test("저장된 값이 없거나 깨져 있으면 빈 폴더 목록으로 시작한다", () => {
  assert.deepEqual(toPlain(loadFolders().desktopFoldersData), { folders: {} });
  assert.deepEqual(toPlain(loadFolders("이건 JSON이 아님").desktopFoldersData), { folders: {} });
  assert.deepEqual(toPlain(loadFolders('{"folders":null}').desktopFoldersData), { folders: {} });
});

test("desktopFolderAppInfo: folder:<id> 만 창 정보를 돌려주고, 없는 폴더/일반 페이지는 null", () => {
  const stored = JSON.stringify({ folders: { a1: { id: "a1", name: "보고서", x: 10, y: 50, createdAt: "2026-09-24T00:00:00Z" } } });
  const m = loadFolders(stored);
  const info = m.desktopFolderAppInfo("folder:a1");
  assert.equal(info[0], "folder:a1");
  assert.equal(info[1], "보고서");
  assert.equal(m.desktopFolderAppInfo("folder:zzz"), null);
  assert.equal(m.desktopFolderAppInfo("notes"), null);
  assert.equal(m.desktopFolderAppInfo(undefined), null);
});

test("desktopFileKind: 확장자별 배지 글자/색, 이미지 여부", () => {
  const m = loadFolders();
  assert.deepEqual(toPlain(m.desktopFileKind("보고서.PDF")), { ext: "pdf", label: "PDF", color: "#e5484d", isImage: false });
  assert.equal(m.desktopFileKind("a.xlsx").color, "#1f9d55");
  assert.equal(m.desktopFileKind("a.hwpx").label, "HWPX");
  assert.equal(m.desktopFileKind("사진.JPG").isImage, true);
  assert.equal(m.desktopFileKind("noext").label, "FILE"); // 확장자 없으면 FILE
  assert.equal(m.desktopFileKind("archive.tar.gz").ext, "gz");
  assert.equal(m.desktopFileKind("a.abcdefgh").label, "ABCD"); // 긴 확장자는 4글자까지
});

test("desktopFileIconSvg: 파일 이름의 특수문자가 마크업을 깨지 않는다", () => {
  const m = loadFolders();
  const svg = m.desktopFileIconSvg('x.<b>"');
  assert.equal(svg.includes("<b>"), false);
});

test("desktopFolderStatusText: 항목 수 · 선택 · 업로드 중 문구", () => {
  const m = loadFolders();
  assert.equal(m.desktopFolderStatusText(0, 0, 0, 0), "0개 항목");
  assert.equal(m.desktopFolderStatusText(5, 2, 300, 0), "5개 항목 · 2개 선택됨 (300B)");
  assert.equal(m.desktopFolderStatusText(5, 0, 0, 3), "5개 항목 · 3개 업로드 중…");
});

test("desktopFolderWindowHtml: 빈 폴더 / 파일·업로드 중 항목 / 선택 표시 / 이름 이스케이프", () => {
  const m = loadFolders();
  const f = { id: "a1", name: "보고서" };
  const empty = m.desktopFolderWindowHtml(f, "a1", [], [], new Set());
  assert.ok(empty.includes("이 폴더는 비어 있어요"));
  assert.ok(empty.includes('data-dfw-folder="a1"'));
  assert.ok(empty.includes("0개 항목"));

  const files = [
    { id: "f1", name: "a<script>.pdf", size: 100, path: "p/1" },
    { id: "f2", name: "사진.png", size: 200, path: "p/2" },
  ];
  const html = m.desktopFolderWindowHtml(f, "a1", files, [{ id: "t1", name: "올리는중.zip", size: 1 }], new Set(["f1"]));
  assert.equal(html.includes("<script>"), false);
  assert.ok(html.includes('data-fid="f1"'));
  assert.ok(/dfw-item sel"[^>]*data-fid="f1"|dfw-item sel" data-fid="f1"/.test(html));
  assert.ok(html.includes('data-thumb="1"')); // 이미지 파일만 썸네일 대상
  assert.equal((html.match(/data-thumb="1"/g) || []).length, 1);
  assert.ok(html.includes("dfw-item pending"));
  assert.ok(html.includes("2개 항목 · 1개 선택됨 (100B) · 1개 업로드 중…"));
});

test("renderDesktopFolderWindow: 없는 폴더면 비우고, 있으면 dfw-inner 클래스를 단다", () => {
  const stored = JSON.stringify({ folders: { a1: { id: "a1", name: "보고서", x: 10, y: 50 } } });
  const m = loadFolders(stored);
  const added = [];
  const inner = { classList: { add: (c) => added.push(c) }, innerHTML: "x", querySelector: () => null };
  m.renderDesktopFolderWindow(inner, "a1");
  assert.ok(added.includes("dfw-inner"));
  assert.ok(inner.innerHTML.includes("이 폴더는 비어 있어요"));
  const gone = { classList: { add() {} }, innerHTML: "x", querySelector: () => null };
  m.renderDesktopFolderWindow(gone, "nope");
  assert.equal(gone.innerHTML, "");
});

test("저장된 폴더에 files가 없으면 빈 배열로 채워서 읽는다(1단계 데이터 호환)", () => {
  const stored = JSON.stringify({ folders: { a1: { id: "a1", name: "옛 폴더", x: 1, y: 2 } } });
  const m = loadFolders(stored);
  assert.deepEqual(toPlain(m.desktopFoldersData.folders.a1.files), []);
});
