// tooling/importDrafts.ts
import fs from "fs";
import { randomUUID } from "crypto";
import { getNBAConnection, NBASchema } from "../src/lib/db/connection";
import { player, team, draft, draft_player } from "../src/lib/db/nba";
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
async function getOrCreateTeamId(slug: string, name?: string) {
  const result = await globalThis.nbaDB.select().from(team).where(eq(team.slug, slug));
  if (result.length === 0) {
    const [inserted] = await globalThis.nbaDB
      .insert(team)
      .values({ slug, name: name ?? slug, city_id: 0 })
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

    for (const pick of picks) {
  const teamId = pick.team ? await getOrCreateTeamId(pick.team) : 0;
const playerId = pick.player ? await getOrCreatePlayerId(pick.player, pick.team) : 0;
const round = pick.pick ? Math.ceil(pick.pick / picksPerRound) : 0;
const roundIndex = pick.pick ? pick.pick - picksPerRound * (round - 1) : 0;
const pickNumber = pick.pick ?? -1; // for forfeits

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
