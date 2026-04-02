import type { PipelineThreat, PipelineAnswer, MasteryLevel, SessionResult, Difficulty, PlayerAnswer } from '../types';

const BASE_CORRECT = 80;
const BASE_WRONG = 10;
const MAX_HEALTH = 100;

export function scorePipelineDefense(
  threat: PipelineThreat,
  defenseId: string,
  currentHealth: number,
  timeSpent: number
): PipelineAnswer {
  const defense = threat.defenses.find(d => d.id === defenseId);
  const isCorrect = defense?.isCorrect ?? false;

  let score: number;
  let newHealth: number;

  if (isCorrect) {
    let timeBonus = 0;
    if (timeSpent <= 5) timeBonus = 20;
    else if (timeSpent <= 10) timeBonus = 15;
    else if (timeSpent <= 20) timeBonus = 10;
    else if (timeSpent <= 30) timeBonus = 5;
    score = BASE_CORRECT + timeBonus;
    newHealth = Math.min(MAX_HEALTH, currentHealth + 5); // small heal on correct
  } else {
    score = BASE_WRONG;
    newHealth = Math.max(0, currentHealth - threat.damage);
  }

  return {
    threatId: threat.id,
    defenseId,
    isCorrect,
    score: Math.min(100, score),
    pipelineHealth: newHealth,
    timeSpent,
  };
}

export function calculatePipelineSessionResult(
  answers: PipelineAnswer[],
  threats: PipelineThreat[],
  difficulty: Difficulty
): Omit<SessionResult, 'id' | 'date'> {
  const totalScore = answers.reduce((sum, a) => sum + a.score, 0);
  const maxPossible = answers.length * 100;

  // Health bonus: surviving pipeline = up to 20 extra points
  const finalHealth = answers.length > 0 ? answers[answers.length - 1].pipelineHealth : 0;
  const healthBonus = Math.round((finalHealth / MAX_HEALTH) * 20);

  const rawScore = maxPossible > 0 ? Math.round(((totalScore + healthBonus) / (maxPossible + 20)) * 100) : 0;
  const overallScore = Math.min(100, Math.max(0, rawScore));

  const dimensions = { prompting: 0, concepts: 0, tools: 0, criticalThinking: 0, ethics: 0 };
  const weights = { prompting: 0, concepts: 0, tools: 0, criticalThinking: 0, ethics: 0 };

  answers.forEach((answer) => {
    const threat = threats.find(t => t.id === answer.threatId);
    if (!threat) return;
    const norm = Math.min(100, answer.score);
    for (const dim of Object.keys(dimensions) as (keyof typeof dimensions)[]) {
      dimensions[dim] += norm * threat.skills[dim];
      weights[dim] += threat.skills[dim];
    }
  });

  for (const dim of Object.keys(dimensions) as (keyof typeof dimensions)[]) {
    dimensions[dim] = weights[dim] > 0 ? Math.round(dimensions[dim] / weights[dim]) : 0;
  }

  const cases: PlayerAnswer[] = answers.map((a) => {
    const threat = threats.find(t => t.id === a.threatId);
    return {
      caseId: a.threatId,
      caseTitle: threat?.title ?? a.threatId,
      caseType: 'ethics' as const,
      selectedOptionId: a.defenseId,
      reasoning: '',
      timeSpent: a.timeSpent,
      isCorrect: a.isCorrect,
      score: Math.min(100, a.score),
    };
  });

  return {
    game: 'pipeline',
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
