import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Gift } from "lucide-react";
import npcsData from "@/data/npcs.json";
import { calculateAffinityChange, applyNpcAffects, getRelationshipStatus } from "@/lib/relationshipSystem";
import { useToast } from "@/hooks/use-toast";
import type { GameState } from "@/lib/game-state";

interface SocialPanelProps {
  gameState: GameState;
  onUpdateGameState: (updates: Partial<GameState>) => void;
}

export default function SocialPanel({ gameState, onUpdateGameState }: SocialPanelProps) {
  const { toast } = useToast();
  const [selectedNpc, setSelectedNpc] = useState<string | null>(null);
  const npcs = npcsData as any[];

  const handleSocialize = (npcId: string) => {
    const npc = npcs.find(n => n.id === npcId);
    if (!npc) return;

    const currentRel = gameState.relationships[npcId];
    const change = calculateAffinityChange(npcId, gameState.character.traits || [], "positive");
    
    const newRelationships = applyNpcAffects(gameState.relationships, { [npcId]: change });
    const newRel = newRelationships[npcId];

    toast({
      title: `Socialized with ${npc.name}`,
      description: `Affinity: ${currentRel?.affinity || 0} → ${newRel.affinity} (${getRelationshipStatus(newRel.affinity)})`,
      duration: 3000
    });

    onUpdateGameState({
      relationships: newRelationships,
      character: {
        ...gameState.character,
        influence: Math.max(0, (gameState.character.influence || 0) + 1)
      }
    });
  };

  const handleGiftGiving = (npcId: string) => {
    const npc = npcs.find(n => n.id === npcId);
    if (!npc) return;

    if ((gameState.character.wealth || 0) < 50) {
      toast({ title: "Not Enough Wealth", description: "Need 50 wealth to give gifts", variant: "destructive" });
      return;
    }

    const currentRel = gameState.relationships[npcId];
    const change = calculateAffinityChange(npcId, gameState.character.traits || [], "positive") + 3;
    
    const newRelationships = applyNpcAffects(gameState.relationships, { [npcId]: change });
    const newRel = newRelationships[npcId];

    toast({
      title: `Gave Gift to ${npc.name}`,
      description: `Affinity: ${currentRel?.affinity || 0} → ${newRel.affinity} (${getRelationshipStatus(newRel.affinity)})`,
      duration: 3000
    });

    onUpdateGameState({
      relationships: newRelationships,
      character: {
        ...gameState.character,
        wealth: Math.max(0, (gameState.character.wealth || 0) - 50)
      }
    });
  };

  const handleRomance = (npcId: string) => {
    const npc = npcs.find(n => n.id === npcId);
    if (!npc || !npc.romanceable) {
      toast({ title: "Cannot Romance", description: `${npc?.name} is not interested in romance.`, variant: "destructive" });
      return;
    }

    const currentRel = gameState.relationships[npcId];
    if ((currentRel?.affinity || 0) < 40) {
      toast({ title: "Not Ready", description: `Need 40+ affinity for romance. Current: ${currentRel?.affinity || 0}`, variant: "destructive" });
      return;
    }

    const change = calculateAffinityChange(npcId, gameState.character.traits || [], "romance");
    const newRelationships = applyNpcAffects(gameState.relationships, { [npcId]: change });
    const newRel = newRelationships[npcId];

    const isNowRomanced = newRel.affinity >= 75;

    toast({
      title: isNowRomanced ? `❤️ Romance with ${npc.name}!` : `${npc.name} is interested...`,
      description: isNowRomanced ? `You're now in a romantic relationship!` : `Affinity: ${currentRel?.affinity || 0} → ${newRel.affinity}`,
      duration: 3000
    });

    onUpdateGameState({
      relationships: { ...newRelationships, [npcId]: { ...newRel, isRomanced: isNowRomanced } },
      character: {
        ...gameState.character,
        empathy: Math.max(0, (gameState.character.empathy || 0) + 3)
      }
    });
  };

  return (
    <Card className="border-2 border-card-border" data-testid="card-social">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          Social Interactions
        </CardTitle>
        <CardDescription>Build relationships and romance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {npcs.map((npc) => {
          const rel = gameState.relationships[npc.id] || { affinity: 0, isRomanced: false, isRival: false, favorsOwed: 0 };
          const status = getRelationshipStatus(rel.affinity);

          return (
            <Card key={npc.id} className="p-3 bg-card-border/50" data-testid={`social-${npc.id}`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{npc.name}</p>
                  <div className="flex gap-1 flex-wrap">
                    <Badge variant="outline" className="text-xs">{status}</Badge>
                    {rel.isRomanced && <Badge className="text-xs bg-pink-600">💕 Romanced</Badge>}
                    <Badge variant="secondary" className="text-xs">Affinity: {rel.affinity > 0 ? "+" : ""}{rel.affinity}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-1 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSocialize(npc.id)}
                  className="text-xs h-8"
                  data-testid={`button-socialize-${npc.id}`}
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Socialize
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleGiftGiving(npc.id)}
                  disabled={(gameState.character.wealth || 0) < 50}
                  className="text-xs h-8"
                  data-testid={`button-gift-${npc.id}`}
                >
                  <Gift className="w-3 h-3 mr-1" />
                  Gift (-50w)
                </Button>
                {npc.romanceable && (
                  <Button
                    size="sm"
                    variant={rel.isRomanced ? "default" : "outline"}
                    onClick={() => handleRomance(npc.id)}
                    disabled={(rel.affinity || 0) < 40}
                    className="text-xs h-8"
                    data-testid={`button-romance-${npc.id}`}
                  >
                    <Heart className="w-3 h-3 mr-1" />
                    {rel.isRomanced ? "Romanced" : "Romance"}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}
