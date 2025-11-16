import Header from "@/components/ui/Header";
import styles from "./page.module.css";
import DraftViewer, { DraftPick } from "@/components/ui/DraftViewer";
import { getServerSession } from "@/app/actions";
import { getNBAConnection } from "@/lib/db/connection";
import { draft, draft_player, player, team } from "@/lib/db/nba";
import { eq } from "drizzle-orm";

interface DraftsPageProps {
  params: { year: string };
}

export default async function DraftsPage({ params }: DraftsPageProps) {
  const year = params.year;
  const session = await getServerSession();
  const loggedIn = session !== null;

  const nbaDB = await getNBAConnection();

  // Get the draft entry for this year
  const draftEntry = await nbaDB
    .select()
    .from(draft)
    .where(eq(draft.draft_year, parseInt(year)));

  if (draftEntry.length === 0) {
    return <div>No draft data for {year}</div>;
  }

  const draftId = draftEntry[0].draft_id;

  // Get all picks for this draft
  const draftPlayers = await nbaDB
    .select({
      pick_number: draft_player.pick_number,
      player_name: player.name,
      team_slug: team.slug,
      player_id: player.player_id, // for unique _originalId
    })
    .from(draft_player)
    .leftJoin(player, eq(draft_player.player_id, player.player_id))
    .leftJoin(team, eq(draft_player.team_id, team.team_id))
    .where(eq(draft_player.draft_id, draftId));

    console.log("Draft players from DB:", draftPlayers); //test that makes sure players are actually being loaded from sql database



  // Map DB data into DraftPick[]
  const draftData: DraftPick[] = draftPlayers.map((dp, idx) => ({
    pick: dp.pick_number ?? null,
    player: dp.player_name ?? "Unknown Player",
    team: dp.team_slug ?? "Unknown Team",
    _originalId: dp.pick_number != null
      ? `${year}-${dp.pick_number}`
      : `forfeit-${year}-${idx}`,
  }));

  // Pass the database draft data to DraftViewer
  
  return <DraftViewer draftData={draftData} year={year} loggedIn={loggedIn} />;
}
