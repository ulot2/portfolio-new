export interface Project {
  id: number;
  title: string;
  /** What sort of thing it is, shown as a small label under the name. */
  kind: "Web app" | "Website" | "Command-line tool" | "Chrome extension" | "GitHub Action";
  description: string;
  liveUrl: string;
  githubUrl: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "cowrite",
    kind: "Web app",
    description:
      "Comment, suggest edits and restore any earlier version. It keeps working offline and merges when you reconnect.",
    liveUrl: "https://cowrite.cowrite.workers.dev",
    githubUrl: "https://github.com/ulot2/cowrite",
  },
  {
    id: 2,
    title: "SoloStack",
    kind: "Web app",
    description: "An all-in-one workspace for African freelancers.",
    liveUrl: "https://solostack.ng/",
    githubUrl: "#",
  },
  {
    id: 3,
    title: "Dee's Agora",
    kind: "Web app",
    description: "Better arguments begin with better questions.",
    liveUrl: "https://www.deesagora.online",
    // Private repo — the live site is the only public entry point.
    githubUrl: "#",
  },
  {
    id: 4,
    title: "BAMSSALADS Quiz Club",
    kind: "Web app",
    description:
      "Built for a university quiz club: the host runs the contest on stage while contestants buzz in from their own phones.",
    liveUrl: "https://bamssalads-quiz.vercel.app",
    // Private repo — the live site is the only public entry point.
    githubUrl: "#",
  },
  {
    id: 5,
    title: "gitmop",
    kind: "Command-line tool",
    description:
      "Lists the merged and squash-merged leftovers, then deletes them in one go. No dependencies.",
    liveUrl: "https://www.npmjs.com/package/gitmop",
    githubUrl: "https://github.com/ulot2/gitmop",
  },
  {
    id: 6,
    title: "Readtrail",
    kind: "Chrome extension",
    description:
      "Saves the text of pages you actually read to a local database you can search offline. Nothing leaves your computer.",
    liveUrl: "",
    githubUrl: "https://github.com/ulot2/readtrail",
  },
  {
    id: 7,
    title: "hallway",
    kind: "GitHub Action",
    description:
      "Checks the wording of changed UI, and fails the build only on checks proven to match human review.",
    liveUrl: "",
    githubUrl: "https://github.com/ulot2/hallway",
  },
  {
    id: 8,
    title: "LaseTales",
    kind: "Website",
    description: "A portfolio for an event videographer and editor.",
    liveUrl: "https://lasetales.vercel.app/",
    githubUrl: "#",
  },
];
