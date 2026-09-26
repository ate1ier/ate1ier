// build.js
// 카테고리별로 나눠진 css/*.css, js/*.js 파일들을 조합해서 index.html + app.js +
// styles.min.css 세 파일을 만들어주는 빌드 스크립트입니다.
//
// 사용법: 이 폴더(build.js가 있는 폴더)에서
//   node build.js
// 를 실행하면 같은 폴더에 index.html, app.js, styles.min.css가 생성/갱신됩니다.
//
// ---- 2026-09 변경: 번들 분리 + CSS 압축 + (선택) JS 압축 ----
//   예전에는 JS 전체(약 700KB)를 index.html 안에 <script> 블록으로 그대로
//   박아넣고, css/*.css 13개 파일을 각각 <link>로 따로 불러왔습니다. 그러면
//   1) index.html 자체가 무거워서 화면 뼈대를 그리기도 전에 이 큰 파일을 전부
//      받아야 했고, 2) 페이지를 새로고침할 때마다 이 700KB짜리 스크립트를
//      "HTML의 일부"로 매번 새로 받아서(브라우저가 별도 파일처럼 캐시하지
//      못하고) 다시 파싱해야 했습니다.
//   지금은 JS를 index.html 밖으로 꺼내 별도 파일 app.js로 저장하고
//   (<script src="app.js">로 불러옴), css 13개 파일도 순서 그대로 이어붙이고
//   주석/불필요한 공백만 제거해 styles.min.css 하나로 합칩니다. 이러면
//   브라우저가 app.js/styles.min.css를 index.html과 별도로 캐시할 수 있고,
//   요청 수도 13(css)+1(inline js) → 2로 줄어듭니다.
//   ※ JS 내용 자체는 한 글자도 바꾸지 않았습니다(그대로 파일만 옮김). CSS는
//     주석과 공백만 지웠고(문자열·url() 내부는 손대지 않음), 두 가지 서로 다른
//     방식으로 구현한 압축기가 완전히 같은 결과를 내는 것으로 교차 검증했습니다.
//   ※ 이제 CSS를 고쳐도 예전처럼 새로고침만으로 반영되지 않고, JS와 마찬가지로
//     `node build.js`를 한 번 더 돌려야 index.html/styles.min.css에 반영됩니다
//     (README의 "사용 방법" 참고).
//   ※ JS 실행 순서(Supabase 동기화를 await로 기다린 뒤 나머지를 이어서 실행)는
//     그대로 유지해야 하므로, js/ 파일들은 여전히 원래 순서대로 하나의 app.js
//     안에 이어붙입니다(여러 <script src>로 쪼개면 순서가 깨질 수 있음).
//
//   JS 자체 압축(minify)은 `npm install`로 terser를 설치했을 때만 자동으로
//   켜집니다. terser가 없으면(설치 전이거나, 이 프로젝트를 처음 받았을 때)
//   지금처럼 압축 없이 그대로 app.js를 만들며, 에러 없이 정상 동작합니다.
//   즉 `npm install`을 안 해도 되고, 하면 app.js 용량이 더 줄어듭니다.
//   자세한 설치 방법은 README의 "JS 압축(선택 사항)" 항목을 참고하세요.

const fs = require("fs");
const path = require("path");
const { minifyCss } = require("./tools/minify-css.js");

const ROOT = __dirname;
const CSS_DIR = path.join(ROOT, "css");
const JS_DIR = path.join(ROOT, "js");

function readOrdered(dir, ext) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(ext))
    .sort() // 파일명 앞의 01-, 02- 같은 번호 순서대로 정렬됨
    .map((f) => ({ name: f, content: fs.readFileSync(path.join(dir, f), "utf8") }));
}

async function main() {
  const headTop = fs.readFileSync(path.join(ROOT, "head-top.html"), "utf8").replace(/\s+$/, "");
  const bodyHtml = fs.readFileSync(path.join(ROOT, "body.html"), "utf8").replace(/\s+$/, "");

  const cssFiles = readOrdered(CSS_DIR, ".css");
  const jsFiles = readOrdered(JS_DIR, ".js");

  // ---- CSS: 순서 그대로 이어붙인 뒤 압축해서 styles.min.css로 저장 ----
  const cssConcat = cssFiles.map((f) => f.content).join("\n");
  const cssMinified = minifyCss(cssConcat);
  fs.writeFileSync(path.join(ROOT, "styles.min.css"), cssMinified, "utf8");

  // ---- JS: 순서 그대로 이어붙여서 app.js 소스를 만듦 (내용은 그대로) ----
  const jsBody = jsFiles.map((f) => f.content.replace(/\s+$/, "")).join("\n\n");
  const appJsSource = `(async function () {\n${jsBody}\n})();\n`;

  // ---- JS 압축은 terser가 설치되어 있을 때만 시도. 없거나 실패하면 압축 없이
  //      원본 그대로 app.js에 씀 (항상 안전하게 동작하도록 하는 안전망) ----
  let finalAppJs = appJsSource;
  let jsNote = "JS 압축: 안 함 (terser 미설치 — README 'JS 압축(선택 사항)' 참고)";
  try {
    const terser = require("terser");
    const result = await terser.minify(appJsSource, {
      compress: true,
      mangle: true,
    });
    if (result.error) throw result.error;
    if (!result.code) throw new Error("terser가 빈 결과를 반환함");
    finalAppJs = result.code;
    const pct = (100 - (finalAppJs.length / appJsSource.length) * 100).toFixed(1);
    jsNote = `JS 압축: 함 (${Math.round(appJsSource.length / 1024)}KB → ${Math.round(finalAppJs.length / 1024)}KB, ${pct}% 감소)`;
  } catch (e) {
    if (!(e && e.code === "MODULE_NOT_FOUND")) {
      console.warn("[build.js] terser 압축 중 문제가 있어 압축 없이 진행합니다:", (e && e.message) || e);
    }
  }
  fs.writeFileSync(path.join(ROOT, "app.js"), finalAppJs, "utf8");

  const out = `${headTop}
<link rel="stylesheet" href="styles.min.css">
</head>
${bodyHtml}
<script src="app.js"></script>
</body>
</html>
`;

  fs.writeFileSync(path.join(ROOT, "index.html"), out, "utf8");
  const cssNote = `css ${Math.round(cssConcat.length / 1024)}KB → ${Math.round(cssMinified.length / 1024)}KB`;
  console.log(`index.html / app.js / styles.min.css 생성 완료 (css ${cssFiles.length}개, js ${jsFiles.length}개 파일 조합, ${cssNote}, ${jsNote})`);
}

main().catch((e) => {
  console.error("[build.js] 빌드 실패:", e);
  process.exit(1);
});
