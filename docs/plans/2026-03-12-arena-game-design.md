# Prompt Arena — Game Design

## Overview

Three challenge modes teaching prompt engineering through pre-authored, client-side gameplay. No API calls needed.

**Flow:** Hub → Arena hub (3 mode cards) → Difficulty selection → Play → Results

## Three Modes

| Mode | Icon | Mechanic | Rounds | Teaching Focus |
|------|------|----------|--------|----------------|
| Critique | trophy | Rank 2-3 prompts best-to-worst | 8 rounds | Recognize prompt quality |
| Battle | swords | Pick best prompt from 2 options, see outputs | 5 rounds | Compare prompt strategies |
| Optimize | wrench | Iteratively improve a prompt in 2-3 steps | 4 challenges | Refine prompts step by step |

## Difficulty

Same 4 tiers (beginner/intermediate/advanced/expert). All modes available at all difficulties — the content gets harder, not the mechanic.

## Scoring

Streak multiplier system like Turing. 5 prompt engineering skill dimensions: Specificity, Context/Role, Constraints, Few-shot Examples, Chain-of-thought.

## Critique Mode

Player sees a task description and 2-3 prompts. Player drags to rank them best-to-worst. After submitting, the correct ranking is revealed with explanations.

Data shape:
- task: string (e.g., "Write a product description for a smart water bottle")
- prompts: array of { text, rank, explanation }
- skill: one of the 5 dimensions

Scoring: Full marks for correct order. Partial credit for partially correct pairs. Streak bonus.

UI: Draggable cards for reordering. Submit button. Reveal shows correct order with green/red indicators and explanations.

## Battle Mode

Player sees a task + two prompts side by side. Picks which would produce better output. Both AI outputs revealed after choosing.

Data shape:
- task: string
- promptA: { text, output }
- promptB: { text, output }
- winner: "A" | "B"
- explanation: string
- skill: dimension

Scoring: Correct pick = base points + streak multiplier. Speed bonus.

UI: Two cards side by side (stacked on mobile). Tap to pick. Reveal shows both outputs, winner highlighted in teal.

## Optimize Mode

Player sees a task + weak prompt + poor output. Picks improvement from 3-4 options. Prompt updates, better output revealed. Repeat 2-3 steps per challenge.

Data shape:
- task: string
- steps: array of { prompt, output, options: { text, isCorrect, explanation }[], skill }

Scoring: Points per correct step. Bonus for perfect optimization (all steps correct). Streak across challenges.

UI: Current prompt in styled card, output below. Options as buttons. Correct pick animates prompt updating with improvement highlighted in teal.

## Architecture

Types added to lib/types.ts:
- ArenaMode: "critique" | "battle" | "optimize"
- CritiqueRound, BattleRound, OptimizeChallenge
- ArenaAnswer: roundId, mode, isCorrect, score, streak, multiplier, timeSpent

File structure:
- src/lib/arena/scoring.ts
- src/data/arena/critique/{beginner,intermediate,advanced,expert}.ts
- src/data/arena/battle/{beginner,intermediate,advanced,expert}.ts
- src/data/arena/optimize/{beginner,intermediate,advanced,expert}.ts
- src/app/[locale]/arena/page.tsx — mode selection (3 cards)
- src/app/[locale]/arena/[mode]/page.tsx — difficulty selection
- src/app/[locale]/arena/[mode]/play/page.tsx — gameplay
- src/app/[locale]/arena/results/page.tsx — shared results
- src/components/arena/{CritiqueCard,BattleCard,OptimizeCard,RevealCard}.tsx

Routing: /arena → pick mode → /arena/critique → pick difficulty → /arena/critique/play?difficulty=beginner

Content: 8 critique + 5 battle + 4 optimize per difficulty = 17 per difficulty, 68 total rounds.
