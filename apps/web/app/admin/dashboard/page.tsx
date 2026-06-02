import { redirect } from 'next/navigation';
import { count, eq } from 'drizzle-orm';
import { articles, conferenceRegistrations, db, documents } from '@comam/db';
import { Card } from '@comam/ui';
import { getSessionUser } from '@/lib/auth/session';

export default async function AdminDashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');

  const [[articleCount], [registrationCount], [documentCount]] = await Promise.all([
    db.select({ value: count() }).from(articles),
    db.select({ value: count() }).from(conferenceRegistrations),
    db.select({ value: count() }).from(documents),
  ]);

  const [publishedCount] = await db
    .select({ value: count() })
    .from(articles)
    .where(eq(articles.status, 'published'));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-stone-900">Panel administrativo</h1>
        <p className="text-stone-600">Bienvenido, {user.fullName}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Artículos">
          <p className="text-3xl font-semibold">{articleCount.value}</p>
          <p className="text-sm text-stone-500">{publishedCount.value} publicados</p>
        </Card>
        <Card title="Registros conferencia">
          <p className="text-3xl font-semibold">{registrationCount.value}</p>
        </Card>
        <Card title="Documentos">
          <p className="text-3xl font-semibold">{documentCount.value}</p>
        </Card>
      </div>
    </div>
  );
}
