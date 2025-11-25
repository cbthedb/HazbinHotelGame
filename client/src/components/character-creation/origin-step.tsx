import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import originsData from "@/data/origins.json";
import type { CharacterData } from "@/pages/character-creation";
import type { Origin } from "@shared/schema";

interface OriginStepProps {
  data: CharacterData;
  onChange: (data: Partial<CharacterData>) => void;
}

export default function OriginStep({ data, onChange }: OriginStepProps) {
  const origins = originsData as Origin[];

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
            onClick={() => onChange({ origin })}
            data-testid={`button-origin-${origin.id}`}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="font-display text-xl">{origin.name}</CardTitle>
                  <CardDescription className="mt-1">{origin.description}</CardDescription>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {origin.traitPoints} TP
                </Badge>
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
