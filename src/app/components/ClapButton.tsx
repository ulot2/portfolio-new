"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ClapButtonProps {
  slug: string;
}

interface FloatingSpark {
  id: number;
  x: number;
}

const MAX_USER_CLAPS = 50;

export const ClapButton = ({ slug }: ClapButtonProps) => {
  const [totalClaps, setTotalClaps] = useState<number>(0);
  const [userClaps, setUserClaps] = useState<number>(0);
  const [sparks, setSparks] = useState<FloatingSpark[]>([]);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const pendingIncrement = useRef<number>(0);

  // Fetch initial claps on mount
  useEffect(() => {
    const localUserClaps = parseInt(
      localStorage.getItem(`user_claps_${slug}`) || "0",
      10
    );
    setUserClaps(localUserClaps);

    fetch(`/api/claps?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.claps === "number") {
          setTotalClaps(data.claps);
        }
      })
      .catch((err) => console.error("Error fetching claps:", err));
  }, [slug]);

  // Sync batch increments to server
  const sendClapsToServer = (count: number) => {
    fetch("/api/claps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, increment: count }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.claps === "number") {
          setTotalClaps(data.claps);
        }
      })
      .catch((err) => console.error("Error sending claps:", err));
  };

  const handleClap = () => {
    if (userClaps >= MAX_USER_CLAPS) return;

    const nextUserClaps = userClaps + 1;
    setUserClaps(nextUserClaps);
    setTotalClaps((prev) => prev + 1);
    localStorage.setItem(`user_claps_${slug}`, String(nextUserClaps));

    // Spawn subtle floating spark
    const randomOffset = (Math.random() - 0.5) * 24;
    const sparkId = Date.now() + Math.random();
    setSparks((prev) => [
      ...prev.slice(-6),
      { id: sparkId, x: randomOffset },
    ]);

    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => s.id !== sparkId));
    }, 900);

    // Debounce server update
    pendingIncrement.current += 1;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (pendingIncrement.current > 0) {
        sendClapsToServer(pendingIncrement.current);
        pendingIncrement.current = 0;
      }
    }, 600);
  };

  const hasClapped = userClaps > 0;
  const isMaxed = userClaps >= MAX_USER_CLAPS;

  return (
    <div className="clap-section">
      <div className="clap-container">
        {/* Floating Sparks */}
        <AnimatePresence>
          {sparks.map((spark) => (
            <motion.div
              key={spark.id}
              className="floating-clap-spark"
              initial={{ opacity: 1, y: 0, scale: 0.85, x: spark.x }}
              animate={{
                opacity: 0,
                y: -42,
                scale: 1.05,
                x: spark.x * 1.2,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <span>+1</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Minimalist Single-Line Pill Button */}
        <motion.button
          type="button"
          onClick={handleClap}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`clap-btn ${hasClapped ? "clapped" : ""} ${isMaxed ? "maxed" : ""}`}
          aria-label="Applaud this article"
          title={isMaxed ? "Maximum 50 claps reached" : "Click to applaud"}
        >
          <span className="clap-emoji">👏</span>
          <span className="clap-count">
            {totalClaps > 0 ? totalClaps : "Applaud"}
          </span>
        </motion.button>
      </div>
    </div>
  );
};

export default ClapButton;
