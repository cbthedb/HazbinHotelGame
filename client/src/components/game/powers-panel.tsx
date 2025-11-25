import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getPowerTypeColor } from "@/lib/gameHelpers";
import { Zap, Shield, Lock } from "lucide-react";
import powersData from "@/data/powers.json";
import { getPowerProgress } from "@/lib/powerSystem";
import type { GameState } from "@/lib/game-state";

interface PowersPanelProps {
  gameState: GameState;
}

export default function PowersPanel({ gameState }: PowersPanelProps) {
  const powers = powersData as any[];
  
  // Get equipped powers from character
  const equippedPowerIds = gameState.character.powers || [];
  const equippedPowers = equippedPowerIds
    .map(id => powers.find(p => p.id === id))
    .filter(Boolean)
    .map((power: any) => ({
      ...power,
      cooldown: 0, // TODO: track cooldowns in game state
      level: 1 // TODO: track power levels in game state
    }))
    .slice(0, 5);

  return (
    <Card className="border-2 border-card-border" data-testid="card-powers">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-display">Powers</CardTitle>
          <Badge variant="outline">{equippedPowers.length} / 5</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {equippedPowers.length === 0 ? (
          <p className="text-xs text-muted-foreground p-3 text-center">No powers equipped</p>
        ) : (
          equippedPowers.map((power: any) => {
            const isPassive = power.isPassive || false;
            const cooldown = power.cooldown || 0;
            const maxCooldown = power.baseCooldown || 3;
            
            return (
              <div
                key={power.id}
                className={`p-3 rounded-md border space-y-1 ${
                  isPassive
                    ? "bg-muted/50 border-muted"
                    : cooldown > 0
                    ? "bg-muted/30 border-muted opacity-60"
                    : "bg-card hover-elevate border-card-border"
                }`}
                data-testid={`power-${power.id}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {isPassive ? (
                        <Shield className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Zap className="w-4 h-4 text-amber-500" />
                      )}
                      <span className="font-semibold text-sm">{power.name}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getPowerTypeColor(power.type)}`}
                    >
                      {power.type.replace("-", " ")}
                    </Badge>
                  </div>
                  <div className="text-right">
                    {!isPassive && (
                      cooldown > 0 ? (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Lock className="w-3 h-3" />
                          <span>{cooldown}t</span>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-green-500">Ready</span>
                      )
                    )}
                  </div>
                </div>
                {!isPassive && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>Control: {power.controlCost}</span>
                    <span>•</span>
                    <span>CD: {maxCooldown}t</span>
                  </div>
                )}
              </div>
            );
          })
        )}

        <Button 
          variant="outline" 
          className="w-full mt-2" 
          data-testid="button-manage-powers"
          onClick={() => {
            alert(`Equipped Powers (${equippedPowers.length}/5):\n\n${equippedPowers.map(p => `• ${p.name} (${p.type})`).join('\n')}\n\nTo change powers, create a new character or unlock new abilities by gaining power!`);
          }}
        >
          Manage Powers
        </Button>
      </CardContent>
    </Card>
  );
}
