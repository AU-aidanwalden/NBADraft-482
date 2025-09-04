import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { jwtExpiration, jwtSecret } from "../config/config.js";
import { Request, Response } from "express";

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;

  // JWT secret must be defined. Throw error if not.
  if (!jwtSecret) {
    return res.status(500).json({ message: "JWT secret is not configured" });
  }

  // Bcrypt password comparison implemented according to
  // https://www.bcrypt.io/languages/javascript

  const result = await bcrypt.compare(password, stored);

  if (result) {
    // Grants the user a token if credentials are valid
    const token = jwt.sign({ username }, jwtSecret, {
      expiresIn: jwtExpiration,
    });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
}
