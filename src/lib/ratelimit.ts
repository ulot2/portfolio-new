import { Ratelimit } from '@upstash/ratelimit';
import { getRedis } from '@/lib/redis';

let ratelimit: Ratelimit | null = null;

const redis = getRedis();
if (redis) {
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
