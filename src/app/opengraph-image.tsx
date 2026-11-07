import { ImageResponse } from "next/og";
import { ogSize } from "@/lib/og";
import { NAME_STROKES, SIGNATURE } from "./components/ink";

export const alt = "Toluwalope Adegoke, software developer: I turn “what if” into “what’s next”.";
export const size = ogSize;
export const contentType = "image/png";

const INK = "#e8e4dc";
const ACCENT = "#e8c547";
const MUTED = "#b0ae9f";
const RULE = "#2c2c28";

const Strokes = ({
  strokes,
  width,
  viewBox,
  strokeWidth,
}: {
  strokes: { d: string; accent?: boolean }[];
  width: number;
  viewBox: string;
  strokeWidth: number;
}) => {
  const [, , w, h] = viewBox.split(" ").map(Number);
  return (
    <svg width={width} height={(width * h) / w} viewBox={viewBox} fill="none">
      {strokes.map((stroke, i) => (
        <path
          key={i}
          d={stroke.d}
          stroke={stroke.accent ? ACCENT : INK}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
};

/** The home page's link preview: the hand-drawn wordmark and the signed note from the hero. */
export default function Image() {
  const rules = [292, 352, 412, 472];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          padding: "72px 88px",
          background: "#0d0d0b",
        }}
      >
        {/* Faint ruled lines, as under the hero note. */}
        {rules.map((top) => (
          <div
            key={top}
            style={{
              position: "absolute",
              left: 88,
              right: 88,
              top,
              height: 1.5,
              background: RULE,
            }}
          />
        ))}

        <Strokes strokes={NAME_STROKES} viewBox="0 0 131 34" width={330} strokeWidth={2.3} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 86,
            fontSize: 40,
            lineHeight: "60px",
            color: INK,
          }}
        >
          <div style={{ display: "flex", color: MUTED }}>Hi,</div>
          <div style={{ display: "flex" }}>I turn “what if” into “what’s next”.</div>
          <div style={{ display: "flex" }}>You have the concept, I have the stack.</div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginTop: "auto",
          }}
        >
          <div style={{ display: "flex", fontSize: 26, color: MUTED }}>
            Software Developer · tnuell.sbs
          </div>
          <div style={{ display: "flex", transform: "rotate(-5deg)" }}>
            <Strokes strokes={SIGNATURE} viewBox="0 0 104 50" width={250} strokeWidth={2.2} />
          </div>
        </div>
      </div>
    ),
    ogSize,
  );
}
