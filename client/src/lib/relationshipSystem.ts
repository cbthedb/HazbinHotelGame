import npcsData from "@/data/npcs.json";

export interface Relationship {
  affinity: number;
  isRomanced: boolean;
  isRival: boolean;
  favorsOwed: number;
}

// Initialize all NPCs with neutral relationships
export function initializeAllRelationships(): Record<string, Relationship> {
  const relationships: Record<string, Relationship> = {};
  const npcs = npcsData as any[];
  
  npcs.forEach(npc => {
    relationships[npc.id] = {
      affinity: 0,
      isRomanced: false,
      isRival: false,
      favorsOwed: 0
    };
  });
  
  return relationships;
}

export function getNpcData(npcId: string) {
  const npcs = npcsData as any[];
  return npcs.find(n => n.id === npcId);
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

// Calculate affinity change based on character traits and NPC preferences
export function calculateAffinityChange(
  npcId: string,
  characterTraits: string[],
  interactionType: 'positive' | 'negative' | 'territory' | 'romance' | 'conflict'
): number {
  const npc = getNpcData(npcId);
  if (!npc) return 0;

  let change = 0;

  if (interactionType === 'positive') {
    const affinity = characterTraits.filter(t => npc.affinityTraits?.includes(t)).length;
    change = 2 + (affinity * 1); // Reduced from 5 + (affinity * 3)
  } else if (interactionType === 'negative') {
    const disliked = characterTraits.filter(t => npc.dislikedTraits?.includes(t)).length;
    change = -3 - (disliked * 1); // Reduced from -5 - (disliked * 2)
  } else if (interactionType === 'territory') {
    // Respect overlords in their own domain
    change = 3; // Reduced from 8
  } else if (interactionType === 'romance') {
    change = 4; // Reduced from 10
  } else if (interactionType === 'conflict') {
    // Fighting overlords in their own domain damages affinity significantly
    change = -15; // Keep same as it's already harsh
  }

  return change;
}

export function getRelationshipStatus(affinity: number): string {
  if (affinity >= 75) return "Devoted Ally";
  if (affinity >= 50) return "Close Friend";
  if (affinity >= 25) return "Friendly";
  if (affinity >= 0) return "Acquaintance";
  if (affinity >= -30) return "Disliked";
  if (affinity >= -75) return "Hostile";
  return "Enemy";
}

export function getRelationshipColor(affinity: number): string {
  if (affinity >= 75) return "text-green-600";
  if (affinity >= 50) return "text-green-500";
  if (affinity >= 25) return "text-blue-500";
  if (affinity >= 0) return "text-amber-500";
  if (affinity >= -30) return "text-orange-500";
  if (affinity >= -75) return "text-red-500";
  return "text-red-700";
}

export function applyNpcAffects(relationships: Record<string, Relationship>, affinityChanges: Record<string, number>): Record<string, Relationship> {
  const newRelationships = { ...relationships };
  
  Object.entries(affinityChanges).forEach(([npcId, change]) => {
    newRelationships[npcId] = updateRelationship(
      newRelationships[npcId],
      change
    );
  });
  
  return newRelationships;
}

// Get battle affinity bonus
export function getBattleAffinityBonus(affinity: number): { healthBonus: number; damageReduction: number } {
  const normalizedAffinity = Math.max(-100, Math.min(100, affinity));
  const healthBonus = Math.max(0, Math.floor(normalizedAffinity * 1.5));
  const damageReduction = Math.max(0, Math.floor(normalizedAffinity * 0.5));
  return { healthBonus, damageReduction };
}
