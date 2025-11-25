import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPowerTypeColor } from "@/lib/gameHelpers";
import { Zap, Shield, Lock } from "lucide-react";

export default function PowersPanel() {
  // Mock powers - will be replaced with actual game state
  const equippedPowers = [
    { id: "hellfire-lash", name: "Hellfire Lash", type: "hellfire", cooldown: 0, maxCooldown: 3, isPassive: false },
    { id: "shadow-step", name: "Shadow Step", type: "teleportation", cooldown: 1, maxCooldown: 5, isPassive: false },
    { id: "dark-resilience", name: "Dark Resilience", type: "regeneration", isPassive: true },
  ];

  return (
    <Card className="border-2 border-card-border" data-testid="card-powers">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-display">Powers</CardTitle>
          <Badge variant="outline">{equippedPowers.length} / 5</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {equippedPowers.map((power) => (
          <div
            key={power.id}
            className={`p-3 rounded-md border ${
              power.isPassive
                ? "bg-muted/50 border-muted"
                : power.cooldown > 0
                ? "bg-muted/30 border-muted opacity-60"
                : "bg-card hover-elevate border-card-border"
            }`}
            data-testid={`power-${power.id}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {power.isPassive ? (
                    <Shield className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Zap className="w-4 h-4 text-amber-500" />
                  )}
                  <span className="font-semibold text-sm">{power.name}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs bg-gradient-to-r ${getPowerTypeColor(power.type)}`}
                >
                  {power.type.replace("-", " ")}
                </Badge>
              </div>
              <div className="text-right">
                {!power.isPassive && (
                  power.cooldown > 0 ? (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Lock className="w-3 h-3" />
                      <span>{power.cooldown}t</span>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Use
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full mt-2" data-testid="button-manage-powers">
          Manage Powers
        </Button>
      </CardContent>
    </Card>
  );
}
