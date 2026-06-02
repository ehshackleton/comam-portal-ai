import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import QRCode from 'qrcode';
import { db, twoFactorSecrets, users } from '@comam/db';
import {
  generateOtpSecret,
  generateRecoveryCodes,
  getOtpAuthUrl,
  verifyOtpToken,
} from '@comam/auth';
import { verifyPendingAuth } from '@/lib/auth/pending';
import { createSession } from '@/lib/auth/session';
import { appConfig } from '@/lib/env';
import { writeAuditLog } from '@/lib/audit';

export async function POST(request: Request) {
  const body = (await request.json()) as {
    pendingToken?: string;
    code?: string;
    secret?: string;
  };

  const pending = body.pendingToken ? await verifyPendingAuth(body.pendingToken) : null;
  if (!pending || pending.step !== 'otp-setup') {
    return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
  }

  const secret = body.secret ?? generateOtpSecret();

  if (!body.code) {
    const [user] = await db.select().from(users).where(eq(users.id, pending.userId)).limit(1);
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const otpauthUrl = getOtpAuthUrl(user.email, secret, appConfig.otpIssuer);
    const qrDataUrl = await QRCode.toDataURL(otpauthUrl);

    return NextResponse.json({ secret, otpauthUrl, qrDataUrl });
  }

  if (!verifyOtpToken(secret, body.code)) {
    return NextResponse.json({ error: 'Código OTP inválido' }, { status: 401 });
  }

  const recoveryCodes = generateRecoveryCodes();

  await db
    .insert(twoFactorSecrets)
    .values({
      userId: pending.userId,
      secret,
      recoveryCodes,
    })
    .onConflictDoUpdate({
      target: twoFactorSecrets.userId,
      set: { secret, recoveryCodes },
    });

  await db
    .update(users)
    .set({ twoFactorEnabled: true, updatedAt: new Date() })
    .where(eq(users.id, pending.userId));

  await writeAuditLog({
    actorUserId: pending.userId,
    action: 'otp_setup_completed',
    module: 'auth',
  });

  await createSession(pending.userId);

  return NextResponse.json({ ok: true, recoveryCodes });
}
