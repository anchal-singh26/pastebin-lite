const { PrismaClient } = require("@prisma/client");
const { nanoid } = require("nanoid");

const prisma = new PrismaClient();

exports.createPaste = async (req, res) => {
  try {
    const { title, content, expiresAt } = req.body;

    const paste = await prisma.paste.create({
      data: {
        id: nanoid(8),
        title,
        content,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    res.status(201).json(paste);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPaste = async (req, res) => {
  try {
    const { id } = req.params;

    const paste = await prisma.paste.findUnique({
      where: { id },
    });

    if (!paste) return res.status(404).json({ message: "Paste not found" });

    res.json(paste);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
