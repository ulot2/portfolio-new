import { ImageResponse } from "next/og";

// iOS home-screen icon: the same bold hand-drawn t as icon.svg, at 180px.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0d0b",
        }}
      >
        <svg width="132" height="132" viewBox="0 0 32 32" fill="none">
          <path
            stroke="#e8c547"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.9 12.2c.7-.6 1.5-.8 2.5-.9 2.9-.4 5.8-.7 8.8-.8 1.6 0 3.1 0 4.6.2"
          />
          <path
            stroke="#e8e4dc"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.6 3.6c-.5.3-.8.9-.9 1.6-.5 3.1-.8 6.3-1 9.5-.2 2.5-.3 5-.1 7.2.2 2.3 1.2 3.9 3 4.6 2.5.9 5.5.6 8.8 0 .9-.2 1.8-.4 2.6-.6"
          />
          <path
            stroke="#e8e4dc"
            strokeWidth="2.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M22.6 21.4c1.5.8 3 1.8 4.4 3.2M27.1 25.1c-1.1 1.2-2.4 2.5-3.5 4"
          />
        </svg>
      </div>
    ),
    size,
  );
}
