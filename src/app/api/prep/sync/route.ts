import { NextRequest, NextResponse } from "next/server";
import { isSyncAuthed } from "@/lib/jobs-auth";
import { applySync, getLastRun, getRedis, listAttempts, listCards, listTopics } from "@/lib/prep-store";

/**
 * The laptop's endpoint, used by interview/sync.py. Bearer token only
 * (PREP_SYNC_TOKEN): it never accepts a browser session.
 *
 * GET  -> topics, cards, and attempts, so the run can grade and plan.
 * POST -> topics with lessons, cards, and grades.
 */

async function guard(req: NextRequest) {
  if (!(await isSyncAuthed(req, process.env.PREP_SYNC_TOKEN))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const denied = await guard(req);
  if (denied) return denied;

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: "Storage is not configured." }, { status: 503 });
  }

  const [topics, cards, attempts, lastRun] = await Promise.all([
    listTopics(redis),
    listCards(redis),
    listAttempts(redis),
    getLastRun(redis),
  ]);
  return NextResponse.json({ topics, cards, attempts, lastRun });
}

export async function POST(req: NextRequest) {
  const denied = await guard(req);
  if (denied) return denied;

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: "Storage is not configured." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON." }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Body must be an object." }, { status: 400 });
  }

  const { topics, cards, grades } = body as Record<string, unknown>;
  for (const [name, list] of Object.entries({ topics, cards, grades })) {
    if (list !== undefined && !Array.isArray(list)) {
      return NextResponse.json({ error: `${name} must be a list.` }, { status: 400 });
    }
  }

  const result = await applySync(redis, {
    topics: topics as unknown[] | undefined,
    cards: cards as unknown[] | undefined,
    grades: grades as unknown[] | undefined,
  });
  return NextResponse.json(result);
}
