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
    title: "SoloStack",
    description: "An all-in-one workspace for African freelancers.",
    liveUrl: "https://solostack.ng/",
    githubUrl: "#",
  },
  {
    id: 2,
    title: "PostFlow",
    description:
      "An intuitive, drag-and-drop social media calendar that replaces messy spreadsheets.",
    liveUrl: "/", // Placeholder
    githubUrl: "https://github.com/ulot2/postflow", // Placeholder
  },
  // {
  //   id: 3,
  //   title: "PromptNest",
  //   description:
  //     "PromptNest is a community-driven library for discovering, sharing, and organizing high-quality AI prompts.",
  //   liveUrl: "https://prompt-nest-eta.vercel.app/",
  //   githubUrl: "https://github.com/ulot2/portfolio-new.git",
  // },
  {
    id: 4,
    title: "Ville Dishes",
    description:
      "A landing page for a restaurant called Ville Dishes, built with Nextjs and Tailwind CSS.",
    liveUrl: "https://ville-dishes.vercel.app/",
    githubUrl: "https://github.com/ulot2/ville-dishes.git",
  },
];
