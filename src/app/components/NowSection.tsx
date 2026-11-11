import React from "react";
import { NOW, NOW_PLACE, NOW_UPDATED } from "@/data/now";
import { OutArrowIcon } from "./ink";
import { SectionHeading } from "./SectionHeading";

const updatedLabel = new Date(NOW_UPDATED).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * A short note on what I'm working on right now, written like a page torn
 * from the same notebook: a pen box, ticked entries, and the date in the corner.
 */
export const NowSection = () => (
  <section className="section" id="now">
    <SectionHeading word="now" label="Now" />

    <div className="nw-note">
      <svg className="nw-box" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
        <path
          className="ink-line"
          vectorEffect="non-scaling-stroke"
          d="M5 3.4C30 2.2 66 2.6 95.2 3.3c1.6.1 2.1 1.4 2.2 4 .4 15.8.3 31.4-.2 47.6-.1 2.2-.9 2.9-2.6 3-30.4.8-60.6.9-89.6.1-1.8-.1-2.5-1.1-2.6-3.1-.6-16-.5-32 .2-47.9.1-2.4 1-3.5 2.4-3.6Z"
        />
      </svg>

      <p className="nw-updated">
        Updated <time dateTime={NOW_UPDATED}>{updatedLabel}</time> · {NOW_PLACE}
      </p>

      <ul className="nw-list">
        {NOW.map((entry) => (
          <li key={entry.title} className="nw-item">
            <svg className="nw-tick" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path className="ink-line" d="M5.2 12.6c4.6-.4 9.3-.5 13.8-.2" />
              <path className="ink-line" d="M14.6 8.2c1.6 1.3 3.1 2.7 4.5 4.3-1.4 1.4-2.8 2.8-4.1 4.3" />
            </svg>
            <p>
              {entry.href ? (
                <a className="nw-title nw-link" href={entry.href} target="_blank" rel="noopener noreferrer">
                  {entry.title}
                  <OutArrowIcon className="nw-out" />
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              ) : (
                <strong className="nw-title">{entry.title}</strong>
              )}{" "}
              <span className="nw-text">{entry.note}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default NowSection;
