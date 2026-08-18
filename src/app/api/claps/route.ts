import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// In-memory fallback if Redis is not configured
const memoryClaps: Record<string, number> = {};

function getRedisClient(): Redis | null {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  const redis = getRedisClient();

  if (redis) {
    try {
      const count = await redis.get<number>(`claps:${slug}`);
      return NextResponse.json({ claps: count || 0 });
    } catch (error) {
      console.error("Error fetching claps from Redis:", error);
    }
  }

  const claps = memoryClaps[slug] || 0;
  return NextResponse.json({ claps });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, increment = 1 } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const safeIncrement = Math.min(Math.max(1, Number(increment)), 10);
    const redis = getRedisClient();

    if (redis) {
      try {
        const newCount = await redis.incrby(`claps:${slug}`, safeIncrement);
        return NextResponse.json({ claps: newCount });
      } catch (error) {
        console.error("Error updating claps in Redis:", error);
      }
    }

    memoryClaps[slug] = (memoryClaps[slug] || 0) + safeIncrement;
    return NextResponse.json({ claps: memoryClaps[slug] });
  } catch (error) {
    console.error("Error processing clap:", error);
    return NextResponse.json({ error: "Failed to update claps" }, { status: 500 });
  }
}
