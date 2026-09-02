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
    title: "LaseTales",
    description: "A portfolio for an event videographer and editor",
    liveUrl: "https://lasetales.vercel.app/",
    githubUrl: "#",
  },
  {
    id: 3,
    title: "Ville Dishes",
    description:
      "A landing page for a restaurant called Ville Dishes, built with Nextjs and Tailwind CSS.",
    liveUrl: "https://ville-dishes.vercel.app/",
    githubUrl: "https://github.com/ulot2/ville-dishes.git",
  },
];
