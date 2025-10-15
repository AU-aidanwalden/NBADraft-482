"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export type ServerSession = Awaited<ReturnType<typeof auth.api.getSession>>;

export async function getServerSession(): Promise<ServerSession> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}
