# AI Detective Redesign — Design Document

**Style:** Noir pixel art — dark, moody isometric scenes per case
**Layout:** Top hero image above case title, same pattern as Tycoon/Hunter
**Scope:** All 53 cases across 4 difficulties, one unique illustration each

## Layout

```
┌─────────────────────────────────────────────────┐
│  ← Back to Cases        [hallucination] badge   │
├─────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┐    │
│  │  [NOIR PIXEL ART SCENE]                 │    │
│  │  (unique per case)                       │    │
│  └─────────────────────────────────────────┘    │
│                                                   │
│  Case Title                                       │
│  Briefing text...                                 │
│                                                   │
│  📁 EVIDENCE BOARD                                │
│  ├─ Evidence cards (unchanged)                    │
│                                                   │
│  What went wrong?                                 │
│  ○ Options (unchanged)                            │
│                                                   │
│  [Submit Diagnosis]                               │
└─────────────────────────────────────────────────┘
```

## Components

### 1. 53 Noir Pixel Art Scene Illustrations (per case)
Each depicts the location/scenario in dark, moody isometric pixel art with rain, shadows, neon accents.

### 2. Case Type Update
Add optional `imagePath` field to Case interface.

### 3. Play Page Update
Add hero illustration above case title, same pattern as Tycoon.

## Not in Scope
- Evidence card redesign
- Scoring/diagnosis flow changes
- Results page changes
- Case content changes
