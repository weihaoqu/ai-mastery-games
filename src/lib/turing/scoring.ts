import type { TuringItem, TuringAnswer, MasteryLevel, SessionResult, Difficulty } from '../types';

const MULTIPLIERS = [1, 1.5, 2, 2.5, 3];

export function scoreTuringAnswer(
  item: TuringItem,
  guessedAI: boolean,
  streak: number,
  timeSpent: number
): TuringAnswer {
  const isCorrect = guessedAI === item.isAI;
  const newStreak = isCorrect ? streak + 1 : 0;
  const multiplier = isCorrect ? MULTIPLIERS[Math.min(streak, 4)] : 1;
  const basePoints = isCorrect ? 10 : 0;
  const score = Math.round(basePoints * multiplier);

  return {
    itemId: item.id,
    itemTitle: item.title,
    contentType: item.contentType,
    guessedAI,
    isCorrect,
    score,
    streak: newStreak,
    multiplier,
    timeSpent,
  };
}

export function calculateTuringSessionResult(
  answers: TuringAnswer[],
  items: TuringItem[],
  difficulty: Difficulty
): Omit<SessionResult, 'id' | 'date'> {
  const rawTotal = answers.reduce((sum, a) => sum + a.score, 0);
  // Actual max: items score 10,15,20,25,30,30,30,30,30,30 = 250
  const maxPossible = 250;
  const overallScore = Math.min(100, Math.round((rawTotal / maxPossible) * 100));

  const dimensions = { prompting: 0, concepts: 0, tools: 0, criticalThinking: 0, ethics: 0 };
  const weights = { prompting: 0, concepts: 0, tools: 0, criticalThinking: 0, ethics: 0 };

  answers.forEach((answer) => {
    const item = items.find(i => i.id === answer.itemId);
    if (!item) return;
    const normalizedScore = answer.isCorrect ? 100 : 0;
    for (const dim of Object.keys(dimensions) as (keyof typeof dimensions)[]) {
      dimensions[dim] += normalizedScore * item.skills[dim];
      weights[dim] += item.skills[dim];
    }
  });

  for (const dim of Object.keys(dimensions) as (keyof typeof dimensions)[]) {
    dimensions[dim] = weights[dim] > 0 ? Math.round(dimensions[dim] / weights[dim]) : 0;
  }

  return {
    game: 'turing',
    difficulty,
    cases: answers.map(a => ({
      caseId: a.itemId,
      caseTitle: a.itemTitle,
      caseType: a.contentType as unknown as import('../types').CaseType,
      selectedOptionId: a.guessedAI ? 'ai' : 'human',
      reasoning: '',
      timeSpent: a.timeSpent,
      isCorrect: a.isCorrect,
      score: a.score,
    })),
    overallScore,
    dimensions,
    masteryLevel: getTuringMasteryLevel(overallScore),
  };
}

export function getTuringMasteryLevel(score: number): MasteryLevel {
  if (score >= 81) return 'master';
  if (score >= 61) return 'expert';
  if (score >= 41) return 'practitioner';
  if (score >= 21) return 'apprentice';
  return 'novice';
}

export function getBestStreak(answers: TuringAnswer[]): number {
  let best = 0;
  let current = 0;
  for (const a of answers) {
    if (a.isCorrect) {
      current++;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
  }
  return best;
}

export function getAccuracyByType(answers: TuringAnswer[]): Record<string, { correct: number; total: number }> {
  const result: Record<string, { correct: number; total: number }> = {};
  for (const a of answers) {
    if (!result[a.contentType]) result[a.contentType] = { correct: 0, total: 0 };
    result[a.contentType].total++;
    if (a.isCorrect) result[a.contentType].correct++;
  }
  return result;
}
