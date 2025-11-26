import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ==================== CHARACTER & GAME STATE ====================

export const characters = pgTable("characters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  
  // Origin & Appearance
  origin: text("origin").notNull(), // royal-born, hellborn, sinner-weak, deal-immigrant, accidental
  appearance: jsonb("appearance").$type<{
    horns: string;
    wings: string;
    colorPalette: string[];
  }>().notNull(),
  
  // Core Stats
  power: integer("power").notNull().default(10),
  control: integer("control").notNull().default(10),
  influence: integer("influence").notNull().default(10),
  corruption: integer("corruption").notNull().default(0),
  empathy: integer("empathy").notNull().default(10),
  health: integer("health").notNull().default(100),
  wealth: integer("wealth").notNull().default(100),
  soulcoins: integer("soulcoins").notNull().default(0),
  mythicalShards: integer("mythical_shards").notNull().default(0),
  
  // Powers & Traits
  powers: jsonb("powers").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  traits: jsonb("traits").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  
  // Meta Stats
  age: integer("age").notNull().default(0),
  currentRank: text("current_rank").notNull().default("street-demon"), // street-demon, rising-power, overlord-candidate, overlord, supreme-overlord, hells-apex
  currentLocation: text("current_location").notNull().default("hotel-district"),
  rank: text("rank").notNull().default("street-demon"), // For backward compatibility
  
  // Turn & Progression
  currentTurn: integer("current_turn").notNull().default(0),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const gameStates = pgTable("game_states", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  characterId: varchar("character_id").notNull().references(() => characters.id, { onDelete: 'cascade' }),
  
  // Active Powers (IDs of equipped abilities)
  activePowers: jsonb("active_powers").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  
  // Power Levels (powerID -> level)
  powerLevels: jsonb("power_levels").$type<Record<string, number>>().notNull().default(sql`'{}'::jsonb`),
  
  // Power Cooldowns (powerID -> turns remaining)
  powerCooldowns: jsonb("power_cooldowns").$type<Record<string, number>>().notNull().default(sql`'{}'::jsonb`),
  
  // Trait IDs
  traits: jsonb("traits").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  
  // Contract Clauses (for Deal Immigrants)
  contractClauses: jsonb("contract_clauses").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  
  // Faction Reputations (factionID -> rep value)
  factionReps: jsonb("faction_reps").$type<Record<string, number>>().notNull().default(sql`'{}'::jsonb`),
  
  // NPC Relationships (npcID -> affinity value)
  npcRelationships: jsonb("npc_relationships").$type<Record<string, {
    affinity: number;
    isRomanced: boolean;
    isRival: boolean;
    favorsOwed: number;
  }>>().notNull().default(sql`'{}'::jsonb`),
  
  // Territory Control (districtID -> ownership info)
  territories: jsonb("territories").$type<Record<string, {
    owned: boolean;
    ownerId: string | null;
    tributePerTurn: number;
  }>>().notNull().default(sql`'{}'::jsonb`),
  
  // Event History (completed event IDs)
  completedEvents: jsonb("completed_events").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  
  // Story Flags
  storyFlags: jsonb("story_flags").$type<Record<string, any>>().notNull().default(sql`'{}'::jsonb`),
  
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const saves = pgTable("saves", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slotNumber: integer("slot_number").notNull(), // 1-5 for save slots
  characterId: varchar("character_id").notNull().references(() => characters.id, { onDelete: 'cascade' }),
  gameStateId: varchar("game_state_id").notNull().references(() => gameStates.id, { onDelete: 'cascade' }),
  saveName: text("save_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==================== SCHEMAS ====================

export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGameStateSchema = createInsertSchema(gameStates).omit({
  id: true,
  updatedAt: true,
});

export const insertSaveSchema = createInsertSchema(saves).omit({
  id: true,
  createdAt: true,
});

// ==================== TYPES ====================

export type Character = typeof characters.$inferSelect;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;

export type GameState = typeof gameStates.$inferSelect;
export type InsertGameState = z.infer<typeof insertGameStateSchema>;

export type Save = typeof saves.$inferSelect;
export type InsertSave = z.infer<typeof insertSaveSchema>;

// ==================== GAME DATA TYPES (JSON-based) ====================

export type Origin = {
  id: string;
  name: string;
  description: string;
  startingStats: {
    power: number;
    control: number;
    influence: number;
    corruption: number;
    empathy: number;
    health: number;
    wealth: number;
  };
  traitPoints: number;
  lockedTraits: string[]; // traits exclusive to this origin
  suggestedPowers: string[]; // power IDs to choose from
};

export type PowerType = "hellfire" | "voice-broadcast" | "shadow-eldritch" | "contract" | "seduction" | "tech-cyber" | "pheromone" | "regeneration" | "teleportation" | "necromancy" | "glamour" | "musical" | "physical" | "illusion" | "divine";

export type Power = {
  id: string;
  name: string;
  type: PowerType;
  basePower: number;
  controlReq: number;
  corruptionCost: number;
  cooldown: number; // in turns
  effect: string;
  description: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythical";
  unlockConditions: {
    origin?: string[];
    minPower?: number;
    minControl?: number;
    minInfluence?: number;
    requiredEvent?: string;
  };
  isPassive: boolean;
};

export type Trait = {
  id: string;
  name: string;
  description: string;
  category: "moral" | "social" | "physical" | "magical" | "quirky";
  cost: number; // negative = gives extra TP
  mechanics: {
    statModifiers?: Record<string, number>; // stat name -> modifier
    multipliers?: Record<string, number>; // e.g., "corruptionGainMultiplier": 0.9
    specialEffects?: string[]; // special flags
  };
  originLocked?: string; // if locked to specific origin
};

export type District = {
  id: string;
  name: string;
  description: string;
  currentRuler: string; // NPC ID or "player"
  difficultyRating: number; // 1-10 for challenge level
  tributeValue: number; // soulcoins per turn when owned
  specialEvents: string[]; // event IDs unique to this district
  aesthetic: {
    colorScheme: string[];
    musicTrack: string;
  };
};

export type NPC = {
  id: string;
  name: string;
  faction: string;
  description: string;
  basePower: number;
  affinityTraits: string[]; // trait IDs they like
  dislikedTraits: string[]; // trait IDs they dislike
  romanceable: boolean;
  canBeRival: boolean;
  specialDialogue: Record<string, string[]>; // eventID -> dialogue options
  portrait?: string; // path to portrait image
};

export type GameEventChoice = {
  id: string;
  text: string;
  outcomes: {
    statChanges?: Record<string, number>;
    narrativeText: string;
    affinityChanges?: Record<string, number>;
  };
};

export type GameEvent = {
  id: string;
  title: string;
  description: string;
  type: "daily" | "career" | "contract" | "romance" | "war" | "misfortune";
  choices: GameEventChoice[];
  onlyOnce?: boolean;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  type: "daily" | "career" | "contract" | "romance" | "war" | "misfortune";
  triggerConditions: {
    minTurn?: number;
    location?: string[];
    statRequirements?: Record<string, number>;
    requiredFlags?: string[];
    randomChance?: number; // 0-1
  };
  choices: {
    id: string;
    text: string;
    requirements?: Record<string, number>; // stat checks
    outcomes: {
      statChanges?: Record<string, number>;
      powerGrant?: string[]; // power IDs
      traitGrant?: string[]; // trait IDs
      reputationChanges?: Record<string, number>; // factionID -> change
      npcAffinityChanges?: Record<string, number>; // npcID -> change
      corruptionChange?: number;
      wealthChange?: number;
      healthChange?: number;
      storyFlags?: Record<string, any>;
      nextEvent?: string; // chain to next event
      narrativeText?: string;
    };
  }[];
  onlyOnce: boolean;
};

export type Faction = {
  id: string;
  name: string;
  description: string;
  leaderNPC?: string;
  territoryIds: string[];
  baseReputation: number;
};

export type Ending = {
  id: string;
  name: string;
  description: string;
  tier: "good" | "neutral" | "bad";
  requirements: {
    minStats?: Record<string, number>;
    maxStats?: Record<string, number>;
    requiredFactionRep?: Record<string, number>;
    requiredTerritories?: string[];
    requiredFlags?: string[];
  };
  narrativeText: string;
  unlocks?: {
    newOrigin?: string;
    newPowers?: string[];
    newTraits?: string[];
  };
};

// ==================== SOUNDTRACK ====================

export type SoundtrackTrack = {
  id: string;
  name: string;
  location: string[]; // which locations/districts this plays in
  url: string; // audio file path
  artist?: string;
  loopable: boolean;
};
