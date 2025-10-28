"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export type ServerSession = Awaited<ReturnType<typeof auth.api.getSession>>;

export async function getServerSession(): Promise<ServerSession | null> {
  const reqHeaders = await headers();

  // Get the session token from cookies
  const cookieHeader = reqHeaders.get("cookie");
  const token = cookieHeader?.match(/session_token=([^;]+)/)?.[1];

  if (!token) {
    // No session token, return null
    return null;
  }

  try {
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });
    return session ?? null;
  } catch (err) {
    console.error("Failed to fetch server session:", err);
    return null;
  }
}
