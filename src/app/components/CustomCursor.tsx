"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

// Everything the dot expands over. These must match class names that actually
// exist in the components. Skills rows are plain text, so they are left out.
const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "[role='link']",
  ".project-card",
  ".btn-secondary",
].join(", ");

export const CustomCursor = () => {
  const shouldReduceMotion = useReducedMotion();
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isExpanded, setIsExpanded] = useState(false);

  const springConfig = { damping: 28, stiffness: 450, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const onMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(INTERACTIVE_SELECTOR)) {
        setIsExpanded(true);
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(INTERACTIVE_SELECTOR)) {
        setIsExpanded(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [cursorX, cursorY, shouldReduceMotion]);

  // A spring-follow dot replacing the system cursor is exactly what this
  // preference is asking us not to do.
  if (shouldReduceMotion) return null;

  return (
    <motion.div
      className={`cursor-dot ${isExpanded ? "expanded" : ""}`}
      style={{
        x: smoothX,
        y: smoothY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    />
  );
};
