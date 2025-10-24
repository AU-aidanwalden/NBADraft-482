import Header from "@/components/ui/Header";
import styles from "./page.module.css";
import draftDataImport from "@/data/drafts.json" assert { type: "json" };
import DraftViewer from "@/components/ui/DraftViewer";
import { getServerSession } from "@/app/actions";

export interface DraftPick {
  pick: number | "-" | null;
  player: string;
  team: string;
}
export interface DraftData {
  [year: string]: DraftPick[];
}

const draftData = draftDataImport as DraftData;

interface DraftsPageProps {
  params: Promise<{ year: string }>;
}

export default async function DraftsPage({ params }: DraftsPageProps) {
  const { year } = await params;
  const session = await getServerSession();
  const loggedIn = session !== null;

  return (
    <div className={styles.page}>
      <Header />

      {/* We need the ability for the user to create a re-draft of the draft via drag-and-drop,
      So we need this DraftViewer compoonent to be a client component */}
      <DraftViewer draftData={draftData} year={year} loggedIn={loggedIn} />
    </div>
  );
}
