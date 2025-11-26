import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Zap, Wind, Eye, Wand2, Palette } from "lucide-react";
import type { CharacterData } from "@/pages/character-creation";

interface AppearanceStepProps {
  data: CharacterData;
  onChange: (data: Partial<CharacterData>) => void;
}

export default function AppearanceStep({ data, onChange }: AppearanceStepProps) {
  const [previewVariant, setPreviewVariant] = useState(0);

  const hornOptions = [
    { id: "curved", name: "Curved", description: "Classic spirals", emoji: "↪️" },
    { id: "straight", name: "Straight", description: "Menacing points", emoji: "↑" },
    { id: "spiral", name: "Spiral", description: "Hypnotic forms", emoji: "🌀" },
    { id: "broken", name: "Broken", description: "Battle-scarred", emoji: "⚔️" },
    { id: "crowned", name: "Crowned", description: "Royal bearing", emoji: "👑" },
    { id: "spiked", name: "Spiked", description: "Razor sharp", emoji: "💎" },
    { id: "none", name: "None", description: "Fully mortal", emoji: "✨" },
  ];

  const wingOptions = [
    { id: "none", name: "None", description: "Earthbound", emoji: "🚶" },
    { id: "bat", name: "Bat", description: "Leathery infernal", emoji: "🦇" },
    { id: "feathered", name: "Feathered", description: "Angelic remnants", emoji: "🪶" },
    { id: "tattered", name: "Tattered", description: "War-torn", emoji: "💔" },
    { id: "shadow", name: "Shadow", description: "Darkness form", emoji: "🌑" },
    { id: "ethereal", name: "Ethereal", description: "Otherworldly", emoji: "👻" },
    { id: "scaled", name: "Scaled", description: "Dragon-like", emoji: "🐉" },
  ];

  const eyeStyles = [
    { id: "human", name: "Human", description: "Deceivingly normal" },
    { id: "cat", name: "Feline", description: "Predatory slits" },
    { id: "serpent", name: "Serpent", description: "Hypnotic gaze" },
    { id: "void", name: "Void", description: "Empty darkness" },
    { id: "infernal", name: "Infernal", description: "Blazing flames" },
    { id: "celestial", name: "Celestial", description: "Shimmering light" },
    { id: "star", name: "Star", description: "Cosmic pupils" },
  ];

  const skinTones = [
    { id: "pale", name: "Pale", hex: "#E8C5A5" },
    { id: "olive", name: "Olive", hex: "#8B7355" },
    { id: "red", name: "Crimson", hex: "#8B3A3A" },
    { id: "purple", name: "Violet", hex: "#9370DB" },
    { id: "grey", name: "Ashen", hex: "#808080" },
    { id: "charcoal", name: "Charcoal", hex: "#3A3A3A" },
    { id: "bronze", name: "Bronze", hex: "#CD7F32" },
    { id: "emerald", name: "Emerald", hex: "#2D5016" },
  ];

  const bodyFrames = [
    { id: "lean", name: "Lean", description: "Nimble and swift" },
    { id: "athletic", name: "Athletic", description: "Balanced prowess" },
    { id: "muscular", name: "Muscular", description: "Raw power" },
    { id: "ethereal", name: "Ethereal", description: "Supernatural grace" },
    { id: "monstrous", name: "Monstrous", description: "Transformed beast" },
  ];

  const accents = [
    { id: "none", name: "None", emoji: "—" },
    { id: "scars", name: "Scars", emoji: "⚔️" },
    { id: "horns-crown", name: "Crown", emoji: "👑" },
    { id: "marks", name: "Runes", emoji: "✦" },
    { id: "flames", name: "Aura", emoji: "🔥" },
    { id: "thorns", name: "Thorns", emoji: "🌹" },
    { id: "biolume", name: "Glow", emoji: "💫" },
  ];

  const colorPalettes = [
    { name: "Classic Hell", colors: ["#8B0000", "#000000", "#FFD700"], desc: "Traditional evil" },
    { name: "Royal Purple", colors: ["#4B0082", "#800080", "#FFD700"], desc: "Regal power" },
    { name: "Toxic Green", colors: ["#00FF00", "#008000", "#000000"], desc: "Venomous" },
    { name: "Ice Blue", colors: ["#00BFFF", "#4169E1", "#FFFFFF"], desc: "Frozen" },
    { name: "Hot Pink", colors: ["#FF1493", "#800080", "#FFD700"], desc: "Seductive" },
    { name: "Shadow", colors: ["#2F2F2F", "#000000", "#8B0000"], desc: "Mysterious" },
    { name: "Hellfire", colors: ["#FF4500", "#8B0000", "#FFD700"], desc: "Burning" },
    { name: "Celestial", colors: ["#E6E6FA", "#9370DB", "#FFD700"], desc: "Fallen divine" },
    { name: "Obsidian", colors: ["#1a1a1a", "#4a0000", "#FFD700"], desc: "Pure darkness" },
    { name: "Bloodmoon", colors: ["#4a0000", "#1a0000", "#8B0000"], desc: "Crimson night" },
  ];

  const getPreviewDisplay = () => {
    const horns = hornOptions.find(h => h.id === data.appearance.horns);
    const wings = wingOptions.find(w => w.id === data.appearance.wings);
    return `${horns?.emoji || "?"} ${wings?.emoji || "?"}`;
  };

  const getPreviewColor = () => {
    const skinTone = skinTones.find(s => s.id === (data.appearance.horns === "curved" ? "pale" : "pale"));
    return data.appearance.colorPalette[0] || "#8B0000";
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-4 gap-1">
          <TabsTrigger value="features" className="gap-1 text-xs sm:text-sm">
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">Features</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-1 text-xs sm:text-sm">
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Body</span>
          </TabsTrigger>
          <TabsTrigger value="colors" className="gap-1 text-xs sm:text-sm">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Colors</span>
          </TabsTrigger>
          <TabsTrigger value="marks" className="gap-1 text-xs sm:text-sm">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Marks</span>
          </TabsTrigger>
        </TabsList>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-4 mt-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <Label className="text-base font-semibold">Horns</Label>
            </div>
            <p className="text-sm text-muted-foreground">Your demonic crown</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {hornOptions.map((horn) => (
                <Card
                  key={horn.id}
                  className={`p-3 cursor-pointer transition-all hover-elevate ${
                    data.appearance.horns === horn.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => onChange({
                    appearance: { ...data.appearance, horns: horn.id }
                  })}
                  data-testid={`button-horn-${horn.id}`}
                >
                  <div className="text-3xl text-center mb-2">{horn.emoji}</div>
                  <p className="font-semibold text-sm text-center">{horn.name}</p>
                  <p className="text-xs text-muted-foreground text-center">{horn.description}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-primary" />
              <Label className="text-base font-semibold">Wings</Label>
            </div>
            <p className="text-sm text-muted-foreground">Your path through the skies</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {wingOptions.map((wing) => (
                <Card
                  key={wing.id}
                  className={`p-3 cursor-pointer transition-all hover-elevate ${
                    data.appearance.wings === wing.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => onChange({
                    appearance: { ...data.appearance, wings: wing.id }
                  })}
                  data-testid={`button-wing-${wing.id}`}
                >
                  <div className="text-3xl text-center mb-2">{wing.emoji}</div>
                  <p className="font-semibold text-sm text-center">{wing.name}</p>
                  <p className="text-xs text-muted-foreground text-center">{wing.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-4 mt-4">
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Skin Tone
            </Label>
            <p className="text-sm text-muted-foreground">Choose your natural coloring</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
              {skinTones.map((tone) => (
                <Card
                  key={tone.id}
                  className="p-2 cursor-pointer transition-all hover-elevate h-16 flex items-center justify-center"
                  onClick={() => onChange({
                    appearance: {
                      ...data.appearance,
                      colorPalette: [tone.hex, data.appearance.colorPalette[1], data.appearance.colorPalette[2]]
                    }
                  })}
                  data-testid={`button-skin-${tone.id}`}
                  title={tone.name}
                >
                  <div
                    className="w-full h-full rounded border"
                    style={{ backgroundColor: tone.hex, borderColor: tone.hex }}
                  />
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Eye Style
            </Label>
            <p className="text-sm text-muted-foreground">The window to your soul</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {eyeStyles.map((style) => (
                <Card
                  key={style.id}
                  className={`p-3 cursor-pointer transition-all hover-elevate ${
                    data.appearance.horns === ("eyes-" + style.id) ? "ring-2 ring-primary" : ""
                  }`}
                  data-testid={`button-eyes-${style.id}`}
                >
                  <p className="font-semibold text-sm">{style.name}</p>
                  <p className="text-xs text-muted-foreground">{style.description}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-primary" />
              Body Frame
            </Label>
            <p className="text-sm text-muted-foreground">Your physical presence</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
              {bodyFrames.map((frame) => (
                <Card
                  key={frame.id}
                  className="p-3 cursor-pointer transition-all hover-elevate"
                  data-testid={`button-frame-${frame.id}`}
                >
                  <p className="font-semibold text-sm">{frame.name}</p>
                  <p className="text-xs text-muted-foreground">{frame.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-4 mt-4">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Color Palette
          </Label>
          <p className="text-sm text-muted-foreground">Your signature aesthetic</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {colorPalettes.map((palette) => (
              <Card
                key={palette.name}
                className={`p-3 cursor-pointer transition-all hover-elevate ${
                  JSON.stringify(data.appearance.colorPalette) === JSON.stringify(palette.colors)
                    ? "ring-2 ring-primary"
                    : ""
                }`}
                onClick={() => onChange({
                  appearance: { ...data.appearance, colorPalette: palette.colors }
                })}
                data-testid={`button-palette-${palette.name.toLowerCase().replace(' ', '-')}`}
              >
                <div className="flex gap-1 mb-2 h-8 rounded overflow-hidden">
                  {palette.colors.map((color, idx) => (
                    <div key={idx} className="flex-1" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <p className="text-xs font-semibold">{palette.name}</p>
                <p className="text-xs text-muted-foreground">{palette.desc}</p>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Marks Tab */}
        <TabsContent value="marks" className="space-y-4 mt-4">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Signature Accents
          </Label>
          <p className="text-sm text-muted-foreground">Distinguish yourself with unique marks</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {accents.map((accent) => (
              <Card
                key={accent.id}
                className={`p-4 cursor-pointer transition-all hover-elevate flex flex-col items-center justify-center gap-2 ${
                  data.appearance.horns === ("accent-" + accent.id) ? "ring-2 ring-primary" : ""
                }`}
                data-testid={`button-accent-${accent.id}`}
              >
                <div className="text-2xl">{accent.emoji}</div>
                <p className="text-xs font-semibold text-center">{accent.name}</p>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Preview Section */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-destructive/10 border-2 border-primary/30">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-lg">Your Demonic Form</CardTitle>
          <CardDescription>How Hell will recognize you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            {/* Main Preview Circle */}
            <div
              className="relative w-56 h-56 rounded-full border-4 border-primary flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-105 flex-col justify-center"
              style={{
                background: `linear-gradient(135deg, ${data.appearance.colorPalette[0]}, ${data.appearance.colorPalette[1]})`,
                boxShadow: `0 0 30px ${data.appearance.colorPalette[0]}60`
              }}
              onClick={() => setPreviewVariant((v) => (v + 1) % 3)}
              title="Click to cycle preview"
            >
              <div className="text-8xl drop-shadow-lg">{getPreviewDisplay()}</div>
              <div className="text-xs text-center mt-4 opacity-75 font-semibold">Click to cycle</div>
            </div>

            {/* Summary Badges */}
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary">
                {hornOptions.find(h => h.id === data.appearance.horns)?.name}
              </Badge>
              <Badge variant="secondary">
                {wingOptions.find(w => w.id === data.appearance.wings)?.name}
              </Badge>
              <Badge variant="secondary">
                {colorPalettes.find(p => JSON.stringify(p.colors) === JSON.stringify(data.appearance.colorPalette))?.name || "Custom"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
