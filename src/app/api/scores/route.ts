import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const SCORES_FILE = path.join(DATA_DIR, "scores.json");

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
  createdAt: string;
}

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // already exists
  }
}

async function readScores(): Promise<ScoreRecord[]> {
  try {
    const data = await fs.readFile(SCORES_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeScores(scores: ScoreRecord[]) {
  await ensureDataDir();
  await fs.writeFile(SCORES_FILE, JSON.stringify(scores, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const record: ScoreRecord = {
      id: crypto.randomUUID(),
      anonymousId: body.anonymousId || crypto.randomUUID(),
      game: body.game,
      difficulty: body.difficulty,
      score: body.score,
      dimensions: body.dimensions,
      masteryLevel: body.masteryLevel,
      createdAt: new Date().toISOString(),
    };

    const scores = await readScores();
    scores.push(record);
    await writeScores(scores);

    return NextResponse.json({ id: record.id, success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save score" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const scores = await readScores();
    // Return aggregate stats only (no PII)
    const stats = {
      totalSessions: scores.length,
      averageScore: scores.length > 0
        ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
        : 0,
      byGame: Object.fromEntries(
        ["detective", "arena", "turing", "escape"].map((game) => {
          const gameScores = scores.filter((s) => s.game === game);
          return [game, {
            count: gameScores.length,
            averageScore: gameScores.length > 0
              ? Math.round(gameScores.reduce((sum, s) => sum + s.score, 0) / gameScores.length)
              : 0,
          }];
        })
      ),
    };
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ error: "Failed to read scores" }, { status: 500 });
  }
}
