import { cache } from "react";
import { getLastRun, getRedis, listAttempts, listCards, listTopics } from "@/lib/prep-store";
import { topicStates } from "./schedule";

/**
 * Everything the pages read, once per request: the layout and the page share
 * one load through React's cache. The middleware has already checked the
 * session before any of this runs.
 */
export const loadPrep = cache(async () => {
  const redis = getRedis();
  if (!redis) throw new Error("Storage is not configured.");
  const [topics, cards, attempts, lastRun] = await Promise.all([
    listTopics(redis),
    listCards(redis),
    listAttempts(redis),
    getLastRun(redis),
  ]);
  return { redis, topics, cards, attempts, lastRun, states: topicStates(topics, cards, attempts) };
});
