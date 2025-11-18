import Header from "@/components/ui/Header";
import DragDropDrafts from "@/components/ui/DragDropDrafts";
import { eq } from "drizzle-orm";
import { draft_player, player, team, draft } from "@/lib/db/nba";
import { getNBAConnection } from "@/lib/db/connection";
import { DraftPick } from "@/types/draft"; 

export default async function RedraftPage({
  params,
}: {
  params: { year: string };
}) {
  const yearStr = params.year;
  const yearNum = parseInt(yearStr);
  const nbaDB = await getNBAConnection();

  // Get the draft ID for the year
  const draftRow = await nbaDB
    .select({ draft_id: draft.draft_id })
    .from(draft)
    .where(eq(draft.draft_year, yearNum));

  if (!draftRow[0]) return <div>No draft found for {yearStr}</div>;

  const draftId = draftRow[0].draft_id;

  // Fetch all picks for that draft
  const draftPlayers = await nbaDB
    .select({
      pick_number: draft_player.pick_number,
      player_name: player.name,
      team_name: team.name,
      player_id: draft_player.player_id,
      team_id: draft_player.team_id,
      round: draft_player.round,
    })
    .from(draft_player)
    .leftJoin(player, eq(draft_player.player_id, player.player_id))
    .leftJoin(team, eq(draft_player.team_id, team.team_id))
    .where(eq(draft_player.draft_id, draftId));

  // Map DB rows to shared DraftPick type
  const draftClass: DraftPick[] = draftPlayers.map((dp, idx) => ({
    pick: dp.pick_number ?? null,
    player: dp.player_name ?? "Unknown Player",
    team: dp.team_name ?? "Unknown Team",
    player_id: dp.player_id,
    team_id: dp.team_id,
    round: dp.round ?? 1,
    roundIndex: idx,
    _originalId:
      dp.pick_number != null ? `${yearStr}-${dp.pick_number}` : `forfeit-${yearStr}-${idx}`,
    isForfeited: dp.pick_number == null,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="p-5 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
          {yearStr} NBA Draft Re-draft
        </h2>
        <DragDropDrafts
          year={yearStr}
          draftClass={draftClass} // ✅ fully typed, no errors
          loggedIn={true}
        />
      </main>
    </div>
  );
}
