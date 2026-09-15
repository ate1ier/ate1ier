// tests/helpers/load-source.js
//
// js/*.js 파일들은 build.js가 하나로 이어붙여서 index.html에서 실행하는 구조라
// (module.exports가 없음) 브라우저 없이 Node에서 그대로 require할 수 없습니다.
// 대신 Node의 vm 모듈로 각 파일의 소스코드를 "가짜 전역 환경(sandbox)" 위에서
// 실행시켜, 그 안에 정의된 함수들을 꺼내 테스트합니다.
//
// 주의: 파일을 읽어서 실행만 할 뿐 최상위(top-level)에서 DOM/Supabase를 직접
// 건드리는 코드가 없는 파일에만 써야 합니다(함수 선언 자체는 호출 전까지
// 실행되지 않으므로, 함수 안에서 DOM 등을 참조해도 그 함수를 호출하지 않으면
// 문제 없습니다).
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..", "..");

// extraGlobals: qaData, qaUi, today 처럼 로드되는 파일이 참조하는 최소한의
// 전역값/스텁 함수를 미리 채워 넣어준다.
function createSandbox(extraGlobals) {
  const sandbox = Object.assign({ console }, extraGlobals || {});
  vm.createContext(sandbox);
  // 컨텍스트 안의 내장 생성자(Date 등)는 기본적으로 sandbox 객체의 "고유
  // 프로퍼티"로 노출되지 않는다(코드 실행 전엔 존재하지도 않음). 테스트에서
  // "이 vm 컨텍스트와 같은 realm의 Date"로 값을 만들 수 있도록 한 번
  // 실행해서 끌어와 둔다(instanceof Date 검사가 realm을 타기 때문에 필요함).
  vm.runInContext("this.Date = Date;", sandbox);
  return sandbox;
}

// relativePaths에 적힌 순서 그대로 프로젝트 루트 기준 상대경로의 js 파일들을
// 읽어서 sandbox 컨텍스트 위에서 실행한다(함수 선언들이 sandbox에 쌓인다).
function loadIntoContext(sandbox, relativePaths) {
  relativePaths.forEach((rel) => {
    const code = fs.readFileSync(path.join(ROOT, rel), "utf8");
    vm.runInContext(code, sandbox, { filename: rel });
  });
  return sandbox;
}

// vm 컨텍스트 안에서 만들어진 객체/배열은 호스트(Node)와 realm이 달라서
// Object.prototype/Array.prototype이 서로 다른 객체입니다. 그래서
// assert.deepStrictEqual로 곧바로 비교하면 "구조는 같은데 참조가 다른
// prototype" 때문에 실패합니다. JSON으로 한 번 왕복시켜 순수 호스트 쪽
// 일반 객체로 바꾼 뒤 비교합니다(함수·Date 등은 이 용도에선 필요 없음).
function toPlain(value) {
  return JSON.parse(JSON.stringify(value));
}

// function 선언은 sandbox 객체의 프로퍼티로 자동 노출되지만, 최상위 const/let
// (예: 02-calendar.js의 cal, 07a1의 scheduleData)은 노출되지 않아 테스트에서
// 곧바로 꺼내 쓸 수 없다. 이름들을 넘기면 컨텍스트 안에서 한 번 대입해줘서
// sandbox.cal 처럼 접근할 수 있게 한다(값이 아니라 같은 객체를 가리키므로,
// 테스트에서 프로퍼티를 바꾸면 소스 쪽 코드도 같은 값을 보게 된다).
function exposeBindings(sandbox, names) {
  names.forEach((name) => {
    vm.runInContext(`this.${name} = ${name};`, sandbox);
  });
  return sandbox;
}

module.exports = { createSandbox, loadIntoContext, toPlain, exposeBindings };
