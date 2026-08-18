import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// In-memory fallback if Redis is not configured
const memoryViews: Record<string, number> = {};

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
      const count = await redis.get<number>(`views:${slug}`);
      return NextResponse.json({ views: count || 0 });
    } catch (error) {
      console.error("Error fetching views from Redis:", error);
    }
  }

  const views = memoryViews[slug] || 0;
  return NextResponse.json({ views });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const redis = getRedisClient();
    if (redis) {
      try {
        const newCount = await redis.incr(`views:${slug}`);
        return NextResponse.json({ views: newCount });
      } catch (error) {
        console.error("Error updating views in Redis:", error);
      }
    }

    memoryViews[slug] = (memoryViews[slug] || 0) + 1;
    return NextResponse.json({ views: memoryViews[slug] });
  } catch (error) {
    console.error("Error incrementing view count:", error);
    return NextResponse.json({ error: "Failed to update views" }, { status: 500 });
  }
}
