import { and, eq, sql } from 'drizzle-orm';
import type { Database } from '@comam/db';
import { documentChunks, documentEmbeddings, documents } from '@comam/db';
import type { PublicContextResult } from '../types';
import { generateEmbedding } from './embeddings';

const TOP_K = 5;

export async function retrieveRelevantContext(
  db: Database,
  query: string,
): Promise<PublicContextResult | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  let queryEmbedding: number[];
  try {
    queryEmbedding = await generateEmbedding(trimmed);
  } catch {
    return null;
  }

  const vectorLiteral = `[${queryEmbedding.join(',')}]`;

  const rows = await db
    .select({
      chunkContent: documentChunks.content,
      docId: documents.id,
      docTitle: documents.title,
      docType: documents.type,
      distance: sql<number>`${documentEmbeddings.embedding} <=> ${vectorLiteral}::vector`,
    })
    .from(documentEmbeddings)
    .innerJoin(documentChunks, eq(documentEmbeddings.chunkId, documentChunks.id))
    .innerJoin(documents, eq(documentChunks.documentId, documents.id))
    .where(
      and(eq(documents.visibility, 'public'), eq(documents.aiPublicEnabled, true)),
    )
    .orderBy(sql`${documentEmbeddings.embedding} <=> ${vectorLiteral}::vector`)
    .limit(TOP_K);

  const relevant = rows.filter((row) => row.distance < 0.85);
  if (relevant.length === 0) {
    return null;
  }

  const sources: PublicContextResult['sources'] = [
    { type: 'institutional', title: 'Búsqueda semántica documental' },
  ];

  const sections: string[] = ['### Fragmentos relevantes (RAG)'];
  const seenDocs = new Set<string>();

  for (const row of relevant) {
    sections.push(
      `- [Documento] ${row.docTitle} (tipo: ${row.docType})`,
      `  Fragmento: ${row.chunkContent}`,
    );
    if (!seenDocs.has(row.docId)) {
      seenDocs.add(row.docId);
      sources.push({ type: 'document', id: row.docId, title: row.docTitle });
    }
  }

  return {
    context: sections.join('\n'),
    sources,
  };
}
