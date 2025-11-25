import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Save, Info, Trash2 } from "lucide-react";
import SplashScreen from "@/components/splash-screen";
import { loadGame, getAllSaves, deleteGame, deleteAllSaves, loadLatestSave } from "@/lib/game-state";
import type { SaveSlot } from "@/lib/game-state";

export default function Home() {
  const [, setLocation] = useLocation();
  const [showSplash, setShowSplash] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const [saves, setSaves] = useState<SaveSlot[]>([]);
  const [showLoadDialog, setShowLoadDialog] = useState(false);

  useEffect(() => {
    if (!showSplash) {
      setFadeIn(true);
    }
  }, [showSplash]);

  // Check for saved games on mount
  useEffect(() => {
    const allSaves = getAllSaves();
    setSaves(allSaves);
  }, []);

  const handleContinue = async () => {
    const latest = await loadLatestSave();
    if (latest) {
      setLocation("/game");
    }
  };

  const handleLoadGame = async (slot: number) => {
    const save = await loadGame(slot);
    if (save) {
      setShowLoadDialog(false);
      setLocation("/game");
    }
  };

  const handleDeleteSave = (slot: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteGame(slot);
    setSaves(getAllSaves());
  };

  const handleClearAllSaves = async () => {
    if (confirm("Are you sure? This will delete ALL saves and give you a fresh start.")) {
      await deleteAllSaves();
      setSaves([]);
      setShowLoadDialog(false);
    }
  };

  const hasSaves = saves.length > 0;

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-background via-card to-background flex items-center justify-center p-4 transition-opacity duration-1000 ${fadeIn ? "opacity-100" : "opacity-0"}`}>
      <div className="w-full max-w-2xl space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-primary tracking-tight">
            Hazbin Hotel
          </h1>
          <h2 className="font-display text-2xl md:text-3xl text-muted-foreground">
            Life in Hell
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mt-4">
            Live your demon life. Rise from sinner to overlord. Claim territories across the Pentagram. Shape your destiny.
          </p>
        </div>

        {/* Main Menu */}
        <Card className="p-8 space-y-4 border-2 border-card-border hover-elevate">
          <Link href="/character-creation" data-testid="link-new-game">
            <Button 
              className="w-full gap-2 min-h-12 text-lg font-semibold"
              size="lg"
              data-testid="button-new-game"
            >
              <Play className="w-5 h-5" />
              New Game
            </Button>
          </Link>

          <Button 
            variant="secondary"
            className="w-full gap-2 min-h-12 text-lg"
            size="lg"
            disabled={!hasSaves}
            onClick={handleContinue}
            data-testid="button-continue"
          >
            <Save className="w-5 h-5" />
            {hasSaves ? "Continue" : "No Save Available"}
          </Button>

          <Button 
            variant="outline"
            className="w-full gap-2 min-h-12"
            size="lg"
            disabled={!hasSaves}
            onClick={() => setShowLoadDialog(true)}
            data-testid="button-load-game"
          >
            Load Game ({saves.length}/5)
          </Button>
        </Card>

        {/* Save Selection Dialog */}
        <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Select Save</DialogTitle>
              <DialogDescription>Choose a save to load</DialogDescription>
            </DialogHeader>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {saves.length === 0 ? (
                <p className="text-center text-muted-foreground">No saves available</p>
              ) : (
                <>
                  {saves.map((save) => (
                    <Card 
                      key={save.slot}
                      className="p-3 cursor-pointer hover-elevate"
                      onClick={() => handleLoadGame(save.slot)}
                      data-testid={`button-load-slot-${save.slot}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{save.characterName}</p>
                          <p className="text-xs text-muted-foreground">Slot {save.slot} • Turn {save.gameState.turn}</p>
                          <p className="text-xs text-muted-foreground">{new Date(save.timestamp).toLocaleString()}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleDeleteSave(save.slot, e)}
                          data-testid={`button-delete-slot-${save.slot}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                  <Button
                    variant="destructive"
                    className="w-full mt-4"
                    onClick={handleClearAllSaves}
                    data-testid="button-clear-all-saves"
                  >
                    Clear All Saves
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Info Footer */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Info className="w-4 h-4" />
            A BitLife-style experience set in the Hazbin Hotel universe
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>Power • Corruption • Redemption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
