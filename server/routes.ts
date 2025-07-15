import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes - prefix all routes with /api
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Bookmarks API
  app.get("/api/bookmarks", async (req, res) => {
    try {
      const bookmarks = await storage.getBookmarks();
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookmarks" });
    }
  });

  // Progress API  
  app.get("/api/progress", async (req, res) => {
    try {
      const badges = await storage.getBadges();
      res.json(badges);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  // Ensure Vite middleware gets priority over catch-all routes
  // by adding specific route exclusions for Vite assets
  app.use((req, res, next) => {
    // Skip processing for Vite internal routes
    if (req.path.startsWith('/@') || req.path.startsWith('/src/') || req.path.includes('.js') || req.path.includes('.ts') || req.path.includes('.tsx')) {
      return next();
    }
    next();
  });

  const httpServer = createServer(app);
  return httpServer;
}
