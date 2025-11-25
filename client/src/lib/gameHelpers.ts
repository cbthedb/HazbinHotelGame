import type { Origin, Trait, Power, Character } from "@shared/schema";
import namesData from "@/data/names.json";

export function generateRandomName(origin?: string): { firstName: string; lastName: string } {
  const firstNameCategories = Object.values(namesData.firstNames).flat();
  const lastNameCategories = Object.values(namesData.lastNames).flat();
  
  const firstName = firstNameCategories[Math.floor(Math.random() * firstNameCategories.length)];
  const lastName = lastNameCategories[Math.floor(Math.random() * lastNameCategories.length)];
  
  return { firstName, lastName };
}

export function generateSuggestedNames(origin: string, count: number = 3): Array<{ firstName: string; lastName: string }> {
  const suggestions: Array<{ firstName: string; lastName: string }> = [];
  
  for (let i = 0; i < count; i++) {
    suggestions.push(generateRandomName(origin));
  }
  
  return suggestions;
}

export function calculateTraitCost(traits: Trait[]): number {
  return traits.reduce((sum, trait) => sum + trait.cost, 0);
}

export function canAffordTrait(currentTraits: Trait[], newTrait: Trait, maxPoints: number): boolean {
  const currentCost = calculateTraitCost(currentTraits);
  return currentCost + newTrait.cost <= maxPoints;
}

export function getPowerTypeColor(type: string): string {
  const colors: Record<string, string> = {
    "hellfire": "from-red-600 to-orange-500",
    "voice-broadcast": "from-blue-600 to-cyan-500",
    "shadow-eldritch": "from-purple-700 to-red-900",
    "contract": "from-amber-600 to-yellow-500",
    "seduction": "from-pink-600 to-rose-500",
    "tech-cyber": "from-cyan-600 to-blue-500",
    "pheromone": "from-purple-500 to-pink-500",
    "regeneration": "from-green-600 to-emerald-500",
    "teleportation": "from-indigo-600 to-purple-500",
    "necromancy": "from-gray-700 to-purple-900",
    "glamour": "from-violet-600 to-fuchsia-500",
    "musical": "from-yellow-600 to-amber-500",
    "physical": "from-stone-600 to-gray-500",
    "illusion": "from-teal-600 to-cyan-500",
    "divine": "from-gold-400 to-yellow-300"
  };
  
  return colors[type] || "from-gray-600 to-gray-500";
}

export function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    "common": "text-gray-400",
    "uncommon": "text-green-400",
    "rare": "text-blue-400",
    "epic": "text-purple-400",
    "legendary": "text-amber-400"
  };
  
  return colors[rarity] || "text-gray-400";
}

export function formatStatChange(stat: string, value: number): string {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value} ${stat}`;
}

export function getStatColor(statName: string): string {
  const colors: Record<string, string> = {
    "power": "text-red-500",
    "control": "text-purple-500",
    "influence": "text-amber-500",
    "corruption": "text-red-900 dark:text-red-700",
    "empathy": "text-pink-500",
    "health": "text-green-500",
    "wealth": "text-yellow-500"
  };
  
  return colors[statName.toLowerCase()] || "text-gray-500";
}

export function getStatBarColor(statName: string): string {
  const colors: Record<string, string> = {
    "power": "bg-red-500",
    "control": "bg-purple-500",
    "influence": "bg-amber-500",
    "corruption": "bg-red-900 dark:bg-red-700",
    "empathy": "bg-pink-500",
    "health": "bg-green-500",
    "wealth": "bg-yellow-500"
  };
  
  return colors[statName.toLowerCase()] || "bg-gray-500";
}

export function getRankTitle(rank: string): string {
  const titles: Record<string, string> = {
    "street-demon": "Street Demon",
    "rising-power": "Rising Power",
    "overlord-candidate": "Overlord Candidate",
    "overlord": "Overlord",
    "supreme-overlord": "Supreme Overlord",
    "hells-apex": "Hell's Apex"
  };
  
  return titles[rank] || rank;
}

export function checkPowerUnlock(power: Power, character: Character): boolean {
  const { unlockConditions } = power;
  
  if (unlockConditions.origin && !unlockConditions.origin.includes(character.origin)) {
    return false;
  }
  
  if (unlockConditions.minPower && character.power < unlockConditions.minPower) {
    return false;
  }
  
  if (unlockConditions.minControl && character.control < unlockConditions.minControl) {
    return false;
  }
  
  if (unlockConditions.minInfluence && character.influence < unlockConditions.minInfluence) {
    return false;
  }
  
  return true;
}
