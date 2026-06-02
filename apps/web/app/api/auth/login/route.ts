import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, twoFactorSecrets, users } from '@comam/db';
import { verifyPassword } from '@comam/auth';
import { signPendingAuth } from '@/lib/auth/pending';
import { writeAuditLog } from '@/lib/audit';

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? '';

  if (!email || !password) {
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  const invalid = () =>
    NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });

  if (!user?.passwordHash || user.status !== 'active') {
    await writeAuditLog({
      action: 'login_failed',
      module: 'auth',
      afterData: { email },
    });
    return invalid();
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    await writeAuditLog({
      actorUserId: user.id,
      action: 'login_failed',
      module: 'auth',
    });
    return invalid();
  }

  const [twoFa] = await db
    .select()
    .from(twoFactorSecrets)
    .where(eq(twoFactorSecrets.userId, user.id))
    .limit(1);

  const step = user.twoFactorEnabled && twoFa ? 'otp-verify' : 'otp-setup';
  const pendingToken = await signPendingAuth({ userId: user.id, step });

  await writeAuditLog({
    actorUserId: user.id,
    action: 'login_password_ok',
    module: 'auth',
  });

  return NextResponse.json({
    pendingToken,
    step,
    requiresOtp: step === 'otp-verify',
    requiresOtpSetup: step === 'otp-setup',
  });
}
