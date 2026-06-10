'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HermesDockPanel } from './hermes-dock-panel';
import { HermesDockProvider } from './hermes-dock-context';

const DOCK_STORAGE_KEY = 'hermes_dock_open';
const DOCK_WIDTH = 'min(420px,32vw)';

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
    if (stored !== null) {
      setOpen(stored === 'true');
    } else {
      setOpen(window.matchMedia('(min-width: 1024px)').matches);
    }
    setHydrated(true);
  }, []);

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
        className={cn(
          'flex min-h-0 flex-1 flex-col transition-[margin] duration-300',
          hydrated && open && 'lg:mr-[var(--hermes-dock-width)]',
        )}
        style={{ '--hermes-dock-width': DOCK_WIDTH } as React.CSSProperties}
      >
        {children}
      </div>

      {hydrated && open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px] lg:hidden"
          aria-label="Cerrar chat"
          onClick={closeDock}
        />
      ) : null}

      <div
        className={cn(
          'fixed inset-y-0 right-0 z-40 flex flex-col border-l border-border bg-card shadow-xl transition-transform duration-300',
          hydrated && open ? 'translate-x-0' : 'translate-x-full pointer-events-none',
        )}
        style={{ width: DOCK_WIDTH }}
        aria-hidden={!open}
      >
        <HermesDockPanel contactEmail={contactEmail} onClose={closeDock} />
      </div>

      {hydrated && !open ? (
        <Button
          type="button"
          size="lg"
          className="fixed bottom-6 right-6 z-30 gap-2 shadow-lg"
          onClick={openDock}
        >
          <MessageCircle className="h-5 w-5" />
          Hablar con Hermes
        </Button>
      ) : null}
    </HermesDockProvider>
  );
}
