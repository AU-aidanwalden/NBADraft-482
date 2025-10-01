import { mysqlTable, bigint, varchar, char, datetime } from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";

export const users = mysqlTable("Users", {
  id: bigint("id", { mode: "bigint", unsigned: true }).primaryKey().autoincrement(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  passwordHash: char("passwordHash", { length: 60 }).notNull(),
  createdAt: datetime("createdAt", { fsp: 6 }).notNull().default(sql`CURRENT_TIMESTAMP(6)`),
  updatedAt: datetime("updatedAt", { fsp: 6 }).notNull().default(sql`CURRENT_TIMESTAMP(6)`),
});

export const sessions = mysqlTable(
  "Sessions",
  {
    id: bigint("id", { mode: "bigint", unsigned: true }).primaryKey().autoincrement(),
    userId: bigint("user_id", { mode: "bigint", unsigned: true }).notNull(),
    tokenHash: char("token_hash", { length: 60 }).notNull().unique(),
    createdAt: datetime("created_at", { fsp: 6 }).notNull().default(sql`CURRENT_TIMESTAMP(6)`),
    lastUsedAt: datetime("last_used_at", { fsp: 6 }),
    expiresAt: datetime("expires_at", { fsp: 6 }).notNull(),
    parentId: bigint("parent_id", { mode: "bigint", unsigned: true }),
  }
);

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
  children: many(sessions, {
    relationName: "SessionParent",
  }),
  parent: one(sessions, {
    fields: [sessions.parentId],
    references: [sessions.id],
    relationName: "SessionParent",
  }),
}));
