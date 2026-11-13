"use client";

import { type ReactNode, useEffect, useRef } from "react";

/**
 * Lets each `.draw-on-view` inside it draw its pen marks only when it scrolls
 * into view. Until then globals.css holds those animations at their first
 * frame. Without JavaScript, a <noscript> style lets them play on load.
 */
export function DrawOnView({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const watch = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-seen", "");
          watch.unobserve(entry.target);
        }),
      { rootMargin: "0px 0px -15% 0px" }
    );
    ref.current?.querySelectorAll(".draw-on-view").forEach((el) => watch.observe(el));
    return () => watch.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <noscript>
        <style>{`.draw-on-view :is(.ink-line, img) { animation-play-state: running !important; }`}</style>
      </noscript>
      {children}
    </div>
  );
}

export default DrawOnView;
