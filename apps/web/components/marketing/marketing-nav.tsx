'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';

const links = [
  { href: '/comam', label: 'COMAM' },
  { href: '/conferencia', label: 'Conferencia 2026' },
  { href: '/articulos', label: 'Artículos' },
  { href: '/biblioteca', label: 'Biblioteca' },
];

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
          COMAM
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/admin/login"
            className="text-sm text-muted-foreground hover:text-foreground"
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
            <nav className="mt-6 flex flex-col gap-4">
              {links.map((link) => (
                <SheetClose asChild key={link.href}>
                  <Link href={link.href} className="text-base text-foreground">
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <Link href="/admin/login" className="text-muted-foreground">
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
