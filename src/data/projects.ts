export interface Project {
  id: number;
  title: string;
  /** The "what if" the project answers, written from what it does. */
  question: string;
  /** What sort of thing it is, shown as a small label under the name. */
  kind: "Web app" | "Website" | "Command-line tool" | "Chrome extension" | "GitHub Action";
  description: string;
  /** The main tools it is built with, read from its repository. Shown on /projects. */
  stack: string[];
  liveUrl: string;
  githubUrl: string;
  /** Set while a project is still being built; it then shows without a link if it has none. */
  inProgress?: boolean;
}

export const projects: Project[] = [
  {
    id: 11,
    title: "Nnkan Obe",
    question: "What if Ibadan's foodstuff shop was a tap away?",
    kind: "Website",
    description:
      "Fresh vegetables, proteins, staples and cooking packages in one place. A foodstuff shop made for Ibadan.",
    stack: ["React", "Vite", "React Router"],
    liveUrl: "https://inkan-obe.vercel.app",
    // Private repo — the live site is the only public entry point.
    githubUrl: "#",
  },
  {
    id: 9,
    title: "Museum of Ordinary Things",
    question: "What if the everyday things you keep had a museum?",
    kind: "Web app",
    description:
      "Photograph an everyday object, write its story, and publish it as an exhibit to share by link or add to the public collection.",
    stack: ["Next.js", "Cloudflare D1 & R2", "Drizzle", "Better Auth", "Tiptap"],
    liveUrl: "https://moot.tnuell.sbs",
    // Private repo — the live site is the only public entry point.
    githubUrl: "#",
  },
  {
    id: 10,
    title: "SecondLook",
    question: "What if someone checked your application before you sent it?",
    kind: "Web app",
    description:
      "Checks scholarship application files against the instructions you give it: format, size, page and word counts, all on your own device.",
    stack: ["Next.js", "TypeScript", "PDF.js", "Web Workers"],
    liveUrl: "",
    // Private repo, not deployed yet.
    githubUrl: "#",
    inProgress: true,
  },
  {
    id: 1,
    title: "cowrite",
    question: "What if writing had live cursors?",
    kind: "Web app",
    description:
      "Comment, suggest edits and restore any earlier version. It keeps working offline and merges when you reconnect.",
    stack: ["React Router", "Yjs", "Cloudflare Workers", "Better Auth", "BlockNote"],
    liveUrl: "https://cowrite.tnuell.sbs",
    githubUrl: "https://github.com/ulot2/cowrite",
  },
  {
    id: 2,
    title: "SoloStack",
    question: "What if African freelancers had one workspace?",
    kind: "Web app",
    description: "An all-in-one workspace for African freelancers.",
    stack: ["Next.js", "Postgres", "Prisma", "Auth.js", "Inngest"],
    liveUrl: "https://solostack.ng/",
    githubUrl: "#",
  },
  {
    id: 3,
    title: "Dee's Agora",
    question: "What if online debate had real structure?",
    kind: "Web app",
    description: "Better arguments begin with better questions.",
    stack: ["Next.js", "Postgres", "Prisma", "Supabase", "Auth.js"],
    liveUrl: "https://www.deesagora.online",
    // Private repo — the live site is the only public entry point.
    githubUrl: "#",
  },
  {
    id: 4,
    title: "BAMSSALADS Quiz Club",
    question: "What if a quiz club ran on phone buzzers?",
    kind: "Web app",
    description:
      "Built for a university quiz club: the host runs the contest on stage while contestants buzz in from their own phones.",
    stack: ["Next.js", "Postgres", "Prisma", "Web Push"],
    liveUrl: "https://bamssalads-quiz.vercel.app",
    // Private repo — the live site is the only public entry point.
    githubUrl: "#",
  },
  {
    id: 5,
    title: "gitmop",
    question: "What if stale git branches cleaned themselves up?",
    kind: "Command-line tool",
    description:
      "Lists the merged and squash-merged leftovers, then deletes them in one go. No dependencies.",
    stack: ["Node.js", "TypeScript"],
    liveUrl: "https://www.npmjs.com/package/gitmop",
    githubUrl: "https://github.com/ulot2/gitmop",
  },
  {
    id: 6,
    title: "Readtrail",
    question: "What if your browser kept everything you read?",
    kind: "Chrome extension",
    description:
      "Saves the text of pages you actually read to a local database you can search offline. Nothing leaves your computer.",
    stack: ["Chrome Manifest V3", "SQLite (WebAssembly)", "Readability"],
    liveUrl: "",
    githubUrl: "https://github.com/ulot2/readtrail",
  },
  {
    id: 7,
    title: "hallway",
    question: "What if a first-time user checked your UI wording?",
    kind: "GitHub Action",
    description:
      "Checks the wording of changed UI, and fails the build only on checks proven to match human review.",
    stack: ["GitHub Actions", "Playwright", "axe-core"],
    liveUrl: "",
    githubUrl: "https://github.com/ulot2/hallway",
  },
  {
    id: 8,
    title: "LaseTales",
    question: "What if an event videographer had a home for their films?",
    kind: "Website",
    description: "A portfolio for an event videographer and editor.",
    stack: ["Next.js", "Three.js", "GSAP", "Framer Motion"],
    liveUrl: "https://lasetales.vercel.app/",
    githubUrl: "#",
  },
];

/** How many projects the home page shows before "All projects". */
export const HOME_PROJECT_COUNT = 6;

const isUrl = (url: string) => url.startsWith("http");

/** The live site if there is one, else the code; null when neither is public yet. */
export const projectHref = (project: Project) =>
  isUrl(project.liveUrl) ? project.liveUrl : isUrl(project.githubUrl) ? project.githubUrl : null;

/** The public code, when there is some. */
export const projectCode = (project: Project) => (isUrl(project.githubUrl) ? project.githubUrl : null);

/** The live site, when there is one. */
export const projectLive = (project: Project) => (isUrl(project.liveUrl) ? project.liveUrl : null);
