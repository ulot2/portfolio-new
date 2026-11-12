import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["gray-matter"],
  // The resume was briefly served as /cv.pdf; links shared then still land on it.
  async redirects() {
    return [{ source: "/cv.pdf", destination: "/resume.pdf", permanent: true }];
  },
};

export default nextConfig;
