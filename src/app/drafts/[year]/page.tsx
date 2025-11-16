import Header from "@/components/ui/Header";
import styles from "./page.module.css";
import DraftViewer from "@/components/ui/DraftViewer";
import { getServerSession } from "@/app/actions";
import { getNBAConnection } from "@/lib/db/connection";
import { draft, draft_player, player, team } from "@/lib/db/nba";
import { eq } from "drizzle-orm";

export interface DraftPick {
  pick: number | "-" | null;
  player: string;
  team: string;
   _originalId: string; // Add this
}

export interface DraftData {
  [year: string]: DraftPick[];
}

interface DraftsPageProps {
  params: { year: string }; // plain object
}

export default async function DraftsPage({ params }: DraftsPageProps) {
  const year = params.year; // do NOT await params
  const session = await getServerSession();
  const loggedIn = session !== null;

  const nbaDB = await getNBAConnection();
  const draftEntry = await nbaDB
    .select()
    .from(draft)
    .where(eq(draft.draft_year, parseInt(year)));

  if (draftEntry.length === 0) return <div>No draft data for {year}</div>;

  const draftId = draftEntry[0].draft_id;

  const draftPlayers = await nbaDB
    .select({
      pick_number: draft_player.pick_number,
      player_name: player.name,
      team_slug: team.slug,
    })
    .from(draft_player)
    .leftJoin(player, eq(draft_player.player_id, player.player_id))
    .leftJoin(team, eq(draft_player.team_id, team.team_id))
    .where(eq(draft_player.draft_id, draftId));

  const draftData: DraftData = {
    [year]: draftPlayers.map(dp => ({
      pick: dp.pick_number ?? null,
      player: dp.player_name ?? "Unknown Player",
      team: dp.team_slug ?? "Unknown Team",
       _originalId: player.player_id.toString(),
    })),
  };

  return <DraftViewer draftData={draftData} year={year} loggedIn={loggedIn} />;
}