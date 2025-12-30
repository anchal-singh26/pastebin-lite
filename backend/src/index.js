import express from "express";
import prisma from "./prisma.js";
import cors from "cors";
import pasteRoutes from "./routes/paste.js";

const app = express();
const PORT = 3000;

/* ✅ USE cors (NOW TS IS HAPPY) */
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

/* ✅ USE body parser */
app.use(express.json());

/* ✅ USE pasteRoutes (NOW TS IS HAPPY) */
app.use("/api/pastes", pasteRoutes);

/* Health check */
app.get("/healthz", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true });
  } catch {
    res.status(500).json({ ok: false });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
