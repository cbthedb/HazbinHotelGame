import type { GameState } from "./game-state";

const DB_NAME = "HazinGameDB";
const STORE_NAME = "games";
const SAVES_STORE = "saves";

export interface SaveSlot {
  id: string;
  slotNumber: number;
  characterName: string;
  level: number;
  timestamp: number;
  gameState: GameState;
}

let db: IDBDatabase | null = null;

async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains(SAVES_STORE)) {
        database.createObjectStore(SAVES_STORE, { keyPath: "id" });
      }
    };
  });
}

export async function saveGameToBrowser(gameState: GameState): Promise<void> {
  const database = db || await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ id: "current", gameState, timestamp: Date.now() });
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function loadGameFromBrowser(): Promise<GameState | null> {
  const database = db || await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get("current");
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const result = request.result;
      resolve(result ? result.gameState : null);
    };
  });
}

export async function saveGameToSlot(gameState: GameState, slotNumber: number): Promise<SaveSlot> {
  const database = db || await initDB();
  const saveSlot: SaveSlot = {
    id: `slot-${slotNumber}`,
    slotNumber,
    characterName: `${gameState.character.firstName} ${gameState.character.lastName}`,
    level: Math.floor(gameState.character.power / 10),
    timestamp: Date.now(),
    gameState
  };
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([SAVES_STORE], "readwrite");
    const store = transaction.objectStore(SAVES_STORE);
    const request = store.put(saveSlot);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(saveSlot);
  });
}

export async function loadGameFromSlot(slotNumber: number): Promise<GameState | null> {
  const database = db || await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([SAVES_STORE], "readonly");
    const store = transaction.objectStore(SAVES_STORE);
    const request = store.get(`slot-${slotNumber}`);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const result = request.result;
      resolve(result ? result.gameState : null);
    };
  });
}

export async function getAllSaveSlots(): Promise<SaveSlot[]> {
  const database = db || await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([SAVES_STORE], "readonly");
    const store = transaction.objectStore(SAVES_STORE);
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || []);
  });
}

export async function deleteSaveSlot(slotNumber: number): Promise<void> {
  const database = db || await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([SAVES_STORE], "readwrite");
    const store = transaction.objectStore(SAVES_STORE);
    const request = store.delete(`slot-${slotNumber}`);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}
