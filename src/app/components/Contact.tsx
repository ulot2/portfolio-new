"use client";
import React from "react";
import { motion } from "framer-motion";
import "@/styles/Contact.css";
import { FiSend } from "react-icons/fi";

export const Contact = () => {
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
            {"I'm always interested in new opportunities and exciting projects. Let's connect and create something amazing together!"}
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
              <form action="">
                <div className="contact-form-group">
                  <label htmlFor="name" className="contact-form-label">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="your full name"
                    className="contact-form-input"
                    required
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="email" className="contact-form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your.email@example.com"
                    className="contact-form-input"
                    required
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="message" className="contact-form-textarea">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell me about your project or just say hi!"
                    className="contact-form-textarea"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="contact-form-button">
                    <FiSend className="contact-form-button-icon" />
                    Send Message
                </button>
              </form>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
            className="contact-info-container"
          >
            <div className="contact-info-card">qewpiheq</div>
            <div className="contact-info-item">aqwelfgiq</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
