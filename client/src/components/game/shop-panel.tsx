import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  ShoppingCart, Zap, Lock, Flame, Droplet, Moon, Eye, Skull, AlertCircle,
  Sparkles, Users, Volume2, Handshake, Star, Wand2, Heart, Infinity, Lightbulb
} from "lucide-react";
import powers from "@/data/powers.json";
import type { GameState } from "@/lib/game-state";

interface ShopPanelProps {
  gameState: GameState;
  onPurchasePower: (powerIds: string[], wealthSpent: number) => void;
}

const POWER_TYPE_ICONS: Record<string, React.ReactNode> = {
  "hellfire": <Flame className="w-4 h-4 text-red-500" />,
  "blood-magic": <Droplet className="w-4 h-4 text-red-700" />,
  "shadow": <Moon className="w-4 h-4 text-slate-700" />,
  "illusion": <Eye className="w-4 h-4 text-purple-500" />,
  "necromancy": <Skull className="w-4 h-4 text-gray-600" />,
  "teleportation": <AlertCircle className="w-4 h-4 text-blue-500" />,
  "glamour": <Sparkles className="w-4 h-4 text-pink-500" />,
  "summoning": <Users className="w-4 h-4 text-amber-600" />,
  "voice-broadcast": <Volume2 className="w-4 h-4 text-yellow-600" />,
  "deals": <Handshake className="w-4 h-4 text-green-600" />,
  "holy": <Star className="w-4 h-4 text-yellow-300" />,
  "transformation": <Wand2 className="w-4 h-4 text-purple-600" />,
  "bond": <Heart className="w-4 h-4 text-red-500" />,
  "reality": <Infinity className="w-4 h-4 text-cyan-500" />,
  "void": <Lightbulb className="w-4 h-4 text-indigo-700" />,
  "chaos": <Zap className="w-4 h-4 text-orange-600" />,
  "shadow-eldritch": <Moon className="w-4 h-4 text-slate-800" />,
  "contract": <Handshake className="w-4 h-4 text-amber-700" />,
  "seduction": <Sparkles className="w-4 h-4 text-pink-600" />,
};

export default function ShopPanel({ gameState, onPurchasePower }: ShopPanelProps) {
  const { toast } = useToast();
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);

  // Power prices by rarity - Common is FREE
  const POWER_PRICES: Record<string, number> = {
    common: 0,
    uncommon: 500,
    rare: 1500,
    epic: 3500,
    legendary: 7500
  };

  const ownedPowerIds = new Set(gameState.character.powers || []);
  
  // Show ALL powers (including common and passive) - but exclude already owned
  const availablePowers = (powers as any[]).filter(
    p => !ownedPowerIds.has(p.id)
  ).sort((a, b) => {
    // Sort by rarity then name
    const rarityOrder = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };
    const aRarity = rarityOrder[a.rarity as keyof typeof rarityOrder] ?? 5;
    const bRarity = rarityOrder[b.rarity as keyof typeof rarityOrder] ?? 5;
    if (aRarity !== bRarity) return aRarity - bRarity;
    return a.name.localeCompare(b.name);
  });

  const rarities = ["common", "uncommon", "rare", "epic", "legendary"];
  
  const handlePurchase = (power: any) => {
    const price = POWER_PRICES[power.rarity];
    
    if ((gameState.character.wealth || 0) < price) {
      toast({
        title: "Insufficient Wealth",
        description: `You need ${price} wealth to buy ${power.name}. You have ${gameState.character.wealth || 0}.`,
        variant: "destructive"
      });
      return;
    }

    onPurchasePower([power.id], price);
    toast({
      title: "Power Acquired!",
      description: `You learned ${power.name}!${price > 0 ? ` (${price} wealth spent)` : " (Free)"}`
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

  const getRarityTextColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: "text-slate-400",
      uncommon: "text-green-400",
      rare: "text-blue-400",
      epic: "text-purple-400",
      legendary: "text-yellow-400"
    };
    return colors[rarity] || "text-slate-400";
  };

  const filteredPowers = availablePowers.filter(
    p => !selectedRarity || p.rarity === selectedRarity
  );

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
          Common powers are free. Higher rarities cost more wealth.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden flex flex-col gap-3">
        {/* Rarity Filters */}
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant={selectedRarity === null ? "default" : "outline"}
            onClick={() => setSelectedRarity(null)}
            data-testid="filter-all-powers"
          >
            All ({availablePowers.length})
          </Button>
          {rarities.map(r => {
            const count = availablePowers.filter(p => p.rarity === r).length;
            return (
              <Button
                key={r}
                size="sm"
                variant={selectedRarity === r ? "default" : "outline"}
                onClick={() => setSelectedRarity(r)}
                className={selectedRarity === r ? getRarityColor(r) + " text-white" : ""}
                data-testid={`filter-${r}-powers`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)} ({count})
              </Button>
            );
          })}
        </div>

        {/* Power List */}
        <ScrollArea className="flex-1">
          <div className="space-y-2 pr-4">
            {filteredPowers.length > 0 ? (
              filteredPowers.map(power => {
                const price = POWER_PRICES[power.rarity];
                const canAfford = (gameState.character.wealth || 0) >= price;
                const icon = POWER_TYPE_ICONS[power.type] || <Zap className="w-4 h-4" />;
                
                return (
                  <div
                    key={power.id}
                    className="p-3 bg-card border border-card-border rounded-md hover-elevate transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 pt-0.5">
                        {icon}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm">{power.name}</h3>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getRarityColor(power.rarity)} text-white`}
                          >
                            {power.rarity}
                          </Badge>
                          {power.isPassive && (
                            <Badge variant="secondary" className="text-xs">
                              Passive
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {power.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs flex-wrap">
                          {power.basePower > 0 && (
                            <span className="flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              {power.basePower}
                            </span>
                          )}
                          <span className={getRarityTextColor(power.rarity)}>
                            {power.type}
                          </span>
                        </div>
                      </div>

                      {/* Buy Button */}
                      <div className="flex-shrink-0 text-right">
                        <Button
                          size="sm"
                          onClick={() => handlePurchase(power)}
                          disabled={!canAfford && price > 0}
                          variant={canAfford || price === 0 ? "default" : "outline"}
                          className="gap-1 whitespace-nowrap"
                          data-testid={`button-buy-${power.id}`}
                        >
                          {price === 0 ? "Free" : `${price}`}
                        </Button>
                        {!canAfford && price > 0 && (
                          <p className="text-xs text-destructive mt-1">
                            Need {price - (gameState.character.wealth || 0)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Lock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>You own all powers in this category!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
