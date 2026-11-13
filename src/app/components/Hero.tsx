"use client";

import React, { useEffect, useState } from "react";
import HeroStatus from "./HeroStatus";
import { HeroHeadline } from "./HeroHeadline";
import { ArrowIcon, Signature, WaveIcon } from "./ink";

/**
 * A simple introduction, with the same pen marks as the rest of the site.
 *
 * It plays in one sequence: the headline and its pen marks first, then the
 * note, the signature, the buttons and the status line, each starting as the
 * one before it finishes. The headline says when its marks are drawn; the
 * rest of the timing is in globals.css (.hero[data-stage="rest"]).
 */
export const Hero = () => {
  // A new take remounts the signature, so hovering it signs it again.
  const [take, setTake] = useState(0);
  const [stage, setStage] = useState<"headline" | "rest">("headline");

  // A backstop: if the marks can't be drawn for any reason, the rest still arrives.
  useEffect(() => {
    const backstop = window.setTimeout(() => setStage("rest"), 3200);
    return () => window.clearTimeout(backstop);
  }, []);

  return (
    <section className="hero" id="hero" aria-labelledby="hero-title" data-stage={stage}>
      {/* Without JavaScript nothing would start the sequence, so show it all at once. */}
      <noscript>
        <style>{`.hero-step, .hero-signature .ink-line, .hero-button-outline .ink-line { opacity: 1 !important; animation: none !important; } .hero-built { color: inherit !important; }`}</style>
      </noscript>
      <HeroHeadline onDrawn={() => setStage("rest")} />

      <div className="hero-note hero-step">
        <p className="hero-description">
          <span className="hero-introduction">I&rsquo;m Tolu, a software developer.</span>
          You have the concept, I have the stack.
          <span className="hero-invitation">Let&rsquo;s build it together.</span>
        </p>
        <p className="hero-sign" onMouseEnter={() => setTake((t) => t + 1)}>
          <span className="visually-hidden">Toluwalope Adegoke</span>
          <Signature key={take} className="hero-signature" />
        </p>
      </div>

      <div className="hero-links hero-step">
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
      {/* The status line is a kraft-paper note taped under the buttons. */}
      <div className="hero-footnote hero-step">
        <HeroStatus />
      </div>
    </section>
  );
};

export default Hero;
