"use client";
import React from "react";
import { motion } from "framer-motion";
import "@/styles/Skills.css";
import { IoLogoHtml5 } from "react-icons/io";
import { SiTailwindcss } from "react-icons/si";
import { RiNextjsLine } from "react-icons/ri";

interface Skill {
  name: string;
  icon: string | React.ReactNode;
  color: string;
}

const skills: Skill[] = [
  { name: "HTML5", icon: <IoLogoHtml5 />, color: "text-orange-600" },
  { name: "CSS3", icon: "🎨", color: "text-blue-600" },
  { name: "JavaScript", icon: "⚡", color: "text-yellow-600" },
  { name: "React", icon: "⚛️", color: "text-blue-500" },
  { name: "Next.js", icon: <RiNextjsLine />, color: "text-gray-800" },
  { name: "TailwindCSS", icon: <SiTailwindcss />, color: "text-teal-600" }
];

export const Skills = () => {
  return (
    <section className="general-box" id="skills">
      <div className="general-container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="section-title"
        >
          <h2 className="section-heading">Skills & Technologies</h2>
          <div className="section-divider"></div>
          <p className="section-description">
            Here are some of the skills and technologies I work with:
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="skills-container"
        >
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="skill-card"
            >
              <motion.div
                className="skill-icon"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                {skill.icon}
              </motion.div>
              <h3 className={`skill-name ${skill.color}`}>
                {skill.name}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
