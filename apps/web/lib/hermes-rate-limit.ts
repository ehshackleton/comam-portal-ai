const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

const hits = new Map<string, number[]>();

export function checkHermesRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = hits.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    return false;
  }

  recent.push(now);
  hits.set(ip, recent);
  return true;
}
