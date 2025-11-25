import type { GameState } from "./game-state";

// Fallback templates in case Houndify API fails
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
  }
];

function getFallbackOutcome() {
  const template = scenarioTemplates[Math.floor(Math.random() * scenarioTemplates.length)];
  const titleIdx = Math.floor(Math.random() * template.titles.length);
  const narrativeIdx = Math.floor(Math.random() * template.narratives.length);
  const statsIdx = Math.floor(Math.random() * template.statOptions.length);

  return {
    title: template.titles[titleIdx],
    narrative: template.narratives[narrativeIdx],
    statChanges: template.statOptions[statsIdx]
  };
}

export async function generateCustomOutcome(
  userInput: string,
  gameState: GameState
): Promise<{
  title: string;
  narrative: string;
  statChanges: Record<string, number>;
} | null> {
  try {
    // Create a game-specific prompt for Houndify
    const prompt = `You are a Hazbin Hotel life simulation game AI narrator. The player character "${gameState.character.firstName} ${gameState.character.lastName}" (Power level: ${gameState.character.power}) just chose to: "${userInput}"

Generate a brief narrative outcome (1-2 sentences) and a short title (2-4 words). Format EXACTLY like this:
TITLE: [title here]
NARRATIVE: [narrative here]
STATS: power:+1, influence:+2, corruption:-1

Keep stat changes small (+/- 1 to 5). Use realistic stat keywords only.`;

    // Call server-side Houndify proxy
    const response = await fetch("/api/houndify-query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: prompt,
        userId: gameState.character.firstName.toLowerCase()
      })
    });

    if (!response.ok) {
      console.warn(`Houndify API error: ${response.status}`);
      return getFallbackOutcome();
    }

    const data = await response.json();
    
    // Extract response from Houndify API
    const responseText = data.result?.message || data.result?.WrittenResponseLong || "";
    
    if (!responseText) {
      return getFallbackOutcome();
    }

    // Parse the formatted response
    const titleMatch = responseText.match(/TITLE:\s*([^\n]+)/i);
    const narrativeMatch = responseText.match(/NARRATIVE:\s*([^\n]+)/i);
    const statsMatch = responseText.match(/STATS:\s*([^\n]+)/i);

    if (!titleMatch || !narrativeMatch) {
      return getFallbackOutcome();
    }

    const title = titleMatch[1].trim();
    const narrative = narrativeMatch[1].trim();
    
    // Parse stats string like "power:+1, influence:+2"
    const statChanges: Record<string, number> = {};
    if (statsMatch) {
      const statString = statsMatch[1];
      const statPairs = statString.split(",");
      statPairs.forEach(pair => {
        const [key, value] = pair.split(":").map(s => s.trim());
        if (key && value) {
          statChanges[key] = parseInt(value) || 0;
        }
      });
    }

    return { title, narrative, statChanges };
  } catch (error) {
    console.error("Error generating custom outcome:", error);
    return getFallbackOutcome();
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
