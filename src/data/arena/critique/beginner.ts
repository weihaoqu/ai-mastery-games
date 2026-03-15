import type { CritiqueRound } from '@/lib/types';

export const beginnerCritiqueRounds: CritiqueRound[] = [
  {
    id: 'crit-beg-01',
    difficulty: 'beginner',
    task: 'Write a professional email declining a meeting invitation',
    prompts: [
      { text: 'Write an email saying no to a meeting.', rank: 3, explanation: 'Too vague — no tone, context, or format guidance.' },
      { text: 'Write a polite, professional email declining a meeting invitation due to a scheduling conflict. Keep it under 100 words.', rank: 1, explanation: 'Specific tone, reason, and length constraint make this the strongest prompt.' },
      { text: 'Write a professional email about a meeting.', rank: 2, explanation: 'Mentions professional tone but does not specify the action or constraints.' },
    ],
    skill: 'specificity',
    skills: { prompting: 0.9, concepts: 0.2, tools: 0.1, criticalThinking: 0.3, ethics: 0.1 },
  },
  {
    id: 'crit-beg-02',
    difficulty: 'beginner',
    task: 'Summarize a news article about climate change for a general audience',
    prompts: [
      { text: 'Summarize this article.', rank: 3, explanation: 'No indication of audience, length, or focus area.' },
      { text: 'Summarize this climate change article in 3 bullet points for someone with no science background.', rank: 1, explanation: 'Specifies the topic, format, length, and target audience clearly.' },
      { text: 'Summarize this climate change article briefly.', rank: 2, explanation: 'Mentions the topic but lacks audience or format details.' },
    ],
    skill: 'specificity',
    skills: { prompting: 0.9, concepts: 0.2, tools: 0.1, criticalThinking: 0.2, ethics: 0.1 },
  },
  {
    id: 'crit-beg-03',
    difficulty: 'beginner',
    task: 'Translate a restaurant menu item from English to Spanish',
    prompts: [
      { text: 'You are helping a small Mexican restaurant create a bilingual menu. Translate "Grilled chicken with roasted vegetables" into natural Latin American Spanish.', rank: 1, explanation: 'Provides the business context and specifies the dialect, producing a more natural result.' },
      { text: 'Translate "Grilled chicken with roasted vegetables" to Spanish.', rank: 2, explanation: 'Clear task but lacks context about where or how the translation will be used.' },
      { text: 'Spanish for grilled chicken.', rank: 3, explanation: 'Incomplete — only covers part of the phrase and gives no context.' },
    ],
    skill: 'context',
    skills: { prompting: 0.8, concepts: 0.3, tools: 0.1, criticalThinking: 0.2, ethics: 0.1 },
  },
  {
    id: 'crit-beg-04',
    difficulty: 'beginner',
    task: 'Ask an AI to help write a birthday card message',
    prompts: [
      { text: 'Write a birthday message.', rank: 3, explanation: 'No information about the recipient, relationship, or desired tone.' },
      { text: 'Write a warm, funny birthday card message for my best friend who loves hiking. Keep it to 2-3 sentences.', rank: 1, explanation: 'Includes relationship, tone, a personal detail, and a length constraint.' },
      { text: 'Write a funny birthday card for a friend.', rank: 2, explanation: 'Specifies tone and recipient but lacks personal details or length guidance.' },
    ],
    skill: 'context',
    skills: { prompting: 0.8, concepts: 0.3, tools: 0.1, criticalThinking: 0.2, ethics: 0.1 },
  },
  {
    id: 'crit-beg-05',
    difficulty: 'beginner',
    task: 'Generate a list of healthy lunch ideas',
    prompts: [
      { text: 'Give me lunch ideas.', rank: 3, explanation: 'No dietary preferences, count, or health criteria specified.' },
      { text: 'List 5 healthy lunch ideas that are vegetarian, under 500 calories, and can be prepared in under 20 minutes.', rank: 1, explanation: 'Sets clear constraints on count, diet, calories, and prep time.' },
      { text: 'Give me some healthy lunch ideas that are easy to make.', rank: 2, explanation: 'Mentions health and ease but lacks specific measurable constraints.' },
    ],
    skill: 'constraints',
    skills: { prompting: 0.9, concepts: 0.1, tools: 0.1, criticalThinking: 0.2, ethics: 0.1 },
  },
  {
    id: 'crit-beg-06',
    difficulty: 'beginner',
    task: 'Ask AI to classify the sentiment of customer reviews',
    prompts: [
      { text: 'Tell me if these reviews are good or bad.', rank: 3, explanation: 'Does not demonstrate the desired output format or categories.' },
      { text: 'Classify each review as Positive, Negative, or Neutral. Example: "Great product!" → Positive. Now classify: "Shipping was slow but quality is fine."', rank: 1, explanation: 'Provides a clear example that teaches the AI the exact format and categories expected.' },
      { text: 'Classify these customer reviews by sentiment: positive, negative, or neutral.', rank: 2, explanation: 'Defines categories but does not show an example of the expected output format.' },
    ],
    skill: 'few-shot',
    skills: { prompting: 0.9, concepts: 0.2, tools: 0.1, criticalThinking: 0.2, ethics: 0.1 },
  },
  {
    id: 'crit-beg-07',
    difficulty: 'beginner',
    task: 'Get AI to explain why a plant might be wilting',
    prompts: [
      { text: 'My plant is dying. Fix it.', rank: 3, explanation: 'Demands a fix without describing symptoms or asking for reasoning.' },
      { text: 'My indoor basil plant is wilting despite daily watering. Walk me through possible causes step by step, starting with the most common.', rank: 1, explanation: 'Asks for step-by-step reasoning and provides specific details about the situation.' },
      { text: 'Why is my plant wilting? List some reasons.', rank: 2, explanation: 'Asks the right question but does not encourage structured reasoning or provide context.' },
    ],
    skill: 'chain-of-thought',
    skills: { prompting: 0.8, concepts: 0.2, tools: 0.1, criticalThinking: 0.3, ethics: 0.1 },
  },
  {
    id: 'crit-beg-08',
    difficulty: 'beginner',
    task: 'Ask AI to help debug why a simple web page is not displaying correctly',
    prompts: [
      { text: 'My website is broken.', rank: 3, explanation: 'No details about the problem, technology, or expected behavior.' },
      { text: 'My HTML page shows a blank screen. Walk me through how to diagnose this step by step, checking the most likely issues first.', rank: 1, explanation: 'Describes the symptom and explicitly requests step-by-step diagnostic reasoning.' },
      { text: 'My HTML page is not displaying right. What could be wrong?', rank: 2, explanation: 'Gives some context but does not ask for structured troubleshooting steps.' },
    ],
    skill: 'chain-of-thought',
    skills: { prompting: 0.8, concepts: 0.3, tools: 0.2, criticalThinking: 0.3, ethics: 0.1 },
  },
];
