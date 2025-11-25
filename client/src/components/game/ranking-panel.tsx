import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Crown, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { calculateRankProgress, getRankTitle, generateRivals } from "@/lib/rankingSystem";
import type { GameState } from "@/lib/game-state";

interface RankingPanelProps {
  gameState: GameState;
}

export default function RankingPanel({ gameState }: RankingPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { currentRank, nextRank, progressPercent } = calculateRankProgress(gameState.character.power);
  const rivals = generateRivals(gameState);

  if (!isExpanded) {
    return (
      <Card>
        <Button
          onClick={() => setIsExpanded(true)}
          variant="outline"
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4" />
            Power Ranking
          </div>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-card-border" data-testid="card-ranking">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            Power Ranking
          </CardTitle>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsExpanded(false)}
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-primary/10 rounded-md border border-primary/30">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-sm">{getRankTitle(currentRank)}</span>
            <Badge variant="default">{gameState.character.power} Power</Badge>
          </div>
          {nextRank && (
            <>
              <Progress value={progressPercent} className="h-2 mb-1" />
              <p className="text-xs text-muted-foreground">
                Progress to {getRankTitle(nextRank)}: {Math.round(progressPercent)}%
              </p>
            </>
          )}
          {!nextRank && (
            <p className="text-xs text-green-500 font-semibold">You've reached Hell's Apex!</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold">Active Rivals</span>
          </div>
          {rivals.map((rival, i) => (
            <div key={i} className="p-2 bg-muted/50 rounded-md border border-card-border text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{rival.name}</span>
                <span className="text-xs text-muted-foreground">{Math.round(rival.power)} Power</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
