import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import NameStep from "@/components/character-creation/name-step";
import AppearanceStep from "@/components/character-creation/appearance-step";
import OriginStep from "@/components/character-creation/origin-step";
import TraitsStep from "@/components/character-creation/traits-step";
import PowersStep from "@/components/character-creation/powers-step";
import SummaryStep from "@/components/character-creation/summary-step";
import { saveGame, createNewGameState } from "@/lib/game-state";
import allPowers from "@/data/powers.json";
import type { Origin, Character } from "@shared/schema";

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
  selectedPowers: string[];
};

export default function CharacterCreation() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [characterData, setCharacterData] = useState<CharacterData>({
    firstName: "",
    lastName: "",
    appearance: {
      horns: "curved",
      wings: "none",
      colorPalette: ["#8B0000", "#000000", "#FFD700"]
    },
    origin: null,
    selectedTraits: [],
    selectedPowers: []
  });

  const steps = [
    { title: "Name", description: "Choose your demon identity" },
    { title: "Appearance", description: "Customize your look" },
    { title: "Origin", description: "Select your path in Hell" },
    { title: "Traits", description: "Define your personality" },
    { title: "Powers", description: "Choose your abilities" },
    { title: "Summary", description: "Review your character" }
  ];

  const progress = ((step + 1) / steps.length) * 100;

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

        // Start with common powers only (free powers)
        const commonPowers = (allPowers as any[])
          .filter(p => p.rarity === "common" && !p.isPassive)
          .map(p => p.id);

        const newCharacter: Character = {
          firstName: characterData.firstName,
          lastName: characterData.lastName,
          origin: characterData.origin.id,
          age: 25,
          power: characterData.origin.startingStats.power,
          control: characterData.origin.startingStats.control,
          influence: characterData.origin.startingStats.influence,
          corruption: characterData.origin.startingStats.corruption,
          empathy: characterData.origin.startingStats.empathy,
          health: characterData.origin.startingStats.health,
          wealth: 1000, // Starting wealth to buy powers
          appearance: characterData.appearance,
          traits: characterData.selectedTraits,
          powers: commonPowers,
          rank: "street-demon"
        };

        const gameState = createNewGameState(newCharacter);
        await saveGame(gameState);

        toast({ title: "Welcome to Hell!", description: `Your life as ${newCharacter.firstName} ${newCharacter.lastName} begins...` });
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
        return characterData.selectedPowers.length >= 1;
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
