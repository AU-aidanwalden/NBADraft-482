import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { jwtExpiration, jwtSecret } from "../config/config.js";
import { Request, Response } from "express";
import prisma from "../database.js";

export async function register(req: Request, res: Response) {
  const { username, password } = req.body;

  // JWT secret must be defined. Throw error if not.
  if (!jwtSecret) {
    return res.status(500).json({ message: "JWT secret is not configured" });
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    return res.status(400).json({ message: "Username already taken" });
  }

  // Bcrypt password hashing implemented according to
  // https://www.bcrypt.io/languages/javascript

  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);

  // Create new user in the database

  await prisma.user.create({
    data: {
      username,
      passwordHash: hash,
    },
  });

  res.status(201).json({ message: "User registered successfully" });
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;

  if (!jwtSecret) {
    return res.status(500).json({ message: "JWT secret is not configured" });
  }

  // Bcrypt password comparison implemented according to
  // https://www.bcrypt.io/languages/javascript

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const stored = user.passwordHash;
  // Compares the provided password with the stored hash

  const result = await bcrypt.compare(password, stored);

  if (result) {
    // Grants the user a token if credentials are valid
    const token = jwt.sign({ username }, jwtSecret, {
      expiresIn: jwtExpiration,
    });
    res.json({ token: token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
}
