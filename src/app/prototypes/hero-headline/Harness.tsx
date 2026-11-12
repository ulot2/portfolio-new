"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import HeroStatus from "../../components/HeroStatus";
import { ArrowIcon, Signature, WaveIcon } from "../../components/ink";
import { Diagram } from "./variants/Diagram";
import { DiagramFirstTake } from "./variants/DiagramFirstTake";
import { OutlineToSolid } from "./variants/OutlineToSolid";
import { PencilToInk } from "./variants/PencilToInk";

const VARIANTS = [
  { name: "Pencil to ink", Headline: PencilToInk },
  { name: "Outline to solid", Headline: OutlineToSolid },
  { name: "Diagram", Headline: Diagram },
  { name: "Diagram, first take", Headline: DiagramFirstTake },
];

/**
 * The hero with its headline swapped for one variant at a time, and the
 * picker that flips between them. Everything under the headline is a copy of
 * the live hero, so each variant is judged in its real surroundings.
 */
export function Harness() {
  const [current, setCurrent] = useState(0);
  // A new take re-mounts the hero, so entrance animations run again.
  const [take, setTake] = useState(0);
  const [ready, setReady] = useState(false);
  const picker = useRef<HTMLElement>(null);
  const highlight = useRef<HTMLSpanElement>(null);

  const select = useCallback((i: number) => {
    if (i < 0 || i >= VARIANTS.length) return;
    setCurrent(i);
    setTake((t) => t + 1);
    const url = new URL(window.location.href);
    url.searchParams.set("v", String(i + 1));
    window.history.replaceState(null, "", url);
  }, []);

  // The choice survives a reload through ?v=2.
  useEffect(() => {
    const fromUrl = (parseInt(new URLSearchParams(window.location.search).get("v") ?? "", 10) || 1) - 1;
    if (fromUrl > 0 && fromUrl < VARIANTS.length) setCurrent(fromUrl);
    // The highlight slides only after first paint, so load doesn't animate.
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
    return () => cancelAnimationFrame(frame);
  }, []);

  useLayoutEffect(() => {
    const move = () => {
      const el = picker.current?.querySelectorAll<HTMLElement>(".proto-picker-item:not(.proto-picker-replay)")[current];
      if (!el || !highlight.current) return;
      highlight.current.style.width = `${el.offsetWidth}px`;
      highlight.current.style.transform = `translateX(${el.offsetLeft}px)`;
    };
    move();
    window.addEventListener("resize", move);
    return () => window.removeEventListener("resize", move);
  }, [current]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= VARIANTS.length) select(num - 1);
      else if (e.key === "ArrowRight") select((current + 1) % VARIANTS.length);
      else if (e.key === "ArrowLeft") select((current - 1 + VARIANTS.length) % VARIANTS.length);
      else if (e.key === "r" || e.key === "R") setTake((t) => t + 1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [current, select]);

  const { Headline } = VARIANTS[current];

  return (
    <>
      <section className="hero" id="hero" aria-labelledby="hero-title" key={take}>
        <Headline />

        <div className="hero-note hero-rise" style={{ "--i": 1 } as React.CSSProperties}>
          <p className="hero-description">
            <span className="hero-introduction">I&rsquo;m Toluwalope, a software developer.</span>
            You have the concept, I have the stack.
            <span className="hero-invitation">Let&rsquo;s build it together.</span>
          </p>
          <p className="hero-sign">
            <span className="visually-hidden">Toluwalope Adegoke</span>
            <Signature className="hero-signature" />
          </p>
        </div>

        <div className="hero-links hero-rise" style={{ "--i": 2 } as React.CSSProperties}>
          <a className="hero-link" href="mailto:tolu.nuell@gmail.com">
            <svg className="hero-button-outline" viewBox="0 0 152 50" preserveAspectRatio="none" aria-hidden="true">
              <path className="ink-line" pathLength={1} vectorEffect="non-scaling-stroke" d="M14 3.8C48 2.3 97 3 138 3.2c7.8.1 10.1 4.7 10.4 20.6.4 15.9-2 22.6-10.2 22.8-37.7.6-88.3 1.2-124.4-.1C6 46.1 3.8 40 4.2 24.3 4.5 9.7 6 4.2 14 3.8Z" />
              <path className="ink-line hero-button-trace" pathLength={1} vectorEffect="non-scaling-stroke" d="M14 3.8C48 2.3 97 3 138 3.2c7.8.1 10.1 4.7 10.4 20.6.4 15.9-2 22.6-10.2 22.8-37.7.6-88.3 1.2-124.4-.1C6 46.1 3.8 40 4.2 24.3 4.5 9.7 6 4.2 14 3.8Z" />
              <path className="ink-line hero-button-retrace" pathLength={1} vectorEffect="non-scaling-stroke" d="M9 6.5c40-2.6 92-2.2 131-1 6 .4 8.6 6 8.4 19.5-.3 14-3.3 19.8-10.6 20.3-35 1.4-90 1.7-123.6.4" />
            </svg>
            <WaveIcon className="hero-link-icon" />
            Say hello
          </a>
          <a className="hero-work" href="#work">
            See my work
            <ArrowIcon className="hero-work-icon" />
          </a>
        </div>
        <div className="hero-footnote hero-rise" style={{ "--i": 3 } as React.CSSProperties}>
          <svg className="hero-divider" viewBox="0 0 680 8" preserveAspectRatio="none" fill="none" aria-hidden="true">
            <path d="M2 4.7c92-2.5 164 1.3 251-.5 113-2.3 214 1.5 305-.2 43-.8 82-.4 120-1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
          <HeroStatus />
        </div>
      </section>

      <nav className="proto-picker" aria-label="Prototype variants" ref={picker} data-ready={ready ? "" : undefined}>
        <span className="proto-picker-highlight" aria-hidden="true" ref={highlight} />
        {VARIANTS.map((variant, i) => (
          <button
            key={variant.name}
            type="button"
            className="proto-picker-item"
            data-active={i === current ? "" : undefined}
            aria-current={i === current ? "true" : undefined}
            onClick={() => select(i)}
          >
            {variant.name}
          </button>
        ))}
        <span className="proto-picker-divider" aria-hidden="true" />
        <button
          type="button"
          className="proto-picker-item proto-picker-replay"
          aria-label="Replay animation (R)"
          onClick={() => setTake((t) => t + 1)}
        >
          ↻
        </button>
      </nav>
    </>
  );
}

export default Harness;
