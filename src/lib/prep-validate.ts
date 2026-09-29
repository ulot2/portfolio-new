/**
 * Types and input checks for the interview prep app at prep.tnuell.sbs.
 *
 * No imports on purpose, so `node --test` can load this file directly
 * (see prep-validate.test.mjs). Every parser returns the clean value, or a
 * string that says what is wrong. Unknown fields are dropped, never stored.
 */

export const TRACKS = ["js", "browser", "react", "fe-design", "be-design"] as const;
export const CARD_TYPES = ["explain", "short", "mc", "build"] as const;
export const MARKS = ["got", "partly", "missed"] as const;

export type Track = (typeof TRACKS)[number];
export type CardType = (typeof CARD_TYPES)[number];
export type Mark = (typeof MARKS)[number];

/** Written by the run. */
export type Topic = { id: string; track: Track; title: string; order: number };

/** Written by the run. For `mc`, `answer` is the text of the correct choice. */
export type Card = {
  id: string;
  topicId: string;
  type: CardType;
  prompt: string;
  answer: string;
  choices?: string[];
  keyPoints?: string[];
  minutes?: number;
};

/** The site writes the first block of fields. The run only adds the grade block. */
export type Attempt = {
  id: string;
  cardId: string;
  at: string;
  answer: string;
  selfMark: Mark;
  minutes?: number;
  grade?: Mark;
  feedback?: string;
  gradedAt?: string;
  tests?: string;
};

export const MAX_ANSWER = 8000;
const MAX_TEXT = 20000;
const SLUG = /^[a-z0-9][a-z0-9-]{0,79}$/;

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const isText = (v: unknown, max = MAX_TEXT): v is string =>
  typeof v === "string" && v.trim().length > 0 && v.length <= max;
const isTextList = (v: unknown): v is string[] =>
  Array.isArray(v) && v.length > 0 && v.length <= 20 && v.every((s) => isText(s, 2000));
const oneOf = <T extends string>(list: readonly T[], v: unknown): v is T =>
  typeof v === "string" && (list as readonly string[]).includes(v);
const isMinutes = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 300;

/** A topic from the run, plus its optional lesson text. */
export function parseTopic(v: unknown): { topic: Topic; lesson?: string } | string {
  if (!isObj(v)) return "topic is not an object";
  if (typeof v.id !== "string" || !SLUG.test(v.id)) return "topic id must be a lowercase slug";
  if (!oneOf(TRACKS, v.track)) return `topic ${v.id}: unknown track`;
  if (!isText(v.title, 200)) return `topic ${v.id}: title is missing`;
  if (typeof v.order !== "number" || !Number.isFinite(v.order)) return `topic ${v.id}: order must be a number`;
  if (v.lesson !== undefined && !isText(v.lesson, 100000)) return `topic ${v.id}: lesson is empty or too long`;
  const topic: Topic = { id: v.id, track: v.track, title: v.title.trim(), order: v.order };
  return v.lesson === undefined ? { topic } : { topic, lesson: v.lesson as string };
}

/** A card from the run. `topicIds` is every topic that exists after this push. */
export function parseCard(v: unknown, topicIds: Set<string>): Card | string {
  if (!isObj(v)) return "card is not an object";
  if (typeof v.id !== "string" || !SLUG.test(v.id)) return "card id must be a lowercase slug";
  if (typeof v.topicId !== "string" || !topicIds.has(v.topicId)) return `card ${v.id}: unknown topic`;
  if (!oneOf(CARD_TYPES, v.type)) return `card ${v.id}: unknown type`;
  if (!isText(v.prompt)) return `card ${v.id}: prompt is missing`;
  if (!isText(v.answer)) return `card ${v.id}: answer is missing`;

  const card: Card = { id: v.id, topicId: v.topicId, type: v.type, prompt: v.prompt, answer: v.answer };
  if (v.type === "mc") {
    if (!isTextList(v.choices) || v.choices.length < 2) return `card ${v.id}: mc needs two or more choices`;
    if (!v.choices.includes(v.answer)) return `card ${v.id}: answer must be one of the choices`;
    card.choices = v.choices;
  }
  if (v.keyPoints !== undefined) {
    if (!isTextList(v.keyPoints)) return `card ${v.id}: keyPoints must be a list of text`;
    card.keyPoints = v.keyPoints;
  }
  if (v.type === "build") {
    if (!isMinutes(v.minutes) || v.minutes === 0) return `card ${v.id}: build needs minutes from 1 to 300`;
    card.minutes = v.minutes;
  }
  return card;
}

/** A grade from the run. Only these fields can reach an attempt. */
export function parseGrade(
  v: unknown,
): { attemptId: string; grade: Mark; feedback: string; tests?: string } | string {
  if (!isObj(v)) return "grade is not an object";
  if (typeof v.attemptId !== "string" || !v.attemptId) return "grade needs an attemptId";
  if (!oneOf(MARKS, v.grade)) return `grade ${v.attemptId}: grade must be got, partly, or missed`;
  if (!isText(v.feedback, 4000)) return `grade ${v.attemptId}: feedback is missing or too long`;
  if (v.tests !== undefined && !isText(v.tests, 200)) return `grade ${v.attemptId}: tests must be short text`;
  const out = { attemptId: v.attemptId, grade: v.grade, feedback: v.feedback };
  return v.tests === undefined ? out : { ...out, tests: v.tests as string };
}

/**
 * An answer from the Study page, checked against its card. The server marks
 * an `mc` answer itself and never trusts a mark sent for one.
 */
export function parseAnswer(
  v: unknown,
  card: Card,
): Pick<Attempt, "answer" | "selfMark" | "minutes" | "grade"> | string {
  if (!isObj(v)) return "Bad request.";
  if (typeof v.answer !== "string") return "answer must be text.";
  const answer = v.answer.slice(0, MAX_ANSWER);

  if (v.minutes !== undefined && !isMinutes(v.minutes)) return "minutes must be a number from 0 to 300.";
  const minutes = v.minutes as number | undefined;

  if (card.type === "mc") {
    if (!card.choices?.includes(answer)) return "Pick one of the choices.";
    const mark: Mark = answer === card.answer ? "got" : "missed";
    return { answer, selfMark: mark, grade: mark };
  }

  if (card.type !== "build" && !answer.trim()) return "Write an answer first.";
  if (!oneOf(MARKS, v.selfMark)) return "selfMark must be got, partly, or missed.";
  return minutes === undefined ? { answer, selfMark: v.selfMark } : { answer, selfMark: v.selfMark, minutes };
}
