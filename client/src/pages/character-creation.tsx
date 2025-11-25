import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { initAudio, playMenuMusic } from "@/lib/audio";
import NameStep from "@/components/character-creation/name-step";
import AppearanceStep from "@/components/character-creation/appearance-step";
import OriginStep from "@/components/character-creation/origin-step";
import TraitsStep from "@/components/character-creation/traits-step";
import PowersStep from "@/components/character-creation/powers-shop-step";
import SummaryStep from "@/components/character-creation/summary-step";
import { saveGame, createNewGameState, getAllSaves } from "@/lib/game-state";
import allPowers from "@/data/powers.json";
import type { Origin, Character } from "@shared/schema";

// Load globally-owned MYTHICAL powers only from all previous saves
// This is the only connection between character creation and in-game shops
function getInitialOwnedPowers(): string[] {
  try {
    const saves = getAllSaves();
    const globalOwnedPowers = new Set<string>();
    const allPowersData = allPowers as any[];
    
    saves.forEach(save => {
      if (save && save.gameState && save.gameState.character.powers) {
        save.gameState.character.powers.forEach((p: string) => {
          // Only carry over mythical powers from shard purchases
          const power = allPowersData.find((pow: any) => pow.id === p);
          if (power && power.rarity === "mythical") {
            globalOwnedPowers.add(p);
          }
        });
      }
    });
    
    return Array.from(globalOwnedPowers);
  } catch (error) {
    console.error("Error loading owned powers:", error);
    return [];
  }
}

// Load globally-owned origins from all previous saves
function getInitialOwnedOrigins(): string[] {
  try {
    const saves = getAllSaves();
    const globalOwnedOrigins = new Set<string>();
    
    // Always include free origin
    globalOwnedOrigins.add("sinner-weak");
    
    saves.forEach(save => {
      if (save && save.gameState && save.gameState.character.origin) {
        globalOwnedOrigins.add(save.gameState.character.origin);
      }
    });
    
    return Array.from(globalOwnedOrigins);
  } catch (error) {
    console.error("Error loading owned origins:", error);
    return ["sinner-weak"];
  }
}

// Load total accumulated soulcoins from all previous saves (global shared pool)
// This works like a hivemind currency - if you spent soulcoins buying powers,
// every new character sees the reduced amount
function getInitialSoulcoins(): number {
  try {
    const saves = getAllSaves();
    
    // First character gets 50 base soulcoins
    if (saves.length === 0) {
      return 50;
    }
    
    // Subsequent characters get total from all previous saves (no additional 50)
    let totalSoulcoins = 0;
    saves.forEach(save => {
      if (save && save.gameState && save.gameState.character.soulcoins !== undefined) {
        totalSoulcoins += save.gameState.character.soulcoins;
      }
    });
    
    return totalSoulcoins;
  } catch (error) {
    console.error("Error loading soulcoins:", error);
    return 50;
  }
}

// Calculate stat bonus multiplier based on power rarities
// Stronger powers = better starting stats and faster growth
function calculatePowerBonus(powerIds: string[]): number {
  const rarityBonus: Record<string, number> = {
    common: 0,
    uncommon: 0.10,
    rare: 0.20,
    epic: 0.35,
    legendary: 0.50,
    mythical: 0.75
  };
  
  const powers = allPowers as any[];
  let totalBonus = 0;
  
  powerIds.forEach(powerId => {
    const power = powers.find(p => p.id === powerId);
    if (power) {
      totalBonus += rarityBonus[power.rarity] || 0;
    }
  });
  
  // Average bonus across all powers, capped at 0.75 (mythical tier)
  const avgBonus = powerIds.length > 0 ? Math.min(totalBonus / powerIds.length, 0.75) : 0;
  return 1 + avgBonus;
}

export type CharacterData = {
  firstName: string;
  lastName: string;
  appearance: {
    horns: string;
    wings: string;
    colorPalette: string[];
  };
  origin: Origin | null;
  selectedTraits: string[];
  ownedPowers: string[]; // Powers player has bought
  equippedPowers: string[]; // Powers player is actively using (max 5)
  ownedOrigins: string[]; // Origins player has bought
  soulcoins: number;
  mythicalShards?: number;
};

export default function CharacterCreation() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [characterData, setCharacterData] = useState<CharacterData>(() => ({
    firstName: "",
    lastName: "",
    appearance: {
      horns: "curved",
      wings: "none",
      colorPalette: ["#8B0000", "#000000", "#FFD700"]
    },
    origin: null,
    selectedTraits: [],
    ownedPowers: getInitialOwnedPowers(),
    equippedPowers: [],
    ownedOrigins: getInitialOwnedOrigins(),
    soulcoins: getInitialSoulcoins(),
    mythicalShards: 0
  }));

  const steps = [
    { title: "Name", description: "Choose your demon identity" },
    { title: "Appearance", description: "Customize your look" },
    { title: "Origin", description: "Select your path in Hell" },
    { title: "Traits", description: "Define your personality" },
    { title: "Powers", description: "Choose and buy your abilities" },
    { title: "Summary", description: "Review your character" }
  ];

  const progress = ((step + 1) / steps.length) * 100;

  // Initialize audio and play menu music on mount
  useEffect(() => {
    initAudio();
    playMenuMusic();
  }, []);

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Create character and start game
      try {
        if (!characterData.origin) {
          toast({ title: "Error", description: "Please select an origin", variant: "destructive" });
          return;
        }

        // Build final powers list: all owned powers (both globally owned and newly bought)
        // Use equipped powers for active use, but save ALL owned powers to the character
        const allOwnedPowers = characterData.ownedPowers;
        const finalPowers = allOwnedPowers.length > 0 
          ? allOwnedPowers
          : (allPowers as any[])
              .filter(p => p.rarity === "common")
              .map(p => p.id)
              .slice(0, 3);

        // Calculate power bonus multiplier for starting stats
        const powerBonus = calculatePowerBonus(characterData.ownedPowers);
        
        // Create character with all required fields
        const newCharacter: Character = {
          id: `char-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: `${characterData.firstName} ${characterData.lastName}`,
          origin: characterData.origin.id,
          appearance: characterData.appearance,
          age: 25,
          power: Math.round(characterData.origin.startingStats.power * powerBonus),
          control: Math.round(characterData.origin.startingStats.control * powerBonus),
          influence: Math.round(characterData.origin.startingStats.influence * powerBonus),
          corruption: Math.round(characterData.origin.startingStats.corruption * powerBonus),
          empathy: Math.round(characterData.origin.startingStats.empathy * powerBonus),
          health: Math.round(characterData.origin.startingStats.health * powerBonus),
          wealth: 1000,
          soulcoins: characterData.soulcoins,
          mythicalShards: characterData.mythicalShards || 0,
          powers: finalPowers,
          traits: characterData.selectedTraits,
          currentRank: "street-demon",
          currentLocation: "hotel-district",
          currentTurn: 1,
          rank: "street-demon",
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Calculate next available slot
        const saves = getAllSaves();
        const nextSlot = Math.min(saves.length + 1, 5);
        const gameState = createNewGameState(newCharacter, nextSlot);
        await saveGame(gameState, nextSlot);

        toast({ title: "Welcome to Hell!", description: `Your life as ${characterData.firstName} ${characterData.lastName} begins...` });
        setLocation("/game");
      } catch (error) {
        console.error("Character creation error:", error);
        toast({ title: "Error", description: "Failed to create character", variant: "destructive" });
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return characterData.firstName && characterData.lastName;
      case 1:
        return true; // Appearance always valid
      case 2:
        return characterData.origin !== null;
      case 3:
        return characterData.selectedTraits.length > 0;
      case 4:
        return true; // Powers - at least something bought or confirmed
      case 5:
        return true; // Summary always valid
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary">
            Character Creation
          </h1>
          <p className="text-muted-foreground">
            Step {step + 1} of {steps.length}: {steps[step].title}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" data-testid="progress-creation" />
          <div className="flex justify-between text-xs text-muted-foreground">
            {steps.map((s, i) => (
              <span key={i} className={i === step ? "text-primary font-semibold" : ""}>
                {s.title}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="border-2 border-card-border">
          <CardHeader>
            <CardTitle className="font-display text-2xl">{steps[step].title}</CardTitle>
            <CardDescription>{steps[step].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {step === 0 && (
              <NameStep
                data={characterData}
                onChange={(data) => setCharacterData({ ...characterData, ...data })}
              />
            )}
            {step === 1 && (
              <AppearanceStep
                data={characterData}
                onChange={(data) => setCharacterData({ ...characterData, ...data })}
              />
            )}
            {step === 2 && (
              <OriginStep
                data={characterData}
                onChange={(data) => setCharacterData({ ...characterData, ...data })}
              />
            )}
            {step === 3 && (
              <TraitsStep
                data={characterData}
                onChange={(data) => setCharacterData({ ...characterData, ...data })}
              />
            )}
            {step === 4 && (
              <PowersStep
                data={characterData}
                onChange={(data) => setCharacterData({ ...characterData, ...data })}
              />
            )}
            {step === 5 && (
              <SummaryStep data={characterData} />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 0}
            className="gap-2"
            data-testid="button-back"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2"
            data-testid="button-next"
          >
            {step === steps.length - 1 ? "Begin Your Life in Hell" : "Next"}
            {step !== steps.length - 1 && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
