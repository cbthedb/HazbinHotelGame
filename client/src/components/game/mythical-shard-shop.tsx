import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Gem, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import powersData from "@/data/powers.json";
import type { GameState } from "@/lib/game-state";

interface MythicalShardShopProps {
  gameState: GameState;
  onPurchaseMythical: (powerId: string, shardsSpent: number) => void;
}

export default function MythicalShardShop({ gameState, onPurchaseMythical }: MythicalShardShopProps) {
  const { toast } = useToast();
  const powers = powersData as any[];
  const ownedPowerIds = new Set(gameState.character.powers || []);
  
  // Get mythical powers not owned
  const mythicalPowers = powers
    .filter(p => p.rarity === "mythical" && !ownedPowerIds.has(p.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  const MYTHICAL_SHARD_COST = 3; // Cost in shards per mythical power

  const handlePurchase = (power: any) => {
    const shardsNeeded = MYTHICAL_SHARD_COST;
    if ((gameState.character.mythicalShards || 0) < shardsNeeded) {
      toast({
        title: "Insufficient Shards",
        description: `You need ${shardsNeeded} mythical shards (have ${gameState.character.mythicalShards || 0})`,
        variant: "destructive"
      });
      return;
    }

    onPurchaseMythical(power.id, shardsNeeded);
    toast({
      title: "Mythical Power Acquired!",
      description: `${power.name}! (-${shardsNeeded} shards)`
    });
  };

  if (mythicalPowers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gem className="w-5 h-5 text-amber-500" />
            Mythical Shard Shop
          </CardTitle>
          <CardDescription>Trade mythical shards for legendary powers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p>All mythical powers have been acquired!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <div>
              <CardTitle>Mythical Shard Shop</CardTitle>
              <CardDescription>Exchange shards for exclusive powers</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-amber-500/20 px-3 py-2 rounded-md">
            <Gem className="w-5 h-5 text-amber-500" />
            <span className="font-semibold text-amber-300">{gameState.character.mythicalShards || 0}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-2 pr-4">
            {mythicalPowers.map(power => {
              const canAfford = (gameState.character.mythicalShards || 0) >= MYTHICAL_SHARD_COST;
              
              return (
                <div
                  key={power.id}
                  className="p-3 border rounded-md bg-card border-card-border hover-elevate"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm">{power.name}</h3>
                        <Badge className="bg-red-700 text-white text-xs">Mythical</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {power.description}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handlePurchase(power)}
                      disabled={!canAfford}
                      variant={canAfford ? "default" : "outline"}
                      className="whitespace-nowrap"
                    >
                      {MYTHICAL_SHARD_COST}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <div className="mt-4 p-3 bg-muted rounded-md">
          <p className="text-xs text-muted-foreground">
            Each mythical power costs {MYTHICAL_SHARD_COST} mythical shards. Earn shards by defeating overlords!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
