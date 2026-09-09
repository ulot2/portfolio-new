import { Redis } from "@upstash/redis";

/**
 * The one place that reads Redis credentials.
 *
 * Vercel injects two different names depending on how the database was added:
 * the Upstash marketplace integration sets UPSTASH_REDIS_REST_URL/TOKEN, while
 * the Vercel KV integration sets KV_REST_API_URL/TOKEN. Both point at the same
 * Upstash instance, so accept either rather than making the setup path matter.
 */
export function redisCredentials(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

/** A client, or null when no database is configured. Callers decide what that means. */
export function getRedis(): Redis | null {
  const creds = redisCredentials();
  return creds ? new Redis(creds) : null;
}
