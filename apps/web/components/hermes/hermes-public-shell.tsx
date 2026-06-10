'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HermesDockPanel } from './hermes-dock-panel';
import { HermesDockProvider } from './hermes-dock-context';

const DOCK_STORAGE_KEY = 'hermes_dock_open';
const Z_FAB = 50;
const Z_OVERLAY = 55;
const Z_PANEL = 60;

export function HermesPublicShell({
  children,
  enabled,
  contactEmail,
}: {
  children: React.ReactNode;
  enabled: boolean;
  contactEmail: string;
}) {
  const pathname = usePathname();
  const isHermesPage = pathname === '/hermes';
  const showDock = enabled && !isHermesPage;

  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(DOCK_STORAGE_KEY);
    setOpen(stored === 'true');
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const setOpenPersisted = useCallback((value: boolean) => {
    setOpen(value);
    localStorage.setItem(DOCK_STORAGE_KEY, String(value));
  }, []);

  const openDock = useCallback(() => setOpenPersisted(true), [setOpenPersisted]);
  const closeDock = useCallback(() => setOpenPersisted(false), [setOpenPersisted]);

  if (!showDock) {
    return (
      <HermesDockProvider openDock={() => {}} closeDock={() => {}} isAvailable={false}>
        {children}
      </HermesDockProvider>
    );
  }

  return (
    <HermesDockProvider openDock={openDock} closeDock={closeDock} isAvailable>
      <div
        className="flex min-h-0 flex-1 flex-col"
        aria-hidden={hydrated && open ? true : undefined}
      >
        {children}
      </div>

      {hydrated && open ? (
        <button
          type="button"
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
          style={{ zIndex: Z_OVERLAY }}
          aria-label="Cerrar chat"
          onClick={closeDock}
        />
      ) : null}

      <div
        role="dialog"
        aria-modal={open}
        aria-label="Chat Hermes COMAM"
        className={cn(
          'fixed top-0 right-0 flex h-[100dvh] max-h-[100dvh] w-full max-w-[420px] flex-col border-l border-border bg-card shadow-xl transition-transform duration-300 sm:max-w-[min(420px,32vw)]',
          hydrated && open ? 'translate-x-0' : 'translate-x-full pointer-events-none',
        )}
        style={{ zIndex: Z_PANEL }}
        aria-hidden={!open}
      >
        <HermesDockPanel contactEmail={contactEmail} onClose={closeDock} />
      </div>

      {hydrated && !open ? (
        <Button
          type="button"
          size="lg"
          title="Abrir chat con Hermes COMAM"
          aria-label="Abrir chat con Hermes COMAM"
          className="safe-fab fixed h-14 w-14 rounded-full p-0 shadow-lg"
          style={{ zIndex: Z_FAB }}
          onClick={openDock}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : null}
    </HermesDockProvider>
  );
}
