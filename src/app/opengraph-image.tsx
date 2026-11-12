import { OG, Strokes, ogImage, ogSize } from "@/lib/og";
import { NEXT_LETTERING } from "./components/ink";

export const alt = "Toluwalope Adegoke, software developer: I turn “what if” into what’s next.";
export const size = ogSize;
export const contentType = "image/png";

const SIZE = 108; // the headline's type size, in px

/**
 * The home page's link preview: the hero headline, with "what's next."
 * hand-lettered in yellow exactly as on the site.
 */
export default function Image() {
  return ogImage(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        fontSize: SIZE,
        lineHeight: 1.16,
        letterSpacing: "-0.045em",
      }}
    >
      <div style={{ display: "flex" }}>I turn “what if”</div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex" }}>into</div>
        <div style={{ display: "flex", marginLeft: SIZE * 0.26, marginTop: -SIZE * 0.06, transform: "rotate(-3deg)" }}>
          <Strokes
            strokes={NEXT_LETTERING.strokes}
            viewBox={NEXT_LETTERING.viewBox}
            width={SIZE * 7.3}
            strokeWidth={2.5}
            color={OG.accent}
          />
        </div>
      </div>
    </div>,
  );
}
