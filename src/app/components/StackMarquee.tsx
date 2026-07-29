"use client";

import React from "react";
import MobileStackMarquee from "./MobileStackMarquee";

const STACK_ITEMS = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
];

export const StackMarquee = () => {
  // Duplicate array multiple times for seamless infinite looping
  const items = [...STACK_ITEMS, ...STACK_ITEMS, ...STACK_ITEMS, ...STACK_ITEMS];

  return (
    <>
      {/* Desktop Marquee */}
      <div
        className="stack-marquee-wrapper desktop-stack-marquee-wrapper fade-up delay-5"
        aria-label="Tech Stack Desktop"
      >
        <div className="stack-marquee-track">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <span className="stack-item" tabIndex={0}>
                {item}
              </span>
              <span className="stack-dot" aria-hidden="true">
                ·
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Dedicated Mobile Marquee */}
      <MobileStackMarquee />
    </>
  );
};

export default StackMarquee;
