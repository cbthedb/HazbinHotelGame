import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CharacterData } from "@/pages/character-creation";

interface AppearanceStepProps {
  data: CharacterData;
  onChange: (data: Partial<CharacterData>) => void;
}

export default function AppearanceStep({ data, onChange }: AppearanceStepProps) {
  const hornOptions = ["curved", "straight", "spiral", "broken", "none"];
  const wingOptions = ["none", "bat", "feathered", "tattered", "shadow"];
  
  const colorPalettes = [
    { name: "Classic Hell", colors: ["#8B0000", "#000000", "#FFD700"] },
    { name: "Royal Purple", colors: ["#4B0082", "#800080", "#FFD700"] },
    { name: "Toxic Green", colors: ["#00FF00", "#008000", "#000000"] },
    { name: "Ice Blue", colors: ["#00BFFF", "#4169E1", "#FFFFFF"] },
    { name: "Hot Pink", colors: ["#FF1493", "#800080", "#FFD700"] },
    { name: "Shadow", colors: ["#2F2F2F", "#000000", "#8B0000"] },
  ];

  return (
    <div className="space-y-6">
      {/* Horns */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Horns</Label>
        <div className="grid grid-cols-5 gap-2">
          {hornOptions.map((horn) => (
            <Button
              key={horn}
              variant={data.appearance.horns === horn ? "default" : "outline"}
              onClick={() => onChange({
                appearance: { ...data.appearance, horns: horn }
              })}
              className="capitalize"
              data-testid={`button-horn-${horn}`}
            >
              {horn}
            </Button>
          ))}
        </div>
      </div>

      {/* Wings */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Wings</Label>
        <div className="grid grid-cols-5 gap-2">
          {wingOptions.map((wing) => (
            <Button
              key={wing}
              variant={data.appearance.wings === wing ? "default" : "outline"}
              onClick={() => onChange({
                appearance: { ...data.appearance, wings: wing }
              })}
              className="capitalize"
              data-testid={`button-wing-${wing}`}
            >
              {wing}
            </Button>
          ))}
        </div>
      </div>

      {/* Color Palette */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Color Palette</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                    className="flex-1 h-8 rounded"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="text-xs font-semibold text-center">{palette.name}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Preview */}
      <Card className="p-6 bg-gradient-to-b from-card to-background border-2 border-card-border">
        <div className="text-center space-y-4">
          <div className="w-32 h-32 mx-auto rounded-full border-4 border-primary flex items-center justify-center" 
               style={{ 
                 background: `linear-gradient(135deg, ${data.appearance.colorPalette[0]}, ${data.appearance.colorPalette[1]})` 
               }}>
            <div className="text-6xl">👹</div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-muted-foreground">Your Demon Form</p>
            <p className="text-xs text-muted-foreground capitalize">
              {data.appearance.horns} horns • {data.appearance.wings} wings
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
