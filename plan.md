# AI Mastery Games — Build Plan

> **For Claude:** Use this plan to continue building the project across sessions. Read this file first when resuming work.

## Project Location
- **Path:** `/Users/oreo/Dropbox/aiteaching/ai-mastery-games`
- **Stack:** Next.js 16 (App Router), TypeScript, Tailwind v4, Framer Motion, Chart.js, next-intl
- **Dev server:** `npm run dev`
- **Base path:** `/ai-games`
- **Deploy:** EC2 at monmouthaiteaching.com/ai-games (Docker, GitHub Actions CI/CD)

---

## What's Built (Complete) — 9 Games

### Game 1: AI Detective
- [x] Interactive scene with zoomable image + clickable evidence hotspots
- [x] EvidenceModal popup for discovered evidence
- [x] 4 case types (hallucination, bias, prompt-injection, ethics)
- [x] 4 difficulty tiers × 12 cases each = 48 total cases
- [x] Scoring: 70pts correct + 20pts reasoning + 10pts speed + 15pts discovery bonus
- [x] Results page with radar chart, mastery badges, case breakdown
- [x] i18n: UI strings + case translations in 5 languages (EN, ZH, ES, DE, IT)
- [x] Certificate PDF + verification page + score submission API

### Game 2: Prompt Arena
- [x] 3 modes: Critique, Battle, Optimize
- [x] 4 difficulty tiers, results with radar chart
- [x] i18n UI strings in 5 languages

### Game 3: AI or Human? (Turing Test)
- [x] Card-swipe UI, 6 content types
- [x] 48 items (12 per tier), streak multiplier scoring
- [x] i18n UI strings in 5 languages

### Game 4: AI Escape Room
- [x] 4 scenario-based puzzle rooms with timer
- [x] Hint system with score penalty
- [x] i18n UI strings in 5 languages

### Game 5: Hallucination Hunter
- [x] Shooting gallery mechanic — shoot/pass on AI claims
- [x] Streak system, 3 lives, CRT monitor theme
- [x] i18n UI strings in 5 languages

### Game 6: AI Ethics Quest
- [x] Narrative ethical dilemmas
- [x] 4 meters: Trust/Profit/Safety/Equity
- [x] i18n UI strings in 5 languages

### Game 7: AI Startup Tycoon
- [x] 8-quarter business simulation
- [x] 4 meters: Revenue/Reputation/Trust/Regulatory
- [x] i18n UI strings in 5 languages

### Game 8: Pipeline Defense
- [x] Tower defense mechanic — defend ML pipeline from threats
- [x] Threat types: bias, drift, adversarial attacks
- [x] i18n UI strings in 5 languages

### Game 9: Token Tumble
- [x] Drag-and-drop token ordering puzzle with timer
- [x] i18n UI strings in 5 languages

### Cross-cutting (Complete)
- [x] Green "AI Mastery Village" map landing page with game hotspot cards
- [x] SessionResult with 5 skill dimensions (prompting, concepts, tools, criticalThinking, ethics)
- [x] Chart.js radar charts on all results pages
- [x] CertificateModal + ShareButton on all results pages
- [x] Analytics: trackGameStart, trackCaseAnswer, trackGameAbandon (beforeunload only)
- [x] Score persistence: sessionStorage + localStorage + JSON file API
- [x] Analytics false-positive fix: removed visibilitychange listeners (2026-04-01)

---

## Remaining Work

### Phase 5 — Polish & Scale
Priority: **Next** | Effort: Ongoing

- [ ] **Unified mastery profile** — Combined scoring across all 9 games
  - Aggregate skill dimensions from all game results
  - Overall mastery level and progression tracking
  - Profile page with game-by-game breakdown
- [ ] **Analytics dashboard** — Aggregate anonymous stats
  - Game popularity, completion rates, score distributions
  - Difficulty tier performance comparison
- [ ] **Classroom mode** — Teacher dashboard for workshops
  - Session codes for group play
  - Real-time student score visibility
  - Export results to CSV
- [ ] **Arena BYOK** — Bring your own API key to test prompts against real AI
  - Settings page for API key entry (Claude, OpenAI)
  - Key stored in localStorage only
  - Provider abstraction layer
- [ ] **Leaderboard** — Anonymous high scores
- [ ] **Content contribution** — Educator-submitted cases/challenges
- [ ] **Monetization** — Decide: free / freemium / paid

---

## How to Resume Work

1. Read this `plan.md` first
2. Check the remaining work above for what's next
3. Run `npm run build` to verify current state compiles
4. Run `npm run dev` to test locally (serves at localhost:3000/ai-games)
5. Pick the next unchecked item and build it

## Key Technical Decisions
- **Case content is in TypeScript files** (src/data/<game>/*.ts), translations are JSON overlays (src/locales/cases/*.json)
- **Translation system** uses `translateCases()` — loads JSON overlays and merges with English source
- **Hybrid persistence** — localStorage/sessionStorage for client, JSON file API routes for server
- **Each game follows the same pattern:** types→scoring→data(4 difficulty files)→pages(landing+play+results)→components→i18n(5 locales)→landing page registration→icon
- **Abandon tracking** — beforeunload only (no visibilitychange, to avoid false positives from tab switches)
