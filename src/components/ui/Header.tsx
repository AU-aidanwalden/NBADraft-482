import Link from "next/link";
import AccountButton from "./AccountButton";
import { getServerSession } from "@/app/actions";

export default async function Header() {
  const session = await getServerSession();
  const userName = session?.user?.name;

  return (
    <header className="flex justify-between items-center mb-5 px-4 py-3 bg-gray-100 dark:bg-gray-900">
      {/* Left: Homepage link */}
      <Link href="/">
        <button className="btn btn-md btn-primary">Catch&Shoot</button>
      </Link>

      {/* Middle: Profile link */}
      {userName && (
        <Link
          href={`/user/${encodeURIComponent(userName)}`}
          className="text-base font-medium text-blue-600 hover:underline"
        >
          Profile
        </Link>
      )}

      {/* Right: Account/Login/Logout button */}
      <AccountButton currentSession={session} />
    </header>
  );
}
