import React from "react";
import { ArrowRight } from "lucide-react";
import { getFeaturedPosts } from "@/lib/blog";
import { BLOG_URL } from "@/lib/site";
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
        <span className="number">02</span>
        <span className="label">Writing</span>
        <span className="line" aria-hidden="true" />
      </div>

      <div className="blog-posts-grid">
        {posts.map((post, index) => (
          <BlogCard key={post.slug} post={post} index={index} base={BLOG_URL} />
        ))}
      </div>

      <div className="section-footer fade-up" style={{ marginTop: "2rem" }}>
        <a href={BLOG_URL} className="view-all-link">
          <span>Read All Articles</span>
          <ArrowRight size={14} className="view-all-arrow" />
        </a>
      </div>
    </section>
  );
};

export default WritingSection;
