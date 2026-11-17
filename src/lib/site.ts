const dev = process.env.NODE_ENV === "development";

// www is the primary host on Vercel; the bare tnuell.site redirects to it.
export const SITE_URL = dev ? "http://localhost:3000" : "https://www.tnuell.site";
export const BLOG_URL = dev
  ? "http://blog.localhost:3000"
  : "https://blog.tnuell.site";
export const JOBS_URL = dev
  ? "http://jobs.localhost:3000"
  : "https://jobs.tnuell.site";
