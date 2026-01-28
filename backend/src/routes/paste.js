import express from "express";
import prisma from "../prisma.js";
import { nanoid } from "nanoid";
import { getNowForExpiry } from "../utils/time.js";

const router = express.Router();

/**
 * POST /api/pastes
 * Body:
 * {
 *   content: "string",
 *   ttl_seconds: 60,
 *   max_views: 5
 * }
 */
router.post("/", async (req, res) => {
  try {
    const { content, ttl_seconds, max_views } = req.body ?? {};

    // Validation
    if (typeof content !== "string" || content.trim().length === 0) {
      return res.status(400).json({ error: "content is required and must be a non-empty string" });
    }

    if (ttl_seconds !== undefined && ttl_seconds !== null) {
      if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
        return res.status(400).json({ error: "ttl_seconds must be an integer >= 1" });
      }
    }

    if (max_views !== undefined && max_views !== null) {
      if (!Number.isInteger(max_views) || max_views < 1) {
        return res.status(400).json({ error: "max_views must be an integer >= 1" });
      }
    }

    const id = nanoid(10);

    const now = new Date();
    const expiresAt =
      ttl_seconds ? new Date(now.getTime() + ttl_seconds * 1000) : null;

    const paste = await prisma.paste.create({
      data: {
        id,
        content,
        expiresAt,
        maxViews: max_views ?? null
      }
    });

    const baseUrl = process.env.BASE_URL || "http://localhost:3000";

    return res.status(201).json({
      id: paste.id,
      url: `${baseUrl}/p/${paste.id}`
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error" });
  }
});

/**
 * GET /api/pastes/:id
 * Successful response:
 * {
 *   content: "string",
 *   remaining_views: 4,
 *   expires_at: "ISO string or null"
 * }
 *
 * Notes:
 * - Each successful API fetch counts as a view
 * - If unavailable -> 404 JSON
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const paste = await prisma.paste.findUnique({
      where: { id }
    });

    if (!paste) {
      return res.status(404).json({ error: "not_found" });
    }

    // expiry check (deterministic testing)
    const now = getNowForExpiry(req);
    if (paste.expiresAt && now >= paste.expiresAt) {
      return res.status(404).json({ error: "not_found" });
    }

    // view limit check
    if (paste.maxViews !== null && paste.maxViews !== undefined) {
      if (paste.viewsUsed >= paste.maxViews) {
        return res.status(404).json({ error: "not_found" });
      }
    }

    // Atomic update to prevent concurrency issues
    const updated = await prisma.paste.update({
      where: { id },
      data: { viewsUsed: { increment: 1 } }
    });

    const remainingViews =
      updated.maxViews == null ? null : Math.max(updated.maxViews - updated.viewsUsed, 0);

    return res.status(200).json({
      content: updated.content,
      remaining_views: remainingViews,
      expires_at: updated.expiresAt ? updated.expiresAt.toISOString() : null
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error" });
  }
});

export default router;
