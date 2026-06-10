import { asc, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { isPublicAgentEnabled } from '@comam/ai/server';
import { aiConversations, aiMessages, db } from '@comam/db';
import { HERMES_SESSION_COOKIE } from '@/lib/hermes-session';

export async function GET() {
  if (!isPublicAgentEnabled()) {
    return Response.json({ messages: [] });
  }

  const cookieStore = await cookies();
  const sessionKey = cookieStore.get(HERMES_SESSION_COOKIE)?.value;
  if (!sessionKey) {
    return Response.json({ messages: [] });
  }

  const [conversation] = await db
    .select()
    .from(aiConversations)
    .where(eq(aiConversations.sessionKey, sessionKey))
    .limit(1);

  if (!conversation) {
    return Response.json({ messages: [] });
  }

  const rows = await db
    .select({
      id: aiMessages.id,
      role: aiMessages.role,
      content: aiMessages.content,
      sources: aiMessages.sources,
    })
    .from(aiMessages)
    .where(eq(aiMessages.conversationId, conversation.id))
    .orderBy(asc(aiMessages.createdAt));

  return Response.json({ messages: rows });
}
