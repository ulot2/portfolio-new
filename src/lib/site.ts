const dev = process.env.NODE_ENV === "development";

export const SITE_URL = dev ? "http://localhost:3000" : "https://tnuell.sbs";
export const BLOG_URL = dev
  ? "http://blog.localhost:3000"
  : "https://blog.tnuell.sbs";
