'use client';

import { Download, FileSpreadsheet } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminInputClassName } from '@/lib/admin/form-classes';
import { PARTICIPANT_LABELS, STATUS_LABELS } from '@/lib/exports/registrations-labels';

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
type StatusFilter = 'all' | (typeof STATUSES)[number];

function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

function participantLabel(type: string): string {
  return PARTICIPANT_LABELS[type] ?? type;
}

function exportUrl(format: 'xlsx' | 'pdf', statusFilter: StatusFilter): string {
  const params = new URLSearchParams({ format });
  if (statusFilter !== 'all') {
    params.set('status', statusFilter);
  }
  return `/api/admin/registrations/export?${params.toString()}`;
}

export default function AdminRegistrationsPage() {
  const [items, setItems] = useState<Registration[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  async function load() {
    const res = await fetch('/api/admin/registrations');
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => {
    void load();
  }, []);

  const filteredItems = useMemo(() => {
    if (statusFilter === 'all') return items;
    return items.filter((item) => item.status === statusFilter);
  }, [items, statusFilter]);

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
      <AdminPageHeader
        title="Registros conferencia"
        description="Revise inscripciones, actualice estados y exporte listados para el comité organizador."
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <a href={exportUrl('xlsx', statusFilter)}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Exportar Excel
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={exportUrl('pdf', statusFilter)}>
                <Download className="mr-2 h-4 w-4" />
                Exportar PDF
              </a>
            </Button>
          </>
        }
      />

      {message ? <p className="text-sm text-primary">{message}</p> : null}

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('all')}
        >
          Todos ({items.length})
        </Button>
        {STATUSES.map((status) => {
          const count = items.filter((item) => item.status === status).length;
          return (
            <Button
              key={status}
              size="sm"
              variant={statusFilter === status ? 'default' : 'outline'}
              onClick={() => setStatusFilter(status)}
            >
              {statusLabel(status)} ({count})
            </Button>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{filteredItems.length} registros</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border p-0 px-6 pb-6">
          {filteredItems.length === 0 ? (
            <p className="py-8 text-sm text-muted-foreground">No hay registros para este filtro.</p>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="space-y-3 py-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{item.fullName}</p>
                    <p className="text-sm text-muted-foreground">{item.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {participantLabel(item.participantType)} · {item.country ?? '—'} ·{' '}
                      {item.city ?? '—'}
                    </p>
                    {item.institutionalData?.institutionName ? (
                      <p className="text-sm text-muted-foreground">
                        {item.institutionalData.institutionName}
                        {item.institutionalData.delegation
                          ? ` · ${item.institutionalData.delegation}`
                          : ''}
                      </p>
                    ) : null}
                  </div>
                  <Badge variant="default">{statusLabel(item.status)}</Badge>
                </div>
                <textarea
                  value={notes[item.id] ?? ''}
                  onChange={(e) => setNotes((prev) => ({ ...prev, [item.id]: e.target.value }))}
                  placeholder="Nota interna (opcional)"
                  rows={2}
                  className={adminInputClassName}
                />
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={item.status === status ? 'default' : 'outline'}
                      onClick={() => void updateStatus(item.id, status)}
                    >
                      {statusLabel(status)}
                    </Button>
                  ))}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
