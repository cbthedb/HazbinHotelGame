import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Users } from "lucide-react";
import npcsData from "@/data/npcs.json";
import { getRelationshipStatus, getRelationshipColor } from "@/lib/relationshipSystem";
import type { GameState } from "@/lib/game-state";

interface NPCPanelProps {
  relationships: GameState["relationships"];
}

export default function NPCPanel({ relationships }: NPCPanelProps) {
  const npcs = npcsData as Array<{ id: string; name: string; faction: string }>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-primary" />
        <h2 className="font-display text-xl font-bold">Relationships</h2>
      </div>

      {npcs.map((npc) => {
        const rel = relationships[npc.id] || { affinity: 0, isRomanced: false, isRival: false, favorsOwed: 0 };
        const status = getRelationshipStatus(rel.affinity);
        const color = getRelationshipColor(rel.affinity);

        return (
          <Card key={npc.id} className="border-card-border" data-testid={`npc-${npc.id}`}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-base">{npc.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{npc.faction}</p>
                </div>
                {rel.isRomanced && (
                  <Heart className="w-4 h-4 text-pink-500" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Affinity</span>
                  <span className={`font-semibold ${color}`}>
                    {rel.affinity > 0 ? "+" : ""}{rel.affinity}
                  </span>
                </div>
                <Progress 
                  value={Math.max(0, Math.min(100, rel.affinity + 50))} 
                  className="h-1.5" 
                />
              </div>
              <Badge variant={rel.affinity >= 50 ? "secondary" : rel.affinity < -30 ? "destructive" : "outline"} className="text-xs">
                {status}
              </Badge>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
