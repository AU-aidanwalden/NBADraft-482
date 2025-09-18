import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/config.js";

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
    req.user = {
      id: parseInt(decoded.sub as string),
      iat: decoded.iat as number,
      exp: decoded.exp as number,
    };
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(500).json({ message: "Error verifying token" });
  }
}
