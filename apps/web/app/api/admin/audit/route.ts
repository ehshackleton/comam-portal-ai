import { NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';
import { auditLogs, db } from '@comam/db';
import { getSessionUser, hasPermission } from '@/lib/auth/session';

export async function GET() {
  const user = await getSessionUser();
  if (!user || !hasPermission(user, 'audit:read')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const rows = await db
    .select()
    .from(auditLogs)
    .orderBy(desc(auditLogs.createdAt))
    .limit(200);

  return NextResponse.json(rows);
}
