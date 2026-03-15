# AI Escape Room — Game Design

## Overview

Room-exploration escape game with narrative scenarios. Player explores a virtual room with interactive objects, solves AI-themed puzzles, and escapes before the countdown timer runs out. Hybrid visuals: generated background images + CSS/SVG interactive overlays.

**Flow:** Hub → Escape Room hub (4 scenario cards) → Room gameplay (explore + solve) → Results

## Core Mechanic

Player enters a room with 6 clickable objects. Each object hides an AI puzzle. Solve 5 puzzles to collect codes, then use those codes at the exit door (6th object) as a final challenge to escape.

Countdown timer creates urgency. Hint system available at each puzzle with a -60 second penalty per hint.

## Room Layout

Generated background image (one per scenario) with 6 CSS/SVG interactive objects positioned as overlays. Objects have Framer Motion hover effects (glow, scale). Click opens a puzzle modal.

## Puzzle Types

| Object | Puzzle Type | Interaction |
|--------|------------|-------------|
| Computer Terminal | Fix broken prompt | Reorder/select prompt pieces to produce correct output |
| Filing Cabinet | Spot AI error | Find hallucination/bias in a document |
| Whiteboard | Match concepts | Drag to match AI terms to definitions |
| Locked Safe | Logic/knowledge quiz | Multiple choice AI questions |
| Phone/Intercom | Fix chatbot conversation | Pick correct responses in a broken chatbot sequence |
| Exit Door | Final challenge | Enter 5 codes collected from other puzzles to escape |

## Timer & Hints

- Beginner: 15 minutes
- Intermediate: 12 minutes
- Advanced: 10 minutes
- Expert: 8 minutes

Hints: one available per puzzle. Each hint costs -60 seconds. Hints provide a nudge without giving the answer.

## Scoring

- Base points per puzzle (accuracy-based)
- Time bonus (remaining seconds converted to points)
- Hint penalty (deducted from score per hint used)
- Streak bonus for consecutive no-hint solves
- Same 5 skill dimensions: prompting, concepts, tools, criticalThinking, ethics

## 4 Scenarios

| Difficulty | Scenario | Setting | Story |
|-----------|----------|---------|-------|
| Beginner | The Helpful Assistant Gone Wrong | Modern office | Company AI assistant sending wrong info to clients. Fix it before the CEO's presentation. |
| Intermediate | The Biased Hiring Bot | HR department | AI hiring system rejecting qualified candidates. Debug the system before the next interview batch. |
| Advanced | The Prompt Injection Attack | Server room | Hacker injected malicious prompts into company AI. Neutralize the attack before data leaks. |
| Expert | The Autonomous AI Lockout | Futuristic control center | AI system locked out all human operators. Regain control before irreversible decisions are made. |

## Content

4 rooms x 6 puzzles = 24 puzzles total. 4 generated background images.

## Architecture

```
src/lib/escape/types.ts
src/lib/escape/scoring.ts
src/data/escape/{beginner,intermediate,advanced,expert}.ts
src/app/[locale]/escape-room/page.tsx — scenario selection
src/app/[locale]/escape-room/play/page.tsx — room gameplay
src/app/[locale]/escape-room/results/page.tsx — results
src/components/escape/RoomView.tsx — room background + object overlays
src/components/escape/PuzzleModal.tsx — modal wrapper
src/components/escape/PromptFixPuzzle.tsx
src/components/escape/SpotErrorPuzzle.tsx
src/components/escape/MatchPuzzle.tsx
src/components/escape/QuizPuzzle.tsx
src/components/escape/ChatFixPuzzle.tsx
src/components/escape/ExitPuzzle.tsx
src/components/escape/TimerBar.tsx
src/components/escape/HintButton.tsx
```
