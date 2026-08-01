"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { LuGithub, LuLinkedin, LuMail, LuCopy, LuCheck } from "react-icons/lu";
import { FaXTwitter } from "react-icons/fa6";
import { ArrowUpRight } from "lucide-react";

const contactLinks = [
  {
    platform: "Email",
    handle: "tolu.nuell@gmail.com",
    href: "mailto:tolu.nuell@gmail.com",
    icon: <LuMail size={18} />,
  },
  {
    platform: "GitHub",
    handle: "@ulot2",
    href: "https://github.com/ulot2",
    icon: <LuGithub size={18} />,
  },
  {
    platform: "LinkedIn",
    handle: "Toluwalope Adegoke",
    href: "https://www.linkedin.com/in/toluwalope-adegoke-b441b9380",
    icon: <LuLinkedin size={18} />,
  },
  {
    platform: "X (Twitter)",
    handle: "@Tolu_dev",
    href: "https://x.com/Tolu_dev",
    icon: <FaXTwitter size={17} />,
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
      <div className="section-label">
        <span className="label">Contact</span>
      </div>

      <div className="contact-container">
        <div className="contact-header fade-up">
          <h2 className="contact-title">Let&apos;s build something together.</h2>
          <p className="contact-intro">
            Currently open to full-time frontend roles, contract opportunities, and creative collaborations. Feel free to reach out directly:
          </p>

          {/* Quick Copy Email Action */}
          <div className="email-copy-bar">
            <a href="mailto:tolu.nuell@gmail.com" className="email-link">
              <LuMail size={16} className="text-accent" />
              <span>tolu.nuell@gmail.com</span>
            </a>
            <motion.button
              onClick={handleCopyEmail}
              className="copy-btn"
              title="Copy email to clipboard"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
            >
              {copied ? (
                <>
                  <LuCheck size={14} className="text-green" />
                  <span className="text-green">Copied!</span>
                </>
              ) : (
                <>
                  <LuCopy size={14} />
                  <span>Copy</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Social & Platform Link Grid */}
        <div className="contact-grid fade-up delay-2">
          {contactLinks.map((link) => (
            <motion.a
              key={link.platform}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="contact-card-left">
                <span className="contact-icon">{link.icon}</span>
                <div className="contact-info">
                  <span className="contact-platform">{link.platform}</span>
                  <span className="contact-handle">{link.handle}</span>
                </div>
              </div>
              <ArrowUpRight size={16} className="contact-arrow" />
            </motion.a>
          ))}
        </div>

        {/* Footer info */}
        <footer className="site-footer fade-up delay-3">
          <p>
            &copy; {new Date().getFullYear()} Toluwalope Adegoke. Built with Next.js, TypeScript & Tailwind CSS.
          </p>
        </footer>
      </div>
    </section>
  );
};

export default Contact;
