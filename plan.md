# AI Mastery Games — Build Plan

> **For Claude:** Use this plan to continue building the project across sessions. Read this file first when resuming work.

## Project Location
- **Path:** `/Users/oreo/Dropbox/ai teaching/ai-mastery-games`
- **Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Chart.js, next-intl
- **Dev server:** `npm run dev -- -p 3456`
- **Full spec:** `/Users/oreo/Dropbox/ai teaching/spec.md`

---

## What's Built (Complete)

### Game 1: AI Detective
- [x] Hub landing page — cyberpunk dark theme, 4 game cards, responsive
- [x] AI Detective — fully playable with all 4 case types (hallucination, bias, prompt-injection, ethics)
- [x] 4 difficulty tiers — Beginner, Intermediate, Advanced, Expert (12 cases each = 48 total)
- [x] Scoring system — 70pts correct + 20pts reasoning + 10pts speed, per-dimension breakdown
- [x] Results page — radar chart (5 dimensions), mastery badges (Novice→Master), case-by-case breakdown with titles
- [x] State persistence — sessionStorage for progress, localStorage for scores
- [x] Navigation guard — beforeunload warning mid-game
- [x] Bug fixes — hydration mismatch fixed, hooks ordering fixed, duplicate keys fixed
- [x] i18n infrastructure — next-intl with `[locale]` routing, UI strings in 5 languages
- [x] i18n case translations — ZH (48/48), ES (48/48), DE (48/48) complete
- [x] i18n case translations — IT (48/48) complete
- [x] Certificate PDF — dark-themed landscape PDF with jsPDF, QR code, dimension bars, download modal
- [x] Certificate verification page — /[locale]/verify/[code] with localStorage + API fallback
- [x] Score submission API — POST /api/scores, GET /api/scores (stats), POST /api/certificates, GET /api/verify/[code]
- [x] Server-side score persistence — JSON file store in .data/ directory

### Architecture
```
src/
├── app/[locale]/              # i18n locale routing
│   ├── layout.tsx             # Root layout with NextIntlClientProvider
│   ├── page.tsx               # Hub landing page
│   └── detective/
│       ├── page.tsx           # Difficulty selection
│       ├── play/page.tsx      # Main gameplay (5 phases)
│       └── results/page.tsx   # Session results + radar chart
├── components/
│   ├── Header.tsx             # Nav bar with language selector
│   └── GameCard.tsx           # Reusable game card
├── data/detective/
│   ├── beginner.ts            # 12 beginner cases
│   ├── intermediate.ts        # 12 intermediate cases
│   ├── advanced.ts            # 12 advanced cases
│   └── expert.ts              # 12 expert cases
├── lib/
│   ├── types.ts               # All TypeScript types
│   ├── storage.ts             # localStorage helpers
│   └── detective/
│       ├── scoring.ts         # Scoring engine
│       └── translate-cases.ts # Case translation overlay system
├── locales/
│   ├── en.json, zh.json, es.json, de.json, it.json  # UI strings (incl. certificate + verify)
│   └── cases/
│       ├── zh.json, es.json, de.json  # Complete case translations (48/48 each)
│       └── it.json            # Partial (30/48)
├── i18n/
│   ├── config.ts              # Locale list + types
│   └── request.ts             # next-intl server config
└── app/
    └── api/
        ├── scores/route.ts    # POST scores, GET aggregate stats
        ├── certificates/route.ts  # POST certificate records
        └── verify/[code]/route.ts # GET certificate verification
```

---

## Remaining Work

### Phase 1 Completion — AI Detective Polish
Priority: **High** | Effort: Small

- [x] **Finish IT translations** — All 48/48 cases complete
- [x] **Certificate PDF** — jsPDF landscape A4, dark theme, QR code, dimension bars, download modal
- [x] **Certificate verification page** — `/[locale]/verify/[code]`, checks localStorage then API
- [x] **Score submission API** — JSON file store in `.data/`, POST/GET for scores + certificates

### Phase 2 — AI or Human? (Turing Test Game)
Priority: **High** | Status: **Complete**

- [x] **Game design** — Card-swipe UI, 6 content types (email, essay, code, social-media, creative-writing, image)
- [x] **Content creation** — 48 items (12 per tier × 4 tiers), 3-5 markers each
- [x] **Game pages** — difficulty selection, swipe gameplay, results with radar chart
- [x] **Scoring** — Streak multiplier (1x→3x), normalized to 0-100, per-dimension breakdown
- [x] **Hub integration** — Turing card activated, certificate modal integrated
- [x] **i18n** — UI strings in all 5 languages (content translations deferred)

### Phase 3 — Prompt Arena
Priority: **Medium** | Effort: Large

- [ ] **Game design** — Given a goal, craft the best prompt
  - Pre-crafted mode: compare against rubric (specificity, constraints, format, creativity)
  - Live AI mode (BYOK): send prompt to real AI, evaluate output
- [ ] **Content creation** — 30+ challenges per tier
  - Beginner: "Write a prompt that makes AI explain X simply"
  - Intermediate: "Extract structured data from messy input"
  - Advanced: "Write a system prompt for a customer service bot with guardrails"
  - Expert: "Design a multi-step agent workflow with error handling"
- [ ] **Game pages**
  - `/[locale]/arena/page.tsx` — difficulty selection
  - `/[locale]/arena/play/page.tsx` — prompt editor + evaluation
  - `/[locale]/arena/results/page.tsx` — results with prompt quality breakdown
- [ ] **BYOK API integration** — Settings page for API key entry (Claude, OpenAI)
  - Key stored in localStorage only
  - Provider abstraction layer
- [ ] **Leaderboard** — Anonymous high scores
- [ ] **i18n**

### Phase 4 — AI Escape Room
Priority: **Lower** | Effort: Very Large

- [ ] **Game design** — 5 themed chambers per escape room, timed (15 min)
  - Each chamber = different puzzle type using AI knowledge
  - Puzzles: decode embeddings, fix broken prompts, navigate ethical decisions, identify model behavior, complete AI pipelines
- [ ] **Content creation** — 5+ escape room themes per tier (20+ total)
- [ ] **Timer + hint system** — Countdown timer, hints with score penalty
- [ ] **Game pages** — Escape room UI with chamber navigation
- [ ] **i18n**

### Phase 5 — Polish & Scale
Priority: **Future** | Effort: Ongoing

- [ ] **Unified mastery profile** — Combined scoring across all 4 games
- [ ] **Analytics dashboard** — Aggregate anonymous stats
- [ ] **Classroom mode** — Teacher dashboard for workshops
  - Real-time student score visibility
  - Session codes for group play
- [ ] **Content contribution** — Educator-submitted cases/challenges
- [ ] **Monetization** — Decide: free / freemium / paid
- [ ] **Deploy** — Vercel or AWS (see CLAUDE.md for AWS pipeline)

---

## How to Resume Work

1. Read this `plan.md` first
2. Check the to-do list above for what's next
3. Run `npm run build` to verify current state compiles
4. Run `npm run dev -- -p 3456` to test locally
5. Pick the next unchecked item and build it
6. Always show Q the updated to-do list after completing work

## Key Technical Decisions
- **Case content is in TypeScript files** (src/data/detective/*.ts), translations are JSON overlays (src/locales/cases/*.json)
- **Translation system** uses `translateCases()` in `src/lib/detective/translate-cases.ts` — loads JSON overlays and merges with English source
- **Scoring formula:** 70pts correct + 20pts reasoning (>50 chars) + 10pts speed (<60s) = 100 max
- **Hybrid persistence** — localStorage/sessionStorage for client, JSON file API routes for server (scores + certificates)
- **Each game should follow the same pattern:** difficulty selection → gameplay → results → hub integration
