# AI Startup Tycoon Visual Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the text-only Tycoon game into a visually rich Civ/SimCity-style experience with pixel art illustrations, resource dashboard icons, and dry corporate humor choices.

**Architecture:** Add an `imagePath` field to `TycoonScenario` type. Generate 8 pixel art illustrations for beginner scenarios + 4 resource icons. Redesign the play page layout to show illustrations above the scenario card. Rewrite all beginner choice text with dry corporate humor. Fix the hub page overlap bug.

**Tech Stack:** Next.js 16, Tailwind CSS, framer-motion, baoyu-image-gen (Google Gemini), next/image

---

### Task 1: Fix Hub Page Game Overlap Bug

**Files:**
- Modify: `src/app/[locale]/page.tsx` (lines 86-90, 184-210)

**Step 1: Adjust overlapping hotspot positions**

The floating progress indicator (`top-6 left-6 z-20`) overlaps the `tycoon` hotspot (`top-[15%] left-[28%]`) and `hunter` hotspot (`top-[28%] left-[10%]`). Fix by:
- Move `tycoon` position from `top-[15%] left-[28%]` to `top-[8%] left-[52%]`
- Move `hunter` position from `top-[28%] left-[10%]` to `top-[50%] left-[8%]`

```tsx
// tycoon hotspot — change position
position: "top-[8%] left-[52%]",

// hunter hotspot — change position
position: "top-[50%] left-[8%]",
```

**Step 2: Verify in browser**

Open `http://localhost:3000/en` and confirm no game icons are hidden behind the info card.

**Step 3: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "fix: adjust hub hotspot positions to prevent overlap with info card"
```

---

### Task 2: Add `imagePath` to TycoonScenario Type

**Files:**
- Modify: `src/lib/types.ts` (TycoonScenario interface, around line 338)

**Step 1: Add optional imagePath field**

```typescript
export interface TycoonScenario {
  id: string;
  difficulty: Difficulty;
  quarter: number;
  title: string;
  context: string;
  imagePath?: string;  // ADD THIS LINE
  decisions: TycoonDecision[];
  skills: { prompting: number; concepts: number; tools: number; criticalThinking: number; ethics: number; };
}
```

**Step 2: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat: add imagePath to TycoonScenario type"
```

---

### Task 3: Generate 8 Pixel Art Scene Illustrations

**Files:**
- Create: `public/images/tycoon/beginner-q1-first-product.png`
- Create: `public/images/tycoon/beginner-q2-data-source.png`
- Create: `public/images/tycoon/beginner-q3-hiring-strategy.png`
- Create: `public/images/tycoon/beginner-q4-launch-speed.png`
- Create: `public/images/tycoon/beginner-q5-user-complaint.png`
- Create: `public/images/tycoon/beginner-q6-pricing-model.png`
- Create: `public/images/tycoon/beginner-q7-pr-crisis.png`
- Create: `public/images/tycoon/beginner-q8-growth-decision.png`

**Style guide for ALL prompts:** "Isometric pixel art, 16-bit retro game style like SimCity. Warm vibrant colors, clean pixel grid. Corporate tech startup theme. No text in the image."

**Step 1: Generate all 8 images using baoyu-image-gen batch mode**

Create a batch file at `public/images/tycoon/batch-beginner.json`:

```json
{
  "jobs": 4,
  "tasks": [
    {
      "id": "q1",
      "prompt": "Isometric pixel art of a small tech startup garage. 4 pixel characters around a desk with laptops, a whiteboard with diagrams, server rack in corner, pizza boxes. Cozy entrepreneurial energy. 16-bit retro SimCity style, warm vibrant colors, clean pixel grid. No text.",
      "image": "beginner-q1-first-product.png",
      "provider": "google",
      "ar": "16:9",
      "quality": "2k"
    },
    {
      "id": "q2",
      "prompt": "Isometric pixel art of a shady data marketplace alley. Pixel characters exchanging USB drives and hard drives near crates labeled with binary code. One vendor has a trench coat. Contrasts with a clean office building next door showing 'licensed data partner'. 16-bit retro style, warm colors. No text.",
      "image": "beginner-q2-data-source.png",
      "provider": "google",
      "ar": "16:9",
      "quality": "2k"
    },
    {
      "id": "q3",
      "prompt": "Isometric pixel art of a job fair or hiring event in an office lobby. A long queue of pixel applicants, interview tables, a whiteboard showing org chart. Mix of junior and senior looking characters. 16-bit retro game style, warm vibrant colors. No text.",
      "image": "beginner-q3-hiring-strategy.png",
      "provider": "google",
      "ar": "16:9",
      "quality": "2k"
    },
    {
      "id": "q4",
      "prompt": "Isometric pixel art of a launch countdown control room. Big screen showing countdown timer, pixel engineers at consoles, one person holding a giant red LAUNCH button. Excitement and tension. Competitor billboard visible through window. 16-bit retro style. No text.",
      "image": "beginner-q4-launch-speed.png",
      "provider": "google",
      "ar": "16:9",
      "quality": "2k"
    },
    {
      "id": "q5",
      "prompt": "Isometric pixel art of a social media crisis war room. Big screen showing angry tweets and news headlines. Pixel characters looking stressed, one on the phone, papers scattered. Red alert lights. 16-bit retro game style, warm colors but tense mood. No text.",
      "image": "beginner-q5-user-complaint.png",
      "provider": "google",
      "ar": "16:9",
      "quality": "2k"
    },
    {
      "id": "q6",
      "prompt": "Isometric pixel art of a boardroom with a giant whiteboard showing pricing tiers: free, premium, enterprise columns with coin stacks of different sizes. Pixel executives debating, one pointing at charts. 16-bit retro style, warm vibrant colors. No text.",
      "image": "beginner-q6-pricing-model.png",
      "provider": "google",
      "ar": "16:9",
      "quality": "2k"
    },
    {
      "id": "q7",
      "prompt": "Isometric pixel art of a security researcher's desk next to a corporate PR office. One side: hacker with magnifying glass finding bugs on a screen. Other side: PR team scrambling with microphones and cameras outside. Split scene, contrasting calm researcher with panicked PR. 16-bit retro style. No text.",
      "image": "beginner-q7-pr-crisis.png",
      "provider": "google",
      "ar": "16:9",
      "quality": "2k"
    },
    {
      "id": "q8",
      "prompt": "Isometric pixel art of a year-end boardroom with a big conference table. Charts and graphs on walls showing growth arrows. A pixel CEO at the head of table, investors in suits on one side, engineers on the other. Trophy case and dollar signs visible. Celebratory but tense mood. 16-bit retro style. No text.",
      "image": "beginner-q8-growth-decision.png",
      "provider": "google",
      "ar": "16:9",
      "quality": "2k"
    }
  ]
}
```

Run:
```bash
bun {baseDir}/scripts/main.ts --batchfile public/images/tycoon/batch-beginner.json
```

**Step 2: Verify all 8 images generated**

```bash
ls -la public/images/tycoon/beginner-q*.png
```

Expected: 8 PNG files

**Step 3: Commit**

```bash
git add public/images/tycoon/beginner-q*.png
git commit -m "feat: add 8 pixel art illustrations for beginner tycoon scenarios"
```

---

### Task 4: Generate Resource Icons (Pixel Art)

**Files:**
- Create: `public/images/tycoon/icon-revenue.png`
- Create: `public/images/tycoon/icon-reputation.png`
- Create: `public/images/tycoon/icon-trust.png`
- Create: `public/images/tycoon/icon-regulatory.png`

**Step 1: Generate 4 resource icons**

Generate each with `--ar 1:1` and quality `2k`:

- Revenue: "Pixel art icon of a stack of gold coins with a green dollar sign, 16-bit retro game item style, transparent-feeling clean background, vibrant gold and green. No text."
- Reputation: "Pixel art icon of a golden 5-point star badge with sparkles, 16-bit retro game item style, clean background, warm gold. No text."
- Trust: "Pixel art icon of a blue shield with a checkmark, 16-bit retro game item style, clean background, vibrant blue. No text."
- Regulatory: "Pixel art icon of an ancient scroll with a wax seal, 16-bit retro game item style, clean background, parchment and red seal. No text."

**Step 2: Commit**

```bash
git add public/images/tycoon/icon-*.png
git commit -m "feat: add pixel art resource icons for tycoon meters"
```

---

### Task 5: Rewrite Beginner Choices with Dry Corporate Humor

**Files:**
- Modify: `src/data/tycoon/beginner.ts`

**Step 1: Update all decision text and add imagePath to each scenario**

Replace the entire `beginnerScenarios` array. Key changes per scenario:

**Q1 First Product:**
- imagePath: `/images/tycoon/beginner-q1-first-product.png`
- A: `"Build an AI resume screener that auto-rejects candidates. What could go wrong? (Everything.)"`
- B: `"Build a support chatbot with human handoff. Boring? Yes. Profitable? Also yes."`
- C: `"Deploy a content moderator that flags everything. Your users will love the silence."`

**Q2 Data Source:**
- imagePath: `/images/tycoon/beginner-q2-data-source.png`
- A: `"Buy scraped data from a guy named 'DataDave' on a forum. Surely all above board."`
- B: `"Partner with companies for licensed datasets. Slow, expensive, and annoyingly responsible."`
- C: `"Use only free public datasets. Budget-friendly! Also results-unfriendly."`

**Q3 Hiring Strategy:**
- imagePath: `/images/tycoon/beginner-q3-hiring-strategy.png`
- A: `"Hire fast: stack the team with juniors. Quantity is a quality all its own, right?"`
- B: `"Invest in senior talent with AI ethics experience. Your burn rate weeps, your codebase rejoices."`
- C: `"Outsource everything overseas. Communication is overrated anyway."`

**Q4 Launch Speed:**
- imagePath: `/images/tycoon/beginner-q4-launch-speed.png`
- A: `"Ship it now. 'Move fast and break things' is still cool, right? ...Right?"`
- B: `"Take 2 extra weeks for safety testing. Your board will send passive-aggressive Slacks."`
- C: `"Wait 3 months for competitor analysis. By then, your competitor will have your customers."`

**Q5 User Complaint:**
- imagePath: `/images/tycoon/beginner-q5-user-complaint.png`
- A: `"Ignore it. The data is 'just reflecting reality.' (Narrator: It was not just reflecting reality.)"`
- B: `"Quick patch: remove zip code as a feature. Problem solved! (Narrator: Problem not solved.)"`
- C: `"Pause the feature, full bias audit, publish findings. Radical transparency — terrifying but effective."`

**Q6 Pricing Model:**
- imagePath: `/images/tycoon/beginner-q6-pricing-model.png`
- A: `"Free for everyone — monetize with ads and data. The 'we'll figure out revenue later' classic."`
- B: `"Freemium: free basic tier, paid premium. The business model that actually makes money."`
- C: `"Enterprise-only at $50k/year. Surely startups love five-figure invoices."`

**Q7 PR Crisis:**
- imagePath: `/images/tycoon/beginner-q7-pr-crisis.png`
- A: `"Deny everything and threaten to sue the researcher. Always a fan favorite. (It's not.)"`
- B: `"Apologize privately to affected users. Nobody will notice the public silence. (They will.)"`
- C: `"Publicly acknowledge, thank the researcher, share fix timeline. Uncomfortably mature of you."`

**Q8 Growth Decision:**
- imagePath: `/images/tycoon/beginner-q8-growth-decision.png`
- A: `"Burn cash on growth hacking and ads. Your runway has a runway, right?"`
- B: `"Focus on product quality and organic growth. Patience is a virtue. Investors disagree."`
- C: `"Acquire a competitor. Nothing says 'we're stable' like doubling your headcount overnight."`

**Step 2: Verify the file compiles**

Run: `npx next build` (or just load the page in dev mode)

**Step 3: Commit**

```bash
git add src/data/tycoon/beginner.ts
git commit -m "feat: rewrite beginner choices with dry corporate humor + add imagePaths"
```

---

### Task 6: Redesign Tycoon Play Page Layout

**Files:**
- Modify: `src/app/[locale]/tycoon/play/page.tsx`

**Step 1: Update the MeterBar to use pixel art icons**

Replace the Material Symbols icon in `MeterBar` with the pixel art icon images:

```tsx
function MeterBar({ label, value, color, icon, iconImage }: { label: string; value: number; color: string; icon: string; iconImage?: string }) {
  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      {iconImage ? (
        <img src={iconImage} alt="" className="w-5 h-5 object-contain" aria-hidden="true" />
      ) : (
        <span className="material-symbols-outlined text-sm text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">{icon}</span>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between mb-0.5">
          <span className="text-[10px] font-label font-bold uppercase tracking-wider text-on-surface-variant truncate">{label}</span>
          <span className="text-[10px] font-mono font-bold text-on-surface">{value}</span>
        </div>
        <div className="h-2 bg-surface-container rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${color} rounded-full`}
            initial={{ width: "50%" }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
```

Pass `iconImage` prop from the meter rendering:

```tsx
const METER_ICON_IMAGES: Record<string, string> = {
  revenue: "/images/tycoon/icon-revenue.png",
  reputation: "/images/tycoon/icon-reputation.png",
  trust: "/images/tycoon/icon-trust.png",
  regulatory: "/images/tycoon/icon-regulatory.png",
};
```

**Step 2: Add scene illustration above the scenario card**

In the `phase === "scenario"` block, add the image between the quarter label and the scenario card:

```tsx
{/* Scene Illustration */}
{currentScenario.imagePath && (
  <div className="w-full rounded-2xl overflow-hidden border-2 border-outline-variant shadow-[0_4px_0_0_rgba(155,63,0,0.6)] mb-4">
    <img
      src={`${basePath}${currentScenario.imagePath}`}
      alt={currentScenario.title}
      className="w-full h-auto object-cover"
    />
  </div>
)}
```

Import `basePath`:
```tsx
import { basePath } from "@/lib/basePath";
```

**Step 3: Verify in browser**

Open `http://localhost:3000/en/tycoon/play?difficulty=beginner` and confirm:
- Pixel art illustration shows above scenario card
- Resource icons appear in meter bars
- Dry humor text displays in choices

**Step 4: Commit**

```bash
git add src/app/[locale]/tycoon/play/page.tsx
git commit -m "feat: redesign tycoon play page with pixel art illustrations and resource icons"
```

---

### Task 7: Clean Up and Final Verification

**Step 1: Delete demo style images (no longer needed)**

```bash
rm public/images/tycoon/demo-style-*.png
rm public/images/tycoon/batch-beginner.json
```

**Step 2: Full playthrough test**

Navigate to `http://localhost:3000/en/tycoon/play?difficulty=beginner` and play through all 8 quarters. Verify:
- Each quarter shows a unique pixel art illustration
- Meter bars use pixel art resource icons
- All choice text has dry corporate humor
- Reveal phase still works correctly
- Results page still works

**Step 3: Commit cleanup**

```bash
git add -A
git commit -m "chore: clean up demo assets and batch file"
```
