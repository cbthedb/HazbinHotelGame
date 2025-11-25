import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowUp, Heart, Zap, Users, Sparkles, Shield, ChevronDown, ChevronUp } from "lucide-react";
import type { GameState } from "@/lib/game-state";

interface ProgressionPanelProps {
  gameState: GameState;
}

export default function ProgressionPanel({ gameState }: ProgressionPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { character } = gameState;
  const power = character.power || 0;
  const empathy = character.empathy || 0;
  const corruption = character.corruption || 0;

  // Progression milestones
  const progressionPaths = [
    {
      title: "Power Progression",
      description: "Become stronger through combat and challenges",
      current: power,
      max: 100,
      icon: Zap,
      color: "text-red-500",
      milestones: [
        { level: 75, reward: "Access Rival Duels", current: power >= 75 },
        { level: 250, reward: "Challenge Weak Overlords", current: power >= 250 },
        { level: 400, reward: "Challenge Strong Overlords", current: power >= 400 },
        { level: 750, reward: "Become an Overlord", current: power >= 750 },
      ],
      tips: [
        "✦ Win battles against rivals and overlords",
        "✦ Complete combat-focused activities",
        "✦ Use power-increasing actions in events",
      ],
    },
    {
      title: "Redemption Path",
      description: "Increase empathy and decrease corruption",
      current: empathy,
      max: 100,
      icon: Heart,
      color: "text-pink-500",
      milestones: [
        { level: 80, reward: "Unlock Romance Options", current: empathy >= 80 },
        { level: 150, reward: "Form Genuine Bonds", current: empathy >= 150 },
        { level: 200, reward: "Inspire Redemption", current: empathy >= 200 },
        { level: 280, reward: "True Transformation", current: empathy >= 280 },
      ],
      tips: [
        "✦ Help others in events",
        "✦ Choose compassionate dialogue options",
        "✦ Build relationships with NPCs",
        "✦ Avoid sadistic/dark choices",
      ],
    },
    {
      title: "Dark Ascension",
      description: "Embrace corruption and control",
      current: corruption,
      max: 100,
      icon: Sparkles,
      color: "text-purple-900",
      milestones: [
        { level: 100, reward: "Unlock Dark Powers", current: corruption >= 100 },
        { level: 200, reward: "Become Feared", current: corruption >= 200 },
        { level: 300, reward: "Command Respect Through Fear", current: corruption >= 300 },
        { level: 400, reward: "Ultimate Corruption", current: corruption >= 400 },
      ],
      tips: [
        "✦ Make corrupt choices in events",
        "✦ Manipulate NPCs",
        "✦ Use dark powers in combat",
        "✦ Choose self-interested options",
      ],
    },
  ];

  if (!isExpanded) {
    return (
      <Card>
        <Button
          onClick={() => setIsExpanded(true)}
          variant="outline"
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <ArrowUp className="w-4 h-4" />
            Progression Paths
          </div>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-2 border-card-border" data-testid="card-progression">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ArrowUp className="w-5 h-5 text-primary" />
              Progression & Strength
            </CardTitle>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsExpanded(false)}
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription className="mt-2">
            Multiple paths to power - choose your fate wisely
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {progressionPaths.map((path) => {
            const Icon = path.icon;
            const percentage = (path.current / path.max) * 100;
            const completedMilestones = path.milestones.filter(m => m.current).length;

            return (
              <div key={path.title} className="space-y-3 pb-4 border-b border-card-border last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${path.color}`} />
                    <div>
                      <div className="font-semibold">{path.title}</div>
                      <div className="text-xs text-muted-foreground">{path.description}</div>
                    </div>
                  </div>
                  <Badge variant="outline">{completedMilestones}/{path.milestones.length}</Badge>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Current Level</span>
                    <span className="font-semibold">{Math.floor(path.current)}/{path.max}</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>

                {/* Milestones */}
                <div className="space-y-2">
                  {path.milestones.map((milestone) => (
                    <div
                      key={milestone.level}
                      className={`p-2 rounded text-xs flex items-center justify-between ${
                        milestone.current
                          ? "bg-green-950/30 border border-green-700"
                          : "bg-muted/30 border border-card-border"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={milestone.current ? "text-green-400" : "text-muted-foreground"}>
                          {milestone.current ? "✓" : "○"}
                        </span>
                        <span>{milestone.reward}</span>
                      </span>
                      <span className="text-muted-foreground">Lvl {milestone.level}</span>
                    </div>
                  ))}
                </div>

                {/* Tips */}
                <div className="bg-primary/5 rounded p-2 space-y-1">
                  <div className="text-xs font-semibold text-primary">How to Increase:</div>
                  {path.tips.map((tip, i) => (
                    <div key={i} className="text-xs text-muted-foreground">
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Balance Summary */}
          <div className="mt-4 p-3 bg-muted/40 rounded-lg border border-card-border">
            <div className="text-sm font-semibold mb-2">Your Path</div>
            <div className="space-y-1 text-xs text-muted-foreground">
              {power >= 80 ? (
                <div className="text-amber-100">⚡ You are ready for Overlord battles</div>
              ) : (
                <div>⚡ Power: {80 - power} levels until Overlord ready</div>
              )}
              {empathy > corruption ? (
                <div className="text-pink-300">💖 You walk the path of Redemption</div>
              ) : corruption > empathy ? (
                <div className="text-purple-300">🌑 You embrace Darkness</div>
              ) : (
                <div className="text-gray-400">⚖️ You balance both light and darkness</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
