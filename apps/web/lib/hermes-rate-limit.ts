import { getRedis } from './redis';

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;
const KEY_PREFIX = 'hermes:rl:';

const memoryHits = new Map<string, number[]>();

function checkMemoryRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = memoryHits.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    return false;
  }

  recent.push(now);
  memoryHits.set(ip, recent);
  return true;
}

export async function checkHermesRateLimit(ip: string): Promise<boolean> {
  const redis = getRedis();
  if (!redis) {
    return checkMemoryRateLimit(ip);
  }

  try {
    if (redis.status !== 'ready') {
      await redis.connect();
    }

    const key = `${KEY_PREFIX}${ip}`;
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.pexpire(key, WINDOW_MS);
    }
    return count <= MAX_REQUESTS;
  } catch {
    return checkMemoryRateLimit(ip);
  }
}
