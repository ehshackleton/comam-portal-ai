import { Suspense } from 'react';
import AdminLoginPage from './login-client';

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="text-sm text-stone-600">Cargando…</p>}>
      <AdminLoginPage />
    </Suspense>
  );
}
