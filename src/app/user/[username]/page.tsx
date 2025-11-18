import Header from "@/components/ui/Header";
import styles from "./page.module.css";
import AccountSidebar from "@/components/ui/AccountSidebar";
import Link from "next/link";
import { getNBAConnection } from "@/lib/db/connection";
import { eq } from "drizzle-orm";
import { user as userTable, redraft as redraftTable } from "@/lib/db/nba";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface UserPageProps {
  params: { username: string };
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = params;
  const nbaDB = await getNBAConnection();
  const currentSession = await auth.api.getSession({
    headers: await headers()
  });

  // Fetch user info
  const userRows = await nbaDB
    .select()
    .from(userTable)
    .where(eq(userTable.username, username));

  if (!userRows[0]) return <div>User not found</div>;
  const user = userRows[0];

  // Fetch redrafts by this user
  const redrafts = await nbaDB
    .select()
    .from(redraftTable)
    .where(eq(redraftTable.user_id, user.id));

  return (
    <div className="page">
      <Header />
      <main className={styles.userProfile}>
        <AccountSidebar username={username} currentSession={currentSession} />
        <div className={styles.avatarDisplay}>
          <div className="avatar avatar-placeholder">
            <div className="bg-neutral text-neutral-content w-24 rounded-full">
              <span className="text-3xl">{user.name?.[0]}</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold mt-2">{user.name}</h2>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Redrafts</h3>
            {redrafts.length === 0 ? (
              <p>No redrafts submitted yet.</p>
            ) : (
              <ul>
                {redrafts.map((r) => (
                  <li key={r.redraft_id} className="mb-2">
                    <Link
                      href={`/redrafts/${r.redraft_id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {r.year} Redraft
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
