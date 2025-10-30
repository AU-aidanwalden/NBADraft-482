import {
  int,
  json,
  index,
  mysqlTable,
  varchar,
  tinyint,
  smallint,
  timestamp,
  unique,
  year,
} from "drizzle-orm/mysql-core";

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

export const draft = mysqlTable(
  "draft",
  {
    draftID: int("draft_id").primaryKey().autoincrement(),
    draftYear: year("draft_year").notNull().unique(),
    location: varchar("location", { length: 100 }),
    draftDate: timestamp("draft_date"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("idx_draft_year").on(table.draftYear)],
);

export const draftPlayer = mysqlTable(
  "draft_player",
  {
    draftPickID: int("draft_pick_id").primaryKey().autoincrement(),
    draftID: int("draft_id")
      .notNull()
      .references(() => draft.draftID, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    playerID: int("player_id").references(() => player.playerID, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
    round: tinyint("round").notNull(),
    roundIndex: tinyint("round_index").notNull(),
    pickNumber: smallint("pick_number").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    unique("unique_pick_position").on(
      table.draftID,
      table.round,
      table.roundIndex,
    ),
    unique("unique_player_per_draft").on(table.draftID, table.playerID),
    unique("unique_pick_number").on(table.draftID, table.pickNumber),

    index("idx_draft_round").on(table.draftID, table.round),
    index("idx_player_lookup").on(table.playerID),
    index("idx_pick_order").on(table.draftID, table.pickNumber),
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
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    index("idx_mock_draft_user").on(table.userID),
    index("idx_mock_draft_year").on(table.year),
  ],
);

export const mockDraftPlayer = mysqlTable(
  "mock_draft_player",
  {
    mockDraftPickID: int("mock_draft_pick_id").primaryKey().autoincrement(),
    mockDraftID: int("mock_draft_id")
      .notNull()
      .references(() => mockDraft.mockDraftID, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    playerID: int("player_id")
      .notNull()
      .references(() => player.playerID, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    round: tinyint("round").notNull(),
    roundIndex: tinyint("round_index").notNull(),
    pickNumber: smallint("pick_number").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    unique("unique_mock_pick_position").on(
      table.mockDraftID,
      table.round,
      table.roundIndex,
    ),
    unique("unique_mock_player_per_draft").on(
      table.mockDraftID,
      table.playerID,
    ),
    unique("unique_mock_pick_number").on(table.mockDraftID, table.pickNumber),

    index("idx_mock_draft_round").on(table.mockDraftID, table.round),
    index("idx_mock_player_lookup").on(table.playerID),
    index("idx_mock_pick_order").on(table.mockDraftID, table.pickNumber),
  ],
);
