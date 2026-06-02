import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { articles, db } from '@comam/db';
import { slugify } from '@comam/shared';
import { getSessionUser, hasPermission } from '@/lib/auth/session';
import { writeAuditLog } from '@/lib/audit';

export async function GET() {
  const user = await getSessionUser();
  if (!user || !hasPermission(user, 'articles:read')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const rows = await db.select().from(articles).orderBy(desc(articles.updatedAt));
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user, 'articles:create')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const body = (await request.json()) as {
    title?: string;
    summary?: string;
    content?: string;
    status?: string;
    visibility?: string;
  };

  if (!body.title?.trim()) {
    return NextResponse.json({ error: 'Título requerido' }, { status: 400 });
  }

  const slug = slugify(body.title);
  const [created] = await db
    .insert(articles)
    .values({
      title: body.title.trim(),
      slug,
      summary: body.summary ?? null,
      content: { blocks: [{ type: 'paragraph', text: body.content ?? '' }] },
      status: body.status ?? 'draft',
      visibility: body.visibility ?? 'public',
      authorId: user.id,
      publishedAt: body.status === 'published' ? new Date() : null,
    })
    .returning();

  await writeAuditLog({
    actorUserId: user.id,
    action: 'article_created',
    module: 'articles',
    entityType: 'article',
    entityId: created.id,
    afterData: created,
  });

  return NextResponse.json(created, { status: 201 });
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user, 'articles:update')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const body = (await request.json()) as {
    id?: string;
    title?: string;
    summary?: string;
    content?: string;
    status?: string;
    visibility?: string;
  };

  if (!body.id) {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
  }

  const [updated] = await db
    .update(articles)
    .set({
      title: body.title,
      summary: body.summary,
      content: body.content
        ? { blocks: [{ type: 'paragraph', text: body.content }] }
        : undefined,
      status: body.status,
      visibility: body.visibility,
      publishedAt: body.status === 'published' ? new Date() : undefined,
      updatedAt: new Date(),
    })
    .where(eq(articles.id, body.id))
    .returning();

  await writeAuditLog({
    actorUserId: user.id,
    action: 'article_updated',
    module: 'articles',
    entityType: 'article',
    entityId: body.id,
    afterData: updated,
  });

  return NextResponse.json(updated);
}
