import type { CritiqueRound } from '@/lib/types';

export const advancedCritiqueRounds: CritiqueRound[] = [
  {
    id: 'crit-adv-01',
    difficulty: 'advanced',
    task: 'Write a system prompt for an AI customer support chatbot',
    prompts: [
      { text: 'You are a helpful customer support agent for TechCo. Answer questions about our products politely. If you do not know something, say so. Never discuss competitor products or make promises about refunds without checking policy.', rank: 1, explanation: 'Defines role, company, tone, fallback behavior, and explicit boundaries.' },
      { text: 'You are a customer support chatbot. Be helpful and polite. Answer questions about our products and do not make things up.', rank: 2, explanation: 'Covers basics but lacks company-specific context and boundary constraints.' },
      { text: 'Help customers with their questions. Be nice.', rank: 3, explanation: 'No role definition, guardrails, or behavioral boundaries for the system.' },
    ],
    skill: 'specificity',
    skills: { prompting: 1.0, concepts: 0.3, tools: 0.2, criticalThinking: 0.2, ethics: 0.3 },
  },
  {
    id: 'crit-adv-02',
    difficulty: 'advanced',
    task: 'Prompt AI to generate a Python function that handles edge cases for parsing dates',
    prompts: [
      { text: 'Write a Python function `parse_date(s: str) -> datetime` that accepts "YYYY-MM-DD", "MM/DD/YYYY", and "Month DD, YYYY" formats. Raise ValueError for invalid dates. Include type hints and a docstring.', rank: 1, explanation: 'Specifies the function signature, all accepted formats, error handling, and documentation requirements.' },
      { text: 'Write a Python function to parse dates from strings. Handle multiple formats and raise errors for bad input.', rank: 2, explanation: 'Mentions multi-format and error handling but does not enumerate the specific formats or signature.' },
      { text: 'Write a Python date parser.', rank: 3, explanation: 'No format specification, error handling requirements, or function signature details.' },
    ],
    skill: 'specificity',
    skills: { prompting: 0.9, concepts: 0.2, tools: 0.3, criticalThinking: 0.2, ethics: 0.1 },
  },
  {
    id: 'crit-adv-03',
    difficulty: 'advanced',
    task: 'Ask AI to review a pull request for a React authentication module',
    prompts: [
      { text: 'Review this PR. It adds authentication to our React 18 + TypeScript app using NextAuth. We use HttpOnly cookies and server components. Focus on: security vulnerabilities, token handling, and SSR compatibility. Our team follows Airbnb style guide.', rank: 1, explanation: 'Provides the tech stack, auth approach, specific review focus areas, and coding standards.' },
      { text: 'Review this pull request for our React authentication feature. Look for security issues and code quality problems.', rank: 2, explanation: 'Identifies the review goals but omits the tech stack, auth method, and coding standards.' },
      { text: 'Review this code and tell me if it looks good.', rank: 3, explanation: 'No project context, review criteria, or technology details provided.' },
    ],
    skill: 'context',
    skills: { prompting: 0.8, concepts: 0.3, tools: 0.3, criticalThinking: 0.3, ethics: 0.2 },
  },
  {
    id: 'crit-adv-04',
    difficulty: 'advanced',
    task: 'Ask AI to synthesize findings from multiple research papers on remote work productivity',
    prompts: [
      { text: 'I have 5 studies on remote work productivity (2020-2024) with conflicting results. As an organizational psychology researcher, synthesize the key findings, identify where studies agree and disagree, and highlight methodological differences that explain conflicting results.', rank: 1, explanation: 'Sets a clear expert role, time range, and asks for nuanced synthesis addressing contradictions.' },
      { text: 'Summarize what research says about remote work productivity. Note where studies agree and disagree.', rank: 2, explanation: 'Asks for synthesis and conflict analysis but lacks the role framing and methodology focus.' },
      { text: 'What does research say about remote work?', rank: 3, explanation: 'Too broad — no focus on productivity, synthesis structure, or conflict analysis.' },
    ],
    skill: 'context',
    skills: { prompting: 0.8, concepts: 0.3, tools: 0.1, criticalThinking: 0.3, ethics: 0.1 },
  },
  {
    id: 'crit-adv-05',
    difficulty: 'advanced',
    task: 'Prompt AI to generate a database migration script',
    prompts: [
      { text: 'Write a PostgreSQL migration that adds a "subscriptions" table with columns: id (UUID, PK), user_id (FK to users), plan (enum: free/pro/enterprise), starts_at, ends_at (timestamps). Include an index on user_id, a CHECK constraint ensuring ends_at > starts_at, and a rollback script.', rank: 1, explanation: 'Specifies every column, data types, constraints, indexes, and includes a rollback requirement.' },
      { text: 'Write a PostgreSQL migration to add a subscriptions table. Include user_id as a foreign key, plan type, and start/end dates. Add a rollback.', rank: 2, explanation: 'Covers the table structure broadly but leaves data types, constraints, and indexes unspecified.' },
      { text: 'Write a SQL migration for a subscriptions feature.', rank: 3, explanation: 'No database type, schema details, constraints, or rollback requirements.' },
    ],
    skill: 'constraints',
    skills: { prompting: 0.9, concepts: 0.2, tools: 0.3, criticalThinking: 0.2, ethics: 0.1 },
  },
  {
    id: 'crit-adv-06',
    difficulty: 'advanced',
    task: 'Ask AI to convert unstructured meeting notes into structured action items',
    prompts: [
      { text: 'Extract action items from these meeting notes. For each, include: owner, deadline, and priority (high/medium/low). Example input: "John will finalize the budget by Friday" → Output: "Action: Finalize budget | Owner: John | Deadline: Friday | Priority: High." Now process these notes.', rank: 1, explanation: 'The example demonstrates the exact input-to-output mapping, field names, and formatting.' },
      { text: 'Extract action items from these meeting notes. List each with an owner and deadline in a structured format.', rank: 2, explanation: 'Defines the fields but does not show the desired output format with an example.' },
      { text: 'Summarize the action items from this meeting.', rank: 3, explanation: 'Does not specify the output structure, fields, or format.' },
    ],
    skill: 'few-shot',
    skills: { prompting: 0.9, concepts: 0.2, tools: 0.2, criticalThinking: 0.2, ethics: 0.1 },
  },
  {
    id: 'crit-adv-07',
    difficulty: 'advanced',
    task: 'Ask AI to diagnose why a microservices architecture is experiencing cascading failures',
    prompts: [
      { text: 'Our e-commerce platform has 12 microservices. The order service times out, then payment and inventory services fail too. Walk through the diagnosis step by step: identify the failure chain, check for missing circuit breakers, evaluate retry policies, and recommend fixes in priority order.', rank: 1, explanation: 'Provides the architecture scope, symptoms, and a structured diagnostic framework to follow.' },
      { text: 'Our microservices are failing in a cascade after the order service times out. What is wrong and how do we fix it?', rank: 2, explanation: 'Describes the symptom well but does not guide the AI through a structured diagnostic process.' },
      { text: 'Our services keep crashing. What should we do?', rank: 3, explanation: 'No architecture details, symptoms, or reasoning structure for diagnosis.' },
    ],
    skill: 'chain-of-thought',
    skills: { prompting: 0.8, concepts: 0.3, tools: 0.2, criticalThinking: 0.3, ethics: 0.1 },
  },
  {
    id: 'crit-adv-08',
    difficulty: 'advanced',
    task: 'Ask AI to evaluate the tradeoffs of choosing a monorepo vs polyrepo for a growing engineering team',
    prompts: [
      { text: 'We are a 30-person engineering team with 8 services, currently in separate repos. Evaluate monorepo vs polyrepo step by step: consider CI/CD complexity, code sharing, dependency management, team autonomy, and onboarding. Weigh each factor for our scale, then recommend an approach with migration risks.', rank: 1, explanation: 'Gives team context, lists specific evaluation criteria, and requests a weighted recommendation.' },
      { text: 'Should our engineering team switch to a monorepo? We have about 8 services in separate repos. What are the pros and cons?', rank: 2, explanation: 'Provides basic context and asks for tradeoffs but does not structure the evaluation criteria.' },
      { text: 'Monorepo or polyrepo — which is better?', rank: 3, explanation: 'No team or project context, and asks for a binary answer without tradeoff analysis.' },
    ],
    skill: 'chain-of-thought',
    skills: { prompting: 0.8, concepts: 0.3, tools: 0.2, criticalThinking: 0.3, ethics: 0.1 },
  },
];
