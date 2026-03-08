import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Smart Waste Assistant API is running" });
  });

  // Mock leaderboard data
  app.get("/api/leaderboard", (req, res) => {
    res.json([
      { name: "EcoWarrior", points: 1250, items: 45 },
      { name: "GreenThumb", points: 980, items: 32 },
      { name: "RecycleKing", points: 850, items: 28 },
      { name: "EarthLover", points: 720, items: 21 },
      { name: "NaturePal", points: 540, items: 15 },
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
