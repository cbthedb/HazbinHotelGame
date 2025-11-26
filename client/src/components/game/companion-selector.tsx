import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, X } from "lucide-react";
import npcsData from "@/data/npcs.json";
import type { GameState } from "@/lib/game-state";
import { getRelationshipStatus } from "@/lib/relationshipSystem";

interface CompanionSelectorProps {
  gameState: GameState;
  onSelectCompanion: (npcId: string | null) => void;
  onContinue: () => void;
}

export default function CompanionSelector({
  gameState,
  onSelectCompanion,
  onContinue
}: CompanionSelectorProps) {
  const npcs = npcsData as any[];
  
  // Find NPCs with high affinity (50+)
  const potentialCompanions = npcs.filter(npc => {
    const rel = gameState.relationships[npc.id];
    return rel && rel.affinity >= 50;
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="border-2 border-primary w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Users className="w-6 h-6" />
              Request Battle Companion
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              {potentialCompanions.length} Available
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You can request an ally to join your battle. They have a 50% chance of accepting.
            Only allies with 50+ affinity will join you.
          </p>

          {potentialCompanions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>No allies with sufficient affinity to help you yet.</p>
              <p className="text-xs mt-2">Build relationships to gain companions (50+ affinity required)</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
              {potentialCompanions.map(npc => {
                const rel = gameState.relationships[npc.id];
                const joinChance = 50;
                
                return (
                  <button
                    key={npc.id}
                    onClick={() => onSelectCompanion(npc.id)}
                    className="p-3 rounded border border-primary/50 hover:bg-primary/10 transition-colors text-left"
                    data-testid={`button-select-companion-${npc.id}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="font-semibold text-sm">{npc.name}</div>
                      <Badge variant="secondary" className="text-xs">
                        {joinChance}% chance
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {getRelationshipStatus(rel.affinity)} • {rel.affinity} Affinity
                    </div>
                    <div className="text-xs">
                      <span className="font-semibold">Power:</span> {npc.basePower}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => onSelectCompanion(null)}
              className="flex-1"
              data-testid="button-battle-solo"
            >
              Battle Alone
            </Button>
            <Button
              onClick={onContinue}
              variant="outline"
              className="flex-1"
              data-testid="button-companion-cancel"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
