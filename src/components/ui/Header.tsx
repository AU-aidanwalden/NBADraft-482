import Link from "next/link";
import AccountButton from "./AccountButton";

export default function Header() {
  return (
    <header className="flex justify-between mb-5">
      <Link href="/">
        <button className="btn btn-md btn-primary">Catch&Shoot</button>
      </Link>
      <AccountButton />
    </header>
  );
}
