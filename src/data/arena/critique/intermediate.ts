import type { CritiqueRound } from '@/lib/types';

export const intermediateCritiqueRounds: CritiqueRound[] = [
  {
    id: 'crit-int-01',
    difficulty: 'intermediate',
    task: 'Write a product description for a new wireless earbud',
    prompts: [
      { text: 'Write a product description for wireless earbuds that highlights noise cancellation, 8-hour battery life, and water resistance. Use a conversational tone. Max 80 words.', rank: 1, explanation: 'Lists key features, defines tone, and sets a word limit for focused output.' },
      { text: 'Write a product description for wireless earbuds. Make it sound good and mention the features.', rank: 2, explanation: 'Requests features and quality but leaves tone and length undefined.' },
      { text: 'Describe some earbuds for a store.', rank: 3, explanation: 'Missing product details, tone, audience, and format constraints.' },
    ],
    skill: 'specificity',
    skills: { prompting: 0.9, concepts: 0.2, tools: 0.1, criticalThinking: 0.2, ethics: 0.1 },
  },
  {
    id: 'crit-int-02',
    difficulty: 'intermediate',
    task: 'Create a social media ad caption for a fitness app launch',
    prompts: [
      { text: 'Write a caption for our fitness app.', rank: 3, explanation: 'No platform, audience, tone, or feature information provided.' },
      { text: 'Write an Instagram caption for our new fitness app that targets busy professionals. Mention the 5-minute workout feature and include a call to action.', rank: 1, explanation: 'Specifies platform, audience, key feature, and required elements.' },
      { text: 'Write an upbeat social media post about a new fitness app with short workouts. Keep it catchy.', rank: 2, explanation: 'Has tone and feature info but lacks platform-specific guidance and a clear CTA request.' },
    ],
    skill: 'specificity',
    skills: { prompting: 0.9, concepts: 0.2, tools: 0.2, criticalThinking: 0.2, ethics: 0.1 },
  },
  {
    id: 'crit-int-03',
    difficulty: 'intermediate',
    task: 'Write API documentation for a user authentication endpoint',
    prompts: [
      { text: 'Document our login API endpoint.', rank: 3, explanation: 'No details about the endpoint, expected format, or audience.' },
      { text: 'Write API docs for a POST /auth/login endpoint that accepts email and password in JSON and returns a JWT token. Include request/response examples.', rank: 1, explanation: 'Provides the HTTP method, path, payload, response type, and requests examples.' },
      { text: 'Write documentation for our authentication API. It uses JWT tokens and has login functionality.', rank: 2, explanation: 'Gives some technical context but omits endpoint specifics and format requirements.' },
    ],
    skill: 'context',
    skills: { prompting: 0.8, concepts: 0.3, tools: 0.3, criticalThinking: 0.2, ethics: 0.1 },
  },
  {
    id: 'crit-int-04',
    difficulty: 'intermediate',
    task: 'Ask AI to write a SQL query analyzing monthly sales trends',
    prompts: [
      { text: 'We have a PostgreSQL "orders" table with columns: id, customer_id, amount, created_at. Write a query that shows total revenue and order count per month for 2024, sorted chronologically.', rank: 1, explanation: 'Provides the database type, schema, columns, time range, metrics, and sort order.' },
      { text: 'Write a SQL query to show monthly sales from our orders table with the amount and date columns.', rank: 2, explanation: 'Mentions the table and columns but lacks the database type, exact column names, and output format.' },
      { text: 'Write a SQL query for sales data.', rank: 3, explanation: 'Far too vague — no table structure, database type, or analysis goal specified.' },
    ],
    skill: 'context',
    skills: { prompting: 0.8, concepts: 0.3, tools: 0.3, criticalThinking: 0.2, ethics: 0.1 },
  },
  {
    id: 'crit-int-05',
    difficulty: 'intermediate',
    task: 'Generate a tagline for an eco-friendly water bottle brand',
    prompts: [
      { text: 'Create a tagline for a water bottle company.', rank: 3, explanation: 'Does not mention the eco-friendly angle or any brand constraints.' },
      { text: 'Generate 5 taglines for an eco-friendly water bottle brand targeting millennials. Max 8 words each. Tone: playful but purposeful. Avoid clichés like "save the planet."', rank: 1, explanation: 'Sets count, audience, length, tone, and an exclusion constraint for original results.' },
      { text: 'Write a catchy tagline for a sustainable water bottle. Keep it short and appealing to young people.', rank: 2, explanation: 'Captures the eco angle and audience but lacks specific length, count, or exclusion constraints.' },
    ],
    skill: 'constraints',
    skills: { prompting: 0.9, concepts: 0.1, tools: 0.1, criticalThinking: 0.2, ethics: 0.2 },
  },
  {
    id: 'crit-int-06',
    difficulty: 'intermediate',
    task: 'Get AI to rewrite formal text into a casual blog tone',
    prompts: [
      { text: 'Make this text more casual.', rank: 3, explanation: 'No example of what casual means in this context, leaving the output unpredictable.' },
      { text: 'Rewrite formal text in a casual blog style. Example: "The results indicate a significant improvement" → "Turns out, things got way better." Now rewrite: "Quarterly revenue exceeded projections by 12%."', rank: 1, explanation: 'The before-and-after example clearly demonstrates the exact tone shift expected.' },
      { text: 'Rewrite this formal sentence in a casual, friendly blog tone: "Quarterly revenue exceeded projections by 12%."', rank: 2, explanation: 'Defines the desired tone well but does not demonstrate the transformation with an example.' },
    ],
    skill: 'few-shot',
    skills: { prompting: 0.9, concepts: 0.2, tools: 0.1, criticalThinking: 0.2, ethics: 0.1 },
  },
  {
    id: 'crit-int-07',
    difficulty: 'intermediate',
    task: 'Ask AI to evaluate whether a business should expand to a new city',
    prompts: [
      { text: 'Should we open a new store in Austin?', rank: 3, explanation: 'Asks for a yes/no answer with no framework for analysis.' },
      { text: 'Our coffee chain has 10 locations in Dallas. We are considering Austin. Analyze this decision step by step: market demand, competition, costs, and risks. Then give a recommendation.', rank: 1, explanation: 'Provides business context, specifies the reasoning steps, and asks for a structured conclusion.' },
      { text: 'Help me decide if our coffee shop should expand to Austin. Consider the pros and cons.', rank: 2, explanation: 'Asks for analysis but does not structure the reasoning steps or provide business context.' },
    ],
    skill: 'chain-of-thought',
    skills: { prompting: 0.8, concepts: 0.2, tools: 0.1, criticalThinking: 0.3, ethics: 0.1 },
  },
  {
    id: 'crit-int-08',
    difficulty: 'intermediate',
    task: 'Ask AI to determine the best pricing strategy for a SaaS product',
    prompts: [
      { text: 'What should I charge for my app?', rank: 3, explanation: 'No product details, market info, or reasoning framework provided.' },
      { text: 'I am launching a project management SaaS for small teams (5-20 people). Competitors charge $8-15/user/month. Think through the pricing step by step: consider value proposition, competitor positioning, and customer willingness to pay. Recommend a price with your reasoning.', rank: 1, explanation: 'Supplies market context and explicitly requests a step-by-step reasoning chain to a conclusion.' },
      { text: 'Help me price my project management SaaS. Competitors charge around $10/user/month. What is a good price?', rank: 2, explanation: 'Provides useful context but does not request structured reasoning before the recommendation.' },
    ],
    skill: 'chain-of-thought',
    skills: { prompting: 0.8, concepts: 0.2, tools: 0.1, criticalThinking: 0.3, ethics: 0.1 },
  },
];
