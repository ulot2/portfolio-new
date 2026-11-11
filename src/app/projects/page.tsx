import React from "react";
import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { SITE_URL } from "@/lib/site";
import { BlogTopBar } from "../components/BlogTopBar";
import { ProjectsCatalogue } from "../components/ProjectsCatalogue";
import { SectionHeading } from "../components/SectionHeading";
import { WaveIcon } from "../components/ink";

export const metadata: Metadata = {
  title: "Projects — Toluwalope Adegoke",
  description:
    "Every project by Toluwalope Adegoke: web apps, developer tools and websites, each one an answer to a “what if”.",
  alternates: { canonical: `${SITE_URL}/projects` },
  openGraph: {
    title: "Projects — Toluwalope Adegoke",
    description: "Web apps, developer tools and websites, each one an answer to a “what if”.",
    type: "website",
    url: `${SITE_URL}/projects`,
  },
};

const BOX =
  "M14 3.8C48 2.3 97 3 138 3.2c7.8.1 10.1 4.7 10.4 20.6.4 15.9-2 22.6-10.2 22.8-37.7.6-88.3 1.2-124.4-.1C6 46.1 3.8 40 4.2 24.3 4.5 9.7 6 4.2 14 3.8Z";
const RETRACE = "M9 6.5c40-2.6 92-2.2 131-1 6 .4 8.6 6 8.4 19.5-.3 14-3.3 19.8-10.6 20.3-35 1.4-90 1.7-123.6.4";

export default function ProjectsPage() {
  return (
    <>
      <BlogTopBar href={SITE_URL} label="Portfolio" />

      <main className="site-container pj-page" id="main">
        <header className="bl-intro pj-intro">
          <SectionHeading as="h1" word="projects" label="Projects" count={projects.length} />
          <p className="bl-lede">
            Each of these started as a &ldquo;what if&rdquo;. Here is what I built to answer it.
          </p>
        </header>

        <ProjectsCatalogue projects={projects} />

        {/* The page ends where the hero began: an invitation to bring the next question. */}
        <aside className="pj-next">
          <p className="pj-next-title">Got a &ldquo;what if&rdquo; of your own?</p>
          <p className="pj-next-copy">Tell me about it. The next entry in this list could be yours.</p>
          <a className="hero-link pj-next-link" href="mailto:tolu.nuell@gmail.com">
            {/* The same twice-drawn pen box as the hero's Say hello. */}
            <svg className="hero-button-outline" viewBox="0 0 152 50" preserveAspectRatio="none" aria-hidden="true">
              <path className="ink-line" pathLength={1} vectorEffect="non-scaling-stroke" d={BOX} />
              <path className="ink-line hero-button-trace" pathLength={1} vectorEffect="non-scaling-stroke" d={BOX} />
              <path className="ink-line hero-button-retrace" pathLength={1} vectorEffect="non-scaling-stroke" d={RETRACE} />
            </svg>
            <WaveIcon className="hero-link-icon" />
            Say hello
          </a>
        </aside>
      </main>
    </>
  );
}
