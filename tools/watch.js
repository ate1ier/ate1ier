// tools/watch.js
// css/, js/, head-top.html, body.html 을 감시하다가 변경되면 자동으로
// `node build.js`를 실행해줍니다. "고치고 build.js 돌리는 걸 깜빡해서
// 화면에 옛날 버전이 남는" 문제를 근본적으로 막기 위한 스크립트입니다.
//
// 사용법:
//   node tools/watch.js
// (npm install 했다면 npm run watch 로도 실행 가능)
//
// 종료: Ctrl+C
//
// 외부 패키지 없이 Node.js 내장 fs.watch만 사용합니다(=추가 설치 불필요).
// 여러 파일을 연달아 저장(예: 에디터의 "모두 저장")해도 빌드가 여러 번
// 겹쳐 돌지 않도록 300ms 디바운스를 적용했습니다.

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const WATCH_TARGETS = [
  path.join(ROOT, "css"),
  path.join(ROOT, "js"),
  path.join(ROOT, "head-top.html"),
  path.join(ROOT, "body.html"),
];

let building = false;
let pending = false;
let debounceTimer = null;

function runBuild() {
  if (building) {
    pending = true;
    return;
  }
  building = true;
  const startedAt = new Date().toLocaleTimeString("ko-KR");
  console.log(`\n[watch] ${startedAt} 변경 감지 → node build.js 실행 중...`);

  const child = spawn(process.execPath, [path.join(ROOT, "build.js")], {
    cwd: ROOT,
    stdio: "inherit",
  });

  child.on("close", (code) => {
    building = false;
    if (code === 0) {
      console.log("[watch] 빌드 완료. 계속 감시 중... (Ctrl+C로 종료)");
    } else {
      console.error(`[watch] 빌드 실패 (exit code ${code}). 위 에러를 확인하세요.`);
    }
    if (pending) {
      pending = false;
      runBuild();
    }
  });
}

function scheduleBuild() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(runBuild, 300);
}

function watchPath(target) {
  try {
    const stat = fs.statSync(target);
    // 디렉터리면 그 안의 파일 변경까지 재귀적으로 감시(recursive는 macOS/Windows에서
    // 기본 지원되고, 리눅스에서는 Node 20+ 실험적으로 지원됩니다. 지원 안 되는
    // 환경에서도 최소한 최상위 디렉터리 변경은 감지됩니다).
    fs.watch(target, { recursive: stat.isDirectory() }, (eventType, filename) => {
      if (filename && filename.startsWith(".")) return; // 임시/숨김 파일 무시
      scheduleBuild();
    });
    console.log(`[watch] 감시 중: ${path.relative(ROOT, target)}`);
  } catch (e) {
    console.warn(`[watch] 감시 대상을 찾을 수 없습니다: ${target} (${e.message})`);
  }
}

console.log("[watch] css/js 변경 감시를 시작합니다. 저장하면 자동으로 빌드됩니다.");
WATCH_TARGETS.forEach(watchPath);

// 시작하자마자 한 번 빌드해서, 감시 시작 전에 있었던 변경사항도 반영합니다.
runBuild();
