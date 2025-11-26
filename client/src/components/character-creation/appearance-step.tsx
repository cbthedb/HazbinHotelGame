import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Wind } from "lucide-react";
import type { CharacterData } from "@/pages/character-creation";

interface AppearanceStepProps {
  data: CharacterData;
  onChange: (data: Partial<CharacterData>) => void;
}

export default function AppearanceStep({ data, onChange }: AppearanceStepProps) {
  const [previewRotation, setPreviewRotation] = useState(0);

  const hornOptions = [
    { id: "curved", name: "Curved", description: "Classic demon spirals", icon: "🔙" },
    { id: "straight", name: "Straight", description: "Menacing and sharp", icon: "⬆️" },
    { id: "spiral", name: "Spiral", description: "Hypnotic and mesmerizing", icon: "🌀" },
    { id: "broken", name: "Broken", description: "Battle-scarred veteran", icon: "⚔️" },
    { id: "none", name: "None", description: "Fully human appearance", icon: "🧑" },
  ];

  const wingOptions = [
    { id: "none", name: "None", description: "Ground dweller", icon: "🚶" },
    { id: "bat", name: "Bat", description: "Classic infernal wings", icon: "🦇" },
    { id: "feathered", name: "Feathered", description: "Fallen angel remnant", icon: "🪶" },
    { id: "tattered", name: "Tattered", description: "Worn by endless conflict", icon: "💔" },
    { id: "shadow", name: "Shadow", description: "Made of pure darkness", icon: "🌑" },
  ];

  const colorPalettes = [
    { name: "Classic Hell", colors: ["#8B0000", "#000000", "#FFD700"], description: "Traditional demonology" },
    { name: "Royal Purple", colors: ["#4B0082", "#800080", "#FFD700"], description: "Regal and commanding" },
    { name: "Toxic Green", colors: ["#00FF00", "#008000", "#000000"], description: "Poisonous allure" },
    { name: "Ice Blue", colors: ["#00BFFF", "#4169E1", "#FFFFFF"], description: "Frozen majesty" },
    { name: "Hot Pink", colors: ["#FF1493", "#800080", "#FFD700"], description: "Seductive charm" },
    { name: "Shadow", colors: ["#2F2F2F", "#000000", "#8B0000"], description: "Shrouded mystery" },
    { name: "Hellfire", colors: ["#FF4500", "#8B0000", "#FFD700"], description: "Burning intensity" },
    { name: "Celestial", colors: ["#E6E6FA", "#9370DB", "#FFD700"], description: "Divine corruption" },
  ];

  const getAppearanceDisplay = () => {
    const horn = hornOptions.find(h => h.id === data.appearance.horns);
    const wing = wingOptions.find(w => w.id === data.appearance.wings);
    return `${horn?.icon} ${wing?.icon}`;
  };

  return (
    <div className="space-y-6">
      {/* Horns Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <Label className="text-base font-semibold">Horns</Label>
        </div>
        <p className="text-sm text-muted-foreground">Your demonic identity starts here</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {hornOptions.map((horn) => (
            <Button
              key={horn.id}
              variant={data.appearance.horns === horn.id ? "default" : "outline"}
              onClick={() => onChange({
                appearance: { ...data.appearance, horns: horn.id }
              })}
              className="h-auto flex flex-col gap-1 py-3 px-2"
              data-testid={`button-horn-${horn.id}`}
            >
              <span className="text-xl">{horn.icon}</span>
              <span className="font-semibold text-sm">{horn.name}</span>
              <span className="text-xs opacity-75">{horn.description}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Wings Section */}
      <div className="space-y-3 pt-4 border-t">
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-primary" />
          <Label className="text-base font-semibold">Wings</Label>
        </div>
        <p className="text-sm text-muted-foreground">Define your aerial prowess</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {wingOptions.map((wing) => (
            <Button
              key={wing.id}
              variant={data.appearance.wings === wing.id ? "default" : "outline"}
              onClick={() => onChange({
                appearance: { ...data.appearance, wings: wing.id }
              })}
              className="h-auto flex flex-col gap-1 py-3 px-2"
              data-testid={`button-wing-${wing.id}`}
            >
              <span className="text-xl">{wing.icon}</span>
              <span className="font-semibold text-sm">{wing.name}</span>
              <span className="text-xs opacity-75">{wing.description}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Colors Section */}
      <div className="space-y-3 pt-4 border-t">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <Label className="text-base font-semibold">Color Palette</Label>
        </div>
        <p className="text-sm text-muted-foreground">Choose your signature colors that define your aesthetic</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {colorPalettes.map((palette) => (
            <Card
              key={palette.name}
              className={`p-3 cursor-pointer transition-all hover-elevate ${
                JSON.stringify(data.appearance.colorPalette) === JSON.stringify(palette.colors)
                  ? "ring-2 ring-primary border-primary"
                  : "border-card-border"
              }`}
              onClick={() => onChange({
                appearance: { ...data.appearance, colorPalette: palette.colors }
              })}
              data-testid={`button-palette-${palette.name.toLowerCase().replace(' ', '-')}`}
            >
              <div className="flex gap-1 mb-2">
                {palette.colors.map((color, idx) => (
                  <div
                    key={idx}
                    className="flex-1 h-6 rounded"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="text-xs font-semibold">{palette.name}</p>
              <p className="text-xs text-muted-foreground">{palette.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Preview Section */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-destructive/10 border-2 border-primary/30 mt-6">
        <CardHeader className="text-center pb-3">
          <CardTitle className="text-lg">Your Demonic Visage</CardTitle>
          <CardDescription>This is how Hell will know you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            {/* Main Preview */}
            <div
              className="relative w-48 h-48 rounded-full border-4 border-primary flex items-center justify-center transition-transform duration-300 cursor-pointer hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${data.appearance.colorPalette[0]}, ${data.appearance.colorPalette[1]})`,
                boxShadow: `0 0 20px ${data.appearance.colorPalette[0]}40`
              }}
              onClick={() => setPreviewRotation((r) => (r + 15) % 360)}
              title="Click to rotate"
            >
              <div className="text-7xl transform transition-transform" style={{ transform: `rotate(${previewRotation}deg)` }}>
                {getAppearanceDisplay() || "👤"}
              </div>
            </div>

            {/* Character Summary */}
            <div className="w-full text-center space-y-2">
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary">
                  {hornOptions.find(h => h.id === data.appearance.horns)?.name} Horns
                </Badge>
                <Badge variant="secondary">
                  {wingOptions.find(w => w.id === data.appearance.wings)?.name} Wings
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Click the preview to rotate your appearance
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
