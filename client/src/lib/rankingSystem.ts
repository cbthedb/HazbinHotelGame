import type { GameState } from "./game-state";

export const RANK_TIERS = [
  { id: "weak-sinner", title: "Weak Sinner", minPower: 0 },
  { id: "street-demon", title: "Street Demon", minPower: 20 },
  { id: "rising-power", title: "Rising Power", minPower: 50 },
  { id: "overlord-candidate", title: "Overlord Candidate", minPower: 100 },
  { id: "overlord", title: "Overlord", minPower: 150 },
  { id: "supreme-overlord", title: "Supreme Overlord", minPower: 200 },
  { id: "hells-apex", title: "Hell's Apex", minPower: 250 }
];

export function calculateRank(power: number): string {
  for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
    if (power >= RANK_TIERS[i].minPower) {
      return RANK_TIERS[i].id;
    }
  }
  return "weak-sinner";
}

export function getRankTitle(rankId: string): string {
  const tier = RANK_TIERS.find(t => t.id === rankId);
  return tier ? tier.title : "Unknown";
}

export function calculateRankProgress(power: number): { currentRank: string; nextRank: string | null; progressPercent: number } {
  const currentRankId = calculateRank(power);
  const currentTierIndex = RANK_TIERS.findIndex(t => t.id === currentRankId);
  
  let progressPercent = 0;
  let nextRank: string | null = null;
  
  if (currentTierIndex < RANK_TIERS.length - 1) {
    const nextTier = RANK_TIERS[currentTierIndex + 1];
    nextRank = nextTier.id;
    
    const currentMin = RANK_TIERS[currentTierIndex].minPower;
    const nextMin = nextTier.minPower;
    const progress = power - currentMin;
    const needed = nextMin - currentMin;
    progressPercent = Math.min(100, (progress / needed) * 100);
  } else {
    progressPercent = 100; // At apex
  }
  
  return { currentRank: currentRankId, nextRank, progressPercent };
}

export function generateRivals(gameState: GameState): Array<{ id: string; name: string; power: number; rank: string }> {
  const rivalNames = ["Crimson Wraith", "Obsidian Tyrant", "Scarlet Sentinel", "Void Reaper", "Ash Decimator"];
  const currentTierIndex = RANK_TIERS.findIndex(t => t.id === gameState.character.rank);
  
  return rivalNames.slice(0, Math.min(3, currentTierIndex + 1)).map((name, i) => ({
    id: `rival-${i}`,
    name,
    power: gameState.character.power - 10 + Math.random() * 20,
    rank: gameState.character.rank
  }));
}
