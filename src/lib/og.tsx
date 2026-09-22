import { ImageResponse } from "next/og";

// Shared link-preview card. Colors match the :root tokens in globals.css.
export const ogSize = { width: 1200, height: 630 };

export function ogCard(title: string, kicker: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0d0d0b",
          color: "#e8e4dc",
        }}
      >
        <div style={{ fontSize: 32, color: "#e8c547" }}>{kicker}</div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
          {title}
        </div>
        <div style={{ fontSize: 28, color: "#b0ae9f" }}>
          Toluwalope Adegoke · tnuell.sbs
        </div>
      </div>
    ),
    ogSize,
  );
}
