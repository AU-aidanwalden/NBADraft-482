import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";

export async function POST(request: NextRequest) {
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

    return NextResponse.json({
      message: "Session refreshed",
      session: {
        userId: session.user.id,
        email: session.user.email,
      },
    });
  } catch (error) {
    console.error("Session refresh error:", error);
    return NextResponse.json(
      { message: "Failed to refresh session" },
      { status: 500 }
    );
  }
}
