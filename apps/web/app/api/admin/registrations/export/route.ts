import { desc, eq } from 'drizzle-orm';
import { conferenceRegistrations, db } from '@comam/db';
import { getSessionUser, hasPermission } from '@/lib/auth/session';
import { writeAuditLog } from '@/lib/audit';
import {
  buildRegistrationsPdf,
  buildRegistrationsXlsx,
  type RegistrationExportRow,
} from '@/lib/exports/registrations';

const ALLOWED_STATUSES = ['submitted', 'under_review', 'approved', 'rejected', 'waitlist'] as const;

function exportFilename(extension: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `registros-comam-2026-${date}.${extension}`;
}

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user, 'registrations:read')) {
    return Response.json({ error: 'No autorizado' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format');
  const status = searchParams.get('status');

  if (format !== 'xlsx' && format !== 'pdf') {
    return Response.json({ error: 'Formato inválido. Use xlsx o pdf.' }, { status: 400 });
  }

  if (status && !ALLOWED_STATUSES.includes(status as (typeof ALLOWED_STATUSES)[number])) {
    return Response.json({ error: 'Estado inválido.' }, { status: 400 });
  }

  const rows = status
    ? await db
        .select()
        .from(conferenceRegistrations)
        .where(eq(conferenceRegistrations.status, status))
        .orderBy(desc(conferenceRegistrations.createdAt))
    : await db
        .select()
        .from(conferenceRegistrations)
        .orderBy(desc(conferenceRegistrations.createdAt));

  const exportRows = rows as RegistrationExportRow[];

  await writeAuditLog({
    actorUserId: user.id,
    action: 'registrations_exported',
    module: 'registrations',
    entityType: 'registration',
    afterData: { format, status: status ?? 'all', count: exportRows.length },
  });

  if (format === 'xlsx') {
    const buffer = buildRegistrationsXlsx(exportRows);
    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${exportFilename('xlsx')}"`,
      },
    });
  }

  const buffer = await buildRegistrationsPdf(exportRows);
  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${exportFilename('pdf')}"`,
    },
  });
}
