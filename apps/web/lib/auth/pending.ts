import { SignJWT, jwtVerify } from 'jose';
import { appConfig } from '@/lib/env';

const secret = new TextEncoder().encode(appConfig.authSecret);

export type PendingAuthPayload = {
  userId: string;
  step: 'otp-setup' | 'otp-verify';
};

export async function signPendingAuth(payload: PendingAuthPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(secret);
}

export async function verifyPendingAuth(token: string): Promise<PendingAuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.userId !== 'string' || typeof payload.step !== 'string') {
      return null;
    }
    if (payload.step !== 'otp-setup' && payload.step !== 'otp-verify') {
      return null;
    }
    return { userId: payload.userId, step: payload.step };
  } catch {
    return null;
  }
}
