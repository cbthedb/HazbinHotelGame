import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Users, Briefcase, Music, Swords, Heart, ArrowRight } from "lucide-react";

interface ActionsPanelProps {
  onNextTurn: () => void;
}

export default function ActionsPanel({ onNextTurn }: ActionsPanelProps) {
  const actions = [
    { id: "train-power", name: "Train Power", icon: Dumbbell, description: "Increase your raw magical strength" },
    { id: "socialize", name: "Socialize", icon: Users, description: "Build relationships and influence" },
    { id: "work", name: "Work", icon: Briefcase, description: "Earn soul coins" },
    { id: "perform", name: "Perform", icon: Music, description: "Entertain at the Hotel" },
    { id: "territory", name: "Claim Territory", icon: Swords, description: "Expand your domain" },
    { id: "romance", name: "Romance", icon: Heart, description: "Deepen a relationship" },
  ];

  return (
    <Card className="border-2 border-card-border" data-testid="card-actions">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-display">Actions</CardTitle>
          <Button
            onClick={onNextTurn}
            className="gap-2"
            data-testid="button-next-turn"
          >
            Next Turn
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto flex-col items-start p-3 hover-elevate gap-1"
                data-testid={`button-action-${action.id}`}
              >
                <div className="flex items-center gap-2 w-full">
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm">{action.name}</span>
                </div>
                <p className="text-xs text-muted-foreground text-left w-full">
                  {action.description}
                </p>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
