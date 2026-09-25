import Link from "next/link";
import { SITE_URL } from "@/lib/site";

export default function NotFound() {
  return (
    <main className="site-container" id="main">
      <section className="section">
        <h1 className="contact-title">Page not found.</h1>
        <p className="contact-intro">
          This page does not exist or has moved.
        </p>
        {/* Absolute URL: this page also renders on the blog and jobs subdomains. */}
        <Link href={SITE_URL} className="main-email-link">
          Go to the home page
        </Link>
      </section>
    </main>
  );
}
