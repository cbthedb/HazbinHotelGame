import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { calculateTraitCost } from "@/lib/gameHelpers";
import traitsData from "@/data/traits.json";
import powersData from "@/data/powers.json";
import type { CharacterData } from "@/pages/character-creation";
import type { Trait, Power } from "@shared/schema";

interface SummaryStepProps {
  data: CharacterData;
}

export default function SummaryStep({ data }: SummaryStepProps) {
  const traits = traitsData as Trait[];
  const powers = powersData as Power[];

  const selectedTraits = traits.filter(t => data.selectedTraits.includes(t.id));
  const selectedPowers = powers.filter(p => data.equippedPowers.includes(p.id));

  return (
    <div className="space-y-6">
      {/* Character Name & Appearance */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-2">
        <CardHeader>
          <CardTitle className="font-display text-3xl text-center">
            {data.firstName} {data.lastName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center gap-8">
            <div className="w-24 h-24 rounded-full border-4 border-primary flex items-center justify-center"
                 style={{ 
                   background: `linear-gradient(135deg, ${data.appearance.colorPalette[0]}, ${data.appearance.colorPalette[1]})` 
                 }}>
              <div className="text-5xl">👹</div>
            </div>
            <div className="space-y-1 text-sm">
              <p className="capitalize"><span className="text-muted-foreground">Horns:</span> {data.appearance.horns}</p>
              <p className="capitalize"><span className="text-muted-foreground">Wings:</span> {data.appearance.wings}</p>
              <p><span className="text-muted-foreground">Palette:</span> 
                <span className="ml-2 inline-flex gap-1">
                  {data.appearance.colorPalette.map((color, idx) => (
                    <span
                      key={idx}
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Origin */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Origin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h3 className="font-display text-2xl text-primary">{data.origin?.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{data.origin?.description}</p>
          </div>
          <Separator />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Power</p>
              <p className="font-semibold text-red-500 text-lg">{data.origin?.startingStats.power}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Control</p>
              <p className="font-semibold text-purple-500 text-lg">{data.origin?.startingStats.control}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Influence</p>
              <p className="font-semibold text-amber-500 text-lg">{data.origin?.startingStats.influence}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Empathy</p>
              <p className="font-semibold text-pink-500 text-lg">{data.origin?.startingStats.empathy}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Traits */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Traits</CardTitle>
            <Badge variant="secondary">
              {calculateTraitCost(selectedTraits)} / {data.origin?.traitPoints} TP
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {selectedTraits.map(trait => (
              <Badge key={trait.id} variant="outline" className="text-sm">
                {trait.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Powers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Starting Powers</CardTitle>
            <Badge variant="secondary">
              {selectedPowers.length} selected
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {selectedPowers.map(power => (
              <div key={power.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <div>
                  <p className="font-semibold text-sm">{power.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{power.type.replace("-", " ")}</p>
                </div>
                <Badge variant="outline" className="capitalize text-xs">
                  {power.rarity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="p-4 bg-primary/10 rounded-md border border-primary">
        <p className="text-sm font-semibold text-center">
          Ready to begin your life in Hell. Click "Begin Your Life in Hell" to start!
        </p>
      </div>
    </div>
  );
}
