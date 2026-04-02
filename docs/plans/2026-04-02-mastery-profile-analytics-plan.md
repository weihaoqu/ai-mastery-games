# Mastery Profile + Analytics Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enhance the student profile page to show cross-game mastery and skill progression, and enhance the admin dashboard with class-wide skill gap analytics.

**Architecture:** Client-side enhancements only. Profile reads localStorage via existing `getSessions()`. Admin reads server data via existing `GET /api/scores?key=...`. No new API endpoints or data structures.

**Tech Stack:** React, Chart.js (Line chart for progression), Tailwind v4, next-intl, inline CSS for admin page.

---

### Task 1: Expand profile page to all 9 games

**Files:**
- Modify: `src/app/[locale]/profile/page.tsx:23-37` (gameKeys, gameIcons, gameColors)

**Step 1: Update gameKeys, gameIcons, gameColors**

Replace lines 23-37 with:

```tsx
const gameKeys = ["detective", "arena", "turing", "escape", "hunter", "ethics", "tycoon", "pipeline", "tumble"] as const;

const gameIcons: Record<string, string> = {
  detective: "/images/icons/detective.png",
  arena: "/images/icons/arena.png",
  turing: "/images/icons/turing.png",
  escape: "/images/icons/escape.png",
  hunter: "/images/icons/hunter.png",
  ethics: "/images/icons/ethics.png",
  tycoon: "/images/icons/tycoon.png",
  pipeline: "/images/icons/pipeline.png",
  tumble: "/images/icons/tumble.png",
};

const gameColors: Record<string, string> = {
  detective: "text-primary",
  arena: "text-secondary",
  turing: "text-primary",
  escape: "text-tertiary",
  hunter: "text-primary",
  ethics: "text-secondary",
  tycoon: "text-tertiary",
  pipeline: "text-primary",
  tumble: "text-secondary",
};
```

**Step 2: Fix hardcoded `/4` to `/9`**

In the stats overview section (~line 195), change:
```tsx
<p className="text-3xl font-bold text-primary">{gamesPlayed}/4</p>
```
to:
```tsx
<p className="text-3xl font-bold text-primary">{gamesPlayed}/9</p>
```

**Step 3: Change best scores grid from 4-col to responsive**

Change the grid (~line 218) from `grid-cols-2 sm:grid-cols-4` to `grid-cols-3 sm:grid-cols-5` so 9 cards lay out well.

**Step 4: Verify**

Run: `npm run build`
Expected: Compiles with no errors.

**Step 5: Commit**

```bash
git add src/app/\[locale\]/profile/page.tsx
git commit -m "feat(profile): expand to all 9 games"
```

---

### Task 2: Add overall mastery badge to profile

**Files:**
- Modify: `src/app/[locale]/profile/page.tsx` (add mastery badge section)
- Modify: `src/locales/en.json` (add i18n keys)

**Step 1: Add i18n keys to en.json**

In the `"profile"` section, add:

```json
"overallMastery": "Overall Mastery",
"overallScore": "Overall Score"
```

**Step 2: Import getMasteryLevel and getMasteryEmoji**

Add to imports:

```tsx
import { getMasteryLevel, getMasteryEmoji } from "@/lib/detective/scoring";
```

**Step 3: Add overall mastery computation**

After the `avgScore` computation (~line 139), add:

```tsx
const overallMastery = getMasteryLevel(avgScore);
const masteryEmoji = getMasteryEmoji(overallMastery);
```

**Step 4: Add mastery badge UI**

After the header section and before the stats overview grid, add:

```tsx
{/* Overall mastery badge */}
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.05, duration: 0.5 }}
  className="mb-8 flex flex-col items-center gap-2 rounded-2xl border-b-4 border-r-4 border-outline-variant bg-surface-container-lowest p-8"
>
  <span className="text-5xl">{masteryEmoji}</span>
  <p className="font-headline text-2xl font-bold text-on-surface capitalize">
    {tMastery(overallMastery)}
  </p>
  <p className="text-sm text-on-surface-variant">
    {t("overallScore")}: {avgScore}%
  </p>
</motion.div>
```

**Step 5: Verify**

Run: `npm run build`
Expected: Compiles with no errors.

**Step 6: Commit**

```bash
git add src/app/\[locale\]/profile/page.tsx src/locales/en.json
git commit -m "feat(profile): add overall mastery badge"
```

---

### Task 3: Add weakest skill callout to profile

**Files:**
- Modify: `src/app/[locale]/profile/page.tsx` (add callout below radar)
- Modify: `src/locales/en.json` (add i18n keys)

**Step 1: Add i18n keys**

In the `"profile"` section:

```json
"weakestSkill": "Area to Improve",
"tryGame": "Try {game} to strengthen this skill"
```

**Step 2: Add dimension-to-game mapping and weakest skill computation**

After the `radarOptions` useMemo (~line 122), add:

```tsx
const skillGameMap: Record<string, string> = {
  prompting: "arena",
  concepts: "detective",
  tools: "pipeline",
  criticalThinking: "hunter",
  ethics: "ethics",
};

const weakestSkill = useMemo(() => {
  if (sessions.length === 0) return null;
  const dims = avgDimensions;
  const entries = Object.entries(dims) as [keyof typeof dims, number][];
  const sorted = entries.sort((a, b) => a[1] - b[1]);
  const [skill, score] = sorted[0];
  if (score >= 60) return null; // No callout if above 60
  return { skill, score, game: skillGameMap[skill] };
}, [avgDimensions, sessions.length]);
```

**Step 3: Add callout UI**

Right after the radar chart `</motion.div>` (after line ~269), add:

```tsx
{/* Weakest skill callout */}
{weakestSkill && (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.35, duration: 0.4 }}
    className="mb-8 mx-auto max-w-md rounded-xl border-2 border-amber-400/50 bg-amber-50/50 p-5"
  >
    <div className="flex items-center gap-3">
      <span className="material-symbols-outlined text-2xl text-amber-600">trending_down</span>
      <div>
        <p className="font-bold text-on-surface text-sm">
          {t("weakestSkill")}: <span className="capitalize">{tDim(weakestSkill.skill)}</span> ({weakestSkill.score}%)
        </p>
        <p className="text-xs text-on-surface-variant">
          {t("tryGame", { game: tGames(`${weakestSkill.game}.name`) })}
        </p>
      </div>
    </div>
  </motion.div>
)}
```

**Step 4: Verify**

Run: `npm run build`
Expected: Compiles with no errors.

**Step 5: Commit**

```bash
git add src/app/\[locale\]/profile/page.tsx src/locales/en.json
git commit -m "feat(profile): add weakest skill callout with game recommendation"
```

---

### Task 4: Add skill progression line chart to profile

**Files:**
- Modify: `src/app/[locale]/profile/page.tsx` (add Line chart)
- Modify: `src/locales/en.json` (add i18n key)

**Step 1: Add i18n key**

In `"profile"` section:

```json
"skillProgression": "Skill Progression"
```

**Step 2: Register Chart.js Line components**

Update the ChartJS.register call at top of file:

```tsx
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Radar, Line } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, CategoryScale, LinearScale);
```

**Step 3: Add progression data computation**

After the `weakestSkill` useMemo, add:

```tsx
const dimColors: Record<string, string> = {
  prompting: "#006a2d",
  concepts: "#0369a1",
  tools: "#9333ea",
  criticalThinking: "#ca8a04",
  ethics: "#dc2626",
};

const progressionData = useMemo(() => {
  if (sessions.length < 3) return null;
  const sorted = [...sessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const labels = sorted.map((s) => new Date(s.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }));
  const dims = ["prompting", "concepts", "tools", "criticalThinking", "ethics"] as const;
  const datasets = dims.map((dim) => ({
    label: tDim(dim),
    data: sorted.map((s) => s.dimensions[dim]),
    borderColor: dimColors[dim],
    backgroundColor: "transparent",
    borderWidth: 2,
    pointRadius: 3,
    tension: 0.3,
  }));
  return { labels, datasets };
}, [sessions, tDim]);

const progressionOptions = useMemo(() => ({
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    y: { beginAtZero: true, max: 100, ticks: { stepSize: 25 } },
  },
  plugins: {
    legend: { position: "bottom" as const, labels: { boxWidth: 12, padding: 12, font: { size: 11 } } },
  },
}), []);
```

**Step 4: Add progression chart UI**

After the weakest skill callout (or after radar chart if no callout), add:

```tsx
{/* Skill progression */}
{progressionData && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4, duration: 0.5 }}
    className="mb-8 bg-surface-container p-8 rounded-xl border-b-4 border-outline-variant"
  >
    <h3 className="mb-4 text-center font-headline font-bold text-xl text-on-surface-variant">
      {t("skillProgression")}
    </h3>
    <Line data={progressionData} options={progressionOptions} />
  </motion.div>
)}
```

**Step 5: Verify**

Run: `npm run build`
Expected: Compiles with no errors.

**Step 6: Commit**

```bash
git add src/app/\[locale\]/profile/page.tsx src/locales/en.json
git commit -m "feat(profile): add skill progression line chart"
```

---

### Task 5: Add i18n keys to all 4 non-English locales

**Files:**
- Modify: `src/locales/zh.json`
- Modify: `src/locales/es.json`
- Modify: `src/locales/de.json`
- Modify: `src/locales/it.json`

**Step 1: Add the 4 new profile keys to each locale**

Add these keys to the `"profile"` section of each file:

**zh.json:**
```json
"overallMastery": "综合掌握度",
"overallScore": "总分",
"weakestSkill": "待提升领域",
"tryGame": "试试 {game} 来加强这项技能",
"skillProgression": "技能进步曲线"
```

**es.json:**
```json
"overallMastery": "Dominio General",
"overallScore": "Puntuación General",
"weakestSkill": "Área a Mejorar",
"tryGame": "Prueba {game} para fortalecer esta habilidad",
"skillProgression": "Progresión de Habilidades"
```

**de.json:**
```json
"overallMastery": "Gesamtmeisterschaft",
"overallScore": "Gesamtpunktzahl",
"weakestSkill": "Verbesserungsbereich",
"tryGame": "Versuche {game}, um diese Fähigkeit zu stärken",
"skillProgression": "Fähigkeitsentwicklung"
```

**it.json:**
```json
"overallMastery": "Padronanza Complessiva",
"overallScore": "Punteggio Complessivo",
"weakestSkill": "Area da Migliorare",
"tryGame": "Prova {game} per rafforzare questa abilità",
"skillProgression": "Progressione delle Competenze"
```

**Step 2: Verify**

Run: `npm run build`
Expected: Compiles with no errors.

**Step 3: Commit**

```bash
git add src/locales/zh.json src/locales/es.json src/locales/de.json src/locales/it.json
git commit -m "feat(i18n): add profile mastery keys for zh, es, de, it"
```

---

### Task 6: Expand admin game filters to all 9 games

**Files:**
- Modify: `src/app/admin/page.tsx:195-208` (filter dropdowns)
- Modify: `src/app/admin/page.tsx:315-320` (gameColors map)

**Step 1: Update the game filter dropdown**

Replace the game `<select>` options (~line 195-201) with:

```tsx
<select value={filterGame} onChange={(e) => setFilterGame(e.target.value)} style={selectStyle}>
  <option value="all">All Games</option>
  <option value="detective">Detective</option>
  <option value="arena">Arena</option>
  <option value="turing">Turing</option>
  <option value="escape">Escape Room</option>
  <option value="hunter">Hunter</option>
  <option value="ethics">Ethics Quest</option>
  <option value="tycoon">Tycoon</option>
  <option value="pipeline">Pipeline</option>
  <option value="tumble">Tumble</option>
</select>
```

**Step 2: Update the gameColors map**

Replace the `gameColors` map (~line 315-320) with:

```tsx
const gameColors: Record<string, string> = {
  detective: "#dbeafe",
  arena: "#fef3c7",
  turing: "#d1fae5",
  escape: "#fce7f3",
  hunter: "#e0e7ff",
  ethics: "#fef9c3",
  tycoon: "#ede9fe",
  pipeline: "#ccfbf1",
  tumble: "#fce7f3",
};
```

**Step 3: Verify**

Run: `npm run build`
Expected: Compiles with no errors.

**Step 4: Commit**

```bash
git add src/app/admin/page.tsx
git commit -m "feat(admin): expand game filters to all 9 games"
```

---

### Task 7: Add class skill gaps section to admin

**Files:**
- Modify: `src/app/admin/page.tsx` (add SkillGaps component + section)

**Step 1: Add SkillGaps component**

After the `StatCard` component (~line 310), add:

```tsx
function SkillGaps({ records }: { records: ScoreRecord[] }) {
  if (records.length === 0) return null;

  const dims = ["prompting", "concepts", "tools", "criticalThinking", "ethics"] as const;
  const avgs = dims.map((dim) => {
    const sum = records.reduce((s, r) => s + (r.dimensions[dim] || 0), 0);
    return { dim, avg: Math.round(sum / records.length) };
  }).sort((a, b) => a.avg - b.avg);

  const barColor = (v: number) => v < 40 ? "#dc2626" : v < 60 ? "#ca8a04" : "#16a34a";
  const dimLabels: Record<string, string> = {
    prompting: "Prompting", concepts: "Concepts", tools: "Tools",
    criticalThinking: "Critical Thinking", ethics: "Ethics",
  };

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1e3a12", marginBottom: "0.75rem" }}>Class Skill Gaps</h2>
      <div style={{ background: "white", borderRadius: "8px", padding: "1rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        {avgs.map(({ dim, avg }) => (
          <div key={dim} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <span style={{ width: "120px", fontSize: "0.8rem", fontWeight: 600, color: "#333", textAlign: "right" }}>
              {dimLabels[dim]}
            </span>
            <div style={{ flex: 1, background: "#f0f0f0", borderRadius: "4px", height: "24px", position: "relative" }}>
              <div style={{ width: `${avg}%`, background: barColor(avg), borderRadius: "4px", height: "100%", transition: "width 0.5s ease" }} />
            </div>
            <span style={{ width: "40px", fontSize: "0.875rem", fontWeight: 700, color: barColor(avg) }}>{avg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Add SkillGaps to the admin page**

In the `AdminPage` return, after the engagement stats section and before the filters, add:

```tsx
<SkillGaps records={filtered} />
```

**Step 3: Verify**

Run: `npm run build`
Expected: Compiles with no errors.

**Step 4: Commit**

```bash
git add src/app/admin/page.tsx
git commit -m "feat(admin): add class skill gaps section"
```

---

### Task 8: Add score distribution histogram to admin

**Files:**
- Modify: `src/app/admin/page.tsx` (add ScoreDistribution component)

**Step 1: Add ScoreDistribution component**

After the `SkillGaps` component, add:

```tsx
function ScoreDistribution({ records }: { records: ScoreRecord[] }) {
  if (records.length === 0) return null;

  const buckets = Array(10).fill(0);
  for (const r of records) {
    const idx = Math.min(9, Math.floor(r.score / 10));
    buckets[idx]++;
  }
  const maxCount = Math.max(...buckets, 1);
  const labels = ["0-9", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70-79", "80-89", "90-100"];

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1e3a12", marginBottom: "0.75rem" }}>Score Distribution</h2>
      <div style={{ background: "white", borderRadius: "8px", padding: "1rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "120px" }}>
          {buckets.map((count, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
              {count > 0 && (
                <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "#666", marginBottom: "2px" }}>{count}</span>
              )}
              <div style={{
                width: "100%",
                height: `${(count / maxCount) * 100}%`,
                minHeight: count > 0 ? "4px" : "0",
                background: i < 4 ? "#dc2626" : i < 6 ? "#ca8a04" : "#16a34a",
                borderRadius: "3px 3px 0 0",
              }} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
          {labels.map((label) => (
            <div key={label} style={{ flex: 1, textAlign: "center", fontSize: "0.6rem", color: "#888" }}>{label}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Add ScoreDistribution to admin page**

After the `<SkillGaps records={filtered} />` line, add:

```tsx
<ScoreDistribution records={filtered} />
```

**Step 3: Verify**

Run: `npm run build`
Expected: Compiles with no errors.

**Step 4: Commit**

```bash
git add src/app/admin/page.tsx
git commit -m "feat(admin): add score distribution histogram"
```

---

### Task 9: Add per-game average scores to admin

**Files:**
- Modify: `src/app/admin/page.tsx` (add GameAvgScores component)

**Step 1: Add GameAvgScores component**

After `ScoreDistribution`, add:

```tsx
function GameAvgScores({ records }: { records: ScoreRecord[] }) {
  if (records.length === 0) return null;

  const gameNames: Record<string, string> = {
    detective: "Detective", arena: "Arena", turing: "Turing", escape: "Escape",
    hunter: "Hunter", ethics: "Ethics", tycoon: "Tycoon", pipeline: "Pipeline", tumble: "Tumble",
  };

  const byGame: Record<string, number[]> = {};
  for (const r of records) {
    if (!byGame[r.game]) byGame[r.game] = [];
    byGame[r.game].push(r.score);
  }

  const avgs = Object.entries(byGame)
    .map(([game, scores]) => ({ game, avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length), count: scores.length }))
    .sort((a, b) => a.avg - b.avg);

  const barColor = (v: number) => v < 40 ? "#dc2626" : v < 60 ? "#ca8a04" : "#16a34a";

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1e3a12", marginBottom: "0.75rem" }}>Avg Score by Game</h2>
      <div style={{ background: "white", borderRadius: "8px", padding: "1rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        {avgs.map(({ game, avg, count }) => (
          <div key={game} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <span style={{ width: "80px", fontSize: "0.8rem", fontWeight: 600, color: "#333", textAlign: "right", textTransform: "capitalize" }}>
              {gameNames[game] || game}
            </span>
            <div style={{ flex: 1, background: "#f0f0f0", borderRadius: "4px", height: "20px", position: "relative" }}>
              <div style={{ width: `${avg}%`, background: barColor(avg), borderRadius: "4px", height: "100%", transition: "width 0.5s ease" }} />
            </div>
            <span style={{ width: "60px", fontSize: "0.8rem", fontWeight: 600, color: "#666" }}>{avg} ({count})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Add GameAvgScores to admin page**

After `<ScoreDistribution records={filtered} />`, add:

```tsx
<GameAvgScores records={filtered} />
```

**Step 3: Verify**

Run: `npm run build`
Expected: Compiles with no errors.

**Step 4: Commit**

```bash
git add src/app/admin/page.tsx
git commit -m "feat(admin): add per-game average score bars"
```

---

### Task 10: Final build + manual test

**Step 1: Full build**

Run: `npm run build`
Expected: Compiles with 0 errors.

**Step 2: Start dev server**

Run: `npm run dev`

**Step 3: Test profile page**

Navigate to `http://localhost:3000/ai-games/en/profile`:
- Verify all 9 games appear in best scores grid
- Verify overall mastery badge shows at top
- Verify radar chart displays
- Verify weakest skill callout appears (if applicable)
- Verify progression chart appears (if 3+ sessions)

**Step 4: Test admin page**

Navigate to `http://localhost:3000/ai-games/admin`:
- Login with admin key
- Verify all 9 games in filter dropdown
- Verify Class Skill Gaps bars appear (sorted weakest first, color coded)
- Verify Score Distribution histogram renders
- Verify Avg Score by Game bars appear

**Step 5: Commit any fixes, then final commit**

```bash
git add -A
git commit -m "feat: unified mastery profile + admin analytics dashboard"
```
