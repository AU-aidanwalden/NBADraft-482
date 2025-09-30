import prisma from "../../database.js";

export async function fetchUserByUsername(username: string) {
  return await prisma.users.findUnique({
    where: { username },
  });
}

export async function fetchUserById(id: number) {
  return await prisma.users.findUnique({
    where: { id },
  });
}

export async function createUser(username: string, passwordHash: string) {
  return await prisma.users.create({
    data: { username, passwordHash },
  });
}
