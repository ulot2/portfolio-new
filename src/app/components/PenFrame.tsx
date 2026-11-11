"use client";

import { useEffect, useRef, useState } from "react";

/** One decimal place is plenty for a pen line. */
const n = (v: number) => Math.round(v * 10) / 10;

/**
 * A hand-drawn box around its parent (which needs position: relative), drawn
 * at the parent's real size. A stretched drawing would pull its corners out of
 * shape on a tall, narrow box; this keeps the corners and the wobble the same
 * size at any width. The pen starts a little into the top edge and overshoots
 * where it began, as a hand would.
 */
export function PenFrame({ className, radius = 11 }: { className?: string; radius?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const box = ref.current?.parentElement;
    if (!box) return;
    const measure = () => setSize({ w: box.offsetWidth, h: box.offsetHeight });
    measure();
    const watch = new ResizeObserver(measure);
    watch.observe(box);
    return () => watch.disconnect();
  }, []);

  let d = "";
  if (size) {
    const { w, h } = size;
    const i = 1.5; // keeps the stroke inside the box
    const r = Math.min(radius, w / 4, h / 4);
    d = [
      `M${n(r + i + 14)} ${n(i + 1.1)}`,
      `Q${n(w * 0.55)} ${n(i - 1)} ${n(w - r - i)} ${n(i + 0.4)}`,
      `Q${n(w - i)} ${n(i + 0.2)} ${n(w - i + 0.3)} ${n(r + i)}`,
      `Q${n(w - i + 1)} ${n(h * 0.5)} ${n(w - i - 0.4)} ${n(h - r - i)}`,
      `Q${n(w - i - 0.2)} ${n(h - i)} ${n(w - r - i)} ${n(h - i - 0.3)}`,
      `Q${n(w * 0.45)} ${n(h - i + 1)} ${n(r + i)} ${n(h - i)}`,
      `Q${n(i)} ${n(h - i)} ${n(i + 0.4)} ${n(h - r - i)}`,
      `Q${n(i - 0.8)} ${n(h * 0.5)} ${n(i + 0.2)} ${n(r + i)}`,
      `Q${n(i)} ${n(i + 0.6)} ${n(r + i)} ${n(i + 0.6)}`,
      `L${n(r + i + 26)} ${n(i + 0.2)}`,
    ].join("");
  }

  return (
    <svg
      ref={ref}
      className={className}
      width={size?.w}
      height={size?.h}
      viewBox={size ? `0 0 ${size.w} ${size.h}` : undefined}
      fill="none"
      aria-hidden="true"
    >
      {d && <path className="ink-line" d={d} />}
    </svg>
  );
}

export default PenFrame;
