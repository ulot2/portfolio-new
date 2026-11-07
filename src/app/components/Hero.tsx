"use client";

import { useState } from "react";
import ReelButton from "./ReelButton";
import { EnvelopeIcon, PulseIcon, Signature, Underline } from "./ink";

const rise = (i: number) => ({ "--i": i }) as React.CSSProperties;

/** The hero is a short note to the visitor on ruled lines, signed by hand. */
export const Hero = () => {
  // A new take remounts the signature, so hovering it signs it again.
  const [take, setTake] = useState(0);

  return (
    <section className="hero" id="hero">
      <div className="hero-paper hero-rise" style={rise(0)}>
        <div className="hero-ruled">
          <p className="hero-hi">Hi,</p>
          <h1 className="hero-line">
            I turn &ldquo;what if&rdquo; into &ldquo;what&rsquo;s next&rdquo;.
          </h1>
          <p className="hero-line">
            You have the concept, I have the stack.
            <br />
            Let&rsquo;s build it together.
          </p>
          <p className="hero-sign" onMouseEnter={() => setTake((t) => t + 1)}>
            <span className="visually-hidden">Toluwalope Adegoke</span>
            <Signature key={take} className="hero-signature" />
          </p>
        </div>
      </div>

      <div className="hero-links hero-rise" style={rise(1)}>
        <a className="hero-link" href="mailto:tolu.nuell@gmail.com">
          <EnvelopeIcon className="hero-link-icon" />
          Say hello
          <Underline className="hero-link-underline" />
        </a>
        <ReelButton>
          <PulseIcon className="hero-pulse" />
        </ReelButton>
      </div>
    </section>
  );
};

export default Hero;
