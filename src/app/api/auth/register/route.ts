import { NextRequest } from "next/server";
import { auth } from "../../../../lib/auth";
import { fetchUserByUsername } from "@/lib/db/queries/users";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const username = body?.username;
  const password = body?.password;

  if (!username || !password) {
    return new Response(
      JSON.stringify({ message: "Username and password are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const existing = await fetchUserByUsername(username);
  if (existing) {
    return new Response(JSON.stringify({ message: "Username already taken" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const betterAuthResponse = await auth.api.signUpEmail({
    body: {
      email: `${username}@placeholder.local`,
      username,
      password,
      name: username,
    },
    headers: request.headers,
    asResponse: true,
  });

  return betterAuthResponse;
}
