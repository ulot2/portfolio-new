import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./jobs.css";

// Self-hosted through next/font, like the root layout. A Google Fonts <link>
// here would block rendering and trip @next/next/no-page-custom-font.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--j-font-display",
  display: "swap",
});
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--j-font-sans",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--j-font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Roles Worth Your Morning",
  // Private page. Keep it out of search results and link previews.
  robots: { index: false, follow: false, nocache: true },
};

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`jobsRoot ${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      {children}
    </div>
  );
}
