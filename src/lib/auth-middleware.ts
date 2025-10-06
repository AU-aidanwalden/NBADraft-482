import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

type Session = {
  user: {
    id: string;
    email: string;
    name: string;
    username?: string | null;
  };
  session: {
    id: string;
  };
};

export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, session: Session) => Promise<NextResponse>
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { message: "No active session" },
        { status: 401 }
      );
    }

    return handler(request, session);
  } catch (error) {
    console.error("Auth middleware error:", error);
    return NextResponse.json(
      { message: "Authentication failed" },
      { status: 401 }
    );
  }
}
