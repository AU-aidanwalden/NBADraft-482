import { db, dbSchema } from "../client";

export async function fetchUserByUsername(username: string) {
  return db.query.user.findFirst({
    where: (user, { eq }) => eq(user.username, username),
  });
}

export async function fetchUserById(id: string) {
  return db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, id),
  });
}

export async function createUser(username: string, email: string, name: string) {
  const id = crypto.randomUUID();
  await db.insert(dbSchema.user).values({
    id,
    username,
    email,
    name,
    emailVerified: false,
  });
  return id;
}
