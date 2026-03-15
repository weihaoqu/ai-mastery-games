# AI or Human? — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the "AI or Human?" Turing test game — a card-swipe game where players guess if content is AI-generated or human-created, with educational reveals and streak-based scoring.

**Architecture:** Follows the Detective game pattern: TypeScript data files per tier, same page flow (difficulty → play → results), shared components. New: swipable card UI, streak multiplier scoring, highlighted marker reveals. Content stored as typed TuringItem objects. 6 content categories (email, essay, code, social-media, creative-writing, image).

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion (swipe gestures + animations), Chart.js (radar chart), next-intl (i18n)

---

### Task 1: Types & Scoring Engine

**Files:**
- Modify: `src/lib/types.ts` — add TuringItem, TuringMarker, ContentType, TuringAnswer types
- Create: `src/lib/turing/scoring.ts` — streak-based scoring engine

**Steps:**
1. Add types to `src/lib/types.ts`:

```typescript
export type ContentType = 'email' | 'essay' | 'code' | 'social-media' | 'creative-writing' | 'image';

export interface TuringMarker {
  text: string;
  explanation: string;
  type: 'ai-tell' | 'human-tell';
}

export interface TuringItem {
  id: string;
  contentType: ContentType;
  difficulty: Difficulty;
  title: string;
  content: string;
  isAI: boolean;
  aiModel?: string;
  humanSource?: string;
  markers: TuringMarker[];
  explanation: string;
  imagePath?: string;
  imageDescription?: string;
  skills: {
    prompting: number;
    concepts: number;
    tools: number;
    criticalThinking: number;
    ethics: number;
  };
}

export interface TuringAnswer {
  itemId: string;
  itemTitle: string;
  contentType: ContentType;
  guessedAI: boolean;
  isCorrect: boolean;
  score: number;
  streak: number;
  multiplier: number;
  timeSpent: number;
}
```

2. Create `src/lib/turing/scoring.ts`:

```typescript
import { TuringItem, TuringAnswer, MasteryLevel, SessionResult, Difficulty } from '../types';

const MULTIPLIERS = [1, 1.5, 2, 2.5, 3]; // index = min(streak, 4)

export function scoreTuringAnswer(
  item: TuringItem,
  guessedAI: boolean,
  streak: number,
  timeSpent: number
): TuringAnswer {
  const isCorrect = guessedAI === item.isAI;
  const multiplier = isCorrect ? MULTIPLIERS[Math.min(streak, 4)] : 1;
  const basePoints = isCorrect ? 10 : 0;
  const score = Math.round(basePoints * multiplier);

  return {
    itemId: item.id,
    itemTitle: item.title,
    contentType: item.contentType,
    guessedAI,
    isCorrect,
    score,
    streak: isCorrect ? streak + 1 : 0,
    multiplier,
    timeSpent,
  };
}

export function calculateTuringSessionResult(
  answers: TuringAnswer[],
  items: TuringItem[],
  difficulty: Difficulty
): Omit<SessionResult, 'id' | 'date'> {
  const rawTotal = answers.reduce((sum, a) => sum + a.score, 0);
  const maxPossible = 300; // 10 items × 10pts × 3x max multiplier
  const overallScore = Math.round((rawTotal / maxPossible) * 100);

  const dimensions = { prompting: 0, concepts: 0, tools: 0, criticalThinking: 0, ethics: 0 };
  const weights = { prompting: 0, concepts: 0, tools: 0, criticalThinking: 0, ethics: 0 };

  answers.forEach((answer) => {
    const item = items.find(i => i.id === answer.itemId);
    if (!item) return;
    const normalizedScore = answer.isCorrect ? (answer.score / (10 * answer.multiplier)) * 100 : 0;
    for (const dim of Object.keys(dimensions) as (keyof typeof dimensions)[]) {
      dimensions[dim] += normalizedScore * item.skills[dim];
      weights[dim] += item.skills[dim];
    }
  });

  for (const dim of Object.keys(dimensions) as (keyof typeof dimensions)[]) {
    dimensions[dim] = weights[dim] > 0 ? Math.round(dimensions[dim] / weights[dim]) : 0;
  }

  return {
    game: 'turing',
    difficulty,
    cases: answers.map(a => ({
      caseId: a.itemId,
      caseTitle: a.itemTitle,
      caseType: a.contentType as any,
      selectedOptionId: a.guessedAI ? 'ai' : 'human',
      reasoning: '',
      timeSpent: a.timeSpent,
      isCorrect: a.isCorrect,
      score: a.score,
    })),
    overallScore: Math.min(100, Math.max(0, overallScore)),
    dimensions,
    masteryLevel: getMasteryLevel(overallScore),
  };
}

function getMasteryLevel(score: number): MasteryLevel {
  if (score >= 81) return 'master';
  if (score >= 61) return 'expert';
  if (score >= 41) return 'practitioner';
  if (score >= 21) return 'apprentice';
  return 'novice';
}
```

3. Verify build: `npm run build`

---

### Task 2: Content Data — Beginner Tier (12 items)

**Files:**
- Create: `src/data/turing/beginner.ts`

**Steps:**
1. Create 12 beginner items (2 per content type) with obvious AI/human tells:
   - 2× email (1 AI, 1 human)
   - 2× essay (1 AI, 1 human)
   - 2× code (1 AI, 1 human)
   - 2× social-media (1 AI, 1 human)
   - 2× creative-writing (1 AI, 1 human)
   - 2× image (1 AI, 1 human) — with imageDescription placeholders
2. Each item needs 3-5 markers with explanations
3. Beginner level: obvious tells (AI = overly formal, lists everything, hedging language; Human = typos, personality, inconsistency)
4. Verify build

---

### Task 3: Content Data — Intermediate, Advanced, Expert Tiers (36 items)

**Files:**
- Create: `src/data/turing/intermediate.ts` (12 items)
- Create: `src/data/turing/advanced.ts` (12 items)
- Create: `src/data/turing/expert.ts` (12 items)

**Steps:**
1. Intermediate: Better AI vs amateur human. Subtler tells.
2. Advanced: Polished AI vs professional human. Very subtle tells.
3. Expert: Adversarially crafted. Humans mimicking AI style, AI with human-like quirks.
4. Same 2-per-category distribution in each tier.
5. Verify build

---

### Task 4: Difficulty Selection Page

**Files:**
- Create: `src/app/[locale]/turing/page.tsx`

**Steps:**
1. Copy pattern from `src/app/[locale]/detective/page.tsx`
2. Change title to "AI OR HUMAN?" with robot emoji
3. Change href pattern to `/turing/play?difficulty=X`
4. Change CTA text — use new i18n key `turing.startChallenge`
5. Add i18n keys to `src/locales/en.json` under new `turing` namespace
6. Verify build

---

### Task 5: Swipable Card Component

**Files:**
- Create: `src/components/turing/SwipeCard.tsx`

**Steps:**
1. Build a card component using Framer Motion drag gestures:
   - `drag="x"` with drag constraints
   - On drag end: if past threshold, trigger swipe callback
   - Visual feedback: card tilts in drag direction, background glows cyan (AI) or magenta (Human)
   - Content type badge in top-left corner
   - Content fills the card body (monospace for code, serif for creative writing, etc.)
   - For image type: show placeholder with description text if no imagePath
2. Desktop fallback: two buttons "HUMAN ←" and "→ AI" below card
3. Keyboard support: left arrow = Human, right arrow = AI
4. Props: `item: TuringItem`, `onSwipe: (guessedAI: boolean) => void`, `disabled: boolean`
5. Verify build

---

### Task 6: Reveal Component

**Files:**
- Create: `src/components/turing/RevealCard.tsx`

**Steps:**
1. After swipe, transition to reveal view:
   - Correct/incorrect banner at top (green/red)
   - Source attribution: "Generated by GPT-4" or "Written by professional copywriter"
   - Content re-displayed with highlighted markers:
     - For each marker, find `marker.text` in content, wrap in colored span
     - `ai-tell` markers: cyan highlight
     - `human-tell` markers: magenta highlight
   - Below each highlighted section: tooltip/inline explanation
   - Overall explanation at bottom
   - Streak counter and multiplier display
2. "NEXT →" button at bottom
3. Props: `item: TuringItem`, `answer: TuringAnswer`, `onNext: () => void`
4. Verify build

---

### Task 7: Gameplay Page

**Files:**
- Create: `src/app/[locale]/turing/play/page.tsx`

**Steps:**
1. Follow Detective play page pattern with Suspense wrapper
2. Game state: items array, current index, answers array, streak counter, phase (playing/reveal/complete)
3. Session setup: load items for difficulty, shuffle, pick 10
4. Game loop:
   - Show SwipeCard for current item, start timer
   - On swipe: score answer, update streak, transition to RevealCard
   - On "Next": advance index or go to results if done
5. Progress bar: dots or "3/10" counter at top
6. Streak display: flame emoji + "3x" multiplier
7. Save progress to sessionStorage
8. beforeunload warning
9. On complete: save result to sessionStorage, redirect to results
10. Verify build

---

### Task 8: Results Page

**Files:**
- Create: `src/app/[locale]/turing/results/page.tsx`

**Steps:**
1. Copy pattern from Detective results page
2. Reuse: ScoreRadar (radar chart), MasteryBadge, CertificateModal
3. Add turing-specific stats:
   - Accuracy: "8/10 correct"
   - Best streak: "5 in a row"
   - Highlight per-category accuracy (email: 2/2, code: 1/2, etc.)
4. Case breakdown list with content type badge and correct/incorrect
5. Wire up certificate modal (game name = "AI or Human?")
6. Save session via saveSession() (auto-submits to API)
7. Verify build

---

### Task 9: Hub Integration & i18n

**Files:**
- Modify: `src/app/[locale]/page.tsx` — activate turing card
- Modify: `src/locales/en.json` — add turing namespace
- Modify: `src/locales/zh.json` — add turing namespace
- Modify: `src/locales/es.json` — add turing namespace
- Modify: `src/locales/de.json` — add turing namespace
- Modify: `src/locales/it.json` — add turing namespace

**Steps:**
1. In hub page.tsx, change turing config: `comingSoon: false`, `href: "/turing"`
2. Add i18n keys for all 5 languages:
   - `turing.title`, `turing.subtitle`, `turing.startChallenge`
   - `turing.ai`, `turing.human`, `turing.swipeRight`, `turing.swipeLeft`
   - `turing.correct`, `turing.incorrect`, `turing.streak`, `turing.multiplier`
   - `turing.source`, `turing.generatedBy`, `turing.writtenBy`, `turing.next`
   - `turing.accuracy`, `turing.bestStreak`, `turing.categoryBreakdown`
   - Content type labels: `contentType.email`, `contentType.essay`, `contentType.code`, `contentType.social-media`, `contentType.creative-writing`, `contentType.image`
3. Verify full build passes
4. Test nav from hub → turing → play → results → hub

---

### Task 10: Polish & Animations

**Steps:**
1. Swipe card spring physics tuning
2. Reveal card entrance animation (flip or slide-up)
3. Streak counter fire animation on increase
4. Streak break shake animation
5. Progress dots pulse on current
6. Mobile responsive pass on all turing pages
7. Marker highlight scroll-into-view for long content
8. Final build verification
