'use client';

import { useEffect, useState } from 'react';
import { Card } from '@comam/ui';

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
      <h1 className="text-3xl font-semibold">Auditoría</h1>
      <Card title="Últimas acciones registradas">
        <ul className="divide-y text-sm">
          {items.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <p className="font-medium">
                  {item.module} · {item.action}
                </p>
                <p className="text-stone-500">
                  {item.entityType ?? '—'} {item.entityId ? `· ${item.entityId}` : ''}
                </p>
              </div>
              <time className="text-xs text-stone-500">
                {new Date(item.createdAt).toLocaleString('es-CL')}
              </time>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
