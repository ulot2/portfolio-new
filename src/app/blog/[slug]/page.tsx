import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug, getPostSlugs } from "@/lib/blog";
import { PostHeader } from "@/app/components/PostHeader";
import { PostFooter } from "@/app/components/PostFooter";
import { TextSelectionShare } from "@/app/components/TextSelectionShare";
import { mdxComponents } from "@/app/components/MDXComponents";
import { BlogTopBar } from "@/app/components/BlogTopBar";
import { BLOG_URL } from "@/lib/site";

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
    alternates: { canonical: `${BLOG_URL}/${slug}` },
    authors: [{ name: "Toluwalope Adegoke" }],
    openGraph: {
      title: `${metadata.title} — Toluwalope Adegoke`,
      description: metadata.description,
      type: "article",
      url: `${BLOG_URL}/${slug}`,
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
    <>
      <BlogTopBar href="/" label="Writing" />
      <main className="site-container ar-page" id="main">
        <TextSelectionShare articleTitle={post.metadata.title} />
        <PostHeader post={post.metadata} />
        <article className="blog-prose hero-rise" style={{ "--i": 1 } as React.CSSProperties}>
          <MDXRemote source={post.content} components={mdxComponents} />
        </article>

        <PostFooter prevPost={prevPost} nextPost={nextPost} />
      </main>
    </>
  );
}

