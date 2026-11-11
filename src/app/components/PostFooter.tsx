import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PostMetadata } from "@/types/blog";
import { SITE_URL } from "@/lib/site";
import { SignOff } from "./SignOff";
import { ArrowIcon, OutArrowIcon, Rule, Underline } from "./ink";

interface PostFooterProps {
  prevPost?: PostMetadata | null;
  nextPost?: PostMetadata | null;
}

export const PostFooter = ({ prevPost, nextPost }: PostFooterProps) => {
  return (
    <footer className="ar-footer">
      <SignOff />

      <div className="ar-author">
        <Rule className="ar-rule ar-rule-top" />
        <Image src="/me.png" alt="" width={56} height={56} className="ar-author-photo" />
        <div className="ar-author-copy">
          <p className="ar-author-name">
            Toluwalope Adegoke
            <span className="ar-author-role">Software developer</span>
          </p>
          <p className="ar-author-bio">
            Crafting thoughtful, high-performance web applications with Next.js, React, and TypeScript. Currently
            building SoloStack.
          </p>
          <p className="ar-author-links">
            <a href="https://x.com/Tolu_dev" target="_blank" rel="noopener noreferrer" className="ar-author-link">
              X<OutArrowIcon className="ar-author-icon" />
            </a>
            <a href="https://github.com/ulot2" target="_blank" rel="noopener noreferrer" className="ar-author-link">
              GitHub
              <OutArrowIcon className="ar-author-icon" />
            </a>
            <a href={`${SITE_URL}/#contact`} className="ar-author-link">
              Get in touch
              <ArrowIcon className="ar-author-icon ar-author-onward" />
            </a>
          </p>
        </div>
      </div>

      {(prevPost || nextPost) && (
        <nav className="ar-more" aria-label="More writing">
          <Rule className="ar-rule ar-rule-top" />
          {prevPost ? (
            <Link href={`/${prevPost.slug}`} className="ar-more-link ar-more-prev">
              <span className="ar-more-label">
                <ArrowIcon className="ar-more-icon" />
                Earlier
              </span>
              <span className="ar-more-title">
                {prevPost.title}
                <Underline className="ar-more-underline" />
              </span>
            </Link>
          ) : (
            <span />
          )}
          {nextPost && (
            <Link href={`/${nextPost.slug}`} className="ar-more-link ar-more-next">
              <span className="ar-more-label">
                Later
                <ArrowIcon className="ar-more-icon" />
              </span>
              <span className="ar-more-title">
                {nextPost.title}
                <Underline className="ar-more-underline" />
              </span>
            </Link>
          )}
        </nav>
      )}

      <Link href="/" className="ar-all">
        <ArrowIcon className="ar-all-icon" />
        All writing
      </Link>
    </footer>
  );
};

export default PostFooter;
