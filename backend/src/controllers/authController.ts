import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  jwtAccessExpiration,
  refreshExpiration,
  jwtSecret,
} from "../config/config.js";
import { Request, Response } from "express";
import prisma from "../database.js";
import { randomBytes } from "crypto";

if (!jwtSecret || jwtSecret === "undefined") {
  throw new Error("JWT secret is not configured");
}

async function generateRefreshToken(userId: bigint) {
  const refreshToken = randomBytes(128).toString("hex");

  const hash = await bcrypt.hash(refreshToken, 10);

  await prisma.sessions.create({
    data: {
      userId,
      tokenHash: hash,
      expiresAt: new Date(Date.now() + refreshExpiration),
      parentId: null,
      createdAt: new Date(),
      lastUsedAt: new Date(),
    },
  });

  return refreshToken;
}

export async function register(req: Request, res: Response) {
  const { username, password } = req.body;

  // Check if user already exists
  const existingUser = await prisma.users.findUnique({
    where: { username },
  });

  if (existingUser) {
    return res.status(400).json({ message: "Username already taken" });
  }

  // Bcrypt password hashing implemented according to
  // https://www.bcrypt.io/languages/javascript

  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);

  // Create new user in the database

  await prisma.users.create({
    data: {
      username,
      passwordHash: hash,
    },
  });

  res.status(201).json({ message: "User registered successfully" });
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;

  // Bcrypt password comparison implemented according to
  // https://www.bcrypt.io/languages/javascript

  const user = await prisma.users.findUnique({
    where: { username },
    select: { id: true, passwordHash: true },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const stored = user.passwordHash;
  // Compares the provided password with the stored hash

  const result = await bcrypt.compare(password, stored);

  if (result) {
    // Grants the user a token if credentials are valid
    const token = jwt.sign(
      {
        sub: String(user.id),
      },
      jwtSecret!,
      {
        expiresIn: jwtAccessExpiration,
        issuer: "nbadraft482",
      }
    );

    const refreshToken = await generateRefreshToken(user.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/api/auth/refresh",
      maxAge: refreshExpiration,
    });

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

  try {
    // Find candidate sessions (no selector available, so filter by non-expired)
    const candidates = await prisma.sessions.findMany({
      where: { expiresAt: { gt: new Date() } },
      select: { id: true, userId: true, tokenHash: true, expiresAt: true },
    });

    let matched: { id: bigint; userId: bigint; expiresAt: Date } | null = null;

    for (const s of candidates) {
      const ok = await bcrypt.compare(
        refreshToken,
        s.tokenHash as unknown as string
      );
      if (ok) {
        matched = {
          id: s.id as unknown as bigint,
          userId: s.userId as unknown as bigint,
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
      await prisma.sessions.delete({ where: { id: matched.id } });
      res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    // Rotate: remove old session row
    await prisma.sessions.delete({ where: { id: matched.id } });

    // Create new refresh token row and set cookie
    const newRefresh = await generateRefreshToken(matched.userId);

    res.cookie("refreshToken", newRefresh, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/api/auth/refresh",
      maxAge: refreshExpiration,
    });

    // Issue new access token
    const access = jwt.sign({ sub: String(matched.userId) }, jwtSecret!, {
      expiresIn: jwtAccessExpiration,
      issuer: "nbadraft482",
    });

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
    const userData = await prisma.users.findUnique({
      where: { id: user.id },
      select: { id: true, username: true },
    });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({ message: "Error verifying token" });
  }
}
