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
import BattlePanel from "@/components/game/battle-panel";
import ProgressionPanel from "@/components/game/progression-panel";
import ShopPanel from "@/components/game/shop-panel-collapsible";
import MythicalShardShop from "@/components/game/mythical-shard-shop";
import AnimatedLoading from "@/components/game/animated-loading";
import { Menu, X, LogOut, Save } from "lucide-react";
import { loadLatestSave, saveGame } from "@/lib/game-state";
import { initAudio, playLocationMusic } from "@/lib/audio";
import type { GameState } from "@/lib/game-state";

export default function GamePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentEvent, setCurrentEvent] = useState<any | null>(null);
  const [inBattle, setInBattle] = useState<{ opponent: string; district: string } | null>(null);

  // Load game on mount and initialize audio
  useEffect(() => {
    const init = async () => {
      initAudio();
      playLocationMusic("hotel-lobby");
      
      const saved = await loadLatestSave();
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

    const newAge = gameState.character.age + 1;
    const previousLevel = Math.floor(gameState.character.age / 5);
    const newLevel = Math.floor(newAge / 5);
    
    // Calculate stat bonuses from leveling (every 5 age = +1 level)
    let levelUpBonus = {
      power: 0,
      control: 0,
      influence: 0,
      health: 0
    };
    
    if (newLevel > previousLevel) {
      // Level up! Gain +5 health and +1-2 to random stats
      levelUpBonus.health = 5;
      const statChoices = ['power', 'control', 'influence'];
      for (let i = 0; i < 2; i++) {
        const stat = statChoices[Math.floor(Math.random() * statChoices.length)] as keyof typeof levelUpBonus;
        levelUpBonus[stat] = (levelUpBonus[stat] || 0) + 1;
      }
    }

    const updatedCharacter = {
      ...gameState.character,
      age: newAge,
      // Passive health regeneration: restore 5 health per turn (max 100)
      health: Math.min(100, gameState.character.health + 5 + levelUpBonus.health),
      // Apply level-up bonuses (no caps on stats)
      power: gameState.character.power + levelUpBonus.power,
      control: gameState.character.control + levelUpBonus.control,
      influence: gameState.character.influence + levelUpBonus.influence
    };

    const updatedState: GameState = {
      ...gameState,
      turn: gameState.turn + 1,
      character: updatedCharacter
    };
    
    setGameState(updatedState);
    await saveGame(updatedState, gameState.slot);
    
    // Show level-up message if applicable
    if (newLevel > previousLevel) {
      toast({ 
        title: "Level Up!", 
        description: `You've reached level ${newLevel}! +${levelUpBonus.health} Health, +${levelUpBonus.power} Power, +${levelUpBonus.control} Control, +${levelUpBonus.influence} Influence` 
      });
    } else {
      toast({ title: "Turn Advanced", description: `Now on turn ${updatedState.turn} (Age: ${newAge}, Level: ${newLevel})` });
    }
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

    console.log(`[GameUpdate] Slot: ${gameState.slot}, Old SC: ${gameState.character.soulcoins}, New SC: ${updatedState.character.soulcoins}`);
    setGameState(updatedState);
    await saveGame(updatedState, gameState.slot);
  };

  const handleQuitGame = () => {
    setLocation("/");
  };

  const handleSaveGame = async () => {
    if (!gameState) return;
    await saveGame(gameState, gameState.slot);
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

  const handleBattleEnd = async (won: boolean, rewards: any) => {
    if (gameState) {
      let newPowers = [...(gameState.character.powers || [])];
      let victoryMsg = "You won the battle!";
      let mythicalShardsGained = 0;
      
      // Add overlord power if reward includes it
      if (won && rewards.overlordPower && !newPowers.includes(rewards.overlordPower)) {
        newPowers.push(rewards.overlordPower);
        victoryMsg += ` You learned a new power!`;
      }

      // Get mythical shard from overlord defeats (15% chance)
      if (won && rewards.isMythical) {
        mythicalShardsGained = 1;
        victoryMsg += ` You obtained a Mythical Shard!`;
      }

      const updatedCharacter = {
        ...gameState.character,
        power: Math.max(0, (gameState.character.power || 0) + (rewards.power || 0)),
        influence: Math.max(0, (gameState.character.influence || 0) + (rewards.influence || 0)),
        wealth: Math.max(0, (gameState.character.wealth || 0) + (rewards.wealth || 0)),
        soulcoins: Math.max(0, (gameState.character.soulcoins || 0) + (rewards.soulcoins || 0)),
        health: Math.max(0, Math.min(100, (gameState.character.health || 100) + (rewards.health || 0))),
        powers: newPowers,
        mythicalShards: (gameState.character.mythicalShards || 0) + mythicalShardsGained
      };

      // Add cooldown for duel-rival (challenge-overlord has no cooldown)
      const newCooldowns = { ...gameState.actionCooldowns };
      if (rewards.isRivalDuel) {
        newCooldowns["duel-rival"] = gameState.turn + 1 + 5; // 5 turn cooldown after duel
      }

      const updatedState: GameState = {
        ...gameState,
        character: updatedCharacter,
        actionCooldowns: newCooldowns,
        turn: gameState.turn + 1
      };

      setGameState(updatedState);
      await saveGame(updatedState);
      setInBattle(null);
      
      toast({
        title: won ? "Victory!" : "Defeat!",
        description: victoryMsg,
        variant: won ? "default" : "destructive"
      });
    }
  };

  const handlePurchasePower = async (powerIds: string[], wealthSpent: number) => {
    if (!gameState) return;

    const updatedCharacter = {
      ...gameState.character,
      powers: [...(gameState.character.powers || []), ...powerIds],
      wealth: Math.max(0, (gameState.character.wealth || 0) - wealthSpent)
    };

    const updatedState: GameState = {
      ...gameState,
      character: updatedCharacter
    };

    setGameState(updatedState);
    await saveGame(updatedState);
  };

  const handlePurchaseMythical = async (powerId: string, shardsSpent: number) => {
    if (!gameState) return;

    const updatedCharacter = {
      ...gameState.character,
      powers: [...(gameState.character.powers || []), powerId],
      mythicalShards: Math.max(0, (gameState.character.mythicalShards || 0) - shardsSpent)
    };

    const updatedState: GameState = {
      ...gameState,
      character: updatedCharacter
    };

    setGameState(updatedState);
    await saveGame(updatedState);
    toast({ title: "Mythical Power Acquired!", description: "Your power has been unlocked!" });
  };

  const { character } = gameState;

  if (inBattle) {
    return (
      <BattlePanel
        gameState={gameState}
        opponent={inBattle.opponent}
        currentDistrict={inBattle.district}
        onBattleEnd={handleBattleEnd}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-card-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-display text-2xl font-bold text-primary">
              {character.name}
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
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-4 lg:h-[calc(100vh-120px)]">
        {/* Left Column - Stats & Powers & Ranking & Progression & Shop & Mythical Shop */}
        <div className="space-y-4 overflow-y-auto">
          <StatsPanel character={character} />
          <PowersPanel gameState={gameState} />
          <ShopPanel gameState={gameState} onPurchasePower={handlePurchasePower} />
          <MythicalShardShop gameState={gameState} onPurchaseMythical={handlePurchaseMythical} />
          <RankingPanel gameState={gameState} />
          <ProgressionPanel gameState={gameState} />
        </div>

        {/* Center Column - Events & Actions */}
        <div className="lg:col-span-2 space-y-4 overflow-y-auto">
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 border-l-4 border-primary rounded p-3 text-sm font-semibold text-amber-100">
            ⚡ CURRENT EVENT
          </div>
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
        <div className="space-y-4 overflow-y-auto">
          <LocationPanel 
            gameState={gameState}
            onUpdateCharacter={handleUpdateCharacter}
          />
          <ActivitiesPanel 
            gameState={gameState}
            onUpdateCharacter={handleUpdateCharacter}
            onEventGenerated={setCurrentEvent}
            onBattleStart={(opponent, district) => setInBattle({ opponent, district })}
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
