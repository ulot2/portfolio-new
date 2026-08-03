import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "./components/CustomCursor";
import { ScrollToTop } from "./components/ScrollToTop";

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

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif-custom",
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
    icon: [
      { url: "/me.png?v=7", type: "image/png" },
    ],
    shortcut: "/me.png?v=7",
    apple: "/me.png?v=7",
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
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/me.png?v=7" type="image/png" />
        <link rel="apple-touch-icon" href="/me.png?v=7" />
        <link rel="shortcut icon" href="/me.png?v=7" />
      </head>
      <body className={`${jakarta.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}>
        <CustomCursor />
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
