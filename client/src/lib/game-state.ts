import type { Character, Power, Trait } from "@shared/schema";

export interface GameState {
  character: Character;
  turn: number;
  eventLog: Array<{ turn: number; title: string; choices: string[] }>;
  relationships: Record<string, number>; // NPC affinity scores
  territory: Record<string, boolean>; // Controlled territories
  activePowers: string[]; // Currently equipped power IDs
  health: number;
  wealth: number;
  actionCooldowns: Record<string, number>; // Action ID -> turn available
  actionUseCounts: Record<string, number>; // Action ID -> total uses (for diminishing returns)
}

const STORAGE_KEY = "hazbin-game-state";

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving game:", error);
  }
}

export function loadGame(): GameState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Error loading game:", error);
    return null;
  }
}

export function deleteGame(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error deleting game:", error);
  }
}

export function createNewGameState(character: Character): GameState {
  return {
    character,
    turn: 1,
    eventLog: [],
    relationships: {},
    territory: {},
    activePowers: [],
    health: character.health,
    wealth: character.wealth,
    actionCooldowns: {},
    actionUseCounts: {}
  };
}

export function exportGameSave(state: GameState): string {
  return JSON.stringify(state, null, 2);
}

export function importGameSave(json: string): GameState | null {
  try {
    const parsed = JSON.parse(json);
    // Basic validation
    if (parsed.character && parsed.turn && parsed.eventLog !== undefined) {
      return parsed as GameState;
    }
    return null;
  } catch (error) {
    console.error("Error parsing game save:", error);
    return null;
  }
}
