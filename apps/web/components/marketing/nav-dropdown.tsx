'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavGroup } from './nav-config';
import { isGroupActive } from './nav-config';

export function NavDropdown({ group, columns = 1 }: { group: NavGroup; columns?: 1 | 2 }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = isGroupActive(pathname, group);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'relative flex items-center gap-1 py-1 text-sm transition-colors duration-200',
          active ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground',
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {group.label}
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', open && 'rotate-180')} />
        <span
          className={cn(
            'absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-200',
            active ? 'w-full' : 'w-0 group-hover:w-full',
          )}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-2 min-w-[280px] rounded-xl border border-border/80 bg-background p-2 shadow-lg"
          >
            <div className={cn('grid gap-1', columns === 2 && 'sm:grid-cols-2 sm:min-w-[520px]')}>
              {group.children.map((child) => {
                const childActive = pathname === child.href;
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      'block rounded-lg px-3 py-2.5 transition-colors duration-200',
                      childActive
                        ? 'bg-primary/10 text-accent-foreground'
                        : 'hover:bg-secondary hover:text-foreground',
                    )}
                  >
                    <span className="block text-sm font-medium">{child.label}</span>
                    {child.description ? (
                      <span className="mt-0.5 block text-xs text-muted-foreground">{child.description}</span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
