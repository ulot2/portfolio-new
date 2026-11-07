import { BrowserIcon, DatabaseIcon, WrenchIcon } from "./ink";
import { SectionHeading } from "./SectionHeading";

const skillGroups = [
  {
    title: "Frontend",
    Icon: BrowserIcon,
    tools: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    title: "Backend",
    Icon: DatabaseIcon,
    tools: ["Node.js", "Postgres", "Prisma", "Cloudflare Workers"],
  },
  {
    title: "Tooling",
    Icon: WrenchIcon,
    tools: ["Git", "GitHub Actions", "Vercel", "Figma"],
  },
];

export const Skills = () => (
  <section className="section" id="skills">
    <SectionHeading word="tools" label="Tools & Skills" />

    <ul className="sk-list">
      {skillGroups.map(({ title, Icon, tools }) => (
        <li key={title} className="sk-row">
          <h3 className="sk-group">
            <Icon className="sk-icon" />
            {title}
          </h3>
          <ul className="sk-tools">
            {tools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  </section>
);

export default Skills;
