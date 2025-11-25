import type { GameState } from "./game-state";
import type { GameEvent } from "@shared/schema";

export async function generateAIEvent(gameState: GameState): Promise<Partial<GameEvent> | null> {
  try {
    const response = await fetch("/api/ai-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        theme: getEventTheme(gameState),
        location: gameState.character.location || "hotel-district",
        characterPower: gameState.character.power,
        characterCorruption: gameState.character.corruption
      })
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching AI event:", error);
    return null;
  }
}

function getEventTheme(gameState: GameState): string {
  if (gameState.character.power > 80) return "ultimate-power";
  if (gameState.character.corruption > 70) return "corruption-themed";
  if (gameState.character.empathy > 70) return "redemption-themed";
  if (gameState.character.influence > 60) return "politics";
  if (gameState.character.wealth > 500) return "wealth-based";
  return "random";
}

export async function generateNPCDialogue(npcName: string, context: string): Promise<string> {
  try {
    const response = await fetch("/api/npc-dialogue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ npcName, context })
    });

    if (!response.ok) return "...";
    const data = await response.json();
    return data.dialogue || "...";
  } catch (error) {
    console.error("Error fetching NPC dialogue:", error);
    return "...";
  }
}
