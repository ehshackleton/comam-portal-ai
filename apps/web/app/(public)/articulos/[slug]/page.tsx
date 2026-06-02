import { notFound } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { articles, db } from '@comam/db';

export const dynamic = 'force-dynamic';

export default async function ArticuloPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [article] = await db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.status, 'published')))
    .limit(1);

  if (!article) notFound();

  const content =
    typeof article.content === 'object' &&
    article.content !== null &&
    'blocks' in article.content &&
    Array.isArray((article.content as { blocks: { text?: string }[] }).blocks)
      ? (article.content as { blocks: { text?: string }[] }).blocks
          .map((b) => b.text ?? '')
          .join('\n\n')
      : '';

  return (
    <article className="max-w-3xl space-y-6">
      <h1 className="text-4xl font-semibold text-stone-900">{article.title}</h1>
      {article.summary ? <p className="text-lg text-stone-600">{article.summary}</p> : null}
      <div className="whitespace-pre-wrap leading-relaxed text-stone-800">{content}</div>
    </article>
  );
}
