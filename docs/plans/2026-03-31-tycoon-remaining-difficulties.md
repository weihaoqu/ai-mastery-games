# Tycoon Remaining Difficulties — Image Gen + Humor Rewrite

> **For Claude:** Generate pixel art illustrations and rewrite choices for intermediate, advanced, and expert difficulty levels.

**Quick start:** Paste this file's content as a prompt to Claude Code in the `ai-mastery-games` directory.

## Per Difficulty (repeat for intermediate, advanced, expert):

### 1. Read scenarios
```bash
cat src/data/tycoon/{difficulty}.ts
```

### 2. Generate 8 pixel art illustrations

Create `public/images/tycoon/batch-{difficulty}.json` with 8 tasks, one per quarter. Use this template per task:

```json
{
  "id": "q{N}",
  "prompt": "Isometric pixel art of [SCENE DESCRIPTION matching the scenario]. 16-bit retro SimCity style, warm vibrant colors, clean pixel grid. Corporate tech startup theme. No text.",
  "image": "{difficulty}-q{N}-{slug}.png",
  "provider": "google",
  "ar": "16:9",
  "quality": "2k"
}
```

Run:
```bash
bun /Users/oreo/.claude/plugins/cache/baoyu-skills/utility-skills/603cabaef497/skills/baoyu-image-gen/scripts/main.ts --batchfile public/images/tycoon/batch-{difficulty}.json
```

### 3. Update scenario data file

For each scenario in `src/data/tycoon/{difficulty}.ts`:
- Add `imagePath: '/images/tycoon/{difficulty}-q{N}-{slug}.png'`
- Rewrite all 3 decision `text` fields with dry corporate humor (sardonic, parenthetical narrator asides, recognizable Silicon Valley tropes)
- Keep `outcome`, `impact`, `reasoning`, and `skills` unchanged

### 4. Commit
```bash
git add public/images/tycoon/{difficulty}-q*.png src/data/tycoon/{difficulty}.ts
git commit -m "feat: add pixel art illustrations and humor to {difficulty} tycoon scenarios"
```

### 5. Clean up batch file
```bash
rm public/images/tycoon/batch-{difficulty}.json
```

## After all 3 difficulties:

Verify:
```bash
cd /Users/oreo/Dropbox/aiteaching/ai-mastery-games
npx next dev --port 3000
# Test each: http://localhost:3000/ai-games/en/tycoon/play?difficulty=intermediate
# Test each: http://localhost:3000/ai-games/en/tycoon/play?difficulty=advanced
# Test each: http://localhost:3000/ai-games/en/tycoon/play?difficulty=expert
```

**Do NOT push to remote** — Q will test locally first.
