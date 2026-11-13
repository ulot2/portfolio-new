import React from "react";
import Link from "next/link";
import { PostMetadata } from "@/types/blog";
import { ArrowIcon, Rule, Underline } from "./ink";
import { TagList } from "./TagList";

interface BlogCardProps {
  post: PostMetadata;
  index?: number;
  /** absolute origin when the card is rendered off the blog host */
  base?: string;
}

/** One entry in the writing index: the date in the margin, the piece beside it. */
export const BlogCard = ({ post, index = 0, base = "" }: BlogCardProps) => {
  const date = new Date(post.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <li className="bl-item hero-rise" style={{ "--i": Math.min(index, 5) } as React.CSSProperties}>
      <Link href={`${base}/${post.slug}`} className="bl-link">
        <span className="bl-meta">
          <time dateTime={post.date}>{formattedDate}</time>
          <span className="bl-meta-read">{post.readingTime}</span>
        </span>
        <span className="bl-body">
          <span className="bl-head">
            <span className="bl-title">
              {post.title}
              <Underline className="bl-underline" />
            </span>
            <ArrowIcon className="bl-arrow" />
          </span>
          {post.description && <span className="bl-desc">{post.description}</span>}
          {post.tags.length > 0 && (
            <span className="bl-item-tags">
              <span className="visually-hidden">Topics: </span>
              <TagList tags={post.tags} />
            </span>
          )}
        </span>
      </Link>
      <Rule className="bl-rule" />
    </li>
  );
};

export default BlogCard;
