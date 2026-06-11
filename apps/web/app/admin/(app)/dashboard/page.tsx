import { count, eq } from 'drizzle-orm';
import { articles, conferenceRegistrations, db, documents } from '@comam/db';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSessionUser } from '@/lib/auth/session';

export default async function AdminDashboardPage() {
  const user = await getSessionUser();

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
      <AdminPageHeader
        title="Panel administrativo"
        description={`Bienvenido, ${user?.fullName ?? 'Administrador'}`}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Artículos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-foreground">{articleCount.value}</p>
            <p className="text-sm text-muted-foreground">{publishedCount.value} publicados</p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Registros conferencia</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-foreground">{registrationCount.value}</p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Documentos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-foreground">{documentCount.value}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
