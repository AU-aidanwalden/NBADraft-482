// src/lib/db/nba.ts
import { mysqlTable, varchar, text, int, tinyint, smallint, timestamp, serial, index, unique } from "drizzle-orm/mysql-core";
import { getNBAConnection } from "./connection";
import { relations } from "drizzle-orm";
import { user } from "./better-auth-schema";

// City table - locations where teams are based
export const city = mysqlTable("city", {
  city_id: int("city_id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }),
}, (table) => ({
  nameIdx: index("idx_city_name").on(table.name),
}));

// Team table - NBA teams
export const team = mysqlTable("team", {
  team_id: int("team_id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 10 }).notNull().unique(),
  city_id: int("city_id").notNull().references(() => city.city_id, { onDelete: "restrict", onUpdate: "cascade" }),
}, (table) => ({
  cityIdx: index("idx_team_city").on(table.city_id),
}));

// Player table - NBA players
export const player = mysqlTable("player", {
  player_id: int("player_id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  college: varchar("college", { length: 100 }),
  stats: text("stats"), // JSON can be stored as text
  career_length: int("career_length"),
  fame_score: int("fame_score").default(0),
  team_id: int("team_id").notNull().references(() => team.team_id, { onDelete: "restrict", onUpdate: "cascade" }),
}, (table) => ({
  nameIdx: index("idx_player_name").on(table.name),
  fameIdx: index("idx_player_fame").on(table.fame_score),
  teamIdx: index("idx_player_team").on(table.team_id),
}));

// Draft table - NBA draft events
export const draft = mysqlTable("draft", {
  draft_id: varchar("draft_id", { length: 36 }).primaryKey(),
  draft_year: int("draft_year").notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  draft_date: timestamp("draft_date").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
}, (table) => ({
  yearIdx: index("idx_draft_year").on(table.draft_year),
}));

// Draft Player table - players selected in drafts
export const draft_player = mysqlTable("draft_player", {
  draft_player_id: int("draft_player_id").primaryKey().autoincrement(),
  draft_id: varchar("draft_id", { length: 36 }).notNull().references(() => draft.draft_id, { onDelete: "cascade" }),
  player_id: int("player_id").notNull().references(() => player.player_id, { onDelete: "cascade" }),
  team_id: int("team_id").notNull().references(() => team.team_id, { onDelete: "restrict", onUpdate: "cascade" }),
  round: tinyint("round").notNull(),
  round_index: tinyint("round_index").notNull(),
  pick_number: smallint("pick_number").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
}, (table) => ({
  draftPickUnique: unique("draft_pick_unique").on(table.draft_id, table.pick_number),
  draftIdx: index("idx_draft_player_draft").on(table.draft_id),
  playerIdx: index("idx_draft_player_player").on(table.player_id),
}));

// Redraft table - user-created alternative drafts
export const redraft = mysqlTable("redraft", {
  redraft_id: varchar("redraft_id", { length: 36 }).primaryKey(),
  user_id: varchar("user_id", { length: 36 }).notNull().references(() => user.id, { onDelete: "cascade" }),
  year: int("year").notNull(),
  draft_data: text("draft_data"), // JSON column for draft configuration
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("idx_redraft_user").on(table.user_id),
  yearIdx: index("idx_redraft_year").on(table.year),
}));

// Redraft Player table - players in user redrafts
export const redraftPlayer = mysqlTable("redraft_player", {
  redraft_player_id: varchar("redraft_player_id", { length: 36 }).primaryKey(),
  redraft_id: varchar("redraft_id", { length: 36 }).notNull().references(() => redraft.redraft_id, { onDelete: "cascade" }),
  player_id: int("player_id").notNull().references(() => player.player_id, { onDelete: "cascade" }),
  team_id: int("team_id").notNull().references(() => team.team_id, { onDelete: "restrict", onUpdate: "cascade" }),
  round: tinyint("round").notNull(),
  round_index: tinyint("round_index").notNull(),
  pick_number: smallint("pick_number").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  redraftPickUnique: unique("redraft_pick_unique").on(table.redraft_id, table.pick_number),
  redraftIdx: index("idx_redraft_player_redraft").on(table.redraft_id),
  playerIdx: index("idx_redraft_player_player").on(table.player_id),
}));

// User Comments table - comments on redrafts by users
export const userComments = mysqlTable("user_comments", {
  comment_id: varchar("comment_id", { length: 36 }).primaryKey(),
  user_id: varchar("user_id", { length: 36 }).notNull().references(() => user.id, { onDelete: "cascade" }),
  redraft_id: varchar("redraft_id", { length: 36 }).notNull().references(() => redraft.redraft_id, { onDelete: "cascade" }),
  comment_text: text("comment_text").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("idx_user_comments_user").on(table.user_id),
  redraftIdx: index("idx_user_comments_redraft").on(table.redraft_id),
  redraftCreatedIdx: index("idx_user_comments_redraft_created").on(table.redraft_id, table.created_at),
}));

export const nbaDB = getNBAConnection();
export { user };
