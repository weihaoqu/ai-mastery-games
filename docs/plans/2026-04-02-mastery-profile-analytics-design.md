# Mastery Profile + Analytics Dashboard — Design

> Approved 2026-04-02. Approach A: enhance existing `/profile` and `/admin` pages.

## Summary

Two enhancements to existing pages:
1. **Student profile** (`/[locale]/profile`) — expand to 9 games, add overall mastery badge, weakest skill callout, skill progression chart
2. **Admin analytics** (`/admin`) — expand to 9 games, add class skill gaps bars, score distribution histogram, per-game avg scores

No new pages, no new API endpoints, no auth changes.

## Decisions

- **Audience:** Students see their own profile (localStorage). Instructor sees aggregate analytics (admin key).
- **Identity:** Nickname only (localStorage). No class codes, no auth.
- **Analytics location:** Behind existing admin key gate at `/admin`.
- **Skill focus:** The 5 dimensions (prompting, concepts, tools, criticalThinking, ethics) are the primary analytics lens — skill gaps drive teaching decisions.

---

## Section 1: Student Profile Enhancements

**File:** `src/app/[locale]/profile/page.tsx`

### 1.1 Expand to all 9 games

Update `gameKeys` to include all 9: detective, arena, turing, escape, hunter, ethics, tycoon, pipeline, tumble. Update `gameIcons` and `gameColors` maps. Change hardcoded `/4` to `/9`.

### 1.2 Overall mastery level

Compute cross-game mastery from average score across all sessions. Display as a prominent badge at top of page: mastery emoji + level name + overall score percentage.

Use existing `getMasteryLevel()` from `src/lib/detective/scoring.ts` (thresholds: novice <21, apprentice <41, practitioner <61, expert <81, master >=81).

### 1.3 Weakest skill callout

Below the radar chart, identify the lowest-scoring dimension from `avgDimensions`. Display:
- Dimension name + score
- Recommended game to improve that skill

Dimension-to-game mapping:
- prompting → Prompt Arena
- concepts → AI Detective
- tools → Pipeline Defense
- criticalThinking → Hallucination Hunter
- ethics → AI Ethics Quest

Only show if sessions exist and the weakest dimension is below 60.

### 1.4 Skill progression chart

Line chart (Chart.js) showing each dimension score over time (x-axis: session dates, y-axis: 0-100, 5 lines color-coded by dimension).

Only render if 3+ sessions exist. Use sessions sorted chronologically.

---

## Section 2: Admin Analytics Enhancements

**File:** `src/app/admin/page.tsx`

### 2.1 Expand game filters

Add all 9 games to the filter dropdown (currently only has detective, arena, turing, escape).

### 2.2 Class skill gaps section

New section above the records table. For all filtered records, compute average of each dimension.

Display as 5 horizontal bars (one per dimension):
- Sorted weakest-first
- Color: red (<40), yellow (40-60), green (>60)
- Bar width proportional to score (0-100)
- Label shows dimension name + avg score

Header: "Class Skill Gaps"

### 2.3 Score distribution histogram

Bar chart showing count of sessions in each 10-point bucket (0-10, 11-20, ..., 91-100). 10 bars, inline CSS (no Chart.js dependency in admin page). Helps identify if scores cluster low/high.

### 2.4 Per-game average score

Row of mini horizontal bars below existing stat cards. One bar per game showing avg score. Sorted lowest-first so weakest games are visible first.

---

## Data Flow

```
Student plays game
  → saveSession() writes to localStorage + POST /api/scores
  → /profile reads localStorage → shows personal mastery + progression
  → /admin reads GET /api/scores?key=... → shows aggregate skill gaps
```

No new API endpoints. No new data structures. All computation is client-side from existing data.

## Files to Modify

1. `src/app/[locale]/profile/page.tsx` — sections 1.1-1.4
2. `src/app/admin/page.tsx` — sections 2.1-2.4
3. `src/locales/{en,zh,es,de,it}.json` — new i18n keys for profile additions
