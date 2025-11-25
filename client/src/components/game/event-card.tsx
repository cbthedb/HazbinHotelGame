import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import eventsData from "@/data/events.json";
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

  const events = eventsData as GameEvent[];

  // Load random event on mount or turn change
  useEffect(() => {
    const availableEvents = events.filter(e => !e.onlyOnce || !gameState.eventLog.some(log => log.title === e.title));
    
    if (availableEvents.length > 0) {
      const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
      setCurrentEvent(randomEvent);
      setSelectedChoice(null);
    }
  }, [gameState.turn]);

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
          updated[stat as keyof typeof updated] = Math.max(0, currentValue + value) as any;
        }
      });
      onUpdateCharacter(updated);
    }

    // Apply NPC affinity changes
    if (outcomes.npcAffinityChanges) {
      const newRelationships = { ...gameState.relationships };
      Object.entries(outcomes.npcAffinityChanges).forEach(([npcId, change]) => {
        newRelationships[npcId] = (newRelationships[npcId] || 0) + change;
      });
      // Note: This should update relationships in game state
    }

    // Show outcome
    toast({
      title: choice.text,
      description: outcomes.narrativeText,
      duration: 5000
    });

    setSelectedChoice(choiceId);
  };

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
    <Card className="border-2 border-primary/50 bg-gradient-to-br from-card to-primary/5" data-testid="card-event">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <Badge variant="secondary" className="capitalize">
                {(currentEvent as any).type} Event
              </Badge>
            </div>
            <CardTitle className="font-display text-2xl">{currentEvent.title}</CardTitle>
            <CardDescription className="mt-2 text-base">
              {currentEvent.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
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
      </CardContent>
    </Card>
  );
}
