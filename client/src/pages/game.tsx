import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatsPanel from "@/components/game/stats-panel";
import PowersPanel from "@/components/game/powers-panel";
import EventCard from "@/components/game/event-card";
import ActionsPanel from "@/components/game/actions-panel";
import NPCPanel from "@/components/game/npc-panel";
import MapPanel from "@/components/game/map-panel";
import { Menu, X } from "lucide-react";

export default function GamePage() {
  const [turn, setTurn] = useState(1);
  const [showMenu, setShowMenu] = useState(false);
  
  // Mock character data - will be replaced with actual game state
  const mockCharacter = {
    firstName: "Crimson",
    lastName: "Nightshade",
    origin: "royal-born",
    age: 25,
    rank: "street-demon",
    power: 15,
    control: 10,
    influence: 12,
    corruption: 5,
    empathy: 8,
    health: 100,
    wealth: 250
  };

  const handleNextTurn = () => {
    setTurn(turn + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-card-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-display text-2xl font-bold text-primary">
              {mockCharacter.firstName} {mockCharacter.lastName}
            </h1>
            <div className="text-sm text-muted-foreground">
              Turn {turn} • Age {mockCharacter.age}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMenu(!showMenu)}
            data-testid="button-menu"
          >
            {showMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Main Game Layout */}
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Stats & Powers */}
        <div className="space-y-4">
          <StatsPanel character={mockCharacter} />
          <PowersPanel />
        </div>

        {/* Center Column - Events & Actions */}
        <div className="lg:col-span-2 space-y-4">
          <EventCard />
          <ActionsPanel onNextTurn={handleNextTurn} />
          <MapPanel />
        </div>
      </div>

      {/* Right Sidebar - NPCs & Info (conditional) */}
      {showMenu && (
        <div className="fixed inset-y-0 right-0 w-80 bg-card border-l border-card-border p-4 overflow-y-auto z-40">
          <NPCPanel />
        </div>
      )}
    </div>
  );
}
