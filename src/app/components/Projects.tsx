"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { projects } from "@/data/projects";

const INITIAL_PROJECT_COUNT = 4;

export const Projects = () => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_PROJECT_COUNT);
  const hasMore = visibleCount < projects.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 4, projects.length));
  };

  const displayedProjects = projects.slice(0, visibleCount);

  return (
    <section className="section" id="work">
      <div
        className="section-label fade-up delay-1"
        style={{ marginBottom: "2.5rem" }}
      >
        <span className="label">Projects</span>
      </div>

      <div className="projects-grid">
        <AnimatePresence initial={false}>
          {displayedProjects.map((project, index) => {
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
                exit={{ opacity: 0, y: -10 }}
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
        </AnimatePresence>
      </div>

      {hasMore && (
        <div className="projects-footer fade-up">
          <motion.button
            type="button"
            onClick={handleLoadMore}
            className="load-more-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <span>Load More</span>
            <ChevronDown size={14} className="load-more-icon" />
          </motion.button>
        </div>
      )}
    </section>
  );
};

export default Projects;
