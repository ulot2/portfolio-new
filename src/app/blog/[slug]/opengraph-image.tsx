import { getPostBySlug, getPostSlugs } from "@/lib/blog";
import { ogCard, ogSize } from "@/lib/og";

export const alt = "Blog post by Toluwalope Adegoke";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return ogCard(post?.metadata.title ?? "Writing", "Writing");
}
