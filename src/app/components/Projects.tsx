import { HOME_PROJECT_COUNT, projectCode, projectHref, projectLive, projects } from "@/data/projects";
import { ArrowIcon, HookArrowIcon, OutArrowIcon, Underline } from "./ink";
import { ProjectKindIcon } from "./ProjectKindIcon";
import { SectionHeading } from "./SectionHeading";

/**
 * Each project as the hero line in miniature: the what if, then what's next.
 * The home page shows the first few; the rest live on /projects.
 */
export const Projects = () => (
  <section className="section" id="work">
    <SectionHeading word="projects" label="Projects" count={projects.length} />

    <ul className="wi-list">
      {projects.slice(0, HOME_PROJECT_COUNT).map((project) => {
        const href = projectHref(project);
        // The name already goes to the code when there is no live site.
        const code = projectLive(project) ? projectCode(project) : null;
        const heading = (linked: boolean) => (
          <>
            <span className="wi-question">{project.question}</span>
            <span className="wi-answer">
              <HookArrowIcon className="wi-hook" />
              <span className="wi-name">
                {project.title}
                {linked && <Underline className="wi-underline" />}
              </span>
              {linked && <OutArrowIcon className="wi-out" />}
            </span>
          </>
        );
        return (
          <li key={project.id} className="wi-item">
            {href ? (
              <a className="wi-link" href={href} target="_blank" rel="noopener noreferrer">
                {heading(true)}
              </a>
            ) : (
              <div className="wi-link">{heading(false)}</div>
            )}
            <div className="wi-detail">
              <p className="wi-desc">{project.description}</p>
              <p className="wi-meta">
                <span className="wi-kind">
                  <ProjectKindIcon kind={project.kind} className="wi-kind-icon" />
                  {project.kind}
                </span>
                {project.inProgress && <span className="wi-status">In progress</span>}
                {code && (
                  <a
                    className="wi-code"
                    href={code}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title} source code on GitHub (opens in a new tab)`}
                  >
                    Code
                    <OutArrowIcon className="wi-code-icon" />
                  </a>
                )}
              </p>
            </div>
          </li>
        );
      })}
    </ul>

    {projects.length > HOME_PROJECT_COUNT && (
      <a className="wr-all wi-all" href="/projects">
        All {projects.length} projects
        <ArrowIcon className="wr-all-icon" />
      </a>
    )}
  </section>
);

export default Projects;
