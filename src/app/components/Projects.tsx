"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useSpring, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { projects, Project } from "@/data/projects";

const displayProjects = projects.slice(0, 5);

export const Projects = () => {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth spring physics for floating preview follower
  const springX = useSpring(0, { stiffness: 320, damping: 30 });
  const springY = useSpring(0, { stiffness: 320, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      springX.set(e.clientX + 20);
      springY.set(e.clientY - 110);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [springX, springY]);

  return (
    <section className="section" id="work" ref={containerRef}>
      <div className="section-label">
        <span className="number">01</span>
        <span className="label">Selected Work</span>
        <span className="line" />
      </div>

      <div className="projects-list">
        {displayProjects.map((project, index) => {
          const isHovered = activeProject?.id === project.id;
          const formattedIndex = String(index + 1).padStart(2, "0");

          return (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="project-row fade-up"
              style={{ animationDelay: `${0.05 + index * 0.06}s` }}
              onMouseEnter={() => setActiveProject(project)}
              onMouseLeave={() => setActiveProject(null)}
            >
              <div className="project-row-inner">
                {/* Left Side: Index & Title & Category */}
                <div className="project-left">
                  <span className="project-index">{formattedIndex}</span>
                  <div className="project-title-group">
                    <h3 className="project-name">{project.title}</h3>
                    <span className="project-category">{project.category}</span>
                  </div>
                </div>

                {/* Right Side: Tech Stack Pills & External Arrow */}
                <div className="project-right">
                  <div className="project-tags">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span key={tech} className="project-tag">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <motion.span
                    className="project-arrow-wrap"
                    animate={{
                      x: isHovered ? 3 : 0,
                      y: isHovered ? -3 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  >
                    <ArrowUpRight size={18} className="project-arrow-icon" />
                  </motion.span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Floating Image Preview Follower */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            key="project-preview-floating"
            className="project-floating-preview"
            style={{
              x: springX,
              y: springY,
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          >
            <div className="preview-image-wrapper">
              <Image
                src={activeProject.image}
                alt={activeProject.title}
                fill
                sizes="240px"
                className="preview-img"
                priority
              />
              <div className="preview-overlay">
                <span className="preview-badge">{activeProject.title}</span>
                <span className="preview-cta">
                  View <ExternalLink size={11} />
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
