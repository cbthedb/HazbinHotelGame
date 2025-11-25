import type { GameState } from "./game-state";

// Fallback AI-powered scenarios without direct Houndify dependency
const scenarioTemplates = [
  {
    titles: ["A Bold Gambit", "Unconventional Tactics", "Creative Chaos", "Risky Maneuver"],
    narratives: [
      "Your unorthodox approach catches everyone off guard. They didn't see that coming.",
      "The sheer audacity of your plan actually works. Sometimes madness is genius.",
      "Nobody expected you to do that. The result is chaotic but effective.",
      "Your creative solution bypasses all the normal rules. Impressive."
    ],
    statOptions: [
      { power: 2, influence: 1, control: -1 },
      { power: 1, corruption: 2, influence: 1 },
      { power: 3, health: -8, control: -2 },
      { influence: 4, wealth: -50, empathy: 1 }
    ]
  },
  {
    titles: ["Manipulated the Situation", "Negotiated Successfully", "Turned the Tables", "Cunning Move"],
    narratives: [
      "Your words paint a convincing picture. They believe what you're saying.",
      "You play both sides masterfully, each side thinking they're winning.",
      "By appealing to their greed, you get exactly what you want.",
      "A silver tongue and sharper wit carry you through."
    ],
    statOptions: [
      { influence: 3, wealth: 100, empathy: -1 },
      { control: 3, influence: 2 },
      { wealth: 200, corruption: 2 },
      { influence: 4, control: 2, empathy: -2 }
    ]
  },
  {
    titles: ["Raw Power Unleashed", "Magical Assault", "Overwhelming Force", "Took Control"],
    narratives: [
      "You let loose with raw magical force. Your enemies didn't stand a chance.",
      "Pure power in its most destructive form. Devastation follows.",
      "You assert dominance through sheer overwhelming magical strength.",
      "The very air crackles with your magical presence."
    ],
    statOptions: [
      { power: 5, health: -15, corruption: 3 },
      { power: 4, control: 1, wealth: 100 },
      { power: 6, health: -20, influence: 2 },
      { power: 3, influence: 2, control: 2 }
    ]
  },
  {
    titles: ["Found Common Ground", "Made a Deal", "Reached Agreement", "Formed Alliance"],
    narratives: [
      "Mutual interests align perfectly. You've made a valuable ally.",
      "The terms are favorable, and both parties walk away satisfied.",
      "An unexpected friendship blooms from this shared goal.",
      "Respect grows between you as you recognize kindred spirits."
    ],
    statOptions: [
      { influence: 4, empathy: 2 },
      { wealth: 150, influence: 2 },
      { control: 2, empathy: 3, influence: 1 },
      { influence: 5, wealth: 75 }
    ]
  },
  {
    titles: ["Showed Mercy", "Spared Them", "Chose Compassion", "The Right Thing"],
    narratives: [
      "Your opponent was defeated, but you choose not to finish them.",
      "An act of kindness in Hell itself. How unusual.",
      "You let them live. Perhaps redemption is possible after all.",
      "You show them that strength isn't always about destruction."
    ],
    statOptions: [
      { empathy: 4, control: 2 },
      { empathy: 5, corruption: -3, influence: 1 },
      { empathy: 3, control: 1, wealth: -75 },
      { control: 3, empathy: 2 }
    ]
  }
];

export async function generateCustomOutcome(
  userInput: string,
  gameState: GameState
): Promise<{
  title: string;
  narrative: string;
  statChanges: Record<string, number>;
} | null> {
  try {
    // Select a random scenario template
    const template = scenarioTemplates[Math.floor(Math.random() * scenarioTemplates.length)];
    const titleIdx = Math.floor(Math.random() * template.titles.length);
    const narrativeIdx = Math.floor(Math.random() * template.narratives.length);
    const statsIdx = Math.floor(Math.random() * template.statOptions.length);

    const title = template.titles[titleIdx];
    const narrative = template.narratives[narrativeIdx];
    const statChanges = template.statOptions[statsIdx];

    // Contextual adjustments based on user input
    if (userInput.toLowerCase().includes("sneak") || userInput.toLowerCase().includes("hide")) {
      statChanges.control = (statChanges.control || 0) + 2;
      statChanges.influence = Math.max(-2, (statChanges.influence || 0) - 1);
    }
    if (userInput.toLowerCase().includes("seduce") || userInput.toLowerCase().includes("charm")) {
      statChanges.influence = (statChanges.influence || 0) + 3;
      statChanges.control = Math.max(-1, (statChanges.control || 0) - 1);
    }
    if (userInput.toLowerCase().includes("destroy") || userInput.toLowerCase().includes("attack")) {
      statChanges.power = (statChanges.power || 0) + 2;
      statChanges.health = (statChanges.health || 0) - 10;
    }

    return { title, narrative, statChanges };
  } catch (error) {
    console.error("Error generating custom outcome:", error);
    return null;
  }
}

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
      description: `You decide to: ${userInput}`,
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
          text: "Reconsider",
          outcomes: {
            statChanges: {},
            narrativeText: "You change your mind."
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
