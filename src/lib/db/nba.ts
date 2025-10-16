import { int, json, index, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const city = mysqlTable(
  "city",
  {
    cityID: int("city_id").primaryKey().autoincrement(),
    name: varchar("name", { length: 100 }).notNull(),
    country: varchar("country", { length: 100 }).notNull(),
    state: varchar("state", { length: 100 }),
  },
  (table) => [
    index("idx_city_name").on(table.name),
  ]
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
  (table) => [
    index("idx_team_city").on(table.cityID),
  ]
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
  ]
);
