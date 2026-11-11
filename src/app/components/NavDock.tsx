"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { NAV_ITEMS } from "@/data/nav";
import { SITE_URL } from "@/lib/site";
import { useActiveSection } from "../hooks/useActiveSection";
import {
  BulbIcon,
  ChevronIcon,
  EnvelopeIcon,
  OutArrowIcon,
  PenBox,
  PencilIcon,
  Underline,
  UpArrowIcon,
  WaveIcon,
  } from "./ink";

// The same doodles the margin rail opens its dots into, so the two indexes match.
const DOODLES: Record<string, (props: { className?: string }) => React.ReactElement> = {
  hero: WaveIcon,
  work: BulbIcon,
  writing: PencilIcon,
  contact: EnvelopeIcon,
};

const SHOW_AFTER = 350;

/**
 * The narrow-viewport counterpart to SectionRail: the same index, folded into
 * a floating pen-drawn button. It absorbs "back to top" below 1200px so there
 * is only ever one floating element. The button wears the doodle of the
 * section you are reading, so it doubles as a "you are here" mark.
 */
export const NavDock = () => {
  // The segment follows the rewritten route, so it is "blog" on the blog host
  // as well, where the browser path is only "/".
  const segment = useSelectedLayoutSegment();
  const isHome = segment === null;
  const activeSection = useActiveSection(isHome);
  const shouldReduceMotion = useReducedMotion();
  // On the home page the button carries the current section's doodle; on the
  // blog it carries the pencil.
  const CurrentDoodle = isHome
    ? activeSection
      ? DOODLES[activeSection]
      : null
    : segment === "projects"
      ? BulbIcon
      : PencilIcon;
  // The button names where you are, so it reads as a "you are here" label.
  // It falls back to "Index" before any section has scrolled into view.
  const hereLabel = isHome
    ? NAV_ITEMS.find((item) => item.id === activeSection)?.label ?? "Index"
    : segment === "blog"
      ? "Blog"
      : segment === "projects"
        ? "Projects"
        : "Index";

  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  // Escape and clicks outside dismiss the panel.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        close(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, close]);

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
  }, [open]);

  // The pill disappearing under you while the panel is open would be jarring.
  useEffect(() => {
    if (!visible && open) setOpen(false);
  }, [visible, open]);

  const scrollToTop = () => {
    close(false);
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  const panelMotion = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.12 },
      }
    : {
        // Grows out of the pill it is anchored to, never from nothing.
        initial: { opacity: 0, scale: 0.95, y: 4 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: 4 },
        transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] as const },
      };

  return (
    <div className="nav-dock">
      <AnimatePresence>
        {visible && (
          <motion.div
            className="nav-dock-anchor"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: shouldReduceMotion ? 0.12 : 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <AnimatePresence>
              {open && (
                <motion.div
                  ref={panelRef}
                  id="nav-dock-panel"
                  className="nav-dock-panel"
                  {...panelMotion}
                >
                  <PenBox tall className="nav-dock-outline" />
                  <ul className="nav-dock-list">
                    {NAV_ITEMS.map((item) => {
                      const isBlog = item.route !== undefined;
                      const current = isBlog
                        ? segment === "blog"
                        : isHome
                          ? activeSection === item.id
                          : segment === "projects" && item.id === "work";
                      const Doodle = item.id ? DOODLES[item.id] : null;
                      const label = (
                        <>
                          <span className="nav-dock-label">
                            {item.label}
                            <Underline className="nav-dock-underline" />
                          </span>
                          {isBlog ? (
                            <OutArrowIcon className="nav-dock-icon" />
                          ) : (
                            Doodle && <Doodle className="nav-dock-icon" />
                          )}
                        </>
                      );

                      return (
                        <li key={item.label}>
                          {isBlog ? (
                            <Link
                              href={item.route!}
                              onClick={() => close(false)}
                              aria-current={current ? "page" : undefined}
                            >
                              {label}
                            </Link>
                          ) : (
                            <a
                              href={isHome ? `#${item.id}` : `${SITE_URL}/#${item.id}`}
                              onClick={() => close(false)}
                              aria-current={current ? "true" : undefined}
                            >
                              {label}
                            </a>
                          )}
                        </li>
                      );
                    })}
                    <li className="nav-dock-top">
                      <svg className="nav-dock-divider" viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden="true">
                        <path className="ink-line" vectorEffect="non-scaling-stroke" d="M2 2.3c22-1 47 .6 70-.4 9-.3 17 0 26-.3" />
                      </svg>
                      <button type="button" onClick={scrollToTop}>
                        <span className="nav-dock-label">
                          Back to top
                          <Underline className="nav-dock-underline" />
                        </span>
                        <UpArrowIcon className="nav-dock-icon" />
                      </button>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              ref={triggerRef}
              type="button"
              className="nav-dock-trigger"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="nav-dock-panel"
            >
              <PenBox className="nav-dock-outline" />
              {CurrentDoodle && <CurrentDoodle key={activeSection} className="nav-dock-here" />}
              <span className="nav-dock-here-label" key={hereLabel}>
                {hereLabel !== "Index" && <span className="visually-hidden">Index, now at </span>}
                {hereLabel}
              </span>
              <ChevronIcon className="nav-dock-chevron" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavDock;
