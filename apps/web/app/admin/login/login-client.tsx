'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Button, Card } from '@comam/ui';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(event.currentTarget);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.get('email'),
        password: form.get('password'),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? 'Error de autenticación');
      return;
    }

    sessionStorage.setItem('comam_pending_token', data.pendingToken);
    if (data.secret) sessionStorage.setItem('comam_otp_secret', data.secret);

    if (data.requiresOtpSetup) {
      router.push('/admin/setup-otp');
      return;
    }

    router.push('/admin/otp');
  }

  return (
    <Card title="Acceso administrativo">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-stone-600" htmlFor="email">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-stone-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-stone-600" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-md border border-stone-300 px-3 py-2"
          />
        </div>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <Button type="submit" disabled={loading}>
          {loading ? 'Verificando…' : 'Continuar'}
        </Button>
      </form>
      {searchParams.get('next') ? (
        <p className="mt-4 text-xs text-stone-500">Será redirigido tras autenticarse.</p>
      ) : null}
    </Card>
  );
}
