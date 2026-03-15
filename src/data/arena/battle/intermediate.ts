import type { BattleRound } from '@/lib/types';

export const intermediateBattleRounds: BattleRound[] = [
  {
    id: 'battle-int-01',
    difficulty: 'intermediate',
    task: 'Get AI to write a product description for a new wireless earbud',
    promptA: {
      text: 'Write a product description for wireless earbuds. Make it sound good and mention battery life.',
      output: 'Introducing our new wireless earbuds! These sleek earbuds deliver incredible sound quality with deep bass and crystal-clear highs. With an impressive battery life, you can enjoy music all day long. Perfect for workouts, commutes, and everyday listening.',
    },
    promptB: {
      text: 'Write a 60-word product description for the NovaBuds Pro earbuds targeting fitness enthusiasts. Highlight: 12-hour battery, IPX7 waterproof, 8mm drivers. Tone: energetic but not cheesy.',
      output: 'Push every rep with NovaBuds Pro in your ears. Equipped with 8mm precision drivers, they deliver studio-grade sound that keeps you locked in. IPX7 waterproof rating means sweat and rain won\'t slow you down. And with 12 hours of battery life, they\'ll outlast your longest training days. Your workout deserves this upgrade.',
    },
    winner: 'B',
    explanation: 'Prompt B specifies the product name, target audience, exact features, word count, and tone — giving the AI enough specificity to produce copy that actually sells rather than generic filler.',
    skill: 'specificity',
    skills: { prompting: 0.9, concepts: 0.2, tools: 0.1, criticalThinking: 0.2, ethics: 0.1 },
  },
  {
    id: 'battle-int-02',
    difficulty: 'intermediate',
    task: 'Get AI to review a Python function for potential issues',
    promptA: {
      text: 'Review this Python function that processes user uploads: `def upload(file): data = open(file).read(); db.execute("INSERT INTO files VALUES (\'" + data + "\')"); return "ok"`. I\'m concerned about security and resource management.',
      output: 'This function has several issues. First, it\'s vulnerable to SQL injection — the raw data is concatenated into the query. Use parameterized queries instead. Second, the file handle is never closed; use a `with` statement. Third, there\'s no input validation on file type or size, which could allow malicious uploads. Finally, returning a bare string gives no useful feedback to the caller.',
    },
    promptB: {
      text: 'Review this Python function that processes user uploads: `def upload(file): data = open(file).read(); db.execute("INSERT INTO files VALUES (\'" + data + "\')"); return "ok"`. Is this good code?',
      output: 'The function works but could be improved. You should add error handling in case the file doesn\'t exist. Also, consider using a `with` statement for the file. Otherwise, it\'s a straightforward upload function that gets the job done.',
    },
    winner: 'A',
    explanation: 'Prompt A provides context about what concerns matter (security, resource management), guiding the AI to focus on the critical SQL injection and resource leak issues instead of giving a surface-level review.',
    skill: 'context',
    skills: { prompting: 0.8, concepts: 0.3, tools: 0.2, criticalThinking: 0.3, ethics: 0.1 },
  },
  {
    id: 'battle-int-03',
    difficulty: 'intermediate',
    task: 'Get AI to create social media captions for a bakery\'s new menu item',
    promptA: {
      text: 'Write 3 Instagram captions for a bakery launching a matcha croissant. Each caption must be under 30 words, include one emoji, and end with a call to action. No puns.',
      output: '1) Our new matcha croissant layers buttery pastry with earthy Japanese matcha. Flaky, vibrant, unforgettable. Come taste it before they sell out. 🍵\n2) Matcha meets croissant in a combination that just works. Bold flavor, delicate texture, made fresh daily. Order yours this weekend. 💚\n3) We spent months perfecting this one. Real matcha, real butter, real craft. Stop by and try our newest obsession. ✨',
    },
    promptB: {
      text: 'Write some Instagram posts about our new matcha croissant. Make them fun and catchy!',
      output: 'Match-a made in heaven! 🍵💚✨ Our new matcha croissant is HERE and it\'s giving major main character energy! Flaky, green, and oh-so-dreamy. Who else is obsessed?! Drop a 💚 if you\'re trying this! #MatchaCroissant #BakeryLife #FoodieFinds',
    },
    winner: 'A',
    explanation: 'Prompt A sets clear constraints — word count, emoji limit, call to action, no puns — that force focused, professional output. Without constraints, the AI defaults to generic social media cliches.',
    skill: 'constraints',
    skills: { prompting: 0.9, concepts: 0.2, tools: 0.1, criticalThinking: 0.2, ethics: 0.1 },
  },
  {
    id: 'battle-int-04',
    difficulty: 'intermediate',
    task: 'Get AI to classify customer support tickets by urgency level',
    promptA: {
      text: 'Classify these support tickets as Low, Medium, or High urgency. Example: "I can\'t log in and my presentation is in 1 hour" → High. "How do I change my profile picture?" → Low. Tickets: 1) "Payment was charged twice" 2) "Can you add dark mode?" 3) "Site is down and we go live tomorrow"',
      output: '1) "Payment was charged twice" → High — involves financial impact that needs immediate resolution.\n2) "Can you add dark mode?" → Low — a feature request with no time pressure.\n3) "Site is down and we go live tomorrow" → High — service outage with an imminent deadline.',
    },
    promptB: {
      text: 'Sort these support tickets by urgency: 1) "Payment was charged twice" 2) "Can you add dark mode?" 3) "Site is down and we go live tomorrow"',
      output: '1) "Site is down and we go live tomorrow" — most urgent.\n2) "Payment was charged twice" — also urgent.\n3) "Can you add dark mode?" — least urgent.',
    },
    winner: 'A',
    explanation: 'Prompt A uses few-shot examples to define the exact classification labels and criteria, so the AI produces consistent, labeled output rather than vague relative ordering.',
    skill: 'few-shot',
    skills: { prompting: 0.9, concepts: 0.3, tools: 0.1, criticalThinking: 0.2, ethics: 0.1 },
  },
  {
    id: 'battle-int-05',
    difficulty: 'intermediate',
    task: 'Get AI to help choose between two JavaScript frameworks for a project',
    promptA: {
      text: 'React or Vue for a dashboard app with real-time data, a 3-person team (2 know React), and a 6-week deadline? Think step by step: consider team skills, project needs, and timeline, then recommend one.',
      output: 'Let me work through this. Team skills: 2 of 3 developers already know React, so there\'s minimal ramp-up time. Project needs: both frameworks handle real-time data well, but React\'s ecosystem has more mature dashboard libraries like Recharts and React Query. Timeline: with 6 weeks, learning a new framework would eat into development time. Recommendation: React — leveraging existing team expertise and its rich ecosystem is the pragmatic choice given your tight deadline.',
    },
    promptB: {
      text: 'Should I use React or Vue for my project? What are the pros and cons?',
      output: 'React has a larger ecosystem and more job market demand, while Vue has a gentler learning curve and cleaner syntax. React uses JSX, Vue uses templates. Both are great choices — it depends on your team and project requirements.',
    },
    winner: 'A',
    explanation: 'Prompt A uses chain-of-thought by asking the AI to reason through specific factors step by step, resulting in a grounded recommendation instead of a generic comparison.',
    skill: 'chain-of-thought',
    skills: { prompting: 0.8, concepts: 0.3, tools: 0.2, criticalThinking: 0.3, ethics: 0.1 },
  },
];
