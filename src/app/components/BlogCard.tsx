"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PostMetadata } from "@/types/blog";

interface BlogCardProps {
  post: PostMetadata;
  index?: number;
}

export const BlogCard = ({ post, index = 0 }: BlogCardProps) => {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: (index % 4) * 0.05 }}
      className="blog-item-wrapper"
    >
      <Link href={`/blog/${post.slug}`} className="blog-item">
        <div className="blog-item-header">
          <span className="blog-item-title">
            <span className="title-text">{post.title}</span>
            <ArrowUpRight size={15} className="card-arrow-icon" />
          </span>
          <div className="blog-item-meta">
            <span className="blog-item-date">{formattedDate}</span>
            <span className="blog-item-dot">•</span>
            <span className="blog-item-readtime">{post.readingTime}</span>
          </div>
        </div>

        {post.description && (
          <p className="blog-item-desc">{post.description}</p>
        )}
      </Link>
    </motion.article>
  );
};

export default BlogCard;

