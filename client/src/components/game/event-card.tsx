import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export default function EventCard() {
  // Mock event - will be replaced with actual game events
  const currentEvent = {
    title: "Welcome to the Hotel",
    description: "Charlie greets you at the Hazbin Hotel's entrance with her signature enthusiasm. 'Welcome! We're so glad you're here! Redemption starts today!'",
    type: "daily",
    choices: [
      {
        id: "enthusiastic",
        text: "Match her energy! This is a fresh start!",
        effects: "+2 Empathy, +1 Influence, +5 Charlie Affinity"
      },
      {
        id: "skeptical",
        text: "Redemption? In Hell? You're kidding, right?",
        effects: "-1 Empathy, -2 Charlie Affinity, +3 Vaggie Affinity"
      },
      {
        id: "polite",
        text: "Thank you for having me. I'll do my best.",
        effects: "+2 Influence, +3 Charlie Affinity, +2 Vaggie Affinity"
      }
    ]
  };

  return (
    <Card className="border-2 border-primary/50 bg-gradient-to-br from-card to-primary/5" data-testid="card-event">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <Badge variant="secondary" className="capitalize">{currentEvent.type} Event</Badge>
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
            className="cursor-pointer hover-elevate active-elevate-2 border-card-border"
            data-testid={`button-choice-${choice.id}`}
          >
            <CardContent className="p-4">
              <p className="font-semibold mb-2">{choice.text}</p>
              <p className="text-xs text-muted-foreground">{choice.effects}</p>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
