'use client';

import Link from 'next/link';
import { LogoutButton } from '@/components/logout-button';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Panel', permission: null },
  { href: '/admin/articles', label: 'Artículos', permission: 'articles:read' },
  { href: '/admin/documents', label: 'Documentos', permission: 'documents:read' },
  { href: '/admin/registrations', label: 'Registros', permission: 'registrations:read' },
  { href: '/admin/audit', label: 'Auditoría', permission: 'audit:read' },
] as const;

export function AdminNav({ permissionKeys }: { permissionKeys: string[] }) {
  const visible = NAV_ITEMS.filter(
    (item) => !item.permission || permissionKeys.includes(item.permission),
  );

  return (
    <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
      {visible.map((item) => (
        <Link key={item.href} href={item.href} className="hover:text-foreground">
          {item.label}
        </Link>
      ))}
      <LogoutButton />
    </nav>
  );
}
