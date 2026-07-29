"use client";

import React, { useState, useEffect, useRef } from "react";

function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleDX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const dx = sampleX(t) - x;
      const d = sampleDX(t);
      if (Math.abs(dx) < 1e-6) break;
      if (d === 0) break;
      t -= dx / d;
    }
    return sampleY(Math.max(0, Math.min(1, t)));
  };
}

function makeEaseFn(ease: unknown): (t: number) => number {
  if (Array.isArray(ease) && ease.length === 4)
    return cubicBezier(
      Number(ease[0]),
      Number(ease[1]),
      Number(ease[2]),
      Number(ease[3])
    );
  switch (ease) {
    case "linear":
      return (t) => t;
    case "easeIn":
      return (t) => t * t;
    case "easeOut":
      return (t) => 1 - (1 - t) * (1 - t);
    case "easeInOut":
      return (t) => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t));
    case "circIn":
      return (t) => 1 - Math.sqrt(1 - t * t);
    case "circOut":
      return (t) => Math.sqrt(1 - (t - 1) * (t - 1));
    case "circInOut":
      return (t) =>
        t < 0.5
          ? (1 - Math.sqrt(1 - 4 * t * t)) / 2
          : (Math.sqrt(1 - (-2 * t + 2) * (-2 * t + 2)) + 1) / 2;
    case "backIn":
      return (t) => 2.70158 * t * t * t - 1.70158 * t * t;
    case "backOut":
      return (t) => 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2;
    default:
      return (t) => t;
  }
}

type TagType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
type ReplayMode = "yes" | "no";
type AmountMode = "above" | "middle" | "below";
type RestState = "filled" | "outline" | "invisible";
type LetterFlickerMode = "stroke" | "opacity";
type StrokePosition = "start" | "middle" | "end";

interface FlickerCfg {
  duration: number;
  easeCurve: unknown;
  flickerCount: number;
  showStroke: boolean;
  strokePosition: StrokePosition;
  strokeCount: number;
  strokeColor: string;
  strokeWidth: number;
  restState: RestState;
  delay: number;
  shakeEnabled: boolean;
  shakeWidth: number;
  shakeSpeed: number;
  wordFlickerEnabled: boolean;
  letterFlickerEnabled: boolean;
  letterFlickerMode: LetterFlickerMode;
  letterFlickerIntensity: number;
  letterFlickerOpacity: number;
  loop?: boolean;
  loopDelay?: number;
}

function buildTextCfg(m: Record<string, unknown> | undefined): FlickerCfg {
  const easeObj = m?.ease as { duration?: number; ease?: unknown } | undefined;
  return {
    duration: easeObj?.duration ?? 2,
    easeCurve: easeObj?.ease ?? "easeInOut",
    flickerCount: (m?.flickerCount as number) ?? 10,
    showStroke: (m?.showStroke as boolean) ?? false,
    strokePosition: (m?.strokePosition as StrokePosition) ?? "start",
    strokeCount: (m?.strokeCount as number) ?? 1,
    strokeColor: (m?.strokeColor as string) ?? "#ffffff",
    strokeWidth: (m?.strokeWidth as number) ?? 1.5,
    restState: (m?.restState as RestState) ?? "filled",
    delay: (m?.delay as number) ?? 0,
    shakeEnabled: (m?.shakeEnabled as boolean) ?? false,
    shakeWidth: (m?.shakeWidth as number) ?? 10,
    shakeSpeed: (m?.shakeSpeed as number) ?? 10,
    wordFlickerEnabled: (m?.wordFlickerEnabled as boolean) ?? false,
    letterFlickerEnabled: (m?.letterFlickerEnabled as boolean) ?? true,
    letterFlickerMode: (m?.letterFlickerMode as LetterFlickerMode) ?? "opacity",
    letterFlickerIntensity: (m?.letterFlickerIntensity as number) ?? 10,
    letterFlickerOpacity: (m?.letterFlickerOpacity as number) ?? 30,
    loop: m?.loop as boolean | undefined,
    loopDelay: m?.loopDelay as number | undefined,
  };
}

const COMPONENT_DEFAULTS = {
  contentType: "text",
  text: "Flicker Text",
  colorMode: "solid",
  fontColor: "currentColor",
  gradientAngle: 90,
  gradientStart: "#ffffff",
  gradientEnd: "#888888",
  textEnterFlickerEnabled: true,
  loop: false,
  loopDelay: 1,
  font: undefined as React.CSSProperties | undefined,
  className: undefined as string | undefined,
  style: undefined as React.CSSProperties | undefined,
  flicker: {
    position: "above",
    replay: "yes",
    restState: "filled",
    delay: 0,
    ease: { type: "tween", duration: 2, ease: "easeInOut" },
    flickerCount: 10,
    showStroke: false,
    strokePosition: "start",
    strokeCount: 1,
    strokeColor: "#ffffff",
    strokeWidth: 1.5,
    wordFlickerEnabled: false,
    shakeEnabled: false,
    shakeWidth: 10,
    shakeSpeed: 10,
    letterFlickerEnabled: true,
    letterFlickerMode: "opacity",
    letterFlickerOpacity: 30,
    letterFlickerIntensity: 10,
    loop: false,
    loopDelay: 1,
  },
  textHoverFlickerEnabled: true,
  flickerHover: {
    ease: { type: "tween", duration: 2, ease: "easeInOut" },
    flickerCount: 3,
    showStroke: false,
    strokePosition: "start",
    strokeCount: 1,
    strokeColor: "#ffffff",
    strokeWidth: 1.5,
    wordFlickerEnabled: true,
    shakeEnabled: false,
    shakeWidth: 10,
    shakeSpeed: 10,
    letterFlickerEnabled: true,
    letterFlickerMode: "opacity",
    letterFlickerOpacity: 30,
    letterFlickerIntensity: 10,
  },
  tag: "p",
};

export default function FlickerText(props: Record<string, unknown>) {
  const mergedProps = { ...COMPONENT_DEFAULTS, ...props };
  const contentType = mergedProps.contentType as string | undefined;
  const text = mergedProps.text as string | undefined;
  const font = mergedProps.font as React.CSSProperties | undefined;
  const colorMode = mergedProps.colorMode as string | undefined;
  const fontColor = mergedProps.fontColor as string | undefined;
  const gradientStart = mergedProps.gradientStart as string | undefined;
  const gradientEnd = mergedProps.gradientEnd as string | undefined;
  const gradientAngle = mergedProps.gradientAngle as number | undefined;
  const tag = mergedProps.tag as TagType | undefined;
  const className = mergedProps.className as string | undefined;
  const style = mergedProps.style as React.CSSProperties | undefined;
  const loop = mergedProps.loop as boolean | undefined;
  const loopDelay = mergedProps.loopDelay as number | undefined;
  const textEnterFlickerEnabled = mergedProps.textEnterFlickerEnabled as boolean | undefined;
  const flicker = mergedProps.flicker as Record<string, unknown> | undefined;
  const textHoverFlickerEnabled = mergedProps.textHoverFlickerEnabled as boolean | undefined;
  const flickerHover = mergedProps.flickerHover as Record<string, unknown> | undefined;

  const enterCfg: FlickerCfg = buildTextCfg(flicker);
  const hoverCfg: FlickerCfg = buildTextCfg(flickerHover);

  const enterEnabled: boolean = textEnterFlickerEnabled ?? true;
  const hoverEnabled: boolean = textHoverFlickerEnabled ?? false;

  const replay: ReplayMode = (flicker?.replay as ReplayMode) ?? "no";
  const amount: AmountMode = (flicker?.position as AmountMode) ?? "above";

  const initialCfg = enterEnabled
    ? enterCfg
    : hoverEnabled
    ? hoverCfg
    : enterCfg;

  const [activeCfg, setActiveCfg] = useState<FlickerCfg>(initialCfg);
  const [currentPhase, setCurrentPhase] = useState<string>(initialCfg.restState);
  const [moveX, setMoveX] = useState<number>(0);
  const [flickerLetters, setFlickerLetters] = useState<Set<number>>(new Set());
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const elementRef = useRef<HTMLElement | null>(null);
  const hasPlayedRef = useRef(false);
  const enterDoneRef = useRef<boolean>(!enterEnabled);

  const getThreshold = (): number => {
    switch (amount) {
      case "above":
        return 0;
      case "middle":
        return 0.5;
      case "below":
        return 1.0;
      default:
        return 0;
    }
  };

  function generateTimings(
    count: number,
    totalMs: number,
    easeCurve: unknown
  ): number[] {
    const slots = count;
    const fn = makeEaseFn(easeCurve);
    const intervals: number[] = [];
    let prev = 0;
    for (let i = 1; i <= slots; i++) {
      const t = i / slots;
      const cur = fn(t) * totalMs;
      intervals.push(Math.max(0, cur - prev));
      prev = cur;
    }
    return intervals;
  }

  const runAnimation = (cfg: FlickerCfg) => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setFlickerLetters(new Set());
    setActiveCfg(cfg);

    const totalMs = cfg.duration * 1000;
    const delayMs = cfg.delay * 1000;

    const executeCycle = () => {
      setFlickerLetters(new Set());
      setMoveX(0);

      const delayTimer = setTimeout(() => {
        if (cfg.showStroke) {
          setCurrentPhase("outline");
        } else {
          setCurrentPhase("filled");
        }

        const count = Math.max(1, cfg.flickerCount);
        const timings = generateTimings(count, totalMs, cfg.easeCurve);
        let accumulated = 0;
        const totalLetters = (text ?? "").length;

        for (let i = 0; i < count; i++) {
          accumulated += timings[i];
          const isLast = i === count - 1;

          const t = setTimeout(() => {
            if (cfg.shakeEnabled) {
              const direction = i % 2 === 0 ? 1 : -1;
              const ratio = 1 - i / count;
              setMoveX(direction * cfg.shakeWidth * ratio);
            }

            if (cfg.letterFlickerEnabled && totalLetters > 0) {
              const numToPick = Math.max(
                1,
                Math.round(
                  (totalLetters * (cfg.letterFlickerIntensity / 100)) / count
                )
              );
              const picked = new Set<number>();
              for (let k = 0; k < numToPick; k++) {
                picked.add(Math.floor(Math.random() * totalLetters));
              }
              setFlickerLetters(picked);
            }

            if (isLast) {
              setMoveX(0);
              setFlickerLetters(new Set());
              setCurrentPhase("filled");

              if (loop) {
                const pauseMs = (loopDelay ?? 1) * 1000;
                const loopTimer = setTimeout(() => {
                  executeCycle();
                }, pauseMs);
                timersRef.current.push(loopTimer);
              }
            }
          }, accumulated);

          timersRef.current.push(t);
        }
      }, delayMs);

      timersRef.current.push(delayTimer);
    };

    executeCycle();
  };

  const sig = JSON.stringify({
    contentType,
    enterEnabled,
    hoverEnabled,
    enterCfg,
    hoverCfg,
    replay,
    amount,
    colorMode,
    fontColor,
    gradientStart,
    gradientEnd,
    gradientAngle,
    text,
  });

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    hasPlayedRef.current = false;
    enterDoneRef.current = !enterEnabled;
    setFlickerLetters(new Set());
    const baseCfg = enterEnabled
      ? enterCfg
      : hoverEnabled
      ? hoverCfg
      : enterCfg;
    setActiveCfg(baseCfg);
    setCurrentPhase(baseCfg.restState);
    setMoveX(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);

  useEffect(() => {
    if (!enterEnabled) return;
    if (!elementRef.current) return;
    const threshold = getThreshold();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasPlayedRef.current) {
              hasPlayedRef.current = true;
              enterDoneRef.current = false;
              runAnimation(enterCfg);
              const totalMs = (enterCfg.delay + enterCfg.duration) * 1000;
              timersRef.current.push(
                setTimeout(() => {
                  enterDoneRef.current = true;
                }, totalMs)
              );
            }
          } else {
            if (replay === "yes") {
              hasPlayedRef.current = false;
              enterDoneRef.current = false;
              timersRef.current.forEach(clearTimeout);
              timersRef.current = [];
              setFlickerLetters(new Set());
              setCurrentPhase(enterCfg.restState);
              setMoveX(0);
            }
          }
        });
      },
      { threshold }
    );
    observer.observe(elementRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);

  const handleMouseEnter = () => {
    if (!hoverEnabled) return;
    if (enterEnabled && !enterDoneRef.current) return;
    runAnimation(hoverCfg);
  };

  const getFilledStyle = (): React.CSSProperties => {
    if (colorMode === "gradient") {
      return {
        background: `linear-gradient(${gradientAngle ?? 90}deg, ${gradientStart}, ${gradientEnd})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        WebkitTextStroke: "0px transparent",
        color: "transparent",
      };
    }
    return {
      color: fontColor,
      WebkitTextFillColor: fontColor,
      WebkitTextStroke: "0px transparent",
      background: "none",
    };
  };

  const getTextStyle = (): React.CSSProperties => {
    switch (currentPhase) {
      case "invisible":
        return {
          color: "transparent",
          WebkitTextFillColor: "transparent",
          WebkitTextStroke: "0px transparent",
          background: "none",
        };
      case "outline":
        return {
          color: "transparent",
          WebkitTextFillColor: "transparent",
          WebkitTextStroke: `${activeCfg.strokeWidth}px ${activeCfg.strokeColor}`,
          background: "none",
        };
      case "filled":
        return getFilledStyle();
      default:
        return {
          color: "transparent",
          WebkitTextFillColor: "transparent",
          WebkitTextStroke: "0px transparent",
          background: "none",
        };
    }
  };

  const sharedContainerStyle: React.CSSProperties = {
    transform: `translateX(${moveX}px)`,
    transition: "none",
    cursor: hoverEnabled ? "pointer" : undefined,
  };

  const getFlickerLetterStyle = (): React.CSSProperties => {
    if (activeCfg.letterFlickerMode === "stroke") {
      if (currentPhase === "outline") {
        return {
          opacity: 0,
          WebkitTextFillColor: "transparent",
          color: "transparent",
          WebkitTextStroke: "0px transparent",
          background: "none",
        };
      }
      return {
        WebkitTextFillColor: "transparent",
        color: "transparent",
        WebkitTextStroke: `${activeCfg.strokeWidth}px ${activeCfg.strokeColor}`,
        background: "none",
        WebkitBackgroundClip: "initial",
        backgroundClip: "initial",
      };
    }
    return { opacity: activeCfg.letterFlickerOpacity / 100 };
  };

  const renderText = () => {
    if (
      !activeCfg.letterFlickerEnabled ||
      (currentPhase !== "filled" && currentPhase !== "outline") ||
      flickerLetters.size === 0
    ) {
      return text;
    }
    return (text ?? "").split("").map((char: string, i: number) => {
      if (char.trim() === "" || !flickerLetters.has(i)) {
        return <span key={i}>{char}</span>;
      }
      return (
        <span key={i} style={getFlickerLetterStyle()}>
          {char}
        </span>
      );
    });
  };

  const Tag = (tag ?? "p") as React.ElementType;

  return (
    <Tag
      ref={elementRef as unknown as React.Ref<HTMLElement>}
      onMouseEnter={handleMouseEnter}
      className={className}
      style={{
        ...sharedContainerStyle,
        ...font,
        ...getTextStyle(),
        ...style,
      }}
    >
      {renderText()}
    </Tag>
  );
}
