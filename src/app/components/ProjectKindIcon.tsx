import type { Project } from "@/data/projects";
import { BrowserIcon, WrenchIcon } from "./ink";

// Things you open in a browser get the window (in blue); things you install
// get the wrench (in teal). The colours are set in globals.css.
const KIND_GROUP: Record<Project["kind"], "web" | "tool"> = {
  "Web app": "web",
  Website: "web",
  "Command-line tool": "tool",
  "Chrome extension": "tool",
  "GitHub Action": "tool",
};

export const ProjectKindIcon = ({ kind, className }: { kind: Project["kind"]; className?: string }) => {
  const group = KIND_GROUP[kind];
  const Icon = group === "web" ? BrowserIcon : WrenchIcon;
  return <Icon className={[className, `is-${group}`].filter(Boolean).join(" ")} />;
};

export default ProjectKindIcon;
