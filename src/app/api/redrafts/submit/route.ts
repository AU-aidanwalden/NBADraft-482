import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getNBAConnection } from "@/lib/db/connection";
import { redraft, redraftPlayer } from "@/lib/db/nba";
import { randomUUID } from "crypto";

interface Pick {
  playerID: number;  // assuming these are numbers in your DB
  teamID: number;
  round: number;
  roundIndex: number;
  pickNumber: number;
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await req.json();
    const { year, picks } = body as { year: number; picks: Pick[] };

    if (!year || !Array.isArray(picks)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const nbaDB = await getNBAConnection();
    const redraftId = randomUUID();

    // Insert the redraft
    await nbaDB.insert(redraft).values({
      redraft_id: redraftId,    // <-- snake_case
      user_id: userId,          // <-- snake_case
      year,
      created_at: new Date(),   // <-- snake_case
      updated_at: new Date(),   // <-- snake_case
    });

    // Insert each pick
    for (const pick of picks) {
      await nbaDB.insert(redraftPlayer).values({
        redraft_player_id: randomUUID(),  // snake_case
        redraft_id: redraftId,            // snake_case
        player_id: pick.playerID,         // snake_case
        team_id: pick.teamID,             // snake_case
        round: pick.round,
        round_index: pick.roundIndex,     // snake_case
        pick_number: pick.pickNumber,     // snake_case
      });
    }

    return NextResponse.json({ success: true, redraftId });
  } catch (err) {
    console.error("Error submitting redraft:", err);
    return NextResponse.json({ error: "Failed to submit redraft" }, { status: 500 });
  }
}
