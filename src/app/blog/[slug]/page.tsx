import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug, getPostSlugs } from "@/lib/blog";
import { PostHeader } from "@/app/components/PostHeader";
import { PostFooter } from "@/app/components/PostFooter";
// import { ClapButton } from "@/app/components/ClapButton";
import { TextSelectionShare } from "@/app/components/TextSelectionShare";
import { mdxComponents } from "@/app/components/MDXComponents";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found — Toluwalope Adegoke",
    };
  }

  const { metadata } = post;

  return {
    title: `${metadata.title} — Toluwalope Adegoke`,
    description: metadata.description,
    keywords: metadata.tags,
    authors: [{ name: "Toluwalope Adegoke" }],
    openGraph: {
      title: `${metadata.title} — Toluwalope Adegoke`,
      description: metadata.description,
      type: "article",
      publishedTime: metadata.date,
      authors: ["Toluwalope Adegoke"],
      tags: metadata.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      creator: "@Tolu_dev",
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || !post.metadata.published) {
    notFound();
  }

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  return (
    <main className="site-container blog-article-page">
      <TextSelectionShare articleTitle={post.metadata.title} />
      <PostHeader post={post.metadata} />
      <article className="blog-prose fade-up delay-1">
        <MDXRemote source={post.content} components={mdxComponents} />
      </article>

      {/* Interactive Engagement: Multi-Clap Button (commented out) */}
      {/* <ClapButton slug={slug} /> */}

      <PostFooter
        currentPost={post.metadata}
        prevPost={prevPost}
        nextPost={nextPost}
      />
    </main>
  );
}

