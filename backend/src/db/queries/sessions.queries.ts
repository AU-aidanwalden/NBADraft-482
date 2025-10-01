import { eq } from "drizzle-orm";
import db from "../../database.js";
import { sessions } from "../schema.js";

export async function fetchSessionsByUserId(userId: number | bigint) {
  const id = typeof userId === "bigint" ? userId : BigInt(userId);
  return await db.query.sessions.findMany({
    where: (sessionsTable, { eq }) => eq(sessionsTable.userId, id),
  });
}

export async function deleteSession(id: bigint | number) {
  const sessionId = typeof id === "bigint" ? id : BigInt(id);
  await db.delete(sessions).where(eq(sessions.id, sessionId)).execute();
}

export async function createSession(
  userId: bigint,
  tokenHash: string,
  expiresAt: Date
) {
  await db
    .insert(sessions)
    .values({
      userId,
      tokenHash,
      expiresAt,
    })
    .execute();

  const session = await db.query.sessions.findFirst({
    where: (sessionsTable, { eq }) => eq(sessionsTable.tokenHash, tokenHash),
  });

  if (!session) {
    throw new Error("Failed to load created session");
  }

  return session;
}
