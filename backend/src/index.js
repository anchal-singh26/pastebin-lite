import "dotenv/config";
import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.js";
import pasteRoutes from "./routes/paste.js";
import pageRoutes from "./routes/page.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// REQUIRED ROUTES
app.use("/api", healthRoutes);
app.use("/api/pastes", pasteRoutes);
app.use("/", pageRoutes);

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
