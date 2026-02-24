import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id.toString(),
  }));
}

export default function ProjectDetail({ params }: { params: { id: string } }) {
  const projectId = parseInt(params.id, 10);
  const projectIndex = projects.findIndex((p) => p.id === projectId);

  if (projectIndex === -1) {
    notFound();
  }

  const project = projects[projectIndex];
  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const nextProject =
    projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;

  return (
    <main className="site-container">
      <div className="project-detail-page">
        {/* Navigation Bar */}
        <nav className="project-nav fade-up">
          <Link href="/#work" className="project-back">
            <ChevronLeft size={16} />
            Back to work
          </Link>

          <div className="project-nav-controls">
            {prevProject ? (
              <Link
                href={`/projects/${prevProject.id}`}
                className="project-nav-btn"
                aria-label="Previous project"
              >
                <ChevronLeft size={18} />
              </Link>
            ) : (
              <span className="project-nav-btn disabled">
                <ChevronLeft size={18} />
              </span>
            )}

            <div className="project-nav-divider" />

            {nextProject ? (
              <Link
                href={`/projects/${nextProject.id}`}
                className="project-nav-btn"
                aria-label="Next project"
              >
                <ChevronRight size={18} />
              </Link>
            ) : (
              <span className="project-nav-btn disabled">
                <ChevronRight size={18} />
              </span>
            )}
          </div>
        </nav>

        {/* Header Section */}
        <header className="project-header fade-up delay-1">
          <h1 className="project-title-large">{project.title}</h1>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-visit-btn"
            >
              Visit Project
              <ArrowUpRight size={16} />
            </a>
          )}
        </header>

        {/* Content Section */}
        <section className="project-content-section fade-up delay-2">
          <div>
            <h2 className="project-overview-title">Overview</h2>

            {/* The Goal Card */}
            <div className="project-goal-card">
              <h3 className="project-goal-title">The goal:</h3>
              <p className="project-goal-text">{project.description}</p>
            </div>

            <p className="project-full-desc">{project.fullDescription}</p>
          </div>

          {/* Details Grid */}
          <div className="project-details-grid">
            {project.category && (
              <div className="project-detail-column">
                <h3 className="project-detail-title">Role</h3>
                <p className="project-detail-text">{project.category}</p>
              </div>
            )}

            {project.technologies && project.technologies.length > 0 && (
              <div className="project-detail-column">
                <h3 className="project-detail-title">Technologies</h3>
                <ul className="project-list">
                  {project.technologies.map((tech) => (
                    <li key={tech}>
                      <span className="project-list-bullet"></span>
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.features && project.features.length > 0 && (
              <div className="project-detail-column">
                <h3 className="project-detail-title">Features</h3>
                <ul className="project-list">
                  {project.features.map((feature) => (
                    <li key={feature}>
                      <span className="project-list-bullet"></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Project Images */}
          <div className="project-gallery">
            {[project.image, project.image2, project.image3]
              .filter(Boolean)
              .map((img, i) => (
                <div key={i} className="project-gallery-item">
                  <div className="project-gallery-item-fallback" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${project.title} detailed view ${i + 1}`}
                    loading={i === 0 ? "eager" : "lazy"}
                    className="project-gallery-img"
                  />
                </div>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}
