import Redis from 'ioredis';

let client: Redis | null = null;

export function getRedis(): Redis | null {
  const url = process.env.REDIS_URL;
  if (!url) return null;

  if (!client) {
    client = new Redis(url, {
      maxRetriesPerRequest: 1,
      lazyConnect: true,
      enableOfflineQueue: false,
    });
    client.on('error', () => {
      // Fallback silencioso a rate limit en memoria
    });
  }

  return client;
}
