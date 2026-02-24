import React from "react";

const skillsData = {
  "Languages & Frameworks": [
    "HTML5",
    "CSS3",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "Framer Motion",
  ],
  "Infrastructure & Tools": [
    "Git",
    "GitHub",
    "VS Code",
    "Figma",
    "Vercel",
    "REST APIs",
    "Vite",
    "npm / pnpm",
  ],
};

export const Skills = () => {
  return (
    <section className="section" id="skills">
      <div className="section-label">
        <span className="number">02</span>
        <span className="label">Tools & Skills</span>
        <span className="line" />
      </div>

      {Object.entries(skillsData).map(([category, skills]) => (
        <div key={category} className="skills-group">
          <h3 className="skills-group-title">{category}</h3>
          <div className="skills-grid">
            {skills.map((skill) => (
              <span key={skill} className="skill-pill">
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};
