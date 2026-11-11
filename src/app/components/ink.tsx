// Hand-drawn marks. Every path is drawn by hand on purpose: the slight wobble
// is the point, so do not "clean up" the coordinates into perfect shapes.

// "toluwalope" in pen order. The tail of the e swings into an arrow (the
// "what's next"), and the t is crossed last, in yellow, as people do.
export const NAME_STROKES: { d: string; accent?: boolean }[] = [
  { d: "M6.2 3.5c-.4 5-.6 10-.4 15 .1 3 1.3 4.8 3.7 5" },
  { d: "M19.8 13.6c-1.8-1.7-4.9-1.6-6.4.6-1.6 2.3-1.3 6.1.8 8.3 2 2 5.3 1.4 6.4-1.1 1-2.4.8-5.6-1-7.6" },
  { d: "M26.4 2.8c-.5 6.7-.7 13.4-.4 19.4.1 1.4.8 2.2 2 2.1" },
  { d: "M31.6 12.4c-.4 3-.5 6.1.1 8.7.6 2.6 3.6 3.6 5.6 1.8 1.4-1.3 2.1-3.4 2.3-5.5" },
  { d: "M39.8 12.2c-.2 3.8-.1 7.6.4 11.6" },
  { d: "M44.2 12.6c.8 3.8 1.7 7.5 2.9 11.2 1.3-3.4 2.4-6.9 3.5-10.4 1.1 3.5 2.3 7 3.6 10.4 1.3-3.7 2.3-7.4 3.1-11.2" },
  { d: "M69.6 14.4c-1.4-2.4-4.7-2.8-6.6-.7-2 2.2-2.2 6.2-.4 8.6 1.7 2.2 5.1 2 6.6-.6" },
  { d: "M70.2 12.6c-.3 3.7-.2 7.5.6 11.2" },
  { d: "M75.6 2.6c-.6 6.8-.8 13.6-.5 19.6.1 1.4.8 2.2 2 2.2" },
  { d: "M87.8 13.6c-1.8-1.7-4.9-1.6-6.4.6-1.6 2.3-1.3 6.1.8 8.3 2 2 5.3 1.4 6.4-1.1 1-2.4.8-5.6-1-7.6" },
  { d: "M94.4 12.6c-.1 6.4-.1 12.8.3 19.2" },
  { d: "M94.6 14.6c1.6-2.4 5.4-2.9 7.2-.8 1.7 2.1 1.5 5.8-.5 7.8-2 2-5.3 1.8-6.8-.4" },
  {
    d: "M107.8 18.2c3 .3 6 .2 8.9-.4.2-3-2.4-5.4-5.3-5.1-3 .4-4.5 3.6-4 6.4.5 3 3.2 5.1 6.2 4.8 2.4-.2 4.4-1.5 6.2-3.4 2.2-2.3 4.5-3.2 7.4-3.2",
  },
  { d: "M124.8 14.4c1.3.8 2.6 1.8 3.9 3M128.7 17.6c-1 1.2-2.2 2.3-3.5 3.5" },
  { d: "M1.9 12.8c3.2-.6 6.4-.7 9.4-.4", accent: true },
];

/** The wordmark: "toluwalope", written in once on load. */
export const NameMark = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 131 34" fill="none" aria-hidden="true">
    {NAME_STROKES.map((stroke, i) => (
      <path
        key={i}
        className={stroke.accent ? "ink-line ink-accent" : "ink-line"}
        style={{ "--ink-delay": `${i * 110}ms` } as React.CSSProperties}
        d={stroke.d}
        pathLength={1}
      />
    ))}
  </svg>
);

type Word = { viewBox: string; strokes: { d: string; accent?: boolean }[] };

// Section headings, written in the same hand as the logo. As in the logo, the
// t is crossed last and in yellow.
export const WORDS: Record<string, Word> = {
  projects: {
    viewBox: "0 0 90 34",
    strokes: [
      { d: "M2.4 12.6c-.1 6.4-.1 12.8.3 19.2" },
      { d: "M2.6 14.6c1.6-2.4 5.4-2.9 7.2-.8 1.7 2.1 1.5 5.8-.5 7.8-2 2-5.3 1.8-6.8-.4" },
      { d: "M15.2 12.8c-.1 3.7 0 7.4.2 11.1" },
      { d: "M15.4 16.2c1.2-2.4 3.4-3.8 5.9-3.4" },
      { d: "M30.8 13.6c-1.8-1.7-4.9-1.6-6.4.6-1.6 2.3-1.3 6.1.8 8.3 2 2 5.3 1.4 6.4-1.1 1-2.4.8-5.6-1-7.6" },
      { d: "M38.6 12.8c.1 5.4.2 10.8-.2 16.1-.3 2.6-2.2 3.8-4.4 3.1" },
      { d: "M38.9 7.6c.2.2.2.5 0 .7" },
      { d: "M43.8 18.2c3 .3 6 .2 8.9-.4.2-3-2.4-5.4-5.3-5.1-3 .4-4.5 3.6-4 6.4.5 3 3.2 5.1 6.2 4.8 1.6-.1 3-.8 4.1-1.8" },
      { d: "M65 14.6c-1.6-1.8-4.6-2.2-6.6-.6-2.2 1.8-2.6 5.6-1 8 1.6 2.4 5 2.8 7.4 1" },
      { d: "M70.2 3.5c-.4 5-.6 10-.4 15 .1 3 1.3 4.8 3.7 5" },
      { d: "M86.2 14.2c-1.4-1.6-4.2-1.9-5.8-.6-1.6 1.4-.8 3.4 1 4.2 1.8.8 4.4 1.4 4.8 3.4.4 2.2-2 3.6-4.4 3.4-1.6-.1-3-.8-3.8-1.8" },
      { d: "M67.4 12.8c2.6-.5 5.2-.6 7.8-.3", accent: true },
    ],
  },
  writing: {
    viewBox: "0 0 78 34",
    strokes: [
      { d: "M2.2 12.6c.8 3.8 1.7 7.5 2.9 11.2 1.3-3.4 2.4-6.9 3.5-10.4 1.1 3.5 2.3 7 3.6 10.4 1.3-3.7 2.3-7.4 3.1-11.2" },
      { d: "M20.2 12.8c-.1 3.7 0 7.4.2 11.1" },
      { d: "M20.4 16.2c1.2-2.4 3.4-3.8 5.9-3.4" },
      { d: "M30.4 12.9c-.1 3.6 0 7.2.3 10.8" },
      { d: "M30.6 7.8c.2.2.2.5 0 .7" },
      { d: "M37.2 3.5c-.4 5-.6 10-.4 15 .1 3 1.3 4.8 3.7 5" },
      { d: "M45.4 12.9c-.1 3.6 0 7.2.3 10.8" },
      { d: "M45.6 7.8c.2.2.2.5 0 .7" },
      { d: "M50.4 12.8c0 3.7.1 7.4.2 11 .2-3.2 1-6.6 3-8.6 1.8-1.8 4.4-1.4 5.2.8.8 2.4.6 5.2.8 7.8" },
      { d: "M71.4 14.4c-1.4-2.4-4.7-2.8-6.6-.7-2 2.2-2.2 6.2-.4 8.6 1.7 2.2 5.1 2 6.6-.6" },
      { d: "M72 12.6c.1 5.4.2 10.8-.4 16-.4 2.8-2.8 4-5.4 3.4-1.6-.4-2.6-1.4-3-2.6" },
      { d: "M34.4 12.8c2.6-.5 5.2-.6 7.8-.3", accent: true },
    ],
  },
  // n and w borrowed from "writing", o from "projects", in the same hand.
  now: {
    viewBox: "0 0 48 34",
    strokes: [
      { d: "M2.2 12.8c0 3.7.1 7.4.2 11 .2-3.2 1-6.6 3-8.6 1.8-1.8 4.4-1.4 5.2.8.8 2.4.6 5.2.8 7.8" },
      { d: "M23.6 13.6c-1.8-1.7-4.9-1.6-6.4.6-1.6 2.3-1.3 6.1.8 8.3 2 2 5.3 1.4 6.4-1.1 1-2.4.8-5.6-1-7.6" },
      { d: "M28.8 12.6c.8 3.8 1.7 7.5 2.9 11.2 1.3-3.4 2.4-6.9 3.5-10.4 1.1 3.5 2.3 7 3.6 10.4 1.3-3.7 2.3-7.4 3.1-11.2" },
      // No t to cross, so the yellow goes under the word instead.
      { d: "M2.6 29.4c12.6-1.3 26.4-1.5 40.2-.5", accent: true },
    ],
  },
  contact: {
    viewBox: "0 0 80 34",
    strokes: [
      { d: "M10 14.6c-1.6-1.8-4.6-2.2-6.6-.6-2.2 1.8-2.6 5.6-1 8 1.6 2.4 5 2.8 7.4 1" },
      { d: "M20.8 13.6c-1.8-1.7-4.9-1.6-6.4.6-1.6 2.3-1.3 6.1.8 8.3 2 2 5.3 1.4 6.4-1.1 1-2.4.8-5.6-1-7.6" },
      { d: "M25.4 12.8c0 3.7.1 7.4.2 11 .2-3.2 1-6.6 3-8.6 1.8-1.8 4.4-1.4 5.2.8.8 2.4.6 5.2.8 7.8" },
      { d: "M39.2 3.5c-.4 5-.6 10-.4 15 .1 3 1.3 4.8 3.7 5" },
      { d: "M53.6 14.4c-1.4-2.4-4.7-2.8-6.6-.7-2 2.2-2.2 6.2-.4 8.6 1.7 2.2 5.1 2 6.6-.6" },
      { d: "M54.2 12.6c-.3 3.7-.2 7.5.6 11.2" },
      { d: "M67.4 14.6c-1.6-1.8-4.6-2.2-6.6-.6-2.2 1.8-2.6 5.6-1 8 1.6 2.4 5 2.8 7.4 1" },
      { d: "M72.6 3.5c-.4 5-.6 10-.4 15 .1 3 1.3 4.8 3.7 5" },
      { d: "M36.4 12.8c2.6-.5 5.2-.6 7.8-.3", accent: true },
      { d: "M69.8 12.8c2.6-.5 5.2-.6 7.8-.3", accent: true },
    ],
  },
};

/** Hiring: a briefcase. */
export const BriefcaseIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      className="ink-line"
      d="M3.8 8.6c5.5-.4 10.9-.4 16.4 0 .3 3.6.3 7.3 0 10.9-5.4.4-10.9.4-16.4 0-.3-3.6-.3-7.3 0-10.9z"
    />
    <path className="ink-line" d="M9 8.4c-.1-1.2 0-2.4.2-3.5 1.9-.3 3.8-.3 5.6 0 .2 1.1.3 2.3.2 3.5" />
    <path className="ink-line" d="M3.9 13c5.4.4 10.8.4 16.2 0" />
  </svg>
);

/** A project idea: a lightbulb. */
export const BulbIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      className="ink-line" pathLength={1}
      d="M9.4 16.4c-2.4-1.4-3.8-4.1-3.3-6.9.5-3 3.2-5.3 6.2-5.2 3.2.1 5.8 2.7 5.8 5.9 0 2.4-1.3 4.6-3.4 5.8"
    />
    <path className="ink-line" pathLength={1} d="M9.6 17c1.6.2 3.3.2 4.9 0M10 19.6c1.3.2 2.7.2 4 0" />
    <path className="ink-line" pathLength={1} d="M10.6 11.4c.5.7 1 1.4 1.4 2.2.4-.8.9-1.5 1.4-2.2" />
  </svg>
);

/** Writing: a pencil. */
export const PencilIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      className="ink-line" pathLength={1}
      d="M5.2 18.9l1.1-4.3 10.1-10.2c.8-.8 2.1-.8 2.9 0 .8.8.8 2 0 2.8L9.2 17.4l-4 1.5z"
    />
    <path className="ink-line" pathLength={1} d="M14.7 6.1l2.9 2.9M6.4 14.6l2.8 2.8" />
  </svg>
);

/** Just saying hi: a waving hand. */
export const WaveIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      className="ink-line" pathLength={1}
      d="M8 20.2c-2.4-1.6-3.6-4.4-3.4-7.2l.2-3.4c.1-.9.9-1.5 1.7-1.3.7.2 1.1.8 1.1 1.5l.1 2.4-.5-6.4c-.1-.9.6-1.6 1.4-1.6.8 0 1.4.6 1.5 1.4l.4 5.2-.2-6.2c0-.9.7-1.5 1.5-1.5s1.4.7 1.5 1.5l.2 6.2.2-4.8c.1-.8.7-1.4 1.5-1.3.8 0 1.4.7 1.3 1.5l-.2 7.8c-.1 3.6-2 6.6-5.2 7.4-1.2.3-2.4.1-3.5-.6"
    />
    <path className="ink-line" pathLength={1} d="M18.8 4.2c.9.7 1.5 1.6 1.8 2.6M20.6 2.6c1.2 1 2 2.3 2.3 3.7" />
  </svg>
);

/** Three loose lines. When open, the outer two cross into an X and the middle one lifts away. */
export const MenuIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path className="ink-line menu-top" d="M4.6 7.2c4.9-.5 9.9-.5 14.8-.1" />
    <path className="ink-line menu-mid" d="M4.4 12.1c3.6-.3 7.3-.3 10.9.1" />
    <path className="ink-line menu-bot" d="M4.8 17c4.8-.4 9.7-.3 14.6.1" />
  </svg>
);

/** A loose pen box that stretches around whatever it frames. */
export const PanelFrame = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 160" preserveAspectRatio="none" aria-hidden="true">
    <path
      vectorEffect="non-scaling-stroke"
      d="M8.6 3.4c61-1.9 122.1-1.6 183.2-.4 4.6 1.6 5.4 5.6 5.6 10.2 1.4 43.4 1 89.6-.6 133.4-.6 5.2-3.4 8.6-8.8 9.4-58.6 1.4-117.6 1.6-176.2-.2-5-.6-8.2-3.8-8.6-9.2-1.6-44.6-1.4-91.6.2-136.4.6-4 2.6-6.2 5.2-6.8z"
    />
  </svg>
);

/** Back to the top: an arrow pointing up. */
export const UpArrowIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path className="ink-line" d="M12.1 19.6c-.2-4.8-.1-9.6.2-14.4" />
    <path className="ink-line" d="M7.8 9.4c1.4-1.6 2.8-3.1 4.4-4.6 1.4 1.6 2.8 3.2 4.1 4.8" />
  </svg>
);

/** Two sheets, one behind the other. */
export const CopyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      className="ink-line"
      d="M9.2 8.4c3.6-.3 7.2-.3 10.8 0 .3 3.8.3 7.6 0 11.4-3.6.3-7.2.3-10.8 0-.3-3.8-.3-7.6 0-11.4z"
    />
    <path className="ink-line" d="M15.4 5.2c0-.5-.1-.9-.2-1.3-3.6-.3-7.2-.3-10.8 0-.3 3.8-.3 7.6 0 11.4.4.1.9.2 1.4.2" />
  </svg>
);

/** A quick tick, for "done". */
export const TickIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path className="ink-line" d="M4.6 12.8c1.8 1.6 3.4 3.4 4.8 5.4 3.2-5 6.8-9.4 10.8-13.2" pathLength={1} />
  </svg>
);

/** Frontend: a browser window. */
export const BrowserIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      className="ink-line"
      d="M3.8 5.6c5.5-.3 11-.3 16.4 0 .3 4.3.3 8.7 0 13-5.4.3-10.9.3-16.4 0-.3-4.3-.3-8.7 0-13z"
    />
    <path className="ink-line" d="M4 9.4c5.3.2 10.7.2 16 0" />
    <path className="ink-line" d="M6.4 7.5c.1.1.1.3 0 .4M8.6 7.5c.1.1.1.3 0 .4" />
  </svg>
);


/** Tooling: a wrench. */
export const WrenchIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      className="ink-line" pathLength={1}
      d="M14.6 4.4c2.2-.8 4.6-.2 6 1.6l-3.2 3.2.2 2 2 .2 3.2-3.2c1 2.4.2 5.2-2 6.4-1.6.8-3.4.8-5 .2l-8.2 8.2c-.8.8-2.2.8-3 0s-.8-2.2 0-3l8.2-8.2c-.8-2.6.2-5.4 1.8-7.4z"
    />
  </svg>
);

/** A handwritten word, drawn stroke by stroke once its parent marks it seen. */
export const HandWord = ({ word, className }: { word: string; className?: string }) => {
  const { viewBox, strokes } = WORDS[word];
  return (
    <svg className={className} viewBox={viewBox} fill="none" aria-hidden="true">
      {strokes.map((stroke, i) => (
        <path
          key={i}
          className={stroke.accent ? "ink-line ink-accent" : "ink-line"}
          style={{ "--ink-delay": `${i * 90}ms` } as React.CSSProperties}
          d={stroke.d}
          pathLength={1}
        />
      ))}
    </svg>
  );
};

/**
 * Tally marks, as counted by hand: four upright strokes, the fifth struck
 * across them. Small fixed wobbles keep the marks from looking ruled.
 */
export const Tally = ({ count, className }: { count: number; className?: string }) => {
  const strokes: string[] = [];
  let x = 3;
  for (let i = 1; i <= count; i++) {
    if (i % 5 === 0) {
      // The strike runs back across the four marks just drawn.
      strokes.push(`M${x - 18.5} 17.2c5.6-2.8 11.4-6 17.2-9.6`);
      x += 5;
      continue;
    }
    const lean = ((i * 7) % 3) * 0.35 - 0.35;
    strokes.push(`M${x} 4.6c${lean} 4.4 ${lean * 0.6} 9 .2 13.8`);
    x += 4.6;
  }
  return (
    <svg className={className} viewBox={`0 0 ${x + 2} 22`} fill="none" aria-hidden="true">
      {strokes.map((d, i) => (
        <path
          key={i}
          className="ink-line"
          style={{ "--ink-delay": `${900 + i * 110}ms` } as React.CSSProperties}
          d={d}
          pathLength={1}
        />
      ))}
    </svg>
  );
};

const SUN_RAYS = [
  "M12.1 2.7c-.1.7 0 1.4-.1 2.1",
  "M12.2 19.3c0 .7-.1 1.4 0 2.1",
  "M2.8 12.2c.7-.1 1.4 0 2.1-.1",
  "M19.2 11.9c.7.1 1.4 0 2.1.1",
  "M5.4 5.3c.5.5 1 .9 1.4 1.5",
  "M17.2 17.3c.5.5.9 1 1.5 1.4",
  "M18.8 5.4c-.5.5-1 .9-1.4 1.5",
  "M6.8 17.2c-.5.5-.9 1-1.5 1.5",
];

/*
 * The sun's body and the moon's crescent use the same four curves, so CSS can
 * bend one into the other (the `d` property). The moon is a full circle on the
 * left with its right half pushed in.
 */
const SUN_BODY =
  "M12 6.9C9.1 6.8 6.9 9.2 7 12.1C7.1 14.9 9.3 17.1 12.1 17C14.9 16.9 17.1 14.7 17 11.9C16.9 9.1 14.8 7 12 6.9Z";
const MOON_BODY =
  "M12.2 3.9C7.6 3.8 3.9 7.6 4 12.2C4.1 16.6 7.7 20.2 12.2 20.1C10.2 19.8 8.6 16.3 8.6 12C8.6 7.8 10.1 4.4 12.2 3.9Z";

/**
 * Sun in the dark theme, moon in the light theme. Browsers that support the
 * CSS `d` property morph between them; others switch the `d` attribute.
 */
export const ThemeIcon = ({ moon, className }: { moon: boolean; className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    style={{ "--sun": `path("${SUN_BODY}")`, "--moon": `path("${MOON_BODY}")` } as React.CSSProperties}
  >
    <path className="ink-line theme-body" d={moon ? MOON_BODY : SUN_BODY} pathLength={1} />
    <g className="theme-rays">
      {SUN_RAYS.map((d) => (
        <path key={d} className="ink-line ink-ray" d={d} pathLength={1} />
      ))}
    </g>
    <path className="ink-line theme-star" d="M18.1 5.2c0 .9.1 1.7 0 2.6M16.8 6.5c.9-.1 1.8 0 2.6-.1" pathLength={1} />
  </svg>
);

/** A loose pen underline, stretched to the width of whatever it sits under. */
export const Underline = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 6" preserveAspectRatio="none" fill="none" aria-hidden="true">
    <path
      className="ink-line"
      d="M1.2 3.6c5.3-1.2 11.1-1.6 17-1.1 5.6.5 11.4.6 17.2-.4 1.2-.2 2.4-.4 3.4-.6"
      pathLength={1}
    />
  </svg>
);

// "— Tolu" in pen order: the dash, the T's bar and stem, then o, l and u in one
// run, and last the yellow flourish underneath.
export const SIGNATURE: { d: string; accent?: boolean }[] = [
  { d: "M4 31.2c4-.4 8-.5 12-.2" },
  { d: "M26.2 13.4c6.5-2 14.3-3 22.1-2.4 3 .2 5.6.7 8 1.5" },
  { d: "M40.4 11.8c-1.4 7.8-3.4 15.6-6.4 22.6-1.6 3.6-4.2 6.6-7.6 6.4-2.2-.2-3.2-2.2-2.4-3.8" },
  { d: "M50.4 26.8c-2.8-1.6-6.2.4-6.6 3.8-.4 3 1.8 5.4 4.6 4.6 2.6-.8 3.8-4 2.6-6.6-.6-1.2-.2-2 1-1.8 1.6.3 3 1 4.6 1" },
  { d: "M56 27.8c3.4-2.8 6.6-7 8-11.6.8-2.6.4-5-1.2-4.8-2.2.3-3.8 5.2-4.6 10.2-.8 5-.6 10.4 1.4 12.4 1.4 1.4 3.4.6 4.8-1" },
  { d: "M66.4 27.4c-.8 2.6-1.6 5.4-1 7.6.6 2 2.8 1.8 4.2.2 1.6-1.8 2.6-4.6 3.2-7.6-.6 2.8-.8 5.8.2 7.6.8 1.4 2.8 1.4 4.4.2 1.8-1.4 3.4-3.6 4.8-5.6" },
  { d: "M29.4 45.2c14-2.2 30-3.2 46-2.4 8 .4 15.6 1.1 22-2.4", accent: true },
];

/** The sign-off at the end of the hero note, signed once on load. */
export const Signature = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 104 50" fill="none" aria-hidden="true">
    {SIGNATURE.map((stroke, i) => (
      <path
        key={i}
        className={stroke.accent ? "ink-line ink-accent" : "ink-line"}
        style={{ "--ink-delay": `${i * 180}ms` } as React.CSSProperties}
        d={stroke.d}
        pathLength={1}
      />
    ))}
  </svg>
);

/** A hooked arrow: drops down, then turns to point at what comes next. */
export const HookArrowIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path className="ink-line" d="M5.2 3.8c-.4 4.4.2 8.8 2.4 11.1 2.6 2.7 7.1 2.7 11.6 2.4" />
    <path className="ink-line" d="M15.6 13.9c1.3 1.1 2.6 2.3 3.7 3.5-1.2 1.2-2.4 2.5-3.4 3.8" />
  </svg>
);

/** An "opens elsewhere" arrow, pointing up and away. */
export const OutArrowIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path className="ink-line" d="M7.2 16.9c3-3.2 6.2-6.4 9.6-9.4" />
    <path className="ink-line" d="M9.6 6.9c2.5-.3 5-.3 7.4-.1.3 2.4.3 4.9 0 7.3" />
  </svg>
);

/** An envelope whose flap lifts on hover. */
export const EnvelopeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      className="ink-line" pathLength={1}
      d="M3.9 8.4c5.4-.4 10.8-.4 16.2-.1.3 3.3.3 6.6 0 9.9-5.4.4-10.8.3-16.2 0-.3-3.3-.3-6.5 0-9.8z"
    />
    <path className="ink-line ink-flap" d="M4.3 8.8c2.5 1.9 5 3.6 7.7 5.2 2.6-1.7 5.1-3.4 7.6-5.3" />
  </svg>
);

export const ArrowIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path className="ink-line" d="M4.2 12.4c4.9-.4 9.9-.5 14.8-.2" />
    <path className="ink-line" d="M14.4 7.6c1.7 1.4 3.3 2.9 4.8 4.6-1.5 1.5-3 3-4.4 4.6" />
  </svg>
);



export const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <g className="ink-drop">
      <path className="ink-line" d="M12.1 3.8c.1 2.1-.1 4.3 0 6.4.1 2.2.2 4.3.1 6.4" />
      <path className="ink-line" d="M7.9 12.6c1.4 1.4 2.8 2.9 4.3 4.3 1.3-1.5 2.6-2.9 4-4.4" />
    </g>
    <path
      className="ink-line"
      d="M4.4 15.4c.2 1.6 0 3.2.3 4.6 2.5.3 5 .2 7.5.2 2.4 0 4.9.1 7.2-.2.3-1.5.2-3 .3-4.6"
    />
  </svg>
);

/** A magnifying glass: one loose ring and a quick handle. */
export const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path className="ink-line" d="M10.6 3.9c-3.8-.2-6.9 2.9-6.7 6.7.1 3.6 3.1 6.5 6.8 6.4 3.7-.1 6.5-3.1 6.4-6.8-.1-3.5-3-6.3-6.5-6.3Z" />
    <path className="ink-line" d="M15.7 15.5c1.5 1.6 3 3.1 4.6 4.7" />
  </svg>
);

/** Two crossed pen strokes, for clearing or closing. */
export const CrossIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path className="ink-line" d="M6.2 6.4c3.7 3.8 7.6 7.5 11.5 11.4" />
    <path className="ink-line" d="M17.8 6.1c-3.9 3.8-7.7 7.7-11.4 11.7" />
  </svg>
);

/** A feed mark: a dot sending out two arcs. */
export const FeedIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path className="ink-line" d="M6 17.4c-.9.1-.9 1.4.1 1.4.9 0 .9-1.5-.1-1.4Z" />
    <path className="ink-line" d="M5.2 11.3c4.2.2 7.5 3.4 7.7 7.6" />
    <path className="ink-line" d="M5 5.2c7.7.3 13.6 6.2 13.9 13.8" />
  </svg>
);

/** A long pen rule, stretched to the width of whatever it sits under. */
export const Rule = ({ className, children }: { className?: string; children?: React.ReactNode }) => (
  <svg className={className} viewBox="0 0 680 8" preserveAspectRatio="none" fill="none" aria-hidden="true">
    <path className="ink-line" vectorEffect="non-scaling-stroke" d={RULE} />
    {children}
  </svg>
);

export const RULE = "M2 4.7c92-2.5 164 1.3 251-.5 113-2.3 214 1.5 305-.2 43-.8 82-.4 120-1";

/** An opening quote mark: two fat commas, hung upside down. */
export const QuoteIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path className="ink-line" d="M9.6 6.8c-3 1-4.9 3.4-4.8 6.3.1 2 1.5 3.4 3.3 3.3 1.7-.1 2.9-1.5 2.7-3.1-.2-1.5-1.5-2.5-3.1-2.3" />
    <path className="ink-line" d="M18.3 6.6c-3 1.1-4.8 3.5-4.7 6.4.1 2 1.5 3.4 3.3 3.3 1.7-.1 2.8-1.6 2.6-3.2-.2-1.4-1.5-2.4-3-2.2" />
  </svg>
);

/** A note in the margin: a ringed "i". */
export const InfoIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path className="ink-line" d="M12.2 3.6C7.4 3.3 3.5 7.3 3.7 12.1c-.1 4.7 3.7 8.4 8.4 8.3 4.8.1 8.4-3.8 8.2-8.5C20.4 7.3 16.8 3.4 12.2 3.6Z" />
    <path className="ink-line" d="M12.1 11.2c.1 1.8 0 3.5.1 5.2" />
    <path className="ink-line" d="M12 7.7c.2.2.2.5 0 .7" />
  </svg>
);

/** Careful: a warning triangle. */
export const WarningIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path className="ink-line" d="M12.1 4.2c-3 4.8-5.8 9.7-8.4 14.8 5.6.4 11.2.4 16.8 0-2.6-5.1-5.4-10-8.4-14.8Z" />
    <path className="ink-line" d="M12.1 9.8c.1 1.7 0 3.3.1 5" />
    <path className="ink-line" d="M12.1 17.1c.2.2.2.4 0 .6" />
  </svg>
);

/** A pen stroke down the margin, stretched to the height of what it marks. */
export const MarginLine = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 8 100" preserveAspectRatio="none" fill="none" aria-hidden="true">
    <path className="ink-line" vectorEffect="non-scaling-stroke" d="M4.4 1.5c-1.3 16.2.9 31.4-.3 48.6-.9 16.1 1 32.1.2 48.4" />
  </svg>
);

/** A small chevron, pointing up; rotate it to point elsewhere. */
export const ChevronIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path className="ink-line" d="M6.4 14.8c1.9-1.9 3.7-3.8 5.7-5.6 1.8 1.9 3.7 3.8 5.5 5.8" />
  </svg>
);

const PEN_BOX = {
  wide: {
    viewBox: "0 0 152 50",
    outer:
      "M14 3.8C48 2.3 97 3 138 3.2c7.8.1 10.1 4.7 10.4 20.6.4 15.9-2 22.6-10.2 22.8-37.7.6-88.3 1.2-124.4-.1C6 46.1 3.8 40 4.2 24.3 4.5 9.7 6 4.2 14 3.8Z",
    retrace: "M9 6.5c40-2.6 92-2.2 131-1 6 .4 8.6 6 8.4 19.5-.3 14-3.3 19.8-10.6 20.3-35 1.4-90 1.7-123.6.4",
  },
  // Drawn for a box taller than it is wide, so the corners keep their shape.
  tall: {
    viewBox: "0 0 100 160",
    outer:
      "M10 4C35 2.5 65 3 90 3.6c5 .2 6.4 3 6.6 9 .6 45 .2 90-.3 135-.1 6-2.6 8.4-7.6 8.6-26 .8-54 .9-79 .1-5-.2-6.8-3-6.9-9-.5-45-.3-90 .3-135C3.4 6 5 4.2 10 4Z",
    retrace: "M7 7.4c29-2.2 58-1.9 85-1 3.4.3 4.6 4 4.4 12-.6 42-.2 86-1.4 128-.2 5-2.4 7-6.6 7.2-26 1-52 1.2-77 .3",
  },
};

/**
 * A pen box drawn twice round whatever it sits in, like a word circled on
 * paper. It stretches to its parent, so the parent needs position: relative.
 */
export const PenBox = ({ className, tall = false }: { className?: string; tall?: boolean }) => {
  const box = PEN_BOX[tall ? "tall" : "wide"];
  return (
    <svg className={className} viewBox={box.viewBox} preserveAspectRatio="none" aria-hidden="true">
      <path className="ink-line" vectorEffect="non-scaling-stroke" d={box.outer} />
      <path className="ink-line pen-box-retrace" vectorEffect="non-scaling-stroke" d={box.retrace} />
    </svg>
  );
};

/** Now: a clock face with its two hands. */
export const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      className="ink-line" pathLength={1}
      d="M12 3.4C7.2 3 3.2 7.2 3.5 12.1c-.2 4.7 3.9 8.5 8.6 8.3 4.9.1 8.5-3.8 8.4-8.5C20.7 7.1 16.8 3.2 12 3.4Z"
    />
    <path className="ink-line" pathLength={1} d="M12 12.1c-.1-2-.1-3.9.1-5.8M12 12.1c1.4.9 2.7 1.8 4 2.8" />
  </svg>
);
