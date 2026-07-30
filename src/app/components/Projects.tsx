"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";

const displayProjects = projects.slice(0, 5);

export const Projects = () => {
  return (
    <section className="section" id="work">
      <div className="section-label">
        <span className="number">01</span>
        <span className="label">Selected Work</span>
        <span className="line" />
      </div>

      <div className="projects-list">
        {displayProjects.map((project, index) => {
          const formattedIndex = String(index + 1).padStart(2, "0");

          return (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="project-row fade-up"
              style={{ animationDelay: `${0.05 + index * 0.06}s` }}
            >
              <div className="project-row-inner">
                {/* Left: Index & Title */}
                <div className="project-left">
                  <span className="project-index">{formattedIndex}</span>
                  <h3 className="project-name">{project.title}</h3>
                </div>

                {/* Right: Category & Hover Arrow */}
                <div className="project-right">
                  <span className="project-category">{project.category}</span>
                  <span className="project-arrow-wrap">
                    <ArrowUpRight size={17} className="project-arrow-icon" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="projects-footer fade-up delay-6">
        <motion.div
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          style={{ display: "inline-block" }}
        >
          <Link href="/projects" className="view-all-link">
            <span>View all projects</span>
            <span className="arrow">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
