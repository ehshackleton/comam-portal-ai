import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AdminNav } from '@/components/admin/admin-nav';
import { getSessionUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export default async function AdminAppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) {
    redirect('/admin/login');
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/admin/dashboard" className="text-lg font-semibold tracking-tight text-foreground">
            COMAM <span className="font-normal text-muted-foreground">· Backoffice</span>
          </Link>
          <AdminNav permissionKeys={user.permissionKeys} />
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </>
  );
}
