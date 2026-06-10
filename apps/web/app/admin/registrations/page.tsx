'use client';

import { useEffect, useState } from 'react';
import { Button, Card } from '@comam/ui';

type Registration = {
  id: string;
  fullName: string;
  email: string;
  country: string | null;
  city: string | null;
  participantType: string;
  status: string;
  attendanceMode: string | null;
  institutionalData: { institutionName?: string; delegation?: string };
  createdAt: string;
};

const STATUSES = ['submitted', 'under_review', 'approved', 'rejected', 'waitlist'] as const;

export default function AdminRegistrationsPage() {
  const [items, setItems] = useState<Registration[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');

  async function load() {
    const res = await fetch('/api/admin/registrations');
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => {
    void load();
  }, []);

  async function updateStatus(id: string, status: string) {
    const res = await fetch('/api/admin/registrations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, note: notes[id] ?? '' }),
    });
    if (res.ok) {
      setMessage('Estado actualizado');
      await load();
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">Registros conferencia</h1>
      {message ? <p className="text-sm text-green-700">{message}</p> : null}
      <Card title={`${items.length} registros`}>
        <ul className="divide-y">
          {items.map((item) => (
            <li key={item.id} className="space-y-3 py-4 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{item.fullName}</p>
                  <p className="text-stone-500">{item.email}</p>
                  <p className="text-stone-500">
                    {item.participantType} · {item.country ?? '—'} · {item.city ?? '—'}
                  </p>
                  {item.institutionalData?.institutionName ? (
                    <p className="text-stone-500">
                      {item.institutionalData.institutionName}
                      {item.institutionalData.delegation
                        ? ` · ${item.institutionalData.delegation}`
                        : ''}
                    </p>
                  ) : null}
                </div>
                <span className="rounded bg-stone-100 px-2 py-1 text-xs font-medium">{item.status}</span>
              </div>
              <textarea
                value={notes[item.id] ?? ''}
                onChange={(e) => setNotes((prev) => ({ ...prev, [item.id]: e.target.value }))}
                placeholder="Nota interna (opcional)"
                rows={2}
                className="w-full rounded border px-2 py-1 text-xs"
              />
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((status) => (
                  <Button
                    key={status}
                    variant={item.status === status ? 'primary' : 'secondary'}
                    onClick={() => void updateStatus(item.id, status)}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
