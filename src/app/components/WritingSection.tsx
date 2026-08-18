import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedPosts } from "@/lib/blog";
import { BlogCard } from "./BlogCard";

export const WritingSection = () => {
  const posts = getFeaturedPosts(3);

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="section" id="writing">
      <div
        className="section-label fade-up delay-1"
        style={{ marginBottom: "2rem" }}
      >
        <span className="label">Writing</span>
      </div>

      <div className="blog-posts-grid">
        {posts.map((post, index) => (
          <BlogCard key={post.slug} post={post} index={index} />
        ))}
      </div>

      <div className="section-footer fade-up" style={{ marginTop: "2rem" }}>
        <Link href="/blog" className="view-all-link">
          <span>Read All Articles</span>
          <ArrowRight size={14} className="view-all-arrow" />
        </Link>
      </div>
    </section>
  );
};

export default WritingSection;
