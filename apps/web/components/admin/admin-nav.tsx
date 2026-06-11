'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/components/logout-button';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Panel', permission: null },
  { href: '/admin/articles', label: 'Artículos', permission: 'articles:read' },
  { href: '/admin/documents', label: 'Documentos', permission: 'documents:read' },
  { href: '/admin/registrations', label: 'Registros', permission: 'registrations:read' },
  { href: '/admin/audit', label: 'Auditoría', permission: 'audit:read' },
] as const;

export function AdminNav({ permissionKeys }: { permissionKeys: string[] }) {
  const pathname = usePathname();
  const visible = NAV_ITEMS.filter(
    (item) => !item.permission || permissionKeys.includes(item.permission),
  );

  return (
    <nav className="flex flex-wrap items-center gap-4 text-sm">
      {visible.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'transition-colors',
              active
                ? 'font-medium text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {item.label}
          </Link>
        );
      })}
      <LogoutButton />
    </nav>
  );
}
