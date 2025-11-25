import type { GameState } from "./game-state";
import { scenarios, getRelevantScenarios } from "@/data/ai-scenarios";
import districts from "@/data/districts.json";

export interface SmartOutcome {
  title: string;
  narrative: string;
  statChanges: Record<string, number>;
}

/**
 * Smart AI system that generates contextual outcomes based on player actions
 * Considers game state, character stats, and action keywords
 */
export async function generateSmartOutcome(
  userInput: string,
  gameState: GameState
): Promise<SmartOutcome | null> {
  try {
    // Get relevant scenarios based on keywords
    const relevantScenarios = getRelevantScenarios(userInput, gameState);
    
    if (!relevantScenarios || relevantScenarios.length === 0) {
      return null;
    }

    // Select a random scenario from matches
    const scenario = relevantScenarios[Math.floor(Math.random() * relevantScenarios.length)];
    
    // Pick a random outcome from the scenario
    const outcome = scenario.outcomes[Math.floor(Math.random() * scenario.outcomes.length)];
    
    // Apply modifiers based on character stats for more dynamic results
    const modifiedStatChanges = applyCharacterModifiers(
      { ...outcome.statChanges },
      gameState.character
    );

    return {
      title: outcome.title,
      narrative: enrichNarrative(outcome.narrative, gameState.character),
      statChanges: modifiedStatChanges
    };
  } catch (error) {
    console.error("Error generating smart outcome:", error);
    return null;
  }
}

/**
 * Apply character-specific modifiers to stat changes
 * High power characters get better combat outcomes, etc.
 */
function applyCharacterModifiers(
  statChanges: Record<string, number>,
  character: any
): Record<string, number> {
  const modified = { ...statChanges };

  // High power characters are more effective at power-based actions
  if (character.power > 15 && modified.power && modified.power > 0) {
    modified.power = Math.round(modified.power * 1.2);
  }

  // High corruption influences outcome morality
  if (character.corruption > 20 && modified.corruption !== undefined) {
    modified.corruption = Math.round(modified.corruption * 1.1);
  }

  // High empathy softens negative consequences
  if (character.empathy > 15 && modified.health && modified.health < 0) {
    modified.health = Math.round(modified.health * 0.8);
  }

  // High control increases success at manipulation
  if (character.control > 15 && modified.control && modified.control > 0) {
    modified.control = Math.round(modified.control * 1.15);
  }

  // Cap stat changes at reasonable levels
  Object.keys(modified).forEach(key => {
    if (Math.abs(modified[key]) > 30) {
      modified[key] = Math.sign(modified[key]) * 30;
    }
  });

  return modified;
}

/**
 * Enrich narrative with character-specific details
 */
function enrichNarrative(narrative: string, character: any): string {
  // Add character name to make it personal
  if (!narrative.includes("you") && !narrative.includes("You")) {
    return `${character.firstName}, ${narrative}`;
  }

  // Customize based on power level
  if (character.power > 20 && !narrative.includes("your")) {
    // Already detailed enough
  }

  return narrative;
}

/**
 * Generate custom outcome from user action with AI templates
 */
export async function generateCustomOutcome(
  userInput: string,
  gameState: GameState
): Promise<SmartOutcome | null> {
  // Use smart AI system instead of Houndify API
  return generateSmartOutcome(userInput, gameState);
}

/**
 * Generate full event object for custom player actions
 */
export async function generateEventWithUserInput(
  userInput: string,
  gameState: GameState,
  selectedPowers?: string[]
): Promise<any | null> {
  try {
    const outcome = await generateCustomOutcome(userInput, gameState);
    if (!outcome) return null;

    // Include power descriptions if selected
    let powerBonus = "";
    if (selectedPowers && selectedPowers.length > 0) {
      powerBonus = ` [Powers Used: ${selectedPowers.join(", ")}]`;
      // Enhance outcome with power benefits
      Object.entries(outcome.statChanges).forEach(([key, value]) => {
        if (typeof value === "number") {
          outcome.statChanges[key] = Math.round(value * 1.3); // 30% boost from powers
        }
      });
    }

    return {
      id: `custom-${Date.now()}`,
      title: outcome.title,
      description: `You decide to: "${userInput}"${powerBonus}`,
      type: "custom",
      choices: [
        {
          id: "accept",
          text: "Accept this outcome",
          outcomes: {
            statChanges: outcome.statChanges,
            narrativeText: outcome.narrative
          }
        },
        {
          id: "undo",
          text: "Reconsider your action",
          outcomes: {
            statChanges: {},
            narrativeText: "You change your mind and take a different path."
          }
        }
      ],
      onlyOnce: false
    };
  } catch (error) {
    console.error("Error generating event with user input:", error);
    return null;
  }
}

/**
 * Generate outcome for district activities (challenges, territory claims, etc.)
 */
export async function generateActivityOutcome(
  activity: any,
  gameState: GameState,
  district: any
): Promise<SmartOutcome | null> {
  try {
    // Select outcome based on activity type and stats
    const outcomes: Record<string, SmartOutcome[]> = {
      "challenge-overlord": [
        {
          title: "Victory Against All Odds",
          narrative: `You challenged the ruler of ${district?.name} and won. The power transfer is immediate and absolute.`,
          statChanges: { power: 20, influence: 15, control: 10, wealth: 500, corruption: 5 }
        },
        {
          title: "Pyrrhic Victory",
          narrative: `You defeated the overlord, but the battle was costly. You won, but you're scarred.`,
          statChanges: { power: 15, influence: 10, health: -40, wealth: 300, control: 8 }
        },
        {
          title: "Crushing Defeat",
          narrative: `The overlord was too powerful. You barely escaped with your life.`,
          statChanges: { power: -5, health: -60, control: -5, wealth: -200, empathy: 2 }
        }
      ],
      "duel-rival": [
        {
          title: "Dominance Proven",
          narrative: "You destroyed your rival in single combat. No one questions your superiority now.",
          statChanges: { power: 8, influence: 7, wealth: 250, control: 5 }
        },
        {
          title: "Narrow Victory",
          narrative: "The duel was close, but you emerged victorious. Barely.",
          statChanges: { power: 5, health: -20, wealth: 150, influence: 4 }
        },
        {
          title: "Humiliating Defeat",
          narrative: "You were outmatched. Your rival destroyed you in front of everyone.",
          statChanges: { power: -3, health: -40, influence: -8, control: -3 }
        }
      ],
      "seize-territory": [
        {
          title: "Territory Claimed",
          narrative: `${district?.name} is now yours. Sovereignty established through strength.`,
          statChanges: { control: 12, influence: 12, power: 10, wealth: 400, corruption: 8 }
        },
        {
          title: "Partial Control",
          narrative: "You've taken some control, but rivals still contest your rule.",
          statChanges: { control: 6, influence: 6, power: 5, wealth: 200, corruption: 4 }
        },
        {
          title: "Invasion Failed",
          narrative: "The resistance was too strong. You're forced to retreat.",
          statChanges: { control: -3, power: -2, health: -30, wealth: -300 }
        }
      ],
      "gather-allies": [
        {
          title: "Powerful Alliance Formed",
          narrative: "You've gathered a formidable coalition. Together, you're unstoppable.",
          statChanges: { influence: 12, power: 8, wealth: -150, control: 8 }
        },
        {
          title: "Some Join Your Cause",
          narrative: "You've attracted several useful allies. Your network grows.",
          statChanges: { influence: 7, power: 4, wealth: -100, control: 4 }
        },
        {
          title: "Recruitment Failed",
          narrative: "No one wants to join you. Your reputation precedes you, and not in a good way.",
          statChanges: { influence: -4, wealth: -50, control: -2 }
        }
      ],
      "undercover-plot": [
        {
          title: "Conspiracy Succeeds",
          narrative: "Your plot unfolds perfectly. The district is yours to control from the shadows.",
          statChanges: { control: 14, influence: 10, power: 6, wealth: 300, corruption: 12 }
        },
        {
          title: "Plot Partially Succeeds",
          narrative: "Part of your plan works. You've gained leverage.",
          statChanges: { control: 8, influence: 6, wealth: 150, corruption: 6 }
        },
        {
          title: "Discovered!",
          narrative: "Your plot is exposed. Now you're hunted.",
          statChanges: { control: -8, power: -5, wealth: -400, corruption: 8, health: -30 }
        }
      ],
      "corrupt-locals": [
        {
          title: "Population Turned",
          narrative: "The locals now serve you, not their ruler. A revolution is inevitable.",
          statChanges: { influence: 14, corruption: 14, control: 10, wealth: 250, power: 8 }
        },
        {
          title: "Some Corruption Takes Hold",
          narrative: "You've turned some to your cause. Not enough, but it's a start.",
          statChanges: { influence: 7, corruption: 8, wealth: 100, control: 5 }
        },
        {
          title: "Resistance Unbreakable",
          narrative: "The people refuse your darkness. Their hope is too strong.",
          statChanges: { influence: -5, corruption: -3, wealth: -200, empathy: -2 }
        }
      ]
    };

    const activityOutcomes = outcomes[activity.action] || [];
    if (!activityOutcomes.length) return null;

    // Weight outcomes based on character stats
    let selectedIndex = Math.floor(Math.random() * activityOutcomes.length);
    
    // Better chance of success with high stats
    if (gameState.character.power > 25) selectedIndex = 0;
    else if (gameState.character.power > 15 && Math.random() < 0.6) selectedIndex = 0;
    
    const outcome = activityOutcomes[selectedIndex];
    return outcome;
  } catch (error) {
    console.error("Error generating activity outcome:", error);
    return null;
  }
}
