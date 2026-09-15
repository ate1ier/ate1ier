// supabase/functions/auth-admin/index.ts
//
// "계정 정보(personal-app:accounts)"에 있던 비밀번호 해시·salt·cloudAuthSecret을
// 더 이상 브라우저(anon)가 읽을 수 있는 곳에 두지 않기 위해, 로그인 검증과
// 마스터의 "다른 계정 비밀번호 초기화"를 이 서버 함수 안에서만(서비스 롤 키로)
// 처리하도록 옮긴 함수예요. 이 함수 밖(브라우저)으로는 비밀번호 해시나
// cloudAuthSecret, 서비스 롤 키가 전혀 나가지 않습니다.
//
// ----- 배포 방법 (1회성, 코드를 바꿀 때마다 다시 실행) -----
//   supabase functions deploy auth-admin
//   (discord-notify와 달리 --no-verify-jwt를 붙이지 않습니다 — 이 함수는 반드시
//    Supabase가 발급한 토큰(로그인 전이면 anon key, 로그인 후면 로그인 세션)을
//    들고 호출돼야 하고, 그 검증을 Supabase가 자동으로 먼저 해주기 때문입니다.)
//
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY는 Edge Function
// 실행 환경에 자동으로 들어있어서 따로 secrets set 할 필요 없어요.
//
// ----- 두 가지 동작(action) -----
//   1) action: "migrate-login"
//      - 아직 예전 방식(로컬 PBKDF2/SHA-256 해시 비교 + cloudAuthSecret)으로
//        로그인하던 계정이 "이번에 처음으로" 로그인할 때 한 번 호출됩니다.
//      - 서버(이 함수) 안에서만 비밀번호를 확인하고, 맞으면 그 계정의 실제
//        Supabase Auth 비밀번호를 "사람이 입력한 진짜 비밀번호"로 바꿔버립니다
//        (그때부터는 cloudAuthSecret 없이, 사람 비밀번호 자체가 곧 로그인 비밀번호).
//      - 그리고 kv_store의 personal-app:accounts에서 그 계정의
//        passwordHash/salt/hashAlgo/iterations/cloudAuthSecret을 지우고
//        authMigrated:true로 표시합니다 — 이후로는 이 계정의 비밀번호 정보가
//        더 이상 어디에도(anon이 읽든 authenticated가 읽든) 평문 근처로도
//        남아있지 않습니다.
//      - 성공하면 클라이언트는 이어서 평범하게
//        supabase.auth.signInWithPassword({ email, password })를 호출해서
//        진짜 로그인 세션을 받습니다(이 함수는 세션을 만들어 돌려주지 않습니다).
//   2) action: "reset-password"
//      - 마스터 계정이 "다른 계정의 비밀번호를 초기화"할 때 호출됩니다.
//      - 호출자가 실제로 로그인된 상태이고, 그 계정이 accounts 목록에서
//        isMaster: true인지를 이 함수가 직접 다시 확인합니다(클라이언트가
//        "나는 마스터야"라고 보내는 값은 절대 신뢰하지 않습니다).
//      - 확인되면 대상 계정의 Supabase Auth 비밀번호를 새 비밀번호로 바꾸고,
//        대상 계정도 함께 authMigrated:true로 표시합니다(초기화 이후로는 그
//        계정도 새 비밀번호로 바로 로그인할 수 있어야 하니까요).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const AUTH_EMAIL_DOMAIN = "ate1ier.local"; // js/01b-cloud-sync-core.js와 반드시 동일해야 함
const ACCOUNTS_KEY = "personal-app:accounts";

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

// ---- js/01g-accounts-auth.js의 해시 함수들과 완전히 동일한 로직 (Deno의 Web
//      Crypto도 브라우저와 같은 SubtleCrypto라서 바이트 단위로 똑같은 결과가 나옴) ----
function legacyHash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(Math.floor(hex.length / 2));
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes;
}
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function sha256Hex(str: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return bytesToHex(new Uint8Array(digest));
}
async function hashPasswordSha256(password: string, salt: string): Promise<string> {
  return sha256Hex(`${salt}:${password}`);
}
async function hashPasswordPBKDF2(password: string, saltHex: string, iterations: number): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(password), { name: "PBKDF2" }, false, ["deriveBits"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: hexToBytes(saltHex), iterations: iterations || 300000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return bytesToHex(new Uint8Array(derivedBits));
}
async function toAuthEmail(username: string): Promise<string> {
  const normalized = String(username || "").trim().toLowerCase();
  const hashHex = await sha256Hex(normalized);
  return `u${hashHex}@${AUTH_EMAIL_DOMAIN}`;
}
async function verifyLegacyPassword(account: any, password: string): Promise<boolean> {
  if (account.hashAlgo === "pbkdf2") {
    return account.passwordHash === (await hashPasswordPBKDF2(password, account.salt, account.iterations || 300000));
  }
  if (account.salt) {
    return account.passwordHash === (await hashPasswordSha256(password, account.salt));
  }
  return account.passwordHash === legacyHash(password);
}

async function loadAccountsRaw(): Promise<any[]> {
  const { data, error } = await admin.from("kv_store").select("value").eq("key", ACCOUNTS_KEY).maybeSingle();
  if (error) throw new Error(`계정 목록을 불러오지 못했어요: ${error.message}`);
  if (!data || !data.value) return [];
  try {
    const parsed = JSON.parse(data.value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_e) {
    return [];
  }
}
async function saveAccountsRaw(list: any[]): Promise<void> {
  const { error } = await admin.from("kv_store").upsert({
    key: ACCOUNTS_KEY,
    value: JSON.stringify(list),
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(`계정 목록을 저장하지 못했어요: ${error.message}`);
}
function stripSecretFields(account: any): any {
  const { passwordHash, salt, hashAlgo, iterations, cloudAuthSecret, ...rest } = account;
  return { ...rest, authMigrated: true };
}
async function findAuthUserIdByEmail(email: string): Promise<string | null> {
  // 이 앱은 소규모 팀용이라 계정 수가 많지 않으므로, 목록을 한 번에 받아 이메일로 찾는다.
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw new Error(`Supabase Auth 사용자 목록을 불러오지 못했어요: ${error.message}`);
  const found = (data?.users || []).find((u) => (u.email || "").toLowerCase() === email.toLowerCase());
  return found ? found.id : null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS_HEADERS });
  if (req.method !== "POST") return json({ ok: false, reason: "POST만 지원해요." });

  let body: any;
  try {
    body = await req.json();
  } catch (_e) {
    return json({ ok: false, reason: "요청 본문이 올바르지 않아요." });
  }
  const action = body?.action;

  try {
    if (action === "migrate-login") {
      const username = String(body?.username || "").trim();
      const password = String(body?.password || "");
      if (!username || !password) return json({ ok: false, reason: "아이디/비밀번호가 필요해요." });

      const accounts = await loadAccountsRaw();
      const idx = accounts.findIndex((a) => String(a.username || "").toLowerCase() === username.toLowerCase());
      if (idx === -1) return json({ ok: false, reason: "등록된 계정이 없어요." });
      const account = accounts[idx];

      if (account.authMigrated) {
        // 이미 새 방식으로 넘어온 계정인데 이 액션이 호출됐다면(클라이언트 로직 오류 등),
        // 여기서 다시 비밀번호를 확인해줄 방법이 없으니(해시가 이미 지워짐) 실패로 안내한다.
        return json({ ok: false, reason: "이미 새 로그인 방식으로 전환된 계정이에요. 로그인 화면을 새로고침해서 다시 시도해주세요." });
      }
      const passOk = await verifyLegacyPassword(account, password);
      if (!passOk) return json({ ok: false, reason: "아이디 또는 비밀번호가 올바르지 않아요." });

      const email = await toAuthEmail(username);
      const userId = await findAuthUserIdByEmail(email);
      if (!userId) return json({ ok: false, reason: "클라우드 인증 계정을 찾지 못했어요. 관리자에게 문의해주세요." });

      const { error: updErr } = await admin.auth.admin.updateUserById(userId, { password });
      if (updErr) return json({ ok: false, reason: `비밀번호 전환에 실패했어요: ${updErr.message}` });

      accounts[idx] = stripSecretFields(account);
      await saveAccountsRaw(accounts);

      return json({ ok: true });
    }

    if (action === "reset-password") {
      const targetAccountId = String(body?.targetAccountId || "");
      const newPassword = String(body?.newPassword || "");
      if (!targetAccountId || !newPassword) return json({ ok: false, reason: "대상 계정/새 비밀번호가 필요해요." });
      if (newPassword.length < 4) return json({ ok: false, reason: "비밀번호는 4자 이상이어야 해요." });

      // 호출자가 실제로 로그인돼 있고 마스터 계정인지, 클라이언트가 보낸 값이 아니라
      // 요청에 실려온 인증 토큰(Authorization 헤더)으로 서버가 직접 확인한다.
      const authHeader = req.headers.get("Authorization") || "";
      const token = authHeader.replace(/^Bearer\s+/i, "");
      if (!token) return json({ ok: false, reason: "로그인이 필요해요." });
      const anonScoped = createClient(SUPABASE_URL, ANON_KEY);
      const { data: callerData, error: callerErr } = await anonScoped.auth.getUser(token);
      if (callerErr || !callerData?.user?.email) return json({ ok: false, reason: "로그인 정보를 확인하지 못했어요." });
      const callerEmail = callerData.user.email.toLowerCase();

      const accounts = await loadAccountsRaw();
      let callerAccount: any = null;
      for (const a of accounts) {
        const email = await toAuthEmail(String(a.username || ""));
        if (email === callerEmail) { callerAccount = a; break; }
      }
      if (!callerAccount || !callerAccount.isMaster) {
        return json({ ok: false, reason: "마스터 계정만 다른 계정의 비밀번호를 초기화할 수 있어요." });
      }

      const targetIdx = accounts.findIndex((a) => a.id === targetAccountId);
      if (targetIdx === -1) return json({ ok: false, reason: "대상 계정을 찾지 못했어요." });
      const targetAccount = accounts[targetIdx];

      const targetEmail = await toAuthEmail(String(targetAccount.username || ""));
      const targetUserId = await findAuthUserIdByEmail(targetEmail);
      if (!targetUserId) return json({ ok: false, reason: "대상 계정의 클라우드 인증 계정을 찾지 못했어요." });

      const { error: updErr } = await admin.auth.admin.updateUserById(targetUserId, { password: newPassword });
      if (updErr) return json({ ok: false, reason: `비밀번호 변경에 실패했어요: ${updErr.message}` });

      accounts[targetIdx] = stripSecretFields(targetAccount);
      await saveAccountsRaw(accounts);

      return json({ ok: true });
    }

    return json({ ok: false, reason: "알 수 없는 action이에요." });
  } catch (e) {
    return json({ ok: false, reason: String((e as Error)?.message || e) });
  }
});
