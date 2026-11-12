import React from "react";
import { NEXT_LETTERING } from "../../../components/ink";

/** "what's next." in the hero's hand, as on the live site. */
export const NextLettering = () => (
  <svg viewBox={NEXT_LETTERING.viewBox} fill="none" aria-hidden="true">
    <g className="hero-lettering-strokes">
      {NEXT_LETTERING.strokes.map((d, i) => (
        <path key={i} pathLength={1} style={{ "--i": i } as React.CSSProperties} d={d} />
      ))}
    </g>
  </svg>
);
