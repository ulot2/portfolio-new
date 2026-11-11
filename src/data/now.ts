// The "Now" note on the home page: what I'm working on at the moment.
// Edit the entries and move `updated` forward whenever this changes.
// A note that looks stale does more harm than no note, so keep it current
// (once a month is plenty) or take the section out.

export interface NowEntry {
  /** The thing itself, set in bold. The hero names the first two. */
  title: string;
  /** One or two sentences on where it stands. */
  note: string;
  /** Optional link, opened in a new tab. */
  href?: string;
}

/** The day the note was last updated, as YYYY-MM-DD. */
export const NOW_UPDATED = "2026-11-11";

/** Where I am, shown under the note. */
export const NOW_PLACE = "Lagos, Nigeria";

export const NOW: NowEntry[] = [
  {
    title: "SecondLook",
    note: "The checks on real application files work. Next, it learns to read the requirements straight from the instructions you paste in.",
  },
  {
    title: "Roost",
    note: "An Android app that keeps a history of your notifications, holds the noisy ones, and hands them over in a summary at the times you choose.",
  },
  {
    title: "Museum of Ordinary Things",
    note: "Opening the public collection, where keepers can choose to show their exhibits, and adding a way to save the ones you'd keep.",
    href: "https://moot.tnuell.sbs",
  },
  {
    title: "Ferry",
    note: "Moving clipboard text and images between my Windows laptop and Android phone, encrypted end to end.",
    href: "https://github.com/ulot2/ferry",
  },
];
