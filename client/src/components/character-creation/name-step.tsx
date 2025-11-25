import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";
import { generateRandomName } from "@/lib/gameHelpers";
import type { CharacterData } from "@/pages/character-creation";

interface NameStepProps {
  data: CharacterData;
  onChange: (data: Partial<CharacterData>) => void;
}

export default function NameStep({ data, onChange }: NameStepProps) {
  const handleRandomize = () => {
    const { firstName, lastName } = generateRandomName();
    onChange({ firstName, lastName });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-base font-semibold">
            First Name
          </Label>
          <Input
            id="firstName"
            value={data.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            placeholder="Enter your demon's first name"
            className="text-lg"
            data-testid="input-first-name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-base font-semibold">
            Last Name
          </Label>
          <Input
            id="lastName"
            value={data.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            placeholder="Enter your demon's last name"
            className="text-lg"
            data-testid="input-last-name"
          />
        </div>

        <Button
          variant="outline"
          onClick={handleRandomize}
          className="w-full gap-2"
          type="button"
          data-testid="button-randomize-name"
        >
          <Shuffle className="w-4 h-4" />
          Randomize Name
        </Button>
      </div>

      {data.firstName && data.lastName && (
        <div className="p-4 bg-card rounded-md border border-card-border">
          <p className="text-sm text-muted-foreground mb-1">Your demon name:</p>
          <p className="font-display text-3xl font-bold text-primary">
            {data.firstName} {data.lastName}
          </p>
        </div>
      )}

      <div className="p-4 bg-muted/50 rounded-md space-y-2">
        <p className="text-sm font-semibold">Name Suggestions:</p>
        <p className="text-xs text-muted-foreground">
          Choose names that fit the dark, theatrical Hazbin Hotel aesthetic. Think Victorian elegance, sinful puns, or demonic wordplay.
        </p>
      </div>
    </div>
  );
}
