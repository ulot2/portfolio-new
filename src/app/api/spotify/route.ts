import { unstable_cache } from "next/cache";
import { loadSpotifyStatus } from "@/lib/spotify";

const getStatus = unstable_cache(loadSpotifyStatus, ["hero-spotify-status"], { revalidate: 60 });

export async function GET() {
  return Response.json(await getStatus(), {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=60" },
  });
}
