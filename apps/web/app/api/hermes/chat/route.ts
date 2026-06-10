import { randomUUID } from 'node:crypto';
import type { CoreMessage } from 'ai';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import {
  buildPublicContext,
  isPublicAgentEnabled,
  streamHermesReply,
  type HermesSource,
} from '@comam/ai/server';
import { aiConversations, aiMessages, db } from '@comam/db';
import { hermesSessionCookieOptions, HERMES_SESSION_COOKIE } from '@/lib/hermes-session';
import { checkHermesRateLimit } from '@/lib/hermes-rate-limit';

const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 4000;

type ChatRequestBody = {
  messages?: { role: string; content: string }[];
};

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown';
  return request.headers.get('x-real-ip') ?? 'unknown';
}

function validateMessages(raw: ChatRequestBody['messages']): CoreMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_MESSAGES) {
    return null;
  }

  const messages: CoreMessage[] = [];
  for (const item of raw) {
    if (!item || (item.role !== 'user' && item.role !== 'assistant') || typeof item.content !== 'string') {
      return null;
    }
    const content = item.content.trim();
    if (!content || content.length > MAX_MESSAGE_CHARS) {
      return null;
    }
    messages.push({ role: item.role, content });
  }

  const last = messages[messages.length - 1];
  if (!last || last.role !== 'user') {
    return null;
  }

  return messages;
}

async function resolveConversation(sessionKey: string, request: Request) {
  const [existing] = await db
    .select()
    .from(aiConversations)
    .where(eq(aiConversations.sessionKey, sessionKey))
    .limit(1);

  if (existing) {
    return existing;
  }

  const [created] = await db
    .insert(aiConversations)
    .values({
      sessionKey,
      agentType: 'public',
      ipAddress: getClientIp(request),
      userAgent: request.headers.get('user-agent') ?? undefined,
    })
    .returning();

  return created;
}

export async function POST(request: Request) {
  if (!isPublicAgentEnabled()) {
    return Response.json(
      { error: 'El agente Hermes no está disponible en este momento.' },
      { status: 503 },
    );
  }

  const ip = getClientIp(request);
  if (!checkHermesRateLimit(ip)) {
    return Response.json({ error: 'Demasiadas solicitudes. Intente nuevamente en un minuto.' }, { status: 429 });
  }

  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return Response.json({ error: 'Solicitud inválida.' }, { status: 400 });
  }

  const messages = validateMessages(body.messages);
  if (!messages) {
    return Response.json({ error: 'Mensajes inválidos.' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const existingSession = cookieStore.get(HERMES_SESSION_COOKIE)?.value;
  const sessionKey = existingSession ?? randomUUID();
  const isNewSession = !existingSession;

  const conversation = await resolveConversation(sessionKey, request);
  if (!conversation) {
    return Response.json({ error: 'No se pudo iniciar la conversación.' }, { status: 500 });
  }

  const lastUserMessage = messages[messages.length - 1];
  if (!lastUserMessage || lastUserMessage.role !== 'user') {
    return Response.json({ error: 'Mensajes inválidos.' }, { status: 400 });
  }

  const userContent =
    typeof lastUserMessage.content === 'string' ? lastUserMessage.content : '';
  if (!userContent) {
    return Response.json({ error: 'Mensajes inválidos.' }, { status: 400 });
  }

  let sources: HermesSource[] = [];
  try {
    const context = await buildPublicContext(db);
    sources = context.sources;

    const result = streamHermesReply({
      messages,
      contextBlock: context.context,
      onFinish: async (assistantText) => {
        await db.insert(aiMessages).values([
          {
            conversationId: conversation.id,
            role: 'user',
            content: userContent,
            sources: [],
          },
          {
            conversationId: conversation.id,
            role: 'assistant',
            content: assistantText,
            sources,
          },
        ]);
      },
    });

    if (isNewSession) {
      cookieStore.set(HERMES_SESSION_COOKIE, sessionKey, hermesSessionCookieOptions());
    }
    return result.toDataStreamResponse();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno';
    const status = message.includes('OPENAI_API_KEY') ? 503 : 500;
    return Response.json({ error: message }, { status });
  }
}
