# AI or Human? — Game Design (Phase 2)

## Overview
A modern Turing test game. Players see content (text, code, or image placeholders) and swipe/tap to guess whether it was AI-generated or human-created. After each guess, an educational reveal highlights telltale markers. Card-swipe UI with streak-based scoring.

## Content Types
1. **Emails** — professional and casual
2. **Essays/articles** — blog posts, opinion pieces
3. **Code** — Python, JavaScript functions
4. **Social media** — tweets, reviews
5. **Creative writing** — short fiction, poetry
6. **Images** — placeholder descriptions for now, real images added later

## Content Sourcing
Hand-crafted items based on real AI/human patterns. Not copied from specific sources, but designed to reflect realistic tells at each difficulty level.

## Data Model

```typescript
type ContentType = 'email' | 'essay' | 'code' | 'social-media' | 'creative-writing' | 'image';

interface TuringItem {
  id: string;                    // e.g. "beg-email-01"
  contentType: ContentType;
  difficulty: Difficulty;
  title: string;                 // short label shown after reveal
  content: string;               // the actual text/code to judge
  isAI: boolean;                 // ground truth
  aiModel?: string;              // "GPT-4", "Claude", "Midjourney" (shown in reveal)
  humanSource?: string;          // "Professional copywriter" (shown in reveal)
  markers: TuringMarker[];       // 3-5 educational highlights
  explanation: string;           // 1-2 sentence overall explanation
  imagePath?: string;            // for image type: /turing/beg-img-01.jpg
  imageDescription?: string;     // placeholder text when image not yet available
  skills: {
    prompting: number;
    concepts: number;
    tools: number;
    criticalThinking: number;
    ethics: number;
  };
}

interface TuringMarker {
  text: string;        // phrase/snippet to highlight
  explanation: string; // why this is a telltale sign
  type: 'ai-tell' | 'human-tell';
}
```

## Content Volume
- 12 items per tier × 4 tiers = 48 items total
- 10 randomly selected per session
- Mix of all 6 content types per tier (2 per category)

## Difficulty Tiers
- **Beginner:** Obvious AI artifacts (repetitive phrasing, generic content, perfect formatting)
- **Intermediate:** Better AI vs amateur human writing
- **Advanced:** Polished AI vs professional human writing
- **Expert:** Adversarially crafted to fool experts

## UI: Card Swipe
- Content displayed on a swipable card
- Swipe left = Human (magenta), swipe right = AI (cyan)
- Desktop fallback: two buttons + keyboard shortcuts (← →)
- Swipe animation with color feedback glow
- After swipe: card transitions to educational reveal
- Progress dots at top (1-10)
- Streak counter visible during gameplay

## Game Flow
```
Hub → /turing (difficulty select) → /turing/play → /turing/results
```

1. **Difficulty selection** — 4-tier cards (same pattern as Detective)
2. **Gameplay** (10 rounds):
   - Content card with type badge in corner
   - Player swipes or taps AI/Human
   - Reveal: correct/wrong banner, explanation, 3-5 highlighted markers
   - Streak multiplier display (1x → 3x)
   - "Next" to continue
3. **Results** — radar chart, mastery badge, accuracy %, best streak

## Scoring
- Base: 10pts per correct answer
- Streak multiplier: 1x → 1.5x → 2x → 2.5x → 3x (caps at 5+ streak)
- Wrong answer resets streak to 1x
- Raw max: 10 × 10 × 3 = 300 → normalized to 0-100
- Dimension weights vary by content type

## Educational Reveal
After each guess, show:
- Correct/incorrect banner
- 3-5 highlighted markers in the content, color-coded:
  - Cyan highlight = AI tell
  - Magenta highlight = human tell
- Each marker has a tooltip explanation
- Overall 1-2 sentence explanation
- Source attribution (AI model or human source type)

## Reused Components
- Header, GameCard, ScoreRadar, MasteryBadge, CertificateModal
- Scoring engine pattern (adapted for streak multiplier)
- Storage/API integration (same as Detective)
- i18n pattern (same locale structure)

## i18n
- UI strings in all 5 languages from the start
- Content items in English first, translations follow same overlay pattern as Detective cases
