import { projects } from "@/data/projects";
import { BrowserIcon, HookArrowIcon, OutArrowIcon, Underline, WrenchIcon } from "./ink";
import { SectionHeading } from "./SectionHeading";

// The "what if" each project answered, written from what the project does.
// Keyed by title; a project without one shows its description instead.
const WHAT_IF: Record<string, string> = {
  cowrite: "What if writing had live cursors?",
  SoloStack: "What if African freelancers had one workspace?",
  "Dee's Agora": "What if online debate had real structure?",
  "BAMSSALADS Quiz Club": "What if a quiz club ran on phone buzzers?",
  gitmop: "What if stale git branches cleaned themselves up?",
  Readtrail: "What if your browser kept everything you read?",
  hallway: "What if a first-time user checked your UI wording?",
  LaseTales: "What if an event videographer had a home for their films?",
};

const isUrl = (url: string) => url.startsWith("http");

const hrefFor = (liveUrl: string, githubUrl: string) => (isUrl(liveUrl) ? liveUrl : githubUrl);

// Things you open in a browser get the window; things you install get the wrench.
const KIND_ICON = {
  "Web app": BrowserIcon,
  Website: BrowserIcon,
  "Command-line tool": WrenchIcon,
  "Chrome extension": WrenchIcon,
  "GitHub Action": WrenchIcon,
};

/** Each project as the hero line in miniature: the what if, then what's next. */
export const Projects = () => (
  <section className="section" id="work">
    <SectionHeading word="projects" label="Projects" count={projects.length} />

    <ul className="wi-list">
      {projects.map((project) => {
        const KindIcon = KIND_ICON[project.kind];
        // The name already goes to the code when there is no live site.
        const hasCode = isUrl(project.liveUrl) && isUrl(project.githubUrl);
        return (
          <li key={project.id} className="wi-item">
            <a
              className="wi-link"
              href={hrefFor(project.liveUrl, project.githubUrl)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="wi-question">
                {WHAT_IF[project.title] ?? project.description}
              </span>
              <span className="wi-answer">
                <HookArrowIcon className="wi-hook" />
                <span className="wi-name">
                  {project.title}
                  <Underline className="wi-underline" />
                </span>
                <OutArrowIcon className="wi-out" />
              </span>
            </a>
            <div className="wi-detail">
              <p className="wi-desc">{project.description}</p>
              <p className="wi-meta">
                <span className="wi-kind">
                  <KindIcon className="wi-kind-icon" />
                  {project.kind}
                </span>
                {hasCode && (
                  <a
                    className="wi-code"
                    href={project.githubUrl}
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
  </section>
);

export default Projects;
