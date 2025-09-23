import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import prisma from "./database.js";
import helmet from "helmet";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// https://helmetjs.github.io/#reference
app.use(
  helmet({
    hsts: process.env.NODE_ENV === "production",
    crossOriginResourcePolicy: false,
  })
);

const allowedOrigin = process.env.CORS_ORIGIN;
// https://github.com/expressjs/cors
app.use(
  cors({
    origin: allowedOrigin ? [allowedOrigin] : false,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  })
);

app.use(express.json());
app.use(cookieParser());

// Import and use auth routes
import authRoutes from "./routes/authRoutes.js";
const api = express.Router();
api.use("/auth", authRoutes);
app.use("/api", api);

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Shut down database connection on exit
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
