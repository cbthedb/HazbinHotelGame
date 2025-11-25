import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Gem, Zap, Lock, AlertCircle } from "lucide-react";
import powersData from "@/data/powers.json";
import { getAllSaves } from "@/lib/game-state";
import type { CharacterData } from "@/pages/character-creation";
import type { Power } from "@shared/schema";

interface ShopStepProps {
  data: CharacterData;
  onChange: (data: Partial<CharacterData>) => void;
}

const SOULCOIN_PRICES: Record<string, number> = {
  common: 0,
  uncommon: 25,
  rare: 50,
  epic: 100,
  legendary: 200,
  mythical: 0 // Mythicals need 10 shards instead
};

export default function ShopStep({ data, onChange }: ShopStepProps) {
  const powers = powersData as Power[];
  const selectedSet = new Set(data.selectedPowers);
  const [totalMythicalShards, setTotalMythicalShards] = useState(0);

  // Count total mythical shards across all saves on mount
  useEffect(() => {
    const allSaves = getAllSaves();
    const shards = allSaves.reduce((total, save) => {
      return total + (save.gameState.character.mythicalShards || 0);
    }, 0);
    setTotalMythicalShards(shards);
  }, []);
  
  // All powers available including mythicals
  const availablePowers = (powers as any[])
    .sort((a, b) => {
      const rarityOrder = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4, mythical: 5 };
      const aRarity = rarityOrder[a.rarity as keyof typeof rarityOrder] ?? 6;
      const bRarity = rarityOrder[b.rarity as keyof typeof rarityOrder] ?? 6;
      if (aRarity !== bRarity) return aRarity - bRarity;
      return a.name.localeCompare(b.name);
    });

  const handlePurchase = (power: Power) => {
    const price = SOULCOIN_PRICES[power.rarity];
    const isMythical = power.rarity === "mythical";
    
    if (selectedSet.has(power.id)) {
      // Deselect and refund
      const newPowers = data.selectedPowers.filter(id => id !== power.id);
      const refund = isMythical ? 10 : price; // Refund mythical shards or soulcoins
      onChange({
        selectedPowers: newPowers,
        soulcoins: data.soulcoins + (isMythical ? 0 : refund)
      });
    } else {
      // Try to purchase
      if (isMythical) {
        if (totalMythicalShards < 10) return; // Need 10 shards per mythical
        // Can purchase mythical - spend shards from first save with enough
        // (Note: in real implementation, would need to track shard spending per save)
      } else {
        if (data.soulcoins < price) return; // Need enough soulcoins
      }
      
      // Limit to 5 powers
      if (data.selectedPowers.length >= 5) return;
      
      onChange({
        selectedPowers: [...data.selectedPowers, power.id],
        soulcoins: isMythical ? data.soulcoins : (data.soulcoins - price)
      });
    }
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <CardTitle>Select Your Powers</CardTitle>
            <CardDescription>Choose which powers to start with using your soulcoins</CardDescription>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 bg-purple-500/20 px-3 py-2 rounded-md">
              <Gem className="w-5 h-5 text-purple-500" />
              <span className="font-semibold text-purple-300">{data.soulcoins} SC</span>
            </div>
            <div className="flex items-center gap-2 bg-red-500/20 px-3 py-2 rounded-md">
              <Zap className="w-5 h-5 text-red-500" />
              <span className="font-semibold text-red-300">{totalMythicalShards} MS</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-96">
          <div className="space-y-2 pr-4">
            {availablePowers.map(power => {
              const price = SOULCOIN_PRICES[power.rarity];
              const isSelected = selectedSet.has(power.id);
              const isMythical = power.rarity === "mythical";
              const canAfford = isMythical ? totalMythicalShards >= 10 : data.soulcoins >= price;
              
              return (
                <div
                  key={power.id}
                  className={`p-3 border rounded-md transition-all ${
                    isSelected ? "bg-primary/20 border-primary ring-1 ring-primary" : "bg-card border-card-border hover-elevate"
                  } ${!canAfford ? "opacity-60" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm">{power.name}</h3>
                        <Badge className={`text-xs ${getRarityColor(power.rarity)} text-white`}>
                          {power.rarity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {power.description}
                      </p>
                      {isMythical && totalMythicalShards < 10 && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-amber-400">
                          <AlertCircle className="w-3 h-3" />
                          <span>Need 10 mythical shards ({totalMythicalShards}/10)</span>
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handlePurchase(power)}
                      disabled={!canAfford || (data.selectedPowers.length >= 5 && !isSelected)}
                      variant={isSelected ? "default" : canAfford ? "outline" : "ghost"}
                      className="whitespace-nowrap"
                    >
                      {isMythical ? (
                        isSelected ? "Own (10 MS)" : totalMythicalShards >= 10 ? "Get (10 MS)" : "Locked"
                      ) : price === 0 ? (
                        isSelected ? "Own" : "Free"
                      ) : isSelected ? (
                        `Own (${price})`
                      ) : (
                        `${price}`
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <div className="space-y-2 p-3 bg-muted rounded-md">
          <p className="text-sm">
            <span className="font-semibold">Selected Powers:</span> {data.selectedPowers.length}/5
          </p>
          <p className="text-xs text-muted-foreground">
            • Common powers are FREE  
            • Higher rarities cost soul coins  
            • Mythical powers need 10 shards total across all your saves
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
