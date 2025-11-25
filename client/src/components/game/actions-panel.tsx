import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Users, Briefcase, Music, Swords, Heart, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { GameState } from "@/lib/game-state";

interface ActionsPanelProps {
  onNextTurn: () => void;
  gameState: GameState;
  onUpdateCharacter: (updates: Partial<GameState["character"]>) => void;
}

export default function ActionsPanel({ onNextTurn, gameState, onUpdateCharacter }: ActionsPanelProps) {
  const { toast } = useToast();
  const { character } = gameState;

  const actions = [
    {
      id: "train-power",
      name: "Train Power",
      icon: Dumbbell,
      description: "Increase your raw magical strength",
      action: () => {
        onUpdateCharacter({ power: character.power + 2, health: character.health - 5 });
        toast({ title: "Power Training", description: "You've grown stronger! +2 Power" });
      }
    },
    {
      id: "socialize",
      name: "Socialize",
      icon: Users,
      description: "Build relationships and influence",
      action: () => {
        onUpdateCharacter({ influence: character.influence + 3, wealth: character.wealth - 10 });
        toast({ title: "Socialization", description: "You made new connections! +3 Influence" });
      }
    },
    {
      id: "work",
      name: "Work",
      icon: Briefcase,
      description: "Earn soul coins",
      action: () => {
        const earnings = Math.floor(Math.random() * 100) + 50;
        onUpdateCharacter({ wealth: character.wealth + earnings });
        toast({ title: "Work Complete", description: `You earned ${earnings} soul coins!` });
      }
    },
    {
      id: "perform",
      name: "Perform",
      icon: Music,
      description: "Entertain at the Hotel",
      action: () => {
        onUpdateCharacter({
          influence: character.influence + 2,
          wealth: character.wealth + 75,
          empathy: character.empathy + 1
        });
        toast({ title: "Performance", description: "Your show was a hit! +2 Influence, +75 coins" });
      }
    },
    {
      id: "territory",
      name: "Claim Territory",
      icon: Swords,
      description: "Expand your domain",
      action: () => {
        if (character.power < 20) {
          toast({
            title: "Territory Claim Failed",
            description: "You need at least 20 Power to claim territory!",
            variant: "destructive"
          });
          return;
        }
        onUpdateCharacter({ influence: character.influence + 5, corruption: character.corruption + 2 });
        toast({ title: "Territory Claimed!", description: "You've expanded your domain!" });
      }
    },
    {
      id: "romance",
      name: "Romance",
      icon: Heart,
      description: "Deepen a relationship",
      action: () => {
        onUpdateCharacter({ empathy: character.empathy + 2, control: character.control + 1 });
        toast({ title: "Romance", description: "A connection deepens..." });
      }
    }
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
                onClick={action.action}
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
