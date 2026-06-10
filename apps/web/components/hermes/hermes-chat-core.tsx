'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HERMES_WELCOME_MESSAGE, PUBLIC_AGENT_NAME } from '@comam/ai';

export type HermesChatVariant = 'embedded' | 'docked';

export function HermesChatCore({
  contactEmail,
  variant,
}: {
  contactEmail: string;
  variant: HermesChatVariant;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/hermes/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: HERMES_WELCOME_MESSAGE,
      },
    ],
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const isDocked = variant === 'docked';

  return (
    <div
      className={
        isDocked
          ? 'flex min-h-0 flex-1 flex-col overflow-hidden bg-card'
          : 'flex h-[min(70vh,640px)] flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm'
      }
    >
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
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
              <p className="whitespace-pre-wrap">{message.content}</p>
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
          disabled={isLoading}
          className="min-h-[44px] w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />
        {isDocked ? (
          <Button type="submit" className="w-full" disabled={isLoading || !input.trim()}>
            <Send className="mr-2 h-4 w-4" />
            Enviar
          </Button>
        ) : (
          <Button type="submit" size="sm" disabled={isLoading || !input.trim()} aria-label="Enviar">
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
