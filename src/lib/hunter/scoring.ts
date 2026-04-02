import type { HunterClaim, HunterAnswer, MasteryLevel, SessionResult, Difficulty, PlayerAnswer } from '../types';

const STREAK_MULTIPLIERS = [1, 1, 1.5, 2, 2.5, 3];

export function scoreHunterAction(
  claim: HunterClaim,
  action: 'shot' | 'passed',
  streak: number,
  timeSpent: number
): HunterAnswer {
  const correctAction = claim.isHallucination ? 'shot' : 'passed';
  const isCorrect = action === correctAction;

  const newStreak = isCorrect ? streak + 1 : 0;
  const multiplier = STREAK_MULTIPLIERS[Math.min(newStreak, STREAK_MULTIPLIERS.length - 1)];

  let baseScore = isCorrect ? 100 : 0;

  // Speed bonus: faster reaction = higher score (up to 30 bonus)
  if (isCorrect && timeSpent < 3) baseScore += 30;
  else if (isCorrect && timeSpent < 5) baseScore += 20;
  else if (isCorrect && timeSpent < 8) baseScore += 10;

  const score = Math.min(130, Math.round(baseScore * multiplier));

  return {
    claimId: claim.id,
    playerAction: action,
    isCorrect,
    score,
    streak: newStreak,
    multiplier,
    timeSpent,
  };
}

export function calculateHunterSessionResult(
  answers: HunterAnswer[],
  claims: HunterClaim[],
  difficulty: Difficulty
): Omit<SessionResult, 'id' | 'date'> {
  const maxPossible = answers.length * 130;
  const totalScore = answers.reduce((sum, a) => sum + a.score, 0);
  const overallScore = maxPossible > 0 ? Math.round((totalScore / (answers.length * 100)) * 100) : 0;
  const clampedScore = Math.min(100, Math.max(0, overallScore));

  // Calculate dimension scores
  const dimensions = { prompting: 0, concepts: 0, tools: 0, criticalThinking: 0, ethics: 0 };
  const weights = { prompting: 0, concepts: 0, tools: 0, criticalThinking: 0, ethics: 0 };

  answers.forEach((answer) => {
    const claim = claims.find(c => c.id === answer.claimId);
    if (!claim) return;
    const answerNorm = Math.min(100, answer.score);
    for (const dim of Object.keys(dimensions) as (keyof typeof dimensions)[]) {
      dimensions[dim] += answerNorm * claim.skills[dim];
      weights[dim] += claim.skills[dim];
    }
  });

  for (const dim of Object.keys(dimensions) as (keyof typeof dimensions)[]) {
    dimensions[dim] = weights[dim] > 0 ? Math.round(dimensions[dim] / weights[dim]) : 0;
  }

  // Convert to PlayerAnswer format for SessionResult compatibility
  const cases: PlayerAnswer[] = answers.map((a) => {
    const claim = claims.find(c => c.id === a.claimId);
    return {
      caseId: a.claimId,
      caseTitle: claim?.text.slice(0, 60) ?? a.claimId,
      caseType: 'hallucination' as const,
      selectedOptionId: a.playerAction,
      reasoning: '',
      timeSpent: a.timeSpent,
      isCorrect: a.isCorrect,
      score: Math.min(100, a.score),
    };
  });

  return {
    game: 'hunter',
    difficulty,
    cases,
    overallScore: clampedScore,
    dimensions,
    masteryLevel: getMasteryLevel(clampedScore),
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
