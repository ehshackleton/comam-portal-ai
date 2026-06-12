import { and, desc, eq } from 'drizzle-orm';
import type { Database } from '@comam/db';
import { articles, documents } from '@comam/db';
import { getConferenceFacts } from '../config';
import type { PublicContextResult } from '../types';
import { INSTITUTIONAL_FACTS } from './institutional-facts';
import { retrieveRelevantContext } from './rag-retrieval';

const MAX_ARTICLES = 10;
const MAX_DOCUMENTS = 10;
const MAX_DOC_CHARS = 2000;
const MAX_ARTICLE_CHARS = 1500;

function extractArticleText(content: unknown): string {
  if (
    typeof content === 'object' &&
    content !== null &&
    'blocks' in content &&
    Array.isArray((content as { blocks: { text?: string }[] }).blocks)
  ) {
    return (content as { blocks: { text?: string }[] }).blocks
      .map((b) => b.text ?? '')
      .join('\n\n')
      .trim();
  }
  return '';
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}…`;
}

export async function buildPublicContext(
  db: Database,
  userQuery?: string,
): Promise<PublicContextResult> {
  if (userQuery?.trim()) {
    const ragContext = await retrieveRelevantContext(db, userQuery);
    if (ragContext) {
      const conference = getConferenceFacts();
      return {
        context: [
          '### Hechos institucionales',
          INSTITUTIONAL_FACTS,
          `### Conferencia actual`,
          `- ${conference.name} — ${conference.city}, año ${conference.year}.`,
          ragContext.context,
        ].join('\n'),
        sources: [
          { type: 'institutional', title: 'Hechos institucionales COMAM' },
          { type: 'institutional', title: conference.name },
          ...ragContext.sources.filter((s) => s.type !== 'institutional'),
        ],
      };
    }
  }

  const conference = getConferenceFacts();
  const sources: PublicContextResult['sources'] = [
    {
      type: 'institutional',
      title: 'Hechos institucionales COMAM',
    },
    {
      type: 'institutional',
      title: conference.name,
    },
  ];

  const sections: string[] = [
    '### Hechos institucionales',
    INSTITUTIONAL_FACTS,
    '### Conferencia actual',
    `- ${conference.name} — ${conference.city}, año ${conference.year}.`,
  ];

  const publishedArticles = await db
    .select({
      id: articles.id,
      title: articles.title,
      slug: articles.slug,
      summary: articles.summary,
      content: articles.content,
    })
    .from(articles)
    .where(and(eq(articles.status, 'published'), eq(articles.visibility, 'public')))
    .orderBy(desc(articles.publishedAt))
    .limit(MAX_ARTICLES);

  if (publishedArticles.length > 0) {
    sections.push('### Artículos publicados');
    for (const article of publishedArticles) {
      const body = truncate(extractArticleText(article.content), MAX_ARTICLE_CHARS);
      sections.push(
        `- [Artículo] ${article.title} (slug: ${article.slug})`,
        article.summary ? `  Resumen: ${article.summary}` : '',
        body ? `  Contenido: ${body}` : '',
      );
      sources.push({ type: 'article', id: article.id, title: article.title });
    }
  }

  const publicDocs = await db
    .select({
      id: documents.id,
      title: documents.title,
      type: documents.type,
      contentText: documents.contentText,
      source: documents.source,
    })
    .from(documents)
    .where(and(eq(documents.visibility, 'public'), eq(documents.aiPublicEnabled, true)))
    .orderBy(desc(documents.updatedAt))
    .limit(MAX_DOCUMENTS);

  if (publicDocs.length > 0) {
    sections.push('### Documentos públicos habilitados para agente');
    for (const doc of publicDocs) {
      const text = doc.contentText ? truncate(doc.contentText, MAX_DOC_CHARS) : '(sin texto extraído)';
      sections.push(
        `- [Documento] ${doc.title} (tipo: ${doc.type})`,
        doc.source ? `  Fuente: ${doc.source}` : '',
        `  Contenido: ${text}`,
      );
      sources.push({ type: 'document', id: doc.id, title: doc.title });
    }
  }

  return {
    context: sections.filter(Boolean).join('\n'),
    sources,
  };
}
