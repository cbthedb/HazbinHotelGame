import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import npcsData from "@/data/npcs.json";
import type { GameState } from "@/lib/game-state";

interface NPCBattleProps {
  npcId: string;
  gameState: GameState;
  onBattleEnd: (won: boolean, affinityChange: number, rewards: any) => void;
}

interface BattleState {
  playerHealth: number;
  npcHealth: number;
  turn: number;
  battleLog: string[];
  isPlayerTurn: boolean;
}

export default function NPCBattle({ npcId, gameState, onBattleEnd }: NPCBattleProps) {
  const { toast } = useToast();
  const npcs = npcsData as any[];
  const npc = npcs.find(n => n.id === npcId);
  
  if (!npc) return <div>NPC not found</div>;

  const npcHealth = npc.basePower * 2;
  const playerBaseHealth = gameState.character.health + (gameState.character.age || 0) * 2;
  
  const [battle, setBattle] = useState<BattleState>({
    playerHealth: playerBaseHealth,
    npcHealth: npcHealth,
    turn: 0,
    battleLog: [`You challenge ${npc.name}!`],
    isPlayerTurn: true
  });

  const playerDamageMultiplier = 1 + (gameState.character.power * 0.03);
  const npcDamageMultiplier = 1 + (npc.basePower * 0.02);

  const handlePlayerAttack = () => {
    const baseDamage = (gameState.character.power || 10) + Math.random() * 8;
    const damage = baseDamage * playerDamageMultiplier;
    const newLog = [...battle.battleLog];
    newLog.push(`You attack for ${Math.floor(damage)} damage!`);

    const newNpcHealth = Math.max(0, battle.npcHealth - damage);

    if (newNpcHealth <= 0) {
      newLog.push(`${npc.name} is defeated!`);
      onBattleEnd(true, -30, {
        power: Math.floor((npc.basePower / 20) * 1.5),
        influence: 8,
        wealth: Math.floor(npc.basePower * 3),
        soulcoins: Math.floor(npc.basePower / 5)
      });
      return;
    }

    // NPC counterattack
    const npcDamage = npc.basePower * 0.6 * npcDamageMultiplier;
    newLog.push(`${npc.name} attacks for ${Math.floor(npcDamage)} damage!`);
    const newPlayerHealth = Math.max(0, battle.playerHealth - npcDamage);

    if (newPlayerHealth <= 0) {
      newLog.push(`You've been defeated!`);
      onBattleEnd(false, -50, {
        power: -5,
        influence: -10,
        health: Math.floor(-battle.playerHealth * 0.5)
      });
      return;
    }

    setBattle({
      playerHealth: newPlayerHealth,
      npcHealth: newNpcHealth,
      turn: battle.turn + 1,
      battleLog: newLog,
      isPlayerTurn: true
    });
  };

  const handleFlee = () => {
    const fleeChance = 0.6 + (gameState.character.control * 0.01);
    if (Math.random() < fleeChance) {
      toast({ title: "Escaped!", description: `You fled from ${npc.name}` });
      onBattleEnd(false, -20, { power: -3, influence: -5 });
    } else {
      const npcDamage = npc.basePower * 0.8;
      const newPlayerHealth = Math.max(0, battle.playerHealth - npcDamage);
      const newLog = [...battle.battleLog];
      newLog.push(`${npc.name} blocks your escape! Takes ${Math.floor(npcDamage)} damage!`);
      
      setBattle({
        playerHealth: newPlayerHealth,
        npcHealth: battle.npcHealth,
        turn: battle.turn + 1,
        battleLog: newLog,
        isPlayerTurn: true
      });
    }
  };

  const healthPercent = (battle.playerHealth / playerBaseHealth) * 100;
  const npcHealthPercent = (battle.npcHealth / npcHealth) * 100;

  return (
    <Card className="border-2 border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">{npc.name} - Confrontation!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Battle Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold">You</p>
            <Progress value={healthPercent} className="mb-1" />
            <p className="text-xs">{Math.floor(battle.playerHealth)} / {playerBaseHealth} HP</p>
          </div>
          <div>
            <p className="text-sm font-semibold">{npc.name}</p>
            <Progress value={npcHealthPercent} className="mb-1" />
            <p className="text-xs">{Math.floor(battle.npcHealth)} / {npcHealth} HP</p>
          </div>
        </div>

        {/* Battle Log */}
        <div className="bg-background/50 border rounded p-3 max-h-48 overflow-y-auto text-xs space-y-1">
          {battle.battleLog.map((log, i) => (
            <p key={i} className="text-secondary-foreground">{log}</p>
          ))}
        </div>

        {/* Turn Number */}
        <Badge variant="outline">Turn {battle.turn}</Badge>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handlePlayerAttack}
            className="flex-1"
            data-testid={`button-npc-attack-${npcId}`}
          >
            <Zap className="w-4 h-4 mr-2" />
            Attack
          </Button>
          <Button
            onClick={handleFlee}
            variant="outline"
            className="flex-1"
            data-testid={`button-npc-flee-${npcId}`}
          >
            <Shield className="w-4 h-4 mr-2" />
            Flee
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
