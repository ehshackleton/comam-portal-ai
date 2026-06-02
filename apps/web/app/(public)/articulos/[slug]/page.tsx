import Link from 'next/link';
import { notFound } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { articles, db } from '@comam/db';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
    <article>
      <div className="hero-glow border-b border-border px-6 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <Badge variant="secondary">Artículo</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">{article.title}</h1>
          {article.summary ? (
            <p className="mt-4 text-lg text-muted-foreground">{article.summary}</p>
          ) : null}
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="prose prose-slate max-w-none whitespace-pre-wrap leading-relaxed text-foreground">
          {content}
        </div>
        <div className="mt-12">
          <Button asChild variant="secondary">
            <Link href="/articulos">← Volver a artículos</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
