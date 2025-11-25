import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Users, Briefcase, Music, Swords, Heart, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { canClaimTerritory, claimTerritory } from "@/lib/territorySystem";
import type { GameState } from "@/lib/game-state";

interface ActionsPanelProps {
  onNextTurn: () => void;
  gameState: GameState;
  onUpdateCharacter: (updates: Partial<GameState["character"]> & { actionCooldowns?: Record<string, number> }) => void;
}

export default function ActionsPanel({ onNextTurn, gameState, onUpdateCharacter }: ActionsPanelProps) {
  const { toast } = useToast();
  const { character } = gameState;
  const cooldowns = gameState.actionCooldowns || {};
  const useCounts = gameState.actionUseCounts || {};
  
  const isOnCooldown = (actionId: string) => {
    const availableTurn = cooldowns[actionId];
    return availableTurn ? availableTurn > gameState.turn : false;
  };
  
  const getTrainPowerGain = () => {
    const trainCount = useCounts["train-power"] || 0;
    if (trainCount >= 5) return 0.5; // Heavy diminishing returns
    if (trainCount >= 3) return 1; // Moderate diminishing
    return 2; // Full power
  };

  const actions = [
    {
      id: "train-power",
      name: "Train Power",
      icon: Dumbbell,
      description: "Increase your raw magical strength (cooldown: 3 turns)",
      action: () => {
        if (isOnCooldown("train-power")) {
          toast({ 
            title: "On Cooldown", 
            description: `Available at turn ${cooldowns["train-power"]}`,
            variant: "destructive" 
          });
          return;
        }
        
        const gain = getTrainPowerGain();
        const newCooldowns = { ...cooldowns, "train-power": gameState.turn + 3 };
        const newUseCounts = { ...useCounts, "train-power": (useCounts["train-power"] || 0) + 1 };
        
        onUpdateCharacter({ 
          power: Math.min(100, character.power + gain),
          health: character.health - 5,
          actionCooldowns: newCooldowns,
          actionUseCounts: newUseCounts
        } as any);
        
        const message = gain < 2 ? `+${gain} Power (diminishing!)` : `+${gain} Power`;
        toast({ title: "Power Training", description: `You've grown stronger! ${message}` });
      }
    },
    {
      id: "socialize",
      name: "Socialize",
      icon: Users,
      description: "Build relationships and influence",
      action: () => {
        onUpdateCharacter({ influence: character.influence + 1, wealth: character.wealth - 15, health: character.health - 2 });
        toast({ title: "Socialization", description: "You made a connection. +1 Influence" });
      }
    },
    {
      id: "work",
      name: "Work",
      icon: Briefcase,
      description: "Earn soul coins (cooldown: 10 turns)",
      action: () => {
        if (isOnCooldown("work")) {
          toast({ 
            title: "On Cooldown", 
            description: `Available at turn ${cooldowns["work"]}`,
            variant: "destructive" 
          });
          return;
        }
        
        const newCooldowns = { ...cooldowns, "work": gameState.turn + 10 };
        onUpdateCharacter({ 
          soulcoins: (character.soulcoins || 0) + 1,
          health: character.health - 5,
          actionCooldowns: newCooldowns
        } as any);
        
        toast({ title: "Work Complete", description: "You earned 1 soul coin!" });
      }
    },
    {
      id: "perform",
      name: "Perform",
      icon: Music,
      description: "Entertain at the Hotel (cooldown: 8 turns)",
      action: () => {
        if (isOnCooldown("perform")) {
          toast({ 
            title: "On Cooldown", 
            description: `Available at turn ${cooldowns["perform"]}`,
            variant: "destructive" 
          });
          return;
        }

        const newCooldowns = { ...cooldowns, "perform": gameState.turn + 8 };
        onUpdateCharacter({
          influence: character.influence + 1,
          wealth: character.wealth + 40,
          soulcoins: (character.soulcoins || 0) + 1,
          empathy: character.empathy + 1,
          health: character.health - 10,
          actionCooldowns: newCooldowns
        } as any);
        toast({ title: "Performance", description: "The crowd loves it! +1 Influence, +40 wealth, +1 soulcoin" });
      }
    },
    {
      id: "scheme",
      name: "Scheme for Power",
      icon: Heart,
      description: "Make deals for soulcoins (cooldown: 15 turns)",
      action: () => {
        if (isOnCooldown("scheme")) {
          toast({ 
            title: "On Cooldown", 
            description: `Available at turn ${cooldowns["scheme"]}`,
            variant: "destructive" 
          });
          return;
        }

        const soulcoinGain = Math.floor(Math.random() * 3) + 1; // 1-3 soulcoins
        const newCooldowns = { ...cooldowns, "scheme": gameState.turn + 15 };
        onUpdateCharacter({
          soulcoins: (character.soulcoins || 0) + soulcoinGain,
          influence: character.influence + 1,
          corruption: Math.min(100, (character.corruption || 0) + 5),
          health: character.health - 8,
          actionCooldowns: newCooldowns
        } as any);
        toast({ title: "Deal Made", description: `You gained ${soulcoinGain} soulcoins through scheming!` });
      }
    },
    {
      id: "territory",
      name: "Claim Territory",
      icon: Swords,
      description: "Expand your domain",
      action: () => {
        // Use all 7 districts instead of just territory keys
        const districtIds = ["hotel-district", "cannibal-colony", "entertainment-district", "vox-tower-zone", "industrial-hellscape", "overlord-territories", "royal-quarter"];
        const randomDistrict = districtIds[Math.floor(Math.random() * districtIds.length)];
        const check = canClaimTerritory(gameState, randomDistrict);
        
        if (!check.can) {
          toast({
            title: "Territory Claim Failed",
            description: check.reason || "You cannot claim this territory",
            variant: "destructive"
          });
          return;
        }
        
        const update = claimTerritory(gameState, randomDistrict);
        if (update.character && update.territory) {
          onUpdateCharacter({ 
            ...update.character, 
            actionCooldowns: { ...cooldowns, "territory": gameState.turn + 5 },
            actionUseCounts: { ...useCounts }
          } as any);
          toast({ 
            title: "Territory Claimed!", 
            description: `You've claimed ${randomDistrict}! Difficulty: ${check.difficultyRating}` 
          });
        }
      }
    },
    {
      id: "romance",
      name: "Romance",
      icon: Heart,
      description: "Deepen a relationship",
      action: () => {
        onUpdateCharacter({ empathy: character.empathy + 1, control: character.control + 1, health: character.health - 5 });
        toast({ title: "Romance", description: "A delicate connection forms..." });
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
            const onCooldown = isOnCooldown(action.id);
            return (
              <Button
                key={action.id}
                variant="outline"
                onClick={action.action}
                disabled={onCooldown}
                className={`h-auto flex-col items-start p-3 gap-1 ${onCooldown ? 'opacity-50 cursor-not-allowed' : 'hover-elevate'}`}
                data-testid={`button-action-${action.id}`}
              >
                <div className="flex items-center gap-2 w-full">
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm">{action.name}</span>
                </div>
                <p className="text-xs text-muted-foreground text-left w-full">
                  {action.description}
                </p>
                {onCooldown && (
                  <p className="text-xs text-destructive text-left w-full font-semibold">
                    Ready turn {cooldowns[action.id]}
                  </p>
                )}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
