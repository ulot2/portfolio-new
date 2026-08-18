import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllPosts, getAllTags } from "@/lib/blog";
import { BlogListClient } from "../components/BlogListClient";

export const metadata: Metadata = {
  title: "Writing & Articles — Toluwalope Adegoke",
  description:
    "Technical articles, frontend engineering breakdowns, micro-interaction design, and lessons from building SaaS products by Toluwalope Adegoke.",
  openGraph: {
    title: "Writing & Articles — Toluwalope Adegoke",
    description:
      "Technical articles, frontend engineering breakdowns, and lessons from building SaaS products.",
    type: "website",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <main className="site-container blog-index-page">
      {/* Top back navigation */}
      <nav className="blog-nav-header fade-up">
        <Link href="/" className="back-link">
          <ArrowLeft size={15} className="back-arrow-icon" />
          <span>Back to Portfolio</span>
        </Link>
      </nav>

      {/* Header */}
      <header className="blog-index-header fade-up delay-1">
        <h1 className="blog-page-title">Writing</h1>
        <p className="blog-page-subtitle">
          Thoughts, technical deep dives, and architectural lessons from building
          modern web applications and SaaS products.
        </p>
      </header>

      {/* Interactive List with Search and Tag Filters */}
      <BlogListClient posts={posts} tags={tags} />
    </main>
  );
}
