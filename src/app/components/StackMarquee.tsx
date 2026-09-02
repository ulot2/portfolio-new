"use client";

import React from "react";
import MobileStackMarquee from "./MobileStackMarquee";
import { STACK_ITEMS, MARQUEE_REPEATS } from "@/data/stack";

export const StackMarquee = () => {
  const items = Array.from(
    { length: MARQUEE_REPEATS },
    () => STACK_ITEMS,
  ).flat();

  return (
    <>
      {/* Both marquees are always in the DOM (CSS decides which is visible), so
          the stack is announced once here and both tracks are hidden from
          assistive tech. */}
      <p className="visually-hidden">
        Tech stack: {STACK_ITEMS.join(", ")}.
      </p>

      {/* Desktop Marquee */}
      <div
        className="stack-marquee-wrapper desktop-stack-marquee-wrapper fade-up delay-5"
        aria-hidden="true"
      >
        <div className="stack-marquee-track">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <span className="stack-item">{item}</span>
              <span className="stack-dot">·</span>
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
