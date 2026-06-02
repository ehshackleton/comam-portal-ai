import { db, auditLogs } from '@comam/db';

export async function writeAuditLog(input: {
  actorUserId?: string;
  action: string;
  module: string;
  entityType?: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  beforeData?: unknown;
  afterData?: unknown;
}) {
  if (process.env.AUDIT_LOG_ENABLED === 'false') return;

  await db.insert(auditLogs).values({
    actorUserId: input.actorUserId,
    action: input.action,
    module: input.module,
    entityType: input.entityType,
    entityId: input.entityId,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
    beforeData: input.beforeData as Record<string, unknown> | undefined,
    afterData: input.afterData as Record<string, unknown> | undefined,
  });
}
