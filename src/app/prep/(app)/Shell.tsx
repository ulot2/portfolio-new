"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, Code2, LayoutDashboard, Menu, MessageSquare, Play, Search, X } from "lucide-react";

const NAV = [
  { href: "/", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/study", label: "Study", Icon: Play },
  { href: "/topics", label: "Topics", Icon: BookOpen },
  { href: "/builds", label: "Builds", Icon: Code2 },
  { href: "/feedback", label: "Feedback", Icon: MessageSquare },
];

/** When the viewer last opened Feedback. Per browser, because only you read it. */
export const SEEN_KEY = "prep:feedbackSeen";

type Props = {
  lastRun: string | null;
  gradedAt: string[];
  topics: { id: string; title: string }[];
  children: React.ReactNode;
};

export default function Shell({ lastRun, gradedAt, topics, children }: Props) {
  const router = useRouter();
  // The browser sees /study on prep.<domain>; the server route is /prep/study.
  // Accept both, so the active link is right on either side of hydration.
  const path = usePathname().replace(/^\/prep(?=\/|$)/, "") || "/";
  const active = NAV.find((n) => (n.href === "/" ? path === "/" : path.startsWith(n.href)));
  const title = path.startsWith("/topics/") ? "Topic" : active?.label ?? "Prep";

  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  useEffect(() => {
    try {
      if (path.startsWith("/feedback")) {
        localStorage.setItem(SEEN_KEY, new Date().toISOString());
        setUnread(0);
      } else {
        const seen = localStorage.getItem(SEEN_KEY) ?? "";
        setUnread(gradedAt.filter((g) => g > seen).length);
      }
    } catch {
      setUnread(0); // storage blocked: no badge rather than a wrong one
    }
  }, [path, gradedAt]);

  function search(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
    if (!q) return;
    const hit = topics.find((t) => t.title.toLowerCase() === q.toLowerCase());
    router.push(hit ? `/topics/${hit.id}` : `/topics?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="prep-app" data-open={open}>
      <aside className="prep-side" id="prep-nav" aria-label="Main">
        <Link href="/" className="prep-brand">
          prep<span>.</span>
        </Link>
        <nav>
          {NAV.map(({ href, label, Icon }) => (
            <Link key={href} href={href} className="prep-nav" aria-current={active?.href === href ? "page" : undefined}>
              <Icon size={16} aria-hidden="true" />
              {label}
              {href === "/feedback" && unread > 0 && (
                <span className="prep-badge" aria-label={`${unread} unread`}>
                  {unread}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <p className="prep-run">
          <span className={lastRun ? "dot" : "dot off"} aria-hidden="true" />
          {lastRun ? (
            <span suppressHydrationWarning>
              Last run{" "}
              {new Date(lastRun).toLocaleString([], { weekday: "short", hour: "numeric", minute: "2-digit" })}
            </span>
          ) : (
            "No run yet"
          )}
        </p>
      </aside>

      <button className="prep-backdrop" aria-label="Close menu" tabIndex={-1} onClick={() => setOpen(false)} />

      <div className="prep-main">
        <header className="prep-top">
          <button
            className="prep-icon-btn prep-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="prep-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <h1>{title}</h1>
          <form className="prep-search" role="search" onSubmit={search}>
            <Search size={14} aria-hidden="true" />
            <label htmlFor="prep-q" className="visually-hidden">
              Search topics
            </label>
            <input id="prep-q" name="q" list="prep-topics" placeholder="Search topics" autoComplete="off" />
            <datalist id="prep-topics">
              {topics.map((t) => (
                <option key={t.id} value={t.title} />
              ))}
            </datalist>
          </form>
          <Link href="/study" className="prep-btn primary">
            Start session
          </Link>
        </header>
        <main id="main" className="prep-content">
          {children}
        </main>
      </div>
    </div>
  );
}
