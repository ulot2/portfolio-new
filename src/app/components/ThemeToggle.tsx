"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { ThemeIcon } from "./ink";

type Theme = "dark" | "light";

/**
 * A polygon covering everything right of a slanted, wavy line. `x` is where
 * the line meets the top of the screen, in percent of the page width; the line
 * leans 15% further right at the bottom. Random phases make every stroke a bit
 * different. Always the same point count, so two of them animate point by point.
 */
const brushEdge = (x: number) => {
  const a = Math.random() * 6;
  const b = Math.random() * 6;
  const edge = [];
  for (let i = 24; i >= 0; i--) {
    const y = (i / 24) * 100;
    const wobble = Math.sin(i * 0.9 + a) * 14 + Math.sin(i * 2.3 + b) * 6;
    edge.push(`calc(${x + y * 0.15}% + ${wobble.toFixed(1)}px) ${y}%`);
  }
  return `polygon(150% 0%, 150% 100%, ${edge.join(", ")})`;
};

/** The sun shows in the dark theme (go light), the moon in the light theme (go dark). */
export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>("dark");

  // The inline script in layout.tsx already applied any saved choice before paint.
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const apply = () => {
      flushSync(() => setTheme(next));
      document.documentElement.dataset.theme = next;
    };
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private mode or blocked storage: the switch still works for this visit.
    }

    // Older browsers and reduced motion get the plain instant switch.
    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply();
      return;
    }

    // Color fades on the page would still be running when the new theme is
    // captured, so it would paint in the old colors first. Turn them off for the switch.
    const root = document.documentElement;
    root.classList.add("theme-switching");

    // The new theme is painted on from the right, where the button sits,
    // with a wobbly brush edge that changes shape as it moves.
    const transition = document.startViewTransition(apply);
    transition.ready.then(() => {
      // The top of the edge starts at the right edge so it moves at once;
      // it ends with the whole slanted line off the left.
      root.animate(
        { clipPath: [brushEdge(100), brushEdge(-18)] },
        { duration: 700, easing: "cubic-bezier(0.3, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
    transition.finished.finally(() => root.classList.remove("theme-switching"));
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      <ThemeIcon moon={theme === "light"} className="theme-icon" />
    </button>
  );
};

export default ThemeToggle;
