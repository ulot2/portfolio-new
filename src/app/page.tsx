import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { WritingSection } from "./components/WritingSection";
import { Skills } from "./components/Skills";
import { Contact } from "./components/Contact";

export default function Home() {
  return (
    <main className="site-container" id="main">
      <Hero />
      <Projects />
      <WritingSection />
      <Skills />
      <Contact />
    </main>
  );
}

