import express from "express";
import prisma from "../prisma.js";
import { getNowForExpiry } from "../utils/time.js";

const router = express.Router();

/**
 * GET /p/:id
 * - Return HTML containing paste content
 * - If unavailable -> 404 (HTML is fine)
 * - Must render safely (no script execution)
 */
router.get("/p/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const paste = await prisma.paste.findUnique({
      where: { id }
    });

    if (!paste) {
      return res.status(404).send("Not Found");
    }

    const now = getNowForExpiry(req);
    if (paste.expiresAt && now >= paste.expiresAt) {
      return res.status(404).send("Not Found");
    }

    if (paste.maxViews != null && paste.viewsUsed >= paste.maxViews) {
      return res.status(404).send("Not Found");
    }

    // IMPORTANT: HTML safe rendering
    const safeContent = paste.content
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

    return res.status(200).send(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Paste ${id}</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            pre { white-space: pre-wrap; background: #111; color: #0f0; padding: 16px; border-radius: 8px; }
          </style>
        </head>
        <body>
          <h2>📄 Paste</h2>
          <pre>${safeContent}</pre>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

export default router;
