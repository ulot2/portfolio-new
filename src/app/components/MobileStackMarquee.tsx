"use client";

import React from "react";
import { STACK_ITEMS, MARQUEE_REPEATS } from "@/data/stack";

export const MobileStackMarquee = () => {
  const items = Array.from(
    { length: MARQUEE_REPEATS },
    () => STACK_ITEMS,
  ).flat();

  return (
    <div
      className="mobile-stack-marquee-wrapper fade-up delay-5"
      aria-hidden="true"
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
            <span className="stack-item">{item}</span>
            <span className="stack-dot">·</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MobileStackMarquee;
