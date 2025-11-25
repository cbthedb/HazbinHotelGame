import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import districtsData from "@/data/districts.json";
import type { GameState } from "@/lib/game-state";

interface MapPanelProps {
  territories: GameState["territory"];
}

export default function MapPanel({ territories }: MapPanelProps) {
  const districts = districtsData as Array<{ id: string; name: string; dangerLevel: number }>;

  return (
    <Card className="border-2 border-card-border" data-testid="card-map">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Pentagram City
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {districts.map((district) => {
            const isControlled = territories[district.id]?.owned || false;
            
            return (
              <div
                key={district.id}
                className={`p-3 rounded-md border transition-all hover-elevate cursor-pointer ${
                  isControlled
                    ? "bg-primary/10 border-primary"
                    : "bg-card border-card-border"
                }`}
                data-testid={`district-${district.id}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-semibold text-sm">{district.name}</span>
                  {isControlled && (
                    <Badge variant="default" className="text-xs">Your Territory</Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Danger:</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < district.dangerLevel ? "bg-red-500" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
