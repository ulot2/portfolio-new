import type { Metadata } from "next";
import { Header } from "../../components/Header";
import { Projects } from "../../components/Projects";
import { Harness } from "./Harness";
import "./proto.css";

// A design exploration, not part of the site: three directions for the hero
// headline behind a picker. Delete this folder once one is chosen.
export const metadata: Metadata = {
  title: "Prototype: hero headline",
  robots: { index: false, follow: false },
};

export default function HeroHeadlinePrototype() {
  return (
    <>
      <Header />
      <main className="site-container" id="main">
        <Harness />
        {/* The next section, so each headline is judged with what follows it. */}
        <Projects />
      </main>
    </>
  );
}
