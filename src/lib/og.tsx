import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { NAME_STROKES, RULE, SIGNATURE, WORDS } from "@/app/components/ink";

// The link preview images (what shows when a page is shared on WhatsApp,
// LinkedIn, X and so on). They are drawn like a page of the site: the pen
// wordmark, the site's typeface, a pen rule and the signature.
// Colors match the dark :root tokens in globals.css.

export const ogSize = { width: 1200, height: 630 };

export const OG = {
  bg: "#0d0d0b",
  ink: "#e8e4dc",
  accent: "#e8c547",
  muted: "#b0ae9f",
  faint: "#8a887b",
  rule: "#34342f",
  dot: "#23231e",
};

const PAD = 80;

/** Plus Jakarta Sans, the site's typeface, read from the repo so builds never wait on a font server. */
async function fonts() {
  const load = (file: string) => readFile(join(process.cwd(), "src/assets/fonts", file));
  const [medium, semibold] = await Promise.all([
    load("plus-jakarta-sans-latin-500-normal.woff"),
    load("plus-jakarta-sans-latin-600-normal.woff"),
  ]);
  return [
    { name: "Jakarta", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "Jakarta", data: semibold, weight: 600 as const, style: "normal" as const },
  ];
}

/** Pen strokes at a given width. Accent strokes are yellow unless a single color is forced. */
export const Strokes = ({
  strokes,
  viewBox,
  width,
  strokeWidth,
  color,
}: {
  strokes: (string | { d: string; accent?: boolean })[];
  viewBox: string;
  width: number;
  strokeWidth: number;
  color?: string;
}) => {
  const [, , w, h] = viewBox.split(" ").map(Number);
  return (
    <svg width={width} height={(width * h) / w} viewBox={viewBox} fill="none">
      {strokes.map((stroke, i) => {
        const s = typeof stroke === "string" ? { d: stroke } : stroke;
        return (
          <path
            key={i}
            d={s.d}
            stroke={color ?? (s.accent ? OG.accent : OG.ink)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}
    </svg>
  );
};

/**
 * The page every preview shares: dot-grid paper, the wordmark and address
 * along the top, and a pen rule with the name and signature along the bottom.
 */
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: `58px ${PAD}px 50px`,
        position: "relative",
        backgroundColor: OG.bg,
        color: OG.ink,
        fontFamily: "Jakarta",
        fontWeight: 500,
      }}
    >
      {/* A faint dot grid, like a notebook page. */}
      <svg
        width={ogSize.width}
        height={ogSize.height}
        viewBox={`0 0 ${ogSize.width} ${ogSize.height}`}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <defs>
          <pattern id="dots" x="12" y="9" width="34" height="34" patternUnits="userSpaceOnUse">
            <circle cx="17" cy="17" r="1.5" fill={OG.dot} />
          </pattern>
        </defs>
        <rect width={ogSize.width} height={ogSize.height} fill="url(#dots)" />
      </svg>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Strokes strokes={NAME_STROKES} viewBox="0 0 131 34" width={232} strokeWidth={2.2} />
        <div style={{ display: "flex", fontSize: 24, color: OG.faint, letterSpacing: "-0.01em" }}>tnuell.sbs</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center" }}>{children}</div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <svg width={ogSize.width - PAD * 2} height={10} viewBox="0 0 680 8" preserveAspectRatio="none" fill="none">
          <path d={RULE} stroke={OG.rule} strokeWidth={1.4} strokeLinecap="round" />
        </svg>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
          <div style={{ display: "flex", alignItems: "baseline", fontSize: 26, letterSpacing: "-0.01em" }}>
            <div style={{ display: "flex" }}>Toluwalope Adegoke</div>
            <div style={{ display: "flex", marginLeft: 16, color: OG.muted }}>Software developer · Lagos</div>
          </div>
          <div style={{ display: "flex", transform: "rotate(-5deg)", marginTop: -10, marginRight: 6 }}>
            <Strokes strokes={SIGNATURE} viewBox="0 0 104 50" width={150} strokeWidth={2.1} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Wraps content in the shared page and renders it with the site's typeface. */
export async function ogImage(children: React.ReactNode) {
  return new ImageResponse(<Frame>{children}</Frame>, { ...ogSize, fonts: await fonts() });
}

/**
 * A preview for an inner page: a hand-lettered section word (one drawn in
 * ink.tsx's WORDS, such as "writing" or "projects") over a large title.
 */
export function ogCard(title: string, word: keyof typeof WORDS & string) {
  const lettering = WORDS[word];
  const [, , w, h] = lettering.viewBox.split(" ").map(Number);
  const height = 58;
  // Long titles step down a size so they stay within three lines.
  const fontSize = title.length > 70 ? 54 : title.length > 40 ? 64 : 78;
  return ogImage(
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Strokes strokes={lettering.strokes} viewBox={lettering.viewBox} width={(height * w) / h} strokeWidth={2.1} />
      <div
        style={{
          display: "flex",
          marginTop: 26,
          maxWidth: 980,
          fontSize,
          fontWeight: 600,
          lineHeight: 1.12,
          letterSpacing: "-0.035em",
        }}
      >
        {title}
      </div>
    </div>,
  );
}
