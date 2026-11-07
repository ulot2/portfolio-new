import { randomBytes, timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";

try {
  process.loadEnvFile(".env.local");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  console.error("Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to .env.local, then run this command again.\nCreate your app at https://developer.spotify.com/dashboard and register this redirect URI:\nhttp://127.0.0.1:4387/callback");
  process.exit(1);
}

const redirectUri = "http://127.0.0.1:4387/callback";
const state = randomBytes(32).toString("hex");
let exchanging = false;
const server = createServer(async (request, response) => {
  const url = new URL(request.url, redirectUri);
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "text/plain; charset=utf-8");
  response.setHeader("Referrer-Policy", "no-referrer");
  if (url.pathname !== "/callback") {
    response.writeHead(404).end("Not found.");
    return;
  }
  const returnedState = Buffer.from(url.searchParams.get("state") ?? "");
  const expectedState = Buffer.from(state);
  if (returnedState.length !== expectedState.length || !timingSafeEqual(returnedState, expectedState)) {
    response.writeHead(400).end("Invalid connection state. Use the link printed in your terminal.");
    return;
  }
  if (url.searchParams.has("error")) {
    response.writeHead(400).end("Spotify authorization was declined. You can close this tab and try again.");
    server.close();
    return;
  }
  const code = url.searchParams.get("code");
  if (!code || exchanging) {
    response.writeHead(400).end("Missing authorization code or connection already in progress.");
    return;
  }
  exchanging = true;
  try {
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!tokenResponse.ok) throw new Error("Spotify token exchange failed. Check the app credentials and redirect URI.");
    const token = await tokenResponse.json();
    if (typeof token.refresh_token !== "string" || /[\r\n]/.test(token.refresh_token)) {
      throw new Error("Spotify did not return a refresh token. Run the connection again.");
    }
    let env = await readFile(".env.local", "utf8").catch((error) => {
      if (error.code === "ENOENT") return "";
      throw error;
    });
    env = env.replace(/^SPOTIFY_REFRESH_TOKEN=.*(?:\r?\n|$)/gm, "");
    await writeFile(".env.local", `${env.trimEnd()}\nSPOTIFY_REFRESH_TOKEN=${token.refresh_token}\n`, { mode: 0o600 });
    response.end("Spotify connected. You can close this tab and restart your portfolio dev server.");
    console.log("Spotify connected. Refresh token saved to .env.local (not printed).\nRestart the dev server. For production, add all three SPOTIFY_ variables to your hosting environment and redeploy.");
  } catch (error) {
    response.writeHead(500).end("Connection failed. Check your terminal, then run the connection again.");
    console.error(error instanceof Error ? error.message : "Spotify connection failed.");
    process.exitCode = 1;
  } finally {
    server.close();
  }
});

server.on("error", (error) => {
  console.error(`Could not start the local connection helper: ${error.message}`);
  process.exitCode = 1;
});
server.listen(4387, "127.0.0.1", () => {
  const url = new URL("https://accounts.spotify.com/authorize");
  url.search = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    state,
    scope: "user-read-currently-playing user-read-recently-played",
  }).toString();
  console.log(`Open this link in your browser to connect your Spotify account:\n\n${url}\n\nWaiting for authorization (expires in 5 minutes)…`);
});
const timeout = setTimeout(() => {
  console.error("Spotify connection timed out. Run the command again to retry.");
  server.close();
  process.exitCode = 1;
}, 5 * 60_000);
timeout.unref();
server.on("close", () => clearTimeout(timeout));
