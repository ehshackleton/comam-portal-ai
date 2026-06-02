'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Button, Card } from '@comam/ui';

type Document = {
  id: string;
  title: string;
  type: string;
  visibility: string;
};

export default function AdminDocumentsPage() {
  const [items, setItems] = useState<Document[]>([]);

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
      event.currentTarget.reset();
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
          <input name="file" type="file" required className="text-sm" />
          <Button type="submit">Subir</Button>
        </form>
      </Card>
      <ul className="divide-y rounded border bg-white">
        {items.map((item) => (
          <li key={item.id} className="px-4 py-3 text-sm">
            <p className="font-medium">{item.title}</p>
            <p className="text-stone-500">
              {item.type} · {item.visibility}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
