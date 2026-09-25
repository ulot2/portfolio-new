"use client";

import React, { useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";

const EMAIL = "tolu.nuell@gmail.com";

const contactLinks = [
  { label: "Resume", href: "/resume.pdf" },
  { label: "GitHub", href: "https://github.com/ulot2" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/toluwalope-adegoke-b441b9380",
  },
  { label: "X", href: "https://x.com/Tolu_dev" },
];

export const Contact = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section className="section contact-section" id="contact">
      <div className="section-label fade-up delay-1">
        <span className="number">04</span>
        <span className="label">Contact</span>
        <span className="line" aria-hidden="true" />
      </div>

      <div className="contact-container fade-up">
        <h2 className="contact-title">
          Turning “What If”
          <br />
          into “What’s Next”
        </h2>
        <p className="contact-intro">
          You have the concept. I have the stack. Let’s ship it together.
        </p>

        <div className="contact-email-row">
          <a href={`mailto:${EMAIL}`} className="main-email-link contact-email">
            {EMAIL}
          </a>
          <button
            type="button"
            onClick={handleCopyEmail}
            className="contact-copy-btn"
            aria-label={copied ? "Email copied" : "Copy email"}
            title={copied ? "Copied" : "Copy email"}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

        <ul className="contact-links">
          {contactLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
                <ArrowUpRight size={13} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <footer className="site-footer fade-up delay-3">
        <p>
          &copy; {new Date().getFullYear()} Toluwalope Adegoke. Built with Next.js &amp; TypeScript.
        </p>
      </footer>
    </section>
  );
};

export default Contact;
