import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Compass } from "lucide-react";
import districts from "@/data/districts.json";
import type { GameState } from "@/lib/game-state";

interface LocationPanelProps {
  gameState: GameState;
  onUpdateCharacter: (updates: any) => void;
}

export default function LocationPanel({ gameState, onUpdateCharacter }: LocationPanelProps) {
  const [expandedDistrict, setExpandedDistrict] = useState<string | null>(null);

  const currentDistrict = districts.find(d => d.id === gameState.character.currentLocation);

  const handleTravel = (districtId: string) => {
    const newDistrict = districts.find(d => d.id === districtId);
    if (!newDistrict) return;

    // Update character location
    onUpdateCharacter({
      ...gameState.character,
      currentLocation: districtId
    });

    // Could add travel cost/consequences here
  };

  const getDifficultyColor = (rating: number) => {
    if (rating <= 3) return "text-green-500";
    if (rating <= 6) return "text-yellow-500";
    if (rating <= 8) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <Card className="border-2 border-card-border" data-testid="card-location">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Pentagram City
          </CardTitle>
          <CardDescription>
            Currently: {currentDistrict?.name || "Unknown"}
          </CardDescription>
        </div>
        <Compass className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
          {districts.map((district) => (
            <div key={district.id}>
              <Button
                variant={gameState.character.currentLocation === district.id ? "default" : "outline"}
                className="w-full justify-start text-left h-auto p-2"
                onClick={() => setExpandedDistrict(expandedDistrict === district.id ? null : district.id)}
                data-testid={`button-district-${district.id}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{district.name}</div>
                  <div className={`text-xs ${getDifficultyColor(district.difficultyRating)}`}>
                    Difficulty: {district.difficultyRating}/10 • Tribute: {district.tributeValue}
                  </div>
                </div>
              </Button>

              {expandedDistrict === district.id && (
                <div className="mt-2 p-3 bg-card-hover rounded border border-card-border space-y-2" data-testid={`details-${district.id}`}>
                  <p className="text-xs text-muted-foreground">{district.description}</p>
                  <p className="text-xs font-semibold">
                    Ruled by: <span className="text-primary capitalize">{district.currentRuler}</span>
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {district.specialEvents.map((event) => (
                      <Badge key={event} variant="secondary" className="text-xs">
                        {event}
                      </Badge>
                    ))}
                  </div>
                  {gameState.character.currentLocation !== district.id && (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleTravel(district.id)}
                      data-testid={`button-travel-${district.id}`}
                    >
                      Travel Here
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
