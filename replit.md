# Hazbin Hotel BitLife Simulation Game

## Project Overview
A comprehensive BitLife-style life simulation game set in the Hazbin Hotel universe featuring character creation with 5 origin paths, 8 core stats, 127 powers across 15 power types with rarity tiers (common→legendary), 60+ traits, Pentagram City exploration across 7 districts, territory control mechanics, NPC relationships with romance options, faction reputation systems, power ranking progression, multiple endings, integrated soundtrack, and AI-generated dynamic scenarios.

## Latest Updates

### Power Shop Separation & Economy Rebalance (CURRENT)
- **Separated Shop Systems**: Character creation and in-game shops now completely independent
  - Character creation soulcoin shop (for starting powers)
  - In-game wealth shop (for mid-run power purchases)
  - Only mythical shard shop connects between them (10 shards = permanent mythical power unlock)
- **Drastically Increased Costs**:
  - **Soulcoins (character creation)**: 0, 300, 750, 1500, 3000 (was 0, 100, 250, 500, 1000)
  - **Wealth (in-game)**: 200, 1500, 4500, 10000, 20000 (was 50, 500, 1500, 3500, 7500)
- **CE Ultimate Bug Fixed**: 
  - Power attacks now only add 20 gauge/turn (was 100+, causing instant charge)
  - Still requires 7 turns to fully charge ultimate (700 total)
  - Maintains intended battle pacing and player progression feel
- **Design Philosophy**: Powers are now extremely precious - requires extensive grind to acquire anything beyond commons

### Extreme Difficulty & Grind Tuning (V0.1)
- **Version Indicator**: Glowing "V0.1" display in top right corner with pulse animation
- **Overlord Buffing**: 3500 health, 40 damage (significantly harder than before)
- **Battle Rewards Halved**: 
  - Regular win: Power 1, Influence 0, Wealth 25, Soulcoins 5
  - Rival win: Power 1, Influence 1, Wealth 40, Soulcoins 8
  - Overlord win: Power (50% of base), Influence 2, Wealth 100, Soulcoins variable
- **Level-up Nerfs**: 
  - Health: 5→2 per level
  - Stat gains: 2 guaranteed→0-1 random stats (30% chance)
- **Action Stat Gains Reduced 50%**:
  - Train Power: 2→1 base gain (continues diminishing)
  - Socialize: 1→0.5 influence
  - Perform: 1→0.5 influence/empathy (wealth 40→20)
  - Scheme: 1→0.5 influence, corruption 5→3, soulcoins 1-3→1-2
- **Progression Milestones 50%+ Harder**:
  - Power: 50→75, 150→250, 250→400, 500→750
  - Empathy: 50→80, 80→150, 120→200, 150→280
  - Corruption: 60→100, 120→200, 180→300, 250→400
- **Design Philosophy**: Game now significantly grindier - rewards minimal stat progression to encourage extended play sessions

### Age-Based Health Scaling (COMPLETED)
- **Out-of-Battle Health**: Capped at 100 (with passive +5 health/turn regen)
- **In-Battle Health**: Scales dramatically with age (+2 per age point)
- **Battle Formula**: Base Health + (Age × 2) + (Power × 0.25)
- **Example Progression**:
  - Age 50: +100 bonus health in battle
  - Age 100: +200 bonus health in battle
  - Age 114: +228 bonus health in battle (aligns with user's example of ~300 total)
- **UI**: Stats panel shows both overworld health and battle health alongside each other
- **Design**: Encourages long-term play as characters become exponentially more durable with age

### Rest Action & Health Regeneration (COMPLETED)
- **Passive Recovery**: +5 health per turn automatically
- **Rest Action**: Immediate +30 health recovery with no cooldown
- **Leveling Bonuses**: Every 5 age = 1 level, grants +2 health + 0-1 random stat gains (30% chance)

### Power Shop System (COMPLETED)
- **Shop Panel**: Integrated shopping UI in left column below progression panel
- **Power Pricing**: 
  - Common powers (free at start)
  - Uncommon: 500 wealth
  - Rare: 1500 wealth
  - Epic: 3500 wealth
  - Legendary: 7500 wealth
- **Initial Setup**: Players start with 1000 wealth and only common powers, must purchase higher rarities
- **Currency Usage**: Wealth now has critical gameplay purpose - progression requires purchasing powers

### Overlord Power Rewards (COMPLETED)
- Defeating overlords rewards one of their signature powers
- Win conditions now check if opponent is overlord and add their power to character
- Works for all overlord types: Charlie, Alastor, Valentino, Vox, Carmilla, Lucifer

### Extended Power Set (COMPLETED)
- **Total Powers**: 127 powers (up from 97)
- **New Powers Added** (15):
  - Shadow Strike (common)
  - Soul Drain (uncommon)
  - Mind Shatter (uncommon)
  - Chaos Pulse (rare)
  - Blood Spiral (rare)
  - Void Touch (epic)
  - Redemption Light (uncommon)
  - Shadow Clones (rare)
  - Infernal Contract (rare)
  - Celestial Ascension (epic)
  - Summoned Legion (rare)
  - Reality Distortion (legendary)
  - Demon Form (rare)
  - Eternal Vow (epic)
  - Sonic Scream (uncommon)

### Battle System
- Base Attack: Lowest rarity non-passive power for scaling
- Ultimate Attack: Highest rarity power for maximum damage (2.5x)
- Cursed Energy: 15 per turn max, powers cost 3× their base cost
- Ultimate Gauge: Builds over 7 turns at 100 points/turn, unleash for 2.5x damage burst
- Damage Scaling: 3% more per power level stat
- Health Scaling: +0.25 per power level + **+2 per age point** (significant durability scaling)

### Dynamic Audio System (COMPLETED)
- **Background Music Rotation**: Alternates between "Stayed Gone" and "Hear My Hope" for variety
- **Overlord Battle Themes** (unique themes for each overlord):
  - Alastor: Insane
  - Vox & Valentino: Vox Dei
  - Rosie: Don't You Forget
  - Carmilla: Out For Love
  - Charlie & Lucifer: Ready For This
- **Audio System**: Located in `client/src/lib/audio.ts` with playBattleMusic function for opponent-specific themes

## Architecture
- **Frontend**: React + TypeScript with Wouter routing
- **Backend**: Express.js with TanStack Query
- **Storage**: In-memory storage with browser persistence
- **UI Framework**: Shadcn + Tailwind CSS
- **Audio**: Integrated soundtrack system
- **Data**: Powers, NPCs, Traits in JSON format

## Key Game Features

### Character Creation (5 Origins)
1. Hellborn - native demon
2. Corrupted - redeemed soul gone dark
3. Fallen Angel - cast out from heaven
4. Contract Dealer - soul trader
5. Pit Fighter - rises from the arenas

### Stats (8 Core)
- Power: Combat & magical ability
- Control: Emotional regulation & ability control
- Influence: Social manipulation & leadership
- Corruption: Alignment to demonic corruption
- Empathy: Connection to others
- Charisma: Charm & persuasion
- Health: Physical/mental resilience
- Wealth: Financial resources

### Power Types (15)
1. Hellfire
2. Blood Magic
3. Shadow
4. Illusion
5. Necromancy
6. Teleportation
7. Glamour
8. Summoning
9. Voice Broadcast
10. Deals
11. Holy
12. Transformation
13. Bond
14. Reality
15. Void/Chaos

### Districts (7)
1. Pride Ring - downtown center
2. Wrath Arena - combat district
3. Lust Pavilion - entertainment
4. Gluttony Market - trade hub
5. Envy Tower - corporate
6. Greed Casino - wealth district
7. Sloth Gardens - rest/recovery

## Current Game State
- ✅ Character creation with full customization
- ✅ Core stats system with progression
- ✅ 127 power system with rarities and requirements
- ✅ Battle system with cursed energy mechanics
- ✅ Shop system with wealth-based purchases
- ✅ Overlord power rewards
- ✅ Extreme difficulty tuning & grind mechanics
- ✅ Version indicator display
- ⏳ NPC relationships and romance
- ⏳ Faction reputation system
- ⏳ Territory control mechanics
- ⏳ Multiple endings system
- ⏳ AI-generated scenario system

## Code Organization
```
client/src/
├── pages/
│   ├── game.tsx (main game loop)
│   ├── character-creation.tsx (character setup)
├── components/
│   ├── game/
│   │   ├── battle-panel.tsx (combat system)
│   │   ├── shop-panel.tsx (power shop)
│   │   ├── stats-panel.tsx (character stats)
│   │   ├── powers-panel.tsx (learned powers)
│   │   ├── progression-panel.tsx (milestones)
│   │   ├── event-card.tsx (scenarios)
│   │   └── ... (other UI components)
├── data/
│   ├── powers.json (all 127 powers)
│   ├── npcs.json (all characters)
│   └── ai-scenarios.ts (217+ story outcomes)
└── lib/
    ├── game-state.ts (save/load system)
    └── audio.ts (soundtrack management)
```

## Dev Guidelines
- Follow fullstack_js conventions
- Minimize files - collapse similar components
- Keep backend thin - push logic to frontend
- Always define types in shared/schema.ts first
- Use in-memory storage unless specified otherwise
- Validate with Zod schemas before API calls
