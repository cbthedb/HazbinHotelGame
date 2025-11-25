# Hazbin Hotel BitLife Game - Design Guidelines

## Design Approach

**System Selected:** Custom game UI framework inspired by BitLife's clean card-based interface, heavily themed with Hazbin Hotel's Art Deco aesthetic.

**Core Principles:**
- Information clarity over decoration - stats and choices must be immediately readable
- Hazbin Hotel visual identity: Art Deco patterns, red/black/gold accents, theatrical flair
- Card-based event system with clear action buttons
- Persistent stat displays without overwhelming the interface

## Typography

**Font Families:**
- Primary (UI/Stats): "Inter" or "DM Sans" - clean, highly legible for numbers and stat names
- Display (Titles/Headers): "Playfair Display" or "Cinzel" - Art Deco elegance for section headers and character names
- Body (Events/Descriptions): Same as Primary for consistency

**Hierarchy:**
- Character Name/Title: 28-32px, Display font, bold
- Section Headers: 20-24px, Display font, semi-bold
- Event Cards: 16-18px, Primary font, regular
- Stats/Numbers: 14-16px, Primary font, medium weight
- Button Text: 14-16px, Primary font, semi-bold

## Layout System

**Spacing Units:** Tailwind units of 2, 4, 6, and 8 (p-2, p-4, p-6, p-8, etc.)

**Grid Structure:**
- Primary container: max-w-6xl centered with px-4 for mobile
- Two-column desktop layout (2/3 main content + 1/3 sidebar for stats)
- Single column stack on mobile (< 768px)
- Card spacing: gap-4 between event cards, gap-6 between sections

## Core Components

### 1. Character Header Bar
- Fixed top bar displaying character portrait (64px circle), name, current title, age
- Compact stat overview (Power/Influence/Corruption icons + values)
- Actions menu button (hamburger) on mobile

### 2. Stats Panel (Sidebar on desktop, collapsible on mobile)
- Vertical stat bars with labels and numeric values
- Color-coded: Power (red), Control (purple), Influence (gold), Corruption (dark red), Empathy (pink), Health (green), Wealth (yellow)
- Reputation badges for each faction (icons + progress circles)

### 3. Event Cards
- White/light gray cards with subtle shadow (shadow-md)
- Event title at top (bold, 18px)
- Description text (16px, gray-700)
- 2-4 choice buttons at bottom (full-width on mobile, inline on desktop)
- Consequence previews (small text showing stat changes: "+2 Power", "-1 Empathy")

### 4. Power Loadout Display
- Horizontal ability slots (3-5 slots)
- Each slot: ability icon, name, cooldown indicator
- Active/inactive states clearly visible
- Click to view details modal

### 5. Territory Map Interface
- Simplified Pentagram City map with 7 clickable districts
- Each district shows: name, ruler, player ownership status
- Visual indicators for available events (notification dots)
- Travel button opens district detail view

### 6. Navigation Menu
- Tab-based navigation: Life Events, Powers, Traits, Map, Relationships, Settings
- Always accessible sidebar/bottom nav depending on viewport

### 7. Character Creation Flow
- Multi-step wizard: Name → Appearance → Origin → Traits → Confirm
- 2D portrait builder with toggle buttons for horns, wings, colors
- Trait selection grid with point allocation display
- Large "Begin Your Life" button to start

### 8. Relationship Cards
- NPC portraits in grid layout (grid-cols-2 md:grid-cols-3)
- Affinity bar beneath each portrait
- Click to view relationship details and interaction options

## Visual Elements

**Art Deco Patterns:**
- Subtle geometric borders on major section dividers
- Corner flourishes on character header and ending screens
- Repeating line patterns in backgrounds (very subtle, low opacity)

**Color Accents:**
- Primary actions: Red (#E63946 or similar)
- Secondary actions: Gold (#F4A261)
- Destructive actions: Dark red (#A4161A)
- Success states: Muted green
- Hazbin Hotel branding throughout

**Icons:**
- Use Heroicons for standard UI (menu, settings, stats)
- Custom small icons for power types and traits (simple, 24px)

## Soundtrack Integration

- Audio controls in top-right corner (play/pause, volume slider)
- Background music auto-plays on user interaction (respecting browser policies)
- Dynamic track changes based on location: Hotel (jazzy), Streets (ambient dark), Battles (intense)
- Subtle visual indicator when track changes

## Images

**Character Portraits:**
- 2D illustrated style matching Hazbin Hotel art direction
- Circular crop for stat panels (64-96px)
- Larger versions for relationship/NPC detail modals (256px)
- Procedurally generated placeholder portraits using SVG shapes and Hazbin color palette

**Background Treatment:**
- Subtle texture overlay (noise or Art Deco pattern) at 5% opacity
- Dark gradient background (#1a1a1a to #2d2d2d)
- No large hero images - this is a game interface, not a landing page

## Responsive Behavior

- Desktop (≥1024px): Two-column with persistent stats sidebar
- Tablet (768-1023px): Stats collapse to top bar, single column content
- Mobile (<768px): Hamburger menu for all navigation, full-width cards, stats in expandable drawer

## Animation

- Minimal, purposeful animations only
- Stat changes: brief highlight flash (200ms)
- Card appearance: subtle fade-in (300ms)
- Button hover: scale(1.02) for tactile feedback
- NO complex animations that distract from gameplay