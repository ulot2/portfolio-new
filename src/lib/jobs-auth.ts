/**
 * Auth for the private jobs dashboard at jobs.tnuell.sbs.
 *
 * Web Crypto only, never node:crypto, so the same functions run in Edge
 * middleware and in Node route handlers. That lets middleware verify the
 * session signature properly instead of only checking that a cookie exists.
 *
 * Three secrets, all set in Vercel:
 *   JOBS_PASSPHRASE      what you type on the login page
 *   JOBS_SESSION_SECRET  signs the session cookie
 *   JOBS_SYNC_TOKEN      lets the laptop push roles; never accepted as a session
 */

const enc = new TextEncoder();

export const COOKIE = "jobs_session";
export const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array | null {
  if (hex.length === 0 || hex.length % 2 !== 0 || !/^[0-9a-f]+$/.test(hex)) return null;
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}

async function sha256(value: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(value)));
}

/**
 * Compare two SHA-256 digests without leaking where they differ. Both are
 * always 32 bytes, so the length check never reveals anything about the input.
 * Web Crypto has no timingSafeEqual, so this is the equivalent.
 */
function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

/** Compare a supplied secret against an expected one, in constant time. */
async function secretsMatch(supplied: string, expected: string | undefined): Promise<boolean> {
  if (!expected || !supplied) return false;
  const [a, b] = await Promise.all([sha256(supplied), sha256(expected)]);
  return constantTimeEqual(a, b);
}

/** True when the passphrase matches JOBS_PASSPHRASE. */
export async function checkPassphrase(supplied: string): Promise<boolean> {
  return secretsMatch(supplied, process.env.JOBS_PASSPHRASE);
}

/** `<expiry>.<hmac>` — the cookie value. Null when the secret is unset. */
export async function createSession(): Promise<string | null> {
  const secret = process.env.JOBS_SESSION_SECRET;
  if (!secret) return null;
  const expiry = String(Date.now() + MAX_AGE_SECONDS * 1000);
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(secret), enc.encode(expiry));
  return `${expiry}.${toHex(sig)}`;
}

/** Verify signature and expiry. Any malformed value is simply false. */
export async function verifySession(value: string | undefined | null): Promise<boolean> {
  const secret = process.env.JOBS_SESSION_SECRET;
  if (!secret || !value) return false;

  const dot = value.indexOf(".");
  if (dot < 1) return false;
  const expiry = value.slice(0, dot);
  const sig = fromHex(value.slice(dot + 1));
  if (!sig) return false;

  const expiryMs = Number(expiry);
  if (!Number.isFinite(expiryMs) || expiryMs <= Date.now()) return false;

  // subtle.verify is constant time, which is why the signature is not rebuilt
  // and string-compared here.
  return crypto.subtle.verify(
    "HMAC",
    await hmacKey(secret),
    sig as unknown as BufferSource,
    enc.encode(expiry),
  );
}

/** Read the session cookie off any Request, including a plain one. */
export function sessionCookie(req: Request): string | null {
  const header = req.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() === COOKIE) return part.slice(eq + 1).trim();
  }
  return null;
}

/**
 * Gate for the dashboard API routes. Middleware does not run on /api/* under
 * the current matcher, so every route calls this itself.
 */
export async function isAuthed(req: Request): Promise<boolean> {
  return verifySession(sessionCookie(req));
}

/**
 * Gate for the sync route, used by push.py on the laptop. Deliberately does not
 * accept a session cookie: a browser session must never be able to bulk-write
 * roles, and the sync token must never be usable to read the dashboard.
 */
export async function isSyncAuthed(req: Request): Promise<boolean> {
  const header = req.headers.get("authorization") ?? "";
  if (!header.toLowerCase().startsWith("bearer ")) return false;
  return secretsMatch(header.slice(7).trim(), process.env.JOBS_SYNC_TOKEN);
}

/** Cookie attributes. Secure is dropped in dev so http://jobs.localhost works. */
export function cookieOptions(maxAge = MAX_AGE_SECONDS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

/** True when the three secrets are configured. Used to fail loudly, not open. */
export function authConfigured(): boolean {
  return Boolean(process.env.JOBS_PASSPHRASE && process.env.JOBS_SESSION_SECRET);
}
