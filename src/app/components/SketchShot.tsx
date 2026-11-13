import Image from "next/image";
import type React from "react";
import type { Project } from "@/data/projects";

const BOX =
  "M12 3.5C60 2 140 2.6 190 3.4c5 .2 6.6 3 6.8 12 .5 30 .2 70-.3 95-.2 8-2.5 10.6-9.3 10.8-55 1.2-120 1.4-172 .3C7 121.3 3.8 118 3.6 110 3 80 3.2 40 3.5 14 3.6 6.5 6 3.8 12 3.5Z";
const RETRACE = "M7 6.5c28-2.4 60-2.6 86-2.1";

const host = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export const shotAlt = (p: Project) =>
  p.drawn ? `A drawing of ${p.title} in use, made from its real output` : `The ${p.title} home page`;

/**
 * A project's picture drawn in ink: a pen box around it, three pen dots and
 * the address on top. Flat, no tilt, no shadow. A drawn picture gets no
 * address, since it is not a page anyone can visit. `i` staggers the draw-in.
 */
export function SketchShot({
  project,
  sizes,
  i,
  className = "",
}: {
  project: Project;
  sizes: string;
  i?: number;
  className?: string;
}) {
  const url = !project.drawn && project.liveUrl.startsWith("http") ? host(project.liveUrl) : null;
  return (
    // Without `i`, the stagger comes from the parent's --i.
    <div className={`sk ${className}`} style={i === undefined ? undefined : ({ "--i": Math.min(i, 6) } as React.CSSProperties)}>
      <svg className="sk-box" viewBox="0 0 200 125" preserveAspectRatio="none" aria-hidden="true">
        <path className="ink-line" pathLength={1} d={BOX} />
        <path className="ink-line sk-retrace" pathLength={1} d={RETRACE} />
      </svg>
      <div className="sk-bar" aria-hidden="true">
        <svg viewBox="0 0 34 8" className="sk-dots">
          <path className="ink-line" d="M4 4.2a2.4 2.4 0 1 1-.1-.1M16 3.8a2.4 2.4 0 1 1 .1.1M28 4.1a2.4 2.4 0 1 1-.1-.2" />
        </svg>
        {url && <span>{url}</span>}
      </div>
      <Image src={project.image} alt={shotAlt(project)} width={1440} height={900} sizes={sizes} />
    </div>
  );
}

export default SketchShot;
