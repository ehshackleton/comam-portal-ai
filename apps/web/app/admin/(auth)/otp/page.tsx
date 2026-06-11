'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminInputClassName, adminLabelClassName } from '@/lib/admin/form-classes';

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
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verificación OTP</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className={adminLabelClassName} htmlFor="code">
              Código de autenticación
            </label>
            <input
              id="code"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              className={adminInputClassName}
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" className="w-full">
            Ingresar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
