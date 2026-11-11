import { getContributions } from "@/lib/contributions";
import { YearLine } from "./YearLine";

// The drawing box. The SVG keeps these proportions (no stretching), so the
// loops stay round at any width.
const W = 1000;
const H = 100;
const BASE = 84; // where the line runs when nothing is happening
const R_MIN = 1.1; // a quiet week: a ripple
const R_MAX = 30; // the busiest week: the biggest loop
const NARROW = 0.4; // loops are slim, like a cursive l, not round coils
const TALL = 1.12;
const SLANT = 0.32; // and lean forward, like handwriting
const STEPS = 12; // points drawn per loop

/** Rounds to one decimal place for a shorter path. */
const n = (v: number) => Math.round(v * 10) / 10;

/**
 * A looping pen line: a slanted, narrowed prolate cycloid whose loop size
 * follows the weekly counts. Below a certain size a loop doesn't close, so
 * quiet weeks read as a ripple and busy ones as tall cursive loops, like a
 * line of handwriting.
 */
function loopPath(weekly: number[]) {
  const max = Math.max(1, ...weekly);
  // A square root, so one huge week doesn't shrink every other loop to nothing.
  const radii = weekly.map((c) => R_MIN + Math.sqrt(c / max) * (R_MAX - R_MIN));
  const lead = 22; // a short run-in before the first loop, like a pen touching down
  const tail = 40; // and a run-out into the arrow
  const dx = (W - lead - tail) / weekly.length;

  const pts: [number, number][] = [[2, BASE + 1.5]];
  for (let s = 0; s <= weekly.length * STEPS; s++) {
    const t = s / STEPS; // in weeks
    const i = Math.min(weekly.length - 1, Math.floor(t));
    const f = t - Math.floor(t);
    // Ease the loop size from one week into the next so the line never jumps.
    const next = radii[Math.min(weekly.length - 1, i + 1)];
    const r = radii[i] + (next - radii[i]) * (1 - Math.cos(Math.PI * f)) / 2;
    const a = 2 * Math.PI * t;
    const rise = r * (1 - Math.cos(a)) * TALL;
    pts.push([lead + t * dx - r * NARROW * Math.sin(a) + rise * SLANT, BASE - rise + Math.sin(t * 2.7) * 0.6]);
  }
  const end: [number, number] = [W - 14, BASE - 0.5];
  pts.push([(pts[pts.length - 1][0] + end[0]) / 2, BASE + 0.8], end);

  // Smooth the points into curves: each point steers, midpoints are the joins.
  let d = `M${n(pts[0][0])} ${n(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2;
    const my = (pts[i][1] + pts[i + 1][1]) / 2;
    d += `Q${n(pts[i][0])} ${n(pts[i][1])} ${n(mx)} ${n(my)}`;
  }
  d += `L${n(end[0])} ${n(end[1])}`;
  return { d, end };
}

/** The same arrowhead as the tail of the wordmark, at the end of the line. */
const arrow = ([x, y]: [number, number]) =>
  `M${x - 9} ${y - 8.5}c3.1 1.9 6.2 4.3 9.3 7.7M${x + 0.3} ${y - 0.8}c-2.4 2.9-5.3 5.5-8.4 8.4`;

/**
 * The last year of GitHub commits, drawn as one looping pen line above the
 * footer. A drawing first; a small caption says what it is made from.
 * Renders nothing if the counts could not be loaded.
 */
export async function YearInInk() {
  const data = await getContributions();
  if (!data) return null;

  // Weeks of seven days, ending today.
  const weekly: number[] = [];
  for (let end = data.days.length; end > 0; end -= 7) {
    weekly.unshift(data.days.slice(Math.max(0, end - 7), end).reduce((s, d) => s + d.count, 0));
  }

  // Phones get the last half year: a full year of loops would be too tight.
  const year = loopPath(weekly);
  const half = loopPath(weekly.slice(-26));

  const label =
    data.total === null
      ? "A looping pen line drawn from my GitHub commits over the past year, one loop per week."
      : `A looping pen line drawn from my ${data.total.toLocaleString("en-GB")} GitHub contributions over the past year, one loop per week.`;

  return (
    <YearLine
      viewBox={`0 0 ${W} ${H}`}
      year={{ line: year.d, arrow: arrow(year.end) }}
      half={{ line: half.d, arrow: arrow(half.end) }}
      label={label}
    />
  );
}

export default YearInInk;
