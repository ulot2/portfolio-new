"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

type Pt = [number, number];

/** One decimal place is plenty for a pen line. */
const n = (v: number) => Math.round(v * 10) / 10;

/** Smooth a run of points into curves: each point steers, midpoints are the joins. */
function smooth(pts: Pt[]) {
  let d = `M${n(pts[0][0])} ${n(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2;
    const my = (pts[i][1] + pts[i + 1][1]) / 2;
    d += `Q${n(pts[i][0])} ${n(pts[i][1])} ${n(mx)} ${n(my)}`;
  }
  const last = pts[pts.length - 1];
  return `${d}L${n(last[0])} ${n(last[1])}`;
}

/**
 * A loose pencil loop round a box: a little more than one turn, starting at
 * the upper left, so the pen overshoots where it began. Fixed wobbles keep it
 * from looking like a perfect ellipse.
 */
/** The loop's size round a word box. Gaps scale with the type, so phones keep the same proportions. */
function loopShape(r: DOMRect, em: number) {
  return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 + em * 0.02, rx: r.width / 2 + em * 0.25, ry: r.height / 2 + em * 0.13 };
}

function loopPath(r: DOMRect, em: number) {
  const { cx, cy, rx, ry } = loopShape(r, em);
  const pts: Pt[] = [];
  const start = Math.PI * 1.08;
  const turn = Math.PI * 2 * 1.1;
  const steps = 30;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = start + turn * t;
    // The second pass drifts outward a touch, as a hand does.
    const grow = 1 + t * 0.05 + Math.sin(a * 3 + 1.3) * 0.018;
    pts.push([cx + Math.cos(a) * rx * grow, cy + Math.sin(a) * ry * grow - t * 2]);
  }
  return smooth(pts);
}

/** A hand-drawn box round the built thing, with the start overshooting along the top edge. */
function boxPath(r: DOMRect, em: number, wobble: number) {
  const x0 = r.left - em * 0.19;
  const y0 = r.top + em * 0.03;
  const x1 = r.right + em * 0.19;
  const y1 = r.bottom + em * 0.05;
  const k = em * 0.2; // corner
  return [
    `M${n(x0 + k + em * 0.16)} ${n(y0 + 0.8 * wobble)}`,
    `Q${n((x0 + x1) / 2)} ${n(y0 - 1.6 * wobble)} ${n(x1 - k)} ${n(y0 + 0.2 * wobble)}`,
    `Q${n(x1)} ${n(y0)} ${n(x1 + 0.5 * wobble)} ${n(y0 + k)}`,
    `Q${n(x1 + 1.4 * wobble)} ${n((y0 + y1) / 2)} ${n(x1 - 0.3 * wobble)} ${n(y1 - k)}`,
    `Q${n(x1)} ${n(y1)} ${n(x1 - k)} ${n(y1 + 0.3 * wobble)}`,
    `Q${n((x0 + x1) / 2)} ${n(y1 + 1.8 * wobble)} ${n(x0 + k)} ${n(y1)}`,
    `Q${n(x0)} ${n(y1)} ${n(x0 + 0.4 * wobble)} ${n(y1 - k)}`,
    `Q${n(x0 - 1.2 * wobble)} ${n((y0 + y1) / 2)} ${n(x0 + 0.3 * wobble)} ${n(y0 + k)}`,
    `Q${n(x0)} ${n(y0 + 0.6 * wobble)} ${n(x0 + k)} ${n(y0 + 0.6 * wobble)}`,
    `L${n(x0 + k + em * 0.55)} ${n(y0 - 0.2 * wobble)}`,
  ].join("");
}

/**
 * The arrow from the idea to the thing built: it leaves the loop at its lower
 * right, swings out and drops onto the top edge of the box. It is kept inside
 * the heading's width, so it never runs off a narrow screen. Returns the curve
 * and a separate arrowhead, set along the curve's final direction.
 */
function arrowPaths(loop: DOMRect, box: DOMRect, em: number, width: number): { line: string; head: string } {
  const { cx, cy, rx, ry } = loopShape(loop, em);
  const edge = width - em * 0.12;
  const leave = Math.PI * 0.12; // just below the loop's right-hand side
  const a: Pt = [cx + Math.cos(leave) * (rx + em * 0.08), cy + Math.sin(leave) * (ry + em * 0.08)];
  // Land near the box's right end when there is room, so the arrow makes a real swing; on a
  // narrow screen it tucks in under the loop instead.
  const b: Pt = [Math.max(a[0] + em * 0.3, Math.min(box.right - em * 0.22, edge - em * 0.2)), box.top - em * 0.04];
  const c1: Pt = [Math.min(edge, a[0] + em * 0.75), a[1] - em * 0.06];
  const c2: Pt = [Math.min(edge, b[0] + em * 0.5), b[1] - em * 0.6];
  const line = `M${n(a[0])} ${n(a[1])}C${n(c1[0])} ${n(c1[1])} ${n(c2[0])} ${n(c2[1])} ${n(b[0])} ${n(b[1])}`;
  const angle = Math.atan2(b[1] - c2[1], b[0] - c2[0]);
  const len = Math.max(8, em * 0.17);
  const wing = (side: number): Pt => [
    b[0] - Math.cos(angle + side * 0.5) * len,
    b[1] - Math.sin(angle + side * 0.5) * len,
  ];
  const [l, r] = [wing(1), wing(-1)];
  const head = `M${n(l[0])} ${n(l[1])}L${n(b[0])} ${n(b[1])}L${n(r[0])} ${n(r[1])}`;
  return { line, head };
}

type Marks = { w: number; h: number; loop: string; arrow: string; head: string; box: string; retrace: string };

// The pen's pace, in px per ms, and the easing of each stroke: a pen speeds
// up and slows down, so strokes ease in and out rather than only out.
const PACE = 1.15;
const PEN = "cubic-bezier(0.55, 0, 0.35, 1)";

/**
 * Diagram. The sentence stays in type and the pen annotates it, like a sketch
 * on a whiteboard. A pencil loop rings "what if", an arrow carries it down,
 * and a yellow box closes round "what's next.", which brightens as it does.
 * All three marks are measured to the words, so they meet them exactly at
 * any width, and they draw again when the headline is hovered.
 */
export const Diagram = () => {
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
    const rel = (r: DOMRect) => new DOMRect(r.left - h1.left, r.top - h1.top, r.width, r.height);
    const ri = rel(i);
    const rb = rel(b);
    const em = parseFloat(getComputedStyle(root.current!).fontSize);
    const { line, head } = arrowPaths(ri, rb, em, h1.width);
    setMarks({
      w: h1.width,
      h: h1.height,
      loop: loopPath(ri, em),
      arrow: line,
      head,
      box: boxPath(rb, em, 1),
      retrace: boxPath(new DOMRect(rb.left + 3, rb.top + 3, rb.width - 4, rb.height - 3), em, -0.8),
    });
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

    stroke(".pd-loop", { min: 520 });
    stroke(".pd-arrow", { gap: 60, min: 260 });
    stroke(".pd-head", { gap: 0, min: 110, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
    const box = stroke(".pd-box", { gap: 70, min: 520 });
    stroke(".pd-retrace", { gap: -120, min: 260, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
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
    <h1 className="hero-title pd" id="hero-title" ref={root} data-state={state} onMouseEnter={replay}>
      <span className="hero-title-line pd-line-one">
        I turn{" "}
        <span className="pd-idea" ref={idea}>
          &ldquo;what if&rdquo;
        </span>
      </span>
      <span className="hero-title-line pd-line-two">
        into{" "}
        <span className="pd-built" ref={built}>
          what&rsquo;s next.
        </span>
      </span>

      {marks && (
        <svg
          ref={svg}
          className="pd-marks"
          width={marks.w}
          height={marks.h}
          viewBox={`0 0 ${marks.w} ${marks.h}`}
          fill="none"
          aria-hidden="true"
        >
          <path className="pd-loop" d={marks.loop} />
          <path className="pd-arrow" d={marks.arrow} />
          <path className="pd-head" d={marks.head} />
          <path className="pd-box" d={marks.box} />
          <path className="pd-retrace" d={marks.retrace} />
        </svg>
      )}
    </h1>
  );
};
