import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import StatsPanel from "@/components/game/stats-panel";
import PowersPanel from "@/components/game/powers-panel";
import EventCard from "@/components/game/event-card";
import ActionsPanel from "@/components/game/actions-panel";
import NPCPanel from "@/components/game/npc-panel";
import MapPanel from "@/components/game/map-panel";
import RankingPanel from "@/components/game/ranking-panel";
import LocationPanel from "@/components/game/location-panel";
import ActivitiesPanel from "@/components/game/activities-panel";
import AnimatedLoading from "@/components/game/animated-loading";
import { Menu, X, LogOut, Save } from "lucide-react";
import { loadGame, saveGame } from "@/lib/game-state";
import { initAudio, playLocationMusic } from "@/lib/audio";
import type { GameState } from "@/lib/game-state";

export default function GamePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentEvent, setCurrentEvent] = useState<any | null>(null);

  // Load game on mount and initialize audio
  useEffect(() => {
    const init = async () => {
      initAudio();
      playLocationMusic("hotel-lobby");
      
      const saved = await loadGame();
      if (!saved) {
        toast({ title: "Error", description: "No game found. Returning to menu.", variant: "destructive" });
        setLocation("/");
        return;
      }
      setGameState(saved);
      setIsLoading(false);
    };
    
    init();
  }, [setLocation, toast]);

  const handleNextTurn = async () => {
    if (!gameState) return;

    const updatedState: GameState = {
      ...gameState,
      turn: gameState.turn + 1,
      character: {
        ...gameState.character,
        age: Math.floor(gameState.character.age + 0.5) // Age progression
      }
    };
    
    setGameState(updatedState);
    await saveGame(updatedState);
    toast({ title: "Turn Advanced", description: `Now on turn ${updatedState.turn}` });
  };

  const handleUpdateCharacter = async (updates: any) => {
    if (!gameState) return;

    const { actionCooldowns, actionUseCounts, ...characterUpdates } = updates;
    
    const updatedState: GameState = {
      ...gameState,
      character: { ...gameState.character, ...characterUpdates },
      actionCooldowns: actionCooldowns || gameState.actionCooldowns,
      actionUseCounts: actionUseCounts || gameState.actionUseCounts
    };

    setGameState(updatedState);
    await saveGame(updatedState);
  };

  const handleQuitGame = () => {
    setLocation("/");
  };

  const handleSaveGame = async () => {
    if (!gameState) return;
    await saveGame(gameState);
    toast({ title: "Game Saved!", description: "Your progress has been saved to browser storage." });
  };

  if (isLoading) {
    return <AnimatedLoading />;
  }

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-card flex items-center justify-center">
        <Card className="p-8">
          <p className="text-destructive">Game failed to load. Please start a new game.</p>
          <Button onClick={handleQuitGame} className="mt-4">
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  const { character } = gameState;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-card-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-display text-2xl font-bold text-primary">
              {character.firstName} {character.lastName}
            </h1>
            <div className="text-sm text-muted-foreground">
              Turn {gameState.turn} • Age {character.age}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveGame}
              className="gap-2"
              data-testid="button-save"
            >
              <Save className="w-4 h-4" />
              Save
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMenu(!showMenu)}
              data-testid="button-menu"
            >
              {showMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleQuitGame}
              data-testid="button-quit"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Game Layout */}
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Column - Stats & Powers & Ranking */}
        <div className="space-y-4">
          <StatsPanel character={character} />
          <PowersPanel gameState={gameState} />
          <RankingPanel gameState={gameState} />
        </div>

        {/* Center Column - Events & Actions */}
        <div className="lg:col-span-2 space-y-4">
          <EventCard 
            gameState={gameState} 
            onUpdateCharacter={handleUpdateCharacter}
          />
          <ActionsPanel 
            onNextTurn={handleNextTurn} 
            gameState={gameState} 
            onUpdateCharacter={handleUpdateCharacter} 
          />
          <MapPanel territories={gameState.territory} />
        </div>

        {/* Right Column - Location & Activities */}
        <div className="space-y-4">
          <LocationPanel 
            gameState={gameState}
            onUpdateCharacter={handleUpdateCharacter}
          />
          <ActivitiesPanel 
            gameState={gameState}
            onUpdateCharacter={handleUpdateCharacter}
            onEventGenerated={setCurrentEvent}
          />
        </div>
      </div>

      {/* Right Sidebar - NPCs & Info (conditional) */}
      {showMenu && (
        <div className="fixed inset-y-0 right-0 w-80 bg-card border-l border-card-border p-4 overflow-y-auto z-40">
          <NPCPanel relationships={gameState.relationships} />
        </div>
      )}
    </div>
  );
}
