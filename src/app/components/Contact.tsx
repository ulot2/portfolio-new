"use client";

import { useState, type ReactNode } from "react";
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

/** `beforeFooter` lets the page put server-rendered content (the year line) above the footer. */
export const Contact = ({ beforeFooter }: { beforeFooter?: ReactNode }) => {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section className="section ct" id="contact" aria-labelledby="contact-title">
      <div className="ct-heading-row">
        <h2 className="ct-title" id="contact-title">
          Have a <span className="ct-title-mark">&ldquo;what if&rdquo;?<Underline className="ct-title-underline" /></span>
        </h2>
        <WaveIcon className="ct-wave" />
      </div>
      <p className="ct-intro">A project, a role, or a conversation.<br />Let&rsquo;s see where it goes.</p>

      <div className="ct-email-row">
        <a className="ct-email" href={`mailto:${EMAIL}`}>
          <span className="ct-email-address">{EMAIL}<Underline className="ct-email-underline" /></span>
          <OutArrowIcon className="ct-email-arrow" />
        </a>
        <button
          type="button"
          className="ct-copy"
          onClick={copyEmail}
          aria-label={copied ? "Email copied" : "Copy email"}
          title={copied ? "Copied!" : "Copy email address"}
        >
          {copied ? <TickIcon className="ct-copy-icon ct-tick" /> : <CopyIcon className="ct-copy-icon" />}
        </button>
        <span className="visually-hidden" aria-live="polite">
          {copied ? "Email copied" : ""}
        </span>
      </div>

      <ul className="ct-reasons" aria-label="Start a conversation">
        {REASONS.map(({ label, Icon, href }) => (
          <li key={label}>
            <a className="ct-reason" href={href}>
              <Icon className="ct-reason-icon" />
              <span className="ct-reason-label">{label}</span>
            </a>
          </li>
        ))}
      </ul>

      {beforeFooter}

      <footer className="ft">
        <div className="ft-row">
          <NameMark className="ft-mark" />
          <ul className="ct-links" aria-label="Find me elsewhere">
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
        </div>
        <div className="ft-bottom">
          <p className="ft-small">
            &copy; {new Date().getFullYear()} Toluwalope Adegoke
          </p>
          <a className="ft-top" href="#main">
            Back to top
            <UpArrowIcon className="ft-top-icon" />
          </a>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
