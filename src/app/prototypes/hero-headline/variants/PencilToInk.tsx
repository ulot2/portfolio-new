import { NEXT_LETTERING } from "../../../components/ink";
import { NextLettering } from "./NextLettering";

// "what if?" in the same hand as "what's next.": w, h, a and t are the same
// strokes, followed by a new i, f and question mark.
const IF_LETTERING = {
  viewBox: "0 0 232 83",
  strokes: [
    ...NEXT_LETTERING.strokes.slice(0, 4),
    "M166 33c-1 9-1 19 0 28",
    "M166.4 20l.2 1",
    "M200 13c-5-5-12-2-13 5-2 14-2 29-1 43",
    "M177 33c7-2 14-2 21-1",
    "M211 21c1-8 12-10 15-3 3 7-6 12-6 24",
    "M220 60l.2 1",
  ],
};

/**
 * Pencil to ink. Both halves are handwritten, and the line quality carries the
 * idea: "what if?" is a dashed grey pencil sketch, "what's next." is solid
 * yellow ink. The sketch appears first, then the ink is written over it.
 */
export const PencilToInk = () => (
  <h1 className="hero-title ph-a" id="hero-title">
    <span className="hero-title-line ph-a-row">
      I turn{" "}
      <span className="ph-a-if">
        <span className="visually-hidden">&ldquo;what if&rdquo;</span>
        <svg viewBox={IF_LETTERING.viewBox} fill="none" aria-hidden="true">
          {IF_LETTERING.strokes.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </svg>
      </span>
    </span>
    <span className="hero-title-line hero-title-finish">
      into{" "}
      <span className="hero-handwritten">
        <span className="visually-hidden">what&rsquo;s next.</span>
        <NextLettering />
      </span>
    </span>
  </h1>
);
