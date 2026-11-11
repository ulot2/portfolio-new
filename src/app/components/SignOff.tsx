"use client";

import { useEffect, useRef } from "react";
import { Signature } from "./ink";

/** The signature at the foot of an article. It signs itself when the reader gets there. */
export const SignOff = () => {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.setAttribute("data-seen", "");
        seen.disconnect();
      },
      { threshold: 0.8 },
    );
    seen.observe(el);
    return () => seen.disconnect();
  }, []);

  return (
    <p className="ar-sign" ref={ref}>
      <span className="visually-hidden">Tolu</span>
      <Signature className="ar-signature" />
    </p>
  );
};

export default SignOff;
