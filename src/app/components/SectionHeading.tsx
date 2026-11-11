"use client";

import { useEffect, useRef } from "react";
import { HandWord, Tally } from "./ink";

/**
 * A section title written in the logo's hand. It writes itself the first time
 * it scrolls into view. `word` must have strokes drawn in ink.tsx (WORDS).
 * `count`, when given, is tallied by hand beside the title.
 */
export const SectionHeading = ({
  word,
  label,
  count,
  countLabel,
  as: Title = "h2",
}: {
  word: string;
  label: string;
  count?: number;
  /** What the tally counts, read to screen readers. Defaults to the label. */
  countLabel?: string;
  /** The page's main title uses h1; section titles stay h2. */
  as?: "h1" | "h2";
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.setAttribute("data-seen", "");
        seen.disconnect();
      },
      { threshold: 0.6 },
    );
    seen.observe(el);
    return () => seen.disconnect();
  }, []);

  return (
    <div className="hand-heading" ref={ref}>
      <Title className="hand-heading-title">
        <span className="visually-hidden">{label}</span>
        <HandWord word={word} className="hand-heading-word" />
      </Title>
      {count !== undefined && (
        <span className="hand-heading-tally">
          <span className="visually-hidden">
            {count} {countLabel ?? label.toLowerCase()}
          </span>
          <Tally count={count} className="hand-heading-tally-ink" />
        </span>
      )}
    </div>
  );
};

export default SectionHeading;
