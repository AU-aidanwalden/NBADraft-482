import db from "../../database.js";
import { users } from "../schema.js";

export async function fetchUserByUsername(username: string) {
  return await db.query.users.findFirst({
    where: (usersTable, { eq }) => eq(usersTable.username, username),
  });
}

export async function fetchUserById(id: number | bigint) {
  const userId = typeof id === "bigint" ? id : BigInt(id);
  return await db.query.users.findFirst({
    where: (usersTable, { eq }) => eq(usersTable.id, userId),
  });
}

export async function createUser(username: string, passwordHash: string) {
  await db.insert(users).values({ username, passwordHash }).execute();
}
