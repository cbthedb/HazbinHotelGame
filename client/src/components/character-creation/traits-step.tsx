import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { calculateTraitCost } from "@/lib/gameHelpers";
import traitsData from "@/data/traits.json";
import type { CharacterData } from "@/pages/character-creation";
import type { Trait } from "@shared/schema";

interface TraitsStepProps {
  data: CharacterData;
  onChange: (data: Partial<CharacterData>) => void;
}

export default function TraitsStep({ data, onChange }: TraitsStepProps) {
  const traits = traitsData as Trait[];
  const maxPoints = data.origin?.traitPoints || 10;
  
  const selectedTraitObjects = traits.filter(t => data.selectedTraits.includes(t.id));
  const usedPoints = calculateTraitCost(selectedTraitObjects);
  const remainingPoints = maxPoints - usedPoints;

  const categories = ["moral", "social", "physical", "magical", "quirky"] as const;

  const toggleTrait = (traitId: string) => {
    const trait = traits.find(t => t.id === traitId);
    if (!trait) return;

    if (data.selectedTraits.includes(traitId)) {
      onChange({
        selectedTraits: data.selectedTraits.filter(id => id !== traitId)
      });
    } else {
      const newSelected = traits.filter(t => 
        [...data.selectedTraits, traitId].includes(t.id)
      );
      const newCost = calculateTraitCost(newSelected);
      
      if (newCost <= maxPoints) {
        onChange({
          selectedTraits: [...data.selectedTraits, traitId]
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Points Display */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Trait Points</p>
              <p className="text-2xl font-bold">
                <span className={remainingPoints < 0 ? "text-destructive" : "text-primary"}>
                  {remainingPoints}
                </span>
                <span className="text-base text-muted-foreground"> / {maxPoints}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Selected Traits</p>
              <p className="text-2xl font-bold text-secondary">{data.selectedTraits.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Traits Selection */}
      <Tabs defaultValue="moral" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {categories.map(cat => (
            <TabsTrigger key={cat} value={cat} className="capitalize">
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category} value={category} className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {traits
                  .filter(trait => trait.category === category)
                  .filter(trait => !trait.originLocked || trait.originLocked === data.origin?.id)
                  .map(trait => {
                    const isSelected = data.selectedTraits.includes(trait.id);
                    const canAfford = remainingPoints >= trait.cost || isSelected;
                    
                    return (
                      <Card
                        key={trait.id}
                        className={`cursor-pointer transition-all ${
                          isSelected
                            ? "ring-2 ring-primary border-primary"
                            : canAfford
                            ? "hover-elevate border-card-border"
                            : "opacity-50 cursor-not-allowed"
                        }`}
                        onClick={() => canAfford && toggleTrait(trait.id)}
                        data-testid={`button-trait-${trait.id}`}
                      >
                        <CardHeader className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <CardTitle className="text-base">{trait.name}</CardTitle>
                              <CardDescription className="text-sm mt-1">
                                {trait.description}
                              </CardDescription>
                            </div>
                            <Badge 
                              variant={trait.cost < 0 ? "destructive" : trait.cost === 0 ? "secondary" : "default"}
                              className="shrink-0"
                            >
                              {trait.cost > 0 ? `-${trait.cost}` : trait.cost < 0 ? `+${Math.abs(trait.cost)}` : "Free"}
                            </Badge>
                          </div>
                        </CardHeader>
                      </Card>
                    );
                  })}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>

      {remainingPoints < 0 && (
        <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
          <p className="text-sm text-destructive font-semibold">
            You've exceeded your trait points! Remove some traits to continue.
          </p>
        </div>
      )}
    </div>
  );
}
