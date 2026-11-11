import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { WritingSection } from "./components/WritingSection";
import { Contact } from "./components/Contact";
import { Header } from "./components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="site-container" id="main">
        <Hero />
        <Projects />
        <WritingSection />
        <Contact />
      </main>
    </>
  );
}

