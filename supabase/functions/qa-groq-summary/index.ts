// supabase/functions/qa-groq-summary/index.ts
//
// QA(품질관리) AI 요약을 대신 처리해주는 서버 함수예요.
// 클라이언트(공개 저장소의 js/05-qa.js)는 이 함수만 호출하고,
// 실제 Groq API 키는 이 함수의 "환경변수(secret)"에만 존재해요.
// → 저장소가 Public이어도 키는 절대 코드에 노출되지 않아요.
//
// ----- 배포 방법 (최초 1회) -----
//   1) Supabase CLI 로그인 & 프로젝트 연결
//        supabase login
//        supabase link --project-ref zsjnuueknhfrnnfunxad
//   2) Groq API 키를 "서버 비밀값"으로 등록 (이 명령은 터미널에만 남고, 저장소엔 안 올라가요)
//        supabase secrets set GROQ_API_KEY=여기에_실제_groq_키
//   3) (선택) 이 사이트의 실제 GitHub Pages 주소로 출처를 제한하고 싶다면:
//        supabase secrets set ALLOWED_ORIGIN=https://사장님아이디.github.io
//      비워두면(설정 안 하면) 모든 출처를 허용해요.
//   4) 함수 배포
//        supabase functions deploy qa-groq-summary --no-verify-jwt
//
// 이후 Groq 키를 바꾸고 싶으면 2번 명령만 다시 실행하고 4번으로 재배포하면 돼요.
// 저장소 코드에는 이 키가 절대 등장하지 않으니, 안전하게 Public으로 유지해도 돼요.

const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") || "";
const GROQ_MODEL = Deno.env.get("GROQ_MODEL") || "openai/gpt-oss-120b";
// 키가 새어나가거나 예상 못한 대량 호출이 있어도 피해를 제한하기 위한 하루 총 호출 상한선.
// 필요하면 supabase secrets set DAILY_LIMIT=숫자 로 바꿀 수 있어요.
const DAILY_LIMIT = Number(Deno.env.get("DAILY_LIMIT") || "300");

function corsHeaders(origin: string) {
  const allow = !ALLOWED_ORIGIN ? "*" : (origin === ALLOWED_ORIGIN ? origin : ALLOWED_ORIGIN);
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

// 하루 총 호출 횟수를 세서 상한을 넘으면 막는다. Deno Deploy의 내장 KV 저장소를 쓰므로
// 별도 DB 설정 없이 바로 동작한다. KV를 쓸 수 없는 예외적인 상황이면(설정 문제 등)
// 기능이 아예 죽어버리는 것보다는 한도 체크 없이 통과시킨다.
async function checkAndBumpDailyLimit(): Promise<boolean> {
  try {
    const kv = await Deno.openKv();
    const today = new Date().toISOString().slice(0, 10);
    const key = ["qa-groq-summary-count", today];
    const res = await kv.get<number>(key);
    const current = res.value || 0;
    if (current >= DAILY_LIMIT) return false;
    await kv.set(key, current + 1, { expireIn: 1000 * 60 * 60 * 24 * 2 });
    return true;
  } catch (_e) {
    return true;
  }
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") || "";
  const headers = { ...corsHeaders(origin), "Content-Type": "application/json" };

  if (req.method === "OPTIONS") return new Response(null, { headers });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST만 지원해요." }), { status: 405, headers });
  }
  if (ALLOWED_ORIGIN && origin && origin !== ALLOWED_ORIGIN) {
    return new Response(JSON.stringify({ error: "허용되지 않은 출처예요." }), { status: 403, headers });
  }

  const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
  if (!GROQ_API_KEY) {
    return new Response(JSON.stringify({ error: "서버에 GROQ_API_KEY가 설정되어 있지 않아요. supabase secrets set GROQ_API_KEY=... 를 실행해주세요." }), { status: 500, headers });
  }

  const okToProceed = await checkAndBumpDailyLimit();
  if (!okToProceed) {
    return new Response(JSON.stringify({ error: "오늘 하루 AI 요약 요청 한도를 넘었어요. 내일 다시 시도해주세요." }), { status: 429, headers });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch (_e) {
    return new Response(JSON.stringify({ error: "요청 형식이 올바르지 않아요." }), { status: 400, headers });
  }

  const prompt = String(body?.prompt || "").trim();
  if (!prompt) return new Response(JSON.stringify({ error: "prompt가 비어있어요." }), { status: 400, headers });
  if (prompt.length > 20000) return new Response(JSON.stringify({ error: "요청 내용이 너무 길어요." }), { status: 400, headers });

  try {
    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({ model: GROQ_MODEL, messages: [{ role: "user", content: prompt }] }),
    });
    const data = await resp.json();
    if (!resp.ok) {
      const msg = (data && data.error && data.error.message) ? data.error.message : `Groq 요청 실패 (${resp.status})`;
      return new Response(JSON.stringify({ error: msg }), { status: 502, headers });
    }
    const text = (data?.choices?.[0]?.message?.content || "").trim();
    if (!text) return new Response(JSON.stringify({ error: "응답에서 요약 내용을 찾지 못했어요." }), { status: 502, headers });
    return new Response(JSON.stringify({ text }), { status: 200, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: String((err as Error)?.message || err) }), { status: 500, headers });
  }
});
