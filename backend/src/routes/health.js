import express from "express";
import prisma from "../prisma.js";

const router = express.Router();

router.get("/healthz", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ ok: false });
  }
});

export default router;
