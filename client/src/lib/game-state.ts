import type { Character } from "@shared/schema";

export interface GameState {
  character: Character;
  turn: number;
  eventLog: Array<{ turn: number; title: string; choices: string[] }>;
  relationships: Record<string, number>;
  territory: Record<string, boolean>;
  actionCooldowns: Record<string, number>;
  actionUseCounts: Record<string, number>;
}

const STORAGE_KEY = "hazbin-game-state";

/**
 * Save game to browser localStorage
 * Simple, reliable client-side storage
 */
export async function saveGame(state: GameState): Promise<void> {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
    console.log("✓ Game saved to browser");
  } catch (error) {
    console.error("Error saving game:", error);
  }
}

/**
 * Load game from browser localStorage
 */
export async function loadGame(): Promise<GameState | null> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    
    const parsed = JSON.parse(saved) as GameState;
    console.log("✓ Game loaded from browser");
    return parsed;
  } catch (error) {
    console.error("Error loading game:", error);
    return null;
  }
}

/**
 * Delete game from browser localStorage
 */
export async function deleteGame(): Promise<void> {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log("✓ Game deleted from browser");
  } catch (error) {
    console.error("Error deleting game:", error);
  }
}

/**
 * Create new game state from character
 */
export function createNewGameState(character: Character): GameState {
  return {
    character,
    turn: 1,
    eventLog: [],
    relationships: {},
    territory: {},
    actionCooldowns: {},
    actionUseCounts: {}
  };
}

/**
 * Export game to JSON string
 */
export function exportGameSave(state: GameState): string {
  return JSON.stringify(state, null, 2);
}

/**
 * Import game from JSON string
 */
export function importGameSave(json: string): GameState | null {
  try {
    const parsed = JSON.parse(json);
    if (parsed.character && parsed.turn !== undefined && parsed.eventLog) {
      return parsed as GameState;
    }
    return null;
  } catch (error) {
    console.error("Error parsing game save:", error);
    return null;
  }
}
