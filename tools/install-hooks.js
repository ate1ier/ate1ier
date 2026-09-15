// tools/install-hooks.js
// hooks/pre-commit 을 .git/hooks/pre-commit 으로 복사해서 활성화합니다.
// .git 폴더가 아직 없으면(=git init 전이면) 아무것도 하지 않고 조용히
// 넘어갑니다(에러를 내지 않음 — npm install 중 자동 실행돼도 안전하도록).
//
// 사용법: node tools/install-hooks.js
// (package.json의 postinstall에 등록해두면 npm install 시 자동 실행됩니다.)

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const GIT_HOOKS_DIR = path.join(ROOT, ".git", "hooks");
const SRC = path.join(ROOT, "hooks", "pre-commit");
const DEST = path.join(GIT_HOOKS_DIR, "pre-commit");

if (!fs.existsSync(path.join(ROOT, ".git"))) {
  console.log("[install-hooks] .git 폴더가 없어 건너뜁니다. (git init 이후 다시 실행: node tools/install-hooks.js)");
  process.exit(0);
}

fs.mkdirSync(GIT_HOOKS_DIR, { recursive: true });
fs.copyFileSync(SRC, DEST);
try {
  fs.chmodSync(DEST, 0o755);
} catch (e) {
  // Windows 등에서 chmod가 의미 없거나 실패할 수 있으나 치명적이지 않음
}

console.log("[install-hooks] pre-commit 훅을 설치했습니다: .git/hooks/pre-commit");
console.log("[install-hooks] 이제 커밋할 때마다 자동으로 node build.js가 실행됩니다.");
