import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  jwtAccessExpiration,
  refreshExpiration,
  jwtSecret,
} from "../config/config.js";
import { Request, Response } from "express";
import { randomBytes } from "crypto";
import RefreshToken from "../types/auth/RefreshToken.js";
import {
  fetchUserById,
  fetchUserByUsername,
  createUser,
} from "../db/queries/users.queries.js";
import {
  createSession,
  deleteSession,
  fetchSessionsByUserId,
} from "../db/queries/sessions.queries.js";

if (!jwtSecret || jwtSecret === "undefined") {
  throw new Error("JWT secret is not configured");
}

async function generateRefreshToken(userId: bigint): Promise<RefreshToken> {
  const refreshToken = randomBytes(128).toString("hex");

  const hash = await bcrypt.hash(refreshToken, 10);

  const session = await createSession(
    userId,
    hash,
    new Date(Date.now() + refreshExpiration)
  );

  return { refreshToken, sessionId: session.id };
}

export async function register(req: Request, res: Response) {
  const { username, password } = req.body;

  // Check if user already exists
  const existingUser = await fetchUserByUsername(username);

  if (existingUser) {
    return res.status(400).json({ message: "Username already taken" });
  }

  // Bcrypt password hashing implemented according to
  // https://www.bcrypt.io/languages/javascript

  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);

  // Create new user in the database

  await createUser(username, hash);

  res.status(201).json({ message: "User registered successfully" });
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;

  // Bcrypt password comparison implemented according to
  // https://www.bcrypt.io/languages/javascript

  const user = await fetchUserByUsername(username);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const stored = user.passwordHash;
  // Compares the provided password with the stored hash

  const result = await bcrypt.compare(password, stored);

  if (result) {
    // Grants the user a token if credentials are valid
    const { refreshToken, sessionId } = await generateRefreshToken(user.id);

    const token = jwt.sign(
      {
        sub: String(user.id),
        sid: String(sessionId),
      },
      jwtSecret!,
      {
        expiresIn: jwtAccessExpiration,
        issuer: "nbadraft482",
      }
    );

    console.log("NODE_ENV:", process.env.NODE_ENV);

    const sameSite =
      process.env.NODE_ENV === "production"
        ? "strict"
        : ("lax" as "strict" | "lax");

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: sameSite,
      path: "/api/auth/refresh",
      maxAge: refreshExpiration,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.json({ token: token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
}

export async function refresh(req: Request, res: Response) {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  if (!req.user) {
    return res.status(401).json({ message: "No user found" });
  }

  try {
    // Find candidate sessions
    const candidates = await fetchSessionsByUserId(req.user.id);

    let matched: { id: bigint; userId: bigint; expiresAt: Date } | null = null;

    for (const s of candidates) {
      const ok = await bcrypt.compare(refreshToken, s.tokenHash);
      if (ok) {
        matched = {
          id: s.id,
          userId: s.userId,
          expiresAt: s.expiresAt,
        };
        break;
      }
    }

    if (!matched) {
      res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    if (matched.expiresAt.getTime() <= Date.now()) {
      await deleteSession(matched.id);
      res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    // Create new refresh token row and set cookie
    const { refreshToken: newRefresh, sessionId: newSessionId } =
      await generateRefreshToken(matched.userId);

    // Rotate: remove old session row
    await deleteSession(matched.id);

    res.cookie("refreshToken", newRefresh, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: (process.env.NODE_ENV === "production" ? "strict" : "lax") as
        | "strict"
        | "lax",
      path: "/api/auth/refresh",
      maxAge: refreshExpiration,
    });

    // Issue new access token
    const access = jwt.sign(
      { sub: String(matched.userId), sid: String(newSessionId) },
      jwtSecret!,
      {
        expiresIn: jwtAccessExpiration,
        issuer: "nbadraft482",
      }
    );

    return res.json({ token: access });
  } catch (err) {
    console.error("refresh error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function whoami(req: Request, res: Response) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "No user found" });
  }

  try {
    const userData = await fetchUserById(user.id);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({ message: "Error verifying token" });
  }
}
