import React from "react";
import Link from "next/link";
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

      <div>
        {displayProjects.map((project, index) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="project-row fade-up"
            style={{ animationDelay: `${0.1 + index * 0.08}s` }}
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

      <Link href="/projects" className="view-all-link fade-up delay-6">
        View all projects <span className="arrow">→</span>
      </Link>
    </section>
  );
};
