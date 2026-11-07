# Portfolio

The personal site of Toluwalope Adegoke, built with Next.js. One app serves three hosts:

| Host | What it serves |
|---|---|
| `tnuell.sbs` | The portfolio home page |
| `blog.tnuell.sbs` | The blog. Posts are MDX files in `content/posts/`. |
| `jobs.tnuell.sbs` | A private jobs dashboard. You must log in with a passphrase. |

`src/middleware.ts` sends each host to its route tree.

## Run it locally

1. Install the packages:

   ```bash
   pnpm install
   ```

2. Start the dev server:

   ```bash
   pnpm dev
   ```

3. Open these addresses:
   - Home: http://localhost:3000
   - Blog: http://blog.localhost:3000
   - Jobs: http://jobs.localhost:3000

## Environment variables

Put these in `.env.local`. The home page and the blog work without them.

| Variable | Used for |
|---|---|
| `UPSTASH_REDIS_REST_URL` or `KV_REST_API_URL` | The Redis database for the jobs dashboard |
| `UPSTASH_REDIS_REST_TOKEN` or `KV_REST_API_TOKEN` | The token for that database |
| `JOBS_PASSPHRASE` | The passphrase for the jobs login |
| `JOBS_SESSION_SECRET` | The key that signs the jobs login cookie |
| `JOBS_SYNC_TOKEN` | The bearer token for `POST /api/jobs/sync` |

## Hero time and Spotify status

The hero shows the current time in `Africa/Lagos`, updating every 30 seconds.
The availability message says “probably around” from 8 AM until 10 PM, and
“probably recharging” overnight; this is a time-based hint, not online presence.

To connect your own Spotify listening activity:

1. Create an app in the [Spotify developer dashboard](https://developer.spotify.com/dashboard).
   Register `http://127.0.0.1:4387/callback` as its redirect URI.
2. Add `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` to `.env.local`.
3. Run `pnpm spotify:connect`, open the printed Spotify link, and authorize
   access to currently playing and recently played tracks. The helper saves
   `SPOTIFY_REFRESH_TOKEN` to `.env.local` without printing it.
4. Restart the dev server. For production, set all three `SPOTIFY_` variables
   in the hosting environment and redeploy.

Only the portfolio owner's account is connected; visitors never need to log in.
Credentials stay on the server. The public endpoint exposes only the track name,
artist, Spotify link, playing state, and last-played time, cached for 60 seconds.
The hero checks for updates every minute while the page is visible. Without a
connection, recent tracks, or a working Spotify response, it shows a quiet fallback.

The integration follows Spotify's [authorization code flow](https://developer.spotify.com/documentation/web-api/tutorials/code-flow)
and requests only `user-read-currently-playing` and `user-read-recently-played`.

## Write a blog post

1. Add a `.mdx` file to `content/posts/`. The file name becomes the URL.
2. Give it front matter with `title`, `description`, `date`, and `tags`.
3. If the post is a draft, add `published: false`.
