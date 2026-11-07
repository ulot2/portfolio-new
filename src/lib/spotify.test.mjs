// Run: node --test --experimental-strip-types src/lib/spotify.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { loadSpotifyStatus } from "./spotify.ts";

const song = {
  type: "track", name: "Test track", artists: [{ name: "Test artist" }],
  external_urls: { spotify: "https://open.spotify.com/track/abc123" },
};

async function withSpotify(t, responses, run) {
  const original = { ...process.env };
  process.env.SPOTIFY_CLIENT_ID = "test-id";
  process.env.SPOTIFY_CLIENT_SECRET = "test-secret";
  process.env.SPOTIFY_REFRESH_TOKEN = "test-refresh";
  t.after(() => {
    for (const key of ["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET", "SPOTIFY_REFRESH_TOKEN"]) {
      if (original[key] === undefined) delete process.env[key];
      else process.env[key] = original[key];
    }
  });
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push({ url, options });
    assert.ok(responses.length, "Unexpected Spotify request");
    const next = responses.shift();
    if (next instanceof Error) throw next;
    return next;
  });
  await run(calls);
}

const json = (data, status = 200) => Response.json(data, { status });
const token = () => json({ access_token: "private-access-token" });

test("unconfigured accounts make no upstream requests", async (t) => {
  await withSpotify(t, [], async (calls) => {
    delete process.env.SPOTIFY_REFRESH_TOKEN;
    assert.deepEqual(await loadSpotifyStatus(), { track: null });
    assert.equal(calls.length, 0);
  });
});

test("current song returns only public display fields", async (t) => {
  await withSpotify(t, [token(), json({ is_playing: true, item: song, device: { id: "private-device" } })], async (calls) => {
    const status = await loadSpotifyStatus();
    assert.deepEqual(status, { track: { title: "Test track", artist: "Test artist", url: song.external_urls.spotify, isPlaying: true, playedAt: null } });
    assert.equal(calls.length, 2);
    assert.equal(calls[0].options.body.get("grant_type"), "refresh_token");
    assert.equal(calls[1].options.headers.Authorization, "Bearer private-access-token");
    assert.ok(!JSON.stringify(status).includes("private"));
  });
});

for (const [name, current] of [
  ["inactive player", () => new Response(null, { status: 204 })],
  ["paused playback", () => json({ is_playing: false, item: song })],
  ["advertisement", () => json({ is_playing: true, item: null })],
]) {
  test(`${name} falls back to the last played track`, async (t) => {
    const playedAt = "2026-11-07T12:00:00Z";
    await withSpotify(t, [token(), current(), json({ items: [{ track: song, played_at: playedAt }] })], async (calls) => {
      const status = await loadSpotifyStatus();
      assert.equal(status.track.isPlaying, false);
      assert.equal(status.track.playedAt, playedAt);
      assert.match(calls[2].url, /recently-played\?limit=1$/);
    });
  });
}

test("expired credentials, rate limits, network failures and empty history fail quietly", async (t) => {
  for (const responses of [
    [json({}, 401)],
    [token(), json({}, 429)],
    [new Error("Network unavailable")],
    [token(), new Response(null, { status: 204 }), json({ items: [] })],
    [token(), new Response(null, { status: 204 }), json({}, 403)],
  ]) {
    await t.test("unavailable status", async (subtest) => {
      await withSpotify(subtest, responses, async () => assert.deepEqual(await loadSpotifyStatus(), { track: null }));
    });
  }
});

test("unsafe track URLs and invalid timestamps never reach display fields", async (t) => {
  await withSpotify(t, [token(), json({ is_playing: true, item: { ...song, external_urls: { spotify: "javascript:alert(1)" } } }), json({ items: [{ track: song, played_at: "invalid" }] })], async () => {
    const status = await loadSpotifyStatus();
    assert.equal(status.track.url, song.external_urls.spotify);
    assert.equal(status.track.playedAt, null);
  });
});
