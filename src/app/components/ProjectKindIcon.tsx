import type { Project } from "@/data/projects";
import { BrowserIcon, WrenchIcon } from "./ink";

// Things you open in a browser get the window; things you install get the wrench.
const KIND_ICON: Record<Project["kind"], typeof BrowserIcon> = {
  "Web app": BrowserIcon,
  Website: BrowserIcon,
  "Command-line tool": WrenchIcon,
  "Chrome extension": WrenchIcon,
  "GitHub Action": WrenchIcon,
};

export const ProjectKindIcon = ({ kind, className }: { kind: Project["kind"]; className?: string }) => {
  const Icon = KIND_ICON[kind];
  return <Icon className={className} />;
};

export default ProjectKindIcon;
