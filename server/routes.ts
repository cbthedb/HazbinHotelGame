import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateAIEvent, generateNPCDialogue, generateEventChain } from "./lib/ai-events";

export async function registerRoutes(app: Express): Promise<Server> {
  // AI Event Generation Endpoints
  app.post("/api/ai-event", async (req, res) => {
    try {
      const { theme, location, characterPower, characterCorruption } = req.body;
      const event = await generateAIEvent({
        theme,
        location,
        characterPower,
        characterCorruption
      });
      
      if (!event) {
        return res.status(500).json({ error: "Failed to generate event" });
      }
      
      res.json(event);
    } catch (error) {
      console.error("Error in /api/ai-event:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // NPC Dialogue Endpoint
  app.post("/api/npc-dialogue", async (req, res) => {
    try {
      const { npcName, context } = req.body;
      
      if (!npcName) {
        return res.status(400).json({ error: "Missing npcName" });
      }

      const dialogue = await generateNPCDialogue(npcName, context || "");
      res.json({ dialogue });
    } catch (error) {
      console.error("Error in /api/npc-dialogue:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Event Chain Endpoint
  app.post("/api/event-chain", async (req, res) => {
    try {
      const { previousEventId, playerChoice } = req.body;
      
      if (!previousEventId || !playerChoice) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const nextEvent = await generateEventChain(previousEventId, playerChoice, storage);
      
      if (!nextEvent) {
        return res.status(404).json({ error: "No follow-up event found" });
      }
      
      res.json(nextEvent);
    } catch (error) {
      console.error("Error in /api/event-chain:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  const httpServer = createServer(app);

  return httpServer;
}
