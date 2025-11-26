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
import SocialPanel from "@/components/game/social-panel";
import MapPanel from "@/components/game/map-panel";
import RankingPanel from "@/components/game/ranking-panel";
import LocationPanel from "@/components/game/location-panel";
import ActivitiesPanel from "@/components/game/activities-panel";
import BattlePanel from "@/components/game/battle-panel";
import ProgressionPanel from "@/components/game/progression-panel";
import ShopPanel from "@/components/game/shop-panel-collapsible";
import MythicalShardShop from "@/components/game/mythical-shard-shop";
import AnimatedLoading from "@/components/game/animated-loading";
import NPCBattle from "@/components/game/npc-battle";
import RivalChallengeModal from "@/components/game/rival-challenge-modal";
import CompanionSelector from "@/components/game/companion-selector";
import { updateRelationship } from "@/lib/relationshipSystem";
import { Menu, X, LogOut, Save } from "lucide-react";
import { loadLatestSave, saveGame } from "@/lib/game-state";
import { initAudio, playLocationMusic } from "@/lib/audio";
import type { GameState } from "@/lib/game-state";
import npcsData from "@/data/npcs.json";

export default function GamePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentEvent, setCurrentEvent] = useState<any | null>(null);
  const [inBattle, setInBattle] = useState<{ opponent: string; district: string } | null>(null);
  const [inNpcBattle, setInNpcBattle] = useState<string | null>(null);
  const [rivalChallenge, setRivalChallenge] = useState<string | null>(null);
  const [selectingCompanion, setSelectingCompanion] = useState(false);
  const [selectedCompanion, setSelectedCompanion] = useState<string | null>(null);
  const VERSION = "V0.1";

  // Load game on mount and initialize audio
  useEffect(() => {
    const init = async () => {
      initAudio();
      playLocationMusic("background"); // Play Stayed Gone as background music
      
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

  // Switch music based on battle state
  useEffect(() => {
    if (!inBattle) {
      playLocationMusic("background"); // Back to background music after battle
    }
    // Don't call playLocationMusic("battle") here - let BattlePanel handle battle themes
  }, [inBattle]);

  const handleBattleEnd = async (won: boolean, rewards: any, affinityChanges?: Record<string, number>) => {
    if (!gameState || !inBattle) return;

    const newRelationships = { ...gameState.relationships };
    if (affinityChanges) {
      Object.entries(affinityChanges).forEach(([npcId, change]) => {
        if (newRelationships[npcId]) {
          newRelationships[npcId] = updateRelationship(newRelationships[npcId], change);
        }
      });
    }

    const updatedCharacter = { ...gameState.character };
    Object.entries(rewards).forEach(([key, value]) => {
      if (key in updatedCharacter && typeof value === 'number') {
        const current = updatedCharacter[key as keyof typeof updatedCharacter];
        if (typeof current === 'number') {
          let newValue: number;
          if (key === 'health') {
            newValue = Math.max(0, Math.min(100, current + value));
          } else {
            newValue = Math.max(0, current + value);
          }
          (updatedCharacter[key as keyof typeof updatedCharacter] as any) = newValue;
        }
      }
    });

    const newGameState = {
      ...gameState,
      character: updatedCharacter,
      relationships: newRelationships
    };

    setGameState(newGameState);
    await saveGame(newGameState, gameState.slot);
    setInBattle(null);
    setSelectedCompanion(null);

    const verb = won ? "defeated" : "lost to";
    toast({ 
      title: `Battle Complete`, 
      description: `You ${verb} your opponent!` 
    });
  };

  const handleNpcBattleEnd = async (won: boolean, affinityChange: number, rewards: any) => {
    if (!gameState) return;

    // Handle both inNpcBattle and rivalChallenge battle endings
    const npcId = inNpcBattle || rivalChallenge;
    if (!npcId) return;

    const newRelationships = { ...gameState.relationships };
    if (newRelationships[npcId]) {
      newRelationships[npcId] = updateRelationship(newRelationships[npcId], affinityChange);
    }

    const updatedCharacter = { ...gameState.character };
    Object.entries(rewards).forEach(([key, value]) => {
      if (key in updatedCharacter && typeof value === 'number') {
        const current = updatedCharacter[key as keyof typeof updatedCharacter];
        if (typeof current === 'number') {
          let newValue: number;
          if (key === 'health') {
            newValue = Math.max(0, Math.min(100, current + value));
          } else {
            newValue = Math.max(0, current + value);
          }
          (updatedCharacter[key as keyof typeof updatedCharacter] as any) = newValue;
        }
      }
    });

    const newGameState = {
      ...gameState,
      character: updatedCharacter,
      relationships: newRelationships
    };

    setGameState(newGameState);
    await saveGame(newGameState, gameState.slot);
    setInNpcBattle(null);

    const verb = won ? "defeated" : "lost to";
    const npc = (npcsData as any[]).find((n: any) => n.id === inNpcBattle);
    toast({ 
      title: `You ${verb} ${npc?.name}!`, 
      description: `Affinity: ${affinityChange > 0 ? "+" : ""}${affinityChange}` 
    });
  };

  const handleMendRelationship = async () => {
    if (!gameState || !rivalChallenge) return;

    const newRelationships = { ...gameState.relationships };
    if (newRelationships[rivalChallenge]) {
      // Mending costs influence but increases affinity
      newRelationships[rivalChallenge].affinity += 20;
      newRelationships[rivalChallenge].isRival = newRelationships[rivalChallenge].affinity < -30;
    }

    const updatedCharacter = {
      ...gameState.character,
      influence: Math.max(0, (gameState.character.influence || 0) - 10)
    };

    const newGameState = {
      ...gameState,
      character: updatedCharacter,
      relationships: newRelationships
    };

    setGameState(newGameState);
    await saveGame(newGameState, gameState.slot);
    setRivalChallenge(null);
    toast({ title: "Reconciliation", description: "You've begun mending this relationship." });
  };

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
      // Level up! Gain +2 health and +0-1 to random stats (much grindier)
      levelUpBonus.health = 2;
      const statChoices = ['power', 'control', 'influence'];
      const shouldGainStat = Math.random() < 0.3; // 30% chance for random stat
      if (shouldGainStat) {
        const stat = statChoices[Math.floor(Math.random() * statChoices.length)] as keyof typeof levelUpBonus;
        levelUpBonus[stat] = 1;
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

    // Check for rival challenges (10% chance per turn if rivals exist)
    const hasRivals = Object.values(gameState.relationships).some(r => r.isRival);
    if (hasRivals && Math.random() < 0.1) {
      const rivals = Object.entries(gameState.relationships)
        .filter(([, r]) => r.isRival)
        .map(([id]) => id);
      
      if (rivals.length > 0) {
        const randomRival = rivals[Math.floor(Math.random() * rivals.length)];
        setRivalChallenge(randomRival);
      }
    }

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

  const handleUpdateGameState = async (updates: Partial<GameState>) => {
    if (!gameState) return;
    
    const updatedState: GameState = {
      ...gameState,
      ...updates
    };
    
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
    // NOTE: NOT saving to localStorage - wealth shop purchases are session-only, not persistent
    // Only mythical shard purchases (handlePurchaseMythical) persist globally
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card">
      {/* Version Indicator */}
      <div className="fixed top-4 right-4 z-40 text-sm font-bold text-primary animate-pulse" 
           style={{textShadow: '0 0 10px rgba(239, 68, 68, 0.8)', letterSpacing: '2px'}}>
        {VERSION}
      </div>

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

        {/* Center Column - Events & Actions & Social */}
        <div className="lg:col-span-2 space-y-4 overflow-y-auto">
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 border-l-4 border-primary rounded p-3 text-sm font-semibold text-amber-100">
            ⚡ CURRENT EVENT
          </div>
          <EventCard 
            gameState={gameState} 
            onUpdateCharacter={handleUpdateCharacter}
            onUpdateGameState={handleUpdateGameState}
          />
          <ActionsPanel 
            onNextTurn={handleNextTurn} 
            gameState={gameState} 
            onUpdateCharacter={handleUpdateCharacter} 
          />
          <MapPanel territories={gameState.territory} />
          <SocialPanel 
            gameState={gameState}
            onUpdateGameState={handleUpdateGameState}
          />
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
            onBattleStart={(opponent, district) => {
              setInBattle({ opponent, district });
              setSelectingCompanion(true);
            }}
            onUpdateGameState={handleUpdateGameState}
          />
        </div>
      </div>

      {/* Right Sidebar - NPCs & Info (conditional) */}
      {showMenu && (
        <div className="fixed inset-y-0 right-0 w-80 bg-card border-l border-card-border p-4 overflow-y-auto z-40">
          <NPCPanel relationships={gameState.relationships} />
        </div>
      )}

      {/* Overlord/Rival Battle with Companion Selection */}
      {selectingCompanion && inBattle && (
        <CompanionSelector
          gameState={gameState}
          onSelectCompanion={(companion) => {
            setSelectedCompanion(companion);
            setSelectingCompanion(false);
          }}
          onContinue={() => setSelectingCompanion(false)}
        />
      )}

      {inBattle && !selectingCompanion && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <BattlePanel
            gameState={gameState}
            opponent={inBattle.opponent}
            currentDistrict={inBattle.district}
            companion={selectedCompanion}
            onBattleEnd={handleBattleEnd}
          />
        </div>
      )}

      {/* NPC Battle Modal */}
      {inNpcBattle && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <NPCBattle
            npcId={inNpcBattle}
            gameState={gameState}
            onBattleEnd={handleNpcBattleEnd}
          />
        </div>
      )}

      {/* Rival Challenge Modal */}
      {rivalChallenge && (
        <RivalChallengeModal
          npcId={rivalChallenge}
          gameState={gameState}
          onFight={() => {
            setInBattle({ opponent: rivalChallenge, district: "pride-ring" });
            setSelectingCompanion(true);
            setRivalChallenge(null);
          }}
          onFightWithCompanion={() => {
            setInBattle({ opponent: rivalChallenge, district: "pride-ring" });
            setSelectingCompanion(true);
            setRivalChallenge(null);
          }}
          onMend={handleMendRelationship}
          onDismiss={() => setRivalChallenge(null)}
        />
      )}
    </div>
  );
}
