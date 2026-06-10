import { eq } from 'drizzle-orm';
import type { Database } from '@comam/db';
import { documentChunks, documentEmbeddings, documents } from '@comam/db';
import { getEmbeddingModel } from '../config';
import { chunkText } from './chunking';
import { generateEmbedding } from './embeddings';

export async function indexDocumentForRag(db: Database, documentId: string): Promise<void> {
  const [doc] = await db.select().from(documents).where(eq(documents.id, documentId)).limit(1);
  if (!doc?.contentText?.trim()) {
    return;
  }

  const existingChunks = await db
    .select({ id: documentChunks.id })
    .from(documentChunks)
    .where(eq(documentChunks.documentId, documentId));

  for (const chunk of existingChunks) {
    await db.delete(documentEmbeddings).where(eq(documentEmbeddings.chunkId, chunk.id));
  }
  await db.delete(documentChunks).where(eq(documentChunks.documentId, documentId));

  const chunks = chunkText(doc.contentText);
  const model = getEmbeddingModel();

  for (let index = 0; index < chunks.length; index += 1) {
    const content = chunks[index];
    if (!content) continue;

    const [chunkRow] = await db
      .insert(documentChunks)
      .values({
        documentId,
        chunkIndex: index,
        content,
        metadata: { title: doc.title, type: doc.type },
      })
      .returning();

    if (!chunkRow) continue;

    const embedding = await generateEmbedding(content);
    await db.insert(documentEmbeddings).values({
      chunkId: chunkRow.id,
      embedding,
      model,
    });
  }
}
