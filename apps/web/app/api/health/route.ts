import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { db } from '@comam/db';
import { getRedis } from '@/lib/redis';

async function checkPostgres(): Promise<'ok' | 'error'> {
  try {
    await db.execute(sql`SELECT 1`);
    return 'ok';
  } catch {
    return 'error';
  }
}

async function checkRedis(): Promise<'ok' | 'skipped' | 'error'> {
  const redis = getRedis();
  if (!redis) return 'skipped';

  try {
    if (redis.status !== 'ready') {
      await redis.connect();
    }
    const pong = await redis.ping();
    return pong === 'PONG' ? 'ok' : 'error';
  } catch {
    return 'error';
  }
}

export async function GET() {
  const [postgres, redis] = await Promise.all([checkPostgres(), checkRedis()]);
  const healthy = postgres === 'ok' && redis !== 'error';

  return NextResponse.json(
    {
      status: healthy ? 'ok' : 'degraded',
      service: 'comam-web',
      timestamp: new Date().toISOString(),
      checks: {
        postgres,
        redis,
      },
    },
    { status: healthy ? 200 : 503 },
  );
}
