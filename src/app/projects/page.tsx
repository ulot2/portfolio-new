import React from "react";
import Link from "next/link";
import { projects } from "@/data/projects";

export default function AllProjectsPage() {
  return (
    <main className="site-container">
      <div className="projects-page">
        <Link href="/" className="back-link fade-up delay-1">
          <span className="arrow">←</span> Back
        </Link>

        <h1 className="projects-page-title fade-up delay-2">All Projects</h1>

        <div className="fade-up delay-3">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="project-row"
            >
              <div className="project-row-inner">
                <div className="project-content">
                  <h3 className="project-name">{project.title}</h3>
                  <p className="project-desc">{project.description}</p>
                  <div className="project-tags">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span key={tech} className="project-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="project-arrow">↗</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
