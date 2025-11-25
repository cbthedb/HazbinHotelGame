# Hazbin Hotel BitLife-Style Life Simulation Game

A comprehensive single-player, choice-driven life simulation game set in the Hazbin Hotel universe. Play as a demon in Hell, navigate complex relationships, acquire powers, and shape your destiny through multiple branching paths.

## Features

### 🎮 Core Systems

#### Character Creation
- **5 Origin Paths**: Royal-born, Hellborn, Weak Sinner, Deal Immigrant, + unlockable special origins
- **Customizable Appearance**: Horns, wings, and color palette selections
- **8 Core Stats**: Power, Control, Influence, Corruption, Empathy, Health, Wealth, Reputation
- **Dynamic Trait System**: 60+ traits with point-based selection and balancing

#### Power System
- **15 Power Types** with 45+ abilities:
  - Hellfire/Infernal Flame
  - Voice/Broadcast Magic (Vox-style)
  - Shadow & Eldritch (Alastor-esque)
  - Contract Magic/Bargaining
  - Seduction/Charm (Succubi/Incubi)
  - Tech/Cyber Glamour (Velvette-style)
  - Pheromone/Scent Control (Valentino-style)
  - Regeneration/Durability
  - Teleportation/Movement Magic
  - Necromancy/Soulcraft
  - Glamour & Shapeshift
  - Musical/Performance Magic
  - Physical/Brute Abilities
  - Illusion & Mind-Bend
  - Divine/Whitefire (rare, Charlie/angelic)

- **Power Growth**: Use-based XP system with individual leveling
- **Loadout System**: Equip 3-5 active powers + passive abilities with cooldown mechanics

#### Gameplay Systems
- **Event-Driven Gameplay**: Dynamic events with branching choices and stat consequences
- **NPC Relationships**: Deep relationship system with canon Hazbin Hotel characters
- **Territory Control**: Expand your domain across 7 districts in Pentagram City
- **Faction Reputation**: Multiple factions with shifting allegiances
- **AI-Powered Events**: Houndify integration for dynamic dialogue and event generation
- **Turn-Based Progression**: Play at your own pace with turn-based mechanics

#### Multiple Endings
- **Redemption**: High Empathy, low Corruption, strong Hotel reputation
- **Hell's Apex**: Overlord supremacy through power and dominion
- **Syndicate Emperor**: Criminal underworld control
- **Media Dominion**: Control through information and broadcasts
- **The New Crown**: Overthrow Hell's royalty
- **Apocalypse Unchained**: Corruption-driven collapse
- **Faded to Nothing**: The forgotten path
- **Forever Hedonist**: Pleasure-seeking retirement
- **Radio Demon's Equal**: Match Alastor in power and legend
- **Charlie's Hope**: Become redemption's guardian

## Technical Stack

- **Frontend**: React with TypeScript, Vite
- **Backend**: Express.js with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query (React Query) for data fetching
- **Routing**: Wouter for client-side routing
- **Data Persistence**: LocalStorage for game saves
- **UI Framework**: shadcn/ui with Art Deco Hazbin Hotel theming
- **AI Integration**: Houndify for dynamic event generation
- **Audio**: Howler.js for soundtrack integration (prepared)

## Project Structure

```
client/src/
├── pages/
│   ├── home.tsx                 # Main menu
│   ├── character-creation.tsx   # Character creation flow
│   ├── game.tsx                 # Main game interface
│   └── not-found.tsx            # 404 page
├── components/
│   ├── character-creation/
│   │   ├── name-step.tsx
│   │   ├── appearance-step.tsx
│   │   ├── origin-step.tsx
│   │   ├── traits-step.tsx
│   │   ├── powers-step.tsx
│   │   └── summary-step.tsx
│   └── game/
│       ├── stats-panel.tsx
│       ├── powers-panel.tsx
│       ├── event-card.tsx
│       ├── actions-panel.tsx
│       ├── map-panel.tsx
│       └── npc-panel.tsx
├── data/
│   ├── origins.json             # 5 origin paths
│   ├── traits.json              # 60+ traits
│   ├── powers.json              # 45+ abilities
│   ├── districts.json           # 7 Pentagram City districts
│   ├── npcs.json                # Canon Hazbin characters
│   ├── factions.json            # Faction definitions
│   ├── endings.json             # 10+ endings
│   ├── events.json              # Event templates
│   └── names.json               # Name generation data
├── lib/
│   ├── gameHelpers.ts           # Game logic utilities
│   ├── game-state.ts            # Save/load system
│   ├── game-context.tsx         # Game state context provider
│   ├── ai-event-client.ts       # AI event client
│   └── queryClient.ts           # TanStack Query configuration
└── App.tsx                       # Main app component

server/
├── routes.ts                    # API endpoints
├── storage.ts                   # Storage interface (in-memory)
├── lib/
│   └── ai-events.ts            # AI event generation service
└── index-dev.ts                # Dev server entry

shared/
└── schema.ts                    # TypeScript types and Zod schemas
```

## Game Design Principles

### Balance
- Early game: Forgiving, encourages experimentation
- Mid game: Faction arcs, powerful contracts, playstyle shifts
- Late game: Domain powers with catastrophic risks via high Corruption
- Soft caps: Stats (Power/Control ~100) unlock story-based progression

### Progression
- **Use-based XP**: Powers grow through use
- **Trait Investment**: Traits define playstyle and unlock options
- **Relationship Depth**: NPCs evolve based on player choices
- **Territory Control**: Visible map control progression

### Narrative
- Dark comedy with Hazbin Hotel tone
- Meaningful choice consequences
- Multiple valid playpaths to different endings
- Branching storylines with faction wars

## Data Structures

### Character
```typescript
{
  firstName: string
  lastName: string
  origin: string
  age: number
  stats: { power, control, influence, corruption, empathy, health, wealth }
  traits: string[]
  powers: { id, level, experience }[]
  rank: string
}
```

### Power
```typescript
{
  id: string
  name: string
  type: string
  basePower: number
  controlReq: number
  corruptionCost: number
  cooldown: number
  isPassive: boolean
  description: string
  rarity: string
  unlockConditions: { origin?, minPower?, minControl?, minInfluence? }
}
```

### Event
```typescript
{
  id: string
  title: string
  description: string
  type: 'daily' | 'contract' | 'career' | 'romance' | 'war' | 'random'
  choices: {
    id: string
    text: string
    requirements?: { control, power, influence }
    outcomes: {
      statChanges?: Record<string, number>
      narrativeText: string
      powerGrant?: string[]
      reputationChanges?: Record<string, number>
    }
  }[]
  onlyOnce: boolean
}
```

## API Endpoints

### AI Event Generation
- `POST /api/ai-event` - Generate dynamic event
- `POST /api/npc-dialogue` - Generate NPC dialogue
- `POST /api/event-chain` - Generate event follow-ups
- `GET /api/health` - Health check

## Customization

### Design Theme
Located in `client/src/index.css` - Hazbin Hotel Art Deco theme with red/black/gold palette:
- Primary: Crimson red (#8B0000)
- Secondary: Deep purple
- Accent: Gold (#FFD700)
- Font: Playfair Display (headings) + DM Sans (body)

### Game Balance
Edit `client/src/data/` JSON files to adjust:
- Starting stats per origin
- Power costs and cooldowns
- Trait points and modifiers
- Event triggers and outcomes
- NPC affinities

## Saving & Loading

Games are automatically saved to browser LocalStorage after every turn. Players can:
- Continue last game from home screen
- Export game as JSON (future feature)
- Import game from JSON backup (future feature)

## Development

### Running Locally
```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:5000`

### Building for Production
```bash
npm run build
```

## Future Enhancements

- [ ] Full Houndify AI integration for dynamic dialogue
- [ ] Battle system for territory control
- [ ] Soundtrack integration (Howler.js prepared)
- [ ] More complex NPC interactions
- [ ] Unlockable cosmetics and badges
- [ ] New Game+ with carry-over bonuses
- [ ] Multiplayer seasonal events (if server-based)
- [ ] Mobile app version

## Credits

- **Game Design**: Based on BitLife game mechanics
- **Universe**: Hazbin Hotel by Vivziepop
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS

---

**Ready to begin your life in Hell!**
