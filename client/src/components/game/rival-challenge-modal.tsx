import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Swords, Heart, X } from "lucide-react";
import npcsData from "@/data/npcs.json";
import type { GameState } from "@/lib/game-state";
import { getRelationshipStatus } from "@/lib/relationshipSystem";

interface RivalChallengeModalProps {
  npcId: string;
  gameState: GameState;
  onFight: () => void;
  onMend: () => void;
  onDismiss: () => void;
  onFightWithCompanion?: () => void;
}

export default function RivalChallengeModal({
  npcId,
  gameState,
  onFight,
  onMend,
  onDismiss,
  onFightWithCompanion
}: RivalChallengeModalProps) {
  const npcs = npcsData as any[];
  const npc = npcs.find(n => n.id === npcId);
  const relationship = gameState.relationships[npcId];

  if (!npc || !relationship) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="border-2 border-destructive w-96 max-w-[90vw]">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-destructive text-2xl mb-2">{npc.name} Confronts You!</CardTitle>
              <Badge variant="destructive">
                {getRelationshipStatus(relationship.affinity)} - {relationship.affinity} Affinity
              </Badge>
            </div>
            <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm italic text-secondary-foreground">
            "{npc.name} appears before you, clearly hostile. Your relationship has deteriorated beyond repair."
          </p>

          <div className="space-y-2 text-xs">
            <p>
              <span className="font-semibold">Power:</span> {npc.basePower}
            </p>
            <p>
              <span className="font-semibold">Faction:</span> {npc.faction}
            </p>
          </div>

          <div className="flex gap-2 flex-col">
            <Button
              onClick={onFightWithCompanion ? onFightWithCompanion : onFight}
              variant="destructive"
              className="w-full gap-2"
              data-testid={`button-rival-fight-${npcId}`}
            >
              <Swords className="w-4 h-4" />
              Fight to the End
            </Button>
            
            <Button
              onClick={onMend}
              variant="outline"
              className="w-full gap-2"
              data-testid={`button-rival-mend-${npcId}`}
            >
              <Heart className="w-4 h-4" />
              Try to Mend Relationship
            </Button>

            <Button
              onClick={onDismiss}
              variant="ghost"
              className="w-full"
              data-testid={`button-rival-dismiss-${npcId}`}
            >
              Avoid for Now
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            {relationship.affinity < -75
              ? "This enemy will stop at nothing to see you destroyed."
              : relationship.affinity < -50
              ? "Serious conflict appears imminent."
              : "Tensions are reaching a breaking point."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
