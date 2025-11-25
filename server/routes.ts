import { createServer } from "node:http";
import type { Express } from "express";

export async function registerRoutes(app: Express) {
  const server = createServer(app);
  
  // Add any API routes here in the future
  // For now, all routes are handled by Vite in development
  // and the static assets in production
  
  return server;
}
