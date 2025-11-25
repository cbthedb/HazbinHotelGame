import { useEffect, useState } from "react";

export default function AnimatedLoading() {
  const [dots, setDots] = useState(".");
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === ".") return "..";
        if (prev === "..") return "...";
        return ".";
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-8">
      {/* Animated red/gold circles */}
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 animate-spin border-4 border-transparent border-t-primary border-r-accent rounded-full"></div>
        <div className="absolute inset-2 animate-spin border-4 border-transparent border-b-primary border-l-accent rounded-full" style={{ animationDirection: "reverse", animationDuration: "2s" }}></div>
        <div className="absolute inset-4 flex items-center justify-center">
          <div className="text-primary text-3xl font-bold">✦</div>
        </div>
      </div>
      
      {/* Text */}
      <div className="text-center space-y-4">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Descending into Hell{dots}
        </h1>
        <p className="text-muted-foreground text-lg">
          Preparing your hellish adventure
        </p>
      </div>
      
      {/* Progress bar */}
      <div className="w-64 h-1 bg-card rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary to-accent animate-pulse"></div>
      </div>
    </div>
  );
}
