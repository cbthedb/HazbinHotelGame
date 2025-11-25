import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<"intro" | "title" | "pentagram" | "fade">("intro");
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Phase timeline
    const timings = {
      intro: 800,
      title: 2000,
      pentagram: 1500,
      fade: 1500
    };

    const timer1 = setTimeout(() => setPhase("title"), timings.intro);
    const timer2 = setTimeout(() => setPhase("pentagram"), timings.intro + timings.title);
    const timer3 = setTimeout(() => setPhase("fade"), timings.intro + timings.title + timings.pentagram);
    const timer4 = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => onComplete(), 1000);
    }, timings.intro + timings.title + timings.pentagram + timings.fade);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden transition-opacity duration-1000 z-50 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Background animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/40 via-black to-black opacity-80"></div>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-600 rounded-full opacity-0"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-8">
        {/* Intro Text - appears and fades */}
        {(phase === "intro" || phase === "title" || phase === "pentagram" || phase === "fade") && (
          <div
            className={`text-center space-y-4 transition-all duration-1000 ${
              phase === "intro" ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <p className="text-red-500 text-lg font-display tracking-widest animate-pulse">
              WELCOME TO HELL
            </p>
          </div>
        )}

        {/* Title - slides in and grows */}
        {(phase === "title" || phase === "pentagram" || phase === "fade") && (
          <div
            className={`transition-all duration-1500 ${
              phase === "title"
                ? "opacity-100 scale-100"
                : phase === "pentagram" || phase === "fade"
                ? "opacity-100 scale-100"
                : "opacity-0 scale-50"
            }`}
          >
            <h1 className="font-display text-7xl md:text-8xl font-black text-primary text-center tracking-tighter drop-shadow-2xl">
              HAZBIN
            </h1>
            <h2 className="font-display text-5xl md:text-6xl font-black text-accent text-center tracking-tight drop-shadow-lg">
              LIFE CYCLE
            </h2>
          </div>
        )}

        {/* Pentagram animation */}
        {(phase === "pentagram" || phase === "fade") && (
          <div
            className={`relative w-48 h-48 flex items-center justify-center transition-all duration-1000 ${
              phase === "pentagram"
                ? "opacity-100 scale-100 rotate-0"
                : phase === "fade"
                ? "opacity-50 scale-110 rotate-45"
                : "opacity-0 scale-50"
            }`}
          >
            {/* Pentagram star */}
            <div className="absolute text-6xl text-accent animate-pulse">✦</div>
            
            {/* Rotating circles */}
            <div className="absolute inset-0 border-2 border-red-600/30 rounded-full animate-spin" style={{ animationDuration: "8s" }}></div>
            <div className="absolute inset-4 border-2 border-accent/30 rounded-full" style={{ animation: "spin 12s linear reverse infinite" }}></div>
            <div className="absolute inset-8 border-2 border-red-500/20 rounded-full animate-spin" style={{ animationDuration: "16s" }}></div>
          </div>
        )}

        {/* Tagline - fades in at end */}
        {(phase === "fade" || phase === "pentagram") && (
          <div
            className={`text-center space-y-2 transition-all duration-1000 ${
              phase === "fade" ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="text-gold text-xl font-display tracking-widest">
              RISE FROM SINNER TO OVERLORD
            </p>
            <p className="text-muted-foreground text-sm">
              Your legend begins...
            </p>
          </div>
        )}
      </div>

      {/* Bottom loading bar */}
      <div className="absolute bottom-12 w-64 h-1 bg-card rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-red-600 via-accent to-red-600 rounded-full"
          style={{
            animation: `progress 4s ease-in-out forwards`
          }}
        ></div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0; }
          50% { transform: translateY(-30px); opacity: 0.8; }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
