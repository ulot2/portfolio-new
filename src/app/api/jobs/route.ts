import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/jobs-auth";
import { getRedis, listRoles, patchRole } from "@/lib/jobs-store";

// Middleware does not run on /api/*, so every route checks the session itself.
async function guard(req: NextRequest) {
  if (!(await isAuthed(req))) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
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
  return NextResponse.json({ roles: await listRoles(redis) });
}

const STATUSES = new Set(["new", "shortlisted", "applied", "skipped"]);

export async function PATCH(req: NextRequest) {
  const denied = await guard(req);
  if (denied) return denied;

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: "Storage is not configured." }, { status: 503 });
  }

  let body: { ext_id?: string; status?: string; notes?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const extId = String(body.ext_id ?? "");
  if (!extId) return NextResponse.json({ error: "ext_id is required." }, { status: 400 });

  const patch: { status?: string; notes?: string; applied_at?: string | null } = {};

  if (body.status !== undefined) {
    if (!STATUSES.has(body.status)) {
      return NextResponse.json({ error: "Unknown status." }, { status: 400 });
    }
    patch.status = body.status;
    patch.applied_at = body.status === "applied" ? new Date().toISOString() : null;
  }
  if (body.notes !== undefined) {
    patch.notes = String(body.notes).slice(0, 4000);
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to change." }, { status: 400 });
  }

  const role = await patchRole(redis, extId, patch);
  if (!role) return NextResponse.json({ error: "No such role." }, { status: 404 });
  return NextResponse.json({ role });
}
