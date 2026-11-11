"use client";

import React, { useEffect, useRef, useState } from "react";

export interface YearWeek {
  /** The first day of the week, YYYY-MM-DD. */
  start: string;
  count: number;
}

const weekLabel = (start: string) =>
  new Date(`${start}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

const plural = (n: number) => `${n.toLocaleString("en-GB")} contribution${n === 1 ? "" : "s"}`;

/**
 * The drawing and its readout. The line draws itself left to right the first
 * time it scrolls into view; pointing at it (or using the arrow keys once it
 * has focus) reads out one week at a time.
 */
export function YearLine({
  weeks,
  total,
  path,
  baseline,
  points,
  peak,
  months,
  viewBox,
}: {
  weeks: YearWeek[];
  total: number | null;
  path: string;
  baseline: string;
  /** Each week's point, in percent of the drawing box. */
  points: [number, number][];
  peak: number;
  months: { label: string; left: number }[];
  viewBox: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.setAttribute("data-seen", "");
        seen.disconnect();
      },
      { threshold: 0.5 },
    );
    seen.observe(el);
    return () => seen.disconnect();
  }, []);

  const pick = (clientX: number) => {
    const box = ref.current?.querySelector(".yi-draw")?.getBoundingClientRect();
    if (!box) return;
    const at = Math.round(((clientX - box.left) / box.width) * (weeks.length - 1));
    setActive(Math.min(weeks.length - 1, Math.max(0, at)));
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const last = weeks.length - 1;
    setActive((i) => {
      const from = i ?? last;
      if (e.key === "Home") return 0;
      if (e.key === "End") return last;
      return Math.min(last, Math.max(0, from + (e.key === "ArrowRight" ? 1 : -1)));
    });
  };

  const today = points[points.length - 1];
  const shown = active === null ? null : weeks[active];
  const peakAt = points[peak];
  const summary =
    total === null
      ? "My last year on GitHub, one week at a time."
      : `${plural(total)} on GitHub in the last year. The busiest week started ${weekLabel(weeks[peak].start)}, with ${plural(weeks[peak].count)}.`;

  return (
    <div className="yi" ref={ref}>
      <p className="yi-label">My last year on GitHub, in one line</p>

      <div
        className="yi-chart"
        role="img"
        aria-label={summary}
        tabIndex={0}
        onPointerMove={(e) => pick(e.clientX)}
        onPointerDown={(e) => pick(e.clientX)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
        onKeyDown={onKey}
        onBlur={() => setActive(null)}
      >
        <svg className="yi-draw" viewBox={viewBox} preserveAspectRatio="none" aria-hidden="true">
          <path className="ink-line yi-base" vectorEffect="non-scaling-stroke" d={baseline} />
          <path className="ink-line yi-line" vectorEffect="non-scaling-stroke" d={path} />
        </svg>

        {/* The busiest week gets a note and a small pen arrow, like a margin comment. */}
        <span
          className="yi-peak"
          style={{ left: `${Math.min(88, Math.max(12, peakAt[0]))}%`, top: `${peakAt[1]}%` }}
          aria-hidden="true"
        >
          busiest week
          <svg className="yi-peak-arrow" viewBox="0 0 16 16" fill="none">
            <path className="ink-line" d="M8 2.5c-.1 3.4 0 6.8.1 10.2M5 9.8c1 1 2 2 3.1 3.1 1-1.1 2-2.2 3-3.2" />
          </svg>
        </span>

        <span className="yi-today" style={{ left: `${today[0]}%`, top: `${today[1]}%` }} aria-hidden="true" />

        {active !== null && (
          <span
            className="yi-cursor"
            style={{ left: `${points[active][0]}%`, top: `${points[active][1]}%` }}
            aria-hidden="true"
          />
        )}

        <span className="yi-months" aria-hidden="true">
          {months.map((m) => (
            <span key={`${m.label}-${m.left}`} style={{ left: `${m.left}%` }}>
              {m.label}
            </span>
          ))}
        </span>
      </div>

      <p className="yi-readout" aria-live="polite">
        {shown ? (
          <>
            Week of {weekLabel(shown.start)} · <strong>{total === null ? `level ${shown.count}` : plural(shown.count)}</strong>
          </>
        ) : total === null ? (
          <>Point at the line to see a week.</>
        ) : (
          <>
            <strong>{plural(total)}</strong> in the last year
            <a className="yi-link" href="https://github.com/ulot2" target="_blank" rel="noopener noreferrer">
              on GitHub
              <svg className="yi-link-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path className="ink-line" d="M7.2 16.9c3-3.2 6.2-6.4 9.6-9.4" />
                <path className="ink-line" d="M9.6 6.9c2.5-.3 5-.3 7.4-.1.3 2.4.3 4.9 0 7.3" />
              </svg>
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </>
        )}
      </p>
    </div>
  );
}

export default YearLine;
