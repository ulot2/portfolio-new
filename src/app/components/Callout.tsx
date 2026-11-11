import React from "react";
import { BulbIcon, InfoIcon, MarginLine, QuoteIcon, WarningIcon } from "./ink";

interface CalloutProps {
  type?: "info" | "tip" | "warning" | "quote";
  title?: string;
  children: React.ReactNode;
}

const ICONS = { info: InfoIcon, tip: BulbIcon, warning: WarningIcon, quote: QuoteIcon };

/** An aside in the margin of an article, marked with a pen stroke and a small doodle. */
export const Callout = ({ type = "info", title, children }: CalloutProps) => {
  const Icon = ICONS[type] ?? InfoIcon;

  return (
    <aside className={`callout-box callout-${type}`}>
      <MarginLine className="prose-margin-line" />
      <div className="callout-header">
        <Icon className="callout-icon" />
        {title && <span className="callout-title">{title}</span>}
      </div>
      <div className="callout-body">{children}</div>
    </aside>
  );
};

export default Callout;
