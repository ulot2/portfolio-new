"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";

const MAX_REACH = 800;

const INTER_VARIABLE_FONT_FACE = `
@font-face {
    font-family: "InterVariableFramer";
    src: url("https://rsms.me/inter/font-files/InterVariable.woff2?v=4.0") format("woff2-variations");
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
}
@font-face {
    font-family: "InterVariableFramer";
    src: url("https://rsms.me/inter/font-files/InterVariable-Italic.woff2?v=4.0") format("woff2-variations");
    font-weight: 100 900;
    font-style: italic;
    font-display: swap;
}
`;

const VARIABLE_FONT_STACK =
  'var(--font-jakarta), "Plus Jakarta Sans", "InterVariableFramer", "Inter", system-ui, sans-serif';

type DynamicWeightProps = {
  label?: string;
  text?: string;
  fromWeight?: number;
  toWeight?: number;
  strength?: number;
  fontSize?: number | string;
  color?: string;
  className?: string;
  fontFamily?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  transition?: {
    duration?: number;
    ease?: string;
  };
  style?: React.CSSProperties;
};

const COMPONENT_DEFAULTS = {
  label: "Toluwalope Adegoke",
  fromWeight: 400,
  toWeight: 900,
  strength: 35,
  color: "currentColor",
  transition: {
    duration: 0.3,
    ease: "easeOut",
  },
  tag: "h1",
};

export default function DynamicWeight(props: DynamicWeightProps) {
  const mergedProps = { ...COMPONENT_DEFAULTS, ...props };
  const label = props.text ?? props.label ?? mergedProps.label;
  const {
    fromWeight,
    toWeight,
    strength,
    fontSize,
    color,
    className,
    fontFamily,
    transition,
    style,
    tag,
  } = mergedProps;

  const reach = Math.max(
    1,
    (Math.max(1, Math.min(100, strength)) / 100) * MAX_REACH
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const letterFactorsRef = useRef<number[]>([]);
  const lastFrameRef = useRef(0);
  const mousePositionRef = useRef({ x: -99999, y: -99999 });

  useEffect(() => {
    const updatePosition = (clientX: number, clientY: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      mousePositionRef.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const handleMouseMove = (ev: MouseEvent) =>
      updatePosition(ev.clientX, ev.clientY);
    const handleTouchMove = (ev: TouchEvent) => {
      if (ev.touches.length === 0) return;
      updatePosition(ev.touches[0].clientX, ev.touches[0].clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  const fromSettings = `'wght' ${fromWeight}`;

  useAnimationFrame((now: number) => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const mx = mousePositionRef.current.x;
    const my = mousePositionRef.current.y;

    const prevT = lastFrameRef.current || now;
    const dtSec = Math.min(0.1, Math.max(0, (now - prevT) / 1000));
    lastFrameRef.current = now;

    const tau = Math.max(0.016, transition?.duration ?? 0.3);
    const a = 1 - Math.exp(-dtSec / tau);

    for (let i = 0; i < letterRefs.current.length; i++) {
      const letterEl = letterRefs.current[i];
      if (!letterEl) continue;
      const rect = letterEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2 - containerRect.left;
      const cy = rect.top + rect.height / 2 - containerRect.top;
      const dx = mx - cx;
      const dy = my - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const target = Math.min(Math.max(1 - dist / reach, 0), 1);
      const prev = letterFactorsRef.current[i] ?? 0;
      const f = prev + (target - prev) * a;
      letterFactorsRef.current[i] = f;

      if (f < 0.001) {
        if (letterEl.style.fontVariationSettings !== fromSettings) {
          letterEl.style.fontVariationSettings = fromSettings;
        }
        continue;
      }

      const w = Math.round(fromWeight + (toWeight - fromWeight) * f);
      letterEl.style.fontVariationSettings = `'wght' ${w}`;
    }
  });

  const srOnlyStyle: React.CSSProperties = {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0,0,0,0)",
    whiteSpace: "nowrap",
    borderWidth: 0,
  };

  const innerSpanStyle: React.CSSProperties = {
    fontFamily: fontFamily ?? VARIABLE_FONT_STACK,
    fontSize,
    color,
    display: "inline-block",
    lineHeight: 1.15,
  };

  const words = label ? label.split(" ") : [];

  letterRefs.current = [];
  let letterIndex = 0;

  const Tag = (tag ?? "h1") as React.ElementType;

  return (
    <Tag
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
        cursor: "pointer",
        ...style,
      }}
    >
      <style>{INTER_VARIABLE_FONT_FACE}</style>
      {words.length === 0 ? null : (
        <span style={innerSpanStyle}>
          <span style={srOnlyStyle}>{label}</span>
          {words.map((word, wi) => {
            const wordLetters = word.split("");
            return (
              <React.Fragment key={wi}>
                <span
                  aria-hidden
                  style={{
                    display: "inline-block",
                    whiteSpace: "nowrap",
                  }}
                >
                  {wordLetters.map((letter, li) => {
                    const idx = letterIndex++;
                    return (
                      <motion.span
                        key={li}
                        ref={(el: HTMLSpanElement | null) => {
                          letterRefs.current[idx] = el;
                        }}
                        style={{
                          display: "inline-block",
                          fontVariationSettings: fromSettings,
                        }}
                      >
                        {letter}
                      </motion.span>
                    );
                  })}
                </span>
                {wi < words.length - 1 && (
                  <span
                    aria-hidden
                    style={{
                      display: "inline-block",
                    }}
                  >
                    &nbsp;
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </span>
      )}
    </Tag>
  );
}
