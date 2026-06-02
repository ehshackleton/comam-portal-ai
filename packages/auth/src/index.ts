import bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';
import { createHash, randomBytes } from 'node:crypto';

authenticator.options = { window: 1 };

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateOtpSecret(): string {
  return authenticator.generateSecret();
}

export function verifyOtpToken(secret: string, token: string): boolean {
  return authenticator.verify({ token, secret });
}

export function getOtpAuthUrl(email: string, secret: string, issuer = 'COMAM'): string {
  return authenticator.keyuri(email, issuer, secret);
}

export function generateRecoveryCodes(count = 8): string[] {
  return Array.from({ length: count }, () => randomBytes(4).toString('hex'));
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function generateSessionToken(): string {
  return randomBytes(32).toString('base64url');
}
