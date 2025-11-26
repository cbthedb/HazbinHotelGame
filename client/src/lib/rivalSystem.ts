import type { GameState } from "./game-state";
import { getNpcData, getRelationshipStatus } from "./relationshipSystem";
import npcsData from "@/data/npcs.json";

export interface RivalChallenge {
  npcId: string;
  territory?: string;
  reason: string;
}

/**
 * Generate rival challenges based on current affinity state
 */
export function generateRivalChallenge(gameState: GameState): RivalChallenge | null {
  const npcs = npcsData as any[];
  
  // Find NPCs who are rivals (affinity < -30)
  const rivals = npcs.filter(npc => {
    const rel = gameState.relationships[npc.id];
    return rel && rel.affinity < -30;
  });

  if (rivals.length === 0) return null;

  // Pick a random rival to challenge
  const rival = rivals[Math.floor(Math.random() * rivals.length)];
  
  // Generate reason based on affinity level
  const rel = gameState.relationships[rival.id];
  let reason = "A confrontation is unavoidable.";
  
  if (rel.affinity < -75) {
    reason = `${rival.name} appears, fury burning in their eyes: "You've gone too far!"`;
  } else if (rel.affinity < -50) {
    reason = `${rival.name} blocks your path: "We need to settle this. NOW."`;
  } else {
    reason = `${rival.name} confronts you: "I'm done with your games."`;
  }

  return {
    npcId: rival.id,
    reason
  };
}

/**
 * Check if player activities should affect affinity (e.g., seizing territory in overlord's domain)
 */
export function calculateActivityAffinityPenalty(
  npcId: string,
  activity: 'seize' | 'gamble' | 'socialize' | 'train',
  inTheirTerritory: boolean,
  gameState: GameState
): number {
  if (!inTheirTerritory) return 0;

  const npc = getNpcData(npcId);
  if (!npc) return 0;

  // Seizing territory in overlord's domain is a direct insult
  if (activity === 'seize') {
    return -25; // Major affinity hit
  }

  // Gambling in their territory without permission
  if (activity === 'gamble') {
    return -8;
  }

  // Other activities in their territory
  return 0;
}

/**
 * Get overlord territory (simplified - in real game could be more complex)
 */
export function getOverlordTerritory(npcId: string): string | null {
  const territoriesMap: Record<string, string> = {
    'alastor': 'pride-ring',
    'vox': 'envy-tower',
    'valentino': 'lust-pavilion',
    'carmilla': 'greed-casino',
    'rosie': 'gluttony-market',
    'charlie': 'pride-ring'
  };
  
  return territoriesMap[npcId] || null;
}

/**
 * Check if player is in overlord's territory
 */
export function isInNpcTerritory(npcId: string, currentTerritory: string): boolean {
  const territory = getOverlordTerritory(npcId);
  return territory === currentTerritory;
}
