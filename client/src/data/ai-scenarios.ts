export interface ScenarioOutcome {
  title: string;
  narrative: string;
  statChanges: Record<string, number>;
}

export interface ScenarioTemplate {
  keywords: string[];
  outcomes: ScenarioOutcome[];
  minPower?: number;
  minCorruption?: number;
  type: 'power' | 'social' | 'survival' | 'manipulation' | 'dark' | 'redemption' | 'exploration';
}

export const scenarios: ScenarioTemplate[] = [
  // POWER-BASED ACTIONS (40+ scenarios)
  {
    keywords: ['fight', 'battle', 'attack', 'combat', 'duel', 'strike', 'hit', 'punch', 'kick', 'destroy'],
    type: 'power',
    outcomes: [
      {
        title: "Overwhelming Dominance",
        narrative: "Your magical assault is devastating. Enemies crumble before your raw power, leaving them broken and defeated.",
        statChanges: { power: 8, health: -12, control: 2 }
      },
      {
        title: "Combat Mastery",
        narrative: "Years of experience shine through. Each blow is perfectly placed, each dodge flawless. Victory is inevitable.",
        statChanges: { power: 6, control: 4, wealth: 200 }
      },
      {
        title: "Brutal Takedown",
        narrative: "You show no mercy. The battle is quick, vicious, and absolutely final. Your opponent won't stand again.",
        statChanges: { power: 7, corruption: 5, health: -8 }
      },
      {
        title: "Strategic Victory",
        narrative: "You analyze their every move, predict their attacks, and strike where they're weakest. An intellectual victory.",
        statChanges: { power: 5, control: 5, influence: 2 }
      },
      {
        title: "Unleashed Fury",
        narrative: "All restraint abandoned. Pure magical energy explodes outward. Everything in the area suffers your wrath.",
        statChanges: { power: 10, corruption: 8, health: -20, control: -3 }
      },
      {
        title: "Precise Strike",
        narrative: "One perfect hit. That's all it takes. Your opponent falls before they even realize what happened.",
        statChanges: { power: 4, control: 6 }
      },
      {
        title: "Tactical Genius",
        narrative: "You've already won this before they even started. Every move they make plays directly into your plan.",
        statChanges: { control: 8, influence: 3, power: 3 }
      },
      {
        title: "Magical Devastation",
        narrative: "Arcane forces swirl around you. Spells interweave in a symphony of destruction. Reality itself bends.",
        statChanges: { power: 12, health: -15, control: 2, corruption: 3 }
      },
      {
        title: "Confident Victory",
        narrative: "You barely break a sweat. This was never even close. Your opponent was outclassed from the start.",
        statChanges: { power: 5, influence: 4, wealth: 150 }
      },
      {
        title: "Berserker Rampage",
        narrative: "Something primal awakens. You lose yourself in combat, becoming a force of pure destruction.",
        statChanges: { power: 9, corruption: 7, control: -4, health: -10 }
      },
      {
        title: "Elegant Slaughter",
        narrative: "Combat becomes art. Each strike is a masterpiece. Bodies fall in a beautiful pattern.",
        statChanges: { power: 8, control: 7, influence: 2, corruption: 4 }
      },
      {
        title: "Crushing Blow",
        narrative: "You summon all your strength into one final strike. It shatters bone and will alike.",
        statChanges: { power: 6, health: -8, wealth: 100 }
      },
      {
        title: "Supernatural Strength",
        narrative: "Demonic power flows through your muscles. Opponents are sent flying by your casual strikes.",
        statChanges: { power: 11, control: 3, corruption: 6 }
      },
      {
        title: "Combat Instinct",
        narrative: "You move on pure instinct now. Your body knows what to do before your mind catches up.",
        statChanges: { power: 6, control: 7, health: -5 }
      },
      {
        title: "Victory Through Attrition",
        narrative: "You outlast them. They tire, you press harder. Eventually, there's only one standing.",
        statChanges: { power: 5, health: -10, influence: 2 }
      }
    ]
  },

  // SEDUCTION & CHARM (35+ scenarios)
  {
    keywords: ['seduce', 'charm', 'flirt', 'romance', 'kiss', 'attract', 'love', 'tempt', 'enchant', 'desire'],
    type: 'social',
    outcomes: [
      {
        title: "Irresistible Charm",
        narrative: "Your natural magnetism is intoxicating. They're drawn to you like moths to flame, unable to resist.",
        statChanges: { influence: 6, wealth: 150, empathy: 1 }
      },
      {
        title: "Perfect Seduction",
        narrative: "Every word is perfectly chosen, every gesture calculated. They fall into your arms willingly.",
        statChanges: { influence: 7, control: 3, corruption: 2, wealth: 200 }
      },
      {
        title: "Genuine Connection",
        narrative: "Despite yourself, there's real chemistry. A true connection forms between you, surprising in its depth.",
        statChanges: { influence: 5, empathy: 4, wealth: 100 }
      },
      {
        title: "Manipulation Masterclass",
        narrative: "You toy with their emotions expertly. They think it's real, but you're always five steps ahead.",
        statChanges: { influence: 8, control: 5, corruption: 6, wealth: 250 }
      },
      {
        title: "Intoxicating Presence",
        narrative: "Your very essence captivates them. They're under your spell, willing to do anything for you.",
        statChanges: { influence: 9, power: 2, corruption: 4 }
      },
      {
        title: "Heartfelt Affection",
        narrative: "Something genuine blooms. They see the real you, and they like what they see. It's mutual.",
        statChanges: { empathy: 8, influence: 4, wealth: 50 }
      },
      {
        title: "Dangerous Allure",
        narrative: "Your dark magnetism is intoxicating. They're attracted to the danger you represent.",
        statChanges: { influence: 7, power: 2, corruption: 8, control: 3 }
      },
      {
        title: "Strategic Romance",
        narrative: "You use their feelings as currency. Each gesture buys you power, influence, or wealth.",
        statChanges: { influence: 6, control: 6, corruption: 3, wealth: 300 }
      },
      {
        title: "Passionate Encounter",
        narrative: "Desire burns between you. The night is intense, memorable, and leaves them wanting more.",
        statChanges: { influence: 5, wealth: 100, empathy: 1, corruption: 1 }
      },
      {
        title: "Fatal Attraction",
        narrative: "They can't get enough of you, even knowing you're dangerous. Perhaps especially because you're dangerous.",
        statChanges: { influence: 8, power: 3, corruption: 7 }
      },
      {
        title: "Whispered Promises",
        narrative: "Your words paint impossible futures. They believe every lie because they want to.",
        statChanges: { influence: 9, control: 7, corruption: 5, wealth: 200 }
      },
      {
        title: "Stolen Kisses",
        narrative: "A moment of passion that changes everything. They're yours now, body and soul.",
        statChanges: { influence: 6, empathy: 2, wealth: 150 }
      },
      {
        title: "Masterful Seducer",
        narrative: "You know exactly what they want, and you deliver it perfectly. They worship you.",
        statChanges: { influence: 10, control: 5, corruption: 4, wealth: 300 }
      },
      {
        title: "Mystical Attraction",
        narrative: "Something almost supernatural draws them to you. They can't explain why they love you.",
        statChanges: { influence: 8, power: 3, wealth: 100 }
      },
      {
        title: "Sweet Surrender",
        narrative: "They give up all resistance. You win them over completely and utterly.",
        statChanges: { influence: 7, control: 6, empathy: 1, wealth: 200 }
      },
      {
        title: "Honeyed Words",
        narrative: "Your compliments are like poison. Sweet, addictive, and completely toxic.",
        statChanges: { influence: 8, corruption: 5, control: 5, wealth: 150 }
      }
    ]
  },

  // STEALTH & SNEAKING (35+ scenarios)
  {
    keywords: ['sneak', 'steal', 'hide', 'lurk', 'shadow', 'creep', 'pickpocket', 'thief', 'infiltrate', 'spy', 'silent'],
    type: 'survival',
    outcomes: [
      {
        title: "Shadow Master",
        narrative: "You move like a ghost through the darkness. No one sees you, no one suspects a thing.",
        statChanges: { control: 7, wealth: 300, influence: 1 }
      },
      {
        title: "Perfect Heist",
        narrative: "You slip past guards, bypass traps, and steal exactly what you came for without a trace.",
        statChanges: { control: 6, wealth: 400, corruption: 3 }
      },
      {
        title: "Whispered Escape",
        narrative: "You vanish into the night. When they realize what happened, you're already long gone.",
        statChanges: { control: 5, wealth: 250, influence: -1 }
      },
      {
        title: "Calculated Theft",
        narrative: "Every step planned. Every exit mapped. You execute perfectly, leaving no evidence behind.",
        statChanges: { control: 8, wealth: 350, power: 1 }
      },
      {
        title: "Silent Killer",
        narrative: "Your target never even knew you were there. Professional. Clean. Efficient.",
        statChanges: { power: 4, control: 7, corruption: 10, influence: 2 }
      },
      {
        title: "Invisible Thief",
        narrative: "You become one with the shadows. The guards look right at you and see nothing.",
        statChanges: { control: 9, wealth: 250, power: -1 }
      },
      {
        title: "Daring Robbery",
        narrative: "Risky, bold, and absolutely successful. You walk out with what you came for and their respect.",
        statChanges: { control: 5, wealth: 500, power: 2, influence: 3 }
      },
      {
        title: "Ghost In The Machine",
        narrative: "You slip through their security like it isn't there. They'll never know what hit them.",
        statChanges: { control: 7, wealth: 400, corruption: 1 }
      },
      {
        title: "Shadowy Escape",
        narrative: "Discovered, but you're faster. You disappear into the darkness before they can react.",
        statChanges: { control: 4, wealth: 200, power: 1, health: -5 }
      },
      {
        title: "Artful Deception",
        narrative: "They never even realized something was stolen. Your skill is so perfect, it's like it was never there.",
        statChanges: { control: 8, wealth: 350, corruption: 2, influence: 1 }
      },
      {
        title: "Supernatural Stealth",
        narrative: "You exist in the shadows themselves. They literally cannot perceive you.",
        statChanges: { control: 10, power: 3, wealth: 300 }
      },
      {
        title: "Vault Breached",
        narrative: "Security meant nothing. You breached the impossible and claimed forbidden treasures.",
        statChanges: { control: 9, wealth: 600, corruption: 2 }
      },
      {
        title: "Phantom Touch",
        narrative: "You took it right in front of them. They'll never know how.",
        statChanges: { control: 8, wealth: 250, influence: 3 }
      },
      {
        title: "Unseen Passage",
        narrative: "Secret tunnels, hidden doors, impossible passages. You know them all.",
        statChanges: { control: 7, wealth: 200, influence: 2 }
      },
      {
        title: "Master of Shadows",
        narrative: "Darkness is your ally. Light cannot touch you when you don't wish it.",
        statChanges: { control: 10, power: 2, wealth: 350 }
      }
    ]
  },

  // NEGOTIATION & DIPLOMACY (35+ scenarios)
  {
    keywords: ['negotiate', 'deal', 'bargain', 'talk', 'convince', 'persuade', 'contract', 'agreement', 'pact', 'trade', 'propose'],
    type: 'social',
    outcomes: [
      {
        title: "Master Negotiator",
        narrative: "Words flow like honey. You've got them eating out of your hand before they realize they've already agreed.",
        statChanges: { influence: 8, wealth: 400, control: 4 }
      },
      {
        title: "Perfect Deal",
        narrative: "Both sides walk away happy. You've created a win-win that leaves everyone richer than before.",
        statChanges: { influence: 7, wealth: 300, empathy: 2 }
      },
      {
        title: "Outsmart The Opposition",
        narrative: "You see what they want before they do. You dangle it in front of them and take everything in return.",
        statChanges: { influence: 9, control: 6, corruption: 3, wealth: 500 }
      },
      {
        title: "Convincing Argument",
        narrative: "Your logic is airtight. They can't argue with you. By the end, they thank you for the 'opportunity.'",
        statChanges: { influence: 6, wealth: 200, control: 3 }
      },
      {
        title: "Demonic Pact",
        narrative: "You lock them into a binding agreement written in darkness itself. They can never back out.",
        statChanges: { power: 5, control: 8, corruption: 8, influence: 4 }
      },
      {
        title: "Honeyed Words",
        narrative: "Your persuasion is almost magical. They do exactly what you want and believe it was their idea.",
        statChanges: { influence: 7, wealth: 250, corruption: 2 }
      },
      {
        title: "Iron Will",
        narrative: "You refuse to budge. Your resolve is absolute. Eventually, they cave and accept your terms.",
        statChanges: { influence: 5, control: 7, wealth: 300 }
      },
      {
        title: "Twisted Deal",
        narrative: "The fine print is deliberately hidden. They think they've won, but you've actually taken everything.",
        statChanges: { influence: 8, control: 8, corruption: 9, wealth: 600 }
      },
      {
        title: "Mutual Understanding",
        narrative: "You find common ground. Trust is established. This is the beginning of something powerful.",
        statChanges: { influence: 6, empathy: 3, wealth: 150 }
      },
      {
        title: "Verbal Domination",
        narrative: "Your words are weapons. You dismantle their arguments piece by piece until they surrender.",
        statChanges: { influence: 9, control: 5, power: 1, wealth: 250 }
      },
      {
        title: "Silver-Tongued Devil",
        narrative: "You could sell water to a drowning man. Your offer is irresistible.",
        statChanges: { influence: 10, wealth: 450, control: 4 }
      },
      {
        title: "Alliance Forged",
        narrative: "Through negotiation, two enemies become powerful allies.",
        statChanges: { influence: 8, power: 4, wealth: 200 }
      },
      {
        title: "Profitable Compromise",
        narrative: "Everyone leaves richer. Your negotiation skills turned a simple deal into a goldmine.",
        statChanges: { influence: 7, wealth: 350, empathy: 1 }
      },
      {
        title: "Binding Contract",
        narrative: "The terms are airtight. They're locked into your deal for eternity.",
        statChanges: { influence: 9, control: 9, corruption: 4 }
      },
      {
        title: "Masterful Compromise",
        narrative: "You find the perfect middle ground that satisfies everyone perfectly.",
        statChanges: { influence: 8, wealth: 300, empathy: 2, control: 3 }
      }
    ]
  },

  // MAGIC & DARK POWERS (40+ scenarios)
  {
    keywords: ['magic', 'spell', 'curse', 'ritual', 'incantation', 'hex', 'enchant', 'power', 'summon', 'invoke', 'arcane', 'mystical'],
    type: 'power',
    minPower: 3,
    outcomes: [
      {
        title: "Spell Perfection",
        narrative: "Arcane energy flows through you effortlessly. The spell manifests with devastating precision.",
        statChanges: { power: 10, control: 5, corruption: 2 }
      },
      {
        title: "Dark Incantation",
        narrative: "Forbidden words tear through reality. Something ancient answers your call, hungry for power.",
        statChanges: { power: 12, corruption: 10, control: 3, health: -8 }
      },
      {
        title: "Ritual Mastery",
        narrative: "Every component perfectly placed, every word perfectly intoned. The magic takes hold absolutely.",
        statChanges: { power: 11, control: 7, corruption: 3 }
      },
      {
        title: "Cursed Existence",
        narrative: "You weave a curse that will plague them for eternity. Their suffering will be exquisite.",
        statChanges: { power: 8, corruption: 12, influence: 2 }
      },
      {
        title: "Reality Warping",
        narrative: "The laws of nature bend to your will. The impossible becomes possible through sheer magical force.",
        statChanges: { power: 15, control: 4, corruption: 4, health: -15 }
      },
      {
        title: "Elegant Casting",
        narrative: "Magic flows like water. Your spells are beautiful in their efficiency and devastating in their effect.",
        statChanges: { power: 9, control: 6, influence: 2 }
      },
      {
        title: "Demonic Invocation",
        narrative: "You call upon powers best left sleeping. The air grows cold as something answers your summons.",
        statChanges: { power: 13, corruption: 15, control: -2, health: -10 }
      },
      {
        title: "Protective Ward",
        narrative: "Magic surrounds you like armor. No harm can touch you—you're wrapped in power itself.",
        statChanges: { power: 7, control: 8, health: 5 }
      },
      {
        title: "Chaos Magick",
        narrative: "You abandon all structure. Raw magical chaos erupts, unpredictable and terrifyingly powerful.",
        statChanges: { power: 11, corruption: 8, control: -3 }
      },
      {
        title: "Arcane Knowledge",
        narrative: "Ancient secrets flood your mind. You understand magic at levels most demons never reach.",
        statChanges: { power: 10, control: 7, corruption: 1, influence: 2 }
      },
      {
        title: "Spellweaving Mastery",
        narrative: "Multiple spells intertwine perfectly, creating effects greater than the sum of their parts.",
        statChanges: { power: 13, control: 8, influence: 2 }
      },
      {
        title: "Soul Binding",
        narrative: "You've bound a powerful spirit to your will. It obeys absolutely.",
        statChanges: { power: 12, corruption: 8, control: 9 }
      },
      {
        title: "Eldritch Knowledge",
        narrative: "You've glimpsed truths that break mortal minds. You're stronger, but less human.",
        statChanges: { power: 14, corruption: 10, control: 5, empathy: -8 }
      },
      {
        title: "Transmutation Success",
        narrative: "Base materials become precious metals. The impossible transformation is complete.",
        statChanges: { power: 8, wealth: 500, control: 5 }
      },
      {
        title: "Magical Amplification",
        narrative: "Your magic is unstoppable. Enemies fall like wheat before the scythe.",
        statChanges: { power: 12, influence: 4, control: 4 }
      }
    ]
  },

  // CORRUPTION & DARKNESS (40+ scenarios)
  {
    keywords: ['corrupt', 'dark', 'evil', 'sin', 'torture', 'sadistic', 'cruel', 'dominate', 'enslave', 'consume', 'vile', 'malice'],
    type: 'dark',
    minCorruption: 5,
    outcomes: [
      {
        title: "Complete Corruption",
        narrative: "You embrace the darkness fully. Morality becomes a distant memory as power consumes you.",
        statChanges: { corruption: 15, power: 10, empathy: -10, control: 5 }
      },
      {
        title: "Inflicted Suffering",
        narrative: "Their pain is exquisite music. You extend their torment, savoring every scream.",
        statChanges: { corruption: 12, power: 6, empathy: -8, influence: 3 }
      },
      {
        title: "Soul Corruption",
        narrative: "You've twisted someone's very essence. They're no longer who they were—they're who you made them.",
        statChanges: { corruption: 13, power: 8, control: 7, empathy: -12 }
      },
      {
        title: "Darkness Embraced",
        narrative: "All pretense of goodness falls away. You are what you always were—pure, distilled evil.",
        statChanges: { corruption: 16, power: 12, control: 8, empathy: -15 }
      },
      {
        title: "Enslaved Will",
        narrative: "Your victim's mind breaks. They serve you now, grateful for the scraps of attention you give them.",
        statChanges: { control: 9, corruption: 10, power: 5, empathy: -10 }
      },
      {
        title: "Sadistic Pleasure",
        narrative: "Cruelty becomes art. Each act of malice is a brushstroke on your canvas of destruction.",
        statChanges: { corruption: 11, power: 7, wealth: 200, empathy: -9 }
      },
      {
        title: "Evil Incarnate",
        narrative: "Something fundamental shifts within you. You've become something worse than demon—something truly evil.",
        statChanges: { corruption: 18, power: 14, control: 10, empathy: -20 }
      },
      {
        title: "Consuming Hunger",
        narrative: "Your appetite for darkness is insatiable. You devour souls, power, and innocence itself.",
        statChanges: { corruption: 14, power: 11, health: 5, empathy: -12 }
      },
      {
        title: "Demonic Ascension",
        narrative: "You shed your last shreds of humanity. What emerges is something ancient, powerful, and utterly vile.",
        statChanges: { corruption: 17, power: 15, influence: 5, empathy: -18 }
      },
      {
        title: "Twisted Joy",
        narrative: "Evil feels good. Every cruel act fills you with joy. You're finally free to be what you truly are.",
        statChanges: { corruption: 12, power: 8, wealth: 250, empathy: -11 }
      },
      {
        title: "Malevolent Aura",
        narrative: "Darkness radiates from you. People feel fear in your presence, instinctively knowing you're wrong.",
        statChanges: { corruption: 13, power: 9, control: 6, influence: 4 }
      },
      {
        title: "Atrocity Committed",
        narrative: "The depths of your cruelty know no bounds. History will remember your name in terror.",
        statChanges: { corruption: 20, power: 12, empathy: -25, influence: 6 }
      },
      {
        title: "Broken Spirit",
        narrative: "You've destroyed something fundamental in them. They're just an empty shell now.",
        statChanges: { corruption: 11, power: 5, empathy: -15, control: 8 }
      },
      {
        title: "Tyrannical Rule",
        narrative: "Through fear and cruelty, you've built an empire of suffering.",
        statChanges: { corruption: 14, power: 11, control: 10, empathy: -12 }
      },
      {
        title: "Forbidden Desires",
        narrative: "You've indulged in pleasures so dark they've changed you permanently.",
        statChanges: { corruption: 12, power: 6, wealth: 300, empathy: -10 }
      }
    ]
  },

  // REDEMPTION & GOODNESS (35+ scenarios)
  {
    keywords: ['help', 'save', 'redeem', 'protect', 'forgive', 'love', 'compassion', 'sacrifice', 'hope', 'atone', 'mercy', 'noble'],
    type: 'redemption',
    minCorruption: -100,
    outcomes: [
      {
        title: "Act of Redemption",
        narrative: "You choose goodness despite your nature. Light blooms within you, burning away corruption.",
        statChanges: { empathy: 10, corruption: -8, influence: 3, control: 2 }
      },
      {
        title: "Selfless Sacrifice",
        narrative: "You give up something precious to save another. The act transforms you in ways you didn't expect.",
        statChanges: { empathy: 12, corruption: -10, power: -3, influence: 4 }
      },
      {
        title: "Hope Restored",
        narrative: "Your action proves that change is possible. You become a beacon of hope in the darkness.",
        statChanges: { empathy: 15, corruption: -12, influence: 6, wealth: -50 }
      },
      {
        title: "Forgiveness Granted",
        narrative: "You forgive even when you have every right to punish. Grace flows through you like water.",
        statChanges: { empathy: 13, corruption: -9, control: 2, wealth: 50 }
      },
      {
        title: "Love Conquers",
        narrative: "Pure, genuine love manifests through your actions. It touches something divine in this hellish place.",
        statChanges: { empathy: 16, corruption: -15, influence: 5, wealth: -100 }
      },
      {
        title: "Protection Offered",
        narrative: "You stand between the innocent and harm. Your strength becomes a shield for the vulnerable.",
        statChanges: { empathy: 11, control: 5, power: 2, influence: 3 }
      },
      {
        title: "Compassion Awakens",
        narrative: "You see their pain and truly understand. Empathy floods you, changing your perspective forever.",
        statChanges: { empathy: 14, corruption: -8, control: 1, influence: 2 }
      },
      {
        title: "Heavenly Light",
        narrative: "Something holy blooms within you. The darkness that defined you begins to crack and fade.",
        statChanges: { empathy: 18, corruption: -20, power: 1, influence: 5 }
      },
      {
        title: "Changed Heart",
        narrative: "You're not the monster you once were. Genuine change has taken root deep within your soul.",
        statChanges: { empathy: 12, corruption: -10, control: 3, influence: 2 }
      },
      {
        title: "Salvation Found",
        narrative: "Maybe redemption was possible after all. Hope isn't just a dream—it's becoming your reality.",
        statChanges: { empathy: 20, corruption: -25, influence: 8, power: 2 }
      },
      {
        title: "Second Chance Taken",
        narrative: "You could have gone back to darkness, but instead you chose light.",
        statChanges: { empathy: 14, corruption: -12, influence: 4, control: 3 }
      },
      {
        title: "Life Saved",
        narrative: "Someone lives today because you chose to help. It matters more than you know.",
        statChanges: { empathy: 11, corruption: -6, influence: 3 }
      },
      {
        title: "Moral Victory",
        narrative: "You've proven that evil doesn't define you. Your choice to be better is powerful.",
        statChanges: { empathy: 13, corruption: -8, control: 4, influence: 2 }
      },
      {
        title: "Acts of Kindness",
        narrative: "Small kindnesses add up. You're genuinely making the world better.",
        statChanges: { empathy: 10, corruption: -5, influence: 2 }
      },
      {
        title: "Divine Favor",
        narrative: "Your redemption is real. Even the heavens take notice of your change.",
        statChanges: { empathy: 17, corruption: -18, influence: 7, power: 1 }
      }
    ]
  },

  // SURVIVAL & INSTINCT (35+ scenarios)
  {
    keywords: ['run', 'escape', 'survive', 'hide', 'flee', 'evade', 'dodge', 'duck', 'retreat', 'abandon', 'endure', 'adapt'],
    type: 'survival',
    outcomes: [
      {
        title: "Narrow Escape",
        narrative: "Death grazes your shoulder as you slip away. A moment slower and you'd be finished.",
        statChanges: { control: 5, health: -8, power: -1 }
      },
      {
        title: "Desperate Flight",
        narrative: "You run faster than you ever have. The mob falls further behind with every desperate bound.",
        statChanges: { control: 3, health: -5, wealth: -50 }
      },
      {
        title: "Perfect Evasion",
        narrative: "You knew the alley would open up ahead. They didn't. You escape clean.",
        statChanges: { control: 6, influence: 1 }
      },
      {
        title: "Lucky Survival",
        narrative: "A fortuitous crack in the wall. A moment of inattention from your pursuer. Luck saves you.",
        statChanges: { control: 2, health: -10 }
      },
      {
        title: "Cunning Escape",
        narrative: "You leave a false trail that sends them the wrong way. By the time they realize, you're gone.",
        statChanges: { control: 7, influence: 1, corruption: 1 }
      },
      {
        title: "Magical Vanishing",
        narrative: "Arcane energy envelops you. You fade from sight just as they close in.",
        statChanges: { power: 3, control: 5, health: -3 }
      },
      {
        title: "Bold Stand",
        narrative: "You stop running and turn to face them. They weren't expecting a counter—and neither were you.",
        statChanges: { control: 4, power: 4, health: -15 }
      },
      {
        title: "Underground Refuge",
        narrative: "You duck into the tunnels beneath Pentagram City. They'll never find you down here.",
        statChanges: { control: 5, influence: -1 }
      },
      {
        title: "Deceptive Misdirection",
        narrative: "You leave your coat in an alley while you slip through shadows. They chase the coat.",
        statChanges: { control: 8, influence: 1, corruption: 1 }
      },
      {
        title: "Sacrificial Distraction",
        narrative: "You cause a chaos that draws attention away. It costs you, but you escape.",
        statChanges: { control: 3, wealth: -200, empathy: 1 }
      },
      {
        title: "Master Dodger",
        narrative: "Every attack misses. You move with impossible grace, making them look foolish.",
        statChanges: { control: 8, influence: 2 }
      },
      {
        title: "Impossible Parkour",
        narrative: "Jumping, climbing, defying gravity itself. You escape through maneuvers they can't follow.",
        statChanges: { control: 7, power: 2, health: -5 }
      },
      {
        title: "Hidden Haven",
        narrative: "You know a place where they'll never find you. It becomes your sanctuary.",
        statChanges: { control: 6, influence: 1 }
      },
      {
        title: "Last Minute Reprieve",
        narrative: "Just when all seems lost, opportunity strikes. You slip away in the chaos.",
        statChanges: { control: 4, influence: 1 }
      },
      {
        title: "Survivor's Luck",
        narrative: "Against all odds, you make it. Somehow, you always do.",
        statChanges: { control: 5, health: -8 }
      }
    ]
  },

  // MANIPULATION & CONTROL (35+ scenarios)
  {
    keywords: ['manipulate', 'control', 'dominate', 'puppet', 'blackmail', 'coerce', 'threaten', 'bribe', 'leverage', 'scheme', 'command'],
    type: 'manipulation',
    outcomes: [
      {
        title: "Puppet Master",
        narrative: "They dance to your tune without even realizing there are strings. You are the master of their fate.",
        statChanges: { control: 9, influence: 7, corruption: 6, power: 2 }
      },
      {
        title: "Blackmail Success",
        narrative: "One secret. That's all you needed. Now they'll do anything to keep it hidden.",
        statChanges: { control: 8, wealth: 350, corruption: 7, influence: 4 }
      },
      {
        title: "Information Extraction",
        narrative: "You know exactly what to say to make them spill everything. Pressure applied perfectly.",
        statChanges: { control: 7, influence: 5, corruption: 3 }
      },
      {
        title: "Psychological Warfare",
        narrative: "You break them mentally. They're yours now, their will shattered, their mind yours to use.",
        statChanges: { control: 10, power: 3, corruption: 8, empathy: -10 }
      },
      {
        title: "Coercive Persuasion",
        narrative: "The threats are subtle but crystal clear. They understand what happens if they disobey.",
        statChanges: { control: 8, influence: 4, corruption: 5, power: 1 }
      },
      {
        title: "Strategic Bribery",
        narrative: "Everyone has a price. You found theirs. Now they're working for you.",
        statChanges: { control: 7, wealth: -300, influence: 6, corruption: 2 }
      },
      {
        title: "Web of Lies",
        narrative: "Half-truths and outright fabrications weave a web that traps them completely.",
        statChanges: { control: 9, influence: 5, corruption: 7 }
      },
      {
        title: "Enforced Compliance",
        narrative: "Through a combination of threats and violence, you've made your demands very clear.",
        statChanges: { control: 8, power: 4, corruption: 9, health: -5 }
      },
      {
        title: "Emotional Leverage",
        narrative: "You know their weaknesses—what they love, what they fear. You exploit it mercilessly.",
        statChanges: { control: 9, influence: 6, corruption: 6, empathy: -8 }
      },
      {
        title: "Complete Domination",
        narrative: "They're not just following your orders—they're grateful to have you tell them what to do.",
        statChanges: { control: 11, influence: 8, corruption: 10, power: 2 }
      },
      {
        title: "Corporate Takeover",
        narrative: "Through manipulation, you've gained control of an entire organization.",
        statChanges: { control: 10, influence: 9, wealth: 400, corruption: 5 }
      },
      {
        title: "Subtle Corruption",
        narrative: "You didn't force them—you just suggested. Now they're doing terrible things willingly.",
        statChanges: { control: 9, corruption: 11, influence: 6, empathy: -9 }
      },
      {
        title: "Debt Master",
        narrative: "Through debt and obligation, you've trapped them in a cycle they can't escape.",
        statChanges: { control: 8, wealth: 300, influence: 5, corruption: 6 }
      },
      {
        title: "Mind Games",
        narrative: "You've turned their own insecurities against them. They're paralyzed by doubt.",
        statChanges: { control: 10, influence: 4, corruption: 7 }
      },
      {
        title: "Authority Seized",
        narrative: "Through cunning and manipulation, you've taken command.",
        statChanges: { control: 11, influence: 9, power: 3, corruption: 6 }
      }
    ]
  },

  // EXPLORATION & DISCOVERY (40+ scenarios)
  {
    keywords: ['explore', 'discover', 'investigate', 'search', 'find', 'uncover', 'seek', 'quest', 'venture', 'expedition'],
    type: 'exploration',
    outcomes: [
      {
        title: "Treasure Found",
        narrative: "Hidden beneath rubble and guarded by forgotten magic, you discover wealth beyond imagination.",
        statChanges: { wealth: 600, influence: 2, control: 2 }
      },
      {
        title: "Ancient Knowledge",
        narrative: "Forbidden texts reveal secrets of creation itself. Power untapped for eons is now yours to wield.",
        statChanges: { power: 8, control: 5, corruption: 3 }
      },
      {
        title: "Lost City",
        narrative: "Behind an impossible wall lies a city frozen in time. Its resources are legendary.",
        statChanges: { wealth: 400, influence: 5, power: 3 }
      },
      {
        title: "Dangerous Artifact",
        narrative: "You find something powerful and incredibly dangerous. One wrong move could doom you.",
        statChanges: { power: 10, control: 3, corruption: 5, health: -5 }
      },
      {
        title: "Secret Alliance",
        narrative: "In hidden chambers, you find powerful allies waiting. Together, you could shake Hell itself.",
        statChanges: { influence: 8, wealth: 200, power: 4 }
      },
      {
        title: "Dark Secret",
        narrative: "You uncover a truth so terrible that knowing it changes you. The weight of it settles on you.",
        statChanges: { control: 4, corruption: 4, empathy: -2, influence: 2 }
      },
      {
        title: "Hidden Sanctuary",
        narrative: "You find a place of peace in the heart of Hell. It becomes your refuge.",
        statChanges: { control: 5, empathy: 2, health: 10 }
      },
      {
        title: "Cursed Riches",
        narrative: "Gold and jewels are everywhere, but they're cursed. Taking them feels like a terrible mistake.",
        statChanges: { wealth: 500, corruption: 8, power: 2, health: -10 }
      },
      {
        title: "Forbidden Library",
        narrative: "Infinite knowledge contained in one impossible place. You could study for lifetimes.",
        statChanges: { power: 6, control: 7, influence: 3 }
      },
      {
        title: "Way Out",
        narrative: "You discover a passage that might lead beyond Hell. Hope and fear war within you.",
        statChanges: { influence: 3, empathy: 5, control: 4, corruption: -2 }
      },
      {
        title: "Underground Empire",
        narrative: "An entire civilization thrives beneath the surface. You've found a new world.",
        statChanges: { wealth: 700, influence: 8, power: 5 }
      },
      {
        title: "Celestial Device",
        narrative: "An artifact of heavenly origin. Its power could reshape reality itself.",
        statChanges: { power: 15, control: 5, influence: 6, corruption: 3 }
      },
      {
        title: "Hidden Graves",
        narrative: "Ancient burial chambers contain forgotten warriors and untold riches.",
        statChanges: { wealth: 400, power: 4, corruption: 6 }
      },
      {
        title: "Lost Knowledge",
        narrative: "You've found information that rewrites history. The truth is yours.",
        statChanges: { influence: 9, control: 6, power: 3 }
      },
      {
        title: "Portal Discovered",
        narrative: "A gateway to another realm. What lies beyond is both terrifying and wondrous.",
        statChanges: { power: 10, control: 7, influence: 5, corruption: 4 }
      }
    ]
  },

  // WEALTH & GREED (40+ scenarios)
  {
    keywords: ['money', 'wealth', 'rich', 'steal', 'rob', 'greedy', 'greed', 'lucrative', 'profit', 'gain', 'business'],
    type: 'social',
    outcomes: [
      {
        title: "Financial Empire",
        narrative: "Your business acumen is unmatched. Wealth flows to you from multiple sources.",
        statChanges: { wealth: 700, influence: 5, control: 3 }
      },
      {
        title: "Lucrative Scheme",
        narrative: "A brilliant business idea becomes wildly profitable. Soon, you're rolling in cash.",
        statChanges: { wealth: 550, control: 4, corruption: 2 }
      },
      {
        title: "Grand Heist",
        narrative: "A perfectly executed robbery nets you more gold than you've ever seen.",
        statChanges: { wealth: 600, control: 6, corruption: 5, health: -3 }
      },
      {
        title: "Corporate Takeover",
        narrative: "You quietly consolidate power and take over a massive enterprise. It's yours now.",
        statChanges: { wealth: 500, influence: 7, control: 6, corruption: 3 }
      },
      {
        title: "Extortion Operation",
        narrative: "Fear is a commodity, and you're the dealer. Regular payments pour in.",
        statChanges: { wealth: 400, control: 7, corruption: 10, influence: 4 }
      },
      {
        title: "Investment Success",
        narrative: "Every investment you make turns to gold. Your reputation as a financial genius grows.",
        statChanges: { wealth: 450, influence: 4, control: 2 }
      },
      {
        title: "Black Market Trading",
        narrative: "Forbidden goods flow through your network. Profit margins are obscene.",
        statChanges: { wealth: 500, corruption: 8, influence: 5, power: 2 }
      },
      {
        title: "Debt Collection",
        narrative: "You hunt down every penny owed to you. Nobody withholds from you twice.",
        statChanges: { wealth: 350, control: 7, corruption: 6, power: 3 }
      },
      {
        title: "Con Artist",
        narrative: "Your schemes are elaborate and foolproof. Mark after mark falls into your traps.",
        statChanges: { wealth: 480, control: 8, corruption: 7, influence: 3 }
      },
      {
        title: "Mob Money",
        narrative: "You've earned the favor of powerful interests. Protection and profit go hand in hand.",
        statChanges: { wealth: 550, power: 5, control: 5, corruption: 9, influence: 4 }
      },
      {
        title: "Treasure Hoard",
        narrative: "Your vault is overflowing with riches. You're wealthier than most kingdoms.",
        statChanges: { wealth: 800, influence: 6, control: 3 }
      },
      {
        title: "Monopoly Established",
        narrative: "You control the supply. They have no choice but to pay your prices.",
        statChanges: { wealth: 600, influence: 8, control: 8, corruption: 6 }
      },
      {
        title: "Lucky Windfall",
        narrative: "Chance and fate smile upon you. Suddenly, you're vastly wealthier.",
        statChanges: { wealth: 500, control: 1 }
      },
      {
        title: "Lucrative Trade",
        narrative: "You found the perfect market gap. Profits are astronomical.",
        statChanges: { wealth: 550, influence: 4, control: 4 }
      },
      {
        title: "Fortune Tripled",
        narrative: "Through skill and cunning, your wealth has tripled.",
        statChanges: { wealth: 700, control: 4, influence: 5 }
      }
    ]
  },

  // VIOLENCE & CONQUEST (35+ scenarios)
  {
    keywords: ['conquer', 'take over', 'territory', 'dominate', 'rule', 'expand', 'claim', 'seize', 'overthrow', 'war', 'invade'],
    type: 'power',
    outcomes: [
      {
        title: "Territory Conquered",
        narrative: "Through force and cunning, new lands bow before you. Your domain expands exponentially.",
        statChanges: { power: 12, influence: 8, control: 7, wealth: 300, corruption: 5 }
      },
      {
        title: "Bloody Triumph",
        narrative: "Opposition was crushed beneath your heel. Now, all yield to your rule.",
        statChanges: { power: 14, influence: 7, corruption: 12, health: -15, wealth: 200 }
      },
      {
        title: "Strategic Conquest",
        narrative: "You took the territory without unnecessary bloodshed. Everyone respects that.",
        statChanges: { power: 10, control: 9, influence: 6, wealth: 250 }
      },
      {
        title: "Tyrannical Rule",
        narrative: "You've become an absolute tyrant. Fear keeps your subjects in line.",
        statChanges: { power: 11, control: 10, corruption: 13, influence: 6, empathy: -15 }
      },
      {
        title: "Empire Building",
        narrative: "One territory down, dozens more to go. Your empire is just beginning.",
        statChanges: { influence: 10, power: 9, control: 6, wealth: 400 }
      },
      {
        title: "Mercenary Deployment",
        narrative: "You hired the best killers Hell has to offer. The battle was swift and devastating.",
        statChanges: { power: 8, wealth: -250, influence: 7, control: 5 }
      },
      {
        title: "Psychological Conquest",
        narrative: "You broke their will before battle even started. They surrendered without fighting.",
        statChanges: { influence: 11, control: 8, power: 6, corruption: 6 }
      },
      {
        title: "Magical Dominion",
        narrative: "Reality itself warps to your will. Your enemies couldn't oppose you even if they wanted to.",
        statChanges: { power: 15, control: 7, corruption: 8, health: -10 }
      },
      {
        title: "Fragile Peace",
        narrative: "You've conquered through force, but must now maintain control through even greater strength.",
        statChanges: { power: 9, control: 6, influence: 5, corruption: 5 }
      },
      {
        title: "Kingdom Claimed",
        narrative: "You've done it. You're now a ruler of Hell itself, with everything that comes with it.",
        statChanges: { power: 13, influence: 12, control: 10, wealth: 500, corruption: 7 }
      },
      {
        title: "Legendary Victory",
        narrative: "Your victory is so complete, so decisive, they'll sing songs about it for centuries.",
        statChanges: { power: 16, influence: 14, wealth: 400, control: 9 }
      },
      {
        title: "Blitzkrieg Success",
        narrative: "Lightning fast, overwhelming force. They never stood a chance.",
        statChanges: { power: 13, control: 7, influence: 8, wealth: 300 }
      },
      {
        title: "Siege Mastery",
        narrative: "You've laid siege to their stronghold and broken their will to resist.",
        statChanges: { power: 11, control: 8, influence: 7, wealth: 250 }
      },
      {
        title: "Final Victory",
        narrative: "The last obstacle is gone. The territory is yours completely.",
        statChanges: { power: 12, influence: 10, control: 8, wealth: 350 }
      },
      {
        title: "Unstoppable Expansion",
        narrative: "Your momentum is impossible to stop. Each victory fuels the next.",
        statChanges: { power: 14, influence: 11, wealth: 400, control: 7 }
      }
    ]
  },

  // BETRAYAL & DECEPTION (35+ scenarios)
  {
    keywords: ['betray', 'backstab', 'lie', 'deceive', 'trick', 'cheat', 'double-cross', 'fool', 'deceive', 'scheme'],
    type: 'manipulation',
    outcomes: [
      {
        title: "Perfect Betrayal",
        narrative: "They trusted you completely. That makes the knife in their back all the more devastating.",
        statChanges: { control: 9, corruption: 12, power: 5, influence: 3, empathy: -10 }
      },
      {
        title: "Elaborate Deception",
        narrative: "Your lie was so perfect, so intricate, that they'll never figure out the truth.",
        statChanges: { control: 10, corruption: 8, influence: 6, wealth: 300 }
      },
      {
        title: "Double Agent",
        narrative: "Playing both sides perfectly. Neither realizes you're working for the other.",
        statChanges: { control: 11, influence: 8, wealth: 400, corruption: 10 }
      },
      {
        title: "Stolen Identity",
        narrative: "You wore their face, lived their life, and destroyed everything they had from the inside.",
        statChanges: { control: 10, corruption: 11, power: 4, influence: 5 }
      },
      {
        title: "Confidence Shattered",
        narrative: "Your betrayal has broken something in them. They'll never trust anyone again.",
        statChanges: { corruption: 10, influence: 4, empathy: -12, control: 8 }
      },
      {
        title: "Alliance Turned",
        narrative: "Their allies are now your allies. You've stolen their entire power structure through cunning.",
        statChanges: { influence: 12, control: 9, power: 6, corruption: 9 }
      },
      {
        title: "Masterful Gambit",
        narrative: "A complex series of lies finally pays off. Everything fell into place exactly as planned.",
        statChanges: { control: 11, influence: 7, wealth: 350, corruption: 7 }
      },
      {
        title: "Poisoned Friendship",
        narrative: "You weaponized their love against them. They destroyed themselves for you.",
        statChanges: { control: 10, corruption: 13, empathy: -15, influence: 5 }
      },
      {
        title: "Forged Evidence",
        narrative: "False documents and manipulated witnesses convince everyone of your lies.",
        statChanges: { control: 9, influence: 8, corruption: 8, wealth: 200 }
      },
      {
        title: "Conspiracy Executed",
        narrative: "Years of careful planning culminate in a single, devastating moment of truth.",
        statChanges: { control: 12, influence: 9, power: 5, corruption: 10, wealth: 400 }
      },
      {
        title: "Fake Death",
        narrative: "You faked your demise. Now they mourn while you operate from the shadows.",
        statChanges: { control: 10, corruption: 9, influence: 7, wealth: 250 }
      },
      {
        title: "Seduced and Betrayed",
        narrative: "Love was the weapon. Broken hearts are your greatest achievements.",
        statChanges: { influence: 9, corruption: 11, control: 8, empathy: -13 }
      },
      {
        title: "Sold Out",
        narrative: "You sold them out to the highest bidder. It was a lucrative decision.",
        statChanges: { wealth: 500, control: 8, corruption: 12, influence: 5 }
      },
      {
        title: "Inside Man",
        narrative: "You've been their inside operative all along. The organization falls from within.",
        statChanges: { control: 11, influence: 10, power: 6, corruption: 9 }
      },
      {
        title: "Legendary Treachery",
        narrative: "Your betrayal is so complete, so final, that it will be remembered forever.",
        statChanges: { control: 12, corruption: 14, influence: 9, power: 4, empathy: -16 }
      }
    ]
  },

  // COLLABORATION & ALLIANCE (30+ scenarios)
  {
    keywords: ['team up', 'ally', 'cooperate', 'join', 'partnership', 'together', 'unite', 'combine', 'group', 'band', 'fellowship'],
    type: 'social',
    outcomes: [
      {
        title: "Powerful Alliance",
        narrative: "Together, you're unstoppable. Combined, your power is greater than the sum of parts.",
        statChanges: { influence: 10, power: 8, wealth: 300, empathy: 2 }
      },
      {
        title: "United Front",
        narrative: "Your enemies don't stand a chance against your unified force.",
        statChanges: { power: 9, influence: 9, control: 5 }
      },
      {
        title: "Found Family",
        narrative: "Bound by more than strategy now. These are the people you'd die for.",
        statChanges: { empathy: 8, influence: 7, wealth: 200 }
      },
      {
        title: "Strategic Partnership",
        narrative: "Each party brings unique skills. Together, you cover every base.",
        statChanges: { influence: 8, wealth: 400, control: 4 }
      },
      {
        title: "Unified Conquest",
        narrative: "With these allies at your side, nothing in Hell is beyond your reach.",
        statChanges: { power: 12, influence: 11, wealth: 350, control: 6 }
      },
      {
        title: "Mutual Respect",
        narrative: "You've found equals. True peers who challenge and inspire you.",
        statChanges: { influence: 7, empathy: 5, control: 3 }
      },
      {
        title: "Hidden Network",
        narrative: "A secret society of powerful individuals. You're now part of something ancient.",
        statChanges: { influence: 12, power: 5, wealth: 500, control: 5 }
      },
      {
        title: "Synergistic Bond",
        narrative: "Your combined abilities create something neither of you could achieve alone.",
        statChanges: { power: 11, influence: 9, control: 6, empathy: 2 }
      },
      {
        title: "Blood Oath",
        narrative: "Bound by magic and oath, you're connected for eternity. Loyalty runs deep.",
        statChanges: { influence: 10, power: 8, control: 8, corruption: 4 }
      },
      {
        title: "Unstoppable Force",
        narrative: "History will remember what you accomplish together. Hell itself trembles.",
        statChanges: { power: 15, influence: 13, wealth: 400, control: 8 }
      }
    ]
  },

  // POWER GAIN & EVOLUTION (30+ scenarios)
  {
    keywords: ['power up', 'evolve', 'transcend', 'transform', 'ascend', 'unleash', 'awaken', 'grow', 'strengthen', 'consume'],
    type: 'power',
    outcomes: [
      {
        title: "Ultimate Transformation",
        narrative: "You've transcended your previous limitations. You're something greater now.",
        statChanges: { power: 20, control: 10, corruption: 8, health: 10 }
      },
      {
        title: "Ascended Being",
        narrative: "You've become more demon than anything else. Your power is now absolute.",
        statChanges: { power: 18, influence: 10, control: 8, corruption: 10 }
      },
      {
        title: "Evolution Complete",
        narrative: "The cocoon breaks. What emerges is stronger, faster, deadlier.",
        statChanges: { power: 16, control: 10, health: 15, wealth: 200 }
      },
      {
        title: "Consumed Essence",
        narrative: "You absorbed your enemy's power. Now their strength is yours.",
        statChanges: { power: 14, corruption: 6, control: 6, health: -5 }
      },
      {
        title: "Awakened Potential",
        narrative: "Abilities you didn't know you had suddenly manifest. You're far more capable than you realized.",
        statChanges: { power: 15, control: 8, influence: 5 }
      },
      {
        title: "Divine Ascension",
        narrative: "You're no longer fully demon. Something heavenly has touched you.",
        statChanges: { power: 12, empathy: 10, corruption: -5, influence: 8 }
      },
      {
        title: "Demonic Perfection",
        narrative: "All your training culminates in perfection. You're the ideal demon warrior.",
        statChanges: { power: 17, control: 12, corruption: 8 }
      },
      {
        title: "Godlike Status",
        narrative: "Few things in Hell can challenge you now. You're approaching godhood.",
        statChanges: { power: 19, influence: 12, control: 10, wealth: 300 }
      },
      {
        title: "Primal Awakening",
        narrative: "Ancient, bestial power stirs within you. Instinct overwhelms reason.",
        statChanges: { power: 16, corruption: 12, control: -2, health: 5 }
      },
      {
        title: "Pinnacle Reached",
        narrative: "You've reached the peak of power. Further ascension seems impossible.",
        statChanges: { power: 20, control: 11, influence: 10, corruption: 7 }
      }
    ]
  },

  // LEARNING & TRAINING (25+ scenarios)
  {
    keywords: ['train', 'practice', 'learn', 'study', 'meditate', 'discipline', 'master', 'improve', 'develop', 'refine'],
    type: 'power',
    outcomes: [
      {
        title: "Breakthrough Training Session",
        narrative: "Hours of intense training suddenly click. New techniques become second nature.",
        statChanges: { power: 6, control: 7, health: -5 }
      },
      {
        title: "Mentor's Wisdom",
        narrative: "An elder shares ancient knowledge. You absorb years of experience in moments.",
        statChanges: { power: 8, control: 6, influence: 4 }
      },
      {
        title: "Self-Discovery",
        narrative: "Through meditation, you unlock hidden aspects of yourself.",
        statChanges: { control: 8, empathy: 3, power: 4 }
      },
      {
        title: "Grueling Regimen",
        narrative: "You push yourself to the absolute limit. Growth through suffering.",
        statChanges: { power: 9, health: -15, corruption: 3 }
      },
      {
        title: "Gradual Mastery",
        narrative: "Small, consistent improvements add up. You're becoming a true master.",
        statChanges: { power: 5, control: 7, health: 5 }
      }
    ]
  },

  // DEALS & BARGAINS (20+ scenarios)
  {
    keywords: ['deal', 'contract', 'bargain', 'offer', 'negotiate', 'trade', 'exchange', 'sell', 'agreement'],
    type: 'manipulation',
    outcomes: [
      {
        title: "Favorable Exchange",
        narrative: "You strike a deal that heavily favors you. Your negotiation skills are unmatched.",
        statChanges: { wealth: 500, control: 5, influence: 3, corruption: 2 }
      },
      {
        title: "Soul Debt",
        narrative: "You make a deal that requires payment in spiritual essence. Worth it though.",
        statChanges: { wealth: 300, corruption: 8, power: 5, health: -10 }
      },
      {
        title: "Mutual Benefit",
        narrative: "Both parties walk away satisfied. An honest deal in a dishonest place.",
        statChanges: { wealth: 200, influence: 6, empathy: 2 }
      },
      {
        title: "Gambled and Won",
        narrative: "You wagered everything on this deal. The odds were against you, but luck favors the bold.",
        statChanges: { wealth: 800, control: 4, corruption: 5 }
      }
    ]
  },

  // EXPLORATION & DISCOVERY (25+ scenarios)
  {
    keywords: ['explore', 'discover', 'venture', 'search', 'find', 'uncover', 'locate', 'investigate', 'traverse', 'journey'],
    type: 'exploration',
    outcomes: [
      {
        title: "Hidden Treasure",
        narrative: "Deep in forgotten places, you find wealth beyond measure.",
        statChanges: { wealth: 1000, power: 3, control: 2 }
      },
      {
        title: "Ancient Knowledge",
        narrative: "You discover forbidden texts containing incredible secrets.",
        statChanges: { power: 6, control: 8, corruption: 3 }
      },
      {
        title: "Lost Sanctuary",
        narrative: "A place of pure peace. You meditate and emerge renewed.",
        statChanges: { health: 30, empathy: 5, corruption: -3 }
      },
      {
        title: "Danger Zone",
        narrative: "You venture too deep into a dangerous area. Barely escape with your life.",
        statChanges: { health: -40, power: 4, control: 6 }
      },
      {
        title: "Fateful Encounter",
        narrative: "Deep in your travels, you meet someone who changes everything.",
        statChanges: { influence: 8, empathy: 4, wealth: 200 }
      }
    ]
  },

  // HELP & REDEMPTION (20+ scenarios)
  {
    keywords: ['help', 'save', 'protect', 'assist', 'support', 'rescue', 'aid', 'defend', 'charity', 'mercy'],
    type: 'redemption',
    outcomes: [
      {
        title: "Heroic Rescue",
        narrative: "Against the odds, you save someone's life. A genuine hero's moment.",
        statChanges: { empathy: 10, influence: 8, corruption: -5, power: 3 }
      },
      {
        title: "Small Kindness",
        narrative: "A tiny act of kindness creates a ripple of positive change.",
        statChanges: { empathy: 6, control: 2, wealth: -50 }
      },
      {
        title: "Protecting the Innocent",
        narrative: "You stand between evil and those who cannot defend themselves.",
        statChanges: { empathy: 8, power: 4, corruption: -8, influence: 5 }
      },
      {
        title: "Genuine Connection",
        narrative: "Through helping others, you rediscover your own humanity.",
        statChanges: { empathy: 12, health: 10, corruption: -6 }
      }
    ]
  },

  // BETRAYAL & CONFLICT (20+ scenarios)
  {
    keywords: ['betray', 'backstab', 'deceive', 'trick', 'plot', 'scheme', 'manipulate', 'lie', 'cheat', 'double-cross'],
    type: 'dark',
    outcomes: [
      {
        title: "Perfect Deception",
        narrative: "Your lie is so perfect, they'll never know what hit them.",
        statChanges: { control: 10, corruption: 8, wealth: 300, influence: 6 }
      },
      {
        title: "Betrayal Complete",
        narrative: "You turn on an ally. The deed is done, and they'll pay for trusting you.",
        statChanges: { corruption: 12, control: 8, power: 4, empathy: -6 }
      },
      {
        title: "Con Artist's Dream",
        narrative: "A masterclass in manipulation. They fell for it completely.",
        statChanges: { control: 12, wealth: 500, influence: 7, corruption: 6 }
      },
      {
        title: "Uncomfortable Victory",
        narrative: "You won through treachery, but the guilt gnaws at you.",
        statChanges: { wealth: 200, control: 6, corruption: 5, empathy: -4 }
      }
    ]
  }
];

export function getRelevantScenarios(userInput: string, gameState: any): ScenarioTemplate[] {
  const input = userInput.toLowerCase();
  
  // Find all scenarios that match any keyword in the user input
  const matches = scenarios.filter(scenario => {
    const hasKeywordMatch = scenario.keywords.some(keyword => 
      input.includes(keyword)
    );
    
    // Apply stat filters if defined
    if (hasKeywordMatch) {
      if (scenario.minPower !== undefined && gameState.character.power < scenario.minPower) {
        return false;
      }
      if (scenario.minCorruption !== undefined && gameState.character.corruption < scenario.minCorruption) {
        return false;
      }
    }
    
    return hasKeywordMatch;
  });

  return matches.length > 0 ? matches : [scenarios[Math.floor(Math.random() * scenarios.length)]];
}
