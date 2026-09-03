import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "./components/CustomCursor";
import { ScrollToTop } from "./components/ScrollToTop";
import { SectionRail } from "./components/SectionRail";
import { NavDock } from "./components/NavDock";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Toluwalope Adegoke — Software Engineer",
  description:
    "Frontend engineer crafting thoughtful, high-performance web applications with Next.js, React, and TypeScript.",
  keywords: [
    "Toluwalope Adegoke",
    "Software Engineer",
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Portfolio",
  ],
  authors: [{ name: "Toluwalope Adegoke" }],
  creator: "Toluwalope Adegoke",
  icons: {
    icon: [{ url: "/me.png", type: "image/png" }],
    shortcut: "/me.png",
    apple: "/me.png",
  },
  openGraph: {
    title: "Toluwalope Adegoke — Software Engineer",
    description:
      "Frontend engineer crafting thoughtful, high-performance web applications with Next.js, React, and TypeScript.",
    siteName: "Toluwalope Adegoke Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/me.png",
        width: 512,
        height: 512,
        alt: "Toluwalope Adegoke",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Toluwalope Adegoke — Software Engineer",
    description:
      "Frontend engineer crafting thoughtful, high-performance web applications with Next.js, React, and TypeScript.",
    creator: "@Tolu_dev",
    images: ["/me.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The font variables belong on <html>, not <body>: globals.css builds
  // --font-sans / --font-code from them on :root, and a var() that can't
  // resolve where it is declared invalidates the whole stack.
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrainsMono.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <CustomCursor />
        <SectionRail />
        {children}
        <ScrollToTop />
        <NavDock />
      </body>
    </html>
  );
}
