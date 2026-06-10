'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Button, Card } from '@comam/ui';

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
      <h1 className="text-3xl font-semibold">Documentos</h1>
      <Card title="Cargar documento">
        <form onSubmit={onUpload} className="grid gap-3">
          <input name="title" placeholder="Título" required className="rounded border px-3 py-2" />
          <input name="type" placeholder="Tipo (estatuto, ponencia…)" className="rounded border px-3 py-2" />
          <select name="visibility" className="rounded border px-3 py-2">
            <option value="private">Privado</option>
            <option value="public">Público</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input name="aiPublicEnabled" type="checkbox" value="true" />
            Habilitar para agente público (Hermes)
          </label>
          <input name="file" type="file" accept=".pdf,.txt,.md" required className="text-sm" />
          <p className="text-xs text-stone-500">Se extrae texto de PDF y archivos de texto para Hermes y RAG.</p>
          <Button type="submit">Subir</Button>
        </form>
        {message ? <p className="mt-2 text-sm text-green-700">{message}</p> : null}
      </Card>
      <ul className="divide-y rounded border bg-white">
        {items.map((item) => (
          <li key={item.id} className="space-y-2 px-4 py-3 text-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-stone-500">
                  {item.type} · {item.visibility}
                  {item.contentText ? ' · texto extraído' : ' · sin texto'}
                </p>
              </div>
              <select
                value={item.visibility}
                onChange={(e) => void updateDocument(item.id, { visibility: e.target.value })}
                className="rounded border px-2 py-1 text-xs"
              >
                <option value="private">Privado</option>
                <option value="public">Público</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-4 text-xs">
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={item.aiPublicEnabled}
                  disabled={item.visibility !== 'public'}
                  onChange={(e) =>
                    void updateDocument(item.id, { aiPublicEnabled: e.target.checked })
                  }
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
                />
                Comité
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
