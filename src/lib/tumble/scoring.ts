import type { TokenPuzzle, TokenAnswer, MasteryLevel, SessionResult, Difficulty, PlayerAnswer } from '../types';

const STREAK_MULTIPLIERS = [1, 1, 1.5, 2, 2.5, 3];

export function scoreTokenArrangement(
  puzzle: TokenPuzzle,
  playerOrder: number[],
  currentStreak: number,
  timeSpent: number
): TokenAnswer {
  const isCorrect = puzzle.correctOrder.every((v, i) => v === playerOrder[i]);

  // Partial credit: count how many tokens are in the correct position
  let correctCount = 0;
  for (let i = 0; i < puzzle.correctOrder.length; i++) {
    if (puzzle.correctOrder[i] === playerOrder[i]) correctCount++;
  }
  const accuracy = correctCount / puzzle.correctOrder.length;

  const newStreak = isCorrect ? currentStreak + 1 : 0;
  const multiplier = STREAK_MULTIPLIERS[Math.min(currentStreak, STREAK_MULTIPLIERS.length - 1)];

  let baseScore: number;
  if (isCorrect) {
    baseScore = 80;
  } else {
    baseScore = Math.round(accuracy * 50); // partial credit 0-50
  }

  // Time bonus
  let timeBonus = 0;
  if (timeSpent <= 5) timeBonus = 20;
  else if (timeSpent <= 10) timeBonus = 15;
  else if (timeSpent <= 15) timeBonus = 10;
  else if (timeSpent <= 20) timeBonus = 5;

  const score = Math.min(100, Math.round((baseScore + timeBonus) * multiplier));

  return {
    puzzleId: puzzle.id,
    playerOrder,
    isCorrect,
    score,
    timeSpent,
    streak: newStreak,
  };
}

export function calculateTumbleSessionResult(
  answers: TokenAnswer[],
  puzzles: TokenPuzzle[],
  difficulty: Difficulty
): Omit<SessionResult, 'id' | 'date'> {
  const totalScore = answers.reduce((sum, a) => sum + a.score, 0);
  const maxPossible = answers.length * 100;

  const rawScore = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;
  const overallScore = Math.min(100, Math.max(0, rawScore));

  const dimensions = { prompting: 0, concepts: 0, tools: 0, criticalThinking: 0, ethics: 0 };
  const weights = { prompting: 0, concepts: 0, tools: 0, criticalThinking: 0, ethics: 0 };

  answers.forEach((answer) => {
    const puzzle = puzzles.find(p => p.id === answer.puzzleId);
    if (!puzzle) return;
    const norm = Math.min(100, answer.score);
    for (const dim of Object.keys(dimensions) as (keyof typeof dimensions)[]) {
      dimensions[dim] += norm * puzzle.skills[dim];
      weights[dim] += puzzle.skills[dim];
    }
  });

  for (const dim of Object.keys(dimensions) as (keyof typeof dimensions)[]) {
    dimensions[dim] = weights[dim] > 0 ? Math.round(dimensions[dim] / weights[dim]) : 0;
  }

  const cases: PlayerAnswer[] = answers.map((a) => {
    const puzzle = puzzles.find(p => p.id === a.puzzleId);
    return {
      caseId: a.puzzleId,
      caseTitle: puzzle?.title ?? a.puzzleId,
      caseType: 'ethics' as const,
      selectedOptionId: a.playerOrder.join(','),
      reasoning: '',
      timeSpent: a.timeSpent,
      isCorrect: a.isCorrect,
      score: Math.min(100, a.score),
    };
  });

  return {
    game: 'tumble',
    difficulty,
    cases,
    overallScore,
    dimensions,
    masteryLevel: getMasteryLevel(overallScore),
  };
}

export function getMasteryLevel(score: number): MasteryLevel {
  if (score >= 81) return 'master';
  if (score >= 61) return 'expert';
  if (score >= 41) return 'practitioner';
  if (score >= 21) return 'apprentice';
  return 'novice';
}

export function getMasteryEmoji(level: MasteryLevel): string {
  const emojis: Record<MasteryLevel, string> = {
    novice: '\u{1F331}', apprentice: '\u{1F527}', practitioner: '\u26A1', expert: '\u{1F525}', master: '\u{1F451}'
  };
  return emojis[level];
}
