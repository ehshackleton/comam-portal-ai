import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { indexDocumentForRag } from '@comam/ai/server';
import { db, documents } from '@comam/db';
import { getSessionUser, hasPermission } from '@/lib/auth/session';
import { uploadObject } from '@/lib/storage/minio';
import { writeAuditLog } from '@/lib/audit';
import { extractTextFromBuffer } from '@/lib/documents/extract-text';

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
  const aiPublicEnabled = form.get('aiPublicEnabled') === 'true';
  const file = form.get('file');

  if (!title || !(file instanceof File)) {
    return NextResponse.json({ error: 'Título y archivo requeridos' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const contentText = await extractTextFromBuffer(buffer, file.type || 'application/octet-stream');
  const key = `documents/${randomUUID()}-${file.name}`;
  await uploadObject(key, buffer, file.type || 'application/octet-stream');

  const [created] = await db
    .insert(documents)
    .values({
      title,
      type,
      visibility,
      fileUrl: key,
      contentText: contentText || null,
      aiPublicEnabled: visibility === 'public' && aiPublicEnabled,
    })
    .returning();

  if (created.aiPublicEnabled && contentText) {
    try {
      await indexDocumentForRag(db, created.id);
    } catch {
      // Indexación RAG no bloquea la carga
    }
  }

  await writeAuditLog({
    actorUserId: user.id,
    action: 'document_uploaded',
    module: 'documents',
    entityType: 'document',
    entityId: created.id,
    afterData: { title, visibility, key, aiPublicEnabled: created.aiPublicEnabled },
  });

  return NextResponse.json(created, { status: 201 });
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user, 'documents:update')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const body = (await request.json()) as {
    id?: string;
    title?: string;
    visibility?: string;
    aiPublicEnabled?: boolean;
    aiInternalEnabled?: boolean;
    aiCommitteeEnabled?: boolean;
  };

  if (!body.id) {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
  }

  const [existing] = await db.select().from(documents).where(eq(documents.id, body.id)).limit(1);
  if (!existing) {
    return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 });
  }

  const aiPublicEnabled =
    body.aiPublicEnabled !== undefined
      ? body.aiPublicEnabled
      : existing.aiPublicEnabled;

  const [updated] = await db
    .update(documents)
    .set({
      title: body.title ?? existing.title,
      visibility: body.visibility ?? existing.visibility,
      aiPublicEnabled:
        (body.visibility ?? existing.visibility) === 'public' ? aiPublicEnabled : false,
      aiInternalEnabled: body.aiInternalEnabled ?? existing.aiInternalEnabled,
      aiCommitteeEnabled: body.aiCommitteeEnabled ?? existing.aiCommitteeEnabled,
      updatedAt: new Date(),
    })
    .where(eq(documents.id, body.id))
    .returning();

  if (updated.aiPublicEnabled && updated.contentText) {
    try {
      await indexDocumentForRag(db, updated.id);
    } catch {
      // Indexación RAG no bloquea la actualización
    }
  }

  await writeAuditLog({
    actorUserId: user.id,
    action: 'document_updated',
    module: 'documents',
    entityType: 'document',
    entityId: body.id,
    afterData: updated,
  });

  return NextResponse.json(updated);
}
