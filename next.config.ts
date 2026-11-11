import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["gray-matter"],
  // The resume became the CV; old links (LinkedIn, applications) still land on it.
  async redirects() {
    return [{ source: "/resume.pdf", destination: "/cv.pdf", permanent: true }];
  },
};

export default nextConfig;
