import { NextRequest } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory sliding rate limit store
const ipStore = new Map<string, RateLimitRecord>();

// Clean up stale entries every 10 minutes to prevent memory growth
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of ipStore.entries()) {
      if (now > value.resetAt) {
        ipStore.delete(key);
      }
    }
  }, 10 * 60 * 1000);
}

export function getClientIp(req: NextRequest | Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();
  return '127.0.0.1';
}

/**
 * Checks whether the client IP has exceeded the limit.
 * @param req Request object
 * @param maxRequests Maximum allowed requests in window (default 4)
 * @param windowMs Window in ms (default 1 hour = 3600000 ms)
 */
export function checkRateLimit(
  req: NextRequest | Request,
  maxRequests = 4,
  windowMs = 60 * 60 * 1000,
  actionKey = 'default'
): { success: boolean; message?: string } {
  const ip = getClientIp(req);
  const key = `${actionKey}:${ip}`;
  const now = Date.now();

  const record = ipStore.get(key);

  if (!record || now > record.resetAt) {
    ipStore.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true };
  }

  if (record.count >= maxRequests) {
    return {
      success: false,
      message: "You've submitted a few requests recently. Please try again later.",
    };
  }

  record.count += 1;
  return { success: true };
}
