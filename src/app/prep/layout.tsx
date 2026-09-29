import type { Metadata } from "next";
import "./prep.css";

export const metadata: Metadata = {
  title: "prep.",
  // Private app. Keep it out of search results and link previews.
  robots: { index: false, follow: false, nocache: true },
};

export default function PrepLayout({ children }: { children: React.ReactNode }) {
  return <div className="prepRoot">{children}</div>;
}
