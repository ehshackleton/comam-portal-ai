'use client';

import { usePathname } from 'next/navigation';
import { getBreadcrumb } from './nav-config';

export function SectionBreadcrumb() {
  const pathname = usePathname();
  const crumb = getBreadcrumb(pathname);

  if (!crumb) return null;

  return (
    <div className="border-b border-border/40 bg-background/60">
      <div className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
        <p className="text-xs text-muted-foreground">
          <span>{crumb.section}</span>
          <span className="mx-2 text-border">/</span>
          <span className="text-foreground/80">{crumb.label}</span>
        </p>
      </div>
    </div>
  );
}
