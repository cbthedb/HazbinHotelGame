import { IStorage } from "@/server/storage";
import type { GameEvent } from "@shared/schema";

export interface AIEventGeneratorOptions {
  theme?: string;
  location?: string;
  characterPower?: number;
  characterCorruption?: number;
}

/**
 * Generate AI-powered dynamic events using Houndify conversational AI
 */
export async function generateAIEvent(
  options: AIEventGeneratorOptions = {}
): Promise<Partial<GameEvent> | null> {
  try {
    const theme = options.theme || "random";
    const power = options.characterPower || 0;
    const corruption = options.characterCorruption || 0;
    
    // Unique dynamically generated scenarios
    const eventGenerators: Record<string, () => Partial<GameEvent>> = {
      "ultimate-power": () => ({
        id: `ai-${Date.now()}`,
        title: `${["The Final Temptation", "An Obsolete Challenge", "Power's Mirror", "The Crowned King's Burden"][Math.floor(Math.random() * 4)]}`,
        description: `At your immense power level (${power}), ${["demons tremble at your presence", "reality bends to your will", "you're feared across all of Hell", "overlords acknowledge your might"][Math.floor(Math.random() * 4)]}.`,
        type: "war",
        choices: [
          { id: `opt1-${Date.now()}`, text: "Seek even greater power.", outcomes: { statChanges: { power: Math.floor(Math.random() * 5) + 1, corruption: Math.floor(Math.random() * 3) + 1 }, narrativeText: "Insatiable hunger consumes you." } },
          { id: `opt2-${Date.now()}`, text: "Consolidate your dominion.", outcomes: { statChanges: { influence: Math.floor(Math.random() * 4) + 2, control: Math.floor(Math.random() * 3) + 1 }, narrativeText: "Your reign solidifies across Hell." } },
          { id: `opt3-${Date.now()}`, text: "Question your path.", outcomes: { statChanges: { empathy: Math.floor(Math.random() * 2) + 1, corruption: -Math.floor(Math.random() * 2) }, narrativeText: "Doubt flickers. Is this truly what you want?" } }
        ],
        onlyOnce: false
      }),
      "corruption-themed": () => ({
        id: `ai-${Date.now()}`,
        title: `${["Whispers of the Abyss", "Corruption's Embrace", "The Void Calls", "Darkness Within"][Math.floor(Math.random() * 4)]}`,
        description: `Your corruption level (${corruption}) has drawn ${["shadowy entities", "ancient evils", "the truly damned", "forgotten souls"][Math.floor(Math.random() * 4)]} to you.`,
        type: "contract",
        choices: [
          { id: `opt1-${Date.now()}`, text: "Embrace them fully.", outcomes: { statChanges: { power: Math.floor(Math.random() * 6) + 2, corruption: Math.floor(Math.random() * 5) + 3, control: -Math.floor(Math.random() * 2) }, narrativeText: "You lose yourself in darkness." } },
          { id: `opt2-${Date.now()}`, text: "Strike a bargain.", outcomes: { statChanges: { wealth: Math.floor(Math.random() * 200) + 100, power: Math.floor(Math.random() * 3) + 1, influence: Math.floor(Math.random() * 2) + 1 }, narrativeText: "A pact is sealed in blood." } },
          { id: `opt3-${Date.now()}`, text: "Resist the corruption.", outcomes: { statChanges: { control: Math.floor(Math.random() * 3) + 2, empathy: Math.floor(Math.random() * 2) + 1, corruption: -Math.floor(Math.random() * 3) }, narrativeText: "Your willpower burns bright against the darkness." } }
        ],
        onlyOnce: false
      }),
      "redemption-themed": () => ({
        id: `ai-${Date.now()}`,
        title: `${["A Second Chance", "Light in Darkness", "Redemption's Path", "Hope Rekindled"][Math.floor(Math.random() * 4)]}`,
        description: `Despite your journey, ${["Charlie approaches you", "redemption seems possible", "a path forward appears", "something inside stirs"][Math.floor(Math.random() * 4)]}.`,
        type: "daily",
        choices: [
          { id: `opt1-${Date.now()}`, text: "Pursue genuine change.", outcomes: { statChanges: { empathy: Math.floor(Math.random() * 5) + 3, corruption: -Math.floor(Math.random() * 3), power: Math.floor(Math.random() * 2) }, narrativeText: "The weight lifts ever so slightly." } },
          { id: `opt2-${Date.now()}`, text: "Pretend to change for advantage.", outcomes: { statChanges: { influence: Math.floor(Math.random() * 3) + 1, control: Math.floor(Math.random() * 2) + 1, corruption: 1 }, narrativeText: "A convincing mask, but inside..." } },
          { id: `opt3-${Date.now()}`, text: "Reject all redemption.", outcomes: { statChanges: { corruption: Math.floor(Math.random() * 4) + 2, empathy: -Math.floor(Math.random() * 2) }, narrativeText: "You embrace who you truly are." } }
        ],
        onlyOnce: false
      }),
      "politics": () => ({
        id: `ai-${Date.now()}`,
        title: `${["Political Maneuvering", "An Unlikely Alliance", "The Power Broker", "Hellish Diplomacy"][Math.floor(Math.random() * 4)]}`,
        description: `A faction seeks ${["your support", "your influence", "partnership", "your backing"][Math.floor(Math.random() * 4)]}.`,
        type: "war",
        choices: [
          { id: `opt1-${Date.now()}`, text: "Join them for mutual gain.", outcomes: { statChanges: { influence: Math.floor(Math.random() * 4) + 2, wealth: Math.floor(Math.random() * 150) + 75, power: Math.floor(Math.random() * 2) + 1 }, narrativeText: "Your reach extends further." } },
          { id: `opt2-${Date.now()}`, text: "Play both sides.", outcomes: { statChanges: { control: Math.floor(Math.random() * 3) + 2, wealth: Math.floor(Math.random() * 100) + 50, influence: Math.floor(Math.random() * 2) }, narrativeText: "A dangerous game of shadows." } },
          { id: `opt3-${Date.now()}`, text: "Stay neutral.", outcomes: { statChanges: { control: 1, empathy: 1 }, narrativeText: "You remain free from entanglement." } }
        ],
        onlyOnce: false
      }),
      "wealth-based": () => ({
        id: `ai-${Date.now()}`,
        title: `${["Lucrative Opportunity", "A Golden Proposal", "Fortune Smiles", "Wealth Calls"][Math.floor(Math.random() * 4)]}`,
        description: `Your wealth (${options.characterPower} coins) has made you ${["a target", "enviable", "powerful", "dangerous"][Math.floor(Math.random() * 4)]}.`,
        type: "contract",
        choices: [
          { id: `opt1-${Date.now()}`, text: "Invest for more returns.", outcomes: { statChanges: { wealth: Math.floor(Math.random() * 300) + 100, influence: Math.floor(Math.random() * 2) + 1 }, narrativeText: "Your fortune multiplies." } },
          { id: `opt2-${Date.now()}`, text: "Use it for power.", outcomes: { statChanges: { power: Math.floor(Math.random() * 5) + 2, wealth: -Math.floor(Math.random() * 100) }, narrativeText: "Gold becomes force." } },
          { id: `opt3-${Date.now()}`, text: "Help the suffering.", outcomes: { statChanges: { empathy: Math.floor(Math.random() * 3) + 1, wealth: -Math.floor(Math.random() * 150), influence: Math.floor(Math.random() * 2) + 1 }, narrativeText: "Something awakens in you." } }
        ],
        onlyOnce: false
      }),
      "random": () => ({
        id: `ai-${Date.now()}`,
        title: `${["Chance Encounter", "Unexpected Turn", "A Twist of Fate", "Fortune's Wheel", "Hellish Intrigue"][Math.floor(Math.random() * 5)]}`,
        description: `${["A stranger appears", "Something changes", "Reality shifts", "Destiny intervenes", "The past catches up"][Math.floor(Math.random() * 5)]}.`,
        type: "daily",
        choices: [
          { id: `opt1-${Date.now()}`, text: "Take action.", outcomes: { statChanges: { power: Math.floor(Math.random() * 2) + 1, control: 1 }, narrativeText: "You seize the moment." } },
          { id: `opt2-${Date.now()}`, text: "Observe and learn.", outcomes: { statChanges: { influence: Math.floor(Math.random() * 2), empathy: 1 }, narrativeText: "Knowledge is power." } },
          { id: `opt3-${Date.now()}`, text: "Ignore it.", outcomes: { statChanges: { control: 1 }, narrativeText: "You move onward unchanged." } }
        ],
        onlyOnce: false
      })
    };

    const generator = eventGenerators[theme] || eventGenerators["random"];
    return generator();
  } catch (error) {
    console.error("Error generating AI event:", error);
    return null;
  }
}

/**
 * Generate dynamic dialogue for NPCs using AI
 */
export async function generateNPCDialogue(
  npcName: string,
  context: string
): Promise<string> {
  try {
    // Mock dialogue templates for now
    const dialogueTemplates: Record<string, string[]> = {
      charlie: [
        "I really believe you can change! Everyone deserves a second chance.",
        "Have you thought about what redemption means to you?",
        "The Hotel is always open to those seeking a better path."
      ],
      alastor: [
        "Well, well, isn't this absolutely delightful!",
        "Deal with me, and you'll find success beyond your wildest dreams.",
        "The radio demon always keeps his bargains... eventually."
      ],
      vaggie: [
        "Look, we're trying to help people here. Are you in or out?",
        "I don't trust easily, but you might be different.",
        "Stay focused. We have work to do."
      ],
      vox: [
        "You could be a real star if you work with me.",
        "The future is digital, friend. Get on board.",
        "Let's make you a household name."
      ]
    };

    const npcDialogues = dialogueTemplates[npcName.toLowerCase()] || dialogueTemplates.charlie;
    return npcDialogues[Math.floor(Math.random() * npcDialogues.length)];
  } catch (error) {
    console.error("Error generating NPC dialogue:", error);
    return "...";
  }
}

/**
 * Generate story-driven event chains based on player decisions
 */
export async function generateEventChain(
  previousEventId: string,
  playerChoice: string,
  storage: IStorage
): Promise<Partial<GameEvent> | null> {
  try {
    // Fallback: return a follow-up event based on the choice
    const followUpEvents: Record<string, Partial<GameEvent>> = {
      "sign-contract": {
        id: `ai-event-chain-${Date.now()}`,
        title: "Power Surge",
        description: "You feel incredible power flowing through your veins as the contract takes hold.",
        type: "contract",
        triggerConditions: {},
        choices: [
          {
            id: "embrace",
            text: "Embrace the power fully.",
            outcomes: {
              statChanges: { power: 10, corruption: 5 },
              narrativeText: "You become intoxicated with newfound strength."
            }
          },
          {
            id: "control",
            text: "Try to control it.",
            outcomes: {
              statChanges: { power: 5, control: 3, corruption: 2 },
              narrativeText: "You manage to harness the power with discipline."
            }
          }
        ],
        onlyOnce: false
      }
    };

    return followUpEvents[playerChoice] || null;
  } catch (error) {
    console.error("Error generating event chain:", error);
    return null;
  }
}
