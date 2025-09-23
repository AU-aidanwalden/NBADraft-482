import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/config.js";
import prisma from "../database.js";

if (!jwtSecret || jwtSecret === "undefined") {
  throw new Error("JWT secret is not configured");
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];

  if (!token || token === "undefined") {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret!) as jwt.JwtPayload;

    const userId = parseInt(decoded.sub as string);
    const sessionIdStr = decoded.sid as string | undefined;

    if (!sessionIdStr) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const sessionId = BigInt(sessionIdStr);

    // Verify session exists and not expired
    const session = await prisma.sessions.findUnique({
      where: { id: sessionId },
      select: { id: true, userId: true, expiresAt: true },
    });

    if (
      !session ||
      Number(session.userId) !== userId ||
      session.expiresAt.getTime() <= Date.now()
    ) {
      return res.status(401).json({ message: "Invalid or expired session" });
    }

    req.user = {
      id: userId,
      iat: decoded.iat as number,
      exp: decoded.exp as number,
      sessionId: Number(session.id),
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }
    console.error("Error verifying token:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
