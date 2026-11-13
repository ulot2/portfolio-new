// Each blog topic writes in one of the extra pens from globals.css, the same
// one everywhere it appears. Known topics are picked by hand so they don't
// share a colour; a new topic gets one from its name until it's added here.
const PENS = ["teal", "blue", "violet", "pink"] as const;
type Pen = (typeof PENS)[number];

const TAG_PENS: Record<string, Pen> = {
  philosophy: "violet",
  growth: "teal",
  engineering: "blue",
  career: "pink",
};

/** The CSS colour for a blog topic, as a `var(--pen)` reference. */
export function tagInk(tag: string): string {
  const key = tag.toLowerCase();
  let pen = TAG_PENS[key];
  if (!pen) {
    let hash = 0;
    for (const ch of key) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
    pen = PENS[hash % PENS.length];
  }
  return `var(--${pen})`;
}
