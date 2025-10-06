import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-middleware";

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    return NextResponse.json({
      user: {
        id: session.user.id,
        username: session.user.username,
        name: session.user.name,
      },
    });
  });
}
