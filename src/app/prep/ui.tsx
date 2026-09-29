import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/app/components/MDXComponents";
import type { CardType, Mark, Track } from "@/lib/prep-validate";

export const TRACK_NAMES: Record<Track, string> = {
  js: "JavaScript",
  browser: "Browser",
  react: "React",
  "fe-design": "Frontend design",
  "be-design": "Backend design",
};

export const TYPE_NAMES: Record<CardType, string> = {
  explain: "Explain",
  short: "Question",
  mc: "Quiz",
  build: "Build",
};

export const MARK_NAMES: Record<Mark, string> = { got: "Got it", partly: "Partly", missed: "Missed" };

/** "01 — Tracks ————", the portfolio's section label. */
export function Label({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <h2 className="prep-label">
      <span>{String(n).padStart(2, "0")}</span>
      <span>{children}</span>
      <i aria-hidden="true" />
    </h2>
  );
}

export function MarkTag({ mark }: { mark: Mark }) {
  return <span className={`prep-tag ${mark}`}>{MARK_NAMES[mark]}</span>;
}

export function Empty({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="prep-empty">
      <b>{title}</b>
      {children}
    </div>
  );
}

/** "Sep 29", in UTC like the schedule. */
export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

/**
 * A lesson, rendered on the server with the blog's components. Plain
 * Markdown mode: the run writes the text, and Markdown mode cannot run code.
 */
export function Lesson({ source }: { source: string }) {
  return (
    <article className="blog-prose prep-lesson">
      <MDXRemote source={source} components={mdxComponents} options={{ mdxOptions: { format: "md" } }} />
    </article>
  );
}
