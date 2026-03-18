import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const SCORES_FILE = path.join(DATA_DIR, "scores.jsonl");

// Simple admin key — set via env var or default
const ADMIN_KEY = process.env.ADMIN_KEY || "aimasterygames2026";

interface CaseRecord {
  caseId: string;
  caseTitle: string;
  caseType: string;
  isCorrect: boolean;
  score: number;
  timeSpent: number;
}

interface ScoreRecord {
  id: string;
  anonymousId: string;
  game: string;
  difficulty: string;
  score: number;
  dimensions: {
    prompting: number;
    concepts: number;
    tools: number;
    criticalThinking: number;
    ethics: number;
  };
  masteryLevel: string;
  cases: CaseRecord[];
  analysis: string;
  createdAt: string;
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

/** Generate a short analysis based on the play data */
function generateAnalysis(record: Omit<ScoreRecord, "id" | "analysis" | "createdAt">): string {
  const { game, difficulty, score, dimensions, masteryLevel, cases } = record;
  const parts: string[] = [];

  // Overall performance
  const level = score >= 80 ? "strong" : score >= 50 ? "moderate" : "weak";
  parts.push(`${level} ${masteryLevel}-level performance on ${game} (${difficulty})`);

  // Per-case summary
  if (cases && cases.length > 0) {
    const correct = cases.filter((c) => c.isCorrect).length;
    parts.push(`${correct}/${cases.length} scenarios correct`);

    // Find what they struggled with
    const wrong = cases.filter((c) => !c.isCorrect);
    if (wrong.length > 0) {
      const wrongTypes = [...new Set(wrong.map((c) => c.caseType).filter(Boolean))];
      if (wrongTypes.length > 0) {
        parts.push(`struggled with: ${wrongTypes.join(", ")}`);
      }
      const wrongTitles = wrong.map((c) => c.caseTitle).filter(Boolean);
      if (wrongTitles.length > 0 && wrongTitles.length <= 3) {
        parts.push(`missed: ${wrongTitles.join("; ")}`);
      }
    }

    // Speed analysis
    const avgTime = Math.round(cases.reduce((s, c) => s + c.timeSpent, 0) / cases.length);
    parts.push(`avg ${avgTime}s per scenario`);
  }

  // Dimension strengths/weaknesses
  const dimEntries = Object.entries(dimensions) as [string, number][];
  const sorted = dimEntries.sort((a, b) => b[1] - a[1]);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  if (strongest[1] > weakest[1] + 20) {
    parts.push(`strongest: ${strongest[0]} (${strongest[1]}), weakest: ${weakest[0]} (${weakest[1]})`);
  }

  return parts.join(". ") + ".";
}

async function readAllRecords(): Promise<ScoreRecord[]> {
  try {
    const data = await fs.readFile(SCORES_FILE, "utf-8");
    return data
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const recordBase = {
      anonymousId: body.anonymousId || crypto.randomUUID(),
      game: body.game,
      difficulty: body.difficulty,
      score: body.score,
      dimensions: body.dimensions || { prompting: 0, concepts: 0, tools: 0, criticalThinking: 0, ethics: 0 },
      masteryLevel: body.masteryLevel,
      cases: body.cases || [],
    };

    const record: ScoreRecord = {
      ...recordBase,
      id: crypto.randomUUID(),
      analysis: generateAnalysis(recordBase),
      createdAt: new Date().toISOString(),
    };

    await ensureDataDir();
    await fs.appendFile(SCORES_FILE, JSON.stringify(record) + "\n");

    return NextResponse.json({ id: record.id, success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save score" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  const format = request.nextUrl.searchParams.get("format"); // "csv" or "json" (default)

  // Public: return aggregate stats only
  if (key !== ADMIN_KEY) {
    try {
      const records = await readAllRecords();
      const stats = {
        totalSessions: records.length,
        averageScore:
          records.length > 0
            ? Math.round(records.reduce((sum, s) => sum + s.score, 0) / records.length)
            : 0,
        byGame: Object.fromEntries(
          ["detective", "arena", "turing", "escape"].map((game) => {
            const g = records.filter((s) => s.game === game);
            return [
              game,
              {
                count: g.length,
                averageScore: g.length > 0 ? Math.round(g.reduce((sum, s) => sum + s.score, 0) / g.length) : 0,
              },
            ];
          })
        ),
      };
      return NextResponse.json(stats);
    } catch {
      return NextResponse.json({ error: "Failed to read scores" }, { status: 500 });
    }
  }

  // Admin: return full data
  try {
    const records = await readAllRecords();

    if (format === "csv") {
      const header = [
        "id", "anonymousId", "game", "difficulty", "score", "masteryLevel",
        "prompting", "concepts", "tools", "criticalThinking", "ethics",
        "casesCorrect", "casesTotal", "analysis", "createdAt",
      ].join(",");

      const rows = records.map((r) => {
        const correct = r.cases ? r.cases.filter((c) => c.isCorrect).length : 0;
        const total = r.cases ? r.cases.length : 0;
        return [
          r.id,
          r.anonymousId,
          r.game,
          r.difficulty,
          r.score,
          r.masteryLevel,
          r.dimensions.prompting,
          r.dimensions.concepts,
          r.dimensions.tools,
          r.dimensions.criticalThinking,
          r.dimensions.ethics,
          correct,
          total,
          `"${(r.analysis || "").replace(/"/g, '""')}"`,
          r.createdAt,
        ].join(",");
      });

      const csv = [header, ...rows].join("\n");
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="ai-games-scores-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    return NextResponse.json({ total: records.length, records });
  } catch {
    return NextResponse.json({ error: "Failed to read scores" }, { status: 500 });
  }
}
