# Hallucination Hunter Visual Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the text-only Hunter game into a war room command center with pixel art scenes, CRT monitor UI, radar sweep timer, and signal-type badges.

**Architecture:** Generate 6 pixel art war room scenes (one per claim category) + 1 pixel art heart icon. Rebuild ClaimBubble component with CRT monitor frame, scanline overlay, radar sweep timer, and signal-type badges. Add scene background behind the monitor. Keep scoring, data, and reveal phase unchanged.

**Tech Stack:** Next.js 16, Tailwind CSS, framer-motion, baoyu-image-gen (Google Gemini), CSS animations

---

### Task 1: Generate 6 Pixel Art War Room Scenes + Heart Icon

**Files:**
- Create: `public/images/hunter/scene-factual.png`
- Create: `public/images/hunter/scene-citation.png`
- Create: `public/images/hunter/scene-code.png`
- Create: `public/images/hunter/scene-temporal.png`
- Create: `public/images/hunter/scene-entity.png`
- Create: `public/images/hunter/scene-statistical.png`
- Create: `public/images/hunter/icon-heart.png`
- Create: `public/images/hunter/batch-scenes.json` (temporary)

**Step 1: Create output directory and batch file**

```bash
mkdir -p public/images/hunter
```

Write `public/images/hunter/batch-scenes.json`:

```json
{
  "jobs": 4,
  "tasks": [
    {
      "id": "factual",
      "prompt": "Isometric pixel art of a news monitoring war room. Multiple screens showing news headlines and live feeds. Operators at desks with headsets analyzing broadcasts. Dark room lit by screen glow. Red alert indicators on walls. 16-bit retro SimCity style, warm vibrant colors, clean pixel grid. No text.",
      "image": "scene-factual.png",
      "provider": "google",
      "ar": "16:9",
      "quality": "2k"
    },
    {
      "id": "citation",
      "prompt": "Isometric pixel art of a secret library archive vault. Glowing bookshelves floor to ceiling, old leather-bound tomes, computer terminals scanning documents. A librarian character with magnifying glass. Dim amber lighting with green terminal glow. 16-bit retro SimCity style, warm vibrant colors. No text.",
      "image": "scene-citation.png",
      "provider": "google",
      "ar": "16:9",
      "quality": "2k"
    },
    {
      "id": "code",
      "prompt": "Isometric pixel art of a cyberpunk server room command center. Server racks with blinking lights, terminal consoles showing code, holographic displays. Operators monitoring systems. Blue and green neon glow in dark room. 16-bit retro SimCity style, warm vibrant colors. No text.",
      "image": "scene-code.png",
      "provider": "google",
      "ar": "16:9",
      "quality": "2k"
    },
    {
      "id": "temporal",
      "prompt": "Isometric pixel art of a clock tower control room. Multiple clocks showing different times, timeline displays on walls, calendar boards, hourglass collection. Operators cross-referencing dates on screens. Warm amber lighting. 16-bit retro SimCity style, warm vibrant colors. No text.",
      "image": "scene-temporal.png",
      "provider": "google",
      "ar": "16:9",
      "quality": "2k"
    },
    {
      "id": "entity",
      "prompt": "Isometric pixel art of an intelligence office. Cork boards with portrait photos connected by red string. Dossier files on desks. Analysts studying identity documents on screens. Map with pins on the wall. Desk lamps in dim room. 16-bit retro SimCity style, warm vibrant colors. No text.",
      "image": "scene-entity.png",
      "provider": "google",
      "ar": "16:9",
      "quality": "2k"
    },
    {
      "id": "statistical",
      "prompt": "Isometric pixel art of a data analytics command center. Giant screens showing bar charts, pie graphs, and number feeds. Analysts at workstations with multiple monitors. Data streams flowing across displays. Blue and cyan glow. 16-bit retro SimCity style, warm vibrant colors. No text.",
      "image": "scene-statistical.png",
      "provider": "google",
      "ar": "16:9",
      "quality": "2k"
    }
  ]
}
```

Run:
```bash
bun /Users/oreo/.claude/plugins/cache/baoyu-skills/utility-skills/603cabaef497/skills/baoyu-image-gen/scripts/main.ts --batchfile public/images/hunter/batch-scenes.json
```

**Step 2: Generate pixel art heart icon**

```bash
bun /Users/oreo/.claude/plugins/cache/baoyu-skills/utility-skills/603cabaef497/skills/baoyu-image-gen/scripts/main.ts --prompt "Pixel art icon of a red heart with a bright glow, 16-bit retro game item style, clean solid background, vibrant red. No text." --image public/images/hunter/icon-heart.png --provider google --ar 1:1 --quality 2k
```

**Step 3: Verify all 7 images generated**

```bash
ls -la public/images/hunter/*.png
```

Expected: 7 PNG files

**Step 4: Clean up batch file and commit**

```bash
rm public/images/hunter/batch-scenes.json
git add public/images/hunter/*.png
git commit -m "feat: add 6 pixel art war room scenes and heart icon for hunter game"
```

---

### Task 2: Build CRT Monitor Component

**Files:**
- Create: `src/components/hunter/CRTMonitor.tsx`

**Step 1: Create the CRT monitor wrapper component**

This is a reusable wrapper that adds CRT scanline effect, phosphor glow, and monitor frame around any children.

```tsx
"use client";

import type { ReactNode } from "react";

interface CRTMonitorProps {
  children: ReactNode;
  flash?: "green" | "red" | null;
}

export default function CRTMonitor({ children, flash }: CRTMonitorProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Monitor bezel */}
      <div className={`
        relative rounded-xl border-4 border-[#2a2a2a] bg-[#0a1a0a] p-1
        shadow-[0_0_30px_rgba(0,255,0,0.15),inset_0_0_60px_rgba(0,0,0,0.5)]
        ${flash === "green" ? "animate-[flash-green_0.3s_ease-out]" : ""}
        ${flash === "red" ? "animate-[flash-red_0.3s_ease-out]" : ""}
      `}>
        {/* Screen area */}
        <div className="relative rounded-lg overflow-hidden bg-[#0a1a0a] p-5">
          {/* Scanline overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-10 opacity-[0.04]"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,255,0,0.03) 1px, rgba(0,255,0,0.03) 2px)",
              backgroundSize: "100% 2px",
            }}
          />

          {/* Phosphor glow */}
          <div className="pointer-events-none absolute inset-0 z-10 rounded-lg"
            style={{
              boxShadow: "inset 0 0 40px rgba(0,255,0,0.06)",
            }}
          />

          {/* Content */}
          <div className="relative z-0">
            {children}
          </div>
        </div>
      </div>

      {/* Monitor base */}
      <div className="mx-auto w-1/3 h-2 bg-[#2a2a2a] rounded-b-lg" />
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/hunter/CRTMonitor.tsx
git commit -m "feat: add CRT monitor wrapper component for hunter game"
```

---

### Task 3: Build Radar Sweep Timer Component

**Files:**
- Create: `src/components/hunter/RadarSweep.tsx`

**Step 1: Create the radar sweep timer**

Circular radar that sweeps as the timer counts down, changing color from green → yellow → red.

```tsx
"use client";

import { useEffect, useState } from "react";

interface RadarSweepProps {
  lifetime: number; // total seconds
  size?: number;
}

export default function RadarSweep({ lifetime, size = 48 }: RadarSweepProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(0);
    const interval = setInterval(() => {
      setElapsed(prev => {
        if (prev >= lifetime) {
          clearInterval(interval);
          return lifetime;
        }
        return prev + 0.1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [lifetime]);

  const progress = Math.min(elapsed / lifetime, 1);
  const angle = progress * 360;
  const remaining = 1 - progress;

  const color = remaining > 0.5 ? "#00ff41" : remaining > 0.25 ? "#ffaa00" : "#ff4444";
  const glowColor = remaining > 0.5 ? "rgba(0,255,65,0.3)" : remaining > 0.25 ? "rgba(255,170,0,0.3)" : "rgba(255,68,68,0.3)";

  const r = size / 2 - 4;
  const cx = size / 2;
  const cy = size / 2;

  // Sweep hand endpoint
  const handAngle = ((angle - 90) * Math.PI) / 180;
  const hx = cx + r * Math.cos(handAngle);
  const hy = cy + r * Math.sin(handAngle);

  return (
    <svg width={size} height={size} className="flex-shrink-0" style={{ filter: `drop-shadow(0 0 4px ${glowColor})` }}>
      {/* Background circle */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a3a1a" strokeWidth="2" />

      {/* Grid lines */}
      <line x1={cx} y1={4} x2={cx} y2={size - 4} stroke="#1a3a1a" strokeWidth="0.5" />
      <line x1={4} y1={cy} x2={size - 4} y2={cy} stroke="#1a3a1a" strokeWidth="0.5" />

      {/* Sweep hand */}
      <line x1={cx} y1={cy} x2={hx} y2={hy} stroke={color} strokeWidth="2" strokeLinecap="round" />

      {/* Center dot */}
      <circle cx={cx} cy={cy} r="2" fill={color} />

      {/* Remaining arc */}
      {remaining > 0 && (
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeDasharray={`${remaining * 2 * Math.PI * r} ${2 * Math.PI * r}`}
          strokeDashoffset={`${(angle / 360) * 2 * Math.PI * r}`}
          transform={`rotate(-90 ${cx} ${cy})`}
          opacity="0.4"
        />
      )}
    </svg>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/hunter/RadarSweep.tsx
git commit -m "feat: add radar sweep timer component for hunter game"
```

---

### Task 4: Redesign ClaimBubble with CRT + War Room Scene

**Files:**
- Modify: `src/components/hunter/ClaimBubble.tsx`

**Step 1: Rewrite ClaimBubble to use CRT monitor, scene background, radar sweep, signal badges**

```tsx
"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { HunterClaim } from "@/lib/types";
import CRTMonitor from "./CRTMonitor";
import RadarSweep from "./RadarSweep";
import { basePath } from "@/lib/basePath";

const categoryScene: Record<string, string> = {
  factual: "/images/hunter/scene-factual.png",
  citation: "/images/hunter/scene-citation.png",
  code: "/images/hunter/scene-code.png",
  temporal: "/images/hunter/scene-temporal.png",
  entity: "/images/hunter/scene-entity.png",
  statistical: "/images/hunter/scene-statistical.png",
};

const signalLabel: Record<string, string> = {
  factual: "FACTUAL",
  citation: "CITATION",
  code: "CODE",
  temporal: "TEMPORAL",
  entity: "ENTITY",
  statistical: "STATISTICAL",
};

interface ClaimBubbleProps {
  claim: HunterClaim;
  index: number;
  onShoot: () => void;
  onPass: () => void;
  lifetime: number;
  disabled?: boolean;
}

export default function ClaimBubble({ claim, index, onShoot, onPass, lifetime, disabled }: ClaimBubbleProps) {
  const t = useTranslations("hunter");
  const scene = categoryScene[claim.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.8 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* War room scene background */}
      {scene && (
        <div className="w-full rounded-t-2xl overflow-hidden border-2 border-b-0 border-outline-variant">
          <img
            src={`${basePath}${scene}`}
            alt=""
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* CRT Monitor with claim */}
      <CRTMonitor>
        {/* Signal type badge + Radar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#00ff41] animate-pulse" />
            <span className="font-mono text-[11px] font-bold tracking-widest text-[#00ff41] uppercase">
              SIGNAL: {signalLabel[claim.category] ?? claim.category}
            </span>
          </div>
          <RadarSweep lifetime={lifetime} size={40} />
        </div>

        {/* Intercepted transmission */}
        <div className="mb-4">
          <p className="font-mono text-[10px] text-[#00ff41]/50 uppercase tracking-wider mb-2">
            &gt; INTERCEPTED TRANSMISSION:
          </p>
          <p className="font-mono text-sm text-[#00ff41] leading-relaxed">
            &gt; &ldquo;{claim.text}&rdquo;
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onShoot}
            disabled={disabled}
            aria-label={t("hallucination")}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-red-500/50 bg-red-950/50 text-red-400 font-mono font-bold text-xs uppercase tracking-wider hover:bg-red-900/50 hover:border-red-400 active:scale-95 transition-all disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">close</span>
            {t("hallucination")}
          </button>
          <button
            onClick={onPass}
            disabled={disabled}
            aria-label={t("legit")}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-[#00ff41]/50 bg-green-950/50 text-[#00ff41] font-mono font-bold text-xs uppercase tracking-wider hover:bg-green-900/50 hover:border-[#00ff41] active:scale-95 transition-all disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">check</span>
            {t("legit")}
          </button>
        </div>
      </CRTMonitor>
    </motion.div>
  );
}
```

**Step 2: Verify in browser**

Open `http://localhost:3000/ai-games/en/hunter/play?difficulty=beginner` and confirm:
- Pixel art war room scene shows above the CRT monitor
- Scene changes based on claim category
- CRT monitor has scanline effect and green phosphor glow
- Radar sweep timer counts down
- Signal type badge shows with blinking indicator
- Claim text appears as intercepted transmission
- Buttons styled as terminal commands

**Step 3: Commit**

```bash
git add src/components/hunter/ClaimBubble.tsx
git commit -m "feat: redesign ClaimBubble with CRT monitor, war room scene, and radar timer"
```

---

### Task 5: Update Play Page with Pixel Art Hearts

**Files:**
- Modify: `src/app/[locale]/hunter/play/page.tsx`

**Step 1: Replace Material icon hearts with pixel art**

Add basePath import and replace the hearts section:

```tsx
import { basePath } from "@/lib/basePath";
```

Replace the hearts rendering (around line 184-195) with:

```tsx
<div className="flex items-center gap-1" role="status" aria-label={`${lives} ${t("livesRemaining")}`}>
  {Array.from({ length: 3 }).map((_, i) => (
    <img
      key={i}
      src={`${basePath}/images/hunter/icon-heart.png`}
      alt=""
      className={`w-5 h-5 object-contain ${i < lives ? "opacity-100" : "opacity-20 grayscale"}`}
      aria-hidden="true"
    />
  ))}
</div>
```

**Step 2: Verify in browser**

Confirm pixel art hearts appear in the top bar.

**Step 3: Commit**

```bash
git add src/app/[locale]/hunter/play/page.tsx
git commit -m "feat: replace material hearts with pixel art icons in hunter game"
```

---

### Task 6: Add CRT Flash Animations

**Files:**
- Modify: `src/app/globals.css` (add keyframe animations)

**Step 1: Add flash-green and flash-red keyframes**

Add at the end of `globals.css`:

```css
@keyframes flash-green {
  0% { box-shadow: 0 0 30px rgba(0,255,0,0.15), inset 0 0 60px rgba(0,0,0,0.5); }
  50% { box-shadow: 0 0 60px rgba(0,255,0,0.5), inset 0 0 30px rgba(0,255,0,0.2); }
  100% { box-shadow: 0 0 30px rgba(0,255,0,0.15), inset 0 0 60px rgba(0,0,0,0.5); }
}

@keyframes flash-red {
  0% { box-shadow: 0 0 30px rgba(0,255,0,0.15), inset 0 0 60px rgba(0,0,0,0.5); }
  50% { box-shadow: 0 0 60px rgba(255,0,0,0.5), inset 0 0 30px rgba(255,0,0,0.2); }
  100% { box-shadow: 0 0 30px rgba(0,255,0,0.15), inset 0 0 60px rgba(0,0,0,0.5); }
}
```

**Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add CRT flash animations for hunter hit/miss feedback"
```

---

### Task 7: Clean Up and Final Verification

**Step 1: Full playthrough test**

Navigate to `http://localhost:3000/ai-games/en/hunter/play?difficulty=beginner` and play through several claims. Verify:
- War room scene changes when category changes
- CRT monitor scanlines and glow visible
- Radar sweep counts down correctly
- Signal type badge matches claim category
- Pixel art hearts update on wrong answers
- Buttons work for both shoot and pass

**Step 2: Test other difficulties**

Quick check intermediate and expert load without errors:
```bash
curl -s -o /dev/null -w '%{http_code}' 'http://localhost:3000/ai-games/en/hunter/play?difficulty=intermediate'
curl -s -o /dev/null -w '%{http_code}' 'http://localhost:3000/ai-games/en/hunter/play?difficulty=expert'
```

**Step 3: Commit any final fixes**

```bash
git add -A
git commit -m "chore: hunter redesign cleanup"
```
