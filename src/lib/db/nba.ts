// src/lib/db/nba.ts
import { mysqlTable, varchar, text, int, tinyint, smallint, timestamp, serial } from "drizzle-orm/mysql-core";
import { getNBAConnection } from "./connection";

export const player = mysqlTable("player", {
  player_id: int("player_id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  college: varchar("college", { length: 100 }),
  stats: text("stats"), // JSON can be stored as text
  career_length: int("career_length"),
  fame_score: int("fame_score").default(0),
  team_id: int("team_id").notNull(),
});

export const team = mysqlTable("team", {
  team_id: int("team_id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 10 }).notNull(),
  city_id: int("city_id").notNull(),
});

export const draft = mysqlTable("draft", {
  draft_id: varchar("draft_id", { length: 36 }).primaryKey(),
  draft_year: int("draft_year").notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  draft_date: timestamp("draft_date").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const draft_player = mysqlTable("draft_player", {
  draft_player_id: int("draft_player_id").primaryKey().autoincrement(),
  draft_id: varchar("draft_id", { length: 36 }).notNull(),
  player_id: int("player_id").notNull(),
  team_id: int("team_id").notNull(),
  round: tinyint("round").notNull(),
  round_index: tinyint("round_index").notNull(),
  pick_number: smallint("pick_number").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const redraft = mysqlTable("redraft", {
  redraft_id: varchar("redraft_id", { length: 36 }).primaryKey(),
  user_id: varchar("user_id", { length: 36 }),
  year: int("year"),
  created_at: timestamp("created_at"),
  updated_at: timestamp("updated_at"),
});

export const redraftPlayer = mysqlTable("redraft_player", {
  redraft_player_id: varchar("redraft_player_id", { length: 36 }).primaryKey(),
  redraft_id: varchar("redraft_id", { length: 36 }),
  player_id: int("player_id"),
  team_id: int("team_id"),
  round: int("round"),
  round_index: int("round_index"),
  pick_number: int("pick_number"),
});

export const nbaDB = getNBAConnection();