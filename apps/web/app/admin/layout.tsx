import { AdminNav } from '@/components/admin/admin-nav';
import { getSessionUser } from '@/lib/auth/session';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  return (
    <div className="min-h-screen bg-background">
      {user ? (
        <header className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <span className="font-semibold text-foreground">Backoffice COMAM</span>
            <AdminNav permissionKeys={user.permissionKeys} />
          </div>
        </header>
      ) : null}
      <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
    </div>
  );
}
