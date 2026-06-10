import {
  boolean,
  inet,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  vector,
} from 'drizzle-orm/pg-core';

export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const permissions = pgTable('permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').notNull().unique(),
  description: text('description'),
});

export const rolePermissions = pgTable(
  'role_permissions',
  {
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    permissionId: uuid('permission_id')
      .notNull()
      .references(() => permissions.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.roleId, t.permissionId] })],
);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  fullName: text('full_name').notNull(),
  status: text('status').notNull().default('active'),
  roleId: uuid('role_id').references(() => roles.id),
  twoFactorEnabled: boolean('two_factor_enabled').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const twoFactorSecrets = pgTable('two_factor_secrets', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  secret: text('secret').notNull(),
  recoveryCodes: jsonb('recovery_codes').$type<string[]>().notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const institutions = pgTable('institutions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  country: text('country'),
  city: text('city'),
  type: text('type'),
  website: text('website'),
  logoUrl: text('logo_url'),
  description: text('description'),
  activeMember: boolean('active_member').notNull().default(false),
  publicProfile: boolean('public_profile').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const articles = pgTable('articles', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  summary: text('summary'),
  content: jsonb('content').notNull(),
  status: text('status').notNull().default('draft'),
  visibility: text('visibility').notNull().default('public'),
  authorId: uuid('author_id').references(() => users.id),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  type: text('type').notNull(),
  visibility: text('visibility').notNull().default('private'),
  fileUrl: text('file_url'),
  contentText: text('content_text'),
  source: text('source'),
  isCurrent: boolean('is_current').notNull().default(true),
  aiPublicEnabled: boolean('ai_public_enabled').notNull().default(false),
  aiInternalEnabled: boolean('ai_internal_enabled').notNull().default(false),
  aiCommitteeEnabled: boolean('ai_committee_enabled').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const documentChunks = pgTable('document_chunks', {
  id: uuid('id').primaryKey().defaultRandom(),
  documentId: uuid('document_id')
    .notNull()
    .references(() => documents.id, { onDelete: 'cascade' }),
  chunkIndex: integer('chunk_index').notNull(),
  content: text('content').notNull(),
  metadata: jsonb('metadata').notNull().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const documentEmbeddings = pgTable('document_embeddings', {
  id: uuid('id').primaryKey().defaultRandom(),
  chunkId: uuid('chunk_id')
    .notNull()
    .references(() => documentChunks.id, { onDelete: 'cascade' }),
  embedding: vector('embedding', { dimensions: 1536 }),
  model: text('model').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const conferenceRegistrations = pgTable('conference_registrations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  institutionId: uuid('institution_id').references(() => institutions.id),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  country: text('country'),
  city: text('city'),
  participantType: text('participant_type').notNull(),
  status: text('status').notNull().default('submitted'),
  attendanceMode: text('attendance_mode'),
  dietaryRestrictions: text('dietary_restrictions'),
  accessibilityNeeds: text('accessibility_needs'),
  imageAuthorization: boolean('image_authorization').notNull().default(false),
  personalData: jsonb('personal_data').notNull().default({}),
  institutionalData: jsonb('institutional_data').notNull().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const registrationStatusHistory = pgTable('registration_status_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  registrationId: uuid('registration_id')
    .notNull()
    .references(() => conferenceRegistrations.id, { onDelete: 'cascade' }),
  previousStatus: text('previous_status'),
  newStatus: text('new_status').notNull(),
  changedBy: uuid('changed_by').references(() => users.id),
  note: text('note'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const emailTemplates = pgTable('email_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  subject: text('subject').notNull(),
  bodyHtml: text('body_html').notNull(),
  bodyText: text('body_text'),
  type: text('type'),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const emailCampaigns = pgTable('email_campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  templateId: uuid('template_id').references(() => emailTemplates.id),
  segment: jsonb('segment').notNull().default({}),
  status: text('status').notNull().default('draft'),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const aiConversations = pgTable('ai_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionKey: text('session_key').notNull().unique(),
  agentType: text('agent_type').notNull().default('public'),
  ipAddress: inet('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const aiMessages = pgTable('ai_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id')
    .notNull()
    .references(() => aiConversations.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  content: text('content').notNull(),
  sources: jsonb('sources').$type<{ type: string; id?: string; title: string }[]>().notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  actorUserId: uuid('actor_user_id').references(() => users.id),
  action: text('action').notNull(),
  module: text('module').notNull(),
  entityType: text('entity_type'),
  entityId: uuid('entity_id'),
  ipAddress: inet('ip_address'),
  userAgent: text('user_agent'),
  beforeData: jsonb('before_data'),
  afterData: jsonb('after_data'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
