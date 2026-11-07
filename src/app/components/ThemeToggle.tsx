"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "./ink";

type Theme = "dark" | "light";

/** The sun shows in the dark theme (go light), the moon in the light theme (go dark). */
export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>("dark");

  // The inline script in layout.tsx already applied any saved choice before paint.
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private mode or blocked storage: the switch still works for this visit.
    }
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      {theme === "dark" ? (
        <SunIcon key="sun" className="theme-icon" />
      ) : (
        <MoonIcon key="moon" className="theme-icon" />
      )}
    </button>
  );
};

export default ThemeToggle;
