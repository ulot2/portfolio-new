"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";

const SECTION_LINKS = [
  { id: "work", label: "Work" },
  { id: "writing", label: "Writing" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

// Below this scroll offset the header always shows — hiding it over the hero
// makes the first paint feel jumpy.
const HIDE_THRESHOLD = 120;

export const SiteHeader = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const shouldReduceMotion = useReducedMotion();

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (shouldReduceMotion) return;
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > HIDE_THRESHOLD);
  });

  // Scroll-spy: mark the section currently in view as aria-current.
  useEffect(() => {
    if (!isHome) {
      setActiveSection(null);
      return;
    }

    const elements = SECTION_LINKS.map(({ id }) =>
      document.getElementById(id),
    ).filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome]);

  // Hash links only resolve in-page on the home route; elsewhere they need to
  // navigate home first.
  const sectionHref = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <motion.header
      className="site-header"
      initial={false}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.3, ease: [0.23, 1, 0.32, 1] }
      }
    >
      <nav className="site-header-inner" aria-label="Main">
        <Link href="/" className="site-header-brand">
          <span className="site-header-name">Toluwalope Adegoke</span>
          <span className="site-header-monogram" aria-hidden="true">
            TA
          </span>
        </Link>

        <ul className="site-header-links">
          {SECTION_LINKS.map(({ id, label }) => (
            <li key={id} className="site-header-section-link">
              <a
                href={sectionHref(id)}
                aria-current={activeSection === id ? "true" : undefined}
              >
                {label}
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/blog"
              aria-current={pathname.startsWith("/blog") ? "page" : undefined}
            >
              Blog
            </Link>
          </li>
        </ul>
      </nav>
    </motion.header>
  );
};

export default SiteHeader;
