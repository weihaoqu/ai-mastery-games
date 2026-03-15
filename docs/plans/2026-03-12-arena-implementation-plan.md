# Prompt Arena Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the Prompt Arena game with three challenge modes (Critique, Battle, Optimize) that teach prompt engineering through pre-authored, client-side gameplay.

**Architecture:** Three game modes share types, scoring, and results page but have distinct gameplay components. Mode selection page → difficulty selection → play → results. All content pre-authored in data files, no API calls. Follows existing patterns from Turing/Detective games.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS v4, Framer Motion, next-intl, editorial/magazine theme.

---

### Task 1: Arena Types

**Files:**
- Modify: `src/lib/types.ts`

**Step 1: Add Arena types to the end of types.ts, before the shared types section**

```typescript
// === Prompt Arena Types ===

export type ArenaMode = 'critique' | 'battle' | 'optimize';

export type PromptSkill = 'specificity' | 'context' | 'constraints' | 'few-shot' | 'chain-of-thought';

export interface CritiquePrompt {
  text: string;
  rank: number;          // 1 = best
  explanation: string;
}

export interface CritiqueRound {
  id: string;
  difficulty: Difficulty;
  task: string;
  prompts: CritiquePrompt[];
  skill: PromptSkill;
  skills: {
    prompting: number;
    concepts: number;
    tools: number;
    criticalThinking: number;
    ethics: number;
  };
}

export interface BattleRound {
  id: string;
  difficulty: Difficulty;
  task: string;
  promptA: { text: string; output: string };
  promptB: { text: string; output: string };
  winner: 'A' | 'B';
  explanation: string;
  skill: PromptSkill;
  skills: {
    prompting: number;
    concepts: number;
    tools: number;
    criticalThinking: number;
    ethics: number;
  };
}

export interface OptimizeStep {
  prompt: string;
  output: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  skill: PromptSkill;
}

export interface OptimizeChallenge {
  id: string;
  difficulty: Difficulty;
  task: string;
  steps: OptimizeStep[];
  skills: {
    prompting: number;
    concepts: number;
    tools: number;
    criticalThinking: number;
    ethics: number;
  };
}

export interface ArenaAnswer {
  roundId: string;
  mode: ArenaMode;
  isCorrect: boolean;
  score: number;
  streak: number;
  multiplier: number;
  timeSpent: number;
}
```

**Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat(arena): add Arena game types"
```

---

### Task 2: Arena Scoring Engine

**Files:**
- Create: `src/lib/arena/scoring.ts`

**Step 1: Create the scoring module**

```typescript
import type {
  ArenaAnswer,
  ArenaMode,
  CritiqueRound,
  CritiquePrompt,
  BattleRound,
  OptimizeChallenge,
  SessionResult,
  Difficulty,
  MasteryLevel,
} from '../types';

const MULTIPLIERS = [1, 1.5, 2, 2.5, 3];

/**
 * Score a Critique round.
 * Full marks for perfect ranking, partial credit for each correctly-placed pair.
 */
export function scoreCritiqueRound(
  round: CritiqueRound,
  playerRanking: string[],  // prompt texts in player's ranked order (best first)
  streak: number,
  timeSpent: number,
): ArenaAnswer {
  const correctOrder = [...round.prompts]
    .sort((a, b) => a.rank - b.rank)
    .map(p => p.text);

  // Count pairwise agreements (Kendall-style)
  let correctPairs = 0;
  let totalPairs = 0;
  for (let i = 0; i < playerRanking.length; i++) {
    for (let j = i + 1; j < playerRanking.length; j++) {
      totalPairs++;
      const playerI = correctOrder.indexOf(playerRanking[i]);
      const playerJ = correctOrder.indexOf(playerRanking[j]);
      if (playerI < playerJ) correctPairs++;
    }
  }

  const isPerfect = correctPairs === totalPairs;
  const ratio = totalPairs > 0 ? correctPairs / totalPairs : 0;
  const basePoints = Math.round(ratio * 10);
  const newStreak = isPerfect ? streak + 1 : 0;
  const multiplier = isPerfect ? MULTIPLIERS[Math.min(streak, 4)] : 1;
  const score = Math.round(basePoints * multiplier);

  return {
    roundId: round.id,
    mode: 'critique',
    isCorrect: isPerfect,
    score,
    streak: newStreak,
    multiplier,
    timeSpent,
  };
}

/**
 * Score a Battle round.
 */
export function scoreBattleRound(
  round: BattleRound,
  playerPick: 'A' | 'B',
  streak: number,
  timeSpent: number,
): ArenaAnswer {
  const isCorrect = playerPick === round.winner;
  const newStreak = isCorrect ? streak + 1 : 0;
  const multiplier = isCorrect ? MULTIPLIERS[Math.min(streak, 4)] : 1;
  const basePoints = isCorrect ? 10 : 0;
  const score = Math.round(basePoints * multiplier);

  return {
    roundId: round.id,
    mode: 'battle',
    isCorrect,
    score,
    streak: newStreak,
    multiplier,
    timeSpent,
  };
}

/**
 * Score an Optimize challenge.
 * Points for each correct step. Bonus if all steps correct.
 */
export function scoreOptimizeChallenge(
  challenge: OptimizeChallenge,
  correctSteps: boolean[],
  streak: number,
  timeSpent: number,
): ArenaAnswer {
  const totalSteps = challenge.steps.length;
  const numCorrect = correctSteps.filter(Boolean).length;
  const allCorrect = numCorrect === totalSteps;

  const basePoints = Math.round((numCorrect / totalSteps) * 10);
  const bonus = allCorrect ? 5 : 0;
  const newStreak = allCorrect ? streak + 1 : 0;
  const multiplier = allCorrect ? MULTIPLIERS[Math.min(streak, 4)] : 1;
  const score = Math.round((basePoints + bonus) * multiplier);

  return {
    roundId: challenge.id,
    mode: 'optimize',
    isCorrect: allCorrect,
    score,
    streak: newStreak,
    multiplier,
    timeSpent,
  };
}

export function calculateArenaSessionResult(
  answers: ArenaAnswer[],
  items: Array<{ id: string; skills: Record<string, number> }>,
  difficulty: Difficulty,
  mode: ArenaMode,
): Omit<SessionResult, 'id' | 'date'> {
  const rawTotal = answers.reduce((sum, a) => sum + a.score, 0);
  const maxPossible = mode === 'optimize'
    ? answers.length * 15 * 3  // (10+5 bonus) * 3x max multiplier
    : answers.length * 10 * 3; // 10pts * 3x max multiplier
  const overallScore = Math.min(100, Math.round((rawTotal / maxPossible) * 100));

  const dimensions = { prompting: 0, concepts: 0, tools: 0, criticalThinking: 0, ethics: 0 };
  const weights = { prompting: 0, concepts: 0, tools: 0, criticalThinking: 0, ethics: 0 };

  answers.forEach((answer) => {
    const item = items.find(i => i.id === answer.roundId);
    if (!item) return;
    const normalizedScore = answer.isCorrect ? 100 : 0;
    for (const dim of Object.keys(dimensions) as (keyof typeof dimensions)[]) {
      dimensions[dim] += normalizedScore * (item.skills[dim] ?? 0);
      weights[dim] += item.skills[dim] ?? 0;
    }
  });

  for (const dim of Object.keys(dimensions) as (keyof typeof dimensions)[]) {
    dimensions[dim] = weights[dim] > 0 ? Math.round(dimensions[dim] / weights[dim]) : 0;
  }

  return {
    game: 'arena',
    difficulty,
    cases: answers.map(a => ({
      caseId: a.roundId,
      caseTitle: a.roundId,
      caseType: 'hallucination' as import('../types').CaseType,
      selectedOptionId: '',
      reasoning: '',
      timeSpent: a.timeSpent,
      isCorrect: a.isCorrect,
      score: a.score,
    })),
    overallScore,
    dimensions,
    masteryLevel: getArenaMasteryLevel(overallScore),
  };
}

export function getArenaMasteryLevel(score: number): MasteryLevel {
  if (score >= 81) return 'master';
  if (score >= 61) return 'expert';
  if (score >= 41) return 'practitioner';
  if (score >= 21) return 'apprentice';
  return 'novice';
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/arena/scoring.ts
git commit -m "feat(arena): add scoring engine for all three modes"
```

---

### Task 3: i18n Keys for Arena

**Files:**
- Modify: `src/locales/en.json`
- Modify: `src/locales/zh.json`
- Modify: `src/locales/es.json`
- Modify: `src/locales/de.json`
- Modify: `src/locales/it.json`

**Step 1: Add the arena namespace to en.json**

Add this after the "turing" section:

```json
"arena": {
  "title": "PROMPT ARENA",
  "subtitle": "Master the art of prompt engineering through three challenge modes",
  "backToHub": "Back to Hub",
  "backToArena": "Back to Arena",
  "selectMode": "Choose Your Challenge",
  "startChallenge": "Start Challenge",
  "roundOf": "Round {current} of {total}",
  "loading": "Loading challenges...",
  "shuffling": "Shuffling challenges...",
  "next": "NEXT",
  "submit": "SUBMIT RANKING",
  "streak": "Streak",
  "multiplier": "Multiplier",
  "correct": "Correct!",
  "incorrect": "Not quite",
  "perfectRanking": "Perfect ranking!",
  "partialRanking": "Partially correct",
  "task": "Task",
  "yourRanking": "Your Ranking",
  "correctRanking": "Correct Ranking",
  "pickBetter": "Which prompt is better?",
  "youPicked": "You picked",
  "winnerIs": "The better prompt is",
  "promptA": "Prompt A",
  "promptB": "Prompt B",
  "output": "AI Output",
  "currentPrompt": "Current Prompt",
  "currentOutput": "Current Output",
  "howToImprove": "How would you improve this prompt?",
  "stepOf": "Step {current} of {total}",
  "optimized": "Prompt improved!",
  "wrongChoice": "That's not the best improvement",
  "perfectOptimization": "Perfect optimization!",
  "score": "Score",
  "dragToRank": "Drag to rank best to worst",
  "best": "Best",
  "worst": "Worst"
},
"arenaMode": {
  "critique": "Prompt Critique",
  "critiqueDesc": "Rank prompts from best to worst. Learn what makes a great prompt.",
  "critiqueIcon": "🏆",
  "battle": "Prompt Battle",
  "battleDesc": "Pick the better prompt and see why it wins.",
  "battleIcon": "⚔️",
  "optimize": "Prompt Optimize",
  "optimizeDesc": "Iteratively improve a weak prompt step by step.",
  "optimizeIcon": "🔧"
}
```

**Step 2: Add equivalent keys to zh.json, es.json, de.json, it.json**

Translate the arena and arenaMode sections. Keep the same keys, translate only the values.

**Step 3: Verify the app still compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add src/locales/*.json
git commit -m "feat(arena): add i18n keys for all 5 languages"
```

---

### Task 4: Beginner Content — Critique Mode (8 rounds)

**Files:**
- Create: `src/data/arena/critique/beginner.ts`

**Step 1: Create beginner critique content**

Create 8 `CritiqueRound` items covering the 5 prompt skills (specificity x2, context x2, constraints x1, few-shot x1, chain-of-thought x2). Each round has a task + 3 prompts ranked 1-3 with explanations. Use realistic tasks: writing emails, summarizing, code generation, creative writing, data analysis.

Follow the pattern from `src/data/turing/beginner.ts` — export as `beginnerCritiqueRounds: CritiqueRound[]`.

IDs follow pattern: `crit-beg-01` through `crit-beg-08`.

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/data/arena/critique/beginner.ts
git commit -m "feat(arena): add beginner critique content (8 rounds)"
```

---

### Task 5: Beginner Content — Battle Mode (5 rounds)

**Files:**
- Create: `src/data/arena/battle/beginner.ts`

**Step 1: Create beginner battle content**

Create 5 `BattleRound` items covering the 5 prompt skills. Each round: task + promptA + promptB (with their AI outputs) + winner + explanation. Keep prompts short (1-3 sentences) and outputs concise (2-4 sentences) for reading-friendliness.

Export as `beginnerBattleRounds: BattleRound[]`.

IDs follow pattern: `battle-beg-01` through `battle-beg-05`.

**Step 2: Verify and commit**

```bash
npx tsc --noEmit
git add src/data/arena/battle/beginner.ts
git commit -m "feat(arena): add beginner battle content (5 rounds)"
```

---

### Task 6: Beginner Content — Optimize Mode (4 challenges)

**Files:**
- Create: `src/data/arena/optimize/beginner.ts`

**Step 1: Create beginner optimize content**

Create 4 `OptimizeChallenge` items. Each has 2-3 refinement steps. Each step: current prompt, its output, 3 improvement options (1 correct). Steps should show progressive improvement from vague to specific.

Export as `beginnerOptimizeChallenges: OptimizeChallenge[]`.

IDs follow pattern: `opt-beg-01` through `opt-beg-04`.

**Step 2: Verify and commit**

```bash
npx tsc --noEmit
git add src/data/arena/optimize/beginner.ts
git commit -m "feat(arena): add beginner optimize content (4 challenges)"
```

---

### Task 7: Intermediate/Advanced/Expert Content

**Files:**
- Create: `src/data/arena/critique/intermediate.ts`
- Create: `src/data/arena/critique/advanced.ts`
- Create: `src/data/arena/critique/expert.ts`
- Create: `src/data/arena/battle/intermediate.ts`
- Create: `src/data/arena/battle/advanced.ts`
- Create: `src/data/arena/battle/expert.ts`
- Create: `src/data/arena/optimize/intermediate.ts`
- Create: `src/data/arena/optimize/advanced.ts`
- Create: `src/data/arena/optimize/expert.ts`

**Step 1: Create all 9 content files**

Follow the same patterns as beginner content. Increase complexity:
- **Intermediate:** More nuanced prompts, less obvious differences. Tasks: API documentation, marketing copy, data analysis queries.
- **Advanced:** Subtle quality differences, multi-part tasks. Tasks: system prompts, complex code generation, research synthesis.
- **Expert:** Very subtle differences, expert-level prompt techniques. Tasks: custom GPT instructions, adversarial prompting, multi-model orchestration.

Same counts per difficulty: 8 critique, 5 battle, 4 optimize.

IDs: `crit-int-01`, `battle-adv-03`, `opt-exp-02`, etc.

**Step 2: Verify all compile**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/data/arena/
git commit -m "feat(arena): add intermediate/advanced/expert content for all modes"
```

---

### Task 8: Arena Mode Selection Page

**Files:**
- Create: `src/app/[locale]/arena/page.tsx`

**Step 1: Create the mode selection page**

This page shows 3 mode cards (Critique, Battle, Optimize). Follow the editorial theme. Pattern similar to the hub page's game cards but within the Arena namespace.

```typescript
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const modes = ["critique", "battle", "optimize"] as const;

const modeConfig: Record<(typeof modes)[number], { href: string; accentColor: string }> = {
  critique: { href: "/arena/critique", accentColor: "ed-teal" },
  battle: { href: "/arena/battle", accentColor: "ed-burnt" },
  optimize: { href: "/arena/optimize", accentColor: "ed-success" },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function ArenaPage() {
  const t = useTranslations("arena");
  const tMode = useTranslations("arenaMode");

  return (
    <div className="min-h-screen bg-ed-cream">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-ed-ink-muted transition-colors hover:text-ed-teal"
        >
          <span>&larr;</span> {t("backToHub")}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-3 font-display text-4xl font-bold tracking-tight text-ed-ink sm:text-5xl lg:text-6xl">
            {"\u2694\uFE0F"} {t("title")}
          </h1>
          <p className="text-lg text-ed-ink-muted sm:text-xl">{t("subtitle")}</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-5 sm:grid-cols-3"
        >
          {modes.map((mode) => {
            const config = modeConfig[mode];
            return (
              <Link key={mode} href={config.href}>
                <motion.div
                  variants={cardVariants}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative rounded-xl border border-ed-border bg-ed-card p-6 transition-colors hover:border-ed-teal/40 hover:shadow-md cursor-pointer sm:p-8"
                >
                  <div className="mb-3 text-4xl">{tMode(`${mode}Icon`)}</div>
                  <h2 className="mb-1 font-display text-xl font-bold text-ed-ink">
                    {tMode(mode)}
                  </h2>
                  <p className="text-sm text-ed-ink-muted">{tMode(`${mode}Desc`)}</p>
                  <div className="mt-4 text-sm font-semibold text-ed-teal">
                    {t("selectMode")} &rarr;
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
```

**Step 2: Remove "comingSoon" from arena in hub page**

Modify `src/app/[locale]/page.tsx`: remove `comingSoon: true` from the arena config.

**Step 3: Verify and commit**

```bash
npx tsc --noEmit
git add src/app/[locale]/arena/page.tsx src/app/[locale]/page.tsx
git commit -m "feat(arena): add mode selection page and enable on hub"
```

---

### Task 9: Difficulty Selection Page (Shared for All Modes)

**Files:**
- Create: `src/app/[locale]/arena/[mode]/page.tsx`

**Step 1: Create the dynamic difficulty selection page**

Uses `[mode]` param to show difficulty cards for any mode. Pattern matches `src/app/[locale]/turing/page.tsx` exactly but with arena namespace and mode-aware routing.

Validate that `mode` is one of `critique | battle | optimize`, redirect to `/arena` if invalid.

Link format: `/arena/{mode}/play?difficulty=beginner`

**Step 2: Verify and commit**

```bash
npx tsc --noEmit
git add src/app/[locale]/arena/[mode]/page.tsx
git commit -m "feat(arena): add difficulty selection page for all modes"
```

---

### Task 10: CritiqueCard Component

**Files:**
- Create: `src/components/arena/CritiqueCard.tsx`

**Step 1: Create the drag-to-rank component**

Shows the task description at top. Below it, 2-3 prompt cards that can be dragged to reorder vertically. Uses Framer Motion's `Reorder` component for smooth drag reordering. "Best" label at top, "Worst" at bottom. Submit button at bottom.

Props: `round: CritiqueRound`, `onSubmit: (ranking: string[]) => void`, `disabled?: boolean`

Use `import { Reorder } from "framer-motion"` for drag-to-reorder list.

**Step 2: Verify and commit**

```bash
npx tsc --noEmit
git add src/components/arena/CritiqueCard.tsx
git commit -m "feat(arena): add CritiqueCard with drag-to-rank"
```

---

### Task 11: BattleCard Component

**Files:**
- Create: `src/components/arena/BattleCard.tsx`

**Step 1: Create the side-by-side pick component**

Shows task at top. Two prompt cards below — side by side on desktop, stacked on mobile. Each card shows prompt text only (output hidden until reveal). Click/tap to pick. Selected card gets teal border highlight.

Props: `round: BattleRound`, `onPick: (pick: 'A' | 'B') => void`, `disabled?: boolean`

**Step 2: Verify and commit**

```bash
npx tsc --noEmit
git add src/components/arena/BattleCard.tsx
git commit -m "feat(arena): add BattleCard with side-by-side prompt pick"
```

---

### Task 12: OptimizeCard Component

**Files:**
- Create: `src/components/arena/OptimizeCard.tsx`

**Step 1: Create the multi-step optimization component**

Shows task at top. Current prompt in a styled "editor" card. Current AI output below it. Step indicator (Step 1 of 3). Three option buttons for improvements. On correct pick, prompt card animates updating with the new text (improvement highlighted in teal). On wrong pick, show explanation and let player try again.

Props: `challenge: OptimizeChallenge`, `onComplete: (correctSteps: boolean[]) => void`, `disabled?: boolean`

Internal state tracks current step index and which steps were correct on first try.

**Step 2: Verify and commit**

```bash
npx tsc --noEmit
git add src/components/arena/OptimizeCard.tsx
git commit -m "feat(arena): add OptimizeCard with multi-step refinement"
```

---

### Task 13: Arena RevealCard Component

**Files:**
- Create: `src/components/arena/ArenaRevealCard.tsx`

**Step 1: Create the shared reveal component**

Handles reveal for all three modes. Shows correct/incorrect banner, score, explanation, streak info, and Next button. For Critique: shows correct ranking vs player ranking. For Battle: shows both outputs with winner highlighted. For Optimize: shows the fully optimized prompt.

Props: `mode: ArenaMode`, `answer: ArenaAnswer`, `revealData: CritiqueRevealData | BattleRevealData | OptimizeRevealData`, `onNext: () => void`

Define the reveal data types within the component file.

Follow the editorial theme from `src/components/turing/RevealCard.tsx`: success/error borders, score display, streak info, explanation card.

**Step 2: Verify and commit**

```bash
npx tsc --noEmit
git add src/components/arena/ArenaRevealCard.tsx
git commit -m "feat(arena): add shared ArenaRevealCard component"
```

---

### Task 14: Arena Play Page

**Files:**
- Create: `src/app/[locale]/arena/[mode]/play/page.tsx`

**Step 1: Create the gameplay page**

Dynamic route using `[mode]` param. Pattern follows `src/app/[locale]/turing/play/page.tsx` closely:

- Validate mode param (critique|battle|optimize), redirect if invalid
- Read difficulty from search params
- Load items from data files based on mode + difficulty
- Shuffle and select the right number (8 critique, 5 battle, 4 optimize)
- Track phase (playing|reveal|complete), index, answers, streak
- Save progress to sessionStorage (`arena-{mode}-progress`)
- On complete, build SessionResult, save to sessionStorage, redirect to `/arena/results`

Render the appropriate card component based on mode: CritiqueCard, BattleCard, or OptimizeCard.

Wrap in `<Suspense>` for useSearchParams.

**Step 2: Verify and commit**

```bash
npx tsc --noEmit
git add src/app/[locale]/arena/[mode]/play/page.tsx
git commit -m "feat(arena): add gameplay page for all three modes"
```

---

### Task 15: Arena Results Page

**Files:**
- Create: `src/app/[locale]/arena/results/page.tsx`

**Step 1: Create the results page**

Pattern follows `src/app/[locale]/turing/results/page.tsx`. Reads result from sessionStorage. Shows:
- Overall score with mastery level
- Radar chart for 5 dimensions (reuse same Recharts pattern)
- Round breakdown
- Play again button (links back to `/arena`)
- Back to hub button

**Step 2: Verify and commit**

```bash
npx tsc --noEmit
git add src/app/[locale]/arena/results/page.tsx
git commit -m "feat(arena): add results page with radar chart"
```

---

### Task 16: Integration & Polish

**Files:**
- Modify: `src/app/[locale]/page.tsx` (verify comingSoon removed)
- All arena files

**Step 1: Full type check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 2: Manual test all three modes**

Run: `npm run dev -- -p 3456`

Test each mode at each difficulty:
- Hub → Arena → Critique → Beginner → Play through all 8 rounds → Results
- Hub → Arena → Battle → Beginner → Play through all 5 rounds → Results
- Hub → Arena → Optimize → Beginner → Play through all 4 challenges → Results
- Verify progress saves (refresh mid-game)
- Verify keyboard navigation works

**Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix(arena): integration fixes and polish"
```
