import { eq } from "drizzle-orm";
import { draft_player, player, team, draft } from "./nba";
import { getNBAConnection } from "./connection";

export interface DraftPick {
  pick: number | null;
  player: string | null;
  team: string | null;
  player_id: number;
  team_id: number;
  round?: number;
  roundIndex?: number;
  _originalId: string;
  isForfeited: boolean;
}

export async function getDraftByYear(year: number): Promise<DraftPick[]> {
  const nbaDB = await getNBAConnection();

  // Get the draft ID for the year
  const draftRow = await nbaDB
    .select({ draft_id: draft.draft_id })
    .from(draft)
    .where(eq(draft.draft_year, year));

  if (!draftRow[0]) return [];

  const draftId = draftRow[0].draft_id;

  // Get all draft picks
  const rows = await nbaDB
  .select({
    pick: draft_player.pick_number,
    player: player.name,
    team: team.name,
    player_id: draft_player.player_id,  // ✅ needed
    team_id: draft_player.team_id,      // ✅ needed
    round: draft_player.round,          // ✅ optional, good to include
  })
  .from(draft_player)
  .leftJoin(player, eq(player.player_id, draft_player.player_id))
  .leftJoin(team, eq(team.team_id, draft_player.team_id))
  .where(eq(draft_player.draft_id, draftId));

  return rows.map((row, idx) => {
  const isForfeited = row.pick == null;
  return {
    pick: isForfeited ? null : row.pick,
    player: row.player ?? null,
    team: row.team ?? null,
    player_id: row.player_id,   // add this
    team_id: row.team_id,       // add this
    round: row.round ?? 1,      // optional
    roundIndex: idx,            // optional
    _originalId: isForfeited ? `forfeit-${year}-${idx}` : `${year}-${row.pick}`,
    isForfeited,
  };
});
}
