# Hallucination Hunter Redesign — Design Document

**Style:** Pixel art war room command center with CRT monitor intercepted transmissions
**Scope:** 6 category scene backgrounds + CRT monitor claim UI + radar timer + signal-type badges

## Layout

```
┌─────────────────────────────────────────────────┐
│  ← Back    ♥♥♥   🔥3   120 pts   4/10          │
├─────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┐    │
│  │  [PIXEL ART WAR ROOM SCENE]             │    │
│  │  (changes per claim category)            │    │
│  │                                          │    │
│  │  ┌──── CRT MONITOR FRAME ────────┐     │    │
│  │  │  ▓ SIGNAL TYPE: FACTUAL       │     │    │
│  │  │  ┌──── RADAR SWEEP ────┐      │     │    │
│  │  │  │  ◠◡◠ timer sweep    │      │     │    │
│  │  │  └─────────────────────┘      │     │    │
│  │  │                                │     │    │
│  │  │  > INTERCEPTED TRANSMISSION:   │     │    │
│  │  │  > "ChatGPT was created by     │     │    │
│  │  │  > OpenAI in November 2022."   │     │    │
│  │  │                                │     │    │
│  │  │  [HALLUCINATION]  [CONFIRMED]  │     │    │
│  │  │   ██ REJECT ██    ██ CLEAR ██  │     │    │
│  │  └────────────────────────────────┘     │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

## Components

### 1. Six Pixel Art War Room Scenes (per category)
- **factual** — News monitoring room with multiple screens showing headlines
- **citation** — Library/archive vault with glowing bookshelves and terminals
- **code** — Server room with racks, blinking lights, terminal consoles
- **temporal** — Clock tower control room with timeline displays and calendars
- **entity** — Intelligence office with portrait boards and dossier walls
- **statistical** — Data center with graphs, charts on big screens, number feeds

### 2. CRT Monitor Overlay
CSS scanline effect, green/amber phosphor glow, slight flicker. Claim text renders inside this "screen" with monospace font.

### 3. Radar Sweep Timer
Replaces the flat timer bar. CSS animated circular radar sweep that counts down. Changes color as time runs out (green → yellow → red).

### 4. Signal Type Badges
Category badges restyled as signal classifications (e.g., "SIGNAL: FACTUAL") with blinking indicator dot.

### 5. Pixel Art Hearts
Replace Material icon hearts with pixel art heart icons.

### 6. Hit/Miss Feedback
On correct: monitor flashes green, "TRANSMISSION VERIFIED" or "HALLUCINATION DETECTED" stamp. On wrong: monitor flashes red, static burst.

## Not in Scope
- Changes to claim data content or scoring
- Changes to the reveal/explanation phase (keep existing ClaimReveal)
- Sound effects changes
- Results page changes
