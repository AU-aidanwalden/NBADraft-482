import { NextRequest } from "next/server";
import { auth } from "../../../../lib/auth";

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

  const response = await auth.api.signInUsername({
    body: {
      username,
      password,
      rememberMe: true,
    },
    headers: request.headers,
    asResponse: true,
  });

  return response;
}
