import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Users } from "lucide-react";

export default function NPCPanel() {
  // Mock NPCs - will be replaced with actual game state
  const npcs = [
    { id: "charlie", name: "Charlie Morningstar", faction: "Hazbin Hotel", affinity: 35, romanceable: true },
    { id: "alastor", name: "Alastor", faction: "Overlords", affinity: 5, romanceable: false },
    { id: "vaggie", name: "Vaggie", faction: "Hazbin Hotel", affinity: 20, romanceable: true },
    { id: "vox", name: "Vox", faction: "The Vees", affinity: -10, romanceable: false },
  ];

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

      {npcs.map((npc) => (
        <Card key={npc.id} className="border-card-border" data-testid={`npc-${npc.id}`}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <CardTitle className="text-base">{npc.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{npc.faction}</p>
              </div>
              {npc.romanceable && (
                <Heart className="w-4 h-4 text-pink-500" />
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Affinity</span>
                <span className={`font-semibold ${getAffinityColor(npc.affinity)}`}>
                  {npc.affinity > 0 ? "+" : ""}{npc.affinity}
                </span>
              </div>
              <Progress 
                value={Math.max(0, npc.affinity)} 
                className="h-1.5" 
              />
            </div>
            {npc.affinity >= 50 && (
              <Badge variant="secondary" className="text-xs">
                Close Friend
              </Badge>
            )}
            {npc.affinity < 0 && (
              <Badge variant="destructive" className="text-xs">
                Hostile
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
