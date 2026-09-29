"use client";

import { useEffect, useState } from "react";
import { SEEN_KEY } from "../Shell";

/**
 * "New" on a grade that arrived after the last visit to Feedback. Child
 * effects run before the Shell's effect, so this reads the old visit time
 * before the Shell writes the new one.
 */
export default function NewTag({ gradedAt }: { gradedAt: string }) {
  const [isNew, setIsNew] = useState(false);
  useEffect(() => {
    try {
      setIsNew(gradedAt > (localStorage.getItem(SEEN_KEY) ?? ""));
    } catch {
      // storage blocked: show nothing
    }
  }, [gradedAt]);
  return isNew ? <span className="prep-new">New</span> : null;
}
