// tooling/importDrafts.ts
import fs from "fs";
import { randomUUID } from "crypto";
import { getNBAConnection, NBASchema } from "../src/lib/db/connection";
import { player, team, draft, draft_player, city } from "../src/lib/db/nba";
import { eq } from "drizzle-orm";
import type { MySqlDatabase, MySqlQueryResultHKT, PreparedQueryHKTBase } from "drizzle-orm/mysql-core";

declare global {
  var nbaDB: MySqlDatabase<MySqlQueryResultHKT, PreparedQueryHKTBase, NBASchema>;
}

const draftsData = JSON.parse(fs.readFileSync("./src/data/drafts.json", "utf-8"));

//picks per round mapping
const picksPerRoundMap: Record<number, number> = {
  1976: 18, 1977: 22, 1978: 22, 1979: 22, 1980: 23, 1981: 23, 1982: 23, 1983: 24,
  1984: 24, 1985: 24, 1986: 24, 1987: 23, 1988: 25, 1989: 27, 1990: 24, 1991: 27,
  1992: 27, 1993: 27, 1994: 27
};
for (let y = 1995; y <= 2003; y++) picksPerRoundMap[y] = 28;
for (let y = 2004; y <= 2025; y++) picksPerRoundMap[y] = 30;

// Helpers
let unknownCityId: number | null = null;

async function getUnknownCityId() {
  if (unknownCityId !== null) return unknownCityId;

  // Check if "Unknown" city already exists
  const existingCity = await globalThis.nbaDB
    .select()
    .from(city)
    .where(eq(city.name, "Unknown"))
    .limit(1);

  if (existingCity.length > 0) {
    unknownCityId = existingCity[0].city_id;
    return unknownCityId;
  }

  // Create an "Unknown" city if it doesn't exist
  const [inserted] = await globalThis.nbaDB
    .insert(city)
    .values({ name: "Unknown", country: "USA", state: null })
    .$returningId();

  unknownCityId = inserted.city_id;
  return unknownCityId;
}

async function getOrCreateTeamId(slug: string, name?: string) {
  const result = await globalThis.nbaDB.select().from(team).where(eq(team.slug, slug));
  if (result.length === 0) {
    const cityId = await getUnknownCityId();
    const [inserted] = await globalThis.nbaDB
      .insert(team)
      .values({ slug, name: name ?? slug, city_id: cityId })
      .$returningId();
    return inserted.team_id;
  }
  return result[0].team_id;
}

async function getOrCreatePlayerId(name: string, teamSlug: string) {
  const result = await globalThis.nbaDB.select().from(player).where(eq(player.name, name));
  if (result.length === 0) {
    const teamId = await getOrCreateTeamId(teamSlug);
    const [inserted] = await globalThis.nbaDB
      .insert(player)
      .values({ name, team_id: teamId })
      .$returningId();
    return inserted.player_id;
  }
  return result[0].player_id;
}

// Insert all drafts
async function insertDrafts() {
  for (const yearStr in draftsData) {
    const year = parseInt(yearStr);
    const picks = draftsData[yearStr];
    const draftId = randomUUID();
    const picksPerRound = picksPerRoundMap[year] || 30;

    await globalThis.nbaDB.insert(draft).values({
      draft_id: draftId,
      draft_year: year,
      location: "Unknown",
      draft_date: new Date(),
    });

    let forfeitCounter = 0; // Counter for forfeited picks in this draft

    for (const pick of picks) {
      let pickNumber: number;
      let round: number;
      let roundIndex: number;

      // Handle forfeited picks (they have null pick numbers)
      if (!pick.pick || pick.player === "Forfeited") {
        // Assign negative numbers to forfeited picks to avoid conflicts
        forfeitCounter--;
        pickNumber = forfeitCounter;
        round = 0; // Unknown round for forfeited picks
        roundIndex = 0;
      } else {
        pickNumber = pick.pick;
        round = Math.ceil(pick.pick / picksPerRound);
        roundIndex = pick.pick - picksPerRound * (round - 1);
      }

      const teamId = pick.team ? await getOrCreateTeamId(pick.team) : 0;
      const playerId = pick.player ? await getOrCreatePlayerId(pick.player, pick.team) : 0;

      await globalThis.nbaDB.insert(draft_player).values({
        draft_id: draftId,
        player_id: playerId,
        team_id: teamId,
        round,
        round_index: roundIndex,
        pick_number: pickNumber,
      });
    }

  }
}

//main execution
async function main() {
  globalThis.nbaDB = await getNBAConnection();

  // Ensure we have an "Unknown" city before inserting drafts
  await getUnknownCityId();
  console.log("Unknown city created/found with ID:", unknownCityId);

  await insertDrafts();
}

main()
  .then(() => {
    console.log("All drafts inserted");
    process.exit(0); //force the quit after drafts load
  })
  .catch((err) => {
    console.error("Error inserting drafts:", err);
    process.exit(1);
  });
