import { NextRequest, NextResponse } from "next/server";
import { isSyncAuthed } from "@/lib/jobs-auth";
import { applyWrites, getRedis, listRoles, putResume, type Role } from "@/lib/jobs-store";

/**
 * The laptop's endpoint, used by jobagent/push.py. Bearer token only: it never
 * accepts a browser session, and a browser session can never reach it.
 *
 * GET  -> statuses, so the daily run can drop roles already handled.
 * POST -> upsert roles and resumes.
 */

async function guard(req: NextRequest) {
  if (!(await isSyncAuthed(req))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!process.env.JOBS_SYNC_TOKEN) {
    return NextResponse.json({ error: "Sync is not configured." }, { status: 503 });
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

  const roles = await listRoles(redis);
  return NextResponse.json({
    // Only what the daily run needs: ids, status, applied_at. No letters, no
    // answers, nothing that would make this a way to read the dashboard.
    statuses: roles.map((r) => ({
      ext_id: r.ext_id,
      status: r.status ?? "new",
      applied_at: r.applied_at ?? null,
    })),
  });
}

type Payload = {
  roles?: { op: "set" | "update"; ext_id: string; doc: Role }[];
  resumes?: { slug: string; filename: string; b64: string }[];
};

export async function POST(req: NextRequest) {
  const denied = await guard(req);
  if (denied) return denied;

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: "Storage is not configured." }, { status: 503 });
  }

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON." }, { status: 400 });
  }

  const result = await applyWrites(redis, body.roles ?? []);

  let resumes = 0;
  for (const r of body.resumes ?? []) {
    if (!r.slug || !r.b64) continue;
    if (!/^[A-Za-z0-9._-]{1,120}$/.test(r.slug)) continue;
    await putResume(redis, r.slug, r.filename || `${r.slug}.pdf`, r.b64);
    resumes++;
  }

  return NextResponse.json({ ...result, resumes });
}
