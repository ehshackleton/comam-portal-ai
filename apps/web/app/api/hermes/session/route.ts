import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { isPublicAgentEnabled } from '@comam/ai/server';
import { hermesSessionCookieOptions, HERMES_SESSION_COOKIE } from '@/lib/hermes-session';

export async function POST() {
  if (!isPublicAgentEnabled()) {
    return Response.json({ error: 'Agente no disponible.' }, { status: 503 });
  }

  const sessionKey = randomUUID();
  const cookieStore = await cookies();
  cookieStore.set(HERMES_SESSION_COOKIE, sessionKey, hermesSessionCookieOptions());

  return Response.json({ ok: true });
}
