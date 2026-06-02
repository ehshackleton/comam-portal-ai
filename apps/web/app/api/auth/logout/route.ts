import { NextResponse } from 'next/server';
import { destroySession, getSessionUser } from '@/lib/auth/session';
import { writeAuditLog } from '@/lib/audit';

export async function POST() {
  const user = await getSessionUser();
  await destroySession();

  if (user) {
    await writeAuditLog({
      actorUserId: user.id,
      action: 'logout',
      module: 'auth',
    });
  }

  return NextResponse.json({ ok: true });
}
