import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getStatBarColor, getRankTitle } from "@/lib/gameHelpers";
import { Crown, Zap, Sparkles, Heart, Skull, Coins, Users } from "lucide-react";

interface StatsPanelProps {
  character: {
    rank: string;
    power: number;
    control: number;
    influence: number;
    corruption: number;
    empathy: number;
    health: number;
    wealth: number;
  };
}

export default function StatsPanel({ character }: StatsPanelProps) {
  const stats = [
    { name: "Power", value: character.power, max: 100, icon: Zap, color: "text-red-500" },
    { name: "Control", value: character.control, max: 100, icon: Sparkles, color: "text-purple-500" },
    { name: "Influence", value: character.influence, max: 100, icon: Crown, color: "text-amber-500" },
    { name: "Corruption", value: character.corruption, max: 100, icon: Skull, color: "text-red-900" },
    { name: "Empathy", value: character.empathy, max: 100, icon: Heart, color: "text-pink-500" },
    { name: "Wealth", value: character.wealth, max: 1000, icon: Coins, color: "text-yellow-500" },
  ];

  return (
    <Card className="border-2 border-card-border" data-testid="card-stats">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-display">Character Stats</CardTitle>
          <Badge variant="secondary" className="capitalize">
            {getRankTitle(character.rank)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="p-3 bg-muted/50 rounded-md">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-4 h-4 text-green-500" />
            <span className="text-sm font-semibold">Health</span>
          </div>
          <Progress value={character.health} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">{character.health} / 100</p>
        </div>

        {stats.map((stat) => {
          const Icon = stat.icon;
          const percentage = (stat.value / stat.max) * 100;
          
          return (
            <div key={stat.name} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-sm font-semibold">{stat.name}</span>
                </div>
                <span className="text-sm font-bold">{stat.value}</span>
              </div>
              <Progress 
                value={percentage} 
                className="h-1.5" 
                data-testid={`progress-${stat.name.toLowerCase()}`}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
