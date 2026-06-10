import { desc, eq } from 'drizzle-orm';
import { articles, db } from '@comam/db';
import { PageHeader } from '@/components/marketing/page-header';
import { ContentListCard } from '@/components/marketing/content-list-card';
import { DbUnavailableNotice } from '@/components/marketing/db-unavailable-notice';
import { safeDbQuery } from '@/lib/db-safe';

export const metadata = { title: 'Artículos' };

export const dynamic = 'force-dynamic';

export default async function ArticulosPage() {
  const { data: rows, dbUnavailable } = await safeDbQuery(
    () =>
      db
        .select({
          id: articles.id,
          title: articles.title,
          slug: articles.slug,
          summary: articles.summary,
          publishedAt: articles.publishedAt,
        })
        .from(articles)
        .where(eq(articles.status, 'published'))
        .orderBy(desc(articles.publishedAt)),
    [],
  );

  return (
    <>
      <PageHeader
        eyebrow="Publicaciones"
        title="Artículos"
        description="Noticias y textos institucionales publicados por la organización."
      />
      <div className="mx-auto max-w-4xl space-y-6 px-6 py-12 md:py-16">
        {dbUnavailable ? <DbUnavailableNotice /> : null}
        {!dbUnavailable && rows.length === 0 ? (
          <p className="text-center text-muted-foreground">No hay artículos publicados aún.</p>
        ) : null}
        {rows.length > 0 ? (
          <div className="grid gap-4">
            {rows.map((article) => (
              <ContentListCard
                key={article.id}
                title={article.title}
                description={article.summary}
                href={`/articulos/${article.slug}`}
                badge="Publicado"
                meta={
                  article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString('es-CL')
                    : undefined
                }
              />
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
