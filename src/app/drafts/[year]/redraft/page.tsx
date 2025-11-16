import Header from "@/components/ui/Header";
import DragDropDrafts from "@/components/ui/DragDropDrafts";
import { eq } from "drizzle-orm";
import { draft_player, player, team, draft } from "@/lib/db/nba";
import { getNBAConnection } from "@/lib/db/connection";
import { DraftPick } from "@/lib/db/fetchDraft";

export default async function RedraftPage({
  params,
}: {
  params: { year: string };
}) {
  const yearStr = params.year; // string for component/UI
  const yearNum = parseInt(params.year); // number for DB queries
  const nbaDB = await getNBAConnection();

  const draftRow = await nbaDB
    .select({ draft_id: draft.draft_id })
    .from(draft)
    .where(eq(draft.draft_year, yearNum));

  if (!draftRow[0]) return <div>No draft found for {yearStr}</div>;

  const draftId = draftRow[0].draft_id;

  const rows = await nbaDB
    .select({
      pick: draft_player.pick_number,
      player: player.name,
      team: team.name,
    })
    .from(draft_player)
    .leftJoin(player, eq(player.player_id, draft_player.player_id))
    .leftJoin(team, eq(team.team_id, draft_player.team_id))
    .where(eq(draft_player.draft_id, draftId));

  const draftClass: DraftPick[] = rows.map((row, idx) => {
    const isForfeited = row.pick === null;


    return {
      pick: row.pick ?? null,
      player: row.player ?? null,
      team: row.team ?? null,
      _originalId: !isForfeited ? `${yearStr}-${row.pick}` : `forfeit-${yearStr}-${idx}`,
      isForfeited,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="p-5 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
          {yearStr} NBA Draft Re-draft
        </h2>
        <DragDropDrafts
          year={yearStr}
          draftClass={draftClass}
          loggedIn={true}
        />
      </main>
    </div>
  );
}
