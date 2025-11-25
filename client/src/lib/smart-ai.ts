import type { GameState } from "./game-state";
import { scenarios, getRelevantScenarios } from "@/data/ai-scenarios";

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
  gameState: GameState
): Promise<any | null> {
  try {
    const outcome = await generateCustomOutcome(userInput, gameState);
    if (!outcome) return null;

    return {
      id: `custom-${Date.now()}`,
      title: outcome.title,
      description: `You decide to: "${userInput}"`,
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
