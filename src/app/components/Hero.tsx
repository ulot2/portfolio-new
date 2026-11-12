"use client";

import React, { useState } from "react";
import HeroStatus from "./HeroStatus";
import { ArrowIcon, NEXT_LETTERING, Signature, WaveIcon } from "./ink";

/** Lettered in the same single-stroke hand as the wordmark and signature. */
const NextLettering = () => (
  <svg viewBox={NEXT_LETTERING.viewBox} fill="none" aria-hidden="true">
    <g className="hero-lettering-strokes">
      {NEXT_LETTERING.strokes.map((d, i) => (
        <path key={i} pathLength={1} style={{ "--i": i } as React.CSSProperties} d={d} />
      ))}
    </g>
  </svg>
);

/** A simple introduction, with the same pen marks as the rest of the site. */
export const Hero = () => {
  // A new take remounts the signature, so hovering it signs it again.
  const [take, setTake] = useState(0);

  return (
    <section className="hero" id="hero" aria-labelledby="hero-title">
      <h1 className="hero-title" id="hero-title">
        <span className="hero-title-line">I turn &ldquo;what if&rdquo;</span>
        <span className="hero-title-line hero-title-finish">
          into <span className="hero-handwritten"><span className="visually-hidden">what&rsquo;s next.</span><NextLettering /></span>
        </span>
      </h1>

      <div className="hero-note hero-rise" style={{ "--i": 1 } as React.CSSProperties}>
        <p className="hero-description">
          <span className="hero-introduction">I&rsquo;m Toluwalope, a software developer.</span>
          You have the concept, I have the stack.
          <span className="hero-invitation">Let&rsquo;s build it together.</span>
        </p>
        <p className="hero-sign" onMouseEnter={() => setTake((t) => t + 1)}>
          <span className="visually-hidden">Toluwalope Adegoke</span>
          <Signature key={take} className="hero-signature" />
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
  );
};

export default Hero;
