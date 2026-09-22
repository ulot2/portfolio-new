"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";

export const Projects = () => {
  return (
    <section className="section" id="work">
      <div
        className="section-label fade-up delay-1"
        style={{ marginBottom: "2.5rem" }}
      >
        <span className="number">01</span>
        <span className="label">Projects</span>
        <span className="line" aria-hidden="true" />
      </div>

      <div className="projects-grid">
        {projects.map((project, index) => {
          const targetUrl =
            project.liveUrl && project.liveUrl !== "/"
              ? project.liveUrl
              : project.githubUrl;

          return (
            <motion.a
              key={project.id}
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: (index % 4) * 0.05 }}
            >
              <div className="project-card-header">
                <span className="project-card-title">
                  <span className="title-text">{project.title}</span>
                  <ArrowUpRight size={15} className="card-arrow-icon" />
                </span>
              </div>
              <p className="project-card-desc">{project.description}</p>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;
