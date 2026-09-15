// tests/helpers/fake-dom.js
//
// 화면(렌더링) 쪽 함수들을 브라우저 없이 Node에서 돌려보기 위한 최소한의 가짜
// document / localStorage.
//
// 이 프로젝트의 렌더 함수들(buildQATableHtml, buildScheduleTableHtml,
// entryEditFormHtml, qaTrendSvgHtml ...)은 대부분 "HTML 문자열을 만들어서
// 돌려주는" 순수 함수라서, 실제 브라우저 DOM이 없어도 결과 문자열만 검사하면
// 충분히 테스트할 수 있다. 다만 그 안에서 공용 유틸 esc()가
// document.createElement("div")를 쓰기 때문에, 그 한 가지만 흉내 내주면 된다.
//
// ⚠️ 주의: 여기 있는 건 진짜 DOM이 아니다. innerHTML을 직접 조작하거나
// 이벤트를 붙이는 함수(attach*Events, render*Page 등)는 이걸로 테스트할 수 없다.
// 그런 함수들은 여전히 브라우저에서 눈으로 확인해야 하고, 여기서는 그 함수들이
// 쓰는 "문자열을 만드는 부분"만 떼어내서 검증한다.

// 참고: 공용 유틸 esc()는 예전엔 document.createElement를 썼지만 지금은 순수
// 문자열 치환이라 DOM이 필요 없다(따옴표까지 이스케이프하도록 고치면서 같이
// 바뀜). 아래 가짜 요소의 textContent→innerHTML 동작은 혹시 다른 코드가 같은
// 방식을 쓸 때를 대비해 브라우저 규칙(&, <, > 세 글자만 치환) 그대로 남겨둔다.
function escapeLikeBrowser(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function createFakeElement(tag) {
  let text = "";
  return {
    tagName: String(tag || "div").toUpperCase(),
    style: {},
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    setAttribute() {},
    appendChild() {},
    remove() {},
    addEventListener() {},
    set textContent(v) { text = v; },
    get textContent() { return text; },
    get innerHTML() { return escapeLikeBrowser(text); },
    set innerHTML(v) { text = v; },
  };
}

// esc()가 필요로 하는 createElement만 진짜로 동작하고, 나머지는 "화면에 아무
// 요소도 없는 상태"(getElementById → null)를 돌려준다. 렌더 함수가 실수로 진짜
// DOM 조작에 의존하게 되면 여기서 null 때문에 조용히 건너뛰거나 터지므로,
// 순수 문자열 생성 함수인지 아닌지가 테스트에서 드러난다.
function createFakeDocument() {
  return {
    createElement: createFakeElement,
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener() {},
    removeEventListener() {},
    body: createFakeElement("body"),
  };
}

// 실제 저장은 안 하고 메모리 Map에만 담아두는 localStorage 대역.
// initial: { 키: 문자열 } 형태로 미리 값을 채워둘 수 있다(테스트 픽스처 주입용).
function createMemoryLocalStorage(initial) {
  const store = new Map(Object.entries(initial || {}));
  return {
    store,
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => { store.set(k, String(v)); },
    removeItem: (k) => { store.delete(k); },
    clear: () => { store.clear(); },
  };
}

// 렌더 결과 문자열에서 특정 패턴이 몇 번 나오는지 센다.
// (예: 표에 그려진 <tr> 개수, 끊긴 선분마다 하나씩 생기는 <path> 개수)
function countMatches(html, pattern) {
  const re = typeof pattern === "string"
    ? new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")
    : new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g");
  return (String(html).match(re) || []).length;
}

// 정규식의 첫 번째 캡처 그룹들을 등장 순서대로 모아준다.
// (예: 표에서 data-staff-id="..." 값만 순서대로 뽑아 정렬 결과를 확인)
function extractAll(html, regexWithGroup) {
  const re = new RegExp(regexWithGroup.source, regexWithGroup.flags.includes("g") ? regexWithGroup.flags : regexWithGroup.flags + "g");
  const out = [];
  let m;
  while ((m = re.exec(String(html))) !== null) out.push(m[1]);
  return out;
}

module.exports = { createFakeDocument, createFakeElement, createMemoryLocalStorage, countMatches, extractAll, escapeLikeBrowser };
