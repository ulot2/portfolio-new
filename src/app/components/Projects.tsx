"use client";
import React from "react";
import { motion } from "framer-motion";
import "@/styles/Projects.css";
import Image from "next/image";
import { RiExternalLinkLine } from "react-icons/ri";
import { LuGithub } from "react-icons/lu";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Portfolio",
    description: "A sleek and responsive portfolio website showcasing projects, skills, and contact information. Built with Next.js for performance and modern styling with CSS.",
    image: "/images/project.png",
    technologies: ["Next.js", "CSS", "Framer Motion"],
    liveUrl: "https://tolu-a.vercel.app/",
    githubUrl: "https://github.com/ulot2/portfolio-new.git"
  },
  {
    id: 2,
    title: "Product Cart",
    description: "An interactive product cart website that allows users to browse items, add them to their cart, update quantities, and proceed to checkout with a smooth and intuitive experience.",
    image: "/images/product-cart.png",
    technologies: ["Vite", "React", "CSS"],
    liveUrl: "https://product-cart-bay.vercel.app/",
    githubUrl: "https://github.com/ulot2/product-cart.git"
  },
  {
    id: 3,
    title: "Age Calculator",
    description: "A simple age calculator application that determines a person's age based on their date of birth.",
    image: "/images/age-calculator.png",
    technologies: ["React", "CSS"],
    liveUrl: "https://age-calculator-ulot2.vercel.app/",
    githubUrl: "https://github.com/ulot2/age-calculator.git"
  },
  {
    id: 4,
    title: "Browser Extensions",
    description: "A simple and minimal React project that mimics managing browser extensions — toggle them on/off and view a list in a clean UI.",
    image: "/images/browser-extensions.png",
    technologies: ["React", "CSS"],
    liveUrl: "https://browser-extensions-pied.vercel.app/",
    githubUrl: "https://github.com/ulot2/Browser-Extensions.git"
  },
  {
    id: 5,
    title: "The B2 Foundation",
    description: "A nonprofit website for The B2 Foundation, focused on reducing litter, promoting recycling, and encouraging community action for a cleaner environment.",
    image: "/images/b2-foundation.png",
    technologies: ["React", "OpenWeather API", "Mapbox", "PWA"],
    liveUrl: "https://the-b2-foundation-iwak.vercel.app/",
    githubUrl: "https://github.com/ulot2/the-b2-foundation.git"
  },
  {
    id: 6,
    title: "Weather app",
    description: "A weather application that provides real-time weather updates and forecasts.",
    image: "/images/weather.png",
    technologies: ["React", "CSS", "OpenWeather API"],
    liveUrl: "https://weather-app-ulot2.vercel.app/",
    githubUrl: "https://github.com/ulot2/weather-app.git"
  },
];

export const Projects = () => {
  return (
    <section className="general-box" id="projects">
      <div className="projects-container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="section-title"
        >
          <h2 className="section-heading">Featured Projects</h2>
          <div className="section-divider"></div>
          <p className="section-description">
            Here are some of my recent projects that showcase my skills and
            passion for creating exceptional digital experiences.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="projects-list">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              className="project-card"
            >
              <div className="project-image-container">
                <Image
                  src="/images/portfolio.png"
                  alt="Project 1"
                  width={380}
                  height={200}
                  objectFit="cover"
                  className="project-image"
                />
                <div className="project-overlay"></div>
                <div className="project-buttons">
                  <button
                    type="button"
                    className="project-button"
                    title="Visit Project"
                  >
                    <RiExternalLinkLine className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="project-button"
                    title="View on GitHub"
                  >
                    <LuGithub className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="project-content">
                <h3 className="project-title">Project title</h3>
                <p className="project-description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, minima? Quis quaerat repudiandae aliquid nisi?</p>

                <div className="project-technologies">
                  <span className="project-tech-badge">css</span>
                  <span className="project-tech-badge">javascript</span>
                  <span className="project-tech-badge">react</span>
                  <span className="project-tech-badge">next.js</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
