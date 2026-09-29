import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/jobs-auth";
import { addAttempt, getCard, getRedis } from "@/lib/prep-store";
import { parseAnswer, type Attempt } from "@/lib/prep-validate";

/**
 * Saves one answer from the Study page. Session cookie only. Middleware does
 * not run on /api/*, so this route checks the session itself.
 */
export async function POST(req: NextRequest) {
  if (!(await isAuthed(req))) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: "Storage is not configured." }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const cardId = typeof body?.cardId === "string" ? body.cardId : "";
  const card = cardId ? await getCard(redis, cardId) : null;
  if (!card) return NextResponse.json({ error: "No such card." }, { status: 404 });

  const parsed = parseAnswer(body, card);
  if (typeof parsed === "string") return NextResponse.json({ error: parsed }, { status: 400 });

  const attempt: Attempt = {
    id: crypto.randomUUID(),
    cardId,
    at: new Date().toISOString(),
    ...parsed,
  };
  await addAttempt(redis, attempt);
  return NextResponse.json({ attempt });
}
