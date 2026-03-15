import type { OptimizeChallenge } from '@/lib/types';

export const beginnerOptimizeChallenges: OptimizeChallenge[] = [
  {
    id: 'opt-beg-01',
    difficulty: 'beginner',
    task: 'Generate a weekly meal plan for a vegetarian athlete',
    steps: [
      {
        prompt: 'Make me a meal plan',
        output: 'Here is a meal plan: Monday - Breakfast: cereal, Lunch: sandwich, Dinner: pasta. Tuesday - Breakfast: toast...',
        options: [
          { text: 'Add "for a vegetarian athlete needing 2800 calories per day"', isCorrect: true, explanation: 'Adding specific dietary needs and calorie target gives the AI crucial constraints.' },
          { text: 'Add "please make it really good and detailed"', isCorrect: false, explanation: 'Vague quality requests don\'t give the AI actionable guidance.' },
          { text: 'Add "use bullet points"', isCorrect: false, explanation: 'Formatting helps but doesn\'t address the missing dietary requirements.' },
        ],
        skill: 'specificity',
      },
      {
        prompt: 'Create a weekly meal plan for a vegetarian athlete needing 2800 calories per day',
        output: 'Monday: Breakfast - Oatmeal with nuts and berries (600 cal). Lunch - Quinoa bowl with roasted vegetables and tofu (700 cal)...',
        options: [
          { text: 'Add "Format as a table with columns for meal, ingredients, calories, and protein"', isCorrect: true, explanation: 'Specifying output format makes the result immediately actionable and easy to follow.' },
          { text: 'Add "Make sure it tastes good"', isCorrect: false, explanation: 'Subjective quality requests are too vague for AI to act on meaningfully.' },
          { text: 'Add "Write it in a friendly tone"', isCorrect: false, explanation: 'Tone is less important than structure for a practical meal plan.' },
        ],
        skill: 'constraints',
      },
    ],
    skills: { prompting: 0.9, concepts: 0.2, tools: 0.2, criticalThinking: 0.3, ethics: 0.1 },
  },
  {
    id: 'opt-beg-02',
    difficulty: 'beginner',
    task: 'Get travel advice for a family trip to Japan',
    steps: [
      {
        prompt: 'Tell me about Japan',
        output: 'Japan is an island nation in East Asia known for its rich culture, technology, and cuisine. The capital is Tokyo...',
        options: [
          { text: 'Add "Plan a 10-day family trip to Japan with two kids under 10, visiting in April"', isCorrect: true, explanation: 'Specifying trip length, family composition, and timing gives the AI the context needed for relevant advice.' },
          { text: 'Add "Tell me everything I need to know"', isCorrect: false, explanation: 'Asking for "everything" is too broad and will produce an unfocused response.' },
          { text: 'Add "Make it interesting"', isCorrect: false, explanation: 'This is subjective and doesn\'t help the AI understand what you actually need.' },
        ],
        skill: 'context',
      },
      {
        prompt: 'Plan a 10-day family trip to Japan with two kids under 10, visiting in April',
        output: 'Day 1-3: Tokyo - Visit Ueno Zoo, TeamLab Borderless, and Senso-ji temple. Day 4-5: Hakone - Hot springs and lake cruise...',
        options: [
          { text: 'Add "Include estimated daily budget in USD, kid-friendly restaurant recommendations, and transit tips"', isCorrect: true, explanation: 'Adding specific practical details makes the itinerary usable without further research.' },
          { text: 'Add "Make it a really fun trip"', isCorrect: false, explanation: '"Fun" is subjective and doesn\'t tell the AI what practical information to include.' },
          { text: 'Add "Use emojis to make it colorful"', isCorrect: false, explanation: 'Visual styling doesn\'t improve the usefulness of the travel advice.' },
        ],
        skill: 'specificity',
      },
    ],
    skills: { prompting: 0.8, concepts: 0.3, tools: 0.1, criticalThinking: 0.3, ethics: 0.1 },
  },
  {
    id: 'opt-beg-03',
    difficulty: 'beginner',
    task: 'Create a study guide for a biology exam on cell structure',
    steps: [
      {
        prompt: 'Help me study biology',
        output: 'Biology is the study of living organisms. Key topics include cells, genetics, evolution, and ecology. You should review your textbook...',
        options: [
          { text: 'Add "Create a study guide for a high school biology exam on cell organelles and their functions"', isCorrect: true, explanation: 'Narrowing the topic and specifying the level ensures the AI produces targeted, relevant content.' },
          { text: 'Add "Give me all the biology facts"', isCorrect: false, explanation: 'Asking for "all facts" is impossibly broad and won\'t help you study effectively.' },
          { text: 'Add "Make it easy to understand"', isCorrect: false, explanation: 'Without specifying the topic, even simple language won\'t help you prepare for a specific exam.' },
        ],
        skill: 'specificity',
      },
      {
        prompt: 'Create a study guide for a high school biology exam on cell organelles and their functions',
        output: 'Cell Organelles: 1) Nucleus - contains DNA and controls cell activities. 2) Mitochondria - produces energy through cellular respiration...',
        options: [
          { text: 'Add "Include a comparison table, 3 practice questions per organelle, and common exam trick questions"', isCorrect: true, explanation: 'Requesting specific study tools like tables and practice questions creates an active learning resource.' },
          { text: 'Add "Make it longer and more thorough"', isCorrect: false, explanation: 'Length doesn\'t equal quality — specific structural requests are more useful than asking for more text.' },
          { text: 'Add "Use simple words"', isCorrect: false, explanation: 'Simplifying language is less impactful than adding study-specific structures like practice questions.' },
        ],
        skill: 'constraints',
      },
    ],
    skills: { prompting: 0.8, concepts: 0.3, tools: 0.1, criticalThinking: 0.4, ethics: 0.1 },
  },
  {
    id: 'opt-beg-04',
    difficulty: 'beginner',
    task: 'Write a professional email declining a meeting invitation',
    steps: [
      {
        prompt: 'Write an email saying no to a meeting',
        output: 'Subject: No. Hi, I can\'t come to the meeting. Sorry. Best regards.',
        options: [
          { text: 'Add "Politely decline a recurring Wednesday 2pm meeting with my manager because it conflicts with a client call, and suggest Thursday instead"', isCorrect: true, explanation: 'Providing the reason, relationship, and alternative gives the AI context to craft an appropriate response.' },
          { text: 'Add "Make it sound professional"', isCorrect: false, explanation: '"Professional" is vague — the AI needs specific context like who, why, and what alternative to suggest.' },
          { text: 'Add "Write more sentences"', isCorrect: false, explanation: 'More sentences without context will just add filler, not substance.' },
        ],
        skill: 'context',
      },
      {
        prompt: 'Write a polite email declining a recurring Wednesday 2pm meeting with my manager because it conflicts with a client call, and suggest Thursday instead',
        output: 'Subject: Request to Reschedule Wednesday Meeting. Hi [Manager], I have a recurring client call that conflicts with our Wednesday 2pm slot. Would Thursday at the same time work for you?...',
        options: [
          { text: 'Add "Keep it under 4 sentences, maintain a warm but professional tone, and include an offer to send meeting notes if I miss any sessions"', isCorrect: true, explanation: 'Adding length constraints and a thoughtful gesture shows professionalism and keeps the email concise.' },
          { text: 'Add "Use fancy vocabulary"', isCorrect: false, explanation: 'Overly formal language can sound stiff — clear constraints on length and tone are more useful.' },
          { text: 'Add "Add a subject line"', isCorrect: false, explanation: 'The AI already included a subject line; this doesn\'t improve the email content.' },
        ],
        skill: 'constraints',
      },
    ],
    skills: { prompting: 0.8, concepts: 0.2, tools: 0.1, criticalThinking: 0.3, ethics: 0.2 },
  },
];
