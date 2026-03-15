import { Case, PlayerAnswer, MasteryLevel, SessionResult, Difficulty } from '../types';

export function scoreAnswer(case_: Case, selectedOptionId: string, reasoning: string, timeSpent: number): PlayerAnswer {
  const option = case_.options.find(o => o.id === selectedOptionId);
  const isCorrect = option?.isCorrect ?? false;

  // Base score: 70 points for correct answer
  let score = isCorrect ? 70 : 0;

  // Reasoning bonus: up to 20 points for providing reasoning
  if (reasoning.length > 50) score += 20;
  else if (reasoning.length > 20) score += 10;

  // Speed bonus: up to 10 points (full if under 60s, scaled up to 180s)
  if (timeSpent < 60) score += 10;
  else if (timeSpent < 180) score += Math.round(10 * (1 - (timeSpent - 60) / 120));

  return {
    caseId: case_.id,
    caseTitle: case_.title,
    caseType: case_.type,
    selectedOptionId,
    reasoning,
    timeSpent,
    isCorrect,
    score: Math.min(100, Math.max(0, score)),
  };
}

export function calculateSessionResult(
  answers: PlayerAnswer[],
  cases: Case[],
  difficulty: Difficulty
): Omit<SessionResult, 'id' | 'date'> {
  const overallScore = Math.round(answers.reduce((sum, a) => sum + a.score, 0) / answers.length);

  // Calculate dimension scores based on case skill weights
  const dimensions = { prompting: 0, concepts: 0, tools: 0, criticalThinking: 0, ethics: 0 };
  const weights = { prompting: 0, concepts: 0, tools: 0, criticalThinking: 0, ethics: 0 };

  answers.forEach((answer) => {
    const case_ = cases.find(c => c.id === answer.caseId);
    if (!case_) return;
    for (const dim of Object.keys(dimensions) as (keyof typeof dimensions)[]) {
      dimensions[dim] += answer.score * case_.skills[dim];
      weights[dim] += case_.skills[dim];
    }
  });

  for (const dim of Object.keys(dimensions) as (keyof typeof dimensions)[]) {
    dimensions[dim] = weights[dim] > 0 ? Math.round(dimensions[dim] / weights[dim]) : 0;
  }

  return {
    game: 'detective',
    difficulty,
    cases: answers,
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

export function getMasteryLabel(level: MasteryLevel): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}
