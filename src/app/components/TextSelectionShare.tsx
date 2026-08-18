"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Twitter, Check, Copy } from "lucide-react";

interface TextSelectionShareProps {
  articleTitle: string;
}

export const TextSelectionShare = ({ articleTitle }: TextSelectionShareProps) => {
  const [selectedText, setSelectedText] = useState("");
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const handleSelection = useCallback(() => {
    const selection = window.getSelection();

    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      setPosition(null);
      setSelectedText("");
      return;
    }

    const text = selection.toString().trim();
    if (text.length < 5) {
      setPosition(null);
      setSelectedText("");
      return;
    }

    // Check if selection is within the article prose
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const isInsideArticle =
      container.nodeType === Node.ELEMENT_NODE
        ? (container as Element).closest(".blog-prose")
        : container.parentElement?.closest(".blog-prose");

    if (!isInsideArticle) {
      setPosition(null);
      setSelectedText("");
      return;
    }

    const rect = range.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;

    setSelectedText(text);
    setPosition({
      top: rect.top + scrollY - 46, // 46px above the highlighted text
      left: rect.left + scrollX + rect.width / 2,
    });
  }, []);

  useEffect(() => {
    const onMouseUp = () => {
      // Small timeout to allow browser selection to settle
      setTimeout(handleSelection, 10);
    };

    const onSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setPosition(null);
        setSelectedText("");
      }
    };

    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchend", onMouseUp);
    document.addEventListener("selectionchange", onSelectionChange);

    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchend", onMouseUp);
      document.removeEventListener("selectionchange", onSelectionChange);
    };
  }, [handleSelection]);

  const handleShareToTwitter = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const cleanQuote =
      selectedText.length > 180
        ? `"${selectedText.slice(0, 175)}..."`
        : `"${selectedText}"`;

    const url = typeof window !== "undefined" ? window.location.href : "";
    const tweetText = `${cleanQuote}\n\n— from "${articleTitle}" by @Tolu_dev`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}&url=${encodeURIComponent(url)}`;

    window.open(tweetUrl, "_blank", "noopener,noreferrer,width=550,height=420");
  };

  const handleCopyQuote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";
      const textToCopy = `"${selectedText}"\n\n— Toluwalope Adegoke (${url})`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setPosition(null);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy quote:", err);
    }
  };

  if (!position || !selectedText) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={toolbarRef}
        className="floating-selection-toolbar"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
        initial={{ opacity: 0, y: 6, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 4, scale: 0.94 }}
        transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleShareToTwitter}
          className="toolbar-btn twitter-action"
          title="Share highlighted quote on X"
        >
          <Twitter size={13} />
          <span>Post quote</span>
        </button>

        <span className="toolbar-divider" />

        <button
          type="button"
          onClick={handleCopyQuote}
          className="toolbar-btn copy-action"
          title="Copy quote with attribution"
        >
          {copied ? (
            <>
              <Check size={13} className="check-icon" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy</span>
            </>
          )}
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default TextSelectionShare;
