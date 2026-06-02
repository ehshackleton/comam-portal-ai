import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, twoFactorSecrets } from '@comam/db';
import { verifyOtpToken } from '@comam/auth';
import { verifyPendingAuth } from '@/lib/auth/pending';
import { createSession } from '@/lib/auth/session';
import { writeAuditLog } from '@/lib/audit';

export async function POST(request: Request) {
  const body = (await request.json()) as { pendingToken?: string; code?: string };
  const pending = body.pendingToken ? await verifyPendingAuth(body.pendingToken) : null;

  if (!pending || pending.step !== 'otp-verify' || !body.code) {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 401 });
  }

  const [record] = await db
    .select()
    .from(twoFactorSecrets)
    .where(eq(twoFactorSecrets.userId, pending.userId))
    .limit(1);

  if (!record || !verifyOtpToken(record.secret, body.code)) {
    await writeAuditLog({
      actorUserId: pending.userId,
      action: 'otp_verify_failed',
      module: 'auth',
    });
    return NextResponse.json({ error: 'Código OTP inválido' }, { status: 401 });
  }

  await writeAuditLog({
    actorUserId: pending.userId,
    action: 'otp_verify_ok',
    module: 'auth',
  });

  await createSession(pending.userId);

  return NextResponse.json({ ok: true });
}
