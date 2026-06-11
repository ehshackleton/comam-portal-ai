'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminInputClassName } from '@/lib/admin/form-classes';

export default function SetupOtpPage() {
  const router = useRouter();
  const [secret, setSecret] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function init() {
      const pendingToken = sessionStorage.getItem('comam_pending_token');
      const res = await fetch('/api/auth/setup-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pendingToken }),
      });
      const data = await res.json();
      if (res.ok) {
        setSecret(data.secret);
        setQrDataUrl(data.qrDataUrl);
        sessionStorage.setItem('comam_otp_secret', data.secret);
      }
    }
    void init();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const pendingToken = sessionStorage.getItem('comam_pending_token');
    const otpSecret = sessionStorage.getItem('comam_otp_secret') ?? secret;

    const res = await fetch('/api/auth/setup-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pendingToken,
        secret: otpSecret,
        code: form.get('code'),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'No se pudo validar el código');
      return;
    }

    setRecoveryCodes(data.recoveryCodes ?? []);
    sessionStorage.removeItem('comam_pending_token');
    sessionStorage.removeItem('comam_otp_secret');

    setTimeout(() => {
      router.push('/admin/dashboard');
      router.refresh();
    }, 4000);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurar doble factor (OTP)</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          Escanee el código con su aplicación de autenticación y confirme con un código de 6 dígitos.
        </p>
        {qrDataUrl ? (
          <Image src={qrDataUrl} alt="QR OTP" width={200} height={200} className="mb-4" unoptimized />
        ) : null}
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            name="code"
            inputMode="numeric"
            required
            placeholder="Código OTP"
            className={adminInputClassName}
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" className="w-full">
            Activar OTP
          </Button>
        </form>
        {recoveryCodes.length > 0 ? (
          <div className="mt-6 rounded-lg border border-border bg-accent p-4 text-sm">
            <p className="font-medium text-accent-foreground">Guarde sus códigos de recuperación:</p>
            <ul className="mt-2 font-mono text-muted-foreground">
              {recoveryCodes.map((code) => (
                <li key={code}>{code}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
