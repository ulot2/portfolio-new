"use client";

import React from "react";

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
    <div
      className="stack-marquee-wrapper fade-up delay-5"
      aria-label="Tech Stack"
      style={{ overflow: "hidden", maxWidth: "100%", contain: "paint" }}
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
  );
};

export default StackMarquee;
