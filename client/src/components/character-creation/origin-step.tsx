import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import originsData from "@/data/origins.json";
import type { CharacterData } from "@/pages/character-creation";
import type { Origin } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface OriginStepProps {
  data: CharacterData;
  onChange: (data: Partial<CharacterData>) => void;
}

const ORIGIN_COSTS: Record<string, number> = {
  "sinner-weak": 0,
  "hellborn": 50,
  "deal-immigrant": 75,
  "royal-born": 150,
  "accidental": 250 // Fallen Angel - most expensive
};

function getOriginCost(originId: string): number {
  return ORIGIN_COSTS[originId] || 0;
}

export default function OriginStep({ data, onChange }: OriginStepProps) {
  const { toast } = useToast();
  const origins = originsData as Origin[];
  const ownedSet = new Set(data.ownedOrigins);

  const handleBuyOrigin = (origin: Origin) => {
    const cost = getOriginCost(origin.id);
    
    if (ownedSet.has(origin.id)) {
      // Already owned, can't buy again
      return;
    }
    
    // Check if can afford
    if (data.soulcoins < cost) {
      toast({
        title: "Not Enough Soulcoins",
        description: `You need ${cost} soulcoins but only have ${data.soulcoins}`,
        variant: "destructive"
      });
      return;
    }
    
    // Buy the origin
    onChange({
      ownedOrigins: [...data.ownedOrigins, origin.id],
      soulcoins: data.soulcoins - cost,
      origin: origin // Auto-select when bought
    });

    toast({
      title: "Origin Purchased",
      description: `You now have access to ${origin.name}`
    });
  };

  const handleSelectOrigin = (origin: Origin) => {
    if (ownedSet.has(origin.id)) {
      onChange({ origin });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {origins.map((origin) => {
          const isOwned = ownedSet.has(origin.id);
          const cost = getOriginCost(origin.id);
          const canAfford = data.soulcoins >= cost;
          const isSelected = data.origin?.id === origin.id;

          return (
            <Card
              key={origin.id}
              className={`transition-all ${
                isSelected
                  ? "ring-2 ring-primary border-primary bg-primary/5"
                  : isOwned
                  ? "cursor-pointer hover-elevate border-card-border"
                  : "opacity-75 border-card-border"
              }`}
              data-testid={`button-origin-${origin.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="font-display text-xl">{origin.name}</CardTitle>
                      {isOwned && (
                        <Badge variant="secondary" className="text-xs">Owned</Badge>
                      )}
                      {isSelected && (
                        <Badge className="text-xs bg-primary">Selected</Badge>
                      )}
                    </div>
                    <CardDescription className="mt-1">{origin.description}</CardDescription>
                  </div>
                  <div className="shrink-0 text-right space-y-1">
                    <Badge variant="secondary">{origin.traitPoints} TP</Badge>
                    <Badge variant="outline" className={origin.id === "sinner-weak" ? "bg-green-500/20 border-green-700" : ""}>
                      {origin.id === "sinner-weak" ? "Free" : `${cost} SC`}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Power</p>
                      <p className="font-semibold text-red-500">{origin.startingStats.power}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Control</p>
                      <p className="font-semibold text-purple-500">{origin.startingStats.control}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Influence</p>
                      <p className="font-semibold text-amber-500">{origin.startingStats.influence}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Empathy</p>
                      <p className="font-semibold text-pink-500">{origin.startingStats.empathy}</p>
                    </div>
                  </div>
                  {origin.lockedTraits.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Unique Trait:</p>
                      <div className="flex gap-2">
                        {origin.lockedTraits.map((trait) => (
                          <Badge key={trait} variant="outline" className="capitalize">
                            {trait.replace("-", " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {!isOwned ? (
                      <Button
                        onClick={() => handleBuyOrigin(origin)}
                        disabled={!canAfford}
                        variant={canAfford ? "default" : "ghost"}
                        className="flex-1"
                        size="sm"
                      >
                        {cost === 0 ? "Unlock" : `Buy (${cost} SC)`}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleSelectOrigin(origin)}
                        variant={isSelected ? "default" : "outline"}
                        className="flex-1"
                        size="sm"
                      >
                        {isSelected ? "Selected" : "Select"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
