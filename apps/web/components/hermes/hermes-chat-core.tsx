'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState } from 'react';
import { Send, MessageSquarePlus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HERMES_WELCOME_MESSAGE, PUBLIC_AGENT_NAME } from '@comam/ai';
import type { HermesSource } from '@comam/ai';

export type HermesChatVariant = 'embedded' | 'docked';

type HistoryMessage = {
  id: string;
  role: string;
  content: string;
  sources?: HermesSource[];
};

function HermesSources({ sources }: { sources: HermesSource[] }) {
  const cited = sources.filter((s) => s.type !== 'institutional');
  if (cited.length === 0) return null;

  return (
    <div className="mt-2 border-t border-border/40 pt-2">
      <p className="text-xs font-medium text-muted-foreground">Fuentes consultadas</p>
      <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
        {cited.map((source, index) => (
          <li key={`${source.type}-${source.id ?? source.title}-${index}`}>
            {source.type === 'article' && source.id ? (
              <span>Artículo: {source.title}</span>
            ) : source.type === 'document' && source.id ? (
              <span>Documento: {source.title}</span>
            ) : (
              <span>{source.title}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HermesChatCore({
  contactEmail,
  variant,
}: {
  contactEmail: string;
  variant: HermesChatVariant;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pendingSourcesRef = useRef<HermesSource[]>([]);
  const [messageSources, setMessageSources] = useState<Record<string, HermesSource[]>>({});
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const { messages, setMessages, data, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: '/api/hermes/chat',
      initialMessages: [
        {
          id: 'welcome',
          role: 'assistant',
          content: HERMES_WELCOME_MESSAGE,
        },
      ],
      experimental_prepareRequestBody: ({ messages: chatMessages }) => ({
        messages: chatMessages
          .filter((message) => message.id !== 'welcome')
          .map(({ role, content }) => ({ role, content })),
      }),
      onFinish: (message) => {
        if (message.role === 'assistant' && message.id !== 'welcome') {
          setMessageSources((prev) => ({
            ...prev,
            [message.id]: pendingSourcesRef.current,
          }));
          pendingSourcesRef.current = [];
        }
      },
    });

  useEffect(() => {
    if (!data?.length) return;
    const latest = data[data.length - 1];
    if (
      latest &&
      typeof latest === 'object' &&
      'type' in latest &&
      (latest as { type: string }).type === 'sources' &&
      'sources' in latest
    ) {
      pendingSourcesRef.current = (latest as { sources: HermesSource[] }).sources;
    }
  }, [data]);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch('/api/hermes/history');
        if (!res.ok) return;
        const data = (await res.json()) as { messages?: HistoryMessage[] };
        if (!data.messages?.length) return;

        const sourcesMap: Record<string, HermesSource[]> = {};
        const loaded = [
          {
            id: 'welcome',
            role: 'assistant' as const,
            content: HERMES_WELCOME_MESSAGE,
          },
          ...data.messages.map((message) => {
            if (message.role === 'assistant' && message.sources?.length) {
              sourcesMap[message.id] = message.sources;
            }
            return {
              id: message.id,
              role: message.role as 'user' | 'assistant',
              content: message.content,
            };
          }),
        ];

        setMessages(loaded);
        setMessageSources(sourcesMap);
      } finally {
        setHistoryLoaded(true);
      }
    }

    void loadHistory();
  }, [setMessages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  async function handleNewConversation() {
    await fetch('/api/hermes/session', { method: 'POST' });
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: HERMES_WELCOME_MESSAGE,
      },
    ]);
    setMessageSources({});
    pendingSourcesRef.current = [];
  }

  const isDocked = variant === 'docked';

  return (
    <div
      className={
        isDocked
          ? 'flex min-h-0 flex-1 flex-col overflow-hidden bg-card'
          : 'flex h-[min(70vh,640px)] flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm'
      }
    >
      <div className="flex shrink-0 items-center justify-end border-b border-border/40 px-3 py-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 text-xs"
          onClick={() => void handleNewConversation()}
          disabled={isLoading}
        >
          <MessageSquarePlus className="mr-1.5 h-3.5 w-3.5" />
          Nueva conversación
        </Button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {!historyLoaded ? (
          <p className="text-sm text-muted-foreground">Cargando conversación…</p>
        ) : null}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              {message.role === 'assistant' && message.id !== 'welcome' ? (
                <p className="mb-1 text-xs font-medium text-muted-foreground">{PUBLIC_AGENT_NAME}</p>
              ) : null}
              {message.role === 'assistant' && message.id !== 'welcome' ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{message.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
              {message.role === 'assistant' && messageSources[message.id] ? (
                <HermesSources sources={messageSources[message.id]} />
              ) : null}
            </div>
          </div>
        ))}
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Hermes está escribiendo…</p>
        ) : null}
      </div>

      {error ? (
        <div className="border-t border-border/60 bg-destructive/5 px-4 py-2 text-sm text-destructive">
          {error.message || 'No se pudo obtener respuesta. Intente nuevamente.'}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className={
          isDocked
            ? 'safe-bottom flex flex-col gap-2 border-t border-border/60 p-4'
            : 'flex items-end gap-2 border-t border-border/60 p-4'
        }
      >
        <textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Escriba su consulta sobre COMAM o la conferencia…"
          rows={isDocked ? 3 : 2}
          disabled={isLoading || !historyLoaded}
          className="min-h-[44px] w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />
        {isDocked ? (
          <Button type="submit" className="w-full" disabled={isLoading || !input.trim() || !historyLoaded}>
            <Send className="mr-2 h-4 w-4" />
            Enviar
          </Button>
        ) : (
          <Button
            type="submit"
            size="sm"
            disabled={isLoading || !input.trim() || !historyLoaded}
            aria-label="Enviar"
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </form>

      <p
        className={cn(
          'border-t border-border/40 px-4 py-2 text-center text-xs text-muted-foreground',
          isDocked && 'safe-bottom',
        )}
      >
        Conversación registrada según política institucional. No ingrese datos personales. Contacto:{' '}
        <a href={`mailto:${contactEmail}`} className="underline hover:text-foreground">
          {contactEmail}
        </a>
      </p>
    </div>
  );
}
