import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Sword, Users, Trophy } from "lucide-react";
import districts from "@/data/districts.json";
import { generateActivityOutcome } from "@/lib/smart-ai";
import { useToast } from "@/hooks/use-toast";
import type { GameState } from "@/lib/game-state";

interface ActivitiesPanelProps {
  gameState: GameState;
  onUpdateCharacter: (updates: any) => void;
  onEventGenerated: (event: any) => void;
  onBattleStart?: (opponent: string, district: string) => void;
}

interface Activity {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  minPower?: number;
  minControl?: number;
  action: string;
  riskLevel: "low" | "medium" | "high" | "extreme";
  cooldown?: number; // Cooldown in turns (0 or undefined = no cooldown)
}

export default function ActivitiesPanel({ gameState, onUpdateCharacter, onEventGenerated, onBattleStart }: ActivitiesPanelProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const currentDistrict = districts.find(d => d.id === gameState.character.currentLocation);
  const districtRuler = currentDistrict?.currentRuler || "unknown";
  
  const handleBattleActivity = (activityId: string) => {
    if (!currentDistrict) return;
    if (activityId === "challenge-overlord") {
      onBattleStart?.(districtRuler, currentDistrict.id);
    } else if (activityId === "duel-rival") {
      onBattleStart?.("rival-demon", currentDistrict.id);
    }
  };

  const activities: Activity[] = [
    {
      id: "challenge-overlord",
      name: "Challenge the Overlord",
      description: `Face off against ${districtRuler}. You need ~250+ power to realistically win.`,
      icon: <Trophy className="w-5 h-5" />,
      minPower: 200,
      action: "challenge-overlord",
      riskLevel: "extreme",
      cooldown: 0 // No cooldown for overlord challenges
    },
    {
      id: "duel-rival",
      name: "Duel a Rival Demon",
      description: "Face off against a local power. Winner takes respect and wealth.",
      icon: <Sword className="w-5 h-5" />,
      minPower: 10,
      minControl: 8,
      action: "duel-rival",
      riskLevel: "high",
      cooldown: 5
    },
    {
      id: "seize-territory",
      name: "Seize Territory",
      description: "Attempt to claim control of this district through force and cunning.",
      icon: <Zap className="w-5 h-5" />,
      minPower: 15,
      minControl: 12,
      action: "seize-territory",
      riskLevel: "extreme",
      cooldown: 8
    },
    {
      id: "gather-allies",
      name: "Gather Allies",
      description: "Recruit powerful demons to your cause through negotiation or bribery.",
      icon: <Users className="w-5 h-5" />,
      minControl: 10,
      action: "gather-allies",
      riskLevel: "medium",
      cooldown: 4
    },
    {
      id: "undercover-plot",
      name: "Undercover Plot",
      description: "Execute a covert plan to gain influence over this territory.",
      icon: <Zap className="w-5 h-5" />,
      minControl: 15,
      action: "undercover-plot",
      riskLevel: "high",
      cooldown: 6
    },
    {
      id: "corrupt-locals",
      name: "Corrupt the Locals",
      description: "Turn the populace against their ruler through darkness and promises.",
      icon: <Zap className="w-5 h-5" />,
      minPower: 12,
      action: "corrupt-locals",
      riskLevel: "high",
      cooldown: 5
    }
  ];

  const isActivityOnCooldown = (activityId: string): boolean => {
    const cooldowns = gameState.actionCooldowns || {};
    const availableTurn = cooldowns[activityId];
    return availableTurn ? availableTurn > gameState.turn : false;
  };

  const canPerformActivity = (activity: Activity): boolean => {
    if (activity.minPower && gameState.character.power < activity.minPower) return false;
    if (activity.minControl && gameState.character.control < activity.minControl) return false;
    if (isActivityOnCooldown(activity.id)) return false;
    return true;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-green-500";
      case "medium": return "text-yellow-500";
      case "high": return "text-orange-500";
      case "extreme": return "text-red-500";
      default: return "text-muted-foreground";
    }
  };

  const handleActivity = async (activity: Activity) => {
    // Check cooldown first
    if (isActivityOnCooldown(activity.id)) {
      const cooldowns = gameState.actionCooldowns || {};
      const availableTurn = cooldowns[activity.id] || gameState.turn;
      toast({
        title: "On Cooldown",
        description: `Available at turn ${availableTurn}`,
        variant: "destructive"
      });
      return;
    }

    if (!canPerformActivity(activity)) {
      toast({
        title: "Not Ready",
        description: `You need higher stats to attempt this. Check requirements.`,
        variant: "destructive"
      });
      return;
    }

    // Battle activities trigger battle system
    if (activity.id === "challenge-overlord" || activity.id === "duel-rival") {
      handleBattleActivity(activity.id);
      return;
    }

    setIsGenerating(true);
    const outcome = await generateActivityOutcome(activity, gameState, currentDistrict);

    if (outcome) {
      onEventGenerated(outcome);
      // Apply stat changes immediately
      const updated = { ...gameState.character };
      Object.entries(outcome.statChanges || {}).forEach(([stat, rawValue]: [string, unknown]) => {
        const value = rawValue as number;
        const currentValue = updated[stat as keyof typeof updated];
        if (typeof currentValue === "number") {
          // Cap health at 100, other stats grow infinitely
          const newValue = currentValue + value;
          if (stat === "health") {
            (updated[stat as keyof typeof updated] as any) = Math.max(0, Math.min(100, newValue));
          } else {
            (updated[stat as keyof typeof updated] as any) = Math.max(0, newValue);
          }
        }
      });

      // Set cooldown if activity has one
      const cooldowns = gameState.actionCooldowns || {};
      if (activity.cooldown && activity.cooldown > 0) {
        cooldowns[activity.id] = gameState.turn + activity.cooldown;
      }

      onUpdateCharacter({ ...updated, actionCooldowns: cooldowns });

      toast({
        title: activity.name,
        description: "Activity completed! Check the event panel for results.",
        duration: 4000
      });
    } else {
      toast({
        title: "Failed",
        description: "Could not generate activity outcome.",
        variant: "destructive"
      });
    }

    setIsGenerating(false);
  };

  return (
    <Card className="border-2 border-card-border" data-testid="card-activities">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          District Activities
        </CardTitle>
        <CardDescription>
          Available actions in {currentDistrict?.name || "your current location"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {activities.map((activity) => {
          const canPerform = canPerformActivity(activity);
          const isOnCooldown = isActivityOnCooldown(activity.id);
          const cooldowns = gameState.actionCooldowns || {};
          const availableTurn = cooldowns[activity.id];

          return (
            <div
              key={activity.id}
              className={`p-3 rounded border border-card-border hover-elevate transition-all ${
                !canPerform ? "opacity-50" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2 flex-1">
                  <div className="text-primary mt-1">{activity.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{activity.name}</div>
                    <div className="text-xs text-muted-foreground mb-1">
                      {activity.description}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {activity.minPower && (
                        <Badge variant="outline" className="text-xs">
                          Power: {activity.minPower}+ (yours: {gameState.character.power})
                        </Badge>
                      )}
                      {activity.minControl && (
                        <Badge variant="outline" className="text-xs">
                          Control: {activity.minControl}+ (yours: {gameState.character.control})
                        </Badge>
                      )}
                      <Badge variant="secondary" className={`text-xs ${getRiskColor(activity.riskLevel)}`}>
                        Risk: {activity.riskLevel.toUpperCase()}
                      </Badge>
                      {isOnCooldown && (
                        <Badge variant="destructive" className="text-xs">
                          Cooldown: {availableTurn} turns
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                className="w-full"
                onClick={() => handleActivity(activity)}
                disabled={!canPerform || isGenerating}
                data-testid={`button-activity-${activity.id}`}
              >
                {isOnCooldown ? `Cooldown (${availableTurn} turns)` : isGenerating ? "Processing..." : "Initiate"}
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
