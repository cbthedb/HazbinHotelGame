import type { Character } from "@shared/schema";

export interface GameState {
  character: Character;
  turn: number;
  slot: number; // Track which save slot this game is in
  eventLog: Array<{ turn: number; title: string; choices: string[] }>;
  relationships: Record<string, number>;
  territory: Record<string, boolean>;
  actionCooldowns: Record<string, number>;
  actionUseCounts: Record<string, number>;
}

export interface SaveSlot {
  slot: number;
  gameState: GameState;
  characterName: string;
  timestamp: number;
}

const STORAGE_KEY = "hazbin-game-saves";
const MAX_SAVES = 5;

/**
 * Save game to a specific slot (default slot 1)
 */
export async function saveGame(state: GameState, slot: number = 1): Promise<void> {
  try {
    const saves = getAllSaves();
    const slotData: SaveSlot = {
      slot,
      gameState: state,
      characterName: state.character.name || "Unknown",
      timestamp: Date.now()
    };
    
    saves[slot - 1] = slotData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
    console.log(`✓ Game saved to slot ${slot}`);
  } catch (error) {
    console.error("Error saving game:", error);
  }
}

/**
 * Get all saves
 */
export function getAllSaves(): SaveSlot[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved) as SaveSlot[];
    return parsed.slice(0, MAX_SAVES);
  } catch {
    return [];
  }
}

/**
 * Load game from a specific slot (default slot 1)
 */
export async function loadGame(slot: number = 1): Promise<GameState | null> {
  try {
    const saves = getAllSaves();
    const save = saves[slot - 1];
    if (!save) return null;
    
    console.log(`✓ Game loaded from slot ${slot}`);
    return save.gameState;
  } catch (error) {
    console.error("Error loading game:", error);
    return null;
  }
}

/**
 * Load the most recent save
 */
export async function loadLatestSave(): Promise<(GameState & { slot: number }) | null> {
  try {
    const saves = getAllSaves().filter(s => s);
    if (saves.length === 0) return null;
    const latest = saves.reduce((a, b) => (a.timestamp > b.timestamp ? a : b));
    console.log(`✓ Game loaded from slot ${latest.slot}`);
    return { ...latest.gameState, slot: latest.slot };
  } catch (error) {
    console.error("Error loading latest game:", error);
    return null;
  }
}

/**
 * Delete game from a specific slot
 */
export async function deleteGame(slot: number = 1): Promise<void> {
  try {
    const saves = getAllSaves();
    saves[slot - 1] = null as any;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saves.filter(s => s)));
    console.log(`✓ Game deleted from slot ${slot}`);
  } catch (error) {
    console.error("Error deleting game:", error);
  }
}

/**
 * Delete all saves completely (for fresh start)
 */
export async function deleteAllSaves(): Promise<void> {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log(`✓ All saves deleted`);
  } catch (error) {
    console.error("Error deleting all saves:", error);
  }
}

/**
 * Create new game state from character
 */
export function createNewGameState(character: Character, slot: number = 1): GameState {
  return {
    character,
    turn: 1,
    slot,
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
