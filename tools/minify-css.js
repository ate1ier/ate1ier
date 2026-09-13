// 보수적인 CSS 압축기: 문자열("...", '...')과 url(...) 내부 내용은 절대 건드리지 않고,
// 주석(/* ... */)만 제거하고 코드 영역의 공백(줄바꿈/탭/여러 칸 스페이스)만 한 칸으로
// 줄인다. 선택자 사이의 공백(하위 선택자 결합자로 의미가 있음)은 "제거"가 아니라
// "한 칸으로 축소"만 하므로 의미가 바뀌지 않는다.
function minifyCss(input) {
  let out = "";
  let i = 0;
  const n = input.length;
  let lastWasSpace = false;
  while (i < n) {
    const c = input[i];
    // 주석 제거
    if (c === "/" && input[i + 1] === "*") {
      const end = input.indexOf("*/", i + 2);
      i = end === -1 ? n : end + 2;
      continue;
    }
    // 문자열은 통째로 그대로 복사 (이스케이프 처리 포함)
    if (c === '"' || c === "'") {
      const quote = c;
      let j = i + 1;
      let buf = c;
      while (j < n) {
        buf += input[j];
        if (input[j] === "\\") { j++; if (j < n) buf += input[j]; }
        else if (input[j] === quote) { j++; break; }
        j++;
      }
      out += buf;
      i = j;
      lastWasSpace = false;
      continue;
    }
    // url(...) 안 내용은 그대로 복사 (경로에 공백이 의미 있을 수 있음)
    if ((c === "u" || c === "U") && input.slice(i, i + 4).toLowerCase() === "url(") {
      const end = input.indexOf(")", i + 4);
      const seg = end === -1 ? input.slice(i) : input.slice(i, end + 1);
      out += seg;
      i = end === -1 ? n : end + 1;
      lastWasSpace = false;
      continue;
    }
    // 공백류: 여러 칸이어도 한 칸으로
    if (c === " " || c === "\t" || c === "\n" || c === "\r" || c === "\f") {
      if (!lastWasSpace) { out += " "; lastWasSpace = true; }
      i++;
      continue;
    }
    out += c;
    lastWasSpace = false;
    i++;
  }
  // { } : ; , 주변의 공백만 안전하게 제거 (CSS 문법상 의미 없음)
  out = out.replace(/ ?([{}:;,]) ?/g, "$1");
  // 마지막 세미콜론은 굳이 필요 없음 (바로 뒤에 })
  out = out.replace(/;}/g, "}");
  // 파일 처음/끝 공백 정리
  out = out.trim();
  return out;
}
module.exports = { minifyCss };

if (require.main === module) {
  const fs = require("fs");
  const input = fs.readFileSync(process.argv[2], "utf8");
  process.stdout.write(minifyCss(input));
}
