"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import "@/styles/Contact.css";
import { FiSend } from "react-icons/fi";
import { LuGithub } from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";
import { LuLinkedin } from "react-icons/lu";
import { FaXTwitter } from "react-icons/fa6";
import { IoIosCheckmark, IoIosClose } from "react-icons/io";
import Link from "next/link";
import emailjs from "emailjs-com";
import { p } from "framer-motion/client";

export const Contact = () => {
  const form = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    if (form.current) {
      emailjs
        .sendForm(
          "service_f9ydw08", // replace with your EmailJS Service ID
          "template_bhf3euk", // replace with your EmailJS Template ID
          form.current,
          "K5gsQAgTkfK2jkwqH" // replace with your EmailJS Public Key
        )
        .then(() => {
          setLoading(false);
          setStatus("success");
          if (form.current) {
            form.current.reset();
          }
        })
        .catch((error) => {
          setLoading(false);
          setStatus("error");
        });
    }
  };

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(null), 3000); // hide after 3s
      return () => clearTimeout(timer);
    }
  }, [status]);
  return (
    <section className="general-box" id="contact">
      <div className="general-container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="section-title"
        >
          <h2 className="section-heading">Get in Touch</h2>
          <div className="section-divider"></div>
          <p className="section-description">
            {
              "I'm always interested in new opportunities and exciting projects. Let's connect and create something amazing together!"
            }
          </p>
        </motion.div>
        <div className="contact-flex">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="contact-form-container"
          >
            <div className="contact-form-card">
              <h3 className="contact-form-title">Send a message</h3>
              <form ref={form} onSubmit={sendEmail}>
                <div className="contact-form-group">
                  <label htmlFor="name" className="contact-form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="your full name"
                    className="contact-form-field"
                    required
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="email" className="contact-form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your.email@example.com"
                    className="contact-form-field"
                    required
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="message" className="contact-form-label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell me about your project or just say hi!"
                    className="contact-form-field contact-form-textarea"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="contact-submit-button">
                  {loading ? (
                    <p>Sending<span className="blink">...</span></p>
                  ) : (
                    <>
                      <FiSend className="contact-form-button-icon" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
              {/* Status Messages */}
              {status === "success" && (
                <p className="sent-success">
                  <IoIosCheckmark className="check-icon" />
                  Your message has been sent successfully!
                </p>
              )}
              {status === "error" && (
                <p className="sent-error">
                  <IoIosClose className="check-icon" />
                  Oops! Something went wrong. Please try again.
                </p>
              )}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
            className="contact-info-container"
          >
            <div className="contact-info-card">
              <h3 className="contact-info-title">Contact Information</h3>
              <div className="contact-info-details">
                <div className="contact-info-icon-container info-email-icon">
                  <MdOutlineEmail className="contact-info-icon" />
                </div>
                <div className="contact-info-text">
                  <p>Email</p>
                  <Link
                    href="mailto:tolu.nuell@gmail.com"
                    className="contact-info-link email-link"
                  >
                    {"tolu.nuell@gmail.com"}
                  </Link>
                </div>
              </div>
              <div className="contact-info-details">
                <div className="contact-info-icon-container info-linkedin-icon">
                  <LuLinkedin className="contact-info-icon" />
                </div>
                <div className="contact-info-text">
                  <p>LinkedIn</p>
                  <Link
                    href="https://www.linkedin.com/in/toluwalope-adegoke-b441b9380"
                    className="contact-info-link linkedin-link"
                  >
                    {"linkedin.com/in/toluwlape-adegoke"}
                  </Link>
                </div>
              </div>
              <div className="contact-info-details">
                <div className="contact-info-icon-container info-github-icon">
                  <LuGithub className="contact-info-icon" />
                </div>
                <div className="contact-info-text">
                  <p>GitHub</p>
                  <Link
                    href="https://github.com/ulot2"
                    className="contact-info-link github-link"
                  >
                    {"github.com/ulot2"}
                  </Link>
                </div>
              </div>
            </div>
            <div className="contact-quick-response-card">
              <h4 className="contact-quick-response-title">Quick Response</h4>
              <p className="contact-quick-response-text">
                {
                  "I typically respond to emails within 24 hours. For urgent matters, feel free to reach out on LinkedIn."
                }
              </p>
              <div className="contact-quick-response-buttons">
                <button
                  className="contact-social-button contact-social-button-teal"
                  onClick={() =>
                    window.open(
                      "https://www.linkedin.com/in/toluwalope-adegoke-b441b9380",
                      "_blank"
                    )
                  }
                >
                  <LuLinkedin />
                  LinkedIn
                </button>
                <button
                  className="contact-social-button contact-social-button-gray"
                  onClick={() =>
                    window.open("https://x.com/Tolu_dev", "_blank")
                  }
                >
                  <FaXTwitter />
                  (formally twitter)
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
