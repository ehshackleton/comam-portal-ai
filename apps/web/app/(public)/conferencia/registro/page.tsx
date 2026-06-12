'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { PageHeader } from '@/components/marketing/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { conferenciaContent } from '@/content/institutional/conferencia';

export default function RegistroConferenciaPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const form = new FormData(event.currentTarget);
    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: form.get('fullName'),
        email: form.get('email'),
        country: form.get('country'),
        city: form.get('city'),
        participantType: form.get('participantType'),
        attendanceMode: form.get('attendanceMode'),
        institutionName: form.get('institutionName'),
        delegation: form.get('delegation'),
        dietaryRestrictions: form.get('dietaryRestrictions'),
        accessibilityNeeds: form.get('accessibilityNeeds'),
        imageAuthorization: form.get('imageAuthorization') === 'on',
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? 'No se pudo enviar el registro.');
      return;
    }

    setMessage(data.message ?? 'Registro enviado correctamente.');
    event.currentTarget.reset();
  }

  return (
    <>
      <PageHeader
        eyebrow="Conferencia 2026"
        title="Registro de participación"
        description={conferenciaContent.registroIntro}
      />
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Formulario de inscripción</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid gap-4">
              <input
                name="fullName"
                required
                placeholder="Nombre completo"
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Correo electrónico"
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="country"
                  placeholder="País"
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
                <input
                  name="city"
                  placeholder="Ciudad"
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <select
                name="participantType"
                required
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Tipo de participante</option>
                <option value="delegate">Delegado/a</option>
                <option value="observer">Observador/a</option>
                <option value="speaker">Expositor/a</option>
                <option value="organizer">Organizador/a</option>
                <option value="guest">Invitado/a</option>
              </select>
              <select
                name="attendanceMode"
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Modalidad de asistencia</option>
                <option value="in_person">Presencial</option>
                <option value="virtual">Virtual</option>
              </select>
              <input
                name="institutionName"
                placeholder="Institución / obediencia"
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
              <input
                name="delegation"
                placeholder="Delegación"
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
              <textarea
                name="dietaryRestrictions"
                placeholder="Restricciones alimentarias (opcional)"
                rows={2}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
              <textarea
                name="accessibilityNeeds"
                placeholder="Necesidades de accesibilidad (opcional)"
                rows={2}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
              <label className="flex items-start gap-2 text-sm text-muted-foreground">
                <input name="imageAuthorization" type="checkbox" className="mt-1" />
                Autorizo el uso institucional de imagen en actividades de la conferencia.
              </label>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? 'Enviando…' : 'Enviar registro'}
              </Button>
            </form>
            {message ? <p className="mt-4 text-sm text-green-700">{message}</p> : null}
            {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
          </CardContent>
        </Card>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/conferencia" className="underline hover:text-foreground">
            Volver a la página de la conferencia
          </Link>
        </p>
      </div>
    </>
  );
}
