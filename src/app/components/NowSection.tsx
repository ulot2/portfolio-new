import React from "react";
import { NOW, NOW_PLACE, NOW_UPDATED } from "@/data/now";
import { OutArrowIcon, PanelFrame } from "./ink";
import { SectionHeading } from "./SectionHeading";

const updatedLabel = new Date(NOW_UPDATED).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

// Each entry is its own sticky note. The papers and tilts take turns so no two
// notes side by side look the same.
const NOTES = [
  { paper: "var(--note-green)", tilt: "-1.6deg", tape: "-4deg" },
  { paper: "var(--note-blue)", tilt: "1.3deg", tape: "3deg" },
  { paper: "var(--note-pink)", tilt: "1.8deg", tape: "-2deg" },
  { paper: "var(--note-yellow)", tilt: "-1.1deg", tape: "5deg" },
];

/**
 * A short note on what I'm working on right now: one sticky note per entry,
 * taped to the page, with the date above them.
 */
export const NowSection = () => (
  <section className="section" id="now">
    <SectionHeading word="now" label="Now" />

    <p className="nw-updated">
      Updated <time dateTime={NOW_UPDATED}>{updatedLabel}</time> · {NOW_PLACE}
    </p>

    <ul className="nw-board">
      {NOW.map((entry, i) => {
        const note = NOTES[i % NOTES.length];
        return (
          <li
            key={entry.title}
            className="nw-sticky"
            style={{ "--paper": note.paper, "--tilt": note.tilt, "--tape": note.tape } as React.CSSProperties}
          >
            <PanelFrame className="nw-paper" />
            <span className="nw-tape" aria-hidden="true" />
            <p className="nw-sticky-title">
              {entry.href ? (
                <a className="nw-link" href={entry.href} target="_blank" rel="noopener noreferrer">
                  {entry.title}
                  <OutArrowIcon className="nw-out" />
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              ) : (
                entry.title
              )}
            </p>
            <p className="nw-sticky-text">{entry.note}</p>
          </li>
        );
      })}
    </ul>
  </section>
);

export default NowSection;
