import React from "react";

const skillGroups = [
  {
    title: "Frontend",
    tools: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    title: "Backend",
    tools: ["Node.js", "Postgres", "Prisma", "Cloudflare Workers"],
  },
  {
    title: "Tooling",
    tools: ["Git", "GitHub Actions", "Vercel", "Figma"],
  },
];

export const Skills = () => {
  return (
    <section className="section" id="skills">
      <div className="section-label fade-up delay-1">
        <span className="number">03</span>
        <span className="label">Tools & Skills</span>
        <span className="line" aria-hidden="true" />
      </div>

      <div className="skills-simple-list">
        {skillGroups.map((group, index) => (
          <div
            key={group.title}
            className="skill-row fade-up"
            style={{ animationDelay: `${0.06 + index * 0.06}s` }}
          >
            <h3 className="skill-category-name">{group.title}</h3>
            <ul className="skill-items">
              {group.tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
