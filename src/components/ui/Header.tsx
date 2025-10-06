import Link from "next/link";
import AccountButton from "./AccountButton";
import type { Session } from "better-auth/types";

interface HeaderProps {
  session: Session | null;
}

export default function Header({ session }: HeaderProps) {
  return (
    <header className="flex justify-between mb-5">
      <Link href="/">
        <button className="btn btn-md btn-primary">Catch&Shoot</button>
      </Link>
      <AccountButton initialSession={session} />
    </header>
  );
}
