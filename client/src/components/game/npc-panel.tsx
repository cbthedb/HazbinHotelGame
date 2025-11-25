import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Users } from "lucide-react";
import npcsData from "@/data/npcs.json";
import type { GameState } from "@/lib/game-state";

interface NPCPanelProps {
  relationships: GameState["relationships"];
}

export default function NPCPanel({ relationships }: NPCPanelProps) {
  const npcs = npcsData as Array<{ id: string; name: string; faction: string }>;

  const getAffinityColor = (affinity: number) => {
    if (affinity >= 50) return "text-green-500";
    if (affinity >= 25) return "text-blue-500";
    if (affinity >= 0) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-primary" />
        <h2 className="font-display text-xl font-bold">Relationships</h2>
      </div>

      {npcs.map((npc) => {
        const affinity = relationships[npc.id]?.affinity || 0;
        const isRomanced = relationships[npc.id]?.isRomanced || false;

        return (
          <Card key={npc.id} className="border-card-border" data-testid={`npc-${npc.id}`}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-base">{npc.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{npc.faction}</p>
                </div>
                {isRomanced && (
                  <Heart className="w-4 h-4 text-pink-500" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Affinity</span>
                  <span className={`font-semibold ${getAffinityColor(affinity)}`}>
                    {affinity > 0 ? "+" : ""}{affinity}
                  </span>
                </div>
                <Progress 
                  value={Math.max(0, Math.min(100, affinity + 50))} 
                  className="h-1.5" 
                />
              </div>
              {affinity >= 50 && (
                <Badge variant="secondary" className="text-xs">
                  Close Friend
                </Badge>
              )}
              {affinity < 0 && (
                <Badge variant="destructive" className="text-xs">
                  Hostile
                </Badge>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
