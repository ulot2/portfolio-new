import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { Contact } from "./components/Contact";

export default function Home() {
  return (
    <main className="site-container">
      <Hero />
      <Projects />
      <Skills />
      <Contact />
    </main>
  );
}
