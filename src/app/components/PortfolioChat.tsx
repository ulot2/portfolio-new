"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Send, Sparkles, Trash2, ChevronDown, Terminal, Bot } from "lucide-react";

const GLYPHS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~#%*@?!";

const SUGGESTIONS = [
  "Tell me about SoloStack",
  "What is Tolu's tech stack?",
  "What did Tolu do at FireSwitch?",
  "How does PostFlow work?",
];

function ScrambleText({ text = "thinking..." }: { text?: string }) {
  const [displayText, setDisplayText] = useState("");
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayText(text);
      return;
    }

    let frame = 0;
    const intervalId = setInterval(() => {
      frame++;
      const scrambled = text
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";
          if (index < Math.floor(frame / 2)) return char;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");

      setDisplayText(scrambled);

      if (frame > text.length * 3) {
        frame = 0;
      }
    }, 45);

    return () => clearInterval(intervalId);
  }, [text, shouldReduceMotion]);

  return <span className="scramble-text-mono">{displayText || text}</span>;
}

export function PortfolioChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { messages, sendMessage, status, setMessages } = useChat({
    api: "/api/chat",
  } as any);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, status]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || status === "submitted" || status === "streaming")
      return;
    setIsOpen(true);
    const text = input.trim();
    setInput("");
    sendMessage({ text });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const clearChat = () => {
    setMessages([]);
  };

  const isThinking =
    status === "submitted" || (status === "streaming" && messages.length === 0);
  const isActive = isThinking || status === "streaming";

  const getMessageContent = (m: any) => {
    if (typeof m.content === "string" && m.content) return m.content;
    if (Array.isArray(m.parts)) {
      return m.parts
        .filter((p: any) => p.type === "text")
        .map((p: any) => p.text)
        .join("");
    }
    return "";
  };

  return (
    <div
      className="portfolio-chat-dock"
      aria-label="Chat with Tolu's Portfolio AI"
    >
      <div className="portfolio-chat-container">
        {/* Option C: Top Accent Edge Beam while thinking or streaming */}
        {isActive && <div className="chat-edge-beam" />}

        {/* Expanded Chat Messages Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="portfolio-chat-panel"
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: 16, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 12, scale: 0.98 }
              }
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
            >
              {/* Header */}
              <div className="portfolio-chat-header">
                <div className="portfolio-chat-title">
                  <Terminal className="icon-terminal" size={15} />
                  <span>Tolu's AI Assistant</span>
                  <span className="online-badge" />
                </div>
                <div className="portfolio-chat-actions">
                  {messages.length > 0 && (
                    <button
                      type="button"
                      onClick={clearChat}
                      className="portfolio-chat-icon-btn"
                      title="Clear conversation"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="portfolio-chat-icon-btn"
                    title="Minimize chat"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>

              {/* Message History */}
              <div className="portfolio-chat-body">
                {messages.length === 0 ? (
                  <div className="portfolio-chat-empty">
                    <p className="empty-title">Ask me anything about Tolu</p>
                    <p className="empty-sub">
                      Click a suggestion below or type your own question:
                    </p>
                    <div className="chat-suggestions-grid">
                      {SUGGESTIONS.map((suggestion, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="suggestion-chip"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((m: any) => (
                    <motion.div
                      key={m.id}
                      className={`portfolio-chat-msg ${
                        m.role === "user" ? "msg-user" : "msg-assistant"
                      }`}
                      initial={
                        shouldReduceMotion ? false : { opacity: 0, y: 6 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <div className="msg-content">
                        <span className="msg-role">
                          {m.role === "user" ? "You" : "Tolu's AI"}
                        </span>
                        <p>{getMessageContent(m)}</p>
                      </div>
                    </motion.div>
                  ))
                )}

                {/* Thinking / Scramble State Indicator */}
                {isThinking && (
                  <motion.div
                    className="portfolio-chat-msg msg-assistant"
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="msg-content thinking">
                      <span className="msg-role">Tolu's AI</span>
                      <div className="scramble-thinking">
                        <ScrambleText text="thinking..." />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Input Form */}
        <form onSubmit={handleFormSubmit} className="portfolio-chat-form">
          {!isOpen && (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="portfolio-chat-toggle-btn"
              title="Expand Chat"
            >
              <Bot size={15} />
            </button>
          )}

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI about Tolu's projects or experience..."
            className="portfolio-chat-input"
            onFocus={() => setIsOpen(true)}
          />

          <button
            type="submit"
            disabled={
              !input.trim() || status === "submitted" || status === "streaming"
            }
            className="portfolio-chat-send-btn"
            title="Send message"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
