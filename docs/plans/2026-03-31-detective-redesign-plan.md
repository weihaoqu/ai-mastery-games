# AI Detective Visual Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add noir pixel art scene illustrations to all 53 detective cases across 4 difficulty levels.

**Architecture:** Add `imagePath` to Case type. For each difficulty, read all case titles/briefings, generate a batch JSON with noir pixel art prompts, run baoyu-image-gen batch mode, then add imagePaths to data files. Update play page with hero image.

**Tech Stack:** Next.js 16, baoyu-image-gen (Google Gemini), Tailwind CSS

---

### Task 1: Add imagePath to Case type

**Files:**
- Modify: `src/lib/types.ts`

**Step 1:** Add optional `imagePath` field to Case interface:

```typescript
export interface Case {
  id: string;
  title: string;
  type: CaseType;
  difficulty: Difficulty;
  briefing: string;
  context: string;
  imagePath?: string;  // ADD THIS
  evidence: Evidence[];
  // ... rest unchanged
}
```

**Step 2: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat: add imagePath to Case type for detective illustrations"
```

---

### Task 2: Update Detective play page with hero image

**Files:**
- Modify: `src/app/[locale]/detective/play/page.tsx`

**Step 1:** Add basePath import and hero image above case header.

Add import:
```tsx
import { basePath } from "@/lib/basePath";
```

Add before the Case Header `<motion.div>` (around line 184):
```tsx
{/* Noir scene illustration */}
{theCase.imagePath && (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="w-full rounded-2xl overflow-hidden border-2 border-outline-variant shadow-[0_4px_0_0_rgba(0,106,45,0.4)] mb-6"
  >
    <img
      src={`${basePath}${theCase.imagePath}`}
      alt={theCase.title}
      className="w-full h-auto object-cover"
    />
  </motion.div>
)}
```

**Step 2: Commit**

```bash
git add src/app/[locale]/detective/play/page.tsx
git commit -m "feat: add noir scene illustration to detective play page"
```

---

### Task 3: Generate beginner case illustrations (13 cases)

**Files:**
- Create: `public/images/detective/` directory
- Create: 13 PNG files in `public/images/detective/`

**Step 1:** Read `src/data/detective/beginner.ts` to get all case IDs, titles, and briefings.

**Step 2:** Create `public/images/detective/batch-beginner.json` with 13 tasks. Each prompt follows this template:

```
"Isometric pixel art noir scene of [LOCATION/SCENARIO matching the case briefing]. Dark moody atmosphere, long shadows, rain-soaked details, dim lighting with neon or screen glow accents. Detective investigation feel. 16-bit retro style, clean pixel grid. No text."
```

Map each case to an appropriate scene based on its title and briefing.

**Step 3:** Run batch generation:
```bash
mkdir -p public/images/detective
bun /Users/oreo/.claude/plugins/cache/baoyu-skills/utility-skills/603cabaef497/skills/baoyu-image-gen/scripts/main.ts --batchfile public/images/detective/batch-beginner.json
```

**Step 4:** Add imagePath to each case in `src/data/detective/beginner.ts`

**Step 5:** Clean up and commit:
```bash
rm public/images/detective/batch-beginner.json
git add public/images/detective/beg-*.png src/data/detective/beginner.ts
git commit -m "feat: add noir pixel art illustrations for beginner detective cases"
```

---

### Task 4: Generate intermediate case illustrations (13 cases)

Same process as Task 3 but for `src/data/detective/intermediate.ts`. Save images as `int-*.png`.

---

### Task 5: Generate advanced case illustrations (13 cases)

Same process as Task 3 but for `src/data/detective/advanced.ts`. Save images as `adv-*.png`.

---

### Task 6: Generate expert case illustrations (14 cases)

Same process as Task 3 but for `src/data/detective/expert.ts`. Save images as `exp-*.png`.

---

### Task 7: Final verification

**Step 1:** Start dev server and test a case from each difficulty:
```bash
npx next dev --port 3000
```

Test URLs (substitute actual case IDs):
- `http://localhost:3000/ai-games/en/detective/play?case=beg-hall-01`
- `http://localhost:3000/ai-games/en/detective/play?case=int-hall-01`
- `http://localhost:3000/ai-games/en/detective/play?case=adv-hall-01`
- `http://localhost:3000/ai-games/en/detective/play?case=exp-hall-01`

Verify: noir pixel art scene shows above case title.

**Step 2:** Commit any fixes.
