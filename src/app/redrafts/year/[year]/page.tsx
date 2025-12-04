// app/redrafts/[year]/page.tsx
import Header from "@/components/ui/Header";
import Link from "next/link";

import { getNBAConnection } from "@/lib/db/connection";
import { redraft, user as userTable } from "@/lib/db/nba";
import { eq, desc } from "drizzle-orm";


interface YearRedraftsPageProps {
  params: { year: string };
}

export default async function YearRedraftsPage({ params }: YearRedraftsPageProps) {
  const { year } = params;
  const nbaDB = await getNBAConnection();

  // Fetch all redrafts for this year, joining users for display name
  const redrafts = await nbaDB
    .select({
      redraft_id: redraft.redraft_id,
      created_at: redraft.created_at,
      user_id: redraft.user_id,
      username: userTable.username,
      display_name: userTable.name,
    })
    .from(redraft)
    .leftJoin(userTable, eq(userTable.id, redraft.user_id))
    .where(eq(redraft.year, parseInt(year)))
    .orderBy(desc(redraft.created_at));

  if (redrafts.length === 0) {
    return (
      <div className="min-h-screen p-5">
        <Header />
        <h2 className="text-2xl font-bold mb-4">No redrafts found for {year}</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5">
      <Header />
      <h2 className="text-2xl font-bold mb-6">{year} Redrafts</h2>
      <ul className="space-y-2">
        {redrafts.map((r) => (
          <li key={r.redraft_id} className="border p-3 rounded-md bg-white dark:bg-gray-800">
            <Link
              href={`/redrafts/${r.redraft_id}`}
              className="text-blue-600 hover:underline font-semibold"
            >
              Redraft by {r.display_name ?? r.username ?? r.user_id}
            </Link>
            <p className="text-sm text-gray-500">
                 Created at: {r.created_at ? new Date(r.created_at).toLocaleString() : "Unknown"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
