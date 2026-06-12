'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { NavDropdown } from './nav-dropdown';
import { comamNavGroup, conferenciaNavGroup, directNavLinks } from './nav-config';

function MobileNavGroup({ group }: { group: typeof comamNavGroup }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const active = group.children.some((c) => c.href === pathname);

  return (
    <div className="border-b border-border/60 pb-3">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className={cn(
          'flex w-full items-center justify-between py-2 text-base font-medium',
          active ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {group.label}
        <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', expanded && 'rotate-180')} />
      </button>
      <div
        className={cn(
          'grid gap-1 overflow-hidden transition-all duration-200',
          expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        {group.children.map((child) => (
          <SheetClose asChild key={child.href}>
            <Link
              href={child.href}
              className={cn(
                'block rounded-lg py-2 pl-3 text-sm',
                pathname === child.href ? 'bg-primary/10 text-accent-foreground' : 'text-muted-foreground',
              )}
            >
              {child.label}
            </Link>
          </SheetClose>
        ))}
      </div>
    </div>
  );
}

export function MarketingNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md transition-shadow duration-200',
        scrolled && 'nav-scrolled',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
          COMAM
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavDropdown group={comamNavGroup} columns={2} />
          <NavDropdown group={conferenciaNavGroup} />
          {directNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm transition-colors duration-200',
                pathname === link.href || pathname.startsWith(`${link.href}/`)
                  ? 'font-medium text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/admin/login"
            className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            Administración
          </Link>
          <Button asChild size="sm">
            <Link href="/conferencia">Conferencia 2026</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="h-11 w-11 shrink-0 p-0"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <span className="text-lg font-semibold">COMAM</span>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-2">
              <MobileNavGroup group={comamNavGroup} />
              <MobileNavGroup group={conferenciaNavGroup} />
              {directNavLinks.map((link) => (
                <SheetClose asChild key={link.href}>
                  <Link href={link.href} className="py-2 text-base text-foreground">
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <Link href="/admin/login" className="py-2 text-muted-foreground">
                  Administración
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild className="mt-2 w-full">
                  <Link href="/conferencia">Conferencia 2026</Link>
                </Button>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
