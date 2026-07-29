"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Sparkles,
  Wrench,
  Layers,
  Terminal,
  Cpu,
  Globe,
  Palette,
  GitBranch,
  Zap,
} from "lucide-react";

interface SkillItem {
  name: string;
  icon?: React.ReactNode;
}

interface SkillCategory {
  title: string;
  description: string;
  skills: SkillItem[];
}

const skillsCategories: SkillCategory[] = [
  {
    title: "Frontend & Core",
    description: "Building responsive, modern, and accessible web applications.",
    skills: [
      { name: "React", icon: <Code2 size={13} /> },
      { name: "Next.js", icon: <Globe size={13} /> },
      { name: "TypeScript", icon: <Terminal size={13} /> },
      { name: "JavaScript", icon: <Cpu size={13} /> },
      { name: "Tailwind CSS", icon: <Layers size={13} /> },
      { name: "HTML5 / CSS3", icon: <Palette size={13} /> },
    ],
  },
  {
    title: "Animation & UI Polish",
    description: "Crafting fluid motion and micro-interactions that feel alive.",
    skills: [
      { name: "Framer Motion", icon: <Sparkles size={13} /> },
      { name: "Design Systems", icon: <Layers size={13} /> },
      { name: "UI Engineering", icon: <Zap size={13} /> },
      { name: "Responsive Design", icon: <Palette size={13} /> },
    ],
  },
  {
    title: "Tooling & Infrastructure",
    description: "Version control, deployment pipelines, and workflow tools.",
    skills: [
      { name: "Git & GitHub", icon: <GitBranch size={13} /> },
      { name: "Vercel", icon: <Zap size={13} /> },
      { name: "Figma", icon: <Palette size={13} /> },
      { name: "REST APIs", icon: <Globe size={13} /> },
      { name: "Vite", icon: <Wrench size={13} /> },
      { name: "npm / pnpm", icon: <Terminal size={13} /> },
    ],
  },
];

export const Skills = () => {
  return (
    <section className="section" id="skills">
      <div className="section-label">
        <span className="number">02</span>
        <span className="label">Tools & Skills</span>
        <span className="line" />
      </div>

      <div className="skills-container">
        {skillsCategories.map((category) => (
          <div key={category.title} className="skills-category-block fade-up">
            <div className="category-header">
              <h3 className="category-title">{category.title}</h3>
              <p className="category-desc">{category.description}</p>
            </div>

            <div className="skills-grid">
              {category.skills.map((skill) => (
                <motion.span
                  key={skill.name}
                  className="skill-pill"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <span className="skill-icon">{skill.icon}</span>
                  <span className="skill-name">{skill.name}</span>
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
