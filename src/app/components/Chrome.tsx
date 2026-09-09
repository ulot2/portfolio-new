"use client";

import { usePathname } from "next/navigation";
import { CustomCursor } from "./CustomCursor";
import { ScrollToTop } from "./ScrollToTop";
import { SectionRail } from "./SectionRail";
import { NavDock } from "./NavDock";

/**
 * The portfolio's furniture: custom cursor, section rail, scroll-to-top, nav
 * dock. It belongs on the public site and nowhere else.
 *
 * The private jobs dashboard shares this root layout, so without this check its
 * nav dock would offer links to portfolio sections that do not exist there, and
 * the custom cursor would fight a page full of buttons and text fields.
 */
export function Chrome() {
  const pathname = usePathname();
  if (pathname === "/jobs" || pathname.startsWith("/jobs/")) return null;

  return (
    <>
      <CustomCursor />
      <SectionRail />
      <ScrollToTop />
      <NavDock />
    </>
  );
}
