import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { WritingSection } from "./components/WritingSection";
import { Skills } from "./components/Skills";
import { Contact } from "./components/Contact";
// import { PortfolioChat } from "./components/PortfolioChat";

export default function Home() {
  return (
    <main className="site-container">
      <Hero />
      <Projects />
      <WritingSection />
      <Skills />
      <Contact />
      {/* <PortfolioChat /> */}
    </main>
  );
}

