import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Zap, Lock } from "lucide-react";
import powers from "@/data/powers.json";
import type { GameState } from "@/lib/game-state";

interface ShopPanelProps {
  gameState: GameState;
  onPurchasePower: (powerIds: string[]) => void;
}

export default function ShopPanel({ gameState, onPurchasePower }: ShopPanelProps) {
  const { toast } = useToast();
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);

  // Power prices by rarity
  const POWER_PRICES: Record<string, number> = {
    common: 0,
    uncommon: 500,
    rare: 1500,
    epic: 3500,
    legendary: 7500
  };

  const ownedPowerIds = new Set(gameState.character.powers || []);
  
  // Filter available powers - exclude owned, common (already given), and passive powers
  const availablePowers = powers.filter(
    p => !p.isPassive && !ownedPowerIds.has(p.id) && p.rarity !== "common"
  );

  const rarities = ["uncommon", "rare", "epic", "legendary"];
  
  const handlePurchase = (power: any) => {
    const price = POWER_PRICES[power.rarity];
    
    if ((gameState.character.wealth || 0) < price) {
      toast({
        title: "Insufficient Wealth",
        description: `You need ${price} wealth to buy ${power.name}`,
        variant: "destructive"
      });
      return;
    }

    onPurchasePower([power.id]);
    toast({
      title: "Power Acquired!",
      description: `You learned ${power.name}!`
    });
  };

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: "bg-slate-500",
      uncommon: "bg-green-600",
      rare: "bg-blue-600",
      epic: "bg-purple-600",
      legendary: "bg-yellow-600"
    };
    return colors[rarity] || "bg-slate-500";
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <CardTitle>Power Shop</CardTitle>
          </div>
          <div className="text-sm font-semibold text-primary">
            Wealth: {gameState.character.wealth || 0}
          </div>
        </div>
        <CardDescription>
          Common powers are free at start. Purchase higher rarities to strengthen yourself.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden flex flex-col gap-3">
        {/* Rarity Filters */}
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant={selectedRarity === null ? "default" : "outline"}
            onClick={() => setSelectedRarity(null)}
          >
            All Powers
          </Button>
          {rarities.map(r => (
            <Button
              key={r}
              size="sm"
              variant={selectedRarity === r ? "default" : "outline"}
              onClick={() => setSelectedRarity(r)}
              className={selectedRarity === r ? getRarityColor(r) : ""}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </Button>
          ))}
        </div>

        {/* Power List */}
        <ScrollArea className="flex-1">
          <div className="space-y-2 pr-4">
            {availablePowers
              .filter(p => !selectedRarity || p.rarity === selectedRarity)
              .map(power => {
                const price = POWER_PRICES[power.rarity];
                const canAfford = (gameState.character.wealth || 0) >= price;
                
                return (
                  <div
                    key={power.id}
                    className="p-3 bg-card-light border border-card-border rounded-md hover-elevate"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm">{power.name}</h3>
                          <Badge variant="outline" className={`text-xs ${getRarityColor(power.rarity)} text-white`}>
                            {power.rarity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {power.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs">
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Power: {power.basePower}
                          </span>
                          <span>Type: {power.type}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Button
                          size="sm"
                          onClick={() => handlePurchase(power)}
                          disabled={!canAfford}
                          variant={canAfford ? "default" : "outline"}
                          className="gap-1"
                          data-testid={`button-buy-${power.id}`}
                        >
                          {price === 0 ? "Free" : `${price}`}
                        </Button>
                        {!canAfford && (
                          <p className="text-xs text-destructive mt-1">
                            Need {price - (gameState.character.wealth || 0)} more
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            
            {availablePowers.filter(p => !selectedRarity || p.rarity === selectedRarity).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Lock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No powers available in this category.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
