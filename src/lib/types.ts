export type CaseType = 'hallucination' | 'bias' | 'prompt-injection' | 'ethics';
export type ContentType = 'email' | 'essay' | 'code' | 'social-media' | 'creative-writing' | 'image';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type MasteryLevel = 'novice' | 'apprentice' | 'practitioner' | 'expert' | 'master';

export interface EvidenceHotspot {
  x: number;      // percentage from left (0-100)
  y: number;      // percentage from top (0-100)
  w: number;      // width as percentage (0-100)
  h: number;      // height as percentage (0-100)
}

export interface Evidence {
  id: string;
  title: string;
  type: 'document' | 'screenshot' | 'data' | 'email' | 'chat-log' | 'code';
  content: string;  // the actual evidence text/description
  isKey: boolean;    // is this a key piece of evidence?
  hotspot?: EvidenceHotspot;  // position on scene image for interactive mode
}

export interface DiagnosisOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface Case {
  id: string;
  title: string;
  type: CaseType;
  difficulty: Difficulty;
  briefing: string;          // narrative intro
  context: string;           // background context
  imagePath?: string;        // noir scene illustration
  evidence: Evidence[];
  question: string;          // "What went wrong?"
  options: DiagnosisOption[];
  correctDiagnosis: string;  // detailed correct answer explanation
  recommendedFix: string;    // what should be done
  skills: {                  // which skills this tests (0-1 weight)
    prompting: number;
    concepts: number;
    tools: number;
    criticalThinking: number;
    ethics: number;
  };
}

// === AI or Human? (Turing Test) Types ===

export interface TuringMarker {
  text: string;
  explanation: string;
  type: 'ai-tell' | 'human-tell';
}

export interface TuringItem {
  id: string;
  contentType: ContentType;
  difficulty: Difficulty;
  title: string;
  content: string;
  isAI: boolean;
  aiModel?: string;
  humanSource?: string;
  markers: TuringMarker[];
  explanation: string;
  imagePath?: string;
  imageDescription?: string;
  skills: {
    prompting: number;
    concepts: number;
    tools: number;
    criticalThinking: number;
    ethics: number;
  };
}

export interface TuringAnswer {
  itemId: string;
  itemTitle: string;
  contentType: ContentType;
  guessedAI: boolean;
  isCorrect: boolean;
  score: number;
  streak: number;
  multiplier: number;
  timeSpent: number;
}

// === Prompt Arena Types ===

export type ArenaMode = 'critique' | 'battle' | 'optimize';

export type PromptSkill = 'specificity' | 'context' | 'constraints' | 'few-shot' | 'chain-of-thought';

export interface CritiquePrompt {
  text: string;
  rank: number;
  explanation: string;
}

export interface CritiqueRound {
  id: string;
  difficulty: Difficulty;
  task: string;
  prompts: CritiquePrompt[];
  skill: PromptSkill;
  skills: {
    prompting: number;
    concepts: number;
    tools: number;
    criticalThinking: number;
    ethics: number;
  };
}

export interface BattleRound {
  id: string;
  difficulty: Difficulty;
  task: string;
  promptA: { text: string; output: string };
  promptB: { text: string; output: string };
  winner: 'A' | 'B';
  explanation: string;
  skill: PromptSkill;
  skills: {
    prompting: number;
    concepts: number;
    tools: number;
    criticalThinking: number;
    ethics: number;
  };
}

export interface OptimizeStep {
  prompt: string;
  output: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  skill: PromptSkill;
}

export interface OptimizeChallenge {
  id: string;
  difficulty: Difficulty;
  task: string;
  steps: OptimizeStep[];
  skills: {
    prompting: number;
    concepts: number;
    tools: number;
    criticalThinking: number;
    ethics: number;
  };
}

export interface ArenaAnswer {
  roundId: string;
  mode: ArenaMode;
  isCorrect: boolean;
  score: number;
  streak: number;
  multiplier: number;
  timeSpent: number;
}

// === Escape Room Types ===

export type PuzzleType = 'prompt-fix' | 'spot-error' | 'match-concepts' | 'quiz' | 'chat-fix' | 'exit';

export interface RoomObject {
  id: string;
  name: string;
  icon: string;
  puzzleType: PuzzleType;
  position: { x: number; y: number; width: number; height: number };
}

export interface PromptFixPuzzle {
  type: 'prompt-fix';
  instruction: string;
  fragments: string[];
  correctOrder: number[];
  hint: string;
  explanation: string;
  code: string;
}

export interface SpotErrorPuzzle {
  type: 'spot-error';
  instruction: string;
  document: string;
  errors: { text: string; explanation: string }[];
  hint: string;
  code: string;
}

export interface MatchConceptsPuzzle {
  type: 'match-concepts';
  instruction: string;
  pairs: { term: string; definition: string }[];
  hint: string;
  code: string;
}

export interface QuizPuzzle {
  type: 'quiz';
  instruction: string;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  hint: string;
  code: string;
}

export interface ChatFixPuzzle {
  type: 'chat-fix';
  instruction: string;
  conversation: { role: 'user' | 'assistant'; content: string; isBroken?: boolean }[];
  fixes: { index: number; options: string[]; correctIndex: number; explanation: string }[];
  hint: string;
  code: string;
}

export interface ExitPuzzle {
  type: 'exit';
  instruction: string;
  requiredCodes: number;
  finalQuestion: string;
  finalOptions: string[];
  correctIndex: number;
  explanation: string;
}

export type Puzzle = PromptFixPuzzle | SpotErrorPuzzle | MatchConceptsPuzzle | QuizPuzzle | ChatFixPuzzle | ExitPuzzle;

export interface EscapeRoom {
  id: string;
  difficulty: Difficulty;
  title: string;
  scenario: string;
  backgroundImage: string;
  timeLimit: number;
  objects: RoomObject[];
  puzzles: Record<string, Puzzle>;
  skills: {
    prompting: number;
    concepts: number;
    tools: number;
    criticalThinking: number;
    ethics: number;
  };
}

export interface EscapeAnswer {
  puzzleId: string;
  puzzleType: PuzzleType;
  isCorrect: boolean;
  usedHint: boolean;
  timeSpent: number;
  score: number;
}

export interface EscapeResult {
  roomId: string;
  escaped: boolean;
  puzzlesSolved: number;
  totalPuzzles: number;
  timeRemaining: number;
  hintsUsed: number;
  answers: EscapeAnswer[];
}

// === Hallucination Hunter Types ===

export type ClaimCategory = 'factual' | 'citation' | 'code' | 'temporal' | 'entity' | 'statistical';

export interface HunterClaim {
  id: string;
  text: string;
  isHallucination: boolean;
  category: ClaimCategory;
  explanation: string;
  source?: string;
  difficulty: Difficulty;
  skills: {
    prompting: number;
    concepts: number;
    tools: number;
    criticalThinking: number;
    ethics: number;
  };
}

export interface HunterAnswer {
  claimId: string;
  playerAction: 'shot' | 'passed';
  isCorrect: boolean;
  score: number;
  streak: number;
  multiplier: number;
  timeSpent: number;
}

// === AI Ethics Quest Types ===

export interface EthicsScenario {
  id: string;
  difficulty: Difficulty;
  title: string;
  role: string;
  setup: string;
  dilemma: string;
  choices: EthicsChoice[];
  skills: { prompting: number; concepts: number; tools: number; criticalThinking: number; ethics: number; };
}

export interface EthicsChoice {
  id: string;
  text: string;
  consequence: string;
  impact: { trust: number; profit: number; safety: number; equity: number; };
  isOptimal: boolean;
  reasoning: string;
}

export interface EthicsAnswer {
  scenarioId: string;
  choiceId: string;
  isOptimal: boolean;
  score: number;
  meters: { trust: number; profit: number; safety: number; equity: number; };
  timeSpent: number;
}

// === AI Startup Tycoon Types ===

export interface TycoonScenario {
  id: string;
  difficulty: Difficulty;
  quarter: number;
  title: string;
  context: string;
  imagePath?: string;
  decisions: TycoonDecision[];
  skills: { prompting: number; concepts: number; tools: number; criticalThinking: number; ethics: number; };
}

export interface TycoonDecision {
  id: string;
  text: string;
  outcome: string;
  impact: { revenue: number; reputation: number; trust: number; regulatory: number; };
  isOptimal: boolean;
  reasoning: string;
}

export interface TycoonAnswer {
  scenarioId: string;
  decisionId: string;
  isOptimal: boolean;
  score: number;
  meters: { revenue: number; reputation: number; trust: number; regulatory: number; };
  timeSpent: number;
}

// === AI Pipeline Defense Types ===

export type ThreatType = 'bias' | 'drift' | 'adversarial' | 'leakage' | 'hallucination' | 'overfit';
export type PipelineStage = 'collection' | 'preprocessing' | 'training' | 'deployment' | 'monitoring';

export interface DefenseOption {
  id: string;
  text: string;
  stage: PipelineStage;
  isCorrect: boolean;
  explanation: string;
}

export interface PipelineThreat {
  id: string;
  difficulty: Difficulty;
  wave: number;
  title: string;
  threatType: ThreatType;
  description: string;
  affectedStage: PipelineStage;
  defenses: DefenseOption[];
  damage: number;
  skills: { prompting: number; concepts: number; tools: number; criticalThinking: number; ethics: number; };
}

export interface PipelineAnswer {
  threatId: string;
  defenseId: string;
  isCorrect: boolean;
  score: number;
  pipelineHealth: number;
  timeSpent: number;
}

// === Token Tumble Types ===

export interface TokenPuzzle {
  id: string;
  difficulty: Difficulty;
  title: string;
  instruction: string;
  scrambledTokens: string[];
  correctOrder: number[];
  explanation: string;
  category: 'prompt' | 'concept' | 'architecture' | 'workflow';
  skills: { prompting: number; concepts: number; tools: number; criticalThinking: number; ethics: number; };
}

export interface TokenAnswer {
  puzzleId: string;
  playerOrder: number[];
  isCorrect: boolean;
  score: number;
  timeSpent: number;
  streak: number;
}

// === Shared Types ===

export interface PlayerAnswer {
  caseId: string;
  caseTitle: string;
  caseType: CaseType;
  selectedOptionId: string;
  reasoning: string;        // player's written reasoning
  timeSpent: number;        // seconds
  isCorrect: boolean;
  score: number;            // 0-100 for this case
}

export interface SessionResult {
  id: string;
  game: 'detective' | 'arena' | 'turing' | 'escape' | 'hunter' | 'ethics' | 'tycoon' | 'pipeline' | 'tumble';
  difficulty: Difficulty;
  date: string;
  cases: PlayerAnswer[];
  overallScore: number;
  dimensions: {
    prompting: number;
    concepts: number;
    tools: number;
    criticalThinking: number;
    ethics: number;
  };
  masteryLevel: MasteryLevel;
}
