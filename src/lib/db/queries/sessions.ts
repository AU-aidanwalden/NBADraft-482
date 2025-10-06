import { eq } from "drizzle-orm";
import { db, dbSchema } from "../client";

export async function fetchSessionsByUserId(userId: string) {
  return db.query.session.findMany({
    where: (session, { eq: equals }) => equals(session.userId, userId),
  });
}

export async function deleteSession(id: string) {
  await db
    .delete(dbSchema.session)
    .where(eq(dbSchema.session.id, id))
    .execute();
}

export async function createSession(
  userId: string,
  token: string,
  expiresAt: Date
) {
  const id = crypto.randomUUID();
  await db
    .insert(dbSchema.session)
    .values({ id, userId, token, expiresAt })
    .execute();

  const session = await db.query.session.findFirst({
    where: (session, { eq: equals }) => equals(session.token, token),
  });

  if (!session) {
    throw new Error("Failed to load created session");
  }

  return session;
}
