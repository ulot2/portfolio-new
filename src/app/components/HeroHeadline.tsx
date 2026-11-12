"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { penMarks } from "@/lib/pen-marks";

type Marks = { w: number; h: number; loop: string; arrow: string; head: string; box: string; retrace: string };

// The pen's pace, in px per ms, and the easing of each stroke: a pen speeds
// up and slows down, so strokes ease in and out rather than only out.
const PACE = 1.15;
const PEN = "cubic-bezier(0.55, 0, 0.35, 1)";

/**
 * The hero headline. The sentence stays in type and the pen annotates it, like
 * a sketch on a whiteboard. A pencil loop rings "what if", an arrow carries it down,
 * and a yellow box closes round "what's next.", which brightens as it does.
 * All three marks are measured to the words, so they meet them exactly at
 * any width, and they draw again when the headline is hovered.
 */
export const HeroHeadline = () => {
  const root = useRef<HTMLHeadingElement>(null);
  const idea = useRef<HTMLSpanElement>(null);
  const built = useRef<HTMLSpanElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const running = useRef<Animation[]>([]);
  const [marks, setMarks] = useState<Marks | null>(null);
  const [state, setState] = useState<"idle" | "drawing" | "done">("idle");

  const measure = useCallback(() => {
    const h1 = root.current?.getBoundingClientRect();
    const i = idea.current?.getBoundingClientRect();
    const b = built.current?.getBoundingClientRect();
    if (!h1 || !i || !b) return;
    // Everything in the heading's own coordinates.
    const rel = (r: DOMRect) => ({ left: r.left - h1.left, top: r.top - h1.top, width: r.width, height: r.height });
    const ri = rel(i);
    const rb = rel(b);
    const em = parseFloat(getComputedStyle(root.current!).fontSize);
    setMarks({ w: h1.width, h: h1.height, ...penMarks(ri, rb, em, h1.width) });
  }, []);

  // Measure once the fonts are in (a fallback font would put the marks in the wrong place), and on resize.
  useLayoutEffect(() => {
    let alive = true;
    document.fonts.ready.then(() => alive && measure());
    const watch = new ResizeObserver(() => measure());
    if (root.current) watch.observe(root.current);
    return () => {
      alive = false;
      watch.disconnect();
    };
  }, [measure]);

  /** Draws each stroke in turn at the pen's pace. `delay` lets the first run wait for the page. */
  const draw = useCallback((delay: number) => {
    const el = svg.current;
    if (!el) return;
    running.current.forEach((a) => a.cancel());
    running.current = [];
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setState("done");
      return;
    }
    setState("drawing");

    let t = delay;
    const stroke = (sel: string, opts: { gap?: number; min?: number; easing?: string } = {}) => {
      const path = el.querySelector<SVGPathElement>(sel);
      if (!path) return;
      const len = path.getTotalLength();
      const duration = Math.max(opts.min ?? 120, len / PACE);
      t += opts.gap ?? 0;
      path.style.strokeDasharray = `${len} ${len}`;
      const anim = path.animate(
        [
          // Invisible until the pen touches down, so a waiting stroke's round tip never shows as a dot.
          { offset: 0, strokeDashoffset: len, opacity: 0 },
          { offset: 0.01, strokeDashoffset: len * 0.99, opacity: 1 },
          { offset: 1, strokeDashoffset: 0, opacity: 1 },
        ],
        // "both" holds the hidden first frame during the delay and the drawn last one after.
        { duration, delay: t, easing: opts.easing ?? PEN, fill: "both" },
      );
      running.current.push(anim);
      t += duration;
      return anim;
    };

    stroke(".hero-mark-loop", { min: 520 });
    stroke(".hero-mark-arrow", { gap: 60, min: 260 });
    stroke(".hero-mark-head", { gap: 0, min: 110, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
    const box = stroke(".hero-mark-box", { gap: 70, min: 520 });
    stroke(".hero-mark-retrace", { gap: -120, min: 260, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
    box?.finished.then(() => setState("done")).catch(() => {});
  }, []);

  // Draw on first measure, after the headline has settled in.
  const drawn = useRef(false);
  useEffect(() => {
    if (!marks || drawn.current) return;
    drawn.current = true;
    draw(320);
  }, [marks, draw]);

  useEffect(() => () => running.current.forEach((a) => a.cancel()), []);

  // Hovering redraws the marks, but never cuts one short.
  const replay = () => {
    if (state === "done" && matchMedia("(hover: hover)").matches) draw(0);
  };

  return (
    <h1 className="hero-title" id="hero-title" ref={root} data-state={state} onMouseEnter={replay}>
      <span className="hero-title-line hero-title-one">
        I turn{" "}
        <span className="hero-idea" ref={idea}>
          &ldquo;what if&rdquo;
        </span>
      </span>{" "}
      <span className="hero-title-line hero-title-two">
        into{" "}
        <span className="hero-built" ref={built}>
          what&rsquo;s next.
        </span>
      </span>

      {marks && (
        <svg
          ref={svg}
          className="hero-marks"
          width={marks.w}
          height={marks.h}
          viewBox={`0 0 ${marks.w} ${marks.h}`}
          fill="none"
          aria-hidden="true"
        >
          <path className="hero-mark-loop" d={marks.loop} />
          <path className="hero-mark-arrow" d={marks.arrow} />
          <path className="hero-mark-head" d={marks.head} />
          <path className="hero-mark-box" d={marks.box} />
          <path className="hero-mark-retrace" d={marks.retrace} />
        </svg>
      )}
    </h1>
  );
};
