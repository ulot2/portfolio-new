import { getAllPosts } from "@/lib/blog";

export async function GET() {
  const posts = getAllPosts();
  const baseUrl = "https://toluwalope.dev";

  const staticUrls = [
    {
      url: `${baseUrl}`,
      lastMod: new Date().toISOString().split("T")[0],
      changefreq: "weekly",
      priority: "1.0",
    },
    {
      url: `${baseUrl}/blog`,
      lastMod: new Date().toISOString().split("T")[0],
      changefreq: "daily",
      priority: "0.9",
    },
  ];

  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
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
    <lastmod>${item.lastMod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
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
