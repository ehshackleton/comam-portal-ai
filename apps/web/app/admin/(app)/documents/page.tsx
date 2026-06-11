'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminInputClassName } from '@/lib/admin/form-classes';

type Document = {
  id: string;
  title: string;
  type: string;
  visibility: string;
  aiPublicEnabled: boolean;
  aiInternalEnabled: boolean;
  aiCommitteeEnabled: boolean;
  contentText: string | null;
};

export default function AdminDocumentsPage() {
  const [items, setItems] = useState<Document[]>([]);
  const [message, setMessage] = useState('');

  async function load() {
    const res = await fetch('/api/admin/documents');
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => {
    void load();
  }, []);

  async function onUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const res = await fetch('/api/admin/documents', { method: 'POST', body: form });
    if (res.ok) {
      setMessage('Documento cargado');
      event.currentTarget.reset();
      await load();
    }
  }

  async function updateDocument(
    id: string,
    patch: Partial<Pick<Document, 'aiPublicEnabled' | 'aiInternalEnabled' | 'aiCommitteeEnabled' | 'visibility'>>,
  ) {
    const res = await fetch('/api/admin/documents', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...patch }),
    });
    if (res.ok) {
      setMessage('Documento actualizado');
      await load();
    }
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Documentos"
        description="Gestione archivos institucionales y su disponibilidad para Hermes y el portal."
      />
      <Card>
        <CardHeader>
          <CardTitle>Cargar documento</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onUpload} className="grid gap-3">
            <input name="title" placeholder="Título" required className={adminInputClassName} />
            <input
              name="type"
              placeholder="Tipo (estatuto, ponencia…)"
              className={adminInputClassName}
            />
            <select name="visibility" className={adminInputClassName}>
              <option value="private">Privado</option>
              <option value="public">Público</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input name="aiPublicEnabled" type="checkbox" value="true" className="rounded border-input" />
              Habilitar para agente público (Hermes)
            </label>
            <input name="file" type="file" accept=".pdf,.txt,.md" required className="text-sm" />
            <p className="text-xs text-muted-foreground">
              Se extrae texto de PDF y archivos de texto para Hermes y RAG.
            </p>
            <Button type="submit">Subir</Button>
          </form>
          {message ? <p className="mt-3 text-sm text-primary">{message}</p> : null}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="divide-y divide-border p-0 px-6 pb-6">
          {items.map((item) => (
            <div key={item.id} className="space-y-3 py-4 text-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-muted-foreground">
                    {item.type} · {item.visibility}
                    {item.contentText ? ' · texto extraído' : ' · sin texto'}
                  </p>
                </div>
                <select
                  value={item.visibility}
                  onChange={(e) => void updateDocument(item.id, { visibility: e.target.value })}
                  className={adminInputClassName}
                >
                  <option value="private">Privado</option>
                  <option value="public">Público</option>
                </select>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <label className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={item.aiPublicEnabled}
                    disabled={item.visibility !== 'public'}
                    onChange={(e) =>
                      void updateDocument(item.id, { aiPublicEnabled: e.target.checked })
                    }
                    className="rounded border-input"
                  />
                  Agente público
                </label>
                <label className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={item.aiInternalEnabled}
                    onChange={(e) =>
                      void updateDocument(item.id, { aiInternalEnabled: e.target.checked })
                    }
                    className="rounded border-input"
                  />
                  Agente interno
                </label>
                <label className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={item.aiCommitteeEnabled}
                    onChange={(e) =>
                      void updateDocument(item.id, { aiCommitteeEnabled: e.target.checked })
                    }
                    className="rounded border-input"
                  />
                  Comité
                </label>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
