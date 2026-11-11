import { getContributions } from "@/lib/contributions";
import { YearLine, type YearWeek } from "./YearLine";

// The chart's drawing box. The SVG stretches to the column's width, so only
// the proportions matter; labels sit on top as HTML so they never stretch.
const W = 1000;
const H = 150;
const TOP = 34; // room above the tallest week for its note
const BASE = 128; // the baseline, a little above the bottom

/** A small fixed wobble per point, so the line looks drawn rather than plotted. */
const wobble = (i: number) => Math.sin(i * 12.9898) * 1.4;

/** A smooth pen line through the points (Catmull-Rom turned into cubic curves). */
function penPath(points: [number, number][]) {
  let d = `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [p0, p1, p2, p3] = [points[i - 1] ?? points[i], points[i], points[i + 1], points[i + 2] ?? points[i + 1]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/**
 * The last year on GitHub as one hand-drawn line, a week per point, just above
 * the footer. Renders nothing if the counts could not be loaded.
 */
export async function YearInInk() {
  const data = await getContributions();
  if (!data) return null;

  // Weeks of seven days, ending today; a short first week is folded in.
  const weeks: YearWeek[] = [];
  for (let end = data.days.length; end > 0; end -= 7) {
    const slice = data.days.slice(Math.max(0, end - 7), end);
    weeks.unshift({ start: slice[0].date, count: slice.reduce((s, d) => s + d.count, 0) });
  }
  if (weeks.length > 1 && weeks[0].count === 0 && data.days.length % 7 !== 0) weeks.shift();

  const max = Math.max(1, ...weeks.map((w) => w.count));
  // A square-root scale, so one huge week doesn't flatten every other one.
  const points = weeks.map((w, i): [number, number] => [
    (i / (weeks.length - 1)) * W,
    BASE - Math.sqrt(w.count / max) * (BASE - TOP) + wobble(i),
  ]);
  const peak = weeks.reduce((best, w, i) => (w.count > weeks[best].count ? i : best), 0);

  // A month label wherever a new month starts, skipping one too close to the last.
  const months: { label: string; at: number }[] = [];
  weeks.forEach((w, i) => {
    const date = new Date(`${w.start}T00:00:00Z`);
    const prev = i > 0 ? new Date(`${weeks[i - 1].start}T00:00:00Z`) : null;
    if (prev && prev.getUTCMonth() !== date.getUTCMonth() && i < weeks.length - 2) {
      if (!months.length || i - months[months.length - 1].at > 3) {
        months.push({ label: date.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" }), at: i });
      }
    }
  });

  return (
    <YearLine
      weeks={weeks}
      total={data.total}
      path={penPath(points)}
      baseline={`M0 ${BASE + 1.2}C240 ${BASE - 0.6} 520 ${BASE + 1.8} 760 ${BASE + 0.4}S940 ${BASE - 0.4} ${W} ${BASE + 0.8}`}
      points={points.map(([x, y]) => [(x / W) * 100, (y / H) * 100])}
      peak={peak}
      months={months.map((m) => ({ label: m.label, left: (m.at / (weeks.length - 1)) * 100 }))}
      viewBox={`0 0 ${W} ${H}`}
    />
  );
}

export default YearInInk;
