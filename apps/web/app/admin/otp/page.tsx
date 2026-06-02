'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Button, Card } from '@comam/ui';

export default function AdminOtpPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const pendingToken = sessionStorage.getItem('comam_pending_token');

    const res = await fetch('/api/auth/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pendingToken, code: form.get('code') }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Código inválido');
      return;
    }

    sessionStorage.removeItem('comam_pending_token');
    router.push('/admin/dashboard');
  }

  return (
    <Card title="Verificación OTP">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-stone-600" htmlFor="code">
            Código de autenticación
          </label>
          <input
            id="code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            className="w-full rounded-md border border-stone-300 px-3 py-2"
          />
        </div>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <Button type="submit">Ingresar</Button>
      </form>
    </Card>
  );
}
