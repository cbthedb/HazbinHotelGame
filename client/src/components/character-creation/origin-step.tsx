import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import originsData from "@/data/origins.json";
import type { CharacterData } from "@/pages/character-creation";
import type { Origin } from "@shared/schema";

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
  const origins = originsData as Origin[];

  const handleOriginSelect = (origin: Origin) => {
    const cost = getOriginCost(origin.id);
    const newSoulcoins = Math.max(0, (data.soulcoins || 100) - cost);
    onChange({ origin, soulcoins: newSoulcoins });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {origins.map((origin) => (
          <Card
            key={origin.id}
            className={`cursor-pointer transition-all hover-elevate ${
              data.origin?.id === origin.id
                ? "ring-2 ring-primary border-primary"
                : "border-card-border"
            }`}
            onClick={() => handleOriginSelect(origin)}
            data-testid={`button-origin-${origin.id}`}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="font-display text-xl">{origin.name}</CardTitle>
                  <CardDescription className="mt-1">{origin.description}</CardDescription>
                </div>
                <div className="shrink-0 text-right space-y-1">
                  <Badge variant="secondary">{origin.traitPoints} TP</Badge>
                  <Badge variant="outline" className={origin.id === "sinner-weak" ? "bg-green-500/20 border-green-700" : ""}>
                    {origin.id === "sinner-weak" ? "Free" : `${getOriginCost(origin.id)} SC`}
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
