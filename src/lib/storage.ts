import { SessionResult } from './types';
import { basePath } from './basePath';

const STORAGE_KEY = 'ai-mastery-games';

interface StorageData {
  playerId: string;
  sessions: SessionResult[];
  settings: {
    language: string;
    difficulty: string;
  };
}

function getStorageData(): StorageData {
  if (typeof window === 'undefined') return createDefault();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return createDefault();
  try {
    return JSON.parse(raw);
  } catch {
    return createDefault();
  }
}

function createDefault(): StorageData {
  return {
    playerId: generateId(),
    sessions: [],
    settings: { language: 'en', difficulty: 'beginner' },
  };
}

function saveStorageData(data: StorageData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export function saveSession(session: SessionResult): void {
  const data = getStorageData();
  data.sessions.push(session);
  saveStorageData(data);

  // Also submit to server API (best effort, fire-and-forget)
  try {
    fetch(`${basePath}/api/scores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        anonymousId: data.playerId,
        game: session.game,
        difficulty: session.difficulty,
        score: session.overallScore,
        dimensions: session.dimensions,
        masteryLevel: session.masteryLevel,
        cases: session.cases.map((c) => ({
          caseId: c.caseId,
          caseTitle: c.caseTitle,
          caseType: c.caseType,
          isCorrect: c.isCorrect,
          score: c.score,
          timeSpent: c.timeSpent,
        })),
      }),
    });
  } catch {
    // server save failed silently
  }
}

export function getSessions(): SessionResult[] {
  return getStorageData().sessions;
}

export function getSettings(): StorageData['settings'] {
  return getStorageData().settings;
}

export function updateSettings(settings: Partial<StorageData['settings']>): void {
  const data = getStorageData();
  data.settings = { ...data.settings, ...settings };
  saveStorageData(data);
}
