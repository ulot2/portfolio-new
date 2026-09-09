import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/jobs-auth";
import { getRedis, getResume } from "@/lib/jobs-store";

/**
 * Hands back the tailored PDF as an ordinary file response. On a phone this is
 * the whole point: Content-Disposition: attachment puts the file straight into
 * Downloads, where the application form's upload field can pick it up.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await isAuthed(req))) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { slug } = await params;
  if (!/^[A-Za-z0-9._-]{1,120}$/.test(slug)) {
    return NextResponse.json({ error: "Bad slug." }, { status: 400 });
  }

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: "Storage is not configured." }, { status: 503 });
  }

  const doc = await getResume(redis, slug);
  if (!doc?.b64) {
    return NextResponse.json({ error: "No resume stored for that role." }, { status: 404 });
  }

  const bytes = Buffer.from(doc.b64, "base64");
  const filename = (doc.filename || `${slug}.pdf`).replace(/[^A-Za-z0-9._-]/g, "_");

  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(bytes.length),
      "Content-Disposition": `attachment; filename="${filename}"`,
      // Private document: never let a proxy or CDN keep a copy.
      "Cache-Control": "private, no-store",
    },
  });
}
