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
                    src="/images/port-img.jpg"
                    alt="About Image"
                    width={128}
                    height={128}
                    objectFit="cover"
                  />
                </div>
              </div>

              <div className="about-text">
                <p className="about-paragraph">
                 {" Hello, I’m Toluwalope. I’m a frontend developer who has been learning and building projects for a little over 2 years now. I focus on creating modern websites that are functional and user friendly, using modern web technologies. I also have a keen eye for design and usability."}
                </p>

                <p className="about-paragraph">
                  {"When I’m not coding, you’ll find me playing games, catching up on football, or watching good movies and TV shows. I enjoy writing clean, maintainable code and building solutions that make a real impact."}
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
