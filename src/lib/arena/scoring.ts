import type {
  CritiqueRound,
  BattleRound,
  OptimizeChallenge,
  ArenaAnswer,
  ArenaMode,
  MasteryLevel,
  SessionResult,
  Difficulty,
} from '../types';

const MULTIPLIERS = [1, 1.5, 2, 2.5, 3];

/**
 * Score a Critique round using pairwise comparison.
 * Full marks for a perfect ranking, partial credit for each correct pair ordering.
 */
export function scoreCritiqueRound(
  round: CritiqueRound,
  playerRanking: string[],
  streak: number,
  timeSpent: number
): ArenaAnswer {
  const correctOrder = [...round.prompts]
    .sort((a, b) => a.rank - b.rank)
    .map((p) => p.text);

  // Count correct pairwise orderings
  let correctPairs = 0;
  let totalPairs = 0;

  for (let i = 0; i < playerRanking.length; i++) {
    for (let j = i + 1; j < playerRanking.length; j++) {
      totalPairs++;
      const playerI = correctOrder.indexOf(playerRanking[i]);
      const playerJ = correctOrder.indexOf(playerRanking[j]);
      if (playerI < playerJ) {
        correctPairs++;
      }
    }
  }

  const ratio = totalPairs > 0 ? correctPairs / totalPairs : 0;
  const isPerfect = ratio === 1;
  const isCorrect = isPerfect;
  const newStreak = isCorrect ? streak + 1 : 0;
  const multiplier = isCorrect ? MULTIPLIERS[Math.min(streak, 4)] : 1;
  const basePoints = Math.round(ratio * 10);
  const score = Math.round(basePoints * multiplier);

  return {
    roundId: round.id,
    mode: 'critique',
    isCorrect,
    score,
    streak: newStreak,
    multiplier,
    timeSpent,
  };
}

/**
 * Score a Battle round — simple correct/incorrect pick.
 */
export function scoreBattleRound(
  round: BattleRound,
  playerPick: 'A' | 'B',
  streak: number,
  timeSpent: number
): ArenaAnswer {
  const isCorrect = playerPick === round.winner;
  const newStreak = isCorrect ? streak + 1 : 0;
  const multiplier = isCorrect ? MULTIPLIERS[Math.min(streak, 4)] : 1;
  const basePoints = isCorrect ? 10 : 0;
  const score = Math.round(basePoints * multiplier);

  return {
    roundId: round.id,
    mode: 'battle',
    isCorrect,
    score,
    streak: newStreak,
    multiplier,
    timeSpent,
  };
}

/**
 * Score an Optimize challenge — points per correct step + bonus for all correct.
 */
export function scoreOptimizeChallenge(
  challenge: OptimizeChallenge,
  correctSteps: boolean[],
  streak: number,
  timeSpent: number
): ArenaAnswer {
  const totalSteps = challenge.steps.length;
  const numCorrect = correctSteps.filter(Boolean).length;
  const allCorrect = numCorrect === totalSteps;

  const isCorrect = allCorrect;
  const newStreak = isCorrect ? streak + 1 : 0;
  const multiplier = isCorrect ? MULTIPLIERS[Math.min(streak, 4)] : 1;

  // Points per step (scaled so max base is 10) + 2-point bonus for perfect
  const perStepPoints = totalSteps > 0 ? 10 / totalSteps : 0;
  const basePoints = Math.round(numCorrect * perStepPoints) + (allCorrect ? 2 : 0);
  const score = Math.round(basePoints * multiplier);

  return {
    roundId: challenge.id,
    mode: 'optimize',
    isCorrect,
    score,
    streak: newStreak,
    multiplier,
    timeSpent,
  };
}

/**
 * Calculate overall session result for an Arena session.
 * Uses the same dimension-weighting pattern as Turing.
 */
export function calculateArenaSessionResult(
  answers: ArenaAnswer[],
  items: Array<{ id: string; skills: Record<string, number> }>,
  difficulty: Difficulty,
  mode: ArenaMode
): Omit<SessionResult, 'id' | 'date'> {
  const rawTotal = answers.reduce((sum, a) => sum + a.score, 0);
  const maxPossible = 300; // ~10 rounds × 10pts × 3x max multiplier
  const overallScore = Math.min(100, Math.round((rawTotal / maxPossible) * 100));

  const dimensions = { prompting: 0, concepts: 0, tools: 0, criticalThinking: 0, ethics: 0 };
  const weights = { prompting: 0, concepts: 0, tools: 0, criticalThinking: 0, ethics: 0 };

  answers.forEach((answer) => {
    const item = items.find((i) => i.id === answer.roundId);
    if (!item) return;
    const normalizedScore = answer.isCorrect ? 100 : 0;
    for (const dim of Object.keys(dimensions) as (keyof typeof dimensions)[]) {
      const w = item.skills[dim] ?? 0;
      dimensions[dim] += normalizedScore * w;
      weights[dim] += w;
    }
  });

  for (const dim of Object.keys(dimensions) as (keyof typeof dimensions)[]) {
    dimensions[dim] = weights[dim] > 0 ? Math.round(dimensions[dim] / weights[dim]) : 0;
  }

  return {
    game: 'arena',
    difficulty,
    cases: answers.map((a) => ({
      caseId: a.roundId,
      caseTitle: `${mode} round`,
      caseType: 'ethics' as import('../types').CaseType,
      selectedOptionId: a.isCorrect ? 'correct' : 'incorrect',
      reasoning: '',
      timeSpent: a.timeSpent,
      isCorrect: a.isCorrect,
      score: a.score,
    })),
    overallScore,
    dimensions,
    masteryLevel: getArenaMasteryLevel(overallScore),
  };
}

/**
 * Determine mastery level from overall score.
 * Same thresholds as Turing: 81/61/41/21.
 */
export function getArenaMasteryLevel(score: number): MasteryLevel {
  if (score >= 81) return 'master';
  if (score >= 61) return 'expert';
  if (score >= 41) return 'practitioner';
  if (score >= 21) return 'apprentice';
  return 'novice';
}
