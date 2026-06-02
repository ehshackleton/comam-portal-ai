import { NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { db, documents } from '@comam/db';
import { getSessionUser, hasPermission } from '@/lib/auth/session';
import { uploadObject } from '@/lib/storage/minio';
import { writeAuditLog } from '@/lib/audit';

export async function GET() {
  const user = await getSessionUser();
  if (!user || !hasPermission(user, 'documents:read')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const rows = await db.select().from(documents).orderBy(desc(documents.updatedAt));
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user, 'documents:create')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const form = await request.formData();
  const title = String(form.get('title') ?? '').trim();
  const type = String(form.get('type') ?? 'document');
  const visibility = String(form.get('visibility') ?? 'private');
  const file = form.get('file');

  if (!title || !(file instanceof File)) {
    return NextResponse.json({ error: 'Título y archivo requeridos' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `documents/${randomUUID()}-${file.name}`;
  await uploadObject(key, buffer, file.type || 'application/octet-stream');

  const [created] = await db
    .insert(documents)
    .values({
      title,
      type,
      visibility,
      fileUrl: key,
    })
    .returning();

  await writeAuditLog({
    actorUserId: user.id,
    action: 'document_uploaded',
    module: 'documents',
    entityType: 'document',
    entityId: created.id,
    afterData: { title, visibility, key },
  });

  return NextResponse.json(created, { status: 201 });
}
