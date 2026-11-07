"use client";

import { useEffect, useId, useRef, useState } from "react";
import { DownloadIcon, MenuIcon, PanelFrame } from "./ink";

/**
 * On phones the header keeps only the theme switch in view. Everything else
 * lives in this hand-drawn dropdown.
 */
export const MobileMenu = ({ links }: { links: { label: string; href: string }[] }) => {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="mm" ref={root} data-open={open || undefined}>
      <button
        type="button"
        className="mm-button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        <MenuIcon className="mm-icon" />
      </button>

      <div className="mm-panel" id={panelId} hidden={!open}>
        <PanelFrame className="mm-frame" />
        <ul className="mm-list">
          {links.map((link, i) => (
            <li key={link.label} style={{ "--i": i } as React.CSSProperties}>
              <a href={link.href} onClick={close}>
                {link.label}
              </a>
            </li>
          ))}
          <li style={{ "--i": links.length } as React.CSSProperties}>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" onClick={close}>
              Resume
              <DownloadIcon className="mm-item-icon" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MobileMenu;
