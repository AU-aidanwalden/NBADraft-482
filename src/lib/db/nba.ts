import { int, json, index, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { user } from "./better-auth-schema";

export const city = mysqlTable(
  "city",
  {
    cityID: int("city_id").primaryKey().autoincrement(),
    name: varchar("name", { length: 100 }).notNull(),
    country: varchar("country", { length: 100 }).notNull(),
    state: varchar("state", { length: 100 }),
  },
  (table) => [index("idx_city_name").on(table.name)],
);

export const team = mysqlTable(
  "team",
  {
    teamID: int("team_id").primaryKey().autoincrement(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 10 }).notNull().unique(),
    cityID: int("city_id")
      .notNull()
      .references(() => city.cityID, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
  },
  (table) => [index("idx_team_city").on(table.cityID)],
);

export const player = mysqlTable(
  "player",
  {
    playerID: int("player_id").primaryKey().autoincrement(),
    name: varchar("name", { length: 100 }).notNull(),
    college: varchar("college", { length: 100 }),
    stats: json("stats"),
    careerLength: int("career_length"),
    fameScore: int("fame_score").default(0),
    teamID: int("team_id")
      .notNull()
      .references(() => team.teamID, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
  },
  (table) => [
    index("idx_player_name").on(table.name),
    index("idx_player_fame").on(table.fameScore),
    index("idx_player_team").on(table.teamID),
  ],
);

export const mockDraft = mysqlTable(
  "mock_draft",
  {
    mockDraftID: int("mock_draft_id").primaryKey().autoincrement(),
    name: varchar("name", { length: 100 }).notNull(),
    year: int("year").notNull(),
    userID: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    playerOrder: json("player_order")
      .$type<number[][]>() // array of rounds, each round holds Player.playerID values in pick order
      .notNull(),
  },
  (table) => [
    index("idx_mock_draft_user").on(table.userID),
    index("idx_mock_draft_year").on(table.year),
  ],
);

export const draft = mysqlTable(
  "draft",
  {
    draftID: int("draft_id").primaryKey().autoincrement(),
    year: int("year").notNull(),
    playerOrder: json("player_order")
      .$type<number[][]>() // array of rounds, each round holds Player.playerID values in pick order
      .notNull(),
  },
  (table) => [index("idx_draft_year").on(table.year)],
);
