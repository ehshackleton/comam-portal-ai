'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { Button, Card } from '@comam/ui';

type Article = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: { blocks?: { text?: string }[] };
  status: string;
  visibility: string;
};

function extractContent(article: Article): string {
  return article.content?.blocks?.map((block) => block.text ?? '').join('\n\n') ?? '';
}

export default function AdminArticlesPage() {
  const [items, setItems] = useState<Article[]>([]);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editStatus, setEditStatus] = useState('draft');
  const [editVisibility, setEditVisibility] = useState('public');

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

  function startEdit(article: Article) {
    setEditingId(article.id);
    setEditTitle(article.title);
    setEditSummary(article.summary ?? '');
    setEditContent(extractContent(article));
    setEditStatus(article.status);
    setEditVisibility(article.visibility);
  }

  async function saveEdit() {
    if (!editingId) return;
    const res = await fetch('/api/admin/articles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingId,
        title: editTitle,
        summary: editSummary,
        content: editContent,
        status: editStatus,
        visibility: editVisibility,
      }),
    });
    if (res.ok) {
      setMessage('Artículo actualizado');
      setEditingId(null);
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
          <textarea name="content" placeholder="Contenido" rows={6} className="rounded border px-3 py-2" />
          <select name="status" className="rounded border px-3 py-2">
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
          </select>
          <Button type="submit">Guardar</Button>
        </form>
        {message ? <p className="mt-2 text-sm text-green-700">{message}</p> : null}
      </Card>

      {editingId ? (
        <Card title="Editar artículo">
          <div className="grid gap-3">
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Título"
              className="rounded border px-3 py-2"
            />
            <input
              value={editSummary}
              onChange={(e) => setEditSummary(e.target.value)}
              placeholder="Resumen"
              className="rounded border px-3 py-2"
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Contenido"
              rows={8}
              className="rounded border px-3 py-2"
            />
            <div className="flex gap-3">
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="rounded border px-3 py-2"
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
                <option value="archived">Archivado</option>
              </select>
              <select
                value={editVisibility}
                onChange={(e) => setEditVisibility(e.target.value)}
                className="rounded border px-3 py-2"
              >
                <option value="public">Público</option>
                <option value="private">Privado</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => void saveEdit()}>Guardar cambios</Button>
              <Button variant="secondary" onClick={() => setEditingId(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      <ul className="divide-y rounded border bg-white">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-stone-500">
                {item.status} · {item.visibility} · /articulos/{item.slug}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="secondary" onClick={() => startEdit(item)}>
                Editar
              </Button>
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
