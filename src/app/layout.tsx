import type { Metadata } from "next";
import { IBM_Plex_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "./components/CustomCursor";

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Toluwalope Adegoke — Frontend Developer",
  description:
    "Frontend developer building modern, thoughtful web experiences. Explore my portfolio of projects, skills, and get in touch.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plexMono.variable} ${cormorant.variable}`}>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
