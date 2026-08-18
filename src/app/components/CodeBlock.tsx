"use client";

import React, { useState } from "react";
import { LuCheck, LuCopy } from "react-icons/lu";

interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
  filename?: string;
}

export const CodeBlock = ({ children, className, filename }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  // Extract raw text from children
  const extractText = (node: React.ReactNode): string => {
    if (typeof node === "string") return node;
    if (typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(extractText).join("");
    if (React.isValidElement(node) && (node.props as { children?: React.ReactNode })?.children) {
      return extractText((node.props as { children?: React.ReactNode }).children);
    }
    return "";
  };

  const codeText = extractText(children).trim();

  // Extract language from className (e.g., 'language-typescript' -> 'typescript')
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : filename ? filename.split(".").pop() : "code";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-block-lang">{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="code-copy-btn"
          aria-label="Copy code to clipboard"
          title="Copy code"
        >
          {copied ? (
            <span className="copy-status copied">
              <LuCheck size={13} />
              <span>Copied!</span>
            </span>
          ) : (
            <span className="copy-status">
              <LuCopy size={13} />
              <span>Copy</span>
            </span>
          )}
        </button>
      </div>
      <div className="code-block-content">
        <pre className={className}>
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
