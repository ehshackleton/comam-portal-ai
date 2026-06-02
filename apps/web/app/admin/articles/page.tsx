'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { Button, Card } from '@comam/ui';

type Article = {
  id: string;
  title: string;
  slug: string;
  status: string;
  visibility: string;
};

export default function AdminArticlesPage() {
  const [items, setItems] = useState<Article[]>([]);
  const [message, setMessage] = useState('');

  async function load() {
    const res = await fetch('/api/admin/articles');
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => {
    void load();
  }, []);

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const res = await fetch('/api/admin/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.get('title'),
        summary: form.get('summary'),
        content: form.get('content'),
        status: form.get('status'),
      }),
    });
    if (res.ok) {
      setMessage('Artículo creado');
      event.currentTarget.reset();
      await load();
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">Artículos</h1>
      <Card title="Nuevo artículo">
        <form onSubmit={onCreate} className="grid gap-3">
          <input name="title" placeholder="Título" required className="rounded border px-3 py-2" />
          <input name="summary" placeholder="Resumen" className="rounded border px-3 py-2" />
          <textarea name="content" placeholder="Contenido" rows={4} className="rounded border px-3 py-2" />
          <select name="status" className="rounded border px-3 py-2">
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
          </select>
          <Button type="submit">Guardar</Button>
        </form>
        {message ? <p className="mt-2 text-sm text-green-700">{message}</p> : null}
      </Card>
      <ul className="divide-y rounded border bg-white">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-stone-500">
                {item.status} · /articulos/{item.slug}
              </p>
            </div>
            {item.status !== 'published' ? (
              <Button
                variant="secondary"
                onClick={async () => {
                  await fetch('/api/admin/articles', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: item.id, status: 'published' }),
                  });
                  await load();
                }}
              >
                Publicar
              </Button>
            ) : (
              <Link href={`/articulos/${item.slug}`} className="text-stone-600 underline">
                Ver
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
