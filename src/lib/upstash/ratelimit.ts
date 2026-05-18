// lib/upstash/ratelimit.ts — Rate limiting for CODEWATCH API routes
// SOUL.md v4: Per-user abuse prevention via Upstash Redis
// Author: Kimi Build Agent | Date: 2026-05-17

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Rate limit configuration per SOUL.md Section 5
const RATE_LIMITS = {
  review: { requests: 10, window: 60 },      // 10 reviews per minute
  credits: { requests: 30, window: 60 },      // 30 credit checks per minute
  webhook: { requests: 100, window: 60 },     // 100 webhooks per minute
  rewrite: { requests: 5, window: 60 },       // 5 rewrites per minute
  humanise: { requests: 5, window: 60 },      // 5 humanisations per minute
};

export type RateLimitKey = keyof typeof RATE_LIMITS;

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// Check rate limit for a user on a specific endpoint
export async function checkRateLimit(
  userId: string,
  endpoint: RateLimitKey
): Promise<RateLimitResult> {
  const config = RATE_LIMITS[endpoint];
  const key = `ratelimit:${endpoint}:${userId}`;
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - config.window;

  // Use Redis pipeline for atomic operations
  const pipeline = redis.pipeline();
  pipeline.zremrangebyscore(key, 0, windowStart);
  pipeline.zcard(key);
  pipeline.zadd(key, { score: now, member: `${now}:${Math.random()}` });
  pipeline.expire(key, config.window);

  const results = await pipeline.exec();
  const currentCount = (results?.[1] as number) || 0;

  const success = currentCount < config.requests;
  const remaining = Math.max(0, config.requests - currentCount - 1);
  const reset = now + config.window;

  return { success, limit: config.requests, remaining, reset };
}

// Middleware helper for API routes
export async function rateLimitOrThrow(
  userId: string,
  endpoint: RateLimitKey
): Promise<void> {
  const result = await checkRateLimit(userId, endpoint);

  if (!result.success) {
    const error = new Error(`Rate limit exceeded. Try again in ${result.reset - Math.floor(Date.now() / 1000)} seconds.`);
    (error as any).statusCode = 429;
    (error as any).rateLimit = result;
    throw error;
  }
}
