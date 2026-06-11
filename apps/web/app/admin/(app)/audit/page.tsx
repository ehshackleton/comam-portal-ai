'use client';

import { useEffect, useState } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type AuditRow = {
  id: string;
  action: string;
  module: string;
  entityType: string | null;
  entityId: string | null;
  createdAt: string;
};

export default function AdminAuditPage() {
  const [items, setItems] = useState<AuditRow[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin/audit');
      if (res.ok) setItems(await res.json());
    }
    void load();
  }, []);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Auditoría"
        description="Últimas acciones registradas en el backoffice institucional."
      />
      <Card>
        <CardHeader>
          <CardTitle>Últimas acciones registradas</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border p-0 px-6 pb-6">
          {items.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-4 text-sm">
              <div>
                <p className="font-medium text-foreground">
                  {item.module} · {item.action}
                </p>
                <p className="text-muted-foreground">
                  {item.entityType ?? '—'} {item.entityId ? `· ${item.entityId}` : ''}
                </p>
              </div>
              <time className="text-xs text-muted-foreground">
                {new Date(item.createdAt).toLocaleString('es-CL')}
              </time>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
