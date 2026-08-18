"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Share2, Check, Twitter } from "lucide-react";
import { PostMetadata } from "@/types/blog";
// import { ViewCounter } from "./ViewCounter";

interface PostHeaderProps {
  post: PostMetadata;
}

export const PostHeader = ({ post }: PostHeaderProps) => {
  const [copied, setCopied] = useState(false);

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleShareCopy = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleShareToTwitter = () => {
    if (typeof window !== "undefined") {
      const tweetText = `"${post.title}" by @Tolu_dev`;
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweetText
      )}&url=${encodeURIComponent(window.location.href)}`;
      window.open(tweetUrl, "_blank", "noopener,noreferrer,width=550,height=420");
    }
  };

  return (
    <header className="article-header fade-up">
      {/* Top back navigation */}
      <nav className="article-nav">
        <Link href="/blog" className="back-link">
          <ArrowLeft size={15} className="back-arrow-icon" />
          <span>Back to all articles</span>
        </Link>
      </nav>

      {/* Meta tags & date */}
      <div className="article-meta-row">
        <div className="article-meta-info">
          <span className="article-meta-item">
            <Calendar size={13} className="meta-icon" />
            <span>{formattedDate}</span>
          </span>
          <span className="meta-separator">•</span>
          <span className="article-meta-item">
            <Clock size={13} className="meta-icon" />
            <span>{post.readingTime}</span>
          </span>
          {/* <span className="meta-separator">•</span>
          <ViewCounter slug={post.slug} /> */}
        </div>

        {/* Share buttons */}
        <div className="article-share-actions">
          <button
            type="button"
            onClick={handleShareCopy}
            className="share-action-btn"
            title="Copy article link"
          >
            {copied ? (
              <>
                <Check size={13} className="share-icon-copied" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Share2 size={13} />
                <span>Share</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleShareToTwitter}
            className="share-action-btn twitter-btn"
            title="Share on X"
          >
            <Twitter size={13} />
            <span>Post</span>
          </button>
        </div>
      </div>

      {/* Title */}
      <h1 className="article-main-title">{post.title}</h1>

      {/* Description */}
      {post.description && (
        <p className="article-lead-description">{post.description}</p>
      )}

      {/* Tag pills */}
      {post.tags && post.tags.length > 0 && (
        <div className="article-tags-row">
          {post.tags.map((tag) => (
            <span key={tag} className="article-tag-pill">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <hr className="article-header-divider" />
    </header>
  );
};

export default PostHeader;
