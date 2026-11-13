"use client";

import React, { useState } from "react";
import { PostMetadata } from "@/types/blog";
import { CopyIcon, OutArrowIcon, Rule, TickIcon } from "./ink";
import { TagList } from "./TagList";

interface PostHeaderProps {
  post: PostMetadata;
}

export const PostHeader = ({ post }: PostHeaderProps) => {
  const [copied, setCopied] = useState(false);

  // Post dates are plain days, so they are read in UTC to stay on the same day everywhere.
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  const handleShareCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleShareToTwitter = () => {
    const tweetText = `"${post.title}" by @Tolu_dev`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}&url=${encodeURIComponent(window.location.href)}`;
    window.open(tweetUrl, "_blank", "noopener,noreferrer,width=550,height=420");
  };

  return (
    <header className="ar-header">
      <p className="ar-meta">
        <time dateTime={post.date}>{formattedDate}</time>
        <span aria-hidden="true"> · </span>
        {post.readingTime}
      </p>

      <h1 className="ar-title">{post.title}</h1>

      {post.description && <p className="ar-lede">{post.description}</p>}

      <div className="ar-bar">
        {post.tags && post.tags.length > 0 && (
          <p className="ar-tags">
            <span className="visually-hidden">Topics: </span>
            <TagList tags={post.tags} />
          </p>
        )}

        <div className="ar-share">
          <button type="button" onClick={handleShareCopy} className="ar-share-btn" data-copied={copied || undefined}>
            {copied ? <TickIcon className="ar-share-icon" /> : <CopyIcon className="ar-share-icon" />}
            <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
          </button>
          <button type="button" onClick={handleShareToTwitter} className="ar-share-btn">
            Post on X
            <OutArrowIcon className="ar-share-icon ar-share-out" />
          </button>
        </div>
      </div>

      <Rule className="ar-rule" />
    </header>
  );
};

export default PostHeader;
