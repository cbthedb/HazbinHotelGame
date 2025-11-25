import type { GameState } from "./game-state";
import powersData from "@/data/powers.json";

export interface PowerState {
  id: string;
  level: number;
  experience: number;
  cooldownRemaining: number;
}

export interface Power {
  id: string;
  name: string;
  type: string;
  description: string;
  baseCooldown: number;
  controlCost: number;
  unlockRequirements?: { stat: string; minimum: number };
  maxLevel?: number;
}

const POWERS = powersData as Power[];
const XP_PER_LEVEL = 100;
const MAX_POWER_LEVEL = 10;

export function getPowerById(id: string): Power | undefined {
  return POWERS.find(p => p.id === id);
}

export function canUsePower(gameState: GameState, powerId: string, powers: PowerState[]): { can: boolean; reason?: string } {
  const powerState = powers.find(p => p.id === powerId);
  if (!powerState) return { can: false, reason: "Power not equipped" };
  
  if (powerState.cooldownRemaining > 0) {
    return { can: false, reason: `On cooldown for ${powerState.cooldownRemaining} more turns` };
  }
  
  const power = getPowerById(powerId);
  if (!power) return { can: false, reason: "Power not found" };
  
  if (gameState.character.control < power.controlCost) {
    return { can: false, reason: `Requires ${power.controlCost} Control (you have ${gameState.character.control})` };
  }
  
  return { can: true };
}

export function usePower(powerState: PowerState, baseCooldown: number): PowerState {
  return {
    ...powerState,
    cooldownRemaining: baseCooldown,
    experience: Math.min(powerState.experience + 15, XP_PER_LEVEL * MAX_POWER_LEVEL),
    level: Math.min(
      Math.floor((powerState.experience + 15) / XP_PER_LEVEL) + 1,
      MAX_POWER_LEVEL
    )
  };
}

export function tickPowerCooldowns(powers: PowerState[]): PowerState[] {
  return powers.map(p => ({
    ...p,
    cooldownRemaining: Math.max(0, p.cooldownRemaining - 1)
  }));
}

export function getPowerProgress(experience: number): { level: number; levelXp: number; nextLevelXp: number } {
  const level = Math.min(Math.floor(experience / XP_PER_LEVEL) + 1, MAX_POWER_LEVEL);
  const levelXp = experience % XP_PER_LEVEL;
  const nextLevelXp = Math.min(XP_PER_LEVEL, XP_PER_LEVEL);
  return { level, levelXp, nextLevelXp };
}
