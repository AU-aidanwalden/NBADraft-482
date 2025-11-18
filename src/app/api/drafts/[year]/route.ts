import { NextResponse } from "next/server";
import { getNBAConnection } from "@/lib/db/connection";
import { draft_player, player, team, draft } from "@/lib/db/nba"; // include draft table
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: { year: string } }
) {
  const year = Number(params.year);
  const db = await getNBAConnection();

  // JOIN draft_player → player, team, draft
  const picks = await db
    .select({
      pick: draft_player.pick_number,
      player: player.name,
      team: team.name,
      playerId: draft_player.player_id,
      teamId: draft_player.team_id,
      round: draft_player.round,
      roundIndex: draft_player.round_index,
    })
    .from(draft_player)
    .leftJoin(player, eq(player.player_id, draft_player.player_id))
    .leftJoin(team, eq(team.team_id, draft_player.team_id))
    .leftJoin(draft, eq(draft.draft_id, draft_player.draft_id)) // join draft table
    .where(eq(draft.draft_year, year)) // filter by year
    .orderBy(draft_player.pick_number);

  // Format rows for frontend
  const formatted = picks.map((row) => ({
    pick: row.pick ?? null,
    player: row.player ?? null,
    team: row.team ?? null,
    _originalId: `${year}-${row.pick}`,
    player_id: row.playerId,
    team_id: row.teamId,
    round: row.round,
    roundIndex: row.roundIndex,
  }));

  return NextResponse.json({ draftClass: formatted });
}
