// src/lib/db/connection.ts
import { config } from "dotenv";
import { createPool } from "mysql2"; // <-- use non-promise mysql2
import { drizzle } from "drizzle-orm/mysql2";
import { player, team, draft, draft_player } from "./nba"; // adjust path if needed

config({ path: ".env.local" });

// Define your NBA schema for TypeScript
export type NBASchema = {
  player: typeof player;
  team: typeof team;
  draft: typeof draft;
  draft_player: typeof draft_player;
};

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not defined");

export async function getNBAConnection() {
  // Create a callback-based Pool (Drizzle expects this type)
  const pool = createPool(connectionString as string);

  // Tell Drizzle about the schema
  const nbaDB = drizzle<NBASchema>(pool);
  return nbaDB;
}
