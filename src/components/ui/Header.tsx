import Link from "next/link";
import AccountButton from "./AccountButton";
import { getServerSession } from "@/app/actions";

export default async function Header() {
  const session = await getServerSession();

  return (
    <header className="flex justify-between mb-5">
      <Link href="/">
        <button className="btn btn-md btn-primary">Catch&Shoot</button>
      </Link>
      <AccountButton currentSession={session} />
    </header>
  );
}
