// build.js
// 카테고리별로 나눠진 css/*.css, js/*.js 파일들을 원본과 동일하게 동작하는
// 하나의 index.html로 "조합"해주는 빌드 스크립트입니다.
//
// 사용법: 이 폴더(build.js가 있는 폴더)에서
//   node build.js
// 를 실행하면 같은 폴더에 index.html이 생성/갱신됩니다.
//
// ※ CSS는 파일별로 완전히 독립적이라 사실 index.html 안에서 각 css 파일을
//    <link>로 그냥 불러오기만 해도 됩니다.
// ※ JS는 이 앱이 로그인 후 클라우드 동기화(Supabase)를 "await"으로 순서를
//    맞춰 처리하는 구조라서, 여러 <script src>로 각각 따로 실행하면 순서가
//    깨질 수 있습니다. 그래서 빌드 시 js 폴더의 파일들을 원래 순서 그대로
//    이어붙여 하나의 <script> 블록(비동기 즉시실행함수) 안에 넣어줍니다.
//    즉, "편집은 파일별로, 실행은 하나로" 방식입니다.

const fs = require("fs");
const path = require("path");

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

const headTop = fs.readFileSync(path.join(ROOT, "head-top.html"), "utf8").replace(/\s+$/, "");
const bodyHtml = fs.readFileSync(path.join(ROOT, "body.html"), "utf8").replace(/\s+$/, "");

const cssFiles = readOrdered(CSS_DIR, ".css");
const jsFiles = readOrdered(JS_DIR, ".js");

const linkTags = cssFiles
  .map((f) => `<link rel="stylesheet" href="css/${f.name}">`)
  .join("\n");

const jsBody = jsFiles.map((f) => f.content.replace(/\s+$/, "")).join("\n\n");

const out = `${headTop}
${linkTags}
</head>
${bodyHtml}
<script>
(async function () {
${jsBody}
})();
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(ROOT, "index.html"), out, "utf8");
console.log(`index.html 생성 완료 (css ${cssFiles.length}개, js ${jsFiles.length}개 파일 조합)`);
