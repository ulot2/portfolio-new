/**
 * Outline to solid. No handwriting: the headline is a poster in heavy type.
 * "what if" is hollow, only an outline, and "what's next." is solid type
 * revealed by one swipe of a yellow marker.
 */
export const OutlineToSolid = () => (
  <h1 className="hero-title ph-b" id="hero-title">
    <span className="hero-title-line">
      I turn <span className="ph-b-hollow">&ldquo;what if&rdquo;</span>
    </span>
    <span className="hero-title-line">
      into{" "}
      <span className="ph-b-solid">
        {/* One pass of a wide marker: rough at both ends, slightly uneven along the edges. */}
        <svg className="ph-b-mark" viewBox="0 0 200 56" preserveAspectRatio="none" aria-hidden="true">
          <path d="M4 8.5C42 5 108 7.4 197 3.6c2.2 8.6 3.4 31.8 .8 46.2C131 53.6 62 50.2 3.4 53.2 .6 39.4 1 21.6 4 8.5Z" />
        </svg>
        what&rsquo;s next.
      </span>
    </span>
  </h1>
);
