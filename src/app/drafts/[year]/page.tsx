import Header from "@/components/ui/Header";
import styles from "./page.module.css";
import DraftViewer from "@/components/ui/DraftViewer";
import { getServerSession } from "@/app/actions";
import { getNBAConnection } from "@/lib/db/connection";
import { draft, draft_player, player, team } from "@/lib/db/nba";
import { eq } from "drizzle-orm";
import { DraftPick } from "@/types/draft"; 

export interface DraftData {
  [year: string]: DraftPick[];
}

interface DraftsPageProps {
  params: { year: string };
}

export default async function DraftsPage({ params }: DraftsPageProps) {
  const year = params.year;
  const session = await getServerSession();
  const loggedIn = session !== null;

  // Connect to database
  const nbaDB = await getNBAConnection();

  // Query the draft for the requested year
  const draftEntry = await nbaDB
    .select()
    .from(draft)
    .where(eq(draft.draft_year, parseInt(year)));

  if (draftEntry.length === 0) {
    return <div>No draft data for {year}</div>;
  }

  const draftId = draftEntry[0].draft_id;

  // Query all draft players for that draft
  const draftPlayers = await nbaDB
    .select({
      pick_number: draft_player.pick_number,
      player_name: player.name,
      team_slug: team.slug,
      player_id: draft_player.player_id,
      team_id: draft_player.team_id,
      round: draft_player.round,
    })
    .from(draft_player)
    .leftJoin(player, eq(draft_player.player_id, player.player_id))
    .leftJoin(team, eq(draft_player.team_id, team.team_id))
    .where(eq(draft_player.draft_id, draftId));

  // Map DB results to DraftPick[]
  const draftData = draftPlayers.map((dp, idx) => ({
  pick: dp.pick_number ?? null,
  player: dp.player_name ?? "Unknown Player", // ⚠ never null
  team: dp.team_slug ?? "Unknown Team",
  player_id: dp.player_id,
  team_id: dp.team_id,
  round: dp.round ?? 1,
  roundIndex: idx,
  _originalId:
    dp.pick_number != null ? `${year}-${dp.pick_number}` : `forfeit-${year}-${idx}`,
  isForfeited: dp.pick_number == null,
}));

  return (
    <div className={styles.page}>
      <Header />
      <DraftViewer draftData={draftData} year={year} loggedIn={loggedIn} />
    </div>
  );
}