import type { TycoonScenario, TycoonDecision, TycoonAnswer, MasteryLevel, SessionResult, Difficulty, PlayerAnswer } from '../types';

/**
 * Score a single tycoon decision.
 * Optimal = 80 base, decent (middle impact) = 50, poor = 15.
 * Time bonus up to 20 points for fast decisions (< 10s).
 */
export function scoreTycoonDecision(
  scenario: TycoonScenario,
  decision: TycoonDecision,
  currentMeters: { revenue: number; reputation: number; trust: number; regulatory: number },
  timeSpent: number
): TycoonAnswer {
  // Base score by quality
  let baseScore: number;
  if (decision.isOptimal) {
    baseScore = 80;
  } else {
    // Check if it's decent or poor — decent has mostly positive or neutral impact
    const totalImpact = decision.impact.revenue + decision.impact.reputation + decision.impact.trust + decision.impact.regulatory;
    baseScore = totalImpact >= 0 ? 50 : 15;
  }

  // Time bonus: up to 20 points
  let timeBonus = 0;
  if (timeSpent < 5) timeBonus = 20;
  else if (timeSpent < 10) timeBonus = 15;
  else if (timeSpent < 20) timeBonus = 10;
  else if (timeSpent < 30) timeBonus = 5;

  const score = Math.min(100, baseScore + timeBonus);

  // Calculate new meters
  const meters = {
    revenue: clampMeter(currentMeters.revenue + decision.impact.revenue * 8),
    reputation: clampMeter(currentMeters.reputation + decision.impact.reputation * 8),
    trust: clampMeter(currentMeters.trust + decision.impact.trust * 8),
    regulatory: clampMeter(currentMeters.regulatory + decision.impact.regulatory * 8),
  };

  return {
    scenarioId: scenario.id,
    decisionId: decision.id,
    isOptimal: decision.isOptimal,
    score,
    meters,
    timeSpent,
  };
}

function clampMeter(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/**
 * Calculate the final session result from all tycoon answers.
 */
export function calculateTycoonSessionResult(
  answers: TycoonAnswer[],
  scenarios: TycoonScenario[],
  difficulty: Difficulty
): Omit<SessionResult, 'id' | 'date'> {
  // Base score from decisions
  const totalDecisionScore = answers.reduce((sum, a) => sum + a.score, 0);
  const maxDecisionScore = answers.length * 100;
  let overallScore = maxDecisionScore > 0 ? Math.round((totalDecisionScore / maxDecisionScore) * 80) : 0;

  // Meter balance bonus (up to 20 points): reward for keeping all meters healthy
  if (answers.length > 0) {
    const finalMeters = answers[answers.length - 1].meters;
    const avg = (finalMeters.revenue + finalMeters.reputation + finalMeters.trust + finalMeters.regulatory) / 4;
    const meterBonus = Math.round((avg / 100) * 20);
    overallScore += meterBonus;
  }

  overallScore = Math.min(100, Math.max(0, overallScore));

  // Calculate skill dimensions
  const dimensions = { prompting: 0, concepts: 0, tools: 0, criticalThinking: 0, ethics: 0 };
  const weights = { prompting: 0, concepts: 0, tools: 0, criticalThinking: 0, ethics: 0 };

  answers.forEach((answer) => {
    const scenario = scenarios.find(s => s.id === answer.scenarioId);
    if (!scenario) return;
    const answerNorm = Math.min(100, answer.score);
    for (const dim of Object.keys(dimensions) as (keyof typeof dimensions)[]) {
      dimensions[dim] += answerNorm * scenario.skills[dim];
      weights[dim] += scenario.skills[dim];
    }
  });

  for (const dim of Object.keys(dimensions) as (keyof typeof dimensions)[]) {
    dimensions[dim] = weights[dim] > 0 ? Math.round(dimensions[dim] / weights[dim]) : 0;
  }

  // Convert to PlayerAnswer format
  const cases: PlayerAnswer[] = answers.map((a) => {
    const scenario = scenarios.find(s => s.id === a.scenarioId);
    return {
      caseId: a.scenarioId,
      caseTitle: scenario?.title ?? a.scenarioId,
      caseType: 'ethics' as const,
      selectedOptionId: a.decisionId,
      reasoning: '',
      timeSpent: a.timeSpent,
      isCorrect: a.isOptimal,
      score: Math.min(100, a.score),
    };
  });

  return {
    game: 'tycoon',
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
