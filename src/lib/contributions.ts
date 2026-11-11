import { unstable_cache } from "next/cache";

// The GitHub contribution counts behind the "year in one line" above the footer.
//
// With GITHUB_TOKEN set (a fine-grained token with no extra permissions is
// enough), the counts come from GitHub's GraphQL API, the official source.
// Without it, they are read from the public contributions page that GitHub
// profiles load, which needs no token but could change shape one day.
// Either way a failure returns null and the section hides itself.
//
// Private work only counts if "Private contributions" is turned on in the
// GitHub profile settings.

const USER = "ulot2";

export interface ContributionDay {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface Contributions {
  days: ContributionDay[];
  /** null when only activity levels were readable, not exact counts. */
  total: number | null;
}

async function fromApi(token: string): Promise<{ days: ContributionDay[]; exact: boolean }> {
  const query = `query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          weeks { contributionDays { date contributionCount } }
        }
      }
    }
  }`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { login: USER } }),
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const json = await res.json();
  const weeks: { contributionDays: { date: string; contributionCount: number }[] }[] =
    json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];
  const days = weeks.flatMap((w) => w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount })));
  return { days, exact: true };
}

/** Reads the HTML table GitHub's own profile page loads. */
async function fromProfile(): Promise<{ days: ContributionDay[]; exact: boolean }> {
  const res = await fetch(`https://github.com/users/${USER}/contributions`, {
    headers: { "User-Agent": "portfolio-contributions", Accept: "text/html" },
  });
  if (!res.ok) throw new Error(`GitHub page ${res.status}`);
  return parseContributionsPage(await res.text());
}

/** Exported for scripts/check-contributions.ts. */
export function parseContributionsPage(html: string): { days: ContributionDay[]; exact: boolean } {
  // Each day is a <td> with data-date, data-level (0 to 4) and an id; its count
  // is in a <tool-tip for="that id">, e.g. "3 contributions on October 6th."
  const attr = (tag: string, name: string) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];
  const counts = new Map<string, number>();
  for (const m of html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const text = m[2].trim();
    counts.set(m[1], /^no contributions/i.test(text) ? 0 : Number(text.match(/^([\d,]+)/)?.[1].replace(/,/g, "") ?? NaN));
  }

  const days: ContributionDay[] = [];
  let exact = counts.size > 0;
  for (const m of html.matchAll(/<td\b[^>]*\bdata-date="[^"]+"[^>]*>/g)) {
    const tag = m[0];
    const date = attr(tag, "data-date")!;
    const id = attr(tag, "id");
    const fromTip = id ? counts.get(id) : undefined;
    if (fromTip !== undefined && Number.isFinite(fromTip)) {
      days.push({ date, count: fromTip });
    } else {
      // No readable count: fall back to the 0–4 shading level, so the shape survives.
      exact = false;
      days.push({ date, count: Number(attr(tag, "data-level") ?? 0) });
    }
  }
  days.sort((a, b) => a.date.localeCompare(b.date));
  return { days, exact };
}

/** A made-up year, for working on the design locally (CONTRIBUTIONS_SAMPLE=1 in development only). */
function sample(): { days: ContributionDay[]; exact: boolean } {
  const days: ContributionDay[] = [];
  const end = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(end);
    d.setUTCDate(end.getUTCDate() - i);
    const wave = Math.max(0, Math.sin(i / 23) * 4 + Math.sin(i / 7.3) * 2 + 3);
    const burst = i > 40 && i < 60 ? 9 : i > 150 && i < 165 ? 6 : 0;
    days.push({ date: d.toISOString().slice(0, 10), count: Math.round(wave + burst * ((i * 7919) % 3 === 0 ? 1 : 0.4)) });
  }
  return { days, exact: true };
}

async function load(): Promise<Contributions | null> {
  try {
    const token = process.env.GITHUB_TOKEN;
    const { days, exact } = sampleMode()
      ? sample()
      : token
        ? // A bad or expired token falls back to the public page rather than hiding the line.
          await fromApi(token).catch((err) => {
            console.error("GitHub API failed, reading the public page instead:", err);
            return fromProfile();
          })
        : await fromProfile();
    // Fewer than half a year of days means the page changed or the read failed.
    if (days.length < 180) return null;
    return { days, total: exact ? days.reduce((sum, d) => sum + d.count, 0) : null };
  } catch (err) {
    console.error("Could not load GitHub contributions:", err);
    return null;
  }
}

const sampleMode = () => process.env.NODE_ENV !== "production" && process.env.CONTRIBUTIONS_SAMPLE === "1";

const cached = unstable_cache(load, ["github-contributions"], { revalidate: 86_400 });

/**
 * Fetched at most once a day; the page never waits on GitHub after that.
 * The sample skips the cache, so it can never be stored and served as real data.
 */
export const getContributions = () => (sampleMode() ? load() : cached());
