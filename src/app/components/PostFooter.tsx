import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { PostMetadata } from "@/types/blog";

interface PostFooterProps {
  currentPost: PostMetadata;
  prevPost?: PostMetadata | null;
  nextPost?: PostMetadata | null;
}

export const PostFooter = ({
  prevPost,
  nextPost,
}: PostFooterProps) => {
  return (
    <footer className="article-footer fade-up">
      {/* Divider */}
      <hr className="article-footer-divider" />

      {/* Author Signature */}
      <div className="author-signature">
        <div className="author-avatar-wrapper">
          <Image
            src="/me.png"
            alt="Toluwalope Adegoke"
            width={46}
            height={46}
            className="author-avatar-img"
          />
        </div>
        <div className="author-info">
          <div className="author-header-row">
            <span className="author-name">Toluwalope Adegoke</span>
            <span className="author-role-label">Frontend Engineer</span>
          </div>
          <p className="author-bio">
            Crafting thoughtful, high-performance web applications with Next.js, React, and TypeScript. Currently building SoloStack.
          </p>
          <div className="author-links">
            <a
              href="https://x.com/Tolu_dev"
              target="_blank"
              rel="noopener noreferrer"
              className="author-link-item"
            >
              <span>X (Twitter)</span>
              <ArrowUpRight size={11} />
            </a>
            <span className="author-link-separator">•</span>
            <a
              href="https://github.com/ulot2"
              target="_blank"
              rel="noopener noreferrer"
              className="author-link-item"
            >
              <span>GitHub</span>
              <ArrowUpRight size={11} />
            </a>
            <span className="author-link-separator">•</span>
            <Link href="/#contact" className="author-link-item">
              <span>Get in touch</span>
              <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </div>

      {/* Next / Previous Article Navigation */}
      {(prevPost || nextPost) && (
        <div className="post-pagination-grid">
          {prevPost ? (
            <Link href={`/blog/${prevPost.slug}`} className="pagination-card prev">
              <div className="pagination-label">
                <ArrowLeft size={13} />
                <span>Previous Article</span>
              </div>
              <span className="pagination-title">{prevPost.title}</span>
            </Link>
          ) : (
            <div />
          )}

          {nextPost ? (
            <Link href={`/blog/${nextPost.slug}`} className="pagination-card next">
              <div className="pagination-label">
                <span>Next Article</span>
                <ArrowRight size={13} />
              </div>
              <span className="pagination-title">{nextPost.title}</span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}

      {/* Bottom Back Button */}
      <div className="article-bottom-nav">
        <Link href="/blog" className="btn-secondary">
          <ArrowLeft size={14} style={{ marginRight: "6px" }} />
          <span>All Articles</span>
        </Link>
      </div>
    </footer>
  );
};

export default PostFooter;
