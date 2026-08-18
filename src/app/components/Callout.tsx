import React from "react";
import { Info, Lightbulb, AlertTriangle, Quote } from "lucide-react";

interface CalloutProps {
  type?: "info" | "tip" | "warning" | "quote";
  title?: string;
  children: React.ReactNode;
}

export const Callout = ({ type = "info", title, children }: CalloutProps) => {
  const getIcon = () => {
    switch (type) {
      case "tip":
        return <Lightbulb className="callout-icon tip" size={18} />;
      case "warning":
        return <AlertTriangle className="callout-icon warning" size={18} />;
      case "quote":
        return <Quote className="callout-icon quote" size={18} />;
      case "info":
      default:
        return <Info className="callout-icon info" size={18} />;
    }
  };

  return (
    <aside className={`callout-box callout-${type}`}>
      <div className="callout-header">
        {getIcon()}
        {title && <span className="callout-title">{title}</span>}
      </div>
      <div className="callout-body">{children}</div>
    </aside>
  );
};

export default Callout;
