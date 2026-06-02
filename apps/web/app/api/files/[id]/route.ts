import { NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { db, documents } from '@comam/db';
import { getSignedDownloadUrl } from '@/lib/storage/minio';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const [doc] = await db
    .select()
    .from(documents)
    .where(and(eq(documents.id, id), eq(documents.visibility, 'public')))
    .limit(1);

  if (!doc?.fileUrl) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }

  const url = await getSignedDownloadUrl(doc.fileUrl);
  return NextResponse.redirect(url);
}
