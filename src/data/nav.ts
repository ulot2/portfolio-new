// The site index, shared by the desktop margin rail and the mobile dock so the
// two can't drift apart. Labels mirror the page's own section headings rather
// than inventing umbrella terms — the id stays as it is in the markup.
import { BLOG_URL } from "@/lib/site";

export interface NavItem {
  /** Section element id on the home page, or null for a separate route. */
  id: string | null;
  label: string;
  /** Set for items that are their own site rather than an in-page anchor. */
  route?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "work", label: "Projects" },
  { id: "writing", label: "Writing" },
  { id: "skills", label: "Tools & Skills" },
  { id: "contact", label: "Contact" },
  { id: null, label: "Blog", route: BLOG_URL },
];

/** Section ids in page order, for the scroll-spy. */
export const SECTION_IDS = NAV_ITEMS.flatMap((item) =>
  item.id ? [item.id] : [],
);
