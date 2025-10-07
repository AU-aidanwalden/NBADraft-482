import Link from "next/link";
import Header from "@/components/ui/Header";
import { getServerSession } from "./actions";

export default async function Home() {
  const session = await getServerSession();

  return (
    <div className="min-h-screen p-5">
      <Header session={session?.session ?? null} />
      <div className="flex justify-center mb-5">
        <input
          type="text"
          placeholder="Find a player, profile, etc..."
          className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <main className="p-5 rounded-xl shadow-md max-w-4xl mx-auto">
        <h2 className="text-2xl text-center mb-4">Draft Classes</h2>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">2025</span>
            <div className="flex gap-2.5">
              <Link href="/drafts/2025">
                <button className="btn btn-soft">View Class</button>
              </Link>
              <button className="btn btn-soft">View re-drafts</button>
              <button className="btn btn-soft">Create Re-draft</button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">2024</span>
            <div className="flex gap-2.5">
              <Link href="/drafts/2024">
                <button className="btn btn-soft">View Class</button>
              </Link>
              <button className="btn btn-soft">View re-drafts</button>
              <button className="btn btn-soft">Create Re-draft</button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">2023</span>
            <div className="flex gap-2.5">
              <Link href="/drafts/2023">
                <button className="btn btn-soft">View Class</button>
              </Link>
              <button className="btn btn-soft">View re-drafts</button>
              <button className="btn btn-soft">Create Re-draft</button>
            </div>
          </div>
          <div>
            <span className="italic">etc.</span>
          </div>
        </div>
      </main>
    </div>
  );
}
