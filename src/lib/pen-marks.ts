// The pen marks round the hero headline: a loop, an arrow and a box, worked
// out from where the words sit. Shared by the hero (measured in the browser)
// and the link preview image (measured once, see opengraph-image.tsx), so
// both draw exactly the same marks.

/** A word's box, in the headline's own coordinates. */
export type Rect = { left: number; top: number; width: number; height: number };

const right = (r: Rect) => r.left + r.width;
const bottom = (r: Rect) => r.top + r.height;

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
function loopShape(r: Rect, em: number) {
  return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 + em * 0.02, rx: r.width / 2 + em * 0.25, ry: r.height / 2 + em * 0.13 };
}

export function loopPath(r: Rect, em: number) {
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
export function boxPath(r: Rect, em: number, wobble: number) {
  const x0 = r.left - em * 0.19;
  const y0 = r.top + em * 0.03;
  const x1 = right(r) + em * 0.19;
  const y1 = bottom(r) + em * 0.05;
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
export function arrowPaths(loop: Rect, box: Rect, em: number, width: number): { line: string; head: string } {
  const { cx, cy, rx, ry } = loopShape(loop, em);
  const edge = width - em * 0.12;
  const leave = Math.PI * 0.12; // just below the loop's right-hand side
  const a: Pt = [cx + Math.cos(leave) * (rx + em * 0.08), cy + Math.sin(leave) * (ry + em * 0.08)];
  // Land near the box's right end when there is room, so the arrow makes a real swing; on a
  // narrow screen it tucks in under the loop instead.
  const b: Pt = [Math.max(a[0] + em * 0.3, Math.min(right(box) - em * 0.22, edge - em * 0.2)), box.top - em * 0.04];
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

/** All five marks for a headline whose two key phrases sit at `idea` and `built`. */
export function penMarks(idea: Rect, built: Rect, em: number, width: number) {
  const { line, head } = arrowPaths(idea, built, em, width);
  return {
    loop: loopPath(idea, em),
    arrow: line,
    head,
    box: boxPath(built, em, 1),
    retrace: boxPath({ left: built.left + 3, top: built.top + 3, width: built.width - 4, height: built.height - 3 }, em, -0.8),
  };
}
