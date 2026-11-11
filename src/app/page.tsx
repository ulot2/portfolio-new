import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { NowSection } from "./components/NowSection";
import { WritingSection } from "./components/WritingSection";
import { Contact } from "./components/Contact";
import { Header } from "./components/Header";
import { YearInInk } from "./components/YearInInk";

export default function Home() {
  return (
    <>
      <Header />
      <main className="site-container" id="main">
        <Hero />
        <Projects />
        <NowSection />
        <WritingSection />
        <Contact beforeFooter={<YearInInk />} />
      </main>
    </>
  );
}

