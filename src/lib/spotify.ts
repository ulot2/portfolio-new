import type { ListeningStatus, ListeningTrack } from "./spotify-types";

type SpotifyTrack = {
  type?: string;
  name?: string;
  artists?: { name: string }[];
  external_urls?: { spotify?: string };
};

function toTrack(item: SpotifyTrack | null | undefined, isPlaying: boolean, playedAt: string | null): ListeningTrack | null {
  const url = item?.external_urls?.spotify;
  if (item?.type !== "track" || !item.name || !item.artists?.length || !url) return null;
  if (!/^https:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]+(?:\?|$)/.test(url)) return null;
  return { title: item.name, artist: item.artists.map((artist) => artist.name).join(", "), url, isPlaying, playedAt };
}

/** Called only by the server route; no credentials or raw Spotify payloads leave it. */
export async function loadSpotifyStatus(): Promise<ListeningStatus> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return { track: null };

  try {
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    if (!tokenResponse.ok) return { track: null };
    const token = await tokenResponse.json();
    if (typeof token.access_token !== "string") return { track: null };

    const headers = { Authorization: `Bearer ${token.access_token}` };
    const currentResponse = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers, cache: "no-store", signal: AbortSignal.timeout(8_000),
    });
    if (!currentResponse.ok) return { track: null };
    if (currentResponse.status !== 204) {
      const current = await currentResponse.json();
      if (current.is_playing === true) {
        const track = toTrack(current.item, true, null);
        if (track) return { track };
      }
    }

    const recentResponse = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
      headers, cache: "no-store", signal: AbortSignal.timeout(8_000),
    });
    if (!recentResponse.ok) return { track: null };
    const recent = (await recentResponse.json()).items?.[0];
    const playedAt = typeof recent?.played_at === "string" && Number.isFinite(Date.parse(recent.played_at))
      ? recent.played_at : null;
    return { track: toTrack(recent?.track, false, playedAt) };
  } catch {
    return { track: null };
  }
}
