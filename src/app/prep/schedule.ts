/**
 * The study logic of the prep app: Leitner boxes, due dates, stats, and the
 * queue for a study session. Pure functions, used by the pages and by
 * schedule.test.mjs. Type-only imports, so `node --test` can load this file.
 *
 * Days are UTC dates ("2026-09-29"). ponytail: in Lagos a day starts at 1 am
 * local time. Pass the viewer's time zone through if that ever matters.
 */
import type { Attempt, Card, Mark, Topic } from "../../lib/prep-validate";

/** Days until a card comes back, for boxes 1 to 5. */
export const INTERVALS = [1, 3, 7, 14, 30];
/** Minutes per item. A build card uses its own `minutes`. */
export const MINUTES = { lesson: 10, explain: 5, short: 2, mc: 1 };
export const BUDGETS = [15, 30, 60, 90];

export type CardState = { card: Card; attempts: Attempt[]; box: number; due: string | null };
export type TopicState = {
  topic: Topic;
  cards: CardState[];
  status: "new" | "learning" | "mastered";
  /** First pass done: every card except the build has an answer. */
  studied: boolean;
  /** Remembered: every card is in box 3 or higher. */
  learned: boolean;
};
export type QueueItem =
  | { kind: "lesson"; topic: Topic; minutes: number }
  | { kind: "card"; topic: Topic; card: Card; minutes: number };

export const day = (iso: string) => iso.slice(0, 10);
export const today = () => day(new Date().toISOString());

export function addDays(d: string, n: number): string {
  return day(new Date(Date.parse(d + "T00:00:00Z") + n * 86400000).toISOString());
}

/** The deep grade wins over the self-mark as soon as it exists. */
export const markOf = (a: Attempt): Mark => a.grade ?? a.selfMark;

export function cardState(card: Card, attempts: Attempt[]): CardState {
  const mine = attempts.filter((a) => a.cardId === card.id).sort((a, b) => a.at.localeCompare(b.at));
  let box = 1;
  for (const a of mine) {
    const m = markOf(a);
    if (m === "got") box = Math.min(5, box + 1);
    else if (m === "missed") box = 1;
  }
  const last = mine.at(-1);
  return { card, attempts: mine, box, due: last ? addDays(day(last.at), INTERVALS[box - 1]) : null };
}

export const cardMinutes = (card: Card) => (card.type === "build" ? card.minutes ?? 30 : MINUTES[card.type]);

/** Every topic in curriculum order, with the state of each of its cards. */
export function topicStates(topics: Topic[], cards: Card[], attempts: Attempt[]): TopicState[] {
  return [...topics]
    .sort((a, b) => a.order - b.order)
    .map((topic) => {
      const states = cards.filter((c) => c.topicId === topic.id).map((c) => cardState(c, attempts));
      const tried = states.filter((s) => s.attempts.length > 0);
      const status: TopicState["status"] =
        tried.length === 0 ? "new" : states.every((s) => s.box === 5) ? "mastered" : "learning";
      // A build can wait for a day with more time, so it does not block "studied".
      const core = states.filter((s) => s.card.type !== "build");
      const studied = core.length > 0 && core.every((s) => s.attempts.length > 0);
      const learned = states.length > 0 && tried.length === states.length && states.every((s) => s.box >= 3);
      return { topic, cards: states, status, studied, learned };
    });
}

export const isWeak = (s: CardState) => s.box === 1 && s.attempts.length >= 2;

/** Days in a row with an attempt, counting back from today (or from yesterday if today is still empty). */
export function streak(attempts: Attempt[], now = today()): number {
  const days = new Set(attempts.map((a) => day(a.at)));
  let d = days.has(now) ? now : addDays(now, -1);
  let n = 0;
  while (days.has(d)) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

/**
 * Fill `budget` minutes: due cards (oldest first), then the untried cards of
 * started topics, then new topics in order, each as its lesson plus its
 * cards. A build card that does not fit waits for a day with more time. The
 * queue always has at least one item.
 */
export function buildQueue(states: TopicState[], budget: number, now = today()): QueueItem[] {
  const items: QueueItem[] = [];
  let used = 0;
  const fits = (m: number) => used + m <= budget;
  const push = (item: QueueItem) => {
    items.push(item);
    used += item.minutes;
  };
  const cardItem = (topic: Topic, s: CardState): QueueItem => ({
    kind: "card",
    topic,
    card: s.card,
    minutes: cardMinutes(s.card),
  });

  const due = states
    .flatMap((t) => t.cards.filter((s) => s.due !== null && s.due <= now).map((s) => ({ t, s })))
    .sort((a, b) => a.s.due!.localeCompare(b.s.due!));
  const untried = states
    .filter((t) => t.status !== "new")
    .flatMap((t) => t.cards.filter((s) => s.attempts.length === 0).map((s) => ({ t, s })));

  for (const { t, s } of [...due, ...untried]) {
    const item = cardItem(t.topic, s);
    if (fits(item.minutes)) push(item);
  }

  // A new topic enters as one unit: its lesson and its non-build cards. A
  // lesson alone would leave the topic "new", so the lesson would come back.
  const unitOf = (t: TopicState): QueueItem[] => [
    { kind: "lesson", topic: t.topic, minutes: MINUTES.lesson },
    ...t.cards.filter((s) => s.card.type !== "build").map((s) => cardItem(t.topic, s)),
  ];
  const fresh = states.filter((t) => t.status === "new" && t.cards.length > 0);

  for (const t of fresh) {
    const unit = unitOf(t);
    if (!fits(unit.reduce((m, i) => m + i.minutes, 0))) break;
    unit.forEach(push);
    for (const s of t.cards.filter((s) => s.card.type === "build")) {
      const build = cardItem(t.topic, s);
      if (fits(build.minutes)) push(build);
    }
  }

  if (items.length === 0) {
    const first = due[0] ?? untried[0];
    if (first) push(cardItem(first.t.topic, first.s));
    else if (fresh[0]) unitOf(fresh[0]).forEach(push);
  }
  return items;
}
