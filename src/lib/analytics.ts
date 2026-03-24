import { basePath } from './basePath';

const STORAGE_KEY = 'ai-mastery-games';
const QUEUE_KEY = 'ai-mastery-events-queue';
const FLUSH_INTERVAL = 10_000; // 10 seconds
const MAX_QUEUE = 50;

export type EventType =
  | 'page_view'
  | 'game_start'
  | 'game_complete'
  | 'game_abandon'
  | 'difficulty_select'
  | 'hint_used'
  | 'case_answer'
  | 'certificate_download';

interface AnalyticsEvent {
  event: EventType;
  timestamp: string;
  anonymousId: string;
  sessionId: string;
  page: string;
  referrer: string;
  props?: Record<string, string | number | boolean>;
  device: {
    viewport: string;
    screen: string;
    mobile: boolean;
    language: string;
    userAgent: string;
  };
}

let sessionId: string | null = null;
let anonymousId: string | null = null;
let queue: AnalyticsEvent[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;

function getAnonymousId(): string {
  if (anonymousId) return anonymousId;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data.playerId) {
        anonymousId = data.playerId;
        return anonymousId!;
      }
    }
  } catch { /* ignore */ }
  anonymousId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  return anonymousId;
}

function getSessionId(): string {
  if (sessionId) return sessionId;
  try {
    const existing = sessionStorage.getItem('ai-mastery-session-id');
    if (existing) {
      sessionId = existing;
      return sessionId;
    }
  } catch { /* ignore */ }
  sessionId = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  try { sessionStorage.setItem('ai-mastery-session-id', sessionId); } catch { /* ignore */ }
  return sessionId;
}

function getDevice() {
  return {
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    screen: `${screen.width}x${screen.height}`,
    mobile: window.innerWidth < 768,
    language: navigator.language,
    userAgent: navigator.userAgent,
  };
}

/** Track an analytics event */
export function track(event: EventType, props?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined') return;

  const evt: AnalyticsEvent = {
    event,
    timestamp: new Date().toISOString(),
    anonymousId: getAnonymousId(),
    sessionId: getSessionId(),
    page: window.location.pathname,
    referrer: document.referrer,
    props,
    device: getDevice(),
  };

  queue.push(evt);

  // Flush immediately if queue is full
  if (queue.length >= MAX_QUEUE) {
    flush();
  }
}

/** Flush queued events to server */
async function flush() {
  if (queue.length === 0) return;

  const batch = queue.splice(0);

  try {
    const res = await fetch(`${basePath}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: batch }),
      keepalive: true, // survive page unload
    });
    if (!res.ok) {
      // Put events back in queue for retry
      queue.unshift(...batch);
    }
  } catch {
    // Put events back in queue for retry
    queue.unshift(...batch);
    // Also persist to localStorage as backup
    try {
      const existing = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
      localStorage.setItem(QUEUE_KEY, JSON.stringify([...existing, ...batch].slice(-200)));
    } catch { /* ignore */ }
  }
}

/** Start the analytics flush loop */
export function initAnalytics() {
  if (typeof window === 'undefined') return;
  if (flushTimer) return; // already initialized

  // Restore any persisted events from a failed previous session
  try {
    const persisted = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    if (persisted.length > 0) {
      queue.push(...persisted);
      localStorage.removeItem(QUEUE_KEY);
    }
  } catch { /* ignore */ }

  // Periodic flush
  flushTimer = setInterval(flush, FLUSH_INTERVAL);

  // Flush on page hide (tab close, navigation)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flush();
    }
  });

  // Flush on beforeunload as backup
  window.addEventListener('beforeunload', () => {
    flush();
  });
}

/** Track a page view (called by Analytics component on route change) */
export function trackPageView(path: string) {
  track('page_view', { path });
}

/** Track game start */
export function trackGameStart(game: string, difficulty: string) {
  track('game_start', { game, difficulty });
}

/** Track game completion */
export function trackGameComplete(game: string, difficulty: string, score: number, masteryLevel: string) {
  track('game_complete', { game, difficulty, score, masteryLevel });
}

/** Track game abandonment (user left mid-game) */
export function trackGameAbandon(game: string, difficulty: string, progress: number) {
  track('game_abandon', { game, difficulty, progress });
}

/** Track hint usage */
export function trackHintUsed(game: string, puzzleId: string) {
  track('hint_used', { game, puzzleId });
}

/** Track individual case/question answer */
export function trackCaseAnswer(game: string, caseId: string, isCorrect: boolean, timeSpent: number) {
  track('case_answer', { game, caseId, correct: isCorrect, timeSpent });
}
