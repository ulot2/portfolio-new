"use client";

import React from "react";

const STACK_ITEMS = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
];

export const MobileStackMarquee = () => {
  // Duplicate array for seamless infinite looping on mobile screens
  const items = [...STACK_ITEMS, ...STACK_ITEMS, ...STACK_ITEMS, ...STACK_ITEMS];

  return (
    <div
      className="mobile-stack-marquee-wrapper fade-up delay-5"
      aria-label="Tech Stack Mobile"
      style={{
        width: "50%",
        maxWidth: "50%",
        overflow: "hidden",
        contain: "paint",
        boxSizing: "border-box",
      }}
    >
      <div className="mobile-stack-marquee-track">
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
  );
};

export default MobileStackMarquee;
