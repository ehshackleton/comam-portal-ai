import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import { db, sessions, users, roles, permissions, rolePermissions } from '@comam/db';
import { generateSessionToken, hashToken } from '@comam/auth';
import { appConfig } from '@/lib/env';

export const SESSION_COOKIE = 'comam_session';

export async function createSession(userId: string): Promise<string> {
  const token = generateSessionToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + appConfig.adminSessionMaxAge * 1000);

  await db.insert(sessions).values({
    userId,
    tokenHash,
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });

  return token;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.tokenHash, hashToken(token)));
    cookieStore.delete(SESSION_COOKIE);
  }
}

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  roleName: string | null;
  permissionKeys: string[];
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const tokenHash = hashToken(token);
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.tokenHash, tokenHash))
    .limit(1);

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
  if (!user || user.status !== 'active') return null;

  let roleName: string | null = null;
  const permissionKeys: string[] = [];

  if (user.roleId) {
    const [role] = await db.select().from(roles).where(eq(roles.id, user.roleId)).limit(1);
    roleName = role?.name ?? null;

    const rows = await db
      .select({ key: permissions.key })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, user.roleId));

    permissionKeys.push(...rows.map((r) => r.key));
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    roleName,
    permissionKeys,
  };
}

export function hasPermission(user: SessionUser, key: string): boolean {
  return user.permissionKeys.includes(key);
}
