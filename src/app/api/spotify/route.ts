import { unstable_cache } from "next/cache";
import { loadSpotifyStatus } from "@/lib/spotify";

// Without this, Next.js builds the route once at deploy time and the song
// never changes. unstable_cache still limits Spotify calls to one a minute.
export const dynamic = "force-dynamic";

const getStatus = unstable_cache(loadSpotifyStatus, ["hero-spotify-status"], { revalidate: 60 });

export async function GET() {
  return Response.json(await getStatus(), {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=60" },
  });
}
