import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

let ratelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  const dailyLimit = parseInt(process.env.CHAT_DAILY_LIMIT || '20', 10);

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(dailyLimit, '24 h'),
    analytics: true,
    prefix: 'portfolio_chat_ratelimit',
  });
}

export async function checkRateLimit(identifier: string): Promise<{ success: boolean; limit?: number; remaining?: number }> {
  if (!ratelimit) {
    // If Upstash environment variables are not set, allow requests (useful for local dev)
    return { success: true };
  }

  try {
    const result = await ratelimit.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
    };
  } catch (error) {
    console.error('Upstash Rate Limit Check Error:', error);
    // Fallback to allow request if Upstash Redis fails to avoid blocking legitimate users
    return { success: true };
  }
}
