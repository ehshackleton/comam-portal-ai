'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { Button, Card } from '@comam/ui';

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

    setTimeout(() => router.push('/admin/dashboard'), 4000);
  }

  return (
    <Card title="Configurar doble factor (OTP)">
      <p className="mb-4 text-sm text-stone-600">
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
          className="w-full rounded-md border border-stone-300 px-3 py-2"
        />
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <Button type="submit">Activar OTP</Button>
      </form>
      {recoveryCodes.length > 0 ? (
        <div className="mt-6 rounded border border-amber-200 bg-amber-50 p-4 text-sm">
          <p className="font-medium">Guarde sus códigos de recuperación:</p>
          <ul className="mt-2 font-mono">
            {recoveryCodes.map((code) => (
              <li key={code}>{code}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </Card>
  );
}
