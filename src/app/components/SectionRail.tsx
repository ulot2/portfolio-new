"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { NAV_ITEMS } from "@/data/nav";
import { SITE_URL } from "@/lib/site";
import { useActiveSection } from "../hooks/useActiveSection";
import { BulbIcon, ClockIcon, EnvelopeIcon, PencilIcon, Underline, WaveIcon } from "./ink";

const SECTIONS = NAV_ITEMS.filter((item) => item.route === undefined);
const BLOG = NAV_ITEMS.find((item) => item.route !== undefined);

// The little doodle each section's ink dot opens into.
const DOODLES: Record<string, (props: { className?: string }) => React.ReactElement> = {
  hero: WaveIcon,
  work: BulbIcon,
  now: ClockIcon,
  writing: PencilIcon,
  contact: EnvelopeIcon,
};

/**
 * A fixed index in the left margin, beside the 740px column on a wide
 * viewport: a pen line with an ink dot at each section. The current section's
 * dot opens into a small doodle that draws itself in, and its name gets a pen
 * underline. CSS hides it below 1200px, where NavDock takes over.
 */
export const SectionRail = () => {
  // The segment follows the rewritten route, so it is "blog" on the blog host
  // as well, where the browser path is only "/".
  const segment = useSelectedLayoutSegment();
  const isHome = segment === null;
  const activeSection = useActiveSection(isHome);
  const list = useRef<HTMLOListElement>(null);
  // The line runs from the first dot to the last, measured from the list top.
  const [line, setLine] = useState({ top: 0, height: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      const leaves = list.current?.querySelectorAll(".section-rail-stop");
      if (!list.current || !leaves?.length) return;
      const base = list.current.getBoundingClientRect().top;
      const centre = (el: Element) => {
        const r = el.getBoundingClientRect();
        return r.top - base + r.height / 2;
      };
      const top = centre(leaves[0]);
      setLine({ top, height: centre(leaves[leaves.length - 1]) - top });
    };
    measure();
    // The rail is hidden on narrow windows, where everything measures 0.
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const sectionHref = (id: string) => (isHome ? `#${id}` : `${SITE_URL}/#${id}`);

  return (
    <nav className="section-rail" aria-label="Sections">
      <svg
        className="section-rail-line"
        viewBox="0 0 4 100"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
        style={{ top: line.top, height: line.height }}
      >
        {/* No non-scaling-stroke here: with it, the draw-on dash is measured in
            screen pixels and stops ~100px down. The line is 4px wide in a
            4-unit viewBox, so the stroke never scales sideways anyway. */}
        <path
          className="ink-line"
          pathLength={1}
          d="M2 0c-.8 12 .9 24 .1 37-.7 13 .8 26 0 39-.6 9 .6 16-.1 24"
        />
      </svg>

      <ol className="section-rail-list" ref={list}>
        {SECTIONS.map((item, index) => {
          // On the full projects page, the rail marks Projects as where you are.
          const current = isHome ? activeSection === item.id : segment === "projects" && item.id === "work";
          const Doodle = DOODLES[item.id!];
          return (
            <li
              key={item.label}
              className="section-rail-item"
              data-section={item.id!}
              style={{ "--i": index } as React.CSSProperties}
            >
              <a href={sectionHref(item.id!)} aria-current={current ? "true" : undefined}>
                <span className="section-rail-label">
                  {item.label}
                  {current && <Underline className="section-rail-underline" />}
                </span>
                <span className="section-rail-stop">
                  <span className="section-rail-dot" />
                  {current && Doodle && <Doodle className="section-rail-doodle" />}
                </span>
              </a>
            </li>
          );
        })}

        {BLOG && (
          <li className="section-rail-item is-route" style={{ "--i": SECTIONS.length } as React.CSSProperties}>
            <Link href={BLOG.route!} aria-current={segment === "blog" ? "page" : undefined}>
              <span className="section-rail-label">{BLOG.label} <span aria-hidden="true">↗</span></span>
              <span aria-hidden="true" />
            </Link>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default SectionRail;
