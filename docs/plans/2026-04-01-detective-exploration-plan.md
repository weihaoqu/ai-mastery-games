# Detective Interactive Exploration — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the detective game from static evidence cards into an interactive exploration mode where players click hotspots on noir pixel art scenes to discover evidence.

**Architecture:** Add `hotspots` array to Evidence interface mapping each evidence piece to a percentage-based region on the scene image. Build InteractiveScene component (zoomable, pannable, clickable hotspots with glow) and EvidenceModal component. Update play page to use interactive scene instead of static image + expandable cards. Add discovery bonus to scoring.

**Tech Stack:** Next.js 16, Tailwind CSS, framer-motion, CSS transforms for zoom/pan

---

### Task 1: Add Hotspot type and update Evidence/Case interfaces

**Files:**
- Modify: `src/lib/types.ts`

**Step 1:** Add Hotspot interface and update Evidence:

```typescript
export interface EvidenceHotspot {
  x: number;      // percentage from left (0-100)
  y: number;      // percentage from top (0-100)
  w: number;      // width as percentage (0-100)
  h: number;      // height as percentage (0-100)
}

export interface Evidence {
  id: string;
  title: string;
  type: 'document' | 'screenshot' | 'data' | 'email' | 'chat-log' | 'code';
  content: string;
  isKey: boolean;
  hotspot?: EvidenceHotspot;  // ADD THIS — position on scene image
}
```

**Step 2: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat: add EvidenceHotspot type for interactive detective scenes"
```

---

### Task 2: Build EvidenceModal component

**Files:**
- Create: `src/components/detective/EvidenceModal.tsx`

**Step 1:** Create modal that shows evidence content when a hotspot is clicked:

```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { Evidence } from "@/lib/types";

const evidenceIconMap: Record<string, string> = {
  document: "description",
  screenshot: "screenshot_monitor",
  data: "database",
  email: "mail",
  "chat-log": "chat",
  code: "code",
};

interface EvidenceModalProps {
  evidence: Evidence | null;
  onClose: () => void;
}

export default function EvidenceModal({ evidence, onClose }: EvidenceModalProps) {
  const t = useTranslations("detective");

  return (
    <AnimatePresence>
      {evidence && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-[10%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg z-50 max-h-[75vh] overflow-y-auto"
          >
            <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl shadow-2xl p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">
                      {evidenceIconMap[evidence.type] ?? "description"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-on-surface text-base">{evidence.title}</h3>
                    {evidence.isKey && (
                      <span className="text-[10px] font-black bg-amber-400/30 text-amber-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {t("keyEvidence")}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors"
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined text-on-surface-variant text-lg">close</span>
                </button>
              </div>

              {/* Content */}
              <div className="text-sm text-on-surface-variant leading-relaxed">
                {evidence.content}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/detective/EvidenceModal.tsx
git commit -m "feat: add EvidenceModal component for detective hotspot reveals"
```

---

### Task 3: Build InteractiveScene component

**Files:**
- Create: `src/components/detective/InteractiveScene.tsx`

**Step 1:** Create the zoomable, pannable scene with clickable hotspot overlays:

```tsx
"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Evidence } from "@/lib/types";
import { basePath } from "@/lib/basePath";

interface InteractiveSceneProps {
  imagePath: string;
  evidence: Evidence[];
  discoveredIds: Set<string>;
  onDiscover: (evidence: Evidence) => void;
}

export default function InteractiveScene({ imagePath, evidence, discoveredIds, onDiscover }: InteractiveSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const hotspotEvidence = evidence.filter(e => e.hotspot);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prev => Math.min(3, Math.max(1, prev - e.deltaY * 0.002)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  }, [zoom, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan({ x: dragStart.current.panX + dx, y: dragStart.current.panY + dy });
  }, [dragging]);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (zoom <= 1 || e.touches.length !== 1) return;
    const t = e.touches[0];
    setDragging(true);
    dragStart.current = { x: t.clientX, y: t.clientY, panX: pan.x, panY: pan.y };
  }, [zoom, pan]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragging || e.touches.length !== 1) return;
    const t = e.touches[0];
    const dx = t.clientX - dragStart.current.x;
    const dy = t.clientY - dragStart.current.y;
    setPan({ x: dragStart.current.panX + dx, y: dragStart.current.panY + dy });
  }, [dragging]);

  const handleHotspotClick = useCallback((ev: Evidence, e: React.MouseEvent) => {
    e.stopPropagation();
    onDiscover(ev);
  }, [onDiscover]);

  // Reset pan when zoom returns to 1
  if (zoom <= 1 && (pan.x !== 0 || pan.y !== 0)) {
    setPan({ x: 0, y: 0 });
  }

  return (
    <div className="w-full">
      {/* Scene container */}
      <div
        ref={containerRef}
        className="relative w-full rounded-2xl overflow-hidden border-2 border-outline-variant shadow-[0_4px_0_0_rgba(0,106,45,0.4)] select-none"
        style={{ cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default" }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <div
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: "center center",
            transition: dragging ? "none" : "transform 0.2s ease-out",
          }}
        >
          {/* Scene image */}
          <img
            src={`${basePath}${imagePath}`}
            alt="Investigation scene"
            className="w-full h-auto block"
            draggable={false}
          />

          {/* Hotspot overlays */}
          {hotspotEvidence.map((ev) => {
            const hs = ev.hotspot!;
            const discovered = discoveredIds.has(ev.id);
            return (
              <button
                key={ev.id}
                onClick={(e) => handleHotspotClick(ev, e)}
                className={`absolute border-2 rounded-lg transition-all ${
                  discovered
                    ? "border-primary/60 bg-primary/10"
                    : "border-transparent hover:border-amber-400/80 hover:bg-amber-400/10 cursor-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22><text y=%2224%22 font-size=%2224%22>🔍</text></svg>'),pointer]"
                }`}
                style={{
                  left: `${hs.x}%`,
                  top: `${hs.y}%`,
                  width: `${hs.w}%`,
                  height: `${hs.h}%`,
                }}
                aria-label={discovered ? ev.title : "Investigate this area"}
              >
                {!discovered && (
                  <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-amber-400/40"
                    animate={{ opacity: [0.2, 0.6, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                {discovered && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-primary text-xs">check</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Zoom controls */}
      <div className="flex items-center justify-between mt-2 px-1">
        <span className="text-xs text-on-surface-variant font-label">
          {zoom > 1 ? "Drag to pan • Scroll to zoom" : "Scroll to zoom in • Click glowing areas to investigate"}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setZoom(prev => Math.min(3, prev + 0.5))}
            className="w-7 h-7 bg-surface-container-lowest border border-outline-variant rounded flex items-center justify-center hover:bg-surface-bright text-xs"
          >
            <span className="material-symbols-outlined text-sm">add</span>
          </button>
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="w-7 h-7 bg-surface-container-lowest border border-outline-variant rounded flex items-center justify-center hover:bg-surface-bright text-xs"
          >
            <span className="material-symbols-outlined text-sm">fit_screen</span>
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/detective/InteractiveScene.tsx
git commit -m "feat: add InteractiveScene component with zoom, pan, and clickable hotspots"
```

---

### Task 4: Update Detective play page

**Files:**
- Modify: `src/app/[locale]/detective/play/page.tsx`

**Step 1:** Import new components and add discovery state:

Add imports:
```tsx
import InteractiveScene from "@/components/detective/InteractiveScene";
import EvidenceModal from "@/components/detective/EvidenceModal";
```

Add state inside PlayInner (after existing state declarations):
```tsx
const [discoveredEvidence, setDiscoveredEvidence] = useState<Set<string>>(new Set());
const [modalEvidence, setModalEvidence] = useState<Evidence | null>(null);

const handleDiscover = useCallback((evidence: Evidence) => {
  setDiscoveredEvidence(prev => {
    const next = new Set(prev);
    next.add(evidence.id);
    return next;
  });
  setModalEvidence(evidence);
}, []);
```

**Step 2:** Replace the static image and evidence board section.

Replace the noir scene illustration block AND the evidence cards section with:

```tsx
{/* Interactive Scene (replaces static image + evidence cards when imagePath exists) */}
{theCase.imagePath && theCase.evidence.some(e => e.hotspot) ? (
  <>
    {/* Discovery counter in a bar */}
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm font-label font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
        <span className="material-symbols-outlined text-lg">search</span>
        {t("evidenceBoard")}
      </span>
      <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
        {discoveredEvidence.size}/{theCase.evidence.filter(e => e.hotspot).length} found
      </span>
    </div>

    <div className="mb-8">
      <InteractiveScene
        imagePath={theCase.imagePath}
        evidence={theCase.evidence}
        discoveredIds={discoveredEvidence}
        onDiscover={handleDiscover}
      />
    </div>

    {/* Discovered evidence list (collapsed summary) */}
    {discoveredEvidence.size > 0 && (
      <div className="mb-8 space-y-2">
        {theCase.evidence.filter(e => discoveredEvidence.has(e.id)).map((ev) => (
          <button
            key={ev.id}
            onClick={() => setModalEvidence(ev)}
            className="w-full text-left flex items-center gap-3 px-4 py-2 bg-surface-container-lowest border border-outline-variant/50 rounded-xl hover:bg-primary/5 transition-colors"
          >
            <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
            <span className="text-sm font-medium text-on-surface">{ev.title}</span>
            {ev.isKey && (
              <span className="text-[9px] font-black bg-amber-400/30 text-amber-800 px-1.5 py-0.5 rounded-full uppercase tracking-wider ml-auto">
                KEY
              </span>
            )}
          </button>
        ))}
      </div>
    )}

    {/* Evidence modal */}
    <EvidenceModal evidence={modalEvidence} onClose={() => setModalEvidence(null)} />
  </>
) : (
  <>
    {/* Fallback: static image for cases without hotspots */}
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

    {/* Original evidence cards (fallback) */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="mb-10"
    >
      <h2 className="flex items-center gap-2 text-sm font-label font-bold text-on-surface-variant uppercase tracking-widest mb-4">
        <span className="material-symbols-outlined text-lg">folder_open</span>
        {t("evidenceBoard")}
      </h2>
      {/* ... keep existing evidence card rendering ... */}
    </motion.div>
  </>
)}
```

Note: Keep the existing evidence card code as a fallback for cases without hotspots. The new interactive mode only activates when evidence items have `hotspot` data.

**Step 3:** Add Evidence import if not already present:
```tsx
import type { Case, PlayerAnswer, Difficulty, Evidence } from "@/lib/types";
```

**Step 4: Commit**

```bash
git add src/app/[locale]/detective/play/page.tsx
git commit -m "feat: integrate InteractiveScene and EvidenceModal into detective play page"
```

---

### Task 5: Update scoring with discovery bonus

**Files:**
- Modify: `src/lib/detective/scoring.ts`

**Step 1:** Update `scoreAnswer` to accept and use discovery count:

```typescript
export function scoreAnswer(
  case_: Case,
  selectedOptionId: string,
  reasoning: string,
  timeSpent: number,
  discoveredCount?: number
): PlayerAnswer {
  const option = case_.options.find(o => o.id === selectedOptionId);
  const isCorrect = option?.isCorrect ?? false;

  // Base score: 70 points for correct answer
  let score = isCorrect ? 70 : 0;

  // Reasoning bonus: up to 20 points
  if (reasoning.length > 50) score += 20;
  else if (reasoning.length > 20) score += 10;

  // Speed bonus: up to 10 points
  if (timeSpent < 60) score += 10;
  else if (timeSpent < 180) score += Math.round(10 * (1 - (timeSpent - 60) / 120));

  // Discovery bonus: up to 15 points based on evidence found
  if (discoveredCount !== undefined) {
    const totalEvidence = case_.evidence.filter(e => e.hotspot).length;
    if (totalEvidence > 0) {
      const ratio = discoveredCount / totalEvidence;
      score += Math.round(15 * ratio);
    }
  }

  return {
    caseId: case_.id,
    caseTitle: case_.title,
    caseType: case_.type,
    selectedOptionId,
    reasoning,
    timeSpent,
    isCorrect,
    score: Math.min(115, Math.max(0, score)),
  };
}
```

**Step 2:** Update the `handleSubmit` in the play page to pass discovery count:

```tsx
const result = scoreAnswer(theCase, selectedOption, "", timeSpent, discoveredEvidence.size);
```

**Step 3: Commit**

```bash
git add src/lib/detective/scoring.ts src/app/[locale]/detective/play/page.tsx
git commit -m "feat: add discovery bonus to detective scoring"
```

---

### Task 6: Add hotspot data to beginner cases

**Files:**
- Modify: `src/data/detective/beginner.ts`

**Step 1:** For each of the 13 beginner cases, view the corresponding image at `public/images/detective/beg-*.png` and add `hotspot: { x, y, w, h }` to each evidence item, mapping to visible objects in the scene.

Use a subagent to view each image, identify objects, and map evidence to hotspot positions. Each hotspot should be approximately 8-15% wide and 15-25% tall to be easily clickable.

General placement strategy:
- Evidence items map to visible objects: desks → documents, screens → data, chairs → people/emails, shelves → reference materials
- Spread hotspots across the image (don't cluster all in one corner)
- Key evidence should be in prominent but not obvious locations

**Step 2: Commit**

```bash
git add src/data/detective/beginner.ts
git commit -m "feat: add hotspot coordinates to beginner detective evidence"
```

---

### Task 7: Add hotspot data to intermediate cases

Same as Task 6 but for `src/data/detective/intermediate.ts` (13 cases).

---

### Task 8: Add hotspot data to advanced cases

Same as Task 6 but for `src/data/detective/advanced.ts` (13 cases).

---

### Task 9: Add hotspot data to expert cases

Same as Task 6 but for `src/data/detective/expert.ts` (14 cases).

---

### Task 10: Final verification

**Step 1:** Start dev server:
```bash
npx next dev --port 3000
```

**Step 2:** Test beginner case:
Navigate to `http://localhost:3000/ai-games/en/detective/play?case=beg-hall-01`
- Verify: scene image shows with glowing hotspots
- Verify: clicking a hotspot opens evidence modal
- Verify: discovery counter updates
- Verify: can zoom (scroll) and pan (drag when zoomed)
- Verify: can submit diagnosis at any time
- Verify: discovered evidence list appears below scene

**Step 3:** Test one case from each other difficulty.

**Step 4:** Commit any fixes.
