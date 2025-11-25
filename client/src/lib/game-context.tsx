import { createContext, useContext, useState, useCallback } from "react";
import type { Character } from "@shared/schema";
import { loadGame, saveGame, createNewGameState, type GameState } from "./game-state";

interface GameContextType {
  gameState: GameState | null;
  setGameState: (state: GameState) => void;
  startNewGame: (character: Character) => void;
  continueGame: () => boolean;
  nextTurn: () => void;
  updateCharacterStat: (stat: keyof Character, value: number) => void;
  addEventToLog: (title: string, choices: string[]) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameStateInternal] = useState<GameState | null>(() => loadGame());

  const setGameState = useCallback((state: GameState) => {
    setGameStateInternal(state);
    saveGame(state);
  }, []);

  const startNewGame = useCallback((character: Character) => {
    const newState = createNewGameState(character);
    setGameState(newState);
  }, [setGameState]);

  const continueGame = useCallback((): boolean => {
    const saved = loadGame();
    if (saved) {
      setGameStateInternal(saved);
      return true;
    }
    return false;
  }, []);

  const nextTurn = useCallback(() => {
    if (!gameState) return;
    
    const updatedState = {
      ...gameState,
      turn: gameState.turn + 1
    };
    setGameState(updatedState);
  }, [gameState, setGameState]);

  const updateCharacterStat = useCallback((stat: keyof Character, value: number) => {
    if (!gameState) return;

    const updatedState = {
      ...gameState,
      character: {
        ...gameState.character,
        [stat]: Math.max(0, value)
      }
    };
    setGameState(updatedState);
  }, [gameState, setGameState]);

  const addEventToLog = useCallback((title: string, choices: string[]) => {
    if (!gameState) return;

    const updatedState = {
      ...gameState,
      eventLog: [
        ...gameState.eventLog,
        {
          turn: gameState.turn,
          title,
          choices
        }
      ]
    };
    setGameState(updatedState);
  }, [gameState, setGameState]);

  const value: GameContextType = {
    gameState,
    setGameState,
    startNewGame,
    continueGame,
    nextTurn,
    updateCharacterStat,
    addEventToLog
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within GameProvider");
  }
  return context;
}
