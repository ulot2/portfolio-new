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

## Write a blog post

1. Add a `.mdx` file to `content/posts/`. The file name becomes the URL.
2. Give it front matter with `title`, `description`, `date`, and `tags`.
3. If the post is a draft, add `published: false`.
