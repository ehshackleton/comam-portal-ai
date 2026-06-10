import './load-env';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { closeDb, db } from './client';
import { sessions, twoFactorSecrets, users } from './schema';

const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@comam.cl';
const adminPassword = process.env.ADMIN_INITIAL_PASSWORD ?? 'change_me';

try {
  const [admin] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, adminEmail))
    .limit(1);

  if (!admin) {
    console.error(`No existe usuario ${adminEmail}. Ejecute pnpm db:seed primero.`);
    process.exitCode = 1;
  } else {
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    await db
      .update(users)
      .set({ passwordHash, twoFactorEnabled: false })
      .where(eq(users.email, adminEmail));
    await db.delete(twoFactorSecrets).where(eq(twoFactorSecrets.userId, admin.id));
    await db.delete(sessions).where(eq(sessions.userId, admin.id));

    console.log(`Admin restablecido: ${adminEmail}`);
    console.log(`Contraseña: ${adminPassword}`);
  }
} finally {
  await closeDb();
}
