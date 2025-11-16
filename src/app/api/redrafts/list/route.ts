import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getNBAConnection } from "@/lib/db/connection";
import { redraft } from "@/lib/db/nba";
import { eq, desc } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }
    const userId = session.user.id;

    const nbaDB = await getNBAConnection();

    const userRedrafts = await nbaDB
      .select()
      .from(redraft)
      .where(eq(redraft.user_id, userId))   // <-- eq helper, not column method
      .orderBy(desc(redraft.created_at));    // <-- desc helper, not column method

    return NextResponse.json(userRedrafts);
  } catch (err) {
    console.error("Error fetching redrafts:", err);
    return NextResponse.json({ error: "Failed to fetch redrafts" }, { status: 500 });
  }
}
