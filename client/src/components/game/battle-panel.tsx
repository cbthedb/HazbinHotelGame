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
  const [battle, setBattle] = useState<BattleState>({
    playerHealth: gameState.character.health,
    opponentHealth: 100,
    cursedEnergy: 0,
    ultimateGauge: 0,
    turn: 0,
    battleLog: ["Battle started!"]
  });

  const powers = powersData as any[];
  const npcs = npcsData as any[];
  const opponentNpc = npcs.find(n => n.id === opponent);

  // Determine base attack (most common power type)
  const playerPowers = (gameState.character.powers || [])
    .map(id => powers.find(p => p.id === id))
    .filter(Boolean) as any[];

  const powerTypeCounts: Record<string, number> = {};
  playerPowers.forEach(p => {
    powerTypeCounts[p.type] = (powerTypeCounts[p.type] || 0) + 1;
  });

  const mostCommonType = Object.entries(powerTypeCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const baseAttackPower = playerPowers.find(p => p.type === mostCommonType && !p.isPassive);
  const ultimatePower = playerPowers.reduce((best, p) => {
    if (!p.isPassive && p.basePower > (best?.basePower || 0)) return p;
    return best;
  });

  const handleBaseAttack = () => {
    const damage = baseAttackPower ? (baseAttackPower.basePower + Math.random() * 10) : 8;
    const newLog = [...battle.battleLog];
    newLog.push(`You used ${baseAttackPower?.name || "Basic Attack"}! Hit for ${Math.floor(damage)} damage.`);

    const newCE = Math.min(100, battle.cursedEnergy + 15);
    const newUltimate = Math.min(700, battle.ultimateGauge + 100);
    const newOpponentHealth = Math.max(0, battle.opponentHealth - damage);

    if (newOpponentHealth <= 0) {
      onBattleEnd(true, {
        power: 20,
        influence: 15,
        wealth: 500,
        powerReward: ultimatePower
      });
      return;
    }

    // Opponent attacks back
    const opponentDamage = 8 + Math.random() * 8;
    newLog.push(`${opponentNpc?.name || "Opponent"} attacks! You take ${Math.floor(opponentDamage)} damage.`);
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
    if (battle.cursedEnergy < power.basePower * 3) {
      toast({
        title: "Not Enough CE",
        description: `Need ${power.basePower * 3} cursed energy`,
        variant: "destructive"
      });
      return;
    }

    const damage = power.basePower + Math.random() * 20;
    const newLog = [...battle.battleLog];
    newLog.push(`You unleashed ${power.name}! Devastating hit for ${Math.floor(damage)} damage!`);

    const newCE = Math.max(0, battle.cursedEnergy - power.basePower * 3);
    const newUltimate = Math.min(700, battle.ultimateGauge + 100);
    const newOpponentHealth = Math.max(0, battle.opponentHealth - damage);

    if (newOpponentHealth <= 0) {
      onBattleEnd(true, {
        power: 20,
        influence: 15,
        wealth: 500,
        powerReward: ultimatePower
      });
      return;
    }

    // Opponent attacks
    const opponentDamage = 8 + Math.random() * 8;
    newLog.push(`${opponentNpc?.name || "Opponent"} attacks! You take ${Math.floor(opponentDamage)} damage.`);
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

    const damage = (ultimatePower?.basePower || 30) * 2.5 + Math.random() * 30;
    const newLog = [...battle.battleLog];
    newLog.push(`${ultimatePower ? "ULTIMATE: " + ultimatePower.name : "ULTIMATE TECHNIQUE"}! Catastrophic damage: ${Math.floor(damage)}!`);

    const newOpponentHealth = Math.max(0, battle.opponentHealth - damage);

    if (newOpponentHealth <= 0) {
      onBattleEnd(true, {
        power: 30,
        influence: 25,
        wealth: 800,
        powerReward: ultimatePower
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
              BATTLE
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
              <div className="text-sm font-semibold mb-2">{opponentNpc?.name || "Opponent"}</div>
              <Progress value={(battle.opponentHealth / 100) * 100} className="h-4 bg-red-900" />
              <div className="text-xs text-muted-foreground mt-1">
                {Math.floor(battle.opponentHealth)} / 100
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
