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
            {["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017"].map((year) => (
            <div
              key={year}
              className="flex flex-wrap justify-between items-center gap-2"
            >
              <span className="text-lg font-bold">{year}</span>
              <div className="flex flex-wrap gap-2.5 justify-end">
                <Link href={`/drafts/${year}`}>
                  <button className="btn btn-soft">View Class</button>
                </Link>
                <button className="btn btn-soft">View re-drafts</button>
                <button className="btn btn-soft">Create Re-draft</button>
              </div>
            </div>
          ))}

          <div>
            <span className="italic">etc.</span>
          </div>
        </div>
      </main>
    </div>
  );
}
