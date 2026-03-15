import type {
  EscapeAnswer,
  EscapeResult,
  EscapeRoom,
  MasteryLevel,
  PuzzleType,
  SessionResult,
} from '../types';

/**
 * Score a single puzzle attempt.
 * Base 15 points per correct puzzle, 0 for incorrect.
 * Hint penalty: -5 if hint was used (minimum 0).
 */
export function scorePuzzle(
  puzzleId: string,
  puzzleType: PuzzleType,
  isCorrect: boolean,
  usedHint: boolean,
  timeSpent: number
): EscapeAnswer {
  let score = isCorrect ? 15 : 0;
  if (usedHint) {
    score = Math.max(0, score - 5);
  }

  return {
    puzzleId,
    puzzleType,
    isCorrect,
    usedHint,
    timeSpent,
    score,
  };
}

/**
 * Calculate the overall session result for an Escape Room session.
 *
 * Scoring breakdown:
 * - Raw score from puzzle answers (up to 5 x 15 = 75)
 * - Time bonus: if escaped, (timeRemaining / timeLimit) x 20
 * - Escape bonus: +20 if escaped
 * - Max possible ~115, normalized to 0-100
 */
export function calculateEscapeSessionResult(
  escapeResult: EscapeResult,
  room: EscapeRoom
): Omit<SessionResult, 'id' | 'date'> {
  const MAX_POSSIBLE = 115;

  // Raw score from puzzle answers
  const rawPuzzleScore = escapeResult.answers.reduce((sum, a) => sum + a.score, 0);

  // Time bonus: if escaped, reward remaining time proportionally (up to 20 points)
  const timeBonus = escapeResult.escaped
    ? (escapeResult.timeRemaining / room.timeLimit) * 20
    : 0;

  // Escape bonus: flat 20 points for escaping
  const escapeBonus = escapeResult.escaped ? 20 : 0;

  const rawTotal = rawPuzzleScore + timeBonus + escapeBonus;
  const overallScore = Math.min(100, Math.round((rawTotal / MAX_POSSIBLE) * 100));

  // Dimension weighting from room.skills (same pattern as other games)
  const dimensions = { prompting: 0, concepts: 0, tools: 0, criticalThinking: 0, ethics: 0 };
  const weights = { prompting: 0, concepts: 0, tools: 0, criticalThinking: 0, ethics: 0 };

  for (const answer of escapeResult.answers) {
    const normalizedScore = answer.isCorrect ? 100 : 0;
    for (const dim of Object.keys(dimensions) as (keyof typeof dimensions)[]) {
      const w = room.skills[dim] ?? 0;
      dimensions[dim] += normalizedScore * w;
      weights[dim] += w;
    }
  }

  for (const dim of Object.keys(dimensions) as (keyof typeof dimensions)[]) {
    dimensions[dim] = weights[dim] > 0 ? Math.round(dimensions[dim] / weights[dim]) : 0;
  }

  return {
    game: 'escape',
    difficulty: room.difficulty,
    cases: escapeResult.answers.map((a) => ({
      caseId: a.puzzleId,
      caseTitle: `${a.puzzleType} puzzle`,
      caseType: 'ethics' as import('../types').CaseType,
      selectedOptionId: a.isCorrect ? 'correct' : 'incorrect',
      reasoning: '',
      timeSpent: a.timeSpent,
      isCorrect: a.isCorrect,
      score: a.score,
    })),
    overallScore,
    dimensions,
    masteryLevel: getEscapeMasteryLevel(overallScore),
  };
}

/**
 * Determine mastery level from overall score.
 * Same thresholds as other games: 81/61/41/21.
 */
export function getEscapeMasteryLevel(score: number): MasteryLevel {
  if (score >= 81) return 'master';
  if (score >= 61) return 'expert';
  if (score >= 41) return 'practitioner';
  if (score >= 21) return 'apprentice';
  return 'novice';
}
