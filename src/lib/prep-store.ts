import type { Redis } from "@upstash/redis";
import { getRedis } from "@/lib/redis";
import {
  parseCard,
  parseGrade,
  parseTopic,
  type Attempt,
  type Card,
  type Topic,
} from "@/lib/prep-validate";

export { getRedis };

/**
 * Storage for the interview prep app, on the same Upstash Redis as the jobs
 * dashboard. Everything is namespaced under `prep:`.
 *
 * Ownership, as in jobs-store: the run owns topics, lessons, cards, and the
 * grade fields of an attempt. The site owns everything else on an attempt.
 * applySync never writes a field the site owns, so a push cannot erase an
 * answer typed on the phone.
 */

const TOPICS = "prep:topics";
const LESSONS = "prep:lessons";
const CARDS = "prep:cards";
const ATTEMPTS = "prep:attempts";
const META = "prep:meta";

/** Upstash hands back a parsed object or the raw string, depending on how it was written. */
function decode<T>(value: unknown): T | null {
  if (value == null) return null;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }
  return value as T;
}

async function readHash<T>(redis: Redis, key: string): Promise<T[]> {
  // ponytail: one HGETALL per hash. Fine for months of use. When prep:attempts
  // passes about 1 MB, split it by month (PLAN.md, section 9).
  const raw = await redis.hgetall<Record<string, unknown>>(key);
  if (!raw) return [];
  return Object.values(raw).map((v) => decode<T>(v)).filter((v): v is T => v !== null);
}

export const listTopics = (redis: Redis) => readHash<Topic>(redis, TOPICS);
export const listCards = (redis: Redis) => readHash<Card>(redis, CARDS);
export const listAttempts = (redis: Redis) => readHash<Attempt>(redis, ATTEMPTS);

export async function getCard(redis: Redis, id: string): Promise<Card | null> {
  return decode<Card>(await redis.hget<unknown>(CARDS, id));
}

export async function getLesson(redis: Redis, topicId: string): Promise<string | null> {
  const raw = await redis.hget<unknown>(LESSONS, topicId);
  return typeof raw === "string" ? raw : null;
}

/** Several lessons in one call. Missing lessons are left out. */
export async function getLessons(redis: Redis, topicIds: string[]): Promise<Record<string, string>> {
  if (topicIds.length === 0) return {};
  const raw = await redis.hmget<Record<string, unknown>>(LESSONS, ...topicIds);
  const out: Record<string, string> = {};
  for (const [id, v] of Object.entries(raw ?? {})) if (typeof v === "string") out[id] = v;
  return out;
}

export async function getLastRun(redis: Redis): Promise<string | null> {
  const raw = await redis.hget<unknown>(META, "lastRun");
  return typeof raw === "string" ? raw : null;
}

export async function addAttempt(redis: Redis, attempt: Attempt): Promise<void> {
  await redis.hset(ATTEMPTS, { [attempt.id]: JSON.stringify(attempt) });
}

/**
 * Apply a push from the run. Order matters: topics first, so a card in the
 * same push can point at a topic that did not exist before it.
 *
 * A bad item is skipped with a reason, not fatal, so one broken card from the
 * run never blocks the rest of the morning's content.
 */
export async function applySync(
  redis: Redis,
  body: { topics?: unknown[]; cards?: unknown[]; grades?: unknown[] },
): Promise<{ topics: number; cards: number; grades: number; skipped: string[] }> {
  const skipped: string[] = [];

  const topics: Record<string, string> = {};
  const lessons: Record<string, string> = {};
  for (const item of body.topics ?? []) {
    const parsed = parseTopic(item);
    if (typeof parsed === "string") {
      skipped.push(parsed);
      continue;
    }
    topics[parsed.topic.id] = JSON.stringify(parsed.topic);
    if (parsed.lesson !== undefined) lessons[parsed.topic.id] = parsed.lesson;
  }

  const topicIds = new Set([...(await redis.hkeys(TOPICS)), ...Object.keys(topics)]);
  const cards: Record<string, string> = {};
  for (const item of body.cards ?? []) {
    const parsed = parseCard(item, topicIds);
    if (typeof parsed === "string") skipped.push(parsed);
    else cards[parsed.id] = JSON.stringify(parsed);
  }

  const graded: Record<string, string> = {};
  const gradedAt = new Date().toISOString();
  for (const item of body.grades ?? []) {
    const parsed = parseGrade(item);
    if (typeof parsed === "string") {
      skipped.push(parsed);
      continue;
    }
    const attempt = decode<Attempt>(await redis.hget<unknown>(ATTEMPTS, parsed.attemptId));
    if (!attempt) {
      skipped.push(`grade ${parsed.attemptId}: no such attempt`);
      continue;
    }
    const { attemptId, ...fields } = parsed;
    graded[attemptId] = JSON.stringify({ ...attempt, ...fields, gradedAt });
  }

  // hset rejects an empty object, so write only what is there.
  if (Object.keys(topics).length) await redis.hset(TOPICS, topics);
  if (Object.keys(lessons).length) await redis.hset(LESSONS, lessons);
  if (Object.keys(cards).length) await redis.hset(CARDS, cards);
  if (Object.keys(graded).length) await redis.hset(ATTEMPTS, graded);
  await redis.hset(META, { lastRun: gradedAt });

  return {
    topics: Object.keys(topics).length,
    cards: Object.keys(cards).length,
    grades: Object.keys(graded).length,
    skipped,
  };
}
