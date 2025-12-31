import express from "express";
import prisma from "../prisma.js";

const router = express.Router();

/* CREATE PASTE */
router.post("/", async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const paste = await prisma.paste.create({
      data: { content },
    });

    res.json(paste);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create paste" });
  }
});

/* GET PASTE */
router.get("/:id", async (req, res) => {
  try {
    const paste = await prisma.paste.findUnique({
      where: { id: req.params.id },
    });

    if (!paste) {
      return res.status(404).json({ error: "Paste not found" });
    }

    /* Increment view count */
    await prisma.paste.update({
      where: { id: paste.id },
      data: { views: { increment: 1 } },
    });

    res.json(paste);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch paste" });
  }
});

export default router;