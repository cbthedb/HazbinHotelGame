import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Save, Info } from "lucide-react";
import SplashScreen from "@/components/splash-screen";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (!showSplash) {
      setFadeIn(true);
    }
  }, [showSplash]);

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
            disabled
            data-testid="button-continue"
          >
            <Save className="w-5 h-5" />
            Continue
          </Button>

          <Button 
            variant="outline"
            className="w-full gap-2 min-h-12"
            size="lg"
            disabled
            data-testid="button-load-game"
          >
            Load Game
          </Button>
        </Card>

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
