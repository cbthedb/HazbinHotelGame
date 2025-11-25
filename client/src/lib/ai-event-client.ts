/**
 * Client-side AI event generation
 * Communicates with backend API for AI-powered event generation
 */

export interface AIEventRequest {
  theme?: string;
  location?: string;
  characterPower?: number;
  characterCorruption?: number;
}

/**
 * Request a dynamically generated event from the server
 */
export async function requestAIEvent(options: AIEventRequest = {}) {
  try {
    const response = await fetch("/api/ai-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error requesting AI event:", error);
    return null;
  }
}

/**
 * Request NPC dialogue from the server
 */
export async function requestNPCDialogue(npcName: string, context: string = "") {
  try {
    const response = await fetch("/api/npc-dialogue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ npcName, context })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.dialogue || "...";
  } catch (error) {
    console.error("Error requesting NPC dialogue:", error);
    return "...";
  }
}
