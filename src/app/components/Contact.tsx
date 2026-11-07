"use client";

import { useState } from "react";
import {
  BriefcaseIcon,
  BulbIcon,
  CopyIcon,
  DownloadIcon,
  NameMark,
  OutArrowIcon,
  TickIcon,
  Underline,
  UpArrowIcon,
  WaveIcon,
} from "./ink";
import { SectionHeading } from "./SectionHeading";

const EMAIL = "tolu.nuell@gmail.com";

const mailto = (subject: string, body: string) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

// Each reason opens the visitor's mail app with the email already started.
const REASONS = [
  {
    label: "I'm hiring",
    Icon: BriefcaseIcon,
    href: mailto(
      "Let's talk about a role",
      "Hi Tolu,\n\nI'm hiring for a role I think you'd be a good fit for. Here's the team and what we're building:\n\n",
    ),
  },
  {
    label: "I have a project",
    Icon: BulbIcon,
    href: mailto(
      "A project idea",
      "Hi Tolu,\n\nI have a project I'd like your help with. Here's the idea:\n\n",
    ),
  },
  {
    label: "Just saying hi",
    Icon: WaveIcon,
    href: mailto("Hello", "Hi Tolu,\n\n"),
  },
];

const LINKS = [
  { label: "GitHub", href: "https://github.com/ulot2" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/toluwalope-adegoke-b441b9380" },
  { label: "X", href: "https://x.com/Tolu_dev" },
];

export const Contact = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section className="section ct" id="contact">
      <SectionHeading word="contact" label="Contact" />

      <p className="ct-intro">Why are you reaching out?</p>

      <ul className="ct-reasons">
        {REASONS.map(({ label, Icon, href }) => (
          <li key={label}>
            <a className="ct-reason" href={href}>
              <Icon className="ct-reason-icon" />
              <span className="ct-reason-label">
                {label}
                <Underline className="ct-reason-underline" />
              </span>
              <OutArrowIcon className="ct-reason-out" />
            </a>
          </li>
        ))}
      </ul>

      <div className="ct-email-row">
        <span className="ct-or">or write it yourself:</span>
        <a className="ct-email" href={`mailto:${EMAIL}`}>
          {EMAIL}
        </a>
        <button
          type="button"
          className="ct-copy"
          onClick={copyEmail}
          aria-label={copied ? "Email copied" : "Copy email"}
        >
          {copied ? <TickIcon className="ct-copy-icon ct-tick" /> : <CopyIcon className="ct-copy-icon" />}
        </button>
        <span className="visually-hidden" aria-live="polite">
          {copied ? "Email copied" : ""}
        </span>
      </div>

      <ul className="ct-links">
        <li>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
            Resume
            <DownloadIcon className="ct-link-icon" />
          </a>
        </li>
        {LINKS.map((link) => (
          <li key={link.label}>
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label}
              <OutArrowIcon className="ct-link-icon" />
            </a>
          </li>
        ))}
      </ul>

      <footer className="ft">
        <div className="ft-row">
          <NameMark className="ft-mark" />
          <a className="ft-top" href="#main">
            Back to top
            <UpArrowIcon className="ft-top-icon" />
          </a>
        </div>
        <p className="ft-small">
          &copy; {new Date().getFullYear()} Toluwalope Adegoke · Built with Next.js &amp; TypeScript
        </p>
      </footer>
    </section>
  );
};

export default Contact;
