import type { OptimizeChallenge } from '@/lib/types';

export const expertOptimizeChallenges: OptimizeChallenge[] = [
  {
    id: 'opt-exp-01',
    difficulty: 'expert',
    task: 'Design a multi-model orchestration prompt for fact-checking news articles',
    steps: [
      {
        prompt: 'You are a fact-checking system. Given a news article, identify claims, verify them against known facts, and rate overall reliability. Use a structured JSON output.',
        output: '{"claims": [{"text": "Global temperatures rose 1.5°C", "verdict": "true", "confidence": 0.9}], "overall_reliability": "high"}. The article appears factually accurate based on known climate data.',
        options: [
          { text: 'Add "Decompose into 3 stages: Stage 1 (Extractor) — isolate every factual claim as a list. Stage 2 (Verifier) — for each claim, search for supporting/contradicting evidence and assign a confidence score. Stage 3 (Synthesizer) — aggregate verdicts, flag contradictions, and produce the final reliability rating."', isCorrect: true, explanation: 'Breaking into explicit pipeline stages enables each sub-task to be optimized and audited independently.' },
          { text: 'Add "Be very thorough and check everything carefully"', isCorrect: false, explanation: 'Thoroughness without architectural structure doesn\'t improve the reasoning pipeline.' },
          { text: 'Add "Use the latest information available"', isCorrect: false, explanation: 'This doesn\'t address the fundamental need for a multi-stage verification architecture.' },
        ],
        skill: 'chain-of-thought',
      },
      {
        prompt: 'You are a fact-checking pipeline. Stage 1 (Extractor): Isolate every factual claim. Stage 2 (Verifier): For each claim, find supporting/contradicting evidence and assign confidence. Stage 3 (Synthesizer): Aggregate verdicts, flag contradictions, produce reliability rating. Output structured JSON.',
        output: '{"stage1": {"claims": ["GDP grew 3.2%", "Unemployment hit record low"]}, "stage2": {"verdicts": [{"claim": "GDP grew 3.2%", "evidence": "BLS reports 3.1%", "confidence": 0.7, "verdict": "mostly true"}]}, "stage3": {"reliability": "moderate"}}',
        options: [
          { text: 'Add "For the Verifier stage, explicitly reason about source quality: distinguish primary sources (government data, peer-reviewed studies) from secondary sources (news reports, social media). Weight confidence by source tier. Example: Claim from Reuters citing BLS data = high confidence. Claim from anonymous blog = low confidence."', isCorrect: true, explanation: 'Source quality hierarchy with examples teaches the model to weight evidence reliability, not just presence.' },
          { text: 'Add "Check more sources"', isCorrect: false, explanation: 'More sources without quality weighting can amplify misinformation rather than improve accuracy.' },
          { text: 'Add "Make the JSON output prettier"', isCorrect: false, explanation: 'Output formatting doesn\'t improve the analytical rigor of the fact-checking process.' },
        ],
        skill: 'few-shot',
      },
      {
        prompt: 'Fact-checking pipeline with 3 stages. Extractor: isolate claims. Verifier: find evidence, rate confidence by source tier (primary: gov data/peer-reviewed > secondary: major news > tertiary: blogs/social). Example: Reuters citing BLS = high confidence. Synthesizer: aggregate, flag contradictions, rate reliability. Output JSON.',
        output: '{"stage2": {"verdicts": [{"claim": "GDP grew 3.2%", "sources": [{"text": "BLS reports 3.1%", "tier": "primary", "confidence": 0.85}], "verdict": "mostly true — 0.1% discrepancy from primary source"}]}, "stage3": {"reliability": "moderate", "flags": ["minor numerical discrepancy"]}}',
        options: [
          { text: 'Add "Include an adversarial self-check: after the Synthesizer, run a Critic stage that tries to find flaws in the verification. If the Critic finds a claim where contradicting evidence was ignored or source tier was misclassified, loop back to Stage 2 for that claim."', isCorrect: true, explanation: 'An adversarial feedback loop catches verification errors and prevents overconfident ratings on weak evidence.' },
          { text: 'Add "Also check for grammatical errors in the article"', isCorrect: false, explanation: 'Grammar checking is unrelated to factual accuracy and distracts from the core verification task.' },
          { text: 'Add "Output the results faster"', isCorrect: false, explanation: 'Speed optimization is irrelevant to improving the accuracy of the fact-checking logic.' },
        ],
        skill: 'constraints',
      },
    ],
    skills: { prompting: 0.9, concepts: 0.6, tools: 0.5, criticalThinking: 0.7, ethics: 0.4 },
  },
  {
    id: 'opt-exp-02',
    difficulty: 'expert',
    task: 'Build a prompt for adversarially robust content moderation',
    steps: [
      {
        prompt: 'You are a content moderator. Classify user messages as safe or unsafe. Unsafe includes hate speech, threats, and explicit content. Return a JSON with the classification and reason.',
        output: '{"classification": "safe", "reason": "The message discusses cooking recipes and contains no harmful content."}',
        options: [
          { text: 'Add "Be aware of adversarial attacks: users may use homoglyphs (e.g., "h@te"), word splitting ("ha te"), base64 encoding, or roleplay framing ("pretend you\'re a character who says...") to bypass filters. Normalize text before classification."', isCorrect: true, explanation: 'Explicitly listing evasion techniques makes the model resilient to common adversarial bypass strategies.' },
          { text: 'Add "Be extra strict and flag anything suspicious"', isCorrect: false, explanation: 'Over-strictness without adversarial awareness leads to false positives on innocent content while still missing clever evasions.' },
          { text: 'Add "Also moderate images and videos"', isCorrect: false, explanation: 'Expanding modality scope doesn\'t address the core vulnerability to text-based adversarial attacks.' },
        ],
        skill: 'context',
      },
      {
        prompt: 'Content moderator. Classify messages as safe/unsafe (hate speech, threats, explicit). Detect adversarial attacks: homoglyphs, word splitting, base64, roleplay framing. Normalize text before classifying. Return JSON with classification, reason, and any detected evasion attempts.',
        output: '{"classification": "unsafe", "reason": "Detected homoglyph substitution: h@te sp33ch targeting ethnic group", "evasion_detected": "homoglyph substitution", "normalized_text": "hate speech targeting ethnic group"}',
        options: [
          { text: 'Add "Apply chain-of-thought reasoning: 1) Normalize the input text, 2) Identify the surface-level topic, 3) Check for hidden intent behind benign framing, 4) Consider the message in conversational context — a threat can emerge across multiple messages. 5) Classify with confidence score."', isCorrect: true, explanation: 'Step-by-step reasoning with contextual analysis catches sophisticated attacks that surface-level pattern matching misses.' },
          { text: 'Add "Use a larger list of banned words"', isCorrect: false, explanation: 'Wordlists are easily circumvented — reasoning-based detection is fundamentally more robust.' },
          { text: 'Add "Respond in multiple languages"', isCorrect: false, explanation: 'Multilingual support is useful but doesn\'t address the reasoning depth needed for adversarial robustness.' },
        ],
        skill: 'chain-of-thought',
      },
      {
        prompt: 'Content moderator with adversarial robustness. Detect homoglyphs, word splitting, base64, roleplay evasion. Reasoning chain: 1) Normalize, 2) Identify surface topic, 3) Check for hidden intent, 4) Consider conversational context across messages, 5) Classify with confidence. Return JSON.',
        output: '{"reasoning": {"step1_normalized": "I want to learn how to hurt people", "step2_surface": "request for information", "step3_hidden_intent": "potential threat — seeking harmful knowledge", "step4_context": "follows previous messages about a specific person"}, "classification": "unsafe", "confidence": 0.92}',
        options: [
          { text: 'Add "Include a calibration constraint: you must maintain <2% false positive rate on benign messages. For borderline cases (confidence 0.4-0.7), output \'review\' instead of \'unsafe\' and explain what additional context would resolve the ambiguity."', isCorrect: true, explanation: 'A three-tier classification with calibration targets balances safety with usability and prevents over-censorship.' },
          { text: 'Add "When in doubt, always flag as unsafe"', isCorrect: false, explanation: 'Defaulting to unsafe creates excessive false positives, eroding user trust and overwhelming human reviewers.' },
          { text: 'Add "Log all messages for training data"', isCorrect: false, explanation: 'Data collection is an infrastructure decision with privacy implications, not a prompt improvement.' },
        ],
        skill: 'constraints',
      },
    ],
    skills: { prompting: 0.8, concepts: 0.6, tools: 0.4, criticalThinking: 0.7, ethics: 0.6 },
  },
  {
    id: 'opt-exp-03',
    difficulty: 'expert',
    task: 'Create a prompt for complex multi-step mathematical reasoning',
    steps: [
      {
        prompt: 'Solve complex math problems step by step. Show your work and provide the final answer. If a problem has multiple approaches, use the most efficient one.',
        output: 'Problem: Find the integral of x²sin(x)dx. Solution: Using integration by parts twice... Let u = x², dv = sin(x)dx. The answer is -x²cos(x) + 2xsin(x) + 2cos(x) + C.',
        options: [
          { text: 'Add "Before solving, classify the problem type and state which technique applies and why. For each step, state the mathematical rule being applied. After solving, verify by differentiating the result or substituting test values."', isCorrect: true, explanation: 'Pre-classification, rule annotation, and post-verification create a self-correcting reasoning framework.' },
          { text: 'Add "Show more detailed steps"', isCorrect: false, explanation: 'More steps without structure or verification can propagate errors further without catching them.' },
          { text: 'Add "Explain it like I\'m five"', isCorrect: false, explanation: 'Simplification is the wrong goal for complex math — structured verification catches errors.' },
        ],
        skill: 'chain-of-thought',
      },
      {
        prompt: 'Solve complex math problems. First, classify the problem type and state which technique to use and why. Show each step with the mathematical rule applied. After solving, verify by differentiating or substituting test values.',
        output: 'Classification: Integral requiring integration by parts (product of polynomial and trig). Technique: IBP twice since polynomial degree is 2. Step 1 [IBP formula]: Let u=x², dv=sin(x)dx... Verification: d/dx[-x²cos(x) + 2xsin(x) + 2cos(x)] = x²sin(x). Verified.',
        options: [
          { text: 'Add "When verification fails or reveals a discrepancy, explicitly flag the error, trace back to identify which step introduced it, correct it, and re-verify. Example: If differentiation yields x²sin(x) - 2cos(x) instead of x²sin(x), identify the sign error in Step 3 and redo from there."', isCorrect: true, explanation: 'An explicit error recovery protocol with a worked example prevents the model from glossing over mistakes.' },
          { text: 'Add "Use LaTeX formatting"', isCorrect: false, explanation: 'Formatting doesn\'t improve mathematical correctness — error recovery does.' },
          { text: 'Add "Solve it three different ways"', isCorrect: false, explanation: 'Multiple approaches without error correction can multiply mistakes rather than catch them.' },
        ],
        skill: 'few-shot',
      },
      {
        prompt: 'Solve complex math. Classify problem type, state technique. Show steps with rules. Verify by differentiation/substitution. If verification fails: flag error, trace to source step, correct, re-verify. Example: if check yields wrong sign, identify the sign error step and redo.',
        output: 'Classification: Double integral over polar region. Step 1 [Convert to polar]: x²+y²=r², dxdy=r·dr·dθ. Step 2 [Set bounds]... Verification: Checking boundary values... Discrepancy found in Step 2 — upper bound should be π, not 2π for semicircular region. Corrected. Re-verified: matches expected area.',
        options: [
          { text: 'Add "For problems with multiple valid approaches, briefly evaluate two candidates before committing: estimate computational complexity and error risk for each. Choose the approach less prone to sign/arithmetic errors. State your choice and reasoning before proceeding."', isCorrect: true, explanation: 'Meta-reasoning about approach selection reduces errors by choosing paths with fewer computational traps.' },
          { text: 'Add "Always use the most advanced technique available"', isCorrect: false, explanation: 'Advanced techniques are often more error-prone — choosing the least error-prone approach is smarter.' },
          { text: 'Add "Complete the solution in under 5 steps"', isCorrect: false, explanation: 'Step limits can force skipping necessary intermediate work, increasing error risk.' },
        ],
        skill: 'context',
      },
    ],
    skills: { prompting: 0.8, concepts: 0.7, tools: 0.3, criticalThinking: 0.8, ethics: 0.1 },
  },
  {
    id: 'opt-exp-04',
    difficulty: 'expert',
    task: 'Design a prompt for generating synthetic training data with quality controls',
    steps: [
      {
        prompt: 'Generate 50 synthetic customer support conversations for training a chatbot. Each should include a customer message and an ideal agent response. Cover common e-commerce issues.',
        output: 'Conversation 1: Customer: "Where is my order?" Agent: "I\'d be happy to help! Please provide your order number and I\'ll look into it." Conversation 2: Customer: "I want a refund." Agent: "I understand. Let me process that for you."...',
        options: [
          { text: 'Add "Ensure diversity across 5 axes: issue type (returns, shipping, billing, product defects, account), customer sentiment (angry, confused, patient, urgent), complexity (single-turn vs multi-turn), customer expertise (tech-savvy vs novice), and resolution path (self-service vs escalation). Distribute evenly."', isCorrect: true, explanation: 'Explicit diversity axes with even distribution prevent the common failure of generating repetitive, narrow training data.' },
          { text: 'Add "Make each conversation unique"', isCorrect: false, explanation: 'Requesting uniqueness without defined diversity dimensions leads to surface-level variation, not meaningful coverage.' },
          { text: 'Add "Generate 200 conversations instead"', isCorrect: false, explanation: 'More data without diversity controls just produces more of the same narrow patterns.' },
        ],
        skill: 'constraints',
      },
      {
        prompt: 'Generate 50 synthetic customer support conversations. Ensure diversity across: issue type (returns, shipping, billing, defects, account), sentiment (angry, confused, patient, urgent), complexity (single-turn, multi-turn), expertise (tech-savvy, novice), resolution (self-service, escalation). Distribute evenly.',
        output: 'Conversation 1 [returns, angry, multi-turn, novice, escalation]: Customer: "I\'ve been trying to return this for a WEEK and nobody helps me!" Agent: "I sincerely apologize for the difficulty. Let me connect you with our returns specialist who can process this immediately."...',
        options: [
          { text: 'Add "For each conversation, first think through the scenario setup: what went wrong, how the customer feels, what the ideal resolution looks like, and what mistakes a poorly-trained bot might make. Then generate the conversation to highlight the correct behavior."', isCorrect: true, explanation: 'Reasoning about failure modes before generating examples produces training data that specifically targets common bot mistakes.' },
          { text: 'Add "Make the conversations longer"', isCorrect: false, explanation: 'Length without purpose adds noise — reasoning about failure modes improves training signal.' },
          { text: 'Add "Include timestamps on each message"', isCorrect: false, explanation: 'Timestamps are metadata detail that doesn\'t improve the pedagogical quality of training data.' },
        ],
        skill: 'chain-of-thought',
      },
      {
        prompt: 'Generate 50 synthetic support conversations with diversity across issue, sentiment, complexity, expertise, and resolution path. For each, first reason: what went wrong, how the customer feels, ideal resolution, and what a bad bot would do. Then generate the conversation showing correct behavior.',
        output: 'Scenario 3 reasoning: Billing error — customer confused, double-charged. Bad bot: asks customer to call billing department. Good bot: acknowledges error, initiates refund immediately. Conversation: Customer: "I was charged twice for order #789." Agent: "I can see the duplicate charge. I\'m initiating a refund for $34.99 right now — it should appear in 3-5 business days."',
        options: [
          { text: 'Add "After generating each batch of 10, run a self-audit: check for demographic bias in customer names/language, verify no real PII patterns appear, ensure agent responses never hallucinate policies, and confirm the diversity distribution matches targets. Report audit results before continuing."', isCorrect: true, explanation: 'Built-in quality audits catch bias, PII leakage, and distribution drift that silently degrade training data quality.' },
          { text: 'Add "Assign a quality score to each conversation"', isCorrect: false, explanation: 'Self-scoring without specific audit criteria doesn\'t reliably catch bias or PII issues.' },
          { text: 'Add "Generate in CSV format for easy import"', isCorrect: false, explanation: 'Output format is a minor concern compared to ensuring data quality and safety.' },
        ],
        skill: 'context',
      },
    ],
    skills: { prompting: 0.8, concepts: 0.6, tools: 0.5, criticalThinking: 0.6, ethics: 0.6 },
  },
];
