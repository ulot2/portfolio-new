const BOX =
  "M14 3.8C48 2.3 97 3 138 3.2c7.8.1 10.1 4.7 10.4 20.6.4 15.9-2 22.6-10.2 22.8-37.7.6-88.3 1.2-124.4-.1C6 46.1 3.8 40 4.2 24.3 4.5 9.7 6 4.2 14 3.8Z";
const RETRACE = "M9 6.5c40-2.6 92-2.2 131-1 6 .4 8.6 6 8.4 19.5-.3 14-3.3 19.8-10.6 20.3-35 1.4-90 1.7-123.6.4";

/**
 * Diagram. The sentence stays in type and the pen annotates it, like a sketch
 * on a whiteboard: "what if" is loosely circled in pencil as a rough idea, an
 * arrow leaves it, and "what's next." is boxed twice in yellow ink as the
 * thing that got built. The marks draw in that order.
 */
export const Diagram = () => (
  <h1 className="hero-title ph-c" id="hero-title">
    <span className="hero-title-line">
      I turn{" "}
      <span className="ph-c-idea">
        &ldquo;what if&rdquo;
        <svg className="ph-c-loop" viewBox="0 0 200 70" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path
            className="ink-line"
            pathLength={1}
            vectorEffect="non-scaling-stroke"
            d="M30 12C66 2 142 2 176 13c21 7 23 35 2 45-37 14-121 14-157 2C-1 52-3 24 22 14c40-15 120-13 160 3"
          />
        </svg>
        <svg className="ph-c-arrow" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <path className="ink-line ph-c-arrow-line" pathLength={1} d="M3 9c15-5 31 0 35 14 2 7 1 13-2 20" />
          <path className="ink-line ph-c-arrow-head" pathLength={1} d="M27 34c2.6 3.8 5.6 7 9 9.4 2.4-4.2 5.4-8 9.2-11.4" />
        </svg>
      </span>
    </span>
    <span className="hero-title-line">
      into{" "}
      <span className="ph-c-built">
        what&rsquo;s next.
        <svg className="ph-c-box" viewBox="0 0 152 50" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path className="ink-line" pathLength={1} vectorEffect="non-scaling-stroke" d={BOX} />
          <path className="ink-line ph-c-retrace" pathLength={1} vectorEffect="non-scaling-stroke" d={RETRACE} />
        </svg>
      </span>
    </span>
  </h1>
);
