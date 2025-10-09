import Header from "@/components/ui/Header";
import { getServerSession } from "./actions";
import DraftClasses from "@/components/ui/DraftClasses";

export default async function Home() {
  const session = await getServerSession();

  return (
    <div className="min-h-screen p-5">
      <Header session={session?.session ?? null} />
      <DraftClasses />
    </div>
  );
}
