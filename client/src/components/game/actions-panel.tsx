import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Users, Briefcase, Music, Swords, Heart, ArrowRight, Bed } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { canClaimTerritory, claimTerritory } from "@/lib/territorySystem";
import powersData from "@/data/powers.json";
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
  
  // Calculate stat gain multiplier based on power rarities
  const calculatePowerBonus = (): number => {
    const rarityBonus: Record<string, number> = {
      common: 0,
      uncommon: 0.10,
      rare: 0.20,
      epic: 0.35,
      legendary: 0.50,
      mythical: 0.75
    };
    
    const powers = powersData as any[];
    let totalBonus = 0;
    
    character.powers?.forEach(powerId => {
      const power = powers.find(p => p.id === powerId);
      if (power) {
        totalBonus += rarityBonus[power.rarity] || 0;
      }
    });
    
    const avgBonus = (character.powers?.length || 0) > 0 ? Math.min(totalBonus / character.powers!.length, 0.75) : 0;
    return 1 + avgBonus;
  };
  
  const powerBonus = calculatePowerBonus();
  
  const isOnCooldown = (actionId: string) => {
    const availableTurn = cooldowns[actionId];
    return availableTurn ? availableTurn > gameState.turn : false;
  };
  
  const getTrainPowerGain = () => {
    const trainCount = useCounts["train-power"] || 0;
    const baseGain = trainCount >= 5 ? 0.5 : trainCount >= 3 ? 1 : 2;
    return Math.round(baseGain * powerBonus * 10) / 10; // Apply power bonus multiplier
  };

  const actions = [
    {
      id: "rest",
      name: "Rest",
      icon: Bed,
      description: "Recover your health and restore energy",
      action: () => {
        const healthRecovery = 30;
        onUpdateCharacter({ 
          health: Math.min(100, character.health + healthRecovery)
        } as any);
        
        toast({ title: "Rest", description: `You rest and recover. +${healthRecovery} Health!` });
      }
    },
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
        const influenceGain = Math.round(1 * powerBonus);
        onUpdateCharacter({ influence: character.influence + influenceGain, wealth: character.wealth - 15, health: character.health - 2 });
        toast({ title: "Socialization", description: `You made a connection. +${influenceGain} Influence` });
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
        
        const newSoulcoins = (character.soulcoins || 0) + 1;
        const newCooldowns = { ...cooldowns, "work": gameState.turn + 10 };
        console.log(`[Work] Before: ${character.soulcoins}, After: ${newSoulcoins}`);
        onUpdateCharacter({ 
          soulcoins: newSoulcoins,
          health: character.health - 5,
          actionCooldowns: newCooldowns
        } as any);
        
        toast({ title: "Work Complete", description: `You earned 1 soul coin! (Total: ${newSoulcoins})` });
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
        const influenceGain = Math.round(1 * powerBonus);
        const empathyGain = Math.round(1 * powerBonus);
        onUpdateCharacter({
          influence: character.influence + influenceGain,
          wealth: character.wealth + 40,
          soulcoins: (character.soulcoins || 0) + 1,
          empathy: character.empathy + empathyGain,
          health: character.health - 10,
          actionCooldowns: newCooldowns
        } as any);
        toast({ title: "Performance", description: `The crowd loves it! +${influenceGain} Influence, +40 wealth, +1 soulcoin, +${empathyGain} Empathy` });
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
        const influenceGain = Math.round(1 * powerBonus);
        const newCooldowns = { ...cooldowns, "scheme": gameState.turn + 15 };
        onUpdateCharacter({
          soulcoins: (character.soulcoins || 0) + soulcoinGain,
          influence: character.influence + influenceGain,
          corruption: Math.min(100, (character.corruption || 0) + 5),
          health: character.health - 8,
          actionCooldowns: newCooldowns
        } as any);
        toast({ title: "Deal Made", description: `You gained ${soulcoinGain} soulcoins and +${influenceGain} Influence through scheming!` });
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
        const empathyGain = Math.round(1 * powerBonus);
        const controlGain = Math.round(1 * powerBonus);
        onUpdateCharacter({ empathy: character.empathy + empathyGain, control: character.control + controlGain, health: character.health - 5 });
        toast({ title: "Romance", description: `A delicate connection forms... +${empathyGain} Empathy, +${controlGain} Control` });
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
