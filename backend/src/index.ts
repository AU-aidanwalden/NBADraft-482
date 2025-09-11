import express, { Request, Response } from "express";
import prisma from "./database.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

app.use(express.json());

// Import and use auth routes
import authRoutes from "./routes/authRoutes.js";
const api = express.Router();
api.use("/auth", authRoutes);
app.use("/api", api);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Shut down database connection on exit
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
