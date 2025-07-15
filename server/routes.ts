import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve privacy policy
  app.get('/privacy', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'client/public/privacy.html'));
  });

  // Serve assetlinks.json for Android App Links
  app.get('/.well-known/assetlinks.json', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'client/public/.well-known/assetlinks.json'));
  });
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
