import prisma from "../../database.js";

export async function fetchSessionsByUserId(userId: number) {
  return await prisma.sessions.findMany({
    where: { userId },
  });
}

export async function deleteSession(id: bigint) {
  return await prisma.sessions.delete({ where: { id } });
}

export async function createSession(
  userId: bigint,
  tokenHash: string,
  expiresAt: Date
) {
  return await prisma.sessions.create({
    data: { userId, tokenHash, expiresAt },
  });
}
