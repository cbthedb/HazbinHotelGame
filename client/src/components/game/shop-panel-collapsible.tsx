import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  ShoppingCart, Zap, Lock, Flame, Droplet, Moon, Eye, Skull, AlertCircle,
  Sparkles, Users, Volume2, Handshake, Star, Wand2, Heart, Infinity, Lightbulb,
  ChevronDown, ChevronUp
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);

  const POWER_PRICES: Record<string, number> = {
    common: 800,
    uncommon: 5000,
    rare: 12000,
    epic: 25000,
    legendary: 50000,
    mythical: 99999 // Not available in shop
  };

  const ownedPowerIds = new Set(gameState.character.powers || []);
  
  const availablePowers = (powers as any[]).filter(
    p => !ownedPowerIds.has(p.id) && p.rarity !== "mythical" // Exclude mythicals from shop
  ).sort((a, b) => {
    const rarityOrder = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };
    const aRarity = rarityOrder[a.rarity as keyof typeof rarityOrder] ?? 6;
    const bRarity = rarityOrder[b.rarity as keyof typeof rarityOrder] ?? 6;
    if (aRarity !== bRarity) return aRarity - bRarity;
    return a.name.localeCompare(b.name);
  });

  const rarities = ["common", "uncommon", "rare", "epic", "legendary"];
  
  const handlePurchase = (power: any) => {
    const price = POWER_PRICES[power.rarity];
    
    if ((gameState.character.wealth || 0) < price) {
      toast({
        title: "Insufficient Wealth",
        description: `You need ${price} wealth to buy ${power.name}.`,
        variant: "destructive"
      });
      return;
    }

    onPurchasePower([power.id], price);
    toast({
      title: "Power Acquired!",
      description: `${power.name}! (-${price} wealth)`
    });
  };

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: "bg-slate-500",
      uncommon: "bg-green-600",
      rare: "bg-blue-600",
      epic: "bg-purple-600",
      legendary: "bg-yellow-600",
      mythical: "bg-red-700"
    };
    return colors[rarity] || "bg-slate-500";
  };

  const getRarityTextColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: "text-slate-400",
      uncommon: "text-green-400",
      rare: "text-blue-400",
      epic: "text-purple-400",
      legendary: "text-yellow-400",
      mythical: "text-red-400"
    };
    return colors[rarity] || "text-slate-400";
  };

  const filteredPowers = availablePowers.filter(
    p => !selectedRarity || p.rarity === selectedRarity
  );

  if (!isExpanded) {
    return (
      <Card>
        <Button
          onClick={() => setIsExpanded(true)}
          variant="outline"
          className="w-full justify-between"
          data-testid="button-open-shop"
        >
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Power Shop ({availablePowers.length})
          </div>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <CardTitle>Power Shop</CardTitle>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsExpanded(false)}
            data-testid="button-close-shop"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <CardDescription>Common powers are free. Higher rarities cost more.</CardDescription>
          <div className="text-sm font-semibold text-primary">
            Wealth: {gameState.character.wealth || 0}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden flex flex-col gap-3">
        {/* Rarity Filters */}
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant={selectedRarity === null ? "default" : "outline"}
            onClick={() => setSelectedRarity(null)}
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
              >
                {r} ({count})
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
                    className="p-2 bg-card border border-card-border rounded-md hover-elevate"
                  >
                    <div className="flex items-start justify-between gap-2">
                      {icon}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm">{power.name}</h3>
                          <Badge className={`text-xs ${getRarityColor(power.rarity)} text-white`}>
                            {power.rarity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
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
                        {`${price}`}
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <Lock className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-xs">All owned!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
