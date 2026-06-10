import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import {
  conferenceRegistrations,
  db,
  registrationStatusHistory,
} from '@comam/db';
import { getSessionUser, hasPermission } from '@/lib/auth/session';
import { writeAuditLog } from '@/lib/audit';

const ALLOWED_STATUSES = ['submitted', 'under_review', 'approved', 'rejected', 'waitlist'] as const;

export async function GET() {
  const user = await getSessionUser();
  if (!user || !hasPermission(user, 'registrations:read')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const rows = await db
    .select()
    .from(conferenceRegistrations)
    .orderBy(desc(conferenceRegistrations.createdAt));

  return NextResponse.json(rows);
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user, 'registrations:update')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const body = (await request.json()) as {
    id?: string;
    status?: string;
    note?: string;
  };

  if (!body.id || !body.status) {
    return NextResponse.json({ error: 'ID y estado requeridos' }, { status: 400 });
  }

  if (!ALLOWED_STATUSES.includes(body.status as (typeof ALLOWED_STATUSES)[number])) {
    return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
  }

  const [existing] = await db
    .select()
    .from(conferenceRegistrations)
    .where(eq(conferenceRegistrations.id, body.id))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: 'Registro no encontrado' }, { status: 404 });
  }

  const [updated] = await db
    .update(conferenceRegistrations)
    .set({
      status: body.status,
      updatedAt: new Date(),
    })
    .where(eq(conferenceRegistrations.id, body.id))
    .returning();

  await db.insert(registrationStatusHistory).values({
    registrationId: body.id,
    previousStatus: existing.status,
    newStatus: body.status,
    changedBy: user.id,
    note: body.note?.trim() || null,
  });

  await writeAuditLog({
    actorUserId: user.id,
    action: 'registration_status_updated',
    module: 'registrations',
    entityType: 'registration',
    entityId: body.id,
    beforeData: { status: existing.status },
    afterData: { status: body.status, note: body.note },
  });

  return NextResponse.json(updated);
}
