import React from "react";
import type { Metadata } from "next";
import { getAllPosts, getAllTags } from "@/lib/blog";
import { BlogListClient } from "../components/BlogListClient";
import { SectionHeading } from "../components/SectionHeading";
import { BlogTopBar } from "../components/BlogTopBar";
import { FeedIcon } from "../components/ink";
import { SITE_URL, BLOG_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Writing & Articles — Toluwalope Adegoke",
  description:
    "Technical articles, frontend engineering breakdowns, micro-interaction design, and lessons from building SaaS products by Toluwalope Adegoke.",
  alternates: { canonical: BLOG_URL },
  openGraph: {
    title: "Writing & Articles — Toluwalope Adegoke",
    description:
      "Technical articles, frontend engineering breakdowns, and lessons from building SaaS products.",
    type: "website",
    url: BLOG_URL,
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <>
      <BlogTopBar href={SITE_URL} label="Portfolio" />

      <main className="site-container bl-page" id="main">
        <header className="bl-intro">
          <SectionHeading
            as="h1"
            word="writing"
            label="Writing"
            count={posts.length}
            countLabel={posts.length === 1 ? "piece" : "pieces"}
          />
          <p className="bl-lede">
            Thoughts, technical deep dives, and lessons from building for the web.
          </p>
        </header>

        <BlogListClient posts={posts} tags={tags} />

        <footer className="bl-foot">
          <a className="bl-feed" href="/feed.xml">
            <FeedIcon className="bl-feed-icon" />
            Follow along by RSS
          </a>
        </footer>
      </main>
    </>
  );
}
