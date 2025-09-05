"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import "@/styles/Hero.css";
import { FaArrowDownLong } from "react-icons/fa6";

export const Hero = () => {
  return (
    <section className="general-box hero-section" id="hero">
      <div className="general-container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hero-content"
        >
          <div className="hero-image">
            <Image
              src="/images/port-img.jpg"
              alt="Hero Image"
              width={196}
              height={200}
              objectFit="cover"
            />
            <div className="gradient-overlay"></div>
          </div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="hero-text"
        >
          Toluwalope Adegoke
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="hero-subtitle"
        >
          Frontend Developer | Building Modern Web Experiences
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="hero-cta-container"
        >
          <motion.button 
            type="button"
            onClick={() => {
              const projectsSection = document.getElementById('projects');
              if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="hero-cta-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View My Work
          </motion.button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="bounce-container"
        >
          <motion.div 
            className="animate-bounce"
            onClick={() => {
              const aboutSection = document.getElementById('about');
              if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <FaArrowDownLong className="arrow-icon" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
