import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from './client';
import { permissions, rolePermissions, roles, users } from './schema';

const BASE_PERMISSIONS = [
  'articles:create',
  'articles:read',
  'articles:update',
  'articles:publish',
  'articles:archive',
  'documents:create',
  'documents:read',
  'documents:update',
  'documents:delete',
  'documents:classify',
  'documents:enable_ai',
  'users:create',
  'users:read',
  'users:update',
  'users:disable',
  'users:reset_2fa',
  'users:assign_role',
  'registrations:read',
  'registrations:update',
  'registrations:approve',
  'email:create_template',
  'email:send_campaign',
  'audit:read',
  'settings:update',
  'ai:configure_agent',
] as const;

const [superadminRole] = await db
  .insert(roles)
  .values({
    name: 'superadmin',
    description: 'Control total del sistema',
  })
  .onConflictDoNothing()
  .returning();

let roleId = superadminRole?.id;
if (!roleId) {
  const existing = await db.select().from(roles).where(eq(roles.name, 'superadmin')).limit(1);
  roleId = existing[0]?.id;
}

if (!roleId) {
  throw new Error('No se pudo crear el rol superadmin');
}

for (const key of BASE_PERMISSIONS) {
  const [perm] = await db
    .insert(permissions)
    .values({ key, description: key })
    .onConflictDoNothing()
    .returning();

  const permId =
    perm?.id ??
    (await db.select().from(permissions).where(eq(permissions.key, key)).limit(1))[0]?.id;

  if (permId) {
    await db.insert(rolePermissions).values({ roleId, permissionId: permId }).onConflictDoNothing();
  }
}

const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@comam.cl';
const adminPassword = process.env.ADMIN_INITIAL_PASSWORD ?? 'change_me';
const passwordHash = await bcrypt.hash(adminPassword, 12);

const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);
if (existingAdmin.length === 0) {
  await db.insert(users).values({
    email: adminEmail,
    passwordHash,
    fullName: 'Administrador COMAM',
    status: 'active',
    roleId,
    twoFactorEnabled: false,
  });
}

console.log(`Seed completado. Admin: ${adminEmail}`);
