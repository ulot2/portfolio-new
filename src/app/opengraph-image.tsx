import { OG, ogImage, ogSize } from "@/lib/og";
import { penMarks, type Rect } from "@/lib/pen-marks";

export const alt = "Toluwalope Adegoke, software developer: I turn “what if” into what’s next.";
export const size = ogSize;
export const contentType = "image/png";

// The headline at a size that reads as a thumbnail but leaves the card room to breathe.
const EM = 68;
const LINE = EM * 1.46;
const WIDTH = 1040; // the card's inner width

// Where each phrase sits, measured once in a browser with the same font, size
// and spacing (the image renderer can't measure text itself). They only need
// measuring again if the wording, EM or the gaps change.
const TURN: Rect = { left: 0, top: 6, width: 143, height: 86 };
const IDEA: Rect = { left: 172.9, top: 6, width: 254.9, height: 86 };
const INTO: Rect = { left: 0, top: 105.3, width: 115.1, height: 86 };
const BUILT: Rect = { left: 139.5, top: 105.3, width: 368.9, height: 86 };

// The marks reach a little past the headline (the loop rises above it), so
// the drawing gets a margin on every side.
const BLEED = 40;

const Word = ({ at, line, children, weight = 500, color = OG.ink }: { at: Rect; line: number; children: string; weight?: number; color?: string }) => (
  <div
    style={{
      position: "absolute",
      left: at.left,
      top: line * LINE,
      height: LINE,
      display: "flex",
      alignItems: "center",
      fontWeight: weight,
      color,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

/**
 * The home page's link preview: the hero headline as it is on the site. The
 * sentence in type, a pencil loop round "what if", an arrow carrying it down,
 * and a yellow box round "what's next.", drawn by the same code as the hero.
 */
export default function Image() {
  const marks = penMarks(IDEA, BUILT, EM, WIDTH);
  const stroke = { strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };

  return ogImage(
    <div
      style={{
        position: "relative",
        display: "flex",
        width: WIDTH,
        height: LINE * 2,
        marginTop: 6,
        fontSize: EM,
        lineHeight: 1.46,
        letterSpacing: "-0.04em",
      }}
    >
      <Word at={TURN} line={0}>I turn</Word>
      <Word at={IDEA} line={0} color={OG.muted}>“what if”</Word>
      <Word at={INTO} line={1}>into</Word>
      <Word at={BUILT} line={1} weight={600}>what’s next.</Word>

      <svg
        width={WIDTH + BLEED * 2}
        height={LINE * 2 + BLEED * 2}
        viewBox={`${-BLEED} ${-BLEED} ${WIDTH + BLEED * 2} ${LINE * 2 + BLEED * 2}`}
        style={{ position: "absolute", left: -BLEED, top: -BLEED }}
      >
        <path d={marks.loop} stroke={OG.muted} strokeWidth={1.6} {...stroke} />
        <path d={marks.arrow} stroke={OG.accent} strokeWidth={2.4} {...stroke} />
        <path d={marks.head} stroke={OG.accent} strokeWidth={2.4} {...stroke} />
        <path d={marks.box} stroke={OG.accent} strokeWidth={2.6} {...stroke} />
        <path d={marks.retrace} stroke={OG.accent} strokeWidth={1.3} strokeOpacity={0.55} {...stroke} />
      </svg>
    </div>,
  );
}
