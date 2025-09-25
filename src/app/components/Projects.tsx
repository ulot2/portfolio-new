"use client";
import React from "react";
import { motion } from "framer-motion";
import "@/styles/Projects.css";
import Image from "next/image";
import { RiExternalLinkLine } from "react-icons/ri";
import { LuGithub } from "react-icons/lu";
import Link from "next/link";

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
    description:
      "A modern and responsive portfolio website that showcases projects, skills, and contact info. Built with Next.js and styled using CSS.",
    image: "/images/portfolio-image.png",
    technologies: ["Next.js", "CSS", "Framer Motion"],
    liveUrl: "https://tolu-a.vercel.app/",
    githubUrl: "https://github.com/ulot2/portfolio-new.git",
  },
  {
    id: 2,
    title: "Product Cart",
    description:
      "An interactive product cart site that lets users browse items, add them to their cart, update quantities, and smoothly proceed to checkout.",
    image: "/images/product-cart.png",
    technologies: ["Vite", "React", "CSS"],
    liveUrl: "https://product-cart-bay.vercel.app/",
    githubUrl: "https://github.com/ulot2/product-cart.git",
  },
  {
    id: 3,
    title: "Age Calculator",
    description:
      "A simple age calculator application that determines someone’s age precisely from their date of birth, offering accuracy, simplicity, and ease.",
    image: "/images/age-calculator.png",
    technologies: ["React", "CSS"],
    liveUrl: "https://age-calculator-ulot2.vercel.app/",
    githubUrl: "https://github.com/ulot2/age-calculator.git",
  },
  {
    id: 4,
    title: "Browser Extensions",
    description:
      "A simple and minimal React project that mimics managing browser extensions, letting users toggle them on or off in a clean interface.",
    image: "/images/browser-extensions.png",
    technologies: ["React", "CSS"],
    liveUrl: "https://browser-extensions-pied.vercel.app/",
    githubUrl: "https://github.com/ulot2/Browser-Extensions.git",
  },
  {
    id: 5,
    title: "The B2 Foundation",
    description:
      "A nonprofit website for The B2 Foundation dedicated to reducing litter, promoting recycling, and inspiring community efforts toward a cleaner environment.",
    image: "/images/b2-foundation.png",
    technologies: ["React", "CSS"],
    liveUrl: "https://the-b2-foundation-iwak.vercel.app/",
    githubUrl: "https://github.com/ulot2/the-b2-foundation.git",
  },
  {
    id: 6,
    title: "Weather app",
    description:
      "A weather application that provides real-time updates and detailed forecasts, helping users stay informed about current conditions with ease.",
    image: "/images/weather.png",
    technologies: ["React", "CSS", "OpenWeather API"],
    liveUrl: "https://weather-app-tolu.vercel.app/",
    githubUrl: "https://github.com/ulot2/weather-app.git",
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
            {"Here are some of my recent projects that highlight what I’ve been learning and building."}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="projects-list">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
                className="project-card"
              >
                <div className="project-image-container">
                  <Image
                    src={project.image}
                    alt={project.title}
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
                      <Link
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        <RiExternalLinkLine />
                      </Link>
                    </button>
                    <button
                      type="button"
                      className="project-button"
                      title="View on GitHub"
                    >
                      <Link
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        <LuGithub />
                      </Link>
                    </button>
                  </div>
                </div>
                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">
                    {project.description}
                  </p>

                  <div className="project-technologies">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="project-tech-badge">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
