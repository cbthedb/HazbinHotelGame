import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPowerTypeColor, getRarityColor } from "@/lib/gameHelpers";
import powersData from "@/data/powers.json";
import type { CharacterData } from "@/pages/character-creation";
import type { Power } from "@shared/schema";
import { Zap, Shield } from "lucide-react";

interface PowersStepProps {
  data: CharacterData;
  onChange: (data: Partial<CharacterData>) => void;
}

export default function PowersStep({ data, onChange }: PowersStepProps) {
  const powers = powersData as Power[];
  
  // Filter powers available to this origin
  const availablePowers = powers.filter(power => {
    if (!power.unlockConditions.origin) return true;
    return power.unlockConditions.origin.includes(data.origin?.id || "");
  });

  const suggestedPowers = availablePowers.filter(p => 
    data.origin?.suggestedPowers.includes(p.id)
  );

  const activePowers = availablePowers.filter(p => !p.isPassive);
  const passivePowers = availablePowers.filter(p => p.isPassive);

  const togglePower = (powerId: string) => {
    if (data.selectedPowers.includes(powerId)) {
      onChange({
        selectedPowers: data.selectedPowers.filter(id => id !== powerId)
      });
    } else {
      if (data.selectedPowers.length < 5) {
        onChange({
          selectedPowers: [...data.selectedPowers, powerId]
        });
      }
    }
  };

  const PowerCard = ({ power }: { power: Power }) => {
    const isSelected = data.selectedPowers.includes(power.id);
    const isSuggested = suggestedPowers.some(p => p.id === power.id);
    
    return (
      <Card
        className={`cursor-pointer transition-all ${
          isSelected
            ? "ring-2 ring-primary border-primary"
            : "hover-elevate border-card-border"
        }`}
        onClick={() => togglePower(power.id)}
        data-testid={`button-power-${power.id}`}
      >
        <CardHeader className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                {power.isPassive ? <Shield className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                <CardTitle className="text-base">{power.name}</CardTitle>
                {isSuggested && (
                  <Badge variant="secondary" className="text-xs">Suggested</Badge>
                )}
              </div>
              <CardDescription className="text-sm">
                {power.description}
              </CardDescription>
              <div className="flex flex-wrap gap-1 text-xs">
                <Badge variant="outline" className={`bg-gradient-to-r ${getPowerTypeColor(power.type)}`}>
                  {power.type.replace("-", " ")}
                </Badge>
                <Badge variant="outline" className={getRarityColor(power.rarity)}>
                  {power.rarity}
                </Badge>
                {!power.isPassive && (
                  <>
                    <Badge variant="outline">Power: {power.basePower}</Badge>
                    <Badge variant="outline">Control: {power.controlReq}</Badge>
                    <Badge variant="outline">Cooldown: {power.cooldown}t</Badge>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Selected Powers</p>
              <p className="text-2xl font-bold text-primary">
                {data.selectedPowers.length} / 5
              </p>
            </div>
            <p className="text-xs text-muted-foreground max-w-xs text-right">
              Choose 1-5 starting powers. More can be unlocked during gameplay.
            </p>
          </div>
        </CardContent>
      </Card>

      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-6">
          {suggestedPowers.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Suggested for Your Origin</h3>
              <div className="space-y-2">
                {suggestedPowers.map(power => (
                  <PowerCard key={power.id} power={power} />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Active Powers</h3>
            <div className="space-y-2">
              {activePowers.slice(0, 10).map(power => (
                <PowerCard key={power.id} power={power} />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Passive Powers</h3>
            <div className="space-y-2">
              {passivePowers.slice(0, 5).map(power => (
                <PowerCard key={power.id} power={power} />
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
