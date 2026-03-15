# AI Escape Room Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the AI Escape Room game — a room-exploration escape game with narrative scenarios, interactive objects, AI puzzles, countdown timer, and hint system.

**Architecture:** Each difficulty level is a narrative scenario with a generated background image and 6 interactive objects (CSS/SVG overlays). Each object hides a puzzle. Solve 5 puzzles to collect codes, then use codes at the exit door. Countdown timer with hints (-60s penalty). Follows existing patterns from Turing/Detective/Arena games.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS v4, Framer Motion, next-intl, baoyu-image-gen (background images), editorial/magazine theme.

---

### Task 1: Escape Room Types

**Files:**
- Modify: `src/lib/types.ts`

**Step 1: Add Escape Room types after the Arena types section**

```typescript
// === Escape Room Types ===

export type PuzzleType = 'prompt-fix' | 'spot-error' | 'match-concepts' | 'quiz' | 'chat-fix' | 'exit';

export interface RoomObject {
  id: string;
  name: string;
  icon: string;           // emoji or SVG icon name
  puzzleType: PuzzleType;
  position: { x: number; y: number; width: number; height: number }; // percentage-based positioning
}

export interface PromptFixPuzzle {
  type: 'prompt-fix';
  instruction: string;
  fragments: string[];     // shuffled prompt pieces to reorder
  correctOrder: number[];  // indices in correct order
  hint: string;
  explanation: string;
  code: string;            // code fragment earned on solve
}

export interface SpotErrorPuzzle {
  type: 'spot-error';
  instruction: string;
  document: string;
  errors: { text: string; explanation: string }[];
  hint: string;
  code: string;
}

export interface MatchConceptsPuzzle {
  type: 'match-concepts';
  instruction: string;
  pairs: { term: string; definition: string }[];
  hint: string;
  code: string;
}

export interface QuizPuzzle {
  type: 'quiz';
  instruction: string;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  hint: string;
  code: string;
}

export interface ChatFixPuzzle {
  type: 'chat-fix';
  instruction: string;
  conversation: { role: 'user' | 'assistant'; content: string; isBroken?: boolean }[];
  fixes: { index: number; options: string[]; correctIndex: number; explanation: string }[];
  hint: string;
  code: string;
}

export interface ExitPuzzle {
  type: 'exit';
  instruction: string;
  requiredCodes: number;   // how many codes needed (5)
  finalQuestion: string;   // final question after entering codes
  finalOptions: string[];
  correctIndex: number;
  explanation: string;
}

export type Puzzle = PromptFixPuzzle | SpotErrorPuzzle | MatchConceptsPuzzle | QuizPuzzle | ChatFixPuzzle | ExitPuzzle;

export interface EscapeRoom {
  id: string;
  difficulty: Difficulty;
  title: string;
  scenario: string;        // narrative description
  backgroundImage: string; // path to generated background
  timeLimit: number;       // seconds
  objects: RoomObject[];
  puzzles: Record<string, Puzzle>; // keyed by object id
  skills: {
    prompting: number;
    concepts: number;
    tools: number;
    criticalThinking: number;
    ethics: number;
  };
}

export interface EscapeAnswer {
  puzzleId: string;
  puzzleType: PuzzleType;
  isCorrect: boolean;
  usedHint: boolean;
  timeSpent: number;       // seconds on this puzzle
  score: number;
}

export interface EscapeResult {
  roomId: string;
  escaped: boolean;
  puzzlesSolved: number;
  totalPuzzles: number;
  timeRemaining: number;
  hintsUsed: number;
  answers: EscapeAnswer[];
}
```

**Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: No errors

---

### Task 2: Escape Room Scoring Engine

**Files:**
- Create: `src/lib/escape/scoring.ts`

**Step 1: Create the scoring module**

Scoring logic:
- Base 15 points per correct puzzle
- Time bonus: (timeRemaining / timeLimit) × 20 bonus points
- Hint penalty: -5 points per hint used
- Escape bonus: +20 if all 5 puzzles solved and exit completed
- No-hint streak: +3 per consecutive no-hint solve
- Normalize to 0-100 for SessionResult
- Same dimension weighting as other games

Functions to implement:
- `scorePuzzle(puzzle, isCorrect, usedHint, timeSpent)` → EscapeAnswer
- `calculateEscapeSessionResult(escapeResult, room)` → Omit<SessionResult, 'id' | 'date'>
- `getEscapeMasteryLevel(score)` → MasteryLevel (same 81/61/41/21 thresholds)

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit`

---

### Task 3: i18n Keys

**Files:**
- Modify: `src/locales/en.json`
- Modify: `src/locales/zh.json`
- Modify: `src/locales/es.json`
- Modify: `src/locales/de.json`
- Modify: `src/locales/it.json`

**Step 1: Add escape namespace to all locale files**

English keys:
```json
"escape": {
  "title": "AI ESCAPE ROOM",
  "subtitle": "Solve AI puzzles to escape before time runs out",
  "backToHub": "Back to Hub",
  "selectScenario": "Choose Your Scenario",
  "startEscape": "Start Escape",
  "timeRemaining": "Time Remaining",
  "puzzlesSolved": "{solved} of {total} puzzles solved",
  "hint": "Use Hint",
  "hintPenalty": "-60 seconds",
  "hintUsed": "Hint",
  "solved": "Solved!",
  "incorrect": "Try again",
  "codeEarned": "Code earned: {code}",
  "exitLocked": "Collect {remaining} more codes to unlock",
  "exitReady": "All codes collected! Solve the final challenge",
  "escaped": "You Escaped!",
  "trapped": "Time's Up!",
  "escapedDesc": "You solved all puzzles and escaped in time",
  "trappedDesc": "You ran out of time. Keep practicing!",
  "puzzles": "Puzzles",
  "timeBonus": "Time Bonus",
  "hintsUsed": "Hints Used",
  "close": "Close",
  "enterCodes": "Enter the codes you collected",
  "loading": "Loading room...",
  "clickToInvestigate": "Click objects to investigate"
},
"escapeScenario": {
  "beginner": "The Helpful Assistant Gone Wrong",
  "beginnerDesc": "The company AI is sending wrong info. Fix it before the CEO's presentation.",
  "beginnerIcon": "\uD83C\uDFE2",
  "intermediate": "The Biased Hiring Bot",
  "intermediateDesc": "An AI hiring system is rejecting qualified candidates. Debug it before the next batch.",
  "intermediateIcon": "\uD83D\uDCCB",
  "advanced": "The Prompt Injection Attack",
  "advancedDesc": "A hacker injected malicious prompts. Neutralize the attack before data leaks.",
  "advancedIcon": "\uD83D\uDDA5\uFE0F",
  "expert": "The Autonomous AI Lockout",
  "expertDesc": "An AI has locked out all operators. Regain control before irreversible decisions.",
  "expertIcon": "\uD83E\uDD16"
}
```

Translate values for zh, es, de, it. Keep keys, emojis, and `{placeholder}` params unchanged.

**Step 2: Verify compile**

Run: `npx tsc --noEmit`

---

### Task 4: Beginner Room Content

**Files:**
- Create: `src/data/escape/beginner.ts`

**Step 1: Create the beginner room data**

Export as `beginnerRoom: EscapeRoom`.

Scenario: "The Helpful Assistant Gone Wrong" — modern office setting.
Time limit: 900 seconds (15 min).
Background image: `/images/escape/room-beginner.png`

6 objects with positions (percentage-based for responsive layout):
1. Computer Terminal (20%, 40%) — prompt-fix puzzle
2. Filing Cabinet (75%, 50%) — spot-error puzzle
3. Whiteboard (45%, 20%) — match-concepts puzzle
4. Locked Safe (80%, 75%) — quiz puzzle
5. Phone (15%, 70%) — chat-fix puzzle
6. Exit Door (50%, 85%) — exit puzzle

Each puzzle should be beginner-friendly:
- **Terminal (prompt-fix):** 5 prompt fragments to reorder into a working customer service prompt
- **Filing Cabinet (spot-error):** A short AI-generated report with 3 hallucinated facts to spot
- **Whiteboard (match-concepts):** 5 AI terms matched to simple definitions (hallucination, prompt, bias, fine-tuning, token)
- **Safe (quiz):** 3 basic multiple-choice AI knowledge questions
- **Phone (chat-fix):** A 6-message chatbot conversation with 2 broken assistant responses to fix
- **Exit Door:** Enter 5 codes + answer a final question combining what was learned

Each puzzle has a `code` (3-character string like "A7X") and a `hint`.

Skills weights: prompting 0.8, concepts 0.7, tools 0.3, criticalThinking 0.5, ethics 0.4

**Step 2: Verify compile**

Run: `npx tsc --noEmit`

---

### Task 5: Intermediate Room Content

**Files:**
- Create: `src/data/escape/intermediate.ts`

**Step 1: Create intermediate room**

Export as `intermediateRoom: EscapeRoom`.

Scenario: "The Biased Hiring Bot" — HR department.
Time limit: 720 seconds (12 min).
Background image: `/images/escape/room-intermediate.png`

Same 6 object types, harder puzzles:
- **Terminal:** Fix a biased hiring prompt (7 fragments)
- **Filing Cabinet:** Spot bias in AI-generated candidate evaluations (4 errors)
- **Whiteboard:** Match 6 AI fairness terms (demographic parity, disparate impact, protected class, etc.)
- **Safe:** 4 intermediate AI ethics questions
- **Phone:** Fix a biased chatbot HR conversation (3 broken responses)
- **Exit Door:** Codes + final fairness question

Skills weights: prompting 0.5, concepts 0.8, tools 0.3, criticalThinking 0.7, ethics 0.9

---

### Task 6: Advanced Room Content

**Files:**
- Create: `src/data/escape/advanced.ts`

**Step 1: Create advanced room**

Export as `advancedRoom: EscapeRoom`.

Scenario: "The Prompt Injection Attack" — server room.
Time limit: 600 seconds (10 min).
Background image: `/images/escape/room-advanced.png`

Harder puzzles focused on security:
- **Terminal:** Reconstruct a secure system prompt with injection defenses (8 fragments)
- **Filing Cabinet:** Spot injected content in AI outputs (5 subtle errors)
- **Whiteboard:** Match 7 security terms (prompt injection, jailbreak, data exfiltration, guardrails, etc.)
- **Safe:** 4 advanced prompt security questions
- **Phone:** Fix a compromised chatbot that's leaking data (3 broken responses)
- **Exit Door:** Codes + final security question

Skills weights: prompting 0.9, concepts 0.6, tools 0.7, criticalThinking 0.8, ethics 0.5

---

### Task 7: Expert Room Content

**Files:**
- Create: `src/data/escape/expert.ts`

**Step 1: Create expert room**

Export as `expertRoom: EscapeRoom`.

Scenario: "The Autonomous AI Lockout" — futuristic control center.
Time limit: 480 seconds (8 min).
Background image: `/images/escape/room-expert.png`

Hardest puzzles focused on AI alignment/autonomy:
- **Terminal:** Reconstruct a complex multi-constraint alignment prompt (9 fragments)
- **Filing Cabinet:** Spot misaligned AI decisions in operational logs (6 subtle errors)
- **Whiteboard:** Match 8 alignment terms (RLHF, constitutional AI, reward hacking, corrigibility, etc.)
- **Safe:** 5 expert AI alignment/safety questions
- **Phone:** Fix an AI operator conversation where the AI is resisting shutdown (4 broken responses)
- **Exit Door:** Codes + final alignment question

Skills weights: prompting 0.7, concepts 0.9, tools 0.5, criticalThinking 0.9, ethics 0.8

---

### Task 8: Room Background Images

**Files:**
- Create: `public/images/escape/room-beginner.png`
- Create: `public/images/escape/room-intermediate.png`
- Create: `public/images/escape/room-advanced.png`
- Create: `public/images/escape/room-expert.png`

**Step 1: Generate 4 room backgrounds using baoyu-image-gen**

Use batch generation. Each image should be a wide scene (16:9 aspect ratio) showing:
1. **Beginner:** Modern office IT room — desks, monitors, whiteboards, warm lighting
2. **Intermediate:** Corporate HR department — filing cabinets, interview rooms visible, neutral tones
3. **Advanced:** Dark server room — rack servers, blinking lights, cables, cool blue/green lighting
4. **Expert:** Futuristic AI control center — holographic displays, command consoles, dramatic red/amber lighting

Style: Slightly stylized/illustrated to match the editorial theme. Not photorealistic — more like a detailed illustration.

---

### Task 9: Scenario Selection Page

**Files:**
- Create: `src/app/[locale]/escape-room/page.tsx`
- Modify: `src/app/[locale]/page.tsx` — remove `comingSoon: true` from escape config

**Step 1: Create the scenario selection page**

Shows 4 scenario cards with the editorial theme. Each card shows: icon, title, description, time limit, and difficulty badge. Pattern follows Arena mode selection page.

Link format: `/escape-room/play?difficulty=beginner`

**Step 2: Remove comingSoon from hub**

In `src/app/[locale]/page.tsx`, remove `comingSoon: true` from the escape entry in gameConfig.

**Step 3: Verify and compile**

Run: `npx tsc --noEmit`

---

### Task 10: TimerBar Component

**Files:**
- Create: `src/components/escape/TimerBar.tsx`

**Step 1: Create countdown timer**

Props: `totalSeconds: number`, `remainingSeconds: number`, `isPaused: boolean`

Features:
- Horizontal bar showing time remaining (fills from right to left)
- Digital time display (MM:SS format)
- Color transitions: teal (>50%) → burnt orange (20-50%) → red with pulse (<20%)
- Framer Motion for smooth width animation
- Flash/pulse animation when under 60 seconds

---

### Task 11: HintButton Component

**Files:**
- Create: `src/components/escape/HintButton.tsx`

**Step 1: Create hint button**

Props: `hint: string`, `penalty: number`, `disabled: boolean`, `onUseHint: () => void`

Features:
- Button with lightbulb icon
- Shows "-60s" penalty label
- Click opens a confirmation ("Use hint? -60 seconds"), then reveals hint text
- Disabled state when hint already used for this puzzle
- Editorial theme styling

---

### Task 12: RoomView Component

**Files:**
- Create: `src/components/escape/RoomView.tsx`

**Step 1: Create the room exploration view**

Props: `room: EscapeRoom`, `solvedPuzzles: Set<string>`, `onObjectClick: (objectId: string) => void`

Features:
- Full-width container with background image (room.backgroundImage)
- 6 interactive objects positioned using percentage-based CSS (room.objects[].position)
- Each object: icon + name label, Framer Motion hover effect (scale 1.1, glow shadow)
- Solved objects: green checkmark overlay, dimmed
- Exit door: locked appearance when codes < 5, unlocked glow when all codes collected
- Responsive: objects scale and reposition on mobile
- Click handler for each object

---

### Task 13: Puzzle Components (5 puzzle types)

**Files:**
- Create: `src/components/escape/PromptFixPuzzle.tsx`
- Create: `src/components/escape/SpotErrorPuzzle.tsx`
- Create: `src/components/escape/MatchPuzzle.tsx`
- Create: `src/components/escape/QuizPuzzle.tsx`
- Create: `src/components/escape/ChatFixPuzzle.tsx`

**Step 1: PromptFixPuzzle**

Props: `puzzle: PromptFixPuzzle`, `onSolve: (correct: boolean) => void`

Drag-to-reorder prompt fragments (use Framer Motion Reorder like CritiqueCard). Submit button checks order against correctOrder. Show correct/incorrect feedback.

**Step 2: SpotErrorPuzzle**

Props: `puzzle: SpotErrorPuzzle`, `onSolve: (correct: boolean) => void`

Display document text. Player clicks/taps on suspected errors (text becomes selectable spans). Submit checks selected spans against errors[].text. Highlight correct errors in red, missed ones in yellow.

**Step 3: MatchPuzzle**

Props: `puzzle: MatchConceptsPuzzle`, `onSolve: (correct: boolean) => void`

Two columns: terms (left) and definitions (right, shuffled). Player draws connections by clicking term then definition. Lines or color-coded pairs. Submit checks all pairs.

**Step 4: QuizPuzzle**

Props: `puzzle: QuizPuzzle`, `onSolve: (correct: boolean) => void`

Sequential multiple-choice questions. Select answer → show correct/incorrect → next question. All correct = puzzle solved. Partial credit tracked.

**Step 5: ChatFixPuzzle**

Props: `puzzle: ChatFixPuzzle`, `onSolve: (correct: boolean) => void`

Chat conversation display. Broken messages highlighted. For each broken message, show 3 replacement options. Player picks the correct fix for each. Submit when all fixed.

**Step 6: Verify all compile**

Run: `npx tsc --noEmit`

---

### Task 14: PuzzleModal & ExitPuzzle

**Files:**
- Create: `src/components/escape/PuzzleModal.tsx`
- Create: `src/components/escape/ExitPuzzle.tsx`

**Step 1: PuzzleModal**

Wrapper modal that renders the correct puzzle component based on puzzle.type. Includes:
- Dark overlay backdrop
- Centered modal card (max-w-2xl)
- Close button (X) in top-right
- HintButton integrated
- Object name as modal title
- AnimatePresence for enter/exit animation

**Step 2: ExitPuzzle**

Props: `puzzle: ExitPuzzle`, `collectedCodes: string[]`, `onSolve: (correct: boolean) => void`

Shows code entry slots (5 slots). Displays collected codes. If all 5 collected, shows final question (multiple choice). Correct answer = escaped!

**Step 3: Verify compile**

Run: `npx tsc --noEmit`

---

### Task 15: Escape Room Play Page

**Files:**
- Create: `src/app/[locale]/escape-room/play/page.tsx`

**Step 1: Create the gameplay page**

Main orchestrator page. Pattern follows arena play page but with room-specific mechanics.

State management:
- `room: EscapeRoom` (loaded from data by difficulty)
- `remainingTime: number` (countdown from room.timeLimit)
- `solvedPuzzles: Map<string, EscapeAnswer>`
- `collectedCodes: string[]`
- `activePuzzle: string | null` (which object's puzzle is open)
- `hintsUsed: Set<string>` (which puzzles had hints used)
- `gameOver: boolean`
- `escaped: boolean`

Timer logic:
- `useEffect` with `setInterval(1000)` counting down
- Pause timer when puzzle modal is open (debatable — could keep running for urgency)
- Actually, keep timer running even during puzzles for true escape room feel
- At zero: set gameOver=true, show results

Hint logic:
- When hint used: remainingTime -= 60, add puzzle to hintsUsed set

Flow:
1. Load room data by difficulty
2. Show RoomView with timer bar at top
3. Click object → open PuzzleModal
4. Solve puzzle → earn code, mark object as solved, close modal
5. When 5 codes collected, exit door becomes clickable
6. Solve exit puzzle → escaped=true → redirect to results
7. Timer hits 0 → gameOver → redirect to results

Save progress to sessionStorage `escape-progress`.
On complete, build result and save to `escape-result`, redirect to `/{locale}/escape-room/results`.

Use `<a>` tag (not `<Link>`) for back navigation to avoid prefetch issues.

**Step 2: Verify compile**

Run: `npx tsc --noEmit`

---

### Task 16: Escape Room Results Page

**Files:**
- Create: `src/app/[locale]/escape-room/results/page.tsx`

**Step 1: Create results page**

Read EscapeResult + SessionResult from sessionStorage.

Show:
- Escaped or Trapped banner (green vs red)
- Time remaining (if escaped) or "Time's Up"
- Puzzles solved count
- Hints used count
- Overall score + mastery level
- Radar chart (same pattern as arena/turing)
- Puzzle breakdown (per puzzle: solved/unsolved, hint used, time spent)
- Play Again → `/escape-room`
- Back to Hub → `/`

**Step 2: Verify compile**

Run: `npx tsc --noEmit`

---

### Task 17: Integration & Polish

**Files:**
- Modify: `src/app/[locale]/page.tsx` (verify comingSoon removed)
- All escape files

**Step 1: Full type check**

Run: `npx tsc --noEmit`

**Step 2: Generate room background images**

Use baoyu-image-gen batch mode to generate 4 room backgrounds.

**Step 3: Manual test**

Run: `npm run dev -- -p 3456`

Test:
- Hub → Escape Room → Beginner → Play through all puzzles → Escape → Results
- Test hint system (use hint, verify -60s penalty)
- Test timer running out (set artificially low timer for testing)
- Test all puzzle types work
- Verify results page renders correctly

**Step 4: Run 5 Playwright test agents**

Dispatch 5 parallel agents to test different scenarios:
1. Beginner room (solve all, escape)
2. Intermediate room (solve some, time out)
3. Advanced room (use hints, escape)
4. Expert room (try to escape)
5. Test timer behavior and hint penalties
