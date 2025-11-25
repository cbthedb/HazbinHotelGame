import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, Shield, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import powersData from "@/data/powers.json";
import npcsData from "@/data/npcs.json";
import type { GameState } from "@/lib/game-state";

interface BattlePanelProps {
  gameState: GameState;
  opponent: string; // NPC ID or "overlord"
  currentDistrict: string;
  onBattleEnd: (won: boolean, rewards: any) => void;
}

interface BattleState {
  playerHealth: number;
  opponentHealth: number;
  cursedEnergy: number;
  ultimateGauge: number;
  turn: number;
  battleLog: string[];
}

export default function BattlePanel({
  gameState,
  opponent,
  currentDistrict,
  onBattleEnd
}: BattlePanelProps) {
  const { toast } = useToast();
  
  const powers = powersData as any[];
  const npcs = npcsData as any[];
  const opponentNpc = npcs.find(n => n.id === opponent);
  
  // Get opponent name with fallbacks
  const getOpponentName = () => {
    if (opponentNpc?.name) return opponentNpc.name;
    if (opponent === "rival-demon") return "Rival Demon";
    if (opponent === "unknown" || !opponent) return "Unknown Opponent";
    try {
      return opponent.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    } catch {
      return "Opponent";
    }
  };
  
  // Scale difficulty based on opponent type
  const isOverlord = opponent === "charlie" || opponent === "alastor" || opponent === "valentino" || opponent === "vox" || opponent === "carmilla" || opponent === "lucifer";
  const isRival = opponent === "rival-demon";
  
  const baseOpponentHealth = isOverlord ? 300 : (isRival ? 120 : 100);
  const baseOpponentDamage = isOverlord ? 20 : (isRival ? 12 : 8);
  
  // POWER SCALING: Higher power = more health, more CE output, more damage
  const playerPowerLevel = gameState.character.power || 0;
  const scaledPlayerHealth = gameState.character.health + Math.floor(playerPowerLevel * 0.25); // +0.25 health per power
  const ceOutputMultiplier = 1 + (playerPowerLevel * 0.02); // 2% more CE per power level
  const playerDamageMultiplier = 1 + (playerPowerLevel * 0.03); // 3% more damage per power level
  
  const [battle, setBattle] = useState<BattleState>({
    playerHealth: scaledPlayerHealth,
    opponentHealth: baseOpponentHealth,
    cursedEnergy: 0,
    ultimateGauge: 0,
    turn: 0,
    battleLog: [`Battle started! You face ${getOpponentName()}!`]
  });

  // Determine base attack (lowest rarity - most common) and ultimate (strongest)
  const playerPowers = (gameState.character.powers || [])
    .map(id => powers.find(p => p.id === id))
    .filter(Boolean) as any[];

  // Rarity order: common (0) < uncommon (1) < rare (2) < epic (3) < legendary (4)
  const rarityOrder = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };
  
  // Find lowest rarity (most common) non-passive power for base attack
  const nonPassivePowers = playerPowers.filter(p => !p.isPassive);
  const baseAttackPower = nonPassivePowers.reduce((best, p) => {
    const pRarity = rarityOrder[p.rarity as keyof typeof rarityOrder] ?? 5;
    const bestRarity = rarityOrder[best.rarity as keyof typeof rarityOrder] ?? 5;
    return pRarity < bestRarity ? p : best;
  });

  // Find strongest non-passive power for ultimate
  const ultimatePower = nonPassivePowers.reduce((best, p) => {
    return p.basePower > (best?.basePower || 0) ? p : best;
  });

  const handleBaseAttack = () => {
    const baseDamage = baseAttackPower ? (baseAttackPower.basePower + Math.random() * 10) : 8;
    const damage = baseDamage * playerDamageMultiplier;
    const newLog = [...battle.battleLog];
    newLog.push(`You used ${baseAttackPower?.name || "Basic Attack"}! Hit for ${Math.floor(damage)} damage.`);

    const baseCE = Math.round(15 * ceOutputMultiplier);
    const newCE = Math.min(100, battle.cursedEnergy + baseCE);
    const newUltimate = Math.min(700, battle.ultimateGauge + 100);
    const newOpponentHealth = Math.max(0, battle.opponentHealth - damage);

    if (newOpponentHealth <= 0) {
      const overlordPower = isOverlord && opponentNpc?.powers?.[0] ? opponentNpc.powers[0] : null;
      onBattleEnd(true, {
        power: 2,
        influence: 1,
        wealth: 50,
        powerReward: ultimatePower,
        overlordPower: overlordPower
      });
      return;
    }

    // Opponent attacks back
    const opponentDamage = baseOpponentDamage + Math.random() * 12;
    newLog.push(`${getOpponentName()} attacks! You take ${Math.floor(opponentDamage)} damage.`);
    const newPlayerHealth = Math.max(0, battle.playerHealth - opponentDamage);

    if (newPlayerHealth <= 0) {
      onBattleEnd(false, {
        power: -5,
        health: -60,
        wealth: -200
      });
      return;
    }

    setBattle({
      ...battle,
      playerHealth: newPlayerHealth,
      opponentHealth: newOpponentHealth,
      cursedEnergy: newCE,
      ultimateGauge: newUltimate,
      turn: battle.turn + 1,
      battleLog: newLog
    });
  };

  const handlePowerAttack = (power: any) => {
    const ceCost = Math.round(power.basePower * 3);
    if (battle.cursedEnergy < ceCost) {
      toast({
        title: "Not Enough CE",
        description: `Need ${ceCost} cursed energy`,
        variant: "destructive"
      });
      return;
    }

    const baseDamage = power.basePower + Math.random() * 20;
    const damage = baseDamage * playerDamageMultiplier;
    const newLog = [...battle.battleLog];
    newLog.push(`You unleashed ${power.name}! Devastating hit for ${Math.floor(damage)} damage!`);

    const newCE = Math.max(0, battle.cursedEnergy - ceCost);
    const baseUltimate = Math.round(100 * (1 + playerPowerLevel * 0.03)); // 3% gauge per power
    const newUltimate = Math.min(700, battle.ultimateGauge + baseUltimate);
    const newOpponentHealth = Math.max(0, battle.opponentHealth - damage);

    if (newOpponentHealth <= 0) {
      const overlordPower = isOverlord && opponentNpc?.powers?.[0] ? opponentNpc.powers[0] : null;
      onBattleEnd(true, {
        power: 3,
        influence: 2,
        wealth: 75,
        powerReward: ultimatePower,
        overlordPower: overlordPower
      });
      return;
    }

    // Opponent attacks
    const opponentDamage = baseOpponentDamage + Math.random() * 12;
    newLog.push(`${getOpponentName()} attacks! You take ${Math.floor(opponentDamage)} damage.`);
    const newPlayerHealth = Math.max(0, battle.playerHealth - opponentDamage);

    if (newPlayerHealth <= 0) {
      onBattleEnd(false, {
        power: -5,
        health: -60,
        wealth: -200
      });
      return;
    }

    setBattle({
      ...battle,
      playerHealth: newPlayerHealth,
      opponentHealth: newOpponentHealth,
      cursedEnergy: newCE,
      ultimateGauge: newUltimate,
      turn: battle.turn + 1,
      battleLog: newLog
    });
  };

  const handleUltimate = () => {
    if (battle.ultimateGauge < 700) {
      toast({
        title: "Ultimate Not Ready",
        description: `Ultimate ready in ${Math.ceil((700 - battle.ultimateGauge) / 100)} turns`,
        variant: "destructive"
      });
      return;
    }

    const baseDamage = (ultimatePower?.basePower || 30) * 2.5;
    const damage = (baseDamage + Math.random() * 30) * playerDamageMultiplier;
    const newLog = [...battle.battleLog];
    newLog.push(`${ultimatePower ? "ULTIMATE: " + ultimatePower.name : "ULTIMATE TECHNIQUE"}! Catastrophic damage: ${Math.floor(damage)}!`);

    const newOpponentHealth = Math.max(0, battle.opponentHealth - damage);

    if (newOpponentHealth <= 0) {
      const powerReward = Math.round(8 * (1 + playerPowerLevel * 0.05));
      const overlordPower = isOverlord && opponentNpc?.powers?.[0] ? opponentNpc.powers[0] : null;
      onBattleEnd(true, {
        power: powerReward,
        influence: 5,
        wealth: 200,
        powerReward: ultimatePower,
        overlordPower: overlordPower
      });
      return;
    }

    setBattle({
      ...battle,
      opponentHealth: newOpponentHealth,
      ultimateGauge: 0,
      turn: battle.turn + 1,
      battleLog: newLog
    });
  };

  const availablePowers = playerPowers.filter(p => !p.isPassive && p.id !== baseAttackPower?.id);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-card border-2 border-primary rounded-lg overflow-hidden">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-destructive to-orange-600 text-white">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              BATTLE vs {getOpponentName()}
            </span>
            <span className="text-sm font-normal">Turn {battle.turn}</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Health Bars */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-semibold mb-2">Your Health</div>
              <Progress value={(battle.playerHealth / gameState.character.health) * 100} className="h-4" />
              <div className="text-xs text-muted-foreground mt-1">
                {Math.floor(battle.playerHealth)} / {gameState.character.health}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold mb-2">{getOpponentName()}</div>
              <Progress value={(battle.opponentHealth / baseOpponentHealth) * 100} className="h-4 bg-red-900" />
              <div className="text-xs text-muted-foreground mt-1">
                {Math.floor(battle.opponentHealth)} / {baseOpponentHealth}
              </div>
            </div>
          </div>

          {/* Resource Bars */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Badge className="mb-2 bg-blue-600">Cursed Energy: {Math.floor(battle.cursedEnergy)}/100</Badge>
              <Progress value={battle.cursedEnergy} className="h-2" />
            </div>
            <div>
              <Badge className="mb-2 bg-amber-600">Ultimate Gauge: {Math.floor(battle.ultimateGauge)}/700</Badge>
              <Progress value={(battle.ultimateGauge / 700) * 100} className="h-2" />
            </div>
          </div>

          {/* Opponent Skills */}
          {opponentNpc?.powers && (
            <div className="bg-black/20 rounded-lg p-3 space-y-2">
              <div className="text-sm font-semibold text-amber-100">Enemy Skills</div>
              <div className="flex flex-wrap gap-1">
                {(opponentNpc.powers as string[]).map(powerId => {
                  const power = powers.find(p => p.id === powerId);
                  return power ? (
                    <Badge key={powerId} variant="outline" className="text-xs bg-red-950/50 border-red-700">
                      {power.name}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Battle Log */}
          <div className="bg-black/20 rounded-lg p-4 h-32 overflow-y-auto text-sm space-y-1">
            {battle.battleLog.map((log, i) => (
              <div key={i} className="text-amber-100">{log}</div>
            ))}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              onClick={handleBaseAttack}
              className="bg-blue-600 hover:bg-blue-700"
              data-testid="button-attack-base"
            >
              <Zap className="w-4 h-4 mr-2" />
              {baseAttackPower?.name || "Basic Attack"}
            </Button>

            <Button
              onClick={handleUltimate}
              disabled={battle.ultimateGauge < 700}
              className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50"
              data-testid="button-attack-ultimate"
            >
              <Crown className="w-4 h-4 mr-2" />
              Ultimate ({Math.ceil((700 - battle.ultimateGauge) / 100)})
            </Button>

            <Button variant="outline" disabled data-testid="button-defend">
              <Shield className="w-4 h-4 mr-2" />
              Defend
            </Button>
          </div>

          {/* Available Powers */}
          {availablePowers.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-semibold">Available Powers (Cost: CE × 3)</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availablePowers.map(power => (
                  <Button
                    key={power.id}
                    onClick={() => handlePowerAttack(power)}
                    disabled={battle.cursedEnergy < power.basePower * 3}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    data-testid={`button-power-${power.id}`}
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    {power.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </div>
    </div>
  );
}
