import React from "react";
import { SITE_URL } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";
import { ArrowIcon, NameMark, Underline } from "./ink";

/**
 * The blog's header: the portfolio's wordmark and theme switch, with one link
 * back to wherever the reader came from.
 */
export const BlogTopBar = ({ href, label }: { href: string; label: string }) => (
  <header className="site-container site-header">
    <a href={SITE_URL} className="site-logo" aria-label="Toluwalope Adegoke, back to the portfolio">
      <NameMark className="site-logo-mark" />
    </a>
    <nav className="site-nav" aria-label="Main">
      <a href={href} className="site-nav-link bl-back">
        <ArrowIcon className="bl-back-icon" />
        {label}
        <Underline className="site-nav-underline" />
      </a>
      <ThemeToggle />
    </nav>
  </header>
);

export default BlogTopBar;
