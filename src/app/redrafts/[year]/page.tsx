import DragDropDrafts from "@/components/ui/DragDropDrafts";
import draftDataImport from "@/data/drafts.json";
import { cookies } from "next/headers"; // BetterAuth uses cookies/session headers
import { getSession } from "@/lib/betterAuth"; // adjust to your BetterAuth session helper

export default async function RedraftPage({ params }: { params: { year: string } }) {
  const year = params.year;
  const draftClass = draftDataImport[year] || [];

  // Get the current session using BetterAuth
  const cookieStore = cookies(); 
  const session = await getSession(cookieStore);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Redraft {year}</h1>
      <DragDropDrafts
        year={year}
        draftClass={draftClass}
        loggedIn={!!session?.user} // check if user is logged in
      />
    </div>
  );
}
