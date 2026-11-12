import { projects } from "@/data/projects";
import { ogCard, ogSize } from "@/lib/og";

export const alt = "Projects by Toluwalope Adegoke";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard(`${projects.length} answers to “what if”`, "projects");
}
