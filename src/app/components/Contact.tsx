import React from "react";
import { LuGithub, LuLinkedin, LuMail } from "react-icons/lu";
import { FaXTwitter } from "react-icons/fa6";
import { RiBuilding3Line } from "react-icons/ri"; // Using a building icon for Contra since there is no standard Contra icon

const contactLinks = [
  {
    label: "tolu.nuell@gmail.com",
    href: "mailto:tolu.nuell@gmail.com",
    icon: <LuMail />,
  },
  {
    label: "GitHub",
    href: "https://github.com/ulot2",
    icon: <LuGithub />,
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/Tolu_dev",
    icon: <FaXTwitter />,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/toluwalope-adegoke-b441b9380",
    icon: <LuLinkedin />,
  },
];

export const Contact = () => {
  return (
    <section className="section contact-section" id="contact">
      <div className="fade-up delay-1">
        <h2 className="contact-heading">Let&apos;s Talk</h2>
        <p className="contact-intro">
          Have a project in mind or just want to connect? Reach out through any
          of these channels:
        </p>
      </div>

      <div className="contact-grid fade-up delay-2">
        {contactLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card"
          >
            <span className="contact-icon">{link.icon}</span>
            <span className="contact-text">{link.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
};
