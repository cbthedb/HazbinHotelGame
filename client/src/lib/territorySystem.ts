import type { GameState } from "./game-state";
import districtsData from "@/data/districts.json";

export interface Territory {
  districtId: string;
  ownerId: string | null;
  tributePerTurn: number;
  defenseDifficulty: number;
  challenger?: string;
}

interface District {
  id: string;
  name: string;
  dangerLevel: number;
}

const DISTRICTS = districtsData as District[];

export function getDistrictById(id: string): District | undefined {
  return DISTRICTS.find(d => d.id === id);
}

export function canClaimTerritory(gameState: GameState, districtId: string): { can: boolean; reason?: string; difficultyRating?: string } {
  const district = getDistrictById(districtId);
  if (!district) return { can: false, reason: "District not found" };
  
  const territory = (gameState.territory as any)[districtId];
  const alreadyOwned = territory?.ownerId === gameState.character.firstName;
  if (alreadyOwned) return { can: false, reason: "You already own this territory" };
  
  const powerNeeded = 20 + (district.dangerLevel * 8);
  if (gameState.character.power < powerNeeded) {
    return { can: false, reason: `Requires ${powerNeeded} Power (you have ${gameState.character.power})` };
  }
  
  const difficultyRatings = ["Easy", "Moderate", "Hard", "Very Hard", "Extreme", "Overlord", "Supreme"];
  const difficulty = Math.min(district.dangerLevel - 1, difficultyRatings.length - 1);
  
  return { can: true, difficultyRating: difficultyRatings[Math.max(0, difficulty)] };
}

export function claimTerritory(gameState: GameState, districtId: string): Partial<GameState> {
  const district = getDistrictById(districtId);
  if (!district) return {};
  
  const tribute = 50 + (district.dangerLevel * 15);
  
  return {
    territory: {
      ...gameState.territory,
      [districtId]: {
        ownerId: gameState.character.firstName,
        tributePerTurn: tribute,
        defenseDifficulty: district.dangerLevel
      }
    },
    character: {
      ...gameState.character,
      influence: gameState.character.influence + 3,
      corruption: gameState.character.corruption + 3,
      power: Math.max(1, gameState.character.power - 5)
    }
  };
}

export function getTributeIncome(gameState: GameState): number {
  let totalTribute = 0;
  Object.values(gameState.territory).forEach((territory: any) => {
    if (territory.ownerId === gameState.character.firstName) {
      totalTribute += territory.tributePerTurn || 0;
    }
  });
  return totalTribute;
}

export function getControlledDistricts(gameState: GameState): string[] {
  return Object.entries(gameState.territory)
    .filter(([_, territory]: any) => territory.ownerId === gameState.character.firstName)
    .map(([districtId]) => districtId);
}
