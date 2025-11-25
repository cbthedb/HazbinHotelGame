import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Gem, Zap, Lock } from "lucide-react";
import powersData from "@/data/powers.json";
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
  mythical: 9999 // Not available in character creation
};

export default function ShopStep({ data, onChange }: ShopStepProps) {
  const powers = powersData as Power[];
  const selectedSet = new Set(data.selectedPowers);
  
  // All powers available except mythicals (including passive)
  const availablePowers = (powers as any[])
    .filter(p => p.rarity !== "mythical") // Exclude mythicals from character creation
    .sort((a, b) => {
      const rarityOrder = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };
      const aRarity = rarityOrder[a.rarity as keyof typeof rarityOrder] ?? 6;
      const bRarity = rarityOrder[b.rarity as keyof typeof rarityOrder] ?? 6;
      if (aRarity !== bRarity) return aRarity - bRarity;
      return a.name.localeCompare(b.name);
    });

  const handlePurchase = (power: Power) => {
    const price = SOULCOIN_PRICES[power.rarity];
    
    // Don't allow purchasing mythicals
    if (power.rarity === "mythical") return;
    
    if (data.soulcoins < price) return;
    
    if (selectedSet.has(power.id)) {
      const newPowers = data.selectedPowers.filter(id => id !== power.id);
      onChange({
        selectedPowers: newPowers,
        soulcoins: data.soulcoins + price
      });
    } else {
      // Limit to 5 powers
      if (data.selectedPowers.length >= 5 && !selectedSet.has(power.id)) return;
      
      onChange({
        selectedPowers: [...data.selectedPowers, power.id],
        soulcoins: data.soulcoins - price
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Select Your Powers</CardTitle>
            <CardDescription>Choose which powers to start with using your soulcoins</CardDescription>
          </div>
          <div className="flex items-center gap-2 bg-purple-500/20 px-3 py-2 rounded-md">
            <Gem className="w-5 h-5 text-purple-500" />
            <span className="font-semibold text-purple-300">{data.soulcoins}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-2 pr-4">
            {availablePowers.map(power => {
              const price = SOULCOIN_PRICES[power.rarity];
              const isSelected = selectedSet.has(power.id);
              const canAfford = data.soulcoins >= price;
              
              return (
                <div
                  key={power.id}
                  className={`p-3 border rounded-md cursor-pointer transition-all ${
                    isSelected ? "bg-primary/20 border-primary ring-1 ring-primary" : "bg-card border-card-border hover-elevate"
                  }`}
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
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handlePurchase(power)}
                      disabled={!canAfford || (data.selectedPowers.length >= 5 && !isSelected)}
                      variant={isSelected ? "default" : canAfford ? "outline" : "ghost"}
                      className="whitespace-nowrap"
                    >
                      {price === 0 ? (
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
        <div className="mt-4 p-3 bg-muted rounded-md">
          <p className="text-sm">
            <span className="font-semibold">Selected Powers:</span> {data.selectedPowers.length}/5
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Common powers are free. Max 5 powers in character creation. Mythical powers are earned in-game!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
