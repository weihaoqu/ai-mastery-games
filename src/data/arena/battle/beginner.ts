import type { BattleRound } from '@/lib/types';

export const beginnerBattleRounds: BattleRound[] = [
  {
    id: 'battle-beg-01',
    difficulty: 'beginner',
    task: 'Get AI to write a thank-you email after a job interview',
    promptA: {
      text: 'Write a thank-you email after my interview for a marketing coordinator role at Bloom Agency. Mention the social media campaign we discussed. Keep it under 100 words.',
      output: 'Subject: Thank You — Marketing Coordinator Interview\n\nDear Hiring Team,\n\nThank you for taking the time to meet with me today about the Marketing Coordinator position. I especially enjoyed our conversation about the upcoming social media campaign for the spring launch. The creative direction Bloom Agency is taking really excites me, and I would love to contribute. Please don\'t hesitate to reach out if you need any additional information.\n\nBest regards,\n[Your Name]',
    },
    promptB: {
      text: 'Write a thank-you email.',
      output: 'Subject: Thank You\n\nHi,\n\nThank you for meeting with me. I enjoyed our conversation and am very interested in the position. I look forward to hearing from you soon.\n\nBest,\n[Your Name]',
    },
    winner: 'A',
    explanation: 'Prompt A provides specific context (role, company, discussion topic) and a constraint (word count), resulting in a personalized, memorable email instead of a generic one.',
    skill: 'specificity',
    skills: { prompting: 0.9, concepts: 0.2, tools: 0.1, criticalThinking: 0.2, ethics: 0.1 },
  },
  {
    id: 'battle-beg-02',
    difficulty: 'beginner',
    task: 'Get AI to suggest a dinner recipe for someone with dietary restrictions',
    promptA: {
      text: 'Give me a dinner recipe.',
      output: 'Try making spaghetti bolognese! Brown ground beef with onions and garlic, add canned tomatoes, and simmer for 30 minutes. Serve over cooked spaghetti with parmesan cheese on top.',
    },
    promptB: {
      text: 'Suggest a quick weeknight dinner recipe that is gluten-free and dairy-free. I have chicken, rice, and bell peppers on hand.',
      output: 'Try Chicken Stir-Fry Rice Bowls! Slice the chicken and bell peppers, stir-fry in sesame oil with soy sauce (use tamari for gluten-free), garlic, and ginger. Serve over steamed rice. Ready in 20 minutes and completely gluten-free and dairy-free.',
    },
    winner: 'B',
    explanation: 'Prompt B gives the AI essential context — dietary restrictions and available ingredients — so the output is immediately usable rather than a random suggestion that might not fit.',
    skill: 'context',
    skills: { prompting: 0.8, concepts: 0.3, tools: 0.1, criticalThinking: 0.2, ethics: 0.1 },
  },
  {
    id: 'battle-beg-03',
    difficulty: 'beginner',
    task: 'Get AI to write a birthday party invitation for a child',
    promptA: {
      text: 'Write a fun birthday party invitation for my daughter Emma turning 7. The party is a unicorn theme at Sunshine Park on March 22 from 2-5pm. Include RSVP by March 15.',
      output: 'You\'re Invited to a Magical Unicorn Party! Come celebrate Emma\'s 7th birthday! Join us for enchanted games, rainbow treats, and unicorn fun at Sunshine Park on March 22nd from 2:00-5:00 PM. Please RSVP by March 15th. We can\'t wait to see you there!',
    },
    promptB: {
      text: 'Write a party invitation.',
      output: 'You\'re Invited! Please join us for a party. We\'d love to see you there. More details to follow. Hope you can make it!',
    },
    winner: 'A',
    explanation: 'Prompt A includes constraints like the theme, location, date, time, and RSVP deadline. The AI can only include details it\'s been given — the vague prompt produces a useless invitation.',
    skill: 'constraints',
    skills: { prompting: 0.8, concepts: 0.2, tools: 0.1, criticalThinking: 0.1, ethics: 0.1 },
  },
  {
    id: 'battle-beg-04',
    difficulty: 'beginner',
    task: 'Get AI to translate casual English phrases into formal business language',
    promptA: {
      text: 'Make these phrases more professional.',
      output: 'Sure, I can help with that! Please share the phrases you\'d like me to make more professional.',
    },
    promptB: {
      text: 'Rewrite each casual phrase below into formal business English. Example: "Hey, got your email" becomes "Thank you for your correspondence." Phrases: 1) "Can\'t make it tomorrow" 2) "That idea is kinda meh" 3) "Let me loop in my boss"',
      output: '1) "I regret that I will be unable to attend tomorrow\'s meeting."\n2) "I have some reservations about this proposal and would welcome further discussion."\n3) "Allow me to include my supervisor in this conversation."',
    },
    winner: 'B',
    explanation: 'Prompt B uses a few-shot example to show the AI exactly what transformation is expected, plus provides the actual input. Prompt A gives nothing to work with.',
    skill: 'few-shot',
    skills: { prompting: 0.9, concepts: 0.2, tools: 0.1, criticalThinking: 0.1, ethics: 0.1 },
  },
  {
    id: 'battle-beg-05',
    difficulty: 'beginner',
    task: 'Get AI to help decide whether to adopt a dog or a cat',
    promptA: {
      text: 'Should I get a dog or a cat? I live in a small apartment, work 9-5, and have never owned a pet. Think through the pros and cons step by step before giving a recommendation.',
      output: 'Let me think through this. First, space: cats adapt well to small apartments while dogs need more room and outdoor walks. Second, your schedule: dogs need midday walks and attention, which is hard with a 9-5 job, while cats are more independent. Third, experience: cats are generally easier for first-time owners. Considering all three factors, a cat would likely be the better fit for your situation.',
    },
    promptB: {
      text: 'Dog or cat?',
      output: 'Both are great pets! Dogs are loyal and playful, while cats are independent and low-maintenance. It really depends on your lifestyle and preferences.',
    },
    winner: 'A',
    explanation: 'Prompt A asks the AI to reason step by step (chain-of-thought) through the decision using personal context, producing a structured, personalized recommendation instead of a generic non-answer.',
    skill: 'chain-of-thought',
    skills: { prompting: 0.8, concepts: 0.3, tools: 0.1, criticalThinking: 0.3, ethics: 0.1 },
  },
];
