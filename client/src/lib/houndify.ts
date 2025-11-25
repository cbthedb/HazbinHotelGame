import type { GameState } from "./game-state";

const HOUNDIFY_API = "https://web-api.houndify.com/v1/text";
const CLIENT_ID = import.meta.env.VITE_HOUNDIFY_CLIENT_ID;
const CLIENT_KEY = import.meta.env.VITE_HOUNDIFY_CLIENT_KEY;

interface HoundifyResponse {
  result: {
    message?: string;
    intent?: string;
    [key: string]: any;
  };
}

export async function generateCustomOutcome(
  userInput: string,
  gameState: GameState
): Promise<{
  title: string;
  narrative: string;
  statChanges: Record<string, number>;
} | null> {
  try {
    if (!CLIENT_ID || !CLIENT_KEY) {
      console.warn("Houndify credentials missing");
      return null;
    }

    const prompt = `You are a Hazbin Hotel game AI. The player said: "${userInput}"
    Player character: ${gameState.character.firstName} ${gameState.character.lastName} (Power: ${gameState.character.power}, Corruption: ${gameState.character.corruption})
    Generate a single sentence outcome title and a 2 sentence narrative for this action.
    Also suggest stat changes as JSON like {"power": 2, "influence": 1}.
    Format: TITLE: [title] | NARRATIVE: [narrative] | STATS: [json]`;

    const response = await fetch(HOUNDIFY_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Houndify-Client-ID": CLIENT_ID,
        "X-Houndify-Client-Key": CLIENT_KEY
      },
      body: JSON.stringify({
        Query: prompt,
        RequestID: `req-${Date.now()}`
      })
    });

    if (!response.ok) {
      console.error("Houndify API error:", response.status);
      return null;
    }

    const data: HoundifyResponse = await response.json();
    const message = data.result?.message || "";

    const titleMatch = message.match(/TITLE:\s*([^|]+)/);
    const narrativeMatch = message.match(/NARRATIVE:\s*([^|]+)/);
    const statsMatch = message.match(/STATS:\s*(\{[^}]+\})/);

    if (!titleMatch || !narrativeMatch) return null;

    const title = titleMatch[1].trim();
    const narrative = narrativeMatch[1].trim();
    const statChanges = statsMatch ? JSON.parse(statsMatch[1]) : {};

    return { title, narrative, statChanges };
  } catch (error) {
    console.error("Houndify error:", error);
    return null;
  }
}

export async function generateEventWithUserInput(
  userInput: string,
  gameState: GameState
): Promise<any | null> {
  try {
    const outcome = await generateCustomOutcome(userInput, gameState);
    if (!outcome) return null;

    return {
      id: `custom-${Date.now()}`,
      title: outcome.title,
      description: `You decide to: ${userInput}`,
      type: "custom",
      choices: [
        {
          id: "accept",
          text: "Accept this outcome",
          outcomes: {
            statChanges: outcome.statChanges,
            narrativeText: outcome.narrative
          }
        },
        {
          id: "undo",
          text: "Reconsider",
          outcomes: {
            statChanges: {},
            narrativeText: "You change your mind."
          }
        }
      ],
      onlyOnce: false
    };
  } catch (error) {
    console.error("Error generating event with user input:", error);
    return null;
  }
}
