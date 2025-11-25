import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, X } from "lucide-react";
import powersData from "@/data/powers.json";
import type { GameState } from "@/lib/game-state";

interface PowerSelectorProps {
  gameState: GameState;
  selectedPowerIds: string[];
  onTogglePower: (powerId: string) => void;
  onClose: () => void;
}

export default function PowerSelector({
  gameState,
  selectedPowerIds,
  onTogglePower,
  onClose
}: PowerSelectorProps) {
  const powers = powersData as any[];
  const activePowers = (gameState as any).activePowers || [];

  const availablePowers = powers.filter(p =>
    activePowers.includes(p.id) || selectedPowerIds.includes(p.id)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" data-testid="modal-power-selector">
      <div className="bg-card border-2 border-primary rounded-lg p-6 max-w-2xl max-h-96 overflow-y-auto w-11/12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Select Powers to Use
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="button-close-selector"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-2 mb-4">
          {availablePowers.length === 0 ? (
            <p className="text-muted-foreground text-sm">No powers available. Learn new powers to use them in actions.</p>
          ) : (
            availablePowers.map(power => (
              <div
                key={power.id}
                className={`p-3 border rounded cursor-pointer transition-all ${
                  selectedPowerIds.includes(power.id)
                    ? "border-primary bg-primary/10"
                    : "border-card-border hover:border-primary/50"
                }`}
                onClick={() => onTogglePower(power.id)}
                data-testid={`button-power-${power.id}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{power.name}</div>
                    <div className="text-xs text-muted-foreground">{power.description}</div>
                  </div>
                  {selectedPowerIds.includes(power.id) && (
                    <Badge className="ml-2">Selected</Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <Button
          className="w-full"
          onClick={onClose}
          data-testid="button-confirm-powers"
        >
          Done ({selectedPowerIds.length} selected)
        </Button>
      </div>
    </div>
  );
}
