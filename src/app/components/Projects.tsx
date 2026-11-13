import type { CSSProperties } from "react";
import { HOME_PROJECT_COUNT, projectCode, projectHref, projectLive, projects } from "@/data/projects";
import { DrawOnView } from "./DrawOnView";
import { ArrowIcon, HookArrowIcon, OutArrowIcon, Underline } from "./ink";
import { ProjectKindIcon } from "./ProjectKindIcon";
import { SectionHeading } from "./SectionHeading";
import { SketchShot } from "./SketchShot";

// The hero's marks in miniature: a pencil loop, and an arrow that drops and turns.
const LOOP = "M74 5C52 1 20 3 9 11 1 18 6 32 30 35c25 3 58 2 64-9 5-9-5-19-31-21-15-.6-31 1-42 6";
const DROP = "M9 1c-5 19-6 42 1 59 4 9 10 13 19 14";
const HEAD = "M22 68.5l7.4 5.6-7.6 5";

/**
 * Each project as the hero line in miniature: "what if" ringed in pencil, an
 * arrow down to what was built, then its name. The pen marks draw as each card
 * scrolls into view. The home page shows the first few; the rest live on /projects.
 */
export const Projects = () => (
  <section className="section" id="work">
    <SectionHeading word="projects" label="Projects" count={projects.length} />

    <DrawOnView>
      <ul className="wi-list">
        {projects.slice(0, HOME_PROJECT_COUNT).map((project, index) => {
          const href = projectHref(project);
          // The name already goes to the code when there is no live site.
          const code = projectLive(project) ? projectCode(project) : null;
          const rest = project.question.replace(/^What if\s*/, "");
          const answer = (
            <span className="wi-answer">
              <HookArrowIcon className="wi-hook" />
              <span className="wi-name">
                {project.title}
                {href && <Underline className="wi-underline" />}
              </span>
              {href && <OutArrowIcon className="wi-out" />}
            </span>
          );
          return (
            <li
              key={project.id}
              className="wi-item draw-on-view"
              // The right-hand card draws a beat after the left one.
              style={{ "--i": index % 2 } as CSSProperties}
            >
              <p className="wi-question">
                {rest === project.question ? (
                  project.question
                ) : (
                  <>
                    <span className="wi-whatif">
                      What if
                      <svg className="wi-loop" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
                        <path className="ink-line" pathLength={1} d={LOOP} />
                      </svg>
                    </span>{" "}
                    {rest}
                  </>
                )}
              </p>

              <div className="wi-arrow">
                <svg className="wi-drop" viewBox="0 0 32 82" aria-hidden="true">
                  <path className="ink-line" pathLength={1} d={DROP} />
                  <path className="ink-line wi-drop-head" pathLength={1} d={HEAD} />
                </svg>
                <SketchShot project={project} sizes="(max-width: 560px) 90vw, 320px" className="wi-shot" />
              </div>

              {href ? (
                <a className="wi-link" href={href} target="_blank" rel="noopener noreferrer">
                  {answer}
                </a>
              ) : (
                <div className="wi-link">{answer}</div>
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
    </DrawOnView>

    {projects.length > HOME_PROJECT_COUNT && (
      <a className="wr-all wi-all" href="/projects">
        All projects
        <ArrowIcon className="wr-all-icon" />
      </a>
    )}
  </section>
);

export default Projects;
