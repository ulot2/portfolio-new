import { getAllPosts } from "@/lib/blog";
import { SITE_URL, BLOG_URL } from "@/lib/site";

export async function GET() {
  const posts = getAllPosts();
  // No lastmod for the home page: we don't track when it changes, and a
  // date that is always "today" teaches crawlers to ignore it.
  const staticUrls: { url: string; lastMod?: string; changefreq: string; priority: string }[] = [
    { url: SITE_URL, changefreq: "weekly", priority: "1.0" },
    { url: BLOG_URL, lastMod: posts[0]?.date, changefreq: "weekly", priority: "0.9" },
  ];

  const blogUrls = posts.map((post) => ({
    url: `${BLOG_URL}/${post.slug}`,
    lastMod: post.date,
    changefreq: "monthly",
    priority: "0.8",
  }));

  const allUrls = [...staticUrls, ...blogUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (item) => `  <url>
    <loc>${item.url}</loc>
${item.lastMod ? `    <lastmod>${item.lastMod}</lastmod>\n` : ""}    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
