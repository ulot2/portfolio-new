export interface Project {
  id: number;
  title: string;
  description: string;
  liveUrl: string;
  githubUrl: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "cowrite",
    description:
      "A shared writing tool with live cursors, comments, and version history.",
    liveUrl: "https://cowrite.cowrite.workers.dev",
    githubUrl: "https://github.com/ulot2/cowrite",
  },
  {
    id: 2,
    title: "SoloStack",
    description: "An all-in-one workspace for African freelancers.",
    liveUrl: "https://solostack.ng/",
    githubUrl: "#",
  },
  {
    id: 3,
    title: "Dee's Agora",
    description:
      "Better arguments begin with better questions — a community for structured online debate.",
    liveUrl: "https://www.deesagora.online",
    // Private repo — the live site is the only public entry point.
    githubUrl: "#",
  },
  {
    id: 4,
    title: "BAMSSALADS Quiz Club",
    description:
      "A university quiz platform with live stage contests and phone buzzers.",
    liveUrl: "https://bamssalads-quiz.vercel.app",
    // Private repo — the live site is the only public entry point.
    githubUrl: "#",
  },
  {
    id: 5,
    title: "gitmop",
    description:
      "A command-line tool that finds and deletes stale local git branches. No dependencies.",
    liveUrl: "https://www.npmjs.com/package/gitmop",
    githubUrl: "https://github.com/ulot2/gitmop",
  },
  {
    id: 6,
    title: "Readtrail",
    description:
      "A Chrome extension that keeps an offline, searchable archive of the pages you read.",
    liveUrl: "",
    githubUrl: "https://github.com/ulot2/readtrail",
  },
  {
    id: 7,
    title: "hallway",
    description:
      "A GitHub Action that tests whether your UI wording makes sense to a first-time user.",
    liveUrl: "",
    githubUrl: "https://github.com/ulot2/hallway",
  },
  {
    id: 8,
    title: "LaseTales",
    description: "A portfolio for an event videographer and editor",
    liveUrl: "https://lasetales.vercel.app/",
    githubUrl: "#",
  },
];
