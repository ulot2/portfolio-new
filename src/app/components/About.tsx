"use client";
import React from "react";
import { motion } from "framer-motion";
import "@/styles/About.css";
import Image from "next/image";

export const About = () => {
  return (
    <section className="general-box" id="about">
      <div className="general-container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="section-title"
        >
          <h2 className="section-heading">About Me</h2>
          <div className="section-divider"></div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="about-card">
            <div className="about-content">
              <div className="about-image">
                <div className="about-image-container">
                  <Image
                    src="/images/img1.jpeg"
                    alt="About Image"
                    width={128}
                    height={128}
                    objectFit="cover"
                  />
                </div>
              </div>

              <div className="about-text">
                <p className="about-paragraph">
                  Hello! I'm Toluwalope, a passionate frontend developer with
                  over 3 years of experience creating beautiful, functional, and
                  user-centered digital experiences. I specialize in modern web
                  technologies and have a keen eye for design and user
                  experience.
                </p>

                <p className="about-paragraph">
                  When I'm not coding, you can find me exploring new
                  technologies, contributing to open-source projects, or sharing
                  knowledge with the developer community. I believe in writing
                  clean, maintainable code and creating solutions that make a
                  real impact.
                </p>

                <div className="about-tags">
                  <span className="tag tag-teal">Problem Solver</span>
                  <span className="tag tag-blue">Creative Thinker</span>
                  <span className="tag tag-purple">Team Player</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
