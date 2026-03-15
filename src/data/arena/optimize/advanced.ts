import type { OptimizeChallenge } from '@/lib/types';

export const advancedOptimizeChallenges: OptimizeChallenge[] = [
  {
    id: 'opt-adv-01',
    difficulty: 'advanced',
    task: 'Design a system prompt for a customer support chatbot',
    steps: [
      {
        prompt: 'You are a helpful customer support agent for an e-commerce company. Answer customer questions.',
        output: 'Hi! I\'m here to help. What can I do for you today? I can answer questions about products, orders, shipping, returns, and more!',
        options: [
          { text: 'Add "You handle returns, order tracking, and billing for ShopWave. Escalate complaints about damaged items to a human agent. Never promise refunds without order verification."', isCorrect: true, explanation: 'Defining scope, escalation rules, and guardrails prevents the bot from overstepping its authority.' },
          { text: 'Add "Be very helpful and answer everything the customer asks"', isCorrect: false, explanation: 'Unlimited scope is dangerous — a support bot needs clear boundaries on what it can and cannot do.' },
          { text: 'Add "Always be polite and professional"', isCorrect: false, explanation: 'Tone guidance is useful but secondary to defining operational boundaries and capabilities.' },
        ],
        skill: 'constraints',
      },
      {
        prompt: 'You are a customer support agent for ShopWave. Handle returns, order tracking, and billing. Escalate damaged item complaints to human agents. Never promise refunds without order verification.',
        output: 'I can help you with your ShopWave order. Could you provide your order number? I can look up tracking info, process returns for items within our 30-day window, or answer billing questions.',
        options: [
          { text: 'Add "When a customer is frustrated, first acknowledge their feeling before solving the problem. Example: Customer: My order is 2 weeks late! Agent: I completely understand your frustration — a 2-week delay is unacceptable. Let me look into this right now."', isCorrect: true, explanation: 'A concrete example of empathy-first responses teaches the AI the desired interaction pattern.' },
          { text: 'Add "Show empathy to customers"', isCorrect: false, explanation: 'Without a concrete example, "show empathy" is too vague to produce consistent behavior.' },
          { text: 'Add "Respond in under 50 words"', isCorrect: false, explanation: 'Rigid word limits can prevent the bot from being thorough on complex issues.' },
        ],
        skill: 'few-shot',
      },
      {
        prompt: 'You are a customer support agent for ShopWave handling returns, order tracking, and billing. Escalate damaged items to humans. Never promise refunds without verification. When customers are frustrated, acknowledge feelings first. Example: "I completely understand your frustration — let me look into this right now."',
        output: 'I understand how frustrating a late delivery can be. Let me pull up your order #12345 now. I can see it\'s currently in transit and expected by Thursday. Would you like me to set up a delivery notification?',
        options: [
          { text: 'Add "Think step by step: 1) Identify the issue category, 2) Check if you have the needed info, 3) Ask for missing details, 4) Provide solution or escalate. Always state which step you\'re on internally."', isCorrect: true, explanation: 'A chain-of-thought framework ensures consistent, logical problem resolution across all interaction types.' },
          { text: 'Add "Handle all edge cases"', isCorrect: false, explanation: 'Listing "all edge cases" is impossible — a reasoning framework handles novel situations better.' },
          { text: 'Add "Keep conversations short"', isCorrect: false, explanation: 'Brevity is less important than a structured reasoning process for complex support issues.' },
        ],
        skill: 'chain-of-thought',
      },
    ],
    skills: { prompting: 0.9, concepts: 0.5, tools: 0.3, criticalThinking: 0.4, ethics: 0.3 },
  },
  {
    id: 'opt-adv-02',
    difficulty: 'advanced',
    task: 'Write an abstract for a research paper on urban heat islands',
    steps: [
      {
        prompt: 'Write a research paper abstract about urban heat islands and how green spaces can help reduce temperatures in cities.',
        output: 'Urban heat islands cause cities to be warmer than surrounding areas. Green spaces like parks can help cool cities. This paper explores how planting trees and creating parks can reduce urban temperatures.',
        options: [
          { text: 'Add "Include specific metrics: our study measured 12 cities over 5 years, finding that neighborhoods within 200m of parks averaging 2 hectares were 2.3°C cooler. Target journal: Nature Climate Change."', isCorrect: true, explanation: 'Providing actual data points and the target journal gives the AI the specificity needed for a credible abstract.' },
          { text: 'Add "Make it sound more scientific and academic"', isCorrect: false, explanation: 'Academic tone without concrete data still produces a vague, unsupported abstract.' },
          { text: 'Add "Include more citations"', isCorrect: false, explanation: 'AI cannot reliably generate real citations — adding your actual data is more important.' },
        ],
        skill: 'context',
      },
      {
        prompt: 'Write a research paper abstract about urban heat islands and green space mitigation. Our study measured 12 cities over 5 years, finding neighborhoods within 200m of parks averaging 2 hectares were 2.3°C cooler. Target journal: Nature Climate Change.',
        output: 'Urban heat islands amplify climate risks in densely populated areas. This five-year study across 12 metropolitan regions quantifies the thermal mitigation effect of urban green spaces, finding a mean 2.3°C reduction within 200m of parks exceeding 2 hectares...',
        options: [
          { text: 'Add "Structure as: Background (1 sentence), Gap (1 sentence), Method (1 sentence), Key finding (1 sentence), Implication (1 sentence). Max 150 words."', isCorrect: true, explanation: 'A sentence-by-sentence structure with word limit matches the concise format expected by top-tier journals.' },
          { text: 'Add "Add more technical jargon"', isCorrect: false, explanation: 'Jargon without structure can reduce clarity — top journals value precise structure over complexity.' },
          { text: 'Add "Mention that this is an important topic"', isCorrect: false, explanation: 'Stating importance is filler — the abstract should let the data speak for itself.' },
        ],
        skill: 'constraints',
      },
      {
        prompt: 'Write a 150-word abstract for Nature Climate Change. Topic: urban heat islands and green space mitigation. Data: 12 cities, 5 years, 2.3°C cooling within 200m of 2-hectare parks. Structure: Background (1 sentence), Gap (1 sentence), Method (1 sentence), Key finding (1 sentence), Implication (1 sentence).',
        output: 'Background: Urban heat islands increase mortality and energy demand in cities housing 56% of the global population. Gap: The minimum green space area and proximity needed for measurable cooling remain poorly quantified. Method: We analyzed thermal satellite data across 12 cities over five years, correlating park size and proximity with ambient temperature reduction. Finding: Neighborhoods within 200m of parks averaging 2 hectares experienced a mean 2.3°C cooling effect. Implication: These thresholds provide actionable benchmarks for urban planners designing heat-resilient cities.',
        options: [
          { text: 'Add "Before the implication, add a comparison: explain how this result compares to prior estimates, step by step reasoning through why the effect size differs"', isCorrect: true, explanation: 'Contextualizing findings against prior work strengthens the abstract\'s contribution claim through reasoned comparison.' },
          { text: 'Add "Use more impressive-sounding words"', isCorrect: false, explanation: 'Word choice doesn\'t strengthen the scientific argument — positioning against prior work does.' },
          { text: 'Add "Mention the research team credentials"', isCorrect: false, explanation: 'Author credentials belong in the paper metadata, not the abstract itself.' },
        ],
        skill: 'chain-of-thought',
      },
    ],
    skills: { prompting: 0.7, concepts: 0.5, tools: 0.2, criticalThinking: 0.6, ethics: 0.2 },
  },
  {
    id: 'opt-adv-03',
    difficulty: 'advanced',
    task: 'Design a REST API endpoint for a task management system',
    steps: [
      {
        prompt: 'Design a REST API for managing tasks with CRUD operations, filtering, and pagination.',
        output: 'GET /tasks - list tasks. POST /tasks - create task. PUT /tasks/:id - update. DELETE /tasks/:id - delete. Tasks have title, description, and status fields.',
        options: [
          { text: 'Add "Include request/response JSON examples for each endpoint. Example: POST /tasks with body {title: "Review PR", priority: "high", assignee: "user-123", due: "2025-03-15"} returns {id: "task-456", ...}"', isCorrect: true, explanation: 'Concrete JSON examples eliminate ambiguity about field names, types, and response shapes.' },
          { text: 'Add "Follow REST best practices"', isCorrect: false, explanation: 'Mentioning best practices without specifics doesn\'t tell the AI which conventions you want applied.' },
          { text: 'Add "Make it scalable"', isCorrect: false, explanation: 'Scalability is an infrastructure concern — concrete API examples improve the design specification more.' },
        ],
        skill: 'few-shot',
      },
      {
        prompt: 'Design a REST API for task management. Include request/response JSON for each endpoint. Example: POST /tasks {title: "Review PR", priority: "high", assignee: "user-123", due: "2025-03-15"} → {id: "task-456", status: "open", created: "..."}. Support CRUD, filtering, and pagination.',
        output: 'POST /tasks — Body: {title, priority, assignee, due} → 201 {id, title, priority, assignee, due, status, created}. GET /tasks?status=open&priority=high&page=1&limit=20 → 200 {data: [...], total: 142, page: 1, pages: 8}...',
        options: [
          { text: 'Add "Specify error responses (400, 404, 409), rate limiting headers, and authentication via Bearer tokens. Define which fields are required vs optional."', isCorrect: true, explanation: 'Error handling, auth, and field requirements are essential for a production-ready API specification.' },
          { text: 'Add "Add more endpoints"', isCorrect: false, explanation: 'More endpoints without error handling and auth leaves the core design incomplete.' },
          { text: 'Add "Use GraphQL instead"', isCorrect: false, explanation: 'Switching paradigms doesn\'t improve the current REST design — completing the specification does.' },
        ],
        skill: 'constraints',
      },
      {
        prompt: 'Design a REST API for task management with full CRUD, filtering, and pagination. Include JSON examples, error responses (400, 404, 409), Bearer token auth, and rate limiting headers. Specify required vs optional fields.',
        output: 'Authentication: Bearer token in Authorization header. Rate limit: X-RateLimit-Remaining header, 429 when exceeded. POST /tasks: Required: {title}. Optional: {priority, assignee, due, tags}. 400 if title missing, 409 if duplicate...',
        options: [
          { text: 'Add "Walk through the lifecycle of a task step by step: creation → assignment → status transitions (open→in-progress→review→done). Define which transitions are valid and what side effects each triggers (e.g., notifications)."', isCorrect: true, explanation: 'Modeling state transitions and side effects captures the business logic that makes the API actually useful.' },
          { text: 'Add "Add WebSocket support"', isCorrect: false, explanation: 'Real-time features are a separate concern — completing the core business logic is higher priority.' },
          { text: 'Add "Generate OpenAPI/Swagger docs"', isCorrect: false, explanation: 'Documentation format is less important than defining the actual state machine and business rules.' },
        ],
        skill: 'chain-of-thought',
      },
    ],
    skills: { prompting: 0.7, concepts: 0.5, tools: 0.5, criticalThinking: 0.4, ethics: 0.1 },
  },
  {
    id: 'opt-adv-04',
    difficulty: 'advanced',
    task: 'Create a rubric for evaluating AI-generated content quality',
    steps: [
      {
        prompt: 'Create a rubric for evaluating AI-generated text across accuracy, coherence, and usefulness.',
        output: 'Accuracy: Is the information correct? (1-5). Coherence: Does it flow well? (1-5). Usefulness: Is it helpful? (1-5). Total score out of 15.',
        options: [
          { text: 'Add "For each criterion, provide a specific description of what a score of 1, 3, and 5 looks like. Example for Accuracy-1: Contains multiple factual errors or fabricated information. Accuracy-5: All claims are verifiable and correctly sourced."', isCorrect: true, explanation: 'Anchor descriptions at each score level eliminate subjective interpretation and ensure consistent grading.' },
          { text: 'Add "Make the rubric more detailed"', isCorrect: false, explanation: 'Asking for detail without specifying how (anchor examples) won\'t produce a reliable rubric.' },
          { text: 'Add "Use a 10-point scale instead"', isCorrect: false, explanation: 'A wider scale without clear anchors is actually harder to use consistently.' },
        ],
        skill: 'few-shot',
      },
      {
        prompt: 'Create a rubric for evaluating AI-generated text. Criteria: accuracy, coherence, usefulness. For each, describe what scores 1, 3, and 5 look like. Example — Accuracy-1: multiple factual errors. Accuracy-5: all claims verifiable.',
        output: 'Accuracy: 1 — Multiple errors or fabrications. 3 — Mostly correct, minor inaccuracies. 5 — All claims verifiable. Coherence: 1 — Disjointed, hard to follow. 3 — Generally logical with some gaps. 5 — Seamless flow with clear structure...',
        options: [
          { text: 'Add "Include a dimension for ethical considerations: bias detection, harmful content flags, and source attribution. Weight ethics at 2x other criteria in final score."', isCorrect: true, explanation: 'Adding an ethics dimension with increased weight reflects the real-world importance of responsible AI evaluation.' },
          { text: 'Add "Add a creativity score"', isCorrect: false, explanation: 'Creativity is highly subjective and less critical than ethical evaluation for AI content assessment.' },
          { text: 'Add "Simplify to pass/fail"', isCorrect: false, explanation: 'Binary scoring loses the nuanced evaluation that makes rubrics useful for improvement.' },
        ],
        skill: 'context',
      },
      {
        prompt: 'Create a rubric for evaluating AI-generated text. Criteria: accuracy (1-5), coherence (1-5), usefulness (1-5), ethics (1-5, weighted 2x). Each criterion has anchor descriptions for 1, 3, and 5. Ethics covers bias, harm, and attribution.',
        output: 'Ethics: 1 — Contains biased language or unattributed claims. 3 — Mostly neutral, minor attribution gaps. 5 — Bias-free, all sources credited, no harmful content. Weighted score: (A + C + U + 2E) / 6 × 100...',
        options: [
          { text: 'Add "Explain the scoring logic step by step: first evaluate each criterion independently, then check for interactions (e.g., high accuracy but biased framing should cap the overall score), then compute the weighted total"', isCorrect: true, explanation: 'A step-by-step scoring process with interaction rules prevents high scores on flawed content.' },
          { text: 'Add "Make it fit on one page"', isCorrect: false, explanation: 'Space constraints are less important than ensuring the scoring logic is complete and fair.' },
          { text: 'Add "Color code the scores"', isCorrect: false, explanation: 'Visual formatting doesn\'t improve the rubric\'s analytical rigor.' },
        ],
        skill: 'chain-of-thought',
      },
    ],
    skills: { prompting: 0.6, concepts: 0.5, tools: 0.2, criticalThinking: 0.6, ethics: 0.5 },
  },
];
