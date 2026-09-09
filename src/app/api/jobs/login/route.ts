import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { getRedis, redisCredentials } from "@/lib/redis";
import {
  COOKIE,
  authConfigured,
  checkPassphrase,
  cookieOptions,
  createSession,
} from "@/lib/jobs-auth";

// Its own limiter, separate from the chat one in lib/ratelimit.ts: a different
// window, a different prefix, and a failure here must never be softened.
let limiter: Ratelimit | null = null;
const loginRedis = getRedis();
if (loginRedis) {
  limiter = new Ratelimit({
    redis: loginRedis,
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    prefix: "jobs_login",
  });
}

/**
 * Which variables are unset. Returned with the 503 so a misconfigured deploy
 * says what is wrong instead of "not configured".
 *
 * Safe to expose: these are names, never values, and every name is already
 * public in this repository. The 401 for a wrong passphrase stays vague; only
 * operator configuration is described here.
 */
function missingConfig(): string[] {
  const missing: string[] = [];
  if (!process.env.JOBS_PASSPHRASE) missing.push("JOBS_PASSPHRASE");
  if (!process.env.JOBS_SESSION_SECRET) missing.push("JOBS_SESSION_SECRET");
  if (!redisCredentials()) {
    missing.push("UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (or KV_REST_API_URL + KV_REST_API_TOKEN)");
  }
  return missing;
}

function notConfigured(missing: string[]) {
  return NextResponse.json(
    {
      error: `Login is not configured. Missing: ${missing.join(", ")}. Set these in Vercel, then redeploy — Vercel only applies variables to builds created after they are added.`,
      missing,
    },
    { status: 503 },
  );
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  // Fail shut. A missing secret must never mean "let everyone in".
  if (!authConfigured()) return notConfigured(missingConfig());

  // Unlike the chat limiter, a Redis outage does not fall through to allowing
  // the request: an unlimited login endpoint is a brute-force target. The one
  // exception is local development, where there is no Redis and no internet
  // exposure. NODE_ENV is always "production" on Vercel, so this cannot leak out.
  if (!limiter) {
    if (process.env.NODE_ENV === "production") return notConfigured(missingConfig());
  } else {
    const { success } = await limiter.limit(clientIp(req));
    if (!success) {
      return NextResponse.json(
        { error: "Too many attempts. Try again in an hour." },
        { status: 429 },
      );
    }
  }

  let passphrase = "";
  try {
    passphrase = String((await req.json())?.passphrase ?? "");
  } catch {
    return NextResponse.json({ error: "That did not work." }, { status: 400 });
  }

  if (!(await checkPassphrase(passphrase))) {
    // Deliberately vague and identical for every failure mode.
    return NextResponse.json({ error: "That did not work." }, { status: 401 });
  }

  const session = await createSession();
  if (!session) return notConfigured(missingConfig());

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, session, cookieOptions());
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "", cookieOptions(0));
  return res;
}
