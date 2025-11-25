export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: "first-steps", title: "First Steps", description: "Create your character", unlocked: false },
  { id: "power-seeker", title: "Power Seeker", description: "Reach 50 Power", unlocked: false },
  { id: "overlord", title: "Overlord", description: "Reach Overlord rank", unlocked: false },
  { id: "territory-master", title: "Territory Master", description: "Control 3 districts", unlocked: false },
  { id: "social-butterfly", title: "Social Butterfly", description: "Reach 50 Influence", unlocked: false },
  { id: "redemption", title: "Redemption", description: "Reach 100 Empathy", unlocked: false },
  { id: "fallen", title: "Fallen", description: "Reach 50 Corruption", unlocked: false },
  { id: "wealthy", title: "Wealthy Demon", description: "Accumulate 1000 soul coins", unlocked: false },
  { id: "10-turns", title: "Survivor", description: "Survive 10 turns", unlocked: false },
  { id: "romance", title: "Romantic", description: "Romance an NPC", unlocked: false }
];

export function checkAchievements(gameState: any): Achievement[] {
  const achievements = [...ALL_ACHIEVEMENTS];
  
  if (gameState.turn >= 1) achievements.find(a => a.id === "first-steps")!.unlocked = true;
  if (gameState.character.power >= 50) achievements.find(a => a.id === "power-seeker")!.unlocked = true;
  if (gameState.character.rank === "overlord") achievements.find(a => a.id === "overlord")!.unlocked = true;
  if (gameState.character.influence >= 50) achievements.find(a => a.id === "social-butterfly")!.unlocked = true;
  if (gameState.character.empathy >= 100) achievements.find(a => a.id === "redemption")!.unlocked = true;
  if (gameState.character.corruption >= 50) achievements.find(a => a.id === "fallen")!.unlocked = true;
  if (gameState.character.wealth >= 1000) achievements.find(a => a.id === "wealthy")!.unlocked = true;
  if (gameState.turn >= 10) achievements.find(a => a.id === "10-turns")!.unlocked = true;
  
  return achievements;
}
