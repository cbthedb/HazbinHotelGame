import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Zap, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import eventsData from "@/data/events.json";
import { generateAIEvent } from "@/lib/aiEventClient";
import { generateEventWithUserInput } from "@/lib/smart-ai";
import { applyNpcAffects } from "@/lib/relationshipSystem";
import PowerSelector from "@/components/game/power-selector";
import type { GameState } from "@/lib/game-state";
import type { GameEvent } from "@shared/schema";

interface EventCardProps {
  gameState: GameState;
  onUpdateCharacter: (updates: Partial<GameState["character"]>) => void;
}

export default function EventCard({ gameState, onUpdateCharacter }: EventCardProps) {
  const { toast } = useToast();
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isAIGenerated, setIsAIGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [showCustomBox, setShowCustomBox] = useState(false);
  const [isSubmittingCustom, setIsSubmittingCustom] = useState(false);

  const events = eventsData as GameEvent[];
  
  const [selectedPowers, setSelectedPowers] = useState<string[]>([]);
  const [showPowerSelector, setShowPowerSelector] = useState(false);

  const handleCustomSubmit = async () => {
    if (!customInput.trim()) return;
    
    setIsSubmittingCustom(true);
    const customEvent = await generateEventWithUserInput(customInput, gameState, selectedPowers);
    
    if (customEvent) {
      setCurrentEvent(customEvent);
      setShowCustomBox(false);
      setCustomInput("");
      setSelectedPowers([]);
      setIsAIGenerated(true);
      toast({ title: "Custom Action", description: "Your unique approach unfolds..." });
    } else {
      toast({ 
        title: "Failed", 
        description: "Could not process your action.",
        variant: "destructive"
      });
    }
    setIsSubmittingCustom(false);
  };

  // Load random event on mount or turn change
  useEffect(() => {
    loadNewEvent();
  }, [gameState.turn]);

  const loadNewEvent = async () => {
    setIsLoading(true);
    setSelectedChoice(null);
    
    // 40% chance of AI-generated event
    const useAI = Math.random() < 0.4;
    
    if (useAI) {
      const aiEvent = await generateAIEvent(gameState);
      if (aiEvent && aiEvent.title) {
        setCurrentEvent(aiEvent as GameEvent);
        setIsAIGenerated(true);
        setIsLoading(false);
        return;
      }
    }
    
    // Fall back to static events
    const availableEvents = events.filter(e => !e.onlyOnce || !gameState.eventLog.some(log => log.title === e.title));
    
    if (availableEvents.length > 0) {
      const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
      setCurrentEvent(randomEvent);
      setIsAIGenerated(false);
    }
    setIsLoading(false);
  };

  const handleChoice = (choiceId: string) => {
    if (!currentEvent) return;

    const choice = currentEvent.choices.find(c => c.id === choiceId);
    if (!choice) return;

    const { outcomes } = choice;

    // Apply stat changes
    if (outcomes.statChanges) {
      const updated = { ...gameState.character };
      Object.entries(outcomes.statChanges).forEach(([stat, value]) => {
        const currentValue = updated[stat as keyof typeof updated] as number;
        if (typeof currentValue === "number") {
          updated[stat as keyof typeof updated] = Math.max(0, Math.min(1000, currentValue + value)) as any;
        }
      });
      onUpdateCharacter(updated);
    }

    // Show outcome with stat changes summary
    let statSummary = "";
    if (outcomes.statChanges) {
      const changes = Object.entries(outcomes.statChanges)
        .filter(([_, v]) => v !== 0)
        .map(([stat, value]) => `${value > 0 ? "+" : ""}${value} ${stat}`)
        .join(", ");
      if (changes) statSummary = `\n\n${changes}`;
    }

    toast({
      title: choice.text,
      description: outcomes.narrativeText + statSummary,
      duration: 5000
    });

    setSelectedChoice(choiceId);
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-card-border" data-testid="card-event">
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>Generating scenario...</p>
        </CardContent>
      </Card>
    );
  }

  if (!currentEvent) {
    return (
      <Card className="border-2 border-card-border" data-testid="card-event">
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>No events available. Rest for a turn.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 bg-gradient-to-br ${isAIGenerated ? "border-amber-500/50 from-card to-amber-900/5" : "border-primary/50 from-card to-primary/5"}`} data-testid="card-event">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {isAIGenerated ? (
                <Zap className="w-5 h-5 text-amber-500" />
              ) : (
                <Sparkles className="w-5 h-5 text-primary" />
              )}
              <Badge variant="secondary" className="capitalize">
                {isAIGenerated ? "AI-Generated" : (currentEvent as any).type} Event
              </Badge>
            </div>
            <CardTitle className="font-display text-2xl">{currentEvent.title}</CardTitle>
            <CardDescription className="mt-2 text-base">
              {currentEvent.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {showCustomBox ? (
          <div className="space-y-2">
            <Textarea
              placeholder="Describe your own approach to this situation..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="min-h-24"
              data-testid="input-custom-action"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCustomSubmit}
                disabled={!customInput.trim() || isSubmittingCustom}
                className="flex-1 gap-2"
                data-testid="button-submit-custom"
              >
                <Send className="w-4 h-4" />
                {isSubmittingCustom ? "Processing..." : "Take Action"}
              </Button>
              <Button
                variant="outline"
                onClick={() => { setShowCustomBox(false); setCustomInput(""); }}
                data-testid="button-cancel-custom"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            {showPowerSelector && (
              <PowerSelector
                gameState={gameState}
                selectedPowerIds={selectedPowers}
                onTogglePower={(powerId) => {
                  setSelectedPowers(prev =>
                    prev.includes(powerId)
                      ? prev.filter(p => p !== powerId)
                      : [...prev, powerId]
                  );
                }}
                onClose={() => setShowPowerSelector(false)}
              />
            )}
            {currentEvent.choices.map((choice) => (
              <Card
                key={choice.id}
                className={`cursor-pointer hover-elevate active-elevate-2 border-card-border transition-all ${
                  selectedChoice === choice.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => !selectedChoice && handleChoice(choice.id)}
                data-testid={`button-choice-${choice.id}`}
              >
                <CardContent className="p-4">
                  <p className="font-semibold mb-2">{choice.text}</p>
                  {selectedChoice !== choice.id && (
                    <p className="text-xs text-muted-foreground">Click to choose</p>
                  )}
                </CardContent>
              </Card>
            ))}
            {!selectedChoice && (
              <div className="space-y-2">
                {showCustomBox && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowPowerSelector(!showPowerSelector)}
                    data-testid="button-toggle-powers"
                  >
                    ⚡ {showPowerSelector ? "Hide Powers" : "Select Powers"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowCustomBox(true)}
                  data-testid="button-custom-action"
                >
                  🎲 Create Your Own Path
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
