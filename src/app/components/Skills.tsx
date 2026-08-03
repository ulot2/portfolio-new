"use client";

import React from "react";
import { motion } from "framer-motion";
interface SkillCategory {
  title: string;
  skills: string[];
}

const skillsCategories: SkillCategory[] = [
  {
    title: "Frontend & Core",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "HTML/CSS",
    ],
  },
  {
    title: "Animation & Motion",
    skills: [
      "Framer Motion",
      "Design Systems",
      "UI Engineering",
      "Responsive Layouts",
    ],
  },
  {
    title: "Tooling & Workflow",
    skills: [
      "Git & GitHub",
      "Vercel",
      "Figma",
      "REST APIs",
      "Vite",
      "pnpm / npm",
    ],
  },
];

export const Skills = () => {
  return (
    <section className="section" id="skills">
      <div className="section-label fade-up delay-1">
        <span className="label">Tools & Skills</span>
      </div>

      <div className="skills-simple-list">
        {skillsCategories.map((category, index) => (
          <div
            key={category.title}
            className="skill-row fade-up"
            style={{ animationDelay: `${0.06 + index * 0.06}s` }}
          >
            <span className="skill-category-name">{category.title}</span>
            <div className="skill-tags">
              {category.skills.map((skill) => (
                <motion.span
                  key={skill}
                  className="simple-skill-tag"
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.15 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
