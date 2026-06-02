import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';
import { articles, db } from '@comam/db';

export const metadata = { title: 'Artículos' };

export const dynamic = 'force-dynamic';

export default async function ArticulosPage() {
  const rows = await db
    .select({
      id: articles.id,
      title: articles.title,
      slug: articles.slug,
      summary: articles.summary,
      publishedAt: articles.publishedAt,
    })
    .from(articles)
    .where(eq(articles.status, 'published'))
    .orderBy(desc(articles.publishedAt));

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-semibold text-stone-900">Artículos</h1>
      {rows.length === 0 ? (
        <p className="text-stone-600">No hay artículos publicados aún.</p>
      ) : (
        <ul className="space-y-6">
          {rows.map((article) => (
            <li key={article.id} className="border-b border-stone-200 pb-6">
              <Link href={`/articulos/${article.slug}`} className="group">
                <h2 className="text-2xl font-semibold text-stone-900 group-hover:underline">
                  {article.title}
                </h2>
                {article.summary ? (
                  <p className="mt-2 text-stone-600">{article.summary}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
