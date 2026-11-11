"use client";

import React, { useState } from "react";
import { type Project, projectCode, projectHref, projectLive } from "@/data/projects";
import { HookArrowIcon, OutArrowIcon, Rule, Underline } from "./ink";
import { ProjectKindIcon } from "./ProjectKindIcon";

// The filters group the kinds a visitor would think in, not the exact labels.
const GROUPS = [
  { id: "all", label: "All", kinds: null },
  { id: "apps", label: "Web apps", kinds: ["Web app"] },
  { id: "tools", label: "Tools", kinds: ["Command-line tool", "Chrome extension", "GitHub Action"] },
  { id: "sites", label: "Websites", kinds: ["Website"] },
] as const;

type GroupId = (typeof GROUPS)[number]["id"];

const inGroup = (project: Project, group: (typeof GROUPS)[number]) =>
  group.kinds === null || (group.kinds as readonly string[]).includes(project.kind);

/** Two digits, like a catalogue number. */
const number = (n: number) => String(n).padStart(2, "0");

/** The full list of projects, as numbered entries in an exhibition catalogue. */
export const ProjectsCatalogue = ({ projects }: { projects: Project[] }) => {
  const [groupId, setGroupId] = useState<GroupId>("all");
  const group = GROUPS.find((g) => g.id === groupId)!;
  const shown = projects.filter((p) => inGroup(p, group));

  return (
    <div className="pj-catalogue">
      <div className="bl-tags pj-filters hero-rise" role="group" aria-label="Filter by kind" style={{ "--i": 0 } as React.CSSProperties}>
        {GROUPS.map((g) => {
          const count = projects.filter((p) => inGroup(p, g)).length;
          if (count === 0) return null;
          return (
            <button
              key={g.id}
              type="button"
              className="bl-tag"
              aria-pressed={groupId === g.id}
              onClick={() => setGroupId(g.id)}
            >
              {g.label}
              <sup className="bl-tag-count">
                <span className="visually-hidden">, </span>
                {count}
              </sup>
              <Underline className="bl-tag-underline" />
            </button>
          );
        })}
      </div>

      <p className="visually-hidden" aria-live="polite">
        {groupId === "all" ? "" : `Showing ${shown.length} of ${projects.length} projects`}
      </p>

      <ol className="pj-list" key={groupId}>
        {shown.map((project, index) => {
          // Numbers follow the full catalogue, so a project keeps its number under any filter.
          const no = projects.indexOf(project) + 1;
          const href = projectHref(project);
          const live = projectLive(project);
          const code = projectCode(project);
          return (
            <li
              key={project.id}
              className="pj-item hero-rise"
              style={{ "--i": Math.min(index + 1, 6) } as React.CSSProperties}
            >
              <div className="pj-margin">
                <span className="pj-no" aria-hidden="true">
                  No. {number(no)}
                </span>
                <span className="pj-kind">
                  <ProjectKindIcon kind={project.kind} className="pj-kind-icon" />
                  {project.kind}
                </span>
              </div>

              <div className="pj-body">
                <p className="pj-question">{project.question}</p>
                <h2 className="pj-name">
                  <HookArrowIcon className="pj-hook" />
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="pj-name-link">
                      <span className="pj-name-text">
                        {project.title}
                        <Underline className="pj-underline" />
                      </span>
                      <span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <span className="pj-name-text">{project.title}</span>
                  )}
                </h2>
                <p className="pj-desc">{project.description}</p>

                <p className="pj-links">
                  {project.inProgress && <span className="wi-status">In progress</span>}
                  {live && (
                    <a className="pj-action" href={live} target="_blank" rel="noopener noreferrer">
                      Visit
                      <OutArrowIcon className="pj-action-icon" />
                      <span className="visually-hidden"> {project.title} (opens in a new tab)</span>
                    </a>
                  )}
                  {code && (
                    <a className="pj-action" href={code} target="_blank" rel="noopener noreferrer">
                      Code
                      <OutArrowIcon className="pj-action-icon" />
                      <span className="visually-hidden"> for {project.title} on GitHub (opens in a new tab)</span>
                    </a>
                  )}
                  {!live && !code && !project.inProgress && <span className="pj-private">Private</span>}
                </p>
              </div>

              <Rule className="pj-rule" />
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default ProjectsCatalogue;
