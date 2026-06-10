'use client';

import { X } from 'lucide-react';
import { PUBLIC_AGENT_NAME } from '@comam/ai';
import { HermesChatCore } from './hermes-chat-core';

export function HermesDockPanel({
  contactEmail,
  onClose,
}: {
  contactEmail: string;
  onClose: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="relative flex shrink-0 items-start justify-between gap-3 border-b border-border/60 px-4 py-3 sm:py-4">
        <div className="min-w-0 pr-8">
          <h2 className="text-base font-semibold tracking-tight">{PUBLIC_AGENT_NAME}</h2>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            Orientación institucional pública. Para temas formales, contacte al comité organizador.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          aria-label="Cerrar chat"
        >
          <X className="h-4 w-4" />
        </button>
      </header>
      <HermesChatCore contactEmail={contactEmail} variant="docked" />
    </div>
  );
}
