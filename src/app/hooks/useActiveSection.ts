"use client";

import { useEffect, useState } from "react";
import { SECTION_IDS } from "@/data/nav";

/**
 * Reports which section is currently in view, for the rail and the dock.
 * Returns null off the home route, where the sections don't exist.
 *
 * The rootMargin band keeps a single section active through the middle of the
 * viewport rather than flipping at the edges.
 */
export function useActiveSection(enabled: boolean): string | null {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActiveSection(null);
      return;
    }

    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled]);

  return activeSection;
}
