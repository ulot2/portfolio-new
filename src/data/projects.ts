export interface Project {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  image2: string;
  image3: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  category: string;
  features: string[];
}

export const projects: Project[] = [
  {
    id: 9,
    title: "PostFlow",
    description:
      "A lightweight SaaS platform designed to replace messy spreadsheets with an intuitive, drag-and-drop social media content calendar.",
    fullDescription:
      "PostFlow is a modern content planning tool built for creators and social media managers. It eliminates the chaos of planning content across different platforms by offering a centralized, highly visual workspace. Users can draft content, see live pixel-perfect previews for platforms like Twitter and LinkedIn, and effortlessly organize their schedule using a real-time drag-and-drop calendar. With built-in multi-workspace support, managing both personal brands and client accounts has never been smoother.",
    image: "/images/postflow-main.png", // Make sure to update these paths when you take screenshots
    image2: "/images/postflow-1.png",
    image3: "/images/postflow-2.png",
    technologies: [
      "Next.js",
      "Convex",
      "Tailwind CSS",
      "Shadcn UI",
      "dnd-kit",
      "Clerk",
    ],
    liveUrl: "/", // Placeholder
    githubUrl: "https://github.com/ulot2/postflow", // Placeholder
    category: "SaaS Application",
    features: [
      "Interactive drag-and-drop scheduling",
      "Live platform-specific post previews",
      "Multi-workspace account switching",
      "Real-time database synchronization",
    ],
  },
  {
    id: 1,
    title: "PromptNest",
    description:
      "PromptNest is a community-driven library for discovering, sharing, and organizing high-quality AI prompts.",
    fullDescription:
      "PromptNest was built to solve the frustration of finding reliable AI prompts. Instead of guessing, browse a curated collection of prompts verified by the community. Whether you are debugging code, writing marketing copy, or generating art, PromptNest gives you the tools to share your expertise and learn from others. Sign in to start building your personal library and contribute to the growing knowledge base.",
    image: "/images/promptnest-main.png",
    image2: "/images/promptnest-1.png",
    image3: "/images/promptnest-2.png",
    technologies: ["Next.js", "Prisma", "Tailwind CSS", "motion/react"],
    liveUrl: "https://prompt-nest-eta.vercel.app/",
    githubUrl: "https://github.com/ulot2/portfolio-new.git",
    category: "AI Prompt Library",
    features: [
      "Community-driven prompt sharing",
      "Curated & verified collection",
      "User-friendly organization tools",
    ],
  },
  {
    id: 2,
    title: "BiblioQuest",
    description:
      "BiblioQuest is an immersive 'Infinite' Text Adventure platform designed to push the boundaries of procedural storytelling.",
    fullDescription:
      "BiblioQuest is an immersive 'Infinite' Text Adventure platform designed to push the boundaries of procedural storytelling. Built with a focus on narrative depth over traditional combat, the project leverages AI to create a living world where players navigate intricate story arcs and solve logic-based puzzles.\n\nKey features include:\n\nDynamic Narrative Engine: A system that adapts the story in real-time based on player decisions, ensuring no two playthroughs are the same.\n\nInteraction-First Gameplay: Replaces standard combat loops with complex dialogue systems and environmental puzzles.\n\nCustom Quest Architecture: Allows for the integration of tailored quests and specific story modes, providing a structured yet boundless exploration experience.\n\nTech Stack: Developed using Next.js for a seamless UI/UX and integrated with advanced AI models to handle natural language generation and world-building logic.",
    image: "/images/biblio-main.png",
    image2: "/images/biblio-1.png",
    image3: "/images/biblio-2.png",
    technologies: ["Next.js", "Tailwind CSS", "Google Books API", "Groq AI"],
    liveUrl: "https://biblioquest-gilt.vercel.app/",
    githubUrl: "https://github.com/ulot2/biblio-quest.git",
    category: "Interactive Storytelling",
    features: [
      "AI-generated infinite narratives",
      "Dynamic choices & consequences",
      "Immersive text-based interface",
    ],
  },
  {
    id: 3,
    title: "Ville Dishes",
    description:
      "A landing page for a restaurant called Ville Dishes, built with Nextjs and Tailwind CSS.",
    fullDescription:
      "Ville Dishes is a premium restaurant landing page built with Next.js and Tailwind CSS. It features a modern, responsive design with smooth scroll animations and a stunning hero section that captures the essence of a fine dining experience. The page includes a detailed menu section of mouth-watering dishes, delivery process and a CTA.",
    image: "/images/ville-main.png",
    image2: "/images/ville-1.png",
    image3: "/images/ville-2.png",
    technologies: ["Nextjs", "Tailwind CSS"],
    liveUrl: "https://ville-dishes.vercel.app/",
    githubUrl: "https://github.com/ulot2/ville-dishes.git",
    category: "Restaurant Landing Page",
    features: [
      "Mouth-watering menu showcase",
      "Smooth scroll animations",
      "Responsive mobile-first design",
    ],
  },

  {
    id: 4,
    title: "Thrive Forge",
    description:
      "A high-performance landing page for a digital marketing agency, built with Next.js and Framer Motion. It features a conversion-focused layout, sleek scroll animations, and a responsive multi-tier pricing system.",
    fullDescription:
      "Built for a global performance agency, this Next.js project focuses on professional branding and lead generation. It incorporates motion/react for smooth, interactive storytelling and showcases complex service frameworks and client case studies. The site is optimized for speed and clarity, providing a seamless user experience that guides prospects from value proposition to lead capture.",
    image: "/images/thrive-main.png",
    image2: "/images/thrive-1.png",
    image3: "/images/thrive-2.png",
    technologies: ["Next.js", "motion/react", "Tailwind CSS"],
    liveUrl: "https://www.thriveforge.site/",
    githubUrl: "https://github.com/ulot2/Browser-Extensions.git",
    category: "Agency Landing Page",
    features: [
      "High-performance animations",
      "Conversion-focused layout",
      "Multi-tier pricing system",
    ],
  },

  {
    id: 5,
    title: "Weather app",
    description:
      "A weather application that provides real-time updates and detailed forecasts, helping users stay informed about current conditions with ease.",
    fullDescription:
      "A sleek, modern weather application built with React and OpenWeather API. This project features a dynamic user interface that displays current weather conditions, hourly forecasts, and extended daily outlooks. Users can search for any city worldwide and receive detailed meteorological data, including temperature, humidity, wind speed, and precipitation probability. The design emphasizes clarity and ease of use, making it simple for anyone to check the weather at a glance.",
    image: "/images/weather.png",
    image2: "/images/weather-1.png",
    image3: "/images/weather-2.png",
    technologies: ["React", "CSS", "OpenWeather API"],
    liveUrl: "https://weather-app-tolu.vercel.app/",
    githubUrl: "https://github.com/ulot2/weather-app.git",
    category: "Utility Tool",
    features: [
      "Real-time weather data",
      "Global city search",
      "Detailed hourly forecasts",
    ],
  },

  // {
  //   id: 6,
  //   title: "The B2 Foundation",
  //   description:
  //     "A nonprofit website for The B2 Foundation dedicated to reducing litter, promoting recycling, and inspiring community efforts toward a cleaner environment.",
  //   fullDescription: "wow",
  //   image: "/images/b2-foundation.png",
  //   image2: "/images/b2-foundation-1.png",
  //   image3: "/images/b2-foundation-2.png",
  //   technologies: ["React", "CSS"],
  //   liveUrl: "https://the-b2-foundation2.vercel.app/",
  //   githubUrl: "https://github.com/ulot2/the-b2-foundation.git",
  //   category: "Non-Profit Website",
  //   features: [
  //     "Clean & accessible design",
  //     "Community engagement focus",
  //     "Mobile-responsive layout",
  //   ],
  // },
  {
    id: 7,
    title: "Age Calculator",
    description:
      "A simple age calculator application that determines someone's age precisely from their date of birth, offering accuracy, simplicity, and ease.",
    fullDescription:
      "This Age Calculator application provides a precise breakdown of a user's age in years, months, and days. Built with React, it features robust form validation and error handling to ensure accurate date inputs. The project focuses on a clean, minimalist UI and responsive design, providing a smooth and accessible experience across all devices.",
    image: "/images/age-calculator.png",
    image2: "/images/age-calc-1.png",
    image3: "/images/age-calc-2.png",
    technologies: ["React", "CSS"],
    liveUrl: "https://age-calculator-ulot2.vercel.app/",
    githubUrl: "https://github.com/ulot2/age-calculator.git",
    category: "Utility Tool",
    features: [
      "Precise age calculation",
      "Robust input validation",
      "Minimalist responsive UI",
    ],
  },
];
