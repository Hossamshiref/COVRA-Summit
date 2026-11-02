// In-memory rate limiter for serverless/edge/node environments
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

// Clean up stale records periodically
setInterval(() => {
  const now = Date.now();
  memoryStore.forEach((record, key) => {
    if (record.resetAt <= now) {
      memoryStore.delete(key);
    }
  });
}, 60000);

export function rateLimit({
  identifier,
  limit = 10,
  windowMs = 60000,
}: {
  identifier: string;
  limit?: number;
  windowMs?: number;
}): { success: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const record = memoryStore.get(identifier);

  if (!record || record.resetAt <= now) {
    memoryStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      remaining: limit - 1,
      reset: now + windowMs,
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
      reset: record.resetAt,
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: limit - record.count,
    reset: record.resetAt,
  };
}
