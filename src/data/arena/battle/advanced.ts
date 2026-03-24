import type { BattleRound } from '@/lib/types';

export const advancedBattleRounds: BattleRound[] = [
  {
    id: 'battle-adv-01',
    difficulty: 'advanced',
    task: 'Get AI to write a system prompt for a customer service chatbot that handles refund requests',
    promptA: {
      text: 'You are a helpful customer service agent for ReturnEase. Please handle all refund requests in a polite and professional manner. Always be friendly and follow our company policies when assisting customers.',
      output: 'I\'d be happy to help you with your refund! Could you please provide your order number? Once I have that, I\'ll look into the details and guide you through our refund process. We want to make sure you\'re taken care of.',
    },
    promptB: {
      text: 'You are a customer service agent for ReturnEase. For refund requests: 1) Confirm the order number and purchase date. 2) If within 30 days, approve and state 5-7 business day timeline. 3) If over 30 days, offer store credit instead. Never promise exceptions you cannot guarantee. Tone: warm but concise.',
      output: 'I\'d be glad to help with your refund. Could you share your order number and the date of purchase? If your order is within our 30-day window, I can process a full refund — you\'ll see it back in 5-7 business days. If it\'s been longer, I can offer you store credit for the full amount instead.',
    },
    winner: 'B',
    explanation: 'Prompt B defines a specific decision tree with concrete policies (30-day window, timelines, store credit fallback) and a behavioral guardrail. Prompt A sounds professional but "follow company policies" gives the AI nothing to enforce — it doesn\'t know the policies.',
    skill: 'specificity',
    skills: { prompting: 1.0, concepts: 0.3, tools: 0.2, criticalThinking: 0.2, ethics: 0.2 },
  },
  {
    id: 'battle-adv-02',
    difficulty: 'advanced',
    task: 'Get AI to analyze why a SaaS company\'s free-to-paid conversion rate dropped',
    promptA: {
      text: 'Our SaaS free trial conversion rate dropped from 12% to 7% after we redesigned the onboarding flow last quarter. Analyze potential causes considering UX changes, competitive landscape, and customer psychology.',
      output: 'The drop likely stems from multiple factors. UX-wise, the new onboarding may introduce friction — if users don\'t reach the "aha moment" quickly, they churn before converting. A longer or more complex flow could delay value realization. Competitively, rivals may have introduced free tiers that reduce urgency to commit. Psychologically, if the new flow front-loads feature education over hands-on use, users feel overwhelmed rather than empowered. I\'d recommend A/B testing the old vs. new flow and checking time-to-first-value metrics.',
    },
    promptB: {
      text: 'Our SaaS free trial conversion rate dropped from 12% to 7% and we recently changed our onboarding process. Can you help us understand what might have gone wrong and give us some ideas about how to investigate?',
      output: 'Several things could have caused the drop. The new onboarding might be confusing or too long. Users might not understand the product\'s value quickly enough. You may also have changed pricing or trial length at the same time. I\'d recommend looking at user feedback and analytics to find where users are dropping off in the funnel.',
    },
    winner: 'A',
    explanation: 'Prompt A explicitly names the analytical lenses (UX, competition, psychology), giving the AI a multi-dimensional framework. Prompt B describes the same problem but doesn\'t guide the analysis, so the AI produces surface-level guesses.',
    skill: 'context',
    skills: { prompting: 0.8, concepts: 0.3, tools: 0.1, criticalThinking: 0.3, ethics: 0.1 },
  },
  {
    id: 'battle-adv-03',
    difficulty: 'advanced',
    task: 'Get AI to write a short story opening that hooks the reader',
    promptA: {
      text: 'Write the opening paragraph of a literary short story. Setting: a laundromat at 2 AM. Constraint: the narrator discovers something hidden in a dryer. Style: Raymond Carver — spare prose, no adjective clusters, dialogue drives tension. Under 80 words.',
      output: 'The dryer in the back row was still running when I walked in. Nobody else around. I opened it to toss my stuff in and found a ziplock bag taped to the drum. Inside was a phone and a folded note. The note said: "If you found this, don\'t call the number. Just put it back." I stood there holding it, the fluorescent lights buzzing overhead.',
    },
    promptB: {
      text: 'Write the opening paragraph of a literary short story set in a laundromat very late at night. I want it to be mysterious, engaging, atmospheric, and suspenseful. Use vivid imagery and descriptive language to draw the reader in.',
      output: 'The old laundromat hummed with the rhythmic churning of forgotten machines, their circular windows glowing like sleepy eyes in the dim fluorescent light. At 2 AM, the place had an eerie, almost magical quality — shadows danced across the cracked linoleum floor as a lone figure stepped inside, drawn by something inexplicable, a feeling that tonight would be different from all the others.',
    },
    winner: 'A',
    explanation: 'Prompt A constrains the style (Carver-esque minimalism), the plot catalyst, and word count. This forces tight, tension-driven prose. Prompt B asks for "vivid imagery" and "descriptive language" — encouraging purple prose that tells rather than shows.',
    skill: 'constraints',
    skills: { prompting: 0.9, concepts: 0.2, tools: 0.1, criticalThinking: 0.2, ethics: 0.1 },
  },
  {
    id: 'battle-adv-04',
    difficulty: 'advanced',
    task: 'Get AI to generate SQL queries from natural language questions about a database',
    promptA: {
      text: 'Convert natural language to SQL for a database with tables: users(id, name, email, created_at), orders(id, user_id, total, status, created_at). Examples:\n"How many users signed up last month?" → SELECT COUNT(*) FROM users WHERE created_at >= DATE_TRUNC(\'month\', CURRENT_DATE - INTERVAL \'1 month\')\n"Show top spenders" → SELECT u.name, SUM(o.total) as total_spent FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.name ORDER BY total_spent DESC LIMIT 10\nNow convert: "Which users have pending orders over $100?"',
      output: 'SELECT u.name, u.email, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE o.status = \'pending\' AND o.total > 100;',
    },
    promptB: {
      text: 'I have a database with a users table (id, name, email, created_at) and an orders table (id, user_id, total, status, created_at). Please write a SQL query that finds all users who currently have pending orders that are worth more than $100.',
      output: 'SELECT users.name, orders.total FROM users INNER JOIN orders ON users.id = orders.user_id WHERE orders.status = \'pending\' AND orders.total > 100;',
    },
    winner: 'A',
    explanation: 'Both produce similar SQL, but Prompt A\'s few-shot examples establish the exact query style, alias conventions, and function usage. This approach scales — the same prompt pattern handles any future question consistently without re-explaining the schema.',
    skill: 'few-shot',
    skills: { prompting: 0.9, concepts: 0.3, tools: 0.2, criticalThinking: 0.2, ethics: 0.1 },
  },
  {
    id: 'battle-adv-05',
    difficulty: 'advanced',
    task: 'Get AI to evaluate whether a startup should pivot from B2C to B2B',
    promptA: {
      text: 'We run a B2C fitness app and are considering a pivot to B2B. Can you analyze whether this would be a good strategic move for us? We want a thorough evaluation of the opportunity and what it would take.',
      output: 'Pivoting to B2B can offer higher contract values, more predictable revenue, and lower churn. However, it requires longer sales cycles, enterprise features like SSO and admin dashboards, and a different marketing approach. Consider whether your product solves a business pain point and whether you have the resources to support enterprise clients. I\'d recommend validating with a few pilot customers first.',
    },
    promptB: {
      text: 'Our B2C fitness app has 50K users but only 2% paid conversion. Enterprise clients have approached us about licensing. Evaluate the pivot step by step: first assess current B2C viability, then B2B opportunity strength, then resource requirements, and finally give a weighted recommendation.',
      output: 'Step 1 — B2C viability: 2% conversion on 50K users yields ~1,000 paying users. Unless ARPU is high, this is likely below sustainability. Growth would need to be 5-10x to build a viable B2C business. Step 2 — B2B opportunity: inbound enterprise interest is a strong signal — it means the product solves a real business problem without you pushing it. Step 3 — Resources: B2B requires admin dashboards, SSO, and a sales process, likely 3-6 months of engineering. Step 4 — Recommendation: the B2B signal is strong and B2C metrics are weak. I\'d recommend a phased pivot — start licensing while maintaining the B2C product as a lead-generation funnel.',
    },
    winner: 'B',
    explanation: 'Prompt B uses chain-of-thought to force structured reasoning through four explicit evaluation stages with real data (50K users, 2% conversion, inbound enterprise interest). Prompt A asks for a "thorough evaluation" without providing any data for the AI to reason about.',
    skill: 'chain-of-thought',
    skills: { prompting: 0.8, concepts: 0.3, tools: 0.1, criticalThinking: 0.3, ethics: 0.1 },
  },
];
