"use client";

import React, { useRef, useEffect } from "react";
import FlickerText from "./FlickerText";
import DynamicWeight from "./DynamicWeight";
import StackMarquee from "./StackMarquee";
import { ArrowUpRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

interface MagneticWrapperProps {
  children: React.ReactNode;
  maxDistance?: number;
  strength?: number;
  className?: string;
  style?: React.CSSProperties;
}

const MagneticWrapper = ({
  children,
  maxDistance = 130,
  strength = 5,
  className,
  style,
}: MagneticWrapperProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = React.useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Tuned Apple-style physical spring parameters for smooth magnetic pull
  const springX = useSpring(x, { stiffness: 220, damping: 22 });
  const springY = useSpring(y, { stiffness: 220, damping: 22 });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        typeof window !== "undefined" &&
          window.matchMedia("(pointer: coarse), (max-width: 768px)").matches
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion || isMobile) return;

    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < maxDistance) {
        const factor = 1 - distance / maxDistance;
        x.set((distanceX / maxDistance) * strength * factor);
        y.set((distanceY / maxDistance) * strength * factor);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [maxDistance, strength, shouldReduceMotion, isMobile, x, y]);

  if (shouldReduceMotion || isMobile) {
    return <div className={className} style={{ width: "100%", maxWidth: "100%", ...style }}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        x: springX,
        y: springY,
        display: "block",
        width: "100%",
        maxWidth: "100%",
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
};

export const Hero = () => {
  return (
    <section className="hero" id="hero">
      <div className="hero-container">
        {/* Name with subtle magnetic spring pull */}
        <MagneticWrapper strength={6} maxDistance={140}>
          <DynamicWeight
            tag="h1"
            text="Toluwalope Adegoke"
            className="hero-title fade-up delay-1"
            fromWeight={400}
            toWeight={800}
            strength={40}
          />
        </MagneticWrapper>

        {/* Tagline with subtle magnetic spring pull */}
        <MagneticWrapper strength={4} maxDistance={120}>
          <FlickerText
            tag="p"
            text="Software Engineer"
            className="hero-tagline fade-up delay-2"
            fontColor="var(--accent)"
            loop={true}
            loopDelay={1.5}
            flicker={{
              strokeColor: "var(--accent)",
              showStroke: false,
              wordFlickerEnabled: false,
              letterFlickerEnabled: true,
              letterFlickerMode: "opacity",
              letterFlickerOpacity: 30,
              letterFlickerIntensity: 5,
              flickerCount: 5,
              ease: { type: "tween", duration: 3.5, ease: "easeInOut" },
            }}
          />
        </MagneticWrapper>

        {/* Availability badge with subtle magnetic spring pull */}
        <MagneticWrapper strength={5} maxDistance={110}>
          <div className="fade-up delay-3">
            <span
              className="availability"
              title="Available for full-time roles & contract projects"
            >
              <span className="availability-dot" />
              <span>Open to Work</span>
            </span>
          </div>
        </MagneticWrapper>

        {/* Currently Building block - responsive inline block sentence */}
        <MagneticWrapper strength={5} maxDistance={130}>
          <div className="hero-building-tag fade-up delay-4">
            <span className="building-label">Currently Building</span>{" "}
            <motion.a
              href="https://www.solostack.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="building-link"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              SoloStack
              <motion.span
                style={{ display: "inline-block", marginLeft: "2px" }}
                whileHover={{ x: 2, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <ArrowUpRight size={14} className="link-arrow" />
              </motion.span>
            </motion.a>{" "}
            <span className="building-desc">
              a business management platform for African freelancers.
            </span>
          </div>
        </MagneticWrapper>

        <StackMarquee />
      </div>
    </section>
  );
};

export default Hero;
