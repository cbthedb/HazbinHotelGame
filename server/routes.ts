import { createServer } from "node:http";
import type { Express } from "express";
import { setupHoundifyRoutes } from "./lib/houndify-proxy";

export async function registerRoutes(app: Express) {
  const server = createServer(app);
  
  // Setup Houndify API proxy
  setupHoundifyRoutes(app);
  
  return server;
}
