// src/routes/health.js
import express from "express";
import prisma from "../prisma.js";

const router = express.Router();

router.get("/healthz", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
});

export default router;
