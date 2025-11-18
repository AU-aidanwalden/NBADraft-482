import DraftViewer, { DraftPick } from "@/components/ui/DraftViewer";
import { getNBAConnection } from "@/lib/db/connection";
import { redraftPlayer, player, team, redraft } from "@/lib/db/nba";
import { eq, sql } from "drizzle-orm"; // <- import orderBy

interface RedraftPageProps {
  params: { redraft_id: string };
}

export default async function UserRedraftPage({ params }: RedraftPageProps) {
  const { redraft_id } = params;
  const nbaDB = await getNBAConnection();

  // Fetch the redraft itself to get the year
  const redraftRow = await nbaDB
    .select({ year: redraft.year })
    .from(redraft)
    .where(eq(redraft.redraft_id, redraft_id));

  if (!redraftRow[0]) return <div>Redraft not found</div>;
  const yearStr = String(redraftRow[0].year);

  // Fetch picks for this redraft, sorted by round then pick_number
  const redraftRows = await nbaDB
  .select({
    player_id: redraftPlayer.player_id,
    player_name: player.name,
    team_id: redraftPlayer.team_id,
    team_name: team.name,
    pick_number: redraftPlayer.pick_number,
    round: redraftPlayer.round,
    round_index: redraftPlayer.round_index,
  })
  .from(redraftPlayer)
  .leftJoin(player, eq(player.player_id, redraftPlayer.player_id))
  .leftJoin(team, eq(team.team_id, redraftPlayer.team_id))
  .where(eq(redraftPlayer.redraft_id, redraft_id))
  .orderBy(sql`${redraftPlayer.round} ASC, ${redraftPlayer.pick_number} ASC`);

  const draftData: DraftPick[] = redraftRows.map((row, idx) => ({
    pick: row.pick_number ?? null,
    player: row.player_name ?? "Unknown Player",
    team: row.team_name ?? "Unknown Team",
    player_id: row.player_id ?? 0,
    team_id: row.team_id ?? 0,
    round: row.round ?? 1,
    roundIndex: row.round_index ?? idx,
    _originalId:
      row.pick_number != null ? `${yearStr}-${row.pick_number}` : `forfeit-${yearStr}-${idx}`,
  }));

  return <DraftViewer draftData={draftData} year={yearStr} loggedIn={true} />;
}
