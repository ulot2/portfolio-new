"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "@/styles/NavBar.css";
import { IoIosMenu } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { ThemeToggle } from "../ui/ThemeToggle";
import { div } from "framer-motion/client";

const navItems = [
  { name: "About", href: "about" },
  { name: "Projects", href: "projects" },
  { name: "Skills", href: "skills" },
  { name: "Contact", href: "contact" },
];

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLButtonElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }

    // Close mobile menu after clicking
    setIsMenuOpen(false);
  };

  // Handle logo click - scroll to top
  const handleLogoClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setIsMenuOpen(false);
  };

  // Track scroll position and active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);

      // Determine active section based on scroll position
      const sections = navItems.map((item) => item.href);
      let currentSection = "";

      // Check each section to see which one is currently in view
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const threshold = window.innerHeight * 0.3; // 30% of viewport

          if (rect.top <= threshold && rect.bottom >= threshold) {
            currentSection = sectionId;
            break;
          }
        }
      }

      // If we're at the very top, clear active section
      if (scrollPosition < 100) {
        currentSection = "";
      }

      setActiveSection(currentSection);
    };

    // Throttle scroll events for performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });

    // Initial call to set correct state
    handleScroll();

    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`nav ${isScrolled ? "nav-scrolled" : "nav-transparent"}`}
      >
        <div className="nav-container">
          <div className="nav-content">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="nav-logo"
              onClick={handleLogoClick}
            >
              TA
            </motion.div>
            <div className="nav-desktop">
              {navItems.map((item) => (
                <div key={item.name}>
                  <motion.button
                    onClick={(e) => handleSmoothScroll(e, item.href)}
                    className={`nav-item ${
                      activeSection === item.href
                        ? "nav-item-active"
                        : "nav-item-inactive"
                    }`}
                    // className="nav-item"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.name}
                  </motion.button>
                </div>
              ))}
              <ThemeToggle />
            </div>

            {/* mobile menu toggle */}
            <motion.button
              className="nav-mobile-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              <div className="nav-mobile-icon">
                <IoIosMenu
                  className={`icon ${
                    isMenuOpen ? "menu-hidden" : "menu-visible"
                  }`}
                />
                <IoCloseOutline
                  className={`icon ${
                    isMenuOpen ? "close-visible" : "close-hidden"
                  }`}
                />
              </div>
            </motion.button>

            {/* Mobile menu dropdown */}
            <motion.div
              className={`nav-mobile-menu ${isMenuOpen ? "open" : "closed"}`}
              initial={false}
              animate={isMenuOpen ? "open" : "closed"}
              variants={{
                open: { opacity: 1, maxHeight: 300, y: 0 },
                closed: { opacity: 0, maxHeight: 0, y: -10 },
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="nav-mobile-content">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.href}
                    onClick={(e) => handleSmoothScroll(e, item.href)}
                    className={`nav-mobile-link ${
                      activeSection === item.href ? "active" : ""
                    }`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    {item.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.nav>
      {/* Mobile-only theme toggle (fixed bottom-right via ThemeToggle.css) */}
      <div className="theme-toggle-mobile-wrapper">
        <ThemeToggle />
      </div>
    </>
  );
};
