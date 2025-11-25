import type { Express } from "express";

// Houndify API configuration
const HOUNDIFY_API_ENDPOINT = "https://api.houndify.com/v1/text";
const CLIENT_ID = process.env.VITE_HOUNDIFY_CLIENT_ID || "";
const CLIENT_KEY = process.env.HOUNDIFY_CLIENT_KEY || "";

export function setupHoundifyRoutes(app: Express) {
  // Proxy endpoint for Houndify text queries
  app.post("/api/houndify-query", async (req, res) => {
    try {
      const { query, userId = "hazbin-player" } = req.body;

      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      if (!CLIENT_ID || !CLIENT_KEY) {
        console.warn("Houndify credentials missing");
        return res.status(503).json({ error: "AI service not configured" });
      }

      // Make request to Houndify API with authentication
      const response = await fetch(HOUNDIFY_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Houndify-Client-ID": CLIENT_ID,
          "X-Houndify-Client-Key": CLIENT_KEY,
        },
        body: JSON.stringify({
          Query: query,
          UserID: userId,
          RequestID: `req-${Date.now()}-${Math.random()}`,
        }),
      });

      if (!response.ok) {
        console.error(`Houndify error: ${response.status}`);
        return res.status(response.status).json({
          error: `Houndify API error: ${response.statusText}`,
        });
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Houndify proxy error:", error);
      res.status(500).json({
        error: "Failed to process AI query",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
}
