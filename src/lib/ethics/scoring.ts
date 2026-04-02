import type { EthicsScenario, EthicsChoice, EthicsAnswer, MasteryLevel, SessionResult, Difficulty, PlayerAnswer } from '../types';

/**
 * Score a single ethics choice.
 * Optimal = 80 base, suboptimal-but-reasonable = 40, worst = 10
 * Time bonus: up to 20 points if answered within 60 seconds
 */
export function scoreEthicsChoice(
  scenario: EthicsScenario,
  choice: EthicsChoice,
  timeSpent: number,
  currentMeters: { trust: number; profit: number; safety: number; equity: number }
): EthicsAnswer {
  // Base score
  let baseScore: number;
  if (choice.isOptimal) {
    baseScore = 80;
  } else {
    // Check if it's the "worst" choice — the one with the most negative total impact
    const sortedChoices = [...scenario.choices].sort((a, b) => {
      const totalA = a.impact.trust + a.impact.profit + a.impact.safety + a.impact.equity;
      const totalB = b.impact.trust + b.impact.profit + b.impact.safety + b.impact.equity;
      return totalA - totalB;
    });
    const isWorst = sortedChoices[0].id === choice.id && !choice.isOptimal;
    baseScore = isWorst ? 10 : 40;
  }

  // Time bonus: up to 20 points if answered within 60 seconds
  let timeBonus = 0;
  if (timeSpent <= 15) timeBonus = 20;
  else if (timeSpent <= 30) timeBonus = 15;
  else if (timeSpent <= 45) timeBonus = 10;
  else if (timeSpent <= 60) timeBonus = 5;

  const score = baseScore + timeBonus;

  // Update meters
  const newMeters = {
    trust: Math.max(-10, Math.min(10, currentMeters.trust + choice.impact.trust)),
    profit: Math.max(-10, Math.min(10, currentMeters.profit + choice.impact.profit)),
    safety: Math.max(-10, Math.min(10, currentMeters.safety + choice.impact.safety)),
    equity: Math.max(-10, Math.min(10, currentMeters.equity + choice.impact.equity)),
  };

  return {
    scenarioId: scenario.id,
    choiceId: choice.id,
    isOptimal: choice.isOptimal,
    score,
    meters: newMeters,
    timeSpent,
  };
}

/**
 * Meter balance bonus: if all 4 meters are positive at end, bonus points.
 */
export function getMeterBonus(meters: { trust: number; profit: number; safety: number; equity: number }): number {
  const allPositive = meters.trust > 0 && meters.profit > 0 && meters.safety > 0 && meters.equity > 0;
  if (!allPositive) return 0;
  const min = Math.min(meters.trust, meters.profit, meters.safety, meters.equity);
  return Math.min(50, min * 10); // up to 50 bonus
}

export function calculateEthicsSessionResult(
  answers: EthicsAnswer[],
  scenarios: EthicsScenario[],
  difficulty: Difficulty
): Omit<SessionResult, 'id' | 'date'> {
  const totalScore = answers.reduce((sum, a) => sum + a.score, 0);
  const maxPossible = answers.length * 100; // 80 base + 20 time bonus

  // Add meter balance bonus from final state
  const finalMeters = answers.length > 0 ? answers[answers.length - 1].meters : { trust: 0, profit: 0, safety: 0, equity: 0 };
  const meterBonus = getMeterBonus(finalMeters);

  const rawScore = maxPossible > 0 ? Math.round(((totalScore + meterBonus) / (maxPossible + 50)) * 100) : 0;
  const clampedScore = Math.min(100, Math.max(0, rawScore));

  // Calculate dimension scores
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
      selectedOptionId: a.choiceId,
      reasoning: '',
      timeSpent: a.timeSpent,
      isCorrect: a.isOptimal,
      score: Math.min(100, a.score),
    };
  });

  return {
    game: 'ethics',
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
