import type { GameState } from "./game-state";

export interface Relationship {
  affinity: number;
  isRomanced: boolean;
  isRival: boolean;
  favorsOwed: number;
}

export function updateRelationship(current: Relationship | undefined, change: number, maxAffinity: number = 100): Relationship {
  const existing = current || { affinity: 0, isRomanced: false, isRival: false, favorsOwed: 0 };
  const newAffinity = Math.max(-100, Math.min(maxAffinity, existing.affinity + change));
  
  return {
    ...existing,
    affinity: newAffinity,
    isRival: newAffinity < -30,
    isRomanced: existing.isRomanced || newAffinity >= 75
  };
}

export function getRelationshipStatus(affinity: number): string {
  if (affinity >= 75) return "Lover";
  if (affinity >= 50) return "Close Friend";
  if (affinity >= 25) return "Friend";
  if (affinity >= 0) return "Acquaintance";
  if (affinity >= -30) return "Disliked";
  return "Hated";
}

export function getRelationshipColor(affinity: number): string {
  if (affinity >= 50) return "text-green-500";
  if (affinity >= 25) return "text-blue-500";
  if (affinity >= 0) return "text-amber-500";
  if (affinity >= -30) return "text-orange-500";
  return "text-red-600";
}

export function applyNpcAffects(gameState: GameState, affinityChanges: Record<string, number>): Record<string, Relationship> {
  const newRelationships = { ...gameState.relationships };
  
  Object.entries(affinityChanges).forEach(([npcId, change]) => {
    newRelationships[npcId] = updateRelationship(
      newRelationships[npcId],
      change
    );
  });
  
  return newRelationships;
}
