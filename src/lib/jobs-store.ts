import { Redis } from "@upstash/redis";

/**
 * Storage for the jobs dashboard, on the Upstash instance that already serves
 * the blog claps and view counters. Everything is namespaced under `jobs:`.
 *
 * Unlike api/claps/route.ts there is no in-memory fallback. A dashboard with no
 * Redis must fail loudly: an empty page reads as "no roles today", which is a
 * lie, and a status tap that silently vanished would be worse.
 */

const ROLES_KEY = "jobs:roles";
const resumeKey = (slug: string) => `jobs:resume:${slug}`;

export type Role = {
  ext_id: string;
  company?: string;
  title?: string;
  location?: string;
  url?: string;
  source?: string;
  posted?: string;
  score?: number | null;
  reason?: string;
  mode?: string;
  resume?: string;
  letter_text?: string;
  answers?: { q: string; a: string }[];
  first_seen?: string;
  status?: string;
  notes?: string;
  applied_at?: string | null;
  updated_at?: string;
};

/** Fields the dashboard owns. A push must never overwrite these. */
export const HIS_FIELDS = ["status", "notes", "applied_at"] as const;

export function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

/** Upstash may hand back a parsed object or the raw string, depending on how it
 *  was written. Accept both rather than betting on one. */
function decode(value: unknown): Role | null {
  if (value == null) return null;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as Role;
    } catch {
      return null;
    }
  }
  return value as Role;
}

export async function listRoles(redis: Redis): Promise<Role[]> {
  // ponytail: one HGETALL is right at ~100 roles (about 200 KB). Past roughly
  // 2,000 this gets heavy; the upgrade is per-role keys plus a sorted-set index.
  const raw = await redis.hgetall<Record<string, unknown>>(ROLES_KEY);
  if (!raw) return [];
  const out: Role[] = [];
  for (const [ext_id, value] of Object.entries(raw)) {
    const role = decode(value);
    if (role) out.push({ status: "new", notes: "", ...role, ext_id });
  }
  return out;
}

export async function getRole(redis: Redis, extId: string): Promise<Role | null> {
  return decode(await redis.hget<unknown>(ROLES_KEY, extId));
}

async function writeRole(redis: Redis, role: Role): Promise<void> {
  await redis.hset(ROLES_KEY, { [role.ext_id]: JSON.stringify(role) });
}

/** Merge a patch into one role. Used by the dashboard for status and notes. */
export async function patchRole(
  redis: Redis,
  extId: string,
  patch: Partial<Role>,
): Promise<Role | null> {
  const existing = await getRole(redis, extId);
  if (!existing) return null;
  const next = { ...existing, ...patch, ext_id: extId, updated_at: new Date().toISOString() };
  await writeRole(redis, next);
  return next;
}

/**
 * Apply a push from the laptop.
 *
 * `set` writes the whole role, for one that has never been seen.
 * `update` merges the agent's fields and leaves status, notes and applied_at
 * exactly as they are. Getting this backwards would erase what he typed on his
 * phone, so the guard is here as well as in push.py.
 */
export async function applyWrites(
  redis: Redis,
  writes: { op: "set" | "update"; ext_id: string; doc: Role }[],
): Promise<{ set: number; updated: number; skipped: string[] }> {
  let set = 0;
  let updated = 0;
  const skipped: string[] = [];

  for (const w of writes) {
    if (!w.ext_id || !w.doc) {
      skipped.push(w.ext_id || "(no id)");
      continue;
    }
    const existing = await getRole(redis, w.ext_id);

    if (w.op === "update" || existing) {
      const doc = { ...w.doc };
      for (const f of HIS_FIELDS) delete doc[f];
      if (!existing) {
        // An update for a role that is not there yet: treat it as a first write
        // rather than dropping it, but give it the defaults it is missing.
        await writeRole(redis, { status: "new", notes: "", applied_at: null, ...doc, ext_id: w.ext_id });
        set++;
        continue;
      }
      await writeRole(redis, { ...existing, ...doc, ext_id: w.ext_id });
      updated++;
    } else {
      await writeRole(redis, {
        status: "new",
        notes: "",
        applied_at: null,
        ...w.doc,
        ext_id: w.ext_id,
      });
      set++;
    }
  }
  return { set, updated, skipped };
}

export async function putResume(redis: Redis, slug: string, filename: string, b64: string) {
  await redis.set(resumeKey(slug), JSON.stringify({ filename, b64 }));
}

export async function getResume(
  redis: Redis,
  slug: string,
): Promise<{ filename: string; b64: string } | null> {
  const raw = await redis.get<unknown>(resumeKey(slug));
  if (raw == null) return null;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return raw as { filename: string; b64: string };
}
