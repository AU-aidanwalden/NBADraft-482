import Header from "@/components/ui/Header";
import draftDataImport from "@/data/drafts.json";
import DragDropDrafts from "@/components/ui/DragDropDrafts";

interface DraftPick {
  pick: number | "-" | null;
  player: string | null;
  team: string | null;
  _originalId: string;
}

interface DraftData {
  [year: string]: DraftPick[];
}

const draftData = draftDataImport as DraftData;

export default async function RedraftPage({ params }: { params: { year: string } }) {
  const { year } = params;

  const draftClass: DraftPick[] = draftData[year]?.map((pick, idx) => ({
    pick: pick.pick,
    player: pick.player ?? null,
    team: pick.team ?? null,
    _originalId: pick.pick != null && pick.pick !== "-" ? `${year}-${pick.pick}` : `forfeit-${year}-${idx}`
  })) || [];

  const loggedIn = true; // <-- or get this from your auth context/session

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="p-5 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
          {year} NBA Draft Re-draft
        </h2>
        <DragDropDrafts year={year} draftClass={draftClass} loggedIn={loggedIn} />
      </main>
    </div>
  );
}
