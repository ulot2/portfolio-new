"use client";

import { useEffect, useRef } from "react";

type Drawing = { line: string; arrow: string };

/**
 * The looping line and its caption. It draws itself in, left to right, the
 * first time it scrolls into view, and the yellow arrow lands last.
 */
export function YearLine({
  viewBox,
  year,
  half,
  label,
}: {
  viewBox: string;
  year: Drawing;
  /** The last half year, for narrow screens. */
  half: Drawing;
  label: string;
}) {
  const ref = useRef<HTMLElement>(null);

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

  const drawing = (d: Drawing, className: string) => (
    <svg className={`yi-draw ${className}`} viewBox={viewBox} fill="none" aria-hidden="true">
      <path className="ink-line yi-line" pathLength={1} d={d.line} />
      <path className="ink-line yi-arrow" pathLength={1} d={d.arrow} />
    </svg>
  );

  return (
    <figure className="yi" ref={ref}>
      <div role="img" aria-label={label}>
        {drawing(year, "yi-year")}
        {drawing(half, "yi-half")}
      </div>
      <figcaption className="yi-caption">
        Drawn from my{" "}
        <a href="https://github.com/ulot2" target="_blank" rel="noopener noreferrer">
          GitHub commits
          <svg className="yi-caption-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path className="ink-line" d="M7.2 16.9c3-3.2 6.2-6.4 9.6-9.4" />
            <path className="ink-line" d="M9.6 6.9c2.5-.3 5-.3 7.4-.1.3 2.4.3 4.9 0 7.3" />
          </svg>
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
        , one loop for each week of the past <span className="yi-span-year">year</span>
        <span className="yi-span-half">six months</span>.
      </figcaption>
    </figure>
  );
}

export default YearLine;
