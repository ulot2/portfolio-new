"use client";

import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";

interface ViewCounterProps {
  slug: string;
  trackView?: boolean;
}

export const ViewCounter = ({ slug, trackView = true }: ViewCounterProps) => {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    // If trackView is enabled and haven't tracked in this session yet
    const sessionKey = `viewed_${slug}`;
    const alreadyViewed = sessionStorage.getItem(sessionKey);

    if (trackView && !alreadyViewed) {
      fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (typeof data.views === "number") {
            setViews(data.views);
            sessionStorage.setItem(sessionKey, "true");
          }
        })
        .catch((err) => console.error("Error tracking view:", err));
    } else {
      // Just fetch view count without incrementing
      fetch(`/api/views?slug=${encodeURIComponent(slug)}`)
        .then((res) => res.json())
        .then((data) => {
          if (typeof data.views === "number") {
            setViews(data.views);
          }
        })
        .catch((err) => console.error("Error fetching views:", err));
    }
  }, [slug, trackView]);

  if (views === null) {
    return (
      <span className="view-counter-badge loading">
        <span className="live-read-pulse" />
        <Eye size={12} className="meta-icon" />
        <span>...</span>
      </span>
    );
  }

  const formatViews = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return String(num);
  };

  return (
    <span className="view-counter-badge" title="Live read count">
      <span className="live-read-pulse" />
      <Eye size={12} className="meta-icon" />
      <span>
        {formatViews(views)} {views === 1 ? "read" : "reads"}
      </span>
    </span>
  );
};

export default ViewCounter;
