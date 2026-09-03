"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/data/nav";
import { useActiveSection } from "../hooks/useActiveSection";

/**
 * A fixed index in the left margin — the ~350px of empty space beside the 740px
 * column on a wide viewport. No surface, no border, no blur, and nothing that
 * moves on scroll: only the active marker changes. CSS hides it below 1160px,
 * where that margin runs out and NavDock takes over.
 */
export const SectionRail = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const activeSection = useActiveSection(isHome);

  return (
    <nav className="section-rail" aria-label="Sections">
      <ol className="section-rail-list">
        {NAV_ITEMS.map((item, index) => {
          const isBlog = item.route !== undefined;
          const current = isBlog
            ? pathname.startsWith("/blog")
            : isHome && activeSection === item.id;

          const content = (
            <>
              <span className="section-rail-number" aria-hidden="true">
                {isBlog ? "" : String(index + 1).padStart(2, "0")}
              </span>
              <span className="section-rail-label">{item.label}</span>
              <span className="section-rail-leader" aria-hidden="true" />
            </>
          );

          return (
            <li
              key={item.label}
              className={`section-rail-item ${isBlog ? "is-route" : ""}`}
            >
              {isBlog ? (
                <Link
                  href={item.route!}
                  aria-current={current ? "page" : undefined}
                >
                  {content}
                </Link>
              ) : (
                <a
                  href={isHome ? `#${item.id}` : `/#${item.id}`}
                  aria-current={current ? "true" : undefined}
                >
                  {content}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default SectionRail;
