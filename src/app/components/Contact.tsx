"use client";

import React, { useState } from "react";
import { LuCopy, LuCheck } from "react-icons/lu";
import { ArrowUpRight } from "lucide-react";

const contactLinks = [
  {
    platform: "Resume / CV",
    handle: "View Document",
    href: "/resume.pdf",
  },
  {
    platform: "GitHub",
    handle: "@ulot2",
    href: "https://github.com/ulot2",
  },
  {
    platform: "LinkedIn",
    handle: "Toluwalope Adegoke",
    href: "https://www.linkedin.com/in/toluwalope-adegoke-b441b9380",
  },
  {
    platform: "X (Twitter)",
    handle: "@Tolu_dev",
    href: "https://x.com/Tolu_dev",
  },
];

export const Contact = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("tolu.nuell@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="section contact-section" id="contact">
      <div className="section-label fade-up delay-1">
        <span className="label">Contact</span>
      </div>

      <div className="contact-container">
        <div className="contact-header fade-up">
          <h2 className="contact-title">Let&apos;s build something together.</h2>
          <p className="contact-intro">
            Open to full-time frontend roles, contract work, and creative collaborations. Feel free to reach out:
          </p>

          {/* Simple Email Bar */}
          <div className="simple-email-row">
            <a href="mailto:tolu.nuell@gmail.com" className="main-email-link">
              tolu.nuell@gmail.com
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="simple-copy-btn"
              title="Copy email to clipboard"
            >
              {copied ? (
                <span className="copied-text">
                  <LuCheck size={13} /> Copied
                </span>
              ) : (
                <span className="copy-text">
                  <LuCopy size={13} /> Copy
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Minimal Social Links & Resume Grid */}
        <div className="contact-simple-list fade-up delay-2">
          {contactLinks.map((link) => (
            <a
              key={link.platform}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-row-item"
            >
              <div className="contact-row-left">
                <span className="contact-row-platform">{link.platform}</span>
                <span className="contact-row-handle">{link.handle}</span>
              </div>
              <ArrowUpRight size={15} className="contact-row-arrow" />
            </a>
          ))}
        </div>

        {/* Footer info */}
        <footer className="site-footer fade-up delay-3">
          <p>
            &copy; {new Date().getFullYear()} Toluwalope Adegoke. Built with Next.js &amp; TypeScript.
          </p>
        </footer>
      </div>
    </section>
  );
};

export default Contact;
